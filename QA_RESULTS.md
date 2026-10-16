# OpenCLScope Database 0.12.60 — QA

## Reference and methods
- Starting release: OpenCLScope Database 0.12.59 ZIP.
- Comparison basis: baseline-pinned VulkanScope Database 1.4.12 CSS/official layout and rulebook references, and previous direct VulkanScope reference-audit inventories.
- The current VulkanScope 1.4.12 complete source archive was not independently extracted in this pass; full pixel parity is not claimed.

## Passed
- Node site + Worker tests: 40/40 PASS.
- `python -B tools/verify_release.py`: PASS.
- `python -B tools/reconcile_repository.py --check`: PASS, including clean overlay after known historical asset/test cleanup.
- `node tools/build_pages_artifact.mjs`: PASS with coherent empty snapshot fixtures.
- New HTTP POST reports: 1.0.19/10019 accepted only with complete schema 1, 16 platform / 210 device query evidence; all older producers and unallowlisted future producers rejected HTTP 400.
- Previously published legacy reports still pass read-only snapshot validation through original pinned per-version contracts; no historical D1 records deleted.
- Semantic comparison ignores ordering of property/extension/image format enumeration and preserves false versus unknown distinctions.
- Eleven responsive OpenCL workspaces including Statistics, with report-backed source-labeled charts.
- Chromium headless in-memory runtime at 1440x900, 390x844, 320x720: no page JS errors, no horizontal document overflow and no statistics-card overflow. Images were not loaded in this offline in-memory harness.
- 0.12.59-overlaid project after `reconcile_repository.py --apply`: 40/40 Node tests PASS; known obsolete browser bundles and historical Worker test files removed only when exact expected match.

## Not tested
- Cloudflare Worker/D1 live deploy or new report submission against live service.
- Actual GitHub Pages production publication and pixel-level visual equivalence with a separately extracted VulkanScope Database source/archive.
