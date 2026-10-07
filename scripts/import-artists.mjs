import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { planArtistImport } from "./lib/artist-import.mjs";

// Ten skrypt jest lokalnym narzędziem migracji; nie jest częścią aplikacji webowej.
nextEnv.loadEnvConfig(process.cwd());
const args = process.argv.slice(2);
if (args.some((arg) => arg !== "--apply"))
  throw new Error("Użycie: npm run import:artists -- [--apply]");
const dataset = JSON.parse(
  await readFile(new URL("../supabase/imports/artists-2026-10-07.json", import.meta.url), "utf8"),
);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
if (!url || !secret?.startsWith("sb_secret_") || secret !== secret.trim()) {
  throw new Error(
    "Uzupełnij NEXT_PUBLIC_SUPABASE_URL i SUPABASE_SECRET_KEY w .env.local. Klucz musi zaczynać się od sb_secret_.",
  );
}
const client = createClient(url, secret, {
  auth: { persistSession: false, autoRefreshToken: false },
});
async function readTable(table) {
  const { data, error } = await client.from(table).select("*").order("id");
  if (error) throw new Error(`Nie udało się odczytać tabeli ${table} (${error.code}).`);
  return data;
}
const before = await readTable("artists");
const worksBefore = await readTable("artworks");
const plan = planArtistImport(dataset, before);
console.log(
  JSON.stringify(
    {
      mode: args.includes("--apply") ? "zapis" : "podgląd",
      profilesInSource: dataset.totalSourceArtists,
      profilesToImport: dataset.artists.length,
      insert: plan.inserts.length,
      updateStarterBiographies: plan.updates.length,
      preserved: plan.preserved.length,
      heldOut: dataset.heldOut.name,
    },
    null,
    2,
  ),
);
if (args.includes("--apply")) {
  const backup = `.tmp/artist-import-${new Date().toISOString().replace(/[:.]/g, "-")}`;
  await mkdir(backup, { recursive: true });
  await writeFile(
    `${backup}/before.json`,
    JSON.stringify({ artists: before, artworks: worksBefore }, null, 2),
  );
  // Pojedynczy zapis nowych profili. Powtórzenie nie zastępuje istniejących danych.
  if (plan.inserts.length) {
    const { error } = await client
      .from("artists")
      .upsert(plan.inserts, { onConflict: "slug", ignoreDuplicates: true });
    if (error)
      throw new Error(`Nie udało się zapisać nowych profili (${error.code}). Kopia: ${backup}`);
  }
  for (const update of plan.updates) {
    const { error } = await client
      .from("artists")
      .update(update.record)
      .eq("id", update.id)
      .eq("biography", update.expectedBiography);
    if (error)
      throw new Error(`Nie udało się uzupełnić biografii (${error.code}). Kopia: ${backup}`);
  }
  const after = await readTable("artists");
  const worksAfter = await readTable("artworks");
  assert.deepEqual(worksAfter, worksBefore, "Import zmienił prace lub ich powiązania.");
  for (const existing of before) {
    const saved = after.find((item) => item.id === existing.id);
    assert.ok(saved, `Brak istniejącego profilu: ${existing.name}`);
    assert.equal(saved.slug, existing.slug);
    assert.equal(saved.status, existing.status);
    if (!plan.updates.some((update) => update.id === existing.id))
      assert.deepEqual(saved, existing);
  }
  for (const artist of dataset.artists) {
    assert.ok(
      after.some((item) => item.slug === artist.slug || normalizeMatch(item, artist)),
      `Nie przeniesiono profilu: ${artist.name}`,
    );
  }
  const repeat = planArtistImport(dataset, after);
  assert.equal(repeat.inserts.length, 0, "Powtórzenie utworzyłoby duplikaty.");
  assert.equal(repeat.updates.length, 0, "Nie wszystkie biografie zostały zapisane.");
  assert.equal(
    after.some((item) => item.slug === dataset.heldOut.slug),
    before.some((item) => item.slug === dataset.heldOut.slug),
    "Dodano profil przeznaczony do testu ręcznego.",
  );
  await writeFile(
    `${backup}/after.json`,
    JSON.stringify({ artists: after, artworks: worksAfter }, null, 2),
  );
  console.log(
    JSON.stringify(
      {
        verifiedProfiles: after.length,
        unchangedArtworks: worksAfter.length,
        repeatImportCreates: repeat.inserts.length,
        backup,
      },
      null,
      2,
    ),
  );
}

function normalizeMatch(existing, artist) {
  return (
    existing.name === artist.name ||
    (existing.source_url && artist.sourceUrls.includes(existing.source_url))
  );
}
