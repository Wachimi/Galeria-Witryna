import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getCatalog } from "@/lib/catalog";
import { artworkImageUrl } from "@/lib/images";
import { availabilityLabels, categoryLabels } from "@/types/catalog";
import { site } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { artworks } = await getCatalog();
  const artwork = artworks.find((item) => item.slug === slug);
  return { title: artwork?.title ?? "Nie znaleziono pracy" };
}

export default async function ArtworkPage({ params }: Props) {
  const { slug } = await params;
  const { artists, artworks } = await getCatalog();
  const artwork = artworks.find((item) => item.slug === slug);
  if (!artwork) notFound();
  const artist = artists.find((item) => item.id === artwork.artist_id);
  const src = artworkImageUrl(artwork.image_path);
  const subject = encodeURIComponent(
    `Zapytanie o pracę: ${artwork.title} — ${artist?.name ?? "Galeria Witryna"}`,
  );
  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="Ścieżka nawigacji">
        <Link href="/kolekcja">Kolekcja</Link>
        <span>/</span>
        <span>{artwork.title}</span>
      </nav>
      <section className="artwork-detail">
        <div className="artwork-detail-image">
          <Image
            src={src}
            alt={artwork.image_alt}
            fill
            sizes="(max-width: 800px) 100vw, 55vw"
            priority
            unoptimized={!src.startsWith("/")}
          />
        </div>
        <div className="artwork-detail-copy">
          <p className="eyebrow">{categoryLabels[artwork.category]}</p>
          <h1>{artwork.title}</h1>
          {artist && (
            <Link className="artist-link" href={`/artysci/${artist.slug}`}>
              {artist.name}
            </Link>
          )}
          <dl className="artwork-specs">
            <div>
              <dt>Technika</dt>
              <dd>{artwork.technique}</dd>
            </div>
            <div>
              <dt>Wymiary</dt>
              <dd>{artwork.dimensions}</dd>
            </div>
            <div>
              <dt>Rok powstania</dt>
              <dd>{artwork.year ?? "Nie podano"}</dd>
            </div>
            <div>
              <dt>Dostępność</dt>
              <dd>{availabilityLabels[artwork.availability]}</dd>
            </div>
          </dl>
          <p>{artwork.description}</p>
          <a className="button button-dark" href={`mailto:${site.email}?subject=${subject}`}>
            Zapytaj o tę pracę <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <span className="availability">
            Z przyjemnością opowiemy więcej i potwierdzimy dostępność.
          </span>
        </div>
      </section>
    </div>
  );
}
