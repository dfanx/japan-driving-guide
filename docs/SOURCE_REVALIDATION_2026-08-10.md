# Production Source Revalidation — 2026-08-10

Release content date: **2026-08-10**. This is an editorial review date, not a
claim that an external page cannot change after review.

## Method

- Re-open every Source URL on the release date.
- Read the current official publication at the claim-bearing section; a 200/URL
  response alone is not treated as content verification.
- Cross-check legal claims against NPA publications and the e-Gov law identifiers.
- Recheck NPA and MLIT public-data terms and NEXCO republication restrictions.
- Keep future law explicit; do not switch content using a browser or build clock.

## Register

| ID | Publisher | Result | Release evidence |
|---|---|---|---|
| S01 | NPA | verified | Traffic Bureau index lists the current 2026 foreign-licence and English traffic-rule publications. |
| S02 | NPA | verified | Current 8-page document confirms accepted licence combinations, designated translation route, and lawful-period limits. |
| S03 | NPA | verified | Current tourist sheet confirms red/arrow signals, full stop, intersection yield, alcohol and accident duties. |
| S04 | JAF | verified | Current traffic-rules page confirms left-side use, posted limits, signals, and expressway lanes. |
| S05 | JAF | verified | Current motor-vehicle training page confirms stop, rail crossing, red turn, right-turn yield, and passing-lane cases. |
| S06 | NPA | verified | Current road-crossing PDF confirms slow-to-stop approach, stop/yield, and no-pass rules. |
| S07 | NPA | verified | March 2026 passing sheet remains current; statutory duty and numerical safety guidance are split into separate Rules. |
| S08 | JNTO | verified | Current rental page confirms paper 1949 Geneva IDP, entry-date evidence, and eligible licence/translation route. |
| S09 | NPA | verified | Current page confirms 2026-09-01 commencement, 30 km/h covered roads, exclusions, and posted-limit priority. |
| S10 | NPA | verified | Current 16-page PDF confirms light/sign meanings; exact extracted-asset hashes remain stable. |
| S11 | NEXCO West | verified | Current English road-rules page confirms arrows, flashing lights, merge acceleration, and lane roles. |
| S12 | NEXCO West | verified | Current toll page confirms Ordinary, shared, and ETC-only lane eligibility. |
| S13 | NEXCO West | verified | Current manners page confirms lane return, weather limits, emergency shoulder behavior, and evacuation. |
| S14 | JAF | verified | Current driving-tips page confirms fuel selection and snow/whiteout precautions. |
| S15 | JAF | verified | Current emergency page confirms evacuation, 110/119, police report, and first aid. |
| S16 | e-Gov | verified (dynamic) | Current Road Traffic Act identifier and XML endpoint resolve; claims cross-checked through current NPA/JAF publications. |
| S17 | e-Gov | verified (dynamic) | Current enforcement-order identifier resolves; 2026 Article 11 and commencement cross-checked through S09. |
| S18 | MLIT | verified | Current page still identifies warning sign 207-A; upstream GIF bytes and attribution remain stable. |
| S19 | NEXCO West | verified | Current missed-exit page says never reverse/U-turn and continue to the next interchange. |

Machine-readable evidence: `src/data/source-revalidation.json`.

## Rights recheck

- NPA terms continue to place unmarked agency content under PDL 1.0 with source
  attribution and a third-party-rights caveat. No NPA logo is reused.
- MLIT terms continue to place unmarked ministry content under PDL 1.0 with
  attribution. The exact 207-A GIF is unchanged and attributed.
- NEXCO West policy still permits personal downloading but prohibits reposting
  site content to another site. ETC imagery therefore remains link-only; no
  NEXCO screenshot, hotlink, or redraw enters the product.

## Corrections made during revalidation

1. Added `JP-RULE-CYCLIST-PASSING-LAW-001` for the 2026-04-01 statutory duty;
   retained `JP-RULE-CYCLIST-PASSING-001` only for NPA numerical guidance.
2. Added S19 and moved the missed-exit Rule from generic S13 to the claim-bearing
   NEXCO West page.
3. Changed the public whole-catalog verification date to the oldest reviewed
   record, preventing a newer record from masking stale Sources or Rules.
4. Replaced the build-clock fallback with versioned `content-release.json`.

## Release-sensitive boundary

The 30 km/h local-road Rule remains `upcoming` for this release because its
explicit effective date is 2026-09-01. A later release must deliberately update
`contentAsOfDate` after renewed review; the browser clock cannot activate it.
