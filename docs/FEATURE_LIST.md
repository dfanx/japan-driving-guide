# Feature List

Status vocabulary: `not_started`, `active`, `blocked`, `passing`.

WIP limit: exactly zero or one feature may be `active`.

| ID | Feature | Status | Acceptance |
|---|---|---|---|
| F001 | Repo / Astro skeleton | passing | Install, lint, typecheck, unit, static build, and smoke E2E pass |
| F002 | Harness docs + init/verify scripts | passing | A new session can orient, initialize, and verify from the repo |
| F003 | Source/Rule schema | passing | Valid example and validator pass |
| F004 | Effective-date logic | passing | Boundary tests pass |
| F005 | Bilingual lesson content schema | passing | zh-TW/en pair validation passes |
| F005A | Question data contract | passing | Q002 valid plus negative/traceability tests pass |
| F005B | Diagram Scene data contract | passing | D002 valid plus negative geometry-contract tests pass |
| F006 | Base layout + responsive design system | passing | 360px and 1440px evidence passes |
| F007 | Home + Fast Track | passing | Bilingual routes work |
| F008 | Full Learn navigation | passing | All approved modules are navigable |
| F009 | Essential Signs | passing | Curated tourist signs only |
| F010 | Seed question bank import | passing | Q001–Q024 validate and trace to rules |
| F011 | Quiz session engine | passing | Unit tests pass |
| F012 | Immediate answer explanation | passing | E2E passes |
| F013 | Weakness analyzer | passing | Deterministic tests pass |
| F014 | Quiz result/review links | passing | E2E passes |
| F015 | Diagram generator primitives | passing | Unit tests pass |
| F016 | Diagram templates T01–T06 | passing | Golden tests pass |
| F017 | Diagram templates T07–T12 | passing | Golden tests pass |
| F018 | D001–D024 scenes | passing | All approved assets generated |
| F019 | Diagram manifest/review gate | passing | Hash change forces `needs_review` |
| F019A | Official visual assets + D002 approval/promotion | passing | Provenance passes; human-approved bytes alone enter `public/diagrams` |
| F020 | Lesson integration with diagrams | passing | Mobile readability passes |
| F021 | Content traceability page/footer | passing | Verified date and sources display |
| F022 | GitHub Pages CI/CD | passing | Deploy and base-path smoke pass |
| F023 | Full mobile/accessibility pass | passing | Acceptance checklist passes |
| F024 | PWA/offline | passing | Core guide works offline after first visit |
| F025 | Production content revalidation | passing | Latest official sources rechecked before release |
| F026 | Full lesson visuals + official sign confirmation | passing | Every module has a relevant reviewed visual; regulated signs/signals use traceable official assets |
| F027 | Tourist mistake coverage + Taiwan copy refresh | passing | High-risk gaps trace to official sources; parking distinctions and zh-TW copy pass content, mobile, and browser gates |
| F028 | Driver-seat simulation photos | passing | D001-D024 each pair a disclosed driver-view simulation with the deterministic explanation diagram and official controls |
| F029 | D006 right-turn lane correction | passing | A's right-turn path enters the eastbound left-side lane; D006 hash, review, mobile, and release gates pass |
| F030 | Learner-first visuals and full review flow | passing | Captions teach scenario/risk/action; D002 signal is ahead of the approach lane; 24-question bilingual review with paging and results passes release gates |
| F031 | Speed-enforcement myths and reference-scenario audit | passing | Officially sourced enforcement guidance rejects tolerance/evasion myths; photographed concepts are mapped to original reviewed course visuals without reproducing the book artwork |
| F032 | Direct lesson entry and overlooked road-control scenarios | passing | Home starts Lesson 01; left-turn positioning, guide strips, roadside yellow lines, actuated signals, streetcar signals, and roadside-facility entry each have source-traced bilingual teaching and reviewed visuals |

## Evidence

### F001

- Acceptance run: `npm run verify:f001`
- Date: 2026-08-10
- Result: PASS
- Static output: one route, `/index.html`
- Unit: one file, two assertions
- E2E: one Chromium smoke test
- Rollback: remove the Phase 0 scaffold while preserving the two input Markdown
  files; no migration or external state exists.

### F002

- Acceptance runs: `scripts/init.ps1`, then `scripts/verify.ps1`
- Date: 2026-08-10
- Result: PASS
- Init: 512 packages installed from lockfile; hermetic Chromium installed
- Verify: lint, typecheck, unit, static build, and smoke E2E passed
- Residual note: npm emitted one Windows EPERM cleanup warning during `npm ci`;
  the command returned 0 and the fresh verification chain passed.
- Rollback: remove harness documents/scripts and restore the F001 package scripts;
  no external service or persistent data was created.

### F003

- Acceptance run: `npm run verify`
- Date: 2026-08-10
- Result: PASS
- Data: S03, S10, and JP-RULE-SIGNAL-RED-001
- Validator: runtime schema, duplicate detection, source traceability, and Tier S
  legal-rule gate
- Unit: 2 files, 11 assertions total
- Build: `validate:content` runs before Astro static generation
- Rollback: remove `src/data`, content schema/validator/tests, restore package build
  command, and remove the `tsx`/Node-type direct dependencies.

### F004

- Acceptance run: `npm run verify`
- Date: 2026-08-10
- Result: PASS
- Boundaries: 2026-08-31 and 2026-09-01 inclusive transition behavior covered
- Date source: explicit `CONTENT_AS_OF_DATE`, otherwise one UTC build date
- Unit: 3 files, 20 assertions total
- Build output: effective date plus active/upcoming/expired counts
- Rollback: remove the effective-date module/tests and status output from the
  content CLI; Source/Rule structural dates remain valid F003 metadata.

### F005

- Acceptance run: `npm run verify`
- Date: 2026-08-10
- Result: PASS
- Lesson pair: M02-signals `zh-TW.md` and `en.md`
- Validator: strict paths/frontmatter, required locale pair, parity fields, Rule
  references, non-empty body, duplicate-locale detection
- Unit: 4 files, 26 assertions total
- Build: 2 lesson documents validated before static generation
- Rollback: remove lesson schema/data/tests, YAML direct dependency, and lesson
  loading from the content CLI; F003/F004 remain independent.

### F005A

- Acceptance run: `npm run verify`
- Date: 2026-08-10
- Result: PASS
- Question: Q002, reviewed bilingual single-choice data
- Validator: answer/option integrity, unique IDs, Rule references, category-tag
  alignment, approved Rule dependency, production approval gate
- Unit: 5 files, 34 assertions total
- Build: 1 question validated before static generation
- Rollback: remove question schema/data/tests and question loading from the CLI;
  lesson and Rule contracts remain intact.

### F005B

- Acceptance run: `npm run verify`
- Date: 2026-08-10
- Result: PASS
- Scene: D002 FourWayIntersection semantic scene v1
- Validator: canonical 1200×800 viewBox, lane bounds, unique controls/actors,
  annotation actor references, Rule traceability, Question scene existence
- Review state: `needs_review`; no SVG or visual approval is claimed
- Unit: 6 files, 42 assertions total
- Build: 1 diagram scene validated before static generation
- Rollback: remove scene schema/data/tests and CLI cross-reference integration;
  Q002 retains an optional format-valid Diagram ID under F005A.

### F006

- Acceptance runs: `npm run verify:f006`, then `npm run verify`
- Date: 2026-08-10
- Result: PASS
- Layout: reusable BaseLayout, AppHeader, and LearningShell components
- Responsive evidence: Chromium assertions and screenshots at 360×800 and
  1440×1000; no horizontal overflow, one/two-column transition correct, footer
  closes the frame without a residual gap
- Visual direction: user-approved cool Japanese palette using cold white,
  blue-grey, indigo, and teal; red remains reserved for traffic alerts
- Regression: 6 unit files / 42 assertions, static build, and smoke E2E passed
- Rollback: remove F006 components/global styles/layout E2E, restore the previous
  standalone index page and package scripts; content data remains unchanged.

### F015

- Acceptance runs: `npm run verify:f015`, then `npm run verify`
- Date: 2026-08-10
- Result: PASS
- Primitive scope: RoadSegment, LaneBoundary, StopLine, Crosswalk, TrafficLight,
  Vehicle, LabelBadge, and DirectionalArrow required by D002
- Determinism: restricted SVG node model, alphabetically canonical attributes,
  three-decimal number normalization, XML escaping, and raw-markup exclusion
- Geometry: canonical 1200×800 canvas checks include positive bounds and stroke
  margins; clipped lines/arrows fail before serialization
- Unit: 12 focused primitive assertions; full suite 7 files / 54 assertions
- Asset status: no template, SVG output, golden, manifest, hash, or diagram
  approval was created or claimed
- Rollback: remove F015 geometry/primitives/tests and package scripts; Scene schema
  and D002 `needs_review` data remain unchanged.

### F016

- Acceptance runs: `npm run verify:f016`, then `npm run verify`
- Date: 2026-08-10
- Result: PASS
- Templates: T01 StraightRoad, T02 FourWayIntersection, T03 TJunction, T04
  Crosswalk, T05 RailwayCrossing, and T06 ExpresswayMerge
- Golden evidence: 6 canonical SVG files, 8 focused template assertions, full
  suite 8 files / 63 assertions
- Visual QA: all templates reviewed at 600px and 360px equivalent widths;
  upright A/B labels remain visible and movement arrows are not alert red
- T02 boundary: renders current D002 semantics; unsupported green-arrow,
  flashing-signal, actor-position, and non-instruction semantics fail explicitly
- Asset status: golden fixtures are not `public/diagrams` assets and do not create
  hashes, manifest entries, or approval
- Rollback: remove F016 renderer/templates/golden/tests/capture scripts and revert
  the small serializer/label/arrow extensions; F015 remains independently usable.

### F019

- Acceptance runs: `npm run verify:f019`, then `npm run verify`
- Date: 2026-08-10
- Result: PASS
- Candidate: `tools/diagram-generator/review/D002.svg`; no production/public
  diagram was created
- Manifest: one D002 entry with canonical Scene/output SHA-256 hashes, generator
  version 1.0.0, `needs_review`, and null `reviewedAt`
- Gate behavior: missing manifest/candidate, byte drift, hash drift, unmanaged
  candidates, generator changes, or an unapproved Scene invalidate the gate or
  revoke preserved approval
- Unit: 10 focused manifest assertions; full suite 9 files / 73 assertions
- Visual QA: D002 candidate checked at 600px and 360px; this does not constitute
  human approval
- Rollback: remove manifest/builder/candidate/tests/scripts, restore the previous
  build command, and leave D002 Scene data as `needs_review`.

### F019A

- Acceptance runs: `npm run verify:f019a`, D002 approval, then `npm run verify`
- Date: 2026-08-10
- Result: PASS
- Official asset: exact NPA S10 page-1 `/Image25` red-light PNG, with source,
  terms, extraction, dimensions, attribution, and SHA-256 provenance
- Approval: Scene and manifest approved 2026-08-10; public D002 bytes match the
  reviewed candidate at SHA-256 `d76dfc5b...ea0046`
- Gate: unapproved, missing, or drifting public SVGs fail closed
- Rollback: remove public D002, return Scene/manifest to `needs_review`, and
  restore generator 1.0.0/custom signal only if the official-first decision is
  explicitly reversed.

### F020

- Acceptance runs: `npm run verify:f020`, then `npm run verify`
- Date: 2026-08-10
- Result: PASS
- Routes: `/zh-TW/learn/signals/` and `/en/learn/signals/`
- Integration: M02, JP-RULE-SIGNAL-RED-001, D002, and Q002 share one production
  page contract; build fails if any dependency is unapproved or misaligned
- Mobile: 360px has no horizontal overflow, diagram remains within main content,
  and checkpoint options collapse to one column
- E2E: 3 F020 cases passed for bilingual identity, language links, SVG load and
  aspect ratio, localized content, and mobile layout
- Rollback: remove the two routes, SignalLessonPage, F020 styles/tests/scripts,
  and restore the small layout/header prop extensions; approved D002 remains.

### F011

- Acceptance runs: `npm run verify:f011`, then `npm run verify`
- Date: 2026-08-10
- Result: PASS
- Engine: immutable `QuizSession` with deterministic question order, current
  index, answers, and correctness results
- Guards: empty/duplicate/unapproved questions, wrong question, unknown option,
  duplicate answer, unanswered advance, completed mutation, and forged state
  fail closed with stable error codes
- Unit: 1 focused file / 8 tests; full suite 11 files / 83 assertions
- Rollback: remove `src/lib/quiz`, the focused test and F011 package scripts;
  Q002 and F020 remain independently valid.

### F012

- Acceptance runs: `npm run verify:f012`, then `npm run verify`
- Date: 2026-08-10
- Result: PASS
- Interaction: Q002 uses the F011 immutable engine; the first submitted answer
  is final and both options and submit control are then disabled
- Feedback: correctness and the unchanged approved localized explanation appear
  immediately in a focused status region; correct and selected options are
  identified without relying on color alone
- E2E: 3 F012 cases passed for zh-TW incorrect, en correct, answer locking,
  approved explanation parity, focus notification, and 44px mobile targets
- Rollback: restore the static F020 checkpoint and remove the F012 controller,
  interaction styles, E2E file, and package scripts; retain F011 and Q002

### F013

- Acceptance runs: `npm run verify:f013`, then `npm run verify`
- Date: 2026-08-10
- Result: PASS
- Algorithm: per-tag `correctCount / answeredCount`, with exact `>=0.80`
  strong, `>=0.60` review, and lower priority-review bands
- Evidence: 7 focused tests cover empty state, Q002 correct/incorrect, exact
  boundaries, partial sessions, multi-tag canonical order, immutability, and
  fail-closed Question alignment
- Confidence: a tag with one answered Question is explicitly `limited`; the
  result UI must not present that case as a precise percentage
- Full suite: 12 unit files / 90 assertions, content/diagram gates, 3-route
  static build, and Chromium smoke passed
- Rollback: remove `src/lib/weakness`, F013 tests/scripts, and this evidence;
  F011/F012 remain independently passing

### F014

- Acceptance runs: `npm run verify:f014`, `npm run verify`, then full
  `npm run test:e2e`
- Date: 2026-08-10
- Result: PASS
- Flow: immediate explanation retains first focus; the learner explicitly opens
  the review result, which completes the one-Question QuizSession and consumes
  F013 output
- Presentation: zh-TW incorrect produces `signals / priority_review / limited`;
  en correct produces `signals / strong / limited` without claiming mastery or
  displaying `0%`/`100%`
- Navigation: both locales link back to the same-locale `M02-signals` lesson
  anchor; result and actions remain readable with 44px targets at 360px
- E2E: 3 F014 cases and all 12 project browser cases passed
- Rollback: remove the result trigger/panel, controller completion transition,
  F014 styles/tests/scripts, and this evidence; retain F011–F013

### F007

- Acceptance runs: `npm run verify:f007`, then `npm run verify`
- Date: 2026-08-10
- Result: PASS
- Routes: `/`, `/zh-TW/`, `/en/`, `/zh-TW/fast-track/`, and
  `/en/fast-track/` build statically
- Parity: home and Fast Track language switches preserve equivalent pages;
  both paths link to the same-locale approved Signals lesson
- Honesty: entry copy states the current reviewed scope as one lesson and one
  scenario rather than implying unapproved curriculum coverage
- E2E: 4 F007 cases pass for both locales, root gateway, links, 360px fit, and
  44px actions; standard smoke also passes
- Rollback: remove F007 routes/components/styles/tests/scripts and restore the
  foundation root home; the M02 vertical slice remains independently passing

### F010

- Acceptance runs: `npm run verify:f010`, then `npm run verify`
- Date: 2026-08-10
- Result: PASS
- Catalog: 24 approved bilingual Questions, 21 approved Rules, and 17 Sources
- Traceability: every Question tag is backed by a referenced Rule category and
  every Rule resolves to known Sources; legal Rules include Tier S evidence
- Effective date: Q013 references an approved speed Rule that remains upcoming
  through 2026-08-31 and becomes active on 2026-09-01
- Diagram staging: only Q002 references D002; other curriculum diagram links
  remain unset until F018 creates reviewed Scene IDs
- Test evidence: 5 focused seed-bank tests; full suite 13 files / 95 assertions
- Rollback: restore the single Q002/Rule files and remove catalog, seed data,
  validator flattening, F010 tests/scripts, and this evidence

### F008

- Acceptance runs: `npm run verify:f008` through build, then corrected focused
  `npm run test:e2e:f008`
- Date: 2026-08-10
- Result: PASS
- Coverage: 16 modules × 2 locales, generated from 32 approved Markdown lesson
  documents through one canonical navigation contract
- Routes: 39 static pages, including bilingual Learn indexes and every approved
  module; M02 retains its specialized diagram/quiz presentation
- Traceability: 23 approved Rules resolve to 17 Sources; 22 active and 1 upcoming
  at the explicit 2026-08-10 content date
- E2E: 3 focused cases cover both 16-card indexes, all 32 module routes,
  equivalent language links, previous/next navigation, and 360px containment
- Rollback: remove generic lesson/index components, generated module routes,
  M00/M01/M03–M15 Markdown pairs, F008 tests/scripts, and the two scoped Rules;
  retain the independently passing M02 vertical slice

### F009

- Acceptance runs: `npm run verify:f009` through build, then corrected focused
  `npm run test:e2e:f009`
- Date: 2026-08-10
- Result: PASS
- Scope: 10 tourist-priority sign cards in both locales; 10 locally served exact
  official images (9 NPA PDF objects and 1 MLIT GIF)
- Provenance: every local image records authority, Source ID, terms, retrieval,
  page/object or upstream URL, dimensions, transformation, and SHA-256
- Rights gate: NEXCO's ETC image is not copied because its terms prohibit reposting
  on another website; the ETC card uses official text and an outbound source link
- E2E: 3 cases pass for bilingual identity, 10 cards, 10 loaded official images,
  explicit ETC rights note, one-column mobile layout, and zero horizontal overflow
- Rollback: remove Essential Signs data/component/routes/assets/tests, S18, and the
  three F009 Rules; restore M09 to the generic approved lesson

### F017

- Acceptance runs: `npm run verify:f017`, `npm run capture:diagram-golden`
- Date: 2026-08-10
- Result: PASS
- Templates: T07 ExpresswayLanes, T08 TollGate, T09 ParkingRoadside, T10
  OneWayStreet, T11 NarrowLocalRoad, and T12 BicyclePassing
- Determinism: 12 total canonical golden SVGs; 17 focused template tests and 15
  primitive tests pass with zero type diagnostics
- Official-first boundary: T08 text is marked schematic-not-sign, T10 contains no
  redrawn one-way sign, and no new regulated visual asset was invented
- Visual QA: T07–T12 reviewed at 600px and 360px; T12 was corrected so the
  cyclist occupies the left side of the same-direction lane and the car passes
  from the right with an explicit clearance guide
- Rollback: remove the six renderer functions/goldens, cyclist primitive, F017
  tests/scripts/docs, and return the template registry to T01–T06

### F018

- Acceptance runs: `npm run verify:f018`, `npm run capture:diagram-review`
- Date: 2026-08-10
- Result: PASS
- Inventory: semantic contracts and deterministic candidates exist for exactly
  D001–D024; all Rule IDs resolve and bilingual alternative text is present
- Official assets: regulated signal/sign faces use 11 exact NPA/MLIT assets;
  spatial actors and road geometry remain deterministic schematics
- Review boundary: D002 remains the only human-approved/public diagram; 23 new
  candidates remain `needs_review`, and intended Question mappings are staged
  outside the approved Question catalog
- Visual QA: all 24 candidates were inspected at 600px and 360px; fixes added
  missing pedestrians, corrected the blocked railway exit, removed an alert-red
  movement cue, and differentiated ETC/general toll-lane decisions
- Verification: 6 focused F018 tests, 16 primitive tests, zero type diagnostics,
  24 candidate consistency checks, and 48 visual captures pass
- Rollback: remove preset Scene/schema/rendering/reference-asset additions, the
  three exact NPA signal assets, staged mappings, F018 tests/scripts/docs, and
  restore the D002-only Scene inventory

### F021

- Acceptance run: `npm run verify:f021`
- Date: 2026-08-10
- Result: PASS
- Routes: `/zh-TW/sources/` and `/en/sources/`; 41 total static pages
- Coverage: 18 sources and all 29 reviewed Rules; 18 legal rules, 8 official
  guidance items, and 3 practical-advice items remain visibly distinct
- Dates: source-link and Rule verification dates are derived from reviewed data,
  not a client clock
- Navigation: every localized page footer links to the equivalent traceability
  route; the neutral gateway exposes both languages
- Verification: 3 unit and 3 E2E cases pass, including locale parity, all entries,
  360px containment, and a 44px footer target
- Rollback: remove traceability data/view/routes/styles/tests/scripts and the
  shared footer links; retain the underlying Source/Rule catalogs

### F022

- Acceptance run: `npm run verify:f022`
- Date: 2026-08-11
- Result: PASS
- Base path: 41 HTML files and 906 internal route/asset references resolve under
  `/japan-driving-guide/`; one Chromium path/asset smoke case passes
- Workflow: official GitHub Pages artifact/deployment actions, least-privilege
  permissions, Node/npm lockfile install, full static gates, and project/user-site
  base-path selection are configured
- Live evidence: PR #1 merged at `781ec5cc`; Actions run `31474056007` attempt 2
  passed build and deploy; the public root, zh-TW intersections lesson, and D006
  returned HTTP 200 at `https://dfanx.github.io/japan-driving-guide/`
- Rollback: remove `withBase`, Pages workflow, base-aware preview server,
  F022 scripts/tests/docs, and restore root-only link generation

### F023

- Acceptance run: `npm run verify:f023`
- Date: 2026-08-10
- Result: PASS
- Coverage: all 41 static pages were checked at 360px for language, landmarks,
  one H1, heading order, unique IDs, image alt attributes, and horizontal fit
- Responsive: representative product, lesson, sign, and traceability pages pass
  at 360×800, 390×844, 768×1024, and 1440×900
- Interaction: skip navigation, checkpoint answer flow, visible focus,
  reduced-motion fallback, and 44px interactive targets pass in Chromium
- Contrast: primary, action, alert, soft, and muted token pairs meet at least
  WCAG AA 4.5:1 normal-text contrast; muted copy was corrected during audit
- Rollback: remove F023 tests/scripts and revert the focus, touch-target,
  reduced-motion, root-language, and contrast-token changes

### F024

- Acceptance run: `npm run verify:f024`
- Date: 2026-08-10
- Result: PASS
- Offline package: 58 versioned precache URLs include 41 pages, local official
  sign images, approved D002, styles/scripts, manifest, fallback, and 24 Questions
- Browser evidence: after one online visit, the English Signals lesson, diagram,
  and checkpoint work with the browser network disabled; unknown routes receive
  an explicit bilingual offline fallback
- Deployment paths: manifest, service-worker scope, icons, precache URLs, and
  fallback pass at both `/` and `/japan-driving-guide/`
- Freshness policy: navigations are network-first when online; external official
  pages are never represented as cached or current
- Rollback: remove the PWA builder/checker, manifest registration, app icon,
  offline E2E, and restore the pre-F024 build command

### F025

- Acceptance run: `npm run verify:release`
- Date: 2026-08-10
- Result: PASS
- Revalidation: 19 official Sources have explicit review outcomes, checked URLs,
  claim scopes, rights observations, and reviewer notes in the release evidence
- Corrections: separated the statutory cyclist-passing duty from numerical
  official guidance; replaced the missed-exit Rule's generic source with the
  directly supporting NEXCO West source S19
- Date model: release/as-of/revalidation dates are explicit data; production no
  longer silently changes legal state according to a build or client clock
- Coverage: 19 Sources, 30 Rules, 32 lesson documents, 24 Questions, and 24
  Scenes; 29 active Rules and 1 explicitly upcoming Rule as of 2026-08-10
- Release verification: lint, zero-diagnostic typecheck, 18 unit files / 129
  tests, 41-page build, 35 browser tests, root/project-base PWA checks, and the
  explicit Pages-base browser test pass; 1 root-only deployment case is skipped
  by design when no project base is supplied
- Rollback: revert S19 and the cyclist Rule split, release/revalidation records,
  effective-date and coverage-date changes, and F025 tests; doing so would also
  invalidate the 2026-08-10 release claim

### F026

- Acceptance runs: `npm run test:f026`, `npm run test:e2e:f026`, then
  `npm run verify:release`
- Date: 2026-08-11
- Result: PASS
- Coverage: all 16 modules in both locales render a relevant visual set; the
  deterministic diagram inventory D001-D024 is used exactly once across the
  canonical lesson visual map.
- Regulated visuals: exact locally served NPA/MLIT sign and signal assets retain
  their provenance and checksums. The ETC item remains an official-link-only
  rights fallback; no replacement sign was fabricated.
- Generated context: three text-free contextual WebP illustrations cover rental
  eligibility, adverse weather, and the decision not to drive. Each is visibly
  labelled as context rather than official evidence and locked by metadata/hash.
- Diagram promotion: all 24 candidates were reviewed at 600px and 360px, then
  owner-directed promotion moved D001 and D003-D024 through the manifest gate;
  D002 retained its prior approval. Candidate/public bytes match.
- Verification: lint and typecheck pass with zero diagnostics; 19 unit files / 134
  tests pass; 41 pages and 84 PWA URLs build; 38 root Chromium cases pass with one
  intentional project-base skip, and the separate project-base case passes.
- Rollback: remove F026 visual mapping/component/styles/generated assets/tests,
  restore lesson frontmatter and the prior D002-only public approval state, then
  rebuild the manifest and static output. Official source assets are independent.

### F027

- Acceptance runs: `npm run test:f027`, `npm run test:e2e:f027`, full
  `npm run test:e2e`, then `npm run verify:f027`
- Date: 2026-08-11
- Result: PASS
- Discovery: six user-supplied visitor/rental articles were used to identify
  recurring confusion, not promoted as legal evidence. Two inaccessible pages
  contributed no copied claims.
- Coverage: six new legal Rules trace to S03/S10/S16 and new official Sources
  S20-S24; S25 supplies authoritative rental-parking operating guidance.
- Parking: the lesson compares the exact official red-X and one-slash sign
  assets, explains the parking/stopping boundary, rejects the two-minute/hazard-
  light myth, and links the official five/ten-metre diagram.
- Safety: phone handling, all-seat belts, under-six child restraints, and
  assisting/requesting/riding with a drink-driver are now explicit Rules in M15.
- Product copy: home, Fast Track, Learn, lesson UI, and all 16 zh-TW lesson bodies
  use shorter Taiwan-facing wording led by the mistake and required action.
- Verification: 25 Sources, 36 Rules, 32 lesson documents, 24 Questions and 24
  approved diagrams validate; 20 unit files / 140 tests and 42 root Chromium
  cases pass, with one project-base-only case skipped by design.
- Rollback: revert S20-S25, the six F027 Rules, M10/M15 Rule references, official
  parking-sign labels, copy changes, and F027 tests; restore the 2026-08-10
  release record. No external state or legal-source mirror was created.

### F028

- Acceptance run: `npm run verify:f028` and `npm run verify:release`
- Date: 2026-08-11
- Result: PASS
- Coverage: 24 generated 1200×800 WebPs pair one-to-one with D001-D024 in both
  locales; D002 uses the same photo→diagram sequence in its interactive page.
- Boundary: every simulation is disclosed as generated context and records
  `containsOfficialVisual: false`; exact controls remain deterministic or
  Japanese-authority assets.
- Verification: 21 unit files / 143 tests; 44 root Chromium passes plus one
  project-base pass; 108 PWA URLs; 360px and desktop visual review pass.
- Rollback: remove the driver-simulation catalog/assets and pair markup, restore
  the diagram-only lesson flow, and rebuild the PWA/static archive.

### F029

- Acceptance runs: `npm run verify:f029` and `npm run verify:release`
- Date: 2026-08-11
- Result: PASS
- Correction: D006 car A now follows one continuous right-turn path from the
  northbound approach into the eastbound left-side lane; the former arrow in the
  westbound/oncoming half is removed. Car B continues through the conflict area.
- Diagram review: regenerated D006 passed 600px and 360px review, then entered
  the approval manifest at SHA-256
  `37888b2d617001c4f97c9414ffd488cc091660fc9a0624404db06a0f4519faa9`.
- Verification: 21 unit files / 144 tests; 45 root Chromium passes plus one
  project-base pass; 24 candidates / 24 approved; 41 pages and 108 PWA URLs.
- Rollback: revert the D006 preset and focused tests, rebuild the candidate,
  restore the prior approval record/public SVG, and rebuild the static archive.

### F030

- Acceptance runs: `npm run verify:f030`, full `npm run test:e2e`, and
  `npm run verify:release`
- Date: 2026-08-11
- Result: PASS
- Learner copy: every driver simulation, deterministic diagram, and contextual
  illustration now teaches a situation, likely mistake, and concrete action.
  Internal production, approval, provenance, and rights language no longer
  occupies primary image captions.
- Review flow: M00-M15 remain uninterrupted lessons with previous/index/next
  navigation. A bilingual `/review/` route presents all 24 approved Questions,
  immediate explanations, back/next paging, final score, topic breakdown, and
  direct lesson recovery links.
- Parking verification: Q016 now checks the red-X `no stopping or parking`
  distinction against the one-slash `no parking` control and remains traced to
  the approved parking-sign Rule.
- D002 correction: the south-approach red signal and stop instruction are
  centred at x=545 ahead of vehicle A's northbound approach lane. The prior
  x=730 right/oncoming-lane placement is rejected by focused tests. The new
  reviewed/public output is
  `sha256:51c1ca5ce36a20cb287b8528dfeb5fcd9cbb3c001245592af3123f2450bdec5a`.
- Verification: zero-diagnostic lint/typecheck; 21 unit files / 145 tests; 43
  static pages / 110 PWA URLs; 46 root Chromium passes plus the separate
  project-base case; desktop and 360px browser visual review.
- Release archive: 111 entries / 3,338,534 bytes; SHA-256
  `DD5FC6B6EF96E28CA907E434345E3B03824E29BB9D01352F28D53C8A5CED66D9`.
- Rollback: restore the prior lesson captions and single-question Signal page,
  remove the review routes/client module, restore Q016, and revert/reapprove the
  previous D002 bytes. Rebuild static/PWA/release artifacts afterward.

### F031

- Date opened: 2026-08-12
- Status: PASSING
- Scope: verify the supplied speed-enforcement claims against current Japanese
  authority sources; add a learner-facing myth/action section; audit the 13
  photographed textbook concepts against the existing signal, intersection,
  parking, expressway, and fuel lessons; redraw only verified gaps as original,
  deterministic course visuals.
- Rejected input boundary: enforcement thresholds, following a speeding lead
  vehicle, detector/app tactics, and claims about which vehicle police will stop
  are not treated as lawful or safe driving guidance.
- Local acceptance: bilingual/source parity, diagram review evidence, focused
  browser tests, full release verification, and static archive integrity pass.
- Live acceptance: main commit `d454418` passed GitHub Pages run `31553355397`;
  the public speed, intersections, review, and D011 routes return HTTP 200 and
  expose the new F031 content.
- Rollback: revert the S26-S29 catalog additions, three F031 Rules, Q025, lesson
  copy, D011 preset/approval and focused tests, then rebuild the static archive.
  D002 requires no rollback because its reviewed bytes did not change.

### F032

- Date opened: 2026-08-12
- Status: PASSING
- Scope: replace the ten-minute home entry with a direct Lesson 01 start; add
  source-traced bilingual teaching and original visuals for six overlooked
  road-control and entry scenarios reported by the user.
- Safety boundary: photographed book pages are discovery references only.
  Streetcar and actuated-signal appearance may vary by location; a U-turn is
  never prescribed unless it is legal, visible, and safe at that location.
- Acceptance: PASS — current official-source traceability, bilingual parity,
  six reviewed diagram pairs, responsive browser QA, full release verification,
  Pages run `31556479002`, and public HTTPS content/asset smoke all passed.
- Rollback: revert commit `b31315b`, rebuild the diagram/PWA outputs, and deploy
  the prior `main`. No backend, database, or migration exists.
