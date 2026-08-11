import { z } from "astro/zod";

import {
  diagramIdSchema,
  localizedTextSchema,
  questionIdSchema,
  REVIEW_STATUSES,
  RULE_CATEGORIES,
  ruleIdSchema,
  type Rule,
  type ValidationIssue,
} from "./schema";

const optionIdSchema = z.string().regex(/^[A-Z]$/);

function uniqueArray<T extends z.ZodType>(item: T, message: string) {
  return z
    .array(item)
    .refine((items) => new Set(items).size === items.length, message);
}

export const questionOptionSchema = z
  .object({
    id: optionIdSchema,
    text: localizedTextSchema,
  })
  .strict();

export const questionSchema = z
  .object({
    id: questionIdSchema,
    type: z.literal("single_choice"),
    tags: uniqueArray(z.enum(RULE_CATEGORIES), "Question tags must be unique").min(
      1,
    ),
    ruleIds: uniqueArray(ruleIdSchema, "Rule IDs must be unique").min(1),
    diagramId: diagramIdSchema.optional(),
    difficulty: z.number().int().min(1).max(3),
    prompt: localizedTextSchema,
    options: z
      .array(questionOptionSchema)
      .min(2)
      .max(4)
      .refine(
        (options) => new Set(options.map((option) => option.id)).size === options.length,
        "Option IDs must be unique",
      ),
    answer: optionIdSchema,
    explanation: localizedTextSchema,
    reviewStatus: z.enum(REVIEW_STATUSES),
  })
  .strict()
  .superRefine((question, context) => {
    if (!question.options.some((option) => option.id === question.answer)) {
      context.addIssue({
        code: "custom",
        path: ["answer"],
        message: "Answer must reference an existing option ID",
      });
    }
  });

export type Question = z.infer<typeof questionSchema>;

function formatIssues(issues: z.core.$ZodIssue[]): ValidationIssue[] {
  return issues.map((issue) => ({
    path: ["questions", ...issue.path].filter(Boolean).join("."),
    code: `schema_${issue.code}`,
    message: issue.message,
  }));
}

export function validateQuestionData(input: {
  questions: unknown;
  rules: readonly Rule[];
  diagramIds?: readonly string[];
  requireApproved?: boolean;
}): ValidationIssue[] {
  const result = z.array(questionSchema).min(1).safeParse(input.questions);
  if (!result.success) return formatIssues(result.error.issues);

  const issues: ValidationIssue[] = [];
  const seenIds = new Set<string>();
  const rulesById = new Map(input.rules.map((rule) => [rule.id, rule]));
  const diagramIds = input.diagramIds ? new Set(input.diagramIds) : null;
  const requireApproved = input.requireApproved ?? true;

  for (const [index, question] of result.data.entries()) {
    if (seenIds.has(question.id)) {
      issues.push({
        path: `questions.${index}.id`,
        code: "duplicate_id",
        message: `Duplicate ID: ${question.id}`,
      });
    }
    seenIds.add(question.id);

    if (question.diagramId && diagramIds && !diagramIds.has(question.diagramId)) {
      issues.push({
        path: `questions.${index}.diagramId`,
        code: "missing_diagram_scene",
        message: `${question.id} references unknown diagram scene ${question.diagramId}`,
      });
    }

    if (requireApproved && question.reviewStatus !== "approved") {
      issues.push({
        path: `questions.${index}.reviewStatus`,
        code: "unapproved_question",
        message: `${question.id} is not approved for production`,
      });
    }

    const resolvedRules = question.ruleIds
      .map((ruleId) => rulesById.get(ruleId))
      .filter((rule): rule is Rule => Boolean(rule));

    for (const ruleId of question.ruleIds) {
      if (!rulesById.has(ruleId)) {
        issues.push({
          path: `questions.${index}.ruleIds`,
          code: "missing_rule",
          message: `${question.id} references unknown rule ${ruleId}`,
        });
      }
    }

    if (resolvedRules.length !== question.ruleIds.length) continue;

    if (
      question.reviewStatus === "approved" &&
      resolvedRules.some((rule) => rule.reviewStatus !== "approved")
    ) {
      issues.push({
        path: `questions.${index}.ruleIds`,
        code: "approved_question_with_unapproved_rule",
        message: `${question.id} references a rule that is not approved`,
      });
    }

    for (const tag of question.tags) {
      if (!resolvedRules.some((rule) => rule.category === tag)) {
        issues.push({
          path: `questions.${index}.tags`,
          code: "tag_rule_mismatch",
          message: `${question.id} tag ${tag} is not backed by a referenced rule category`,
        });
      }
    }
  }

  return issues;
}
