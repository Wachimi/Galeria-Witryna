import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { artworkImageUrl } from "@/lib/images";
import type { Artist, Artwork } from "@/types/catalog";
import { formatPolishText } from "@/lib/typography";

export function ArtworkCard({ artwork, artist }: { artwork: Artwork; artist?: Artist }) {
  const src = artworkImageUrl(artwork.image_path);
  return (
    <article className="artwork-card">
      <Link
        href={`/kolekcja/${artwork.slug}`}
        className="artwork-card-image artwork-card-image-link"
        aria-label={formatPolishText(`Zobacz szczegóły pracy: ${artwork.title}`)}
      >
        <Image
          src={src}
          alt={artwork.image_alt}
          fill
          sizes="(max-width: 520px) 100vw, (max-width: 800px) 50vw, 33vw"
          unoptimized={!src.startsWith("/")}
        />
      </Link>
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
