import { readFileSync } from "node:fs";
import { join } from "node:path";

import { parse as parseYaml } from "yaml";
import { describe, expect, it } from "vitest";

import { ruleCatalog, sourceCatalog } from "../../src/lib/content/catalog";
import { getLessonVisualSet } from "../../src/lib/content/lesson-visuals";

const root = process.cwd();

function lesson(id: string, locale: "zh-TW" | "en") {
  const markdown = readFileSync(join(root, "src", "content", "lessons", id, `${locale}.md`), "utf8");
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(markdown);
  if (!match) throw new Error(`${id}/${locale} frontmatter missing`);
  return { frontmatter: parseYaml(match[1]) as { ruleIds: string[]; diagramIds: string[] }, body: match[2] };
}

describe("F032 overlooked tourist-driving scenarios", () => {
  it("keeps every new Rule source-traced and correctly classified", () => {
    const expected = {
      "JP-RULE-INTERSECTION-LEFT-POSITION-001": "legal_rule",
      "JP-RULE-PARKING-ROAD-MARKING-001": "legal_rule",
      "JP-RULE-SIGNAL-ACTUATED-001": "official_guidance",
      "JP-RULE-SIGNAL-STREETCAR-001": "legal_rule",
      "JP-RULE-FACILITY-ENTRY-001": "legal_rule",
      "JP-RULE-FACILITY-APPROACH-001": "practical_advice",
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

  it("preserves bilingual rule and diagram parity in the affected lessons", () => {
    for (const id of ["M02-signals", "M04-intersections", "M10-parking"]) {
      const chinese = lesson(id, "zh-TW").frontmatter;
      const english = lesson(id, "en").frontmatter;
      expect(chinese.ruleIds, id).toEqual(english.ruleIds);
      expect(chinese.diagramIds, id).toEqual(english.diagramIds);
      expect(chinese.diagramIds, id).toEqual(getLessonVisualSet(id).diagramIds);
    }
  });

  it("states the critical driver actions without granting a free-form U-turn", () => {
    const intersections = lesson("M04-intersections", "zh-TW").body;
    expect(intersections).toContain("靠近道路左端");
    expect(intersections).toContain("人行道前必須停車");
    expect(intersections).toContain("不是叫你在路口任意迴轉");
    expect(lesson("M02-signals", "zh-TW").body).toContain("黃色箭頭");
    expect(lesson("M10-parking", "zh-TW").body).toContain("黃色破線");
  });
});
