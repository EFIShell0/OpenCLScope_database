# OpenCLScope Database 3.0.30 — Local QA

- **Inputs:** OpenCLScope Database 3.0.29 ZIP + VulkanScope Database 1.4.12 ZIP; both extracted and `ZipFile.testzip()` clean.
- **Rulebooks:** The OpenCLScope `rules/PROJECT_RULES.md` and pinned upstream reference were inspected before editing. 3.0.30 restrictions appended; pinned Vulkan/Khronos assets retained byte-identically.
- **Source tests:** 149/149 pass (the original 145 plus four new CI/CD, snapshot, page-jump and producer-invariant tests).
- **Worker:** Included in the 149 aggregate; no D1 migration, POST admission or canonical report update.
- **Source validation:** `python tools/reconcile_repository.py --check` — PASS; `python tools/verify_release.py` — PASS.
- **Syntax:** `node --check assets/app.v1030.js` and `node --check worker/src/index.js` — PASS.
- **Workflow topology:** Parsed with YAML BaseLoader; five jobs `windows-tooling`, `build`, `release`, `deploy`, `snapshot-refresh` — PASS. Live GitHub Actions not run.
- **Pages source template:** `node tools/build_pages_artifact.mjs` — PASS; `node tools/audit_pages_artifact.mjs _site` — PASS; audited 306 public files; no Worker/test/source folders included.
- **Deterministic release:** `python tools/package_release.py dist` then `--verify-existing` — PASS. Final released ZIP and standalone SHA-256 values are regenerated after this report and manifest update.
- **Chromium (test-only, in-memory HTML/CSS and JS):** 1440×900 and 390×844; 11 nav buttons, responsive page-jump/Go, footer 3.0.30 and 3.0.9 producer hints; no JS page errors or horizontal document overflow. External site navigation was blocked (`ERR_BLOCKED_BY_ADMINISTRATOR`); QA browser did not load real image/network assets.
- **Not tested:** Cloudflare D1/API, GitHub Push/Actions, remote GitHub Release, GitHub Pages publication, physical OpenCL GPU, and full populated pixel-by-pixel VulkanScope UI parity. These remain strictly unverified.
