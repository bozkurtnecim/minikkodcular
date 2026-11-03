-- Öğretmen modunu açabilecek e-postalar. Site yöneticisi Table Editor'dan satır ekler.
create table public.ogretmenler (
  eposta text primary key,
  ad text,
  eklenme timestamptz not null default now()
);
create unique index ogretmenler_eposta_kucuk on public.ogretmenler (lower(eposta));
alter table public.ogretmenler enable row level security;
-- Politika yok: liste dışarıdan okunamaz, yalnız aşağıdaki fonksiyon "var mı" diye bakar.

create function public.ogretmen_mi(p_eposta text) returns boolean
language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.ogretmenler where lower(eposta) = lower(trim(p_eposta))) $$;
revoke all on function public.ogretmen_mi(text) from public;
grant execute on function public.ogretmen_mi(text) to anon, authenticated;
