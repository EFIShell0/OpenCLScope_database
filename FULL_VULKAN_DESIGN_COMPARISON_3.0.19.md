# OpenCLScope Database 3.0.19 — VulkanScope Database 1.4.12, comparison stage 10

## Source baseline
- Input ZIPs: `OpenCLScope-Database-3.0.18.zip` and the user-provided `VulkanScope-Database-1.4.12(1).zip`, independently opened and compared at `/assets/app.v1012.js` vs `/assets/app.v1412.js` and the CSS layers.
- VulkanScope 1.4.12 contains `aggregateCaps`, `aggregateEntryLists`, `variationMatches` and `supportCoverageMatches` for its report-level capability coverage, plus drill-down report modals. Previous OpenCLScope had no equivalent *cross-loaded-device* query aggregate for Features and Memory; its `recordEntries` displayed individual device rows.
- VulkanScope reports supply Vulkan-specific feature support fields and per-report normalized values. OpenCLScope schema 1 provides OpenCL runtime property query results and device/platform observations. The support denominator is not transferable: **OpenCL availability is not equivalent to Vulkan feature support**.

## Stage 10 changes
1. `queryCoverageModel(kind)` creates a deterministic universe of actual device property names for the Features and Memory subgroups. Selected reports must have complete loaded `technicalReport.platforms`; unloaded index summaries never enter the numerator or denominator.
2. Every loaded device contributes one observation to every property present in the loaded universe. Query missing from that device counts **Unknown (missing)** rather than Unavailable or Unsupported. Original `available`, `unavailable`, `not_applicable`, `unknown`, and `error` states remain separate. An available scalar `0` or `false` stays its literal value.
3. Vulkan-style group coverage table: counts and percentages with an explicit loaded-device denominator, query-state filters (including an Unknown coverage filter), property-name/value search, distinct-value view, value behavior (varying/uniform/missing), and 25/50/100 global pagination. The existing per-record rows can still be selected.
4. Evidence modal lists each device's *reported* result or explicit missing fact; a verified-shaped canonical SHA-256 report ID is linked for each device. Modal inherits keyboard/ESC, 10/25/50 sub-paging and focus containment from 3.0.18; no dynamic untrusted HTML is generated.
5. Version-bumped JS `app.v1013.js`, CSS `site.v1012.css`, Worker/release/snapshot 3.0.19 and CI/test paths. Added direct data-model negative tests and two Chromium viewports.

## Evidence and non-regressions
- Current new report producer remains **OpenCLScope 3.0.8 / 30008 only**; all existing historical GET constraints preserved. No D1 migration or report payload rewrite.
- Original Khronos OpenCL `registry/cl.xml` and VulkanScope 1.4.12 `assets/site.v1412.css` design source are preserved byte-for-byte; platform/device vendor logos remain pinned, so brand changes are confined to OpenCL's delta CSS.
- Data-model tests require correct device denominator, missing Unknown state, zero/false literal values, a filtered-out loaded report not entering coverage, and individually linked report sources.
- The browser tests exercise isolated synthetic fixtures and are **not** live Cloudflare production checks or proof of pixel-level parity on every screen.

## Remaining gaps / future stages
- VulkanScope includes more elaborate grouped property/limit breakdowns, grouped support bars and context-sensitive long-press menus; OpenCL's property groups are query-name-derived and cannot honestly be labeled Vulkan-style boolean support.
- Image format group overlap/frequency, multi-value evidence distributions and advanced reporting interactions can be further converged without inventing runtime support.
- Additional responsive/animation, settings, and details screens require side-by-side browser screenshots against a running VulkanScope reference; reusing byte-identical base CSS alone does not prove exact layout or interaction parity.
- Cloudflare Worker, D1, GitHub Actions and live GitHub Pages must be checked after an actual authorized deployment; none was performed for this package.
