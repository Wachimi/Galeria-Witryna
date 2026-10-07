import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getCatalog } from "@/lib/catalog";
import { artworkImageUrl } from "@/lib/images";
import { availabilityLabels, categoryLabels } from "@/types/catalog";
import { site } from "@/data/site";
import { formatPolishText } from "@/lib/typography";
import { ArtworkImage } from "@/components/artwork-image";

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
        <span>{formatPolishText(artwork.title)}</span>
      </nav>
      <section className="artwork-detail">
        <ArtworkImage
          src={src}
          alt={artwork.image_alt}
          title={artwork.title}
          artistName={artist?.name}
          variant="detail"
        />
        <div className="artwork-detail-copy">
          <p className="eyebrow">{formatPolishText(categoryLabels[artwork.category])}</p>
          <h1>{formatPolishText(artwork.title)}</h1>
          {artist && (
            <Link className="artist-link" href={`/artysci/${artist.slug}`}>
              {formatPolishText(artist.name)}
            </Link>
          )}
          <dl className="artwork-specs">
            <div>
              <dt>Technika</dt>
              <dd>{formatPolishText(artwork.technique)}</dd>
            </div>
            <div>
              <dt>Wymiary</dt>
              <dd>{formatPolishText(artwork.dimensions)}</dd>
            </div>
            <div>
              <dt>Rok powstania</dt>
              <dd>{artwork.year ?? "Nie podano"}</dd>
            </div>
            <div>
              <dt>Dostępność</dt>
              <dd>{formatPolishText(availabilityLabels[artwork.availability])}</dd>
            </div>
          </dl>
          <p>{formatPolishText(artwork.description)}</p>
          <a className="button button-dark" href={`mailto:${site.email}?subject=${subject}`}>
            Zapytaj o&nbsp;tę pracę <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <span className="availability">
            Z&nbsp;przyjemnością opowiemy więcej i&nbsp;potwierdzimy dostępność.
          </span>
        </div>
      </section>
    </div>
  );
}
