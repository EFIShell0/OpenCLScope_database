# OpenCLScope Database 3.0.17 — QA

| Verification | Result |
|---|---|
| Node.js site tests (including stage-8 network/privacy and evidence tests) | 84/84 PASS |
| Node.js Worker contracts | 19/19 PASS |
| `python -B tools/verify_release.py` | PASS (Pillow deprecation warning only) |
| `python -B tools/reconcile_repository.py --check` | PASS — 18 active test files |
| `node tools/build_pages_artifact.mjs` (static allowlisted release) | PASS |
| Chromium 1440 × 900, isolated mock transport | PASS: request-scoped Internet observation, masked/revealed/re-masked IP, tab-close polling stop, accordion keyboard, no JS errors/overflow |
| Chromium 390 × 844, isolated mock transport | PASS: same controls, no JS errors/overflow |
| OpenCL official registry and immutable Vulkan layout hashes | PASS — unchanged against 3.0.16 |
| Worker producer gate and historical schema | PASS — only new 3.0.8/30008, previous valid historical reads retained |
| ZIP integrity + per-member SHA-256 | PASS |
| Live Cloudflare Worker / D1 / GitHub Pages | NOT TESTED |
| Every VulkanScope screen pixel-identical / all mobile devices | NOT VERIFIED |

Chromium used a synthetic complete report from the repository's test fixture and test-only request data. No mock network observations or report data were published.
