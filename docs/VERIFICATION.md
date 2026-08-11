# Verification

## Standard command

```text
npm run verify
```

Order is intentional:

1. `npm run lint`
2. `npm run typecheck`
3. `npm run test`
4. `npm run build`
5. `npm run test:e2e:smoke`

The E2E command expects current static output, so build runs first.

## Environment initialization

```text
scripts/init.ps1
scripts/init.sh
```

Initialization uses `npm ci`, a workspace-local npm cache, and a hermetic
Playwright Chromium Headless Shell. No global package installation is required.

## Evidence log

| Date | Scope | Command | Result | Evidence |
|---|---|---|---|---|
| 2026-08-10 | F001 | `npm run lint` | PASS | Zero lint errors |
| 2026-08-10 | F001 | `npm run typecheck` | PASS | 0 errors, warnings, or hints |
| 2026-08-10 | F001 | `npm run test` | PASS | 1 file, 2 assertions |
| 2026-08-10 | F001 | `npm run build` | PASS | Static `/index.html` generated |
| 2026-08-10 | F001 | `npm run test:e2e:smoke` | PASS | Chromium 1/1 |
| 2026-08-10 | F001 | `npm run verify:f001` | PASS | Full ordered chain passed |
| 2026-08-10 | F002 | `scripts/init.ps1` | PASS | Lockfile install and hermetic Chromium completed |
| 2026-08-10 | F002 | `scripts/verify.ps1` | PASS | Fresh full ordered chain passed |
| 2026-08-10 | F002 | PowerShell parser | PASS | Both `.ps1` scripts parse cleanly |
| 2026-08-10 | F002 | `bash -n scripts/*.sh` | NOT RUN | Managed environment denied WSL launch |
| 2026-08-10 | F003 | `npm run validate:content` | PASS | 2 sources, 1 rule |
| 2026-08-10 | F003 | `npm run test` | PASS | 2 files, 11 assertions |
| 2026-08-10 | F003 | `npm run verify` | PASS | Content gate and full chain passed |
| 2026-08-10 | F004 | `npm run test` | PASS | 3 files, 20 assertions including transition boundaries |
| 2026-08-10 | F004 | `CONTENT_AS_OF_DATE=2026-09-01 validate:content` | PASS | Explicit override disclosed |
| 2026-08-10 | F004 | `npm run verify` | PASS | Effective-date gate and full chain passed |
| 2026-08-10 | F005 | `npm run validate:content` | PASS | 2 sources, 1 rule, 2 lesson documents |
| 2026-08-10 | F005 | `npm run test` | PASS | 4 files, 26 assertions |
| 2026-08-10 | F005 | `npm run verify` | PASS | Lesson parity gate and full chain passed |
| 2026-08-10 | F005A | `npm run validate:content` | PASS | 1 reviewed question |
| 2026-08-10 | F005A | `npm run test` | PASS | 5 files, 34 assertions |
| 2026-08-10 | F005A | `npm run verify` | PASS | Question traceability and full chain passed |
| 2026-08-10 | F005B | `npm run validate:content` | PASS | 1 semantic diagram scene |
| 2026-08-10 | F005B | `npm run test` | PASS | 6 files, 42 assertions |
| 2026-08-10 | F005B | `npm run verify` | PASS | Scene/Question traceability and full chain passed |
| 2026-08-10 | F006 | `npm run verify:f006` | PASS | 360×800 one-column and 1440×1000 two-column Chromium assertions/screenshots passed |
| 2026-08-10 | F006 | `npm run verify` | PASS | 42 unit assertions, static build, and updated home smoke passed |
| 2026-08-10 | F015 | `npm run verify:f015` | PASS | 12 canonical SVG, escaping, geometry, and D002-primitive assertions passed |
| 2026-08-10 | F015 | `npm run verify` | PASS | 7 unit files / 54 assertions, content build, and smoke passed |
| 2026-08-10 | F016 | `npm run verify:f016` | PASS | Six T01–T06 golden outputs and 8 template assertions passed |
| 2026-08-10 | F016 | `npm run capture:diagram-golden` | PASS | 12 review images captured at 600px and 360px; manual visual QA passed |
| 2026-08-10 | F016 | `npm run verify` | PASS | 8 unit files / 63 assertions, content build, and smoke passed |
| 2026-08-10 | F019 | Pre-generation `npm run diagrams:check` | EXPECTED FAIL | Missing manifest was rejected before candidate generation |
| 2026-08-10 | F019 | `npm run diagrams:build` twice | PASS | D002 manifest and candidate hashes remained byte-identical |
| 2026-08-10 | F019 | `npm run capture:diagram-review` | PASS | D002 review candidate inspected at 600px and 360px |
| 2026-08-10 | F019 | `npm run verify:f019` | PASS | 10 manifest/hash/review-transition assertions and consistency check passed |
| 2026-08-10 | F019 | `npm run verify` | PASS | 9 unit files / 73 assertions, diagram gate, build, and smoke passed |
| 2026-08-10 | F019A | Exact S10 PDF object extraction | PASS | Page 1 `/Image25`, 366×115 PNG; asset SHA-256 `45ba1793...a46199`; no visual modification |
| 2026-08-10 | F019A | `npm run verify:f019a` | PASS | Official provenance, primitive, template, manifest, type, lint, and candidate gates passed |
| 2026-08-10 | F019A | Unapproved public-asset negative check | EXPECTED FAIL | `D002.svg` under `public/diagrams` was rejected and the test artifact was removed |
| 2026-08-10 | F019A | `npm run capture:diagram-review` | PASS | Regenerated D002 inspected at 600px and 360px with exact NPA red-light image |
| 2026-08-10 | F019A | `npm run verify` | PASS | 10 unit files / 75 assertions, content/diagram gates, static build, and Chromium smoke passed |
| 2026-08-10 | F019A | `npm run diagrams:approve -- D002 2026-08-10` | PASS | Scene/manifest approved; candidate and public SVG SHA-256 both `d76dfc5b...ea0046` |
| 2026-08-10 | F019A | Post-approval `npm run diagrams:check` | PASS | 1 candidate / 1 approved; public bytes match |
| 2026-08-10 | F020 | Initial `npm run verify:f020` | EXPECTED FAIL | Test incorrectly assumed SVG browser natural size equals viewBox; implementation and 360px layout passed |
| 2026-08-10 | F020 | `npm run test:e2e:f020` | PASS | 3 bilingual/identity/SVG/mobile cases passed after correcting the test to assert load and 3:2 ratio |
| 2026-08-10 | F020 | `npm run verify:f020` | PASS | Lint, zero-diagnostic typecheck, 75 unit assertions, 3-route build, and 3 F020 E2E cases passed |
| 2026-08-10 | F020 | `npm run verify` | PASS | Content/diagram gates, static build, and Chromium smoke passed |
| 2026-08-10 | F011 | `npm run verify:f011` | PASS | 8 immutable session, answer, progression, and invalid-state tests passed |
| 2026-08-10 | F011 | `npm run verify` | PASS | 11 unit files / 83 assertions, content/diagram gates, 3-route build, and Chromium smoke passed |
| 2026-08-10 | F012 | Initial `npm run verify:f012` | EXPECTED FAIL | E2E clicked the visually hidden radio instead of its visible label; static checks, build, and mobile case passed |
| 2026-08-10 | F012 | `npm run test:e2e:f012` | PASS | 3 bilingual correctness/explanation/locking/focus/mobile-target cases passed |
| 2026-08-10 | F012 | `npm run verify:f012` | PASS | Zero-diagnostic lint/typecheck, 83 unit assertions, content/diagram gates, 3-route build, and 3 F012 E2E cases passed |
| 2026-08-10 | F012 | `npm run verify` | PASS | Full project chain and Chromium smoke passed after interaction integration |
| 2026-08-10 | F013 | `npm run verify:f013` | PASS | 7 empty/single/boundary/partial/multi-tag/input-gate weakness tests passed |
| 2026-08-10 | F013 | `npm run verify` | PASS | 12 unit files / 90 assertions, content/diagram gates, 3-route build, and Chromium smoke passed |
| 2026-08-10 | F014 | `npm run verify:f014` | PASS | 3 bilingual result/focus/link/mobile E2E cases plus full static gates passed |
| 2026-08-10 | F014 | `npm run verify` | PASS | 12 unit files / 90 assertions, content/diagram gates, 3-route build, and Chromium smoke passed |
| 2026-08-10 | F014 | `npm run test:e2e` | PASS | All 12 layout, lesson, explanation, result, and smoke browser cases passed |
| 2026-08-10 | F007 | `npm run verify:f007` | PASS | 4 bilingual home/Fast Track/gateway/mobile cases and all static gates passed |
| 2026-08-10 | F007 | `npm run verify` | PASS | 7-route build, 90 unit assertions, content/diagram gates, and updated smoke passed |
| 2026-08-10 | F010 | `npm run verify:f010` | PASS | 5 bank/order/bilingual/traceability/effective-date tests passed for 24 Questions |
| 2026-08-10 | F010 | `npm run verify` | PASS | 13 unit files / 95 assertions, 17 Sources, 21 Rules, 24 Questions, and all static gates passed |
| 2026-08-10 | F008 | `npm run validate:content` | PASS | 17 Sources, 23 Rules, 32 lesson documents, 24 Questions, 1 Scene; 22 active / 1 upcoming |
| 2026-08-10 | F008 | `npm run build` | PASS | 39 static routes generated |
| 2026-08-10 | F008 | `npm run test:e2e:f008` | PASS | 3 cases cover both indexes, all 32 module routes, locale parity, and 360px navigation |
| 2026-08-10 | F009 | Official NPA PDF / MLIT image review | PASS | 16 PDF pages rendered; selected image objects and exact 207-A GIF visually matched official labels |
| 2026-08-10 | F009 | `npm run test:essential-signs` | PASS | 10-card parity, 10 official-asset SHA-256 checks, and ETC rights fallback pass |
| 2026-08-10 | F009 | `npm run build` | PASS | 18 Sources, 26 Rules, 32 lessons, 24 Questions, diagram gate, and 39 routes pass |
| 2026-08-10 | F009 | `npm run test:e2e:f009` | PASS | 3 bilingual, image-load, rights-note, and 360px cases pass |
| 2026-08-10 | F017 | `npm run verify:f017` | PASS | Zero-diagnostic lint/typecheck, 15 primitive tests, and 17 T01–T12 golden tests pass |
| 2026-08-10 | F017 | `npm run capture:diagram-golden` | PASS | 24 captures; T07–T12 visually reviewed at 600px and 360px after correcting T08/T11/T12 defects |
| 2026-08-10 | F018 | `npm run verify:f018` | PASS | 6 Scene/official-asset/review-boundary tests; 24 candidates; only D002 approved/public |
| 2026-08-10 | F018 | `npm run capture:diagram-review` | PASS | 48 captures reviewed at 600px and 360px; critical actor/geometry/toll defects corrected |
| 2026-08-10 | F021 | `npm run verify:f021` | PASS | 18 Sources, 29 classified Rules, 41 routes, and 3 bilingual/mobile E2E cases pass |
| 2026-08-10 | F022 | `npm run verify:f022` | PASS (implementation) | 41 HTML files / 906 base-path references and Chromium route/asset smoke pass; no remote for live deployment |
| 2026-08-10 | F023 | Initial `npm run verify:f023` | EXPECTED FAIL | Detected a 40.8px skip-link target and a representation-specific reduced-motion assertion |
| 2026-08-10 | F023 | `npm run verify:f023` | PASS | 6 token/contrast assertions and 8 Chromium cases across 41 routes and four viewports pass |
| 2026-08-10 | F024 | `npm run verify:f024` | PASS | 58 precached URLs, 24 Questions, 2 offline Chromium cases, and root/project-base PWA gates pass |
| 2026-08-10 | F025 | Official Source/rights revalidation | PASS | 18 existing Sources reopened; direct NEXCO missed-exit source added as S19; evidence recorded per Source |
| 2026-08-10 | F025 | Initial full `npm run test:e2e` | EXPECTED FAIL | Exposed stale language/count assertions and a project-base test leaking into the root run; test contracts were corrected |
| 2026-08-10 | F025 | `npm run verify:release` | PASS | Lint, zero-diagnostic typecheck, 18 unit files / 129 tests, 41 pages, 35 Chromium tests, 58 PWA URLs, root and project-base builds pass |
| 2026-08-10 | Release | Static ZIP integrity check | PASS | 60 entries; 41 route pages, `sw.js`, manifest, offline fallback, `data/quiz-bank.json`, and D002 present; SHA-256 `1BCA2844...4D664` |
| 2026-08-10 | Release | Local HTTP preview | PASS | `/`, `/zh-TW/`, and `/en/` returned 200 from `http://127.0.0.1:4321/` |
| 2026-08-11 | F026 | Context illustration review | PASS | Rejected the first M00 output for readable generated copy; final M00/M13/M15 WebPs are text-free, non-regulated, disclosed, and hash-locked |
| 2026-08-11 | F026 | `npm run capture:diagram-review` + contact-sheet review | PASS | 48 captures at 600px/360px reviewed; D001-D024 spatial/label output accepted for lesson use |
| 2026-08-11 | F026 | Diagram approval + `npm run diagrams:check` | PASS | 24 candidates / 24 approved; manifest, Scene status, candidate, and public bytes agree |
| 2026-08-11 | F026 | `npm run test:f026` | PASS | 15 coverage, parity, identity, hash, rights-fallback, and official-asset assertions |
| 2026-08-11 | F026 | `npm run test:e2e:f026` | PASS | 3 bilingual visual-load, official-sign, rights-fallback, and 360px containment cases |
| 2026-08-11 | F026 | Initial full E2E | EXPECTED FAIL | Exposed one lazy official image, a duplicate test hook, and test-server pressure; fixed image loading, hook identity, and worker concurrency |
| 2026-08-11 | F026 | Initial release typecheck | EXPECTED FAIL | Test-only DOM inference omitted image properties; corrected with an explicit `HTMLImageElement` cast |
| 2026-08-11 | F026 | `npm run verify:release` | PASS | 19 unit files / 134 tests; 41 pages; 84 PWA URLs; 38 root Chromium passes plus one expected skip; separate project-base case passes |
| 2026-08-11 | Release | Static ZIP integrity check | PASS | 86 entries; 41 route pages, 24 diagrams, 3 contextual WebPs, PWA/offline/Question assets; SHA-256 `B258E666...6B696` |
| 2026-08-11 | Release | Local HTTP preview | PASS | Root, zh-TW/en homes, four representative visual lessons, D005, exact NPA STOP, and M00 WebP returned 200 from `http://127.0.0.1:4321/` |
| 2026-08-11 | F027 | Official-source research and claim triage | PASS | Six supplied discovery pages recorded; inaccessible and legally overbroad claims were not copied; S20-S25 carry the accepted official evidence |
| 2026-08-11 | F027 | `npm run test:f027` | PASS | 5 files / 26 focused source, Rule, bilingual parity, parking-sign and research-boundary assertions |
| 2026-08-11 | F027 | `npm run test:e2e:f027` | PASS | 4 ten-mistake, official parking-sign, safety-basics and 360px cases |
| 2026-08-11 | F027 | Initial full `npm run test:e2e` | EXPECTED FAIL | Five stale headings/labels/catalog counts were updated; product behavior and F027 cases passed |
| 2026-08-11 | F027 | Full `npm run test:e2e` rerun | PASS | 42 root Chromium passes plus one expected project-base-only skip |
| 2026-08-11 | F027 | Initial `npm run verify:release` | EXPECTED FAIL | Project-base test still queried the retired `瀏覽全部課程` label; base-path and PWA checks had passed |
| 2026-08-11 | F027 | Final `npm run verify:release` | PASS | 20 unit files / 140 tests; 25 Sources / 36 Rules; 41 pages; 84 PWA URLs; 42 root Chromium passes plus one project-base pass |
| 2026-08-11 | Release | Static ZIP integrity check | PASS | 86 entries; size 749,808 bytes; SHA-256 `DFB56D96...F6432A` |
| 2026-08-11 | F028 | Generated-image semantic review | PASS | 24 selected driver-view frames; 12 first candidates rejected/corrected for control, geometry, overlay, traffic-flow, or fuel-cue defects |
| 2026-08-11 | F028 | `npm run verify:f028` | PASS | 24 exact Diagram pairings; 9 focused unit assertions; 2 bilingual/360px Chromium cases |
| 2026-08-11 | F028 | Initial full `npm run verify:release` | EXPECTED FAIL | Duplicate outer/inner `data-diagram-id` test identity was split into pair ID and authoritative diagram ID; product visuals and focused tests passed |
| 2026-08-11 | F028 | Final `npm run verify:release` | PASS | 21 unit files / 143 tests; 44 root Chromium passes plus one project-base pass; 108 PWA URLs |
| 2026-08-11 | Release | Static ZIP integrity check | PASS | 110 entries; size 3,315,515 bytes; SHA-256 `E62E9B68...5B4DB` |
| 2026-08-11 | Release | Final local HTTP preview | PASS | zh-TW home, ten-item Fast Track and updated parking lesson returned 200; parking page contains both official sign labels |
| 2026-08-11 | F029 | Reported D006 lane diagnosis | PASS | Old right-turn arrow was in the westbound/oncoming half; correct destination is the eastbound left-side lane |
| 2026-08-11 | F029 | Candidate rebuild before reapproval | EXPECTED FAIL | Diagram gate rejected the stale public D006 because its prior approval hash no longer matched |
| 2026-08-11 | F029 | 600px/360px D006 review and approval | PASS | Continuous right-turn curve and B conflict path reviewed; new SHA-256 `37888b2d...9faa9`; 24/24 diagram gate passes |
| 2026-08-11 | F029 | `npm run verify:f029` | PASS | Focused SVG/lane/mobile checks plus lint, typecheck, content, diagram and build gates pass |
| 2026-08-11 | F029 | `npm run verify:release` | PASS | 21 unit files / 144 tests; 45 root Chromium passes, one expected skip, one separate project-base pass; 108 PWA URLs |
| 2026-08-11 | Release | Corrected static ZIP integrity check | PASS | 110 entries; size 3,315,580 bytes; SHA-256 `5B2C79CB...C12DF4` |
| 2026-08-11 | Publish | GitHub scope and credential scan | PASS | 292 project files staged; dependencies, build/test output, caches and `tmp/` excluded; no credential-pattern match |
| 2026-08-11 | Publish | Branch push | PASS | Commit `8ebcb75` pushed to `dfanx/japan-driving-guide:agent/publish-guide` without rewriting existing `main` |
| 2026-08-11 | Publish | Draft PR | PASS | PR #1 opened against `main`; connector returned 403, authenticated `gh pr create` fallback succeeded |
| 2026-08-11 | Publish | PR #1 merge | PASS | Head `9b55c00` was mergeable/clean and merged into `main` as `781ec5cc` |
| 2026-08-11 | F022 | Initial live Pages workflow | EXPECTED FAIL | All verification/build/base-path/smoke gates passed; Configure Pages returned Not Found because repository Pages was not enabled |
| 2026-08-11 | F022 | Pages workflow attempt 2 | PASS | Run `31474056007` passed build, artifact upload, and deploy after authorized workflow-source enablement |
| 2026-08-11 | F022 | Public HTTPS smoke | PASS | Root, zh-TW intersections lesson, and D006 returned 200; live D006 declares `eastbound-left` |

The F002 initialization emitted one non-fatal npm cleanup warning (`EPERM` on a
stale nested directory). `npm ci` returned 0, and the complete post-init verify
chain passed. Treat recurrence as a Windows filesystem observation, not as a
successful deletion guarantee.

## External verification boundary

- Live GitHub Pages deployment is verified. Third-party uptime and future
  authority-source changes remain external dependencies.
