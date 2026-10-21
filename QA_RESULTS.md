# OpenCLScope™ Database 3.0.27 — QA

- Baseline: OpenCLScope Database 3.0.26; immutable design reference: VulkanScope Database 1.4.12.
- Node UI: **121/121 PASS**; Worker: **19/19 PASS**.
- `node --check assets/app.v1027.js`: PASS.
- `tools/reconcile_repository.py --check`: PASS.
- `tools/verify_release.py`: PASS.
- `node tools/build_pages_artifact.mjs`: PASS.
- Chromium isolated 1440x900 and 390x844: 11 native-backed custom selects, no JS errors, menu open/Escape, referenced surface scrollbars: PASS.
- Dynamic custom select: 121 options, 50 visible per page, page 2, search narrowed to 1 item, selected original native value `gpu115`: PASS. Test-only synthetic options, not real report data.
- Live Cloudflare D1/Worker/Pages: NOT TESTED; visual all-page pixel parity: NOT VERIFIED; real uploaded reports: NOT TESTED.
- Exact reference CSS, original Khronos XML, GPU assets and Worker intake and D1 migration: unchanged.
