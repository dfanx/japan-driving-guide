# Japan Driving Guide — Static Release 2026-08-11

## Delivery

- Archive: `japan-driving-guide-static-2026-08-11.zip`
- Size: 3,315,580 bytes
- SHA-256: `5B2C79CBB1495DC00F896E183BBE4058EB8B3C4F850CF250C15589EC3AC12DF4`
- Format: static Astro output; no backend, login, runtime API, or database

## What changed

- Every one of the 16 modules in both locales now contains at least one relevant
  visual in the lesson flow.
- D001-D024 are approved deterministic SVG lesson diagrams and are included in
  the offline package.
- Every D001-D024 example now starts with one disclosed 1200×800 driver's-seat
  simulation and then shows its deterministic explanation and exact official
  control where applicable.
- Generated candidates with invented traffic controls, wrong conflict geometry,
  misleading traffic flow, overlays, or fuel cues were rejected and corrected.
- Actual NPA/MLIT sign and signal assets appear beside the examples where visual
  recognition matters. Their existing provenance and checksum gates remain in
  force.
- The ETC example remains an official outbound-link fallback because the source
  terms do not authorize copying the image into this site.
- Three text-free contextual illustrations were added for eligibility/document
  preparation, adverse weather, and deciding not to drive. They are labelled as
  non-official context and do not depict regulated signs or signals.
- The PWA precache now covers 108 URLs, including all 24 driver-view simulations.
- Fast Track now covers ten recurring tourist mistakes and links each one to the
  relevant lesson.
- The parking lesson compares the exact official red-X `no stopping or parking`
  sign with the one-slash `no parking` sign, explains the immediate-move rule,
  and links the official five/ten-metre clear-zone diagram.
- Phone distraction, all-seat belts, under-six child restraints, and alcohol-
  assistance/riding conduct are explicit source-traced Rules.
- All zh-TW lesson and entry copy was tightened into concise Taiwan-facing
  mistake/action wording.
- Corrected D006: car A's right turn now follows a continuous curve into the
  eastbound left-side lane instead of pointing into the opposing westbound lane;
  car B's straight conflict path now remains visible through the intersection.

## Verification

- `npm run verify:release`: PASS
- Lint/typecheck: PASS, zero diagnostics
- Unit: 21 files / 144 tests
- Content: 25 Sources / 36 Rules / 32 lesson documents / 24 Questions / 24 Scenes
- Diagram gate: 24 candidates / 24 approved
- Static output: 41 route entry pages
- Chromium: 45 root passes plus the separate GitHub project-base case
- Archive integrity: 110 entries, including 41 route entries, 24 diagrams, 24
  driver-view simulations, 3 contextual WebPs, `sw.js`,
  `manifest.webmanifest`, `offline.html`, and the 24-Question offline bank
- Local HTTP delivery: the final root build is served from
  `http://127.0.0.1:4321/`, including the updated parking lesson.

## Known boundary

There is no authorized GitHub remote in this workspace, so this release is not
claimed as publicly deployed. The ZIP and localhost preview are the completed
delivery artifacts; the verified Pages workflow can be used after a repository
target is explicitly supplied.
