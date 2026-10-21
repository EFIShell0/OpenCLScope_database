# OpenCLScope Database 3.0.28 — VulkanScope kaynak karşılaştırması

## Sabit kaynaklar

- Başlangıç: OpenCLScope Database 3.0.27 (452 dosya).
- Tasarım/etkileşim referansı: VulkanScope Database 1.4.12 (840 dosya).
- Özgün Vulkan CSS (`assets/site.v1412.css`) ile paketlenmiş OpenCL salt okunur referansı (`assets/vulkan-layout.v1412.css`): aynı SHA-256 `bd5957461701439a7655c652b4e560cb84b7cc0163f202a257e019c2c468181b`.
- Resmî OpenCL `registry/cl.xml` SHA-256: `c24f63ad9aa5776fe67808926ae85613248ebbeefa7373fceb406a0bd12ce016` (değiştirilmedi).

## Dosya ve kod düzeyinde karşılaştırma

| Alan | VulkanScope 1.4.12 | OpenCLScope 3.0.27 | OpenCLScope 3.0.28 |
|---|---|---|---|
| Statistics veri görselleştirmesi | `distribution-grid` / `distribution-card` / `donut-wrap` / `donut-chart` / `donut-center` / `chart-legend` | Ayrı `stats-donut-svg`, `stats-donut-legend` ve özel renk dizisi | Referansın sınıf, SVG pathLength ve yerleşim modelini kullanan yeni grafik |
| Dağılım paydası | Filtreli gerçek kayıt sayısı | Her grafiğe ait gerçek cihaz/platform/rapor paydası | Aynı gerçek OpenCL paydaları korunarak yeni bileşende kullanılıyor |
| Grafik renkleri | Vulkan kırmızı/mor/mavi kategorileri | OpenCL'e özel yeşil renk listesi | Referansın `chart-stroke-*`/`chart-fill-*` sınıfları; OpenCL yeşili ve nötr kategorik tonlarla scoped renkler |
| Query durum çubukları | Semantik renkler, eşsiz baskın yüzde etiketi | Semantik dolgu, tüm yüzde etiketleri nötr | Tek baskın durumun metni semantik renkte; en yüksek değer eşitse tüm değerler nötr |
| Extensions `Reset` | Kendi filtrelerini sıfırlar | Yanlışlıkla Statistics ayarlarını sıfırlıyor | Yalnızca `extension*` durum alanlarını ve ilgili ekranı sıfırlıyor |

## Değişikliklerin kapsamı

- `assets/app.v1028.js`: `statsDonut` SVG/legend renderer yeniden kuruldu; Statistics başlığı ve baskın yüzdelik görünümü eklendi; Extensions Reset yanlış durum bağlantısı düzeltildi.
- `assets/parity.v1028.css`: upstream Statistics chart markup için kapsamlı uyum stilleri ve duruma göre yüzde renkleri. `vulkan-layout.v1412.css` birebir sabit kaldı.
- `tests/release-1028-statistics-parity.test.mjs`: grafik sınıfları, sınırlı `Other` gruplaması, yüzde paydası, baskın durum ve reset izolasyonu doğrulamaları.
- Test envanteri, kaynak sürüm adları, Worker sürüm belirteci ve statik snapshot/release ID birlikte güncellendi. **Worker'ın doğrulama, D1, cache ve gönderim kabul mantığı değiştirilmedi.**

## Henüz eşitlenmeyenler

Tam VulkanScope ekran şablonları, Reports tablo etkileşimlerinin bütünü, Settings/modal/tooltip animasyonları, tüm mobil durumlar ve gerçek rapor veri setiyle piksel karşılaştırması birebir doğrulanmış değildir. Vulkan'a özgü Surface/HDR, `VK_FORMAT` ve kuyruk kuralları OpenCL şemasına eklenmedi. Gerçek Cloudflare dağıtımı test edilmedi.
