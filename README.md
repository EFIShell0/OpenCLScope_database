# OpenCLScope Database 0.12.53

Android-facing producer compatibility remains **OpenCLScope 1.0.14 / versionCode 10014** with exact historical producer support and unchanged schema 1, registry hash, and OpenCL query manifest. Deploy the **0.12.53 Worker** before publishing the **0.12.53 Pages frontend**.

## Visual parity

This release incorporates VulkanScope Database 1.4.12's current CSS design layer and corresponding portable layout conventions. These are adapted for OpenCL™ green while keeping Vulkan-only hardware fields, driver modes and support semantics out of the OpenCL interface. See `FULL_VULKAN_DESIGN_COMPARISON_0.12.53.md` for fixed versus outstanding differences. The previous 0.12.52 file-by-file audit is preserved separately as historical evidence.

## Verification

Run `python -B tools/verify_release.py`, `node --test tests/*.test.mjs worker/tests/*.test.mjs`, and `node tools/build_pages_artifact.mjs`. Browser smoke evidence is summarized in `QA_RESULTS.md`. Live Cloudflare deployment and complete visual identity were not verified here.
