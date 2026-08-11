import { readdir, readFile } from "node:fs/promises";
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

import {
  diagramSceneSchema,
  validateDiagramScenes,
} from "../tools/diagram-generator/src/schema";
import { validateLessonDocuments } from "../src/lib/content/lesson-schema";
import { validateQuestionData } from "../src/lib/content/question-schema";
import { ruleSchema, validateContentData } from "../src/lib/content/schema";
import {
  resolveContentAsOfDate,
  summarizeRuleEffectivity,
} from "../src/lib/effective-date";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, "..");
const sourceFile = resolve(projectRoot, "src/data/sources/sources.json");
const rulesDirectory = resolve(projectRoot, "src/data/rules");
const questionsDirectory = resolve(projectRoot, "src/data/questions");
const lessonsDirectory = resolve(projectRoot, "src/content/lessons");
const scenesDirectory = resolve(projectRoot, "tools/diagram-generator/scenes");

async function readJson(path: string): Promise<unknown> {
  const content = await readFile(path, "utf8");
  return JSON.parse(content) as unknown;
}

async function listMarkdownFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) return listMarkdownFiles(path);
      return entry.isFile() && entry.name.endsWith(".md") ? [path] : [];
    }),
  );

  return paths.flat().sort();
}

async function readLesson(path: string): Promise<unknown> {
  const markdown = await readFile(path, "utf8");
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(markdown);

  if (!match) {
    throw new Error(`Lesson frontmatter block is missing or malformed: ${path}`);
  }

  return {
    filePath: relative(lessonsDirectory, path).split(sep).join("/"),
    frontmatter: parseYaml(match[1]) as unknown,
    body: match[2].trim(),
  };
}

async function main(): Promise<void> {
  const sources = await readJson(sourceFile);
  const ruleFiles = (await readdir(rulesDirectory))
    .filter((name) => name.endsWith(".json"))
    .sort();
  const ruleRecords = await Promise.all(
    ruleFiles.map((name) => readJson(resolve(rulesDirectory, name))),
  );
  const rules = ruleRecords.flatMap((record) =>
    Array.isArray(record) ? record : [record],
  );
  const questionFiles = (await readdir(questionsDirectory))
    .filter((name) => name.endsWith(".json"))
    .sort();
  const questionRecords = await Promise.all(
    questionFiles.map((name) => readJson(resolve(questionsDirectory, name))),
  );
  const questions = questionRecords.flatMap((record) =>
    Array.isArray(record) ? record : [record],
  );
  const sceneFiles = (await readdir(scenesDirectory))
    .filter((name) => name.endsWith(".json"))
    .sort();
  const sceneRecords = await Promise.all(
    sceneFiles.map((name) => readJson(resolve(scenesDirectory, name))),
  );
  const scenes = sceneRecords.flatMap((record) =>
    Array.isArray(record) ? record : [record],
  );
  const lessonFiles = await listMarkdownFiles(lessonsDirectory);
  const lessons = await Promise.all(lessonFiles.map(readLesson));
  const issues = validateContentData({ sources, rules });

  const ruleResult = ruleSchema.array().safeParse(rules);
  if (ruleResult.success) {
    issues.push(...validateDiagramScenes({ scenes, rules: ruleResult.data }));
    const sceneResult = diagramSceneSchema.array().safeParse(scenes);
    issues.push(
      ...validateLessonDocuments({ documents: lessons, rules: ruleResult.data }),
    );
    issues.push(
      ...validateQuestionData({
        questions,
        rules: ruleResult.data,
        diagramIds: sceneResult.success
          ? sceneResult.data.map((scene) => scene.id)
          : undefined,
      }),
    );
  }

  if (issues.length > 0) {
    console.error(`Content validation failed with ${issues.length} issue(s):`);
    for (const issue of issues) {
      console.error(`- [${issue.code}] ${issue.path}: ${issue.message}`);
    }
    process.exitCode = 1;
    return;
  }

  const sourceCount = Array.isArray(sources) ? sources.length : 0;
  const validatedRules = rules.map((rule) => ruleSchema.parse(rule));
  const asOfDate = resolveContentAsOfDate();
  const effectivity = summarizeRuleEffectivity(validatedRules, asOfDate);

  console.log(`Content effective date: ${asOfDate}`);
  console.log(
    `Rule status: ${effectivity.active} active, ${effectivity.upcoming} upcoming, ${effectivity.expired} expired`,
  );
  console.log(
    `Content validation PASS: ${sourceCount} source(s), ${rules.length} rule(s), ${lessons.length} lesson document(s), ${questions.length} question(s), ${scenes.length} diagram scene(s)`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Content validation could not run: ${message}`);
  process.exitCode = 1;
});
