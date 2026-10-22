# OpenCLScope Database 3.4.2 — QA evidence

- `python -B tools/reconcile_repository.py --check`: PASS
- `python -B tools/verify_release.py`: PASS (official XML, immutable rules/CSS, Worker identity and frontend constraints)
- `node tools/run_tests.mjs`: **161/161 PASS**, including two additional Statistics paging/scrollbar checks
- `node tools/build_pages_artifact.mjs`: PASS
- `node tools/audit_pages_artifact.mjs _site`: PASS, 307 allowlisted public files
- Chromium (isolated HTML/CSS/JS, static local presentation fixture): PASS at 1440x900 and 390x844. 156 names from the official extension *catalog* used only as transient test data; 7 pages at 25 rows; Go to last 6-row page; 50-row page size; no horizontal document overflow or uncaught page errors.
- CSS/registry official SHA-256 remained unchanged; the Worker admission logic and data schemas have no intentional changes.
- Real deployed site, Cloudflare Worker/D1, GitHub Actions, screenshots using populated canonical reports and complete VulkanScope pixel parity: **NOT TESTED**.
