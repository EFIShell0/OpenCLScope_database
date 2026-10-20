# OpenCLScope Database 3.0.12 ↔ VulkanScope Database 1.4.12

## Reference and rules

- Compared the supplied `VulkanScope-Database-1.4.12.zip` against `OpenCLScope-Database-3.0.11.zip` and implemented stage-four changes on the OpenCLScope source tree.
- Project authority: `rules/PROJECT_RULES.md`, including the appended Database 3.0.12 constraints. Pinned `assets/upstream-reference.css`, `assets/vulkan-layout.v1412.css`, `rules/UPSTREAM_REFERENCE_SITE_CSS.css`, Khronos registry, GPU vendor art and OpenCL report query manifest were not modified.
- This is **Database-only**. New submissions still require complete **OpenCLScope 3.0.8 / 30008**, schema 1, 16 platform queries and 211 device queries. Historical complete reports remain eligible for reading under their source-specific contracts.

## Stage 4: Differences actually fixed

| Area | VulkanScope 1.4.12 reference | Previous OpenCLScope 3.0.11 | New OpenCLScope 3.0.12 |
|---|---|---|---|
| Settings > Information | Clearly separated heading, independence notice, release summary, dependency inventory | Short static About text | Reference-style hierarchy with independent OpenCL branding and nine source-declared dependency/service cards |
| Dependency declaration | Pinned direct tools, explicitly distinguished transitive tools and services | No inventory | Verified Wrangler 4.130.0 direct devDependency, sharp 0.35.4 override; esbuild/workerd listed without invented transitive versions; Node/Python/browser/D1 noted accurately |
| Local licenses | On-demand, bounded local Markdown viewer | Missing viewer and local license material | Bundled reference license notices for six matching tooling/components; allowlisted filenames, 512 KiB read cap, escaped text, close control, Escape and focus restoration |
| Pages publishing | Explicit allowlist of public frontend resources | Missing license files in Pages build | `licenses/` now explicitly allowlisted in Pages builder; Pages workflow observes license changes; negative build test updated |
| Internet > Browser information | Local runtime identity/capability rows with no report upload | Six summary browser properties | Browser-derived browser/OS/language/time-zone/viewport/runtime support values; 23 source-verified rows in Chromium test |
| Settings navigation | Category state, subtle transition and keyboard behavior | Reopened at Favorites, Escape/Tab interaction incomplete | Keeps last selected category, subtle 170 ms transition (unless reduced motion), focus trap, Escape dismissal and focus return |
| Static information | Exact OpenCL independence and trademark notice | Simple About labels | Independent notice plus real OpenCL trademark/registered status; no false affiliation claim |

## Remaining reference differences; not claimed as fixed

- Compare sticky header, supplementary sorting/exports, multi-report actions and some specialized charting do not yet match VulkanScope 1.4.12 exactly.
- Import/export flows, long-press actions, release-update dialogs, scroll thumb animations and exact layout/card geometry across the whole site remain different. In particular, Vulkan-only WSI/HDR/queues/surface semantics cannot be copied as OpenCL runtime observations.
- Full production Cloudflare Worker/D1, Pages URL, GitHub Action and real report validation have **not** been live-tested in this environment. Browser UI checks use an isolated in-memory document and a local response fixture; they do not assert pixel-perfect source parity.

## Evidence

- 65/65 Node.js site tests, including four Information regression tests; 19/19 Cloudflare Worker contract tests.
- `tools/verify_release.py` and `tools/reconcile_repository.py --check` pass; `tools/build_pages_artifact.mjs` includes six Markdown license files in the static allowlist.
- Chromium in-memory UI tests (1440 × 900 and 390 × 844): nine cards, license viewer open/read/Escape/return focus, rejection of unallowlisted file traversal, preserved category on reopening, 23 browser rows, zero JavaScript page errors and no horizontal viewport overflow.
