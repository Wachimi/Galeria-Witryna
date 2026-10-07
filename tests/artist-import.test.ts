import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { planArtistImport } from "../scripts/lib/artist-import.mjs";

type ImportDataset = Omit<
  typeof import("../supabase/imports/artists-2026-10-07.json"),
  "seedBiographies"
> & { seedBiographies: Record<string, string> };

const dataset = JSON.parse(
  await readFile(new URL("../supabase/imports/artists-2026-10-07.json", import.meta.url), "utf8"),
) as ImportDataset;

test("import obejmuje cały katalog, łączy dwa działy Góreckiego i pomija artystę do próby", () => {
  const plan = planArtistImport(dataset, []);
  assert.equal(dataset.totalSourceArtists, 96);
  assert.equal(plan.inserts.length, 95);
  assert.equal(plan.inserts.filter((item) => item.slug === "wojciech-gorecki").length, 1);
  assert.equal(
    plan.inserts.some((item) => item.slug === "robert-zybura"),
    false,
  );
  assert.equal(dataset.heldOut.hasBiography, true);
  assert.ok(dataset.artists.find((item) => item.slug === "grazyna-grabowska"));
  assert.equal(dataset.artists.filter((item) => !item.hasBiography).length, 11);
  for (const artist of dataset.artists) {
    assert.doesNotMatch(artist.biography, /\[caption|SONY DSC|<[^>]+>|a href=/);
  }
});

test("import uzupełnia tylko biografie startowe i zachowuje ręcznie zmienione profile", () => {
  const artist = dataset.artists.find((item) => item.slug === "marek-andala");
  assert.ok(artist);
  const existing = {
    ...artist,
    id: "10000000-0000-4000-8000-000000000001",
    status: "draft",
    biography: dataset.seedBiographies[artist.slug],
  };
  const plan = planArtistImport(dataset, [existing]);
  assert.equal(plan.updates.length, 1);
  assert.equal(plan.updates[0].id, existing.id);
  assert.equal("status" in plan.updates[0].record, false);
  const edited = { ...existing, biography: "Biografia poprawiona ręcznie przez redaktora." };
  const safePlan = planArtistImport(dataset, [edited]);
  assert.equal(safePlan.updates.length, 0);
  assert.equal(safePlan.inserts.length, 94);
  assert.equal(safePlan.preserved.length, 1);
});

test("powtórzenie importu nie zapisuje niczego i rozpoznaje zmieniony adres profilu", () => {
  const existing = dataset.artists.map((item, index) => ({ ...item, id: `existing-${index}` }));
  existing[0].slug = "adres-zmieniony-przez-redaktora";
  const plan = planArtistImport(dataset, existing);
  assert.equal(plan.inserts.length, 0);
  assert.equal(plan.updates.length, 0);
  assert.equal(plan.preserved.length, 95);
});

test("niejednoznaczne profile w bazie zatrzymują cały import przed zapisem", () => {
  const artist = dataset.artists[0];
  assert.throws(
    () =>
      planArtistImport(dataset, [
        { ...artist, id: "a" },
        { ...artist, id: "b", slug: "inny-adres" },
      ]),
    /zdublowane profile/,
  );
});
