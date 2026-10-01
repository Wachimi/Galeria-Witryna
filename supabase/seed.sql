-- Opcjonalny katalog startowy. Uruchom po migracji; można powtórzyć bez duplikatów.
-- Zdjęcia tych rekordów są częścią public/images w repozytorium.
begin;
insert into public.artists (id, slug, name, biography, status, source_url) values
('10000000-0000-4000-8000-000000000001', 'marek-andala', 'Marek Andała', 'Artysta prezentowany w Galerii Witryna. W katalogu galerii znajduje się jego pastelowy pejzaż „Tatary”.', 'published', 'https://galeria-witryna.pl/kategoria-produktu/malastwo/marek-andala/'),
('10000000-0000-4000-8000-000000000002', 'piotr-fafrowicz', 'Piotr Fąfrowicz', 'Artysta związany z Galerią Witryna. Prezentowane prace obejmują malarstwo olejne i temperę na papierze.', 'published', 'https://galeria-witryna.pl/kategoria-produktu/malastwo/piotr-fafrowicz-malastwo/'),
('10000000-0000-4000-8000-000000000003', 'jerzy-tyburski', 'Jerzy Tyburski', 'Artysta prezentowany w Galerii Witryna. Wśród jego prac w katalogu znajdują się obrazy olejne „Afternoon” i „Burza”.', 'published', 'https://galeria-witryna.pl/kategoria-produktu/malastwo/jerzy-tyburski/')
on conflict (id) do nothing;

insert into public.artworks (id, artist_id, slug, title, category, technique, dimensions, year, description, image_path, image_alt, availability, status, source_url) values
('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000002', 'wawoz-korzeniowy', 'Wąwóz korzeniowy', 'malarstwo', 'olej, płótno', '45 × 45 cm', 2024, 'Obraz z kolekcji prezentowanej w Galerii Witryna.', '/images/fafrowicz-wawoz.jpg', 'Obraz Wąwóz korzeniowy Piotra Fąfrowicza', 'unknown', 'published', 'https://galeria-witryna.pl/kategoria-produktu/malastwo/piotr-fafrowicz-malastwo/'),
('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000003', 'afternoon', 'Afternoon', 'malarstwo', 'olej, płótno', '80 × 60 cm', 2023, 'Obraz z kolekcji prezentowanej w Galerii Witryna.', '/images/tyburski-afternoon.jpg', 'Obraz Afternoon Jerzego Tyburskiego', 'unknown', 'published', 'https://galeria-witryna.pl/kategoria-produktu/malastwo/jerzy-tyburski/'),
('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', 'tatary', 'Tatary', 'malarstwo', 'pastel', '30 × 60 cm', 2021, 'Pejzaż z kolekcji prezentowanej w Galerii Witryna.', '/images/andala-tatary.jpg', 'Pastel Tatary Marka Andały', 'unknown', 'published', 'https://galeria-witryna.pl/kategoria-produktu/malastwo/marek-andala/'),
('20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000002', 'stare-miasto', 'Stare Miasto', 'malarstwo', 'tempera, papier', '33 × 33 cm', 2019, 'Obraz z kolekcji prezentowanej w Galerii Witryna.', '/images/fafrowicz-stare-miasto.jpg', 'Obraz Stare Miasto Piotra Fąfrowicza', 'unknown', 'published', 'https://galeria-witryna.pl/kategoria-produktu/malastwo/piotr-fafrowicz-malastwo/'),
('20000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000003', 'burza', 'Burza', 'malarstwo', 'olej, płótno', '100 × 70 cm', 2023, 'Obraz z kolekcji prezentowanej w Galerii Witryna.', '/images/tyburski-burza.jpg', 'Obraz Burza Jerzego Tyburskiego', 'unknown', 'published', 'https://galeria-witryna.pl/kategoria-produktu/malastwo/jerzy-tyburski/')
on conflict (id) do nothing;
commit;
