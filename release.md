# OpenCLScope™ Database 3.0.20

## VulkanScope™ Database 1.4.12 comparison — Stage 11

### OpenCL™ Image Formats

- The Formats workspace now offers a grouped **query availability overview**, **reported channel format pair frequency**, and the original **individual source-query view**.
- Group availability preserves Available, Unavailable, Not Applicable, Unknown and Error; missing groups are Unknown, never fabricated Unsupported.
- A successful query returning an empty list remains Available with **zero reported channel format pairs**. Exact per-device channel-order/data-type pair frequencies are deduplicated and show the fully loaded device denominator separately from successfully queried groups.
- Added format-group and coverage filters, exact pair search, source-report evidence dialogs with real SHA-256 links, keyboard controls and responsive 25/50/100 pagination.

### Preserved evidence and interfaces

- Khronos® OpenCL™ `cl.xml`, immutable VulkanScope 1.4.12 reference styling, GPU and brand assets, privacy controls, Worker validation, historical reads, comparison and export remain protected.
- Newly accepted Android producer remains only **OpenCLScope™ 3.0.8 / versionCode 30008**. No D1 migration or historical report rewrite.
- Frontend, Worker release identity, GitHub Pages snapshot marker and test/reconciliation paths are synchronized at Database 3.0.20.

## Verification

Read `QA_RESULTS.md` and `FULL_VULKAN_DESIGN_COMPARISON_3.0.20.md`. Local regression and Chromium fixture checks passed; **live Cloudflare/GitHub Pages and complete VulkanScope pixel parity have not been verified**. See `DEPLOY_COMMANDS_POWERSHELL.txt` for deployment commands.
