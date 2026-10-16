# OpenCLScope Database 1.0.1 — Source and browser QA (2026-10-16)

## Immutable comparison references
- VulkanScope Database **1.4.12**, full official source ZIP provided by the user, loaded from the file library. Exact `assets/site.v1412.css` is byte-identical to `assets/vulkan-layout.v1412.css` (SHA-256 `bd5957461701439a7655c652b4e560cb84b7cc0163f202a257e019c2c468181b`).
- Predecessor OpenCLScope Database **1.0.0**, extracted before modifications.
- OpenCLScope Android **1.0.19** source ZIP, official master app artwork `app/src/main/res/drawable-nodpi/openclscope_logo_master.png`. It is **copied byte-for-byte** to `assets/openclscope_title_master_black.png` (SHA-256 `b2524dac02e18d042279d4efd170643e61e9a634e0f3c92462a939d5cd16b348`); used as header, favicon, apple touch and loading art. No generated substitute.

## Actual root causes and changes
1. DOM icon bug: local `node('svg')`/`node('path')` created HTML-namespaced elements. Elements existed but browser did not paint shapes. Correct SVG XML namespace and class attributes now apply to every dynamically created SVG; all eleven nav icons are visible.
2. Horizontal table scrollers were missing. Imported the **exact 4,273-character source block** for table-scroll control logic from the VulkanScope 1.4.12 JavaScript file. It supplies left/right buttons, overflowing edge fades, track/thumb geometry, pointer drag, keyboard Home/End and arrow access, and ResizeObserver-independent MutationObserver registration. Reports and OpenCL evidence tables now use `.table-wrap` and these controls.
3. Vertical viewport scrollbar had no drag or keyboard support. It now measures real scrolling element, tracks the scroll position, has pointer capture, keyboard navigation and end-state semantics.
4. Applied the reference's matched dark neutral control/table geometry, OpenCL-only accent, shared SVG icon paths, pill status colors and reduced-motion handling. OpenCL technical screens render expandable evidence rows in reference-shaped tables instead of card-only layouts.
5. Changed only the Database release identity to **1.0.1**. Canonical OpenCL schema, registry, D1 layout, POST privacy validation and 1.0.19/10019 sole eligible new producer remain strict. Previously stored reports remain GET/snapshot readable.

## Executed
- `python -B tools/reconcile_repository.py --check` — PASS (nine active site tests; old browser cache artifacts rejected).
- `node --test tests/*.test.mjs worker/tests/*.test.mjs` — **50/50 PASS**, including 1.0.1 negative source checks.
- `python -B tools/verify_release.py` — PASS.
- `node tools/build_pages_artifact.mjs` — PASS.
- Chromium headless fixture with **one synthetic sample (not shipped)**: widths **1440px, 390px, 320px**; zero JS errors, no page-level horizontal overflow; 11 SVG icons have real SVG namespace; Reports table one row; technical Features table 25 rows, expandable values work. Mobile table scrollbar shows and Scroll Right moves `scrollLeft` 0→238 at 390px and 0→188 at 320px.
- All visible data in fixture sourced from explicit local fixture values; no GPU support, report counts or network statuses were invented in shipped application.

## Not claimed
- Vulkan-only workspaces are intentionally not introduced into the OpenCL database.
- Pixel-for-pixel identical rendering on all devices/viewports, feature completeness of Vulkan's 18 workspace implementation, and live production Cloudflare Worker/D1/Pages were **not validated**. The desktop browser test is a local fixture, not a claim about production report content.
