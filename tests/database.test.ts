import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";

test("migracja, seed i RLS chronią szkice oraz role zespołu", async (context) => {
  const db = new PGlite();
  context.after(async () => {
    await db.close();
  });
  // Minimalne tabele usług Supabase; właściwa migracja i polityki są niezmienione.
  await db.exec(`
    create role anon;
    create role authenticated;
    create schema auth;
    create schema storage;
    create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}');
    create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid; $$;
    create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
    create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
    alter table storage.objects enable row level security;
    grant usage on schema public, auth, storage to anon, authenticated;
    grant select, insert, delete on storage.objects to authenticated;
  `);
  await db.exec(
    await readFile(
      new URL("../supabase/migrations/001_initial_schema.sql", import.meta.url),
      "utf8",
    ),
  );
  const portraits = await readFile(
    new URL("../supabase/migrations/20261007065759_artist_portraits.sql", import.meta.url),
    "utf8",
  );
  await db.exec(portraits);
  await db.exec(portraits);
  const seed = await readFile(new URL("../supabase/seed.sql", import.meta.url), "utf8");
  await db.exec(seed);
  await db.exec(seed);

  const adminId = "30000000-0000-4000-8000-000000000001";
  const editorId = "30000000-0000-4000-8000-000000000002";
  const viewerId = "30000000-0000-4000-8000-000000000003";
  await db.query(
    "insert into auth.users (id, email, raw_user_meta_data) values ($1, 'admin@example.com', '{}'), ($2, 'editor@example.com', '{}'), ($3, 'viewer@example.com', '{\"role\":\"admin\"}')",
    [adminId, editorId, viewerId],
  );
  await db.query("update public.profiles set role = 'admin' where id = $1", [adminId]);
  await db.query("update public.profiles set role = 'editor' where id = $1", [editorId]);

  async function asUser<T>(
    id: string | null,
    operation: (tx: Parameters<Parameters<typeof db.transaction>[0]>[0]) => Promise<T>,
  ) {
    return db.transaction(async (tx) => {
      await tx.exec(`set local role ${id ? "authenticated" : "anon"}`);
      await tx.query("select set_config('request.jwt.claim.sub', $1, true)", [id ?? ""]);
      return operation(tx);
    });
  }

  await context.test("seed można powtórzyć, a anonimowy gość widzi katalog", async () => {
    const rows = await asUser(null, (tx) => tx.query("select id from public.artworks"));
    assert.equal(rows.rows.length, 5);
  });

  await context.test("metadane nowego konta nie nadają roli administratora", async () => {
    const rows = await asUser(viewerId, (tx) =>
      tx.query<{ role: string }>("select role from public.profiles"),
    );
    assert.deepEqual(rows.rows, [{ role: "viewer" }]);
  });

  await context.test("viewer i anonimowy gość nie mogą dodawać treści", async () => {
    const sql =
      "insert into public.artists (slug, name, biography) values ('testowy', 'Testowy artysta', 'Opis testowego artysty do katalogu.')";
    await assert.rejects(
      asUser(viewerId, (tx) => tx.query(sql)),
      /row-level security/,
    );
    await assert.rejects(
      asUser(null, (tx) => tx.query(sql)),
      /permission denied/,
    );
  });

  await context.test("redaktor dodaje szkic, ale publicznie go nie widać", async () => {
    await asUser(editorId, (tx) =>
      tx.query(
        "insert into public.artists (slug, name, biography) values ('szkic-artysty', 'Artysta w szkicu', 'Opis artysty w szkicu do katalogu.')",
      ),
    );
    const publicRows = await asUser(null, (tx) =>
      tx.query("select id from public.artists where slug = 'szkic-artysty'"),
    );
    const staffRows = await asUser(editorId, (tx) =>
      tx.query("select id from public.artists where slug = 'szkic-artysty'"),
    );
    assert.equal(publicRows.rows.length, 0);
    assert.equal(staffRows.rows.length, 1);
  });

  await context.test("redaktor nie może nadać sobie roli administratora", async () => {
    const result = await asUser(editorId, (tx) =>
      tx.query("update public.profiles set role = 'admin' where id = $1 returning role", [
        editorId,
      ]),
    );
    assert.equal(result.rows.length, 0);
    const profile = await db.query<{ role: string }>(
      "select role from public.profiles where id = $1",
      [editorId],
    );
    assert.equal(profile.rows[0].role, "editor");
  });

  await context.test("administrator może nadać dostęp redaktorowi", async () => {
    await asUser(adminId, (tx) =>
      tx.query("update public.profiles set role = 'editor' where id = $1", [viewerId]),
    );
    const profile = await db.query<{ role: string }>(
      "select role from public.profiles where id = $1",
      [viewerId],
    );
    assert.equal(profile.rows[0].role, "editor");
  });

  await context.test("wycofanie profilu artysty ukrywa wszystkie jego prace", async () => {
    await asUser(editorId, (tx) =>
      tx.query("update public.artists set status = 'draft' where slug = 'piotr-fafrowicz'"),
    );
    const publicWorks = await asUser(null, (tx) => tx.query("select id from public.artworks"));
    const staffWorks = await asUser(editorId, (tx) => tx.query("select id from public.artworks"));
    assert.equal(publicWorks.rows.length, 3);
    assert.equal(staffWorks.rows.length, 5);
  });

  await context.test("zdjęcia może przesyłać tylko redakcja do wskazanego magazynu", async () => {
    const sql = "insert into storage.objects (bucket_id, name) values ($1, $2)";
    const name = "40000000-0000-4000-8000-000000000001.jpg";
    await asUser(editorId, (tx) => tx.query(sql, ["artworks", name]));
    await assert.rejects(
      asUser(editorId, (tx) => tx.query(sql, ["inny-bucket", name])),
      /row-level security/,
    );
    await assert.rejects(
      asUser(editorId, (tx) => tx.query(sql, ["artworks", "../plik.svg"])),
      /row-level security/,
    );
    await assert.rejects(
      asUser(null, (tx) => tx.query(sql, ["artworks", name])),
      /permission denied/,
    );
  });

  await context.test("portret należy do artysty, a używanego pliku nie można usunąć", async () => {
    await db.query("update public.profiles set role = 'viewer' where id = $1", [viewerId]);
    const artistId = "10000000-0000-4000-8000-000000000001";
    const path = `${artistId}/40000000-0000-4000-8000-000000000010.jpg`;
    const insert = "insert into storage.objects (bucket_id, name) values ('artist-portraits', $1)";
    await assert.rejects(
      asUser(viewerId, (tx) => tx.query(insert, [path])),
      /row-level security/,
    );
    await assert.rejects(
      asUser(null, (tx) => tx.query(insert, [path])),
      /permission denied/,
    );
    await assert.rejects(
      asUser(editorId, (tx) => tx.query(insert, ["../obcy.svg"])),
      /row-level security/,
    );
    await asUser(editorId, (tx) => tx.query(insert, [path]));
    await asUser(editorId, (tx) =>
      tx.query("update public.artists set portrait_path = $1 where id = $2", [path, artistId]),
    );
    await assert.rejects(
      asUser(editorId, (tx) =>
        tx.query("update public.artists set portrait_path = $1 where slug = 'jerzy-tyburski'", [
          path,
        ]),
      ),
      /check constraint/,
    );
    const publicRows = await asUser(null, (tx) =>
      tx.query<{ portrait_path: string }>(
        "select portrait_path from public.artists where id = $1",
        [artistId],
      ),
    );
    assert.equal(publicRows.rows[0].portrait_path, path);
    const inUse = await asUser(editorId, (tx) =>
      tx.query("delete from storage.objects where name = $1 returning id", [path]),
    );
    assert.equal(inUse.rows.length, 0);
    await asUser(editorId, (tx) =>
      tx.query("update public.artists set portrait_path = null where id = $1", [artistId]),
    );
    const removed = await asUser(editorId, (tx) =>
      tx.query("delete from storage.objects where name = $1 returning id", [path]),
    );
    assert.equal(removed.rows.length, 1);
  });
});
