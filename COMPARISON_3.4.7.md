# OpenCLScope Database 3.4.7 — VulkanScope 1.4.12 presentation audit

## Inputs and immutable rules

- Baseline: actual OpenCLScope Database 3.4.6 release ZIP; inspected its four sequential style files `vulkan-layout.v1412.css`, `site.v3406.css`, `parity.v3406.css`, `reference-shell.v3406.css` and VulkanScope Database 1.4.12 `site.v1412.css` and related UI code.
- `rules/PROJECT_RULES.md` requires direct parity for corresponding controls. Red in validation errors or destructive actions remains semantically necessary; red decorative chrome does not.
- Both immutable upstream reference CSS files, official `cl.xml`, historical records, D1 shape, upload controls, GitHub workflow and original producer allowlist were left unchanged.

## Verified causes and corrections

| Surface | Root cause before 3.4.7 | Correction |
|---|---|---|
| Shared horizontal table scrollbar | `reference-shell.v3406.css` later overwrote earlier gray/green parity with burgundy gradients | Correct the source of the final shared shell to neutral gray idle track/thumb and green hover, retaining reference geometry |
| Viewport scrollbar / arrows | Final shell used red gradients, red active hover text, burgundy arrow tracks even after earlier parity corrections | Replace those declarations with reference-width neutral surfaces, gray idle thumb and green active states |
| Browser-native scrollbars | Immutable Vulkan CSS declares red `*` scrollbar colors; previous overrides excluded scrollable descendants | Apply neutral scroll thumb/track to native scrollbars across document, Settings and filter menus |
| Global filter listboxes | Upstream themed listbox background/selected-item/border remained burgundy | Neutral popup, neutral hover, OpenCL green selected state and neutral native scrollbar |
| Header repository icon | Burgundy background and border inherited from upstream themed CSS | Neutral dark background and edge |
| Main page background | Green wash was only 0.052 alpha instead of the upstream 0.19 radial wash | Match upstream gradient position/fade and strength using OpenCL green instead of Vulkan red on the retained neutral AMOLED floor |
| Build cache | Multiple CSS/JS assets could be loaded from prior versions | Versioned active presentation/JS/bootstrap/release markers as `3407` and extended repository repair to delete superseded shell/bootstrap assets after ZIP overlay |

## Verification actually performed

- 175/175 frontend and Worker Node tests passed, including 3 new CSS/reference/release assertions.
- `tools/reconcile_repository.py --check` and `tools/verify_release.py` passed.
- Pages artifact generated and audited 308 public files without fabricating report data.
- Chromium at 1440x900 and 390x844 verified computed page background, native scrollbar colors, table track/thumb, viewport scrollbar track/thumb, a populated temporary Reports table and no unexpected JavaScript errors or horizontal page overflow.
- DOM computed-style scan after all four CSS assets found red only in destructive/confirmation controls; decoration in repo icon and listboxes no longer red.
- Neither live GitHub Pages nor Cloudflare Worker/D1 nor full site-wide pixel comparison to equivalently populated VulkanScope views was executed.

## Remaining differences

Reports field-specific columns, Compare DOM and semantic controls, Statistics/card arrangements, modal layout and wording, all Settings rows and animations, and responsive details beyond the tested samples remain incompletely audited against the upstream reference. They are NOT presented as fully equivalent. OpenCL-only nouns/data/provenance and explicit update consent remain intentional exceptions.
