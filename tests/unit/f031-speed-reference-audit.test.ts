import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { questionBank, ruleCatalog, sourceCatalog } from "../../src/lib/content/catalog";
import { buildDiagramArtifact } from "../../tools/diagram-generator/src/builder";
import { diagramSceneSchema } from "../../tools/diagram-generator/src/schema";

const root = process.cwd();

function read(path: string) {
  return readFileSync(join(root, ...path.split("/")), "utf8");
}

const d011 = readdirSync(join(root, "tools", "diagram-generator", "scenes"))
  .filter((name) => name.endsWith(".json"))
  .flatMap((name) => {
    const raw: unknown = JSON.parse(readFileSync(join(root, "tools", "diagram-generator", "scenes", name), "utf8"));
    return (Array.isArray(raw) ? raw : [raw]).map((scene) => diagramSceneSchema.parse(scene));
  })
  .find((scene) => scene.id === "D011");

describe("F031 speed myths and reference-image audit", () => {
  it("traces the accepted speed and lane guidance only to reviewed official sources", () => {
    expect(sourceCatalog.slice(-4).map((source) => source.id)).toEqual(["S26", "S27", "S28", "S29"]);
    expect(ruleCatalog.find((rule) => rule.id === "JP-RULE-SPEED-ENFORCEMENT-001")?.sourceIds)
      .toEqual(["S16", "S26", "S27"]);
    expect(ruleCatalog.find((rule) => rule.id === "JP-RULE-LANE-CHANGE-YELLOW-001")?.legalOrGuidance)
      .toBe("legal_rule");
    expect(ruleCatalog.find((rule) => rule.id === "JP-RULE-GUIDE-STRIP-001")?.legalOrGuidance)
      .toBe("official_guidance");
  });

  it("teaches the myth as a rejection rather than an evasion threshold", () => {
    const speed = read("src/content/lessons/M07-speed/zh-TW.md");
    expect(speed).toContain("日本不是「不抓超速」");
    expect(speed).toContain("固定、半固定與可搬式");
    expect(speed).toContain("不會變成你的合法超速額度");
    expect(speed).toContain("警察只抓第一台」都不是交通規則");
    expect(speed).not.toMatch(/\+30|\+40|神盾|Miofive|Laser Touch Brain/);

    const question = questionBank.find((entry) => entry.id === "Q025");
    expect(question?.answer).toBe("B");
    expect(question?.ruleIds).toEqual(["JP-RULE-SPEED-POSTED-001", "JP-RULE-SPEED-ENFORCEMENT-001"]);
    expect(question?.diagramId).toBe("D011");
  });

  it("redraws D011 as an original teaching comparison, not a regulatory sign", () => {
    expect(d011).toBeDefined();
    const svg = buildDiagramArtifact(d011!).svg;
    expect(svg).toContain('data-road-type="no-centre-line"');
    expect(svg).toContain('data-road-type="centre-line"');
    expect(svg).toContain('data-representation="teaching-label-not-road-sign"');
    expect(svg).toContain("無另標：30 km/h");
    expect(svg).not.toContain('data-primitive="traffic-sign"');
  });

  it("records an explicit adopt, merge or reject decision for all 13 supplied photographs", () => {
    const audit = read("docs/F031_REFERENCE_IMAGE_AUDIT.md");
    for (const stem of [
      "3076179", "3076180", "3076181", "3076182", "3076184", "3076186", "3076185",
      "3076183", "3076187", "3076188", "3076189", "3076190", "3076191",
    ]) {
      expect(audit, stem).toContain(`${stem}_0.jpg`);
    }
    expect(audit).toContain("Reject as a universal learner control");
    expect(audit).toContain("must not copy the book's layout");
  });
});
