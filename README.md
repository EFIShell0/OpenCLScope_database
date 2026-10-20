# OpenCLScope Database 3.0.15

Database-only release correcting a **GitHub Pages public snapshot build failure** caused by one optional full historical report failing the pinned report-contract validator. The canonical public index remains complete while unverifiable optional details are *not* presented as fully validated reports. The relevant IDs and warnings are recorded explicitly, and the new report producer and SHA-256 identity rules remain strict. No D1 migration or Android app update is part of this release.

## Release 3.0.15 — verified historical snapshot recovery

- `tools/build_snapshot.mjs` verifies envelope and SHA-256 before producer/schema validation. Optional, cryptographically intact but contract-invalid details are not preloaded and their IDs are listed in `skippedInvalidContractIds` with a GitHub Actions warning.
- **Mandatory report IDs, API failures and corrupt or mismatched hashes still abort publication.** Index rows are never silently deleted or fabricated.
- The frontend refuses to render archive details identified as unverified. Static Pages assembly and remote verification validate archival exclusions and keep them disjoint from trusted preloads.
- `tests/snapshot.test.mjs` includes positive and negative cases for historical producer mismatches, required details, tampering and API failures. Exact diagnosis of the screenshot's individual published report needs that report's JSON body; it was not supplied.
- The only new Android producer remains **OpenCLScope 3.0.8 / 30008**. Previous completed records are stored unmodified. OpenCL XML/query catalog, VulkanScope 1.4.12 CSS and vendor graphics are unchanged.

## Reference and publishing

See `FULL_VULKAN_DESIGN_COMPARISON_3.0.15.md`, `QA_RESULTS.md`, `release.md` and `rules/PROJECT_RULES.md`. Verify with `python -B tools/reconcile_repository.py --check`, `python -B tools/verify_release.py`, `node --test tests/*.test.mjs` and `node --test worker/tests/*.test.mjs`.

Publish Worker 3.0.15 first if required, then Pages, following `DEPLOY_COMMANDS_POWERSHELL.txt`. This bundle is not a live Cloudflare/D1 test; do not overwrite your configured Worker D1 database ID with the distribution placeholder. Historic report index entries are not deleted by the new Pages snapshot rules.

## Historical notes

Version 3.0.14 introduced deterministic Compare sorting and contextual evidence quick actions, on top of earlier pinned VulkanScope-inspired user interface parity stages. Its historical comparison document is preserved as `FULL_VULKAN_DESIGN_COMPARISON_3.0.14.md`.
