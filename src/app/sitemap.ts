import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/catalog";
import { getSiteUrl } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { artists, artworks } = await getCatalog();
  const paths = [
    "",
    "/kolekcja",
    "/artysci",
    "/o-galerii",
    "/wystawy",
    "/kontakt",
    ...artists.map((artist) => `/artysci/${artist.slug}`),
    ...artworks.map((artwork) => `/kolekcja/${artwork.slug}`),
  ];
  return paths.map((path) => ({
    url: `${getSiteUrl()}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
