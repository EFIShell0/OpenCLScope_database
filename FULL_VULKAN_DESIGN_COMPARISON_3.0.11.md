# VulkanScope Database 1.4.12 ↔ OpenCLScope Database 3.0.11

## Verified reference, scope and immutable boundaries

Sources compared: `VulkanScope-Database-1.4.12.zip`, `OpenCLScope-Database-3.0.10.zip`. Project authority: `rules/PROJECT_RULES.md`. The upstream, pinned VulkanScope stylesheet and existing GPU vendor artwork are not modified. This is a **Database-only** release: the allowed new Android producer remains **OpenCLScope 3.0.8 (30008)**. Existing complete historical GET reports, canonical JSON, report identifiers, exact Khronos `cl.xml`, and 16 platform / 211 device queries remain unchanged. The bundled public index remains empty: no sample device data were published.

## Stage 3 fixes and exact comparison

| Area | VulkanScope 1.4.12 reference behavior | OpenCLScope 3.0.10 deficit | OpenCLScope 3.0.11 change |
|---|---|---|---|
| Statistics chart geometry | Circular per-cohort distributions with explicit totals | Only bars for vendor/version/property states | Added SVG ring distributions for vendor, OpenCL version, device type, Android manufacturer and platform name, retaining status bars |
| Statistics legend and denominator | Per-group count and percentage with selectable slice density | No donut cohorts or selection | Added 5/8/12 slice limit, named `Other` aggregation, count and percentage legend, exact per-device/per-platform/per-report denominators |
| Statistics extension frequency | Namespace, API scope, coverage filters, source-aware frequency | No extension cohort or filtering | Added platform/device/both scopes, Khronos/EXT/vendor namespace, threshold, search and top-100 bounded frequency table |
| Statistics evidence coverage | Reports count and scope warnings | Indexed vs loaded count shown but limited analytics | Filtered index, loaded details, excluded unloaded reports remain distinct; extension token percentages use unique complete-report membership, not market share or hardware capabilities |
| Report details tab accessibility | Keyboard-accessible tab navigation/active focus semantics | Click-driven tab interface | ArrowLeft/ArrowRight/Home/End tab navigation; selected tab has tab-stop, `aria-selected`, `aria-controls`, `tabpanel`; existing query search/status/paging retained |
| Worker validation and upload contract | Strict authenticated evidence source | Already strict from preceding releases | Release identity 3.0.11 only; exact OpenCLScope 3.0.8 producer lock and historical GET preserved; no API evidence invented |

## Still different; not claimed as fully fixed

- Statistics does not claim server-wide distributions for indexed reports whose complete technical evidence has not been loaded. VulkanScope indexes certain summary fields that the pinned OpenCL index deliberately does not expose; no guessed market share, unsupported state, or report count is introduced.
- VulkanScope offers dedicated Versions, Limits, Properties, Queues, Surface, Display & HDR, and Portability workspaces, a much richer Compare sticky header, and many renderer-specific groups. Portable visual/interaction components can be converged further, but Vulkan-only WSI/HDR/driver semantics must not be fabricated for OpenCL.
- Settings Information and About detail compositions, import/export dialogs, release/update affordances, long-press behavior and precise sticky navigation require further source/interactive parity work. Existing shared settings, regional preferences, browser guard, confirmations, and report filters were preserved, not claimed pixel-identical.
- True production Cloudflare D1/Pages testing, live reports, Android APK compilation and native Adreno/PowerVR collection were not performed.

## Evidence summary

- Site tests: 61/61 pass; Worker contracts: 19/19 pass; release verification and clean source reconciliation pass.
- Chromium DOM-based smoke at 1440×900 and 390×844: five statistics charts with test-only complete report data; scope/namespace/minimum/search selectors; state/status rendering; detail keyboard ArrowRight; no JavaScript runtime errors or horizontal document overflow.
- The Chromium smoke uses local source injected into an isolated in-memory document because direct localhost/file navigation is blocked in this environment. No public report was introduced or saved. Screenshots are diagnostic, not evidence of exact VulkanScope visual identity.
