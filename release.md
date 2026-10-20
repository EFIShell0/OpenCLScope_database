# OpenCLScope™ Database 3.0.22

## VulkanScope™ Database 1.4.12 comparison — Stage 13

### Reports / Compare

- Canonical Compare no longer discards repeated same-name property, device or image-format evidence. Duplicate records are compared as order-independent sorted multisets, preserving repeated numeric channel-format pairs.
- Exact recorded OpenCL™ state, query return code, and literal value structure remain separately distinguishable, including `false`, `0`, unknown, unavailable, error, and not_applicable.
- Added, Removed, Changed and Unchanged filters, clickable counts and baseline/target source-report shortcuts have been added to existing comparison controls. Export JSON/TXT continues to include all filtered matches across pages.
- Report ingestion, cache-first synchronization, immutable XML/CSS/vendor assets, producer admission (only OpenCLScope 3.0.8/30008 for new POST) and historical reads are unchanged.

Local QA and the incomplete upstream parity matrix are documented in `QA_RESULTS.md` and `FULL_VULKAN_DESIGN_COMPARISON_3.0.22.md`. No live Cloudflare or exact visual parity claim is made.
