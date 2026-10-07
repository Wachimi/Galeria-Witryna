-- Opcjonalne portrety; istniejące profile i powiązania z pracami pozostają bez zmian.
begin;

alter table public.artists add column if not exists portrait_path text;
alter table public.artists drop constraint if exists artists_portrait_path_check;
alter table public.artists add constraint artists_portrait_path_check check (
  portrait_path is null or (
    split_part(portrait_path, '/', 1) = id::text
    and portrait_path ~ '^[0-9a-f-]{36}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.jpg$'
  )
);

create index if not exists artists_portrait_path_idx on public.artists (portrait_path)
where portrait_path is not null;

-- Publiczne zdjęcia profilowe. Pliki prywatne nie powinny trafiać do tego magazynu.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('artist-portraits', 'artist-portraits', true, 5242880, array['image/jpeg'])
on conflict (id) do update set public = excluded.public,
  file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Redakcja przesyła portrety" on storage.objects;
create policy "Redakcja przesyła portrety" on storage.objects for insert to authenticated
with check (
  bucket_id = 'artist-portraits' and (select public.is_editor())
  and name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.jpg$'
);

drop policy if exists "Redakcja odczytuje portrety" on storage.objects;
create policy "Redakcja odczytuje portrety" on storage.objects for select to authenticated
using (bucket_id = 'artist-portraits' and (select public.is_editor()));

-- Usunięcie pliku jest możliwe dopiero po odłączeniu go od profilu.
drop policy if exists "Redakcja usuwa nieużywane portrety" on storage.objects;
create policy "Redakcja usuwa nieużywane portrety" on storage.objects for delete to authenticated
using (
  bucket_id = 'artist-portraits' and (select public.is_editor())
  and not exists (select 1 from public.artists where artists.portrait_path = storage.objects.name)
);

notify pgrst, 'reload schema';
commit;

select count(*) as liczba_artystow, count(portrait_path) as liczba_portretow from public.artists;
