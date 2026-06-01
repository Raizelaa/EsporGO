# EsporGO V4 Professional Platform

Bu paket, EsporGO'nun çok sayfalı profesyonel platform sürümüdür.

## En önemli kural

GitHub'daki mevcut `firebase-config.js` dosyanı **silme** ve **üzerine yazma**.
Firebase bağlantı bilgilerin o dosyanın içinde olduğu için V4, aynı Firebase projesini kullanmaya devam eder.

## Dosya yapısı

Doğru GitHub görünümü şöyle olmalı:

```text
EsporGO
├─ index.html
├─ players.html
├─ teams.html
├─ tournaments.html
├─ referees.html
├─ dashboard.html
├─ login.html
├─ admin.html
├─ style.css
├─ data.js
├─ app.js
├─ firebase-service.js
├─ firebase-config.js          ← Eski çalışan dosyan kalacak
├─ firebase-config.example.js
├─ firestore.rules
├─ README_V4_KURULUM.md
└─ .nojekyll
```

## Yükleme adımları

1. Zip dosyasını bilgisayarında çıkar.
2. GitHub > EsporGO > Kod bölümüne gir.
3. `firebase-config.js` hariç eski dosyaları silebilirsin.
4. Bu paketteki dosyaları repo ana dizinine yükle.
5. `Commit changes / Değişiklikleri işle` butonuna bas.
6. GitHub Pages güncellemesi için 2-10 dakika bekle.
7. Siteyi şu linkten kontrol et:

```text
https://raizela.github.io/EsporGO/?v=4
```

## Firebase Rules güncellemesi

Firebase Console > Firestore Database > Rules bölümüne gir.
Bu paketteki `firestore.rules` dosyasındaki kuralları tamamen kopyala ve Rules alanına yapıştır.
Sonra `Publish / Yayınla` butonuna bas.

Bu işlem Firebase'i baştan kurmaz; sadece V4 özelliklerine izin veren güvenlik kurallarını günceller.

## Admin panel

Admin panel sitede görünmez. Elle şu adresten açılır:

```text
https://raizela.github.io/EsporGO/admin.html
```

Admin hesabının Firestore'daki `users/{uid}` dokümanında şu alanlara sahip olması gerekir:

```text
role: admin
status: approved
verified: true
```

## V4 modülleri

- Oyuncu Bul
- Takım ilanları
- Takıma başvuru
- Turnuva vitrini
- Turnuva talebi
- Turnuva kayıt talebi
- Hakem profilleri
- Hakem başvurusu
- Kullanıcı paneli
- Bildirimler
- Favoriler
- Rapor et sistemi
- Gizli admin panel
- Admin onay / red sistemi
- Admin işlem geçmişi

## CSS sorunu yaşamamak için

Bu sürümde tema dosyası `assets/css` içinde değil, direkt ana dizindeki `style.css` dosyasındadır.
Bu yüzden GitHub'a klasör yükleme hatası yaşansa bile ana tema dosyasını takip etmek daha kolaydır.
