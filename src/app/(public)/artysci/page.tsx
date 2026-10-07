import type { Metadata } from "next";
import { ArtistsBrowser } from "@/components/artists-browser";
import { PageHeading } from "@/components/page-heading";
import { getCatalog } from "@/lib/catalog";
import { artworkImageUrl, artistPortraitUrl } from "@/lib/images";

export const metadata: Metadata = { title: "Artyści" };

export default async function ArtistsPage() {
  const { artists, artworks } = await getCatalog();
  const items = artists.map((artist) => {
    const artwork = artworks.find((item) => item.artist_id === artist.id);
    return {
      id: artist.id,
      name: artist.name,
      slug: artist.slug,
      portrait: artistPortraitUrl(artist.portrait_path),
      image: artwork ? { src: artworkImageUrl(artwork.image_path), alt: artwork.image_alt } : null,
    };
  });
  return (
    <div className="container page-section">
      <PageHeading
        eyebrow="TWÓRCY GALERII"
        title="Ludzie. Wrażliwość. Sztuka."
        description="Za każdą pracą stoi człowiek i jego sposób widzenia świata. Poznaj twórców prezentowanych w Witrynie."
      />
      <ArtistsBrowser artists={items} />
    </div>
  );
}
