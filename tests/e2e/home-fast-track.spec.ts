import { expect, test } from "@playwright/test";

const localeCases = [
  {
    locale: "zh-TW",
    home: "/zh-TW/",
    fastTrack: "/zh-TW/fast-track/",
    alternateHome: "/en/",
    alternateFastTrack: "/en/fast-track/",
    homeHeading: "日本自駕別靠運氣，取車前先看懂這 10 件事",
    startLabel: "先看 10 分鐘重點",
    fastTrackHeading: "快速必學",
    lessonLabel: "看完整課程",
    lessonHref: "/zh-TW/learn/signals/",
    parkingHref: "/zh-TW/learn/parking/",
  },
  {
    locale: "en",
    home: "/en/",
    fastTrack: "/en/fast-track/",
    alternateHome: "/zh-TW/",
    alternateFastTrack: "/zh-TW/fast-track/",
    homeHeading: "Ten things to know before driving in Japan",
    startLabel: "Start the 10-minute check",
    fastTrackHeading: "Fast Track",
    lessonLabel: "Open lesson",
    lessonHref: "/en/learn/signals/",
    parkingHref: "/en/learn/parking/",
  },
] as const;

for (const localeCase of localeCases) {
  test(`@f007 ${localeCase.locale} home and Fast Track preserve parity`, async ({
    page,
  }) => {
    await page.goto(localeCase.home);
    await expect(page.locator("html")).toHaveAttribute("lang", localeCase.locale);
    await expect(
      page.getByRole("heading", { level: 1, name: localeCase.homeHeading }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: localeCase.startLabel })).toHaveAttribute(
      "href",
      localeCase.fastTrack,
    );
    await expect(page.locator(".locale-status a").filter({ hasText: localeCase.locale === "en" ? "中" : "EN" })).toHaveAttribute(
      "href",
      localeCase.alternateHome,
    );

    await page.goto(localeCase.fastTrack);
    await expect(
      page.getByRole("heading", { level: 1, name: localeCase.fastTrackHeading }),
    ).toBeVisible();
    const items = page.locator("[data-fast-track-items] > li");
    await expect(items).toHaveCount(10);
    await expect(items.nth(2).getByRole("link", { name: localeCase.lessonLabel })).toHaveAttribute(
      "href",
      localeCase.lessonHref,
    );
    await expect(items.nth(6).getByRole("link", { name: localeCase.lessonLabel })).toHaveAttribute(
      "href",
      localeCase.parkingHref,
    );
    await expect(page.locator(".locale-status a").filter({ hasText: localeCase.locale === "en" ? "中" : "EN" })).toHaveAttribute(
      "href",
      localeCase.alternateFastTrack,
    );
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
  await expect(page.getByRole("link", { name: "做 24 題總複習" })).toHaveAttribute("href", "/zh-TW/review/");
  const heights = await actions.evaluateAll((elements) =>
    elements.map((element) => element.getBoundingClientRect().height),
  );
  for (const height of heights) expect(height).toBeGreaterThanOrEqual(44);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBe(360);
});
