# OpenCLScope Database 3.4.4 — Quality Gate

- Baseline: 3.4.3 OpenCL Database; VulkanScope Database 1.4.12.
- `tools/verify_release.py`: PASS, pins official registry and original immutable Vulkan CSS.
- `node tools/run_tests.mjs`: PASS, 167 tests (including 3 newly added component/asset parity checks).
- `node tools/build_pages_artifact.mjs`: PASS.
- `node tools/audit_pages_artifact.mjs`: PASS (308 public files).
- Browser static DOM/CSS only: Chromium 1440×900 and 390×844, Settings SVG ×4, progress track, neutral green active states, no viewport overflow: PASS.
- `releaseReady` remains false in source; live snapshot job must make it true after verified build.
- Worker D1/report submission code: version-only identity change; technical and historical validation unchanged.
- Live GitHub/Cloudflare publish: NOT PERFORMED. Populated site pixel parity: NOT ESTABLISHED.
