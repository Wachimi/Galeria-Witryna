export type Exhibition = {
  slug: string;
  artist: string;
  title: string;
  discipline: string;
  description?: string;
  coverIndex: number;
  photos: { src: string; width: number; height: number; alt: string }[];
};

// Kolejność i tytuły pochodzą z archiwum starej strony; daty wystaw nie są potwierdzone.
export const exhibitions: Exhibition[] = [
  {
    slug: "bartlomiej-michalowski-wpadnij-na-50-tke",
    artist: "Bartłomiej Michałowski",
    title: "WPADNIJ na 50-TKĘ",
    discipline: "Miniatury akwarelowe",
    description: "Pięćdziesiąt najnowszych miniatur akwarelowych.",
    coverIndex: 1,
    photos: [
      {
        src: "/images/exhibitions/michalowski-1.webp",
        width: 779,
        height: 1250,
        alt: "Uczestnicy spotkania przy wejściu do galerii podczas wystawy miniatur akwarelowych Bartłomieja Michałowskiego",
      },
      {
        src: "/images/exhibitions/michalowski-2.webp",
        width: 1296,
        height: 864,
        alt: "Goście oglądający akwarele podczas wernisażu wystawy Bartłomieja Michałowskiego",
      },
    ],
  },
  {
    slug: "zbigniew-pieczynski-pod-niebem-poludnia",
    artist: "Zbigniew Pieczyński",
    title: "Pod niebem Południa",
    discipline: "Malarstwo",
    coverIndex: 1,
    photos: [
      {
        src: "/images/exhibitions/pieczynski-1.webp",
        width: 1294,
        height: 974,
        alt: "Spotkanie w galerii podczas wernisażu wystawy Zbigniewa Pieczyńskiego",
      },
      {
        src: "/images/exhibitions/pieczynski-2.webp",
        width: 1277,
        height: 974,
        alt: "Obrazy Zbigniewa Pieczyńskiego na ścianie galerii podczas wystawy Pod niebem Południa",
      },
    ],
  },
  {
    slug: "jolanta-jastrzebska-jakiel-malarstwo",
    artist: "Jolanta Jastrzębska-Jakiel",
    title: "Malarstwo",
    discipline: "Malarstwo",
    coverIndex: 0,
    photos: [
      {
        src: "/images/exhibitions/jastrzebska-jakiel-1.webp",
        width: 654,
        height: 494,
        alt: "Ekspozycja obrazów Jolanty Jastrzębskiej-Jakiel w jasnych ramach",
      },
      {
        src: "/images/exhibitions/jastrzebska-jakiel-2.webp",
        width: 656,
        height: 496,
        alt: "Goście oglądający katalog podczas wernisażu wystawy Jolanty Jastrzębskiej-Jakiel",
      },
    ],
  },
  {
    slug: "slawa-radow-wyspy",
    artist: "Sława Radow",
    title: "Wyspy",
    discipline: "Malarstwo",
    coverIndex: 1,
    photos: [
      {
        src: "/images/exhibitions/radow-1.webp",
        width: 984,
        height: 1304,
        alt: "Uczestnicy wernisażu wystawy Sławy Radow we wnętrzu galerii",
      },
      {
        src: "/images/exhibitions/radow-2.webp",
        width: 1238,
        height: 938,
        alt: "Ekspozycja malarstwa Sławy Radow podczas wystawy Wyspy",
      },
    ],
  },
  {
    slug: "walenty-wroblewski-malarstwo",
    artist: "Walenty Wróblewski",
    title: "Malarstwo",
    discipline: "Malarstwo",
    coverIndex: 0,
    photos: [
      {
        src: "/images/exhibitions/wroblewski-1.webp",
        width: 1271,
        height: 825,
        alt: "Obrazy Walentego Wróblewskiego w różnych formatach na ścianie galerii",
      },
      {
        src: "/images/exhibitions/wroblewski-2.webp",
        width: 984,
        height: 1304,
        alt: "Spotkanie z gośćmi podczas wernisażu wystawy Walentego Wróblewskiego",
      },
    ],
  },
  {
    slug: "jerzy-wojciech-bielecki-malarstwo",
    artist: "Jerzy Wojciech Bielecki",
    title: "Malarstwo",
    discipline: "Malarstwo",
    coverIndex: 1,
    photos: [
      {
        src: "/images/exhibitions/bielecki-1.webp",
        width: 732,
        height: 492,
        alt: "Otwarcie wystawy Jerzego Wojciecha Bieleckiego w galerii",
      },
      {
        src: "/images/exhibitions/bielecki-2.webp",
        width: 730,
        height: 490,
        alt: "Kolorowe obrazy Jerzego Wojciecha Bieleckiego we wnętrzu galerii",
      },
    ],
  },
  {
    slug: "bozena-lesiak-malarstwo",
    artist: "Bożena Lesiak",
    title: "Malarstwo",
    discipline: "Malarstwo",
    coverIndex: 0,
    photos: [
      {
        src: "/images/exhibitions/lesiak-1.webp",
        width: 654,
        height: 494,
        alt: "Ekspozycja kolorowych obrazów kwiatowych Bożeny Lesiak",
      },
      {
        src: "/images/exhibitions/lesiak-2.webp",
        width: 1294,
        height: 974,
        alt: "Uczestniczki wernisażu wystawy Bożeny Lesiak na tle obrazów",
      },
    ],
  },
];
