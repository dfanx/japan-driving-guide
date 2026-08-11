import { describe, expect, it } from "vitest";

import {
  questionSchema,
  validateQuestionData,
} from "../../src/lib/content/question-schema";
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

const question = {
  id: "Q002",
  type: "single_choice",
  tags: ["signals"],
  ruleIds: ["JP-RULE-SIGNAL-RED-001"],
  diagramId: "D002",
  difficulty: 1,
  prompt: {
    "zh-TW": "紅燈時沒有綠色箭頭，可以左轉嗎？",
    en: "May you turn left at a red light without a green arrow?",
  },
  options: [
    { id: "A", text: { "zh-TW": "可以", en: "Yes" } },
    { id: "B", text: { "zh-TW": "不可以", en: "No" } },
  ],
  answer: "B",
  explanation: {
    "zh-TW": "紅燈不得自行轉彎。",
    en: "Do not turn on red on your own judgment.",
  },
  reviewStatus: "approved",
} as const;

describe("Question schema", () => {
  it("accepts a reviewed bilingual question", () => {
    expect(questionSchema.safeParse(question).success).toBe(true);
  });

  it("rejects an answer that is not an option", () => {
    expect(questionSchema.safeParse({ ...question, answer: "C" }).success).toBe(
      false,
    );
  });

  it("rejects duplicate option IDs", () => {
    const result = questionSchema.safeParse({
      ...question,
      options: [question.options[0], { ...question.options[1], id: "A" }],
    });

    expect(result.success).toBe(false);
  });
});

describe("Question traceability", () => {
  it("accepts a question backed by an approved matching rule", () => {
    expect(
      validateQuestionData({ questions: [question], rules: [rule] }),
    ).toEqual([]);
  });

  it("rejects an unknown Rule ID", () => {
    const issues = validateQuestionData({
      questions: [{ ...question, ruleIds: ["JP-RULE-SIGNAL-RED-999"] }],
      rules: [rule],
    });

    expect(issues).toContainEqual(
      expect.objectContaining({ code: "missing_rule" }),
    );
  });

  it("rejects a tag not backed by the referenced rule category", () => {
    const issues = validateQuestionData({
      questions: [{ ...question, tags: ["speed"] }],
      rules: [rule],
    });

    expect(issues).toContainEqual(
      expect.objectContaining({ code: "tag_rule_mismatch" }),
    );
  });

  it("rejects duplicate Question IDs", () => {
    const issues = validateQuestionData({
      questions: [question, question],
      rules: [rule],
    });

    expect(issues).toContainEqual(
      expect.objectContaining({ code: "duplicate_id" }),
    );
  });

  it("rejects an unapproved production question", () => {
    const issues = validateQuestionData({
      questions: [{ ...question, reviewStatus: "draft" }],
      rules: [rule],
    });

    expect(issues).toContainEqual(
      expect.objectContaining({ code: "unapproved_question" }),
    );
  });
});

