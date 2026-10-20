# OpenCLScope™ Database 3.0.14

## Fifth VulkanScope Database 1.4.12 portable interface parity stage

- **Compare header:** The report selectors and evidence filters use a responsive, keyboard-accessible pinned header that correctly adjusts to scrolling, viewport geometry and VulkanScope-style minimize/expand behavior. The pin geometry was tested in Chromium on mobile and desktop rather than assumed from CSS.
- **Compare linking:** Two validated 64-character report IDs are represented in an explicit `#compare/<baseline>/<target>` URL. Missing report details are loaded only on user request and never silently reported as unsupported.
- **Compare exports:** The full filtered semantic comparison (across all pages, not just the visible page) can be downloaded in JSON or TXT. Export fields record side presence and preserve raw status/code-bearing property values. Full original source reports are still available via the existing JSON report download.
- **Local favorites:** Export/import an explicit local-only backup of report IDs. Strict schema, 64 KiB file cap, 300-item cap, SHA-256 report ID shape, deterministic duplicate removal, no automatic upload, no overwrite on invalid input. Persistence stays opt-in.
- **Report quick actions:** Explicit more-actions button, mouse context click and touch long press; view, favorite, copy report ID, and set Compare baseline/target. Touch move cancels the pending long press. Menu closes with Escape or outside click and permits arrow key navigation.
- **Site delivery:** Database and versioned frontend become **3.0.14 / app.v1008.js / site.v1008.css**; Pages build and release checks updated. The pinned VulkanScope layout, Khronos cl.xml, GPU art and the OpenCL Android producer rules remain unchanged.

**Producer / Worker:** New POSTs still require exactly OpenCLScope **3.0.8 / 30008**, complete schema 1 with 16 platform and 211 device query observations. Existing complete historical reports remain readable. This is a Database-only release; no Android update is required.

**Verified:** 72 site and 19 Worker tests; responsive Chromium 1440×900 and 390×844 tests for Compare fixed geometry, minimize/expand, JSON download, quick menu, favorites JSON import/export and invalid-schema rejection, without JavaScript page errors or horizontal overflow. Production Cloudflare deployment and pixel-level entire-site VulkanScope parity were not tested.


### 3.0.14: Compare sorting and evidence quick actions
- Six deterministic comparison sort modes on canonical, fully loaded OpenCL report evidence.
- Explicit evidence copy actions with desktop context menu and touch long press.
- Mobile status tag and pinned selector safeguards; no report payload changes.
- 76 site tests and 19 Worker tests passed; physical/cloud deployment not executed.
