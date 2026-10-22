# OpenCLScope Database 3.4.3 — VulkanScope source comparison

## Input and immutable rules
- Previous OpenCLScope Database: 3.4.2 ZIP (465 files).
- Reference: VulkanScope Database 1.4.12 ZIP (840 files).
- Rules: `rules/PROJECT_RULES.md`, immutable VulkanScope CSS `assets/vulkan-layout.v1412.css`, and official `registry/cl.xml`.

## Verified differences and implemented fixes
1. OpenCLScope 3.4.2 had two independent deployment checks: a 30-second `release-bootstrap.v3402.js` poll and a second, 60-second `checkPublishedRelease()` poll in `app.v1030.js`. These were redundant and could repeatedly raise the same blocking Refresh dialog. 3.4.3 has one readiness owner (bootstrap) and announces each version only once.
2. Upstream VulkanScope's bootstrap automatically navigates to fully verified newer releases. The OpenCLScope rules specifically require **prior user consent** for a full-page reload. 3.4.3 respects that rule: the Preferences panel offers an explicit persistent automatic-update switch. Once enabled, new ready versions automatically navigate to their published app while preserving the hash. Without consent, a small dismissible nonmodal notification replaces the page-locking Refresh dialog.
3. Source assets were previously named `app.v1030.js`, `site.v1028.css`, `parity.v1028.css` and `release-bootstrap.v3402.js`; 3.4.3 uses fresh `v3403` names for the changed JS/CSS to avoid stale browser/CDN caches, plus `?v=3403` query strings.
4. The stale modal CSS was removed. The nonmodal notification uses a compact dark/green control matching the OpenCL branding and avoids stealing focus. Settings uses the established switch component.
5. Updated release marker, Worker release version, GitHub Actions release tag, snapshot scripts, Pages bundling and tests together. The Windows -> Build -> GitHub Release -> Pages gate is retained; report-triggered snapshot refresh stays separate.

## Explicit remaining differences
- The full Reports, Compare, Statistics, Features, Settings, extensions and format UI implementation is not yet pixel/behavior identical to VulkanScope. No such assertion can be supported without screen-by-screen real report fixtures and comparable screenshots.
- VulkanScope-specific capability labels and query behavior are not ported into OpenCL, which uses separate report semantics.
- Deployment propagation timings, actual Cloudflare Worker/D1, GitHub Actions, and GitHub Pages automatic-reload effects have not been verified live.

## Preservation
- No changes to OpenCL report validator, schema 1, production POST producer 3.4.0/30400, D1 migration, report records, official OpenCL registry, vendor image bytes, or pinned VulkanScope source CSS.
