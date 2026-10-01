import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { artworkImageUrl } from "@/lib/images";
import type { Artist, Artwork } from "@/types/catalog";

export function ArtworkCard({ artwork, artist }: { artwork: Artwork; artist?: Artist }) {
  const src = artworkImageUrl(artwork.image_path);
  return (
    <Link href={`/kolekcja/${artwork.slug}`} className="artwork-card">
      <div className="artwork-card-image">
        <Image
          src={src}
          alt={artwork.image_alt}
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
          unoptimized={!src.startsWith("/")}
        />
        <span className="artwork-card-arrow">
          <ArrowUpRight size={20} aria-hidden="true" />
        </span>
      </div>
      <div className="artwork-card-caption">
        <p>{artist?.name ?? "Artysta galerii"}</p>
        <h3>{artwork.title}</h3>
        <span>
          {artwork.technique} · {artwork.dimensions}
        </span>
      </div>
    </Link>
  );
}
