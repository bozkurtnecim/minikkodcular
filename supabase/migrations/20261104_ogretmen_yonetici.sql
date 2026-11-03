-- Yönetici: kullanıcı adıyla başka hesaplara (yardım için) girebilen öğretmen
alter table public.ogretmenler add column yonetici boolean not null default false;

-- Giriş yapmış öğretmen kendi yetkisini öğrenir (oturumdaki e-postaya göre)
create function public.ogretmen_yetkim() returns text
language sql stable security definer set search_path = ''
as $$
  select case when o.yonetici then 'yonetici' else 'ogretmen' end
  from public.ogretmenler o
  where lower(o.eposta) = lower((select auth.jwt() ->> 'email'))
$$;
revoke all on function public.ogretmen_yetkim() from public;
grant execute on function public.ogretmen_yetkim() to authenticated;
