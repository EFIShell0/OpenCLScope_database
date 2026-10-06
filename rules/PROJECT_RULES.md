# OpenCLScope Database Engineering Rules — 0.1.0

This rulebook is adapted from the complete immutable VulkanScope Database 1.4.12 rulebook, with the technical schema changed to OpenCLScope 0.2.0. `UPSTREAM_REFERENCE_RULES.md` preserves the original unmodified for comparison. Vulkan display/Surface/Turnip/driver-mode semantics MUST NOT be fabricated as OpenCL device facts.

## Unbreakable rules
- Do not use production source-code comments. Escape untrusted output with DOM text nodes, not dynamic HTML. No made-up GPU devices, names, driver IDs, query values, reports, submission dates or support statuses.
- Public submission is one complete exact OpenCLScope 0.2.0 native technical report after explicit user confirmation. Schema 1, registry XML SHA, producer identity and full 8+120 canonical query key sets must match. Imported, partial, loader-unavailable, failed, or no-device reports are ineligible.
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
