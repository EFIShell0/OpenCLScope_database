# OpenCLScope Database 3.0.27 — kaynak kodu karşılaştırması

## Referanslar

- Açılan başlangıç: OpenCLScope Database **3.0.26** (`OpenCLScope-Database-3.0.26.zip`).
- Sabit görsel ve davranış referansı: VulkanScope Database **1.4.12** (`VulkanScope-Database-1.4.12(1).zip`).
- Referans CSS: `assets/vulkan-layout.v1412.css`; upstream `assets/site.v1412.css` ile SHA-256 eşitliği doğrulandı: `bd5957461701439a7655c652b4e560cb84b7cc0163f202a257e019c2c468181b`.
- Orijinal OpenCL sorgu kaydı, rapor imzaları, Worker/D1 ve producer POST gate kodu değişmeden tutuldu (veri semantiği Vulkan ile aynı olamaz).

## Doğrudan referanstan alınan parçalar

- Referans JS satırları **203–206**: sayfa numarası girişi, sınır kontrolü ve klavyeyle sayfaya gitme.
- Satırlar **32–40**: özel yüzey kaydırma çubuğu (ray, oklar, pointer drag, PageUp/Down, Home/End, erişilebilirlik).
- Satırlar **215–229**: filtre listbox'ın arama/sayfalama/klavye yönetimi, hareket, 50 seçenek sınırı ve seçilen gerçek native option'ın korunması. OpenCL uyarlamaları: OpenCL durum/sembol ikon eşlemesi, DOM kaçış kontrolü ve `#filterPanel` aramasının açılması.
- Satırlar **232–234**: orijinal tablo yatay kaydırma denetimi, oklar ve konum güncelleme.
- Daha önceki OpenCL `refreshCustomSelect`, `installCustomSelects` ve `enhanceTableScroller` implementasyonları referans bileşenleriyle değiştirildi.
- Eski OpenCL CSS'den yalnızca `.custom-select`, `.filter-choice-*`, `.surface-scrollbar` ile ilgili tümü eşleşen çakışan kurallar temizlendi: **16** adet site, **8** adet parity kuralı. Vulkan referans CSS dosyasının baytları değiştirilmedi.
- Mobildeki etiket sarmalayıcı yapısı VulkanScope'tan farklı olduğundan OpenCL'e özel tek sütunlu responsive düzen korundu; aksi durumda uzun seçenekler okunamıyordu.

## Davranış ve arayüz sınırları

- VulkanScope 1.4.12'nin bazı işlevleri OpenCL rapor şemasına doğrudan uygulanamaz (VK_FORMAT bitmask, Surface/WSI/HDR/queue; bunlar kopyalanmadı).
- Tam sayfa JSX/HTML markup ve tüm ekran durumlarının birebir DOM/CSS eşitliği **sağlanmış ve doğrulanmış değildir**. Özellikle Reports yerleşimi, hero, sekme sayıları ve Statistics grafik türleri referanstan hâlâ farklıdır.
- Yerel Chromium gerçek cihaz veri setini içermedi; boş kaynak snapshot ile masaüstü/mobil kontrol ve ayrı 121 öğelik sentetik filtre etkileşimi yapıldı. Bu seçenekler testte DOM'a eklenmiş, dağıtım paketine veya rapor veritabanına eklenmemiştir.
- Canlı Cloudflare ve Android rapor yükleme testi bu pakette yapılmadı.

## Gelecek satır-bazlı adaptasyon

1. VulkanScope'un Reports HTML şablonu ve hover/long-press butonlarını gerçek OpenCL rapor alanlarına yeniden eşleme.
2. Statistics dağılım grafikleri, yüzdelik bar ve tooltip'lerinin gerçek loaded denominator ile eşit görsel tasarımı.
3. Settings, modal, mobil hero/header, boş/yüklü rapor durumları için referansla görüntü farkı (pixel-diff) testi.
4. Gerçek kullanıcı raporlarıyla cache/live-sync ve sayfalamanın canlı ortamda kabul doğrulaması.
