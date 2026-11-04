-- Öğretmen hesabı: "Şifre belirle" için öğretmen e-postasının yanında öğretmen (ya da yönetici) işaretli bir hesapla
-- giriş yapılmış olması da gerekir. İşaret yalnız Supabase panelinden verilir; kullanıcıların güncelleme izni yoktur.
alter table public.profiller add column ogretmen boolean not null default false;
