"use client";

import { useActionState } from "react";
import Link from "next/link";
import { saveArtist, saveArtwork } from "@/app/(admin)/panel/actions";
import { initialFormState } from "@/lib/validation";
import { availabilityLabels, categoryLabels, type Artist, type Artwork } from "@/types/catalog";
import { formatPolishText } from "@/lib/typography";

export function ArtistForm({ artist }: { artist?: Artist }) {
  const [state, action, pending] = useActionState(saveArtist, initialFormState);
  return (
    <form action={action} className="editor-form">
      <input type="hidden" name="id" value={artist?.id ?? ""} />
      {state.error && (
        <p role="alert" className="notice error">
          {formatPolishText(state.error)}
        </p>
      )}
      <div className="form-grid">
        <label className="form-field">
          Imię i&nbsp;nazwisko
          <input name="name" required minLength={2} maxLength={160} defaultValue={artist?.name} />
        </label>
        <label className="form-field">
          Adres strony (slug)
          <input
            name="slug"
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            minLength={2}
            maxLength={120}
            placeholder="jan-kowalski"
            defaultValue={artist?.slug}
          />
          <small>Małe litery bez polskich znaków i&nbsp;spacji. Adres: /artysci/wybrany-slug</small>
        </label>
        <label className="form-field full-width">
          Biografia / opis
          <textarea
            name="biography"
            required
            minLength={10}
            maxLength={10000}
            defaultValue={artist?.biography}
            rows={7}
          />
        </label>
        <label className="form-field">
          Publikacja
          <select name="status" defaultValue={artist?.status ?? "draft"}>
            <option value="draft">Szkic</option>
            <option value="published">Opublikowany</option>
          </select>
          <small>Zmiana na szkic ukrywa też prace artysty na stronie.</small>
        </label>
      </div>
      <div className="form-actions">
        <button className="button button-dark" disabled={pending} type="submit">
          {pending ? "Zapisywanie…" : "Zapisz artystę"}
        </button>
        <Link href="/panel/artysci" className="text-link">
          Wróć do listy
        </Link>
      </div>
    </form>
  );
}

export function ArtworkForm({ artists, artwork }: { artists: Artist[]; artwork?: Artwork }) {
  const [state, action, pending] = useActionState(saveArtwork, initialFormState);
  if (!artists.length)
    return (
      <div className="empty-state">
        <p>Najpierw dodaj artystę, któremu przypiszemy pracę.</p>
        <Link href="/panel/artysci/nowy" className="text-link">
          Dodaj pierwszego artystę ↗
        </Link>
      </div>
    );
  return (
    <form action={action} className="editor-form">
      <input type="hidden" name="id" value={artwork?.id ?? ""} />
      {state.error && (
        <p role="alert" className="notice error">
          {formatPolishText(state.error)}
        </p>
      )}
      <div className="form-grid">
        <label className="form-field">
          Tytuł pracy
          <input name="title" required maxLength={200} defaultValue={artwork?.title} />
        </label>
        <label className="form-field">
          Adres strony (slug)
          <input
            name="slug"
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            minLength={2}
            maxLength={120}
            placeholder="tytul-pracy"
            defaultValue={artwork?.slug}
          />
          <small>Adres: /kolekcja/wybrany-slug</small>
        </label>
        <label className="form-field">
          Artysta
          <select name="artist_id" required defaultValue={artwork?.artist_id ?? ""}>
            <option value="" disabled>
              Wybierz artystę
            </option>
            {artists.map((artist) => (
              <option key={artist.id} value={artist.id}>
                {formatPolishText(artist.name)}
                {artist.status === "draft" ? " (szkic)" : ""}
              </option>
            ))}
          </select>
        </label>
        <label className="form-field">
          Dziedzina
          <select name="category" defaultValue={artwork?.category ?? "malarstwo"}>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {formatPolishText(label)}
              </option>
            ))}
          </select>
        </label>
        <label className="form-field">
          Technika
          <input
            name="technique"
            required
            minLength={2}
            maxLength={200}
            placeholder="np. olej, płótno"
            defaultValue={artwork?.technique}
          />
        </label>
        <label className="form-field">
          Wymiary
          <input
            name="dimensions"
            required
            minLength={2}
            maxLength={100}
            placeholder="np. 50 × 70 cm"
            defaultValue={artwork?.dimensions}
          />
        </label>
        <label className="form-field">
          Rok powstania (opcjonalnie)
          <input
            name="year"
            type="number"
            min={1000}
            max={2100}
            defaultValue={artwork?.year ?? ""}
          />
        </label>
        <label className="form-field">
          Dostępność
          <select name="availability" defaultValue={artwork?.availability ?? "unknown"}>
            {Object.entries(availabilityLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {formatPolishText(label)}
              </option>
            ))}
          </select>
        </label>
        <label className="form-field full-width">
          Opis
          <textarea
            name="description"
            required
            minLength={10}
            maxLength={10000}
            rows={5}
            defaultValue={artwork?.description}
          />
        </label>
        <label className="form-field full-width">
          Zdjęcie pracy
          {artwork && (
            <small>Dodaj plik, aby zastąpić obecne zdjęcie, lub pozostaw pole puste.</small>
          )}
          <input
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required={!artwork}
          />
          <small>JPG, PNG lub WebP, maksymalnie 8 MB. Zdjęcie zostanie zoptymalizowane.</small>
        </label>
        <label className="form-field full-width">
          Opis zdjęcia (tekst alternatywny)
          <input
            name="image_alt"
            required
            minLength={5}
            maxLength={300}
            placeholder="np. Pejzaż z drzewami nad rzeką"
            defaultValue={artwork?.image_alt}
          />
          <small>Krótki opis dla osób korzystających z&nbsp;czytnika ekranu.</small>
        </label>
        <label className="form-field">
          Publikacja
          <select name="status" defaultValue={artwork?.status ?? "draft"}>
            <option value="draft">Szkic</option>
            <option value="published">Opublikowana</option>
          </select>
          <small>Publikacja wymaga opublikowanego profilu artysty.</small>
        </label>
      </div>
      <div className="form-actions">
        <button className="button button-dark" disabled={pending} type="submit">
          {pending ? "Zapisywanie…" : "Zapisz pracę"}
        </button>
        <Link href="/panel/prace" className="text-link">
          Wróć do listy
        </Link>
      </div>
    </form>
  );
}
