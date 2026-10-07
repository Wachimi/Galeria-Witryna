# Import artystów — 7 października 2026

W Supabase zapisano 95 opublikowanych profili: dodano 92 nowe rekordy i zastąpiono krótkie opisy startowe pełnymi biografiami Marka Andały, Piotra Fąfrowicza i Jerzego Tyburskiego. Ich identyfikatory, adresy i powiązania z pięcioma pracami pozostały niezmienione. Prace i zdjęcia nie były przedmiotem tego importu.

## Kompletność i źródła

Zebrano 96 różnych profili z list [Malarstwo](https://galeria-witryna.pl/malarstwo/), [Grafika i rzeźba](https://galeria-witryna.pl/grafika-i-rzezba/) oraz publicznego katalogu kategorii WooCommerce (`/wp-json/wc/store/v1/products/categories?per_page=100&hide_empty=false`). Ujęto również profile Grażyny Grabowskiej, Hanny Korzeniowskiej i Leszka Harasimowicza, pominięte w ręcznej liście starej strony. Wojciech Górecki ma jeden profil zamiast osobnych profili dla malarstwa i grafiki. Robert Żybura jest jedynym profilem odłożonym do ręcznego dodania.

Pełne teksty, źródła poszczególnych profili i informacje o brakach zapisano w [zestawie importu](../supabase/imports/artists-2026-10-07.json). HTML, podpisy zdjęć, shortcode WordPressa i techniczny napis „SONY DSC” usunięto. Oczywistą usterkę „NowyMarek Andałam Sączu” poprawiono na „Nowym Sączu”, a zepsuty tekst odnośnika usunięto z biografii Wilgi Badowskiej. Pozostałą treść zachowano, bez dopisywania osiągnięć ani aktualizacji dawnych informacji na podstawie domysłów.

Biografii brakuje w źródle dla jedenastu osób:

- Agnieszka Kotela
- Anatol Martyniuk
- Barbara Drelich
- Barbara Kasza
- Iwona Kaus
- Janusz Rybczyński
- Kornel Wilczek
- Maria Radomska-Grobelska
- Michał Otulski
- Natalia Prokopiak
- Tadeusz Kuduk

Te profile zawierają wyłącznie zdanie „Artysta prezentowany w Galerii Witryna.”, a nie wymyśloną biografię. Barbara Kasza i Michał Otulski mają w danych źródłowych zdjęcie, ale nie tekst biografii. Tadeusz Kuduk występuje na liście malarstwa, jednak odnośnik profilu zwraca 404 i nie ma odpowiadającej kategorii w API; jako źródło jego obecności zapisano listę malarstwa.

Jarosław Filipek i Bartos Saro mają w starym katalogu identyczne biografie, ale osobne profile i prace. Zachowano oba rekordy; ich ewentualne połączenie wymaga potwierdzenia przez galerię.

## Powtórzenie importu

Skrypt jest lokalnym narzędziem. Aplikacja i panel nadal korzystają z publicznego klucza oraz sesji użytkownika; nie korzystają z klucza administracyjnego importu. `SUPABASE_SECRET_KEY` znajduje się wyłącznie w ignorowanym pliku `.env.local`. Nie należy dodawać prefiksu `NEXT_PUBLIC_` ani umieszczać klucza w GitHubie.

Podgląd bez zapisu:

```powershell
npm run import:artists
```

Zapis po sprawdzeniu podglądu:

```powershell
npm run import:artists -- --apply
```

Przed zapisem powstaje lokalna kopia artystów i prac w `.tmp/artist-import-<data>/before.json`. Skrypt pomija istniejące profile, zachowuje ich ręczne zmiany i status publikacji. Wyjątkiem jest zastąpienie dokładnie rozpoznanych trzech opisów startowych. Wyszukuje również istniejące profile po nazwie i źródle, aby zmiana adresu przez redaktora nie tworzyła duplikatu. Niejednoznaczne duplikaty zatrzymują cały import przed zapisem. Po zapisie sprawdza kompletność, zachowanie identyfikatorów, brak zmian w pracach oraz to, że powtórzenie nie wymaga nowych zapisów.

## Artysta do ręcznego testu

W panelu wybierz **Artyści → Dodaj artystę** i użyj:

- Imię i nazwisko: **Robert Żybura**
- Adres strony: `robert-zybura`
- Status: najpierw **Szkic**, potem **Opublikowany**

Biografia do wklejenia ze [starego profilu](https://galeria-witryna.pl/kategoria-produktu/malastwo/robert-zybura/):

> Urodził się w 1964 roku w Tarnowie.
>
> Absolwent Państwowej Wyższej Szkoły Sztuk Plastycznych we Wrocławiu – wydział malarstwo, grafika, rzeźba.
>
> Dyplom z malarstwa w 1992 roku (wyróżnienie) w pracowni Wandy Gołkowskiej, z grafiki w pracowni Romana Kowalika.
>
> Zajmuje się malarstwem, grafiką i rysunkiem.

Sprawdź, że szkic widzisz w panelu, lecz nie w publicznym katalogu. Po publikacji profil powinien pojawić się pod `/artysci/robert-zybura`. Następnie popraw jedno zdanie, zapisz i sprawdź zmianę na stronie.
