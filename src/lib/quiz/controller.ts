import type { Question } from "../content/question-schema";
import { analyzeWeakness, type WeaknessBand } from "../weakness";
import {
  advanceQuizSession,
  createQuizSession,
  isQuizComplete,
  submitQuizAnswer,
} from "./index";

const FORM_SELECTOR = "[data-quiz-session]";

function requireElement<T extends Element>(
  parent: ParentNode,
  selector: string,
): T {
  const element = parent.querySelector<T>(selector);
  if (!element) throw new Error(`Quiz UI is missing ${selector}`);
  return element;
}

function initializeQuizForm(form: HTMLFormElement): void {
  const questionPayload = form.dataset.question;
  if (!questionPayload) throw new Error("Quiz UI is missing its Question payload");

  const question = JSON.parse(questionPayload) as Question;
  let session = createQuizSession([question]);
  const feedback = requireElement<HTMLElement>(form, "[data-quiz-feedback]");
  const feedbackStatus = requireElement<HTMLElement>(
    feedback,
    "[data-feedback-status]",
  );
  const submitButton = requireElement<HTMLButtonElement>(
    form,
    "[data-quiz-submit]",
  );
  const resultTrigger = requireElement<HTMLButtonElement>(
    form,
    "[data-result-trigger]",
  );
  const resultPanel = requireElement<HTMLElement>(form, "[data-weakness-result]");
  const resultBandLabel = requireElement<HTMLElement>(
    resultPanel,
    "[data-weakness-band-label]",
  );
  const resultMessage = requireElement<HTMLElement>(
    resultPanel,
    "[data-weakness-message]",
  );
  const resultSampleLabel = requireElement<HTMLElement>(
    resultPanel,
    "[data-weakness-sample-label]",
  );

  function getBandCopy(band: WeaknessBand): {
    label: string;
    message: string;
  } {
    if (band === "strong") {
      return {
        label: form.dataset.strongResultLabel ?? "Correct this time",
        message: form.dataset.strongResultMessage ?? "",
      };
    }
    if (band === "review") {
      return {
        label: form.dataset.reviewResultLabel ?? "Review recommended",
        message: form.dataset.reviewResultMessage ?? "",
      };
    }
    return {
      label: form.dataset.priorityReviewResultLabel ?? "Priority review",
      message: form.dataset.priorityReviewResultMessage ?? "",
    };
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const selectedOption = new FormData(form).get(question.id);
    if (typeof selectedOption !== "string") return;

    session = submitQuizAnswer({
      session,
      question,
      optionId: selectedOption,
    });
    const isCorrect = session.results[question.id];
    if (typeof isCorrect !== "boolean") {
      throw new Error(`Quiz result for ${question.id} was not recorded`);
    }

    form.dataset.result = isCorrect ? "correct" : "incorrect";
    feedbackStatus.textContent = isCorrect
      ? form.dataset.correctLabel ?? "Correct"
      : form.dataset.incorrectLabel ?? "Incorrect";

    for (const option of form.querySelectorAll<HTMLElement>("[data-option-id]")) {
      const optionId = option.dataset.optionId;
      if (optionId === selectedOption) option.dataset.selected = "true";
      if (optionId === question.answer) option.dataset.correct = "true";
    }
    for (const input of form.querySelectorAll<HTMLInputElement>(
      "input[type='radio']",
    )) {
      input.disabled = true;
    }

    submitButton.disabled = true;
    feedback.hidden = false;
    resultTrigger.hidden = false;
    feedback.focus({ preventScroll: true });
  });

  resultTrigger.addEventListener(
    "click",
    () => {
      session = advanceQuizSession(session);
      if (!isQuizComplete(session)) {
        throw new Error("The one-Question review session did not complete");
      }

      const weaknessResults = analyzeWeakness({
        session,
        questions: [question],
      });
      const weakness = weaknessResults[0];
      if (
        weaknessResults.length !== 1 ||
        !weakness ||
        weakness.tag !== form.dataset.expectedWeaknessTag
      ) {
        throw new Error(`Unexpected weakness result for ${question.id}`);
      }

      const resultCopy = getBandCopy(weakness.band);
      form.dataset.sessionState = "complete";
      resultPanel.dataset.weaknessTag = weakness.tag;
      resultPanel.dataset.weaknessBand = weakness.band;
      resultPanel.dataset.weaknessSample = weakness.sample;
      resultBandLabel.textContent = resultCopy.label;
      resultMessage.textContent = resultCopy.message;
      resultSampleLabel.textContent =
        weakness.sample === "limited"
          ? form.dataset.limitedSampleLabel ?? "Limited sample"
          : form.dataset.sufficientSampleLabel ?? "Multiple answers";

      resultTrigger.disabled = true;
      resultTrigger.hidden = true;
      resultPanel.hidden = false;
      resultPanel.focus({ preventScroll: true });
    },
    { once: true },
  );
}

export function initializeQuizSessions(root: ParentNode = document): void {
  for (const form of root.querySelectorAll<HTMLFormElement>(FORM_SELECTOR)) {
    initializeQuizForm(form);
  }
}
