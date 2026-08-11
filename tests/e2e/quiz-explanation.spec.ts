import { expect, test } from "@playwright/test";

test("@f012 zh-TW locks an incorrect answer and shows the approved explanation", async ({
  page,
}) => {
  await page.goto("/zh-TW/learn/signals/");

  const form = page.locator("[data-quiz-session]");
  const feedback = page.locator("[data-quiz-feedback]");
  await expect(feedback).toBeHidden();

  await page.locator("[data-option-id='A']").click();
  await expect(
    page.getByRole("radio", { name: "可以", exact: true }),
  ).toBeChecked();
  await page.getByRole("button", { name: "確認答案" }).click();

  await expect(form).toHaveAttribute("data-result", "incorrect");
  await expect(feedback).toBeVisible();
  await expect(feedback).toBeFocused();
  await expect(feedback).toContainText("答案不正確");
  await expect(feedback).toContainText(
    "紅燈不是自行判斷可轉彎的號誌；只有適用方向的綠色箭頭允許時才可通行。",
  );
  await expect(page.locator("[data-option-id='A']")).toHaveAttribute(
    "data-selected",
    "true",
  );
  await expect(page.locator("[data-option-id='B']")).toHaveAttribute(
    "data-correct",
    "true",
  );
  await expect(page.getByRole("radio").first()).toBeDisabled();
  await expect(page.getByRole("radio").last()).toBeDisabled();
  await expect(page.getByRole("button", { name: "確認答案" })).toBeDisabled();
});

test("@f012 en locks a correct answer and shows the approved explanation", async ({
  page,
}) => {
  await page.goto("/en/learn/signals/");

  const form = page.locator("[data-quiz-session]");
  const feedback = page.locator("[data-quiz-feedback]");
  await page.locator("[data-option-id='B']").click();
  await expect(page.getByRole("radio", { name: "No", exact: true })).toBeChecked();
  await page.getByRole("button", { name: "Check answer" }).click();

  await expect(form).toHaveAttribute("data-result", "correct");
  await expect(feedback).toBeVisible();
  await expect(feedback).toBeFocused();
  await expect(feedback).toContainText("Correct");
  await expect(feedback).toContainText(
    "A red light does not permit a turn based on your own judgment; proceed only when an applicable green arrow allows it.",
  );
  await expect(page.locator("[data-option-id='B']")).toHaveAttribute(
    "data-selected",
    "true",
  );
  await expect(page.locator("[data-option-id='B']")).toHaveAttribute(
    "data-correct",
    "true",
  );
  await expect(page.getByRole("radio").first()).toBeDisabled();
  await expect(page.getByRole("radio").last()).toBeDisabled();
  await expect(page.getByRole("button", { name: "Check answer" })).toBeDisabled();
});

test("@f012 mobile answer controls keep a 44px touch target", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/zh-TW/learn/signals/");

  const sizes = await page.locator(".checkpoint-option, .checkpoint-submit").evaluateAll(
    (elements) => elements.map((element) => element.getBoundingClientRect().height),
  );
  expect(sizes).not.toHaveLength(0);
  for (const height of sizes) expect(height).toBeGreaterThanOrEqual(44);
});
