import { artistSchema } from "../../src/lib/validation.ts";

const normalizeName = (value) =>
  value
    .toLocaleLowerCase("pl")
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9]/g, "");

/** Plan importu chroni ręczne zmiany, identyfikatory i powiązania z pracami. */
export function planArtistImport(dataset, existing) {
  const slugs = new Set();
  const inserts = [];
  const updates = [];
  const preserved = [];
  if (dataset.artists.length !== dataset.totalSourceArtists - 1) {
    throw new Error("Niekompletny zestaw artystów do importu.");
  }
  for (const artist of dataset.artists) {
    artistSchema.parse({ id: "", ...artist });
    if (slugs.has(artist.slug) || artist.slug === dataset.heldOut.slug) {
      throw new Error(`Powtórzony lub odłożony profil: ${artist.slug}`);
    }
    slugs.add(artist.slug);
    if (!artist.sourceUrls.includes(artist.source_url) && artist.slug !== "tadeusz-kuduk") {
      throw new Error(`Niepotwierdzone źródło: ${artist.slug}`);
    }
    const record = Object.fromEntries(
      ["slug", "name", "biography", "status", "source_url"].map((key) => [key, artist[key]]),
    );
    const matches = existing.filter(
      (item) =>
        item.slug === artist.slug ||
        normalizeName(item.name) === normalizeName(artist.name) ||
        (item.source_url && artist.sourceUrls.includes(item.source_url)),
    );
    if (matches.length > 1)
      throw new Error(
        `W bazie są zdublowane profile: ${artist.name}. Import przerwany przed zapisem.`,
      );
    const current = matches[0];
    if (!current) {
      inserts.push(record);
      continue;
    }
    if (
      current.biography === dataset.seedBiographies[artist.slug] &&
      current.biography !== artist.biography
    ) {
      updates.push({
        id: current.id,
        expectedBiography: current.biography,
        record: { biography: artist.biography, source_url: artist.source_url },
      });
    } else {
      preserved.push({ name: current.name, slug: current.slug });
    }
  }
  return { inserts, updates, preserved };
}
