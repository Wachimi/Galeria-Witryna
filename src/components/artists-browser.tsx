"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { filterAndSortArtists, type ArtistSortOrder } from "@/lib/artist-search";
import { formatPolishText } from "@/lib/typography";
import { ArtistAvatar } from "@/components/artist-avatar";

type ArtistListItem = {
  id: string;
  slug: string;
  name: string;
  portrait: string | null;
};

export function ArtistsBrowser({ artists }: { artists: ArtistListItem[] }) {
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<ArtistSortOrder>("asc");
  const filtered = filterAndSortArtists(artists, query, order);

  return (
    <>
      <div className="catalog-toolbar artist-toolbar">
        <label className="catalog-search">
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            aria-label="Szukaj artysty po imieniu lub nazwisku"
            placeholder="Imię lub nazwisko artysty…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label className="artist-sort">
          Sortuj:
          <select
            aria-label="Sortuj artystów"
            value={order}
            onChange={(event) => setOrder(event.target.value as ArtistSortOrder)}
          >
            <option value="asc">Nazwisko: A–Z</option>
            <option value="desc">Nazwisko: Z–A</option>
          </select>
        </label>
      </div>
      <p className="results-count" aria-live="polite" aria-atomic="true">
        Liczba artystów: {filtered.length}
      </p>
      {filtered.length ? (
        <div className="artist-grid">
          {filtered.map((artist) => (
            <article className="artist-card" key={artist.id}>
              <Link href={`/artysci/${artist.slug}`} className="artist-card-link">
                <div className="artist-card-identity">
                  <ArtistAvatar src={artist.portrait} name={artist.name} decorative />
                  <h2>{formatPolishText(artist.name)}</h2>
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state artist-empty-state">
          <p>
            {artists.length
              ? "Nie znaleziono artystów pasujących do wyszukiwania."
              : "Przygotowujemy prezentację artystów naszej galerii."}
          </p>
          {artists.length > 0 && (
            <button type="button" className="button button-outline" onClick={() => setQuery("")}>
              Pokaż wszystkich artystów
            </button>
          )}
        </div>
      )}
    </>
  );
}
