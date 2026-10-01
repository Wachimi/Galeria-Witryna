"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sharp from "sharp";
import { requireEditor } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { artistSchema, artworkSchema, type FormState } from "@/lib/validation";

function saveError(code?: string) {
  return code === "23505"
    ? "Ten adres strony jest już zajęty. Wybierz inny adres."
    : "Nie udało się zapisać zmian. Sprawdź połączenie i konfigurację bazy.";
}

export async function saveArtist(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireEditor();
  const parsed = artistSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { id, ...record } = parsed.data;
  const supabase = await createClient();
  const result = id
    ? await supabase.from("artists").update(record).eq("id", id).select("id").single()
    : await supabase.from("artists").insert(record).select("id").single();
  if (result.error) return { error: saveError(result.error.code) };
  revalidatePath("/", "layout");
  redirect("/panel/artysci");
}

export async function saveArtwork(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireEditor();
  const parsed = artworkSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { id, ...record } = parsed.data;
  const supabase = await createClient();
  const { data: artist, error: artistError } = await supabase
    .from("artists")
    .select("id, status")
    .eq("id", record.artist_id)
    .single();
  if (artistError || !artist)
    return { error: "Wybrany artysta nie istnieje lub jest niedostępny." };
  if (record.status === "published" && artist.status !== "published")
    return { error: "Najpierw opublikuj profil artysty lub zapisz pracę jako szkic." };

  let imagePath = "";
  if (id) {
    const existing = await supabase.from("artworks").select("image_path").eq("id", id).single();
    if (existing.error || !existing.data) return { error: "Nie znaleziono pracy do edycji." };
    imagePath = existing.data.image_path;
  }

  const file = formData.get("image");
  let uploadedPath: string | null = null;
  if (file instanceof File && file.size > 0) {
    if (file.size > 8 * 1024 * 1024) return { error: "Zdjęcie może mieć maksymalnie 8 MB." };
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
      return { error: "Wybierz zdjęcie JPG, PNG lub WebP." };
    let optimized: Buffer;
    try {
      const input = Buffer.from(await file.arrayBuffer());
      const metadata = await sharp(input, { limitInputPixels: 40_000_000 }).metadata();
      if (
        !metadata.format ||
        !["jpeg", "png", "webp"].includes(metadata.format) ||
        (metadata.pages ?? 1) > 1
      )
        return { error: "Wybierz pojedyncze zdjęcie JPG, PNG lub WebP." };
      optimized = await sharp(input, { limitInputPixels: 40_000_000 })
        .rotate()
        .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 88 })
        .toBuffer();
    } catch {
      return { error: "Nie udało się odczytać zdjęcia. Sprawdź, czy plik jest poprawny." };
    }
    uploadedPath = `${crypto.randomUUID()}.jpg`;
    const upload = await supabase.storage
      .from("artworks")
      .upload(uploadedPath, optimized, { contentType: "image/jpeg", upsert: false });
    if (upload.error)
      return { error: "Nie udało się przesłać zdjęcia. Sprawdź konfigurację magazynu Supabase." };
    imagePath = uploadedPath;
  }
  if (!imagePath) return { error: "Dodaj zdjęcie pracy." };

  const payload = { ...record, image_path: imagePath };
  const result = id
    ? await supabase.from("artworks").update(payload).eq("id", id).select("id").single()
    : await supabase.from("artworks").insert(payload).select("id").single();
  if (result.error) {
    if (uploadedPath) await supabase.storage.from("artworks").remove([uploadedPath]);
    return { error: saveError(result.error.code) };
  }
  revalidatePath("/", "layout");
  redirect("/panel/prace");
}
