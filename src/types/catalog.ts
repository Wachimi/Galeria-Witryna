export type PublicationStatus = "draft" | "published";
export type UserRole = "admin" | "editor" | "viewer";
export type ArtworkCategory = "malarstwo" | "grafika" | "rzezba";
export type Availability = "unknown" | "available" | "reserved" | "sold";

export interface Artist {
  id: string;
  slug: string;
  name: string;
  biography: string;
  status: PublicationStatus;
  source_url: string | null;
}

export interface Artwork {
  id: string;
  slug: string;
  title: string;
  artist_id: string;
  category: ArtworkCategory;
  technique: string;
  dimensions: string;
  year: number | null;
  description: string;
  image_path: string;
  image_alt: string;
  availability: Availability;
  status: PublicationStatus;
  source_url: string | null;
}

export interface Profile {
  id: string;
  display_name: string;
  role: UserRole;
}

export interface Catalog {
  artists: Artist[];
  artworks: Artwork[];
}

export const categoryLabels: Record<ArtworkCategory, string> = {
  malarstwo: "Malarstwo",
  grafika: "Grafika",
  rzezba: "Rzeźba",
};

export const availabilityLabels: Record<Availability, string> = {
  unknown: "Zapytaj o dostępność",
  available: "Dostępna",
  reserved: "Zarezerwowana",
  sold: "Sprzedana",
};
