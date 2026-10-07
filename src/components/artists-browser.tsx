"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { filterAndSortArtists, type ArtistSortOrder } from "@/lib/artist-search";
import { formatPolishText } from "@/lib/typography";
import { ArtistAvatar } from "@/components/artist-avatar";

type ArtistListItem = {
  id: string;
  slug: string;
  name: string;
  portrait: string | null;
  image: { src: string; alt: string } | null;
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
                {artist.image ? (
                  <div className="artist-card-image">
                    <Image
                      src={artist.image.src}
                      alt={artist.image.alt}
                      fill
                      sizes="(max-width: 800px) 50vw, (max-width: 1100px) 33vw, 25vw"
                      unoptimized={!artist.image.src.startsWith("/")}
                    />
                  </div>
                ) : (
                  <div className="artist-card-initials" aria-hidden="true">
                    {artist.name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                )}
                <div className="artist-card-identity">
                  <ArtistAvatar src={artist.portrait} name={artist.name} decorative />
                  <h2>{formatPolishText(artist.name)}</h2>
                </div>
                <span className="text-link">
                  Poznaj artystę <ArrowUpRight size={16} aria-hidden="true" />
                </span>
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
