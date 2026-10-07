import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { ExhibitionGallery } from "@/components/exhibition-gallery";
import { exhibitions } from "@/data/exhibitions";
import { formatPolishText } from "@/lib/typography";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return exhibitions.map((exhibition) => ({ slug: exhibition.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exhibition = exhibitions.find((item) => item.slug === slug);
  if (!exhibition) notFound();
  const cover = exhibition.photos[exhibition.coverIndex];
  return {
    title: `${exhibition.artist} — ${exhibition.title}`,
    description: `${exhibition.artist} — ${exhibition.title}. Archiwalna wystawa w Galerii Witryna.`,
    openGraph: {
      images: [{ url: cover.src, width: cover.width, height: cover.height, alt: cover.alt }],
    },
  };
}

export default async function ExhibitionPage({ params }: Props) {
  const { slug } = await params;
  const exhibition = exhibitions.find((item) => item.slug === slug);
  if (!exhibition) notFound();
  return (
    <div className="container page-section">
      <nav className="breadcrumb" aria-label="Ścieżka nawigacji">
        <Link href="/wystawy">Wystawy</Link>
        <span>/</span>
        <span>{formatPolishText(exhibition.artist)}</span>
      </nav>
      <PageHeading
        eyebrow="Z ARCHIWUM GALERII"
        title={exhibition.artist}
        description={exhibition.title}
      />
      {exhibition.description && (
        <p className="exhibition-introduction">{formatPolishText(exhibition.description)}</p>
      )}
      <ExhibitionGallery photos={exhibition.photos} />
      <Link href="/wystawy" className="text-link">
        <ArrowLeft size={18} aria-hidden="true" /> Wróć do wszystkich wystaw
      </Link>
    </div>
  );
}
