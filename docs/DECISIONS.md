# Decisions

## D001 — Strict Phase 0 boundary

- Date: 2026-08-10
- Status: accepted
- Decision: Phase 0 contains the static skeleton, Agent Harness, scripts, and one
  smoke path. Content schemas remain in Phase 1 despite an earlier summary line
  in the build plan mentioning them under Phase 0.
- Reason: the detailed phase definition and first-session prompt both impose the
  narrower scope, which better enforces WIP=1.
- Consequence: `npm run build` does not yet include content or diagram validators.

## D002 — Dependency compatibility over newest version

- Date: 2026-08-10
- Status: accepted
- Decision: use TypeScript 6.0.3 instead of 7.0.2, ESLint 9.39.5, and
  eslint-plugin-astro 1.7.0.
- Reason: `@astrojs/check` rejects TypeScript 7 through its current peer range,
  while newer eslint-plugin-astro releases require a newer Node patch than the
  available Node 24.3.0 runtime.
- Consequence: upgrades require an explicit compatibility check, not automated
  version drift.

## D003 — Explicit telemetry and browser isolation

- Date: 2026-08-10
- Status: accepted
- Decision: disable Astro telemetry in scripts and install Playwright Chromium
  hermetically under `node_modules`.
- Reason: verification must not write outside the workspace or depend on a
  user-global browser cache.
- Consequence: `cross-env` is retained as a small cross-platform dependency.

## D004 — In-process E2E static server

- Date: 2026-08-10
- Status: accepted
- Decision: serve `dist/` with a small Node HTTP server controlled through
  Playwright global setup/teardown.
- Reason: Astro 7 preview/background behavior and external process teardown were
  unreliable under the current Windows/npm environment.
- Consequence: the server is intentionally minimal and only for local preview and
  tests; it is not a production server.

## D005 — Strict runtime content contracts

- Date: 2026-08-10
- Status: accepted
- Decision: use the Zod 4 interface already exported by Astro for Source and Rule
  runtime schemas. Rule titles are one localized object with mandatory `zh-TW`
  and `en` values. Legal rules require at least one resolved Tier S source.
- Reason: TypeScript alone cannot protect JSON at runtime, and source governance
  is a P0 correctness control.
- Consequence: schema changes are breaking data-contract changes and require tests.
  The provisional `safety_basics` category remains allowed because seed question
  Q024 uses it; F010 must reconcile that with the weakness taxonomy.

## D006 — Effective date is a build input

- Date: 2026-08-10
- Status: accepted
- Decision: derive rule status from an explicit `CONTENT_AS_OF_DATE` when set;
  otherwise capture one UTC date at build time. Effective endpoints are inclusive.
- Reason: static content must be reproducible and must never change silently from
  a visitor's client clock.
- Consequence: CI/release workflows should set the date explicitly when auditing
  a legal transition. Build logs always disclose the selected date and counts.

## D007 — Lesson pair is one governed bilingual unit

- Date: 2026-08-10
- Status: accepted
- Decision: store one Markdown file per locale under `LessonID/locale.md`, parse
  YAML frontmatter at build time, and require exact parity for non-localized
  metadata. Titles and bodies remain localized.
- Reason: two unrelated locale trees will drift. Pairing and Rule references must
  fail before static generation, not during editorial review after deployment.
- Consequence: `yaml` is a direct build-time dependency. Diagram references are
  format/parity checked now; manifest existence/approval remains F019 scope.

## D008 — Complete data contracts before UI

- Date: 2026-08-10
- Status: accepted by user
- Decision: insert F005A Question data contract and F005B Diagram Scene data
  contract before F006 UI. Narrow F010 to seed-bank import and keep F015 focused
  on renderer primitives.
- Reason: the phase definition requires stable Question and Scene contracts before
  the vertical slice, while the original numeric feature order placed UI first.
- Consequence: feature IDs express governance history rather than strict execution
  order. WIP remains one active feature at a time.

## D009 — Scene data is semantic, not free-coordinate drawing

- Date: 2026-08-10
- Status: accepted
- Decision: Scene JSON selects a template and supplies bounded semantic parameters
  on a canonical logical canvas. Content files do not place arbitrary SVG points.
- Reason: free-coordinate authoring would duplicate renderer logic, weaken
  invariants, and make content review dependent on hidden geometry expertise.
- Consequence: F005B supports FourWayIntersection v1 only. New templates extend
  the discriminated contract during generator features. D002 remains
  `needs_review` until SVG generation, hashes, and human QA exist.

## D010 — Cool Japanese public-guidance visual system

- Date: 2026-08-10
- Status: accepted by user
- Decision: use cold white, blue-grey, indigo, and teal as the core interface
  palette. Reserve red for traffic alerts and incorrect/high-risk states; do not
  use warm cream/brown as the product background language.
- Reason: the product is a safety-learning tool. A restrained public-guidance
  palette improves hierarchy and reduces the travel-editorial warmth that could
  weaken alert semantics.
- Consequence: F006 centralizes the palette and responsive geometry in global
  tokens and reusable shell components. F007+ pages should consume these tokens
  instead of introducing page-local theme palettes.

## D011 — Canonical restricted SVG node pipeline

- Date: 2026-08-10
- Status: accepted
- Decision: diagram primitives return a restricted typed SVG node tree. One
  canonical serializer owns attribute ordering, numeric precision, and XML
  escaping. Primitives do not emit independent raw SVG strings.
- Reason: deterministic output requires control of more than layout math. Raw
  string construction permits attribute-order drift, unsafe labels, inconsistent
  precision, and hidden byte changes that would create noisy approval hashes.
- Consequence: templates in F016/F017 must compose these nodes and serialize once.
  Any new tag or raw-text capability is a contract change requiring tests.

## D012 — Template goldens are not production Scene contracts

- Date: 2026-08-10
- Status: accepted
- Decision: T01/T03/T04/T05/T06 use internal typed geometry inputs during F016.
  Only T02 consumes the current reviewed FourWayIntersection Scene schema. Golden
  SVG files prove template determinism but are not public assets or approvals.
- Reason: expanding the production discriminated Scene union without reviewed
  content would freeze speculative fields and create false confidence. Stable
  geometry is necessary, but it is not evidence that a legal teaching scene is
  correct.
- Consequence: F018 extends the Scene contract as reviewed D001–D024 records are
  imported. F019 must hash and review generated production output separately from
  template goldens.

## D013 — Movement and alert semantics remain distinct in diagrams

- Date: 2026-08-10
- Status: accepted
- Decision: ordinary movement arrows use neutral road-marking color; red is
  reserved for alerts and stop/error instructions. Vehicle A/B badges are
  rendered outside body rotation and sized for 360px-equivalent readability.
- Reason: color is part of the safety vocabulary. Red movement arrows create a
  false warning signal, while rotated or tiny labels defeat non-color identity.
- Consequence: new templates must declare arrow tone and preserve upright labels;
  golden tests enforce both constraints.

## D014 — Review candidates remain outside production paths

- Date: 2026-08-10
- Status: accepted
- Decision: generated but unapproved SVGs live under
  `tools/diagram-generator/review/`. The build gate checks their bytes and
  manifest hashes but does not expose them under `public/diagrams/`.
- Reason: consistency and approval are different controls. A deterministic file
  can still be semantically wrong; putting it on a public path before human
  review would collapse that distinction.
- Consequence: F020 may promote and consume D002 only when the Scene and manifest
  are both approved. Any Scene, output, template, path, or generator change
  returns the manifest entry to `needs_review`.

## D015 — Regulated visuals use an official-first asset supply chain

- Date: 2026-08-10
- Status: accepted by user direction
- Decision: traffic-light faces, road-sign faces, and standardized marking
  glyphs use exact reusable Japanese-authority assets by default. Project SVG
  generation remains responsible for scenario composition only. Each imported
  asset requires source, terms, attribution, extraction, checksum, dimensions,
  and transformation metadata; provenance participates in diagram identity.
- Reason: a deterministic redraw can still reproduce the wrong orientation,
  color, geometry, or symbol. Official correctness does not itself prove reuse
  permission, so authority and rights are separate release gates.
- Consequence: search-result copying, hotlinking, and unlicensed third-party
  imagery are prohibited. Missing official assets fail closed; any exception for
  a specification-derived vector requires an explicit decision and fresh human
  review. See `docs/VISUAL_ASSET_POLICY.md`.

## D016 — Lesson integration previews Q002 without implementing quiz behavior

- Date: 2026-08-10
- Status: accepted
- Decision: F020 renders Q002's reviewed localized prompt and options as a
  checkpoint preview on the M02 lesson page, but does not accept answers, reveal
  explanations, score a session, or write weakness state.
- Reason: production traceability requires M02, D002, and Q002 to share a real
  route, while answer state and feedback have separate F011/F012 contracts.
  Combining them would make WIP and acceptance evidence ambiguous.
- Consequence: the build enforces ID and approval alignment now. F011 owns quiz
  state, F012 owns immediate explanation behavior, and F013 owns weakness output.

## D017 — QuizSession is immutable and answer submission does not auto-advance

- Date: 2026-08-10
- Status: accepted
- Decision: every quiz transition returns a new frozen state. Submitting an
  answer records the selected option and correctness but leaves `currentIndex`
  unchanged; a separate guarded transition advances the session.
- Reason: immutable transitions are deterministic and testable. Keeping the
  answered Question current gives F012 a stable state in which to reveal the
  reviewed explanation before the learner chooses to continue.
- Consequence: duplicate answers, skipped Questions, unknown options, and
  completed-session mutations fail closed. The engine contains no localized UI
  copy, persistence, score presentation, or weakness policy.

## D018 — Immediate feedback preserves the first submitted answer

- Date: 2026-08-10
- Status: accepted
- Decision: F012 accepts one submission for the current Q002 page instance,
  disables further changes, and reveals correctness plus the approved localized
  Question explanation. The client controller derives correctness through the
  F011 engine and does not maintain a second answer key.
- Reason: allowing edits after revealing the answer destroys first-attempt
  evidence and makes F013 weakness classification ambiguous. Sourcing the
  explanation from Q002 prevents UI copy from drifting from reviewed content.
- Consequence: retry, persistence, score, and progression require explicit later
  features. Feedback uses text, DOM state, focus movement, and color together;
  the interaction remains framework-free and static-host compatible.

## D019 — Weakness analysis uses answered-only tag evidence

- Date: 2026-08-10
- Status: accepted
- Decision: each answered Question contributes one observation to each of its
  unique tags. A tag's ratio is correct answers divided by answered Questions
  for that tag; unanswered Questions are excluded. Results use the curriculum's
  canonical tag order and are immutable.
- Reason: including unattempted Questions would measure quiz length rather than
  observed judgment. Canonical ordering prevents question-bank order from
  changing the same result, while multi-tag attribution preserves reviewed
  Question semantics.
- Consequence: `>=0.80` is strong, `>=0.60` is review, and lower is priority
  review. Exactly one observation is marked `limited`; F014 must communicate
  low confidence rather than display an over-precise percentage. Missing,
  duplicate, unapproved, or invalid Question inputs fail closed.

## D020 — Review results require an explicit post-explanation transition

- Date: 2026-08-10
- Status: accepted
- Decision: submitting Q002 reveals and focuses the reviewed explanation first.
  A separate learner action then advances the QuizSession to completion,
  consumes F013 output, and focuses the review result. Same-locale review links
  target the canonical M02 lesson anchor.
- Reason: immediately moving focus to an aggregate result would undermine the
  safety explanation, while auto-presenting both states as one announcement
  increases cognitive load. The explicit transition also preserves D017's
  separation between answer submission and progression.
- Consequence: one-Question results show `limited sample` language and no exact
  percentage. A correct answer is described as correct this time, not mastery;
  incorrect answers receive a priority-review recommendation. Future multi-item
  result screens must continue to consume F013 rather than recalculate bands.

## D021 — Locale entry routes disclose reviewed scope

- Date: 2026-08-10
- Status: accepted
- Decision: `/` is a neutral language gateway; `/zh-TW/` and `/en/` are
  equivalent product homes, with equivalent Fast Track routes. Locale switches
  preserve page intent and header brand links return to the current-locale home.
- Reason: language choice must not depend on a hidden redirect, and a reviewed
  one-lesson product must not present itself as the finished full curriculum.
- Consequence: F007 entry copy discloses one reviewed lesson and one scenario.
  F008/F010 may expand shared navigation only as approved content becomes real.

## D022 — Seed Questions and Rules use typed catalogs with staged diagrams

- Date: 2026-08-10
- Status: accepted
- Decision: approved seed Questions and Rules live in deterministic catalog
  arrays parsed through the existing runtime schemas. Questions reference only
  diagram IDs that already exist and pass the Scene/manifest gate.
- Reason: one file per small record increases drift and makes bank-wide review
  difficult. Conversely, pointing an approved Question at a planned but missing
  Scene would make traceability appear stronger than it is.
- Consequence: Q001–Q024 and 21 behavior-scoped Rules validate now; only Q002
  carries D002. F018 may add other diagram IDs only together with reviewed
  Scenes, forcing Question review when that instructional context changes.

## D023 — Markdown content and navigation share one build-time module contract

- Date: 2026-08-10
- Status: accepted
- Decision: the 16-module sequence is a typed build-time registry. Approved
  bilingual Markdown remains the lesson source; generic routes are generated
  statically, while a module may retain a specialized page when it needs a
  reviewed diagram or interactive checkpoint.
- Reason: duplicating module order, slugs, and locale mappings across pages would
  permit broken parity and dead-end navigation. Forcing every lesson through one
  visual template would instead weaken the existing M02 safety interaction.
- Consequence: route generation fails when frontmatter and registry identity
  drift. F009 may enhance the signs module through a specialized presentation
  without changing its canonical M09 ID or bilingual destination.

## D024 — Rights restrictions can require an official-link-only card

- Date: 2026-08-10
- Status: accepted
- Decision: a regulated visual is copied locally only when both authority and
  reuse permission pass. When an official source is authoritative but prohibits
  republication, the product provides reviewed text and an official outbound
  link, with an explicit rights note; it does not hotlink, screenshot, or redraw.
- Reason: authority does not grant reuse rights. NEXCO's toll-gate content is
  useful and official, but its current site policy prohibits putting downloaded
  content on another website.
- Consequence: F009 reproduces NPA and MLIT assets under PDL 1.0 with attribution,
  while ETC-only remains link-only until NEXCO grants permission or a reusable
  Japanese-authority asset is located and reviewed.

## D025 — Templates may be schematic but cannot impersonate regulated signs

- Date: 2026-08-10
- Status: accepted
- Decision: T07–T12 encode road geometry, actor placement, lane flow, and review
  overlays only. Any text used to distinguish a generic toll lane is explicitly
  marked `schematic-not-sign`; templates omit regulated sign faces until an exact
  reusable official asset is supplied.
- Reason: a template's purpose is spatial consistency. Treating a convenient text
  label or vector approximation as a Japanese traffic control would undermine the
  official-first evidence chain.
- Consequence: F018 Scenes can select these geometries, but production candidates
  that require a sign/light face must load an approved official asset or fail
  closed. Template golden approval is never production diagram approval.

## D026 — Candidate Scenes do not activate Question diagrams before approval

- Date: 2026-08-10
- Status: accepted
- Decision: D001–D024 may be generated and visually QA'd as review candidates,
  but a Question receives a Diagram ID only when that exact diagram manifest
  entry is human-approved and public. Intended curriculum mappings live in a
  separate review artifact until promotion.
- Reason: Scene existence and generator determinism are not legal/content review.
  Attaching unapproved context to an approved Question would bypass the same gate
  that keeps candidate SVGs out of production.
- Consequence: Q002/D002 remains the sole active mapping. Eleven additional
  explicit mappings are staged with `needs_review`; approval must update the
  Scene, manifest, public asset, mapping artifact, and Question atomically.

## D027 — Traceability dates are derived from reviewed content data

- Date: 2026-08-10
- Status: accepted
- Decision: the public traceability surface derives its displayed Rule verification
  and Source-link check dates from catalog fields. It never labels the browser or
  build clock as a verification date.
- Reason: a current timestamp proves only that a page rendered, not that a legal
  source or editorial interpretation was rechecked.
- Consequence: F025 must update catalog dates only after real source review. The
  page also states that a reachable external link does not prove unchanged content.

## D028 — Deployment paths are repository-name agnostic

- Date: 2026-08-10
- Status: accepted
- Decision: every internal route and locally served asset uses Astro's build base
  URL. The Pages workflow derives `/` for an owner site and `/<repo>/` for a
  project site instead of hard-coding an unknown repository name.
- Reason: a passing root preview does not prove a GitHub project page works; its
  absolute-root links would silently escape the deployed site.
- Consequence: CI must build and browser-smoke the exact Pages base path before
  upload. Live deployment remains blocked until a repository and access level exist.

## D029 — Accessibility acceptance is measured across the complete static surface

- Date: 2026-08-10
- Status: accepted
- Decision: F023 gates all 41 routes at 360px and representative routes at four
  release viewports, then separately tests keyboard flow, focus, reduced motion,
  44px targets, semantic structure, language metadata, and token contrast.
- Reason: a homepage-only audit cannot detect defects in long source registers,
  official-sign cards, generated lessons, or the interactive checkpoint.
- Consequence: future routes join the same structural/mobile audit. Automated
  conformance evidence remains an engineering gate, not a certification claim.

## D030 — Offline completeness cannot imply legal freshness

- Date: 2026-08-10
- Status: accepted
- Decision: one install precaches the full local static guide, approved visual
  assets, and Question bank. Navigations remain network-first; cache is a failure
  fallback. External official sources are not intercepted or mirrored as pages.
- Reason: cache-first navigation would optimize availability by silently
  preferring stale safety guidance, which is the wrong priority for this product.
- Consequence: offline use is explicit last-installed-release behavior. Each new
  build changes the content-derived cache identity and deletes prior guide caches.

## D031 — Release time is governed by reviewed data, not machine time

- Date: 2026-08-10
- Status: accepted
- Decision: production builds read release, content-as-of, and source-review
  dates from a versioned release record. A build-time override remains available
  only for audited transition testing and must be explicit.
- Reason: a deployment timestamp is not evidence that an official source was
  reviewed. Using the current clock can silently activate future-law content and
  can make a stale catalog look current.
- Consequence: every release must update the release record and revalidation
  evidence intentionally. The public coverage date is the oldest reviewed item,
  not the newest, so stale evidence cannot be hidden by one recent update.

## D032 — Statutory duty and numerical guidance are separate claims

- Date: 2026-08-10
- Status: accepted
- Decision: the cyclist-passing legal duty and numerical clearance guidance use
  separate Rule IDs, classifications, Source traces, and wording. Recovery from
  a missed expressway exit likewise cites the directly supporting NEXCO source.
- Reason: a learner must be able to tell binding law from authority guidance;
  grouping them converts editorial convenience into a false legal claim.
- Consequence: future content review must reject any Rule that merges legal,
  guidance, and practical-advice assertions or cites only a broadly related page.

## D033 — Lesson visuals use a three-tier evidence model

- Date: 2026-08-11
- Status: accepted
- Decision: road geometry and scenario relationships use deterministic build-time
  SVG; regulated signs/signals use exact authority assets with provenance; AI-
  generated imagery is limited to non-regulated contextual themes and receives a
  visible non-official disclosure.
- Reason: one visual technology cannot satisfy all three objectives. Determinism
  is best for spatial teaching, exact official bytes are mandatory for regulated
  recognition, and generated context is appropriate only where visual mood or
  preparation—not legal appearance—is being taught.
- Consequence: generated or hand-redrawn regulated visuals fail review. Every new
  lesson visual must declare its tier, trace its official assets where applicable,
  and remain bilingual through the shared module/diagram/sign IDs.

## D034 — Lesson diagram promotion and quiz mapping are independent gates

- Date: 2026-08-11
- Status: accepted
- Decision: owner direction to complete every lesson example, combined with the
  recorded 600px/360px review, authorizes D001-D024 for lesson use through the
  existing hash/manifest gate. It does not activate staged Question-to-diagram
  mappings beyond the already approved Q002/D002 contract.
- Reason: a diagram can be suitable explanatory context without proving that a
  particular quiz stem, options, and answer explanation were reviewed together.
- Consequence: lesson coverage is complete, while future quiz mapping changes
  still require an atomic Question/Scene/content review and focused verification.

## D035 — Secondary travel articles discover problems but do not prove law

- Date: 2026-08-11
- Status: accepted
- Decision: visitor blogs, rental articles, and travel publishers may identify
  recurring questions and useful framing, but production legal Rules must cite
  the existing primary/official Source tiers. Inaccessible pages contribute no
  claim text.
- Reason: popularity and readability are evidence of learner confusion, not of
  legal accuracy or current effectivity. Several supplied pages contained broad
  or risky advice that did not survive comparison with primary law.
- Consequence: research memos record discovery pages and rejected claims, while
  the public traceability catalog contains only the official evidence actually
  relied on by each Rule.

## D036 — Release review dates preserve incremental truth

- Date: 2026-08-11
- Status: accepted
- Decision: each Source and Rule retains the date it was actually reviewed. The
  release-level revalidation date is the latest completed review date, while the
  public catalog-coverage date remains the oldest record.
- Reason: forcing every unchanged Source and Rule to the release date would claim
  work that was not performed; using only the oldest date would hide newly
  reviewed evidence. Both boundaries are needed.
- Consequence: release tests require every Source/Rule date to be no later than
  the release date and require at least one record to reach it; they no longer
  demand a fabricated same-day date for the entire catalog.

## D037 — Taiwan-facing copy leads with error, action, then exception

- Date: 2026-08-11
- Status: accepted
- Decision: zh-TW learning copy uses a compact three-part pattern: name the
  tourist mistake, state the action in common Taiwan usage, then explain only the
  legal exception needed for correct behavior. Internal approval language stays
  out of learner-facing copy.
- Reason: a safety guide is an operating aid, not an editorial report. Dense
  institutional language increases reading time and hides the decision a driver
  must make.
- Consequence: future copy review rejects padding, generic AI transitions, and
  legal jargon without immediate translation, while retaining precise terms such
  as `駐車禁止` and `駐停車禁止` where the distinction itself matters.

## D038 — Simulation and authority are separate visual layers

- Date: 2026-08-11
- Status: accepted by user direction
- Decision: each D001-D024 teaching example starts with a disclosed generated
  driver-seat simulation, followed by its matching approved deterministic
  diagram and, where applicable, the exact reviewed Japanese-authority control.
- Reason: a driver-view frame improves transfer from abstract rules to field
  recognition, but image generation cannot be trusted to reproduce a regulated
  sign, signal, marking, toll board, or fuel identifier.
- Consequence: simulations are context-only, hash-locked and paired by Diagram
  ID. Any candidate that invents a regulated control is rejected rather than
  treated as evidence or silently corrected in learner-facing copy.

## D039 — Turn paths declare their destination lane

- Date: 2026-08-11
- Status: accepted
- Decision: a deterministic turn path must encode a continuous approach-to-exit
  trajectory and name its destination-lane semantic. For D006, a northbound
  right turn must end in the eastbound left-side lane, the north half of the
  horizontal road.
- Reason: a direction arrow alone can appear plausible while sitting in the
  opposing lane. The reported D006 defect passed shape-level review because the
  renderer had no explicit lane-destination invariant.
- Consequence: D006 now exposes `data-destination-lane="eastbound-left"` and has
  focused unit/browser regression coverage. Future turn diagrams should encode
  the same semantic rather than relying only on visual arrow direction.

## D040 — Governance metadata stays out of the primary learning path

- Date: 2026-08-11
- Status: accepted
- Decision: learner-facing visual captions lead with the scene, the trap, and
  the action. Source IDs, generation method, review state, rights notes, and
  provenance remain available in structured data, automated gates, and the
  separate traceability route rather than repeating below each image.
- Reason: provenance is necessary for maintainers but does not answer the
  driver's immediate question: “What am I seeing, and what should I do?”
- Consequence: removing governance metadata from the data model is still
  prohibited; exposing it in every primary caption is also rejected.

## D041 — Assessment follows the complete curriculum

- Date: 2026-08-11
- Status: accepted
- Decision: individual lessons do not contain isolated scored Questions. All 24
  approved Questions run in order on a bilingual final-review route after the
  16-lesson path, with immediate explanations and a final topic breakdown.
- Reason: one question per lesson interrupts reading and cannot support a useful
  mastery signal. The complete bank provides a consistent final retrieval pass
  and actionable links to weaker topics.
- Consequence: new Questions join the reviewed bank and final assessment unless
  a future product decision explicitly introduces unscored lesson practice.

## D042 — Approach controls declare lane-relative placement

- Date: 2026-08-11
- Status: accepted
- Decision: a signal controlling an approach must encode both its approach and
  `data-position="ahead-of-approach-lane"`; its centre must align with the lane
  used by the approaching vehicle. D002's south signal therefore centres at
  x=545 instead of the right/oncoming half at x=796.
- Reason: a correct red-light face in the wrong lane teaches the wrong control
  relationship even when the abstract rule is correct.
- Consequence: D002 has geometry assertions and a reviewed hash. Future signal
  diagrams must test lane-relative control placement, not only signal state.

## D043 — Enforcement folklore is not a driving margin

- Date: 2026-08-12
- Status: accepted
- Decision: the guide may explain that Japan uses fixed, semi-fixed, and
  portable speed-enforcement equipment, but it must not publish alleged camera
  trigger tolerances, lead-car shielding, detector tactics, or claims that only
  the first vehicle is stopped. Learner guidance remains: obey the posted or
  otherwise applicable speed limit.
- Reason: an observed enforcement threshold is neither a legal allowance nor a
  stable safety rule. Optimizing for non-detection would turn a safety product
  into an evasion guide and could expose visitors to collision, penalty, rental,
  and immigration consequences that the supplied anecdote cannot establish.
- Consequence: anecdotal posts and photographed books may identify learner
  confusion, but accepted rules require Japanese-authority Source IDs. Book
  layouts are not reproduced; verified concepts are merged into original,
  deterministic diagrams and Taiwan-facing action copy.

## D044 — The home page starts the curriculum, not a competing shortcut

- Date: 2026-08-12
- Status: accepted by user direction
- Decision: the primary home action opens Lesson 01 directly. The visible
  ten-minute entry is removed; the 16-lesson directory and final review remain
  secondary paths. The old Fast Track route stays buildable only so existing
  bookmarks do not break, but it is no longer promoted in the learning flow.
- Reason: three competing starting points force a first-time visitor to design
  the course before learning. The lowest-friction safe default is the reviewed
  lesson sequence from the beginning.
- Consequence: home and deployment tests lock the Lesson 01 destination and
  absence of a visible ten-minute choice. Removing the legacy route itself is a
  separate compatibility decision.

## D045 — Context, instruction, and authority remain three visual layers

- Date: 2026-08-12
- Status: accepted
- Decision: F032 scenarios use a driver-view simulation for field context, an
  original deterministic diagram for the taught maneuver or control relation,
  and an official Source or exact regulated asset where the rule depends on it.
  Photographed book layouts are not redrawn or copied.
- Reason: a photo-like scene helps recognition but is geometrically unreliable;
  a schematic can teach geometry but does not prove the law; primary official
  evidence supports the legal or guidance claim. Combining the layers without
  confusing their roles improves transfer while preserving auditability.
- Consequence: D007/D019 and D025-D028 require hash approval and mobile review;
  generated images declare `containsOfficialVisual: false`; legal, official-
  guidance, and practical-advice Rules remain separately classified.

## D046 — Safe facility re-approach is advice, not U-turn permission

- Date: 2026-08-12
- Status: accepted
- Decision: drivers crossing a sidewalk into a parking lot, fuel station, or
  shop must first yield and confirm the path is clear. If the approach cannot be
  completed without blocking traffic or crossing blind, the guide advises
  continuing to a lawful, visible, safe place and returning from the same-side
  direction. It never prescribes an arbitrary U-turn.
- Reason: the first-principles objective is to remove a blind cross-traffic and
  pedestrian conflict, not to substitute one risky maneuver for another.
- Consequence: the legal duty and the route-planning suggestion have separate
  Rule IDs and classifications; diagrams show the safe decision order without
  asserting that every nearby reversal is lawful.

## D047 — Merge diagrams require tangent-continuous road joins

- Date: 2026-08-12
- Status: accepted
- Decision: a schematic ramp joining a horizontal mainline must reach the join
  with a horizontal tangent and a visibly narrowing lane separator. Movement
  arrows stay inside their lane rather than overlapping the separator.
- Reason: the former D020 polygon was technically closed but visually wrong: a
  diagonal outer edge met a horizontal road edge at a hard corner. That shape
  teaches a bent roadway and obscures how an acceleration lane actually tapers.
- Consequence: T06/D020 now expose `data-join="tangent-horizontal"`,
  `data-primitive="merge-separator"`, and a declared taper endpoint. Focused
  unit/browser tests reject the former corner and arrow overlap.

## D048 — Driving customs are recognition aids, not substitute signals

- Date: 2026-08-12
- Status: accepted
- Decision: widely observed hazard-light and lane-flow customs may be taught
  only as practical recognition aids. The guide must state the official or
  legal action first, name the custom as optional and non-universal, and explain
  what the custom cannot authorize or communicate reliably.
- Reason: visitors benefit from recognizing local behavior, but an informal
  flash pattern is ambiguous and cannot create right of way, replace a turn
  signal, prove a parking manoeuvre, or legalize a stop. Likewise, a rumoured
  `+/-15 km/h` social band would convert folklore into unsafe speeding advice.
- Consequence: zipper merging is classified separately as NEXCO official
  guidance; parking/reversing hazards, two-flash thanks and holding a lane
  through an intersection remain practical advice; every speed statement keeps
  the posted limit as a hard upper bound.
