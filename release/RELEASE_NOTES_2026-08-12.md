# Japan Driving Guide — Static Release 2026-08-12

## Delivery

- Archive: `japan-driving-guide-static-2026-08-12.zip`
- Size: 3,343,307 bytes
- SHA-256: `11C65D3334B4B1CFB9C7E3071892E0453E78E7FC214ECD845907603AC8AE1821`
- Format: static Astro output; no backend, login, runtime API, or database

## What changed

- Added a concise bilingual correction to the myth that Japan does not enforce
  speeding. The lesson distinguishes fixed, semi-fixed, and portable equipment
  while rejecting alleged `+30/+40` margins, lead-car shielding, and detection-
  avoidance tactics as driving guidance.
- Added Q025 to the final review. The bilingual bank now contains 25 locked-
  first-response scenarios with immediate explanations and paging.
- Added S26-S29 and three source-traced Rules for enforcement, yellow no-lane-
  change markings, and guide strips.
- Audited all 13 supplied textbook photos. Verified concepts were merged into
  the signal, intersection, parking, speed, fuel, and expressway curriculum;
  unsupported route recipes and special-control generalizations were rejected.
- Redrew D011 as an original deterministic comparison between a no-centre-line
  residential road affected by the 2026-09-01 default and a centre-line road
  where the driver must read the posted limit.
- Restored D002 from its reviewed candidate without changing its approved lane-
  relative signal placement.

## Verification

- `npm run verify:release`: PASS
- Lint/typecheck: PASS, zero diagnostics
- Unit: 22 files / 149 tests
- Content: 29 Sources / 39 Rules / 32 lesson documents / 25 Questions / 24 Scenes
- Diagram gate: 24 candidates / 24 approved
- Static output: 43 route entry pages / 110 PWA URLs
- Chromium: 49 root passes, one expected project-base skip, and the separate
  GitHub project-base case passes
- Archive integrity: 112 entries / 43 route entries
- Local browser QA: speed, intersections, and final-review learner flows pass

## Safety and rights boundary

The supplied social post and book photos were discovery inputs, not legal
evidence or artwork sources. The release does not reproduce the photographed
book layouts and does not publish enforcement-evasion thresholds. Public rules
trace to Japanese-authority sources; simulations remain context-only and
deterministic diagrams remain the reviewed explanatory layer.

## Deployment

Main commit `d454418` passed GitHub Pages run `31553355397`. The public speed,
intersections, final-review, and D011 routes returned HTTP 200 with the F031
content present.
