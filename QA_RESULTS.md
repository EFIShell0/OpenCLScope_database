# OpenCLScope Database 3.0.18 — stage 9 QA

| Verification | Observed outcome |
|---|---|
| Frontend regression suite | **87/87 PASS** |
| Worker contract regression suite | **19/19 PASS** |
| `node --check assets/app.v1012.js` | PASS |
| `python -B tools/verify_release.py` | PASS (Pillow deprecation warning) |
| `python -B tools/reconcile_repository.py --check` | PASS, 19 active test files |
| Chromium 1440x900 with isolated synthetic fixture | PASS: evidence modal, 10-item paging, SHA source, Escape, SVG text namespace, no uncaught JS errors |
| Chromium 390x844 with isolated synthetic fixture | PASS: same controls and zero JS page errors |
| `node tools/build_pages_artifact.mjs` | PASS with static empty release snapshot; this is not a live sync |
| Official `registry/cl.xml` hash | Pin preserved exactly |
| `assets/vulkan-layout.v1412.css` versus unmodified VulkanScope 1.4.12 `assets/site.v1412.css` | SHA-256 match |
| Original Worker producer and historical accepted versions | No validator or D1 schema changes; new writer remains exactly 3.0.8 / 30008 |
| Live Cloudflare Worker, D1, GitHub Pages | **NOT TESTED** — production credentials and target URL unavailable |
| Exact pixel parity on every VulkanScope screen | **NOT VERIFIED** — further stages required |

The Chromium smoke test loaded HTML/CSS/JS into an isolated headless browser with a synthetic fixture, not from the production origin. Local checks are not evidence that all users or published reports render without defects.
