# OpenCLScope Database 3.4.1 — VulkanScope 1.4.12 source comparison

## Scope and source inventory

- Current input: OpenCLScope Database 3.4.0 ZIP, 459 working source files after changes; VulkanScope Database 1.4.12 ZIP (840 source files).
- Khronos OpenCL `registry/cl.xml` SHA-256: `c24f63ad9aa5776fe67808926ae85613248ebbeefa7373fceb406a0bd12ce016` (unchanged).
- Immutable VulkanScope reference style SHA-256: `bd5957461701439a7655c652b4e560cb84b7cc0163f202a257e019c2c468181b` (unchanged).
- `docs/CSS_COMPONENT_AUDIT_3.4.1.csv` records the observed occurrence counts for 10 shared component families. These counts are **not** pixel-equivalence tests.

## Confirmed regressions repaired in 3.4.1

1. The 3.4.0 ZIP replaced the VulkanScope-style four-step release pipeline with one `verify-publish` job. The staged `windows-tooling → build → release → deploy` jobs and independent `snapshot-refresh` job are restored, with deterministic GitHub Release ZIP/SHA-256.
2. Release readiness had regressed to schema 1, without the separate startup verification gate. A source marker is now `releaseReady:false`; a successful verified snapshot writes `releaseReady:true`. Browser bootstrap cross-checks newly published HTML, JS, CSS, parity CSS and bootstrap before suggesting reload.
3. Deployment verification previously validated mainly the report index/preload. It now checks live release readiness, HTML asset cache key and the actual published app/bootstrap bytes. This remains a **future CI test**, not evidence of a completed deployment.
4. The UI CSS selected `.section-heading .filters.filter-panel` but `#filterPanel` is a sibling of `.section-heading`. The now reachable `.db-workspace .filters.filter-panel` family styles the real DOM; its hidden controls stay hidden and native SELECT remains authoritative.
5. The upstream hero search border still used Vulkan red via a more specific selector. A focused OpenCL grey/green override was added; semantic Error red was not changed. The stale Developer Information frontend release label was updated.
6. LF source checkout is enforced for frontend/script/test assets without normalizing official Khronos SVG/XML or binary logos.

## Unresolved differences and evidence limits

- The 11 workspace pages are **not verified pixel-for-pixel identical** to VulkanScope. The upstream engine has Vulkan-exclusive views/data that cannot be represented as fabricated OpenCL facts.
- Reports full-cell rendering, charts, dynamic compare layout, settings dialogs and long-press animations still need populated canonical report-by-report browser comparisons. The static no-report UI does not establish these behaviors.
- The website's changing UI and styles span thousands of declarations; shared selector presence is not equivalent to equal cascade/computed styles. See `CSS_COMPONENT_AUDIT_3.4.1.csv`.
- This release does **not** claim GitHub Actions, Cloudflare Worker, GitHub Pages or live D1 were deployed or verified. Tests using synthetic release marker fixtures do not invent device reports.

## Source contract maintained

- New POSTs still require OpenCLScope 3.4.0 / 30400; older complete reports remain historical read-only.
- No changes to Worker admission predicates, image-format warning validity, QCOM native byte evidence, D1 migrations, Khronos registry, vendor icons or historical canonical SHA-256 report IDs.
- New database version 3.4.1 is an interface/deployment release, not a new Android producer version.
