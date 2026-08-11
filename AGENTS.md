# Japan Driving Guide — Agent Guide

## Project

Build a static-first bilingual safety-learning product for overseas visitors who
will drive rental cars in Japan. Optimize for correctness, comprehension,
scenario judgment, and maintainability—not legal completeness or feature count.

## Stack

- Astro 7 static output
- TypeScript 6 (strict)
- Vitest unit tests
- Playwright smoke/E2E tests
- ESLint with Astro rules
- GitHub Pages is the eventual deployment target

## Read first

1. `docs/PROJECT_BRIEF.md`
2. `docs/FEATURE_LIST.md`
3. `docs/PROGRESS.md`
4. The docs routed from the active feature
5. `JAPAN_DRIVING_TOURIST_CURRICULUM_2026.md` for approved curriculum input
6. `CODEX_DESKTOP_JAPAN_DRIVING_GUIDE_BUILD_PLAN.md` for full architecture

## Non-negotiable rules

- WIP=1: only one feature may have status `active`.
- Feature status is one of `not_started`, `active`, `blocked`, `passing`.
- Do not mark work `passing` without recorded verification evidence.
- Every driving rule must trace to a curriculum Source ID.
- Do not invent, extrapolate, or silently update Japanese traffic law.
- Keep legal rules, official guidance, and practical advice distinct.
- Model effective dates explicitly; do not use the client clock to switch law.
- Production traffic diagrams must come from the deterministic build-time SVG
  system and require review approval.
- Preserve bilingual parity through shared Rule, Question, and Diagram IDs.
- Do not add backend, database, login, CMS, AI API, analytics, or runtime scene
  generation without explicit user approval.
- Do not turn the product into a Japanese driving-test encyclopedia.
- Avoid unrelated refactors and dependency expansion.

## Common commands

```text
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e:smoke
npm run verify
```

Fresh environment:

```text
./scripts/init.ps1
./scripts/init.sh
```

Playwright browsers are installed hermetically under `node_modules` by the init
scripts. Do not rely on a user-global browser installation.

## Documentation routing

- Scope and users: `docs/PROJECT_BRIEF.md`
- Feature state: `docs/FEATURE_LIST.md`
- Latest handoff: `docs/PROGRESS.md`
- Architecture choices: `docs/DECISIONS.md`
- Verification commands/evidence: `docs/VERIFICATION.md`
- Phase gates: `docs/ACCEPTANCE.md`

## Session start

Before editing, report:

```text
Active feature:
Files to read:
Scope:
Out of scope:
Risk:
Verification:
Rollback:
```

## Session end

Record completed work, changed files, verification results, content/source and
diagram evidence where relevant, residual risks, rollback, and the next feature.
Update `FEATURE_LIST.md`, `PROGRESS.md`, and `DECISIONS.md` when applicable.

