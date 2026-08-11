import { describe, expect, it } from "vitest";

import {
  ruleSchema,
  sourceSchema,
  validateContentData,
} from "../../src/lib/content/schema";

const source = {
  id: "S03",
  title: "Follow the Rules for Safe Driving in Japan",
  authority: "National Police Agency",
  url: "https://www.npa.go.jp/example.pdf",
  tier: "S",
  checkedAt: "2026-08-09",
  notes: "Official tourist-driving rules.",
} as const;

const rule = {
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
} as const;

describe("Source schema", () => {
  it("accepts a reviewed official source", () => {
    expect(sourceSchema.safeParse(source).success).toBe(true);
  });

  it("rejects unknown fields and non-HTTPS URLs", () => {
    const result = sourceSchema.safeParse({
      ...source,
      url: "http://example.com/source",
      ungoverned: true,
    });

    expect(result.success).toBe(false);
  });
});

describe("Rule schema", () => {
  it("accepts bilingual, source-linked rule metadata", () => {
    expect(ruleSchema.safeParse(rule).success).toBe(true);
  });

  it("rejects invalid classification vocabulary", () => {
    const result = ruleSchema.safeParse({
      ...rule,
      legalOrGuidance: "safety_recommendation",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid effective-date interval", () => {
    const result = ruleSchema.safeParse({
      ...rule,
      effectiveFrom: "2026-09-01",
      effectiveTo: "2026-08-31",
    });

    expect(result.success).toBe(false);
  });
});

describe("Content cross-validation", () => {
  it("accepts valid Source-to-Rule traceability", () => {
    expect(validateContentData({ sources: [source], rules: [rule] })).toEqual([]);
  });

  it("rejects duplicate IDs", () => {
    const issues = validateContentData({
      sources: [source, source],
      rules: [rule],
    });

    expect(issues).toContainEqual(
      expect.objectContaining({ code: "duplicate_id" }),
    );
  });

  it("rejects a rule with a missing source", () => {
    const issues = validateContentData({
      sources: [source],
      rules: [{ ...rule, sourceIds: ["S99"] }],
    });

    expect(issues).toContainEqual(
      expect.objectContaining({ code: "missing_source" }),
    );
  });

  it("requires a Tier S source for legal rules", () => {
    const tierASource = { ...source, id: "S04", tier: "A" } as const;
    const issues = validateContentData({
      sources: [tierASource],
      rules: [{ ...rule, sourceIds: ["S04"] }],
    });

    expect(issues).toContainEqual(
      expect.objectContaining({ code: "legal_rule_without_tier_s" }),
    );
  });
});

