# OpenCLScope Database Engineering Rules — 0.12.0

This rulebook is adapted from the complete immutable VulkanScope Database 1.4.12 rulebook, with OpenCLScope schema 1 and 0.12.4 current producer plus exact historical producer compatibility. `UPSTREAM_REFERENCE_RULES.md` preserves the original unmodified for comparison. Vulkan display/Surface/Turnip/driver-mode semantics MUST NOT be fabricated as OpenCL device facts.

## Unbreakable rules
- Do not use production source-code comments. Escape untrusted output with DOM text nodes, not dynamic HTML. No made-up GPU devices, names, driver IDs, query values, reports, submission dates or support statuses.
- Public submission is one complete exact OpenCLScope 0.12.4/1204 producer or explicitly allowlisted historical version (0.2.0 through 0.12.3). Producer versionName/versionCode and technicalReport.appVersion must match exactly. Schema 1 and pinned registry SHA-256 are mandatory. Historical 0.2.0–0.7.0 reports use exact 8 platform + 120 device query contracts; 0.8.0–0.12.4 reports use the current 16 platform + 209 device query contracts. Imported, partial, loader-unavailable, failed, or no-device reports are ineligible.
- Query value `false` and `0` can be valid available results; not_applicable, unavailable, unknown and error are distinct. Registered extensions are only a reference catalog; runtime extension support derives solely from exact reported strings.
- Bounded request streaming, UTF-8 strictness, finite numeric values, exact shape, explicit sensitive-key denial, capped platform/device/property/image entries, and max 16 MiB canonical JSON. Reject instead of silently truncating.
- Normalize canonical JSON recursively with stable sorted object keys, SHA-256 as report ID and server-side UTC submission timestamp. D1 stores the full canonical JSON; payload chunks and metadata must commit atomically. Duplicate exact submissions yield the same ID/timestamp. Missing/corrupt chunks fail closed.
- `/v1/health`, `/v1/sync`, paginated `/v1/reports`, and read-only `/v1/reports/{sha256}` align exactly with the app. No user report DELETE or arbitrary report mutation endpoints.
- HTTPS fixed origins; only configured web origin may make browser requests. Native Android request without Origin remains valid. Cloudflare and GitHub tokens must remain secrets and must not be in source/ZIP.
- Every newly committed report may dispatch an automated snapshot workflow; duplicate/failure cannot create a second dispatch. Pages workflow refuses to publish when a requested newly submitted ID is missing or any fetched report fails its SHA check. Index is fully retrieved; capped detail preload is explicitly labeled and older details remain addressable by API.
- Static site uses local assets, provided official SVG and exact cl.xml; vivid green #3DAE2B with AMOLED dark, legible responsive layouts, meaningful separate state badges, report-ID search, complete report details, aggregate query views, comparing canonical values, private local favorites and explicit JSON download.
- Developer Info and trademark/copyright notices retained in compatible VulkanScope visual pattern. Do not label this an official Khronos project.

## Mandatory evidence
- Pre-patch compare VulkanScope Database 1.4.12 and OpenCLScope 0.1.0, record file count/sha. Changes classified and allowlisted.
- Consumer schema and producer fixtures tested together: live native mock fixture, negative mutation, valid false-property control, malformed request rejection, duplicate, pagination, transaction/chunk failure, snapshot integrity and expected report-ID inclusion.
- Local tests and live deployed Cloudflare D1/Pages are separate evidence. Do not call unexecuted live deployment passing. No fake Worker URL/database ID if user did not provide credentials.

- Public report snapshot must accept new 0.3.0 producer/technicalVersion pairs without a fake report or silently converting 0.2.0 historical data. The paired Android UI and web header share the two-tier OpenCL + original SCOPE logo.

## 0.9.1 compatibility gate
- Accept only complete producer versionName/versionCode exact pairs 0.2.0/200, 0.3.0/300, 0.4.0/400, 0.5.0/500, 0.6.0/600, 0.6.1/601, 0.7.0/700, 0.8.0/800, 0.8.1/801, 0.9.0/900, 0.10.0/1000, 0.10.1/1001, 0.10.2/1002, 0.10.3/1003, 0.11.0/1100, 0.11.1/1101, 0.12.0/1200 and 0.12.1/1201 with identical technicalReport.appVersion and schema 1. Producers 0.8.0 and newer require the full 16+209 query contract; older compatible producers retain exact 8+120. Never accept partial or imported reports. Snapshot, registry SHA-256 and published metadata must use the same version allowlist; preserve the historical complete reports.

## Canonical repositories
- Database repository: exactly `https://github.com/EFIShell0/OpenCLScope_database`.
- Paired application repository: exactly `https://github.com/EFIShell0/OpenCLScope`.
- Release/audit documentation must not substitute placeholder owners or alternate repository names.


## 0.9.2 paired producer lock
- OpenCLScope 0.10.2 / versionCode 1002 is accepted only with technicalReport.appVersion 0.10.2 and the exact 16+209 current query contract.
- OpenCLScope 0.10.1 / 1001 and all previously supported producers remain exact historical contracts; no wildcard producer acceptance is allowed.


## 0.11.1 paired producer lock
- OpenCLScope 0.12.1 / versionCode 1201 is accepted only with technicalReport.appVersion 0.12.1 and the exact 16+209 current query contract; 0.12.0 / 1200 remains accepted as the immediate historical producer.
- OpenCLScope 0.10.3 / versionCode 1003 remains accepted under its immutable predecessor contract; current-version expansion must never weaken any historical exact-producer check.
- OpenCLScope 0.10.2 / 1002 and all previously supported producers remain exact historical contracts; wildcard producer acceptance is forbidden.

- The 0.11.3 producer contract accepts OpenCLScope 0.12.3/1203 while preserving all previously valid producer identities and per-version query requirements.

## Database 0.11.4: exact OpenCLScope 0.12.4/1204 producer only; preserve prior exact contracts.

## 0.12.0 live/snapshot release parity contract
- Snapshot and Worker MUST share exact producer validator and release constant; duplicate allowlists are prohibited.
- Production Pages MUST verify actual `app.v1200.js`, validate snapshots with SHA-256, publish only a complete index and bounded report preload, and check the triggering ID after the GitHub Pages deployment.
- Required newly submitted report is always reserved in the preload before older reports, subject to the explicit size cap. Do not claim complete full-detail preloading for older reports beyond the cap.
- On Worker POST of a new report the optional configured GitHub Actions dispatch is immediate; when the published Pages URL is configured, a 15-minute reconciliation cron retries missing releases. Never run a fake Dispatch ID in tests as production evidence.
- Frontend loads snapshot before checking `/v1/sync`, polls every 10 seconds only while visible, fetches changed indexes, preserves cached data on network errors and does not re-download all details unnecessarily.
- Vendor icons must derive from vendor-reported names, never unverified GPU hardware inference; retain OpenCL data semantics and Kubernetes/Turnip/WSI exclusion.
- After publication check live D1, Worker API, GitHub Actions and the actual Pages URL separately; untested live deployments MUST NOT be reported as passing.
