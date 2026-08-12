import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { GOLDEN_TEMPLATE_CASES } from "../../tools/diagram-generator/src/golden-fixtures";
import { fourWayIntersectionSceneSchema } from "../../tools/diagram-generator/src/schema";
import { renderFourWayIntersectionTemplate } from "../../tools/diagram-generator/src/templates";

describe("T01-T12 template golden output", () => {
  it("contains the complete canonical template set", () => {
    expect(GOLDEN_TEMPLATE_CASES.map((entry) => entry.name)).toEqual([
      "T01-straight-road",
      "T02-four-way-intersection",
      "T03-t-junction",
      "T04-crosswalk",
      "T05-railway-crossing",
      "T06-expressway-merge",
      "T07-expressway-lanes",
      "T08-toll-gate",
      "T09-parking-roadside",
      "T10-one-way-street",
      "T11-narrow-local-road",
      "T12-bicycle-passing",
    ]);
  });

  for (const goldenCase of GOLDEN_TEMPLATE_CASES) {
    it(`matches ${goldenCase.name}`, () => {
      const expected = readFileSync(
        new URL(
          `../../tools/diagram-generator/golden/${goldenCase.name}.svg`,
          import.meta.url,
        ),
        "utf8",
      );

      expect(goldenCase.svg).toBe(expected);
      expect(goldenCase.svg).toContain('viewBox="0 0 1200 800"');
      expect(goldenCase.svg).not.toMatch(/NaN|undefined|Infinity/);
      expect(goldenCase.svg).toMatch(/<title id="[^"]+">/);
      expect(goldenCase.svg).toMatch(/<desc id="[^"]+">/);

      const labelFontSizes = [...goldenCase.svg.matchAll(/<text[^>]+font-size="([\d.]+)"/g)].map(
        (match) => Number(match[1]),
      );
      expect(labelFontSizes.length).toBeGreaterThan(0);
      expect(labelFontSizes.every((size) => size >= 36)).toBe(true);

      const movementGroups = [
        ...goldenCase.svg.matchAll(
          /<g data-primitive="directional-arrow" data-tone="movement">(.*?)<\/g>/g,
        ),
      ];
      for (const movementGroup of movementGroups) {
        expect(movementGroup[1]).toContain('stroke="#f7fafb"');
        expect(movementGroup[1]).not.toContain('stroke="#d64242"');
      }
    });
  }

  it("keeps T08 lane labels schematic and T10 free of a redrawn sign face", () => {
    const tollGate = GOLDEN_TEMPLATE_CASES.find((entry) => entry.name === "T08-toll-gate")!.svg;
    const oneWay = GOLDEN_TEMPLATE_CASES.find((entry) => entry.name === "T10-one-way-street")!.svg;
    expect(tollGate).toContain('data-representation="schematic-not-sign"');
    expect(tollGate).not.toContain('data-primitive="traffic-sign"');
    expect(oneWay).not.toContain('data-primitive="traffic-sign"');
  });

  it("represents the bicycle-passing actor and clearance without an alert-red movement arrow", () => {
    const bicyclePassing = GOLDEN_TEMPLATE_CASES.find((entry) => entry.name === "T12-bicycle-passing")!.svg;
    expect(bicyclePassing).toContain('data-primitive="cyclist"');
    expect(bicyclePassing).toContain('data-primitive="clearance-guide"');
    expect(bicyclePassing).toContain('data-tone="movement"');
    expect(bicyclePassing).not.toMatch(/data-tone="movement"[^>]*stroke="#d64242"/);
  });

  it("keeps the T06 acceleration lane tangent to the mainline instead of forming a hard corner", () => {
    const expresswayMerge = GOLDEN_TEMPLATE_CASES.find(
      (entry) => entry.name === "T06-expressway-merge",
    )!.svg;

    expect(expresswayMerge).toContain('data-join="tangent-horizontal"');
    expect(expresswayMerge).toContain('data-primitive="merge-separator"');
    expect(expresswayMerge).toContain('data-taper-end="1030,490"');
    expect(expresswayMerge).toContain(
      'd="M 0 800 L 0 650 C 260 650 430 590 600 490 L 1050 490 C 920 490 760 650 610 700 C 420 770 230 800 0 800 Z"',
    );
    expect(expresswayMerge).not.toContain("L 560 490 C 410 620");
  });
});

describe("T02 reviewed-scene boundary", () => {
  it("renders D002 semantics without changing review status", () => {
    const scene = fourWayIntersectionSceneSchema.parse({
      id: "D002",
      schemaVersion: "1.0.0",
      template: "FourWayIntersection",
      canvas: { aspect: "3:2", viewBox: { width: 1200, height: 800 } },
      ruleIds: ["JP-RULE-SIGNAL-RED-001"],
      roads: {
        northSouth: { lanesPerDirection: 1 },
        eastWest: { lanesPerDirection: 1 },
      },
      crosswalks: ["south"],
      stopLines: ["south"],
      signals: [{ approach: "south", state: "red", greenArrows: [] }],
      vehicles: [
        {
          id: "A",
          color: "yellow",
          from: "south",
          maneuver: "straight",
          position: "before_stop_line",
          label: "A",
        },
      ],
      annotations: [
        { type: "instruction", kind: "stop_before_line", vehicleId: "A" },
      ],
      alt: { "zh-TW": "測試情境", en: "Test scene" },
      reviewStatus: "needs_review",
    });
    const output = renderFourWayIntersectionTemplate(scene);

    expect(output).toContain('data-diagram-id="D002"');
    expect(output).toContain('data-template="T02"');
    expect(output).toContain('data-primitive="crosswalk"');
    expect(output).toContain('data-primitive="stop-line"');
    expect(output).toContain('data-state="red"');
    expect(output).toContain('data-approach="south"');
    expect(output).toContain('data-position="ahead-of-approach-lane"');
    expect(output).toContain('height="41.5" href="data:image/png;base64,');
    expect(output).toContain('width="132" x="479" y="470"');
    expect(output).toContain('x1="545" x2="545" y1="735" y2="650"');
    expect(output).not.toContain('width="132" x="730" y="630"');
    expect(scene.reviewStatus).toBe("needs_review");
  });

  it("fails instead of silently dropping unsupported signal semantics", () => {
    const scene = fourWayIntersectionSceneSchema.parse({
      id: "D003",
      schemaVersion: "1.0.0",
      template: "FourWayIntersection",
      canvas: { aspect: "3:2", viewBox: { width: 1200, height: 800 } },
      ruleIds: ["JP-RULE-SIGNAL-RED-001"],
      roads: {
        northSouth: { lanesPerDirection: 1 },
        eastWest: { lanesPerDirection: 1 },
      },
      crosswalks: ["south"],
      stopLines: ["south"],
      signals: [
        { approach: "south", state: "red", greenArrows: ["right"] },
      ],
      vehicles: [
        {
          id: "A",
          color: "yellow",
          from: "south",
          maneuver: "right",
          position: "before_stop_line",
        },
      ],
      annotations: [],
      alt: { "zh-TW": "測試情境", en: "Test scene" },
      reviewStatus: "needs_review",
    });

    expect(() => renderFourWayIntersectionTemplate(scene)).toThrow(
      "green-arrow composition",
    );
  });
});
