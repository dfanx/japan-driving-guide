import { readFileSync } from "node:fs";
import { join } from "node:path";

import { parse as parseYaml } from "yaml";
import { describe, expect, it } from "vitest";

import revalidation from "../../src/data/source-revalidation.json";
import { ruleCatalog, sourceCatalog } from "../../src/lib/content/catalog";

const root = process.cwd();

function lesson(id: string, locale: "zh-TW" | "en") {
  const markdown = readFileSync(join(root, "src", "content", "lessons", id, `${locale}.md`), "utf8");
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(markdown);
  if (!match) throw new Error(`${id}/${locale} frontmatter missing`);
  return { frontmatter: parseYaml(match[1]) as { ruleIds: string[] }, body: match[2] };
}

describe("F034 local driving customs without folklore", () => {
  it("classifies and traces the five accepted customs", () => {
    const expected = {
      "JP-RULE-HAZARD-PARKING-CUSTOM-001": "practical_advice",
      "JP-RULE-HAZARD-THANKS-CUSTOM-001": "practical_advice",
      "JP-RULE-MERGE-ZIPPER-001": "official_guidance",
      "JP-RULE-INTERSECTION-HOLD-LANE-001": "practical_advice",
      "JP-RULE-SPEED-PREDICTABLE-001": "practical_advice",
    } as const;
    const sourceIds = new Set(sourceCatalog.map((source) => source.id));

    for (const [id, classification] of Object.entries(expected)) {
      const rule = ruleCatalog.find((candidate) => candidate.id === id);
      expect(rule, id).toBeDefined();
      expect(rule?.legalOrGuidance, id).toBe(classification);
      expect(rule?.sourceIds.length, id).toBeGreaterThan(0);
      expect(rule?.sourceIds.every((sourceId) => sourceIds.has(sourceId)), id).toBe(true);
    }
  });

  it("records current evidence for every new source", () => {
    for (const sourceId of ["S31", "S32", "S33"]) {
      expect(sourceCatalog.find((source) => source.id === sourceId)?.checkedAt).toBe("2026-08-12");
      expect(revalidation.find((entry) => entry.sourceId === sourceId)?.outcome).toBe("verified");
    }
  });

  it("preserves bilingual Rule parity across every affected lesson", () => {
    for (const id of [
      "M04-intersections",
      "M07-speed",
      "M08-rail-crossings",
      "M10-parking",
      "M11-expressways",
      "M15-safety-basics",
    ]) {
      expect(lesson(id, "zh-TW").frontmatter.ruleIds, id).toEqual(lesson(id, "en").frontmatter.ruleIds);
    }
  });

  it("states the safety boundary instead of turning custom into law", () => {
    const parking = lesson("M10-parking", "zh-TW").body;
    expect(parking).toContain("不是人人都會照同一套理解");
    expect(parking).toContain("不能取代煞車燈、方向燈、倒車燈");
    expect(parking).toContain("不會讓違停變合法");

    const basics = lesson("M15-safety-basics", "zh-TW").body;
    expect(basics).toContain("非正式禮貌");
    expect(basics).toContain("不代表讓行、可以走或危險解除");

    const intersections = lesson("M04-intersections", "zh-TW").body;
    expect(intersections).toContain("通過衝突區時維持原車道");
    expect(intersections).toContain("不是「所有路口換道一律違法」");
    expect(intersections).toContain("右折入庫禁止");
    expect(intersections).toContain("不代表可以直接放心切過去");

    const intersectionsEn = lesson("M04-intersections", "en").body;
    expect(intersectionsEn).toContain("No right-turn entry");
    expect(intersectionsEn).toContain("not permission to cut across without checking");

    const speed = lesson("M07-speed", "zh-TW").body;
    expect(speed).toContain("+15 km/h` 還是超速");
    expect(speed).toContain("速限是上限，不是一定要開到的目標");

    const expressways = lesson("M11-expressways", "zh-TW").body;
    expect(expressways).toContain("一台一台交互進入");
    expect(expressways).toContain("不是你有優先權");
  });

  it("makes every vehicle stop and check at a railway crossing without hiding the signal exception", () => {
    const rail = lesson("M08-rail-crossings", "zh-TW").body;
    expect(rail).toContain("每一台車，都要自己停一次、看一次");
    expect(rail).toContain("停止線前完全停住");
    expect(rail).toContain("前車的確認不能算你的");
    expect(rail).toContain("交通號誌管制時，法律上依號誌通行");
    expect(rail).toContain("前車還沒完全離開");
  });
});
