import { describe, expect, it } from "vitest";

import {
  validateLessonDocuments,
  type LessonDocument,
} from "../../src/lib/content/lesson-schema";
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

function lesson(locale: "zh-TW" | "en"): LessonDocument {
  return {
    filePath: `M02-signals/${locale}.md`,
    frontmatter: {
      id: "M02-signals",
      locale,
      title: locale === "zh-TW" ? "紅黃綠燈與箭頭" : "Traffic Lights and Arrows",
      ruleIds: ["JP-RULE-SIGNAL-RED-001"],
      diagramIds: ["D002", "D003", "D004"],
      quizTags: ["signals"],
      order: 2,
      reviewStatus: "approved",
    },
    body: "## Scenario\n\nReviewed lesson body.",
  };
}

describe("bilingual lesson validation", () => {
  it("accepts a complete, parity-matched locale pair", () => {
    expect(
      validateLessonDocuments({
        documents: [lesson("zh-TW"), lesson("en")],
        rules: [rule],
      }),
    ).toEqual([]);
  });

  it("rejects a missing locale", () => {
    const issues = validateLessonDocuments({
      documents: [lesson("zh-TW")],
      rules: [rule],
    });

    expect(issues).toContainEqual(
      expect.objectContaining({ code: "missing_locale" }),
    );
  });

  it("rejects locale metadata drift", () => {
    const english = lesson("en");
    english.frontmatter.diagramIds = ["D002"];
    const issues = validateLessonDocuments({
      documents: [lesson("zh-TW"), english],
      rules: [rule],
    });

    expect(issues).toContainEqual(
      expect.objectContaining({ code: "locale_parity_mismatch" }),
    );
  });

  it("rejects an unknown Rule ID", () => {
    const chinese = lesson("zh-TW");
    const english = lesson("en");
    chinese.frontmatter.ruleIds = ["JP-RULE-SIGNAL-RED-999"];
    english.frontmatter.ruleIds = ["JP-RULE-SIGNAL-RED-999"];
    const issues = validateLessonDocuments({
      documents: [chinese, english],
      rules: [rule],
    });

    expect(issues).toContainEqual(
      expect.objectContaining({ code: "missing_rule" }),
    );
  });

  it("rejects duplicate locale documents", () => {
    const issues = validateLessonDocuments({
      documents: [lesson("zh-TW"), lesson("zh-TW"), lesson("en")],
      rules: [rule],
    });

    expect(issues).toContainEqual(
      expect.objectContaining({ code: "duplicate_locale" }),
    );
  });

  it("rejects a path that does not match module and locale", () => {
    const chinese = lesson("zh-TW");
    chinese.filePath = "wrong/zh-TW.md";
    const issues = validateLessonDocuments({
      documents: [chinese, lesson("en")],
      rules: [rule],
    });

    expect(issues).toContainEqual(
      expect.objectContaining({ code: "schema_custom" }),
    );
  });
});

