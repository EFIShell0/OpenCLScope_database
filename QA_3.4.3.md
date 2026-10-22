# OpenCLScope Database 3.4.3 — QA

- Baseline source: 3.4.2 archive; VulkanScope Database 1.4.12 immutable reference.
- Release update: removed frontend duplicate 60-second poll + blocking Refresh modal; single 30-second release bootstrap owner and deduplicated version notices.
- Consent: Settings -> Preferences has persisted auto-update opt-in, reversible without clearing favorites; no forced reload for browsers without consent.
- Active assets: `app.v3403.js`, `site.v3403.css`, `parity.v3403.css`, `release-bootstrap.v3403.js`.
- Browser: Chromium isolated document (no actual HTTP), viewport 1440x900 and 390x844; Preferences toggle, local storage control, two repeated update notifications (one notice), dismiss and absence of blocking modal, no JavaScript page errors, no page-width overflow.
- Run `node tools/run_tests.mjs` and `python -B tools/verify_release.py` on the clean extracted ZIP; browser results are not evidence of real production deploy.
- Worker admission, D1, actual report content and upstream reference hash were not changed.
