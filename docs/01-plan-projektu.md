# Plan projektu i podział pracy

## Etap 1 — fundament

Przygotowano strukturę Next.js, responsywną stronę publiczną, katalog, szczegóły prac i artystów, archiwum wystaw, kontakt, integrację logowania i panelu, migrację PostgreSQL, reguły dostępu oraz instrukcje.

To wersja startowa do wspólnej pracy. Nie przeniesiono wszystkich treści z WordPressa. Użytkownik utworzył projekt Supabase, uruchomił migrację i seed oraz utworzył konta administratora i redaktora. Aplikacja jest podłączona do Supabase; odczyt katalogu i odpowiedzi usługi logowania zostały sprawdzone. Pozostał pełny test zapisu treści i zdjęć na tych kontach. Hosting będzie późniejszym etapem.

## Etap 2 — decyzje i podłączenie zaplecza

Potrzebujemy:

- Potwierdzenia kierunku wizualnego: logo, zieleń, granat, jasne tło i duże zdjęcia.
- Dane kontaktowe są potwierdzone: ul. Chopina 1, 20-026 Lublin. Godziny: poniedziałek–piątek 10:00–17:00, sobota 11:00–14:00, niedziela zamknięte.
- Aktualnego katalogu prac, autorów, tytułów, technik, wymiarów oraz dostępności.
- Adresów e-mail zespołu i wskazania pierwszego administratora.
- Decyzji o publikacji: obecnie redaktor publikuje sam; ewentualne zatwierdzanie przez administratora wymaga zmiany reguł i interfejsu.
- Project URL i publiczny klucz Publishable key są już wpisane w lokalnej konfiguracji.

Po konfiguracji sprawdzimy: logowanie i wylogowanie, odmowę dostępu osobom bez roli, brak dostępu redaktora do kont, dodanie i edycję artysty, szkic pracy, zdjęcie, publikację, zmianę dostępności i ukrywanie. Sprawdzimy też te same uprawnienia przy bezpośrednim dostępie do API Supabase.

## Etap 3 — pełny katalog i wygodniejsza redakcja

7 października 2026 przeniesiono 95 profili artystów oraz dostępne biografie. Roberta Żyburę pozostawiono do ręcznego dodania na próbę; dane do formularza są w `docs/05-import-artystow.md`. W jedenastu profilach źródło nie zawiera biografii, więc zapisano jedynie potwierdzoną informację o prezentowaniu artysty w galerii. Kolejny etap to prace i ich zdjęcia. Archiwum siedmiu wystaw i czternastu zdjęć ze starej podstrony „Wystawy” zostało przeniesione 5 października 2026. Zweryfikujemy oryginały zdjęć i przypisanie ich do prac.

Możliwe kolejne rozszerzenia po ustaleniu zakresu: panel wystaw i treści strony, wiele zdjęć jednej pracy, automatyczny slug, podgląd przed publikacją, odzyskiwanie hasła, zaproszenia do zespołu z poziomu panelu i historia zmian. Obecnie wystawy oraz treści informacyjne edytujemy w kodzie; panel obsługuje artystów i prace.

## Etap 4 — publikacja

Wybierzemy hosting i plan dla działalności komercyjnej. Przygotujemy domenę, HTTPS, zmienne środowiskowe, kopie zapasowe, przekierowania ze starych adresów i testy na telefonach. Przed uruchomieniem właściciel galerii zatwierdzi treści i prawa do publikowanych materiałów. Informacje o prywatności dopasujemy do faktycznych funkcji strony.

Strona nie ma własnej analityki, formularza kontaktowego ani koszyka. Kontakt prowadzi do poczty i telefonu. Strona kontaktu ma osadzoną mapę Google, która pobiera zawartość z Google, oraz link do wyznaczenia trasy. Logowanie zespołu korzysta z ciasteczek sesyjnych Supabase. Fonty są przechowywane lokalnie i nie wymagają połączenia z Google Fonts.

## Role

| Czynność                              | Administrator  | Redaktor | Bez nadanej roli |
| ------------------------------------- | -------------- | -------- | ---------------- |
| Wejście do panelu                     | Tak            | Tak      | Nie              |
| Dodawanie i edycja artystów oraz prac | Tak            | Tak      | Nie              |
| Publikowanie i wycofanie do szkicu    | Tak            | Tak      | Nie              |
| Lista kont                            | Tak            | Nie      | Nie              |
| Nadawanie ról                         | Przez Supabase | Nie      | Nie              |

Nowe konto otrzymuje techniczną rolę `viewer`, bez dostępu do redakcji. Administrator musi świadomie nadać `editor` lub `admin`. Role nigdy nie pochodzą z danych, które użytkownik może sam ustawić przy rejestracji.

## Późniejszy sklep

Katalog ma już stabilne identyfikatory, autorów, zdjęcia i status dostępności. Sklep będzie osobnym etapem: ceny, zamówienia, rezerwacje, płatności, dostawa i regulaminy. Nie dodajemy teraz pustych tabel ani pozorowanych zakupów.
