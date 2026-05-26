# EsporGO V3 REAL PLATFORM

Bu paket EsporGO'nun çok sayfalı, Firebase bağlantılı, admin onaylı ve profesyonel temalı V3 sürümüdür.

## En önemli uyarı

GitHub'da daha önce doldurduğun `firebase-config.js` dosyasını **silme ve üzerine yazma**.

Bu pakette `firebase-config.js` yoktur. Bilerek eklenmedi. Çünkü mevcut çalışan Firebase bağlantı dosyan korunmalı.

Bu paketi yüklerken repo kökünde şu dosya zaten durmalı:

```text
firebase-config.js
```

Eğer yanlışlıkla sildiysen `firebase-config.example.js` dosyasını `firebase-config.js` olarak yeniden adlandırıp Firebase Console'daki config bilgilerini tekrar içine koyman gerekir.

## V3 dosya yapısı

GitHub reposunda son görünüm şöyle olmalı:

```text
EsporGO/
├─ index.html
├─ players.html
├─ teams.html
├─ tournaments.html
├─ dashboard.html
├─ login.html
├─ admin.html
├─ firebase-config.js              <-- eski çalışan dosyan, korunacak
├─ firebase-config.example.js      <-- sadece örnek
├─ firestore.rules
├─ README_V3_KURULUM.md
├─ .nojekyll
└─ assets/
   ├─ css/
   │  └─ style.css
   └─ js/
      ├─ admin.js
      ├─ cards.js
      ├─ dashboard.js
      ├─ data.js
      ├─ firebase-service.js
      ├─ home.js
      ├─ login.js
      ├─ players.js
      ├─ teams.js
      ├─ tournaments.js
      └─ utils.js
```

## Eski Firebase kurulumu tekrar yapılacak mı?

Hayır. Şunlar aynı kalır:

- Firebase projesi
- Authentication Email/Password ayarı
- Authorized domain: `raizela.github.io`
- Firestore Database
- Kayıtlı kullanıcılar
- Admin hesabın
- Mevcut `firebase-config.js`

Sadece Firestore Rules bölümünü V3 kurallarına güncellemen önerilir.

## Firestore Rules güncelleme

Firebase Console > Firestore Database > Rules bölümüne gir.

Mevcut kuralları silip bu paketteki `firestore.rules` içeriğini yapıştır ve Publish/Yayınla de.

Bu V3 kuralları şunları destekler:

- Kullanıcı kayıt oluşturabilir.
- Kullanıcı kendi profil bilgilerini güncelleyebilir ama kendini admin yapamaz.
- Admin oyuncu onaylayabilir/reddedebilir.
- Admin takımı onaylayabilir/reddedebilir.
- Public oyuncular ve public takımlar herkes tarafından okunabilir.
- Takım başvuruları, turnuva talepleri ve rapor sistemi desteklenir.

## Admin paneli

Admin paneli ana menüde görünmez. Elle şu adresten açılır:

```text
https://raizela.github.io/EsporGO/admin.html
```

Admin olmayan hesaplar panel verilerini okuyamaz.

## V3'te gelen ana özellikler

- Çok sayfalı profesyonel yapı
- Ana sayfa
- Oyuncu Bul sayfası
- Takım İlanları sayfası
- Turnuvalar sayfası
- Kayıt/Giriş sayfası
- Kullanıcı paneli
- Gizli admin paneli
- 81 il desteği
- 30+ güncel/popüler oyun
- Oyuna göre dinamik rank sistemi
- Oyuna göre dinamik rol sistemi
- Admin onaylı oyuncu yayını
- Admin onaylı takım ilanı
- Turnuva talebi sistemi
- Takım başvuru sistemi
- Rapor altyapısı
- Mobil uyumlu karanlık premium tema
- GitHub Pages uyumlu dosya yapısı

## Yükleme yöntemi

1. GitHub'da EsporGO reposuna gir.
2. `firebase-config.js` dosyasına dokunma.
3. Bu paketteki dosyaları yükle.
4. Eski V2 dosyalarının üzerine yazılmasına izin ver.
5. `firebase-config.example.js` dosyasını yüklemek sorun değildir, ama site onu kullanmaz.
6. Firestore Rules kısmını güncelle.
7. Siteyi Ctrl + F5 ile yenile.

Site adresi:

```text
https://raizela.github.io/EsporGO/
```

## Sorun çözme

### Site açılıyor ama kayıt çalışmıyor
`firebase-config.js` dosyası yok, yanlış yerde veya içindeki bilgiler hatalı olabilir.

### Missing or insufficient permissions
Firestore Rules güncellenmemiş olabilir.

### Admin paneli boş veya yetkisiz diyor
Firestore > users içinde kendi kullanıcı dokümanında `role` alanı `admin` olmalı.

### Oyuncu kayıt oluyor ama Oyuncu Bul sayfasında görünmüyor
Bu normaldir. Admin panelden oyuncuyu onaylaman gerekir.

### Takım ilanı görünmüyor
Takım ilanı önce `teamRequests` içine pending olarak düşer. Admin panelden onaylanınca `publicTeams` içine kopyalanır ve Takımlar sayfasında görünür.
