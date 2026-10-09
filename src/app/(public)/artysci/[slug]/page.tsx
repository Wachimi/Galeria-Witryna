import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { ArtworkCard } from "@/components/artwork-card";
import { getCatalog } from "@/lib/catalog";
import { formatPolishText } from "@/lib/typography";
import { artistPortraitUrl } from "@/lib/images";
import { ArtistAvatar } from "@/components/artist-avatar";
import { site } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { artists } = await getCatalog();
  return {
    title: artists.find((artist) => artist.slug === slug)?.name ?? "Nie znaleziono artysty",
  };
}

export default async function ArtistPage({ params }: Props) {
  const { slug } = await params;
  const { artists, artworks } = await getCatalog();
  const artist = artists.find((item) => item.slug === slug);
  if (!artist) notFound();
  const selected = artworks.filter((artwork) => artwork.artist_id === artist.id);
  const portrait = artistPortraitUrl(artist.portrait_path);
  const inquiryHref = `mailto:${site.email}?subject=${encodeURIComponent(`Zapytanie o prace: ${artist.name}`)}`;
  return (
    <div className="container page-section artist-profile-page">
      <nav className="breadcrumb" aria-label="Ścieżka nawigacji">
        <Link href="/artysci">Artyści</Link>
        <span>/</span>
        <span>{formatPolishText(artist.name)}</span>
      </nav>
      <header className="artist-profile-header">
        <div className="artist-profile-identity">
          <ArtistAvatar src={portrait} name={artist.name} className="artist-avatar-profile" />
          <PageHeading eyebrow="ARTYSTA GALERII WITRYNA" title={artist.name} />
        </div>
        <div className="artist-profile-actions">
          {selected.length > 0 && (
            <a className="button button-dark" href="#prace-artysty">
              Zobacz prace <ArrowDown size={18} aria-hidden="true" />
            </a>
          )}
          <a className="text-link" href={inquiryHref}>
            Zapytaj o&nbsp;prace artysty <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </header>
      {artist.biography.trim() && (
        <section className="artist-profile-biography" aria-labelledby="artist-biography-heading">
          <h2 id="artist-biography-heading">O&nbsp;artyście</h2>
          <p className="artist-biography">{formatPolishText(artist.biography)}</p>
        </section>
      )}
      <section
        id="prace-artysty"
        className="artist-profile-works"
        aria-labelledby="artist-works-heading"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">TWÓRCZOŚĆ</p>
            <h2 id="artist-works-heading">Prace w&nbsp;galerii</h2>
          </div>
          {selected.length > 0 && (
            <Link
              className="text-link"
              href={`/kolekcja?artist=${encodeURIComponent(artist.slug)}`}
            >
              Zobacz w&nbsp;kolekcji <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          )}
        </div>
        {selected.length ? (
          <div className="artwork-grid">
            {selected.map((artwork) => (
              <ArtworkCard artwork={artwork} artist={artist} key={artwork.id} />
            ))}
          </div>
        ) : (
          <div className="artist-profile-empty">
            <p>Zapraszamy do kontaktu w&nbsp;sprawie prac tego artysty.</p>
            <a className="button button-outline" href={inquiryHref}>
              Napisz do galerii <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
