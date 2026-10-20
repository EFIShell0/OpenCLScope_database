# OpenCLScope™ Database 3.0.25 — QA

- Baseline: 3.0.24 source ZIP (447 files), direct VulkanScope Database 1.4.12 source reference.
- Browser UI tests: 115 tests (including three new Reports sort/control tests), PASS.
- Worker tests: 19 tests, PASS.
- `python tools/verify_release.py`: PASS.
- `python tools/reconcile_repository.py`: PASS on clean source.
- Desktop offline Chromium at 1440×900: toolbar on zero reports, real sort state, 3 disclosures, nav 11/11, neutral custom scrollbars, no page errors or horizontal body overflow — PASS.
- Mobile offline Chromium at 390×844: same suite — PASS.
- Chromium fixture is synthetic, injected only during test execution and **never** published into data/index.json, data/snapshot.json or D1.
- Live Cloudflare Worker/D1/Pages verification: NOT PERFORMED.
- Full pixel-by-pixel parity with populated VulkanScope dataset: NOT VERIFIED.
