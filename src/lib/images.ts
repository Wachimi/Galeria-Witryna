export function artworkImageUrl(path: string) {
  if (path.startsWith("/images/")) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return "/images/gallery-wall.jpg";
  return `${base}/storage/v1/object/public/artworks/${path.split("/").map(encodeURIComponent).join("/")}`;
}

export function artistPortraitUrl(path: string | null | undefined) {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/artist-portraits/${path.split("/").map(encodeURIComponent).join("/")}`;
}
