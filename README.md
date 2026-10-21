# OpenCLScope™ Database 3.0.28

Independent report-backed OpenCL™ database; VulkanScope Database 1.4.12 is the immutable upstream UI reference. This is **not an official Khronos project**.

## What's new

The Statistics distribution charts now reuse VulkanScope's `distribution-card`, `donut-chart`, `donut-center`, `chart-legend` and `chart-stroke` component structure, with OpenCL-themed color tokens and honest device/platform/report denominators. Query state bars highlight the unique dominant percentage only. Extension Reset no longer clears Statistics preferences.

## Verify and publish

Run `python -B tools/reconcile_repository.py --check`, `python -B tools/verify_release.py`, `node --test tests/*.test.mjs`, then `node --test worker/tests/*.test.mjs`. Build the Pages artifact with `node tools/build_pages_artifact.mjs`; publish only after authentic Cloudflare configuration. See `DEPLOY_COMMANDS_POWERSHELL.txt`.

**Local tests:** 125 frontend and 19 Worker tests passed. Isolated Chromium rendering passed at 1440×900 and 390×844 using test-only DOM data; live Cloudflare and pixel-level parity for all pages were not tested. `QA_RESULTS.md` and `FULL_VULKAN_DESIGN_COMPARISON_3.0.28.md` document scope and unresolved differences.
