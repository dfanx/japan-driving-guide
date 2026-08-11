import { expect, test, type Page } from "@playwright/test";

async function completeReview(page: Page, answerCorrectly: boolean): Promise<void> {
  const questions = await page.locator("[data-full-review]").evaluate((element) =>
    JSON.parse((element as HTMLElement).dataset.questions ?? "[]") as Array<{
      answer: string;
      options: Array<{ id: string }>;
    }>,
  );
  expect(questions).toHaveLength(24);

  for (const [index, question] of questions.entries()) {
    const optionId = answerCorrectly
      ? question.answer
      : question.options.find((option) => option.id !== question.answer)?.id;
    if (!optionId) throw new Error(`Question ${index + 1} has no alternate answer`);
    const panel = page.locator("[data-review-question]:visible");
    await panel.locator(`[data-option-id="${optionId}"]`).click();
    await page.locator("[data-review-submit]").click();
    await expect(panel.locator("[data-review-feedback]")).toBeVisible();
    await page.locator("[data-review-next]").click();
  }
}

test("@f014 @f030 zh-TW completes all 24 questions and points to weak lessons", async ({ page }) => {
  await page.goto("/zh-TW/review/");
  await expect(page.locator("[data-review-result]")).toBeHidden();

  await completeReview(page, false);

  const result = page.locator("[data-review-result]");
  await expect(result).toBeVisible();
  await expect(result).toBeFocused();
  await expect(result).toContainText("0 / 24");
  await expect(result).toContainText("先補強重點，再拿車鑰匙");
  await expect(result).toContainText("號誌");
  await expect(result).toContainText("上路前先複習");
  await expect(result.getByRole("link", { name: "回去看這一課" }).first()).toHaveAttribute("href", /\/zh-TW\/learn\//);
});

test("@f014 @f030 en completes all 24 questions without claiming certification", async ({ page }) => {
  await page.goto("/en/review/");
  await completeReview(page, true);

  const result = page.locator("[data-review-result]");
  await expect(result).toBeVisible();
  await expect(result).toContainText("24 / 24");
  await expect(result).toContainText("Solid first decision-making");
  await expect(result).not.toContainText(/licen[cs]e|guarantee/i);
  await expect(page.getByRole("button", { name: "Try all 24 again" })).toBeVisible();
});

test("@f014 @f030 360px final result stays readable", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/zh-TW/review/");
  await completeReview(page, true);

  expect((await page.getByRole("button", { name: "重新做 24 題" }).boundingBox())?.height).toBeGreaterThanOrEqual(44);
  const widths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(widths.content).toBe(widths.viewport);
});
