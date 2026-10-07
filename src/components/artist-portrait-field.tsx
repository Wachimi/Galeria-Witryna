"use client";

import { useEffect, useRef, useState } from "react";
import { ArtistAvatar } from "@/components/artist-avatar";

export function ArtistPortraitField({
  currentSrc,
  name,
  disabled,
}: {
  currentSrc: string | null;
  name: string;
  disabled: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [remove, setRemove] = useState(false);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  useEffect(() => {
    const form = input.current?.form;
    const reset = () => {
      setPreview(null);
      setRemove(false);
    };
    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, []);
  return (
    <fieldset className="artist-portrait-field full-width" disabled={disabled}>
      <legend>Zdjęcie profilowe (opcjonalnie)</legend>
      <div className="artist-portrait-editor">
        <ArtistAvatar
          src={preview ?? (remove ? null : currentSrc)}
          name={name}
          className="artist-avatar-preview"
        />
        <div className="artist-portrait-controls">
          <label className="form-field">
            Dodaj lub zmień zdjęcie profilowe
            <input
              ref={input}
              name="portrait"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setPreview(file ? URL.createObjectURL(file) : null);
                if (file) setRemove(false);
              }}
            />
            <small>
              JPG, PNG lub WebP, maksymalnie 5 MB. Portret pojawi się przy nazwisku
              i&nbsp;w&nbsp;szczegółach artysty.
            </small>
          </label>
          <input type="hidden" name="remove_portrait" value={remove ? "on" : ""} />
          {(preview || (currentSrc && !remove)) && (
            <button
              type="button"
              className="portrait-remove"
              onClick={() => {
                if (input.current) input.current.value = "";
                setPreview(null);
                setRemove(!!currentSrc);
              }}
            >
              Usuń zdjęcie profilowe
            </button>
          )}
          {remove && (
            <p className="portrait-removal-note">
              Zdjęcie zostanie usunięte po zapisaniu profilu.{" "}
              <button type="button" className="portrait-remove" onClick={() => setRemove(false)}>
                Cofnij usunięcie
              </button>
            </p>
          )}
        </div>
      </div>
    </fieldset>
  );
}
