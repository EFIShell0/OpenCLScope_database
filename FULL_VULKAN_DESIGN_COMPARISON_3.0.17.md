# OpenCLScope Database 3.0.17 — VulkanScope Database 1.4.12 comparison, stage 8

## Directly inspected

- OpenCLScope Database 3.0.16 (`assets/app.v1010.js`, `assets/site.v1009.css`, `rules/PROJECT_RULES.md`) against the unmodified VulkanScope Database 1.4.12 (`assets/app.v1412.js`, pinned layout source).
- VulkanScope's Internet settings run periodic request-scoped network observations while that panel is visible; OpenCLScope 3.0.16 only queried on first switch/manual refresh. VulkanScope provides explicit network-state UI and Show/Hide IP; OpenCL lacked a time-bounded IP re-mask.
- VulkanScope's evidence drilldowns use animated, cancellable accessible accordions. OpenCLScope 3.0.16 report non-filterable categories were always expanded cards.

## Changed in 3.0.17

| Verified common behavior | New OpenCLScope Database implementation |
|---|---|
| Internet request-scoped observations | Automatic 60-second refresh only while Internet settings are open, the tab is visible and the browser reports online; in-flight work never overlaps and API remains the configured fixed HTTPS service. |
| Address privacy | IPv4/IPv6 and active addresses start masked. An explicit Show reveals an address, auto-masking after 15 seconds; panel close/switch rerenders masked addresses. No IP written to reports, local storage, URLs or D1. |
| Network provenance | Failed/offline or >120-second-old observations are clearly previous/stale, not silently represented as current. No DNS resolver or unobserved address family is inferred. Invalid typed address-family responses are rejected. |
| Report accordion details | Platforms, Devices, Extensions and Profiles use keyboard-actionable triggers, live `aria-expanded`, cancellable 190/160 ms transitions, reduced-motion fallback, and original complete report evidence unchanged. Overview and Diagnostics begin expanded. |
| Layout | New visual delta lives only in `assets/site.v1010.css`; `assets/vulkan-layout.v1412.css`, `assets/upstream-reference.css`, pinned GPU artwork, and official `registry/cl.xml` stay byte-identical to 3.0.16. |

## Immutable technical contracts

- Only new Android producer OpenCLScope **3.0.8 / 30008** remains eligible for new POST, all previously eligible exact historical versions remain read-only and validated.
- Schema 1, 16 registered platform queries, 211 registered device queries, registered 24 image-format query slots, `registry/cl.xml`, SHA-256 report integrity, Worker/D1 read/write semantics, snapshot index and skipped-invalid-contract safeguards were not changed.
- Web release identity `3.0.17`, site JS/CSS and generated release marker are synchronized. No D1 migration or Android app update.

## Differences NOT fixed / scope limits

- Deep nested per-property coverage dialogs with additional 10/25/50-page pagination and every VulkanScope modal animation remain beyond this stage.
- Not all dynamic filters, per-view layout/padding/scrollbar behaviors or long-press menus are visually or behaviorally identical.
- Chromium tests use isolated HTML/CSS/JS with mocked API responses and a synthetic complete-report fixture; these are not live Cloudflare tests or screenshots of production reports. Exact pixel parity is NOT claimed.
