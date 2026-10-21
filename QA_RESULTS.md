# OpenCLScope™ Database 3.0.26 — QA

- Sources: OpenCLScope Database 3.0.25 and VulkanScope Database 1.4.12.
- Exact producer gate unchanged: OpenCLScope 3.0.8/30008 for new submission; no fabricated query values.
- Frontend unit/regression tests: **119/119 PASS**.
- Worker tests: **19/19 PASS**.
- Node syntax, `tools/reconcile_repository.py --check`, `tools/verify_release.py`: **PASS**.
- Chromium offline inline-source smoke, 1440×900 and 390×844: filter row/pager/viewport and table scrollers are visible on Reports, no JS page error or document horizontal overflow. Statistics navigable with empty data: **PASS**.
- Test browser operates on an empty bundled snapshot, so individual visual evidence rows and real populated Statistics bars have **not** been exercised end-to-end.
- Production Cloudflare Worker/D1/Pages: **NOT TESTED**. Full all-pages pixel/animation parity: **NOT CLAIMED**.
