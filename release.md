# OpenCLScope™ Database 3.0.27

## VulkanScope™ 1.4.12 kaynak bileşeni uyarlaması

Bu sürüm, önceki küçük CSS yamaları yerine VulkanScope Database 1.4.12'nin gerçek **filtre listbox**, **seçenek sayfalama**, **özel yüzey kaydırma** ve **tablo kaydırma** kodlarını uyarlıyor. Özgün OpenCL™ sorguları ve rapor doğrulaması korunmuştur.

Filtreler artık seçenek araması, 50 öğelik sayfalar, önceki/sonraki, klavye odağı ve Escape ile kapatma içerir. Asıl `select` değeri her zaman korunur. Mobil filtrelerde etiketlerin aşırı daralması giderilmiştir. Referans CSS ile çakışan 24 eski kural temizlenmiştir.

**Doğrulama:** 121/121 arayüz, 19/19 Worker testi; Chromium'da masaüstü/mobil etkileşim; release validator ve Pages artifact kontrolü. Bu testler, tüm ekranların piksel düzeyinde aynı olduğunu veya Cloudflare'ın canlı ortamda denendiğini göstermez.

OpenCL™ ve OpenCL logosu The Khronos Group Inc. ticari markalarıdır. Proje Khronos'un resmî uygulaması değildir.
