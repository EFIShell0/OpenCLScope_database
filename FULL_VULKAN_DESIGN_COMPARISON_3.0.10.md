# VulkanScope Database 1.4.12 ↔ OpenCLScope Database 3.0.10

## Reference and scope

Compared the source archives `VulkanScope-Database-1.4.12.zip` and `OpenCLScope-Database-3.0.9.zip`. Followed both the pinned `rules/PROJECT_RULES.md` and immutable Vulkan layout stylesheet. Existing comparison and 3.0.9 browser/confirmation/filter improvements are preserved. Vulkan-only Surface, WSI, HDR, Turnip, swapchain and renderer capabilities are not OpenCL report evidence and cannot be copied. This stage changes the Database only; **new Android POST producer remains OpenCLScope 3.0.8 / 30008**. No public reports have been invented.

## Stage 2: verified source differences and disposition

| Feature | VulkanScope reference | OpenCLScope 3.0.9 deficit | OpenCLScope 3.0.10 |
| --- | --- | --- | --- |
| Compare evidence categories | Canonical typed technical comparison with navigable categories and explicit differences | Minimal list of canonical fields and plain values, no category controls or change-count summary | **Improved:** Added/Removed/Changed/Unchanged counts, category selection, swap, filtered responsive evidence table and bounded pagination. Both complete reports must be present; unloaded fields are not inferred. |
| Compare pagination/accessibility | Responsive filter/pager and keyboard-accessible inputs | Three-column plain rows and no user-selectable category | **Improved:** real table headings, visual change badges, page-size integration and same-report guard |
| Encyclopedia reference browsing | Separate expanded encyclopedia module, categories, registry symbol search | Only catalog enum/extension listing, **bundled 2,002-entry `encyclopedia.json` unused** | **Fixed:** full existing 2,002-entry reference database; command/type/extension/token categories, global search, per-entry metadata disclosures, real counts, same 25/50/100 pager |
| Detail Properties / Features / Memory | Bounded typed evidence collections with filtering | Hundreds of properties in single enormous card per device, not searchable | **Improved:** separate per-query evidence rows, state filter, name/value search, dedicated 25/50/100 detail pager; full returned strings/states preserved |
| Detail Formats | Scoped format groups with report states | Huge unbounded device-level content | **Improved:** one format-query group per row, original group status/code and original returned pairs, bounded pagination |
| Deep links to detail tabs | Direct navigable report sections | `Raw JSON` and encoded multiword tabs could not be resolved by `[A-Za-z]+` route | **Fixed:** URL-encoded tab names including `Raw JSON`, independent of download format |
| Statistics evidence coverage | Rich statistics/trends and source coverage | Basic loaded-report distributions, index and full detail distinction not prominent in all sections | **Improved:** additional explicit denominator for filtered index, loaded evidence and excluded unloaded details; no new unverified aggregate fields |
| Historical technical reports / stored reporting | Immutable per-report data and source identity | Existing complete OpenCL reports and schema 1 | **Preserved:** raw JSON, canonical query manifest, strict D1, snapshotted index and historical GET |
| Shared dialogs/filters | Browser guard, confirmation, regional settings, vendor/date filters | Fixed in Database 3.0.9 | **Preserved:** no regression |

## Remaining nonparity / work not claimed

- VulkanScope has considerably more API-specific report detail hierarchies, Compare trend visualization, compact dynamic controls, and statistics cohorts. Semantic OpenCL-specific equivalents still require design work and populated independent OpenCL reports.
- Full VulkanScope pixel-level CSS/DOM parity and all release/update dialog behaviors have **not** been achieved or asserted. Brand, color and technical data intentionally differ.
- Cloudflare Worker/D1 in production, GitHub Pages HTTP caching, real GitHub update delivery, and user sessions with a populated remote report index have **not** been tested.
- Live Android app or Qualcomm/PowerVR GPU behavior was not changed by this Database-only release.
- No changes to official `registry/cl.xml`, canonical SHA256, 16+211 query manifests, output JSON, published report index, or original pinned VulkanScope CSS and GPU vendor asset bytes.

## Evidence-based QA

- Node.js site regression suite: **58/58 passed**.
- Cloudflare Worker contracts: **19/19 passed**.
- `tools/verify_release.py` and `tools/reconcile_repository.py --check`: passed.
- `tools/build_pages_artifact.mjs`: generated an allowlisted Pages artifact from the source's empty published snapshot.
- Chromium UI smoke at **1440×900 and 390×844**, using unchanged UI sources injected into a sandboxed in-memory document (navigation blocked): 2,002-entry Encyclopedia loaded, searched and category-filtered; two explicit local test-only reports compared with a changed property; bounded detail search and state filter rendered; no page errors or horizontal document overflow.
- **Never interpret test fixtures as actual public reports or physical OpenCL device data.**
