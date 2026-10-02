"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { ArtworkCard } from "@/components/artwork-card";
import { categoryLabels, type ArtworkCategory, type Catalog } from "@/types/catalog";
import { formatPolishText } from "@/lib/typography";

export function CatalogBrowser({ catalog }: { catalog: Catalog }) {
  const [category, setCategory] = useState<ArtworkCategory | "all">("all");
  const [query, setQuery] = useState("");
  const filtered = catalog.artworks.filter((artwork) => {
    const artist = catalog.artists.find((item) => item.id === artwork.artist_id);
    const text = `${artwork.title} ${artist?.name ?? ""} ${artwork.technique}`.toLocaleLowerCase(
      "pl",
    );
    return (
      (category === "all" || artwork.category === category) &&
      text.includes(query.trim().toLocaleLowerCase("pl"))
    );
  });
  return (
    <>
      <div className="catalog-toolbar">
        <div className="filter-tabs" role="group" aria-label="Dziedzina sztuki">
          <button
            type="button"
            aria-pressed={category === "all"}
            onClick={() => setCategory("all")}
          >
            Wszystkie
          </button>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={category === key}
              onClick={() => setCategory(key as ArtworkCategory)}
            >
              {formatPolishText(label)}
            </button>
          ))}
        </div>
        <label className="catalog-search">
          <Search size={17} aria-hidden="true" />
          <input
            aria-label="Szukaj pracy lub artysty"
            placeholder="Szukaj pracy lub artysty…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="search"
          />
        </label>
      </div>
      <p className="results-count" aria-live="polite">
        Liczba prac: {filtered.length}
      </p>
      {filtered.length ? (
        <div className="artwork-grid">
          {filtered.map((artwork) => (
            <ArtworkCard
              artwork={artwork}
              artist={catalog.artists.find((artist) => artist.id === artwork.artist_id)}
              key={artwork.id}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>Brak prac pasujących do wybranych kryteriów.</p>
          <p>Wybierz inną dziedzinę lub zmień wyszukiwanie.</p>
          <button
            className="button button-outline"
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
          >
            Pokaż wszystkie prace
          </button>
        </div>
      )}
    </>
  );
}
