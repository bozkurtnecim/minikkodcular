-- Yönetici hesabı: "Hesaba gir" için öğretmen e-postasının yanında bu hesapla giriş yapılmış olması da gerekir
alter table public.profiller add column yonetici boolean not null default false;
