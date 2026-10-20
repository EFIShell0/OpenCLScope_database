# OpenCLScope™ Database 3.0.15

## GitHub Pages snapshot publication repair

- Corrected the `Produce and verify complete public index and featured full reports` step. If an **optional** published detail has a correct SHA-256 but fails the pinned archival producer/report contract, Pages retains its index row, excludes the unverified full payload from trusted preload, and records a diagnostic ID in `skippedInvalidContractIds` and in the workflow log.
- Required (`REQUIRED_REPORT_ID`) reports continue to fail closed. A bad SHA-256, mismatched identity, missing detail, API error or invalid newly submitted report still aborts publication. No invalid value is silently converted to a valid OpenCL capability.
- Browser report loading respects the exclusion diagnostics and does not display these details as trusted complete reports. The Pages build and deployed-asset verifier also check list shape, bounds, uniqueness and membership.
- Worker version changes to **3.0.15**; only application **OpenCLScope 3.0.8 / 30008** may submit new reports. Historical D1 rows, schema 1, canonical 16 platform + 211 device queries, cl.xml, VulkanScope reference CSS and vendor assets remain unchanged. No D1 schema migration.
- The frontend JavaScript cache asset is now `app.v1009.js`; the unchanged pinned display delta stylesheet stays `site.v1008.css`. The page, workflow and regression checks reference the new script.

## Verification and scope

**78/78 site** and **19/19 Worker** tests passed locally. Negative cases cover optional archive contract mismatches, required-report rejection, hash tampering and API failures. Static Pages artifact creation and source verification passed. Actual Cloudflare live publication and the specific failing historical report JSON were not available; its exact producer/schema defect therefore remains undetermined.

This release is a targeted Database reliability fix, not a claim of VulkanScope 1.4.12 full visual parity. Previously implemented Compare, Encyclopedia, Statistics, Information and report workflows are preserved.
