export type ArtistSortOrder = "asc" | "desc";

const collator = new Intl.Collator("pl", { sensitivity: "base" });

function normalizeSearch(value: string) {
  return value.toLocaleLowerCase("pl").normalize("NFKD").replace(/\p{M}/gu, "").replace(/ł/g, "l");
}

/** W obecnym katalogu nazwisko jest ostatnim członem; pseudonimy sortujemy w całości. */
function surname(name: string) {
  return name.trim().split(/\s+/).at(-1) ?? name;
}

export function filterAndSortArtists<T extends { name: string }>(
  artists: readonly T[],
  query: string,
  order: ArtistSortOrder,
): T[] {
  const words = normalizeSearch(query).trim().split(/\s+/).filter(Boolean);
  const direction = order === "asc" ? 1 : -1;
  return artists
    .filter((artist) => {
      const name = normalizeSearch(artist.name);
      return words.every((word) => name.includes(word));
    })
    .sort(
      (a, b) =>
        direction *
        (collator.compare(surname(a.name), surname(b.name)) || collator.compare(a.name, b.name)),
    );
}
