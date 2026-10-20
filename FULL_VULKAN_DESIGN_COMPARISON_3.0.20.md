# OpenCLScope Database 3.0.20 — VulkanScope 1.4.12 comparison, stage 11

## Sources independently examined
- OpenCLScope Database 3.0.19 ZIP, SHA-256 `334f18052d5133ad7823b023b9b11b9119d4cd4b343f6a26c3858474b7e6b171`.
- VulkanScope Database 1.4.12 ZIP, SHA-256 `05050c880d89868e2dec0fd6c71b925591a3f9194be829ef9b1ad9f499e89c3c`.
- Upstream behavior source: `assets/app.v1412.js`, in particular `renderFormats()`, `formatFieldState()`, `supportCoverageMatches()` and grouped coverage rows. Immutable upstream visual source: `assets/site.v1412.css`.
- OpenCL baseline behavior source: `assets/app.v1013.js`, `recordEntries('formats')`, raw detailed `technicalCards(...,'Formats')` and the previously introduced Features/Memory query coverage.

## Verified before-patch differences
1. VulkanScope aggregates canonical format entries across selected reports; OpenCLScope 3.0.19 Formats showed individual device group queries without a cross-device coverage table.
2. VulkanScope provides group and availability controls, format search and coverage ratios; OpenCL formats were searchable at the individual-record level only. Its UX controls were therefore not equivalent.
3. Vulkan features distinguish supported/unsupported based on actual per-format feature bitmasks; OpenCL `clGetSupportedImageFormats` returns an error/status and a list of exact `cl_image_format` pairs. Copying `Supported %` semantics across APIs would be technically false.
4. Previous OpenCL Formats offered no denominator for pair frequency and no device-by-device positive/empty/missing/error evidence modal.

## Stage 11 implementation
- Versioned `assets/app.v1014.js` and `assets/site.v1013.css` add `imageFormatCoverageModel()` and `renderImageFormatCoverage()`.
- Groups keyed by exact reported image-type/access-flags pair. Only fully loaded reports passing indexed search/filter selection enter the denominator; indexed-only reports are excluded and disclosed.
- Every loaded device contributes one outcome for each union group: `available`, `unavailable`, `not_applicable`, `unknown`, or `error`. Missing group queries contribute Unknown plus an explicit missing count. Successful empty format lists remain Available with zero pairs.
- Format pairs are normalized by recorded numeric order/type evidence (with raw-name fallback), deduplicated per device, and shown with numerator and both denominators: successful group queries and all loaded devices. The UI distinguishes a pair not listed in a successful query from a group not reported or queried successfully.
- View modes: grouped query coverage; unique reported channel format pairs; original per-device group rows. State filters, group coverage filters, type/flag/pair search, 25/50/100 global pagination, and source-report evidence modal retain the existing DOM-safe keyboard interactions.
- Version-bumped static snapshot/index/release markers, Worker identity, Pages workflow, release validator and stale-asset reconciliation. No report schema, API POST gate, canonical raw data, import/export output or D1 migration changed.

## Non-regression boundaries
- The correct published OpenCL producer is 3.0.8 / 30008 only; the historical read admission and 16-platform/211-device current query manifest remain unchanged.
- Official OpenCL `registry/cl.xml` SHA-256 remains `c24f63ad9aa5776fe67808926ae85613248ebbeefa7373fceb406a0bd12ce016`.
- Pinned VulkanScope 1.4.12 design CSS SHA-256 remains `bd5957461701439a7655c652b4e560cb84b7cc0163f202a257e019c2c468181b` and is unmodified in both copies.
- Tests include image-format group and pair evidence, duplicate pair prevention, Unknown/missing, Not Applicable/Error separation, source links and mobile/desktop browser interactions. See `QA_RESULTS.md`.

## Still incomplete; not asserted as solved
- VulkanScope's format-bit filters, grouped bars and animations are not one-for-one mappable to OpenCL's distinct image-format mechanism; the corresponding OpenCL-safe presentation can be refined further.
- Remaining global appearance/spacing, right-click and touch context menu behavior, layouts, transition animations, nested technical/Reports pages, filters and privacy/settings parity need targeted side-by-side runtime comparison, not merely matching CSS checksums.
- Actual production Cloudflare D1/Worker/GitHub Pages and authenticated live Android report ingestion have not been tested here; no deployment executed. Chromium tests use synthetic local fixtures and do not establish physical-device support or pixel-level identical UIs.
