import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Phone, ZoomIn } from "lucide-react";
import { getCatalog } from "@/lib/catalog";
import { artworkImageUrl, artistPortraitUrl } from "@/lib/images";
import { availabilityLabels, categoryLabels } from "@/types/catalog";
import { site } from "@/data/site";
import { formatPolishText } from "@/lib/typography";
import { ArtworkImage } from "@/components/artwork-image";
import { ArtistAvatar } from "@/components/artist-avatar";
import { ArtworkCard } from "@/components/artwork-card";

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
  const related = artist
    ? artworks.filter((item) => item.artist_id === artist.id && item.id !== artwork.id).slice(0, 3)
    : [];
  const sold = artwork.availability === "sold";
  const subject = encodeURIComponent(
    `${sold ? "Zapytanie o podobne prace do" : "Zapytanie o pracę"}: ${artwork.title} — ${artist?.name ?? "Galeria Witryna"}`,
  );
  const body = encodeURIComponent(
    `Dzień dobry,\n\n${sold ? "interesują mnie prace podobne do" : "interesuje mnie praca"} „${artwork.title}”.\nAutor: ${artist?.name ?? "Artysta galerii"}\nTechnika: ${artwork.technique}\nWymiary: ${artwork.dimensions}\n\nProszę o więcej informacji.\n\n`,
  );
  return (
    <div className="container page-section artwork-page">
      <nav className="breadcrumb" aria-label="Ścieżka nawigacji">
        <Link href="/kolekcja">Kolekcja</Link>
        <span>/</span>
        <span>{formatPolishText(artwork.title)}</span>
      </nav>
      <section className="artwork-detail" aria-labelledby="artwork-title">
        <figure className="artwork-detail-visual">
          <ArtworkImage
            src={src}
            alt={artwork.image_alt}
            title={artwork.title}
            artistName={artist?.name}
          />
          <figcaption>
            <ZoomIn size={17} aria-hidden="true" />
            Kliknij obraz, aby obejrzeć go w&nbsp;powiększeniu.
          </figcaption>
        </figure>
        <div className="artwork-detail-copy">
          <p className="eyebrow">{formatPolishText(categoryLabels[artwork.category])}</p>
          <h1 id="artwork-title">{formatPolishText(artwork.title)}</h1>
          {artist && (
            <Link className="artwork-author" href={`/artysci/${artist.slug}`}>
              <ArtistAvatar
                src={artistPortraitUrl(artist.portrait_path)}
                name={artist.name}
                decorative
              />
              <span>
                <span className="artwork-author-label">Artysta</span>
                <span className="artwork-author-name">{formatPolishText(artist.name)}</span>
              </span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          )}
          <p className={`artwork-status artwork-status-${artwork.availability}`}>
            {formatPolishText(availabilityLabels[artwork.availability])}
          </p>
          <dl className="artwork-specs" aria-label="Parametry pracy">
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
          </dl>
          {artwork.description.trim() && (
            <section className="artwork-description" aria-labelledby="artwork-description-heading">
              <h2 id="artwork-description-heading">O&nbsp;pracy</h2>
              <p>{formatPolishText(artwork.description)}</p>
            </section>
          )}
          <div className="artwork-inquiry">
            <h2>Porozmawiajmy o&nbsp;sztuce.</h2>
            <p>
              {formatPolishText(
                sold
                  ? "Ta praca została sprzedana. Zapytaj nas o inne dzieła tego artysty."
                  : artwork.availability === "reserved"
                    ? "Ta praca jest zarezerwowana. Skontaktuj się z nami, aby dowiedzieć się więcej."
                    : "Z przyjemnością opowiemy więcej o tej pracy i potwierdzimy jej dostępność.",
              )}
            </p>
            <a
              className="button button-dark"
              href={`mailto:${site.email}?subject=${subject}&body=${body}`}
            >
              {sold ? "Zapytaj o\u00a0podobne prace" : "Zapytaj o\u00a0tę pracę"}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <a className="artwork-phone" href={`tel:${site.phoneHref}`}>
              <Phone size={17} aria-hidden="true" /> {site.phone}
            </a>
          </div>
        </div>
      </section>
      {related.length > 0 && artist && (
        <section className="artwork-related" aria-labelledby="related-works-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">ODKRYWAJ DALEJ</p>
              <h2 id="related-works-heading">Więcej prac artysty</h2>
            </div>
            <Link className="text-link" href={`/artysci/${artist.slug}`}>
              Poznaj artystę <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="artwork-grid">
            {related.map((item) => (
              <ArtworkCard key={item.id} artwork={item} artist={artist} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
