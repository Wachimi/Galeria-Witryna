# Portrety artystów

Mały, okrągły portret pojawia się obok imienia i nazwiska na karcie artysty. Przy braku zdjęcia pokazujemy domyślną ikonę sylwetki. Duże pole na karcie pozostaje miejscem na przykładową pracę. Portret jest też widoczny obok biografii w szczegółach artysty.

## Jednorazowa migracja Supabase

Uruchom [migrację portretów](../supabase/migrations/20261007065759_artist_portraits.sql) w SQL Editor projektu. Plik można uruchomić ponownie: dodaje opcjonalne `artists.portrait_path`, magazyn `artist-portraits` i jego reguły dostępu. Nie zmienia opisów, publikacji, identyfikatorów ani przypisań prac. Na końcu zwraca liczbę artystów i zapisanych portretów.

Dotychczasowy `SUPABASE_SECRET_KEY` pozwala obsługiwać dane i pliki, ale nie wykonywać migracji SQL. Alternatywą dla SQL Editor jest `SUPABASE_ACCESS_TOKEN` ograniczony do tego projektu: **Database → Read-write**, a dla odczytu raportów bezpieczeństwa także **Advisors → Read**. Token umieszczamy wyłącznie w lokalnym, ignorowanym przez Git pliku `.env.local`, bez prefiksu `NEXT_PUBLIC_`. [Dokumentacja uprawnień tokenów](https://supabase.com/docs/guides/platform/personal-access-tokens).

## Dodawanie i zmiana portretu

1. Zaloguj się jako administrator albo redaktor.
2. Wejdź w **Artyści → Edytuj** albo **Dodaj artystę**.
3. W sekcji **Zdjęcie profilowe (opcjonalnie)** wybierz JPG, PNG lub WebP o wielkości do 5 MB. Zobaczysz okrągły podgląd.
4. Zapisz artystę. Puste pole pliku zachowuje dotychczasowy portret.
5. Aby wymienić portret, wybierz nowy plik i zapisz profil.
6. Aby usunąć portret, kliknij **Usuń zdjęcie profilowe** i zapisz. Przed zapisem możesz cofnąć usunięcie.

Zdjęcie zostaje obrócone zgodnie z orientacją aparatu, zmniejszone do maksymalnie 640 × 640 px i zapisane jako JPEG bez EXIF. Okrągły widok pokazuje środek zdjęcia; najlepiej wybierać fotografie, na których twarz znajduje się blisko środka kadru.

Portrety w magazynie są publiczne, tak jak fotografie prac. Prawo przesyłania i usuwania ma wyłącznie redakcja. Plik używany przez profil jest chroniony przed usunięciem; wymiana najpierw zapisuje nowy plik i profil, a dopiero potem usuwa poprzedni. Nieudany zapis profilu usuwa nowo przesłany, nieprzypisany portret. Aplikacja obsługuje te operacje przy użyciu sesji użytkownika i publicznego klucza; klucz administracyjny nie jest częścią formularza.
