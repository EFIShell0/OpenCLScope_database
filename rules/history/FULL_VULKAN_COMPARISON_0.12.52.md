# OpenCLScope Database 0.12.52 vs VulkanScope Database 1.4.12

## What was compared

- Vulkan ZIP: 840 files; OpenCL audit-time inventory: 120 source files (excluding generated `_site` and files produced by this audit). The release package also contains the resulting audit and checksum manifests.
- Relative-path overlap: 22; byte-identical: 12; changed at same path: 10; only OpenCL: 98; only Vulkan: 818.
- HTML anchors: Vulkan 100, OpenCL 54, shared IDs 22. The lists are *different implementations* and cannot be treated as fully equal.
- Full file-by-file and SHA-256 details: `FILE_BY_FILE_COMPARISON.tsv` (all relative paths, including all different assets).
- Normative source: `rules/PROJECT_RULES.md`; unchanged complete Vulkan upstream reference `rules/UPSTREAM_REFERENCE_RULES.md`.

## Prioritized functional difference ledger

| Priority | Area | Observed difference | Status in 0.12.52 | Evidence |
|---|---|---|---|---|
| P0 | Release identity | Pages build hardcoded 0.12.7 rather than current databaseReleaseVersion | FIXED | tools/build_pages_artifact.mjs |
| P0 | Published release verification | Published index verifier hardcoded 0.12.7 | FIXED | tools/verify_published_snapshot.mjs |
| P0 | Public release display | Footer/readme/commands report historical version 0.12.4/0.12.38/0.12.51 | FIXED | index.html, README.md, DEPLOY_COMMANDS_POWERSHELL.txt |
| P0 | Browser cache busting | Old app.v1204/site.v1204 and query strings ?v=1203 on new release | FIXED | index.html, assets/app.v1252.js, assets/site.v1252.css |
| P0 | Snapshot consistency | JS accepted preload even if release/index timestamp differed | FIXED | assets/app.v1252.js |
| P1 | Navigation arrows | Reference scroll-left/right buttons missing, primary navigation moved on overflow | FIXED | index.html, assets/app.v1252.js, assets/site.v1252.css |
| P1 | Settings icon | Unicode settings glyph not SVG geometry from reference | FIXED | index.html |
| P1 | Pagination defaults | Initial report page limit was 50 instead of 25 in VulkanScope | FIXED | index.html, assets/app.v1252.js |
| P1 | Resetting filters | Reference clear-filters button missing from OpenCL control row | FIXED | index.html, assets/app.v1252.js |
| P1 | Inactive filters | Vendor/API/sort controls appeared for aggregate views despite not filtering entries | FIXED | assets/app.v1252.js |
| P1 | Date display | Report row printed formatted date AND raw ISO stamp in same row | FIXED | assets/app.v1252.js |
| P0 | Producer compatibility | OpenCL schema1, strict 1.0.14/10014 and historical manifest; Vulkan schema2/3 and different reports | INTENTIONAL | worker/src/index.js |
| P0 | API collection registry | OpenCL cl.xml is authoritative; Vulkan vk.xml is non-equivalent | INTENTIONAL | registry/cl.xml; rules/PROJECT_RULES.md |
| P0 | Runtime support rules | OpenCL real platform/device query evidence cannot be replaced with Vulkan WSI/Turnip semantics | INTENTIONAL | worker/src/query-manifest.js; rules/PROJECT_RULES.md |
| P1 | Navigation hierarchy | Vulkan has 18 workspaces vs OpenCL 10; OpenCL must implement applicable features without invented Vulkan pages | PENDING | reference/assets/app.v1412.js vs assets/app.v1252.js |
| P1 | Top bar positioning | Reference has settings button before brand; OpenCL button after navigation; spacing differs | PENDING | index.html |
| P1 | Browser support gate | Reference has gated startup + browser feature diagnostic screen; OpenCL starts directly | PENDING | reference/index.html browserCompatibilityGate |
| P1 | Startup skeleton/loading | Reference has databaseLoading overlay and progress; OpenCL has status line only | PENDING | reference/index.html databaseLoading |
| P1 | Network banners | Reference separate online/offline badge, titles, progress; OpenCL single text-only banner | PENDING | reference/index.html networkStatusShell |
| P1 | Scroll controls | Reference integrated page top/bottom and viewport scrollbar; OpenCL none | PENDING | reference/index.html viewportScrollbar |
| P1 | Filter taxonomy | Vulkan has 20+ domain filters incl HDR, driver, ABI; OpenCL has vendor/version/status/order only | PENDING | reference/index.html vs index.html |
| P1 | Filter animations | Reference uses animated filter popovers, scroll, x/clear, responsive wrapping; OpenCL native select | PENDING | reference/assets/app.v1412.js vs assets/app.v1252.js |
| P1 | Detail tabs | Reference Registry, Limits, Queues, Raw TXT, other Vulkan sections; OpenCL 11 distinct tabs | PENDING | reference/assets/app.v1412.js vs assets/app.v1252.js |
| P1 | Report detail layout | Reference report summary, GPU/driver badges, navigation/header and per-tab filters more extensive | PENDING | reference/assets/app.v1412.js vs assets/app.v1252.js |
| P1 | Aggregates | Vulkan capabilities loaded-universe denominator and missing=Unknown; OpenCL lists evidence per report | PENDING | reference/assets/app.v1412.js vs assets/app.v1252.js |
| P1 | Charts/statistics | Reference Statistics workspace; OpenCL no matching aggregate chart/trend subsystem | PENDING | reference/assets/app.v1412.js NAV |
| P1 | Compare semantics | OpenCL compares positional flattened JSON leaves; reference compares semantic normalized capabilities | PENDING | assets/app.v1252.js function flatten |
| P1 | Snapshot design | Reference release manifest, chunked cached full-report downloads; OpenCL capped preload + on-demand details | PENDING | tools/build_snapshot.mjs vs reference/assets/app.v1412.js |
| P1 | Live sync timing | Reference interval 3000ms plus release-state checks; OpenCL visible-only 10000ms | PENDING | reference/assets/app.v1412.js vs assets/app.v1252.js |
| P2 | Settings panel | Reference backdrop, proper close/focus, privacy, persistence and expanded preferences | PENDING | reference/index.html settingsBackdrop |
| P2 | Regional formatting | Reference timezone, date, clock, country, daylight options; OpenCL browser-default date | PENDING | reference/index.html settingsRegionalMode |
| P2 | Privacy UX | Reference saved settings/favorite controls and destructive confirmation; OpenCL localStorage toggles only | PENDING | reference/index.html destructiveConfirmDialog |
| P2 | Vendor logos | OpenCL reuses pinned official upstream GPU vendor assets; content differs by available evidence | INTENTIONAL | assets/gpu-vendors |
| P2 | Brand colors | OpenCL #3DAE2B green vs Vulkan #A41E22 red; brand-only, keep technical state colors | INTENTIONAL | assets/site.v1252.css |
| P2 | International/official names | Vulkan® and OpenCL™ marks differ; OpenCL tokens remain canonical | INTENTIONAL | index.html |
| P2 | Icon library | Reference more dedicated interactive icons; OpenCL local SVG + subset reused | PENDING | assets/ui vs reference/assets |
| P2 | Keyboard accessibility | Reference focus management, D-pad-style navigation and scroll support broader | PENDING | reference/assets/app.v1412.js |
| P2 | Responsive mobile | Reference drawer, wrapped filters and multiple viewport breakpoints; OpenCL simpler | PENDING | reference/assets/site.v1412.css vs assets/site.v1252.css |
| P2 | Browser checks | Reference browser-compat and CSP/bootstrap scripts; OpenCL lacks equivalent bootstrap | PENDING | reference/assets/browser-compat.v1412.js |
| P2 | Color/style selectors | Existing upstream-reference.css is old derived reference and is supplemented with small OpenCL overrides; not pixel parity | PENDING | assets/upstream-reference.css + assets/site.v1252.css |
| P2 | GPU/driver naming | Vulkan-specific mode label Turnip/System cannot be fabricated in OpenCL reports | INTENTIONAL | rules/PROJECT_RULES.md |
| P2 | Historical assets | Vulkan package includes many legacy scripts, tests, logs and icons; OpenCL intentionally ships leaner history | INTENTIONAL | FILE_BY_FILE_COMPARISON.tsv |
| P2 | Snapshot workflow | Both use Pages/Worker pipeline, but Vulkan stronger static audit and consistency scripts exist | PENDING | reference/tools vs tools |
| P2 | Live production verification | Neither source ZIP validates real Pages and Worker deployment in this session | NOT_TESTED | QA_RESULTS.md |

## Safe staged remediation

### Stage 1 — corrected in 0.12.52

Resolved the release-pipeline mismatch, browser asset versioning, metadata, usable navigation arrows, the reset-filter action, reference page-size default, misleading inactive filter choices, clean timestamps and release-coherent snapshot preloads. Kept OpenCL producer and registry unchanged.

### Stage 2 — open work; NOT claimed as corrected

Refactor OpenCL-appropriate navigation, aggregate coverage denominators, capability-specific filters, detailed report layouts, meaningful semantic compare, and cache/manifest parity. Create runtime screenshots across desktop/mobile and regressions for each change. No Vulkan-only fields.

### Stage 3 — open work; NOT claimed as corrected

Match locale and settings controls, browser capability gate, online/offline state, bootstrap loading, scroll affordances and accessibility/focus interactions. Test against reference screenshots at equal viewport sizes.

### Stage 4 — open work; NOT claimed as corrected

Harden snapshot worker/pages identity, live D1 publishing, post-deploy verification on the actual domain and historical report compatibility with real fixtures. Do not invent production success.

## Hard limits on parity

- OpenCL schema1 technical queries are incompatible with Vulkan-specific Surface/WSI, Turnip and Vulkan registry structures. A UI action is portable only if its evidence/action exists in OpenCL.
- Source-level comparison and local tests do not prove real device/browser equivalence, live Cloudflare deployment or every exact wording match.
- This release is a finished Stage-1 package, **not** a false claim that all stages have been completed.
