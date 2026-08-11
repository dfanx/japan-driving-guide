import type { Question } from "../content/question-schema";

export interface QuizSession {
  readonly questionIds: readonly string[];
  readonly currentIndex: number;
  readonly answers: Readonly<Record<string, string>>;
  readonly results: Readonly<Record<string, boolean>>;
}

export type QuizSessionErrorCode =
  | "already_answered"
  | "completed"
  | "duplicate_question"
  | "empty_quiz"
  | "invalid_session"
  | "unanswered"
  | "unapproved_question"
  | "unknown_option"
  | "wrong_question";

export class QuizSessionError extends Error {
  readonly code: QuizSessionErrorCode;

  constructor(code: QuizSessionErrorCode, message: string) {
    super(message);
    this.name = "QuizSessionError";
    this.code = code;
  }
}

function fail(code: QuizSessionErrorCode, message: string): never {
  throw new QuizSessionError(code, message);
}

function hasOwn(record: Readonly<Record<string, unknown>>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, key);
}

function freezeSession(input: {
  questionIds: readonly string[];
  currentIndex: number;
  answers: Readonly<Record<string, string>>;
  results: Readonly<Record<string, boolean>>;
}): QuizSession {
  return Object.freeze({
    questionIds: Object.freeze([...input.questionIds]),
    currentIndex: input.currentIndex,
    answers: Object.freeze({ ...input.answers }),
    results: Object.freeze({ ...input.results }),
  });
}

function assertQuestionIsApproved(question: Question): void {
  if (question.reviewStatus !== "approved") {
    fail(
      "unapproved_question",
      `${question.id} is not approved for a production quiz`,
    );
  }
}

function assertSessionInvariant(session: QuizSession): void {
  const { questionIds, currentIndex, answers, results } = session;
  if (
    questionIds.length < 1 ||
    new Set(questionIds).size !== questionIds.length ||
    !Number.isInteger(currentIndex) ||
    currentIndex < 0 ||
    currentIndex > questionIds.length
  ) {
    fail("invalid_session", "Quiz session structure is invalid");
  }

  const knownIds = new Set(questionIds);
  const answerIds = Object.keys(answers);
  const resultIds = Object.keys(results);
  if (
    answerIds.some((id) => !knownIds.has(id)) ||
    resultIds.some((id) => !knownIds.has(id)) ||
    answerIds.length !== resultIds.length ||
    answerIds.some((id) => !hasOwn(results, id)) ||
    resultIds.some((id) => !hasOwn(answers, id))
  ) {
    fail("invalid_session", "Quiz answers and results are not aligned");
  }

  for (const [id, answer] of Object.entries(answers)) {
    if (typeof answer !== "string" || answer.length < 1 || typeof results[id] !== "boolean") {
      fail("invalid_session", `Quiz result for ${id} is invalid`);
    }
  }

  const requiredAnsweredCount = currentIndex;
  for (let index = 0; index < requiredAnsweredCount; index += 1) {
    if (!hasOwn(answers, questionIds[index])) {
      fail("invalid_session", "Quiz session contains a skipped question");
    }
  }

  const maximumAnsweredCount = Math.min(currentIndex + 1, questionIds.length);
  if (answerIds.length > maximumAnsweredCount) {
    fail("invalid_session", "Quiz session contains a future answer");
  }
  for (const answerId of answerIds) {
    if (questionIds.indexOf(answerId) > currentIndex) {
      fail("invalid_session", "Quiz session contains a future answer");
    }
  }
  if (currentIndex === questionIds.length && answerIds.length !== questionIds.length) {
    fail("invalid_session", "A completed quiz must contain every answer");
  }
}

export function createQuizSession(questions: readonly Question[]): QuizSession {
  if (questions.length < 1) {
    fail("empty_quiz", "A quiz requires at least one question");
  }
  const questionIds = questions.map((question) => {
    assertQuestionIsApproved(question);
    return question.id;
  });
  if (new Set(questionIds).size !== questionIds.length) {
    fail("duplicate_question", "Quiz question IDs must be unique");
  }

  return freezeSession({
    questionIds,
    currentIndex: 0,
    answers: {},
    results: {},
  });
}

export function getCurrentQuestionId(session: QuizSession): string | null {
  assertSessionInvariant(session);
  return session.questionIds[session.currentIndex] ?? null;
}

export function isQuizComplete(session: QuizSession): boolean {
  assertSessionInvariant(session);
  return session.currentIndex === session.questionIds.length;
}

export function submitQuizAnswer(input: {
  session: QuizSession;
  question: Question;
  optionId: string;
}): QuizSession {
  const { session, question, optionId } = input;
  assertSessionInvariant(session);
  if (isQuizComplete(session)) {
    fail("completed", "A completed quiz cannot accept another answer");
  }
  assertQuestionIsApproved(question);

  const currentQuestionId = getCurrentQuestionId(session);
  if (currentQuestionId !== question.id) {
    fail(
      "wrong_question",
      `Expected ${currentQuestionId}, received ${question.id}`,
    );
  }
  if (hasOwn(session.answers, question.id)) {
    fail("already_answered", `${question.id} already has an answer`);
  }
  if (!question.options.some((option) => option.id === optionId)) {
    fail("unknown_option", `${optionId} is not an option for ${question.id}`);
  }

  return freezeSession({
    ...session,
    answers: { ...session.answers, [question.id]: optionId },
    results: { ...session.results, [question.id]: optionId === question.answer },
  });
}

export function advanceQuizSession(session: QuizSession): QuizSession {
  assertSessionInvariant(session);
  if (isQuizComplete(session)) {
    fail("completed", "A completed quiz cannot advance");
  }

  const currentQuestionId = getCurrentQuestionId(session);
  if (!currentQuestionId || !hasOwn(session.answers, currentQuestionId)) {
    fail("unanswered", "Answer the current question before advancing");
  }

  return freezeSession({
    ...session,
    currentIndex: session.currentIndex + 1,
  });
}
