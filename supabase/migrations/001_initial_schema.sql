-- Uruchom raz w SQL Editor nowego projektu Supabase.
begin;

create type public.user_role as enum ('admin', 'editor', 'viewer');
create type public.publication_status as enum ('draft', 'published');
create type public.artwork_category as enum ('malarstwo', 'grafika', 'rzezba');
create type public.artwork_availability as enum ('unknown', 'available', 'reserved', 'sold');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 160),
  role public.user_role not null default 'viewer',
  created_at timestamptz not null default now()
);

create table public.artists (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (char_length(slug) between 2 and 120 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 2 and 160),
  biography text not null check (char_length(biography) between 10 and 10000),
  status public.publication_status not null default 'draft',
  source_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.artworks (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists(id) on delete restrict,
  slug text not null unique check (char_length(slug) between 2 and 120 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 200),
  category public.artwork_category not null default 'malarstwo',
  technique text not null check (char_length(technique) between 2 and 200),
  dimensions text not null check (char_length(dimensions) between 2 and 100),
  year integer check (year between 1000 and 2100),
  description text not null check (char_length(description) between 10 and 10000),
  image_path text not null check (image_path ~ '^(/images/[a-z0-9-]+\.(jpg|png|webp)|[0-9a-f-]{36}\.jpg)$'),
  image_alt text not null check (char_length(image_alt) between 5 and 300),
  availability public.artwork_availability not null default 'unknown',
  status public.publication_status not null default 'draft',
  source_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index artworks_artist_id_idx on public.artworks(artist_id);
create index artworks_status_created_idx on public.artworks(status, created_at desc);
create index artists_status_idx on public.artists(status);

-- Rola pochodzi z tabeli chronionej RLS, a nie z metadanych edytowalnych przez użytkownika.
create function public.is_editor() returns boolean
language sql stable security definer set search_path = ''
as $$ select exists(select 1 from public.profiles where id = (select auth.uid()) and role in ('admin', 'editor')); $$;

create function public.is_admin() returns boolean
language sql stable security definer set search_path = ''
as $$ select exists(select 1 from public.profiles where id = (select auth.uid()) and role = 'admin'); $$;

create function public.create_profile() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name, role)
  values (new.id, left(coalesce(new.raw_user_meta_data->>'display_name', new.email, ''), 160), 'viewer');
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.create_profile();

create function public.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger artists_updated_at before update on public.artists for each row execute function public.set_updated_at();
create trigger artworks_updated_at before update on public.artworks for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.artists enable row level security;
alter table public.artworks enable row level security;

revoke all on public.profiles, public.artists, public.artworks from anon, authenticated;
grant select on public.artists, public.artworks to anon, authenticated;
grant insert, update on public.artists, public.artworks to authenticated;
grant select on public.profiles to authenticated;
grant update (role, display_name) on public.profiles to authenticated;
revoke all on function public.is_editor(), public.is_admin(), public.create_profile(), public.set_updated_at() from public;
grant execute on function public.is_editor(), public.is_admin() to anon, authenticated;

create policy "Własny profil lub lista administratora" on public.profiles for select to authenticated
using (id = (select auth.uid()) or (select public.is_admin()));
create policy "Administrator zmienia role" on public.profiles for update to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Opublikowani artyści lub redakcja" on public.artists for select to anon, authenticated
using (status = 'published' or (select public.is_editor()));
create policy "Redakcja dodaje artystów" on public.artists for insert to authenticated
with check ((select public.is_editor()));
create policy "Redakcja edytuje artystów" on public.artists for update to authenticated
using ((select public.is_editor())) with check ((select public.is_editor()));

create policy "Opublikowane prace lub redakcja" on public.artworks for select to anon, authenticated
using ((select public.is_editor()) or (
  status = 'published' and exists(select 1 from public.artists where artists.id = artworks.artist_id and artists.status = 'published')
));
create policy "Redakcja dodaje prace" on public.artworks for insert to authenticated
with check ((select public.is_editor()) and (status = 'draft' or exists(select 1 from public.artists where artists.id = artworks.artist_id and artists.status = 'published')));
create policy "Redakcja edytuje prace" on public.artworks for update to authenticated
using ((select public.is_editor()))
with check ((select public.is_editor()) and (status = 'draft' or exists(select 1 from public.artists where artists.id = artworks.artist_id and artists.status = 'published')));

-- Magazyn przechowuje wyłącznie publiczne fotografie dzieł, także do szkiców.
-- Opisy i rekordy szkiców są prywatne. Nie przesyłaj tu dokumentów prywatnych.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('artworks', 'artworks', true, 8388608, array['image/jpeg'])
on conflict (id) do nothing;

create policy "Redakcja przesyła zdjęcia" on storage.objects for insert to authenticated
with check (bucket_id = 'artworks' and (select public.is_editor()) and name ~ '^[0-9a-f-]{36}\.jpg$');
create policy "Redakcja odczytuje magazyn" on storage.objects for select to authenticated
using (bucket_id = 'artworks' and (select public.is_editor()));
create policy "Redakcja usuwa nieudane przesłania" on storage.objects for delete to authenticated
using (bucket_id = 'artworks' and (select public.is_editor()));

commit;
