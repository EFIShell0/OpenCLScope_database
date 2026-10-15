# OpenCLScope Database 0.12.53 — test results

## Executed

- **PASS** — `python -B tools/verify_release.py`: fixed schema, pinned `cl.xml`, official logos, immutable upstream references, Producer 1.0.14 / 10014 and historical pairs, stylesheet/version targets, manifest constraints.
- **PASS** — `node --test tests/*.test.mjs worker/tests/*.test.mjs`: **47 tests passed, 0 failed**. Includes 19 Worker tests plus 28 site/cache/visual contract tests.
- **PASS** — `node tools/build_pages_artifact.mjs`: static production allowlist built; Pages release index and snapshot matched Worker 0.12.53.
- **PASS** — Chromium (offline fixture-only preview, not live domain), desktop 1440×900 and mobile 390×844: no uncaught JavaScript errors; no horizontal overflow; all five native select controls enhanced; Settings opened and closed via Escape; navigation changed views; loader vanished after snapshot loaded.
- **PASS** — `node --check assets/app.v1253.js`, release ZIP safety/integrity check, SHA-256 manifest.

## Not executed / not asserted

- Live GitHub Pages / Cloudflare D1 / Worker publish and on-domain browser test.
- Pixel-by-pixel overlay comparison with the live VulkanScope reference using identical populated reports.
- Real device, TalkBack, right-click, or full cross-browser animation testing.
- Correctness of semantic comparison and remaining advanced Settings and chart features (listed PENDING in the gap ledger).

Design differences not verifiably closed are documented in `FULL_VULKAN_DESIGN_COMPARISON_0.12.53.md`; they have not been relabeled as passed.
