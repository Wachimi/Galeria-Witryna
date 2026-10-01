import type { Metadata } from "next";
import Image from "next/image";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = { title: "Wystawy" };

const archive = [
  { artist: "Bartłomiej Michałowski", title: "WPADNIJ na 50-TKĘ — miniatury akwarelowe" },
  { artist: "Jolanta Jastrzębska-Jakiel", title: "Malarstwo" },
  { artist: "Sława Radow", title: "Wyspy" },
  { artist: "Walenty Wróblewski", title: "Malarstwo" },
  { artist: "Bożena Lesiak", title: "Malarstwo" },
];

export default function ExhibitionsPage() {
  return (
    <div className="container page-section">
      <PageHeading
        eyebrow="SPOTKANIA ZE SZTUKĄ"
        title="Wystawy w Witrynie."
        description="Wystawy i spotkania z twórcami są częścią historii naszej galerii. Przypominamy wybrane ekspozycje z archiwum."
      />
      <article className="exhibition-feature">
        <div className="exhibition-photo">
          <Image
            src="/images/exhibition-pieczynski.jpg"
            alt="Archiwalna ekspozycja malarstwa Zbigniewa Pieczyńskiego w Galerii Witryna"
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
          />
        </div>
        <div>
          <p className="eyebrow">Z ARCHIWUM GALERII</p>
          <h2>Pod niebem Południa</h2>
          <p>Zbigniew Pieczyński · malarstwo</p>
        </div>
      </article>
      <div className="exhibition-list">
        {archive.map((exhibition) => (
          <article className="exhibition-row" key={exhibition.artist}>
            <h3>{exhibition.artist}</h3>
            <span>{exhibition.title}</span>
          </article>
        ))}
      </div>
    </div>
  );
}
