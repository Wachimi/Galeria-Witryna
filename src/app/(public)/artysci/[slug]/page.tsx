import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeading } from "@/components/page-heading";
import { ArtworkCard } from "@/components/artwork-card";
import { getCatalog } from "@/lib/catalog";
import { formatPolishText } from "@/lib/typography";

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
  return (
    <div className="container page-section">
      <nav className="breadcrumb" aria-label="Ścieżka nawigacji">
        <Link href="/artysci">Artyści</Link>
        <span>/</span>
        <span>{formatPolishText(artist.name)}</span>
      </nav>
      <PageHeading eyebrow="ARTYSTA GALERII WITRYNA" title={artist.name} />
      <p className="artist-biography">{formatPolishText(artist.biography)}</p>
      <div className="section-heading">
        <h2>Prace w&nbsp;galerii</h2>
      </div>
      {selected.length ? (
        <div className="artwork-grid">
          {selected.map((artwork) => (
            <ArtworkCard artwork={artwork} artist={artist} key={artwork.id} />
          ))}
        </div>
      ) : (
        <p className="empty-state">Zapraszamy do kontaktu w&nbsp;sprawie prac tego artysty.</p>
      )}
    </div>
  );
}
