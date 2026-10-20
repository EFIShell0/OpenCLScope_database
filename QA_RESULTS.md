# OpenCLScope Database 3.0.14 — QA sonuçları

**Girdi:** OpenCLScope Database 3.0.13, VulkanScope Database 1.4.12, `rules/PROJECT_RULES.md`.

| Kontrol | Sonuç |
|---|---|
| Node site regresyonları | 76/76 PASS; 4 yeni semantik sıralama/bağlam menüsü/negatif test |
| Worker sözleşme regresyonları | 19/19 PASS |
| `tools/verify_release.py` | PASS (resmî registry SHA, 16/211 sorgu kataloğu, varlıklar, Worker sürüm kimliği) |
| `tools/reconcile_repository.py --check` | PASS (16 aktif test dosyası) |
| Chromium: izole HTML/CSS/JS, 1440 × 900 / 390 × 844 | PASS: açılış, iki sahte ama tam şemalı raporla Compare, altı sıralama seçeneği, görünür işlem menüsü, sağ tık, Escape, 157 sıralanmış JSON kaydı, dar ekran yatay taşma denetimi |
| Mobil uzun basma | Sentetik dokunma olayı ile test edildi; bir turda geçici menü kapanması gözlendi, sonraki test geçti. Tüm gerçek dokunmatik cihazlara genellenemez. |
| Pages statik paket oluşturma | PASS, yalnızca izinli dosyalar |
| ZIP ve giriş SHA-256 | PASS, temiz yeniden açma doğrulaması |

**Çalıştırılmadı:** Canlı Cloudflare/GitHub Pages yayını, Android cihaz testi, gerçek D1 raporlarıyla uçtan uca performans, tüm VulkanScope UI görsellerinin piksel piksel doğrulaması. Tarayıcı fixture'ları yalnızca izole test oturumundadır; veritabanına eklenmez.
