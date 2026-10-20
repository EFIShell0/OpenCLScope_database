# OpenCLScope™ Database 3.0.24 vs VulkanScope™ Database 1.4.12

## Source and scope

- Input: OpenCLScope Database 3.0.23 (444 files in source ZIP); VulkanScope Database 1.4.12 (840 files in source ZIP).
- Exact original Vulkan stylesheet: `assets/site.v1412.css` in reference vs `assets/vulkan-layout.v1412.css` in OpenCL; matching SHA-256 `bd5957461701439a7655c652b4e560cb84b7cc0163f202a257e019c2c468181b`.
- Original OpenCL 3.0.23 layered `site.v1015.css` + `parity.v1023.css` on that immutable stylesheet. Problems include later upstream hard-coded red controls, repeated OpenCL selector overrides, and missing navigation class contracts.
- Patch changes OpenCL-specific HTML, versioned JavaScript and final parity CSS. It does **not** rewrite Khronos XML, reference CSS or OpenCL report/canonical ingestion semantics.

| Area | Verified source mismatch | 3.0.24 corrective action | Validation |
|---|---|---|---|
| Horizontal table scrollbar | Upstream late `.table-scroll-thumb` rule paints red gradients; old override only targeted native `.table-wrap` scrollbar | Override actual `.table-scroll-track`, `.table-scroll-thumb`, `.table-scroll-button`, edges, hover and focus in final stylesheet | Chromium computed background of thumb is neutral gray; mobile containment verified |
| Vertical page scrollbar | Upstream `.viewport-scrollbar-thumb` and drag selector paint red gradients | Override actual thumb/track/drag/focus and arrows with neutral/green palette | Chromium computed thumb gray at rest at 1440 and 390 |
| Navigation | OpenCL static buttons missed Vulkan `.nav-button` class | Add class to all 11 tabs, align geometry, focus and scroll arrows | DOM 11/11; active states during 11 screen switches |
| Main background and hero | Layered Vulkan red gradient and independent OpenCL green blocks differ | AMOLED neutral body, attenuated green radial accent, shared hero/header treatment | Browser computed background consistent across all 11 screens |
| Shared buttons/listboxes | Old Vulkan red accent2 and button hover rules could leak through | Secondary accent green; listbox focus/selected/hover, action and detail-tab presentation scoped to OpenCL | CSS checks; key browser interactions |
| Reports table | OpenCL seven-column static layout differs substantially from Vulkan 13-column disclosure/report pattern | Report header and content regrouped into 12 OpenCL-relevant columns; date/vendor/type disclosure, compact ID/favorite/action controls, real sort/limit toolbar | Chromium disclosure and sort/limit test on transient fixture |
| Timestamp | Vulkan shows per-report date/time/zone metadata; OpenCL summary carries only UTC submission date | Display exact `submitted_at` in UTC; no inferred device timezone | ISO source conversion contract |
| OpenCL report state | Vulkan fields are not OpenCL fields | Preserve OpenCL summary/query states/registry, D1, Worker, cache and SHA | 112 frontend and 19 Worker tests |

## Not yet equivalent

The internal VulkanScope JavaScript and OpenCLScope JavaScript remain distinct applications with different report schemas and special-case components. Byte-for-byte functional equality would corrupt technical meaning. A complete pixel-diff with both databases populated by real, contract-valid reports has not been executed; remaining view-specific card/filter/Settings/detail animations and live sync performance need further work. This release fixes the listed, independently verified mismatches; it does not claim global exact parity.
