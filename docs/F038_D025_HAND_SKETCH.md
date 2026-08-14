# F038 D025 hand-sketched geometry and right indicator

## Geometry correction

The F037 three-panel sequence was retained, but its road shape still implied
that the right-turn lane branched sideways at the top. The supplied hand sketch
identified the clearer real-road model:

- queued through traffic remains in a full left lane;
- a full right-turn lane already exists on the right;
- the guide strip occupies the lower approach and tapers until that right-turn
  lane becomes fully available;
- the turning vehicle crosses toward that lane from below rather than following
  an abstract path to a detached arrow.

All three panels now repeat this exact road geometry. The comparison changes
only the guide-strip border and conflict state.

## Turn intent

Every B vehicle that is shown preparing for the right-turn lane has one
illuminated amber indicator on the vehicle's physical right side. The SVG uses
`data-indicator="right"`, `data-side="vehicle-right"` and `data-state="on"`.
There is no left-side indicator, so the mark cannot be interpreted as hazard
lights.

## Review

- 600px and 360px renders inspected.
- Approved D025 output:
  `sha256:120d937cd98a5203562f139c0a8f3925bda71b1f9065f65348f12460790ff651`.
- Rule/source content remains unchanged; the hand sketch determines visual
  composition only.
