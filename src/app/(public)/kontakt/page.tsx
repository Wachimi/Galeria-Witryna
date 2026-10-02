import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, Facebook } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { OpeningHours } from "@/components/opening-hours";
import { site } from "@/data/site";
import { formatPolishText } from "@/lib/typography";

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
              {formatPolishText(site.address)}
              <br />
              {site.postalCode} {formatPolishText(site.city)}
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
          <div className="contact-item">
            <p className="eyebrow">OBSERWUJ NAS</p>
            <a
              href={site.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <Facebook size={22} aria-hidden="true" />
              Facebook <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
          <p className="contact-note">
            Zapraszamy do odwiedzin w&nbsp;godzinach otwarcia. Jeśli masz pytania o&nbsp;konkretną
            pracę, zadzwoń lub napisz.
          </p>
          <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className="text-link">
            Wyznacz trasę w&nbsp;Google Maps <ArrowUpRight size={17} aria-hidden="true" />
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
              {formatPolishText(site.address)} · {site.postalCode} {formatPolishText(site.city)}
            </p>
          </section>
          <div className="contact-photo">
            <Image
              src="/images/gallery-entrance-portrait.webp"
              alt="Witryna, zielony szyld i wejście do Galerii Witryna przy ul. Chopina 1"
              fill
              sizes="(max-width: 800px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
