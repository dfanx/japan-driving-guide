# F036 Guide-strip correction

## Finding

The previous D025 lesson, driver view and schematic taught a blanket rule to
stay outside white hatching. That was incorrect. The National Police Agency
defines `導流帯` (marking 208-2) as a device for guiding vehicles safely and
smoothly. Its regulation standard separately says that, where vehicle entry
must be prohibited, an `立入り禁止部分` regulation is required.

The distinction is therefore:

- white hatching with a white border: guide strip; the marking itself does not
  prohibit entry or crossing;
- white hatching enclosed by a yellow border: the separately regulated
  entry-prohibited area; vehicles must not enter;
- additional signs, lane boundaries, arrows and police directions still apply.

This does not make the white guide strip a preferred travel or passing lane.
The learner action is to expect another vehicle in the hatching, signal early,
check ahead, mirrors and blind spots, and avoid a fast queue jump.

## Evidence

- S29 — NPA Traffic methods guide: vehicles must not enter a marked
  `立入り禁止部分`.
- S40 — NPA Traffic regulation standards: guide strips guide traffic; a
  separate entry-prohibited-area regulation is required when entry must be
  banned.
- The supplied comparison image was used only to identify the disputed concept
  and collision scenario. Its layout and artwork were not copied.

## Visual correction

- Context photo: the initially generated candidate was rejected because its
  guide strip did not clearly terminate in a right-turn lane. The published
  1200x800 WebP is the user-supplied real-road photograph, showing the white
  hatching leading into the right-turn path. Asset SHA-256 begins `e86ee9c5`.
- D025: rebuilt in the deterministic SVG system as a two-panel comparison.
  `data-guide-strip="crossable-white"` identifies the white guide strip;
  `data-entry-prohibited="yellow-bordered"` identifies the prohibited area;
  `data-risk="vehicle-in-hatching"` preserves the merge hazard. Reviewed public
  SVG SHA-256 begins `2f15a11a`.

## Review boundary

The user-supplied photo establishes scene recognition, not law. The deterministic
diagram explains geometry, while S29/S40 support the regulatory distinction.
Neither visual contains or impersonates an official traffic control.
