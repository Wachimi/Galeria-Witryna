"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { formatPolishText } from "@/lib/typography";
import { ZoomablePreviewImage } from "@/components/zoomable-preview-image";

export function ArtworkImage({
  src,
  alt,
  title,
  artistName,
}: {
  src: string;
  alt: string;
  title: string;
  artistName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

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
        className="artwork-image-trigger artwork-detail-image"
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
          sizes="(max-width: 800px) 100vw, 55vw"
          loading="eager"
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
          if (event.key === "Tab") {
            const buttons =
              event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)");
            const first = buttons[0];
            const last = buttons[buttons.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first?.focus();
            }
          }
        }}
      >
        <div className="photo-preview-toolbar">
          <div className="artwork-preview-caption">
            <p>{formatPolishText(title)}</p>
            {artistName && <span>{formatPolishText(artistName)}</span>}
          </div>
          <button
            type="button"
            className="photo-preview-button"
            aria-label="Zamknij podgląd"
            onClick={() => dialogRef.current?.close()}
            autoFocus
          >
            <X size={26} aria-hidden="true" />
          </button>
        </div>
        {open && (
          <ZoomablePreviewImage
            src={src}
            alt={alt}
            width={size?.width ?? 1800}
            height={size?.height ?? 1800}
            onBackdropClick={() => dialogRef.current?.close()}
          />
        )}
      </dialog>
    </>
  );
}
