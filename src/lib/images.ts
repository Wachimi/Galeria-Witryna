export function artworkImageUrl(path: string) {
  if (path.startsWith("/images/")) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return "/images/gallery-wall.jpg";
  return `${base}/storage/v1/object/public/artworks/${path.split("/").map(encodeURIComponent).join("/")}`;
}
