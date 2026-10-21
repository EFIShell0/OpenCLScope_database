# OpenCLScope Database 3.0.30 — VulkanScope Database 1.4.12 source comparison

## Sources and nonnegotiable provenance

- OpenCLScope Database input: Library archive 3.0.29 (454 source entries), not the older 3.0.28 previously discussed.
- VulkanScope Database input: Library archive 1.4.12 (840 source entries).
- Khronos OpenCL `registry/cl.xml` SHA-256: `c24f63ad9aa5776fe67808926ae85613248ebbeefa7373fceb406a0bd12ce016` (unchanged).
- Upstream VulkanScope `assets/site.v1412.css` and OpenCLScope pinned `assets/vulkan-layout.v1412.css`: identical SHA-256 `bd5957461701439a7655c652b4e560cb84b7cc0163f202a257e019c2c468181b` (unchanged).
- OpenCLScope own fixed reference CSS `assets/upstream-reference.css`: `da397562ad59c789556002c2af985b816d98cb2a9577f1c346f1511577a0503e` (unchanged).
- A newer OpenCLScope **app producer version is not inferred** from a new Database version. The exact current POST producer is OpenCLScope **3.0.9 / 30009**; historical stored reports use the historical strict validator.

## Stage: GitHub push / release / deploy (structural source audit)

| Contract | VulkanScope 1.4.12 | OpenCLScope 3.0.29 | OpenCLScope 3.0.30 |
| --- | --- | --- | --- |
| `main` release trigger | All main pushes | Paths-limited push | All main pushes; documentation/license changes included |
| Windows QA | Separate Windows job | No separate Windows job | Separate `windows-tooling` job with immutable checks + suites |
| Linux Build | Source validation + artifact audit | No separate job | `build` depends on Windows and validates deterministic package |
| GitHub Release | Versioned tag + ZIP/SHA-256 before Pages | Absent | `release` depends on Build; tagged `v3.0.30` ZIP/SHA-256 |
| Tag ownership | Must equal validated commit | Absent | Existing tag at different commit rejects publication |
| Pages deploy | After successful Release | In one combined job | `deploy` requires both `build` and `release` |
| Snapshot-only refresh | Independent job | Shared one-job path | Independent `snapshot-refresh` job, required 64-hex canonical ID |
| Snapshot verification | Preload + published index | Present inside one job | Present in both protected deploy flows |
| Worker publication | Separate pinned-account CLI workflow | `npm run deploy` manual | Still separate; **no copied Vulkan account ID** |
| Allowlist | Public files only | Public files only | Public files only **plus explicit artifact audit** |

New production build tools: `tools/run_tests.mjs`, `tools/package_release.py`, `tools/audit_pages_artifact.mjs`. A `.gitignore` now excludes local tool state, Node packages, generated output and secrets. `DEPLOY_COMMANDS_POWERSHELL.txt` now places a checked Git commit/push before the GitHub release automation; Cloudflare Worker deploy is a separate user-authorized action.

The new workflow requires GitHub repository variable `OPENCLSCOPE_DATABASE_API` to contain a real deployed fixed HTTPS Worker endpoint, with GitHub Pages configured to deploy through Actions. The environment's real Cloudflare account ID must be confirmed before *manual* Worker deployment; it was not fabricated or copied from VulkanScope. Local source validation does not prove these remote prerequisites are currently configured.

## Stage: UI source and behavior comparison

| Area | Prior difference | 3.0.30 change | Remaining evidence limit |
| --- | --- | --- | --- |
| Primary dataset pagination | OpenCL used its own `page-field-wrap` and lacked an upstream-style explicit Go action | Uses the upstream `page-jump`, `page-jump-input`, `page-jump-of` and `page-jump-go` class family; strict 1..max parser; Enter/Go and arrows retained | Populated-site pixel equivalence not verified |
| Pager accent and mobile sizing | Upstream default red focus accent inherited in pager | Scoped OpenCL green focus, compact mobile sizing | Other screen-specific pagers from earlier releases require populated-page comparison |
| Footer producer hint | Source page still said 3.0.8 only | Now correctly states 3.0.9 only, consistent with current Worker contract | Publication after GitHub release untested |
| Statistics donut/progress bar | Earlier stage 3.0.28 reuses Vulkan classes, custom OpenCL palette | Preserved; denominators and semantic state meanings unchanged | Real report-filled rendering still not pixel verified |
| Filter list and horizontal rails | Earlier stage 3.0.27 transplanted upstream listbox/table scroller | Preserved; no additional rewrite to canonical filters | Remaining page-specific spacing, menu effects and animation differences not proven resolved |
| Reports grid and row actions | Earlier stages added disclosure columns, report source actions | Preserved without altering canonical report values | Column sizing, typography, context menus and full rendering still require joint screenshot audit |
| Settings, detail panels, Compare, Encyclopedia | Mostly OpenCL-specific implementation with pinned Vulkan CSS under overlays | No false claim of direct code equivalence | Still needs page-by-page comparison on real records |

## Verification boundaries

Local tests: 149/149 (frontend + Worker) passed. `verify_release.py`, `reconcile_repository.py --check`, Node syntax, Pages allowlist build+audit, deterministic ZIP/SHA-256 round trip and YAML job topology checks passed. An in-memory Chromium DOM+CSS check at 1440×900 and 390×844 found 11 navigation buttons, the new Go/page-jump structure, no JavaScript page errors and no outer-page horizontal overflow. External URL navigation was blocked in the sandbox, so **live site, real assets, GitHub Actions, Cloudflare Worker/D1, populated compare, and actual 1:1 screenshot equivalence were not verified**.

The source record and OpenCL runtime states are unchanged. This stage does **not** claim that every OpenCLScope page is identical to VulkanScope or that all visual defects have been removed.
