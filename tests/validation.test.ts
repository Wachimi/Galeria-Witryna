import assert from "node:assert/strict";
import test from "node:test";
import { artistSchema, artworkSchema } from "../src/lib/validation.ts";

const artist = {
  id: "",
  name: "Jan Kowalski",
  slug: "jan-kowalski",
  biography: "Opis artysty do katalogu galerii.",
  status: "draft",
};
const artwork = {
  id: "",
  title: "Pejzaż",
  slug: "pejzaz",
  artist_id: "10000000-0000-4000-8000-000000000001",
  category: "malarstwo",
  technique: "olej, płótno",
  dimensions: "50 × 70 cm",
  year: "",
  description: "Opis pracy do katalogu galerii.",
  image_alt: "Drzewa na tle nieba",
  availability: "unknown",
  status: "draft",
};

test("odrzuca adresy zawierające ścieżki, polskie znaki i podwójne myślniki", () => {
  for (const slug of ["../panel", "jan/kowalski", "łukasz", "jan--kowalski", "Jan-Kowalski"]) {
    assert.equal(artistSchema.safeParse({ ...artist, slug }).success, false);
  }
});

test("rok jest opcjonalny, ale podana wartość musi być poprawna", () => {
  assert.equal(artworkSchema.parse(artwork).year, null);
  assert.equal(artworkSchema.parse({ ...artwork, year: "2024" }).year, 2024);
  for (const year of ["abc", "2024.5", "0", "9999"])
    assert.equal(artworkSchema.safeParse({ ...artwork, year }).success, false);
});

test("formularz pracy wymaga artysty i tekstu alternatywnego", () => {
  assert.equal(artworkSchema.safeParse({ ...artwork, artist_id: "" }).success, false);
  assert.equal(artworkSchema.safeParse({ ...artwork, image_alt: "" }).success, false);
});

test("formularze nie pozwalają przemycić uprawnień ani ścieżki zdjęcia", () => {
  const parsedArtist = artistSchema.parse({ ...artist, role: "admin" });
  const parsedWork = artworkSchema.parse({
    ...artwork,
    image_path: "https://example.com/file.svg",
  });
  assert.equal("role" in parsedArtist, false);
  assert.equal("image_path" in parsedWork, false);
});
