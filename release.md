# OpenCLScope™ Database 3.0.30

## GitHub release and design-component parity

The 3.0.30 database release adopts the upstream VulkanScope Database 1.4.12 release pipeline architecture: Windows validation, Linux build/audit, version-tagged GitHub Release containing a deterministic ZIP and SHA-256 checksum, followed by GitHub Pages deployment and deployed-snapshot verification. New-report snapshot publishing runs separately without creating a new GitHub Release.

The primary page-jump control now uses the reference design component and exposes a Go button with strict page-number validation. No synthetic reports or OpenCL capabilities were added. Producer admission remains OpenCLScope 3.0.9 (30009), and previously admitted archived reports remain read-only.

This is a staged improvement, not a claim of full pixel-level parity or successful remote deployment. Refer to the included comparison and QA documents.
