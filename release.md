# OpenCLScope Database 3.0.32

### Windows GitHub Actions and publication hotfix

- Fixed Windows `core.autocrlf` corruption of the pinned VulkanScope 1.4.12 CSS SHA-256. The immutable reference bytes and digest were **not** changed. Git-enforced LF checkout is applied to CSS, JavaScript, tests and other text sources. The official OpenCL registry and SVG are preserved as raw bytes.
- Fixed the OpenCL Compare JavaScript extractor test to recognize both LF and CRLF while retaining full semantic comparisons (order independence, real `false`/`0` and distinct `unknown`).
- Reinstated the reference multi-stage GitHub Actions release pipeline: Windows tooling, Linux build, GitHub Release, Pages deployment, plus a separate report-triggered snapshot job. CI fails closed on the pinned CSS SHA-256, failed tests, mismatched release tags or missing required snapshot evidence.
- Added deterministic GitHub Release ZIP/`.sha256` packaging and a public-site allowlist audit.
- Preserved complete OpenCLScope 3.0.11 / 30011 report-only acceptance, strict historical read compatibility, report schema, privacy rules, D1 binding and existing browser interface assets.

### Validation

- `node tools/run_tests.mjs`: **148/148 passed** locally.
- `python tools/verify_release.py`: PASS.
- `python tools/reconcile_repository.py --check`: PASS.
- `node tools/build_pages_artifact.mjs` and `node tools/audit_pages_artifact.mjs _site`: PASS, 306 allowlisted public files.
- Release packaging and deterministic second pass: PASS.
- Git checkout simulation with `core.autocrlf=true`: LF reference source retained with SHA-256 `bd5957461701439a7655c652b4e560cb84b7cc0163f202a257e019c2c468181b`.
- **Not tested:** GitHub-hosted Windows runner, actual GitHub Release, Cloudflare/D1 deployment, public Pages website.

This release was prepared from the archived OpenCLScope Database 3.0.31 ZIP. The publicly visible GitHub `main` workflow at inspection time used separately advanced frontend asset filenames. Review the repository diff before replacing files in an existing clone; do not blindly extract over live source.
