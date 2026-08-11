import { z } from "astro/zod";

import {
  diagramIdSchema,
  lessonIdSchema,
  REVIEW_STATUSES,
  RULE_CATEGORIES,
  ruleIdSchema,
  type Rule,
  type ValidationIssue,
} from "./schema";

export const LESSON_LOCALES = ["zh-TW", "en"] as const;

const nonEmptyString = z.string().trim().min(1);

function uniqueArray<T extends z.ZodType>(item: T, message: string) {
  return z
    .array(item)
    .refine((items) => new Set(items).size === items.length, message);
}

export const lessonFrontmatterSchema = z
  .object({
    id: lessonIdSchema,
    locale: z.enum(LESSON_LOCALES),
    title: nonEmptyString,
    ruleIds: uniqueArray(ruleIdSchema, "Rule IDs must be unique").min(1),
    diagramIds: uniqueArray(diagramIdSchema, "Diagram IDs must be unique"),
    quizTags: uniqueArray(z.enum(RULE_CATEGORIES), "Quiz tags must be unique").min(
      1,
    ),
    order: z.number().int().nonnegative(),
    reviewStatus: z.enum(REVIEW_STATUSES),
  })
  .strict();

export const lessonDocumentSchema = z
  .object({
    filePath: nonEmptyString,
    frontmatter: lessonFrontmatterSchema,
    body: nonEmptyString,
  })
  .strict()
  .superRefine((document, context) => {
    const expectedPath = `${document.frontmatter.id}/${document.frontmatter.locale}.md`;
    if (document.filePath !== expectedPath) {
      context.addIssue({
        code: "custom",
        path: ["filePath"],
        message: `Expected lesson path ${expectedPath}`,
      });
    }
  });

export type LessonFrontmatter = z.infer<typeof lessonFrontmatterSchema>;
export type LessonDocument = z.infer<typeof lessonDocumentSchema>;

const parityKeys = [
  "id",
  "ruleIds",
  "diagramIds",
  "quizTags",
  "order",
  "reviewStatus",
] as const satisfies readonly (keyof LessonFrontmatter)[];

function formatIssues(issues: z.core.$ZodIssue[]): ValidationIssue[] {
  return issues.map((issue) => ({
    path: ["lessons", ...issue.path].filter(Boolean).join("."),
    code: `schema_${issue.code}`,
    message: issue.message,
  }));
}

function valuesMatch(
  left: LessonFrontmatter,
  right: LessonFrontmatter,
  key: (typeof parityKeys)[number],
): boolean {
  return JSON.stringify(left[key]) === JSON.stringify(right[key]);
}

export function validateLessonDocuments(input: {
  documents: unknown;
  rules: readonly Rule[];
}): ValidationIssue[] {
  const result = z.array(lessonDocumentSchema).min(1).safeParse(input.documents);
  if (!result.success) return formatIssues(result.error.issues);

  const issues: ValidationIssue[] = [];
  const rulesById = new Set(input.rules.map((rule) => rule.id));
  const groups = new Map<string, LessonDocument[]>();
  const localeKeys = new Set<string>();

  for (const [index, document] of result.data.entries()) {
    const { frontmatter } = document;
    const localeKey = `${frontmatter.id}:${frontmatter.locale}`;

    if (localeKeys.has(localeKey)) {
      issues.push({
        path: `lessons.${index}.frontmatter.locale`,
        code: "duplicate_locale",
        message: `Duplicate locale ${frontmatter.locale} for ${frontmatter.id}`,
      });
    }
    localeKeys.add(localeKey);

    for (const ruleId of frontmatter.ruleIds) {
      if (!rulesById.has(ruleId)) {
        issues.push({
          path: `lessons.${index}.frontmatter.ruleIds`,
          code: "missing_rule",
          message: `${frontmatter.id} references unknown rule ${ruleId}`,
        });
      }
    }

    const group = groups.get(frontmatter.id) ?? [];
    group.push(document);
    groups.set(frontmatter.id, group);
  }

  for (const [lessonId, documents] of groups) {
    for (const locale of LESSON_LOCALES) {
      if (!documents.some((document) => document.frontmatter.locale === locale)) {
        issues.push({
          path: `lessons.${lessonId}`,
          code: "missing_locale",
          message: `${lessonId} is missing locale ${locale}`,
        });
      }
    }

    const baseline = documents[0];
    for (const document of documents.slice(1)) {
      for (const key of parityKeys) {
        if (!valuesMatch(baseline.frontmatter, document.frontmatter, key)) {
          issues.push({
            path: `lessons.${lessonId}.${key}`,
            code: "locale_parity_mismatch",
            message: `${lessonId} has inconsistent ${key} across locales`,
          });
        }
      }
    }
  }

  return issues;
}
