import sharp from "sharp";

export const MAX_PORTRAIT_BYTES = 5 * 1024 * 1024;

/** Sprawdza zawartość pliku i przygotowuje lekki JPEG bez metadanych zdjęcia. */
export async function optimizePortrait(file: File): Promise<Buffer> {
  if (file.size > MAX_PORTRAIT_BYTES)
    throw new Error("Zdjęcie profilowe może mieć maksymalnie 5 MB.");
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw new Error("Wybierz zdjęcie JPG, PNG lub WebP.");
  try {
    const input = Buffer.from(await file.arrayBuffer());
    const metadata = await sharp(input, { limitInputPixels: 40_000_000 }).metadata();
    if (
      !metadata.format ||
      !["jpeg", "png", "webp"].includes(metadata.format) ||
      (metadata.pages ?? 1) > 1
    ) {
      throw new Error("unsupported");
    }
    return await sharp(input, { limitInputPixels: 40_000_000 })
      .rotate()
      .resize({ width: 640, height: 640, fit: "inside", withoutEnlargement: true })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 85 })
      .toBuffer();
  } catch {
    throw new Error(
      "Nie udało się odczytać portretu. Wybierz pojedyncze zdjęcie JPG, PNG lub WebP.",
    );
  }
}
