# OpenCLScope™ Database 3.0.28

## Statistics renderer parity

- Replaced the custom Statistics donut renderer with VulkanScope's chart component architecture and accessibility roles, retaining the exact OpenCL evidence/counting rules.
- Reused upstream ring, center number and legend layouts with scoped green/neutral styling.
- Aligned unique-dominant percentage label emphasis with the reference's semantic-state hierarchy.
- Fixed Extensions Reset so it only changes Extensions filter settings and not Statistics settings.
- Retained original OpenCL™ query statuses, immutable Khronos® registry, existing D1/Worker report acceptance, cache and snapshot contracts.

## Verification and limitations

125 frontend and 19 Worker tests passed; local Chromium DOM checks at desktop/mobile dimensions passed. Live Cloudflare deployment and complete VulkanScope pixel/behavior parity are not verified. See the comparison and QA files for details.
