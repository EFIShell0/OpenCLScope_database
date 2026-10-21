# OpenCLScope Database 3.0.28 — QA

- Başlangıç: 3.0.27; VulkanScope referansı 1.4.12.
- Node arayüz regresyonları: **125/125 PASS** (yeni 4 ayrı test dahil).
- Worker regresyonları: **19/19 PASS**.
- `node --check assets/app.v1028.js`: PASS.
- `python -B tools/reconcile_repository.py --check`: PASS.
- `python -B tools/verify_release.py`: PASS.
- `node tools/build_pages_artifact.mjs`: PASS.
- Chromium izole DOM/CSS testleri: **1440×900** ve **390×844**; test-only rapor örneği bellek içinde. 5 chart, donut legend, 3 query-status bar, 1 unique dominant state, Extensions Reset izolasyonu, yatay overflow ve JS hata denetimleri: PASS.
- Test-only örnek gerçek rapor değildir; yayımlanan `data/snapshot.json` boş ve değiştirilmiş test verisi içermez.
- Orijinal Vulkan CSS ve Khronos OpenCL cl.xml SHA-256: korunmuştur.
- **Gerçek D1/Cloudflare Pages veya gerçek cihaz raporlarıyla uçtan uca ve tüm ekranlarda piksel düzeyi karşılaştırma: YAPILMADI.**
