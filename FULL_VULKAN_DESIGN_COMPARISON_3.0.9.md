# VulkanScope Database 1.4.12 ↔ OpenCLScope Database 3.0.9 — source and behavior comparison

## Scope and reference integrity

Reference archive: **VulkanScope-Database-1.4.12.zip**. Baseline: **OpenCLScope-Database-3.0.8.zip**. Target: **OpenCLScope Database 3.0.9**, UI-only and static Worker-release identifier update. The pinned source stylesheet `assets/vulkan-layout.v1412.css` has the exact SHA-256 of VulkanScope's `assets/site.v1412.css`: `bd5957461701439a7655c652b4e560cb84b7cc0163f202a257e019c2c468181b`. Upstream rulebooks, official cl.xml, images and OpenCL report signatures were not replaced with Vulkan data.

The VulkanScope reference JavaScript (~387 KB) implements API-specific data processing and is not interchangeable with OpenCLScope (~86 KB). Its Vulkan WSI/Surface/HDR/Turnip content is NOT an OpenCL device fact. Shared UI conventions and behavior should align where backed by actual OpenCL reports.

## Phased change matrix

| Stage | Subsystem | Observed 3.0.8 difference | 3.0.9 disposition |
|---|---|---|---|
| 1 | Browser compatibility | No equivalent unsupported-browser preflight, app root not explicitly gated | **FIXED:** reference-compatible feature/version gate with OpenCL-specific warnings, noninteractive main app hidden for unsupported browsers |
| 1 | Destructive confirmation | Settings clear saved data used `window.confirm`, unlike VulkanScope-shaped modal | **FIXED:** reference dialog markup/geometry, Escape, Cancel, backdrop, focus containment and return, controlled destructive action |
| 1 | Indexed report filters | Only vendor/OpenCL version/device/driver, no Android manufacturer/model, platform, time period | **FIXED:** manufacturer/model/platform/7/30/90/365-day filters from actual report index; no inferred support claims |
| 1 | Query status filter | `not_applicable` unavailable as a filter despite valid query state | **FIXED:** explicit state option; `unavailable`, `error` and `unknown` remain separate |
| 1 | Clear filters | Only reset original filter subset | **FIXED:** new fields reset too; original 25/50/100 pager preserved |
| 1 | Asset cache/version | Shared reference CSS and bespoke v1002 JS/style were unchanged after new UI work | **FIXED:** v1003 JS, CSS and compatibility asset, aligned HTML/workflow/verifier/clean-install maintenance |
| 1 | Worker and producer | Database UI releases historically forced Android producer updates | **PRESERVED BY DESIGN:** Database release becomes 3.0.9 while new POST producer remains 3.0.8/30008; historical GET remains readable |
| Existing | Responsive reference CSS | Shared source geometry already pinned | **PRESERVED BYTE-FOR-BYTE:** VulkanScope `site.v1412.css` and separately pinned immutable upstream CSS |
| Existing | Logo, favicon, vendor assets | OpenCL-only brand assets already in place | **PRESERVED:** reference geometry; proprietary Vulkan imagery not substituted |
| Existing | Navigation and settings | OpenCL workspace names and reference SVG shapes already installed | **PRESERVED:** native OpenCL labels; settings categories, focus controls and regional time choices |
| Existing | Report list/pagination | Existing 25/page + 50 item remote fetch, bounded cache | **PRESERVED:** 25/50/100 picker, local favorites, CSV-less explicit JSON/TXT/HTML exports |
| Existing | Responsive table scroller | Reference-derived table rail, pointer, touch/keyboard scroller | **PRESERVED:** no duplicate scrollers on repeated render |
| Existing | Snapshot/Worker | Snapshot-first and strict SHA256 canonical JSON, 16+211 query catalog | **PRESERVED:** production D1 schema, hard validation and report-ID derivation |
| 2 planned | Complete report detail | Different tab hierarchy, compact group/filter/control density | **REMAINS:** needs view-by-view browser comparisons with actual live reports; OpenCL typed values are authoritative |
| 2 planned | Semantic Statistics | Reference charts and capability cohorts more extensive | **REMAINS:** cannot fabricate aggregate OpenCL observations from an empty published snapshot |
| 2 planned | Compare | Semantic OpenCL tokens/identity are already used, but reference's full interaction layout differs | **REMAINS:** need exhaustive two-populated-report interaction and accessibility testing |
| 2 planned | Encyclopedia | Reference employs separate generated module and richer global token navigation | **REMAINS:** OpenCL-specific cl.xml registry and support-vs-reference distinctions must remain true |
| 2 planned | Browser metadata and compatibility integration | Reference has separate bootstrap and browser info modules | **PARTIAL:** compatibility feature/version check added; full reference module ecosystem not copied because of domain/API assumptions |
| 2 planned | Full `Info/About` and dialog shape audit | Source hierarchy and phrases still differ | **PARTIAL:** settings confirmation aligned; requires side-by-side live text, animations, browser/device locales |
| Not portable | Surface/WSI, HDR, display mode, Turnip, Vulkan extension/feature structs | Vulkan-only report evidence | **INTENTIONALLY NOT COPIED** into the OpenCL schema, registry, reports, index, or filters |

## Verified acceptance

- Pinned VulkanScope stylesheet SHA-256 byte equality.
- Official OpenCL registry/catalog and complete schema 1, 16 platform + 211 device tokens preserved.
- Database Worker release ID 3.0.9; **new producer is still OpenCLScope 3.0.8 / 30008**; exact older uploads remain rejected and historical GET is separately validated.
- Source and Worker test suite: **73/73 passed** including five new UI/contract tests.
- Browser interaction smoke in Chromium at **1440 × 900** and **390 × 844**, isolated with in-memory HTML, styles and scripts: successful application startup, no JavaScript page errors, no horizontal document overflow, Settings and its confirmation dialog, Escape and Cancel success.
- In-memory report-index test fixture (not shipped as a published report): vendor and manufacturer filtering, search reset, submission-date filtering and page rendering passed.

## Remaining verification gaps (do not claim otherwise)

- The automated browser run could not navigate loopback or `file://` URLs in this sandbox, so smoke tests injected unchanged local source into an in-memory document. Logo/image requests, cross-file HTTP CSP/cache semantics, Cloudflare login, GitHub Pages deployment and real network requests were **not** end-to-end verified.
- Reference-vs-OpenCL pixel-by-pixel equality has **not** been achieved or claimed; current shared CSS does not imply DOM/behavior parity.
- Fully populated table, Compare, Statistics, Encyclopedia and all detail tabs require real stored reports with supported attributes; current published index/snapshot fixtures contain zero public reports.
- Real Cloudflare Worker and GitHub Pages deployment must be performed by the operator; the new Database release should reach the Worker before Pages due to the exact release gate.
