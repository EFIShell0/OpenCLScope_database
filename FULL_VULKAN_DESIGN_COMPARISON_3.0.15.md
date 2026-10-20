# Database 3.0.15 — VulkanScope 1.4.12 parity preservation and Pages reliability

Version 3.0.15 addresses a **publishing contract failure**, not another phase of UI redesign. This release retains the existing pinned VulkanScope 1.4.12 CSS, graphic and icon hashes and OpenCLScope's native report schema. Unresolved visual/interaction differences remain documented in earlier full comparison files.

## Confirmed incident

`tools/build_snapshot.mjs` previously rejected the entire GitHub Pages publication when an optional featured full report did not pass `validateStoredReport()`. The reported 64-character ID was in the screenshot, but the corresponding JSON payload was not provided. A concrete field mismatch therefore cannot be inferred reliably.

## New fail-closed boundaries

1. Preserve every safely indexed record and its natural sort order.
2. Independently verify full detail ID, source envelope, exact canonical SHA-256 before examining its producer/schema eligibility.
3. Skip only an optional detail that fails its pinned archival report contract **after passing cryptographic integrity**; warn in Actions, list the ID in a bounded audit array and never present it as trusted full content.
4. Maintain fatal failure behavior for missing/erroring APIs, mismatched details, wrong hashes and invalid `REQUIRED_REPORT_ID`.
5. Reject dishonest snapshot metadata in static and deployed artifact verification.

Worker POST admission, historical report storage and D1 rows remain untouched. Frontend displays exclusion state honestly. Local unit tests verify the intended behavior; no live Cloudflare publication or real historic D1 record diagnosis is claimed.
