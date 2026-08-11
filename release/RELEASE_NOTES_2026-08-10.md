# Japan Driving Guide — Release Candidate 2026-08-10

## Product

- Static-first bilingual safety-learning guide for overseas visitors driving in Japan.
- 41 static routes across Traditional Chinese and English.
- 16 learning modules, 24 reviewed Questions, 10 tourist-priority official sign cards.
- 19 official Sources and 30 classified Rules with explicit traceability.
- Installable PWA with 58 local precache URLs and an honest offline fallback.

## Verification

`npm run verify:release` passed on 2026-08-10:

- ESLint: pass.
- Astro/TypeScript: zero diagnostics.
- Vitest: 18 files / 129 tests passed.
- Playwright: 35 tests passed; the root run intentionally skipped one
  project-base-only deployment case, which then passed separately.
- Static output: 41 pages at `/` and simulated `/japan-driving-guide/` bases.
- PWA: 58 URLs and 24 offline Questions validated at both base paths.
- Diagram gate: 24 deterministic candidates; only human-approved D002 is public.

## Content review

- Release, content-as-of, and Source revalidation date: 2026-08-10.
- Every registered official Source was reopened and received a recorded outcome.
- The cyclist-passing statutory duty was separated from numerical official
  guidance to avoid presenting guidance as law.
- Missed-exit guidance now cites the directly supporting NEXCO West source S19.
- Regulated sign and signal visuals are exact reviewed NPA/MLIT assets with
  provenance; no AI-generated or hand-redrawn traffic sign is used.

## Deployment

- Deploy the contents of `dist/` as the static site root.
- GitHub Pages workflow and repository-subpath behavior are implementation-tested.
- A live GitHub Pages URL is not included because the workspace has no authorized
  Git remote, repository ownership/visibility choice, or Pages target.

## Known boundaries

- D001 and D003–D024 are deterministic human-review candidates and are not
  production assets.
- Official sites and law can change after the recorded review date.
- Automated accessibility evidence is not third-party WCAG certification.
