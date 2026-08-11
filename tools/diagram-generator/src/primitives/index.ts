import {
  assertBoundsWithinCanvas,
  assertFiniteNumber,
  assertPointWithinCanvas,
  assertPointWithMarginWithinCanvas,
  formatSvgNumber,
  type Bounds,
  type Point,
} from "../geometry/canvas";
import { svgNode, type SvgNode } from "./svg";

export { escapeXml, serializeSvgNode, serializeSvgNodes } from "./svg";
export type { SvgNode } from "./svg";

export const DIAGRAM_PALETTE = Object.freeze({
  canvas: "#dbe7eb",
  road: "#53616a",
  roadShoulder: "#c9d9df",
  roadMarking: "#f7fafb",
  signalHousing: "#20282d",
  signalOff: "#69757b",
  signalRed: "#d64242",
  signalYellow: "#e7b93f",
  signalGreen: "#16846f",
  vehicleYellow: "#e5b436",
  vehicleBlue: "#3f85a3",
  vehicleRed: "#c94646",
  vehicleGlass: "#d8e8ed",
  annotation: "#d64242",
  success: "#16846f",
  badge: "#315f78",
  badgeText: "#f7fbfc",
});

export type SignalState = "red" | "yellow" | "green";
export type VehicleColor = "yellow" | "blue" | "red";
export type Heading = "north" | "east" | "south" | "west";

function assertPositive(value: number, label: string): void {
  assertFiniteNumber(value, label);
  if (value <= 0) throw new RangeError(`${label} must be positive`);
}

export function roadSegment(bounds: Bounds): SvgNode {
  assertBoundsWithinCanvas(bounds, "roadSegment");
  return svgNode("rect", {
    "data-primitive": "road-segment",
    fill: DIAGRAM_PALETTE.road,
    height: bounds.height,
    rx: 0,
    width: bounds.width,
    x: bounds.x,
    y: bounds.y,
  });
}

export function laneBoundary(input: {
  start: Point;
  end: Point;
  width?: number;
  dashed?: boolean;
}): SvgNode {
  const width = input.width ?? 6;
  assertPositive(width, "laneBoundary.width");
  assertPointWithMarginWithinCanvas(
    input.start,
    width / 2,
    "laneBoundary.start",
  );
  assertPointWithMarginWithinCanvas(
    input.end,
    width / 2,
    "laneBoundary.end",
  );
  if (input.start.x === input.end.x && input.start.y === input.end.y) {
    throw new RangeError("laneBoundary requires two distinct points");
  }

  return svgNode("line", {
    "data-primitive": "lane-boundary",
    ...(input.dashed ? { "stroke-dasharray": "24 18" } : {}),
    "stroke-linecap": "butt",
    "stroke-width": width,
    stroke: DIAGRAM_PALETTE.roadMarking,
    x1: input.start.x,
    x2: input.end.x,
    y1: input.start.y,
    y2: input.end.y,
  });
}

export function stopLine(bounds: Bounds): SvgNode {
  assertBoundsWithinCanvas(bounds, "stopLine");
  return svgNode("rect", {
    "data-primitive": "stop-line",
    fill: DIAGRAM_PALETTE.roadMarking,
    height: bounds.height,
    width: bounds.width,
    x: bounds.x,
    y: bounds.y,
  });
}

export function crosswalk(input: {
  bounds: Bounds;
  orientation: "horizontal" | "vertical";
  stripeCount?: number;
}): SvgNode {
  const stripeCount = input.stripeCount ?? 5;
  assertBoundsWithinCanvas(input.bounds, "crosswalk");
  if (!Number.isInteger(stripeCount) || stripeCount < 3 || stripeCount > 12) {
    throw new RangeError("crosswalk.stripeCount must be an integer from 3 to 12");
  }

  const axisLength =
    input.orientation === "horizontal"
      ? input.bounds.height
      : input.bounds.width;
  const gapRatio = 0.55;
  const stripeSize = axisLength / (stripeCount + (stripeCount - 1) * gapRatio);
  const step = stripeSize * (1 + gapRatio);
  const stripes = Array.from({ length: stripeCount }, (_, index) => {
    const horizontal = input.orientation === "horizontal";
    return svgNode("rect", {
      fill: DIAGRAM_PALETTE.roadMarking,
      height: horizontal ? stripeSize : input.bounds.height,
      width: horizontal ? input.bounds.width : stripeSize,
      x: horizontal ? input.bounds.x : input.bounds.x + index * step,
      y: horizontal ? input.bounds.y + index * step : input.bounds.y,
    });
  });

  return svgNode(
    "g",
    {
      "data-orientation": input.orientation,
      "data-primitive": "crosswalk",
      "data-stripe-count": stripeCount,
    },
    { children: stripes },
  );
}

export function officialTrafficLight(input: {
  bounds: Bounds;
  state: SignalState;
  asset: {
    id: string;
    sourceId: string;
    authority: string;
    state?: string;
    dataUri: string;
    width: number;
    height: number;
  };
}): SvgNode {
  assertBoundsWithinCanvas(input.bounds, "officialTrafficLight");
  const minimumWidth = 80;
  const minimumHeight = 25;
  if (input.bounds.width < minimumWidth || input.bounds.height < minimumHeight) {
    throw new RangeError("officialTrafficLight bounds are too small");
  }
  if (input.asset.state !== input.state) {
    throw new RangeError(
      `${input.asset.id} represents ${input.asset.state ?? "no"} state, not ${input.state}`,
    );
  }
  if (!input.asset.dataUri.startsWith("data:image/png;base64,")) {
    throw new TypeError("officialTrafficLight requires an embedded PNG data URI");
  }

  return svgNode(
    "g",
    {
      "data-authority": input.asset.authority,
      "data-official-asset": input.asset.id,
      "data-primitive": "traffic-light",
      "data-source-id": input.asset.sourceId,
      "data-state": input.state,
    },
    {
      children: [
        svgNode("image", {
          height: input.bounds.height,
          href: input.asset.dataUri,
          preserveAspectRatio: "xMidYMid meet",
          width: input.bounds.width,
          x: input.bounds.x,
          y: input.bounds.y,
        }),
      ],
    },
  );
}

export function officialVisual(input: {
  bounds: Bounds;
  asset: {
    id: string;
    sourceId: string;
    authority: string;
    dataUri: string;
  };
}): SvgNode {
  assertBoundsWithinCanvas(input.bounds, "officialVisual");
  if (!/^data:image\/(?:png|jpeg|gif);base64,/.test(input.asset.dataUri)) {
    throw new TypeError("officialVisual requires an embedded supported image data URI");
  }
  return svgNode("g", {
    "data-authority": input.asset.authority,
    "data-official-asset": input.asset.id,
    "data-primitive": "official-visual",
    "data-source-id": input.asset.sourceId,
  }, { children: [
    svgNode("image", {
      height: input.bounds.height,
      href: input.asset.dataUri,
      preserveAspectRatio: "xMidYMid meet",
      width: input.bounds.width,
      x: input.bounds.x,
      y: input.bounds.y,
    }),
  ] });
}

export function labelBadge(input: {
  center: Point;
  label: string;
  radius?: number;
}): SvgNode {
  const radius = input.radius ?? 16;
  assertPointWithinCanvas(input.center, "labelBadge.center");
  assertPositive(radius, "labelBadge.radius");
  if (input.label.trim().length < 1 || input.label.trim().length > 3) {
    throw new RangeError("labelBadge.label must contain 1 to 3 characters");
  }
  assertBoundsWithinCanvas(
    {
      x: input.center.x - radius,
      y: input.center.y - radius,
      width: radius * 2,
      height: radius * 2,
    },
    "labelBadge",
  );

  return svgNode(
    "g",
    { "data-primitive": "label-badge" },
    {
      children: [
        svgNode("circle", {
          cx: input.center.x,
          cy: input.center.y,
          fill: DIAGRAM_PALETTE.badge,
          r: radius,
        }),
        svgNode(
          "text",
          {
            "dominant-baseline": "central",
            "font-family": "system-ui, sans-serif",
            "font-size": radius * 1.6,
            "font-weight": 700,
            "text-anchor": "middle",
            fill: DIAGRAM_PALETTE.badgeText,
            x: input.center.x,
            y: input.center.y,
          },
          { text: input.label.trim() },
        ),
      ],
    },
  );
}

export function vehicle(input: {
  bounds: Bounds;
  color: VehicleColor;
  heading: Heading;
  label?: string;
}): SvgNode {
  assertBoundsWithinCanvas(input.bounds, "vehicle");
  if (input.bounds.width < 36 || input.bounds.height < 54) {
    throw new RangeError("vehicle bounds are too small");
  }

  const fillByColor = {
    blue: DIAGRAM_PALETTE.vehicleBlue,
    red: DIAGRAM_PALETTE.vehicleRed,
    yellow: DIAGRAM_PALETTE.vehicleYellow,
  } as const;
  const center = {
    x: input.bounds.x + input.bounds.width / 2,
    y: input.bounds.y + input.bounds.height / 2,
  };
  const rotationByHeading = { north: 0, east: 90, south: 180, west: -90 } as const;
  const angle = rotationByHeading[input.heading];
  const localWidth = angle === 90 || angle === -90 ? input.bounds.height : input.bounds.width;
  const localHeight = angle === 90 || angle === -90 ? input.bounds.width : input.bounds.height;
  const localX = center.x - localWidth / 2;
  const localY = center.y - localHeight / 2;
  const bodyChildren: SvgNode[] = [
    svgNode("rect", {
      fill: fillByColor[input.color],
      height: localHeight,
      rx: Math.min(localWidth, localHeight) * 0.18,
      stroke: DIAGRAM_PALETTE.signalHousing,
      "stroke-width": 3,
      width: localWidth,
      x: localX,
      y: localY,
    }),
    svgNode("rect", {
      fill: DIAGRAM_PALETTE.vehicleGlass,
      height: localHeight * 0.2,
      rx: Math.min(localWidth, localHeight) * 0.08,
      width: localWidth * 0.68,
      x: localX + localWidth * 0.16,
      y: localY + localHeight * 0.16,
    }),
  ];
  const bodyTransform: Record<string, string> =
    angle === 0 ? {} : { transform: `rotate(${angle} ${center.x} ${center.y})` };
  const children: SvgNode[] = [
    svgNode("g", bodyTransform, { children: bodyChildren }),
  ];
  if (input.label) {
    children.push(
      labelBadge({
        center,
        label: input.label,
        radius: Math.min(input.bounds.width, input.bounds.height) * 0.36,
      }),
    );
  }

  return svgNode(
    "g",
    {
      "data-color": input.color,
      "data-heading": input.heading,
      "data-primitive": "vehicle",
    },
    { children },
  );
}

export function cyclist(input: {
  bounds: Bounds;
  heading: Heading;
  label?: string;
}): SvgNode {
  assertBoundsWithinCanvas(input.bounds, "cyclist");
  if (input.bounds.width < 54 || input.bounds.height < 54) {
    throw new RangeError("cyclist bounds are too small");
  }
  const center = {
    x: input.bounds.x + input.bounds.width / 2,
    y: input.bounds.y + input.bounds.height / 2,
  };
  const horizontal = input.heading === "east" || input.heading === "west";
  const axisLength = horizontal ? input.bounds.width : input.bounds.height;
  const wheelRadius = Math.min(input.bounds.width, input.bounds.height) * 0.18;
  const wheelOffset = axisLength * 0.28;
  const first = horizontal
    ? { x: center.x - wheelOffset, y: center.y }
    : { x: center.x, y: center.y - wheelOffset };
  const second = horizontal
    ? { x: center.x + wheelOffset, y: center.y }
    : { x: center.x, y: center.y + wheelOffset };
  const children: SvgNode[] = [
    svgNode("circle", {
      cx: first.x,
      cy: first.y,
      fill: "none",
      r: wheelRadius,
      stroke: DIAGRAM_PALETTE.roadMarking,
      "stroke-width": 5,
    }),
    svgNode("circle", {
      cx: second.x,
      cy: second.y,
      fill: "none",
      r: wheelRadius,
      stroke: DIAGRAM_PALETTE.roadMarking,
      "stroke-width": 5,
    }),
    svgNode("line", {
      stroke: DIAGRAM_PALETTE.roadMarking,
      "stroke-linecap": "round",
      "stroke-width": 6,
      x1: first.x,
      x2: second.x,
      y1: first.y,
      y2: second.y,
    }),
    svgNode("circle", {
      cx: center.x,
      cy: center.y - wheelRadius * 1.7,
      fill: DIAGRAM_PALETTE.vehicleYellow,
      r: wheelRadius * 0.65,
      stroke: DIAGRAM_PALETTE.signalHousing,
      "stroke-width": 3,
    }),
  ];
  if (input.label) {
    children.push(
      labelBadge({
        center: {
          x: center.x,
          y: center.y + Math.min(input.bounds.width, input.bounds.height) * 0.42,
        },
        label: input.label,
        radius: 23,
      }),
    );
  }
  return svgNode(
    "g",
    {
      "data-heading": input.heading,
      "data-primitive": "cyclist",
    },
    { children },
  );
}

export function pedestrian(input: {
  bounds: Bounds;
  heading: Heading;
  label?: string;
}): SvgNode {
  assertBoundsWithinCanvas(input.bounds, "pedestrian");
  if (input.bounds.width < 42 || input.bounds.height < 72) {
    throw new RangeError("pedestrian bounds are too small");
  }
  const centerX = input.bounds.x + input.bounds.width / 2;
  const headY = input.bounds.y + input.bounds.height * 0.18;
  const shoulderY = input.bounds.y + input.bounds.height * 0.4;
  const hipY = input.bounds.y + input.bounds.height * 0.66;
  const footY = input.bounds.y + input.bounds.height * 0.94;
  const halfWidth = input.bounds.width * 0.36;
  const children: SvgNode[] = [
    svgNode("circle", {
      cx: centerX,
      cy: headY,
      fill: DIAGRAM_PALETTE.vehicleYellow,
      r: input.bounds.width * 0.17,
      stroke: DIAGRAM_PALETTE.signalHousing,
      "stroke-width": 3,
    }),
    svgNode("line", {
      stroke: DIAGRAM_PALETTE.roadMarking,
      "stroke-linecap": "round",
      "stroke-width": 8,
      x1: centerX,
      x2: centerX,
      y1: shoulderY,
      y2: hipY,
    }),
    svgNode("path", {
      d: `M ${centerX - halfWidth} ${shoulderY + 8} L ${centerX} ${shoulderY} L ${centerX + halfWidth} ${shoulderY + 8}`,
      fill: "none",
      stroke: DIAGRAM_PALETTE.roadMarking,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": 7,
    }),
    svgNode("path", {
      d: `M ${centerX - halfWidth * 0.65} ${footY} L ${centerX} ${hipY} L ${centerX + halfWidth * 0.65} ${footY}`,
      fill: "none",
      stroke: DIAGRAM_PALETTE.roadMarking,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": 8,
    }),
  ];
  if (input.label) {
    children.push(
      labelBadge({
        center: { x: input.bounds.x + input.bounds.width, y: input.bounds.y + 8 },
        label: input.label,
        radius: 22,
      }),
    );
  }
  return svgNode(
    "g",
    { "data-heading": input.heading, "data-primitive": "pedestrian" },
    { children },
  );
}

export function directionalArrow(input: {
  from: Point;
  to: Point;
  tone?: "instruction" | "movement";
  width?: number;
}): SvgNode {
  const width = input.width ?? 9;
  const tone = input.tone ?? "instruction";
  const stroke =
    tone === "instruction"
      ? DIAGRAM_PALETTE.annotation
      : DIAGRAM_PALETTE.roadMarking;
  assertPositive(width, "directionalArrow.width");
  assertPointWithMarginWithinCanvas(
    input.from,
    width / 2,
    "directionalArrow.from",
  );
  assertPointWithMarginWithinCanvas(
    input.to,
    width / 2,
    "directionalArrow.to",
  );
  const deltaX = input.to.x - input.from.x;
  const deltaY = input.to.y - input.from.y;
  const length = Math.hypot(deltaX, deltaY);
  if (length < 24) {
    throw new RangeError("directionalArrow requires a length of at least 24 units");
  }

  const unitX = deltaX / length;
  const unitY = deltaY / length;
  const perpendicularX = -unitY;
  const perpendicularY = unitX;
  const headLength = Math.min(22, length * 0.35);
  const headWidth = headLength * 0.65;
  const base = {
    x: input.to.x - unitX * headLength,
    y: input.to.y - unitY * headLength,
  };
  const left = {
    x: base.x + perpendicularX * headWidth,
    y: base.y + perpendicularY * headWidth,
  };
  const right = {
    x: base.x - perpendicularX * headWidth,
    y: base.y - perpendicularY * headWidth,
  };
  assertPointWithMarginWithinCanvas(
    left,
    width / 2,
    "directionalArrow.headLeft",
  );
  assertPointWithMarginWithinCanvas(
    right,
    width / 2,
    "directionalArrow.headRight",
  );

  const pathData = [
    "M",
    formatSvgNumber(left.x),
    formatSvgNumber(left.y),
    "L",
    formatSvgNumber(input.to.x),
    formatSvgNumber(input.to.y),
    "L",
    formatSvgNumber(right.x),
    formatSvgNumber(right.y),
  ].join(" ");

  return svgNode(
    "g",
    { "data-primitive": "directional-arrow", "data-tone": tone },
    {
      children: [
        svgNode("line", {
          "stroke-linecap": "round",
          "stroke-width": width,
          stroke,
          x1: input.from.x,
          x2: input.to.x,
          y1: input.from.y,
          y2: input.to.y,
        }),
        svgNode("path", {
          d: pathData,
          fill: "none",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": width,
          stroke,
        }),
      ],
    },
  );
}
