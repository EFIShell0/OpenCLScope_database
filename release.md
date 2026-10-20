# OpenCLScope™ Database 3.0.25

## VulkanScope™ Database 1.4.12 karşılaştırması — Aşama 15

Bu sürüm, OpenCLScope Database 3.0.23 temel alınarak VulkanScope 1.4.12 arayüzündeki gezinme, kaydırma ve rapor tablosu kontrollerinin kaynak koduyla karşılaştırılması sonucu hazırlanmıştır.

### Arayüz ve çalışma yapısı

- Tablo yatay sürükleme/klavye/kaydırma çubuğunun varsayılan kırmızı tonları kaldırıldı; pasif hâl nötr gri, etkileşim hâli OpenCL™ yeşili oldu. Dikey özel sayfa çubuğu da aynı prensibi izliyor. Kırmızı gerçek Error durumunu belirtmeye devam ediyor.
- Gezinme sekmeleri VulkanScope'un gerçek `nav-button` sınıfı ve ok kontrolleriyle bağlandı. Aktif durum, düğme boyu, odak, kaydırma ve duyarlı yerleşimler yeniden düzenlendi.
- AMOLED arka plan, üst çubuk, hero ve ortak koyu bileşen yüzeyleri VulkanScope'un geometrisine yaklaştırıldı. Marka rengi OpenCL™ yeşili kaldı.
- Reports tablosu yeniden düzenlenerek ayrı Logo, OpenCL™ API, rapor sürümü, rapor ID ve işlem sütunları elde edildi. Submitted, Vendor ve Type başlıkları artık VulkanScope'taki gibi açılıp kapanan kontrollerdir.
- Gösterilen tarih bilgileri server-side `submitted_at` kaydından UTC olarak türetiliyor; asıl cihazın gönderim saat dilimi veya DST durumu uydurulmuyor.
- Reports toolbar sort/per-page kontrolleri genel filtrelerle aynı `state` üzerinden çalışır; doküman kurallarındaki 25/50/100 sayfa sınırları korunmuştur.
- `false`, `0`, Unknown, Unavailable, Error, Not Applicable durumları, D1 şeması, cache, hash doğrulaması ve OpenCLScope 3.0.8 producer sözleşmesi değiştirilmedi.

### Doğrulama sınırları

Bu sürüm her sayfanın VulkanScope ile yüzde yüz piksel eşitliğini veya tüm canlı ağ davranışlarını doğrulamıyor. Sabit referans CSS değiştirilmedi. Tüm OpenCL kategorilerinin birebir Vulkan teknik alanlarına eşitlenmesi veri semantiği açısından uygun değildir. Detaylar `FULL_VULKAN_DESIGN_COMPARISON_3.0.25.md` ve `QA_RESULTS.md` içinde.

## 3.0.25 — Reports control and sorting parity

- Implemented 14 OpenCL-relevant report sort modes inspired by VulkanScope 1.4.12 without Vulkan-only fields.
- Kept report toolbar visible when the index is empty or no filters match.
- Matched disclosure button glyphs and synchronized horizontal track geometry after column animation.
- Preserved pinned Khronos® OpenCL™ XML, Producer/Worker admission, registry, report cache and neutral scrollbar palette.
- Live Cloudflare deployment was not attempted.
