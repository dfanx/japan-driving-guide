import { describe, expect, it } from "vitest";

import { getQuestionById } from "../../src/lib/content/catalog";
import type { Question } from "../../src/lib/content/question-schema";
import {
  advanceQuizSession,
  createQuizSession,
  getCurrentQuestionId,
  isQuizComplete,
  QuizSessionError,
  submitQuizAnswer,
  type QuizSession,
} from "../../src/lib/quiz";

const question = getQuestionById("Q002");
const secondQuestion: Question = {
  ...question,
  id: "Q003",
};

function expectQuizError(action: () => unknown, code: QuizSessionError["code"]): void {
  try {
    action();
    throw new Error(`Expected QuizSessionError ${code}`);
  } catch (error) {
    expect(error).toBeInstanceOf(QuizSessionError);
    expect((error as QuizSessionError).code).toBe(code);
  }
}

describe("QuizSession creation", () => {
  it("creates an immutable session in the supplied deterministic order", () => {
    const questions = [question, secondQuestion];
    const session = createQuizSession(questions);

    expect(session).toEqual({
      questionIds: ["Q002", "Q003"],
      currentIndex: 0,
      answers: {},
      results: {},
    });
    expect(getCurrentQuestionId(session)).toBe("Q002");
    expect(isQuizComplete(session)).toBe(false);
    expect(Object.isFrozen(session)).toBe(true);
    expect(Object.isFrozen(session.questionIds)).toBe(true);
    expect(questions).toEqual([question, secondQuestion]);
  });

  it("rejects empty, duplicate, and unapproved question sets", () => {
    expectQuizError(() => createQuizSession([]), "empty_quiz");
    expectQuizError(
      () => createQuizSession([question, question]),
      "duplicate_question",
    );
    expectQuizError(
      () => createQuizSession([{ ...question, reviewStatus: "needs_review" }]),
      "unapproved_question",
    );
  });
});

describe("QuizSession answer transitions", () => {
  it("records a correct answer without mutating the previous session", () => {
    const initial = createQuizSession([question]);
    const answered = submitQuizAnswer({
      session: initial,
      question,
      optionId: "B",
    });

    expect(initial.answers).toEqual({});
    expect(answered.answers).toEqual({ Q002: "B" });
    expect(answered.results).toEqual({ Q002: true });
    expect(answered.currentIndex).toBe(0);
  });

  it("records an incorrect answer deterministically", () => {
    const answered = submitQuizAnswer({
      session: createQuizSession([question]),
      question,
      optionId: "A",
    });

    expect(answered.answers).toEqual({ Q002: "A" });
    expect(answered.results).toEqual({ Q002: false });
  });

  it("rejects the wrong question, unknown option, and duplicate submission", () => {
    const initial = createQuizSession([question]);
    expectQuizError(
      () =>
        submitQuizAnswer({ session: initial, question: secondQuestion, optionId: "B" }),
      "wrong_question",
    );
    expectQuizError(
      () => submitQuizAnswer({ session: initial, question, optionId: "C" }),
      "unknown_option",
    );
    const answered = submitQuizAnswer({ session: initial, question, optionId: "B" });
    expectQuizError(
      () => submitQuizAnswer({ session: answered, question, optionId: "A" }),
      "already_answered",
    );
  });
});

describe("QuizSession progression", () => {
  it("requires an answer before advancing and completes at the terminal index", () => {
    const initial = createQuizSession([question]);
    expectQuizError(() => advanceQuizSession(initial), "unanswered");

    const answered = submitQuizAnswer({ session: initial, question, optionId: "B" });
    const completed = advanceQuizSession(answered);
    expect(completed.currentIndex).toBe(1);
    expect(getCurrentQuestionId(completed)).toBeNull();
    expect(isQuizComplete(completed)).toBe(true);
    expectQuizError(() => advanceQuizSession(completed), "completed");
    expectQuizError(
      () => submitQuizAnswer({ session: completed, question, optionId: "B" }),
      "completed",
    );
  });

  it("moves through multiple questions without skipping", () => {
    const firstAnswered = submitQuizAnswer({
      session: createQuizSession([question, secondQuestion]),
      question,
      optionId: "B",
    });
    const secondCurrent = advanceQuizSession(firstAnswered);

    expect(getCurrentQuestionId(secondCurrent)).toBe("Q003");
    expect(secondCurrent.answers).toEqual({ Q002: "B" });
    expect(isQuizComplete(secondCurrent)).toBe(false);
  });

  it("fails closed on forged answer/result state", () => {
    const forged = {
      questionIds: ["Q002"],
      currentIndex: 0,
      answers: { Q002: "B" },
      results: {},
    } satisfies QuizSession;

    expectQuizError(() => getCurrentQuestionId(forged), "invalid_session");
  });
});
