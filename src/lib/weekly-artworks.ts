import type { Artwork } from "@/types/catalog";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
// Poniedziałek rozpoczynający rotację. Liczymy dni kalendarzowe, niezależnie od zmiany czasu.
const ROTATION_START = Date.UTC(2026, 9, 5);
const polishDate = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Warsaw",
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

export function selectWeeklyArtworks<T extends Pick<Artwork, "id" | "status">>(
  artworks: readonly T[],
  now: Date = new Date(),
): T[] {
  // Stała kolejność zapewnia ten sam zestaw niezależnie od kolejności wyników z bazy.
  const published = artworks
    .filter((artwork) => artwork.status === "published")
    .sort((left, right) => (left.id < right.id ? -1 : left.id > right.id ? 1 : 0));
  if (published.length <= 3) return published;

  const parts = polishDate.formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((item) => item.type === type)!.value);
  const calendarDay = Date.UTC(part("year"), part("month") - 1, part("day"));
  const week = Math.floor((calendarDay - ROTATION_START) / WEEK_MS);
  const start = (((week * 3) % published.length) + published.length) % published.length;

  return Array.from({ length: 3 }, (_, index) => published[(start + index) % published.length]);
}
