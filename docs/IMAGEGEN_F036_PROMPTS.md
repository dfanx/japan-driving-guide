# F036 image-generation record

## Generated candidate — rejected

- Generator: OpenAI built-in image generation (`imagegen` skill workflow)
- Candidate SHA-256: `456faf40344e7f27675dceccc3651936706e23933c78b2552a1b860ee046b00f`
- Decision: not published. Its white hatching read as a general merge buffer and
  did not clearly terminate in a right-turn lane.

## Reference roles

- Supplied `導流帯（ゼブラゾーン）` comparison: concept-only reference for a
  white guide strip, adjacent queue and vehicle conflict. No text, layout,
  symbols or artwork were copied.
- Previous D025 driver view: visual-context reference for a Japanese urban road,
  cool daylight, right-hand-drive dashboard and realistic scale.

## Prompt summary

Generate a photorealistic right-hand-drive view on a Japanese left-traffic
urban approach. Show a short queue in the left lane, a long white-only hatched
guide strip, and a silver car travelling partly within/across the hatching and
preparing to merge left. Keep all vehicles in the same direction and the road
geometry plausible. Use no yellow border, instructional overlay, fabricated
official sign, readable brand, caption or watermark.

## Published context photo

- Source: user-supplied photograph (`user_supplied_context_photo`)
- Published path: `public/assets/driver-simulations/d025-driver-view.webp`
- Normalized size: 1200x800, WebP quality 84
- SHA-256: `e86ee9c5f284746d8f84ef16bc48aa285db04f11da0800ed00dd4eb8cf72577f`
- Review: PASS on 2026-08-14. The real-road white hatching visibly feeds the
  right-turn path. Legal meaning remains in S29/S40 and D025, not in the photo.
