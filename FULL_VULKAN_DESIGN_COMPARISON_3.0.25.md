# OpenCLScope™ Database 3.0.25 / VulkanScope™ Database 1.4.12

## Exact sources
- OpenCLScope 3.0.24 complete source ZIP (447 members), updated to 3.0.25.
- VulkanScope 1.4.12 source ZIP (840 members), including exact `assets/app.v1412.js` and `assets/site.v1412.css`.
- Immutable upstream reference stylesheet remains `assets/vulkan-layout.v1412.css`, equal byte-for-byte with upstream `assets/site.v1412.css`.
- `rules/PROJECT_RULES.md` is authoritative for report schema, immutability, producer admission and OpenCL semantics.

## Reports reference comparison and changes
| Component | VulkanScope 1.4.12 | OpenCLScope 3.0.24 | OpenCLScope 3.0.25 |
|---|---|---|---|
| Report sorting | Version-aware driver/API/app, date, device, vendor and OS | Only submission date and device | Adds 14 OpenCL-specific sort options including API, driver, producer, platform and vendor, using numeric-aware versions and deterministic tie-breakers |
| Filter toolbar | Always displays, even with zero reports | Disappears on an empty result set | Toolbar and 0 reports status remain visible; normal empty-state message remains |
| Filter synchronization | Sort UI and report list use one state | Two selects with three choices | Both selects expose same options and share `state.sort` |
| Disclosure headers | Three-line icon, state reflected in aria-expanded | Generic properties glyph | Reference three-line icon, existing accessible state toggle preserved |
| Horizontal scroll track | Recomputed during/after column expansions | Immediate one-frame recompute only | Adds transitionend/380ms completion recompute to prevent thumb drift |
| Scrollbar palette | Vulkan brand red | Neutral gray/green already fixed in 3.0.24 | Keeps previous neutral gray/green without recoloring technical error badges |
| Rows/page | Vulkan 10/25/50 | OpenCL rulebook 25/50/100 | 25/50/100 preserved to comply with OpenCL's explicit release contract |

## Safety and remaining gaps
- Sorting never changes report IDs, timestamps, canonical values, or Worker/D1 schema.
- `false`, `0`, `unknown`, `not_applicable`, `unavailable` and `error` retain their source meaning; records are never guessed into a different support state.
- Full visual and functional parity of all 11 pages has NOT been achieved. Vulkan and OpenCL have distinct query schemas. Live D1/Cloudflare Pages integration, populated real-report screenshot diffs, animations and remaining secondary components require further work.
