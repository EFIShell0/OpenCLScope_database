# OpenCLScope™ Database 3.0.26 — VulkanScope™ Database 1.4.12 comparison

## Source basis and limitations

- OpenCLScope Database 3.0.25 (449-file source archive) → 3.0.26; VulkanScope Database 1.4.12 (840-file source archive) is the immutable comparison reference.
- Compared source `index.html`, browser app behavior, upstream `site.v1412.css`/local pinned `vulkan-layout.v1412.css`, `site.v1015.css`, OpenCL-specific parity overlay, and original engineering rules.
- Same visual hierarchy does not imply the Vulkan runtime feature/format/support logic can be copied to OpenCL. Preserve OpenCL `cl.xml`, complete report requirements, canonical state semantics, historical reads, and exact producer submission rules.

## Differences found and addressed in this stage

| Area | 3.0.25 difference | 3.0.26 change |
|---|---|---|
| Dataset filters | Controls were nested in the same `section-heading` as title; cramped and brittle, especially at mobile widths | Reparented native filter panel into its own sibling row directly after section heading, with two-column mobile and responsive desktop controls |
| Filter menus | Custom menu stacking and body geometry could obscure options | Explicit menu stacking, max-height/overflow and visible/focus treatment; native select values remain authoritative |
| Horizontal table bar | Rail was suppressed if no overflow and entire table absent on empty Reports | Always render Reports table headings, honest empty row, and table slider/arrow rail; arrow states reflect true scrollability, no fabricated entries |
| Horizontal slider semantics | Track advertised a percentage range while thumb updated another node; dimensions could become stale | Track exposes actual pixel scroll range and value, thumb decorative, resize-aware sync after layout and table transitions |
| Main page scroll bar | Local 10px, offset and semi-transparent geometry differed from 18px upstream rail | Use 18px desktop / 16px mobile reference-class geometry, neutral grey rest and green interaction, true overflow gating |
| Floating page controls | Different positions/sizes than upstream | Matched dimension and offset family while preserving accessibility and real scroll behavior |
| Statistics bars | Long value text crowded a 26–34px column; longest category visually filled 100% even if only a minority of total | Width is `count / all loaded property rows`; meter maximum is same full denominator, with legible count/percentage column and distinct real status hues |
| Statistics Reset | Control reset **Extensions** workspace state and called extension rendering | Now resets only Statistics controls and re-renders Statistics |
| Reports zero results | Toolbar shown but no table/scroller | 12-column table and truthful zero-result row remain visible; page limit and sort controls still available |

## Scope verification

- UI tests: 119/119. Worker tests: 19/19. `tools/verify_release.py` and `tools/reconcile_repository.py --check`: PASS. Node syntax: PASS.
- Browser: isolated Chromium using locally injected, versioned source code/style assets at 1440×900 and 390×844. Reports and Statistics switch without JS page errors, visible filter row, pager, page rail and floating buttons. Empty Reports exposes horizontal controls; no body-level horizontal overflow.
- Browser test data are an **empty bundled snapshot**. Consequently, per-row disclosure and statistical bar rendering on a real submitted dataset are covered by source tests, not an end-to-end populated/live-page browser test.
- No live Cloudflare Worker, D1, Pages or user device verification was performed. No assertion that all pages exactly match upstream pixels, colors, timings, hover/long-press behavior or data workflows.

## Remaining gaps for subsequent stages

- Match all card-level Controls, Statistics charts (including circle legends and breakdowns), and all custom-select/scroll surfaces with **populated real report data** and a visual regression suite based on comparable screenshots.
- Compare every modal, Settings panel, long-press menu, mobile overlay, table disclosure animation and report detail layout directly against upstream by viewport.
- Verify deployment-specific cache/stylesheet invalidation and full live API/Pages data after deployment. The local reference CSS still contains red Vulkan rules for the upstream brand, but the custom OpenCL scrollbar chrome has an overriding neutral/green layer; red Error semantics remain legitimate.
