import { expect, test } from "@playwright/test";

const localeCases = [
  {
    locale: "zh-TW",
    home: "/zh-TW/",
    alternateHome: "/en/",
    homeHeading: "日本自駕別靠運氣，從第 1 課開始看懂",
    startLabel: "開始第 1 課",
    firstLesson: "/zh-TW/learn/eligibility/",
  },
  {
    locale: "en",
    home: "/en/",
    alternateHome: "/zh-TW/",
    homeHeading: "Drive Japan with judgment, not luck",
    startLabel: "Start Lesson 01",
    firstLesson: "/en/learn/eligibility/",
  },
] as const;

for (const localeCase of localeCases) {
  test(`@f007 @f032 ${localeCase.locale} home starts at Lesson 01`, async ({
    page,
  }) => {
    await page.goto(localeCase.home);
    await expect(page.locator("html")).toHaveAttribute("lang", localeCase.locale);
    await expect(
      page.getByRole("heading", { level: 1, name: localeCase.homeHeading }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: localeCase.startLabel })).toHaveAttribute(
      "href",
      localeCase.firstLesson,
    );
    await expect(page.locator(".locale-status a").filter({ hasText: localeCase.locale === "en" ? "中" : "EN" })).toHaveAttribute(
      "href",
      localeCase.alternateHome,
    );

    await expect(page.getByText(/10 分鐘|10-minute/i)).toHaveCount(0);
  });
}

test("@f007 root gateway exposes both locales", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Japan Driving Guide" })).toBeVisible();
  await expect(page.getByRole("link", { name: /繁體中文/ })).toHaveAttribute(
    "href",
    "/zh-TW/",
  );
  await expect(page.getByRole("link", { name: /English/ })).toHaveAttribute(
    "href",
    "/en/",
  );
});

test("@f007 360px home actions fit and retain touch targets", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/zh-TW/");

  const actions = page.locator(".home-actions a");
  await expect(actions).toHaveCount(3);
  await expect(page.getByRole("link", { name: "做 25 題總複習" })).toHaveAttribute("href", "/zh-TW/review/");
  const heights = await actions.evaluateAll((elements) =>
    elements.map((element) => element.getBoundingClientRect().height),
  );
  for (const height of heights) expect(height).toBeGreaterThanOrEqual(44);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBe(360);
});
