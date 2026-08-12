import { describe, expect, it } from "vitest";

import sourceData from "../../src/data/sources/sources.json";
import {
  questionBank,
  ruleCatalog,
} from "../../src/lib/content/catalog";
import { validateQuestionData } from "../../src/lib/content/question-schema";
import { validateContentData } from "../../src/lib/content/schema";
import { classifyEffectiveWindow } from "../../src/lib/effective-date";

const expectedQuestionIds = Array.from(
  { length: 25 },
  (_, index) => `Q${String(index + 1).padStart(3, "0")}`,
);
const expectedDiagramIds = Array.from(
  { length: 24 },
  (_, index) => `D${String(index + 1).padStart(3, "0")}`,
);

describe("seed Question bank", () => {
  it("contains exactly Q001 through Q025 in deterministic order", () => {
    expect(questionBank.map((question) => question.id)).toEqual(
      expectedQuestionIds,
    );
  });

  it("keeps every Question approved, bilingual, and answerable", () => {
    for (const question of questionBank) {
      expect(question.reviewStatus).toBe("approved");
      expect(question.prompt["zh-TW"].length).toBeGreaterThan(0);
      expect(question.prompt.en.length).toBeGreaterThan(0);
      expect(question.explanation["zh-TW"].length).toBeGreaterThan(0);
      expect(question.explanation.en.length).toBeGreaterThan(0);
      expect(question.options.some((option) => option.id === question.answer)).toBe(
        true,
      );
    }
  });

  it("traces every tag to an approved Rule and only references available diagrams", () => {
    expect(
      validateQuestionData({
        questions: questionBank,
        rules: ruleCatalog,
        diagramIds: expectedDiagramIds,
      }),
    ).toEqual([]);
  });
});

describe("seed Rule and Source catalog", () => {
  it("keeps Rule-to-Source traceability valid", () => {
    expect(validateContentData({ sources: sourceData, rules: ruleCatalog })).toEqual(
      [],
    );
  });

  it("models the 2026 local-road speed change as upcoming before its date", () => {
    const speedRule = ruleCatalog.find(
      (rule) => rule.id === "JP-RULE-SPEED-LOCAL-2026-001",
    );
    expect(speedRule).toBeDefined();
    expect(classifyEffectiveWindow(speedRule!, "2026-08-31")).toBe("upcoming");
    expect(classifyEffectiveWindow(speedRule!, "2026-09-01")).toBe("active");
  });
});
