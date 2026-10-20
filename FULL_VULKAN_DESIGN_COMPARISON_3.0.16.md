# OpenCLScope Database 3.0.16 vs VulkanScope Database 1.4.12

Reference: unmodified `VulkanScope-Database-1.4.12.zip` local source. Target: OpenCLScope Database 3.0.15 source plus the changes in this release. The source files were inspected directly, not inferred from a screenshot. The immutable `assets/vulkan-layout.v1412.css`, `assets/upstream-reference.css`, `registry/cl.xml` and pinned vendor artwork were not modified.

## Verified shared mechanisms addressed in stage 7

| Mechanism | VulkanScope reference | Prior OpenCLScope 3.0.15 | Database 3.0.16 |
|---|---|---|---|
| Switching main sections | Cancelable fade-out/fade-in transition with reduced-motion support and explicit active-nav scroll | Immediate `render()` on nav clicks; no transition ownership | Cancelable 90/150 ms transition, per-workspace scroll positions, reduced-motion path, coherent hash and document title |
| New published frontend version | Checks bounded same-origin public marker and availability of versioned assets before offering update | No equivalent published-version prompt | Bounded `data/release.json` generated with snapshot; same-origin JS/CSS verification; accessible, dismissible modal; no forced refresh |
| New reports arriving | Visible transient report-arrival notification | Only ordinary inline status | Accessible dismissible notification of *newly indexed* report summaries; does not invent complete report details |
| Missing published cache | Distinguishes unavailable bootstrap data from empty data | Could show a zero-report-like notice even if index fetch failed | Explicit incomplete-cache banner and missing-index explanation; live sync may independently recover the list |
| Pages release identity | Tightly matched public release, shipped versioned frontend assets and Worker version | Index/snapshot gated; no independent release marker | Static builder fails closed if release marker, index timestamp, Worker identity or referenced JS/CSS disagree |

## Reference code comparison beyond this stage

- **Workspace structure:** VulkanScope has separate renderers for core Vulkan instance, Surface, Display, HDR, WSI and Vulkan-specific coverage. These are NOT OpenCL query domains and must not be ported as fake data. OpenCL has separate legitimate Platforms, Devices, Formats, Memory, Profiles and Khronos `cl.xml` Encyclopedia.
- **Evidence drilldowns:** VulkanScope has an animated accordion framework and separately paged coverage dialogs. OpenCLScope report and evidence tables have search, pagination and quick actions, but not every equivalent nested dialog and geometry. **Still different.**
- **Error UI:** VulkanScope includes extensive error-state screens and dedicated HTTP status pages. OpenCLScope primarily uses status banners and inline failure notices. **Not pixel/flow equivalent.**
- **Network diagnostics:** VulkanScope includes deeper explicit reachability and time-bound IP reveal flows. OpenCLScope has basic Internet/Browser panels. **Still different.**
- **Dynamic filter systems:** VulkanScope dynamically chooses rich filter sets by page; OpenCLScope has fewer API-specific filters. Some are legitimate OpenCL-specific differences; interactive density/placement and per-view persistence need further browser audits.
- **Modal/scroll behavior:** Some advanced VulkanScope viewport/table scrollbar fades, multi-dialog animations, and mobile long-press activation details are not completely mirrored in OpenCLScope. **Still different.**
- **Production checks:** Cloudflare D1/Worker and live GitHub Pages were not operated here; local Chromium on 1440×900 and 390×844 with isolated fake transport verifies UI mechanics, not live fetch behavior.

## Safeguards and contract

The only allowed *new* Android producer remains OpenCLScope **3.0.8 / 30008**. Schema 1, existing 16 platform / 211 device queries, exact source hash, historically readable complete reports, status distinctions, SHA-256 publication checks and Workers are unchanged except for Database release identity. Pinned source graphics and CSS hashes remain intact. `data/release.json` is a release identity marker, not a technical report or GPU capability.

**Assessment:** This is a verified navigation, release/update, notification, and publication-consistency stage. It is **not** a claim that every VulkanScope view, animation and pixel is identical. The unresolved differences above are retained as tracked work rather than silently described as fixed.
