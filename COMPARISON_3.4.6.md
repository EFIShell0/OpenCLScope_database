# OpenCLScope Database 3.4.6 — VulkanScope Database 1.4.12 comparison

## Reference and scope

- OpenCLScope input: the original 3.4.5 release ZIP, extracted independently.
- VulkanScope input: the bundled 1.4.12 reference ZIP; inspected its `assets/app.v1412.js` `renderReports()` implementation and related report-toolbar HTML/CSS contracts.
- Presentation-only patch: report toolbar/pagination and redundant filtering; no modifications to immutable upstream reference CSS/rulebook, Khronos `registry/cl.xml`, original report payloads, database migrations, D1 schema or producer-admission code.
- New POST admission remains exactly OpenCLScope 3.4.0/30400. Older approved submissions remain read-only historical evidence.

## Confirmed discrepancies and corrections

| Shared control | VulkanScope 1.4.12 | OpenCLScope 3.4.5 | OpenCLScope 3.4.6 |
|---|---|---|---|
| Reports Sort | One report toolbar sort | Toolbar and duplicate global Sort filter | Report toolbar retained; duplicate global Sort hidden |
| Reports Per page | 10 / 25 / 50 report rows | 25 / 50 / 100, shared with other workspaces | 10 / 25 / 50, independently tracked `reportPageSize` |
| Page count | Report-specific page size denominator | Generic `pageSize`, changed by unrelated workspaces | Page count, range and Go use report-specific denominator on Reports |
| Other workspaces | Own evidence/aggregate pagination | Shares the Reports pagination limit | Existing 25 / 50 / 100 global page size retained independently |
| Page-limit filter | No duplicate alongside Reports toolbar | Duplicate in global filter panel | Hidden only in Reports; remains usable in other applicable workspaces |
| Empty Reports | Toolbar preserved | Toolbar preserved | Preserved; count and pager remain safe with zero rows |
| Cache/release identity | Versioned, consistency checked | Database 3.4.5 frontend cache key 3405 | 3.4.6 frontend cache key 3406 in page, bootstrap, marker, build and verification tools |

## Verification actually run

- 172/172 Node frontend and Worker regression tests pass, including two new 3.4.6 parity checks.
- `python -B tools/reconcile_repository.py --check` and `python -B tools/verify_release.py` pass.
- `node tools/build_pages_artifact.mjs` and `node tools/audit_pages_artifact.mjs` pass with 308 published files.
- Isolated Chromium browser evaluation at 1440×900 and 390×844 using 57 browser-memory-only synthetic index entries verifies 10-row Reports, six pages, Next, page 2, hidden duplicates, independent default 25-row generic pager, no JavaScript page errors or document-width overflow. Synthetic IDs and rows were not written to site snapshots or ZIP.
- Source ZIP clean extraction, repeat ZIP integrity, source manifest checks and reference-content SHA-256 checks are performed during package verification.

## Explicit justified differences and unresolved work

- OpenCL technical report fields, platform/API distinctions, missing origin time-zone metadata, trademarks, validated device identities and green branding differ from VulkanScope by domain necessity. No Vulkan-only WSI/Turnip/driver-mode facts were added.
- Reports still differs in total field columns and metadata because not all Vulkan origin fields exist in a canonical OpenCL index. Compare's stacked control DOM, Settings and Statistics charts, multi-page details, modal layouts, mobile interactions and complete text parity remain incompletely audited.
- Full populated-page screenshot pixel parity to VulkanScope 1.4.12 was **not** established. Isolated browser checks are not production-site comparison. Real GitHub Actions, live Pages and Cloudflare Worker/D1 deployment were **not** executed.

## Future parity gate

For each shared component, compare upstream HTML, computed CSS, keyboard, pointer, touch, overflow, visible exact wording, responsive layout, transitions and deployment readiness against equivalently populated source fixtures. Reject undocumented extra copy and UI controls while preserving the strict OpenCL schema and user-controlled automatic reload.
