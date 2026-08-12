import type { Bounds } from "./geometry/canvas";
import {
  crosswalk,
  cyclist,
  DIAGRAM_PALETTE,
  directionalArrow,
  laneBoundary,
  officialVisual,
  pedestrian,
  roadSegment,
  stopLine,
  vehicle,
  type SvgNode,
} from "./primitives";
import { svgNode } from "./primitives/svg";
import { getReferenceAssets } from "./reference-assets";
import { renderSvgDocument } from "./renderer";
import type { z } from "astro/zod";
import { presetDiagramSceneSchema } from "./schema";
import {
  renderBicyclePassingTemplate,
  renderExpresswayLanesTemplate,
  renderExpresswayMergeTemplate,
  renderParkingRoadsideTemplate,
} from "./templates";

export type PresetDiagramScene = z.infer<typeof presetDiagramSceneSchema>;

const compositionTemplateId: Readonly<Record<PresetDiagramScene["composition"], string>> = {
  left_side_exit: "T03",
  signal_asset_card: "C01",
  comparison: "C02",
  intersection_movement: "T02",
  crosswalk: "T04",
  bicycle_passing: "T12",
  road_comparison: "C02",
  railway_crossing: "T05",
  sign_card: "C01",
  toll_gate: "T08",
  parking_roadside: "T09",
  expressway_merge: "T06",
  expressway_lanes: "T07",
  fuel_card: "C03",
  breakdown: "C04",
  guide_strip: "T13",
  actuated_signal: "T14",
  streetcar_signal: "C05",
  facility_entry: "T15",
};

export function presetTemplateId(scene: PresetDiagramScene): string {
  return compositionTemplateId[scene.composition];
}

function background(): SvgNode {
  return svgNode("rect", { "data-primitive": "canvas", fill: DIAGRAM_PALETTE.canvas, height: 800, width: 1200, x: 0, y: 0 });
}

function custom(scene: PresetDiagramScene, nodes: readonly SvgNode[]): string {
  return renderSvgDocument({
    id: scene.id,
    title: scene.alt.en,
    description: scene.alt.en,
    nodes: [background(), svgNode("g", { "data-composition": scene.composition, "data-template": presetTemplateId(scene) }, { children: nodes })],
  });
}

function text(label: string, x: number, y: number, options: { fill?: string; size?: number } = {}): SvgNode {
  return svgNode("text", {
    fill: options.fill ?? DIAGRAM_PALETTE.badge,
    "font-family": "system-ui, sans-serif",
    "font-size": options.size ?? 40,
    "font-weight": 800,
    "text-anchor": "middle",
    x,
    y,
  }, { text: label });
}

function checkMark(x: number, y: number): SvgNode {
  return svgNode("path", { d: `M ${x - 30} ${y} L ${x - 8} ${y + 24} L ${x + 38} ${y - 30}`, fill: "none", stroke: DIAGRAM_PALETTE.success, "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": 14 });
}

function errorMark(x: number, y: number): SvgNode {
  return svgNode("g", { "data-primitive": "error-mark" }, { children: [
    svgNode("line", { stroke: DIAGRAM_PALETTE.annotation, "stroke-linecap": "round", "stroke-width": 14, x1: x - 30, x2: x + 30, y1: y - 30, y2: y + 30 }),
    svgNode("line", { stroke: DIAGRAM_PALETTE.annotation, "stroke-linecap": "round", "stroke-width": 14, x1: x - 30, x2: x + 30, y1: y + 30, y2: y - 30 }),
  ] });
}

function renderOfficialCard(scene: PresetDiagramScene): string {
  const assets = getReferenceAssets(scene.assetIds);
  if (assets.length < 1 || assets.length > 2) throw new Error(`${scene.id} official card requires one or two assets`);
  const placements: Bounds[] = assets.length === 1
    ? [{ x: 260, y: 140, width: 680, height: 500 }]
    : [{ x: 45, y: 150, width: 520, height: 470 }, { x: 635, y: 150, width: 520, height: 470 }];
  return custom(scene, [
    ...placements.map((bounds) => svgNode("rect", { fill: "#ffffff", height: bounds.height, rx: 24, stroke: DIAGRAM_PALETTE.roadShoulder, "stroke-width": 5, width: bounds.width, x: bounds.x, y: bounds.y })),
    ...assets.map((asset, index) => officialVisual({ bounds: placements[index], asset })),
  ]);
}

function renderLeftSideExit(scene: PresetDiagramScene): string {
  return custom(scene, [
    roadSegment({ x: 0, y: 190, width: 1200, height: 300 }),
    roadSegment({ x: 470, y: 360, width: 260, height: 440 }),
    laneBoundary({ start: { x: 6, y: 340 }, end: { x: 464, y: 340 }, width: 7 }),
    laneBoundary({ start: { x: 736, y: 340 }, end: { x: 1194, y: 340 }, width: 7 }),
    laneBoundary({ start: { x: 600, y: 496 }, end: { x: 600, y: 794 }, width: 7 }),
    vehicle({ bounds: { x: 510, y: 610, width: 64, height: 100 }, color: "yellow", heading: "north", label: "A" }),
    directionalArrow({ from: { x: 455, y: 420 }, to: { x: 350, y: 420 }, tone: "movement" }),
    checkMark(260, 420),
  ]);
}

function renderStopComparison(scene: PresetDiagramScene): string {
  return custom(scene, [
    roadSegment({ x: 120, y: 0, width: 360, height: 800 }),
    roadSegment({ x: 720, y: 0, width: 360, height: 800 }),
    stopLine({ x: 120, y: 340, width: 180, height: 12 }),
    stopLine({ x: 720, y: 340, width: 180, height: 12 }),
    vehicle({ bounds: { x: 190, y: 490, width: 64, height: 100 }, color: "blue", heading: "north", label: "A" }),
    vehicle({ bounds: { x: 790, y: 300, width: 64, height: 100 }, color: "yellow", heading: "north", label: "B" }),
    checkMark(300, 665),
    errorMark(900, 665),
  ]);
}

function intersectionBase(): SvgNode[] {
  return [
    roadSegment({ x: 470, y: 0, width: 260, height: 800 }),
    roadSegment({ x: 0, y: 270, width: 1200, height: 260 }),
    laneBoundary({ start: { x: 600, y: 6 }, end: { x: 600, y: 264 }, width: 7 }),
    laneBoundary({ start: { x: 600, y: 536 }, end: { x: 600, y: 794 }, width: 7 }),
    laneBoundary({ start: { x: 6, y: 400 }, end: { x: 464, y: 400 }, width: 7 }),
    laneBoundary({ start: { x: 736, y: 400 }, end: { x: 1194, y: 400 }, width: 7 }),
  ];
}

function rightTurnPath(): SvgNode {
  return svgNode(
    "g",
    {
      "data-destination-lane": "eastbound-left",
      "data-primitive": "right-turn-path",
    },
    {
      children: [
        svgNode("path", {
          d: "M 532 610 L 532 470 C 532 390 600 335 740 335",
          fill: "none",
          stroke: DIAGRAM_PALETTE.roadMarking,
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": 9,
        }),
        directionalArrow({
          from: { x: 740, y: 335 },
          to: { x: 835, y: 335 },
          tone: "movement",
        }),
      ],
    },
  );
}

function renderIntersection(scene: PresetDiagramScene): string {
  if (scene.id === "D006") {
    return custom(scene, [...intersectionBase(),
      vehicle({ bounds: { x: 500, y: 640, width: 64, height: 100 }, color: "yellow", heading: "north", label: "A" }),
      vehicle({ bounds: { x: 636, y: 40, width: 64, height: 100 }, color: "blue", heading: "south", label: "B" }),
      directionalArrow({ from: { x: 668, y: 170 }, to: { x: 668, y: 585 }, tone: "movement" }),
      rightTurnPath(),
    ]);
  }
  if (scene.id === "D007") {
    return custom(scene, [svgNode("g", { "data-turn-position": "approach-left-edge", "data-left-check": "mirror-shoulder-crossing" }, { children: [...intersectionBase(),
      crosswalk({ bounds: { x: 470, y: 535, width: 260, height: 65 }, orientation: "horizontal", stripeCount: 5 }),
      vehicle({ bounds: { x: 485, y: 655, width: 64, height: 100 }, color: "yellow", heading: "north", label: "A" }),
      cyclist({ bounds: { x: 405, y: 650, width: 82, height: 58 }, heading: "north", label: "B" }),
      pedestrian({ bounds: { x: 770, y: 490, width: 62, height: 115 }, heading: "west", label: "P" }),
      directionalArrow({ from: { x: 517, y: 625 }, to: { x: 465, y: 615 }, tone: "instruction" }),
      text("先確認，再靠左", 270, 105, { fill: DIAGRAM_PALETTE.signalHousing, size: 34 }),
    ] })]);
  }
  return custom(scene, [...intersectionBase(),
    svgNode("rect", { "data-primitive": "visibility-blocker", fill: DIAGRAM_PALETTE.signalHousing, height: 240, width: 350, x: 0, y: 0 }),
    svgNode("rect", { "data-primitive": "visibility-blocker", fill: DIAGRAM_PALETTE.signalHousing, height: 240, width: 350, x: 850, y: 560 }),
    vehicle({ bounds: { x: 505, y: 650, width: 64, height: 100 }, color: "yellow", heading: "north", label: "A" }),
    directionalArrow({ from: { x: 537, y: 620 }, to: { x: 537, y: 560 }, tone: "movement" }),
  ]);
}

function renderCrosswalk(scene: PresetDiagramScene): string {
  return custom(scene, [
    roadSegment({ x: 430, y: 0, width: 340, height: 800 }),
    laneBoundary({ start: { x: 600, y: 6 }, end: { x: 600, y: 794 }, width: 7 }),
    crosswalk({ bounds: { x: 430, y: 270, width: 340, height: 95 }, orientation: "horizontal", stripeCount: 6 }),
    stopLine({ x: 430, y: 420, width: 170, height: 12 }),
    vehicle({ bounds: { x: 485, y: 545, width: 64, height: 100 }, color: "blue", heading: "north", label: "A" }),
    pedestrian({ bounds: { x: 350, y: 245, width: 62, height: 115 }, heading: "east", label: "P" }),
    directionalArrow({ from: { x: 517, y: 515 }, to: { x: 517, y: 465 }, tone: "movement" }),
  ]);
}

function renderRoadComparison(scene: PresetDiagramScene): string {
  return custom(scene, [
    svgNode("g", { "data-road-type": "no-centre-line", "data-effective-limit": "30-from-2026-09-01-unless-posted" }, { children: [
      roadSegment({ x: 120, y: 0, width: 320, height: 800 }),
      vehicle({ bounds: { x: 205, y: 520, width: 64, height: 100 }, color: "yellow", heading: "north", label: "A" }),
      svgNode("rect", { "data-representation": "teaching-label-not-road-sign", fill: "#ffffff", height: 150, rx: 18, stroke: DIAGRAM_PALETTE.signalHousing, "stroke-width": 6, width: 280, x: 140, y: 65 }),
      text("A 無中央線｜9·1 起", 280, 125, { fill: DIAGRAM_PALETTE.signalHousing, size: 32 }),
      text("無另標：30 km/h", 280, 180, { fill: DIAGRAM_PALETTE.signalHousing, size: 30 }),
    ] }),
    svgNode("g", { "data-road-type": "centre-line", "data-action": "read-posted-limit" }, { children: [
      roadSegment({ x: 680, y: 0, width: 400, height: 800 }),
      laneBoundary({ start: { x: 880, y: 6 }, end: { x: 880, y: 794 }, width: 7 }),
      vehicle({ bounds: { x: 760, y: 520, width: 64, height: 100 }, color: "blue", heading: "north", label: "B" }),
      svgNode("rect", { "data-representation": "teaching-label-not-road-sign", fill: "#ffffff", height: 150, rx: 18, stroke: DIAGRAM_PALETTE.signalHousing, "stroke-width": 6, width: 340, x: 710, y: 65 }),
      text("B  有中央線", 880, 125, { fill: DIAGRAM_PALETTE.signalHousing, size: 38 }),
      text("看現場速限", 880, 180, { fill: DIAGRAM_PALETTE.signalHousing, size: 32 }),
    ] }),
  ]);
}

function renderRailway(scene: PresetDiagramScene): string {
  const sleepers = Array.from({ length: 16 }, (_, index) => svgNode("rect", { fill: DIAGRAM_PALETTE.signalHousing, height: 64, width: 18, x: 55 + index * 72, y: 338 }));
  return custom(scene, [
    roadSegment({ x: 430, y: 0, width: 340, height: 800 }),
    laneBoundary({ start: { x: 600, y: 6 }, end: { x: 600, y: 794 }, width: 7 }),
    svgNode("g", { "data-primitive": "rail-crossing" }, { children: sleepers }),
    laneBoundary({ start: { x: 6, y: 340 }, end: { x: 1194, y: 340 }, width: 10 }),
    laneBoundary({ start: { x: 6, y: 400 }, end: { x: 1194, y: 400 }, width: 10 }),
    stopLine({ x: 430, y: 465, width: 170, height: 12 }),
    vehicle({ bounds: { x: 485, y: 580, width: 64, height: 100 }, color: "yellow", heading: "north", label: "A" }),
    vehicle({ bounds: { x: 485, y: 170, width: 64, height: 100 }, color: "red", heading: "north", label: "B" }),
    errorMark(870, 370),
  ]);
}

function tollPanel(x: number, primary: string, secondary: string): SvgNode[] {
  return [
    svgNode("rect", { "data-representation": "schematic-not-sign", fill: DIAGRAM_PALETTE.roadShoulder, height: 150, rx: 12, stroke: DIAGRAM_PALETTE.signalHousing, "stroke-width": 4, width: 245, x, y: 210 }),
    text(primary, x + 122.5, 275, { size: 38 }),
    text(secondary, x + 122.5, 325, { size: 32 }),
  ];
}

function renderToll(scene: PresetDiagramScene): string {
  const middlePrimary = scene.id === "D022" ? "ETC／一般" : "一般";
  const middleSecondary = scene.id === "D022" ? "ETC / GENERAL" : "GENERAL";
  return custom(scene, [
    roadSegment({ x: 120, y: 0, width: 960, height: 800 }),
    laneBoundary({ start: { x: 440, y: 6 }, end: { x: 440, y: 794 }, width: 7, dashed: true }),
    laneBoundary({ start: { x: 760, y: 6 }, end: { x: 760, y: 794 }, width: 7, dashed: true }),
    ...tollPanel(158, "ETC 専用", "ETC ONLY"),
    ...tollPanel(478, middlePrimary, middleSecondary),
    ...tollPanel(798, "一般", "GENERAL"),
    errorMark(280, 455),
    checkMark(scene.id === "D022" ? 920 : 600, 455),
    vehicle({ bounds: { x: scene.id === "D022" ? 888 : 568, y: 610, width: 64, height: 100 }, color: "yellow", heading: "north", label: "A" }),
  ]);
}

function renderFuel(scene: PresetDiagramScene): string {
  const cards = [
    { x: 90, color: "#d64242", label: "レギュラー" },
    { x: 440, color: "#e7b93f", label: "ハイオク" },
    { x: 790, color: "#16846f", label: "軽油" },
  ];
  return custom(scene, cards.flatMap((card) => [
    svgNode("rect", { fill: "#ffffff", height: 470, rx: 24, stroke: card.color, "stroke-width": 16, width: 300, x: card.x, y: 150 }),
    svgNode("circle", { cx: card.x + 150, cy: 320, fill: card.color, r: 86 }),
    text(card.label, card.x + 150, 520, { size: 42 }),
  ]));
}

function renderBreakdown(scene: PresetDiagramScene): string {
  return custom(scene, [
    roadSegment({ x: 0, y: 150, width: 1200, height: 430 }),
    laneBoundary({ start: { x: 6, y: 360 }, end: { x: 1194, y: 360 }, width: 7, dashed: true }),
    svgNode("rect", { "data-primitive": "shoulder", fill: DIAGRAM_PALETTE.roadShoulder, height: 130, width: 1200, x: 0, y: 580 }),
    svgNode("line", { "data-primitive": "guardrail", stroke: DIAGRAM_PALETTE.signalHousing, "stroke-width": 16, x1: 6, x2: 1194, y1: 710, y2: 710 }),
    vehicle({ bounds: { x: 300, y: 500, width: 100, height: 64 }, color: "red", heading: "east", label: "A" }),
    pedestrian({ bounds: { x: 735, y: 690, width: 55, height: 100 }, heading: "east", label: "P" }),
    directionalArrow({ from: { x: 540, y: 635 }, to: { x: 700, y: 735 }, tone: "instruction" }),
  ]);
}

function renderParkingMarkingComparison(scene: PresetDiagramScene): string {
  const panel = (x: number, dashed: boolean, title: string, subtitle: string, allowed: boolean): SvgNode[] => [
    svgNode("g", { "data-roadside-marking": dashed ? "yellow-broken" : "yellow-solid" }, { children: [
      roadSegment({ x, y: 120, width: 400, height: 560 }),
      svgNode("line", { stroke: "#f0b800", ...(dashed ? { "stroke-dasharray": "42 30" } : {}), "stroke-width": 18, x1: x + 54, x2: x + 54, y1: 150, y2: 650 }),
      vehicle({ bounds: { x: x + 105, y: 450, width: 64, height: 100 }, color: "yellow", heading: "north", label: dashed ? "B" : "A" }),
      svgNode("rect", { "data-representation": "teaching-label-not-road-sign", fill: "#ffffff", height: 120, rx: 16, stroke: DIAGRAM_PALETTE.signalHousing, "stroke-width": 4, width: 340, x: x + 30, y: 15 }),
      text(title, x + 200, 65, { fill: DIAGRAM_PALETTE.signalHousing, size: 32 }),
      text(subtitle, x + 200, 108, { fill: DIAGRAM_PALETTE.signalHousing, size: 27 }),
      allowed ? checkMark(x + 310, 600) : errorMark(x + 310, 600),
    ] }),
  ];
  return custom(scene, [
    ...panel(100, false, "黃色實線", "駐車＋臨時停車禁止", false),
    ...panel(700, true, "黃色破線", "禁止駐車", true),
  ]);
}

function renderGuideStrip(scene: PresetDiagramScene): string {
  const hatch = Array.from({ length: 8 }, (_, index) => svgNode("line", { stroke: DIAGRAM_PALETTE.roadMarking, "stroke-width": 12, x1: 560, x2: 690, y1: 250 + index * 48, y2: 330 + index * 48 }));
  return custom(scene, [
    svgNode("g", { "data-guide-strip": "keep-clear" }, { children: [
      roadSegment({ x: 200, y: 0, width: 800, height: 800 }),
      laneBoundary({ start: { x: 465, y: 6 }, end: { x: 465, y: 794 }, width: 7, dashed: true }),
      svgNode("path", { d: "M 560 170 C 600 270 650 330 700 390 C 650 500 600 575 560 650 Z", fill: DIAGRAM_PALETTE.roadShoulder, stroke: DIAGRAM_PALETTE.roadMarking, "stroke-width": 8 }),
      ...hatch,
      vehicle({ bounds: { x: 350, y: 600, width: 64, height: 100 }, color: "yellow", heading: "north", label: "A" }),
      directionalArrow({ from: { x: 382, y: 565 }, to: { x: 382, y: 250 }, tone: "movement" }),
      vehicle({ bounds: { x: 790, y: 600, width: 64, height: 100 }, color: "blue", heading: "north", label: "B" }),
      directionalArrow({ from: { x: 822, y: 565 }, to: { x: 820, y: 250 }, tone: "movement" }),
      text("沿標線外側走", 600, 755, { fill: "#ffffff", size: 34 }),
    ] }),
  ]);
}

function renderActuatedSignal(scene: PresetDiagramScene): string {
  return custom(scene, [
    svgNode("g", { "data-signal-type": "vehicle-actuated", "data-detection-position": "before-stop-line" }, { children: [
      roadSegment({ x: 380, y: 0, width: 440, height: 800 }),
      laneBoundary({ start: { x: 600, y: 6 }, end: { x: 600, y: 794 }, width: 7 }),
      stopLine({ x: 380, y: 330, width: 220, height: 14 }),
      svgNode("rect", { fill: "#ffffff", height: 110, rx: 20, stroke: DIAGRAM_PALETTE.signalHousing, "stroke-width": 6, width: 260, x: 470, y: 55 }),
      svgNode("circle", { cx: 600, cy: 110, fill: DIAGRAM_PALETTE.annotation, r: 42 }),
      svgNode("path", { d: "M 430 350 C 455 410 455 505 430 565 L 770 565 C 745 505 745 410 770 350 Z", fill: "#80c7c933", stroke: DIAGRAM_PALETTE.success, "stroke-dasharray": "18 14", "stroke-width": 7 }),
      vehicle({ bounds: { x: 510, y: 420, width: 64, height: 100 }, color: "yellow", heading: "north", label: "A" }),
      text("停在線前，等待感應", 600, 700, { fill: "#ffffff", size: 36 }),
      checkMark(920, 470),
    ] }),
  ]);
}

function renderStreetcarSignal(scene: PresetDiagramScene): string {
  return custom(scene, [
    svgNode("g", { "data-yellow-arrow-applies-to": "streetcar-only" }, { children: [
      roadSegment({ x: 170, y: 150, width: 860, height: 500 }),
      laneBoundary({ start: { x: 560, y: 165 }, end: { x: 560, y: 635 }, width: 8 }),
      laneBoundary({ start: { x: 640, y: 165 }, end: { x: 640, y: 635 }, width: 8 }),
      svgNode("rect", { fill: DIAGRAM_PALETTE.signalHousing, height: 170, rx: 16, width: 260, x: 470, y: 20 }),
      svgNode("path", { d: "M 555 110 L 645 110 M 620 80 L 650 110 L 620 140", fill: "none", stroke: "#f0b800", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": 20 }),
      svgNode("rect", { "data-primitive": "streetcar", fill: "#d64242", height: 150, rx: 18, stroke: "#ffffff", "stroke-width": 6, width: 92, x: 554, y: 300 }),
      vehicle({ bounds: { x: 310, y: 410, width: 64, height: 100 }, color: "yellow", heading: "north", label: "A" }),
      errorMark(342, 330),
      checkMark(600, 535),
      text("黃箭頭｜路面電車", 600, 730, { fill: DIAGRAM_PALETTE.signalHousing, size: 38 }),
    ] }),
  ]);
}

function renderFacilityEntry(scene: PresetDiagramScene): string {
  return custom(scene, [
    svgNode("g", { "data-sidewalk-entry": "stop-before-crossing", "data-reorientation": "legal-safe-location-only" }, { children: [
      roadSegment({ x: 0, y: 300, width: 1200, height: 300 }),
      laneBoundary({ start: { x: 6, y: 450 }, end: { x: 1194, y: 450 }, width: 7 }),
      svgNode("rect", { fill: "#c9d8d6", height: 120, width: 1200, x: 0, y: 180 }),
      svgNode("rect", { fill: DIAGRAM_PALETTE.roadShoulder, height: 180, width: 300, x: 85, y: 0 }),
      text("停車場入口", 235, 105, { fill: "#ffffff", size: 36 }),
      stopLine({ x: 85, y: 270, width: 150, height: 12 }),
      pedestrian({ bounds: { x: 330, y: 180, width: 58, height: 105 }, heading: "west", label: "P" }),
      vehicle({ bounds: { x: 760, y: 485, width: 100, height: 64 }, color: "yellow", heading: "west", label: "A" }),
      svgNode("path", { d: "M 760 517 C 560 517 430 500 330 420 C 260 365 220 330 200 275", fill: "none", stroke: DIAGRAM_PALETTE.success, "stroke-linecap": "round", "stroke-width": 12 }),
      directionalArrow({ from: { x: 230, y: 330 }, to: { x: 200, y: 275 }, tone: "instruction" }),
      checkMark(520, 680),
      text("同向接近｜人行道前先停", 600, 755, { fill: DIAGRAM_PALETTE.signalHousing, size: 34 }),
    ] }),
  ]);
}

export function renderPresetScene(scene: PresetDiagramScene): string {
  const common = { id: scene.id, title: scene.alt.en, description: scene.alt.en };
  switch (scene.composition) {
    case "left_side_exit": return renderLeftSideExit(scene);
    case "signal_asset_card":
    case "sign_card": return renderOfficialCard(scene);
    case "comparison": return renderStopComparison(scene);
    case "intersection_movement": return renderIntersection(scene);
    case "crosswalk": return renderCrosswalk(scene);
    case "bicycle_passing": return renderBicyclePassingTemplate(common);
    case "road_comparison": return renderRoadComparison(scene);
    case "railway_crossing": return renderRailway(scene);
    case "toll_gate": return renderToll(scene);
    case "parking_roadside": return scene.id === "D019" ? renderParkingMarkingComparison(scene) : renderParkingRoadsideTemplate(common);
    case "expressway_merge": return renderExpresswayMergeTemplate(common);
    case "expressway_lanes": return renderExpresswayLanesTemplate(common);
    case "fuel_card": return renderFuel(scene);
    case "breakdown": return renderBreakdown(scene);
    case "guide_strip": return renderGuideStrip(scene);
    case "actuated_signal": return renderActuatedSignal(scene);
    case "streetcar_signal": return renderStreetcarSignal(scene);
    case "facility_entry": return renderFacilityEntry(scene);
  }
}
