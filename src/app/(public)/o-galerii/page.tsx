import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = { title: "O galerii" };

export default function AboutPage() {
  return (
    <div className="container page-section">
      <PageHeading eyebrow="NASZA HISTORIA" title="Miejsce z pasją do sztuki." />
      <div className="about-page">
        <div className="prose">
          <p>
            GALERIA SZTUKI WITRYNA została założona i&nbsp;prowadzona jest przez historyków sztuki
            Agnieszkę i&nbsp;Artura Kuśnierzów, którzy przez niemal 20 lat z&nbsp;pasją
            i&nbsp;sukcesem kierowali promocją i&nbsp;sprzedażą dzieł sztuki w&nbsp;Galerii Art
            Związku Polskich Artystów Plastyków w&nbsp;Lublinie, tworząc jej niepowtarzalny klimat
            i&nbsp;jakość.
          </p>
          <p>
            Galeria Witryna z&nbsp;siedzibą przy ulicy Chopina 1 podtrzymując i&nbsp;kontynuując
            tradycję prezentuje, promuje i&nbsp;sprzedaje sztukę współczesną artystów lubelskich,
            jak i&nbsp;z&nbsp;całej Polski.
          </p>
          <p>
            Prezentowane prace, zróżnicowane tematycznie i&nbsp;stylistycznie, łączy jedno - wysoki
            poziom artystyczny i&nbsp;warsztatowy.
          </p>
          <p>
            Artyści związani z&nbsp;Galerią Witryna reprezentują różne pokolenia twórców, oraz
            różnorodne dziedziny sztuki, od malarstwa poprzez grafikę, rysunek i&nbsp;rzeźbę do
            ceramiki, szkła, czy biżuterii.
          </p>
          <Link className="text-link" href="/kontakt">
            Odwiedź galerię <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <figure className="about-page-photo">
          <Image
            src="/images/gallery-owners.webp"
            alt="Właściciele galerii we wnętrzu Witryny, na tle prezentowanych obrazów"
            width={1600}
            height={1067}
            sizes="(max-width: 800px) 100vw, 50vw"
            loading="eager"
          />
          <figcaption>
            <span>Agnieszka i&nbsp;Artur Kuśnierzowie</span>
            <span>Historycy sztuki, założyciele Galerii Witryna</span>
            <small className="photo-credit">fot. Dominika Polonis</small>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
