# OpenCLScope Database 1.0.0

## Added
- Black-backed OpenCLScope 1.0.19 master-logo favicon and full source-aligned VulkanScope 1.4.12 shared style geometry.
- VulkanScope-style Reports table, real GPU vendor emblems, interactive report ID copying and favorites, consistent section/detail icons.
- New-submission minimum OpenCLScope **1.0.19** with exact versionName/versionCode/native appVersion matching.
- Canonical semantic report comparison by platform, device and OpenCL property/extension/format identity.
- Statistics workspace with source-labeled report, vendor, OpenCL version and query-state distributions.

## Changed
- Reference design loaded only once; OpenCL brand accent is green while surfaces, status/error colors and control geometry follow the upstream hierarchy.
- Responsive Statistics chart cards, comparative grid, header and Settings icon arrangement refined.
- Compare card density and responsive styling aligned with the VulkanScope Database 1.4.12 portable visual language.
- Frontend JS/CSS release assets versioned as `v1000` and synchronized Worker, static snapshot and visible footer metadata.

## Fixed
- Reject old producer submissions and unknown future versions without deleting historical database records.
- Prevent false Compare differences caused solely by query-array, extension or image-format enumeration ordering.
- Correct stale footer, README and deploy command release identities.
