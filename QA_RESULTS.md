# OpenCLScope Database 1.0.0 — Verification

## References
- Real upstream archive VulkanScope Database 1.4.12, including exact `assets/site.v1412.css` (SHA-256 pinned in release-1000-visual-contract.test.mjs).
- Predecessor OpenCLScope Database 0.12.60.
- Exact Android application 1.0.19 master CL app logo exported as black-backed 64/192/512 favicon assets.

## Executed checks
- `python -B tools/reconcile_repository.py --check`: PASS, 8 active frontend test files.
- `node --test tests/*.test.mjs worker/tests/*.test.mjs`: PASS, 45/45 tests.
- `python -B tools/verify_release.py`: PASS, version/code/manifest/registry and Worker validation.
- `node tools/build_pages_artifact.mjs`: PASS, published artifact allowlist.
- Browser: Chromium widths 1440, 390 and 320. JavaScript page errors: 0; page-level horizontal overflow: 0; 11 SVG nav icons; black-backed OpenCLScope logo loads; Reports table renders; Statistics has 3 chart cards. Synthetic example used only in visual fixture and not shipped or counted.
- OpenCL producer minimum: 1.0.18 and earlier denied new POST, 1.0.19/10019 admitted if otherwise complete, unknown later version denied. GET/snapshot historic reports unaffected.

## Not executed / boundaries
- Live Cloudflare D1 / Worker deploy and real production dataset rendering not executed; credentials unavailable.
- Pixel-perfect difference-free rendering across Vulkan vs OpenCL's nonidentical workspaces is not claimed.
- Official OpenCL registry data, device evidence and Worker schema were not transformed into Vulkan-only data.
