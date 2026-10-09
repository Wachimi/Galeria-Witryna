import type { Metadata } from "next";
import { ArtistsBrowser } from "@/components/artists-browser";
import { PageHeading } from "@/components/page-heading";
import { getCatalog } from "@/lib/catalog";
import { artistPortraitUrl } from "@/lib/images";

export const metadata: Metadata = { title: "Artyści" };

export default async function ArtistsPage() {
  const { artists } = await getCatalog();
  const items = artists.map((artist) => ({
    id: artist.id,
    name: artist.name,
    slug: artist.slug,
    portrait: artistPortraitUrl(artist.portrait_path),
  }));
  return (
    <div className="container page-section artists-page">
      <PageHeading
        eyebrow="TWÓRCY GALERII"
        title="Ludzie. Wrażliwość. Sztuka."
        description="Za każdą pracą stoi człowiek i jego sposób widzenia świata. Poznaj twórców prezentowanych w Witrynie."
      />
      <ArtistsBrowser artists={items} />
    </div>
  );
}
