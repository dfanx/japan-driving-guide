import { describe, expect, it } from "vitest";

import presetScenes from "../../tools/diagram-generator/scenes/preset-scenes.json";
import { buildDiagramArtifact } from "../../tools/diagram-generator/src/builder";
import { diagramSceneSchema } from "../../tools/diagram-generator/src/schema";

describe("F037 concrete three-panel guide-strip diagram", () => {
  const svg = buildDiagramArtifact(
    diagramSceneSchema.parse(presetScenes.find((scene) => scene.id === "D025")),
  ).svg;

  it("uses the supplied three-panel teaching sequence", () => {
    expect(svg).toContain('data-panel="white-guide-strip"');
    expect(svg).toContain('data-panel="entry-prohibited"');
    expect(svg).toContain('data-panel="vehicle-conflict"');
    expect(svg).toContain("白色導流帶｜可穿越");
    expect(svg).toContain("黃框區域｜禁止進入");
    expect(svg).toContain("斜線區也可能有車");
  });

  it("shows the queue, right-turn lane and conflict instead of abstract labels", () => {
    expect(svg.match(/data-primitive="vehicle"/g)?.length).toBeGreaterThanOrEqual(14);
    expect(svg.match(/data-turn-lane="right"/g)?.length).toBe(3);
    expect(svg).toContain('data-movement="through-white-guide-strip"');
    expect(svg).toContain('data-risk="vehicle-in-hatching"');
    expect(svg).toContain('data-guide-strip="crossable-white"');
    expect(svg).toContain('data-entry-prohibited="yellow-bordered"');
  });
});
