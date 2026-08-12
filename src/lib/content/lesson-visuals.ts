import { z } from "astro/zod";

import diagramManifestData from "../../data/diagram-manifest.json";
import driverSimulationData from "../../data/driver-simulations.json";
import illustrationData from "../../data/lesson-illustrations.json";
import visualGuidanceData from "../../data/visual-guidance.json";
import d002Data from "../../../tools/diagram-generator/scenes/D002.json";
import presetSceneData from "../../../tools/diagram-generator/scenes/preset-scenes.json";
import { diagramManifestSchema } from "../../../tools/diagram-generator/src/manifest";
import { diagramSceneSchema } from "../../../tools/diagram-generator/src/schema";
import { essentialSigns } from "./essential-signs";

const localizedTextSchema = z.object({
  "zh-TW": z.string().trim().min(1),
  en: z.string().trim().min(1),
});

export const lessonIllustrationSchema = z
  .object({
    id: z.string().regex(/^ILL-M\d{2}-[A-Z0-9-]+$/),
    lessonId: z.string().regex(/^M\d{2}-[a-z0-9-]+$/),
    assetPath: z.string().regex(/^\/assets\/lesson-illustrations\/[a-z0-9-]+\.webp$/),
    width: z.literal(1200),
    height: z.literal(800),
    assetSha256: z.string().regex(/^sha256:[a-f0-9]{64}$/),
    createdAt: z.iso.date(),
    generator: z.literal("OpenAI built-in image generation"),
    kind: z.literal("generated_context_illustration"),
    reviewStatus: z.literal("approved"),
    containsOfficialVisual: z.literal(false),
    alt: localizedTextSchema,
  })
  .strict();

export type LessonIllustration = z.infer<typeof lessonIllustrationSchema>;

export const driverSimulationSchema = z
  .object({
    id: z.string().regex(/^SIM-D\d{3}$/),
    diagramId: z.string().regex(/^D\d{3}$/),
    assetPath: z.string().regex(/^\/assets\/driver-simulations\/d\d{3}-driver-view\.webp$/),
    width: z.literal(1200),
    height: z.literal(800),
    assetSha256: z.string().regex(/^sha256:[a-f0-9]{64}$/),
    createdAt: z.iso.date(),
    generator: z.literal("OpenAI built-in image generation"),
    kind: z.literal("generated_driver_simulation"),
    reviewStatus: z.literal("approved"),
    containsOfficialVisual: z.literal(false),
    alt: localizedTextSchema,
  })
  .strict();

export type DriverSimulation = z.infer<typeof driverSimulationSchema>;

export const visualGuidanceSchema = z
  .object({
    id: z.string().regex(/^(D\d{3}|ILL-M\d{2}-[A-Z0-9-]+)$/),
    situation: localizedTextSchema,
    watch: localizedTextSchema,
    action: localizedTextSchema,
  })
  .strict();

export type VisualGuidance = z.infer<typeof visualGuidanceSchema>;

const lessonVisualDefinitionSchema = z
  .object({
    lessonId: z.string().regex(/^M\d{2}-[a-z0-9-]+$/),
    diagramIds: z.array(z.string().regex(/^D\d{3}$/)),
    illustrationIds: z.array(z.string().regex(/^ILL-M\d{2}-[A-Z0-9-]+$/)),
    officialSignIds: z.array(z.string().regex(/^SIGN-[A-Z0-9-]+$/)),
  })
  .strict();

const definitions = lessonVisualDefinitionSchema.array().length(16).parse([
  { lessonId: "M00-eligibility", diagramIds: [], illustrationIds: ["ILL-M00-DOCUMENT-CHECK"], officialSignIds: [] },
  { lessonId: "M01-left-side-driving", diagramIds: ["D001"], illustrationIds: [], officialSignIds: ["SIGN-NO-ENTRY", "SIGN-ONE-WAY"] },
  { lessonId: "M02-signals", diagramIds: ["D002", "D003", "D004", "D026", "D027"], illustrationIds: [], officialSignIds: [] },
  { lessonId: "M03-stop-signs", diagramIds: ["D005"], illustrationIds: [], officialSignIds: ["SIGN-STOP"] },
  { lessonId: "M04-intersections", diagramIds: ["D006", "D007", "D008", "D025", "D028"], illustrationIds: [], officialSignIds: ["SIGN-SLOW"] },
  { lessonId: "M05-pedestrians", diagramIds: ["D009"], illustrationIds: [], officialSignIds: ["SIGN-PEDESTRIAN-CROSSING"] },
  { lessonId: "M06-cyclists", diagramIds: ["D010"], illustrationIds: [], officialSignIds: [] },
  { lessonId: "M07-speed", diagramIds: ["D011"], illustrationIds: [], officialSignIds: ["SIGN-MAXIMUM-SPEED"] },
  { lessonId: "M08-rail-crossings", diagramIds: ["D012"], illustrationIds: [], officialSignIds: ["SIGN-RAILWAY-CROSSING"] },
  { lessonId: "M09-signs", diagramIds: ["D013", "D014", "D015", "D016", "D017"], illustrationIds: [], officialSignIds: [] },
  { lessonId: "M10-parking", diagramIds: ["D019"], illustrationIds: [], officialSignIds: ["SIGN-PARKING-RESTRICTIONS"] },
  { lessonId: "M11-expressways", diagramIds: ["D018", "D020", "D021", "D022"], illustrationIds: [], officialSignIds: ["SIGN-ETC-ONLY", "SIGN-NO-U-TURN"] },
  { lessonId: "M12-fuel", diagramIds: ["D023"], illustrationIds: [], officialSignIds: [] },
  { lessonId: "M13-weather", diagramIds: [], illustrationIds: ["ILL-M13-WEATHER"], officialSignIds: [] },
  { lessonId: "M14-emergency", diagramIds: ["D024"], illustrationIds: [], officialSignIds: [] },
  { lessonId: "M15-safety-basics", diagramIds: [], illustrationIds: ["ILL-M15-NO-DRIVE"], officialSignIds: [] },
]);

const scenes = diagramSceneSchema.array().parse([d002Data, ...presetSceneData]);
const manifest = diagramManifestSchema.parse(diagramManifestData);
const illustrations = lessonIllustrationSchema.array().parse(illustrationData);
export const driverSimulations = driverSimulationSchema.array().length(28).parse(driverSimulationData);
export const visualGuidance = visualGuidanceSchema.array().parse(visualGuidanceData);
const sceneById = new Map(scenes.map((scene) => [scene.id, scene]));
const manifestById = new Map(manifest.items.map((entry) => [entry.id, entry]));
const illustrationById = new Map(illustrations.map((item) => [item.id, item]));
const driverSimulationByDiagramId = new Map(
  driverSimulations.map((item) => [item.diagramId, item]),
);
const signById = new Map(essentialSigns.map((sign) => [sign.id, sign]));
const guidanceById = new Map(visualGuidance.map((item) => [item.id, item]));

if (new Set(definitions.map((item) => item.lessonId)).size !== definitions.length) {
  throw new Error("Lesson visual definitions require unique Lesson IDs");
}

if (driverSimulationByDiagramId.size !== driverSimulations.length) {
  throw new Error("Driver simulations require unique Diagram IDs");
}

const requiredDiagramIds = Array.from({ length: 28 }, (_, index) =>
  `D${String(index + 1).padStart(3, "0")}`,
);
if (requiredDiagramIds.some((diagramId) => !driverSimulationByDiagramId.has(diagramId))) {
  throw new Error("Driver simulations must cover D001-D028 exactly once");
}

const requiredGuidanceIds = [
  ...requiredDiagramIds,
  ...illustrations.map((item) => item.id),
].sort();
if (
  guidanceById.size !== visualGuidance.length ||
  visualGuidance.map((item) => item.id).sort().join("|") !== requiredGuidanceIds.join("|")
) {
  throw new Error("Visual guidance must cover D001-D028 and every lesson illustration exactly once");
}

export function getDriverSimulationByDiagramId(diagramId: string) {
  const simulation = driverSimulationByDiagramId.get(diagramId);
  if (!simulation) throw new Error(`Driver simulation for ${diagramId} is missing`);
  return simulation;
}

export function getVisualGuidance(id: string): VisualGuidance {
  const guidance = guidanceById.get(id);
  if (!guidance) throw new Error(`Visual guidance ${id} is missing`);
  return guidance;
}

export function getLessonVisualSet(lessonId: string) {
  const definition = definitions.find((item) => item.lessonId === lessonId);
  if (!definition) throw new Error(`Lesson visual definition ${lessonId} is missing`);

  const diagrams = definition.diagramIds.map((diagramId) => {
    const scene = sceneById.get(diagramId);
    const entry = manifestById.get(diagramId);
    if (!scene || scene.reviewStatus !== "approved" || entry?.reviewStatus !== "approved") {
      throw new Error(`${lessonId} requires approved diagram ${diagramId}`);
    }
    return {
      ...scene,
      assetPath: `/diagrams/${scene.id}.svg`,
      containsOfficialVisual:
        scene.id === "D002" || ("assetIds" in scene && scene.assetIds.length > 0),
    };
  });

  const lessonIllustrations = definition.illustrationIds.map((illustrationId) => {
    const illustration = illustrationById.get(illustrationId);
    if (!illustration || illustration.lessonId !== lessonId) {
      throw new Error(`${lessonId} requires matching illustration ${illustrationId}`);
    }
    return { ...illustration, guidance: getVisualGuidance(illustration.id) };
  });

  const diagramPairs = diagrams.map((diagram) => ({
    diagram,
    simulation: getDriverSimulationByDiagramId(diagram.id),
    guidance: getVisualGuidance(diagram.id),
  }));

  const officialSigns = definition.officialSignIds.map((signId) => {
    const sign = signById.get(signId);
    if (!sign) throw new Error(`${lessonId} requires official sign ${signId}`);
    return sign;
  });

  if (diagrams.length + lessonIllustrations.length === 0 && officialSigns.length === 0) {
    throw new Error(`${lessonId} requires at least one visual learning aid`);
  }

  return Object.freeze({
    lessonId,
    diagramIds: definition.diagramIds,
    diagrams: Object.freeze(diagrams),
    diagramPairs: Object.freeze(diagramPairs),
    illustrations: Object.freeze(lessonIllustrations),
    officialSigns: Object.freeze(officialSigns),
  });
}

export const lessonVisualDefinitions = Object.freeze(definitions);
