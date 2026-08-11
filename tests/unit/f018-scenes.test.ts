import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import manifestData from "../../src/data/diagram-manifest.json";
import mappingData from "../../tools/diagram-generator/review/question-diagram-mappings.json";
import { questionBank, ruleCatalog } from "../../src/lib/content/catalog";
import { buildDiagramArtifact } from "../../tools/diagram-generator/src/builder";
import {
  diagramSceneSchema,
  type DiagramScene,
} from "../../tools/diagram-generator/src/schema";

const root = process.cwd();
const sceneDirectory = join(root, "tools", "diagram-generator", "scenes");
const scenes = readdirSync(sceneDirectory)
  .filter((name) => name.endsWith(".json"))
  .sort()
  .flatMap((name) => {
    const value: unknown = JSON.parse(
      readFileSync(join(sceneDirectory, name), "utf8"),
    );
    return (Array.isArray(value) ? value : [value]).map((scene) =>
      diagramSceneSchema.parse(scene),
    );
  });

const expectedSceneIds = Array.from(
  { length: 24 },
  (_, index) => `D${String(index + 1).padStart(3, "0")}`,
);

const expectedQuestionDiagrams: Readonly<Record<string, string>> = {
  Q001: "D001",
  Q002: "D002",
  Q004: "D003",
  Q005: "D005",
  Q006: "D006",
  Q008: "D009",
  Q010: "D010",
  Q013: "D011",
  Q014: "D012",
  Q017: "D021",
  Q018: "D022",
  Q023: "D024",
};

const officialAssetIds = [
  "NPA-S10-TRAFFIC-LIGHT-GREEN-RIGHT-ARROW",
  "NPA-S10-TRAFFIC-LIGHT-FLASHING-RED",
  "NPA-S10-TRAFFIC-LIGHT-FLASHING-YELLOW",
  "NPA-SIGN-STOP-BILINGUAL",
  "NPA-SIGN-NO-ENTRY",
  "NPA-SIGN-ONE-WAY-STRAIGHT",
  "NPA-SIGN-NO-STOPPING-PARKING",
  "NPA-SIGN-NO-PARKING",
  "NPA-SIGN-MAXIMUM-SPEED-50",
  "NPA-SIGN-PEDESTRIAN-CROSSING",
  "MLIT-SIGN-RAILWAY-CROSSING-A",
] as const;

function sceneById(id: string): DiagramScene {
  const scene = scenes.find((entry) => entry.id === id);
  if (!scene) throw new Error(`Missing test Scene ${id}`);
  return scene;
}

describe("F018 semantic Scene inventory", () => {
  it("contains exactly D001 through D024 with valid Rule references", () => {
    expect(scenes.map((scene) => scene.id).sort()).toEqual(expectedSceneIds);
    const ruleIds = new Set(ruleCatalog.map((rule) => rule.id));
    for (const scene of scenes) {
      expect(scene.ruleIds.length).toBeGreaterThan(0);
      expect(scene.ruleIds.every((id) => ruleIds.has(id))).toBe(true);
      expect(scene.alt["zh-TW"].trim()).not.toBe("");
      expect(scene.alt.en.trim()).not.toBe("");
    }
  });

  it("stages only the explicit curriculum mappings and activates approved D002 only", () => {
    const actual = Object.fromEntries(
      questionBank
        .filter((question) => question.diagramId)
        .map((question) => [question.id, question.diagramId]),
    );
    expect(actual).toEqual({ Q002: "D002" });
    expect(
      Object.fromEntries(
        mappingData.items.map((entry) => [entry.questionId, entry.diagramId]),
      ),
    ).toEqual(expectedQuestionDiagrams);
    expect(
      mappingData.items
        .filter((entry) => entry.reviewStatus === "approved")
        .map((entry) => entry.questionId),
    ).toEqual(["Q002"]);
  });

  it("uses exact registered official assets for regulated signal and sign faces", () => {
    const embeddedAssetIds = scenes.flatMap((scene) =>
      scene.template === "Preset" ? scene.assetIds : [],
    );
    expect(new Set(embeddedAssetIds)).toEqual(new Set(officialAssetIds));

    for (const id of ["D003", "D004", "D013", "D014", "D015", "D016", "D017"]) {
      const artifact = buildDiagramArtifact(sceneById(id));
      expect(artifact.svg).toContain('data-primitive="official-visual"');
      expect(artifact.svg).not.toContain('data-primitive="traffic-sign"');
    }
  });

  it("does not drop critical actors or misrepresent toll labels as official signs", () => {
    for (const id of ["D007", "D009", "D024"]) {
      expect(buildDiagramArtifact(sceneById(id)).svg).toContain(
        'data-primitive="pedestrian"',
      );
    }
    const d008 = buildDiagramArtifact(sceneById("D008")).svg;
    expect(d008).toContain('data-tone="movement"');
    expect(d008).not.toMatch(/data-tone="movement"[^>]*stroke="#d64242"/);

    const d018 = buildDiagramArtifact(sceneById("D018")).svg;
    const d022 = buildDiagramArtifact(sceneById("D022")).svg;
    for (const svg of [d018, d022]) {
      expect(svg).toContain('data-representation="schematic-not-sign"');
      expect(svg).not.toContain('data-primitive="traffic-sign"');
      expect(svg).toContain("ETC ONLY");
      expect(svg).toContain("GENERAL");
    }
    expect(d018).not.toBe(d022);
  });

  it("routes D006 right-turning A into the eastbound left-side lane", () => {
    const d006 = buildDiagramArtifact(sceneById("D006")).svg;
    expect(d006).toContain('data-destination-lane="eastbound-left"');
    expect(d006).toContain(
      'd="M 532 610 L 532 470 C 532 390 600 335 740 335"',
    );
    expect(d006).toContain('x1="740" x2="835" y1="335" y2="335"');
    expect(d006).not.toContain('x1="740" x2="835" y1="465" y2="465"');
  });
});

describe("F018 review and publication boundary", () => {
  it("publishes all owner-directed, reviewed F026 lesson diagrams", () => {
    expect(
      manifestData.items
        .filter((entry) => entry.reviewStatus === "approved")
        .map((entry) => entry.id),
    ).toEqual(expectedSceneIds);
    expect(manifestData.items).toHaveLength(24);
    expect(manifestData.items.filter((entry) => entry.reviewStatus === "needs_review"))
      .toHaveLength(0);
  });

  it("publishes no unapproved candidate", () => {
    for (const entry of manifestData.items) {
      const publicPath = join(root, "public", "diagrams", `${entry.id}.svg`);
      expect(existsSync(publicPath)).toBe(entry.reviewStatus === "approved");
      expect(existsSync(join(root, ...entry.candidatePath.split("/")))).toBe(true);
    }
  });
});
