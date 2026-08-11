import { z } from "astro/zod";

export const SOURCE_TIERS = ["S", "A", "B"] as const;
export const TOURIST_PRIORITIES = ["must_know", "useful", "optional"] as const;
export const CONTENT_CLASSIFICATIONS = [
  "legal_rule",
  "official_guidance",
  "practical_advice",
] as const;
export const REVIEW_STATUSES = ["draft", "needs_review", "approved"] as const;
export const RULE_CATEGORIES = [
  "eligibility",
  "left_side_driving",
  "signals",
  "stop_sign",
  "intersections",
  "pedestrians",
  "cyclists",
  "speed",
  "rail_crossing",
  "signs",
  "parking",
  "expressway",
  "fuel",
  "weather",
  "emergency",
  "safety_basics",
] as const;

const nonEmptyString = z.string().trim().min(1);
const sourceIdSchema = z.string().regex(/^S\d{2,}$/);
export const ruleIdSchema = z
  .string()
  .regex(/^JP-RULE-[A-Z0-9]+(?:-[A-Z0-9]+)+$/);
export const lessonIdSchema = z
  .string()
  .regex(/^M\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const questionIdSchema = z.string().regex(/^Q\d{3}$/);
export const diagramIdSchema = z.string().regex(/^D\d{3}$/);

function isCalendarDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

export const isoDateSchema = z
  .string()
  .refine(isCalendarDate, "Expected a real calendar date in YYYY-MM-DD format");

const httpsUrlSchema = z.url({
  protocol: /^https$/,
  message: "Expected an HTTPS URL",
});

const uniqueSourceIdsSchema = z
  .array(sourceIdSchema)
  .min(1)
  .refine((ids) => new Set(ids).size === ids.length, "Source IDs must be unique");

const uniqueLessonIdsSchema = z
  .array(lessonIdSchema)
  .min(1)
  .refine((ids) => new Set(ids).size === ids.length, "Lesson IDs must be unique");

export const localizedTextSchema = z
  .object({
    "zh-TW": nonEmptyString,
    en: nonEmptyString,
  })
  .strict();

export const localizedTitleSchema = localizedTextSchema;

export const sourceSchema = z
  .object({
    id: sourceIdSchema,
    title: nonEmptyString,
    authority: nonEmptyString,
    url: httpsUrlSchema,
    tier: z.enum(SOURCE_TIERS),
    checkedAt: isoDateSchema,
    notes: nonEmptyString,
  })
  .strict();

export const ruleSchema = z
  .object({
    id: ruleIdSchema,
    title: localizedTitleSchema,
    category: z.enum(RULE_CATEGORIES),
    touristPriority: z.enum(TOURIST_PRIORITIES),
    legalOrGuidance: z.enum(CONTENT_CLASSIFICATIONS),
    sourceIds: uniqueSourceIdsSchema,
    verifiedAt: isoDateSchema,
    effectiveFrom: isoDateSchema.nullable(),
    effectiveTo: isoDateSchema.nullable(),
    reviewStatus: z.enum(REVIEW_STATUSES),
    lessonIds: uniqueLessonIdsSchema,
  })
  .strict()
  .superRefine((rule, context) => {
    if (
      rule.effectiveFrom &&
      rule.effectiveTo &&
      rule.effectiveFrom > rule.effectiveTo
    ) {
      context.addIssue({
        code: "custom",
        path: ["effectiveTo"],
        message: "effectiveTo must not be earlier than effectiveFrom",
      });
    }
  });

export type Source = z.infer<typeof sourceSchema>;
export type Rule = z.infer<typeof ruleSchema>;

export type ValidationIssue = {
  path: string;
  code: string;
  message: string;
};

function formatIssues(prefix: string, issues: z.core.$ZodIssue[]): ValidationIssue[] {
  return issues.map((issue) => ({
    path: [prefix, ...issue.path].filter(Boolean).join("."),
    code: `schema_${issue.code}`,
    message: issue.message,
  }));
}

function findDuplicateIds(
  collection: readonly { id: string }[],
  path: string,
): ValidationIssue[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const item of collection) {
    if (seen.has(item.id)) duplicates.add(item.id);
    seen.add(item.id);
  }

  return [...duplicates].map((id) => ({
    path,
    code: "duplicate_id",
    message: `Duplicate ID: ${id}`,
  }));
}

export function validateContentData(input: {
  sources: unknown;
  rules: unknown;
}): ValidationIssue[] {
  const sourceResult = z.array(sourceSchema).min(1).safeParse(input.sources);
  const ruleResult = z.array(ruleSchema).min(1).safeParse(input.rules);
  const issues: ValidationIssue[] = [];

  if (!sourceResult.success) {
    issues.push(...formatIssues("sources", sourceResult.error.issues));
  }

  if (!ruleResult.success) {
    issues.push(...formatIssues("rules", ruleResult.error.issues));
  }

  if (!sourceResult.success || !ruleResult.success) return issues;

  const sources = sourceResult.data;
  const rules = ruleResult.data;
  issues.push(...findDuplicateIds(sources, "sources"));
  issues.push(...findDuplicateIds(rules, "rules"));

  const sourcesById = new Map(sources.map((source) => [source.id, source]));

  for (const [ruleIndex, rule] of rules.entries()) {
    const resolvedSources = rule.sourceIds
      .map((sourceId) => sourcesById.get(sourceId))
      .filter((source): source is Source => Boolean(source));

    for (const sourceId of rule.sourceIds) {
      if (!sourcesById.has(sourceId)) {
        issues.push({
          path: `rules.${ruleIndex}.sourceIds`,
          code: "missing_source",
          message: `${rule.id} references unknown source ${sourceId}`,
        });
      }
    }

    if (
      rule.legalOrGuidance === "legal_rule" &&
      resolvedSources.length === rule.sourceIds.length &&
      !resolvedSources.some((source) => source.tier === "S")
    ) {
      issues.push({
        path: `rules.${ruleIndex}.sourceIds`,
        code: "legal_rule_without_tier_s",
        message: `${rule.id} is a legal rule without a Tier S source`,
      });
    }
  }

  return issues;
}
