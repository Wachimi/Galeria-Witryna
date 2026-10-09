import { filterAndSortArtists, type ArtistSortOrder } from "./artist-search.ts";
import { matchesSearchText } from "./search.ts";
import type { Artist, Artwork, ArtworkCategory, Catalog } from "../types/catalog.ts";

export type CollectionFilters = {
  category: ArtworkCategory | "all";
  artist: string;
  query: string;
  order: ArtistSortOrder;
};
export type CollectionGroup = { artist?: Artist; artworks: Artwork[] };

const collator = new Intl.Collator("pl", { sensitivity: "base" });

export function collectionArtists(catalog: Catalog): Artist[] {
  const artistIds = new Set(catalog.artworks.map((artwork) => artwork.artist_id));
  return filterAndSortArtists(
    catalog.artists.filter((artist) => artistIds.has(artist.id)),
    "",
    "asc",
  );
}

export function filterCollection(catalog: Catalog, filters: CollectionFilters): CollectionGroup[] {
  const artists = new Map(catalog.artists.map((artist) => [artist.id, artist]));
  const grouped = new Map<string, Artwork[]>();

  for (const artwork of catalog.artworks) {
    const artist = artists.get(artwork.artist_id);
    if (filters.category !== "all" && artwork.category !== filters.category) continue;
    if (filters.artist && artist?.slug !== filters.artist) continue;
    if (
      !matchesSearchText(
        `${artwork.title} ${artist?.name ?? ""} ${artwork.technique}`,
        filters.query,
      )
    )
      continue;
    const group = grouped.get(artwork.artist_id) ?? [];
    group.push(artwork);
    grouped.set(artwork.artist_id, group);
  }

  const orderedArtists = filterAndSortArtists(catalog.artists, "", filters.order);
  const orderedIds = orderedArtists.map((artist) => artist.id);
  // Zachowujemy również prace bez profilu autora w otrzymanych danych.
  const remainingIds = [...grouped.keys()].filter((id) => !artists.has(id)).sort();
  return [...orderedIds, ...remainingIds].flatMap((id) => {
    const artworks = grouped.get(id);
    return artworks
      ? [
          {
            artist: artists.get(id),
            artworks: artworks.sort(
              (left, right) =>
                collator.compare(left.title, right.title) || collator.compare(left.id, right.id),
            ),
          },
        ]
      : [];
  });
}
