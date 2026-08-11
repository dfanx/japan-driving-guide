import questionData from "../../data/questions/seed-questions.json";
import ruleData from "../../data/rules/seed-rules.json";
import sourceData from "../../data/sources/sources.json";
import { questionSchema, type Question } from "./question-schema";
import { ruleSchema, sourceSchema, type Rule, type Source } from "./schema";

export const questionBank: readonly Question[] = Object.freeze(
  questionSchema.array().parse(questionData),
);
export const ruleCatalog: readonly Rule[] = Object.freeze(
  ruleSchema.array().parse(ruleData),
);
export const sourceCatalog: readonly Source[] = Object.freeze(
  sourceSchema.array().parse(sourceData),
);

function requireById<T extends { id: string }>(
  collection: readonly T[],
  id: string,
  kind: string,
): T {
  const item = collection.find((candidate) => candidate.id === id);
  if (!item) throw new Error(`${kind} ${id} is missing from the approved catalog`);
  return item;
}

export function getQuestionById(id: string): Question {
  return requireById(questionBank, id, "Question");
}

export function getRuleById(id: string): Rule {
  return requireById(ruleCatalog, id, "Rule");
}

export function getSourceById(id: string): Source {
  return requireById(sourceCatalog, id, "Source");
}
