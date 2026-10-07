# Źródła i treści do weryfikacji

Materiały pobrano ze starej strony Galerii Witryna. 7 października 2026 przeniesiono do Supabase 95 profili artystów wraz z dostępnymi biografiami; jeden profil pozostawiono do ręcznego dodania. Katalog prac nadal zawiera pięć pozycji startowych. 5 października 2026 przeniesiono wszystkie siedem wystaw widocznych na stronie archiwum wraz z czternastoma zdjęciami.

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
- Biografie dostępne w źródle zostały przeniesione. Zdjęcia portretowe i pełny katalog prac wymagają dalszej migracji. Filtry grafiki i rzeźby są przygotowane, ale startowa próbka prac zawiera tylko malarstwo.

Paleta zachowuje granat `#000c30`, zieleń `#5fa031` i limonkowy akcent logo. Jasne tło i oszczędniejszy układ są propozycją nowej oprawy wizualnej.

Fonty DM Sans i Playfair Display pochodzą z Google Fonts i są przechowywane lokalnie w `src/assets/fonts`. W tym folderze są też ich licencje SIL Open Font License. Ikony przeglądarki i Apple powstają z pliku `public/images/favicon-source.png` przekazanego i edytowanego przez użytkownika.

## Archiwum wystaw — migracja 5 października 2026

Źródło: [Wystawy](https://galeria-witryna.pl/wystawy/). Przeniesiono siedem pozycji w kolejności ze starej strony: Bartłomiej Michałowski, Zbigniew Pieczyński, Jolanta Jastrzębska-Jakiel, Sława Radow, Walenty Wróblewski, Jerzy Wojciech Bielecki i Bożena Lesiak. Zachowano nazwy wystaw i opis pięćdziesięciu miniatur akwarelowych Michałowskiego. Źródło nie podaje dłuższych opisów ani dat wydarzeń; daty w katalogach plików i ich nazwach nie zostały użyte jako daty wystaw.

Literówkę „Jeży” poprawiono na „Jerzy” zgodnie z [profilem artysty](https://galeria-witryna.pl/kategoria-produktu/malastwo/jerzy-wojciech-bielecki/). Opisy alternatywne zdjęć przygotowano na podstawie ich zawartości; widoczne podpisy usunięto na prośbę użytkownika. Zdjęcia otwierają się w podglądzie na stronie z nawigacją, obsługą klawiatury i zamykaniem przez Esc lub kliknięcie w tło.

Pobrano oryginały JPEG, również dwa zdjęcia Michałowskiego odnalezione przez publiczne API mediów WordPressa. Lokalne wersje WebP zachowują proporcje i nie zawierają metadanych EXIF. Łączny rozmiar: około 1,52 MB zamiast 3,19 MB. Dane są w pliku `src/data/exhibitions.ts`; wystawy nadal redagujemy w kodzie.

| Plik w `public/images/exhibitions` | Oryginał                                                                                                                             |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `michalowski-1.webp`               | [Zdjęcie źródłowe](https://galeria-witryna.pl/wp-content/uploads/2023/03/1.jpg)                                                      |
| `michalowski-2.webp`               | [Zdjęcie źródłowe](https://galeria-witryna.pl/wp-content/uploads/2023/03/3.jpg)                                                      |
| `pieczynski-1.webp`                | [Zdjęcie źródłowe](https://galeria-witryna.pl/wp-content/uploads/2020/01/Wernisaz_wystawy_Z.Pieczynskiego_w_galerii_Witryna_031.jpg) |
| `pieczynski-2.webp`                | [Zdjęcie źródłowe](https://galeria-witryna.pl/wp-content/uploads/2020/01/Wystawa_Z.Pieczynskiego_009.jpg)                            |
| `jastrzebska-jakiel-1.webp`        | [Zdjęcie źródłowe](https://galeria-witryna.pl/wp-content/uploads/2020/01/wernisaz_wystawy_Joli_Jakiel_044.jpg)                       |
| `jastrzebska-jakiel-2.webp`        | [Zdjęcie źródłowe](https://galeria-witryna.pl/wp-content/uploads/2020/01/wernisaz_wystawy_Joli_Jakiel_031.jpg)                       |
| `radow-1.webp`                     | [Zdjęcie źródłowe](https://galeria-witryna.pl/wp-content/uploads/2020/01/Wystawa_S_36.jpg)                                           |
| `radow-2.webp`                     | [Zdjęcie źródłowe](https://galeria-witryna.pl/wp-content/uploads/2020/01/Wystawa_S_37.jpg)                                           |
| `wroblewski-1.webp`                | [Zdjęcie źródłowe](https://galeria-witryna.pl/wp-content/uploads/2020/01/Wystawa_W.Wroblewskiego_X_2013r_010.jpg)                    |
| `wroblewski-2.webp`                | [Zdjęcie źródłowe](https://galeria-witryna.pl/wp-content/uploads/2020/01/Wernisaz_W.Wroblewskiego_009.jpg)                           |
| `bielecki-1.webp`                  | [Zdjęcie źródłowe](https://galeria-witryna.pl/wp-content/uploads/2020/01/2016-05-09_002_007.jpg)                                     |
| `bielecki-2.webp`                  | [Zdjęcie źródłowe](https://galeria-witryna.pl/wp-content/uploads/2020/01/wystawa_J.W.Bieleckiego__1.jpg)                             |
| `lesiak-1.webp`                    | [Zdjęcie źródłowe](https://galeria-witryna.pl/wp-content/uploads/2020/01/DSC09746.jpg)                                               |
| `lesiak-2.webp`                    | [Zdjęcie źródłowe](https://galeria-witryna.pl/wp-content/uploads/2020/01/DSC09770.jpg)                                               |
