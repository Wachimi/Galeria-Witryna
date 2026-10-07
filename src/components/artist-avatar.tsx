"use client";

import { useState } from "react";
import Image from "next/image";
import { UserRound } from "lucide-react";

export function ArtistAvatar({
  src,
  name,
  className = "",
  decorative = false,
}: {
  src: string | null;
  name: string;
  className?: string;
  decorative?: boolean;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  return (
    <span className={`artist-avatar ${className}`} aria-hidden={decorative || undefined}>
      {src && src !== failedSrc ? (
        <Image
          src={src}
          alt={decorative ? "" : `Portret: ${name}`}
          fill
          sizes="(max-width: 520px) 80px, 120px"
          unoptimized
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <UserRound aria-hidden="true" />
      )}
    </span>
  );
}
