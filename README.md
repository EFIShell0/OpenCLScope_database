# OpenCLScope Database 0.12.0

Standalone OpenCL™ capability database companion for **OpenCLScope 0.12.4**, modeled after the supplied VulkanScope Database 1.4.12 Worker/D1/Pages security and publication architecture. This is OpenCL report schema 1 and stores only explicitly submitted OpenCLScope evidence. The normative `cl.xml` and official `opencl.svg` remain checked in under `registry/`.

## Supported producers
- Exact producer pairs are accepted only; current producer is **OpenCLScope 0.12.4 / versionCode 1204**.
- OpenCLScope 0.12.3 / 1203, 0.12.2 / 1202, 0.12.1 / 1201, 0.12.0 / 1200, 0.11.1 / 1101 and all previously supported exact producers remain accepted.
- 0.2.0–0.7.0 retain the historical exact 8 platform + 120 device-property contract.
- 0.8.0–0.12.4 use the exact registry-derived 16 platform + 209 device-property contract.
- `technicalReport.appVersion` must exactly match the producer version. Imported, partial, failed, loader-unavailable and malformed reports are rejected.

## API / safety
- `GET /v1/health`, `GET /v1/sync`, paged `GET /v1/reports`, `GET /v1/reports/{sha256}`, explicit `POST /v1/reports`.
- Exact field/query validation, unique extension/image-format bounds, sensitive-key rejection, SHA-256 report IDs, HTTPS-only fixed-origin policy, bounded pagination and durable chunk/snapshot handling.
- Canonical repository: `https://github.com/EFIShell0/OpenCLScope_database`.

OpenCL™ and the OpenCL logo are trademarks of The Khronos Group Inc. This project is independent and is not an official Khronos application.

## 0.12.0 live publication and cache parity
- **Immediate Worker acceptance:** only explicit complete Android submissions get durable D1 report ID and a GitHub Actions snapshot dispatch when the token is configured.
- **Verified Pages snapshot:** the workflow checks actual site assets, builds a complete report index and capped full-detail preload, reserves the newly accepted report in the preload and checks the published result after deployment.
- **Snapshot recovery:** optional `SNAPSHOT_PAGES_URL` enables the scheduled 15-minute missing-publication reconciliation. The URL must be the verified real Pages site URL.
- **Site freshness:** published snapshot loads first, then `/v1/sync` checks and up-to-10-second visible-page polling update the index without downloading all report details on each view. This is a polling interval, not guaranteed push latency.
- **Visuals:** shipped VulkanScope GPU vendor artwork only for vendors supported by explicit report strings; neutral unavailable icon otherwise. Use the same green/AMOLED OpenCL identity with accessible buttons and responsive controls.

**Deployment dependencies:** configuring actual Cloudflare D1 UUID, GitHub Actions variable `OPENCLSCOPE_DATABASE_API`, Wrangler secret `SNAPSHOT_GITHUB_TOKEN` and (for recovery) the actual Pages URL is required. No real deployment is performed by packaging this source.
