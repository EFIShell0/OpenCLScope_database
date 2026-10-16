# OpenCLScope Database Engineering Rules — 0.12.4

This rulebook is adapted from the complete immutable VulkanScope Database 1.4.12 rulebook, with OpenCLScope schema 1 and 0.12.8 current producer plus exact historical producer compatibility. `UPSTREAM_REFERENCE_RULES.md` preserves the original unmodified for comparison. Vulkan display/Surface/Turnip/driver-mode semantics MUST NOT be fabricated as OpenCL device facts.

## Unbreakable rules
- Do not use production source-code comments. Escape untrusted output with DOM text nodes, not dynamic HTML. No made-up GPU devices, names, driver IDs, query values, reports, submission dates or support statuses.
- Public submission is one complete exact OpenCLScope 0.12.8/1207 producer or explicitly allowlisted historical version (0.2.0 through 0.12.6). Producer versionName/versionCode and technicalReport.appVersion must match exactly. Schema 1 and pinned registry SHA-256 are mandatory. Historical 0.2.0–0.7.0 reports use exact 8 platform + 120 device query contracts; 0.8.0–0.12.8 reports use the current 16 platform + 209 device query contracts. Imported, partial, loader-unavailable, failed, or no-device reports are ineligible.
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

## 0.12.1 producer and production deployment lock
OpenCLScope 0.12.5/1205 is the only newly permitted producer; previous exact-version/schema contracts remain intact. Preserve Cloudflare DB binding/real UUID, Pages recovery URL, GitHub workflow permissions and token secret in Cloudflare only.

## 0.12.2 report export and app producer parity
- Current producer pair OpenCLScope 0.12.6/1206 is accepted by the Worker without changing historical producer allowlists.
- Detailed report view has complete TXT/HTML/JSON downloads and per-view page limit 25/50/100, with safe escaping and report-only explicit user action.
- Cache-first index/snapshot loading and existing synchronization must not regress.

## 0.12.3 VulkanScope report view controls
- Render a centered editable page-number input with chevron actions, bounded page selection, filter card, and page-size persistence across Reports and capability views.
- Use VulkanScope's neutral text/surface state hierarchy with OpenCL green accent as the only brand deviation; About must use the upstream warning/secondary hierarchy.
- Preserve the OpenCL schema 1 API, snapshot-first loading, 25/50/100 bounded pagination, offline behavior, and all earlier exact producer contracts.
- OpenCLScope 0.12.8/1207 is a new exact accepted producer, never a wildcard acceptance rule.

## 0.12.4 / OpenCLScope 0.12.8 producer parity

- Accept the explicit 0.12.8 / 1208 application/native identity under the existing complete 16-platform/209-device-query contract without relaxing historical producers.
- Pages, snapshot and Worker 0.12.4 release IDs must stay synchronized; the Worker update must precede publishing app 0.12.8.
- The previous Worker contract, accepted 0.12.8 and all historical app versions remain accepted.

## 0.12.5 producer pairing and query completeness
- Accept exact OpenCLScope 0.12.9 / versionCode 1209 and retain all historically accepted exact producers.
- Preserve full source technicalReport, with 24 bounded image-format group slots and explicit unknown/unavailable/partial evidence; `partial` must not be published as a complete report.
- Keep strict registry hash, complete 16+209 query contract, fixed HTTPS and immutable report ID/content validation.

## Database 0.12.8 / OpenCLScope 0.30.1
- Current exact new producer is 0.30.1 / 3001 using the same complete 16 platform / 209 device registry-derived manifest as 0.12.10.
- Retain exact historical accepted producer pairs and fail-closed query completeness, import/history, unknown or inconsistent producer version, transport, privacy and security checks.

## Database 0.12.9 / OpenCLScope 0.30.2
- Accept exactly 0.30.2 / 3002 with full query manifest and existing security requirements; retain prior exact producer identities.
- The 0.30.2 query-kind correction changes value decoding but does not change registry keys or invalidate historical reports.

## 0.12.14
- Accept OpenCLScope 0.30.7/3007 without rejecting 0.30.6/3006; retain exact-query, complete-live-report, CORS, privacy and HTTPS gates.

## 0.12.15
- Accept OpenCLScope 0.30.8/3008 with exact 16/209 and complete-report gates; retain all historical approved producer pairs without weakening validation.

## 0.12.16
- Accepts OpenCLScope 0.30.9/3009 with the existing exact complete-report query and integrity gate; retains all prior accepted versions.

## 0.30.10 compile/parity integrity
- OpenCLScope 0.30.10 / versionCode 3010 fixes the Kotlin `PageList` duplicated `LocalDensity.current` binding reported by `compileReleaseKotlin` at lines 1240 and 1262 of the predecessor.
- Source gate verifies one PageList declaration, catches deliberate reinsertion and allows independent bindings in other composables.
- No OpenCL runtime query, upload privacy, network origin, report envelope/schema or existing UI animation function changed.
- The 0.12.17 Database accepts producer 0.30.10/3010 while retaining 0.30.9/3009 and previous complete-report producers.
- Physical-device UI and full Android Gradle compile must be marked NOT EXECUTED until actually run.


## 0.12.18 paired producer contract
- Strict complete OpenCLScope 0.30.11 (versionCode 3011) reports are accepted; all previously approved complete producer pairs remain valid.
- No schema, query manifest, Worker endpoint or export semantics change.

## 0.12.19 app 0.30.12 parity contract
- Add complete OpenCLScope 0.30.12/3012 producer with the same strict per-platform, per-device query shape as 0.30.11/3011.
- All previous producer pairs remain valid with exact version-code pairing, without relaxing upload requirements or private field restrictions.

## 0.12.20 app 0.30.13 shared methodology / producer contract
- Admit only exact OpenCLScope 0.30.13 / 3013 producer with unchanged, complete 16-platform/209-device query-catalog contract and fail-closed validation. Earlier accepted producers remain admitted with their original version-specific schemas.
- VulkanScope 3.0.12 shared methodology adoption and exact common UI icon parity are app-side changes; they do not broaden report schema, infer runtime OpenCL support, alter historical records or permit automatic submission.

## 0.12.21 app 0.30.14 producer contract
- Exact OpenCLScope 0.30.14 / 3014 accepted only with complete canonical query evidence and matching appVersion. Prior producers retain immutable exact validation. No UI-only data changes are permitted in the report producer.

## 0.12.22 app 0.30.15 producer contract
- OpenCLScope 0.30.15 / 3015 requires the same complete canonical 16-platform-property and 209-device-property evidence as the prior 0.30.14 producer.
- 0.30.14 / 3014 and other previously supported producer identities remain accepted; version-name/code mismatch and incomplete live reports fail closed.

## 0.12.23 producer admission
- Exact OpenCLScope 0.30.16/3016 is accepted with all existing complete query and privacy validation gates; older admitted versions remain accepted.

## 0.12.24 producer admission
- OpenCLScope 0.30.17 / 3017 is accepted only by the existing complete live-report validation path. The schema and all earlier admitted producer versions are unchanged.


## 0.12.25 UI parity producer admission
- Accept OpenCLScope 0.30.18 / 3018 only as a strict complete live technical report, preserving historical producer admissions and all privacy and schema checks.
- The app's UI layout parity changes do not alter the OpenCL report schema or justify relaxing any backend validation.


## 0.12.26 producer admission
- 0.30.19 / 3019 is accepted as a complete live OpenCL technicalReport only; no relaxation of existing schema, registry, provenance or privacy gates.

## 0.12.28 long-press reference contract
- Admit the exact OpenCLScope 0.30.21 / 3021 producer without relaxing or removing earlier complete-report acceptance or native reporting safety. UI-only evidence changes do not change technicalReport schema.

## Database release 0.12.39 pairing

- Accept OpenCLScope 1.0.2 / versionCode 10002 only through the complete canonical report contract, using the unchanged OpenCL 16/209 query manifest.
- Keep 1.0.1 / 10001 and all historically allowed producer identities with their existing validation. Never bypass report size, evidence, schema or HTTPS requirements.

## Database release 0.12.40 pairing
- Accept the exact OpenCLScope 1.0.3 / 10003 complete producer under unchanged 16/209 and 24 image-format query evidence, without relaxing any previously enforced structural, privacy or source checks.
- Preserve all accepted historical pairs, including 1.0.2 / 10002.

## 0.12.47 OpenCLScope 1.0.10 pairing
- Exact new application version 1.0.10/versionCode 10010 accepted only with the complete live report schema and normative platform/device query manifests.
- Retain earlier supported exact versions; reject mismatched version name/code, missing device/platform queries and imported or incomplete reports.


## Database 0.12.53 release gating and incremental parity
- Both Pages generation and post-deploy verification MUST validate the live Worker-exported DATABASE_RELEASE_VERSION. No stale static release literals. A deliberate mismatch MUST cause release failure.
- All changed frontend JS/CSS files require distinct versioned filenames, aligned HTML references, and a release-matched static snapshot. Preserve snapshot-first UI; do not refetch every report detail on navigation.
- VulkanScope navigation affordances, usable 25-item page default, clear filters and correct evidence-state semantics are portable UI conventions; Vulkan-specific types, WSI, Turnip, and Vulkan registry behavior remain forbidden as OpenCL data.
- The accepted application producer baseline remains OpenCLScope 1.0.14 / 10014. Changes to the Database presentation MUST NOT force a new Android producer or loosen previously pinned submission contracts.
- Pending parity gaps are explicitly documented in FULL_VULKAN_COMPARISON_0.12.53.md. Source validation is not real device/browser/deployment verification.

## Database 0.12.53 portable VulkanScope visual-shell alignment
- The pinned `assets/upstream-reference.css` and `rules/UPSTREAM_REFERENCE_SITE_CSS.css` remain byte-identical. The current VulkanScope Database 1.4.12 design is kept in its separately versioned layout asset, with the OpenCL green brand accent applied in the local current stylesheet.
- Header order, reference SVG navigation paths, visible filters and native-select-backed custom listboxes, bounded pagination, report actions, Settings focus/escape, load status and scroll controls are presentation changes only. The schema 1 technical evidence and all historical producer acceptances remain strict and unchanged.
- Do not claim complete pixel/behavior identity: nonportable Vulkan workspaces and currently unimplemented applicable settings, aggregate charts and semantic comparisons are tracked in `FULL_VULKAN_DESIGN_COMPARISON_0.12.53.md`. Browser and real deployment testing must be distinguished from source checks.
- Storage access must be guarded so browsers that reject localStorage still render cache-first report and navigation content; do not introduce unexpected write/upload actions.

## 0.12.55 producer-acceptance update
- Only extend the exact producer allowlist with OpenCLScope 1.0.15/10015, keeping 1.0.14/10014 and all prior exact pairs; reject unknown version pairs, missing manifest data, imports and partial results.
- Retain the immutable registry, catalog, full report stream caps, and snapshot-first caching; no UI/asset migration is necessary for this Worker-only change.
- Deployment is separate from local verification and must not be described as completed unless the user deploys.

## Database 1.0.0 — New submissions minimum OpenCLScope 1.0.19
- New POST /v1/reports submissions are allowed only when the producer application name/package/versionName/versionCode are exactly OpenCLScope/com.efishell.openclscope/1.0.19/10019, and technicalReport.appVersion exactly matches. All producer versions below 1.0.19 fail closed; future versions require a separate reviewed release allowlist entry.
- Previous complete reports remain queryable in D1 and published snapshots. Do not delete, mutate or reinterpret any preexisting report because a newer producer is required for uploads.
- Accepted 1.0.19 evidence remains complete 16 platform properties, 210 device properties and schema 1; all integrity, privacy, import, partial, size, explicit states and official registry gates remain unchanged.
- Portable VulkanScope Database 1.4.12 UI parity: report-first cache, contained filters/actions/navigation, accessible focus states, responsive Compare, semantics matched by canonical OpenCL identity and property token rather than unstable JSON row indexes. No Vulkan-only technical fields.
- Preserve immutable reference assets and official cl.xml byte-for-byte. Do not claim visual pixel parity without browser screenshots or Cloudflare deployment without credentials.

## Database 1.0.0 explicit supersession
- This section supersedes earlier producer-acceptance rules **for new submissions**: accept only exact OpenCLScope 1.0.19 / versionCode 10019 and 16 platform + 210 device queries. Keep historical GET, snapshot, favorites and reports readable. All older new POSTs must fail closed with HTTP 400.
- Use exact unaltered VulkanScope Database 1.4.12 stylesheet as a single reference input, with one OpenCL visual delta stylesheet. No triple-declared stylesheet references. Official black-backed OpenCLScope app master icon for browser title/favicon.
- Include meaningful SVGs for each shared primary navigation, detail and settings destination, original vendor-logo asset mapping, Reference-like report table, Statistics and Compare layouts, correct color hierarchy, responsive mobile widths. Do not mix WSI/Turnip/Vulkan evidence into OpenCL reports.
