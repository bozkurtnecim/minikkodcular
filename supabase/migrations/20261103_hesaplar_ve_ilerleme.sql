-- Kullanıcı profili: giriş kullanıcı adıyla yapılır; e-posta isteğe bağlıdır (şifre sıfırlama için)
create table public.profiller (
  id uuid primary key references auth.users(id) on delete cascade,
  kullanici_adi text not null,
  eposta text,
  olusturma timestamptz not null default now()
);
create unique index profiller_kullanici_adi_tekil on public.profiller (lower(kullanici_adi));
alter table public.profiller enable row level security;
create policy "kendi profilini okur" on public.profiller for select to authenticated using ((select auth.uid()) = id);

-- Oyun ilerlemesi: kullanıcı başına tek satır, oyun anahtarı → ilerleme
create table public.ilerleme (
  kullanici_id uuid primary key references auth.users(id) on delete cascade,
  veri jsonb not null default '{}'::jsonb,
  guncelleme timestamptz not null default now()
);
alter table public.ilerleme enable row level security;
create policy "kendi ilerlemesini okur" on public.ilerleme for select to authenticated using ((select auth.uid()) = kullanici_id);
create policy "kendi ilerlemesini ekler" on public.ilerleme for insert to authenticated with check ((select auth.uid()) = kullanici_id);
create policy "kendi ilerlemesini günceller" on public.ilerleme for update to authenticated using ((select auth.uid()) = kullanici_id) with check ((select auth.uid()) = kullanici_id);
