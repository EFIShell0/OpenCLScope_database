# OpenCLScope Database 3.4.6 — QA

- Source baseline: OpenCLScope Database 3.4.5 ZIP; upstream reference: VulkanScope Database 1.4.12 ZIP.
- Changed: Reports-specific 10/25/50-row pager, removal of duplicate global Sort and Page limit from Reports, report-size independence from other workspaces, consistent page counter/range/page-go denominator.
- Frontend + Worker regressions: 172/172 PASS (including two new release-3406 parity tests).
- Repository check and release validation: PASS.
- GitHub Pages local allowlist build + audit: PASS, 308 files.
- Chromium static in-memory evaluation: 1440×900 PASS; 390×844 PASS; 57 temporary synthetic browser-only report-index entries; 10-row paging, six pages, Next/Go state, independent per-workspace limits, no page errors and no horizontal document overflow.
- Official `registry/cl.xml`, pinned VulkanScope reference CSS and upstream rulebook: unchanged.
- Cloudflare D1, GitHub Actions and live GitHub Pages: NOT DEPLOYED or tested remotely.
- Complete populated VulkanScope/OpenCLScope pixel parity: NOT VERIFIED; remaining discrepancies documented in `COMPARISON_3.4.6.md`.
