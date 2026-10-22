# OpenCLScope Database Engineering Rules — 3.4.11

This rulebook is adapted from the complete immutable VulkanScope Database 1.4.12 rulebook, with OpenCLScope schema 1, the current strictly pinned 3.4.0/30400 submission producer, and original historical-report compatibility. `UPSTREAM_REFERENCE_RULES.md` preserves the original unmodified for comparison. Vulkan display/Surface/Turnip/driver-mode semantics MUST NOT be fabricated as OpenCL device facts.

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

## Database 1.0.1 UI reference fidelity
- Preserve VulkanScope 1.4.12 source geometry under pinned CSS and copy its table-scroll control interaction (touch, pointer, keyboard) for every evidence table.
- Use the actual OpenCLScope Android black-backed logo in the header and favicon. Native OpenCL labels and technical evidence remain native, never synthesized Vulkan data.
- Keep 1.0.19/10019 as the sole eligible new report producer, with historical stored reports readable; no server or catalog relaxation.

## Database release 1.0.4 / OpenCLScope 1.0.21 acceptance supersession
- Admit new POSTs only from exact OpenCLScope versionName 1.0.21 / versionCode 10021 and official registered cl.xml hash, with all schema, privacy and query-shape locks retained.
- Previously stored 1.0.20 reports remain historically readable using the same 16-platform/210-device contract, without re-submission authorization.
- Duplicated vendor tokens may be preserved in raw `CL_*_EXTENSIONS` property string; derived extension arrays must represent unique token membership.
- OpenCL 3.x reported zero read/write-image capacity may produce `not_applicable` for the six kernel-read-and-write image queries; direct evidence values must be preserved, not inferred.
- Browser snapshot-first caching and immutable VulkanScope 1.4.12 CSS reference must remain unchanged.

## 1.0.5 app/Worker contract
- New submissions require OpenCLScope 1.0.22/10022; historical valid 1.0.21/10021 submissions remain readable via validation only. Never allow older app producers to create new reports.
- Public index includes immutable manufacturer/model and ISO 8601 UTC submission timestamps; the native Android UI localizes date/time without changing stored data.
- Public report pages remain bounded to at most 50 records; strict SHA-256 checking is required when fetching complete report payloads.

## Database 1.0.6 / OpenCLScope 1.0.23
- Only exact OpenCLScope 1.0.23/10023 may create reports; strict schema/registry/privacy/complete-report requirements unchanged.
- Previous 1.0.22/10022 records remain readable and verifiable, but cannot create new reports via POST.
- This Worker contract follows the 1.0.23 Kotlin-only Material3 release-build fix, without changing native properties, database schema or site layout.

## 3.0.1 Analysis / Database report workflow parity
- Application and Database release identity are 3.0.1; new app producer is OpenCLScope 3.0.1 / 30001, while previously accepted historical reports remain readable under their original versions.
- Analysis Database lookup mirrors VulkanScope 3.0.12: top-level lazy-list report cards, bounded 50-row public fetches, 200-item cache, pinned shared page navigation at 25 cards, GPU vendor badge, device manufacturer/model, API/platform/driver evidence and localized submitted timestamp.
- Comparison selection changes to Report ID mode and clears stale remote evidence before fetching. Comparison summary and technical diff cards use the shared Analysis pager instead of a nested pager; differences are labeled Added/Removed/Changed/Unchanged without fabricating OpenCL driver-mode labels.
- The OpenCL schema, registry and hardware evidence remain OpenCL-native. Strict 64-character report IDs, validated-Internet locks, successful-report hash integrity, bounded responses and explicit loading/error states must not be weakened.

## 3.0.1 source/producer compatibility
- New submissions are accepted only for 3.0.1 / 30001; 3.0.0 / 30000 and older approved producers remain read-only historical evidence.
- Historical 3.0.0 producer records use the exact 16/210 query manifest and must never fall back to a legacy reduced schema.
- No loss or rewriting of raw OpenCL driver evidence is allowed when the presentation-layer HTML metadata or NULL-handle description changes.

## 3.0.2 matched app and Database release
- New live submissions require 3.0.2 / 30002, preserving the complete 16 platform + 210 device per-record query contract and exact full-report source requirement.
- 3.0.1 / 30001 remains an approved read-only historical producer; 3.0.0 and older approved producers remain readable without mutation.
- The app presents distinct-format-pair counts without modifying the raw clGetSupportedImageFormats technical report, so no server-side renormalization is permitted.
- A failed app collection cannot automatically become a successful or complete Database submission.

## 3.0.4 registry compatibility
- New 3.0.4 complete producer reports include the official legacy CL_DEVICE_MIN_DATA_TYPE_ALIGN_SIZE query and preserve canonical raw 3.1 keys; earlier 3.0.2 reports must pass historical validation using their exact old query set.
- User-facing aliases are runtime-version-dependent; Database ingestion never substitutes display aliases for raw query evidence.

## 3.0.4 searchable field and historical report lock
- All OpenCLScope search inputs use a VulkanScope-style placeholder rather than an animated floating TextField label. In particular, Encyclopedia reference examples must not occupy a line across the focused field border.
- Clear-button animation, bounded query state, current item filtering and search overflow fades remain intact.
- New 3.0.4/30004 reports preserve the 16+211 query catalog; 3.0.3/30003 complete reports remain historically readable and cannot be newly POSTed. No claim of Android runtime validation without an actual test.

## 3.0.7 PowerVR query-evidence compatibility
- `CL_DEVICE_MAX_WORK_ITEM_SIZES` (0x1005) and `CL_DEVICE_MAX_CLOCK_FREQUENCY` (0x100C) use the Khronos size-probe query first. Only a real `CL_INVALID_VALUE` permits a strictly bounded direct query with the exact registered return size. The alternate call must not fabricate a value, conceal a failed direct call, or rewrite an error state.
- `CL_DEVICE_SPIR_VERSIONS` (0x40E0) is a null-terminated `char[]` supplied by `cl_khr_spir`, not an opaque bit field or a SPIR-V feature. The original OpenCL query data remains authoritative throughout UI, TXT, HTML, and Database exports.
- OpenCLScope 3.0.7 includes 16 platform and 211 device query rows; Database 3.0.7 accepts only complete 3.0.7 live producer reports for new submissions. Complete 3.0.4 records remain readable as historical evidence and are not valid new submissions.
- Android/PowerVR behavior remains unverified until independently reproduced on a physical device; host mocks are not hardware evidence.

## 3.0.7 platform/device extension evidence
- Preserve `CL_PLATFORM_EXTENSIONS` and each `CL_DEVICE_EXTENSIONS` as independent raw runtime evidence; never synthesize platform extension membership from device reports.
- Enumerate bounded platform devices before resolving four `cl_khr_semaphore`/`cl_khr_external_semaphore`/`cl_khr_external_memory` platform query prerequisites.
- When the platform extension is absent but all fully enumerated devices report the required extension, use an ordinary bounded `clGetPlatformInfo` probe for the four registered platform queries. Preserve the real return status, numeric code and complete returned data. Do not fabricate a successful result from device capabilities.
- If device enumeration or device extension evidence is incomplete, preserve `unknown` (synthetic -100013) for these four queries; if a complete device set does not share the prerequisite and platform also lacks it, preserve `not_applicable`.
- Do not probe unrelated extension properties opportunistically. Keep the exact 16 platform/211 device query contract, complete-report semantics, and safe historical report validation.
- Require positive/negative native driver simulation and a deliberate regression mutation. Device-only Qualcomm behavior is not confirmed by host tests.

## 3.0.7 platform-device extension evidence
- OpenCL core and extension queries are version- and runtime-advertisement-aware; no reported name is manufactured or silently changed.
- Enumerate all devices with CL_DEVICE_TYPE_ALL; derive intersection only after complete device evidence is obtained.
- Retain separate platform string, device string, versioned property and direct API-query evidence. Platform declarations are never synthesized from device declarations.
- Report extension-consistency status separately from individual property runtime query state. Distinguish inconsistent from unknown on incomplete evidence.
- Keep sorted, deduplicated derived lists while retaining all original CL_*_EXTENSIONS driver text as queried.
- The complete new audit is included in JSON, TXT, HTML and Database, validated against the platform/device extension lists server-side. Historical pre-3.0.7 reports remain readable but cannot be resubmitted as fresh reports.
- Do not treat non-null extension function pointers as sufficient runtime feature support; no intrusive probe is initiated during passive collection.


## 3.0.8 Khronos platform-only advertisement correction
- `CL_PLATFORM_EXTENSIONS` and `CL_DEVICE_EXTENSIONS` remain untouched authoritative observations. Their registered/parsed membership and versioned-list differences must be preserved.
- Khronos `clGetPlatformInfo`: extensions common to **all** fully enumerated devices must be reported in `CL_PLATFORM_EXTENSIONS`; but platform-only extensions need not appear in device extension strings. `cl_khr_icd` is explicitly a platform extension.
- `extensionAudit.platformOnly` is informational evidence and by itself MUST NOT cause status `inconsistent`; `missingFromPlatform`, `platformVersionedMismatch`, and `deviceVersionedMismatch` still do. Incomplete platform/device evidence must yield `unknown`. No raw data may be rewritten or support guessed.
- Keep the audit JSON object and 16 platform / 211 device query manifests identical in shape. TXT/HTML/UI/Database distinguish platform-only declarations as informational.
- Database 3.0.8 accepts only the complete 3.0.8/30008 new producer and independently recomputes current evidence. Old 3.0.7 archives remain readable under their historical classification algorithm (which treated platformOnly as inconsistent); they cannot be newly submitted.
- Test native platform-only, real missing-all-device extension evidence, two-device intersections, versioned mismatches, unknown evidence, tampered Database results, and legacy archived 3.0.7 behavior. Host simulations must not be presented as physical driver evidence.

## Database 3.0.9 — portable VulkanScope 1.4.12 interaction convergence
- This is a Database UI and release-identity increment ONLY: keep the sole permitted new Android POST producer at OpenCLScope 3.0.8/30008; do not infer any later app version. Preserve legacy GET admission, schema 1, pinned OpenCL cl.xml, platform/device query manifests, and snapshot-first caching unchanged.
- Use reference browser-compatibility gate, responsive layout assets, keyboard-accessible confirmed destructive local-state deletion; no silent local data deletion or native confirm dialog. Browser gate must disclose unsupported prerequisites without pretending that unavailable API evidence is unsupported device capability.
- Additional filters operate only on the authoritative published report-index values: manufacturer, model, platform, submitted timestamp. Unreported fields may never be fabricated; an invalid submitted timestamp must not pass an age filter. Restore all filters on Clear.
- Unavailable, unknown, error and not_applicable remain separate states. Include not_applicable in state filter. Always preserve OpenCL green brand and omit Vulkan-only WSI/HDR/Turnip query semantics.
- Keep versioned frontend JS/CSS filenames in sync with HTML, Pages build, checks, test fixtures and clean-install maintenance tooling. Preserve pinned upstream/reference CSS and GPU icons byte-identically; do not claim complete VulkanScope pixel, feature, or live site identity without matching runtime/browser evidence.

## Database 3.0.10 — Compare, Encyclopedia, detailed evidence and statistics parity stage 2
- This is a web/Worker Database release only. The only eligible new producer stays OpenCLScope 3.0.8 / versionCode 30008. Preserve every historical complete-report validation path, OpenCL schema 1, 16 platform and 211 device query names, registry SHA, raw report JSON, full snapshot and metadata integrity.
- Compare uses stable canonical platform/device/extension/image-format identities; distinguish Added, Removed, Changed, Unchanged without interpreting missing evidence as unsupported. Every visible comparison must originate in the two real complete reports the user explicitly selects; no sample records or inferred timestamps on public pages.
- Encyclopedia displays the existing pinned cl.xml-derived encyclopedia.json (2,002 entries); registered symbols, types, commands and extensions are REFERENCE metadata and never runtime supported capabilities. Filtering, search, 25/50/100 page sizes, text escaping and keyboard-accessible details are mandatory. Do not alter official cl.xml or substitute Vulkan tokens.
- Properties, Features, Memory and Formats detail screens must provide bounded filterable rows and status-aware views with separate unavailable / not_applicable / unknown / error. Raw JSON exports must retain every original observation, including repeated runtime image-format pairs.
- Statistics rely only on actual completely loaded canonical reports; do not silently count unloaded indexed reports as zero or unsupported. Display coverage denominators and unloaded count.
- Keep the VulkanScope 1.4.12 pinned CSS, upstream reference and vendor icon SHA-256 unchanged; new OpenCL-specific visual changes live in the versioned delta stylesheet. Browser tests and static source checks are not evidence of successful live Cloudflare publication or physical Android testing.

## Database 3.0.11 — Statistics and report detail accessibility parity stage 3
- The Android report producer remains precisely OpenCLScope 3.0.8/30008, with schema 1 and the unchanged 16 platform / 211 device query catalog. All prior historically valid complete reports must remain readable, and no synthetic production reports may be introduced.
- Statistics counts **only** complete, actually loaded canonical reports matching the report-index filters; index summaries not loaded as full reports cannot enter detailed device, query, image, or extension statistics. Show explicit loaded/excluded denominators.
- Device/vendor/type/API cohorts are each mutually exclusive within their particular denominator (all devices, all platforms, or all loaded reports), and chart labels must identify that denominator; do not portray them as market share. Bound donut display to 5/8/12 slices, aggregating the unshown groups as Other without discarding the underlying counts.
- Platform and device extensions remain separate raw observations; extension occurrence is at most once per report per selected scope. Platform-only extensions are not device supported and individual extension memberships overlap, so extension frequency is a table, not a pie chart or unsupported claim. Search, namespace, minimum coverage and scope filters must not change the report evidence.
- Preserve the canonical JSON, scoped image-format duplicates, not_applicable/unavailable/unknown/error distinction, previous Compare and Encyclopedia behavior, and pinned upstream VulkanScope 1.4.12 CSS and vendor assets unchanged. Report tabs must offer keyboard navigation and accessible names without inventing device evidence.
- Verify browser and Worker regression tests; local fixtures and Chromium snapshots are not real GPU evidence or a deployed Cloudflare production test.

## Database 3.0.12 — Information and settings parity stage 4
- The VulkanScope Database 1.4.12 Information visual structure, release/dependency cards, local license-viewer control and regional settings navigation are reference behavior only. Information displayed for OpenCLScope derives solely from this release's actual declared dependencies and OpenCLScope's own trademarks and independence notice; never invent version or transitive dependency claims.
- License documents are bundled local Markdown assets, read only by an allowlisted filename through a bounded viewer with proper focus return and Escape dismissal. Do not fetch arbitrary untrusted URLs or inject report data as HTML.
- Preserve the exact 3.0.8/30008 new Android producer requirement, unchanged strict OpenCL schema and historical read contracts, the immutable VulkanScope reference assets, no fabricated device support, and distinct unknown/unavailable/not_applicable/error states.
- The DB 3.0.12 release must not change application collection behavior or make a claim of live D1/Pages or full pixel-parity tests unless executed.

## Database 3.0.14 — Compare sharing, local transfer, and bounded quick actions parity stage 5
- This is a Database-only presentation/release increment. The sole eligible **new** Android report producer remains OpenCLScope 3.0.8/30008. Keep all prior validated reports historically readable, preserve complete schema 1 and exact 16 platform / 211 device query catalog. Never change cl.xml, pinned VulkanScope CSS/logo references, upload endpoints or raw evidence.
- Compare must use only two explicitly selected fully loaded canonical reports and stable OpenCL semantic identities. The sticky/minimizable selector must remain keyboard accessible, with reduced-motion and mobile safeguards. URL routing must accept only exactly two 64-character lowercase SHA-256 report IDs and must not auto-upload or assert availability until full reports load.
- Explicit Compare JSON/TXT export contains selected exact report IDs, the current filters, and all matching canonical observations (including state/code where reported); never translate absence into unsupported, or silently export only the visible page. Escaped display text never becomes executable HTML. Exports are local-only and do not modify canonical reports or Database records.
- Favorites JSON import/export is strictly local and contains only 64-character report IDs. Reject unknown schema, bad hashes, over 300 entries or over 64 KiB of input, merge only after explicit file selection, and obey opt-in persistent storage. Failure must leave current favorites unchanged; session-only remains the default. No external or user report POST/DELETE is added.
- A report quick-action menu must work with an explicit button, context click, touch long-press and keyboard Escape/arrow navigation. A moving touch must cancel pending long-press. Any action affecting Compare or favorites must be explicit. Keep screenshot/browser regression results separate from real Cloudflare D1/Worker/Pages deployment and physical-device testing.


## Database 3.0.14 — Comparable evidence sorting and contextual row actions parity stage 6
- Compare sorting is an explicitly chosen **presentation-only** transform of two fully loaded, selected reports, after semantic identity, query status and category filtering. Support name ascending/descending, change type, category, baseline value and target value. Preserve deterministic tie breaks; preserve missing-value evidence; never map absent queries to unsupported. Page boundaries and exported ordering must track the same fully filtered, sorted view; export filters disclose chosen sort.
- Shared visible evidence rows and Compare rows expose a keyboard-focusable contextual action and optional context click/touch long-press. A moving touch cancels the pending action. Copy buttons only place already-present recorded evidence in the clipboard, with honest failure messages; no mutation to submitted report content, D1, local favorites or API state. Escape/arrow focus navigation and reduced-motion layout are required.
- Keep VulkanScope 1.4.12 reference CSS/imagery immutable. Registry and OpenCL exact 16 platform / 211 device queries unchanged. New producer still OpenCLScope 3.0.8 / 30008, legacy stored reports immutable; no live deployment or pixel-perfect parity may be claimed absent direct proof.

## Database 3.0.15 — Verified historical snapshot resilience
- The Pages publication path must retain the complete, ordered and duplicate-free public report INDEX when one optional featured detail is a cryptographically authentic historical record which fails today's pinned historical producer/report contract. Do not delete or rewrite any D1 record, or pretend that such a detail is a verified report.
- Before checking an archived payload's producer/report contract, verify its exact 64-hex identity, schema envelope and canonical SHA-256. API, missing detail, identity and SHA-256 failures remain fatal; only the typed verified-content/pinned-contract mismatch may be excluded from OPTIONAL full-report preloading. Publish bounded excluded IDs and visible GitHub Actions warnings; preserve the index row and unaltered raw source. Do not substitute synthetic evidence.
- A required newly submitted report ID must always appear in the index AND pass complete existing producer/report validation, identity and SHA-256 checks; no error suppression for REQUIRED_REPORT_ID. OpenCLScope 3.0.8/30008 stays the single allowed new POST producer, all old versions read-only and strictly validated under their original rules; no changes to D1 schema or native OpenCL catalogue.
- Site UI must not present marked-unverified archived records as trusted complete reports. Preserve the upstream VulkanScope 1.4.12 reference CSS/logo and existing OpenCL 16-platform/211-device query contract. Include negative regression tests for optional archived report, required invalid, forged SHA-256 and API failures. Do not claim live Pages/D1 verification without actual production fetches.


## Database 3.0.16 — VulkanScope navigation, live release and notification parity stage 7
- Preserve the exact OpenCLScope 3.0.8 / 30008 POST gate and historical stored-report contracts, immutable OpenCL cl.xml, 16 platform / 211 device queries, explicit error states, canonical report JSON and index/snapshot integrity. Do not borrow Vulkan device fields or assert unverified OpenCL support.
- Section navigation must manage transition cancellation and focus/URL state, respect reduced motion, and avoid stale animations after rapid tab selection; direct report hashes and Compare links remain supported. The current scroll position per workspace is a presentation-only preference, never a substitute for evidence or provenance.
- A versioned release marker is published atomically with the index/snapshot. A visible-tab same-origin no-store check may offer refresh ONLY for a strictly newer semver release with both correctly named assets confirmed available; forged or missing markers, network errors, old release versions and cross-origin URLs must not trigger refresh. Never force a reload or clear Favorites without consent.
- Live new-report notices must be derived exclusively from verified, genuinely new indexed report IDs and use a dismissible accessible UI, not fake reports or remote HTML. Client notifications do not mutate Worker/D1 and do not count missing detail as device unsupported.
- Keep the pinned VulkanScope 1.4.12 visual layout CSS/logo/icon assets unmodified; new behavior-specific styling remains in the versioned OpenCLScope CSS delta. Do not claim full pixel/UI equivalence or a live Pages deployment without observing them.

## Database 3.0.18 — observable network information and accessible report evidence, stage 8
- New POST producer remains exactly OpenCLScope 3.0.8/30008, with the unmodified schema 1, historical read contracts, OpenCL cl.xml, 16 platform / 211 device queries, SHA-256 and Pages snapshot safeguards. No observed network property may be attached to or synthesized as a technical GPU report.
- Internet observations are request-scoped and ephemeral. Poll only while the visible Internet settings panel is open, no more frequently than 60 seconds; do not store addresses in cookies, local storage, D1 or URLs. Values from a failed or offline refresh must be labeled previous/stale rather than current. IP values start masked, reveal by explicit Show only, auto-hide after 15 seconds or on panel closing. Missing IPv4/IPv6 cannot be inferred from the other family.
- Report overview, diagnostics and categorical evidence accordions must be keyboard-operable with honest per-record values, cancelable transitions, and a reduced-motion path. No accordion interaction can modify raw report evidence.
- Preserve pinned VulkanScope 1.4.12 immutable CSS/visual sources unchanged; new styling lives only in versioned OpenCL-specific CSS. Do not claim exact pixel parity or live Pages/D1 verification without actual proof.


## Database 3.0.18 — staged upstream UI evidence parity
- Only original report-supported OpenCL states can drive a query-state filter. Generic platform, device, profile and extension enumeration must never masquerade as Unknown, Unsupported or Available runtime query status.
- Evidence drill-down pagination 10/25/50 requires the complete unmodified underlying recorded fields, keyboard focus containment, explicit close, and source-report links only with a genuine canonical ID.
- Keep the 3.0.8 / 30008 new submission producer gate, existing historical read contracts, full 16+211 query manifest, pinned cl.xml and Vulkan 1.4.12 design source immutable.
- A new UI release must update Worker index/snapshot/release metadata, versioned browser assets, QA and CI paths consistently. Do not represent fixture browser testing as live Cloudflare testing.

## Database 3.0.20 — per-device OpenCL property query coverage, stage 10
- The Features and Memory workspaces offer a VulkanScope-style aggregate coverage table as a presentation alternative to individual recorded rows. Scope is complete and currently loaded canonical reports selected by index filters. A single *loaded device* is the denominator unit; even several devices in one report remain distinct observations. Indexed but not fully loaded reports are excluded and explicitly disclosed.
- For each property present in at least one loaded device, absent query entries from other loaded devices contribute **Unknown** and are additionally counted as Missing. Preserve recorded `available`, `unavailable`, `not_applicable`, `unknown` and `error` separately. Available is query success, never a derived boolean capability `supported`. Raw `false` and `0` remain literal values.
- Variations are computed from actually available literal values, not invented defaults. Detailed evidence dialogs give report-ID-specific source navigation; untrusted device/driver/value strings are DOM-escaped, not HTML-parsed. All table filters, view toggles and pagination remain user-facing presentation choices only; report JSON is immutable.
- Worker API admission remains pinned to newly submitted OpenCLScope 3.0.8/30008 only; D1 schema and historical GET contracts remain unmodified. Preserve pinned VulkanScope 1.4.12 stylesheet, official OpenCL cl.xml SHA-256 and logo/vendor icons. Version the public JS/CSS and synchronize Worker, snapshot, release and CI checks. Live production deployment and whole-site pixel parity require separate verification.

## Database 3.0.20 — report-backed OpenCL image-format coverage, stage 11
- The Formats workspace supports a selected, fully loaded report-device group-coverage view, an exact per-group channel-order/data-type pair-frequency view, and the preserved original individual-query view. The grouping identity is the reported `(imageType, flags)` pair, not Vulkan's `VK_FORMAT` or format-feature bitmask.
- Denominator units are loaded OpenCL devices, even if several appear in one report. A missing image format group is Unknown with an explicit missing count, never Unsupported; a successful query returning an empty `formats` list is Available with zero returned pairs. Unavailable, Not Applicable, Unknown, and Error must remain separate, and code/status values are never overwritten.
- A format pair is counted once per device within an Available query, using its original numeric `orderValue` and `typeValue` when present. Disclose both the entire loaded-device denominator and the number of devices with successful group queries. A pair absent from a successful query is 'not listed', not an inferred GPU hardware inability; a pair in an unqueried group cannot be counted as supported or unsupported.
- Drill-down must link only genuine canonical report IDs and render all driver-provided data through DOM text nodes. Search, paging, status and coverage filters are presentation-only, with keyboard-accessible navigation and reduced-motion support. Do not change raw reports, original report exports, D1 schema, or production admission rules.
- Newly accepted POST producer remains exactly OpenCLScope 3.0.8/30008, with older exact historical records read-only. Preserve byte-identical Khronos OpenCL `registry/cl.xml`, VulkanScope 1.4.12 reference CSS and GPU/brand imagery. JS/CSS, Worker, snapshot, release marker, CI, reconciliation and test contracts must share the 3.0.20 identity. Browser fixture testing is not a live deployment or proof of all-screen pixel parity.


## Database 3.0.21 — OpenCL extension advertisement aggregation, stage 12
- An extension's advertisement is per independently queried platform or device, never inferred from cl.xml, a versioned registry entry or a different scope's string. A successful `CL_PLATFORM_EXTENSIONS` or `CL_DEVICE_EXTENSIONS` query plus its actual enumerated extension list is the only positive or negative advertisement evidence. A not-listed name is not a failed query and is not a runtime capability or function-pointer test.
- A missing, unavailable, erroneous or not-applicable extensions query cannot be classified as an authoritative negative declaration even when a derived extensions array happens to be empty/nonempty. Preserve and disclose its precise query state and original return code.
- Denominators count individual fully loaded, filtered platform or device enumerations and disclose excluded indexed-only reports; never count a single report once in place of its multiple devices. Keep platform-only names (including `cl_khr_icd`) independent of device extension advertisements; cross-scope mode must not rewrite the runtime evidence.
- Namespace, coverage, status and search filters are presentation-only. Per-enumeration evidence remains linked to the original SHA-256 report ID and is rendered via DOM-safe text, with existing keyboard/pagination/long-press controls unaffected.
- The new POST gate stays at OpenCLScope 3.0.8/30008; historical GET, canonical SHA, D1 schema, published cache, versioned asset / release marker synchronization and pinned Vulkan 1.4.12 design CSS and Khronos cl.xml remain unchanged. No live Cloudflare or physical device claims without independent evidence.


## Database 3.0.22 — lossless canonical Compare stage 13
- Presentation-only database increment: new POST remains limited to exact OpenCLScope 3.0.8 / 30008; historical full-report GET, Worker/D1 schema, snapshot cache and immutable upstream reference assets are unchanged.
- The Compare workspace must retain all repeated property and image-format evidence, including duplicate device/platform names, repeated image-format groups and identical format pairs. Aggregate equal canonical identity paths as sorted multisets; list enumeration order must not create false Changed results.
- Compare available property results without collapsing literal 0/false, null, missing, error and not_applicable; distinguish exact status, numeric return code, value structure and image pair numeric identity. Missing evidence is never unsupported capability.
- Any Added/Removed/Changed/Unchanged filter and summary navigation operate only on two explicitly selected, fully loaded canonical reports. Source report links must use the original validated SHA-256 IDs. All exports reflect the same filters and all matched pages, and all untrusted strings remain DOM escaped.
- Maintain versioned JS/CSS and consistent release/Worker/Pages/snapshot/verification markers. Browser fixtures, local source tests and live Cloudflare deployment are separate evidence categories.

## Database 3.0.23 — upstream visual baseline and controls
- Preserve VulkanScope 1.4.12 pristine CSS while layering OpenCL green brand decoration onto neutral upstream surfaces. No Vulkan-specific technical data, red semantic errors, or hardware facts are changed.
- Unify navigation, page controls, mobile filter geometry, evidence tables, the left-side settings drawer, and responsive overlays without weakening report/Worker contract validation.

## Database 3.0.25 — VulkanScope 1.4.12 reference control parity
- VulkanScope's immutable reference CSS remains byte-identical; OpenCL decorative accent alone uses #3DAE2B and true semantic error badges remain red.
- Custom horizontal/vertical scrollbar chrome is neutral grey at rest, green on hover/drag, not borrowed Vulkan red.
- Navigation button DOM uses the reference nav-button class and preserved accessible native button/tab events; responsive arrow controls retain disabled states.
- Reports provides evidenced, reversible Submitted / Vendor / Type column disclosure with accurate aria-expanded, source-only date details in UTC, no inferred original device time zone.
- Report row interaction must not hijack Copy ID, Favorite, Open or More controls; noninteractive cells can navigate to the exact SHA-256 report.
- Worker schema, report canonicalization, D1 and cache logic must not be modified solely for UI parity.

## Database 3.0.26 — filter, viewport/table scrollbar, and statistics denominator parity
- Preserve the immutable VulkanScope Database 1.4.12 CSS/engineering rules and official OpenCL registry. The OpenCL-only overlay may adjust visible controls, but not report evidence or Worker admission semantics.
- Database filters occupy a separate always-visible layout row on normal workspaces; actual native select values remain authoritative. A hidden filter must remain hidden, and Compare/Encyclopedia must not show inapplicable dataset filters.
- Horizontal evidence table controls remain visibly rendered even when there is no overflow, with inactive buttons and accessible range 0. They only scroll the real table and never synthesize records. The custom page rail is visible only with actual document overflow and retains keyboard/pointer scroll semantics.
- Statistics property-state bar widths and meter bounds must be based on the entire fully loaded, filter-selected property-row denominator. Do not normalize the maximum category to 100%; Unknown, Error, Unavailable and Not Applicable stay distinct. A statistics reset must reset statistics state only.
- Do not modify canonical reports, D1 migration or Worker validation solely for layout changes. The versioned JS and CSS, snapshot, marker, CI, documentation and QA evidence must align; isolated Chromium tests are not live Cloudflare evidence.

## Database 3.0.28 — direct upstream UI-control transplantation
- The exact pinned VulkanScope Database 1.4.12 stylesheet remains unchanged; UI-only implementation can copy upstream table-scroller, custom-select, page-jump, and surface-scrollbar code while adapting only data and OpenCL colors.
- Maintain the authoritative native SELECT value and fire normal change events; search and paging of options are presentation-only. Preserve keyboard focus and Escape dismissal. Avoid HTML injection in driver-reported option strings.
- Do not replace OpenCL runtime schema, technical states, source report IDs, D1/canonical payload admission or snapshot-first cache with Vulkan-specific semantics.
- Keep native scrollbar/keyboard behavior functional without extra fake reports. No site-wide pixel identity claim without real populated reference screenshots.

## 3.0.28 Statistics reference component and filter isolation
- Reuse upstream `distribution-grid`, `distribution-card`, `donut-chart`, `donut-center`, `chart-legend`, categorical `chart-stroke-*` and `chart-fill-*` DOM/CSS components, with OpenCL green/neutrals permitted as brand deviation; immutable Vulkan CSS MUST NOT be modified.
- Donut counts use each actual fully loaded OpenCL report/device/platform denominator; enforce exact Other aggregation without guessing unavailable reports. Unknown, false and 0 query meanings stay unchanged.
- Query state percent values are always based on total actual queried property rows; only a uniquely largest state's numeric label gets semantic state coloring, tied maxima remain neutral.
- Extension Reset must reset only extension-specific state, never Statistics state.

## Database 3.0.29 and OpenCLScope 3.0.9
- Current new-submission producer is strictly OpenCLScope 3.0.9 / 30009 with the existing complete OpenCL query and report schema.
- Previously accepted 3.0.8/30008 stored reports remain readable through the archived strict validator, but new 3.0.8 submissions are denied.
- Runtime platform fallback cannot infer OpenCL support without live driver evidence. Public HTML/CSS layout and immutable Vulkan reference assets remain unchanged.


## OpenCLScope Database 3.0.30 native compile hotfix pair
- New POST producer: OpenCLScope 3.0.10 / 30010; existing OpenCLScope 3.0.9 / 30009, 3.0.8 / 30008 and 3.0.7 / 30007 are stored-evidence GET/snapshot only.
- No report schema, registry contract, raw query evidence, privacy, pagination or visible UI behavior may be loosened to accommodate a version change.
- Keep immutable VulkanScope reference assets and the official OpenCL registry byte-identical to the previous release.
- The authoritative Worker, public release metadata, static verifier and tests must all use Database 3.0.30.


## OpenCLScope Database 3.0.31 — runtime access diagnostics pair
- New submissions require OpenCLScope 3.0.11 / 30011 with complete live OpenCL evidence and exact unchanged query catalog.
- Historical complete reports from 3.0.10 / 30010, 3.0.9 / 30009, 3.0.8 / 30008 and 3.0.7 / 30007 remain readable only, never accepted as new POST uploads.
- Runtime linker errors and no-driver statuses are never valid complete reports. Device identity or capabilities must not be inferred from Vulkan or GLES.
- Pinned Khronos registry and VulkanScope reference assets are immutable.

## 3.0.32 producer and report integrity
- OpenCLScope Database 3.0.32 accepts new complete, explicit live reports only from OpenCLScope 3.0.12 / 30012.
- OpenCLScope 3.0.11 / 30011 remains historical read-only, validated with its original complete OpenCL evidence contract; prior supported reports remain readable and cannot be resubmitted.
- A failed OpenCL runtime load is not a reportable OpenCL device and cannot be submitted as a complete report.
- Native library discovery diagnostics cannot infer an OpenCL implementation from graphics renderer names, filenames, or linker errors.

## OpenCLScope Database 3.0.33 runtime-loader compatibility producer contract
- New complete live submissions require OpenCLScope 3.0.13 / 30013 exactly, following source/registry identity and strict privacy checks.
- Historical 3.0.12 reports remain readable and may not be resubmitted as fresh live evidence.
- Worker and frontend release identities are 3.0.33; VulkanScope reference files remain unchanged.
- Diagnostic-only failed collections never become accepted Database submissions.

## 3.0.34 / OpenCLScope 3.0.14 producer compatibility
- Accept new complete live explicit producer 3.0.14/30014 only; require exact registry, privacy, report shape, collection origin, and version pair.
- Preserve 3.0.13/30013 and all earlier compatible complete report identities solely for historical reads. Never accept older or partial reports on POST.
- Preserve original VulkanScope reference sources and release and client deployed-state checks; do not claim successful live deployment without actual evidence.

## OpenCLScope Database 3.0.34 exact-producer release lock
- 3.0.14/30014 is the only permitted new live submission producer. 3.0.13/30013 is a historical read-only producer.

## 3.2.0 producer and preserved-history release lock
- Database 3.2.0 only accepts complete, explicit, live OpenCLScope 3.2.0 / 30100 producer uploads.
- Existing stored OpenCLScope 3.0.14 / 30014 reports remain read-only; previously accepted versions retain their historical storage validations.
- Canonical registry and current 16/211/24 report envelope are unchanged. The Khronos API-name aliases affect display only, never stored query keys or privacy controls.

## OpenCLScope Database 3.4.0 — typed evidence and historical report contract
- New report POST requires exact complete, explicit live OpenCLScope 3.4.0 / 30400 and current registry digest. 3.2.0 / 30200 and older valid complete reports remain read-only historical evidence, not accepted as new reports.
- The current report adds independently verifiable image-format specWarning fields to every reported format and native_u32 typed-decoding evidence to valid QCOM cl_uint opaque bytes; the old unmodified name/value/status/code and format enum pairs remain the primary runtime evidence.
- The Worker checks the warning against the order/data-type combination and the numeric byte count against the unmodified raw native bytes. Mutations of those fields must be rejected; previous report shapes are parsed only under their original pinned producer identities.
- Browser displays specification warnings and QCOM typed bytes without deleting raw image rows or inferring successful image allocations, conformance or unsupported GPU capabilities.
- VulkanScope pinned reference CSS/assets, original OpenCL cl.xml/mark, user-initiated consent, privacy controls, bounded source reports and fail-closed publication workflows remain immutable.

## OpenCLScope Database 3.4.1 — deploy/readiness and UI control repair
- Frontend-only database revision; new POST producer remains strictly OpenCLScope 3.4.0/30400, historical evidence, registry and D1 unchanged.
- Windows, Build, GitHub Release and Pages Deploy are serial gates; a snapshot dispatch is independently validated and never issues a duplicate GitHub Release.
- Source release marker is not ready until a successful snapshot build; deployed readiness requires matching immutable HTML, app, CSS, bootstrap, report index and preload.
- Automatic full-page reload requires prior explicit user opt-in, and preserves the current hash; no reload occurs for incomplete or older deployments.
- Filters are a sibling of the workspace heading. Styling targets the real DOM; hidden controls remain hidden and native select value remains authoritative.
- Live Cloudflare, GitHub Releases and production reports require separate confirmation; never infer success from local tests.

## Database 3.4.2 — statistics evidence pagination and scrollbar accessibility
- Statistics extension frequency MUST paginate all matching extension names; it must not silently hide matches beyond the first 100. Each loaded report contributes at most once to an extension and denominators MUST exclude unloaded reports.
- Statistics page-number, Go, Previous/Next and 25/50/100 limit controls use reference-compatible bounded input rules and preserve search/filter state. Global report pagination MUST not display a misleading zero-row pager on Statistics.
- Scrollbar thumbs MUST not be keyboard-focusable when their scroll container is not visible or not scrollable, and real available thumbs MUST expose a valid value range.
- Preserve official Khronos XML and immutable VulkanScope rules/CSS byte-for-byte, schema 1 report ID admission, Worker/D1 contracts, and previous staged CI/release/deploy pipeline.


## Database 3.4.3 — single release owner, nonblocking permission, immutable cache bust
- Only the versioned release bootstrap owns public release polling and readiness verification; the app MUST NOT poll the same marker a second time or create a blocking Refresh dialog.
- A new version is verified against its ready marker and published HTML/JS/CSS/bootstrap before any reload. Automatic reload is only allowed after the visitor explicitly enables the persisted Preferences toggle. Otherwise a dismissible nonmodal notice offers manual update or explicit permanent opt-in.
- Update notices must not steal focus or lock scrolling, must not repeat for the same remote release, and may be dismissed per tab. Reload retains the current workspace hash. Previously consented browsers update after the completed deployment without another Refresh prompt.
- Changed app, stylesheet delta, and bootstrap are freshly versioned. Official Khronos XML, VulkanScope immutable reference CSS, OpenCL report submission/acceptance, D1, and release/Pages/Snapshot gates remain unchanged. Live Pages release must still be verified separately.


## Database 3.4.4 — Mandatory exact VulkanScope Database 1.4.12 reference fidelity
- **Binding, not aspirational:** The complete pinned VulkanScope Database 1.4.12 website is the controlling reference for every corresponding OpenCLScope Database interface, interaction, animation, tooltip, dialog, table, table header, action, navigation tab, scrollbar, filter, status badge, report export, statistics chart, Settings panel, About/Information text, mobile breakpoint, loading screen, keyboard/focus behavior, GitHub workflow and deploy/readiness transition. Inspect the actual upstream HTML, CSS, JavaScript and workflows line by line before changing corresponding components; reuse the upstream implementations wherever technically applicable, not visual approximations.
- **No gratuitous deviations:** Do not add, remove, paraphrase, reorder or duplicate any corresponding visible sentence, heading, button label, icon, icon path, feature, prompt, notice, tooltip, preference, pagination control, color treatment, hover/focus style, spacing or animation relative to the VulkanScope reference. Additional marketing language, explanatory copy and non-reference widgets in shared areas are prohibited. Differences must be itemized before release and fixed rather than dismissed as aesthetic preferences.
- **Strict OpenCL-only exception:** Substitute only nouns, GPU/API semantics, official OpenCL trademarks, brand-green accents, supported native OpenCL evidence fields, schema requirements and paths that genuinely cannot be copied verbatim from VulkanScope. Every exception must be explicitly justified and listed in the comparison report. Never misrepresent Vulkan, Turnip, WSI or extensions as OpenCL facts; preserve technical authenticity, accessibility, privacy, and the existing strict producer/Worker/D1 contracts.
- **Quality and parity gate:** For each shared component, verify DOM structure and expected text/icon order, styling including actual computed colors and dimensions, functional pointer/keyboard/touch behavior, overflow/scrollbars and mobile/desktop screenshots against populated equivalent upstream views. Automated UI and Worker tests, cross-platform GitHub Actions and page release readiness must pass. A source-only test or blank-snapshot screenshot is not proof of pixel-for-pixel/behavior parity. Track every unverified or unresolved item explicitly, and never declare complete equivalence without supporting evidence.
- **Immutable reference and safety precedence:** Do not mutate the original VulkanScope pinned CSS/rulebook, Khronos registry/cl.xml, canonical OpenCL runtime evidence, old reports or D1 schema. Reuse verified upstream controls in the OpenCL presentation layer only. Do not bypass explicit user consent for automatic reload or compromise security to match presentation.


## Database 3.4.6 — shared search and Reports interaction fidelity
- Copy the VulkanScope 1.4.12 global-search clear-button SVG, animation, focus, aria-hidden and keyboard behavior exactly, substituting only the OpenCL green focus accent. Search-result refresh may be bounded/debounced but must keep the search query authoritative. Do not ship a duplicate Refresh action inside the reference hero command row.
- Reports Copy ID uses the original upstream copy icon path. The report table remains a semantic HTML table: its rows support keyboard open and context-menu controls without misrepresenting a row with embedded buttons as a nested button. Long-press opens the actions menu without also opening the report due to a synthetic click. Preserve focus return, escaped external evidence, full SHA-256 IDs and independent row actions.
- Do not loosen OpenCL producer 3.4.0/30400 admission, historical-read validation, D1, official cl.xml, pinned VulkanScope reference or deployment gates. Desktop/mobile browser tests and source/Worker checks are distinct from live deployment evidence.

## Database 3.4.6 — upstream Reports pager and no redundant controls
- Reports use VulkanScope 1.4.12 native report-toolbar Sort / Per page controls only; the shared Filter panel must not duplicate Sort or Page limit in Reports. Reports row-limit options are 10, 25, and 50; the default is 25.
- The report page-size state is independent of generic evidence, statistics, formats, extension and Compare page-size state. All pages and Go navigation use the page size of the active view; switching views must not silently change their user-selected page limits.
- Report filters, sorts and range text use the report page size consistently, including empty results and one-page data. Preserve the canonical OpenCL evidence, report IDs, Worker/D1, immutable Vulkan reference sources and explicit-update-consent rule.
- Shared controls must not introduce duplicate equivalent visible actions relative to the pinned VulkanScope 1.4.12 UI. Verify keyboard, pointer, touch and cross-view behavior and distinguish local checks from live deployment.

## Database 3.4.7 — effective-color parity, not merely CSS tokens
- The last loaded presentation asset must not restore VulkanScope's burgundy decorative color to the OpenCL page's table scrollbar, page scrollbar, navigation arrow, search/listbox, filter, repository icon, or neutral surfaces. Reuse the reference's component geometry and behavior; translate only the brand red accents to the OpenCL green palette, with neutral dark fills and gray idle scrollbar thumbs. Actual error/destructive controls retain meaningful red states.
- Browser-native scrollbar color must be neutral gray/dark consistently across `html`, `body`, Settings, evidence modals and filter lists, even when upstream generic selectors set a red scrollbar color. Hover/focus states are tested after the final stylesheet in both desktop and mobile browsers. Do not mutate the byte-pinned VulkanScope styles.
- The page background uses the same upstream radial-gradient placement and 34-percent fade, substituting the green accent for the Vulkan red wash on a neutral AMOLED floor. Changes to body/floor/viewport colors require computed-style regression tests, not only string matches. Prevent a last-loaded CSS asset from reverting corrected colors.
- A 3.4.7 presentation correction must not change the OpenCLScope 3.4.0/30400 new-submission admission or any historical-read rules, schema, D1, GitHub workflows, update-consent, and original report evidence.


## Database 3.4.8 — report-detail DOM, text and disclosure parity
- Report detail uses VulkanScope Database 1.4.12's actual `detail-hero-v126`, `detail-hero-head`, `detail-identity-grid`, `detail-identity-card`, `detail-report-id-row`, `detail-actions`, `detail-tabs`, `detail-section-intro`, `detail-evidence-stack` and `detail-evidence-panel` structure. OpenCL native evidence only; Vulkan Surface/WSI/queue tabs and capability interpretations are prohibited.
- Do not ship an independent visible Diagnostics tab when authoritative collection fields can be presented in Overview. Use the upstream Raw report label and evidence panels, not unrelated accordion-only pages. Show counts derived exclusively from the loaded immutable report.
- Escape report strings through DOM text nodes; do not conflate unknown, absent, false, 0, error or unavailable query evidence. New CSS loads last without mutating the byte-pinned reference stylesheet. Preserve OpenCL TXT/HTML/JSON exports, SHA-256 links, keyboard traversal, legal notices, user refresh consent, and Worker/D1 contracts.
- Compare populated upstream and OpenCL pages in mobile and desktop browsers; source checks and blank snapshots are not proof of live/pixel-perfect parity. Document unresolved differences.

## Database 3.4.11 — strict browser-title and ZIP root parity
- Match VulkanScope 1.4.12 browser document titles for the Reports workspace, each other workspace and each loaded GPU report/tab, changing only technology/product names. Switching report tabs MUST update the document title without losing the current route.
- Match the upstream favicon link roles (regular PNG, shortcut ICO, Apple touch image) while using the actual OpenCL CL icon and black background.
- The source ZIP MUST NOT ship accumulated old COMPARISON/QA/FULL_VULKAN_DESIGN_COMPARISON markdown documents, old UI audit TSV files, a redundant README.md, or stale root SHA inventories. Keep current changelog.md and release.md, mandatory immutable rules, source/test/Worker assets and current manifest verification. Release QA and audit documents are separately distributed.
- When extracting over a previous checkout, `reconcile_repository.py --apply` must clean only exact previously released historical root files (known hashes), and never erase user-edited local files.
- Existing immutable reference CSS, cl.xml, GPU icon source files, submission contract and Cloudflare D1 configuration remain unchanged.

## Database 3.4.11 — VulkanScope-interactive statistics and evidence integrity
- Copy the pinned VulkanScope 1.4.12 distribution interaction pattern for corresponding OpenCL Statistics: donut segments and named legend entries activate the same cohort filter using mouse, touch, Enter and Space; an active filter has aria-pressed and visible selection, an explicit clear action and retained keyboard focus. A synthetic Other slice is an aggregate, not an independently reportable GPU or runtime cohort.
- Statistics cohort filtering uses only fully loaded, user-filter-matching canonical OpenCL reports. GPU vendor, device API/version, device type, reported Android manufacturer and platform name are derived from real report fields; driver/app/platform-vendor dimensions are displayed as observations, never invented support verdicts. Report-overlapping extension memberships must remain frequency rankings rather than a pie chart.
- Respect correct denominator units (reports, platforms, devices, property rows) independently. Reports excluded by an interactive cohort filter are still loaded; never count them as missing/unloaded. Unloaded index entries never become inferred evidence. Preserve exact false/0, unknown, unavailable, not_applicable and error results.
- Preserve exact immutable VulkanScope stylesheet, registry/cl.xml, producer 3.4.0/30400 gating, historical records, Worker and D1 data. Latest presentation assets require fresh versioned JS/CSS URLs and release-manifest/deploy checks; release CI must fail when the interaction tests regress.
- This update is a tested Statistics subset and MUST NOT be presented as complete UI parity. Keep unresolved Reports/Compare/Settings and screenshot parity gaps explicit.

## Database 3.4.11 — video-observed Properties workspace parity
- The pinned 157-second VulkanScope 1.4.12 UI recording establishes that Properties is a distinct navigation workspace, with a dense sortable-style availability table and a distinct-values evidence modal; do not claim full visual parity on the strength of a static screenshot.
- Expose an OpenCL-native Properties workspace using actual, fully loaded immutable CL_PLATFORM_* and CL_DEVICE_* query evidence; never merge platform counts into device denominators. Missing entries are Unknown, not Unavailable or Unsupported. Preserve exact `false`, `0`, empty and failed values.
- Provide aggregate property availability and distinct-value evidence controls with per-source report links, bounded pages, keyboard controls and mobile horizontal overflow protection. The raw query view must include platform and device properties.
- Retain pinned reference CSS, registry/cl.xml, strict existing producer and historical acceptance, Worker/D1 data, user-permitted deploy refresh and cross-platform release pipeline. Additional video's Settings, Reports, Compare, Formats and responsive-detail differences remain separately open until proven with equivalent populated fixtures.
