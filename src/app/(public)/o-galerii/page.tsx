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
            Galerię Witryna założyli i&nbsp;prowadzą Agnieszka i&nbsp;Artur Kuśnierzowie, historycy
            sztuki z&nbsp;wieloletnim doświadczeniem w&nbsp;Galerii Art Związku Polskich Artystów
            Plastyków w&nbsp;Lublinie.
          </p>
          <p>
            <em>
              Przy ulicy Chopina 1 prezentujemy twórczość artystów z&nbsp;regionu i&nbsp;całej
              Polski. Spotykają się tutaj różne pokolenia, techniki i&nbsp;sposoby patrzenia na
              świat.
            </em>
          </p>
          <h2>Przestrzeń do odkrywania.</h2>
          <p>
            <em>
              Od malarstwa i&nbsp;grafiki, przez rysunek i&nbsp;rzeźbę, po ceramikę, szkło
              i&nbsp;biżuterię — pomagamy znaleźć prace bliskie Twojej wrażliwości. Dzielimy się
              wiedzą o&nbsp;twórcach i&nbsp;ich dziełach, doradzamy i&nbsp;zapraszamy do rozmowy.
            </em>
          </p>
          <Link className="text-link" href="/kontakt">
            Odwiedź galerię <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="about-page-photo">
          <Image
            src="/images/gallery-sign-close.webp"
            alt="Szyld i oznaczenie Galerii Witryna nad witryną przy ul. Chopina 1"
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
}
