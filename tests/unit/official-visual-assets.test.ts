import { describe, expect, it } from "vitest";

import { NPA_RED_TRAFFIC_LIGHT_ASSET } from "../../tools/diagram-generator/src/official-assets";

describe("official visual asset provenance", () => {
  it("loads the exact NPA red-light image and metadata", () => {
    expect(NPA_RED_TRAFFIC_LIGHT_ASSET).toMatchObject({
      id: "NPA-S10-TRAFFIC-LIGHT-RED-HORIZONTAL",
      sourceId: "S10",
      state: "red",
      sourcePage: 1,
      sourceObject: "/Image25",
      width: 366,
      height: 115,
      assetSha256:
        "sha256:45ba1793f980850b94bc7e9c743e38a12e0a66167a15de4a173535d850a46199",
    });
    expect(NPA_RED_TRAFFIC_LIGHT_ASSET.sourceUrl).toBe(
      "https://www.npa.go.jp/english/bureau/traffic/traffic-light_english.pdf",
    );
    expect(NPA_RED_TRAFFIC_LIGHT_ASSET.termsUrl).toBe(
      "https://www.npa.go.jp/rules/",
    );
    expect(NPA_RED_TRAFFIC_LIGHT_ASSET.dataUri).toMatch(
      /^data:image\/png;base64,/,
    );
  });
});
