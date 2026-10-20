# OpenCLScope Database 3.0.15 — QA

| Test | Result |
|---|---|
| Node site regression tests | 78/78 PASS |
| Node Worker contract tests | 19/19 PASS |
| New snapshot tests: full index, integrity, historical contract, mandatory report, API failure | 6/6 PASS |
| Repository reconciliation (`--check`) | PASS |
| Source/registry/VulkanScope asset SHA checks | PASS |
| Frontend, Worker, Pages builder/verifier Node syntax | PASS |
| Pages allowlisted static artifact build | PASS |
| New ZIP/manifest integrity check | PASS at packaging |

*Production validation:* Not run. The GitHub Actions screenshot shows a failed historical report ID, but does not contain its API body. No claim is made that the exact field causing rejection has been identified or that live Cloudflare Pages has been republished. Bad SHA-256/API errors and required report contract errors deliberately remain fatal.
