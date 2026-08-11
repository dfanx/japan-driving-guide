import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { parse as parseYaml } from "yaml";
import { describe, expect, it } from "vitest";

import illustrationData from "../../src/data/lesson-illustrations.json";
import { lessonNavigation } from "../../src/lib/content/lesson-navigation";
import {
  getLessonVisualSet,
  lessonIllustrationSchema,
  lessonVisualDefinitions,
} from "../../src/lib/content/lesson-visuals";

const root = process.cwd();
const expectedDiagramIds = Array.from(
  { length: 24 },
  (_, index) => `D${String(index + 1).padStart(3, "0")}`,
);

describe("F026 lesson visual coverage", () => {
  it("gives all 16 modules at least one approved visual aid", () => {
    expect(lessonVisualDefinitions).toHaveLength(lessonNavigation.length);
    expect(lessonVisualDefinitions.map((item) => item.lessonId)).toEqual(
      lessonNavigation.map((item) => item.id),
    );

    for (const lesson of lessonNavigation) {
      const visualSet = getLessonVisualSet(lesson.id);
      expect(
        visualSet.diagrams.length +
          visualSet.illustrations.length +
          visualSet.officialSigns.length,
        lesson.id,
      ).toBeGreaterThan(0);
    }
  });

  it("places every D001-D024 diagram in exactly one lesson visual set", () => {
    const actual = lessonVisualDefinitions.flatMap((item) => item.diagramIds).sort();
    expect(actual).toEqual(expectedDiagramIds);
    expect(new Set(actual).size).toBe(actual.length);
  });

  it("keeps bilingual lesson frontmatter aligned with the visual mapping", () => {
    for (const lesson of lessonNavigation) {
      const expected = getLessonVisualSet(lesson.id).diagramIds;
      for (const locale of ["zh-TW", "en"] as const) {
        const markdown = readFileSync(
          join(root, "src", "content", "lessons", lesson.id, `${locale}.md`),
          "utf8",
        );
        const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(markdown)?.[1];
        if (!frontmatter) throw new Error(`${lesson.id}/${locale} frontmatter is missing`);
        const parsed = parseYaml(frontmatter) as { diagramIds: string[] };
        expect(parsed.diagramIds, `${lesson.id}/${locale}`).toEqual(expected);
      }
    }
  });

  it("locks generated context illustrations to reviewed local bytes", () => {
    const illustrations = lessonIllustrationSchema.array().parse(illustrationData);
    expect(illustrations).toHaveLength(3);

    for (const illustration of illustrations) {
      const path = join(root, "public", ...illustration.assetPath.slice(1).split("/"));
      expect(existsSync(path), illustration.id).toBe(true);
      const actualHash = `sha256:${createHash("sha256")
        .update(readFileSync(path))
        .digest("hex")}`;
      expect(actualHash, illustration.id).toBe(illustration.assetSha256);
      expect(illustration.containsOfficialVisual).toBe(false);
      expect(illustration.alt["zh-TW"]).not.toBe(illustration.alt.en);
    }
  });

  it("exposes exact official sign assets or an explicit rights-gated link", () => {
    const sets = lessonNavigation.map((lesson) => getLessonVisualSet(lesson.id));
    const signIds = new Set(sets.flatMap((set) => set.officialSigns.map((sign) => sign.id)));
    expect(signIds).toEqual(
      new Set([
        "SIGN-STOP",
        "SIGN-SLOW",
        "SIGN-NO-ENTRY",
        "SIGN-ONE-WAY",
        "SIGN-PARKING-RESTRICTIONS",
        "SIGN-MAXIMUM-SPEED",
        "SIGN-NO-U-TURN",
        "SIGN-PEDESTRIAN-CROSSING",
        "SIGN-RAILWAY-CROSSING",
        "SIGN-ETC-ONLY",
      ]),
    );
    const etc = sets.flatMap((set) => set.officialSigns).find((sign) => sign.id === "SIGN-ETC-ONLY");
    expect(etc?.assetIds).toEqual([]);
    expect(etc?.rightsNote?.["zh-TW"]).toContain("不允許轉載");
  });
});
