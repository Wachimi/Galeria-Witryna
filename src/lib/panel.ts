import "server-only";
import { cache } from "react";
import { requireEditor } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Artist, Artwork, Catalog } from "@/types/catalog";

export const getEditorCatalog = cache(async (): Promise<Catalog> => {
  await requireEditor();
  const supabase = await createClient();
  const [artists, artworks] = await Promise.all([
    supabase.from("artists").select("*").order("name").returns<Artist[]>(),
    supabase
      .from("artworks")
      .select("*")
      .order("created_at", { ascending: false })
      .returns<Artwork[]>(),
  ]);
  if (artists.error || artworks.error)
    throw new Error("Nie udało się pobrać danych panelu. Sprawdź migrację bazy danych.");
  return { artists: artists.data, artworks: artworks.data };
});
