# Progress

## Current state

- Phase: Verified static release and live deployment
- Active feature: none
- Last passing feature: F035 — visitor tips claim audit and lesson integration
- Content imported: 40 Sources, 57 Rules, 25 Questions, 32 lesson documents
- Diagrams generated/approved: 28 review candidates / 28 approved
- Deployment: F035 product head `6b39a3f` is live at
  `https://dfanx.github.io/japan-driving-guide/`; Pages run `31773780279` passed

## Session 2026-08-10

### Session start

- Active feature: F001, then F002 after F001 passed
- Files read: both root planning/curriculum Markdown files
- Scope: minimal static skeleton, one page, test harness, repo-local handoff
- Out of scope: content schema, curriculum import, diagrams, quiz, deploy, PWA
- Primary risks: unstable dependency compatibility, Windows browser-test cleanup,
  silent scope expansion
- Verification: lint, Astro check, Vitest, build, Chromium smoke
- Rollback: remove Phase 0 additions; preserve both source Markdown files

### Completed

- Locked an Astro 7.2.0 static baseline.
- Used TypeScript 6.0.3 because `@astrojs/check` does not yet accept TypeScript
  7 through its peer range.
- Added one bilingual-product invariant unit test set.
- Added a minimal zh-TW Phase 0 home page.
- Added hermetic Playwright Headless Shell installation.
- Moved the E2E static server into Playwright global setup/teardown to avoid
  Windows process-tree teardown hangs.
- Completed F001 with full verification.
- Added the repo-local Agent Harness, project brief, feature ledger, progress
  handoff, decisions, verification evidence, acceptance gates, and README.
- Added and exercised Windows init/verify scripts; added shell equivalents.
- Completed F002 with full Windows initialization and verification.

### Verification

- `npm run verify:f001`: PASS
- Lint: PASS
- Typecheck: PASS, zero diagnostics
- Unit: PASS, 2/2
- Static build: PASS, one page
- Chromium smoke: PASS, 1/1
- `scripts/init.ps1`: PASS
- `scripts/verify.ps1`: PASS after fresh initialization
- Shell script syntax/runtime: NOT RUN; WSL launch was denied by the managed
  environment. PowerShell parsing passed for both Windows scripts.

### Content/source evidence

- Rule IDs: none; Phase 0 does not import traffic rules
- Source IDs: none used in production content
- Root page shows only the curriculum research baseline and a recheck warning

### Diagram evidence

- Diagram IDs: none
- Manifest status: not created; diagram features are not active

### Risks / unverified

- GitHub Pages base-path routing is deferred to F022.
- Responsive and accessibility acceptance beyond the minimal smoke are deferred.
- Content schema and effective-date enforcement are deferred to Phase 1.
- The repository has no commit baseline yet.
- `npm ci` emitted a non-fatal Windows EPERM cleanup warning; the fresh install
  and all subsequent verification steps passed.

### Next

F005 passed. No feature is active. Source/Rule, effective-date, and bilingual
lesson contracts are now enforced; Learn UI and diagram assets remain out of scope.

## Session 2026-08-10 — F003

### Completed

- Added strict runtime Source and Rule schemas through `astro/zod`.
- Added localized rule titles and explicit legal/guidance classification.
- Added duplicate-ID, missing-source, and Tier S legal-rule validation.
- Added S03, S10, and JP-RULE-SIGNAL-RED-001 as the minimum valid dataset.
- Added `validate:content` and made it a static-build gate.

### Verification

- `npm run validate:content`: PASS, 2 sources and 1 rule
- `npm run test`: PASS, 2 files and 11 assertions
- `npm run verify`: PASS
- Typecheck: 0 errors, 0 warnings, 0 hints

### Risks / unverified

- The curriculum uses `safety_basics` in Q024 but omits it from the later
  weakness-category table. The rule category accepts it provisionally; F010 must
  resolve the question-tag taxonomy before importing the full seed bank.
- Effective dates are structurally validated, but active/upcoming/expired state
  belongs to F004.

## Session 2026-08-10 — F004

### Completed

- Added deterministic `active`, `upcoming`, and `expired` classification.
- Added explicit `CONTENT_AS_OF_DATE` handling with a UTC build-date fallback.
- Added inclusive boundary coverage for the 2026-09-01 transition.
- Added build output for effective date and status counts.

### Verification

- `npm run test`: PASS, 3 files and 20 assertions
- Default content date: 2026-08-10, PASS
- Explicit content date 2026-09-01: PASS
- `npm run verify`: PASS
- Typecheck: 0 errors, 0 warnings, 0 hints

## Session 2026-08-10 — F005

### Completed

- Added strict Markdown lesson frontmatter and document schemas.
- Added exact module/locale path enforcement and required zh-TW/en pairing.
- Added parity checks for IDs, references, diagrams, quiz tags, order, and review
  status while allowing localized titles and bodies.
- Added Rule reference validation and the minimum M02-signals lesson pair.
- Integrated YAML/Markdown loading into the build-time content gate.

### Verification

- `npm run validate:content`: PASS, 2 sources, 1 rule, 2 lesson documents
- `npm run test`: PASS, 4 files and 26 assertions
- `npm run verify`: PASS
- Typecheck: 0 errors, 0 warnings, 0 hints

### Content/source evidence

- Rule ID: JP-RULE-SIGNAL-RED-001
- Source IDs: S03, S10
- Lesson ID: M02-signals, zh-TW/en pair
- Diagram references: D002, D003, D004 (format/parity only; assets not built)

### Next sequencing risk

The user approved resolving the phase/feature ordering conflict by inserting
F005A Question data contract and F005B Diagram Scene data contract before UI.
F010 now retains only reviewed seed-bank import; F015 retains generator primitives.

## Session 2026-08-10 — F005A

### Completed

- Added strict bilingual single-choice Question schema.
- Added option/answer invariants, Question and option ID uniqueness, Rule
  traceability, category-tag alignment, and production approval gates.
- Added reviewed Q002 tied to JP-RULE-SIGNAL-RED-001 and planned D002.
- Integrated question validation into the build-time content gate.

### Verification

- `npm run validate:content`: PASS, 1 question
- `npm run test`: PASS, 5 files and 34 assertions
- `npm run verify`: PASS
- Typecheck: 0 errors, 0 warnings, 0 hints

### Next

F005B passed. Data-contract prerequisites for the vertical slice now exist. The
next dependency is F015 diagram-generator primitives, limited initially to what
D002 requires; no visual approval may be claimed before manifest/review work.

## Session 2026-08-10 — F005B

### Completed

- Added semantic FourWayIntersection scene schema v1 with canonical 1200×800
  logical canvas.
- Added typed roads, signals, stop lines, crosswalks, vehicles, instructions,
  localized alt text, Rule references, and review status.
- Added D002 as `needs_review`, not an approved asset.
- Added Scene→Rule and Question→Scene traceability to the build gate.

### Verification

- `npm run validate:content`: PASS, 1 diagram scene
- `npm run test`: PASS, 6 files and 42 assertions
- `npm run verify`: PASS
- Typecheck: 0 errors, 0 warnings, 0 hints

### Diagram evidence

- Scene ID: D002
- Schema version: 1.0.0
- Template: FourWayIntersection
- Review status: needs_review
- SVG/output hash/manifest: not created

## Session 2026-08-10 — F006

### Session start

- Active feature: F006 only
- Files read: project brief, feature ledger, progress, decisions, verification,
  acceptance, current page/tests/config, and Phase 2 routing from the build plan
- Scope: reusable Astro base layout, cool Japanese design tokens, responsive
  360px/1440px shell, targeted E2E evidence
- Out of scope: F007/F008 routes/navigation, production diagram output, quiz,
  deployment, and content expansion
- Risks: implementing placeholder product features early, masking overflow, or
  accepting a numerically valid but visually defective desktop layout
- Rollback: restore the prior standalone index page and remove F006-only files

### Completed

- Added reusable `BaseLayout`, `AppHeader`, and `LearningShell` components.
- Added global cool-white, blue-grey, indigo, and teal design tokens based on the
  user-approved demo direction; alert red is not used decoratively.
- Replaced the warm standalone Phase 0 page with a responsive shell while keeping
  all real Home, Fast Track, and Learn features out of scope.
- Added a skip link, semantic header/aside/main/footer landmarks, and responsive
  one/two-column behavior.
- Added F006-specific E2E assertions and screenshot capture at 360×800 and
  1440×1000.
- Found and fixed a desktop footer gap during visual QA; added a regression
  assertion for frame/footer closure.

### Verification

- `npm run verify:f006`: PASS
- `npm run verify`: PASS
- Lint: PASS
- Typecheck: PASS, zero diagnostics
- Unit: PASS, 6 files / 42 assertions
- Content validation/build: PASS, one static route
- F006 Chromium: PASS, 2/2 at 360px and 1440px
- Smoke Chromium: PASS, 1/1

### Content/source evidence

- No traffic-rule content changed.
- Existing JP-RULE-SIGNAL-RED-001 traceability to S03/S10 remains valid.
- The home-page content remains a non-production foundation placeholder.

### Diagram evidence

- D002 remains semantic scene data with `needs_review` status.
- No production SVG, hash, manifest, or approval was created or claimed.

### Risks / unverified

- Locale labels are status indicators, not functioning routes; bilingual route
  behavior remains F007.
- The rail is structural placeholder content, not Full Learn navigation; that
  remains F008.
- Full accessibility acceptance remains F023.
- Screenshots are generated under ignored Playwright `test-results/`; the durable
  evidence is the deterministic E2E assertion and recorded acceptance run.

### Next

Activate F015 next, limited to deterministic primitives required to render D002.
Do not mark D002 approved until F019 hash/manifest review gates exist.

## Session 2026-08-10 — F015

### Session start

- Active feature: F015 only
- Files read: diagram technical specification §11, Scene schema, D002 JSON,
  diagram tests, project/feature/progress/decision/verification/acceptance docs
- Scope: canonical SVG serialization, canvas/stroke geometry guards, and only
  primitives required by D002
- Out of scope: template assembly, `D002.svg`, golden output, manifest/hash,
  lesson integration, and diagram approval
- Risks: deterministic bytes with invalid/clipped geometry, unsafe raw SVG text,
  or reporting a primitive library as a reviewed diagram
- Rollback: remove F015-only geometry/primitives/tests and scripts

### Completed

- Added a canonical 1200×800 geometry module with finite-number, point, bounds,
  positive-size, and stroke-margin enforcement.
- Added a restricted SVG node representation and canonical serializer with
  sorted attributes, three-decimal numeric formatting, and XML escaping.
- Added the D002-required RoadSegment, LaneBoundary, StopLine, Crosswalk,
  TrafficLight, Vehicle, LabelBadge, and DirectionalArrow primitives.
- Added deterministic palette semantics for road, signal, vehicle, marking,
  badge, and instruction states.
- Added a dedicated `verify:f015` acceptance command and 12 focused tests.
- During review, found and closed stroke-clipping and noncanonical arrow-path
  precision gaps before formal acceptance.

### Verification

- `npm run verify:f015`: PASS
- `npm run verify`: PASS
- Lint: PASS
- Typecheck: PASS, zero diagnostics
- Primitive unit: PASS, 1 file / 12 assertions
- Full unit: PASS, 7 files / 54 assertions
- Content validation/build: PASS, one static route
- Smoke Chromium: PASS, 1/1

### Content/source evidence

- No rules, questions, lessons, source metadata, or legal claims changed.
- JP-RULE-SIGNAL-RED-001 continues to trace to S03/S10.

### Diagram evidence

- Primitive code exists and is unit-verified.
- D002 Scene JSON remains unchanged with `needs_review` status.
- SVG output: none.
- Golden/manifest/hash/approval: none.

### Risks / unverified

- Primitive correctness does not prove FourWayIntersection composition
  correctness; that belongs to F016.
- Palette and shape semantics still require template-level visual QA.
- No build-time output writer or immutable asset gate exists yet.

### Next

Activate F016 next. Implement and golden-test template composition, beginning
with T02 FourWayIntersection for the D002 vertical slice; do not bypass the
feature acceptance requirement for T01–T06.

## Session 2026-08-10 — F016

### Session start

- Active feature: F016 only
- Files read: diagram invariants/style/output sections, curriculum diagram
  inventory, F015 primitives/serializer, D002 Scene schema, governance docs
- Scope: full SVG renderer, T01–T06 composition, six canonical goldens, D002 T02
  path, 600px/360px visual review
- Out of scope: production SVG assets, D001–D024 scene import, manifest/hash,
  approval, lessons, and legal-content changes
- Risks: speculative Scene contracts, stable but misleading geometry, color-only
  semantics, and unreadable mobile labels
- Rollback: remove F016-only renderer/templates/golden/tests/scripts

### Completed

- Added an accessible full SVG document renderer with canonical viewBox,
  `title`/`desc`, diagram identity, and deterministic serialization.
- Added T01 StraightRoad, T02 FourWayIntersection, T03 TJunction, T04 Crosswalk,
  T05 RailwayCrossing, and T06 ExpresswayMerge compositions.
- Added six canonical SVG golden fixtures and an explicit update command.
- Added a reusable Chromium capture command for 600px and 360px visual QA.
- Kept unreviewed template inputs internal instead of prematurely expanding the
  production Scene discriminated contract.
- Connected T02 directly to the current validated D002 Scene shape.
- Added fail-fast behavior for T02 semantics not yet supported by reviewed scenes.
- Visual QA found red movement-arrow misuse and rotated/undersized A/B labels;
  movement arrows now use neutral road-marking tone, while labels remain upright
  and meet the 360px logical-size threshold.

### Verification

- `npm run verify:f016`: PASS
- `npm run verify`: PASS
- Lint: PASS
- Typecheck: PASS, zero diagnostics
- Template golden tests: PASS, 1 file / 8 assertions
- Full unit: PASS, 8 files / 63 assertions
- Six templates visually reviewed at 600px and 360px
- Content validation/build: PASS, one static route
- Smoke Chromium: PASS, 1/1

### Content/source evidence

- No Source, Rule, Question, or Lesson records changed.
- T02 uses D002 alt text and JP-RULE-SIGNAL-RED-001 remains traceable to S03/S10.
- Other template goldens are geometry fixtures, not legal teaching scenes.

### Diagram evidence

- Golden templates: T01–T06 exist and match deterministic output.
- D002-compatible T02 output is covered by golden and semantic assertions.
- Production SVG output: none.
- Manifest/hash/approval: none.
- D002 review status remains `needs_review`.

### Risks / unverified

- T02 intentionally rejects green arrows, flashing signals, non-stop
  annotations, and non-`before_stop_line` actors until reviewed scenes define
  correct geometry.
- T01/T03/T04/T05/T06 typed inputs are internal geometry fixtures, not production
  Scene schema contracts.
- Visual capture images are transient QA output under ignored `test-results/`.
- Template invariants do not yet include vehicle collision/path polygon analysis.

### Next

The vertical slice now has a deterministic D002-compatible template but no
immutable asset. Before F020 integration, implement the narrow F019 manifest/hash
review gate or explicitly split out a D002 build/output subfeature; do not publish
the golden as the production asset.

## Session 2026-08-10 — F019

### Session start

- Active feature: F019 only
- Files read: generator immutability/accessibility/validator specification,
  current build scripts, D002 Scene/renderer, F016 governance and evidence
- Scope: canonical hashes, versioned manifest, D002 review candidate, drift gate,
  hash-change review reset
- Out of scope: automatic approval, `public/diagrams`, F017, D001–D024 bulk
  assets, lesson integration
- Risks: stale manifest acceptance, approval surviving generator/output drift,
  or unapproved assets entering the production path
- Rollback: remove F019-only files/scripts and restore the previous build command

### Completed

- Added canonical JSON hashing for Scene data and byte hashing for SVG output.
- Added a versioned strict manifest schema with coherent approval-date rules.
- Added reconciliation that preserves approval only when Scene, output, path,
  template, and generator identity remain unchanged and the Scene is approved.
- Added explicit approval API that refuses approval before Scene approval.
- Added D002 candidate generation under a non-production review directory.
- Added build-time `diagrams:check` for manifest/candidate/hash consistency and
  unmanaged review artifacts.
- Confirmed the gate fails before initial manifest generation.
- Confirmed rebuilding D002 produces byte-identical manifest and SVG hashes.
- Fixed a version-migration defect so old generator versions can be read and
  correctly demoted to `needs_review`.
- Extended capture tooling to render review candidates at 600px and 360px.

### Verification

- `npm run verify:f019`: PASS
- `npm run verify`: PASS
- Manifest unit: PASS, 1 file / 10 assertions
- Full unit: PASS, 9 files / 73 assertions
- `npm run diagrams:check`: PASS, 1 candidate / 0 approved
- Deterministic rebuild: PASS; manifest and candidate bytes unchanged
- D002 visual QA: PASS at 600px and 360px
- Typecheck: PASS, zero diagnostics
- Content validation/build and Chromium smoke: PASS

### Content/source evidence

- No Source, Rule, Question, Lesson, or legal claim changed.
- D002 remains tied to JP-RULE-SIGNAL-RED-001 and S03/S10 through existing data.

### Diagram evidence

- Candidate: `tools/diagram-generator/review/D002.svg`
- Scene hash: `sha256:596d7ac1ea03f2d1d99e46d5c623ee4879737a60b98fb6f8527f1c7ca3b20bd9`
- Output hash: `sha256:1978664f8d0ca1b4f2f9b170c864ead2c25293444cfae613b7206774409a7b18`
- Generator version: 1.0.0
- Scene status: `needs_review`
- Manifest status: `needs_review`
- Public/production asset: none

### Risks / unverified

- Agent visual QA is not human content approval.
- Build currently gates candidate/hash consistency, not approval, because the
  candidate is not used by a production page. F020 must require approved Scene,
  approved manifest, and promoted public asset.
- No before/after review UI exists; one candidate is small enough for direct
  review, but batch review remains future work.

### Next

Human review is now the blocking control for the D002 vertical slice. Do not
activate F020 or publish D002 until the user approves the current candidate;
approval must update both Scene and manifest state before promotion.

## Session 2026-08-10 — F019A

### Session start

- Active feature: F019A only
- Files read: project governance, F019 Scene/manifest/generator, S03/S10 source
  records, National Police Agency reuse terms, and the official S10 PDF
- Scope: official-first regulated visuals, exact NPA red-light import,
  provenance/hash gate, D002 regeneration, approval/promotion command
- Out of scope: bulk sign download, D001–D024 expansion, F020 lesson integration,
  third-party photos, and specification-derived redraws
- Risks: treating government-hosted third-party material as reusable, silent
  upstream PDF drift, or retaining stale public SVGs after approval invalidation
- Verification: exact PDF-object extraction, SHA-256/dimension checks, 600px and
  360px capture, targeted F019A verification, then full verification
- Rollback: remove the imported NPA asset/provenance loader and F019A scripts,
  restore generator 1.0.0/T02 golden/candidate, keep D002 `needs_review`

### Completed so far

- Verified the National Police Agency site terms: content is generally reusable
  under Public Data License 1.0 unless excluded, with attribution, edit
  disclosure, non-endorsement, and third-party-rights controls.
- Downloaded S10 from the National Police Agency and inspected all 16 pages.
- Extracted the page-1 red-light object `/Image25` as exact embedded PNG bytes;
  no crop, recolor, tracing, or generative image processing was applied.
- Added a strict provenance record, PNG checksum/dimension validation, and an
  official-asset SVG primitive that refuses state relabelling.
- Changed D002 from a project-drawn vertical signal to the official NPA
  horizontal red-light image while preserving deterministic SVG output.
- Included official-asset provenance in diagram identity and advanced generator
  version to 1.1.0.
- Added `diagrams:approve`, which updates Scene/manifest approval together and
  writes a byte-identical public SVG only after consistency checks pass.
- Extended `diagrams:check` to reject missing, drifting, or unapproved public
  assets.

### Current review state

- The user approved the prior D002 layout on 2026-08-10.
- That approval was invalidated by the requested official-asset substitution;
  the new output has a different hash and remains `needs_review`.
- Candidate: `tools/diagram-generator/review/D002.svg`
- Scene/provenance hash:
  `sha256:48f7943ab3b9739b2c40ea7d662c6ab114ed08143d23246d3371201073084346`
- Output hash:
  `sha256:d76dfc5b49333dcb5d6fd5b8b9955e9834d1159a4b061dcff333f0422aea0046`
- Generator: 1.1.0
- Public asset: none

### Verification so far

- `npm run verify:f019a`: PASS
- Typecheck: PASS, zero diagnostics/hints
- Primitive tests: PASS, 14 assertions
- Template tests: PASS, 8 assertions
- Manifest tests: PASS, 10 assertions
- Official asset test: PASS
- `npm run diagrams:check`: PASS, 1 candidate / 0 approved
- D002 capture: inspected at 600px and 360px; official signal remains legible
- Unapproved public-asset negative check: EXPECTED FAIL; gate rejected the file
  and the temporary test artifact was removed
- `npm run verify`: PASS, 10 unit files / 75 assertions, content/diagram gates,
  static build, and Chromium smoke

### Next

Obtain human confirmation of the regenerated D002 bytes. Then run
`npm run diagrams:approve -- D002 2026-08-10`, verify the public byte match, mark
F019A passing, and activate F020.

### Approval completion

- User confirmation: received 2026-08-10
- `npm run diagrams:approve -- D002 2026-08-10`: PASS
- Scene status: `approved`
- Manifest status: `approved`; reviewedAt `2026-08-10`
- Public asset: `public/diagrams/D002.svg`
- Candidate/public SHA-256:
  `d76dfc5b49333dcb5d6fd5b8b9955e9834d1159a4b061dcff333f0422aea0046`
- `npm run diagrams:check`: PASS, 1 candidate / 1 approved
- F019A status: passing

## Session 2026-08-10 — F020

### Session start

- Active feature: F020 only
- Files to read: F020 build-plan routing, M02 zh-TW/en lesson documents, Q002,
  D002 manifest/public SVG, current Astro layout/styles, and E2E conventions
- Scope: bilingual M02 lesson routes, approved D002 integration, Q002 learning
  checkpoint, shared Rule/Question/Diagram identity, mobile readability
- Out of scope: full Learn navigation, quiz session engine, weakness analyzer,
  bulk curriculum import, deployment, and hosting
- Risks: bilingual drift, unapproved diagram consumption, mobile SVG/text
  illegibility, and legal/guidance presentation ambiguity
- Verification: content and diagram gates, typecheck, unit, static route build,
  bilingual route E2E, 360px readability assertions, and full verification
- Rollback: remove F020 routes/components/tests and restore feature state;
  approved D002 remains an independently valid F019A asset

### Completed

- Added bilingual static lesson routes at `/zh-TW/learn/signals/` and
  `/en/learn/signals/` with real language-switch links.
- Added a shared SignalLessonPage that parses and enforces approved M02, Rule,
  D002 Scene/manifest, and Q002 dependencies during static generation.
- Embedded the approved public D002 asset with localized alternative text and a
  clear disclosure that the traffic-light face is the exact NPA asset.
- Rendered the reviewed lesson Markdown and a non-interactive Q002 checkpoint
  preview without introducing quiz session state or answer feedback early.
- Extended the existing cool Japanese design system for lesson metadata,
  diagram framing, readable instructional copy, and responsive checkpoint cards.
- Localized skip-link, header subtitle, language label, and learning-rail label.

### Verification

- `npm run verify:f020`: PASS
- `npm run test:e2e:f020`: PASS, 3/3
- `npm run verify`: PASS
- Lint: PASS
- Typecheck: PASS, zero diagnostics/hints
- Unit: PASS, 10 files / 75 assertions
- Content validation: PASS, 2 sources / 1 Rule / 2 lesson documents / 1
  Question / 1 approved Scene
- Diagram gate: PASS, 1 candidate / 1 approved
- Static build: PASS, 3 routes
- Chromium smoke: PASS, 1/1

### Content/source evidence

- Lesson: M02-signals, zh-TW/en
- Rule: JP-RULE-SIGNAL-RED-001, classification `legal_rule`
- Question: Q002, localized prompt/options only; answer behavior remains deferred
- Source IDs: S03 and S10, unchanged legal meaning

### Diagram evidence

- Diagram: D002
- Scene/manifest: approved
- Public asset: `public/diagrams/D002.svg`
- Page image uses localized alt text and passed 3:2 SVG load checks

### Residual risks / out of scope

- Q002 does not accept or score answers yet; that belongs to F011/F012.
- No weakness result exists; that belongs to F013.
- The homepage does not yet expose the lesson as a user journey; F007 remains
  not started.
- No hosting or GitHub Pages work was performed; F022 remains not started.

### Next

Activate F011 next to implement the deterministic single-question quiz session
engine for Q002. Then F012 can add immediate explanations and F013 can produce
the first weakness result, completing the Phase 2 vertical slice.

## Session 2026-08-10 — F011

### Session start

- Active feature: F011 only
- Files read: Quiz Engine and Question Selection plan sections, Q002 schema/data,
  F020 handoff, project constraints, and current Vitest conventions
- Scope: pure QuizSession state, unique question order, answer submission,
  correctness result, guarded advance, and completion state
- Out of scope: UI island, answer explanation, scoring presentation, weakness
  calculation, persistence, account identity, analytics, and deployment
- Risks: duplicate answers overwriting history, skipping unanswered questions,
  accepting unknown options, mutating input/session objects, or changing a
  completed session
- Verification: focused unit tests, lint, typecheck, content/diagram gates,
  static build, and full smoke verification
- Rollback: remove `src/lib/quiz`, F011 tests/scripts, and this state transition;
  Q002 and the F020 lesson pages remain unchanged

### Completed

- Added an immutable QuizSession domain model matching the planned
  `questionIds`, `currentIndex`, `answers`, and `results` state.
- Added deterministic creation from an explicit reviewed Question order; no
  random selection, network state, identity, or persistence was introduced.
- Added answer submission that verifies the current Question, option membership,
  approval status, duplicate submission, and correctness without mutating the
  previous session.
- Added guarded progression: an unanswered Question cannot advance; completion
  occurs only after the final answered Question advances to the terminal index.
- Added invariant validation that rejects skipped/future answers, answer/result
  key drift, invalid result values, duplicate IDs, and incomplete terminal state.
- Added stable QuizSessionError codes for later UI behavior without coupling the
  engine to localized copy.

### Verification

- `npm run verify:f011`: PASS
- Focused unit: PASS, 1 file / 8 tests
- `npm run verify`: PASS
- Lint: PASS
- Typecheck: PASS, zero diagnostics/hints
- Full unit: PASS, 11 files / 83 assertions
- Content validation: PASS
- Diagram gate: PASS, 1 candidate / 1 approved
- Static build: PASS, 3 routes
- Chromium smoke: PASS, 1/1

### Content/source evidence

- Q002 is used as the real approved fixture.
- No Question, Rule, Source, Lesson, explanation, or legal meaning changed.

### Diagram evidence

- No diagram change; approved D002 and its hash remain unchanged.

### Residual risks / out of scope

- No interactive quiz UI consumes the engine yet.
- Explanations are intentionally not emitted by the engine; F012 owns that UI.
- Score and weakness aggregation remain F013/F014 scope.
- Session storage remains optional and was not added.

### Next

Activate F012 to connect Q002 to the F011 engine in a small client interaction
and show the reviewed localized explanation immediately after one answer.

## Session 2026-08-10 — F012

### Session start

- Active feature: F012 only
- Files read: F011 quiz engine, approved Q002 data, Signal lesson component,
  checkpoint styles, Playwright coverage, and current feature/progress state
- Scope: accessible single-question interaction for Q002, immutable first-answer
  submission, immediate correctness feedback, and the approved localized
  explanation
- Out of scope: score, weakness analysis, multi-question navigation,
  persistence, new dependencies, analytics, hosting, and deployment
- Risks: server/client question drift, duplicate submission, inaccessible
  feedback state, or accidental changes to approved legal content
- Verification: focused bilingual E2E, lint, typecheck, unit tests, static build,
  content/diagram gates, and the full project verification
- Rollback: restore the static checkpoint markup and remove the F012 client
  controller, styles, tests, and scripts; retain the passing F011 engine

### Completed

- Replaced the Q002 static preview with a bilingual accessible single-choice
  form on both Signal lesson routes.
- Connected the form to the passing F011 immutable QuizSession engine without
  adding a framework, dependency, persistence layer, or runtime service.
- Locked the first submitted answer and disabled further changes so later
  weakness analysis receives an unambiguous first-attempt result.
- Added immediate localized correct/incorrect status and rendered the unchanged
  approved Q002 explanation in a focused status region.
- Marked the learner's selection and the correct option as explicit DOM state;
  visual treatment does not rely on color alone.
- Added bilingual and 360px Playwright coverage plus dedicated F012 commands.

### Verification

- Initial `npm run verify:f012`: EXPECTED FAIL in E2E only because the test
  attempted to pointer-click the visually hidden radio rather than its visible
  label; implementation lint, typecheck, 83 unit assertions, content/diagram
  gates, build, and the mobile test passed.
- `npm run test:e2e:f012` after correcting the interaction path: PASS, 3/3.
- `npm run verify:f012`: PASS.
- `npm run verify`: PASS.
- Lint: PASS.
- Typecheck: PASS, zero errors, warnings, or hints.
- Full unit: PASS, 11 files / 83 assertions.
- Content validation: PASS, 1 approved Question and existing traceability.
- Diagram gate: PASS, 1 candidate / 1 approved.
- Static build: PASS, 3 routes.
- Chromium smoke: PASS, 1/1.

### Content/source evidence

- Q002 prompt, answer B, explanation, Rule IDs, Source IDs, and review status
  were not edited.
- The client payload is serialized only after the server build parses Q002 and
  verifies M02, D002, Q002, and Rule approval/alignment.

### Diagram evidence

- No Scene, manifest, official asset, candidate, public SVG, hash, generator, or
  approval state changed; D002 remains approved.

### Residual risks / out of scope

- The answer exists only for the current page lifetime; persistence was not
  approved and remains intentionally absent.
- Score, weakness classification, review navigation, and multi-question flow do
  not exist yet.
- Full accessibility audit remains F023; F012 covers native semantics, keyboard
  controls, focus feedback, textual status, and minimum touch-target size.
- Hosting and GitHub Pages remain F022.

### Next

Activate F013 to derive a deterministic weakness result from the F011 answer
state. Keep aggregation separate from localized presentation and persistence.

## Session 2026-08-10 — F013

### Session start

- Active feature: F013 only
- Files read: Weakness Algorithm plan, curriculum weakness categories, Question
  schema, F011 session engine/tests, F012 handoff, and current verification
  conventions
- Scope: deterministic per-tag correct/answered aggregation for answered
  Questions, exact 0.80/0.60 band boundaries, one-answer limited-sample state,
  canonical tag order, and fail-closed input alignment
- Out of scope: result UI, precise-percentage presentation, review links,
  persistence, sessionStorage, question-bank expansion, analytics, hosting, and
  deployment
- Risks: unanswered Questions entering the denominator, multi-tag counting
  drift, floating-boundary errors, missing Question records being ignored, or
  overclaiming confidence from one answer
- Verification: focused boundary/negative unit tests, lint, typecheck, content
  and diagram gates, static build, smoke E2E, and full project verification
- Rollback: remove the weakness domain module, F013 tests/scripts, and this state
  transition; retain the passing F011/F012 quiz flow

### Completed

- Added a framework-free weakness domain module that consumes a validated
  QuizSession and reviewed Question records.
- Aggregated each answered Question once per unique tag; unanswered Questions
  do not enter the denominator.
- Implemented the reviewed thresholds: `>=0.80` strong, `>=0.60` review, and
  lower ratios priority review.
- Added explicit `limited` sample state for a tag with exactly one answered
  Question; the raw ratio remains domain data, not a UI instruction to show an
  over-precise percentage.
- Returned immutable results in the canonical curriculum category order,
  independent of Question or tag input order.
- Rejected duplicate/missing Question records, unapproved Questions, invalid or
  duplicate tag data, and invalid QuizSession state instead of silently
  producing a partial analysis.

### Verification

- `npm run verify:f013`: PASS.
- Focused weakness unit: PASS, 1 file / 7 tests.
- `npm run verify`: PASS.
- Lint: PASS.
- Typecheck: PASS, zero errors, warnings, or hints.
- Full unit: PASS, 12 files / 90 assertions.
- Content validation: PASS, existing 1 Question and traceability unchanged.
- Diagram gate: PASS, 1 candidate / 1 approved.
- Static build: PASS, 3 routes.
- Chromium smoke: PASS, 1/1.

### Content/source evidence

- Curriculum weakness categories and thresholds were implemented without
  changing Q002, its Rule/Source IDs, legal meaning, or explanation.
- Q002 correct maps deterministically to `signals / strong / limited`; Q002
  incorrect maps to `signals / priority_review / limited`.

### Diagram evidence

- No Scene, manifest, official asset, SVG, hash, generator, approval, or public
  diagram state changed; D002 remains approved.

### Residual risks / out of scope

- F013 calculates results but does not render them; user-visible weakness
  feedback and review navigation remain F014.
- A one-Question result is intentionally low confidence. Content expansion must
  add reviewed Questions before percentage presentation becomes meaningful.
- No persistence, identity, analytics, score presentation, or sessionStorage was
  added.
- Hosting and GitHub Pages remain F022.

### Next

Activate F014 to expose the F013 result after Q002 feedback, using a localized
limited-sample message and a review link back to M02 without displaying a
misleading `100%` or `0%` headline.

## Session 2026-08-10 — F014

### Session start

- Active feature: F014 only
- Files read: F011 controller, F012 feedback UI/E2E, F013 analyzer/tests, Q002
  and M02 bilingual data, weakness presentation rules, and current Playwright
  conventions
- Scope: an explicit post-explanation result transition, completed one-Question
  session, localized limited-sample recommendation, and same-locale review link
  back to M02
- Out of scope: total score, exact percentages, multi-Question results,
  multi-module recommendations, persistence, question-bank expansion,
  analytics, hosting, and deployment
- Risks: claiming mastery from one correct answer, result focus interrupting the
  immediate explanation, locale-link drift, or duplicating F013 calculations in
  UI code
- Verification: zh-TW incorrect and en correct E2E, result focus/link targets,
  absence of `100%`/`0%` claims, 360px target/layout checks, lint, typecheck,
  unit/content/diagram/build gates, and full verification
- Rollback: remove the result trigger/panel, controller transition, F014
  styles/tests/scripts, and this state transition; retain F011–F013

### Completed

- Added a two-stage post-answer flow: F012 explanation remains the first focused
  response, then an explicit action opens the F014 review result.
- Used the guarded F011 advance transition to complete the one-Question session
  before requesting the F013 analysis; UI code does not calculate its own ratio
  or weakness band.
- Added localized `signals` result presentation for correct and incorrect Q002
  outcomes while preserving the `limited` confidence state.
- Suppressed exact percentage claims for the one-Question sample and avoided
  wording that equates one correct answer with mastery.
- Added same-locale links back to the `M02-signals` lesson anchor.
- Added explicit DOM evidence for session completion, tag, band, and sample, plus
  result focus and 44px action targets.
- Completed the planned Phase 2 chain from S03/Rule through M02, D002, Q002,
  immediate explanation, and weakness result.

### Verification

- `npm run verify:f014`: PASS.
- Focused F014 E2E: PASS, 3/3.
- `npm run verify`: PASS.
- Full `npm run test:e2e`: PASS, 12/12.
- Lint: PASS.
- Typecheck: PASS, zero errors, warnings, or hints.
- Full unit: PASS, 12 files / 90 assertions.
- Content validation: PASS, 1 approved Question and existing traceability.
- Diagram gate: PASS, 1 candidate / 1 approved.
- Static build: PASS, 3 routes.
- Chromium smoke: PASS, 1/1.

### Content/source evidence

- No Question, explanation, Rule, Source, Lesson body, effective date, or legal
  meaning changed.
- Result labels are learning-state presentation, not new legal guidance.

### Diagram evidence

- No Scene, manifest, official asset, SVG, hash, generator, approval, or public
  diagram state changed; D002 remains approved.

### Residual risks / out of scope

- The current result is intentionally based on one Question and must remain
  labelled limited until reviewed content expansion provides more evidence.
- No aggregate score, multi-tag result screen, multi-module recommendation,
  persistence, identity, analytics, or sessionStorage exists.
- The passing vertical slice is reachable by its lesson routes, but the home
  page does not yet expose a bilingual Fast Track journey.
- Hosting and GitHub Pages remain F022.

### Next

Activate F007 to make the passing vertical slice discoverable through a
bilingual Home + Fast Track entry without expanding legal content. Defer F008
full Learn navigation until additional approved modules exist.

## Session 2026-08-10 — F007

### Session start

- Active feature: F007 only
- Files read: root home, BaseLayout, LearningShell, AppHeader, M02 bilingual
  routes, global styles, current E2E, and remaining feature state
- Scope: `/zh-TW/` and `/en/` homes, bilingual Fast Track entry pages, locale
  parity, and direct discovery of the passing M02 vertical slice
- Out of scope: new legal content, unapproved lessons, full Learn navigation,
  question-bank expansion, persistence, analytics, hosting, and deployment
- Risks: locale switches losing equivalent destinations, entry copy overstating
  current approved coverage, or card/CTA overflow at 360px
- Verification: bilingual route/link E2E, 360px assertions, lint, typecheck,
  unit/content/diagram/build gates, full smoke, and regression verification
- Rollback: remove F007 components/routes/styles/tests/scripts and restore the
  foundation root home; retain M02 and the passing vertical slice

### Completed

- Replaced the internal foundation homepage with a neutral language gateway.
- Added equivalent zh-TW/en product homes and Fast Track routes.
- Added direct same-locale entry to the passing M02 Signals lesson.
- Made the current reviewed scope explicit: one lesson and one scenario; no
  unapproved curriculum was presented as available.
- Updated header brand links to return to the current locale home.
- Added responsive, keyboard-visible 44px actions and F007 browser coverage.

### Verification

- `npm run verify:f007`: PASS, 4/4 focused E2E.
- `npm run verify`: PASS.
- Lint/typecheck: PASS, zero diagnostics.
- Unit: PASS, 12 files / 90 assertions.
- Content/diagram gates: PASS.
- Static build: PASS, 7 routes.
- Chromium smoke: PASS, 1/1.

### Residual risks / out of scope

- Fast Track contains only M02 until content expansion is reviewed.
- Full Learn navigation remains F008.
- No new legal content, diagrams, persistence, hosting, or deployment was added.

### Next

Activate F010 to import the reviewed seed Question bank and its required Rule
metadata before expanding Learn navigation.

## Session 2026-08-10 — F010

### Completed

- Imported Q001–Q024 from the approved curriculum into one validated bilingual
  seed catalog with options, answers, explanations, tags, difficulty, Rule IDs,
  and review status.
- Expanded Source metadata from 2 to 17 curriculum Sources and Rule metadata
  from 1 to 21 scoped behavior records.
- Split legal rules, official guidance, and practical advice instead of using a
  single category-wide classification.
- Preserved the 2026-09-01 local-road speed change as an upcoming Rule at the
  build's explicit 2026-08-10 content date.
- Added a shared typed catalog consumed by M02 and unit tests.
- Allowed validator directories to contain catalog arrays while preserving
  duplicate-ID and cross-reference gates.
- Deferred non-D002 question diagram IDs until reviewed F018 Scenes exist.

### Verification

- `npm run verify:f010`: PASS, 5/5 focused tests.
- `npm run verify`: PASS.
- Lint/typecheck: PASS, zero diagnostics.
- Full unit: PASS, 13 files / 95 assertions.
- Content validation: PASS, 17 Sources / 21 Rules / 24 Questions / 2 lesson
  documents / 1 Scene.
- Rule effectivity: 20 active / 1 upcoming / 0 expired.
- Diagram gate and 7-route build: PASS.
- Chromium smoke: PASS.

### Residual risks / out of scope

- Seed explanations are structured from the approved curriculum but still
  require F025 production-source revalidation before release.
- Only Q002 is currently rendered; multi-Question selection and full result UI
  remain later product work.
- Diagram relationships other than D002 await F018 reviewed assets.

### Next

Activate F008 to build shared bilingual Learn navigation and approved curriculum
pages from the Rule catalog, without waiting for diagram expansion.

## Session 2026-08-10 — F008

### Completed

- Added the complete 16-module bilingual Learn structure from approved curriculum
  Markdown, with shared IDs, slugs, order, and locale-equivalent destinations.
- Added generic static lesson rendering while preserving M02's specialized
  diagram and checkpoint integration.
- Added bilingual Learn indexes, a 16-step lesson rail, and previous/index/next
  navigation without client-side routing.
- Added eligibility/document and adverse-weather Rules needed to keep every
  module's content traceable rather than embedding untracked advice.
- Kept the 2026-09-01 speed transition explicit in content; no client clock or
  silent law switching was introduced.

### Verification

- Lint/typecheck: PASS, zero diagnostics.
- Unit: PASS, 13 files / 95 assertions.
- Content: PASS, 17 Sources / 23 Rules / 32 lesson documents / 24 Questions /
  1 Scene; 22 active / 1 upcoming / 0 expired.
- Diagram gate: PASS, 1 candidate / 1 approved.
- Static build: PASS, 39 routes.
- `npm run test:e2e:f008`: PASS, 3/3 focused cases.

### Residual risks / out of scope

- F009 still owns official Essential Signs assets and the curated sign-card UI.
- Only D002 is production-approved; scenario expansion remains F017/F018.
- Production sources still require F025 release-date revalidation.

### Next

Activate F009. Acquire only Japanese-authority sign artwork with source, rights,
checksum, and extraction provenance; do not redraw regulated sign faces.

## Session 2026-08-10 — F009

### Completed

- Revalidated the current 16-page NPA sign PDF and the NPA/MLIT reuse terms.
- Extracted nine exact NPA sign image objects without visual modification and
  added the exact MLIT 207-A railway-crossing GIF.
- Added 10 bilingual tourist-priority cards: stop, slow, no entry, one way,
  parking restrictions, maximum speed, no U-turn, pedestrian crossing, railway
  crossing, and ETC-only.
- Added per-asset source, terms, dimensions, extraction, attribution, and SHA-256
  records plus a reproducible NPA PDF extractor with a source-document hash gate.
- Refused to copy or redraw the NEXCO ETC image because current NEXCO terms allow
  individual download but prohibit reposting on another website; linked the
  official toll-gate guide instead.

### Verification

- Lint/typecheck: PASS, zero diagnostics.
- Unit: PASS, 14 files / 98 assertions; all 10 served asset hashes match metadata.
- Content: PASS, 18 Sources / 26 Rules / 32 lesson documents / 24 Questions /
  1 Scene; 25 active / 1 upcoming / 0 expired.
- Diagram gate and 39-route static build: PASS.
- `npm run test:e2e:f009`: PASS, 3/3 focused cases.

### Residual risks / out of scope

- Source URLs can change and still require F025 release revalidation.
- The 50 km/h sign is explicitly labelled as an example, not a universal limit.
- Scenario templates and additional reviewed diagram assets remain F017/F018.

### Next

Activate F017 and extend deterministic scenario composition templates T07–T12;
regulated sign/light faces continue to require official assets.

## Session 2026-08-10 — F017

### Completed

- Added T07–T12 with byte-stable SVG output and expanded the golden registry to
  the complete 12-template architecture set.
- Added a deterministic bounded cyclist actor for T12; it is scenario composition,
  not a regulated traffic-control reproduction.
- Marked toll-lane labels as schematic-not-sign and kept T10 free of any redrawn
  one-way sign face.
- Reviewed all six new templates at 600px and 360px. Corrected T08 label fit,
  T11 contrast, and a material T12 lane-placement error found during visual QA.

### Verification

- `npm run verify:f017`: PASS.
- Typecheck: zero errors, warnings, or hints.
- Diagram primitives: 15/15; template golden suite: 17/17.
- `npm run capture:diagram-golden`: PASS, 24 images for 12 templates × 2 widths.

### Residual risks / out of scope

- Goldens validate determinism and visual legibility, not legal approval.
- T08 is a neutral schematic and must not be presented as an official lane sign.
- F018 still owns semantic Scene contracts, production candidates, diagram IDs,
  official control assets, and review state.

### Next

Activate F018. Import D001–D024 semantic scenes against the smallest compatible
templates, generate review candidates, and keep every unreviewed output outside
`public/diagrams`.

## Session 2026-08-10 — F018

### Completed

- Added semantic D001–D024 Scene coverage with bilingual alt text and Rule IDs.
- Added exact NPA green-arrow and flashing-signal assets with extraction scripts,
  checksums, source objects, terms, and build identity participation.
- Reused exact F009 NPA/MLIT sign assets for regulated faces; ETC remains a
  clearly marked schematic because NEXCO republication rights are unavailable.
- Staged 12 curriculum Question/Diagram relationships in a review artifact while
  leaving only the approved Q002/D002 relation active in the product catalog.
- Inspected 48 captures and corrected missing actors, railway blocking geometry,
  ambiguous movement color, and toll-lane differentiation.

### Verification

- `npm run verify:f018`: PASS; 6 focused tests and zero type diagnostics.
- `npm run validate:content`: PASS; 18 Sources, 29 Rules, 32 lessons, 24
  Questions, and 24 Scenes; 28 active Rules and 1 upcoming Rule.
- `npm run diagrams:check`: PASS; 24 candidates, 1 approved/public.
- `npm run capture:diagram-review`: PASS; 48 images at 600px and 360px.

### Residual risks / out of scope

- D001 and D003–D024 are review candidates, not production diagrams. They remain
  outside `public/diagrams` and approved Question flows until human review.
- NEXCO ETC imagery remains link-only; toll diagrams disclose schematic status.

### Next

Activate F021 and expose verified dates, Source IDs, official links, evidence
tier, and legal/guidance/advice distinctions in a bilingual traceability surface.

## Session 2026-08-10 — F021

### Completed

- Added bilingual content-transparency routes and an all-page footer entry.
- Exposed all Source IDs, authorities, tiers, URLs, checked dates, and supported
  Rule counts without translating or altering official publication titles.
- Grouped every reviewed Rule under legal rule, official guidance, or practical
  advice, including IDs, Source IDs, and explicit effective dates where present.
- Added a warning that the guide is not legal advice and that a reachable link
  does not establish unchanged source content.

### Verification

- `npm run verify:f021`: PASS.
- Unit: 3/3 traceability derivation and completeness checks.
- E2E: 3/3 bilingual, footer, 360px, and touch-target checks.
- Build: 41 static pages; content and diagram gates pass.

### Residual risks / out of scope

- External publishers can change URLs or content after the recorded checked date;
  F025 still owns release revalidation.

### Next

Activate F022. Add a base-path-safe static build, GitHub Pages workflow, and
deployment smoke tests without assuming a repository name or remote exists.

## Session 2026-08-10 — F022

### Completed

- Centralized all internal route and locally served asset paths behind Astro's
  build base URL.
- Added root-path and repository-subpath compatible static serving and checks.
- Added a least-privilege GitHub Pages workflow using current official Pages
  artifact/deployment actions and dynamic repository-name base selection.

### Verification

- `npm run verify:f022`: implementation PASS.
- Base artifact: 41 HTML files / 906 root-relative references resolve under the
  simulated `/japan-driving-guide/` project path.
- Chromium: project-path navigation, 16 lessons, 10 official sign images, and
  D002 all load.

### Blocker

- No Git remote exists. Repository ownership, visibility, and Pages access level
  cannot be inferred safely; therefore no live Pages URL or deployment-run
  evidence exists and F022 remains `blocked`.

### Next

Activate F023 and complete the full mobile/accessibility audit while preserving
the deployment-ready artifact.

## Session 2026-08-10 — F023

### Completed

- Audited every static route for mobile containment, semantic landmarks, heading
  hierarchy, unique IDs, language metadata, and image alternative attributes.
- Tested representative surfaces at the four release viewports: 360×800,
  390×844, 768×1024, and 1440×900.
- Corrected muted-text contrast, global keyboard focus visibility, root-page
  language semantics, skip-target focus, 44px header/language/navigation targets,
  and the reduced-motion fallback.
- Exercised skip navigation and the scenario checkpoint entirely by keyboard.

### Verification

- `npm run verify:f023`: PASS.
- Unit: 6/6 accessibility token and contrast assertions.
- Chromium: 8/8 F023 cases, including all 41 routes and 44px target measurement.
- Lint/typecheck/build: PASS; 41 static pages, zero diagnostics.

### Residual risks / out of scope

- Automated checks do not constitute a formal third-party WCAG certification.
- F022 remains externally blocked on a repository and live Pages target.

### Next

Activate F024. Add a base-path-safe install manifest and deterministic offline
cache without introducing a backend or masking unavailable external sources.

## Session 2026-08-10 — F024

### Completed

- Added a base-aware web app manifest, install icon, and service worker.
- Added deterministic build-time cache identity and precached the complete static
  learning surface, approved local visuals, and 24-Question offline bank.
- Used network-first navigation so online users receive the current release;
  cached pages remain available when the network fails.
- Added an honest bilingual fallback for uncached routes and explicitly left
  external official sources network-dependent.

### Verification

- `npm run verify:f024`: PASS.
- Unit regression: 17 files / 124 tests.
- PWA checker: 58 URLs and 24 Questions pass at root and project base paths.
- Chromium: 2/2 real offline cases; lesson diagram and checkpoint remain usable.

### Residual risks / out of scope

- A service worker requires HTTPS in production; localhost is the browser's
  development exception. F022 live HTTPS deployment remains externally blocked.
- Offline content reflects the last installed release and cannot prove current
  external law; the online network-first policy reduces but cannot erase that risk.

### Next

Activate F025. Re-open every official Source, recheck the release-sensitive
claims and rights terms, then freeze an explicit reviewed content date.

## Session 2026-08-10 — F025 and release closeout

### Completed

- Re-opened and reviewed all 18 previously registered official Sources and their
  applicable reuse terms; added S19 because it directly supports the missed-exit
  recovery instruction better than the earlier generic NEXCO source.
- Recorded one evidence row per Source in `source-revalidation.json` and the
  human-readable release review report.
- Split cyclist passing into a legal Rule for the statutory safe-distance/speed
  duty and a separate official-guidance Rule for numerical clearance guidance.
- Replaced implicit build-clock release semantics with explicit release,
  content-as-of, and revalidation dates.
- Corrected the public source-coverage date to use the oldest reviewed record,
  so one fresh record can no longer mask stale coverage.
- Added release-sensitive unit tests, refreshed deployment CI triggers/checks,
  and corrected stale E2E expectations exposed by the full release run.
- Refreshed the README as an operational release handoff.
- Packaged the verified `dist/` output as the static release ZIP and started a
  localhost HTTP preview so delivery does not depend on blocked `file://` access.

### Verification

- `npm run verify:release`: PASS.
- Lint: PASS.
- Typecheck: PASS, zero diagnostics.
- Unit: PASS, 18 files / 129 tests.
- Content: PASS, 19 Sources / 30 Rules / 32 lesson documents / 24 Questions /
  24 Scenes; 29 active and 1 upcoming at the explicit 2026-08-10 as-of date.
- Diagrams: PASS, 24 deterministic candidates / 1 human-approved public asset.
- Static/PWA: PASS, 41 pages / 58 precached URLs / 24 offline Questions.
- Chromium: PASS, 35 tests; one project-base-only case skipped in the root run,
  then passed separately against `/japan-driving-guide/`.
- Deployment artifact: root and simulated GitHub project-page bases both pass.
- Release archive: `release/japan-driving-guide-static-2026-08-10.zip`, 264,397
  bytes, SHA-256
  `1BCA2844AC0A180FDBB81869DF20268155CBD379A8A199F56EBF4F7A7814D664`;
  60 entries include 41 route entry pages, `sw.js`, manifest, offline fallback,
  24-Question bank, and approved D002.
- Local delivery preview: `/`, `/zh-TW/`, and `/en/` each returned HTTP 200 at
  `http://127.0.0.1:4321/`.

### Content/source evidence

- Revalidation record: `docs/SOURCE_REVALIDATION_2026-08-10.md`.
- Content release record: `src/data/content-release.json`.
- Source evidence record: `src/data/source-revalidation.json`.
- New Source ID: S19, NEXCO West wrong-way/missed-exit safety guidance.
- New legal Rule ID: `JP-RULE-CYCLIST-PASSING-LAW-001`.
- Release date, content-as-of date, and review completion date: 2026-08-10.

### Diagram evidence

- Regulated traffic-light/sign faces remain exact reviewed NPA/MLIT assets with
  provenance; no AI-generated or hand-redrawn sign was introduced.
- D002 remains the sole human-approved production diagram.
- D001 and D003–D024 remain deterministic review candidates and are deliberately
  excluded from public lesson/Question flows until separate human approval.

### Residual risks / external blockers

- F022 remains `blocked` only for a live GitHub Pages deployment: this workspace
  has no Git remote, repository ownership/visibility choice, or Pages target.
- Automated accessibility evidence is not third-party WCAG certification.
- Official sites and law can change after 2026-08-10; the explicit review date
  makes that limitation visible rather than claiming perpetual freshness.
- The working tree has no commit baseline; all project files are currently
  untracked, so rollback is file-level rather than commit-level.

### Next

No feature is active. The static release candidate is complete. The only
external release action is to connect an authorized GitHub repository and run
the already verified Pages workflow; candidate diagram promotion remains a
separate human-review decision, not a hidden release task.

## Session 2026-08-11 — F026 visual completion

### Completed

- Added a validated 16-module visual mapping shared by zh-TW and en, and placed
  the visual section directly in each lesson's main learning flow.
- Promoted D001-D024 through the deterministic manifest/public gate after 600px
  and 360px visual review; fixed the approval utility so array-backed Scene files
  update correctly instead of silently failing.
- Added exact official sign confirmation cards to the relevant examples. M09
  retains its full ten-sign authority-asset grid, while M02 uses exact official
  signal images inside D002-D004.
- Preserved the NEXCO ETC reuse boundary: its example links to the official source
  and explicitly states that no local image is shown because reuse is restricted.
- Generated three contextual, text-free illustrations for M00, M13, and M15.
  They contain no regulated sign or signal and carry an on-page non-official
  disclosure. The first M00 output was rejected because it introduced readable
  checklist copy; the corrected output uses blank generic document shapes.
- Added focused unit, E2E, responsive, asset-hash, bilingual-parity, and official-
  visual coverage tests. Essential sign images now load eagerly so the enlarged
  page remains deterministic in browser verification.
- Reduced Playwright workers to four after the expanded 84-URL service-worker
  workload exposed transient test-server pressure at the previous concurrency.

### Verification

- Final `npm run verify:release`: PASS.
- Lint/typecheck: PASS, zero diagnostics across 102 files.
- Unit: PASS, 19 files / 134 tests.
- Content: PASS, 19 Sources / 30 Rules / 32 lesson documents / 24 Questions /
  24 Scenes; 29 active and 1 upcoming Rule at the explicit as-of date.
- Diagrams: PASS, 24 candidates / 24 approved; public bytes match manifest hashes.
- Static/PWA: PASS, 41 pages / 84 precached URLs / 24 offline Questions at root
  and simulated `/japan-driving-guide/` bases.
- Chromium: PASS, 38 root cases plus 1 expected project-base skip; the isolated
  project-base browser case passes separately.
- Visual QA: all 48 diagram captures and the stop-sign, expressway-mobile, and
  eligibility lesson views were inspected during the verification run. The
  retained delivery preview is
  `release/japan-driving-guide-visual-lessons-preview.png`.
- Release archive: `release/japan-driving-guide-static-2026-08-11.zip`, 744,219
  bytes, SHA-256
  `B258E66658FCEE98E0E19F0A2D54435BA477F3374A3C532C858FFD1556A6B696`;
  86 entries include 41 route pages, 24 diagrams, 3 contextual WebPs, PWA files,
  offline fallback, and the 24-Question bank.
- Local delivery preview: root, both locale homes, four representative visual
  lessons, D005, the exact NPA STOP image, and the M00 contextual WebP returned
  HTTP 200 from `http://127.0.0.1:4321/`.

### Content/source and image evidence

- Official asset provenance remains in the existing NPA/MLIT asset metadata;
  no AI-generated or hand-redrawn regulated sign entered production.
- Generated asset metadata: `src/data/lesson-illustrations.json`.
- Reproducible prompt/correction record: `docs/IMAGEGEN_F026_PROMPTS.md`.
- Final contextual files: `m00-document-check.webp`,
  `m13-weather-mountain-road.webp`, and `m15-no-drive-decision.webp` under
  `public/assets/lesson-illustrations/`.

### Residual risks / external blockers

- F022 remains blocked only on live GitHub Pages: there is still no authorized
  remote repository or Pages target in this workspace.
- Generated illustrations support comprehension but are not evidence of law,
  road-sign appearance, or official procedure; the UI states this explicitly.
- Automated accessibility evidence is not a third-party certification.
- Question-to-diagram activation beyond Q002 remains a separate quiz-contract
  change; F026 adds lesson visuals without silently changing answer semantics.

### Next

No feature is active. The verified static deliverable is ready for local/offline
use. The remaining external action is publishing to a user-authorized GitHub
Pages target.

## Session 2026-08-11 — F027 tourist mistakes and Taiwan copy

### Completed

- Audited all six user-supplied travel/rental pages as discovery inputs and
  documented inaccessible pages, claim boundaries, and rejected unsafe or
  overbroad advice in `F027_TOURIST_MISTAKE_RESEARCH.md`.
- Added S20-S25 for official parking clear zones, distracted driving, all-seat
  belts, child restraints, abandoned parking, and rental-parking operation.
- Added six source-traced legal Rules for parking-sign distinction, five/ten-
  metre clear zones, phone distraction, every-seat belts, under-six child seats,
  and alcohol assistance/riding conduct.
- Expanded M10 with the red-X versus one-slash distinction, immediate-move
  boundary, hazard-light myth, official distance diagram, lock-plate lots,
  `月極`, and `最大料金` reminders.
- Expanded M15 with phone/navigation, all-seat belt, child-seat and alcohol-
  assistance requirements while preserving legal/advice separation.
- Rebuilt Fast Track as ten concrete visitor mistakes with direct lesson links;
  rewrote home, Learn, lesson chrome, signal feedback, and all zh-TW lesson
  bodies into shorter Taiwan-facing language.
- Added two-label rendering for the exact official NPA parking sign assets and
  retained deterministic diagrams for road situations.
- Changed release review tests to preserve actual per-Source/per-Rule dates
  instead of falsifying same-day revalidation for untouched records.

### Verification

- Lint: PASS.
- Typecheck: PASS, zero diagnostics across 104 files.
- Unit: PASS, 20 files / 140 tests.
- Content: PASS, 25 Sources / 36 Rules / 32 lesson documents / 24 Questions /
  24 Scenes; 35 active and 1 upcoming at the explicit 2026-08-11 as-of date.
- Diagrams: PASS, 24 candidates / 24 approved.
- Static/PWA: PASS, 41 pages / 84 precached URLs.
- F027 Chromium: PASS, 4/4 tourist-mistake, parking-sign, safety and 360px cases.
- Full Chromium: PASS, 42 cases plus 1 expected project-base-only skip.
- GitHub project-base Chromium: PASS, 1/1 after the final root/project build gate.
- First full E2E run: expected contract drift only—five tests still asserted old
  headings, labels or 19/30 catalog counts. Product behavior passed; contracts
  were updated and the complete rerun passed.
- First full release gate: expected contract drift only—the project-base test
  still queried the retired `瀏覽全部課程` label. After updating it to
  `看完整 16 課`, the complete release gate passed.
- Release archive: `release/japan-driving-guide-static-2026-08-11.zip`, 749,808
  bytes, 86 entries, SHA-256
  `DFB56D9675154EB6A35130A815B0ADB88509A7819A5E44946276465D63F6432A`.

### Content/source and diagram evidence

- Research boundary: `docs/F027_TOURIST_MISTAKE_RESEARCH.md`.
- New Source IDs: S20-S25 in `src/data/sources/sources.json` and matching
  revalidation records.
- New Rule IDs: `JP-RULE-PARKING-SIGN-DISTINCTION-001`,
  `JP-RULE-PARKING-CLEAR-ZONES-001`, `JP-RULE-DISTRACTED-DRIVING-001`,
  `JP-RULE-SEATBELT-ALL-001`, `JP-RULE-CHILD-SEAT-001`, and
  `JP-RULE-ALCOHOL-ASSIST-001`.
- Parking sign bytes remain exact NPA assets already protected by provenance and
  SHA-256 tests; no AI-generated or hand-redrawn regulated sign was added.
- D019 remains the deterministic roadside-parking situation diagram.

### Residual risks / external blockers

- F022 remains blocked only on live GitHub Pages because no authorized Git
  remote or Pages target exists.
- The six travel articles are not primary legal sources. Site claims depend on
  the official Sources recorded in the catalog, which may change after their
  explicit check dates.
- The compact five/ten-metre memory aid is intentionally incomplete; the lesson
  links the official police diagram and says so directly.
- Automated browser/accessibility tests are engineering evidence, not legal or
  third-party accessibility certification.

### Next

No feature is active. The verified static release is ready for local/offline use;
the only blocked action is publishing to a user-authorized GitHub Pages target.

## Session 2026-08-11 — F028 driver-seat simulations

### Completed

- Generated and reviewed one driver's-seat context image for every D001-D024
  example, then paired each photo with its matching deterministic explanation.
- Rejected candidates that invented traffic controls, misplaced a cyclist,
  inserted an overlay, obscured safe railway positioning, contradicted one-way
  flow, or exposed unreliable fuel colors; only corrected candidates entered
  production.
- Added a strict 24-item bilingual catalog with dimensions, SHA-256, generator,
  review state, and explicit `containsOfficialVisual: false` metadata.
- Changed lesson flow to photo first and explanation second on desktop and
  mobile. D002 retains its interactive lesson while following the same sequence.
- Kept exact NPA/MLIT controls and deterministic diagrams as the authority layer;
  every generated frame is labelled as simulation context on the page.

### Verification

- `npm run verify:f028`: PASS.
- `npm run verify:release`: PASS after fixing a duplicate test selector exposed
  by the first full run.
- Lint/typecheck: PASS, zero diagnostics across 106 files.
- Unit: 21 files / 143 tests.
- Content/diagrams: 25 Sources / 36 Rules / 32 lessons / 24 Questions / 24
  Scenes; 24 candidates / 24 approved.
- Chromium: 44 root passes plus one separate GitHub project-base pass.
- PWA: 108 precached URLs at root and simulated project base.
- Visual QA: five-pair signs lesson inspected in the in-app browser at desktop
  and 360px; photo→diagram order, containment, and disclosure passed.
- Release archive: `release/japan-driving-guide-static-2026-08-11.zip`,
  3,315,515 bytes, 110 entries, SHA-256
  `E62E9B68BA551937E3E9DD49DACE8D51FDD17523004BCA25233759E5E785B4DB`.
- Local delivery preview: `http://127.0.0.1:4321/zh-TW/learn/signs/` returned
  HTTP 200 after the final root build.

### Evidence and residual risk

- Prompt/correction record: `docs/IMAGEGEN_F028_PROMPTS.md`.
- Asset metadata: `src/data/driver-simulations.json`.
- Production files: `public/assets/driver-simulations/`.
- Generated images improve situation transfer but cannot prove law or exact
  control appearance. This limitation is structural and visible, not removable
  through more prompting.
- F022 remains blocked only on the external GitHub remote/Pages target.

### Next

No feature is active. The only remaining external action is connecting an
authorized GitHub repository and running the verified Pages workflow.

## Session 2026-08-11 — F029 D006 right-turn lane correction

### Completed

- Confirmed the reported defect: car A's old right-turn arrow occupied the
  westbound/oncoming half of the horizontal road.
- Replaced the disconnected arrow with a continuous northbound-to-eastbound
  curve that lands in Japan's eastbound left-side lane.
- Extended car B's straight path through the conflict area so the yield
  relationship remains visually explicit.
- Added deterministic SVG and 360px browser regression checks for the destination
  lane and removal of the old geometry.
- Rebuilt, reviewed at 600px/360px, and approved D006. Public/candidate bytes now
  match SHA-256
  `37888b2d617001c4f97c9414ffd488cc091660fc9a0624404db06a0f4519faa9`.

### Verification

- `npm run verify:f029`: PASS.
- `npm run verify:release`: PASS.
- Lint/typecheck: PASS, zero diagnostics across 106 files.
- Unit: 21 files / 144 tests.
- Content/diagrams: 25 Sources / 36 Rules / 32 lessons / 24 Questions / 24
  Scenes; 24 candidates / 24 approved.
- Chromium: 45 root passes plus one separate GitHub project-base pass; one
  project-base-only case is intentionally skipped in the root run.
- PWA: 108 precached URLs at root and simulated project base.
- Release archive: `release/japan-driving-guide-static-2026-08-11.zip`,
  3,315,580 bytes, 110 entries, SHA-256
  `5B2C79CBB1495DC00F896E183BBE4058EB8B3C4F850CF250C15589EC3AC12DF4`.

### Residual risk and rollback

- The regression test locks the lane semantics and key geometry, but visual
  review remains necessary after any future renderer-wide road-layout change.
- Rollback is limited to the D006 preset, its focused tests, manifest/public SVG,
  and rebuilt release artifact. No Rule, Source, or lesson copy changed.
- F022 live deployment is passing.

### Next

No feature is active. The corrected release is available locally and on GitHub
Pages.

## Session 2026-08-11 — GitHub source publication

### Completed

- Authenticated GitHub CLI as `dfanx` and connected the local repository to
  `https://github.com/dfanx/japan-driving-guide.git`.
- Preserved the existing `main` commit containing the static ZIP, fetched it as
  the branch base, and avoided force-push.
- Excluded dependencies, build/test output, caches, and `tmp/` PDF extraction
  intermediates from source control.
- Staged 292 project files after a credential-pattern scan returned no matches.
- Created commit `8ebcb75` (`Publish Japan driving guide`) and pushed
  `agent/publish-guide`.
- Opened draft PR #1 against `main`:
  `https://github.com/dfanx/japan-driving-guide/pull/1`.

### Verification and boundary

- Remote branch push: PASS.
- Draft PR creation through authenticated GitHub CLI: PASS. The GitHub connector
  returned 403 for PR creation, so the documented CLI fallback was used.
- Product release verification remains the recorded F029 `verify:release` PASS;
  publication changed only Git metadata, `.gitignore`, and handoff text.
- F022 was completed after PR #1 merged and the Pages workflow produced a
  reachable public URL.

## Session 2026-08-11 — PR merge and live Pages deployment

### Completed

- Confirmed PR #1 was mergeable at head `9b55c00`, marked it ready, and merged
  it into `main` as merge commit `781ec5cc` without force-push.
- Diagnosed the first Pages run failure: all source/build/base-path/smoke gates
  passed, but `actions/configure-pages` returned Not Found because Pages was not
  enabled for the repository.
- With explicit user authorization, enabled GitHub Pages with build type
  `workflow` and reran Actions run `31474056007`.
- Attempt 2 passed both build and deploy jobs. Public HTTPS is enforced.

### Verification

- PR #1 state: MERGED.
- GitHub Actions: PASS, run `31474056007`, attempt 2.
- Public HTTP: root, `/zh-TW/learn/intersections/`, and `/diagrams/D006.svg`
  returned 200.
- Live D006 contains `data-destination-lane="eastbound-left"`.
- Live URL: `https://dfanx.github.io/japan-driving-guide/`.

### Residual risk

- Future pushes to `main` redeploy automatically and must keep the release gate
  passing. GitHub availability and future legal-source revalidation remain
  external operational dependencies.

## Session 2026-08-11 — F030 learner-first visuals and final review

### Completed

- Replaced production/compliance captions below all 27 visual teaching entries
  with bilingual situation, risk, and action copy aimed at a traveller about to
  drive in Japan.
- Removed the isolated Q002 checkpoint from the Signal lesson and restored its
  previous/all/next lesson navigation.
- Added bilingual final-review routes with all 24 approved Questions, locked
  first answers, immediate explanations, previous/next paging, final score,
  topic bands, and lesson recovery links.
- Added final-review entry points to both homes, both Learn indexes, and the last
  lesson. Q016 now verifies the no-stopping/no-parking sign distinction.
- Corrected D002 so the red signal and stop instruction are centred ahead of the
  south-approach lane, reviewed the 600px and 360px candidates, and approved
  `sha256:51c1ca5ce36a20cb287b8528dfeb5fcd9cbb3c001245592af3123f2450bdec5a`.
- Kept Source IDs, rights records, review status, and visual provenance in the
  build-time data model while removing them from the primary learning flow.
- Inspected the Signal lesson, Parking lesson, captions, official sign card, and
  final Review page in the local browser at desktop and mobile acceptance sizes.

### Verification

- Lint/typecheck: PASS, zero diagnostics across 110 files.
- Unit: PASS, 21 files / 145 tests.
- Content/diagrams: PASS, 25 Sources / 36 Rules / 32 lessons / 24 Questions / 24
  Scenes; 24 candidates / 24 approved.
- Static/PWA: PASS, 43 pages / 110 precached URLs.
- Chromium: PASS, 46 root cases plus one intentional project-base-only skip;
  the separate project-base deployment case passes in release verification.
- Focused F030: PASS, ten bilingual, complete-review, mobile, keyboard,
  caption, and Signal-page cases.
- Release archive: `release/japan-driving-guide-static-2026-08-11.zip`,
  3,338,534 bytes / 111 entries / 43 route entries, SHA-256
  `DD5FC6B6EF96E28CA907E434345E3B03824E29BB9D01352F28D53C8A5CED66D9`.

### Residual risk and rollback

- Generated driver views improve recognition but remain unsuitable as regulated
  visual evidence; deterministic diagrams and exact approved sign assets remain
  the authoritative teaching layer.
- A 24-question review measures first decisions across the guide; it is not a
  substitute for supervised driving, licence qualification, or live road signs.
- Rollback is limited to the F030 components, copy data, tests, Q016, and the
  D002 candidate/manifest/public asset, followed by a static/PWA rebuild.

### Next

No feature is active. The verified F030 release is ready to commit, push to
`main`, and confirm through GitHub Pages.

## Session 2026-08-12 — F031 enforcement myths and reference scenarios

### Completed

- Replaced the supplied speeding folklore with a source-traced bilingual myth
  correction: Japan uses fixed, semi-fixed and portable enforcement equipment,
  while alleged tolerance margins and evasion tactics are not driving rules.
- Added S26-S29, three Rules, Q025 and the matching 25-question review updates.
- Audited all 13 supplied textbook photos. Verified signal, intersection,
  parking, guide-strip, fuel and expressway concepts were mapped to existing or
  original deterministic course visuals; unsupported universal tactics were
  rejected in `F031_REFERENCE_IMAGE_AUDIT.md`.
- Redrew and approved D011 as an original road-type comparison. Restored D002
  from its byte-identical reviewed candidate after detecting a zero-byte local
  public asset during the build workflow.
- Created the 2026-08-12 static archive and release notes, committed F031 as
  `d454418`, pushed `main`, and deployed it through Pages run `31553355397`.

### Verification

- Local release: PASS — 22 unit files / 149 tests; 29 Sources / 39 Rules / 32
  lessons / 25 Questions / 24 Scenes; 43 pages; 110 PWA URLs; 24/24 diagrams.
- Browser QA: PASS — speed, intersections and final review render correctly;
  first-answer locking, explanation and next-page navigation work.
- GitHub Pages: PASS — build and deploy jobs completed; public speed,
  intersections, review and D011 routes returned HTTP 200 with F031 markers.
- Static archive: 3,343,307 bytes / 112 entries; SHA-256
  `11C65D3334B4B1CFB9C7E3071892E0453E78E7FC214ECD845907603AC8AE1821`.

### Residual risk and rollback

- Enforcement deployment and road-law details remain time-sensitive; source
  revalidation is still required before future dated releases.
- The generated driver views are context, not proof of a regulated control.
  Official assets and reviewed deterministic diagrams remain the authority
  layer.
- Rollback is the F031 content/source/question/D011 change set followed by a
  static/PWA rebuild. The photographed book artwork was never imported.

### Next

No feature is active. F031 is verified locally and live on GitHub Pages.

## Session 2026-08-12 — F032 overlooked road-control scenarios

### Completed

- Removed the visible ten-minute home entry. The primary call to action now
  starts Lesson 01, with the 16-lesson directory and final review kept as
  secondary choices.
- Added bilingual, source-traced teaching for left-turn edge positioning,
  guide strips, solid/broken yellow roadside parking lines, actuated signals,
  streetcar signals, and entry across a sidewalk into a roadside facility.
- Kept the safe same-direction re-approach suggestion classified as practical
  advice. It does not authorize a U-turn or override local signs and markings.
- Added D025-D028 and revised D007/D019. All six diagrams were reviewed at
  600px and 360px, then approved through the existing deterministic hash gate.
- Generated and reviewed four 1200x800 driver-view context images for D025-D028.
  They contain no accepted official visual and remain secondary to the
  deterministic diagram and official control layer.
- Inspected the home, intersections, signals, and parking flows at 390x844 in
  the in-app browser. Images loaded, content stayed within the viewport, and
  the browser console reported no warnings or errors.

### Verification

- `npm run test:f032`: PASS — 5 files / 24 tests.
- `npm run test`: PASS — 23 files / 153 tests.
- `npm run verify:release`: PASS — zero-diagnostic lint/typecheck; 30 Sources /
  45 Rules / 32 lessons / 25 Questions / 28 Scenes; 28/28 diagrams approved;
  43 pages; 118 PWA URLs; 51 root Chromium passes plus one expected
  project-base skip; the separate project-base case passes.
- Visual review: PASS — D007, D019 and D025-D028 at 600px/360px, plus learner
  routes at 390x844.

### Content and diagram evidence

- New Source: S30, Fukushima Prefectural Police traffic-signal Q&A.
- New Rules: `JP-RULE-INTERSECTION-LEFT-POSITION-001`,
  `JP-RULE-PARKING-ROAD-MARKING-001`, `JP-RULE-SIGNAL-ACTUATED-001`,
  `JP-RULE-SIGNAL-STREETCAR-001`, `JP-RULE-FACILITY-ENTRY-001`, and
  `JP-RULE-FACILITY-APPROACH-001`.
- Diagram hashes: D007 `e7e69a30...`, D019 `b71c3798...`, D025 `cc21cef5...`,
  D026 `17410df7...`, D027 `9c536615...`, and D028 `f338ee63...`.
- Generated-image prompts and exact output hashes are recorded in
  `docs/IMAGEGEN_F032_PROMPTS.md`.

### Residual risk and rollback

- Actuated-signal detectors, streetcar controls, and roadside markings vary by
  place. The lesson teaches recognition and decision order, not a universal
  hardware layout.
- Generated driver views are contextual simulations, not legal or regulated
  visual evidence. The official source catalog and reviewed diagrams remain the
  authority layer.
- Rollback is the F032 home/content/Source/Rule/diagram/image/test change set,
  followed by rebuilding static and PWA output. No backend or data migration
  exists.

### Next

No feature is active. F032 is verified locally and live on GitHub Pages. No
further curriculum expansion is in scope.

## Session 2026-08-12 — F033 D020 expressway-merge geometry correction

### Session start

- Active feature: F033 only.
- Files read: project brief, feature ledger, progress handoff, D020 scene,
  T06 renderer/golden fixture, diagram manifest and template tests.
- Scope: replace the diagonal hard corner with a tangent-continuous ramp and
  merge taper, then rebuild, visually review, approve, verify and deploy D020.
- Out of scope: Rules, Sources, lesson wording, driver simulation and unrelated
  diagrams.
- Risk: T06 is a golden template, so a renderer correction intentionally drifts
  both the template golden and D020 approval hash; no other scene may drift.
- Verification: geometry assertions, template golden, diagram gate, 600px/360px
  review, expressway lesson browser check and full release regression.
- Rollback: restore T06/D020 renderer, golden, manifest and SVG bytes, then
  rebuild static/PWA output.

### Completed locally

- Replaced the hard-corner ramp polygon with a continuous curved ramp that
  becomes tangent to the horizontal mainline.
- Extended the acceleration lane into a narrowing merge taper and marked its
  endpoint explicitly in the SVG contract.
- Moved the ramp movement arrow away from the dashed separator and into the
  acceleration-lane centre after the first visual review exposed an overlap.
- Rebuilt T06 and D020, reviewed both 600px and 360px captures, then approved
  D020 with SHA-256
  `e69d99d01710d31a48f368d7f55e42a2c2966480ca8543835aeaaf26963f8082`.
- Inspected the full expressway lesson card at desktop and mobile widths in the
  in-app browser. Both scenario cards fit, images loaded, and the console had no
  warnings or errors.

### Verification

- `npm run verify:f033`: PASS — 3 focused unit files / 31 tests, zero-diagnostic
  lint/typecheck, 28/28 diagrams, 43-page build, and one mobile Chromium case.
- `npm run verify:release`: PASS — 24 unit files / 157 tests; 52 root Chromium
  passes plus one expected project-base skip; the separate project-base case
  passes; 118 PWA URLs and 1,175 project-base references pass.
- Visual QA: PASS — D020 at 600px and 360px plus the production lesson card at
  desktop and 390px-class mobile viewport.

### Residual risk and rollback

- The geometry is an explanatory schematic, not an engineering drawing of a
  specific interchange. It now preserves the essential ramp/mainline
  relationship without claiming universal dimensions.
- Rollback is limited to T06/D020 renderer, golden, candidate/public SVG,
  manifest, tests and package commands, followed by a static/PWA rebuild.

### Next

No feature is active. F033 is verified locally and live on GitHub Pages. The
public lesson and D020 SVG return 200, and the deployed SVG SHA-256 matches the
approved `e69d99d...f8082` artifact.

## Session 2026-08-12 — F034 local driving customs without folklore

### Session start

- Active feature: F034 only.
- Files read: project brief, feature ledger, progress handoff, curriculum,
  current Rules/Sources, six affected bilingual lessons and official guidance.
- Scope: classify five reported driving customs, strengthen the railway-
  crossing stop/check instruction, clarify right-turn entry into roadside
  facilities, add traceability/tests, verify and deploy.
- Out of scope: new diagrams, generated images, questions, backend, analytics
  and runtime behaviour.
- Risk: presenting observed customs as law, publishing a speed-tolerance myth,
  or writing an exceptionless railway rule that conflicts with current law.
- Verification: focused source/content tests, bilingual parity, mobile browser
  checks, full release regression, Pages workflow and public HTTPS markers.
- Rollback: revert the F034 Sources, Rules, lesson copy, tests, package scripts
  and governance records. No diagram approval or migration is involved.

### Completed locally

- Added S31-S33 and five approved Rules. NEXCO zipper merging is labelled
  official guidance; hazard-lamp stopping/reversing and thanks signals are
  labelled practical advice with explicit ambiguity warnings.
- Added concise learner sections to M04, M07, M10, M11 and M15. The copy rejects
  any `+15 km/h` allowance and teaches holding a predictable lane through the
  intersection without claiming a universal statutory ban.
- Strengthened M08 so every vehicle stops and checks for itself, never follows
  the previous car blindly and enters only when the exit is clear. The
  signal-controlled statutory exception remains explicit.
- Clarified roadside-facility right turns: read official road controls first,
  then `右折入庫禁止`; no notice means the turn may be permitted, not that it is
  automatically safe. Opposing traffic and sidewalk users still take priority.
- No production diagram or driver-simulation bytes changed.

### Verification

- `TEST_PORT=4344 npm run verify:f034`: PASS — 4 focused unit files / 19 tests,
  zero diagnostics, 33 Sources / 50 Rules, 28/28 diagrams, 43 pages and one
  affected-lesson mobile Chromium case.
- `TEST_PORT=4345 npm run verify:release`: PASS — 25 unit files / 162 tests; 53
  root Chromium passes plus one expected project-base skip; the separate
  project-base case passes; 118 PWA URLs and 1,175 base-path references pass.
- Browser QA: PASS — the freshly built zh-TW intersection lesson shows the
  entrance notice, safety boundary and sidewalk stop in the production layout.

### Content/source evidence

- New Sources: S31 NEXCO Central zipper merge guidance, S32 Panasonic Insurance
  hazard-lamp safety note, S33 Traffic Science Society communication study.
- New Rules: `JP-RULE-HAZARD-PARKING-CUSTOM-001`,
  `JP-RULE-HAZARD-THANKS-CUSTOM-001`, `JP-RULE-MERGE-ZIPPER-001`,
  `JP-RULE-INTERSECTION-HOLD-LANE-001`, and
  `JP-RULE-SPEED-PREDICTABLE-001`.
- Existing S16/S29 and facility-entry Rules support the right-turn entrance
  clarification; existing railway Rules support the strengthened stop/check
  copy. Research decisions are recorded in
  `docs/F034_LOCAL_DRIVING_CUSTOMS_RESEARCH.md`.

### Residual risk and rollback

- Local custom varies by region and driver. The lesson teaches recognition and
  a conservative response, never priority or permission.
- Facility notices may be advisory while official road controls are binding;
  the learner order deliberately reads both and defaults to continuing when
  the decision is unclear.
- Rollback is the scoped F034 content/data/test/docs change set followed by a
  static/PWA rebuild. No external data migration exists.

### Next

F034 is passing locally and live. Product commit `ed4a639` passed GitHub Pages
run `31561749290`; intersections, speed, rail crossings, parking, expressways,
safety basics and Sources all return HTTP 200 with the expected F034 markers.
No feature is active.

## Session 2026-08-14 — F035 visitor tips claim audit and lesson integration

### Session start

- Active feature: F035 only.
- Files read: project brief, feature ledger, progress handoff, current
  Source/Rule catalogs, seven affected bilingual lessons and current Japanese
  police/operator references.
- Scope: decompose and verify the supplied right-turn, STOP, road-marking,
  speeding, Okinawa expressway, parking-payment and self-service-fuel tips;
  integrate the useful actions in concise Taiwan-facing and English copy.
- Out of scope: penalty encyclopedia, enforcement evasion, new diagrams,
  generated images, questions, backend, dependencies or runtime features.
- Risk: memorable but false shortcuts—fixed seconds, absolute priority,
  universal line meanings, tolerance thresholds and guaranteed AI output.
- Verification: focused content/source tests, bilingual parity, mobile browser
  checks, full release regression, Pages workflow and public HTTPS markers.
- Rollback: revert F035 Sources, Rules, lesson copy, tests, scripts and
  governance records. Existing approved diagram/image bytes remain unchanged.

### Completed locally

- Added S34-S39 and six approved Rules covering legal right-turn clearance,
  serious-speeding procedure, Okinawa speed controls, ETC/Smart IC operation,
  parking equipment/fees and cash-fuel change retrieval.
- Expanded M02/M03/M04/M07/M10/M11/M12 in both locales. Learner copy now
  distinguishes circular green, a right arrow and lawful intersection
  clearance; complete stop from a fictional three-second rule; yellow lane-
  change control from white/centre/edge markings; and ETC from Smart IC.
- Added actionable parking and fuel workflows while treating translation/AI as
  an assistive check rather than a price guarantee.
- Rejected or narrowed unsupported claims about automatic arrest or entry
  refusal, weak kei-car brakes, limestone making every Okinawa road slippery,
  a universal double-white-line rule and a QR-only change flow.
- Recorded all accept/narrow/reject decisions in
  `docs/F035_VISITOR_TIPS_CLAIM_AUDIT.md`; no production visual changed.

### Verification

- `TEST_PORT=4355 npm run verify:f035`: PASS — 4 focused unit files / 19 tests,
  zero diagnostics, 39 Sources / 56 Rules, 28/28 diagrams, 43 pages and one
  seven-lesson 390px Chromium case.
- `TEST_PORT=4357 npm run verify:release`: PASS — 26 unit files / 167 tests; 54
  root Chromium passes plus one expected project-base skip; the separate
  project-base case passes; 118 PWA URLs and 1,175 base-path references pass.
- Browser QA: PASS — signals, parking, speed and fuel markers render in the
  current production layout with no horizontal overflow, empty link or console
  warning/error.
- Two stale exact-count/date tests exposed by the full regression were updated
  to the reviewed 2026-08-14 release data; the complete gate was rerun from the
  beginning and passed.

### Content/source evidence

- S34 Tokyo police traffic-infraction table, S35 Okinawa police speed-control
  material, S36 NEXCO West Smart IC operation, S37-S38 Times fee/equipment
  instructions and S39 Idemitsu prepaid self-service instructions.
- New Rules: `JP-RULE-SIGNAL-RIGHT-CLEAR-001`,
  `JP-RULE-SPEED-PROCEDURE-001`, `JP-RULE-OKINAWA-SPEED-001`,
  `JP-RULE-ETC-PAYMENT-001`, `JP-RULE-PARKING-PAYMENT-001` and
  `JP-RULE-FUEL-CASH-CHANGE-001`.

### Residual risk and rollback

- Smart IC operating hours/directions, parking equipment and payment methods
  can change. The course tells the traveller to recheck the live operator page
  and on-site machine rather than freezing one universal flow.
- This remains a safety guide, not case-specific legal or immigration advice.
- Rollback is the scoped F035 content/data/test/docs change set followed by a
  static/PWA rebuild. No migration or visual-asset rollback exists.

### Next

F035 is passing locally and live. Product commit `6b39a3f` passed GitHub Pages
run `31773780279`; signals, stop signs, intersections, speed, parking,
expressways, fuel and Sources all return HTTP 200 with their F035 markers. The
obsolete queued docs-only run `31561886388` was cancelled to unblock the latest
product deployment. No feature is active.

## Session 2026-08-14 — F036 guide-strip semantics and D025 correction

### Session start

- Active feature: F036 only.
- Files read: project brief, feature ledger, progress handoff, M04 bilingual
  lessons, D025 scene/renderer/manifest, D025 driver simulation and current
  Source/Rule records.
- Scope: verify the legal distinction between a white guide strip and a
  yellow-bordered entry-prohibited area; correct the bilingual teaching, the
  driver-view scenario and deterministic D025 schematic.
- Out of scope: copying the supplied reference artwork, unrelated lesson or
  diagram changes, new runtime features or dependencies.
- Risk: replacing the current false blanket avoidance rule with an equally
  false recommendation to drive through guide strips; confusing two distinct
  regulated markings because both use hatching.
- Verification: official-source audit, focused Rule/scene/image tests,
  deterministic diagram approval, mobile Chromium review, full release gate,
  Pages workflow and public HTTPS markers.
- Rollback: revert the scoped F036 content/data/visual/test/docs changes and
  rebuild static/PWA output. No data migration or external service change.

### Completed locally

- Replaced the incorrect blanket avoidance rule with the verified distinction:
  a white `導流帯` guides traffic and is not itself an entry ban; a separately
  regulated yellow-bordered `立入り禁止部分` must not be entered.
- Added S40 and `JP-RULE-ENTRY-PROHIBITED-MARKING-001`, updated the existing
  guide-strip Rule, and kept M04 bilingual parity.
- Rejected the first generated replacement because it did not clearly end in a
  right-turn lane. Published the user-supplied real-road photograph as a
  provenance-labelled context photo, normalized to 1200x800 WebP.
- Rebuilt D025 as a reviewed two-panel comparison. The white guide strip leads
  to a right-turn lane and carries the moving-vehicle risk; the yellow-bordered
  prohibited area shows the forbidden crossing. Approved SVG hash:
  `2f15a11a...9914d`.

### Verification

- `TEST_PORT=4360 npm run verify:f036`: PASS — zero-diagnostic lint/typecheck,
  4 focused files / 20 tests, 40 Sources / 57 Rules, 28/28 diagrams, 43 pages
  and one 360px D025 Chromium case.
- `TEST_PORT=4364 npm run verify:release`: PASS — 27 unit files / 172 tests; 55
  root Chromium passes plus one expected project-base skip; separate project-
  base case, 118 PWA URLs and 1,175 base-path references pass.
- Visual review: PASS — published context photo inspected at 1200x800; D025
  inspected at 600px and 360px with legible white/yellow distinction and a
  right-turn endpoint.
- The first full regression exposed stale 39/56 source/rule count assertions;
  they were updated to the reviewed 40/57 catalog and the full release gate was
  rerun from the beginning.

### Residual risk and rollback

- A white guide strip does not guarantee that crossing is safe or that every
  example leads to a right-turn lane. Additional signs, lane boundaries,
  arrows and police direction remain controlling; M04 states that boundary.
- The user-supplied photograph is field context, not legal evidence. S29/S40
  support the distinction and the deterministic SVG teaches the geometry.
- Rollback is the scoped F036 Source/Rule/lesson/photo/diagram/test/docs change
  set followed by a static/PWA rebuild. No external data migration exists.

### Live acceptance and next

- Product commit `aab2a8e` passed GitHub Pages run `31775556547`; both build and
  deploy jobs completed successfully.
- Public M04, D025 context WebP, D025 SVG and Sources return HTTP 200. The live
  lesson contains the corrected heading/right-turn text; the SVG contains
  `data-turn-lane="right"` and `data-entry-prohibited="yellow-bordered"`; S40
  is visible in the Source catalog.
- F036 is passing locally and live. No feature is active.

## Session 2026-08-14 — F037 concrete three-panel guide-strip diagram

### Session start

- Active feature: F037 only.
- Files read: project brief, feature ledger, progress handoff, F036 source audit,
  D025 scene/renderer/manifest, focused diagram tests and build/approval scripts.
- Scope: redraw D025 in the supplied three-panel teaching sequence: a white
  guide strip that can be crossed, a yellow-bordered entry-prohibited area,
  and the collision risk from vehicles using the hatching; make the right-turn
  lane and queued traffic visually explicit.
- Out of scope: changing the verified S29/S40 rule distinction, other lessons,
  runtime features or dependencies.
- Risk: copying the reference's surface styling without resolving its geometry,
  or making the white guide strip look like a preferred overtaking lane.
- Verification: deterministic SVG tests, review hash/approval gate, 600px/360px
  visual inspection, focused browser test, full release gate and public smoke.
- Rollback: revert the scoped F037 renderer/test/docs changes and restore the
  prior approved D025 bytes. No data migration exists.

### Completed locally

- Replaced the abstract two-panel D025 with three repeated road panels matching
  the supplied teaching sequence: white guide strip / allowed, yellow-bordered
  entry-prohibited area / prohibited, and a concrete vehicle-conflict scene.
- Each panel now contains queued vehicles, a visible hatched area and an actual
  right-turn lane. The final panel places two vehicles at the conflict point
  instead of representing the risk with copy alone.
- Preserved S29/S40 Rule semantics and testable SVG markers. Approved D025 hash:
  `62622967...661a4`.

### Verification

- `TEST_PORT=4368 npm run verify:f037`: PASS — zero-diagnostic lint/typecheck,
  4 focused files / 25 tests, 40 Sources / 57 Rules, 28/28 approved diagrams,
  43 pages and one 360px Chromium case.
- `TEST_PORT=4370 npm run verify:release`: PASS — 28 unit files / 174 tests;
  56 root Chromium passes plus one expected base-path skip; separate project-
  base case, 118 PWA URLs and 1,175 base-path references pass.
- Visual review: PASS — D025 inspected at 600px and 360px. All three labels,
  queue vehicles, guide-strip borders, right-turn arrows and conflict marker
  remain distinguishable.

### Residual risk and rollback

- The diagram intentionally follows the reference's teaching structure, not a
  universal claim that every guide strip ends in a right-turn lane. The lesson
  continues to require reading the actual arrows, signs and lane boundaries.
- Rollback is the scoped F037 renderer/scene/test/docs change set and restoration
  of D025 hash `2f15a11a...9914d`. No content migration exists.

### Next

F037 is passing locally. No feature is active. Push, Pages deployment and public
HTTPS asset markers remain the release handoff for this session.
