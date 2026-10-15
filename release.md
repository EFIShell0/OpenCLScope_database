# OpenCLScope Database 0.12.52

## Added
- Strict full-live producer support for OpenCLScope 1.0.14 / versionCode 10014.

## Changed
- All previously approved producer pairs stay accepted; no changes to report data, cached snapshots or UI presentation.

## 0.12.52
### Fixed
- Align live/published release validation with the Worker release identity; remove obsolete 0.12.7 deployment gates.
- Cache-bust updated frontend assets and correct visible version metadata.
- Restore reference-style horizontal navigation arrows, bounded 25-item default pagination and filter reset controls.
- Prevent a stale snapshot detail preload from being combined with a different published report index.
