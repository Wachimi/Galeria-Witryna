import { matchesSearchText } from "./search.ts";

export type ArtistSortOrder = "asc" | "desc";

const collator = new Intl.Collator("pl", { sensitivity: "base" });

/** W obecnym katalogu nazwisko jest ostatnim członem; pseudonimy sortujemy w całości. */
function surname(name: string) {
  return name.trim().split(/\s+/).at(-1) ?? name;
}

export function filterAndSortArtists<T extends { name: string }>(
  artists: readonly T[],
  query: string,
  order: ArtistSortOrder,
): T[] {
  const direction = order === "asc" ? 1 : -1;
  return artists
    .filter((artist) => matchesSearchText(artist.name, query))
    .sort(
      (a, b) =>
        direction *
        (collator.compare(surname(a.name), surname(b.name)) || collator.compare(a.name, b.name)),
    );
}
