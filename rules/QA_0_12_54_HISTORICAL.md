# OpenCLScope Database 0.12.54 — Validation results

- PASS: `python -B tools/reconcile_repository.py --check` — 7 active site test files, no leftovers in release ZIP.
- PASS: `node --check assets/app.v1254.js` and `node --check worker/src/index.js`.
- PASS: `node --test tests/*.test.mjs worker/tests/*.test.mjs` — **51/51** tests. This is 32 site tests and 19 Worker tests.
- PASS: `python -B tools/verify_release.py` — pinned official registry/logo, schema 1, catalog, OpenCL-only Worker, accurate producer allowlist and asset version.
- PASS: `node tools/build_pages_artifact.mjs` — public allowlisted-only site artifact and 0.12.54 release index/snapshot match.
- PASS: isolated Chromium inline preview at 1440×900 and 390×844: no script page errors, no horizontal overflow, four Settings categories open, 250 country choices plus browser default, date/time controls, Internet clock, and modal close. This harness intentionally strips CSP because the test uses inline assets; production CSP is unchanged.
- PASS: malformed legacy test inventory mutation is detected and `--apply` moves old tests under rules/legacy_tests rather than deleting them.

## GitHub Actions screenshot assessment

The screenshot of the 0.12.53 release shows 31 site tests, 30 passing and 1 failing. The 0.12.53 archived source has 28 site tests, all passing here. This is evidence of a mismatched repository working tree or revision, **not proof** of a specific failing assertion. The screenshot does not show which test failed. The new explicit inventory gate makes this condition diagnostic; the upgrade command is mandatory before pushing into an older checkout.

## Not proven

- GitHub Actions on the user's current repository after upgrade.
- Live Cloudflare Worker/D1 deployment, real Pages snapshot publication and network edge behavior.
- Exact pixel parity with all VulkanScope screens or feature parity for semantic comparison and advanced statistics.
- Full equivalence of reference Internet network diagnostics and library/license UI.
