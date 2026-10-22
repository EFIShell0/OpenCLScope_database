# OpenCLScope Database 3.4.1 QA

- Baseline input: OpenCLScope Database 3.4.0; reference: VulkanScope Database 1.4.12.
- `python -B tools/reconcile_repository.py --check`: PASS.
- `python -B tools/verify_release.py`: PASS.
- `node tools/run_tests.mjs`: 159/159 PASS (includes five new release/deploy tests).
- `node tools/build_pages_artifact.mjs`: PASS on the release template, which remains not-ready until snapshot collection.
- `node tools/audit_pages_artifact.mjs _site`: PASS; allowlisted Pages artifact only.
- Chromium HTML/CSS static geometry evaluation at 1440×900 and 390×844: 11 navigation tabs, visible CSS grid filters, no horizontal document overflow. No external assets or application behavior claimed from this static test.
- Browser update scenarios in isolated Node VM: ready/unready source marker, explicit opt-in, preserved URL hash, warning without consent: PASS.
- SHA-256 static official references: unchanged. ZIP integrity and deterministic re-creation checked separately.
- Real GitHub Actions, live Cloudflare, 11 populated-screen cross-site visual matching: NOT TESTED; do not report as PASS.
