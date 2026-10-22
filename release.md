# OpenCLScope Database 3.4.9

Paired to OpenCLScope 3.4.0/30400. Strict new report admission, historical read-only 3.2.0/30200, Image format `specWarning` integrity and native QCOM typed byte decoding; preserve pinned VulkanScope CSS, OpenCL registry and report-scoped evidence.

# OpenCLScope 3.4.0 — Release notes

**Paired components:** OpenCLScope Android 3.4.0 (30400) / OpenCLScope Database 3.4.9. Based on immutable 3.2.0 predecessor archives; no 3.3.0 intermediary claimed. Engineering baseline: bundled `rules/PROJECT_RULES.md` and immutable VulkanScope reference, Khronos OpenCL unified API, and Android native library rules.

## Corrections

1. Runtime aggregation considers the native library handle alongside platform handle. Independent implementations with identical numeric platform IDs and descriptive properties remain separate; aliases of the exact same loaded library are not duplicated.
2. A first runtime that yields a `partial` report no longer prevents scanning subsequent accessible libraries. The partial state remains partial even if another valid runtime is found. When no other GPU is exposed, the original partial report is preserved.
3. `clGetSupportedImageFormats` results retain all original driver rows (including duplicates). The derived `specWarning` field marks unpacked `CL_RGB` three-channel data types whose element bit count violates the Khronos power-of-two constraint. This is a **specification warning**, not a claim that `clCreateImage` was called or failed. Packed formats such as `CL_UNORM_SHORT_565` are not spuriously flagged.
4. `CL_DEVICE_PAGE_SIZE_QCOM` and `CL_DEVICE_EXT_MEM_PADDING_IN_BYTES_QCOM` continue to preserve `value` as original raw bytes. When the returned payload is exactly native 4-byte `cl_uint`, add `decoded` with validated value, unit and original byte order. Driver support is never inferred from extensions alone.
5. TXT/HTML/application format details and the Database frontend show image-format warnings. Database verifies the report shape, recomputes QCOM numeric results and warning semantics, and preserves original historical report contracts.
6. The OpenCL 3.1.2-derived 16 platform, 211 device and 24 image-query-group inventory and all three official project ABIs (`armeabi-v7a`, `arm64-v8a`, `x86_64`) are unchanged.

## Caveats

- A physical Adreno 830, Mali-G52, other GPU or Android device was **not** tested in this run. Real OpenCL runtime ability depends on manufacturer firmware and Android native linker access policy.
- Image format anomalies from the user-supplied Adreno 830 report remain driver-reported findings; the project does not call `clCreateImage()` merely to test a listed format, and no conformance certification is asserted.
- The app 3.4.0 report schema remains 1, with additional constrained evidence fields for this exact producer version. Older report layouts remain historical only.

## Official references

- https://registry.khronos.org/OpenCL/specs/unified/refpages/man/html/cl_image_format.html
- https://registry.khronos.org/OpenCL/specs/unified/refpages/man/html/clGetSupportedImageFormats.html
- https://github.com/KhronosGroup/OpenCL-ICD-Loader
- https://source.android.com/docs/core/permissions/namespaces_libraries

## 3.4.1 deployment and UI parity hotfix
- Restore verified Windows → Build → Release → Pages deployment and separate snapshot jobs.
- Restore the release bootstrap readiness/consented auto-refresh flow and cache-key 3401.
- Restore full deployed-HTML/JavaScript verification, deterministic release packaging and responsive filter panel selectors.
- Preserve new POST OpenCLScope 3.4.0/30400, registry, D1 contract and historical reports.

## Database 3.4.2 — 22 October 2026

- Fixed Statistics extension evidence truncation at 100 entries with reference-style paginated access to all matches and 25/50/100 row sizes.
- Restored correct page reset and bounded Go input when frequency filters change.
- Fixed keyboard focus of inactive custom scrollbars; kept reduced-motion table navigation.
- Preserved OpenCLScope 3.4.0 producer contract, registry and VulkanScope 1.4.12 immutable CSS.
- 161 regression tests passed; no live GitHub/Cloudflare deployment was performed.

## Database 3.4.3 — 22 October 2026

- Removed blocking post-deploy Refresh modal and duplicate release polling; opt-in automatic refresh or dismissible notice remains.
- Kept staged Windows, Build, Release and Pages deployment and strict Cloudflare report-validation contracts.

## Database 3.4.4 — 22 October 2026

- Added binding VulkanScope Database 1.4.12 exact-component parity and no-surplus-copy requirement to `rules/PROJECT_RULES.md`. Only real OpenCL differences, privacy, accessibility and brand-green substitutions are justified exceptions.
- Transplanted the four original VulkanScope Settings category SVG icon paths and its loading halo/spinner/progress DOM. Startup progress advances on actual local source-settlement events.
- Pinned 128 upstream-origin CSS rules for shared loader, Settings, navigation/table/viewport scrolling and filtering components in `assets/reference-shell.v3404.css`, with OpenCL-brand color substitution. Upstream VulkanScope CSS and Khronos cl.xml remain byte-for-byte unchanged.
- Added shell stylesheet to versioned Pages snapshot release readiness, build-time/publication checks and immutable cache asset verification.
- Added parity regression tests and a precise comparison inventory. 167 local tests passed; populated upstream pixel/behavior identity and live Cloudflare deployment are not claimed.

## Database 3.4.6 — 22 October 2026

- Reworked Reports pagination to use the VulkanScope 1.4.12 toolbar’s 10/25/50 row counts.
- Removed duplicate visible Sort and Page limit controls from the Reports filter panel, retaining them only where appropriate in other workspaces.
- Preserved a separate report-specific page size and active-view-aware page counter and Go behavior. Other workspaces retain 25/50/100 evidence paging.
- Retained 3.4.5 global search, Copy ID and keyboard/touch fixes, strict OpenCL validation, pinned Khronos registry and VulkanScope references; live deployment and full visual parity remain unverified.
- VulkanScope pinned sources, original OpenCL report evidence and staged CI/release/deploy retained. Full populated-site visual parity is not claimed.

## Database 3.4.9 — 22 October 2026

- Aligned browser tab titles with VulkanScope: root Reports app title, workspace title with a hyphen and the current report GPU/tab when a detail view is open.
- Added the OpenCL favicon `.ico` shortcut and explicit PNG/Apple icon dimensions.
- Removed 44 legacy root documents, inventories and README from the packaged source. Current release notes and changelog are retained; external QA/comparison files remain available separately.
- Added hash-guarded cleanup of legacy root documents when applying the ZIP over an older checkout; user-edited versions are protected.
- Preserved registry, Worker submission validation, report data and immutable upstream styles. Existing cross-product table/chart visual gaps still require actual browser comparison; live deployment not tested.
