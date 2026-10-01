import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Kontakt" };

export default function ContactPage() {
  return (
    <div className="container page-section">
      <PageHeading
        eyebrow="POROZMAWIAJMY O SZTUCE"
        title="Zapraszamy do Witryny."
        description="Chcesz poznać pracę bliżej, zapytać o jej dostępność albo odwiedzić galerię? Jesteśmy do Twojej dyspozycji."
      />
      <div className="contact-grid">
        <div>
          <div className="contact-item">
            <p className="eyebrow">ODWIEDŹ NAS</p>
            <p>
              {site.address}
              <br />
              {site.city}
            </p>
          </div>
          <div className="contact-item">
            <p className="eyebrow">ZADZWOŃ</p>
            <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
          </div>
          <div className="contact-item">
            <p className="eyebrow">NAPISZ</p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
          <p className="contact-note">
            Przed wizytą zachęcamy do kontaktu telefonicznego, aby ustalić dogodny termin.
          </p>
          <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className="text-link">
            Wyznacz trasę w Google Maps <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="contact-photo">
          <Image
            src="/images/gallery-entrance.jpg"
            alt="Wejście do Galerii Witryna w Lublinie"
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
          />
        </div>
      </div>
    </div>
  );
}
