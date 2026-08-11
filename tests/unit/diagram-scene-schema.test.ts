import { describe, expect, it } from "vitest";

import {
  diagramSceneSchema,
  validateDiagramScenes,
} from "../../tools/diagram-generator/src/schema";
import { validateQuestionData } from "../../src/lib/content/question-schema";
import { ruleSchema } from "../../src/lib/content/schema";

const rule = ruleSchema.parse({
  id: "JP-RULE-SIGNAL-RED-001",
  title: {
    "zh-TW": "紅燈時不得自行轉彎",
    en: "Do not turn on red without an applicable green arrow",
  },
  category: "signals",
  touristPriority: "must_know",
  legalOrGuidance: "legal_rule",
  sourceIds: ["S03"],
  verifiedAt: "2026-08-09",
  effectiveFrom: null,
  effectiveTo: null,
  reviewStatus: "approved",
  lessonIds: ["M02-signals"],
});

const scene = {
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
  alt: {
    "zh-TW": "黃色 A 車停於紅燈停止線前。",
    en: "Yellow vehicle A is stopped before the line at a red signal.",
  },
  reviewStatus: "needs_review",
} as const;

describe("Diagram Scene schema", () => {
  it("accepts the semantic D002 scene", () => {
    expect(diagramSceneSchema.safeParse(scene).success).toBe(true);
  });

  it("rejects a non-canonical viewBox", () => {
    const result = diagramSceneSchema.safeParse({
      ...scene,
      canvas: { aspect: "3:2", viewBox: { width: 1000, height: 800 } },
    });

    expect(result.success).toBe(false);
  });

  it("rejects duplicate signal approaches", () => {
    const result = diagramSceneSchema.safeParse({
      ...scene,
      signals: [scene.signals[0], scene.signals[0]],
    });

    expect(result.success).toBe(false);
  });

  it("rejects duplicate vehicle IDs", () => {
    const result = diagramSceneSchema.safeParse({
      ...scene,
      vehicles: [scene.vehicles[0], scene.vehicles[0]],
    });

    expect(result.success).toBe(false);
  });

  it("rejects an annotation pointing to an unknown vehicle", () => {
    const result = diagramSceneSchema.safeParse({
      ...scene,
      annotations: [
        { type: "instruction", kind: "stop_before_line", vehicleId: "Z" },
      ],
    });

    expect(result.success).toBe(false);
  });
});

describe("Diagram Scene traceability", () => {
  it("rejects a scene with an unknown Rule ID", () => {
    const issues = validateDiagramScenes({
      scenes: [{ ...scene, ruleIds: ["JP-RULE-SIGNAL-RED-999"] }],
      rules: [rule],
    });

    expect(issues).toContainEqual(
      expect.objectContaining({ code: "missing_rule" }),
    );
  });

  it("rejects duplicate Scene IDs", () => {
    const issues = validateDiagramScenes({ scenes: [scene, scene], rules: [rule] });

    expect(issues).toContainEqual(
      expect.objectContaining({ code: "duplicate_id" }),
    );
  });

  it("rejects a Question pointing to an absent scene", () => {
    const questions = [
      {
        id: "Q002",
        type: "single_choice",
        tags: ["signals"],
        ruleIds: ["JP-RULE-SIGNAL-RED-001"],
        diagramId: "D099",
        difficulty: 1,
        prompt: { "zh-TW": "題目", en: "Question" },
        options: [
          { id: "A", text: { "zh-TW": "是", en: "Yes" } },
          { id: "B", text: { "zh-TW": "否", en: "No" } },
        ],
        answer: "B",
        explanation: { "zh-TW": "說明", en: "Explanation" },
        reviewStatus: "approved",
      },
    ];
    const issues = validateQuestionData({
      questions,
      rules: [rule],
      diagramIds: ["D002"],
    });

    expect(issues).toContainEqual(
      expect.objectContaining({ code: "missing_diagram_scene" }),
    );
  });
});

