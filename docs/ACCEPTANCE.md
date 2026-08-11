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

## External release boundary

- [x] GitHub Pages workflow and artifact are implementation-verified
- [ ] Live GitHub Pages URL (blocked: no authorized Git remote/repository target)
- [x] Owner-directed promotion of D001 and D003-D024 after 600px/360px visual review
