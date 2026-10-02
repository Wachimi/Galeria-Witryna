import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { getCatalog } from "@/lib/catalog";
import { artworkImageUrl } from "@/lib/images";
import { formatPolishText } from "@/lib/typography";

export const metadata: Metadata = { title: "Artyści" };

export default async function ArtistsPage() {
  const { artists, artworks } = await getCatalog();
  return (
    <div className="container page-section">
      <PageHeading
        eyebrow="TWÓRCY GALERII"
        title="Ludzie. Wrażliwość. Sztuka."
        description="Za każdą pracą stoi człowiek i jego sposób widzenia świata. Poznaj twórców prezentowanych w Witrynie."
      />
      <div className="artist-grid">
        {artists.map((artist) => {
          const artwork = artworks.find((item) => item.artist_id === artist.id);
          const src = artwork ? artworkImageUrl(artwork.image_path) : null;
          return (
            <article className="artist-card" key={artist.id}>
              {src && artwork ? (
                <div className="artist-card-image">
                  <Image
                    src={src}
                    alt={artwork.image_alt}
                    fill
                    sizes="(max-width: 520px) 100vw, (max-width: 800px) 50vw, 33vw"
                    unoptimized={!src.startsWith("/")}
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
              <h2>{formatPolishText(artist.name)}</h2>
              <p>{formatPolishText(artist.biography)}</p>
              <Link href={`/artysci/${artist.slug}`} className="text-link">
                Poznaj artystę <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </article>
          );
        })}
      </div>
      {!artists.length && (
        <p className="empty-state">Przygotowujemy prezentację artystów naszej galerii.</p>
      )}
    </div>
  );
}
