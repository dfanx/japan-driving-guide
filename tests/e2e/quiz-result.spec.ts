import { expect, test } from "@playwright/test";

test("@f014 zh-TW incorrect answer produces a limited priority review result", async ({
  page,
}) => {
  await page.goto("/zh-TW/learn/signals/");

  const result = page.locator("[data-weakness-result]");
  const resultTrigger = page.getByRole("button", { name: "看複習建議" });
  await expect(result).toBeHidden();
  await expect(resultTrigger).toBeHidden();

  await page.locator("[data-option-id='A']").click();
  await page.getByRole("button", { name: "確認答案" }).click();
  await expect(page.locator("[data-quiz-feedback]")).toBeFocused();
  await expect(resultTrigger).toBeVisible();
  await expect(result).toBeHidden();

  await resultTrigger.click();
  await expect(page.locator("[data-quiz-session]")).toHaveAttribute(
    "data-session-state",
    "complete",
  );
  await expect(result).toBeVisible();
  await expect(result).toBeFocused();
  await expect(result).toHaveAttribute("data-weakness-tag", "signals");
  await expect(result).toHaveAttribute(
    "data-weakness-band",
    "priority_review",
  );
  await expect(result).toHaveAttribute("data-weakness-sample", "limited");
  await expect(result).toContainText("號誌");
  await expect(result).toContainText("建議優先複習");
  await expect(result).toContainText("只看 1 題，還不能代表完全熟悉");
  await expect(result).not.toContainText("0%");

  const reviewLink = page.getByRole("link", { name: "重看號誌課" });
  await expect(reviewLink).toHaveAttribute(
    "href",
    "/zh-TW/learn/signals/#M02-signals",
  );
  await reviewLink.click();
  await expect(page).toHaveURL(/\/zh-TW\/learn\/signals\/#M02-signals$/);
  await expect(page.locator("#M02-signals")).toBeVisible();
});

test("@f014 en correct answer remains limited and does not claim mastery", async ({
  page,
}) => {
  await page.goto("/en/learn/signals/");

  await page.locator("[data-option-id='B']").click();
  await page.getByRole("button", { name: "Check answer" }).click();
  await page.getByRole("button", { name: "View review result" }).click();

  const result = page.locator("[data-weakness-result]");
  await expect(result).toBeVisible();
  await expect(result).toBeFocused();
  await expect(result).toHaveAttribute("data-weakness-tag", "signals");
  await expect(result).toHaveAttribute("data-weakness-band", "strong");
  await expect(result).toHaveAttribute("data-weakness-sample", "limited");
  await expect(result).toContainText("Signals");
  await expect(result).toContainText("Correct this time");
  await expect(result).toContainText(
    "One question is not enough to confirm mastery",
  );
  await expect(result).toContainText(
    "Limited sample · based on 1 answered question",
  );
  await expect(result).not.toContainText("100%");
  await expect(page.getByRole("link", { name: "Review the Signals lesson" })).toHaveAttribute(
    "href",
    "/en/learn/signals/#M02-signals",
  );
});

test("@f014 360px result actions remain readable touch targets", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/zh-TW/learn/signals/");

  await page.locator("[data-option-id='A']").click();
  await page.getByRole("button", { name: "確認答案" }).click();
  const resultTrigger = page.getByRole("button", { name: "看複習建議" });
  expect((await resultTrigger.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  await resultTrigger.click();

  const reviewLink = page.getByRole("link", { name: "重看號誌課" });
  expect((await reviewLink.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  const widths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(widths.content).toBe(widths.viewport);
});
