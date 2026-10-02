import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import { ArtworkCard } from "@/components/artwork-card";
import { getCatalog } from "@/lib/catalog";
import { site } from "@/data/site";
import { OpeningHours } from "@/components/opening-hours";

export default async function HomePage() {
  const { artists, artworks } = await getCatalog();
  return (
    <>
      <div className="hero-band">
        <section className="container hero">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" /> MIEJSCE SPOTKAŃ ZE SZTUKĄ
            </p>
            <h1>
              Sztuka blisko.
              <br />
              <em>Blisko Ciebie.</em>
            </h1>
            <p className="hero-description">
              Różne spojrzenia. Wyjątkowi twórcy. Odkryj sztukę współczesną w kameralnej galerii w
              sercu Lublina.
            </p>
            <div className="hero-actions">
              <Link className="button button-dark" href="/kolekcja">
                Poznaj kolekcję <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <Link className="text-link" href="/o-galerii">
                Nasza historia <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <div className="hero-location">
              <MapPin size={17} aria-hidden="true" />
              <span>
                {site.address}, {site.city}
              </span>
              <span className="location-divider" />
              <span>Malarstwo · Grafika · Rzeźba</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image">
              <Image
                src="/images/gallery-front.webp"
                alt="Witryna i wejście do Galerii Witryna przy ul. Chopina 1 w Lublinie"
                fill
                sizes="(max-width: 900px) 100vw, 52vw"
                loading="eager"
                fetchPriority="high"
              />
            </div>
            <div className="hero-image-caption">
              <span>GALERIA WITRYNA</span>
              <span>
                Rzeźba, malarstwo, spotkania <ArrowUpRight size={16} aria-hidden="true" />
              </span>
            </div>
            <span className="hero-vertical">SZTUKA MA SWOJE MIEJSCE</span>
          </div>
        </section>
        <div className="container section-divider">
          <span>SPOJRZENIE NA SZTUKĘ</span>
          <a href="#wybrane-prace" aria-label="Przejdź do wybranych prac">
            <ArrowDown size={18} />
          </a>
          <span>01 / ODKRYWAJ</span>
        </div>
      </div>
      <section id="wybrane-prace" className="container section selected-works">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Z KOLEKCJI GALERII</p>
            <h2>
              Każda praca.
              <br />
              <em>Osobna opowieść.</em>
            </h2>
          </div>
          <div className="section-heading-aside">
            <p>Odkryj różnorodność form, kolorów i wrażliwości artystów związanych z Witryną.</p>
            <Link className="text-link" href="/kolekcja">
              Zobacz całą kolekcję <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="artwork-grid">
          {artworks.slice(0, 3).map((artwork) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              artist={artists.find((artist) => artist.id === artwork.artist_id)}
            />
          ))}
        </div>
        {!artworks.length && (
          <p className="empty-state">
            Przygotowujemy nową kolekcję. Zapraszamy do odwiedzenia galerii.
          </p>
        )}
      </section>
      <section className="about-band">
        <div className="container about-band-inner">
          <div className="about-photo">
            <Image
              src="/images/gallery-sculpture.webp"
              alt="Rzeźba głowy konia na tle obrazów we wnętrzu Galerii Witryna"
              fill
              sizes="(max-width: 900px) 100vw, 45vw"
            />
          </div>
          <div className="about-band-copy">
            <p className="eyebrow">GALERIA Z HISTORIĄ</p>
            <h2>
              Łączy nas
              <br />
              <em>pasja do sztuki.</em>
            </h2>
            <p>
              Witrynę tworzą Agnieszka i Artur Kuśnierzowie — historycy sztuki, którzy od lat
              przybliżają twórczość artystów z Lublina i całej Polski.
            </p>
            <p>
              Pomagamy odkrywać, rozumieć i wybierać sztukę. Z uważnością na jej twórców i na
              Ciebie.
            </p>
            <Link href="/o-galerii" className="text-link">
              Poznaj nas bliżej <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <section
        className="container section gallery-glimpses"
        aria-labelledby="gallery-glimpses-heading"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">WITRYNA Z BLISKA</p>
            <h2 id="gallery-glimpses-heading">
              Zajrzyj do <em>Witryny.</em>
            </h2>
          </div>
          <p className="section-heading-aside">
            Od szyldu przy ul. Chopina po detale ekspozycji — poznaj galerię, zanim przekroczysz jej
            próg.
          </p>
        </div>
        <div className="gallery-glimpses-grid">
          <figure className="gallery-glimpse">
            <div className="gallery-glimpse-image">
              <Image
                src="/images/gallery-window-detail.webp"
                alt="Obrazy w złoconych ramach i dekoracje w witrynie galerii"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </div>
            <figcaption>Detale, które przyciągają spojrzenie.</figcaption>
          </figure>
          <figure className="gallery-glimpse">
            <div className="gallery-glimpse-image">
              <Image
                src="/images/gallery-sign-sky.webp"
                alt="Zielony szyld Galerii Witryna na tle błękitnego nieba"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </div>
            <figcaption>Nasz znak przy ul. Chopina 1.</figcaption>
          </figure>
        </div>
      </section>
      <div className="visit-band">
        <section className="container visit-section">
          <div>
            <p className="eyebrow">ZAPRASZAMY DO WITRYNY</p>
            <h2>
              Spotkajmy się
              <br />
              <em>wśród sztuki.</em>
            </h2>
          </div>
          <div>
            <p>
              Nie trzeba znać się na sztuce, żeby ją poczuć.
              <br />
              Odwiedź nas, obejrzyj prace i porozmawiajmy.
            </p>
            <Link href="/kontakt" className="button button-dark">
              Zaplanuj wizytę <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <OpeningHours />
          </div>
        </section>
      </div>
    </>
  );
}
