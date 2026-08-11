import { expect, test } from "@playwright/test";

test("@f024 first visit installs the complete core guide for offline use", async ({ context, page }) => {
  await page.goto("/en/");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) {
      await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener("controllerchange", () => resolve(), { once: true }));
    }
  });

  const cached = await page.evaluate(async () => {
    const cacheNames = await caches.keys();
    const guideCache = cacheNames.find((name) => name.startsWith("japan-driving-guide-"));
    if (!guideCache) return { count: 0, hasQuiz: false, hasDiagram: false };
    const requests = await (await caches.open(guideCache)).keys();
    return {
      count: requests.length,
      hasQuiz: requests.some((request) => request.url.endsWith("/data/quiz-bank.json")),
      hasDiagram: requests.some((request) => request.url.endsWith("/diagrams/D002.svg")),
    };
  });
  expect(cached.count).toBeGreaterThan(40);
  expect(cached.hasQuiz).toBe(true);
  expect(cached.hasDiagram).toBe(true);

  await context.setOffline(true);
  await page.goto("/en/learn/signals/");
  await expect(page.getByRole("heading", { level: 1, name: "Traffic Lights and Arrows" })).toBeVisible();
  await expect(page.getByTestId("lesson-diagram")).toBeVisible();
  await page.locator("label.checkpoint-option").first().click();
  await page.getByRole("button", { name: /check answer/i }).click();
  await expect(page.locator(".checkpoint-feedback__explanation")).not.toBeEmpty();
});

test("@f024 an uncached offline route uses the honest bilingual fallback", async ({ context, page }) => {
  await page.goto("/");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener("controllerchange", () => resolve(), { once: true }));
  });
  await context.setOffline(true);
  await page.goto("/route-that-does-not-exist/");
  await expect(page.getByRole("heading", { level: 1, name: "This page is not cached yet" })).toBeVisible();
  await expect(page.getByText("外部官方來源頁面仍需網路連線", { exact: false })).toBeVisible();
});
