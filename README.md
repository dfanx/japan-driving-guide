# Japan Driving Guide

A bilingual, static-first safety-learning guide for overseas visitors preparing
to drive a rental car in Japan. The product focuses on frequent, dangerous, and
high-confusion situations rather than reproducing the full traffic code.

## Current state

Release candidate: 16 bilingual learning modules, Fast Track, tourist-priority
official signs, Source/Rule traceability, an interactive reviewed scenario, and
offline installation build as a static Astro site. The release catalog contains
25 Sources, 36 classified Rules, 24 Questions, and 24 approved deterministic
diagrams distributed across every learning module.

Every D001-D024 example now starts with a disclosed driver's-seat simulation,
then shows the matching deterministic explanation and any applicable exact
official control. This creates field realism without treating generated pixels
as legal or sign-recognition evidence.

Fast Track now opens with ten mistakes overseas visitors repeatedly make. The
parking lesson directly compares the official red-X `駐停車禁止` and one-slash
`駐車禁止` signs, and the zh-TW copy uses concise Taiwan-facing instructions.

Regulated sign and signal faces use exact, traceable NPA/MLIT assets. Twenty-four
generated driver-view simulations and three general contextual illustrations are
clearly identified as non-official context. The NEXCO ETC example remains an
official-link-only rights fallback instead of copying or fabricating an image.

Production content is frozen to the reviewed 2026-08-11 release date. The
2026-09-01 local-road speed change remains explicitly upcoming and is never
activated from a client or build clock.

## Run locally

```powershell
./scripts/init.ps1
npm run dev
```

On macOS/Linux:

```sh
./scripts/init.sh
npm run dev
```

## Verify

```text
npm run verify
```

This runs lint, typecheck, unit tests, static build, and the critical browser
smoke test.

For the complete release gate, including all browser cases, offline behavior,
and a simulated GitHub project Pages path:

```text
npm run verify:release
```

## Build and preview

```powershell
npm run build
npm run preview
```

Then open `http://127.0.0.1:4321/`. The generated `dist/` contains the static
site, install manifest, versioned service worker, full offline core, approved
local official visuals and diagrams, contextual lesson images, and the reviewed
Question bank.

## Deployment

`.github/workflows/deploy-pages.yml` verifies and deploys either an owner-site
root path or repository project path. Source and live site:

- Repository: `https://github.com/dfanx/japan-driving-guide`
- GitHub Pages: `https://dfanx.github.io/japan-driving-guide/`

## Repository map

- Approved curriculum input: `JAPAN_DRIVING_TOURIST_CURRICULUM_2026.md`
- Implementation specification: `CODEX_DESKTOP_JAPAN_DRIVING_GUIDE_BUILD_PLAN.md`
- Current feature state: `docs/FEATURE_LIST.md`
- Current handoff: `docs/PROGRESS.md`
- Decisions and constraints: `docs/DECISIONS.md`
- Verification evidence: `docs/VERIFICATION.md`
- Release source review: `docs/SOURCE_REVALIDATION_2026-08-10.md`
- F027 tourist-mistake research: `docs/F027_TOURIST_MISTAKE_RESEARCH.md`
- F027 source additions: `docs/SOURCE_ADDITIONS_2026-08-11.md`
- F028 image-generation/rejection record: `docs/IMAGEGEN_F028_PROMPTS.md`
- Site source: `src/`
- Tests: `tests/`
- Deterministic diagram system and review assets: `tools/diagram-generator/`
