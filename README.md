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
