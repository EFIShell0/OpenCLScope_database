# OpenCLScope Database 3.4.5 — VulkanScope 1.4.12 source comparison

## Reference provenance

- Source base: OpenCLScope Database 3.4.4 ZIP, freshly extracted.
- Pinned reference: VulkanScope Database 1.4.12 ZIP, extracted separately.
- Immutable `assets/vulkan-layout.v1412.css`, `rules/UPSTREAM_REFERENCE_SITE_CSS.css`, `rules/UPSTREAM_REFERENCE_RULES.md` and `registry/cl.xml` are unchanged.
- New OpenCL presentation-layer files are versioned `v3405`; the new-submission producer stays 3.4.0/30400.

## Source-level corrections in this stage

| Shared component | VulkanScope 1.4.12 | OpenCLScope 3.4.4 discrepancy | 3.4.5 action |
|---|---|---|---|
| Global search clear | SVG cross, animated `search-clear-button`, hidden focus/aria state, focus restoration | Plain `×` button; HTML `hidden` and later CSS declarations could disagree | Copied upstream path and class arrangement, used consistent class+aria+tabindex state and focus restoration |
| Global search interaction | Short (~90 ms) bounded re-render after typing | Every character synchronously re-rendered heavy report content | 90 ms input debounce with immediate clear-state sync |
| Hero command row | Search input with one clear action, no adjacent extra Refresh button | Additional visible Refresh button | Removed redundant hero Refresh control, preserved normal snapshot/cache-first sync pipeline |
| Reports Copy ID | Original outline copy icon `M9 8h10v12H9z ...` | OpenCL property-details symbol used instead | Switched to the exact upstream copy symbol, kept 64-character canonical ID semantics |
| Reports keyboard access | Independent actions, keyboard/copy support | Non-button report row only opened on mouse click | Focusable semantic table rows now open with Enter/Space; Shift+F10 / Menu opens report actions |
| Reports long press | Context menu should not trigger a second row action | Touch long press could be followed by synthetic row click and report navigation | Suppress only that follow-up click; preserve ordinary row click and Escape/focus return |
| Shared visual focus | OpenCL brand-green focus permitted | Search clear and report row missing matching final-layer focus treatments | Narrow OpenCL-only CSS rules in the final `reference-shell` layer |

## Explicit justified OpenCL differences retained

- Query fields, producer/schema, report IDs, filters dependent on actual OpenCL data, GPU evidence and trademarks remain OpenCL-native. No VK_* properties, WSI, Turnip or GPU-capability inference added.
- VulkanScope's red identity/focus is replaced with OpenCL brand green. Real error states may still be red.
- The OpenCL 3.4.0/30400 exact new-upload rule and historical GET/snapshot reporting remain unchanged. D1 schema, registry and canonical SHA-256 rules are not modified.
- Source-only reports and browser-local synthetic QA records are not production data or live deployment evidence.

## Still unresolved / not proven equivalent

1. Reports: full column count/placement and submitted time-zone evidence cannot be made identical without inventing unavailable origin data; reference still differs in multiple sections.
2. Compare: complete control panel DOM, animation timings, panel pinning and populated-report layout differ.
3. Statistics, Formats, Extensions, Settings and Information: a component-by-component populated Vulkan/OpenCL computed-style and interaction comparison remains necessary.
4. Full breakpoints, modal focus behavior, customized controls, table scrollbars and page positions were not pixel-diffed on two fully populated live sites.
5. Real GitHub Actions, Cloudflare Worker/D1 and Pages deployment was not executed. CI and `releaseReady` represent static local verification only.

The 3.4.5 test suite verifies the changes listed here; it does not certify total upstream visual or behavioral parity.
