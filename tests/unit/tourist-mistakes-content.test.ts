import { readFileSync } from "node:fs";
import { join } from "node:path";

import { parse as parseYaml } from "yaml";
import { describe, expect, it } from "vitest";

import { essentialSigns } from "../../src/lib/content/essential-signs";
import { ruleCatalog, sourceCatalog } from "../../src/lib/content/catalog";

const root = process.cwd();

function readLesson(lessonId: string, locale: "zh-TW" | "en") {
  const markdown = readFileSync(
    join(root, "src", "content", "lessons", lessonId, `${locale}.md`),
    "utf8",
  );
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(markdown);
  if (!match) throw new Error(`${lessonId}/${locale} frontmatter is missing`);
  return {
    frontmatter: parseYaml(match[1]) as { ruleIds: string[] },
    body: match[2],
  };
}

describe("F027 tourist mistake coverage", () => {
  const expectedRules = {
    "JP-RULE-PARKING-SIGN-DISTINCTION-001": ["S10", "S16", "S24", "S29"],
    "JP-RULE-PARKING-CLEAR-ZONES-001": ["S16", "S20"],
    "JP-RULE-DISTRACTED-DRIVING-001": ["S16", "S21"],
    "JP-RULE-SEATBELT-ALL-001": ["S16", "S22"],
    "JP-RULE-CHILD-SEAT-001": ["S16", "S23"],
    "JP-RULE-ALCOHOL-ASSIST-001": ["S03", "S16"],
  } as const;

  it("adds only source-traced legal rules to the approved catalogs", () => {
    expect(sourceCatalog).toHaveLength(39);
    expect(ruleCatalog).toHaveLength(56);

    for (const [id, sourceIds] of Object.entries(expectedRules)) {
      const rule = ruleCatalog.find((candidate) => candidate.id === id);
      expect(rule, id).toBeDefined();
      expect(rule?.legalOrGuidance, id).toBe("legal_rule");
      expect(rule?.sourceIds, id).toEqual(sourceIds);
      expect(rule?.verifiedAt, id).toMatch(/^2026-08-1[12]$/);
    }
  });

  it("keeps parking and safety-basics rule IDs aligned across both languages", () => {
    for (const lessonId of ["M10-parking", "M15-safety-basics"]) {
      const chinese = readLesson(lessonId, "zh-TW");
      const english = readLesson(lessonId, "en");
      expect(chinese.frontmatter.ruleIds, lessonId).toEqual(
        english.frontmatter.ruleIds,
      );
    }
  });

  it("explains the parking distinction without turning common myths into law", () => {
    const parking = readLesson("M10-parking", "zh-TW").body;
    expect(parking).toContain("一條紅色斜線＝駐車禁止");
    expect(parking).toContain("紅色 X＝駐停車禁止");
    expect(parking).toContain("5 公尺");
    expect(parking).toContain("10 公尺");
    expect(parking).toContain("雙黃燈有沒有開，都不會把違停變合法");
    expect(parking).toContain("警視廳官方圖解");
    expect(parking).not.toContain("開雙黃燈就可以");
  });

  it("places both reviewed official parking sign assets in the parking lesson", () => {
    const parkingSign = essentialSigns.find(
      (sign) => sign.id === "SIGN-PARKING-RESTRICTIONS",
    );
    expect(parkingSign?.assetIds).toEqual([
      "NPA-SIGN-NO-STOPPING-PARKING",
      "NPA-SIGN-NO-PARKING",
    ]);
    expect(parkingSign?.assetLabels?.map((label) => label["zh-TW"])).toEqual([
      "紅色 X：駐停車禁止",
      "一條斜線：駐車禁止",
    ]);
  });

  it("records the supplied travel articles as discovery inputs, not legal evidence", () => {
    const memo = readFileSync(
      join(root, "docs", "F027_TOURIST_MISTAKE_RESEARCH.md"),
      "utf8",
    );
    expect(memo).toContain("rental-car-tips.jp/tw/rules");
    expect(memo).toContain("japantravel.navitime.com");
    expect(memo).toContain("livejapan.com");
    expect(memo).toContain("japan-crc.com");
    expect(memo).toContain("budget.com.tw");
    expect(memo).toContain("soracampers.com");
    expect(memo).toContain("discovery");
  });
});
