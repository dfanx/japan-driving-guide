import type { Question } from "../content/question-schema";
import { RULE_CATEGORIES } from "../content/schema";
import {
  getCurrentQuestionId,
  type QuizSession,
} from "../quiz";

export const WEAKNESS_BANDS = [
  "strong",
  "review",
  "priority_review",
] as const;

export type WeaknessBand = (typeof WEAKNESS_BANDS)[number];
export type WeaknessTag = Question["tags"][number];
export type WeaknessSample = "limited" | "sufficient";

export interface WeaknessResult {
  readonly tag: WeaknessTag;
  readonly correctCount: number;
  readonly answeredCount: number;
  readonly ratio: number;
  readonly band: WeaknessBand;
  readonly sample: WeaknessSample;
}

export type WeaknessAnalysisErrorCode =
  | "duplicate_question"
  | "invalid_question_tags"
  | "missing_question"
  | "unapproved_question";

export class WeaknessAnalysisError extends Error {
  readonly code: WeaknessAnalysisErrorCode;

  constructor(code: WeaknessAnalysisErrorCode, message: string) {
    super(message);
    this.name = "WeaknessAnalysisError";
    this.code = code;
  }
}

interface MutableTagCount {
  correctCount: number;
  answeredCount: number;
}

function fail(code: WeaknessAnalysisErrorCode, message: string): never {
  throw new WeaknessAnalysisError(code, message);
}

function hasOwn(record: Readonly<Record<string, unknown>>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, key);
}

function getBand(ratio: number): WeaknessBand {
  if (ratio >= 0.8) return "strong";
  if (ratio >= 0.6) return "review";
  return "priority_review";
}

function assertQuestionTags(question: Question): void {
  const allowedTags = new Set<string>(RULE_CATEGORIES);
  if (
    question.tags.length < 1 ||
    new Set(question.tags).size !== question.tags.length ||
    question.tags.some((tag) => !allowedTags.has(tag))
  ) {
    fail(
      "invalid_question_tags",
      `${question.id} has invalid or duplicate weakness tags`,
    );
  }
}

export function analyzeWeakness(input: {
  session: QuizSession;
  questions: readonly Question[];
}): readonly WeaknessResult[] {
  const { session, questions } = input;

  // Reuse the QuizSession invariant gate before interpreting answer state.
  getCurrentQuestionId(session);

  const questionsById = new Map<string, Question>();
  for (const question of questions) {
    if (questionsById.has(question.id)) {
      fail("duplicate_question", `Duplicate Question record: ${question.id}`);
    }
    questionsById.set(question.id, question);
  }

  for (const questionId of session.questionIds) {
    const question = questionsById.get(questionId);
    if (!question) {
      fail("missing_question", `Missing Question record: ${questionId}`);
    }
    if (question.reviewStatus !== "approved") {
      fail(
        "unapproved_question",
        `${questionId} is not approved for weakness analysis`,
      );
    }
    assertQuestionTags(question);
  }

  const counts = new Map<WeaknessTag, MutableTagCount>();
  for (const questionId of session.questionIds) {
    if (!hasOwn(session.results, questionId)) continue;

    const question = questionsById.get(questionId);
    if (!question) {
      fail("missing_question", `Missing Question record: ${questionId}`);
    }
    const isCorrect = session.results[questionId];

    for (const tag of question.tags) {
      const count = counts.get(tag) ?? { correctCount: 0, answeredCount: 0 };
      count.answeredCount += 1;
      if (isCorrect) count.correctCount += 1;
      counts.set(tag, count);
    }
  }

  const results = RULE_CATEGORIES.flatMap((tag) => {
    const count = counts.get(tag);
    if (!count) return [];

    const ratio = count.correctCount / count.answeredCount;
    return [
      Object.freeze({
        tag,
        correctCount: count.correctCount,
        answeredCount: count.answeredCount,
        ratio,
        band: getBand(ratio),
        sample: count.answeredCount === 1 ? "limited" : "sufficient",
      }),
    ];
  });

  return Object.freeze(results);
}
