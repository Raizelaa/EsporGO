# EsporGO REAL PRO Kurulum Rehberi

Bu paket EsporGO sitesinin gerçek üyelik ve admin onay sistemi olan ileri seviye sürümüdür.

## Pakette neler var?

- `index.html` — Ana site, oyuncu arama, gerçek kayıt, giriş, profil durumu ve takım ilanı oluşturma.
- `admin.html` — Gizli admin paneli. Ana sitede hiçbir yerde linki yoktur.
- `firebase-config.js` — Firebase bağlantı bilgilerini yapıştıracağın dosya.
- `firestore.rules` — Firestore güvenlik kuralları.

## Gerçek kayıt sistemi nasıl çalışıyor?

1. Kullanıcı e-posta ve şifreyle kayıt olur.
2. Firebase Auth hesabı açılır.
3. Profil bilgileri Firestore `users` koleksiyonuna `pending` durumuyla düşer.
4. Admin `/admin.html` paneline girer.
5. Oyuncuyu onaylarsa profil `publicPlayers` koleksiyonuna kopyalanır ve ana sitede görünür.
6. Takım ilanları da aynı şekilde önce `teamRequests`, sonra onaylanınca `publicTeams` koleksiyonuna düşer.

## Firebase kurulumu

1. Firebase Console'a gir.
2. Yeni proje oluştur: `EsporGO`.
3. Build > Authentication > Sign-in method kısmından `Email/Password` giriş yöntemini etkinleştir.
4. Build > Firestore Database kısmından veritabanı oluştur.
5. Firestore Rules bölümüne `firestore.rules` dosyasındaki kuralları yapıştır ve yayınla.
6. Project Settings > Your apps > Web app kısmından web uygulaması oluştur.
7. Firebase'in verdiği config bilgilerini `firebase-config.js` dosyasındaki alanların yerine yaz.
8. Dosyaları GitHub Pages reposuna yükle.

## İlk admin hesabını oluşturma

1. Ana siteden normal kayıt ol.
2. Firebase Console > Firestore Database > `users` koleksiyonuna gir.
3. Kendi kullanıcı dokümanını aç.
4. `role` alanını `player` yerine `admin` yap.
5. `status` alanını `approved` yapabilirsin.
6. Sonra şu adrese elle gir: `https://kullanici-adin.github.io/EsporGO/admin.html`

Not: Admin linki ana sitede görünmez. Ama URL bilinirse sayfa açılır; yetkisiz hesaplar panele giremez.

## Türkiye şehirleri

Şehir seçme sistemine Türkiye'nin 81 ili eklendi:
Adana, Adıyaman, Afyonkarahisar, Ağrı, Amasya, Ankara, Antalya, Artvin, Aydın, Balıkesir, Bilecik, Bingöl, Bitlis, Bolu, Burdur, Bursa, Çanakkale, Çankırı, Çorum, Denizli, Diyarbakır, Edirne, Elazığ, Erzincan, Erzurum, Eskişehir, Gaziantep, Giresun, Gümüşhane, Hakkâri, Hatay, Isparta, Mersin, İstanbul, İzmir, Kars, Kastamonu, Kayseri, Kırklareli, Kırşehir, Kocaeli, Konya, Kütahya, Malatya, Manisa, Kahramanmaraş, Mardin, Muğla, Muş, Nevşehir, Niğde, Ordu, Rize, Sakarya, Samsun, Siirt, Sinop, Sivas, Tekirdağ, Tokat, Trabzon, Tunceli, Şanlıurfa, Uşak, Van, Yozgat, Zonguldak, Aksaray, Bayburt, Karaman, Kırıkkale, Batman, Şırnak, Bartın, Ardahan, Iğdır, Yalova, Karabük, Kilis, Osmaniye, Düzce

## Oyun listesi

Popüler rekabetçi oyunlar, e-spor oyunları ve Türkiye kitlesi olan RP/FPS oyunları eklendi. Her oyunda rank seçenekleri ayrı yönetilir. Yeni oyun eklemek için `index.html` içindeki `GAMES` listesini düzenleyebilirsin.

## GitHub Pages için önemli

GitHub reposunun kökünde şu dosyalar olmalı:

```text
index.html
admin.html
firebase-config.js
firestore.rules
README_KURULUM.md
```

`index.html` klasör içinde kalırsa site düzgün açılmaz.
