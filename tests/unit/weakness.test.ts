import { describe, expect, it } from "vitest";

import { getQuestionById } from "../../src/lib/content/catalog";
import type { Question } from "../../src/lib/content/question-schema";
import {
  advanceQuizSession,
  createQuizSession,
  submitQuizAnswer,
  type QuizSession,
} from "../../src/lib/quiz";
import {
  analyzeWeakness,
  WeaknessAnalysisError,
  type WeaknessAnalysisErrorCode,
  type WeaknessTag,
} from "../../src/lib/weakness";

const baseQuestion = getQuestionById("Q002");

function makeQuestion(
  number: number,
  tags: readonly WeaknessTag[] = ["signals"],
): Question {
  return {
    ...baseQuestion,
    id: `Q${String(number).padStart(3, "0")}`,
    tags: [...tags],
  };
}

function answerQuestions(
  questions: readonly Question[],
  correctness: readonly boolean[],
): QuizSession {
  let session = createQuizSession(questions);
  for (const [index, isCorrect] of correctness.entries()) {
    const question = questions[index];
    const incorrectOption = question.options.find(
      (option) => option.id !== question.answer,
    );
    if (!incorrectOption) throw new Error(`${question.id} needs an incorrect option`);

    session = submitQuizAnswer({
      session,
      question,
      optionId: isCorrect ? question.answer : incorrectOption.id,
    });
    if (index < correctness.length - 1) {
      session = advanceQuizSession(session);
    }
  }
  return session;
}

function expectWeaknessError(
  action: () => unknown,
  code: WeaknessAnalysisErrorCode,
): void {
  try {
    action();
    throw new Error(`Expected WeaknessAnalysisError ${code}`);
  } catch (error) {
    expect(error).toBeInstanceOf(WeaknessAnalysisError);
    expect((error as WeaknessAnalysisError).code).toBe(code);
  }
}

describe("weakness aggregation", () => {
  it("returns no result before any Question is answered", () => {
    const results = analyzeWeakness({
      session: createQuizSession([baseQuestion]),
      questions: [baseQuestion],
    });

    expect(results).toEqual([]);
    expect(Object.isFrozen(results)).toBe(true);
  });

  it("classifies one correct and incorrect signal answer with limited samples", () => {
    const correct = analyzeWeakness({
      session: answerQuestions([baseQuestion], [true]),
      questions: [baseQuestion],
    });
    const incorrect = analyzeWeakness({
      session: answerQuestions([baseQuestion], [false]),
      questions: [baseQuestion],
    });

    expect(correct).toEqual([
      {
        tag: "signals",
        correctCount: 1,
        answeredCount: 1,
        ratio: 1,
        band: "strong",
        sample: "limited",
      },
    ]);
    expect(incorrect).toEqual([
      {
        tag: "signals",
        correctCount: 0,
        answeredCount: 1,
        ratio: 0,
        band: "priority_review",
        sample: "limited",
      },
    ]);
    expect(Object.isFrozen(correct[0])).toBe(true);
  });

  it("applies the 0.80 and 0.60 boundaries exactly", () => {
    const questions = [2, 3, 4, 5, 6].map((number) => makeQuestion(number));
    const analyze = (correctness: readonly boolean[]) =>
      analyzeWeakness({
        session: answerQuestions(questions, correctness),
        questions,
      })[0];

    expect(analyze([true, true, true, true, false])).toMatchObject({
      ratio: 0.8,
      band: "strong",
      sample: "sufficient",
    });
    expect(analyze([true, true, true, false, false])).toMatchObject({
      ratio: 0.6,
      band: "review",
      sample: "sufficient",
    });
    expect(analyze([true, true, false, false, false])).toMatchObject({
      ratio: 0.4,
      band: "priority_review",
      sample: "sufficient",
    });
  });

  it("excludes unanswered Questions from the denominator", () => {
    const questions = [makeQuestion(2), makeQuestion(3)];
    const results = analyzeWeakness({
      session: answerQuestions(questions, [true]),
      questions,
    });

    expect(results[0]).toMatchObject({
      tag: "signals",
      correctCount: 1,
      answeredCount: 1,
      ratio: 1,
      sample: "limited",
    });
  });

  it("counts multi-tag Questions once per tag in canonical category order", () => {
    const questions = [
      makeQuestion(2, ["emergency", "signals"]),
      makeQuestion(3, ["pedestrians"]),
    ];
    const results = analyzeWeakness({
      session: answerQuestions(questions, [true, false]),
      questions,
    });

    expect(results.map((result) => result.tag)).toEqual([
      "signals",
      "pedestrians",
      "emergency",
    ]);
    expect(results).toMatchObject([
      { tag: "signals", correctCount: 1, answeredCount: 1 },
      { tag: "pedestrians", correctCount: 0, answeredCount: 1 },
      { tag: "emergency", correctCount: 1, answeredCount: 1 },
    ]);
  });
});

describe("weakness input gates", () => {
  it("rejects duplicate and missing Question records", () => {
    const session = createQuizSession([baseQuestion]);
    expectWeaknessError(
      () => analyzeWeakness({ session, questions: [baseQuestion, baseQuestion] }),
      "duplicate_question",
    );
    expectWeaknessError(
      () => analyzeWeakness({ session, questions: [] }),
      "missing_question",
    );
  });

  it("rejects unapproved Question records and invalid tag data", () => {
    const session = createQuizSession([baseQuestion]);
    expectWeaknessError(
      () =>
        analyzeWeakness({
          session,
          questions: [{ ...baseQuestion, reviewStatus: "needs_review" }],
        }),
      "unapproved_question",
    );
    expectWeaknessError(
      () =>
        analyzeWeakness({
          session,
          questions: [
            { ...baseQuestion, tags: ["signals", "signals"] } as Question,
          ],
        }),
      "invalid_question_tags",
    );
  });
});
