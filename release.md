# OpenCLScope™ Database 0.12.0

## Added
- Immediate accepted-report GitHub Actions snapshot dispatch with authoritative ID and timestamp; optional 15-minute Pages reconciliation and retry for failed publication.
- Post-deployment Pages index and preload verification, requiring each triggering report to be visible.
- Cache-first website with 10-second visible-page live synchronization against `/v1/sync` and non-destructive offline fallback.
- VulkanScope-matched GPU vendor logos for recognized vendor strings and consistent responsive navigation icons.

## Changed
- Snapshot generation now shares Worker producer validation, eliminating the old snapshot whitelist that rejected valid 0.10.1–0.12.4 producers.
- Required just-submitted report receives preload priority; complete metadata index remains authoritative for all reports.
- Versioned UI assets, refreshed card/search/navigation proportions and database status indicators.

## Fixed
- GitHub Actions previously checked non-existent `assets/app.v0701.js`.
- Worker release metadata, public snapshot/index release version and packaged website version are now consistent.
- Snapshot publication tests now cover latest exact producer, historical compatibility, invalid identity, SHA integrity and post-deployment gating.

## Security
- No fake entries, guessed GPU identification or permissive producer matching. Registry `cl.xml` and official SVG remain unchanged.
- Live Cloudflare D1/Pages publication must be validated after deploying; local test results alone do not assert a live success.
