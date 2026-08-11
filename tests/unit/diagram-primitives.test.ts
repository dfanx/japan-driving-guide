import { describe, expect, it } from "vitest";

import {
  crosswalk,
  cyclist,
  directionalArrow,
  labelBadge,
  laneBoundary,
  officialTrafficLight,
  pedestrian,
  roadSegment,
  serializeSvgNode,
  stopLine,
  vehicle,
} from "../../tools/diagram-generator/src/primitives";
import { NPA_RED_TRAFFIC_LIGHT_ASSET } from "../../tools/diagram-generator/src/official-assets";
import { formatSvgNumber } from "../../tools/diagram-generator/src/geometry/canvas";

describe("canonical SVG serialization", () => {
  it("sorts attributes and produces byte-stable output", () => {
    const primitive = roadSegment({ x: 0, y: 300, width: 1200, height: 200 });
    const expected =
      '<rect data-primitive="road-segment" fill="#53616a" height="200" rx="0" width="1200" x="0" y="300"/>';

    expect(serializeSvgNode(primitive)).toBe(expected);
    expect(serializeSvgNode(primitive)).toBe(expected);
  });

  it("normalizes SVG numbers to at most three decimals", () => {
    expect(formatSvgNumber(1.23456)).toBe("1.235");
    expect(formatSvgNumber(-0)).toBe("0");
    expect(() => formatSvgNumber(Number.NaN)).toThrow("finite");
  });

  it("escapes text content instead of accepting raw markup", () => {
    const output = serializeSvgNode(
      labelBadge({ center: { x: 100, y: 100 }, label: "A&" }),
    );

    expect(output).toContain(">A&amp;</text>");
    expect(output).not.toContain(">A&</text>");
  });
});

describe("D002 diagram primitives", () => {
  it("rejects road geometry outside the canonical canvas", () => {
    expect(() =>
      roadSegment({ x: 1100, y: 0, width: 200, height: 100 }),
    ).toThrow("fit within the canvas");
  });

  it("requires lane boundaries to have length and positive width", () => {
    expect(() =>
      laneBoundary({
        start: { x: 10, y: 10 },
        end: { x: 10, y: 10 },
      }),
    ).toThrow("distinct points");
    expect(() =>
      laneBoundary({
        start: { x: 10, y: 10 },
        end: { x: 20, y: 20 },
        width: 0,
      }),
    ).toThrow("positive");
    expect(() =>
      laneBoundary({
        start: { x: 0, y: 10 },
        end: { x: 20, y: 10 },
        width: 8,
      }),
    ).toThrow("plus its stroke");
  });

  it("serializes an explicit stop-line primitive", () => {
    expect(
      serializeSvgNode(stopLine({ x: 480, y: 650, width: 240, height: 12 })),
    ).toContain('data-primitive="stop-line"');
  });

  it("creates an exact, bounded crosswalk stripe count", () => {
    const primitive = crosswalk({
      bounds: { x: 450, y: 570, width: 300, height: 60 },
      orientation: "horizontal",
      stripeCount: 6,
    });

    expect(primitive.children).toHaveLength(6);
    expect(serializeSvgNode(primitive)).toContain('data-stripe-count="6"');
    expect(() =>
      crosswalk({
        bounds: { x: 450, y: 570, width: 300, height: 60 },
        orientation: "horizontal",
        stripeCount: 2,
      }),
    ).toThrow("3 to 12");
  });

  it("embeds the exact official traffic-light asset with provenance", () => {
    const output = serializeSvgNode(
      officialTrafficLight({
        asset: NPA_RED_TRAFFIC_LIGHT_ASSET,
        bounds: { x: 730, y: 630, width: 132, height: 41.5 },
        state: "red",
      }),
    );

    expect(output).toContain('data-state="red"');
    expect(output).toContain(
      'data-official-asset="NPA-S10-TRAFFIC-LIGHT-RED-HORIZONTAL"',
    );
    expect(output).toContain('data-source-id="S10"');
    expect(output).toContain('<image height="41.5" href="data:image/png;base64,');
    expect(output).not.toContain("<circle");
  });

  it("refuses to relabel an official asset as a different signal state", () => {
    expect(() =>
      officialTrafficLight({
        asset: NPA_RED_TRAFFIC_LIGHT_ASSET,
        bounds: { x: 730, y: 630, width: 132, height: 41.5 },
        state: "green",
      }),
    ).toThrow("represents red state, not green");
  });

  it("keeps vehicle output deterministic across cardinal headings", () => {
    const north = vehicle({
      bounds: { x: 550, y: 675, width: 64, height: 100 },
      color: "yellow",
      heading: "north",
      label: "A",
    });
    const east = vehicle({
      bounds: { x: 550, y: 675, width: 100, height: 64 },
      color: "blue",
      heading: "east",
    });

    expect(serializeSvgNode(north)).toContain('data-heading="north"');
    expect(serializeSvgNode(east)).toContain('transform="rotate(90 600 707)"');
    expect(serializeSvgNode(east)).not.toContain(
      '<g data-primitive="label-badge" transform=',
    );
  });

  it("keeps the cyclist actor bounded and explicitly non-regulatory", () => {
    const output = serializeSvgNode(
      cyclist({
        bounds: { x: 700, y: 495, width: 110, height: 70 },
        heading: "east",
        label: "B",
      }),
    );
    expect(output).toContain('data-primitive="cyclist"');
    expect(output).toContain('data-heading="east"');
    expect(output).not.toContain('data-primitive="traffic-sign"');
    expect(() => cyclist({ bounds: { x: 10, y: 10, width: 40, height: 40 }, heading: "east" })).toThrow("too small");
  });

  it("keeps the pedestrian actor bounded and explicitly non-regulatory", () => {
    const output = serializeSvgNode(
      pedestrian({
        bounds: { x: 760, y: 480, width: 62, height: 115 },
        heading: "west",
        label: "P",
      }),
    );
    expect(output).toContain('data-primitive="pedestrian"');
    expect(output).toContain('data-heading="west"');
    expect(output).not.toContain('data-primitive="traffic-sign"');
    expect(() =>
      pedestrian({
        bounds: { x: 10, y: 10, width: 30, height: 60 },
        heading: "east",
      }),
    ).toThrow("too small");
  });

  it("rejects arrows too short to communicate direction", () => {
    expect(() =>
      directionalArrow({ from: { x: 500, y: 500 }, to: { x: 510, y: 500 } }),
    ).toThrow("at least 24");
  });

  it("serializes a bounded instructional arrow", () => {
    const output = serializeSvgNode(
      directionalArrow({ from: { x: 650, y: 730 }, to: { x: 650, y: 680 } }),
    );

    expect(output).toContain('data-primitive="directional-arrow"');
    expect(output).toContain('data-tone="instruction"');
    expect(output).toContain("<path");
    expect(output).not.toMatch(/\d\.\d{4,}/);
  });

  it("uses a neutral road-marking tone for movement arrows", () => {
    const output = serializeSvgNode(
      directionalArrow({
        from: { x: 100, y: 100 },
        to: { x: 180, y: 100 },
        tone: "movement",
      }),
    );

    expect(output).toContain('data-tone="movement"');
    expect(output).toContain('stroke="#f7fafb"');
    expect(output).not.toContain('stroke="#d64242"');
  });

  it("rejects an arrow whose stroke would clip the canvas", () => {
    expect(() =>
      directionalArrow({ from: { x: 3, y: 100 }, to: { x: 60, y: 100 } }),
    ).toThrow("plus its stroke");
  });
});
