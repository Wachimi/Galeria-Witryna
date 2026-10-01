import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { OpeningHours } from "@/components/opening-hours";
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
        <div className="contact-details">
          <div className="contact-item">
            <p className="eyebrow">ODWIEDŹ NAS</p>
            <p>
              {site.address}
              <br />
              {site.postalCode} {site.city}
            </p>
          </div>
          <section className="contact-item" aria-labelledby="opening-hours-heading">
            <h2 id="opening-hours-heading" className="eyebrow">
              GODZINY OTWARCIA
            </h2>
            <OpeningHours />
          </section>
          <div className="contact-item">
            <p className="eyebrow">ZADZWOŃ</p>
            <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
          </div>
          <div className="contact-item">
            <p className="eyebrow">NAPISZ</p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
          <p className="contact-note">
            Zapraszamy do odwiedzin w godzinach otwarcia. Jeśli masz pytania o konkretną pracę,
            zadzwoń lub napisz.
          </p>
          <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className="text-link">
            Wyznacz trasę w Google Maps <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="contact-location">
          <section className="contact-map" aria-label="Lokalizacja galerii na mapie">
            <iframe
              title="Mapa dojazdu — Galeria Witryna, Chopina 1, Lublin"
              src={site.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <p>
              {site.address} · {site.postalCode} {site.city}
            </p>
          </section>
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
    </div>
  );
}
