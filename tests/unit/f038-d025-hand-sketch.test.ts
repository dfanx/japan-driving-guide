import { describe, expect, it } from "vitest";

import presetScenes from "../../tools/diagram-generator/scenes/preset-scenes.json";
import { buildDiagramArtifact } from "../../tools/diagram-generator/src/builder";
import { diagramSceneSchema } from "../../tools/diagram-generator/src/schema";

describe("F038 hand-sketched D025 geometry", () => {
  const artifact = buildDiagramArtifact(
    diagramSceneSchema.parse(presetScenes.find((scene) => scene.id === "D025")),
  );
  const svg = artifact.svg;

  it("builds a full through/right-turn road with the guide strip tapering from below", () => {
    expect(svg.match(/data-road-layout="straight-and-right-turn-lanes"/g)?.length).toBe(3);
    expect(svg.match(/data-lane-divider="through-to-right-turn"/g)?.length).toBe(3);
    expect(svg.match(/data-turn-lane="right"/g)?.length).toBe(3);
    expect(svg).toContain("C 206 525 255 415 368 315");
  });

  it("shows one illuminated right indicator on every turning vehicle", () => {
    expect(svg.match(/data-turn-intent="right"/g)?.length).toBe(3);
    expect(svg.match(/data-indicator="right"/g)?.length).toBe(3);
    expect(svg.match(/data-side="vehicle-right"/g)?.length).toBe(3);
    expect(svg.match(/data-state="on"/g)?.length).toBe(3);
    expect(svg).not.toContain('data-indicator="left"');
  });
});
