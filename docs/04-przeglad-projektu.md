# Przegląd projektu — 2 października 2026

## Wyniki

| Kontrola                               | Wynik i zakres                                                                                                                                                                     |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GitHub Actions                         | Commit `5aa2fd3` przeszedł całą kontrolę: [wynik](https://github.com/Wachimi/Galeria-Witryna/actions/runs/36968665356). Zmiany z tego przeglądu wymagają osobnego commita i pusha. |
| ESLint, Prettier i TypeScript          | Bez błędów.                                                                                                                                                                        |
| Testy walidacji i bazy                 | 13 testów przeszło. Polityki dostępu sprawdzono na PostgreSQL w pamięci, korzystając z właściwej migracji i seeda.                                                                 |
| Testy przeglądarkowe z podłączoną bazą | 7 testów przeszło; test menu mobilnego pominięty na komputerze zgodnie z założeniem. Sprawdzono podstrony, wyszukiwanie, filtry, stronę 404, menu i brak poziomego przewijania.    |
| Build produkcyjny                      | Kompilacja i generowanie stron zakończone poprawnie.                                                                                                                               |
| Zależności produkcyjne                 | `npm audit --omit=dev`: 0 zgłoszonych podatności.                                                                                                                                  |
| Konfiguracja                           | `.env.local` jest ignorowany przez Git. W repozytorium jest tylko szablon `.env.example`.                                                                                          |

Test sprawdzający aplikację **bez konfiguracji Supabase** został wyłączony podczas lokalnej kontroli publicznych widoków, ponieważ aplikacja korzysta już z prawdziwej bazy. GitHub Actions sprawdza pełen zestaw testów na katalogu startowym bez konfiguracji Supabase.

## Rzeczywiste połączenie z Supabase

- Publiczne API i biblioteka używana przez aplikację odczytują 3 opublikowanych artystów i 5 opublikowanych prac.
- Prace widoczne publicznie należą do opublikowanych artystów.
- Anonimowy klient API nie może odczytywać profili kont i nie ma uprawnień administratora ani redaktora.
- Wejście do panelu bez sesji przekierowuje do logowania.
- Formularz dociera do usługi Auth. Jedna próba z nieistniejącym kontem otrzymała prawidłową odpowiedź o błędnych danych i nie utworzyła sesji.

Logowanie prawdziwymi kontami, wylogowanie, zapis, publikacja i przesyłanie zdjęć wymagają jeszcze sprawdzenia przez zalogowanego administratora i redaktora. Testy lokalnej migracji potwierdzają założenia reguł dostępu, ale nie zastępują tego przebiegu na rzeczywistej usłudze. Podczas przeglądu odczytywano dane Supabase; katalog i konta pozostały bez zmian.

## Wprowadzone zmiany

- Zapisano oryginalny plik faviconu w `public/images/favicon-source.png`.
- Z tego samego pliku przygotowano `src/app/favicon.ico` w rozmiarach 16, 32, 48 i 256 px, `src/app/icon.png` 256 px oraz `src/app/apple-icon.png` 180 px. Zachowano przezroczystość grafiki.
- Usunięto poprzednią ikonę SVG. Next.js automatycznie dodaje nowe ikony do metadanych strony; wszystkie trzy adresy ikon odpowiadają HTTP 200.
- Dodano `127.0.0.1` do `allowedDevOrigins`, ponieważ Next.js blokował zasoby deweloperskie przy otwieraniu strony przez ten lokalny adres. Po poprawce testy interakcji przechodzą.
- Uaktualniono opis etapu podłączenia bazy w dokumentacji.

Następny krok: przejść na kontach administratora i redaktora przez dodanie artysty, zapis pracy ze zdjęciem jako szkicu, publikację, edycję i wycofanie do szkicu; równolegle sprawdzać widok w przeglądarce bez zalogowania.
