import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";
import { CatalogBrowser } from "@/components/catalog-browser";
import { getCatalog } from "@/lib/catalog";

export const metadata: Metadata = { title: "Kolekcja" };

export default async function CollectionPage() {
  const catalog = await getCatalog();
  return (
    <div className="container page-section">
      <PageHeading
        eyebrow="SZTUKA W WITRYNIE"
        title="Odkryj kolekcję."
        description="Malarstwo, grafika i rzeźba. Poznaj prace twórców związanych z galerią i znajdź własne spojrzenie na sztukę."
      />
      <CatalogBrowser catalog={catalog} />
    </div>
  );
}
