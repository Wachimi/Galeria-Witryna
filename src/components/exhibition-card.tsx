import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Exhibition } from "@/data/exhibitions";
import { formatPolishText } from "@/lib/typography";

export function ExhibitionCard({
  exhibition,
  featured = false,
}: {
  exhibition: Exhibition;
  featured?: boolean;
}) {
  const photo = exhibition.photos[exhibition.coverIndex];
  return (
    <article className={`exhibition-card${featured ? " exhibition-card-featured" : ""}`}>
      <Link href={`/wystawy/${exhibition.slug}`} className="exhibition-card-link">
        <div className="exhibition-card-image">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
            loading={featured ? "eager" : "lazy"}
          />
        </div>
        <div className="exhibition-card-copy">
          <p className="eyebrow">{formatPolishText(exhibition.discipline)}</p>
          <h2>{formatPolishText(exhibition.artist)}</h2>
          <p className="exhibition-card-title">{formatPolishText(exhibition.title)}</p>
          {exhibition.description && (
            <p className="exhibition-card-description">
              {formatPolishText(exhibition.description)}
            </p>
          )}
          <span className="text-link">
            Zobacz wystawę <ArrowUpRight size={18} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}
