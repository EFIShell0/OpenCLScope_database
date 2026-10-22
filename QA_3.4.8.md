# OpenCLScope Database 3.4.8 — QA

- `python -B tools/reconcile_repository.py --check`: PASS.
- `python -B tools/verify_release.py`: PASS, including original official cl.xml, SVG, pinned reference styles and report version metadata.
- `node tools/run_tests.mjs`: 178/178 PASS, including 3 new report-detail regression tests. Existing Worker tests remain unchanged.
- `node tools/build_pages_artifact.mjs`: PASS; `node tools/audit_pages_artifact.mjs`: PASS, 309 public files.
- Chromium isolated in-memory HTML/CSS/JS at 1440×900 and 390×844: report hero, six identity cards, ten report tabs, Overview/Properties/Formats/Raw report and no JavaScript errors: PASS. No horizontal page overflow.
- The browser test used a local, synthetic offline `worker/tests/complete-report.json` fixture temporarily; never saved to production snapshot or uploaded.
- The release bootstrap and Pages build/verification now require the additional versioned report detail stylesheet before considering a release ready.
- Clean ZIP extraction, archive CRC, SHA-256 and source-byte equality: checked separately during package validation.
- **Not tested:** live GitHub Actions, live Cloudflare Worker/D1, actual user report data, full pixel-equivalent VulkanScope report UI or entire-site exact parity.
