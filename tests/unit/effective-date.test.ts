import { describe, expect, it } from "vitest";

import {
  classifyEffectiveWindow,
  resolveContentAsOfDate,
  summarizeRuleEffectivity,
} from "../../src/lib/effective-date";

describe("effective-date classification", () => {
  const newLocalRoadRule = {
    effectiveFrom: "2026-09-01",
    effectiveTo: null,
  };
  const previousLocalRoadRule = {
    effectiveFrom: null,
    effectiveTo: "2026-08-31",
  };

  it("keeps the new local-road rule upcoming on 2026-08-31", () => {
    expect(classifyEffectiveWindow(newLocalRoadRule, "2026-08-31")).toBe(
      "upcoming",
    );
  });

  it("activates the new local-road rule on 2026-09-01", () => {
    expect(classifyEffectiveWindow(newLocalRoadRule, "2026-09-01")).toBe(
      "active",
    );
  });

  it("keeps the previous rule active through its inclusive end date", () => {
    expect(classifyEffectiveWindow(previousLocalRoadRule, "2026-08-31")).toBe(
      "active",
    );
  });

  it("expires the previous rule the next day", () => {
    expect(classifyEffectiveWindow(previousLocalRoadRule, "2026-09-01")).toBe(
      "expired",
    );
  });

  it("keeps an unbounded rule active", () => {
    expect(
      classifyEffectiveWindow(
        { effectiveFrom: null, effectiveTo: null },
        "2026-08-10",
      ),
    ).toBe("active");
  });
});

describe("content effective-date source", () => {
  it("uses an explicit CONTENT_AS_OF_DATE when provided", () => {
    expect(
      resolveContentAsOfDate({
        environment: { CONTENT_AS_OF_DATE: "2026-09-01" },
      }),
    ).toBe("2026-09-01");
  });

  it("uses the reviewed release date when no audited override exists", () => {
    expect(
      resolveContentAsOfDate({
        environment: {},
      }),
    ).toBe("2026-08-14");
  });

  it("rejects an invalid explicit date", () => {
    expect(() =>
      resolveContentAsOfDate({
        environment: { CONTENT_AS_OF_DATE: "2026-02-30" },
      }),
    ).toThrow("CONTENT_AS_OF_DATE");
  });
});

describe("effective-date summary", () => {
  it("counts each status deterministically", () => {
    const summary = summarizeRuleEffectivity(
      [
        { effectiveFrom: null, effectiveTo: null },
        { effectiveFrom: "2026-09-01", effectiveTo: null },
        { effectiveFrom: null, effectiveTo: "2026-08-01" },
      ],
      "2026-08-10",
    );

    expect(summary).toEqual({ active: 1, upcoming: 1, expired: 1 });
  });
});
