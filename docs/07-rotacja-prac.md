# Cotygodniowa rotacja prac na stronie głównej

Sekcja „Każda praca. Osobna opowieść.” pokazuje maksymalnie trzy opublikowane prace.
Zestaw zmienia się w poniedziałek o 00:00 według strefy `Europe/Warsaw`, z uwzględnieniem
czasu letniego i zimowego. Wybór jest obliczany po stronie serwera przy wejściu na stronę.
Nie wymaga harmonogramu zadań ani ręcznej zmiany w panelu. Już otwarta strona pokaże nowy
zestaw po odświeżeniu.

Prace są porządkowane według identyfikatora, a każdy kolejny tydzień przesuwa wybór
o trzy miejsca. Po końcu listy rotacja wraca do jej początku. Każda praca uczestniczy
w rotacji; w jednym zestawie nie ma powtórzeń. Punktem początkowym jest poniedziałek
5 października 2026 r.

Przy jednej, dwóch lub trzech opublikowanych pracach strona pokazuje wszystkie.
Przy czterech lub pięciu część prac powtarza się między kolejnymi tygodniami.
Dodanie, usunięcie lub zmiana statusu publikacji zmienia listę dostępnych prac,
więc może zmienić aktualny zestaw również w trakcie tygodnia.

Implementacja: `src/lib/weekly-artworks.ts`, używana przez `src/app/(public)/page.tsx`.
Testy: `tests/weekly-artworks.test.ts`.
