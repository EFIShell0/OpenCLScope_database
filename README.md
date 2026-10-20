# OpenCLScope™ Database 3.0.25

Stage 12 of the **incremental comparison against VulkanScope Database 1.4.12**, preserving authentic OpenCL™ runtime evidence and the immutable pinned reference assets.

## New in 3.0.25

- Extensions now supports cross-report per-device and per-platform declaration frequency, grouped independently by the exact observed extension name.
- Namespace, query-status, coverage, device/platform scope, local search, evidence detail and individual-row views. Frequency denominators count only loaded matching platform/device enumerations, with indexed-only exclusions disclosed.
- `Advertised`, `Not listed`, `Unknown`, `Unavailable`, `Not applicable` and `Error` are separate. A successful extensions query is required to conclude an extension is present/absent in a reported string; raw name presence is not proof that functionality works.
- Detail dialogs show per-enumeration query status, return code and source report ID. A failed query never becomes an unsupported declaration.
- The browser JS/CSS and release assets advance to `assets/app.v1018.js` and `assets/site.v1015.css` with a synchronized Worker/snapshot release marker. The pinned Vulkan 1.4.12 CSS is unchanged.

## Contract and verification

The only eligible *new* Android report producer remains **OpenCLScope 3.0.8 / 30008** with the unchanged OpenCL schema 1, exact platform/device query manifests, published cache workflow and historical read contracts. No D1 migration, fabricated report or mutation of `registry/cl.xml`, source images, or pinned Vulkan stylesheet.

The current ZIP includes all source tests and tools. **98 frontend tests and 19 Worker tests passed**, together with offline viewport smoke tests; production Pages/Cloudflare/physical Android validation and complete visual parity are **not** established. See `FULL_VULKAN_DESIGN_COMPARISON_3.0.25.md` and `QA_RESULTS.md`.

## Publishing

See `DEPLOY_COMMANDS_POWERSHELL.txt`. Cloudflare account configuration and credentials are external to this ZIP; no deployment was executed.

## 3.0.25 comparison stage
Reports now implements numeric-aware OpenCL driver/API/app version sorting, vendor/platform/device sorting, and visible empty-list controls. See `FULL_VULKAN_DESIGN_COMPARISON_3.0.25.md` for limits and remaining gaps.
