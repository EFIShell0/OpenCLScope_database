# OpenCLScope Database 3.0.18

Continued file-level comparison against **VulkanScope Database 1.4.12**, retaining OpenCL-specific evidence. Stage 9 adds evidence-modal controls and repairs invalid filters and chart labels; stage 8 network and accordion functionality is preserved. The app and Cloudflare Worker remain strict about raw OpenCL report identity; no invented Vulkan capabilities are introduced.

## 3.0.18

- Stage 9: paginated 10/25/50 evidence modal, keyboard/backdrop handling and report-ID navigation; fixed irrelevant status filters and SVG chart counters.
- Fixed false/zero evidence presentation without changing the report contract.

- Internet settings: refresh every 60 seconds only when open, visible, and online; no polling while hidden. Mark failed or stale observations as old rather than current.
- Explicit IP Show/Hide, automatic masking after 15 seconds, reset on switch/close; no IP persistent storage or report mutation.
- Platform, device, extension and profile report panels now provide keyboard-accessible expandable evidence with Web Animations and reduced-motion fallback.
- Matching release marker, frontend assets and Worker version; 16+211 OpenCL query catalog, `registry/cl.xml`, pinned VulkanScope reference CSS and GPU icons remain unmodified.

## Release policy

New Android report submissions require **OpenCLScope 3.0.8 / 30008**. Historically valid existing reports are readable with their original contracts; Worker/D1 schema is not migrated. ZIP includes local tests, static Pages packaging tools and `DEPLOY_COMMANDS_POWERSHELL.txt`.

## Limitations

Local tests are not proof of live Cloudflare / GitHub Pages operation or full visual pixel-parity. Remaining feature gaps are explicitly described in `FULL_VULKAN_DESIGN_COMPARISON_3.0.18.md`. See `QA_RESULTS.md` for verification.
