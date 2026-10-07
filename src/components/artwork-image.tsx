"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { formatPolishText } from "@/lib/typography";

export function ArtworkImage({
  src,
  alt,
  title,
  artistName,
  variant = "card",
}: {
  src: string;
  alt: string;
  title: string;
  artistName?: string;
  variant?: "card" | "detail";
}) {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={`artwork-image-trigger artwork-${variant}-image`}
        aria-label={formatPolishText(`Powiększ pracę: ${title}`)}
        aria-haspopup="dialog"
        onClick={() => {
          if (!dialogRef.current || dialogRef.current.open) return;
          setOpen(true);
          dialogRef.current.showModal();
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={
            variant === "detail"
              ? "(max-width: 800px) 100vw, 55vw"
              : "(max-width: 520px) 100vw, (max-width: 800px) 50vw, 33vw"
          }
          loading={variant === "detail" ? "eager" : "lazy"}
          unoptimized={!src.startsWith("/")}
          onLoad={(event) => {
            const image = event.currentTarget;
            setSize({ width: image.naturalWidth, height: image.naturalHeight });
          }}
        />
        <span className="artwork-image-zoom" aria-hidden="true">
          <ZoomIn size={20} />
        </span>
      </button>
      <dialog
        ref={dialogRef}
        className="photo-preview artwork-preview"
        aria-label="Podgląd pracy"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
        onKeyDown={(event) => {
          // Podgląd ma jeden przycisk; Tab pozostaje wewnątrz okna.
          if (event.key === "Tab") {
            event.preventDefault();
            closeRef.current?.focus();
          }
        }}
      >
        <div className="photo-preview-toolbar">
          <div className="artwork-preview-caption">
            <p>{formatPolishText(title)}</p>
            {artistName && <span>{formatPolishText(artistName)}</span>}
          </div>
          <button
            ref={closeRef}
            type="button"
            className="photo-preview-button"
            aria-label="Zamknij podgląd"
            onClick={() => dialogRef.current?.close()}
            autoFocus
          >
            <X size={26} aria-hidden="true" />
          </button>
        </div>
        <div
          className="photo-preview-stage"
          onClick={(event) => {
            if (event.target === event.currentTarget) dialogRef.current?.close();
          }}
        >
          {open && (
            <Image
              src={src}
              alt={alt}
              width={size?.width ?? 1800}
              height={size?.height ?? 1800}
              className="photo-preview-image"
              unoptimized
              loading="eager"
            />
          )}
        </div>
      </dialog>
    </>
  );
}
