import { expect, test } from "@playwright/test";

test("@f031 speed lesson rejects enforcement myths and shows the redrawn comparison", async ({ page }) => {
  await page.goto("/zh-TW/learn/speed/");
  await expect(page.getByRole("heading", { name: "日本不是「不抓超速」" })).toBeVisible();
  await expect(page.getByText(/固定、半固定與可搬式速度取締設備/)).toBeVisible();
  await expect(page.getByText(/不會變成你的合法超速額度/)).toBeVisible();
  await expect(page.locator('[data-diagram-id="D011"] img[src$="/diagrams/D011.svg"]')).toBeVisible();
  await expect(page.locator("main")).not.toContainText("+30");
  await expect(page.locator("main")).not.toContainText("+40");
});

test("@f031 final review includes the speed-myth decision and the 25-question handoff", async ({ page }) => {
  await page.goto("/zh-TW/review/");
  const review = page.locator("[data-full-review]");
  const questions = JSON.parse((await review.getAttribute("data-questions")) ?? "[]") as Array<{ id: string; answer: string; diagramId?: string }>;
  expect(questions).toHaveLength(25);
  expect(questions.at(-1)).toMatchObject({ id: "Q025", answer: "B", diagramId: "D011" });
  await expect(page.getByText("第 1 / 25")).toBeVisible();
});

test("@f031 intersection lesson integrates early lane choice and guide-strip guidance at mobile width", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/zh-TW/learn/intersections/");
  await expect(page.getByRole("heading", { name: "要轉彎，提早選車道" })).toBeVisible();
  await expect(page.getByText(/導流帶是引導車流，不是多一條車道/)).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
