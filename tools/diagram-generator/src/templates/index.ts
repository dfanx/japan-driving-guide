import { CANONICAL_CANVAS, type Bounds, type Point } from "../geometry/canvas";
import {
  crosswalk,
  cyclist,
  DIAGRAM_PALETTE,
  directionalArrow,
  laneBoundary,
  roadSegment,
  stopLine,
  officialTrafficLight,
  vehicle,
  type Heading,
  type SvgNode,
} from "../primitives";
import { NPA_RED_TRAFFIC_LIGHT_ASSET } from "../official-assets";
import { svgNode } from "../primitives/svg";
import { renderSvgDocument } from "../renderer";
import type { FourWayIntersectionScene } from "../schema";

export const TEMPLATE_IDS = {
  StraightRoad: "T01",
  FourWayIntersection: "T02",
  TJunction: "T03",
  Crosswalk: "T04",
  RailwayCrossing: "T05",
  ExpresswayMerge: "T06",
  ExpresswayLanes: "T07",
  TollGate: "T08",
  ParkingRoadside: "T09",
  OneWayStreet: "T10",
  NarrowLocalRoad: "T11",
  BicyclePassing: "T12",
} as const;

function canvasBackground(): SvgNode {
  return svgNode("rect", {
    "data-primitive": "canvas",
    fill: DIAGRAM_PALETTE.canvas,
    height: CANONICAL_CANVAS.height,
    width: CANONICAL_CANVAS.width,
    x: 0,
    y: 0,
  });
}

function renderTemplate(input: {
  id: string;
  template: string;
  title: string;
  description: string;
  nodes: readonly SvgNode[];
}): string {
  return renderSvgDocument({
    id: input.id,
    title: input.title,
    description: input.description,
    nodes: [
      canvasBackground(),
      svgNode(
        "g",
        { "data-template": input.template },
        { children: input.nodes },
      ),
    ],
  });
}

export function renderStraightRoadTemplate(input: {
  id: string;
  title: string;
  description: string;
}): string {
  const road = { x: 380, y: 0, width: 440, height: 800 } satisfies Bounds;
  return renderTemplate({
    ...input,
    template: TEMPLATE_IDS.StraightRoad,
    nodes: [
      roadSegment(road),
      laneBoundary({
        start: { x: 600, y: 6 },
        end: { x: 600, y: 794 },
        width: 8,
      }),
      vehicle({
        bounds: { x: 458, y: 580, width: 64, height: 100 },
        color: "yellow",
        heading: "north",
        label: "A",
      }),
      vehicle({
        bounds: { x: 678, y: 120, width: 64, height: 100 },
        color: "blue",
        heading: "south",
        label: "B",
      }),
      directionalArrow({
        from: { x: 490, y: 545 },
        to: { x: 490, y: 485 },
        tone: "movement",
      }),
      directionalArrow({
        from: { x: 710, y: 255 },
        to: { x: 710, y: 315 },
        tone: "movement",
      }),
    ],
  });
}

const approachHeading: Record<"north" | "east" | "south" | "west", Heading> = {
  north: "south",
  east: "west",
  south: "north",
  west: "east",
};

function fourWayCrosswalk(approach: FourWayIntersectionScene["crosswalks"][number]): SvgNode {
  const placements = {
    north: {
      bounds: { x: 490, y: 205, width: 220, height: 60 },
      orientation: "horizontal" as const,
    },
    east: {
      bounds: { x: 935, y: 290, width: 60, height: 220 },
      orientation: "vertical" as const,
    },
    south: {
      bounds: { x: 490, y: 535, width: 220, height: 60 },
      orientation: "horizontal" as const,
    },
    west: {
      bounds: { x: 205, y: 290, width: 60, height: 220 },
      orientation: "vertical" as const,
    },
  };
  return crosswalk({ ...placements[approach], stripeCount: 5 });
}

function fourWayStopLine(approach: FourWayIntersectionScene["stopLines"][number]): SvgNode {
  const placements: Record<typeof approach, Bounds> = {
    north: { x: 600, y: 170, width: 110, height: 12 },
    east: { x: 1018, y: 400, width: 12, height: 110 },
    south: { x: 490, y: 618, width: 110, height: 12 },
    west: { x: 170, y: 290, width: 12, height: 110 },
  };
  return stopLine(placements[approach]);
}

function fourWaySignal(
  signal: FourWayIntersectionScene["signals"][number],
): SvgNode {
  if (signal.greenArrows.length > 0) {
    throw new RangeError(
      "T02 green-arrow composition is not available in the D002 vertical slice",
    );
  }
  if (signal.state === "flashing_red" || signal.state === "flashing_yellow") {
    throw new RangeError(
      "T02 flashing-signal comparison requires a dedicated comparison scene",
    );
  }
  const placements: Record<typeof signal.approach, Bounds> = {
    north: { x: 345, y: 185, width: 132, height: 41.5 },
    east: { x: 1005, y: 535, width: 132, height: 41.5 },
    south: { x: 479, y: 470, width: 132, height: 41.5 },
    west: { x: 63, y: 250, width: 132, height: 41.5 },
  };
  return svgNode(
    "g",
    {
      "data-approach": signal.approach,
      "data-position": "ahead-of-approach-lane",
      "data-primitive": "approach-signal",
    },
    {
      children: [
        officialTrafficLight({
          asset: NPA_RED_TRAFFIC_LIGHT_ASSET,
          bounds: placements[signal.approach],
          state: signal.state,
        }),
      ],
    },
  );
}

function fourWayVehicle(
  actor: FourWayIntersectionScene["vehicles"][number],
): SvgNode {
  if (actor.position !== "before_stop_line") {
    throw new RangeError(
      `T02 ${actor.position} vehicle placement is deferred until reviewed scenes exist`,
    );
  }
  const placements: Record<typeof actor.from, Bounds> = {
    north: { x: 623, y: 38, width: 64, height: 100 },
    east: { x: 1052, y: 423, width: 100, height: 64 },
    south: { x: 513, y: 662, width: 64, height: 100 },
    west: { x: 48, y: 313, width: 100, height: 64 },
  };
  return vehicle({
    bounds: placements[actor.from],
    color: actor.color,
    heading: approachHeading[actor.from],
    label: actor.label,
  });
}

function stopInstruction(
  approach: FourWayIntersectionScene["vehicles"][number]["from"],
): SvgNode {
  const placements: Record<typeof approach, { from: Point; to: Point }> = {
    north: { from: { x: 735, y: 90 }, to: { x: 735, y: 150 } },
    east: { from: { x: 1100, y: 535 }, to: { x: 1040, y: 535 } },
    south: { from: { x: 545, y: 735 }, to: { x: 545, y: 650 } },
    west: { from: { x: 100, y: 265 }, to: { x: 160, y: 265 } },
  };
  return directionalArrow(placements[approach]);
}

export function renderFourWayIntersectionTemplate(
  scene: FourWayIntersectionScene,
): string {
  const nodes: SvgNode[] = [
    roadSegment({ x: 490, y: 0, width: 220, height: 800 }),
    roadSegment({ x: 0, y: 290, width: 1200, height: 220 }),
    laneBoundary({
      start: { x: 600, y: 6 },
      end: { x: 600, y: 284 },
      width: 7,
    }),
    laneBoundary({
      start: { x: 600, y: 516 },
      end: { x: 600, y: 794 },
      width: 7,
    }),
    laneBoundary({
      start: { x: 6, y: 400 },
      end: { x: 484, y: 400 },
      width: 7,
    }),
    laneBoundary({
      start: { x: 716, y: 400 },
      end: { x: 1194, y: 400 },
      width: 7,
    }),
    ...scene.crosswalks.map(fourWayCrosswalk),
    ...scene.stopLines.map(fourWayStopLine),
    ...scene.signals.map(fourWaySignal),
    ...scene.vehicles.map(fourWayVehicle),
  ];
  const vehiclesById = new Map(scene.vehicles.map((actor) => [actor.id, actor]));
  for (const annotation of scene.annotations) {
    if (annotation.type !== "instruction") {
      throw new RangeError(
        `T02 ${annotation.type} annotations are deferred until reviewed scenes exist`,
      );
    }
    const actor = vehiclesById.get(annotation.vehicleId);
    if (!actor) throw new RangeError(`Unknown annotation actor ${annotation.vehicleId}`);
    nodes.push(stopInstruction(actor.from));
  }

  return renderTemplate({
    id: scene.id,
    template: TEMPLATE_IDS.FourWayIntersection,
    title: scene.alt.en,
    description: scene.alt.en,
    nodes,
  });
}

export function renderTJunctionTemplate(input: {
  id: string;
  title: string;
  description: string;
}): string {
  return renderTemplate({
    ...input,
    template: TEMPLATE_IDS.TJunction,
    nodes: [
      roadSegment({ x: 0, y: 220, width: 1200, height: 280 }),
      roadSegment({ x: 460, y: 360, width: 280, height: 440 }),
      laneBoundary({
        start: { x: 6, y: 360 },
        end: { x: 454, y: 360 },
        width: 7,
      }),
      laneBoundary({
        start: { x: 746, y: 360 },
        end: { x: 1194, y: 360 },
        width: 7,
      }),
      laneBoundary({
        start: { x: 600, y: 506 },
        end: { x: 600, y: 794 },
        width: 7,
      }),
      stopLine({ x: 460, y: 548, width: 140, height: 12 }),
      vehicle({
        bounds: { x: 498, y: 625, width: 64, height: 100 },
        color: "yellow",
        heading: "north",
        label: "A",
      }),
    ],
  });
}

export function renderCrosswalkTemplate(input: {
  id: string;
  title: string;
  description: string;
}): string {
  return renderTemplate({
    ...input,
    template: TEMPLATE_IDS.Crosswalk,
    nodes: [
      roadSegment({ x: 430, y: 0, width: 340, height: 800 }),
      laneBoundary({
        start: { x: 600, y: 6 },
        end: { x: 600, y: 794 },
        width: 7,
      }),
      crosswalk({
        bounds: { x: 430, y: 275, width: 340, height: 100 },
        orientation: "horizontal",
        stripeCount: 7,
      }),
      stopLine({ x: 430, y: 425, width: 170, height: 12 }),
      vehicle({
        bounds: { x: 483, y: 540, width: 64, height: 100 },
        color: "blue",
        heading: "north",
        label: "A",
      }),
      directionalArrow({
        from: { x: 565, y: 610 },
        to: { x: 565, y: 465 },
        tone: "movement",
      }),
    ],
  });
}

export function renderRailwayCrossingTemplate(input: {
  id: string;
  title: string;
  description: string;
}): string {
  const sleepers = Array.from({ length: 17 }, (_, index) =>
    svgNode("rect", {
      fill: DIAGRAM_PALETTE.signalHousing,
      height: 64,
      width: 18,
      x: 40 + index * 70,
      y: 338,
    }),
  );
  return renderTemplate({
    ...input,
    template: TEMPLATE_IDS.RailwayCrossing,
    nodes: [
      roadSegment({ x: 430, y: 0, width: 340, height: 800 }),
      laneBoundary({
        start: { x: 600, y: 6 },
        end: { x: 600, y: 794 },
        width: 7,
      }),
      svgNode("g", { "data-primitive": "rail-crossing" }, { children: sleepers }),
      laneBoundary({
        start: { x: 6, y: 340 },
        end: { x: 1194, y: 340 },
        width: 10,
      }),
      laneBoundary({
        start: { x: 6, y: 400 },
        end: { x: 1194, y: 400 },
        width: 10,
      }),
      stopLine({ x: 430, y: 465, width: 170, height: 12 }),
      vehicle({
        bounds: { x: 483, y: 570, width: 64, height: 100 },
        color: "yellow",
        heading: "north",
        label: "A",
      }),
    ],
  });
}

export function renderExpresswayMergeTemplate(input: {
  id: string;
  title: string;
  description: string;
}): string {
  return renderTemplate({
    ...input,
    template: TEMPLATE_IDS.ExpresswayMerge,
    nodes: [
      roadSegment({ x: 0, y: 150, width: 1200, height: 340 }),
      svgNode("path", {
        "data-primitive": "merge-ramp",
        d: "M 0 760 L 0 610 C 260 610 390 540 530 420 L 760 420 L 760 490 L 560 490 C 410 620 260 760 0 760 Z",
        fill: DIAGRAM_PALETTE.road,
      }),
      laneBoundary({
        start: { x: 6, y: 320 },
        end: { x: 1194, y: 320 },
        width: 7,
        dashed: true,
      }),
      svgNode("path", {
        d: "M 20 620 C 280 620 420 545 555 438",
        fill: "none",
        stroke: DIAGRAM_PALETTE.roadMarking,
        "stroke-dasharray": "24 18",
        "stroke-width": 7,
      }),
      vehicle({
        bounds: { x: 730, y: 215, width: 100, height: 64 },
        color: "blue",
        heading: "east",
        label: "B",
      }),
      directionalArrow({
        from: { x: 650, y: 390 },
        to: { x: 730, y: 390 },
        tone: "movement",
      }),
      directionalArrow({
        from: { x: 400, y: 535 },
        to: { x: 465, y: 485 },
        tone: "movement",
      }),
    ],
  });
}

export function renderExpresswayLanesTemplate(input: {
  id: string;
  title: string;
  description: string;
}): string {
  return renderTemplate({
    ...input,
    template: TEMPLATE_IDS.ExpresswayLanes,
    nodes: [
      roadSegment({ x: 0, y: 170, width: 1200, height: 460 }),
      laneBoundary({ start: { x: 6, y: 323 }, end: { x: 1194, y: 323 }, width: 7, dashed: true }),
      laneBoundary({ start: { x: 6, y: 477 }, end: { x: 1194, y: 477 }, width: 7, dashed: true }),
      vehicle({ bounds: { x: 390, y: 366, width: 100, height: 64 }, color: "yellow", heading: "east", label: "A" }),
      vehicle({ bounds: { x: 720, y: 212, width: 100, height: 64 }, color: "blue", heading: "east", label: "B" }),
      directionalArrow({ from: { x: 520, y: 398 }, to: { x: 620, y: 398 }, tone: "movement" }),
      directionalArrow({ from: { x: 850, y: 244 }, to: { x: 950, y: 244 }, tone: "movement" }),
    ],
  });
}

export function renderTollGateTemplate(input: {
  id: string;
  title: string;
  description: string;
}): string {
  const booths = [260, 500, 740].map((x, index) =>
    svgNode("g", { "data-lane": String(index + 1), "data-primitive": "toll-booth", "data-representation": "schematic-not-sign" }, { children: [
      svgNode("rect", { fill: DIAGRAM_PALETTE.roadShoulder, height: 150, rx: 12, stroke: DIAGRAM_PALETTE.signalHousing, "stroke-width": 4, width: 180, x, y: 260 }),
      svgNode("line", { stroke: DIAGRAM_PALETTE.annotation, "stroke-linecap": "round", "stroke-width": 10, x1: x + 90, x2: x + 170, y1: 430, y2: 430 }),
      svgNode("text", { fill: DIAGRAM_PALETTE.badge, "font-family": "system-ui, sans-serif", "font-size": 36, "font-weight": 800, "text-anchor": "middle", x: x + 90, y: 335 }, { text: index === 0 ? "ETC" : "GENERAL" }),
    ] }),
  );
  return renderTemplate({
    ...input,
    template: TEMPLATE_IDS.TollGate,
    nodes: [
      roadSegment({ x: 160, y: 0, width: 880, height: 800 }),
      laneBoundary({ start: { x: 480, y: 6 }, end: { x: 480, y: 794 }, width: 7, dashed: true }),
      laneBoundary({ start: { x: 720, y: 6 }, end: { x: 720, y: 794 }, width: 7, dashed: true }),
      ...booths,
      vehicle({ bounds: { x: 318, y: 580, width: 64, height: 100 }, color: "yellow", heading: "north", label: "A" }),
    ],
  });
}

export function renderParkingRoadsideTemplate(input: {
  id: string;
  title: string;
  description: string;
}): string {
  return renderTemplate({
    ...input,
    template: TEMPLATE_IDS.ParkingRoadside,
    nodes: [
      roadSegment({ x: 280, y: 0, width: 640, height: 800 }),
      svgNode("rect", { "data-primitive": "curb", fill: DIAGRAM_PALETTE.roadShoulder, height: 800, width: 70, x: 280, y: 0 }),
      laneBoundary({ start: { x: 600, y: 6 }, end: { x: 600, y: 794 }, width: 7 }),
      vehicle({ bounds: { x: 365, y: 260, width: 64, height: 100 }, color: "blue", heading: "north", label: "P" }),
      vehicle({ bounds: { x: 680, y: 530, width: 64, height: 100 }, color: "yellow", heading: "north", label: "A" }),
      directionalArrow({ from: { x: 712, y: 500 }, to: { x: 712, y: 420 }, tone: "movement" }),
    ],
  });
}

export function renderOneWayStreetTemplate(input: {
  id: string;
  title: string;
  description: string;
}): string {
  return renderTemplate({
    ...input,
    template: TEMPLATE_IDS.OneWayStreet,
    nodes: [
      roadSegment({ x: 320, y: 0, width: 560, height: 800 }),
      laneBoundary({ start: { x: 600, y: 6 }, end: { x: 600, y: 794 }, width: 7, dashed: true }),
      vehicle({ bounds: { x: 430, y: 530, width: 64, height: 100 }, color: "yellow", heading: "north", label: "A" }),
      vehicle({ bounds: { x: 705, y: 250, width: 64, height: 100 }, color: "blue", heading: "north", label: "B" }),
      directionalArrow({ from: { x: 520, y: 480 }, to: { x: 520, y: 390 }, tone: "movement" }),
      directionalArrow({ from: { x: 680, y: 210 }, to: { x: 680, y: 120 }, tone: "movement" }),
    ],
  });
}

export function renderNarrowLocalRoadTemplate(input: {
  id: string;
  title: string;
  description: string;
}): string {
  return renderTemplate({
    ...input,
    template: TEMPLATE_IDS.NarrowLocalRoad,
    nodes: [
      svgNode("rect", { "data-primitive": "road-edge", fill: DIAGRAM_PALETTE.roadShoulder, height: 800, width: 90, x: 340, y: 0 }),
      roadSegment({ x: 430, y: 0, width: 340, height: 800 }),
      svgNode("rect", { "data-primitive": "road-edge", fill: DIAGRAM_PALETTE.roadShoulder, height: 800, width: 90, x: 770, y: 0 }),
      vehicle({ bounds: { x: 486, y: 520, width: 64, height: 100 }, color: "yellow", heading: "north", label: "A" }),
      directionalArrow({ from: { x: 600, y: 475 }, to: { x: 600, y: 365 }, tone: "movement" }),
      svgNode("text", { fill: DIAGRAM_PALETTE.roadMarking, "font-family": "system-ui, sans-serif", "font-size": 40, "font-weight": 800, "text-anchor": "middle", x: 600, y: 170 }, { text: "NARROW" }),
    ],
  });
}

export function renderBicyclePassingTemplate(input: {
  id: string;
  title: string;
  description: string;
}): string {
  return renderTemplate({
    ...input,
    template: TEMPLATE_IDS.BicyclePassing,
    nodes: [
      roadSegment({ x: 0, y: 170, width: 1200, height: 460 }),
      laneBoundary({ start: { x: 6, y: 400 }, end: { x: 1194, y: 400 }, width: 7 }),
      cyclist({ bounds: { x: 700, y: 190, width: 150, height: 100 }, heading: "east", label: "B" }),
      vehicle({ bounds: { x: 420, y: 318, width: 100, height: 64 }, color: "yellow", heading: "east", label: "A" }),
      directionalArrow({ from: { x: 550, y: 350 }, to: { x: 660, y: 350 }, tone: "movement" }),
      svgNode("g", { "data-primitive": "clearance-guide" }, { children: [
        svgNode("line", { stroke: DIAGRAM_PALETTE.success, "stroke-dasharray": "14 10", "stroke-width": 7, x1: 680, x2: 680, y1: 275, y2: 330 }),
        svgNode("text", { fill: DIAGRAM_PALETTE.success, "font-family": "system-ui, sans-serif", "font-size": 40, "font-weight": 800, "text-anchor": "middle", x: 600, y: 305 }, { text: "SPACE" }),
      ] }),
    ],
  });
}
