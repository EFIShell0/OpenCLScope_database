# OpenCLScope Database 1.0.0

**Upload policy:** New report submissions require **OpenCLScope 1.0.19 / versionCode 10019**. Earlier applications and non-allowlisted future versions receive HTTP 400. The requirement applies to new uploads only; previously stored reports remain readable.

**Scope:** Maintains OpenCL™ schema 1, the official cl.xml registry lock, complete 16-platform and 210-device query manifest, and fixed secure Cloudflare Worker submission route. Full report snapshots load cache-first. Device evidence is never inferred from the registry.

**Visual 1.0.0 changes:** Browser title icon uses the exact application master artwork on black. Shared baseline CSS is imported from VulkanScope Database 1.4.12; a final OpenCL-only stylesheet adapts brand green without fabricating technical evidence. Reports use the upstream-style GPU-vendor table, Statistics uses chart cards, Compare uses a semantic evidence grid, and navigation/Settings/detail actions use matching SVG icon families.

**Design parity:** OpenCLScope-compatible elements of VulkanScope Database 1.4.12: header, settings drawer, filters, pagination, page controls, responsive layout, comparison, Statistics based only on fetched full reports, and report details. Compare now keys properties and extensions by canonical identity rather than input array order; no Vulkan-only Surface, WSI, Turnip or driver-mode states are fabricated.

**Verification:** Local Node and release/Pages validation are not a substitute for real deployed Worker/D1 writes or browser screenshot equality. See `QA_RESULTS.md`, `rules/1.0.0_REPORT_MINIMUM_AND_PARITY_AUDIT.md`.

## Previous release history

# OpenCLScope Database 0.12.56

OpenCL™ technical report Database. Source layout and portable browser interactions are compared against VulkanScope Database 1.4.12, without substituting Vulkan runtime facts for OpenCL evidence.

Prior version 0.12.54 adds four Settings categories, session-only/opt-in remembered Favorites, country/manual regional date-time settings (including a locally bundled country catalog), local clock, report display defaults, and an explicit source-tree regression-test inventory gate. This release accepts OpenCLScope 1.0.15/10015 in addition to prior exact producer contracts, Cloudflare Worker API and snapshot-first cache behavior.

**Upgrading an existing checkout:** after placing the ZIP contents in your existing project folder, execute `python -B tools/reconcile_repository.py --apply` once before `git add -A`. This moves unknown or obsolete site regression tests to `rules/legacy_tests/` without deleting them. It is necessary because ZIP extraction over an old folder does not remove previously tracked test files.

Run local release gates with `python -B tools/reconcile_repository.py --check`, `node --test tests/*.test.mjs worker/tests/*.test.mjs`, `python -B tools/verify_release.py`, and `node tools/build_pages_artifact.mjs`. Live Cloudflare D1 and GitHub Pages deployment require the existing configured accounts/secrets; no placeholder credentials are bundled.

`rules/0.12.54_VULKANSCOPE_1.4.12_CI_SETTINGS_AUDIT.md` documents the exact findings and remaining gaps.

OpenCLScope 1.0.16/10016 is accepted with the 210-device-query manifest; earlier exact producer versions remain supported.


Release 0.12.59 adds strict 1.0.19/10019 producer acceptance with the unchanged 16 platform + 210 device manifest, retaining 1.0.17, 1.0.16 and historical contracts. The site cache, assets, snapshot generation and Worker API remain unchanged.

Historical 0.12.59 release notes above describe its then-current behavior; starting in 1.0.0, only 1.0.19/10019 is eligible for new POST submissions. Older stored reports remain readable.
