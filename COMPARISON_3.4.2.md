# OpenCLScope Database 3.4.2 — VulkanScope 1.4.12 comparison

## Actual input archives

- OpenCLScope Database 3.4.1 ZIP (most recent Library version at start of this task)
- VulkanScope Database 1.4.12 ZIP (immutable reference)
- Rules: `rules/PROJECT_RULES.md`, `rules/UPSTREAM_REFERENCE_RULES.md`, staged GitHub workflow, pinned registry and CSS
- Official OpenCL `cl.xml` SHA-256: `c24f63ad9aa5776fe67808926ae85613248ebbeefa7373fceb406a0bd12ce016`
- Immutable VulkanScope layout CSS SHA-256: `bd5957461701439a7655c652b4e560cb84b7cc0163f202a257e019c2c468181b`

## Confirmed differences and source corrections

1. **Statistics > Extension frequency**: 3.4.1 discarded every matched extension after the first 100 rows using `entries.slice(0,100)`. This silently concealed additional matching evidence. 3.4.2 enumerates every match across bounded 25/50/100-row pages; adds Previous, Next, editable page number and Go via existing reference-compatible `bindPageJump`; keeps actual counts and denominators from loaded report evidence. It no longer shows the unrelated global empty-row pager on Statistics.
2. **Statistics filter transitions**: when Extension scope, namespace, minimum frequency, search or reset changes, the frequency table now returns to page 1; shrinking result sets also clamp the selected page. The per-page limit change resets to page 1. Filters do not alter canonical report values.
3. **Vertical custom scrollbar**: a non-scrollable/invisible rail cannot leave its thumb in the keyboard tab sequence, and its ARIA disabled state is synchronized.
4. **Table scrollbar**: no-overflow rails cannot retain a focusable horizontal scrollbar control; scrolling from arrow buttons honors reduced-motion preferences.
5. **Responsive visual control**: the local Statistics pager has the same page-jump family as VulkanScope with a small-screen responsive arrangement. No changes were made to the upstream CSS file, reference icon bytes, release pipeline or report validation.

## Areas NOT verified as identical

- All 11 workspace screens, including Reports, Compare, Settings and other Statistics views, are **not** proven pixel-perfect relative to the VulkanScope implementation. Their schemas and functions differ, and this release does not claim that every CSS declaration or animation is identical.
- Browser QA used only isolated synthetic presentation objects built from the 156 official catalog names, not real device reports. The official catalog is not evidence of device support. Browser checks: 1440x900 and 390x844 with 25 rows, Next, page 7 Go, switching to 50 rows and checking overflow.
- The locally built Pages artifact was tested, but real Cloudflare D1/Worker, GitHub Actions/Release and live GitHub Pages deployment were NOT executed.
- Remaining priorities: populate canonical real report fixtures and compare Reports/Settings/Compare visual and behavioral parity (including transitions, disclosure, long press, mobile layout), test live update and deployment gates against the user's own environment, and audit remaining CSS cascade differences.

## Invariants

- No new producer gate. OpenCLScope 3.4.0/30400 is still the exact newly accepted producer; historical accepted producers remain historical only.
- No D1 migration, API admission/normalization or registry update; no fabricated devices or inferred OpenCL support.
- VulkanScope reference CSS is byte-identical to the 1.4.12 original.
