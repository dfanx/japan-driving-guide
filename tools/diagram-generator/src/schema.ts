import { z } from "astro/zod";

import {
  diagramIdSchema,
  localizedTextSchema,
  REVIEW_STATUSES,
  ruleIdSchema,
  type Rule,
  type ValidationIssue,
} from "../../../src/lib/content/schema";

export const SCENE_SCHEMA_VERSION = "1.0.0" as const;
export const CARDINAL_APPROACHES = ["north", "east", "south", "west"] as const;

const approachSchema = z.enum(CARDINAL_APPROACHES);
const vehicleIdSchema = z.string().regex(/^[A-Z][A-Z0-9-]*$/);

function uniqueArray<T extends z.ZodType>(item: T, message: string) {
  return z
    .array(item)
    .refine((items) => new Set(items).size === items.length, message);
}

const canvasSchema = z
  .object({
    aspect: z.literal("3:2"),
    viewBox: z
      .object({
        width: z.literal(1200),
        height: z.literal(800),
      })
      .strict(),
  })
  .strict();

const roadAxisSchema = z
  .object({
    lanesPerDirection: z.number().int().min(1).max(3),
  })
  .strict();

const signalSchema = z
  .object({
    approach: approachSchema,
    state: z.enum(["red", "yellow", "green", "flashing_red", "flashing_yellow"]),
    greenArrows: uniqueArray(
      z.enum(["straight", "left", "right"]),
      "Green arrow directions must be unique",
    ),
  })
  .strict();

const vehicleSchema = z
  .object({
    id: vehicleIdSchema,
    color: z.enum(["yellow", "blue", "red"]),
    from: approachSchema,
    maneuver: z.enum(["straight", "left", "right", "stopped"]),
    position: z.enum(["before_stop_line", "intersection", "exiting"]),
    label: z.string().trim().min(1).max(3).optional(),
  })
  .strict();

const annotationSchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("instruction"),
      kind: z.literal("stop_before_line"),
      vehicleId: vehicleIdSchema,
    })
    .strict(),
  z
    .object({
      type: z.literal("yield"),
      vehicleId: vehicleIdSchema,
      toVehicleId: vehicleIdSchema,
    })
    .strict(),
  z
    .object({
      type: z.enum(["error", "correct"]),
      vehicleId: vehicleIdSchema,
    })
    .strict(),
]);

export const fourWayIntersectionSceneSchema = z
  .object({
    id: diagramIdSchema,
    schemaVersion: z.literal(SCENE_SCHEMA_VERSION),
    template: z.literal("FourWayIntersection"),
    canvas: canvasSchema,
    ruleIds: uniqueArray(ruleIdSchema, "Rule IDs must be unique").min(1),
    roads: z
      .object({
        northSouth: roadAxisSchema,
        eastWest: roadAxisSchema,
      })
      .strict(),
    crosswalks: uniqueArray(approachSchema, "Crosswalk approaches must be unique"),
    stopLines: uniqueArray(approachSchema, "Stop-line approaches must be unique"),
    signals: z
      .array(signalSchema)
      .min(1)
      .refine(
        (signals) =>
          new Set(signals.map((signal) => signal.approach)).size === signals.length,
        "Only one signal definition is allowed per approach",
      ),
    vehicles: z
      .array(vehicleSchema)
      .min(1)
      .refine(
        (vehicles) =>
          new Set(vehicles.map((vehicle) => vehicle.id)).size === vehicles.length,
        "Vehicle IDs must be unique",
      ),
    annotations: z.array(annotationSchema),
    alt: localizedTextSchema,
    reviewStatus: z.enum(REVIEW_STATUSES),
  })
  .strict()
  .superRefine((scene, context) => {
    const vehiclesById = new Map(scene.vehicles.map((vehicle) => [vehicle.id, vehicle]));

    for (const [index, annotation] of scene.annotations.entries()) {
      const vehicle = vehiclesById.get(annotation.vehicleId);
      if (!vehicle) {
        context.addIssue({
          code: "custom",
          path: ["annotations", index, "vehicleId"],
          message: `Annotation references unknown vehicle ${annotation.vehicleId}`,
        });
        continue;
      }

      if (annotation.type === "yield" && !vehiclesById.has(annotation.toVehicleId)) {
        context.addIssue({
          code: "custom",
          path: ["annotations", index, "toVehicleId"],
          message: `Yield annotation references unknown vehicle ${annotation.toVehicleId}`,
        });
      }

      if (
        annotation.type === "instruction" &&
        !scene.stopLines.includes(vehicle.from)
      ) {
        context.addIssue({
          code: "custom",
          path: ["annotations", index],
          message: `Stop instruction for ${vehicle.id} requires a stop line on ${vehicle.from}`,
        });
      }
    }
  });

export type FourWayIntersectionScene = z.infer<typeof fourWayIntersectionSceneSchema>;

export const PRESET_COMPOSITIONS = [
  "left_side_exit",
  "signal_asset_card",
  "comparison",
  "intersection_movement",
  "crosswalk",
  "bicycle_passing",
  "road_comparison",
  "railway_crossing",
  "sign_card",
  "toll_gate",
  "parking_roadside",
  "expressway_merge",
  "expressway_lanes",
  "fuel_card",
  "breakdown",
] as const;

const expectedCompositionById: Readonly<Record<string, (typeof PRESET_COMPOSITIONS)[number]>> = {
  D001: "left_side_exit",
  D003: "signal_asset_card",
  D004: "signal_asset_card",
  D005: "comparison",
  D006: "intersection_movement",
  D007: "intersection_movement",
  D008: "intersection_movement",
  D009: "crosswalk",
  D010: "bicycle_passing",
  D011: "road_comparison",
  D012: "railway_crossing",
  D013: "sign_card",
  D014: "sign_card",
  D015: "sign_card",
  D016: "sign_card",
  D017: "sign_card",
  D018: "toll_gate",
  D019: "parking_roadside",
  D020: "expressway_merge",
  D021: "expressway_lanes",
  D022: "toll_gate",
  D023: "fuel_card",
  D024: "breakdown",
};

export const presetDiagramSceneSchema = z
  .object({
    id: diagramIdSchema,
    schemaVersion: z.literal(SCENE_SCHEMA_VERSION),
    template: z.literal("Preset"),
    composition: z.enum(PRESET_COMPOSITIONS),
    canvas: canvasSchema,
    ruleIds: uniqueArray(ruleIdSchema, "Rule IDs must be unique").min(1),
    assetIds: uniqueArray(z.string().regex(/^[A-Z0-9-]+$/), "Asset IDs must be unique"),
    alt: localizedTextSchema,
    reviewStatus: z.enum(REVIEW_STATUSES),
  })
  .strict()
  .superRefine((scene, context) => {
    const expected = expectedCompositionById[scene.id];
    if (!expected) {
      context.addIssue({ code: "custom", path: ["id"], message: `${scene.id} is not a registered preset Scene` });
    } else if (scene.composition !== expected) {
      context.addIssue({ code: "custom", path: ["composition"], message: `${scene.id} requires ${expected}` });
    }
  });

export const diagramSceneSchema = z.union([
  fourWayIntersectionSceneSchema,
  presetDiagramSceneSchema,
]);
export type DiagramScene = z.infer<typeof diagramSceneSchema>;

function formatIssues(issues: z.core.$ZodIssue[]): ValidationIssue[] {
  return issues.map((issue) => ({
    path: ["diagramScenes", ...issue.path].filter(Boolean).join("."),
    code: `schema_${issue.code}`,
    message: issue.message,
  }));
}

export function validateDiagramScenes(input: {
  scenes: unknown;
  rules: readonly Rule[];
}): ValidationIssue[] {
  const result = z.array(diagramSceneSchema).min(1).safeParse(input.scenes);
  if (!result.success) return formatIssues(result.error.issues);

  const issues: ValidationIssue[] = [];
  const seenIds = new Set<string>();
  const rulesById = new Map(input.rules.map((rule) => [rule.id, rule]));

  for (const [index, scene] of result.data.entries()) {
    if (seenIds.has(scene.id)) {
      issues.push({
        path: `diagramScenes.${index}.id`,
        code: "duplicate_id",
        message: `Duplicate ID: ${scene.id}`,
      });
    }
    seenIds.add(scene.id);

    const resolvedRules = scene.ruleIds
      .map((ruleId) => rulesById.get(ruleId))
      .filter((rule): rule is Rule => Boolean(rule));

    for (const ruleId of scene.ruleIds) {
      if (!rulesById.has(ruleId)) {
        issues.push({
          path: `diagramScenes.${index}.ruleIds`,
          code: "missing_rule",
          message: `${scene.id} references unknown rule ${ruleId}`,
        });
      }
    }

    if (
      scene.reviewStatus === "approved" &&
      resolvedRules.some((rule) => rule.reviewStatus !== "approved")
    ) {
      issues.push({
        path: `diagramScenes.${index}.ruleIds`,
        code: "approved_scene_with_unapproved_rule",
        message: `${scene.id} is approved but references an unapproved rule`,
      });
    }
  }

  return issues;
}
