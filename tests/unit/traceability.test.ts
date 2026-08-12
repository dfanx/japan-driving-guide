import { describe, expect, it } from "vitest";

import { ruleCatalog, sourceCatalog } from "../../src/lib/content/catalog";
import {
  rulesByClassification,
  reviewCoverageDate,
  traceabilityDates,
  traceableSources,
} from "../../src/lib/content/traceability";

describe("F021 content traceability", () => {
  it("exposes every approved Rule under exactly one classification", () => {
    expect(rulesByClassification.legal_rule).toHaveLength(30);
    expect(rulesByClassification.official_guidance).toHaveLength(11);
    expect(rulesByClassification.practical_advice).toHaveLength(4);
    expect(
      Object.values(rulesByClassification).flat().map((rule) => rule.id).sort(),
    ).toEqual(ruleCatalog.map((rule) => rule.id).sort());
  });

  it("resolves every Source to the Rules it supports without inventing links", () => {
    expect(traceableSources).toHaveLength(30);
    expect(traceableSources.map((source) => source.id)).toEqual(
      sourceCatalog.map((source) => source.id),
    );
    for (const source of traceableSources) {
      expect(source.ruleIds).toEqual(
        ruleCatalog
          .filter((rule) => rule.sourceIds.includes(source.id))
          .map((rule) => rule.id),
      );
    }
  });

  it("derives visible verification dates from reviewed data", () => {
    expect(traceabilityDates).toEqual({
      sourcesCheckedThrough: "2026-08-10",
      rulesVerifiedThrough: "2026-08-10",
    });
  });

  it("reports the oldest record as whole-catalog coverage", () => {
    expect(reviewCoverageDate(["2026-08-10", "2026-08-08", "2026-08-09"])).toBe("2026-08-08");
  });
});
