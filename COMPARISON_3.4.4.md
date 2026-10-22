# OpenCLScope Database 3.4.4 — VulkanScope 1.4.12 source-level parity audit

## Immutable sources
- OpenCL base: user Library OpenCLScope-Database-3.4.3.zip.
- Upstream reference: VulkanScope-Database-1.4.12(1).zip.
- Exact upstream `assets/site.v1412.css` SHA-256: `bd5957461701439a7655c652b4e560cb84b7cc0163f202a257e019c2c468181b`.
- Official Khronos `registry/cl.xml`, pinned upstream CSS and upstream engineering rules were **not modified**.

## Mandatory rule change
`rules/PROJECT_RULES.md` now explicitly requires corresponding HTML, CSS, JS, UI text, menus, dialogs, animations, icons, scrolling, statistics and workflows to be **identical to VulkanScope 1.4.12 wherever semantically applicable**, without added/deleted/paraphrased visible copy. OpenCL-only semantic/brand substitutions require justification; evidence/data contracts, accessibility and permissions override blindly copied Vulkan semantics.

## Implemented and verified source changes
1. Settings category toolbar: exact four upstream SVG path shapes, upstream `<svg>` elements, toolbar class and roving tabindex pattern. Previous unique placeholder icon spans removed.
2. Initial loading interface: upstream DOM geometry (`database-loading-halo`, `database-loading-spinner`, `database-loading-track` and `databaseLoadingProgress`), retained OpenCL logo and truthful cache wording; progress responds to local resource-settlement events.
3. Shared component styling: 128 qualified blocks carried in source order from upstream for common loading, Settings, navigation scrollers, tables, viewport scrollbar, filters and section titles. Only OpenCL green/neutrals replace upstream red brand decorations. CSS is loaded as a final versioned component override. This is **not** a complete site CSS replacement.
4. Deployment readiness: new `shellCss` is mandatory in source marker, snapshot builder, published asset verifier and client release bootstrap. Source marker remains `releaseReady:false` until successful snapshot build.
5. Added strict-source-parity regression tests. Existing OpenCL producer, typed QCOM/image-warning evidence, D1 and historical read paths remain unchanged.

## Static DOM inventory and pending work
OpenCL static element IDs: 111; VulkanScope: 100; shared: 73; OpenCL-only: 38; Vulkan-only: 27.
Common-ID count alone is *not* a score of visual or functional parity. Many OpenCL-only controls are necessary technical substitutions, while many Vulkan-only filters concern non-OpenCL properties.

| Area | Current audit result | Remaining verification and implementation |
|---|---|---|
| Settings category icons | Actual upstream SVG shapes transplanted | Full settings text, information cards, toggle timing, focus and modal pixel-level matching not yet tested |
| Loading shell | Upstream loader markup and selected animation/visual styles transplanted | Real HTTP streaming transitions and device timing not live-tested |
| Scrollbars / table controls | Upstream-origin style rules layered for shared classes | Populated Reports/Compare/Statistics table widths, arrow-state behavior and touch comparisons not fully reviewed |
| Filters / navigation | Upstream shared selectors layered | Entire custom filter menus, workspace-specific controls and breakpoints still differ |
| Reports | Previous OpenCL-specific renderer retained | Column order/labels, actions, disclosure and source-report interactions require pairwise populated comparison |
| Statistics | Existing OpenCL aggregate logic retained | Donut/percentage visual identity and category-specific chart controls not fully equivalent |
| Compare | Canonical OpenCL identity matching retained | Full VulkanScope animation, layout and control equivalence not verified |
| Settings / Information | Current secure local-only preferences retained | Reference component text and nonportable Vulkan facts must be mapped line by line |
| Deploy and auto-update | Versioned stylesheet included in readiness, existing consent maintained | Live GitHub Actions/Cloudflare execution and browser refresh not tested here |

## Explicit differences retained for correctness
- Vulkan renderer data, Vulkan/WSI/HDR/Turnip properties and Vulkan-only filters cannot appear as OpenCL evidence.
- OpenCL green is substituted for Vulkan brand red on otherwise matching shared widgets.
- Historical OpenCL report schema and producer validation must not change to force Vulkan data/layout parity.
- Automatic browser reload remains explicit user opt-in; no unconsented refresh.

## Evidence limits
167/167 static/frontend/Worker tests pass; Chromium static HTML/CSS at 1440×900 and 390×844 found four Settings SVGs, loader controls and no horizontal viewport overflow. No live server/browser end-to-end or pixel-overlaid populated Vulkan-vs-OpenCL screenshot comparison was performed. Remaining areas above are deliberately not described as fully matched.
