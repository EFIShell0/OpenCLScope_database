# OpenCLScope Database 3.0.22 — VulkanScope Database 1.4.12 comparison, stage 13

## Audited sources

- OpenCLScope Database 3.0.21 archive: SHA-256 `8f2ede3af74afe6f4ef61ba8d6b1a4468f6e37a5575491e8b8fdc122e0b487ac`.
- VulkanScope Database 1.4.12 archive: SHA-256 `05050c880d89868e2dec0fd6c71b925591a3f9194be829ef9b1ad9f499e89c3c`.
- Directly inspected the VulkanScope `assets/app.v1412.js` report/compare workspaces, the OpenCLScope `assets/app.v1015.js` Compare and Reports implementation, and the pinned CSS and project rules in both archives.
- The Vulkan database's full WSI, surface, driver, Vulkan extension and bitmask semantics are not imported into OpenCL technical evidence.

## Differences found and corrected — Reports/Compare

1. **Repeated evidence overwrite:** Old `semanticComparisonLeaves()` used `Map.set()` on canonical paths and overwrote repeated same-name OpenCL properties, multiple same-name platforms/devices and repeated image-format pairs, hiding real differences. New `comparisonStableValue()`/`semanticComparisonLeaves()` retains every occurrence as a deterministic sorted multiset per semantic path, keeping duplicate counts and remaining independent of enumeration order.
2. **Value and state precision:** Old string interpolation could collapse structured `value` to `[object Object]` and could confuse literal value types when equal-looking text was used. The new serializer has deterministic object key order and retains the literal type, query state and return code. `false`, `0`, `null`, missing, `unknown`, `unavailable`, `not_applicable` and `error` remain distinguishable.
3. **Format identity:** Each image type/access group keeps exact reported state/code and the precise reported channel order/type *and numeric order/type values*. Repeated format pairs cannot disappear just because they share a key.
4. **User-facing difference navigation:** The Compare workspace now offers an Added/Removed/Changed/Unchanged select, clickable counts, focusable/pressed-state styling and correct interaction with Differences only. This supplements existing section and sort controls rather than changing backend data.
5. **Proof and navigation:** Long press, context menu and the visible `⋯` actions now provide explicit Open baseline report/Open target report choices bound to the two real SHA-256 report IDs. JSON/TXT export includes the change filter and still uses all matching rows across pages. A missing leaf is described as unreported, not unsupported hardware.

## Preserved contracts

- Only exact OpenCLScope 3.0.8/30008 can make a new POST; historical validated GET/archives remain readable. The Worker validator, query manifest, D1 migrations, report/schema rules and snapshot-before-sync publication semantics were not changed.
- `registry/cl.xml` SHA-256 remains `c24f63ad9aa5776fe67808926ae85613248ebbeefa7373fceb406a0bd12ce016`.
- VulkanScope 1.4.12 design reference stylesheet remains byte-identical at SHA-256 `bd5957461701439a7655c652b4e560cb84b7cc0163f202a257e019c2c468181b`.
- Presentation changes reside in versioned `assets/app.v1016.js` and `assets/site.v1015.css`. Worker version, static marker, workflow, index/snapshot, and tests are synchronized to 3.0.22.

## Evidence and remaining gaps

- Node frontend tests: 102/102 PASS, including 4 tests added in `tests/release-1016-compare-duplicates.test.mjs`.
- Worker tests: 19/19 PASS; release verifier, test inventory and Pages artifact build PASS.
- Isolated Chromium HTML fixture (1440×900 and 390×844): filters, four clickable counts, exact evidence, baseline/target context menu, Escape closure and zero page exceptions passed. The fixture was injected only for testing; no fixture rows were added to published `data/`.
- Browser navigation to `http://127.0.0.1` was **blocked by administrator policy**; fixture rendering is not a served-origin or live API test.
- **Not complete:** exact VulkanScope style/animation/pixel parity; all Reports/Settings gestures and options; real Cloudflare Worker/D1/Pages/Android testing; live device evidence. Those require further comparison with deployed pages and real archived reports. No claim of full parity is made.
