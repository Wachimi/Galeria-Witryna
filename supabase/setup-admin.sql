-- Uruchom w SQL Editor po utworzeniu swojego konta w Authentication → Users.
-- Wpisz adres tego konta zamiast WPISZ_SWÓJ_EMAIL. Wynik powinien zawierać jeden wiersz.
-- Skrypt zadziała także dla konta utworzonego przed migracją i bez profilu.
insert into public.profiles (id, display_name, role)
select id, 'Administrator galerii', 'admin'::public.user_role
from auth.users
where lower(email) = lower('WPISZ_SWÓJ_EMAIL')
on conflict (id) do update
set role = 'admin', display_name = excluded.display_name
returning id, display_name, role;
