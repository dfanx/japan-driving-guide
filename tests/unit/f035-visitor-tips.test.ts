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

describe("F035 visitor tips claim audit", () => {
  it("adds six classified, source-traced rules", () => {
    const expected = {
      "JP-RULE-SIGNAL-RIGHT-CLEAR-001": "legal_rule",
      "JP-RULE-SPEED-PROCEDURE-001": "official_guidance",
      "JP-RULE-OKINAWA-SPEED-001": "official_guidance",
      "JP-RULE-ETC-PAYMENT-001": "official_guidance",
      "JP-RULE-PARKING-PAYMENT-001": "practical_advice",
      "JP-RULE-FUEL-CASH-CHANGE-001": "practical_advice",
    } as const;
    const sourceIds = new Set(sourceCatalog.map((source) => source.id));

    for (const [id, classification] of Object.entries(expected)) {
      const rule = ruleCatalog.find((candidate) => candidate.id === id);
      expect(rule, id).toBeDefined();
      expect(rule?.legalOrGuidance, id).toBe(classification);
      expect(rule?.sourceIds.every((sourceId) => sourceIds.has(sourceId)), id).toBe(true);
      expect(rule?.verifiedAt, id).toBe("2026-08-14");
    }
  });

  it("records current evidence for every new authority or operator source", () => {
    for (const sourceId of ["S34", "S35", "S36", "S37", "S38", "S39"]) {
      expect(sourceCatalog.find((source) => source.id === sourceId)?.checkedAt, sourceId).toBe("2026-08-14");
      expect(revalidation.find((entry) => entry.sourceId === sourceId)?.outcome, sourceId).toBe("verified");
    }
  });

  it("preserves bilingual Rule parity across all affected lessons", () => {
    for (const id of [
      "M02-signals",
      "M03-stop-signs",
      "M04-intersections",
      "M07-speed",
      "M10-parking",
      "M11-expressways",
      "M12-fuel",
    ]) {
      expect(lesson(id, "zh-TW").frontmatter.ruleIds, id).toEqual(lesson(id, "en").frontmatter.ruleIds);
    }
  });

  it("keeps the useful action while rejecting unsafe shortcuts", () => {
    expect(lesson("M02-signals", "zh-TW").body).toContain("不是固定的「2–3 秒通行權」");
    expect(lesson("M02-signals", "zh-TW").body).toContain("不代表你一定在幹道");
    expect(lesson("M03-stop-signs", "zh-TW").body).toContain("法規沒有「一定停滿 3 秒」");
    expect(lesson("M04-intersections", "zh-TW").body).toContain("不能只看「單白、雙白」");
    expect(lesson("M07-speed", "zh-TW").body).toContain("這不等於每案都會當場逮捕");
    expect(lesson("M10-parking", "zh-TW").body).toContain("不要把 AI 回答當保證");
    expect(lesson("M11-expressways", "zh-TW").body).toContain("Smart IC 是另一套規則");
    expect(lesson("M12-fuel", "zh-TW").body).toContain("不一定是 QR Code");
  });

  it("records each adopted, narrowed or rejected claim", () => {
    const audit = readFileSync(join(root, "docs", "F035_VISITOR_TIPS_CLAIM_AUDIT.md"), "utf8");
    for (const marker of [
      "Adopt",
      "Narrow",
      "Reject",
      "three-second",
      "double white is absolute",
      "guaranteed AI accuracy",
    ]) {
      expect(audit).toContain(marker);
    }
  });
});
