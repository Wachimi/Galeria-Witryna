"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowUpRight, Search, X } from "lucide-react";
import { ArtworkCard } from "@/components/artwork-card";
import { ArtistAvatar } from "@/components/artist-avatar";
import { collectionArtists, filterCollection } from "@/lib/collection-search";
import { artistPortraitUrl } from "@/lib/images";
import { categoryLabels, type ArtworkCategory, type Catalog } from "@/types/catalog";
import { formatPolishText } from "@/lib/typography";

export function CatalogBrowser({ catalog }: { catalog: Catalog }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const categoryParam = searchParams.get("category");
  const category =
    categoryParam && Object.hasOwn(categoryLabels, categoryParam)
      ? (categoryParam as ArtworkCategory)
      : "all";
  const query = searchParams.get("q") ?? "";
  const artistSlug = searchParams.get("artist") ?? "";
  const availableArtists = collectionArtists(catalog);
  const selectedArtist = availableArtists.find((artist) => artist.slug === artistSlug);
  const order = searchParams.get("sort") === "desc" ? "desc" : "asc";
  const groups = filterCollection(catalog, { category, query, artist: artistSlug, order });
  const count = groups.reduce((total, group) => total + group.artworks.length, 0);
  const hasFilters = category !== "all" || !!query || !!artistSlug;

  function updateFilters(values: Record<string, string>) {
    const params = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(values)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    const search = params.toString();
    window.history.replaceState(
      null,
      "",
      `${pathname}${search ? `?${search}` : ""}${window.location.hash}`,
    );
  }

  function resetFilters() {
    updateFilters({ category: "", artist: "", q: "", sort: "" });
  }

  return (
    <>
      <div className="collection-toolbar">
        <div className="filter-tabs" role="group" aria-label="Dziedzina sztuki">
          <button
            type="button"
            aria-pressed={category === "all"}
            onClick={() => updateFilters({ category: "" })}
          >
            Wszystkie
          </button>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={category === key}
              onClick={() => updateFilters({ category: key })}
            >
              {formatPolishText(label)}
            </button>
          ))}
        </div>
        <div className="collection-controls">
          <label className="collection-search-field">
            <span>Szukaj w&nbsp;kolekcji</span>
            <span className="catalog-search">
              <Search size={18} aria-hidden="true" />
              <input
                aria-label="Szukaj pracy lub artysty"
                placeholder="Tytuł, artysta lub technika…"
                value={query}
                onChange={(event) => updateFilters({ q: event.target.value })}
                type="search"
              />
            </span>
          </label>
          <label className="collection-select">
            Artysta
            <select
              aria-label="Wybierz artystę"
              value={artistSlug}
              onChange={(event) => updateFilters({ artist: event.target.value })}
            >
              <option value="">Wszyscy artyści</option>
              {artistSlug && !selectedArtist && (
                <option value={artistSlug}>Artysta bez prac w&nbsp;kolekcji</option>
              )}
              {availableArtists.map((artist) => (
                <option key={artist.id} value={artist.slug}>
                  {formatPolishText(artist.name)}
                </option>
              ))}
            </select>
          </label>
          <label className="collection-select">
            Kolejność artystów
            <select
              aria-label="Sortuj prace według artystów"
              value={order}
              onChange={(event) =>
                updateFilters({ sort: event.target.value === "asc" ? "" : "desc" })
              }
            >
              <option value="asc">Nazwisko: A–Z</option>
              <option value="desc">Nazwisko: Z–A</option>
            </select>
          </label>
        </div>
      </div>
      <div className="collection-summary">
        <p className="results-count" aria-live="polite" aria-atomic="true">
          Liczba prac: {count}
        </p>
        {hasFilters && (
          <button type="button" className="collection-reset" onClick={resetFilters}>
            Wyczyść filtry <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>
      {groups.length ? (
        <div className="collection-groups">
          {groups.map(({ artist, artworks }) => (
            <section
              className="collection-artist-group"
              key={artworks[0].artist_id}
              aria-labelledby={`collection-artist-${artworks[0].artist_id}`}
            >
              <div className="collection-artist-heading">
                <div className="collection-artist-identity">
                  {artist && (
                    <ArtistAvatar
                      src={artistPortraitUrl(artist.portrait_path)}
                      name={artist.name}
                      decorative
                    />
                  )}
                  <h2 id={`collection-artist-${artworks[0].artist_id}`}>
                    {artist ? (
                      <Link href={`/artysci/${artist.slug}`}>{formatPolishText(artist.name)}</Link>
                    ) : (
                      "Artysta galerii"
                    )}
                  </h2>
                </div>
                {artist && (
                  <Link className="text-link" href={`/artysci/${artist.slug}`}>
                    Poznaj artystę <ArrowUpRight size={17} aria-hidden="true" />
                  </Link>
                )}
              </div>
              <div className="artwork-grid">
                {artworks.map((artwork) => (
                  <ArtworkCard artwork={artwork} artist={artist} key={artwork.id} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="empty-state collection-empty-state">
          <p>
            {catalog.artworks.length
              ? "Brak prac pasujących do wybranych kryteriów."
              : "Przygotowujemy kolekcję prac naszej galerii."}
          </p>
          {catalog.artworks.length > 0 && (
            <>
              <p>Wybierz innego artystę, inną dziedzinę lub zmień wyszukiwanie.</p>
              <button className="button button-outline" type="button" onClick={resetFilters}>
                Pokaż wszystkie prace
              </button>
            </>
          )}
          <Link href="/artysci" className="text-link">
            Poznaj wszystkich artystów <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      )}
    </>
  );
}
