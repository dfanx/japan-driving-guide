import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const candidate = readFileSync(
  new URL("../../tools/diagram-generator/review/D020.svg", import.meta.url),
  "utf8",
);
const publicDiagram = readFileSync(
  new URL("../../public/diagrams/D020.svg", import.meta.url),
  "utf8",
);
const manifest = JSON.parse(
  readFileSync(new URL("../../src/data/diagram-manifest.json", import.meta.url), "utf8"),
) as {
  items: Array<{
    id: string;
    outputHash: string;
    reviewedAt: string | null;
    reviewStatus: string;
  }>;
};

describe("F033 D020 expressway merge geometry", () => {
  it("uses a tangent-continuous ramp and a narrowing merge separator", () => {
    expect(candidate).toContain('data-join="tangent-horizontal"');
    expect(candidate).toContain('data-primitive="merge-separator"');
    expect(candidate).toContain('data-taper-end="1030,490"');
    expect(candidate).toContain(
      'd="M 0 800 L 0 650 C 260 650 430 590 600 490 L 1050 490 C 920 490 760 650 610 700 C 420 770 230 800 0 800 Z"',
    );
    expect(candidate).not.toContain("L 560 490 C 410 620");
  });

  it("keeps the ramp movement arrow inside the acceleration lane", () => {
    expect(candidate).toContain('x1="400" x2="500" y1="650" y2="610"');
    expect(candidate).not.toContain('x1="430" x2="520" y1="590" y2="540"');
  });

  it("publishes only the reviewed bytes and approval hash", () => {
    const d020 = manifest.items.find((item) => item.id === "D020");

    expect(publicDiagram).toBe(candidate);
    expect(d020).toMatchObject({
      outputHash: "sha256:e69d99d01710d31a48f368d7f55e42a2c2966480ca8543835aeaaf26963f8082",
      reviewedAt: "2026-08-12",
      reviewStatus: "approved",
    });
  });
});
