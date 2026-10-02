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
            Galerię Witryna założyli i prowadzą Agnieszka i Artur Kuśnierzowie, historycy sztuki z
            wieloletnim doświadczeniem w Galerii Art Związku Polskich Artystów Plastyków w Lublinie.
          </p>
          <p>
            Przy ulicy Chopina 1 prezentujemy twórczość artystów z regionu i całej Polski. Spotykają
            się tutaj różne pokolenia, techniki i sposoby patrzenia na świat.
          </p>
          <h2>Przestrzeń do odkrywania.</h2>
          <p>
            Od malarstwa i grafiki, przez rysunek i rzeźbę, po ceramikę, szkło i biżuterię —
            pomagamy znaleźć prace bliskie Twojej wrażliwości. Dzielimy się wiedzą o twórcach i ich
            dziełach, doradzamy i zapraszamy do rozmowy.
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
