import { z } from "astro/zod";

import { lessonFrontmatterSchema } from "./lesson-schema";

const markdownModuleSchema = z.object({
  default: z.any(),
  frontmatter: lessonFrontmatterSchema,
});

export function parseLessonMarkdownModule(value: unknown) {
  return markdownModuleSchema.parse(value);
}
