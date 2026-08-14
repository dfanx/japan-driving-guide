# F037 Concrete three-panel guide-strip diagram

## Problem

The previous D025 schematic was legally correct but visually abstract. It put
the white guide strip and yellow-bordered entry-prohibited area into two broad
panels, while the moving queue, right-turn lane and collision mechanism were
mostly implied by labels and paths.

## Redraw

D025 now follows the supplied three-step teaching sequence without copying its
surface artwork:

1. A queue remains in the normal lane while vehicle B travels through the
   white guide strip toward the explicit right-turn lane. A circle marks that
   the white marking itself does not prohibit crossing.
2. The same road geometry gains a continuous yellow border. Vehicle B's path
   through that area is paired with a cross because the marked area is entry
   prohibited.
3. A vehicle in the hatching conflicts with a vehicle beside the queue. This
   makes the safety warning concrete: legal entry does not make the strip empty
   or safe for a fast queue jump.

The three panels retain `data-guide-strip`, `data-entry-prohibited`,
`data-turn-lane` and `data-risk` markers so geometry remains testable rather
than decorative.

## Review

- 600px and 360px review renders inspected.
- F037 approved output was `sha256:62622967...661a4`; F038 supersedes its
  geometry with the hand-sketched straight/right-turn lane composition.
- The source/rule distinction remains unchanged: S29/S40 support the Rule; the
  supplied image only routes the visual teaching structure.
