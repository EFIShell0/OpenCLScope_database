# OpenCLScope Database 3.0.21 — VulkanScope Database 1.4.12 comparison, stage 12

## Audited immutable inputs
- OpenCLScope Database 3.0.20 ZIP: `89e49294becbb5d266539ee501502d89c97122a46a1622467e5059b71293b1df` (directly opened).
- VulkanScope Database 1.4.12 ZIP: `05050c880d89868e2dec0fd6c71b925591a3f9194be829ef9b1ad9f499e89c3c` (directly opened).
- Upstream extension presentation: `assets/app.v1412.js`, `renderExtensions()` (cross-report extension coverage, namespace and coverage filters). Immutable upstream CSS: `assets/site.v1412.css`, locally pinned to `assets/vulkan-layout.v1412.css` and `rules/UPSTREAM_REFERENCE_SITE_CSS.css`.
- Existing OpenCL source: `assets/app.v1014.js`, `recordEntries('extensions')`; existing per-report extension rows lack grouped enumerated-device denominator, cross-report percentages, verified missing/failed query distinction, source evidence drill-down and upstream-style filters.

## Implemented stage 12
1. New browser asset `assets/app.v1015.js` adds `extensionCoverageModel()` and `renderExtensionCoverage()`. The default Extensions workspace provides an authoritative, selected-report, per-device extension-declaration table; controls switch between device/platform/both scopes, namespace, coverage class, query state, name/source search and recorded individual entries. Page limits remain 25, 50 or 100.
2. Per-scope denominator counts every *loaded* platform or device, not once per report. Indexed-only reports are excluded and disclosed. Only a real successful `CL_DEVICE_EXTENSIONS` / `CL_PLATFORM_EXTENSIONS` query licenses a declaration or a confirmed not-listed state; unavailable/not-applicable/unknown/error and absent queries remain differentiated and are never counted as authoritative negatives.
3. Each extension is counted at most once per enumeration. Coverage shows advertised/total (all selected loaded enumerations) and separately the number of successful list queries. `cl_khr_icd` remains a platform-only declaration where actually reported; platform/device membership is never copied between scopes. Extension name presence is *not* proof a runtime function works, nor inferred from cl.xml reference registration.
4. Detailed evidence modal uses DOM text nodes (not raw HTML), 10/25/50-field paging and the genuine source report ID; individual original name entries retain a visible query status and OpenCL return code. Touch/context action, focus/Escape and other prior shared behaviors remain intact.
5. New presentation CSS `assets/site.v1014.css` adds responsive table/controls styling only; pinned upstream CSS and brand assets remain byte-identical. Release marker, HTML, Worker database-release identity, Pages workflow, snapshot tooling, repository hygiene and regression inventory are synchronized to 3.0.21. D1 schema, POST/GET validation, 3.0.8 / 30008 accepted producer, immutable OpenCL registry, and caching/snapshot publication rules are unchanged.

## Evidence and limitations
- 98/98 complete frontend Node regression tests PASS (including 4 new extension-model tests), 19/19 Worker tests PASS, repository inventory PASS, release verification PASS, Pages artifact build PASS.
- Chromium test with an in-memory isolated HTML page (no remote/local HTTP navigation) at 1440×900 and 390×844 PASS: scope/namespace/search, evidence dialog/source links, Escape, raw rows, zero JS page exceptions. Fixtures are synthetic combinations of the local complete report, not production OpenCL hardware, and the about:blank context does not load relative images.
- Direct browser navigation to HTTP localhost and file URLs was blocked by the test environment, so no full site-origin browser navigation/end-to-end network test is claimed. No real Cloudflare Worker, D1, GitHub Pages, authenticated report ingestion or Android hardware test was performed.

## Remaining stage gaps, not claimed fixed
- Upstream Vulkan extension-spec-version and device-driver-specific badge distribution cannot be copied to OpenCL's differently shaped declaration records without valid producer evidence. Further extension-by-extension detail, registry matching and runtime enumeration consistency could improve presentation while keeping strict evidence semantics.
- Full VulkanScope visual parity, selected Reports/Compare/settings disclosures, contextual touch controls, page transition geometry and mobile alignment require a targeted side-by-side browser comparison at actual served origins with real report data. No pixel-equality claim is made.
