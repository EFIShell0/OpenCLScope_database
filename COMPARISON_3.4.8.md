# OpenCLScope Database 3.4.8 — Report detail source comparison

## Reference / scope
- OpenCLScope source: 3.4.7 full release, 481 files in the previously validated ZIP.
- VulkanScope reference: Database 1.4.12 original `assets/app.v1412.js`, `assets/site.v1412.css`, original report-detail `renderDetail`, `renderDetailTab`, and `detailWorkspace` source.
- Reference's immutable CSS and upstream rulebook remain byte-identical. No Vulkan properties or runtime results were transplanted.

## Verified differences and changes
| Report UI | Previous OpenCL 3.4.7 | VulkanScope 1.4.12 reference | OpenCL 3.4.8 |
|---|---|---|---|
| Report hero | One freeform banner, extra descriptive lines | `detail-hero-v126` with header + identity-grid + action row | Matching structural classes, own OpenCL device/version values and schema badge |
| Immutable report ID | Plain text ID in header | Dedicated wide ID card + copy control | Full-width ID card, live copy button, safe text |
| Report metadata | Plain paragraphs | Submitted/Driver/Device API/evidence summary cards | OpenCL factual metadata cards; no inferred Vulkan facts |
| Detail tabs | Static labels with extra standalone Diagnostics and Raw JSON | Clean scrolling `tab-button` tablist with counts | Live evidence counts, no Diagnostics tab; Raw report label |
| Section contents | Custom expanding accordions | `detail-section-intro`, `detail-evidence-stack`, `detail-evidence-panel` | Adopted upstream classes and layout |
| Raw report | Independent unstyled preformatted block | Bounded raw-report panel | Raw report panel with bounded scroll and original canonical JSON |
| OpenCL exports | TXT, HTML, JSON (required by OpenCL rules) | JSON | All three retained, grouped in hero action row as justified native OpenCL exception |
| No evidence | May show generic content | Explicit empty panel | No data fabricated; native empty-state retained |
| Missing/false/zero | Existing OpenCL query values must remain | Raw values are authoritative | Values rendered separately from status badges, including false and 0 |
| Deployment | Existing release verification | Asset readiness check before deploy | Newly versioned report CSS added to bootstrap, Pages build, live publish verification |

## Explicit OpenCL-only exceptions
- OpenCL platform/device/properties/formats are real `technicalReport` fields; Vulkan Queue/Surface/WSI/Display/HDR headings are not copied.
- Platform and device panes remain because OpenCL legitimately enumerates both kinds of entities. Profiles are informational, not claims of certification.
- TXT and HTML exports remain because existing OpenCL rules require them.
- Brand accents are OpenCL green; error and destructive states remain semantically distinct.

## Still unverified or different
- Fully populated *live* side-by-side pixel-level comparison across all report tabs, keyboard focus order and animations. The browser test used only a bundled offline mock as transient input.
- Complete VulkanScope table-disclosure/scroll animation transplantation, every Reports table column, Settings/Compare/Statistics screen parity.
- Real GitHub Actions/Cloudflare Worker/Pages end-to-end publication and live report content. No deployment was performed in this environment.
