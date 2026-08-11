# F028 Driver-seat Simulation Prompt and Review Record

## Boundary

These files were generated with OpenAI's built-in image generation tool on
2026-08-11. They are contextual simulations, not documentary photographs and
not legal or visual evidence. Exact sign and signal recognition remains in the
deterministic diagram and reviewed NPA/MLIT asset layers.

The tool session produced multiple candidates. The prompt set below is a
normalized record of the shared prompt and final scene directives; the selected
tool-output filenames and WebP hashes are the exact production identity.

## Shared prompt

> Photorealistic natural travel-safety training still, landscape 3:2, seen from
> the seated driver's eye position inside a modern right-hand-drive rental car
> in Japan. Cool clean daylight, realistic Japanese road scale and left-side
> traffic. No readable text, logo, watermark, caption, arrow, inset, split-screen
> or diagram overlay. Regulated traffic controls must be outside the crop or not
> identifiable. Context only; do not reproduce an official sign, signal, road
> marking, toll control or fuel-grade identifier.

## Scene directives

| Diagram | Final scene directive |
|---|---|
| D001 | Leave a car park and prepare to join the left lane. |
| D002 | Stop completely before the stop line and crosswalk at a red-controlled intersection; keep the signal outside crop. |
| D003 | Wait in a broad intersection's right-turn position with the turn path and oncoming lanes visible; exact green arrow shown later. |
| D004 | Quiet wet intersection where reflections make flashing-control interpretation harder; exact lamps shown later. |
| D005 | Full stop before the line at a blind residential T-junction. |
| D006 | Pause before a right turn while one oncoming vehicle enters the conflict area. |
| D007 | Pause before a left turn; a same-direction cyclist occupies the left-front road conflict path and a pedestrian waits beyond. |
| D008 | Narrow blind intersection with walls blocking both side views. |
| D009 | Pedestrian waiting beside a crossing with adequate stopping distance visible. |
| D010 | Follow a cyclist near the left edge of a narrow lane and wait for safe passing room. |
| D011 | Show the visual transition from a centre-lined road to a narrow residential street. |
| D012 | Stop at least five metres before railway rails because queued cars block the far-side exit; omit all rail-control hardware. |
| D013 | Blind residential T-junction with a plain stop line and no sign or pole in frame. |
| D014 | Wait at a side-street mouth while three cars on the cross street all travel left to right; exact signs shown later. |
| D015 | Urban curb with crossing, delivery activity and driveway; a proper parking facility lies ahead; omit parking controls. |
| D016 | Conservative travel on an ordinary suburban road; omit all speed signs and markings. |
| D017 | A near pedestrian crossing and more distant railway rails create two hazards; omit rail controls and warning signs. |
| D018 | Toll-plaza lanes fan out and require an early lane choice; keep boards unreadable. |
| D019 | Roadside crossing and driveway make curb parking unsuitable; a designated parking facility is visible ahead. |
| D020 | Motorway on-ramp approaches the main lanes with a merge gap to judge. |
| D021 | Remain in the left travel lane while another vehicle overtakes on the right. |
| D022 | Toll lanes divide quickly; exact payment-lane controls are taught separately. |
| D023 | Stop beside a self-service fuel island; crop or hide every nozzle color, grade and label. |
| D024 | Disabled vehicle stopped on the motorway shoulder while main-lane traffic continues. |

## Rejection and correction log

The following first candidates were rejected and do not enter production:

- D003, D006, D013-D017: generated or recognizable traffic-control faces.
- D007: cyclist placed on the sidewalk instead of the vehicle conflict path.
- D010: an invented overhead-diagram inset appeared in the photograph.
- D012: the vehicle position and far-side queue did not safely communicate the
  requirement to stop before entering.
- D014: vehicles travelled in opposing directions instead of one-way flow.
- D023: visible invented nozzle colors could be mistaken for fuel guidance.

All corrected versions remove the regulated control from the generated layer.
The exact control remains adjacent in the deterministic/official layer.

## Selected generation outputs

The source mapping is recorded in `scripts/process-driver-simulations.mjs`.
Production assets are 1200×800 WebP files under
`public/assets/driver-simulations/`; exact SHA-256 values and bilingual alt text
are locked in `src/data/driver-simulations.json`.
