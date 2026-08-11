import type { Question } from "../lib/content/question-schema";
import {
  advanceQuizSession,
  createQuizSession,
  isQuizComplete,
  submitQuizAnswer,
} from "../lib/quiz";
import { analyzeWeakness } from "../lib/weakness";

type ReviewCopy = {
  question: string;
  answered: string;
  submit: string;
  next: string;
  result: string;
  correct: string;
  incorrect: string;
  strong: string;
  review: string;
  priority: string;
  topicStrong: string;
  topicReview: string;
  topicPriority: string;
  reviewLesson: string;
};

document.querySelectorAll<HTMLElement>("[data-full-review]").forEach((root) => {
  const questions = JSON.parse(root.dataset.questions ?? "[]") as Question[];
  const categoryMeta = JSON.parse(root.dataset.categoryMeta ?? "{}") as {
    labels: Record<string, string>;
    links: Record<string, string>;
  };
  const copy = JSON.parse(root.dataset.copy ?? "{}") as ReviewCopy;
  const form = root.querySelector<HTMLFormElement>("[data-review-form]");
  const panels = [...root.querySelectorAll<HTMLFieldSetElement>("[data-review-question]")];
  const previousButton = root.querySelector<HTMLButtonElement>("[data-review-previous]");
  const submitButton = root.querySelector<HTMLButtonElement>("[data-review-submit]");
  const nextButton = root.querySelector<HTMLButtonElement>("[data-review-next]");
  const result = root.querySelector<HTMLElement>("[data-review-result]");
  const progress = root.querySelector<HTMLProgressElement>("[data-review-progress]");
  const progressLabel = root.querySelector<HTMLElement>("[data-progress-label]");
  const answeredCount = root.querySelector<HTMLElement>("[data-answered-count]");
  const score = root.querySelector<HTMLElement>("[data-review-score]");
  const headline = root.querySelector<HTMLElement>("[data-review-headline]");
  const breakdown = root.querySelector<HTMLOListElement>("[data-review-breakdown]");
  const restartButton = root.querySelector<HTMLButtonElement>("[data-review-restart]");
  if (!form || !previousButton || !submitButton || !nextButton || !result || !progress || !progressLabel || !answeredCount || !score || !headline || !breakdown || !restartButton) return;

  let session = createQuizSession(questions);
  let displayIndex = 0;

  const renderQuestion = (focus = false) => {
    const answerTotal = Object.keys(session.answers).length;
    panels.forEach((panel, index) => {
      panel.hidden = index !== displayIndex;
      if (index !== displayIndex) return;
      const question = questions[index];
      const selectedId = session.answers[question.id];
      const answered = selectedId !== undefined;
      panel.querySelectorAll<HTMLInputElement>("input[type='radio']").forEach((input) => {
        input.checked = input.value === selectedId;
        input.disabled = answered || displayIndex < session.currentIndex;
      });
      panel.querySelectorAll<HTMLElement>(".checkpoint-option").forEach((option) => {
        option.dataset.correct = answered && option.dataset.optionId === question.answer ? "true" : "false";
        option.dataset.selected = answered && option.dataset.optionId === selectedId ? "true" : "false";
      });
      const feedback = panel.querySelector<HTMLElement>("[data-review-feedback]");
      const feedbackStatus = panel.querySelector<HTMLElement>("[data-review-feedback-status]");
      if (feedback && feedbackStatus) {
        feedback.hidden = !answered;
        feedbackStatus.textContent = answered ? (session.results[question.id] ? copy.correct : copy.incorrect) : "";
        panel.dataset.result = answered ? (session.results[question.id] ? "correct" : "incorrect") : "";
      }
      if (focus) panel.querySelector<HTMLElement>("legend")?.focus();
    });
    progressLabel.textContent = `${copy.question} ${displayIndex + 1} / ${questions.length}`;
    answeredCount.textContent = String(answerTotal);
    progress.value = answerTotal;
    previousButton.disabled = displayIndex === 0;
    const currentAnswered = session.answers[questions[displayIndex].id] !== undefined;
    submitButton.hidden = currentAnswered || displayIndex < session.currentIndex;
    nextButton.hidden = !currentAnswered;
    nextButton.textContent = displayIndex === questions.length - 1 && displayIndex === session.currentIndex
      ? copy.result
      : `${copy.next} →`;
  };

  const renderResult = () => {
    form.hidden = true;
    result.hidden = false;
    const correctTotal = Object.values(session.results).filter(Boolean).length;
    const ratio = correctTotal / questions.length;
    score.textContent = `${correctTotal} / ${questions.length}`;
    headline.textContent = ratio >= 0.8 ? copy.strong : ratio >= 0.6 ? copy.review : copy.priority;
    breakdown.replaceChildren();
    for (const item of analyzeWeakness({ session, questions })) {
      const row = document.createElement("li");
      const label = document.createElement("strong");
      label.textContent = categoryMeta.labels[item.tag] ?? item.tag;
      const value = document.createElement("span");
      const bandLabel = item.band === "strong" ? copy.topicStrong : item.band === "review" ? copy.topicReview : copy.topicPriority;
      value.textContent = `${item.correctCount} / ${item.answeredCount} · ${bandLabel}`;
      const link = document.createElement("a");
      link.href = categoryMeta.links[item.tag] ?? "#";
      link.textContent = copy.reviewLesson;
      row.append(label, value, link);
      breakdown.append(row);
    }
    result.focus();
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = questions[displayIndex];
    if (displayIndex !== session.currentIndex) return;
    const selected = panels[displayIndex].querySelector<HTMLInputElement>("input[type='radio']:checked");
    if (!selected) {
      panels[displayIndex].querySelector<HTMLInputElement>("input[type='radio']")?.focus();
      return;
    }
    session = submitQuizAnswer({ session, question, optionId: selected.value });
    renderQuestion();
    panels[displayIndex].querySelector<HTMLElement>("[data-review-feedback]")?.focus();
  });

  previousButton.addEventListener("click", () => {
    if (displayIndex === 0) return;
    displayIndex -= 1;
    renderQuestion(true);
  });

  nextButton.addEventListener("click", () => {
    if (displayIndex < session.currentIndex) {
      displayIndex += 1;
      renderQuestion(true);
      return;
    }
    session = advanceQuizSession(session);
    if (isQuizComplete(session)) {
      renderResult();
      return;
    }
    displayIndex = session.currentIndex;
    renderQuestion(true);
  });

  restartButton.addEventListener("click", () => {
    session = createQuizSession(questions);
    displayIndex = 0;
    result.hidden = true;
    form.hidden = false;
    panels.forEach((panel) => {
      panel.dataset.result = "";
      panel.querySelectorAll<HTMLInputElement>("input").forEach((input) => {
        input.checked = false;
        input.disabled = false;
      });
      panel.querySelector<HTMLElement>("[data-review-feedback]")?.setAttribute("hidden", "");
    });
    renderQuestion(true);
  });

  renderQuestion();
});
