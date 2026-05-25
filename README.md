# EsporGO - Ücretsiz Yayına Hazır MVP

EsporGO; farklı oyunlardan oyuncuların takım arkadaşı bulması, takım kurması ve turnuva ilanlarını takip etmesi için hazırlanmış ücretsiz statik MVP sitesidir.

## İçerik

- `index.html` ana sayfa
- `assets/styles.css` modern responsive tasarım
- `assets/app.js` filtreleme, oyuncu ilanı, takım ilanı, admin demo paneli
- `manifest.webmanifest` mobil kısayol/PWA başlangıcı
- `assets/favicon.svg` logo simgesi

## Özellikler

- Çok oyunlu oyuncu filtreleme
- Oyuncu profili oluşturma
- Takım ilanı oluşturma
- Turnuva vitrini
- Admin panel demo görünümü
- Mobil uyumlu tasarım
- SEO meta etiketleri
- Tarayıcı hafızasıyla demo veri saklama

## Önemli Not

Bu ilk sürüm gerçek hosta yüklenebilen statik MVP'dir. Kayıtlar şu an sadece kullanıcının tarayıcısında `localStorage` ile saklanır. Herkese açık gerçek üyelik, mesajlaşma ve veritabanı için sonraki aşamada Firebase veya Supabase bağlantısı gerekir.

## En Kolay Ücretsiz Yayınlama: GitHub Pages

1. GitHub hesabına gir.
2. Yeni repository oluştur: `EsporGO`
3. Bu klasördeki dosyaları repository içine yükle.
4. Repository içinde `Settings > Pages` bölümüne gir.
5. `Deploy from a branch` seç.
6. Branch: `main`, folder: `/root` seç.
7. Save de.
8. Birkaç dakika sonra site şu mantıkta açılır: `https://kullanici-adin.github.io/EsporGO/`

## Alternatif: Cloudflare Pages

1. Cloudflare hesabı aç.
2. Workers & Pages > Pages > Create project.
3. GitHub repository bağla.
4. Build command boş bırak.
5. Output directory `/` veya boş bırak.
6. Deploy de.

## Geliştirme Yol Haritası

1. Ücretsiz statik yayın
2. Firebase/Supabase ile gerçek kayıt sistemi
3. Oyuncu/takım/turnuva veritabanı
4. Başvuru sistemi
5. Mesajlaşma veya Discord entegrasyonu
6. Admin panelinde ilan onaylama/silme
7. Sponsor ve premium takım vitrini
