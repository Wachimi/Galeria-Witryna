import "server-only";
import { cache } from "react";
import { starterCatalog } from "@/data/catalog";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { Artist, Artwork, Catalog } from "@/types/catalog";

// Jedno miejsce pobierania danych: widoki nie zależą od sposobu ich przechowywania.
export const getCatalog = cache(async (): Promise<Catalog> => {
  if (!isSupabaseConfigured()) return starterCatalog;
  const supabase = await createClient();
  const [artists, artworks] = await Promise.all([
    supabase
      .from("artists")
      .select("*")
      .eq("status", "published")
      .order("name")
      .returns<Artist[]>(),
    supabase
      .from("artworks")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .returns<Artwork[]>(),
  ]);
  if (artists.error || artworks.error)
    throw new Error("Nie udało się pobrać katalogu z bazy danych.");
  const artistIds = new Set(artists.data.map((artist) => artist.id));
  return {
    artists: artists.data,
    artworks: artworks.data.filter((artwork) => artistIds.has(artwork.artist_id)),
  };
});
