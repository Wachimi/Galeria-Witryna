# Uruchomienie bazy i logowania

Ten etap wymaga Twojego konta Supabase. Nie potrzebujemy klucza `service_role` w aplikacji. Publiczny klucz działa razem z uprawnieniami RLS w bazie.

1. Zaloguj się na [supabase.com](https://supabase.com/) i utwórz projekt. Wybierz region w UE, nazwę i silne hasło bazy; zapisz hasło w swoim menedżerze haseł.
2. W SQL Editor uruchom cały [001_initial_schema.sql](../supabase/migrations/001_initial_schema.sql). Migrację uruchamiamy raz. Jeśli coś się nie powiedzie, transakcja wycofa zmiany — sprawdź komunikat zamiast uruchamiać pojedyncze fragmenty.
3. Opcjonalnie uruchom [seed.sql](../supabase/seed.sql), aby zachować obecne 3 profile i 5 prac. Bez seeda po podłączeniu baza będzie pusta; katalog startowy przestaje być używany.
4. W ustawieniach Auth wyłącz **Allow new users to sign up**. Strona nie oferuje publicznej rejestracji.
5. Utwórz pierwszą osobę w **Authentication → Users → Add user → Create new user**. Ustaw e-mail, hasło i potwierdzenie adresu. Hasło przekaż tej osobie bezpiecznie, poza repozytorium i czatem. Konto stworzone po migracji automatycznie dostaje profil z rolą `viewer`.
6. W SQL Editor nadaj pierwszemu administratorowi rolę. Podstaw jego rzeczywisty adres:

```sql
update public.profiles
set role = 'admin', display_name = 'Administrator galerii'
where id = (
  select id from auth.users where email = 'ADRES-ADMINISTRATORA'
);
```

7. Analogicznie utwórz konto redaktora i przypisz mu `role = 'editor'`. Nie przyznawaj wszystkim kontom roli administratora. Jeśli utworzono konta przed migracją, trzeba uzupełnić ich profile — zgłoś to, przygotujemy właściwą operację dla konkretnej bazy.
8. Skopiuj plik konfiguracyjny:

```powershell
Copy-Item .env.example .env.local
```

9. Wpisz do `.env.local` **Project URL** i **Publishable key** z ustawień projektu:

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://TWOJ-PROJEKT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_TWOJ_KLUCZ
```

10. Uruchom ponownie `npm run dev`, przejdź do `/logowanie` i użyj utworzonego konta. W ustawieniach URL Auth wpisz lokalny adres witryny. Przed publikacją zaktualizujemy go na docelową domenę; obsługa linków zaproszeń i odzyskiwania hasła będzie osobnym rozszerzeniem. Na razie używamy kont tworzonych z hasłem w konsoli.

## Jak są chronione dane

- Brak zalogowania: tylko opublikowani artyści i opublikowane prace, których artyści również są opublikowani.
- Redaktor: odczyt katalogu i szkiców, dodawanie, edycja oraz publikacja.
- Administrator: te same możliwości plus lista kont i możliwość zmiany ról przez konsolę lub API, zgodnie z RLS.
- `viewer`: własny profil i publiczny katalog, brak zapisu i dostępu do panelu.
- Brak reguł usuwania artystów i prac. Zamiast kasowania wycofujemy treści do szkicu.

RLS działa również przy bezpośrednim wywołaniu API z publicznym kluczem. Sprawdzenie roli w układzie panelu nie zastępuje sprawdzenia w operacjach zapisu — kod robi oba.

## Zdjęcia

Migracja tworzy publiczny bucket `artworks`. Aplikacja akceptuje pojedyncze JPG, PNG i WebP do 8 MB, sprawdza faktyczny format, ogranicza liczbę pikseli, usuwa metadane i zapisuje zoptymalizowany JPG o maksymalnym wymiarze 1800 px. Nazwa w Storage to losowy UUID; nie używamy nazwy pliku przesłanej przez użytkownika.

Fotografie są publiczne także wtedy, gdy opis pracy jest szkicem. Nie przesyłamy tu plików prywatnych. Pliki zastąpione nowym zdjęciem pozostają w magazynie; czyszczenie nieużywanych zdjęć dodamy w następnym etapie. Nieudany zapis rekordu próbuje usunąć właśnie przesłane zdjęcie.

## Sprawdzenie po podłączeniu

Sprawdź z nami kolejno logowanie, brak dostępu bez konta, brak dostępu konta `viewer`, dodanie szkicu artysty i pracy, publikację, edycję, zdjęcie oraz wylogowanie. W osobnej sesji przeglądarki sprawdź, czy publicznie nie widać szkiców. Redaktor nie powinien widzieć `/panel/uzytkownicy` ani móc nadać sobie roli administratora.

Kod integracji jest przygotowany, ale rzeczywistego połączenia z Supabase nie da się sprawdzić przed utworzeniem i skonfigurowaniem projektu.

Dokumentacja: [sesja Supabase w Next.js](https://supabase.com/docs/guides/auth/server-side/creating-a-client), [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security).
