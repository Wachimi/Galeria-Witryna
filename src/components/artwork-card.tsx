import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ArtworkImage } from "@/components/artwork-image";
import { artworkImageUrl } from "@/lib/images";
import type { Artist, Artwork } from "@/types/catalog";
import { formatPolishText } from "@/lib/typography";

export function ArtworkCard({ artwork, artist }: { artwork: Artwork; artist?: Artist }) {
  const src = artworkImageUrl(artwork.image_path);
  return (
    <article className="artwork-card">
      <ArtworkImage
        src={src}
        alt={artwork.image_alt}
        title={artwork.title}
        artistName={artist?.name}
      />
      <Link href={`/kolekcja/${artwork.slug}`} className="artwork-card-caption">
        <p>{formatPolishText(artist?.name ?? "Artysta galerii")}</p>
        <h3>{formatPolishText(artwork.title)}</h3>
        <span>
          {formatPolishText(artwork.technique)} · {formatPolishText(artwork.dimensions)}
        </span>
        <span className="artwork-card-link-label">
          Zobacz szczegóły <ArrowUpRight size={16} aria-hidden="true" />
        </span>
      </Link>
    </article>
  );
}
