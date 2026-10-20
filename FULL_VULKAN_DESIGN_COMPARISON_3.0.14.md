# OpenCLScope Database 3.0.14 — VulkanScope 1.4.12 karşılaştırması, aşama 6

## Doğrudan karşılaştırılan alanlar

- Kaynak referansı: `VulkanScope-Database-1.4.12.zip`; değiştirilen taban: `OpenCLScope-Database-3.0.13.zip`.
- **Compare sıralaması:** Önceki sürüm sadece kanonik anahtar sırasını kullanıyordu. Yeni sürüm `Evidence A–Z`, `Evidence Z–A`, `Change type`, `Evidence category`, `Baseline value`, `Target value` seçeneklerini sunar. Önce gerçek rapor kimlikleri ve durumları eşleştirilir, sonra filtrelenir, sonra kararlı biçimde sıralanır, en son sayfalanır. JSON/TXT dışa aktarma yalnızca görünen sayfayı değil, bütün filtrelenmiş ve sıralanmış kayıtları içerir; filtre açıklamasında sıralama da belirtilir.
- **Bağlam işlemleri:** Reports görünümündeki açık menü/sağ tık/uzun basma örüntüsü Compare ve genel kanıt tablolarına uygulanmıştır. Yalnızca mevcut kanıtın adını, baz/sonuç değerini veya satırını kopyalar. Uygulama ve Worker raporlarında değişiklik yapmaz. Menü Escape ve yukarı/aşağı yön tuşlarıyla kullanılabilir; sürüklenen dokunuş uzun basmayı iptal eder.
- **Mobil kaydırma:** Önceki geniş sabit Compare panelinin ekranda çok yer kaplaması için dar ekranda sabitlendiğinde otomatik daraltma eklendi. Kullanıcı genişletebilir. Dar ekranlarda durum rozetleri bölünmez ve CSS reduced-motion tercihine saygı gösterir.

## Kasten korunmuş alanlar

- OpenCL rapor şeması 1; 16 platform + 211 cihaz sorgusu; resmî `cl.xml`, Worker API/D1 semantiği, SHA-256 rapor kimlikleri ve geçmiş kayıtlar aynen korunur.
- Yeni kabul edilen Android gönderimi hâlâ OpenCLScope 3.0.8 / 30008; Database sürümü 3.0.14'tür. Geçmiş raporlar salt okuma yoluyla doğrulanır.
- Vulkan'a özel alanlar (WSI, HDR, Surface, Turnip) OpenCL'de uydurulmaz.
- Referans VulkanScope CSS kaynak dosyası ve GPU vendor resimleri bayt düzeyinde değiştirilmemiştir.

## Hâlâ açık kalan farklar

- VulkanScope 1.4.12 ile tüm ekranların piksel düzeyinde eşleştirilmesi henüz doğrulanmamıştır.
- Diğer sayfalardaki tüm özgün görsel hover/scroll thumb animasyonları, özel import/export pencereleri ve site çapındaki bütün uzun basma etkileşimleri kapsamlı birebir regresyona tabi tutulmadı.
- Gerçek Cloudflare D1/Worker/Pages üretim ortamı, canlı cihaz raporları veya uygulama APK derlemesi test edilmedi.
- Dar mobil görünümde otomatik küçülen sabit panelin her kaydırma güzergâhındaki geometrisi kapsamlı cihaz matrisiyle doğrulanmadı.
