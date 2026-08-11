import { expect, test } from "@playwright/test";

test("@f012 @f030 zh-TW review locks an incorrect answer and explains it", async ({ page }) => {
  await page.goto("/zh-TW/review/");

  const panel = page.locator('[data-question-id="Q001"]');
  const feedback = panel.locator("[data-review-feedback]");
  await expect(feedback).toBeHidden();

  await panel.locator('[data-option-id="A"]').click();
  await expect(panel.getByRole("radio", { name: "右側", exact: true })).toBeChecked();
  await page.getByRole("button", { name: "確認這題" }).click();

  await expect(panel).toHaveAttribute("data-result", "incorrect");
  await expect(feedback).toBeVisible();
  await expect(feedback).toBeFocused();
  await expect(feedback).toContainText("這題要再想一下");
  await expect(feedback).toContainText("日本車輛靠左行駛");
  await expect(panel.locator('[data-option-id="A"]')).toHaveAttribute("data-selected", "true");
  await expect(panel.locator('[data-option-id="B"]')).toHaveAttribute("data-correct", "true");
  await expect(panel.getByRole("radio").first()).toBeDisabled();
  await expect(panel.getByRole("radio").last()).toBeDisabled();
  await expect(page.getByRole("button", { name: "下一題" })).toBeVisible();
});

test("@f012 @f030 en review locks a correct answer and explains it", async ({ page }) => {
  await page.goto("/en/review/");

  const panel = page.locator('[data-question-id="Q001"]');
  await panel.locator('[data-option-id="B"]').click();
  await expect(panel.getByRole("radio", { name: "Left", exact: true })).toBeChecked();
  await page.getByRole("button", { name: "Check this answer" }).click();

  const feedback = panel.locator("[data-review-feedback]");
  await expect(panel).toHaveAttribute("data-result", "correct");
  await expect(feedback).toBeVisible();
  await expect(feedback).toBeFocused();
  await expect(feedback).toContainText("Correct");
  await expect(feedback).toContainText("Vehicles drive on the left in Japan");
  await expect(panel.locator('[data-option-id="B"]')).toHaveAttribute("data-selected", "true");
  await expect(panel.locator('[data-option-id="B"]')).toHaveAttribute("data-correct", "true");
  await expect(panel.getByRole("radio").first()).toBeDisabled();
  await expect(panel.getByRole("radio").last()).toBeDisabled();
});

test("@f012 @f030 mobile review controls keep a 44px touch target", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/zh-TW/review/");

  const sizes = await page.locator("[data-review-question]:visible .checkpoint-option, [data-review-submit]:visible").evaluateAll(
    (elements) => elements.map((element) => element.getBoundingClientRect().height),
  );
  expect(sizes).not.toHaveLength(0);
  for (const height of sizes) expect(height).toBeGreaterThanOrEqual(44);
});
