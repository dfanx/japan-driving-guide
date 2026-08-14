# Acceptance Gates

## Phase 0 — Harness + Skeleton

- [x] Astro + TypeScript static skeleton exists
- [x] Install resolves from a lockfile
- [x] One minimal home page builds
- [x] Lint passes
- [x] Typecheck passes
- [x] Unit tests pass
- [x] Chromium smoke test passes
- [x] `AGENTS.md` routes a new session
- [x] Project brief exists
- [x] Feature state uses the approved vocabulary and WIP=1
- [x] Progress, decisions, verification, and acceptance evidence exist
- [x] Windows and shell init/verify scripts exist
- [x] F002 final verification recorded

Phase 0 does not accept content schema, bulk curriculum UI, diagrams, quiz logic,
PWA, or deployment work. Those belong to later feature gates.

## Phase 1 entry criteria

- Phase 0 is passing with no active feature
- F003 becomes the only active feature
- Source and Rule schema scope is declared before editing
- At least one valid and one invalid fixture are planned
- No curriculum expansion occurs during the schema feature

## Phase 1 — Data contract

- [x] F003 Source/Rule runtime schema
- [x] Source-to-Rule traceability gate
- [x] Minimum valid Source and Rule dataset
- [x] F004 effective-date state and boundary tests
- [x] F005 bilingual lesson pair schema
- [x] F005A Question data contract
- [x] F005B Diagram Scene data contract

## Phase 2 — Vertical slice

- [x] F006 reusable base layout and responsive design system
- [x] F015 deterministic D002-required diagram primitives
- [x] Canonical SVG serialization and canvas/stroke bounds tests
- [x] F016 T01–T06 deterministic template goldens
- [x] T01–T06 visual QA at 600px and 360px equivalent widths
- [x] F019 manifest/hash drift gate
- [x] Hash or generator change forces `needs_review`
- [x] Unapproved D002 candidate remains outside `public/diagrams`
- [x] Official NPA red-light bytes have source/licence/checksum provenance
- [x] Official asset or provenance drift participates in diagram identity
- [x] Missing, drifting, or unapproved public diagram assets fail the gate
- [x] 360px single-column layout assertion and screenshot pass
- [x] 1440px two-column layout assertion and screenshot pass
- [x] Standard verification remains passing after layout integration
- [x] D002 approved public SVG output exists
- [x] D002 Scene and manifest receive human approval
- [x] M02, D002, and Q002 are connected through a production lesson path
- [x] F011 deterministic QuizSession engine passes unit tests
- [x] Q002 immediate answer explanation passes bilingual E2E
- [x] Deterministic weakness analyzer passes boundary and negative unit tests
- [x] Localized weakness-result presentation and review link pass E2E
- [x] Phase 2 S03/Rule/M02/D002/Q002/quiz/weakness vertical slice passes

## Product expansion

- [x] F007 bilingual Home + Fast Track routes expose the reviewed slice
- [x] F010 Q001–Q024 bilingual seed bank traces to approved Rules and Sources
- [x] F008 all 16 bilingual Learn modules are statically navigable
- [x] F009 tourist-priority sign cards use licensed official visuals or disclose a rights-gated official link
- [x] F017 T07–T12 deterministic template goldens pass and preserve official-first boundaries
- [x] F018 D001–D024 semantic Scenes and review candidates pass while unapproved outputs remain non-public
- [x] F021 exposes verified dates, Source IDs, evidence tiers, and statement classifications in both locales
- [x] F023 validates all routes at 360px and representative routes at 360/390/768/1440 widths
- [x] Keyboard flow, visible focus, reduced motion, semantic language/heading structure, and 44px targets pass
- [x] Core text/action/status color pairs meet WCAG AA normal-text contrast
- [x] F024 manifest and service worker are base-path safe
- [x] Core pages, approved visuals, and Question bank install for offline use
- [x] Real offline lesson/diagram/checkpoint flow and honest fallback pass in Chromium
- [x] F025 reopens every registered official Source and records review evidence
- [x] Binding law, official guidance, and practical advice remain separate claims
- [x] Missed-exit guidance cites the directly supporting NEXCO source
- [x] Release, content-as-of, and revalidation dates are explicit versioned data
- [x] Public coverage date exposes the oldest reviewed record rather than masking it
- [x] Full release verification passes at root and GitHub project-page base paths
- [x] F026 gives every bilingual module a relevant reviewed visual set
- [x] Regulated sign/signal recognition uses exact official assets or an explicit rights-gated source link
- [x] Generated contextual images are limited to non-regulated themes and visibly disclosed
- [x] D001-D024 pass deterministic manifest, hash, mobile, and public-asset gates
- [x] F027 covers ten high-risk visitor mistakes with direct lesson links
- [x] Parking lessons compare exact official red-X and one-slash assets
- [x] Parking/stopping, five/ten-metre zones, phone, belt, child-seat, and alcohol-assistance Rules trace to official Sources
- [x] zh-TW public copy passes the mistake/action/exception voice review
- [x] F027 focused and full mobile/browser regression passes
- [x] F028 pairs every D001-D024 example with one disclosed driver's-seat simulation
- [x] Generated simulations remain context-only and contain no accepted official visual
- [x] Photo→diagram→official-control sequence passes bilingual and 360px browser checks
- [x] All 24 simulation WebPs pass exact hash and 1200×800 dimension gates
- [x] F029 D006 right turn follows a continuous path into the eastbound left-side lane
- [x] D006 lane semantics, 360px rendering, approval hash, and full release regression pass
- [x] F030 visual captions teach situation, risk, and action without production/compliance copy
- [x] D002 signal and stop instruction align ahead of the south approach lane
- [x] Signal and generic lessons expose previous/index/next navigation without isolated scored questions
- [x] Bilingual 24-question final review supports paging, explanations, score, topic bands, and lesson recovery
- [x] Q016 verifies the no-stopping/no-parking sign distinction
- [x] F030 desktop/mobile visual QA and full release regression pass
- [x] Home primary action starts Lesson 01 and exposes no ten-minute choice
- [x] Left-turn edge positioning and guide strips have bilingual source-traced teaching and reviewed diagrams
- [x] Solid/broken yellow roadside parking lines have a direct comparison diagram
- [x] Actuated signals and streetcar signals have separate recognition and action guidance
- [x] Roadside-facility entry separates the pedestrian-yield duty from same-direction re-approach advice
- [x] D007, D019 and D025-D028 pass deterministic hash, approval and 360px review gates
- [x] D025-D028 driver-view simulations pass 1200x800, hash and no-official-visual gates
- [x] F032 focused, full release and 390px learner-flow checks pass
- [x] F032 public Pages workflow and HTTPS smoke recorded
- [x] D020 ramp, acceleration lane and mainline form one continuous road surface
- [x] D020 separator narrows into the merge point and movement arrow stays inside the lane
- [x] T06/D020 geometry, approval hash, 600px/360px review and full release regression pass
- [x] F033 public Pages workflow and HTTPS D020 smoke recorded
- [x] F034 classifies parking/reversing hazards and brief thanks flashes as
      unofficial, ambiguous customs rather than legal signals
- [x] F034 teaches NEXCO zipper merging as official guidance and rejects a
      `+/-15 km/h` legal or safe allowance
- [x] F034 tells every vehicle to stop/check at a railway crossing while
      preserving the statutory signal-controlled exception
- [x] F034 roadside-facility copy reads road controls and `右折入庫禁止` before
      a right-turn entry and never equates a missing notice with a safe gap
- [x] F034 focused, full release, bilingual and mobile gates pass locally
- [x] F034 GitHub Pages workflow and public HTTPS content markers pass
- [x] F035 decomposes all seven visitor-tip groups into condition, action and
      confidence boundary before publishing them
- [x] F035 rejects fixed STOP/red-light seconds, universal white-line rules,
      enforcement tolerance, automatic immigration outcomes and AI guarantees
- [x] F035 keeps S34-S39 operator/authority evidence distinct from practical
      advice across M02/M03/M04/M07/M10/M11/M12 in both locales
- [x] F035 focused, full release, source-page, bilingual and 390px mobile gates
      pass locally without changing approved diagram bytes
- [ ] F035 GitHub Pages workflow and public HTTPS content markers pass

## External release boundary

- [x] GitHub Pages workflow and artifact are implementation-verified
- [x] Live GitHub Pages URL passes root, lesson, and D006 HTTP checks
- [x] Owner-directed promotion of D001 and D003-D024 after 600px/360px visual review
