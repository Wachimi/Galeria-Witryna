import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { CatalogBrowser } from "@/components/catalog-browser";
import { getCatalog } from "@/lib/catalog";

export const metadata: Metadata = { title: "Kolekcja" };

export default async function CollectionPage() {
  const catalog = await getCatalog();
  return (
    <div className="container page-section collection-page">
      <div className="collection-intro">
        <PageHeading
          eyebrow="SZTUKA W WITRYNIE"
          title="Odkryj kolekcję."
          description="Prace uporządkowane według artystów. Odkrywaj całą kolekcję lub wybierz autora i dziedzinę sztuki, które Cię interesują."
        />
        <Link className="text-link" href="/artysci">
          Poznaj wszystkich artystów <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>
      <Suspense fallback={<p className="results-count">Wczytujemy kolekcję…</p>}>
        <CatalogBrowser catalog={catalog} />
      </Suspense>
    </div>
  );
}
