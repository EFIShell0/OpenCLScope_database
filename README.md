# OpenCLScope™ Database 3.0.26

Independent, report-backed OpenCL™ database. This is a staged visual-and-behavior alignment with VulkanScope™ Database 1.4.12, **not an official Khronos project**.

## Changes in 3.0.26

The filters now occupy a separate full-width row. The Reports table and its horizontal scrolling controls remain rendered when no reports match. Slider range/position and disabled arrow states use actual table geometry; the vertical page rail and floating page controls adopt the reference dimensions. Statistics status bars use the total real queried-property count for their percentages rather than normalizing by the maximum category. Statistics Reset now resets its own controls instead of Extensions.

All OpenCL report bytes, query state semantics, snapshot/D1 schema and exact producer validation requirements remain untouched. Original pinned Khronos® OpenCL registry and the immutable VulkanScope 1.4.12 reference sources are preserved.

## Verify and publish

Run `python -B tools/reconcile_repository.py --check`, `python -B tools/verify_release.py`, `node --test tests/*.test.mjs`, and `cd worker; npm test`. Build the Pages artifact using `node tools/build_pages_artifact.mjs` from the project root. Publish from the intended repository after authentic Cloudflare configuration is verified. See `DEPLOY_COMMANDS_POWERSHELL.txt`.

**Tests:** 119 frontend checks and 19 Worker checks passed locally. Isolated Chromium 1440×900 and 390×844 layout smoke checks passed on empty snapshot. Live Cloudflare and full pixel-matched visual parity remain unverified. Details in `QA_RESULTS.md` and `FULL_VULKAN_DESIGN_COMPARISON_3.0.26.md`.
