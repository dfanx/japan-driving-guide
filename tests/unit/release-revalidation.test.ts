import { describe, expect, it } from "vitest";

import contentRelease from "../../src/data/content-release.json";
import revalidationData from "../../src/data/source-revalidation.json";
import { ruleCatalog, sourceCatalog } from "../../src/lib/content/catalog";
import { resolveContentAsOfDate } from "../../src/lib/effective-date";

describe("F025 release content revalidation", () => {
  it("freezes effectivity to the reviewed release date instead of the build clock", () => {
    expect(resolveContentAsOfDate({ environment: {} })).toBe(contentRelease.contentAsOfDate);
    expect(contentRelease.contentAsOfDate).toBe("2026-08-14");
  });

  it("records an explicit revalidation outcome for every and only approved Source", () => {
    expect(revalidationData.map((record) => record.sourceId).sort()).toEqual(
      sourceCatalog.map((source) => source.id).sort(),
    );
    expect(revalidationData.every((record) => record.outcome === "verified" || record.outcome === "verified_dynamic")).toBe(true);
    expect(revalidationData.every((record) => record.evidence.length >= 60)).toBe(true);
    const revalidationById = new Map(
      revalidationData.map((record) => [record.sourceId, record]),
    );
    expect(
      sourceCatalog.every(
        (source) => revalidationById.get(source.id)?.checkedAt === source.checkedAt,
      ),
    ).toBe(true);
    expect(
      revalidationData.every(
        (record) => record.checkedAt <= contentRelease.sourcesRevalidatedAt,
      ),
    ).toBe(true);
    expect(revalidationData.map((record) => record.checkedAt).sort().at(-1)).toBe(
      contentRelease.sourcesRevalidatedAt,
    );
  });

  it("retains each Rule's actual review date and caps it at the release date", () => {
    expect(ruleCatalog).toHaveLength(57);
    expect(
      ruleCatalog.every(
        (rule) => rule.verifiedAt <= contentRelease.rulesRevalidatedAt,
      ),
    ).toBe(true);
    expect(ruleCatalog.map((rule) => rule.verifiedAt).sort().at(-1)).toBe(
      contentRelease.rulesRevalidatedAt,
    );
  });

  it("keeps bicycle law, numerical guidance, and missed-exit evidence distinct", () => {
    const passingLaw = ruleCatalog.find((rule) => rule.id === "JP-RULE-CYCLIST-PASSING-LAW-001");
    const passingGuidance = ruleCatalog.find((rule) => rule.id === "JP-RULE-CYCLIST-PASSING-001");
    const missedExit = ruleCatalog.find((rule) => rule.id === "JP-RULE-EXPRESSWAY-MISSED-EXIT-001");
    expect(passingLaw?.legalOrGuidance).toBe("legal_rule");
    expect(passingLaw?.effectiveFrom).toBe("2026-04-01");
    expect(passingGuidance?.legalOrGuidance).toBe("official_guidance");
    expect(missedExit?.sourceIds).toEqual(["S19"]);
  });
});
