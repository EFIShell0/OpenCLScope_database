# OpenCLScope™ Database 0.1.0

## Added
- Independent Cloudflare Worker/D1 database for OpenCLScope 0.2.0 schema-1 reports.
- AMOLED/green web report explorer with full-report detail, aggregate OpenCL views, report-ID search and exact query comparisons.
- Server-side UTC timestamp, idempotent SHA-256 report ID, chunk-safe atomic storage and snapshot-triggered GitHub Pages publishing.
- Repository checks, full-index/snapshot corruption checks, negative-mutation and false-positive regression tests.

## Changed
- VulkanScope-native technical fields replaced with canonical OpenCL™ platform, device, properties, formats and extensions.

## Fixed
- Prevent fake status, partial reports, unbounded body, wrong producer/version and missing durable chunks from entering a report-backed view.
