"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Exhibition } from "@/data/exhibitions";

export function ExhibitionGallery({ photos }: { photos: Exhibition["photos"] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const activePhoto = photos[activeIndex];

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Zamknięcie podglądu i opuszczenie podstrony przywracają przewijanie.
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  function openPreview(index: number) {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setActiveIndex(index);
    setIsOpen(true);
    dialog.showModal();
  }

  function changePhoto(direction: number) {
    setActiveIndex((index) => (index + direction + photos.length) % photos.length);
  }

  if (!activePhoto) return null;

  return (
    <>
      <div className="exhibition-gallery">
        {photos.map((photo, index) => (
          <figure key={photo.src}>
            <button
              type="button"
              className="exhibition-gallery-trigger"
              onClick={() => openPreview(index)}
              aria-label={`Powiększ zdjęcie ${index + 1}: ${photo.alt}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 800px) 100vw, 50vw"
                loading={index < 2 ? "eager" : "lazy"}
              />
            </button>
          </figure>
        ))}
      </div>
      <dialog
        ref={dialogRef}
        className="photo-preview"
        aria-label="Podgląd zdjęć wystawy"
        onClose={() => setIsOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
        onKeyDown={(event) => {
          if (event.key === "Tab") {
            const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>("button");
            const first = buttons[0];
            const last = buttons[buttons.length - 1];
            // Tab pozostaje w podglądzie również przy przejściu przez koniec listy przycisków.
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first?.focus();
            }
          }
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            changePhoto(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
      >
        <div className="photo-preview-toolbar">
          <span aria-live="polite">
            {activeIndex + 1} / {photos.length}
          </span>
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
        <div
          className="photo-preview-stage"
          onClick={(event) => {
            if (event.target === event.currentTarget) dialogRef.current?.close();
          }}
        >
          {isOpen && (
            <Image
              src={activePhoto.src}
              alt={activePhoto.alt}
              width={activePhoto.width}
              height={activePhoto.height}
              unoptimized
              loading="eager"
              className="photo-preview-image"
            />
          )}
        </div>
        {photos.length > 1 && (
          <div className="photo-preview-controls">
            <button
              type="button"
              className="photo-preview-button"
              aria-label="Poprzednie zdjęcie"
              onClick={() => changePhoto(-1)}
            >
              <ChevronLeft size={28} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="photo-preview-button"
              aria-label="Następne zdjęcie"
              onClick={() => changePhoto(1)}
            >
              <ChevronRight size={28} aria-hidden="true" />
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
