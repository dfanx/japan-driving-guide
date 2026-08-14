import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import sharp from "sharp";
import { describe, expect, it } from "vitest";

import simulationData from "../../src/data/driver-simulations.json";
import { lessonNavigation } from "../../src/lib/content/lesson-navigation";
import {
  driverSimulationSchema,
  driverSimulations,
  getDriverSimulationByDiagramId,
  getLessonVisualSet,
} from "../../src/lib/content/lesson-visuals";

const root = process.cwd();
const expectedDiagramIds = Array.from(
  { length: 28 },
  (_, index) => `D${String(index + 1).padStart(3, "0")}`,
);

describe("F028 driver-seat simulations", () => {
  it("pairs D001-D028 exactly once with approved context-only images", () => {
    const simulations = driverSimulationSchema.array().parse(simulationData);
    expect(simulations).toHaveLength(28);
    expect(simulations.map((item) => item.diagramId).sort()).toEqual(expectedDiagramIds);
    expect(new Set(simulations.map((item) => item.diagramId)).size).toBe(28);

    for (const simulation of simulations) {
      expect(simulation.id).toBe(`SIM-${simulation.diagramId}`);
      expect(simulation.containsOfficialVisual).toBe(false);
      expect(["generated_driver_simulation", "user_supplied_context_photo"]).toContain(simulation.kind);
      expect(simulation.alt["zh-TW"]).not.toBe(simulation.alt.en);
    }
    expect(simulations.find((item) => item.diagramId === "D025")?.kind).toBe("user_supplied_context_photo");
  });

  it("locks every generated WebP to its reviewed hash and dimensions", async () => {
    for (const simulation of driverSimulations) {
      const assetPath = join(root, "public", ...simulation.assetPath.slice(1).split("/"));
      expect(existsSync(assetPath), simulation.id).toBe(true);
      const bytes = readFileSync(assetPath);
      expect(`sha256:${createHash("sha256").update(bytes).digest("hex")}`, simulation.id).toBe(
        simulation.assetSha256,
      );
      const metadata = await sharp(bytes).metadata();
      expect(metadata.width, simulation.id).toBe(1200);
      expect(metadata.height, simulation.id).toBe(800);
      expect(metadata.format, simulation.id).toBe("webp");
    }
  });

  it("keeps each lesson diagram paired with its matching simulation", () => {
    const allPairs = lessonNavigation.flatMap((lesson) => getLessonVisualSet(lesson.id).diagramPairs);
    expect(allPairs).toHaveLength(28);
    for (const { diagram, simulation } of allPairs) {
      expect(simulation).toBe(getDriverSimulationByDiagramId(diagram.id));
      expect(simulation.diagramId).toBe(diagram.id);
    }
  });
});
