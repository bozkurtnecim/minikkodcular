# Minik Kodcular

Okul öncesi (4–6 yaş) çocuklar için okuma gerektirmeyen kodlama ve düşünme oyunları.
Her oyunda kolaydan zora 30 bölüm vardır; bölümler sırayla açılır.

Kategoriler: Kodlama Oyunları, Yapboz ve Şekiller, Sıralama, Örüntü ve Hafıza, Mantık ve Bulmaca.

## Çalıştırma

Sunucu ya da derleme gerekmez: `index.html` dosyasını bir tarayıcıda açmak yeterlidir.
Site sabit dosyalardan oluşur (HTML + JavaScript), GitHub Pages gibi her statik barındırmada çalışır.

- `index.html`: sayfa ve ortak görünüm
- `js/`: uygulama iskeleti (yönlendirme, ses, kayıt, sesli yönerge), resim ve nesne kütüphaneleri
- `oyunlar/`: her oyun kendi dosyasında (`haftaNN-*.js`)

Çocuğun ilerlemesi tarayıcının yerel deposunda (localStorage) saklanır.

## Öğretmen modu

Anaokulu sayfasındaki "Öğretmen modu" düğmesi öğretmenin e-postasına bir giriş kodu gönderir (Supabase Auth).
Kod doğrulanınca o cihazda bütün bölümler açılır ve oyunlarda "Cevabı göster" düğmesi çıkar.
Supabase istemci kütüphanesi `js/vendor/` içindedir (MIT).

## Hesaplar ve ilerleme

Sağ üstteki "Giriş yap" düğmesiyle kullanıcı adı ve şifreyle kayıt olunur ya da giriş yapılır.
E-posta isteğe bağlıdır; yazılırsa "Şifremi unuttum" ile o adrese kod gönderilir.
"Beni hatırla" seçilirse oturum tarayıcıda kalır. Girişliyken oyun ilerlemesi Supabase'deki
`ilerleme` tablosuna yazılır ve başka cihazda girişte birleştirilir; çıkışta cihazdaki ilerleme silinir.

- `supabase/functions/hesap/`: kayıt, giriş ve şifre sıfırlama (Edge Function, verify_jwt kapalı)
- `supabase/migrations/`: `profiller` ve `ilerleme` tabloları, satır düzeyinde güvenlik kuralları
