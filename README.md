# Galeria Sztuki Witryna

Nowa strona galerii w Lublinie: katalog sztuki i panel dla zespołu. Etap 1 przygotowuje strukturę, pierwszy wygląd oraz kod integracji z bazą. Projekt nie zawiera sklepu ani płatności.

## Uruchomienie na komputerze

Wymagany Node.js 22.18+ (zalecany Node.js 24 LTS) i npm. Na Twoim komputerze Node.js 24 jest już zainstalowany.

```powershell
cd C:\WebDevelopment\Galeria-Witryna
npm install
npm run dev
```

Otwórz **http://localhost:3000**. Bez `.env.local` strona korzysta z 3 artystów i 5 prac ze starej witryny. Filtry i wyszukiwarka działają. Logowanie jest wyłączone, a `/panel` pokazuje instrukcję konfiguracji. Nie ma kont demonstracyjnych ani zapisu do pamięci przeglądarki.

## Co jest przygotowane

| Adres                          | Zawartość                                           |
| ------------------------------ | --------------------------------------------------- |
| `/`                            | Strona główna                                       |
| `/kolekcja`                    | Katalog z wyszukiwarką i filtrami                   |
| `/kolekcja/[slug]`             | Praca, dane techniczne i zapytanie e-mail           |
| `/artysci` i `/artysci/[slug]` | Lista twórców i ich profile                         |
| `/o-galerii`                   | Historia i charakter galerii                        |
| `/wystawy`                     | Wybrane wystawy archiwalne                          |
| `/kontakt`                     | Adres, godziny, telefon, e-mail i mapa Google       |
| `/logowanie`                   | Logowanie zespołu przez Supabase Auth               |
| `/panel`                       | Przegląd katalogu                                   |
| `/panel/artysci`               | Lista, dodawanie i edycja artystów                  |
| `/panel/prace`                 | Lista, dodawanie i edycja prac, zdjęcia, publikacja |
| `/panel/uzytkownicy`           | Lista kont dostępna administratorowi                |

Panel zapisuje dane w Supabase po konfiguracji. Role sprawdzamy na serwerze i w bazie przez RLS. Administrator i redaktor mogą dodawać, edytować i publikować treści. Administrator dodatkowo ma wgląd w konta. Tworzenie kont i nadawanie ról w tym etapie odbywa się w konsoli Supabase.

Prace mają osobno status publikacji (`draft`/`published`) i dostępność. Zmiana na szkic ukrywa treść; nie usuwamy danych. Publiczny katalog pokazuje tylko opublikowane prace opublikowanych artystów. Zdjęcia w Storage są publiczne również przed publikacją rekordu — magazyn jest przeznaczony wyłącznie na fotografie dzieł.

## Technologie i ich zadania

| Technologia             | Do czego służy                                                      |
| ----------------------- | ------------------------------------------------------------------- |
| Next.js 16 / App Router | Podstrony, renderowanie na serwerze, metadane SEO i operacje panelu |
| React 19                | Wspólne komponenty i interaktywne formularze                        |
| TypeScript              | Typy danych, wykrywanie pomyłek w kodzie                            |
| Zwykły CSS              | Responsywny wygląd; bez dodatkowej warstwy Tailwinda                |
| Supabase / PostgreSQL   | Artyści, prace, konta, uprawnienia i magazyn zdjęć                  |
| Zod / sharp             | Sprawdzanie danych formularzy i optymalizacja przesyłanych zdjęć    |
| ESLint / Playwright     | Sprawdzanie kodu i zachowania strony w przeglądarce                 |
| Git / GitHub Actions    | Historia zmian i automatyczna kontrola po wysłaniu kodu             |

Nie potrzebujemy osobnego serwera Express ani drugiego repozytorium. Supabase jest propozycją zaplecza; przy zmianie dostawcy głównym miejscem do wymiany jest warstwa `src/lib`.

## Organizacja plików

```text
src/
  app/
    (public)/          # Strona galerii i katalog
    (auth)/            # Logowanie
    (admin)/panel/     # Chroniony panel i operacje zapisu
    globals.css        # Kolory, typografia, układy i widoki mobilne
    layout.tsx         # Główny dokument HTML oraz metadane
    robots.ts          # Zasady indeksowania
    sitemap.ts         # Mapa strony
  components/          # Nagłówek, stopka, karty i formularze
  data/                # Dane startowe i dane kontaktowe
  lib/                 # Pobieranie danych, walidacja i logowanie
  types/               # Wspólne typy artysty, pracy i użytkownika
  proxy.ts             # Odświeżanie sesji Supabase
public/images/         # Oryginalne logo i wybrane zdjęcia z WordPressa
supabase/
  migrations/          # Struktura bazy i uprawnienia
  seed.sql             # Opcjonalny katalog startowy
docs/                  # Plan, konfiguracja i źródła treści
tests/                 # Walidacja, reguły bazy i testy przeglądarkowe
.github/workflows/     # Kontrola jakości na GitHubie
```

Foldery w nawiasach porządkują kod, ale nie pojawiają się w adresie strony. `page.tsx` oznacza podstronę, a `layout.tsx` wspólny układ. `[slug]` to zmienna część adresu, np. `/kolekcja/tatary`.

Komponenty domyślnie wykonują się na serwerze. Pliki z `"use client"` obsługują interakcje w przeglądarce, np. filtr katalogu. Operacje z `"use server"` sprawdzają uprawnienia i zapisują dane w bazie.

## Następne etapy i potrzebne informacje

1. **Układ i treści:** dane kontaktowe, kod pocztowy i godziny są potwierdzone. Oceń większe teksty i nowe tła sekcji; potwierdź aktualną dostępność prac. Ustalmy, czy redaktor publikuje sam, czy publikację zatwierdza administrator. Teraz obie role mogą publikować.
2. **Zaplecze:** projekt Supabase, migracja i seed są już utworzone. Aplikacja ma lokalną konfigurację i poprawnie odczytuje katalog z bazy. Utworzono konta administratora i redaktora; kolejny krok to pełny test logowania, zapisu i zdjęć na tych kontach. Instrukcja: [docs/02-supabase.md](docs/02-supabase.md). Haseł nie przesyłaj w czacie.
3. **Przeniesienie katalogu:** potrzebny będzie eksport treści i mediów z WordPressa albo dostęp do kopii zapasowej. Na razie przeniesiono wybrane materiały, nie cały katalog. Uzgodnimy przekierowania starych adresów.
4. **Publikacja:** wybierzemy hosting obsługujący Next.js. Możliwa jest Vercel; przed wyborem sprawdzimy plan dopuszczający komercyjną stronę galerii i koszty. Potrzebny będzie dostęp do DNS domeny. Stary WordPress pozostaje do momentu odbioru nowej strony.

Pełny plan i podział zadań: [docs/01-plan-projektu.md](docs/01-plan-projektu.md). Źródła i dane do weryfikacji: [docs/03-zrodla-tresci.md](docs/03-zrodla-tresci.md).

Nie musisz instalować lokalnej bazy danych ani ręcznie tworzyć API. Po Twojej stronie pozostają konta usług, decyzje dotyczące treści i dostęp do domeny. Kod i kolejne zmiany przygotujemy tutaj.

## Git i GitHub

Repozytorium lokalne ma gałąź `main` i zdalny adres `https://github.com/Wachimi/Galeria-Witryna.git`. `.env.local`, zależności i pliki kompilacji są wykluczone przez `.gitignore`.

Gdy kod będzie gotowy do wysłania:

```powershell
git status
git push -u origin main
```

Pierwszy push może poprosić o zalogowanie przez Git Credential Manager. GitHub Actions uruchomi lint, kontrolę typów, testy walidacji i uprawnień bazy, kompilację oraz testy przeglądarkowe. Samo wysłanie do GitHuba nie publikuje witryny. Jeśli repozytorium zdalne ma już własne commity, najpierw połączymy historie bez nadpisywania zmian.

## Sprawdzanie projektu

```powershell
npm run lint
npm run format:check
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Testy E2E uruchamiaj bez konfiguracji Supabase — sprawdzają deterministyczny katalog startowy. Przy podłączonej bazie zawierającej niezmieniony seed można sprawdzić publiczne widoki poleceniem `npx playwright test --grep-invert "bez konfiguracji"`; testy wyszukiwarki zakładają obecność konkretnych 5 prac. Testy bazy uruchamiają tę samą migrację na PostgreSQL w pamięci (PGlite), z minimalnym modelem usług Auth i Storage, i sprawdzają uprawnienia. Pełna integracja zapisu oraz przesyłania zdjęć wymaga osobnego sprawdzenia na rzeczywistym Supabase z kontami zespołu. Build nie uruchamia ESLinta automatycznie.

Wyniki ostatniej kontroli i zakres sprawdzonych funkcji: [przegląd projektu](docs/04-przeglad-projektu.md).

W produkcji: `npm run build`, następnie `npm start`. `NEXT_PUBLIC_SITE_URL` musi wskazywać prawdziwą domenę, aby mapa strony i adresy SEO były poprawne.
