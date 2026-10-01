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

## Do potwierdzenia przez galerię

- Dostępność prac: we wszystkich startowych rekordach jest `unknown`, czyli „Zapytaj o dostępność”. Obecność na starej stronie nie potwierdza, że praca nadal jest dostępna.
- Wymiary, daty i przypisania zdjęć: przyjęto podpisy starego katalogu. Nie wyprowadzamy roku z daty przesłania pliku — te wartości czasem się różnią.
- Zapis nazwiska Andała: lista artystów używa „Andala”, profil „ANDAŁA”. Przyjęto zapis z profilu.
- Dane kontaktowe potwierdzono w rozmowie z użytkownikiem. Kod pocztowy i godziny pochodzą od użytkownika: 20-026; poniedziałek–piątek 10:00–17:00, sobota 11:00–14:00, niedziela zamknięte.
- Okres działalności: stare podstrony podają różną liczbę lat wcześniejszej pracy właścicieli. Nowa wersja używa ogólnego „wieloletnie doświadczenie”.
- Wystawy: pokazujemy archiwum. Nie dopisano dat ani nie przedstawiono dawnych wydarzeń jako bieżących.
- Pełne biografie, zdjęcia portretowe, grafika i rzeźba: wymagają dalszej migracji. Te filtry są przygotowane, ale startowa próbka zawiera tylko malarstwo.

Paleta zachowuje granat `#000c30`, zieleń `#5fa031` i limonkowy akcent logo. Jasne tło i oszczędniejszy układ są propozycją nowej oprawy wizualnej.

Fonty DM Sans i Playfair Display pochodzą z Google Fonts i są przechowywane lokalnie w `src/assets/fonts`. W tym folderze są też ich licencje SIL Open Font License. Ikona przeglądarki jest prostym wariantem znaku przygotowanym w SVG; przed publikacją można zastąpić ją oryginalnym plikiem favicon galerii.
