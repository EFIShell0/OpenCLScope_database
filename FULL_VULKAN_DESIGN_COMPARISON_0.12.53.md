# Design and interaction audit — OpenCLScope Database 0.12.53 vs VulkanScope Database 1.4.12

## Method and scope

Reference: **VulkanScope Database 1.4.12**; baseline: **OpenCLScope Database 0.12.52**; new result: **0.12.53**. Compared the two complete source archives, their HTML anchors, current CSS/JS, portable menus and navigation, and OpenCL producer/report contracts. The 0.12.52 inventory remains under `rules/history/`. The reference has 100 unique HTML element IDs; 0.12.53 has 72, 40 of them with the same IDs. This does **not** constitute complete DOM or pixel parity.

| Area | 0.12.52 problem | 0.12.53 disposition |
|---|---|---|
| Primary topbar | Settings at right; competing button spacing | **Changed:** Settings first, brand second, horizontally scrollable navigation third; reference button path retained |
| Navigation icons | Custom OpenCL SVG set differed from Vulkan | **Changed:** reference `ICON_PATHS` geometry for matching functions, `instance` icon for OpenCL platforms |
| Navigation scroll | Had arrows, older presentation | **Changed:** reference-shaped scroll controls, edge fade and disabled state |
| Hero surface | Reference CSS overridden by a separate red-toned local style | **Changed:** current Vulkan hero/style layer plus OpenCL green accent and neutral surface palette |
| Dataset metric tiles | Separate OpenCL sizing and cards | **Changed:** shared reference metric/hero surfaces; OpenCL counters remain authoritative |
| Search | Always-visible X and separate card dimensions | **Changed:** aligned input/surface and X only when search contains text |
| Filters | Native select rectangles rather than reference interactive listboxes | **Changed:** compact custom listbox UI, native select remains authoritative; keyboard focus and selection changes wired |
| Filter reset | Visible on untouched filters | **Changed:** Clear filters hidden by default, visible only with active filters |
| Pagination | Separate box sizes and spacing | **Changed:** consistent compact arrow/page-number layout with 25-item default |
| Report index cards | Separate rounding/spacing and status palette | **Changed:** reference dark neutral card surface with same bounded OpenCL fields and GPU vendor icons |
| Report detail tabs | Different visual surface and actions | **Changed:** shared tab/button spacing, sticky action-row appearance; OpenCL report tabs retained |
| Startup experience | Plain text instead of reference loading component | **Changed:** logo-based index loading panel with completion state |
| Network banners | Only one text banner | **Changed:** reference-like title/message/status badge and progress stripe; no invented live connectivity result |
| Settings button/drawer | Separate drawer and no backdrop or focus trap | **Changed:** reference-like backdrop and modal drawer, Escape close, focus return and keyboard loop |
| Scroll UI | No page up/down or viewport position controls | **Changed:** page-scrolling buttons and compact synchronized scroll position indicator |
| Mobile UI | Filter and navigation overflow risk | **Changed:** two-column filter grid, single-column narrow view, responsive detail actions; tested at 390px |
| Reduced motion | Partial handling | **Changed:** reduced-motion media query and maintained preference switch |
| Blocked local storage | Could abort initial screen wiring in restricted browsers | **Changed:** storage reads/writes guarded; report and network state remain usable |
| Backend validation | Strict OpenCL 16/209 query evidence | **Unchanged:** no Vulkan schema/WSI/Turnip data introduced |
| Snapshot/cache | Index-first plus bounded details, 10s visible sync | **Unchanged intentionally for this release:** no forced re-download on navigation |
| Semantic compare | OpenCL still uses flattened position-based leaves | **PENDING:** reference normalizes capabilities semantically |
| Settings breadth | Reference has browser, regional and expanded favorites/privacy controls | **PENDING:** OpenCL has fewer applicable settings and no region/time-zone controls yet |
| Browser compatibility gate | Reference has explicit unsupported-browser diagnostic | **PENDING:** OpenCL has baseline web-feature handling only |
| Aggregates and Statistics | No equivalent advanced Vulkan coverage charts or per-capability percentages | **PENDING:** requires separate OpenCL evidence-aware implementation |
| Full report detail density | Reference has more per-tab filters and data detail controls | **PENDING:** OpenCL-specific complete report view remains different |
| Filter families | Vulkan has WSI/HDR/Turnip and many Vulkan-only filters | **INTENTIONAL:** those filters may not be copied without corresponding OpenCL evidence |
| Core registry and report format | Different Khronos API, current schemas | **INTENTIONAL:** OpenCL `cl.xml`/schema1 is normative and must never be replaced by Vulkan files |
| Actual production presentation | No live Pages/Worker access or identical-reference screenshots | **NOT VERIFIED:** no deployment or pixel-diff claim |

## Residual risks and next work

The current release substantially reduces **shared visual-shell differences**, but it does not make all navigation destinations, content charts, settings choices or report internals identical. In particular, copying Vulkan WSI, Surface, Turnip, HDR or driver-mode controls would violate `rules/PROJECT_RULES.md`. Remaining portable features should be implemented from genuine OpenCL query evidence, compared with reference screenshots at identical viewports, and regression-tested separately. No historical report data was altered to make screenshots look populated.

## Evidence

- `python -B tools/verify_release.py`: PASS
- `node --test tests/*.test.mjs worker/tests/*.test.mjs`: 47/47 PASS
- `node tools/build_pages_artifact.mjs`: PASS; static allowlist copies latest assets
- Local in-memory Chromium visual smoke: 1440×900 and 390×844, no page errors or horizontal overflow; Settings open/close and tab changes PASS
- Real Cloudflare/GitHub Pages deployment and populated live data screens: NOT EXECUTED
