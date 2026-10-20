# OpenCLScope Database 3.0.23 — design and behavior audit, stage 14

## Sources and methodology

- OpenCLScope Database 3.0.22 ZIP SHA-256: `2b961da8f3482665c051e96fb8e1b8f4ded7c2ab20b0db672af32fe2b013e9b7`.
- VulkanScope Database 1.4.12 ZIP SHA-256: `05050c880d89868e2dec0fd6c71b925591a3f9194be829ef9b1ad9f499e89c3c`.
- Directly extracted both full archives. Inspected the two index DOMs, both source app JS files, and parsed CSS rules/selector groups for the VulkanScope 1.4.12 original, OpenCLScope 3.0.22 overrides and 3.0.23 parity overlay.
- Counted 2,911 selector entries / 1,714 unique selectors in original Vulkan CSS; 1,098 entries / 662 unique selectors in OpenCL 3.0.22 overrides; only 128 exact selector strings overlap. The new local parity layer adds 158 entries / 144 unique selectors; counts include rules within media queries. These are selector inventories, NOT proof of computed/pixel matching.
- Detailed selector listing: `UI_SELECTOR_AUDIT_3.0.23.tsv`. CSS auditing counts simple comma-separated selector alternatives; not a CSS cascade-equivalence test.

## Verified differences addressed in 3.0.23

1. **Conflicting palette:** Vulkan original base theme uses `#09090a`, `#111113`, `#161619`, `#292a2f`. Prior OpenCL themes repeatedly replaced those with alternative black/brown/green surfaces. Final parity layer pins reference-neutral surfaces and OpenCL-specific `#3DAE2B` brand accents, retaining semantic red/amber/blue error and warning tokens.
2. **Red original Vulkan hero still showing:** Rebased hero gradient, glow, badges, workspace-card backgrounds and metric decoration to neutral/green while preserving the reference layout. Workspace attribute now tracks the selected tab and retains correct compare/encyclopedia decoration states.
3. **Filters squeezing page headings:** The existing heading was flex-aligned against a long list of filters, causing cramped layouts. The filter region now occupies its own responsive grid row with bounded controls, and `hidden` selectors always remain hidden.
4. **Navigation sizing:** Hardened nav viewport bounds, tab active/hover states, chevrons and overflow behavior in the reference geometry for desktop and narrow widths.
5. **Reports and evidence tables:** Bounded containers, neutral header/row surfaces and visible horizontal scrollbars without changing report data or table column order. This is a presentation patch; server-backed row grouping remains OpenCL-specific.
6. **Pagination:** Reference-style centered pager, neutral buttons and input focus/disabled states. `pager(total)` no longer defaults to a remote fetch control on non-Reports views; only `renderReports()` opts into remote paging. Source search, page-number bounds and local pagination remain unchanged.
7. **Settings drawer:** Force upstream left-side drawer geometry, backdrop, viewport bounds, category control styling, neutral panels, focus treatment and reduced-motion behavior. Existing JS focus trapping/return and local privacy preferences are retained.
8. **Report detail/Compare/Statistics:** Normalized controls, state-neutral surface backgrounds and evidence modal panels. CSS state colors still indicate distinct technical statuses.
9. **Versioned assets:** Added `assets/parity.v1023.css`, updated `assets/app.v1017.js`, project release 3.0.23, Worker version constant, local snapshot release IDs and CI verification expectations. Original pinned upstream CSS, XML and GPU vendor icon bytes left untouched.

## Contracts kept unchanged

- `registry/cl.xml` SHA-256: `c24f63ad9aa5776fe67808926ae85613248ebbeefa7373fceb406a0bd12ce016`.
- Pinned VulkanScope design reference `rules/UPSTREAM_REFERENCE_SITE_CSS.css` SHA-256: `bd5957461701439a7655c652b4e560cb84b7cc0163f202a257e019c2c468181b`.
- No D1 migration, query manifest, worker validation or new app submission-version eligibility changes. Exact new POST producer remains OpenCLScope 3.0.8/30008. Unknown, unavailable, false and zero report evidence are not reinterpreted.
- No fake GPU reports, device capability values, Vulkan-specific Surface/WSI/driver-mode fields, timestamps or URLs were added.

## Evidence

- Node frontend tests: 107/107 PASS (102 existing + 5 new checks).
- Worker tests: 19/19 PASS.
- Static JavaScript syntax, release verifier, test inventory reconciliation and Pages static artifact build: PASS.
- CSS selector inventory: parsed from full archives, with 144 selector names present in new layer.
- Browser screenshot/interactive pixel comparison, actual deployed Cloudflare API/D1/Pages, and Android app verification: NOT VERIFIED.

## Important remaining differences

- The frontend app code remains substantially separate (OpenCL app JS ~183 KB, Vulkan JS ~387 KB), and most Vulkan-only components/behaviors are not semantically applicable to OpenCL.
- Many shared structures still have different DOM names/implementations, and hundreds of unique local CSS selectors are not visually/performance audited in a running browser. Exact screen-by-screen pixel matching and every gesture/drawer/modal interaction remain unproven.
- Any live appearance difference found on real deployment must be diagnosed from actual browser geometry and computed styles rather than asserted resolved from source-only tests.
