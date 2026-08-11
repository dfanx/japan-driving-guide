import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  essentialSigns,
  getOfficialAssetsForSign,
  officialSignAssets,
} from "../../src/lib/content/essential-signs";

describe("Essential Signs official-asset catalog", () => {
  it("keeps a deliberately small tourist set with bilingual parity", () => {
    expect(essentialSigns).toHaveLength(10);
    expect(new Set(essentialSigns.map((sign) => sign.id)).size).toBe(10);
    for (const sign of essentialSigns) {
      expect(sign.title["zh-TW"]).not.toBe("");
      expect(sign.title.en).not.toBe("");
      expect(sign.meaning["zh-TW"]).not.toBe("");
      expect(sign.meaning.en).not.toBe("");
      expect(sign.action["zh-TW"]).not.toBe("");
      expect(sign.action.en).not.toBe("");
    }
  });

  it("matches every locally served official asset to its recorded SHA-256", () => {
    expect(officialSignAssets).toHaveLength(10);
    for (const asset of officialSignAssets) {
      const bytes = readFileSync(join(process.cwd(), "public", asset.assetPath));
      expect(`sha256:${createHash("sha256").update(bytes).digest("hex")}`).toBe(
        asset.assetSha256,
      );
      expect(asset.transformation).toContain("no visual modification");
    }
  });

  it("shows the two official parking signs side by side with unambiguous labels", () => {
    const parking = essentialSigns.find(
      (sign) => sign.id === "SIGN-PARKING-RESTRICTIONS",
    );
    expect(parking?.assetIds).toEqual([
      "NPA-SIGN-NO-STOPPING-PARKING",
      "NPA-SIGN-NO-PARKING",
    ]);
    expect(parking?.assetLabels?.map((label) => label["zh-TW"])).toEqual([
      "紅色 X：駐停車禁止",
      "一條斜線：駐車禁止",
    ]);
  });

  it("fails closed to a rights note instead of copying the restricted ETC image", () => {
    const etc = essentialSigns.find((sign) => sign.id === "SIGN-ETC-ONLY");
    expect(etc).toBeDefined();
    expect(getOfficialAssetsForSign(etc!)).toEqual([]);
    expect(etc?.rightsNote?.en).toContain("prohibit reposting");
    expect(etc?.officialLink).toBe(
      "https://global.w-nexco.co.jp/en/trafficrule/gates.html",
    );
  });
});
