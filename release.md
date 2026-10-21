# OpenCLScope™ Database 3.0.26

## Improved filter, table, scroll and statistics parity

- Filters use a separate, responsive control row rather than crowding workspace headings. Native values are still authoritative behind accessible listboxes.
- Reports keeps its actual 12-column header, sorting/page limits and a visible horizontal slider even when the selected report set is empty. Empty rows are explicitly labeled, not synthesized as GPU data.
- Slider arrows now reflect real scrollability and announce the real horizontal position. The viewport rail matches the upstream desktop/mobile size family, using neutral grey with OpenCL green interaction styling.
- Statistics bars now represent the fraction of **all loaded queried property rows**. Error/Unavailable/Unknown/Not Applicable categories remain distinct. Statistics Reset no longer changes Extensions settings.

No mutation to canonical reports, worker submission floor, registry, report hashes or D1 schema. The immutable VulkanScope™ 1.4.12 reference is retained. OpenCL™ and the OpenCL logo are trademarks of The Khronos Group Inc.; this independent project is not endorsed by Khronos.

**Local checks:** 119/119 UI, 19/19 Worker, release verifier, Pages artifact and empty-snapshot Chromium layout smoke. Live deployment and exact all-screen visual parity have **not** been confirmed.
