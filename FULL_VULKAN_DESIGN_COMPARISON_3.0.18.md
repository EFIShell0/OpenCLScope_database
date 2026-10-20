# OpenCLScope Database 3.0.18 — VulkanScope Database 1.4.12, stage 9

## Direct comparison
- Primary references: original `VulkanScope-Database-1.4.12(1).zip` / `assets/app.v1412.js` and `assets/site.v1412.css`, versus OpenCLScope 3.0.17 / `assets/app.v1011.js`.
- Vulkan reference `setupModalPagination`, `openCoverageReportModal` and `bindCoverageReportDialogs` implement paginated evidence dialogs. OpenCL only used inline disclosure and one top-level evidence pager.
- OpenCL had a state filter on Platforms, Devices, Extensions and Profiles even though its `recordEntries` entries provided no status; selecting any state silently returned zero results.
- OpenCL donut summary instantiated SVG `text` elements using HTML namespace; counters could fail to render.
- OpenCL recorded scalar evidence used `prop.value || '(none)'`, which can mislabel actual zero/false as absent in display.

## Implemented stage 9
- New reusable, safe DOM-constructed evidence modal for any record-backed capability row, with per-modal 10 / 25 / 50 pagination, page editing, arrows, initial focus, Escape/backdrop closure, Tab focus containment, optional canonical SHA-256 source-report link, bounded height and motion reduction.
- Keep existing inline disclosure and export, report-view paging and long-press action menus. No report facts, statuses or missing device states are synthesized.
- Restrict state filter to Views whose data rows expose real OpenCL query outcome states (Features / Memory / Formats). Clear a stale state on a nonapplicable view. Mark generic enumeration as Recorded, not an invented Unknown technical status.
- Render statistic doughnut text in the SVG namespace and show a genuine 0 / false evidence value instead of substituting unavailable.
- Versioned `app.v1012.js`, `site.v1011.css` with linked index/Worker/snapshot release identity 3.0.18. Preserves byte-exact official `registry/cl.xml`, original pinned Vulkan layout + artwork.

## Remaining gaps
- VulkanScope has deeper aggregate per-property support/unknown coverage, grouped cross-report breakdown and customized menus not yet fully replicated for all OpenCL views.
- OpenCL query structure differs from Vulkan reports: copying Vulkan support denominators or device-mode fields would invent evidence.
- Full visual parity and live Cloudflare/D1/Pages have NOT been established. Tests cover the local package only.
