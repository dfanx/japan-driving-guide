import { readFileSync } from "node:fs";
import { join } from "node:path";

import { parse as parseYaml } from "yaml";
import { describe, expect, it } from "vitest";

import manifest from "../../src/data/diagram-manifest.json";
import simulations from "../../src/data/driver-simulations.json";
import revalidation from "../../src/data/source-revalidation.json";
import guidance from "../../src/data/visual-guidance.json";
import { ruleCatalog, sourceCatalog } from "../../src/lib/content/catalog";
import presetScenes from "../../tools/diagram-generator/scenes/preset-scenes.json";
import { buildDiagramArtifact } from "../../tools/diagram-generator/src/builder";
import { diagramSceneSchema } from "../../tools/diagram-generator/src/schema";

const root = process.cwd();

function lesson(locale: "zh-TW" | "en") {
  const markdown = readFileSync(join(root, "src", "content", "lessons", "M04-intersections", `${locale}.md`), "utf8");
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(markdown);
  if (!match) throw new Error(`M04/${locale} frontmatter missing`);
  return { frontmatter: parseYaml(match[1]) as { ruleIds: string[] }, body: match[2] };
}

describe("F036 guide-strip semantics and D025 correction", () => {
  it("traces the white-guide and yellow-prohibited distinction to current NPA evidence", () => {
    expect(sourceCatalog.find((source) => source.id === "S40")?.checkedAt).toBe("2026-08-14");
    expect(revalidation.find((entry) => entry.sourceId === "S40")?.outcome).toBe("verified");

    const white = ruleCatalog.find((rule) => rule.id === "JP-RULE-GUIDE-STRIP-001");
    const yellow = ruleCatalog.find((rule) => rule.id === "JP-RULE-ENTRY-PROHIBITED-MARKING-001");
    expect(white?.legalOrGuidance).toBe("official_guidance");
    expect(white?.sourceIds).toEqual(["S29", "S40"]);
    expect(yellow?.legalOrGuidance).toBe("legal_rule");
    expect(yellow?.sourceIds).toEqual(["S29", "S40"]);
  });

  it("keeps bilingual lesson parity and rejects both blanket avoidance and reckless shortcutting", () => {
    const zh = lesson("zh-TW");
    const en = lesson("en");
    expect(zh.frontmatter.ruleIds).toEqual(en.frontmatter.ruleIds);
    expect(zh.body).toContain("單看這個標線，並沒有禁止車輛進入或跨越");
    expect(zh.body).toContain("黃色邊線");
    expect(zh.body).toContain("不要假設斜線區一定沒車");
    expect(en.body).toContain("does not prohibit a vehicle from entering or crossing it");
    expect(en.body).toContain("yellow border");
  });

  it("encodes the corrected distinction and moving-vehicle risk in D025", () => {
    const svg = buildDiagramArtifact(diagramSceneSchema.parse(presetScenes.find((scene) => scene.id === "D025"))).svg;
    expect(svg).toContain('data-guide-strip="crossable-white"');
    expect(svg).toContain('data-entry-prohibited="yellow-bordered"');
    expect(svg).toContain('data-risk="vehicle-in-hatching"');

    const record = manifest.items.find((diagram) => diagram.id === "D025");
    expect(record?.reviewStatus).toBe("approved");
    expect(record?.reviewedAt).toBe("2026-08-14");
    expect(record?.outputHash).toBe("sha256:2f15a11a9de605042c603eb5469d8d7c644fc83cbd18c22b9b08ea8c6b89914d");
  });

  it("binds the regenerated driver view and learner actions to D025", () => {
    const simulation = simulations.find((entry) => entry.diagramId === "D025");
    expect(simulation?.assetSha256).toBe("sha256:e86ee9c5f284746d8f84ef16bc48aa285db04f11da0800ed00dd4eb8cf72577f");
    expect(simulation?.createdAt).toBe("2026-08-14");
    expect(simulation?.kind).toBe("user_supplied_context_photo");
    expect(simulation?.alt["zh-TW"]).toContain("延伸到右轉車道");

    const d025 = guidance.find((entry) => entry.id === "D025");
    expect(d025?.watch["zh-TW"]).toContain("黃色邊框");
    expect(d025?.action["zh-TW"]).toContain("後視鏡與死角");
  });

  it("records the source, image-generation and review boundary", () => {
    const audit = readFileSync(join(root, "docs", "F036_GUIDE_STRIP_CORRECTION.md"), "utf8");
    const prompts = readFileSync(join(root, "docs", "IMAGEGEN_F036_PROMPTS.md"), "utf8");
    for (const marker of ["導流帯", "立入り禁止部分", "S29", "S40", "user-supplied", "e86ee9c5"]) {
      expect(audit + prompts).toContain(marker);
    }
  });
});
