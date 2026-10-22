# OpenCLScope Database changelog

## 3.4.11

- Reviewed the complete 157-second 3840×2160 VulkanScope UI recording, including Reports, Settings, property distributions, Memory, Instance, Encyclopedia and Compare. Compared against the pinned VulkanScope Database 1.4.12 project.
- Added a separate OpenCL-native Properties workspace in the same navigation position as the upstream Properties screen.
- Added platform/device-scoped property availability tables, percentage meters, bounded paging, search, variation/coverage filters, distinct-value dialogs and individual source-report links, using only fully loaded canonical reports.
- Preserve numeric `0`, boolean `false`, failed queries, absent queries and source SHA-256 separately; missing evidence is Unknown rather than Unsupported. Device and platform observations never share a denominator.
- Added source-model, source safety, keyboard, mobile and desktop Chromium checks. The remaining video-observed Reports, Settings, Compare, Memory layout and complete pixel parity gaps remain open.
- Updated versioned browser assets and staged GitHub release identifiers, leaving OpenCLScope 3.4.0/30400 producer acceptance, D1, registry, pinned upstream CSS and historical reports unchanged.

## 3.4.10

- Reused VulkanScope 1.4.12 clickable donut/legend behavior with keyboard-accessible, single-cohort filters for actual OpenCL device, vendor, API, manufacturer and platform evidence.
- Added honest driver-version, app-version and platform-vendor observation charts, with extension counts kept separately.
- Corrected loaded-versus-unloaded statistics report counting.

## 3.4.9

- Match VulkanScope 1.4.12 browser title structure: Reports uses the application title; other sections use `Section - OpenCLScope Database`; reports use `GPU - Report tab - OpenCLScope Database`.
- Supply the matching `.ico` fallback for the CL favicon and explicit icon sizes.
- Remove historical comparison, QA and UI audit files from the release root; these belong in external release notes, not in the source ZIP.
- Keep the pinned OpenCL registry, validation and source test files unchanged.

Detailed QA and comparison reports are distributed separately with this release.
