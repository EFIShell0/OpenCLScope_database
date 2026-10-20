# OpenCLScope Database 3.0.21 — QA results, stage 12

| Check | Observed result |
|---|---|
| Node frontend `node --test tests/*.test.mjs` | **98/98 PASS**, includes 4 new extension model tests |
| Worker `node --test worker/tests/*.test.mjs` | **19/19 PASS** |
| `python -B tools/reconcile_repository.py --check` | **PASS**: 22 active site test files, 0 unexpected |
| `python -B tools/verify_release.py` | **PASS** (existing Pillow `getdata()` deprecation warning only) |
| `node --check assets/app.v1015.js` | **PASS** |
| `node tools/build_pages_artifact.mjs` | **PASS**, allowlisted Pages artifact built; omitted from source ZIP |
| Chromium synthetic in-memory fixture (1440×900) | **PASS**, Extension group filter/scope/search/source modal/Escape/raw |
| Chromium synthetic in-memory fixture (390×844) | **PASS**, same scripted behaviors, no JS exceptions |
| Pinned official Khronos `registry/cl.xml` SHA-256 | Unchanged `c24f63ad9aa5776fe67808926ae85613248ebbeefa7373fceb406a0bd12ce016` |
| Pinned VulkanScope 1.4.12 stylesheet SHA-256 | Unchanged `bd5957461701439a7655c652b4e560cb84b7cc0163f202a257e019c2c468181b` |
| Worker new-upload producer validation | Unchanged, precisely OpenCLScope 3.0.8 / 30008 |
| Full served-origin browser navigation | **NOT TESTED**: environment blocked both local HTTP and file URL navigations |
| Actual Cloudflare D1/Worker/Pages/Android integration | **NOT TESTED**: no credentials or live device, no deployment |
| Complete VulkanScope pixel/behavior equivalence | **NOT VERIFIED**; remaining differences detailed in comparison report |

All browser data was isolated local test-fixture data. No synthetic records are present in `data/index.json`, `data/snapshot.json` or the public site artifact.
