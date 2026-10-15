# OpenCLScope Database 0.12.52 — QA (2026-10-15)

## Source baseline
- OpenCLScope Database 0.12.51 ZIP and VulkanScope Database 1.4.12 ZIP were extracted and compared.
- Full results: `FULL_VULKAN_COMPARISON_0.12.52.md`, `FILE_BY_FILE_COMPARISON.tsv`.
- 44 prioritized behavior/design findings; report labels fixed/intentional/pending individually.

## Executed local checks
- `python tools/verify_release.py` — PASS.
- `node --test tests/*.test.mjs worker/tests/*.test.mjs` — PASS 40/40.
- `node tools/build_pages_artifact.mjs` — PASS with current 0.12.52 empty snapshot fixture.
- Negative release-gate test — PASS: mismatched 0.12.7 index fails closed; matching Worker/snapshot 0.12.52 passes.
- Source Worker producer acceptance contract remains 1.0.14 / 10014, with older pinned historical producers preserved.
- Official cl.xml, 16 platform + 209 device queries, 156 registry extensions and pinned upstream branding assets unchanged.

## Not executed / limitations
- Real deployed Cloudflare Worker/D1 write/read, GitHub Actions and actual GitHub Pages publication: NOT EXECUTED.
- Full-browser UI parity, mobile responsiveness and pixel-level screenshot tests: NOT VERIFIED. Headless Chromium screenshot attempt timed out; do not claim success.
- Pending parity differences are intentionally not claimed as fixed in this release.
