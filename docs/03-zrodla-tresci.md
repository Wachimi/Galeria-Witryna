# Źródła i treści do weryfikacji

Materiały pobrano ze starej strony Galerii Witryna podczas przygotowania szkieletu. To wybrana próbka, bez pełnej migracji WordPressa. Treści opisowe nowej strony są skróconą adaptacją informacji galerii; krótkie wprowadzenia artystów nie zastępują ich pełnych biografii.

## Źródła

| Materiał                                              | Źródło                                                                                                       |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Logo, paleta, informacje o galerii, wnętrze i wejście | [Strona główna](https://galeria-witryna.pl/)                                                                 |
| Właściciele, opis działalności, telefon i e-mail      | [O nas](https://galeria-witryna.pl/about-2/) i [Malarstwo](https://galeria-witryna.pl/malarstwo/)            |
| Marek Andała / Tatary                                 | [Profil w starym katalogu](https://galeria-witryna.pl/kategoria-produktu/malastwo/marek-andala/)             |
| Piotr Fąfrowicz / Wąwóz korzeniowy, Stare Miasto      | [Profil w starym katalogu](https://galeria-witryna.pl/kategoria-produktu/malastwo/piotr-fafrowicz-malastwo/) |
| Jerzy Tyburski / Afternoon, Burza                     | [Profil w starym katalogu](https://galeria-witryna.pl/kategoria-produktu/malastwo/jerzy-tyburski/)           |
| Nazwy wystaw i zdjęcie ekspozycji Pieczyńskiego       | [Wystawy](https://galeria-witryna.pl/wystawy/)                                                               |

Oryginalne pliki w repozytorium:

| Plik w `public/images`       | Oryginał                                                                         |
| ---------------------------- | -------------------------------------------------------------------------------- |
| `witryna-logo.png`           | `/wp-content/uploads/brizy/imgs/Witryna_logo-622x122x0x0x622x122x1578497110.png` |
| `gallery-entrance.jpg`       | `/wp-content/uploads/2020/09/IMG_6063.jpg` — zdjęcie wejścia                     |
| `gallery-wall.jpg`           | `/wp-content/uploads/2019/05/a_002.jpg`                                          |
| `gallery-exterior.jpg`       | `/wp-content/uploads/2020/09/jj.jpg`                                             |
| `andala-tatary.jpg`          | `/wp-content/uploads/2019/05/IMG_8029.jpg`                                       |
| `fafrowicz-wawoz.jpg`        | `/wp-content/uploads/2021/10/IMG_1823.jpg`                                       |
| `fafrowicz-stare-miasto.jpg` | `/wp-content/uploads/2021/01/IMG_5009.jpg`                                       |
| `tyburski-afternoon.jpg`     | `/wp-content/uploads/2020/01/IMG_5476.jpg`                                       |
| `tyburski-burza.jpg`         | `/wp-content/uploads/2025/10/IMG_5516.jpg`                                       |
| `exhibition-pieczynski.jpg`  | `/wp-content/uploads/2020/01/Wystawa_Z.Pieczynskiego_009.jpg`                    |

Wszystkie ścieżki oryginałów są względem `https://galeria-witryna.pl`.

## Zdjęcia przekazane przez użytkownika

2 października 2026 użytkownik przekazał sześć zdjęć z folderu materiałów galerii. Przygotowano wersje WebP o maksymalnym boku 1920 px, z uwzględnieniem orientacji zdjęć i bez metadanych EXIF. Oryginały pozostają w folderze użytkownika. Łączna wielkość plików do strony wynosi około 0,88 MB zamiast 17,61 MB oryginałów; Next.js dodatkowo dobiera rozmiar do urządzenia.

| Oryginał           | Plik w `public/images`           | Wykorzystanie                                               |
| ------------------ | -------------------------------- | ----------------------------------------------------------- |
| `glebiakolory.jpg` | `gallery-sculpture.webp`         | Sekcja „Galeria z historią” na stronie głównej.             |
| `IMG_6057.JPG`     | `gallery-front.webp`             | Główne zdjęcie landing page i podgląd udostępnianego linku. |
| `IMG_6069.JPG`     | `gallery-window-detail.webp`     | Sekcja „Witryna z bliska”: detal ekspozycji.                |
| `galeria W.JPG`    | `gallery-sign-sky.webp`          | Sekcja „Witryna z bliska”: szyld na tle nieba.              |
| `IMG_6060.JPG`     | `gallery-sign-close.webp`        | Zdjęcie na podstronie „O galerii”.                          |
| `IMG_6059.JPG`     | `gallery-entrance-portrait.webp` | Pionowe zdjęcie wejścia na podstronie „Kontakt”.            |

Zdjęcia pokazują miejsce i jego atmosferę. Nie przypisano widocznych na nich dzieł do autorów ani nie dodano ich jako pozycji katalogu. Godziny na drukach widocznych na zdjęciach mogą pochodzić z wcześniejszego okresu; tekst strony korzysta z godzin potwierdzonych przez użytkownika.

## Do potwierdzenia przez galerię

- Dostępność prac: we wszystkich startowych rekordach jest `unknown`, czyli „Zapytaj o dostępność”. Obecność na starej stronie nie potwierdza, że praca nadal jest dostępna.
- Wymiary, daty i przypisania zdjęć: przyjęto podpisy starego katalogu. Nie wyprowadzamy roku z daty przesłania pliku — te wartości czasem się różnią.
- Zapis nazwiska Andała: lista artystów używa „Andala”, profil „ANDAŁA”. Przyjęto zapis z profilu.
- Dane kontaktowe potwierdzono w rozmowie z użytkownikiem. Kod pocztowy i godziny pochodzą od użytkownika: 20-026; poniedziałek–piątek 10:00–17:00, sobota 11:00–14:00, niedziela zamknięte.
- Okres działalności: stare podstrony podają różną liczbę lat wcześniejszej pracy właścicieli. Użytkownik przekazał dokładny opis na landing page z określeniem „przez niemal 30 lat”; przyjęto jego tekst. Dotyczy on wcześniejszej pracy w Galerii Art, a nie wieku Galerii Witryna.
- Wystawy: pokazujemy archiwum. Nie dopisano dat ani nie przedstawiono dawnych wydarzeń jako bieżących.
- Pełne biografie, zdjęcia portretowe, grafika i rzeźba: wymagają dalszej migracji. Te filtry są przygotowane, ale startowa próbka zawiera tylko malarstwo.

Paleta zachowuje granat `#000c30`, zieleń `#5fa031` i limonkowy akcent logo. Jasne tło i oszczędniejszy układ są propozycją nowej oprawy wizualnej.

Fonty DM Sans i Playfair Display pochodzą z Google Fonts i są przechowywane lokalnie w `src/assets/fonts`. W tym folderze są też ich licencje SIL Open Font License. Ikony przeglądarki i Apple powstają z pliku `public/images/favicon-source.png` przekazanego i edytowanego przez użytkownika.
