# OpenCLScope™ Database 3.0.30

Independent evidence-backed OpenCL™ database. VulkanScope Database 1.4.12 provides an immutable design/engineering reference. Not an official Khronos project.

## Release and snapshot delivery

A push to `main` starts the **Windows checks → Linux Build → GitHub Release → GitHub Pages** pipeline. The GitHub Release is created only from the exact validated commit, with a deterministic versioned source ZIP and SHA-256. If a prior tag points to a different commit, publishing fails closed. Pages is deployed only after successful validation and GitHub Release publication; its report index/snapshot are verified after deployment.

New report snapshot events use the separate **snapshot-refresh** job and require a genuine 64-character lowercase SHA-256 report ID in the index **and** the verified full-report preload. Historical read compatibility, complete paginated index collection, canonical SHA-256 and strict OpenCL producer gate remain unchanged.

Set GitHub Actions variable `OPENCLSCOPE_DATABASE_API` to the deployed, trusted API HTTPS origin. GitHub Actions must have GitHub Pages enabled for Actions deployment. Worker deployment is a separate Cloudflare action; the workflow does not imply or perform it. No Cloudflare secrets belong in the repository. See `DEPLOY_COMMANDS_POWERSHELL.txt`.

## User interface

The main dataset pagination now reuses the VulkanScope `page-jump` component family with Go and strict page input. The upstream stylesheet, Khronos `cl.xml`, and pinned GPU imagery have not been modified. Remaining pixel/behavior gaps are listed in `FULL_VULKAN_DESIGN_COMPARISON_3.0.30.md`.

## Local verification

Run `python -B tools/reconcile_repository.py --check`, `python -B tools/verify_release.py`, `node tools/run_tests.mjs`, `node tools/build_pages_artifact.mjs`, `node tools/audit_pages_artifact.mjs _site`, and `python -B tools/package_release.py dist`.
