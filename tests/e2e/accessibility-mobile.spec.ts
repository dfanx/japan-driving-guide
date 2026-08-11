import { expect, test } from "@playwright/test";

const slugs = [
  "eligibility",
  "left-side-driving",
  "signals",
  "stop-signs",
  "intersections",
  "pedestrians",
  "cyclists",
  "speed",
  "rail-crossings",
  "signs",
  "parking",
  "expressways",
  "fuel",
  "weather",
  "emergency",
  "safety-basics",
] as const;

const localizedRoutes = ["", "fast-track/", "learn/", "sources/", ...slugs.map((slug) => `learn/${slug}/`)];
const allRoutes = ["/", ...["zh-TW", "en"].flatMap((locale) => localizedRoutes.map((route) => `/${locale}/${route}`))];

test("@f023 every static page has a sound mobile document structure", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });

  for (const route of allRoutes) {
    await page.goto(route);
    const audit = await page.evaluate(() => {
      const ids = [...document.querySelectorAll<HTMLElement>("[id]")].map((element) => element.id);
      const headings = [...document.querySelectorAll<HTMLElement>("h1,h2,h3,h4,h5,h6")].map((heading) => Number(heading.tagName.slice(1)));
      const headingJumps = headings.slice(1).filter((level, index) => level > headings[index] + 1);
      return {
        lang: document.documentElement.lang,
        h1Count: document.querySelectorAll("h1").length,
        hasMain: Boolean(document.querySelector("main#main-content")),
        hasFooter: Boolean(document.querySelector("footer")),
        duplicateIds: ids.filter((id, index) => ids.indexOf(id) !== index),
        headingJumps,
        missingAlt: [...document.images].filter((image) => !image.hasAttribute("alt")).length,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      };
    });

    expect(audit.lang, route).toBe(route.startsWith("/zh-TW/") ? "zh-TW" : "en");
    expect(audit.h1Count, route).toBe(1);
    expect(audit.hasMain, route).toBe(true);
    expect(audit.hasFooter, route).toBe(true);
    expect(audit.duplicateIds, route).toEqual([]);
    expect(audit.headingJumps, route).toEqual([]);
    expect(audit.missingAlt, route).toBe(0);
    expect(audit.scrollWidth, route).toBe(audit.clientWidth);
  }
});

for (const viewport of [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
]) {
  test(`@f023 representative pages fit ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const route of ["/", "/zh-TW/", "/en/learn/", "/zh-TW/learn/signals/", "/en/learn/signs/", "/zh-TW/sources/"]) {
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth), route).toBe(viewport.width);
    }
  });
}

test("@f023 skip navigation and lesson checkpoint work from the keyboard", async ({ page }) => {
  await page.goto("/en/learn/signals/");
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Skip to main content" });
  await expect(skipLink).toBeFocused();
  expect(await skipLink.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe("none");
  await page.keyboard.press("Enter");
  await expect(page.locator("main#main-content")).toBeFocused();

  const firstChoice = page.locator(".checkpoint-option__input").first();
  await firstChoice.focus();
  await page.keyboard.press("Space");
  await page.getByRole("button", { name: /check answer/i }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".checkpoint-feedback__status")).toContainText(/correct|not quite/i);
  await expect(page.locator(".checkpoint-feedback__explanation")).not.toBeEmpty();
});

test("@f023 critical controls meet the 44px touch-target baseline", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  for (const route of ["/", "/en/", "/en/learn/", "/en/learn/signals/", "/en/learn/signs/", "/en/sources/"]) {
    await page.goto(route);
    const undersized = await page.locator("a, button, summary, label.checkpoint-option").evaluateAll((elements) =>
      elements.filter((element) => {
        const rect = element.getBoundingClientRect();
        const visible = rect.width > 0 && rect.height > 0 && getComputedStyle(element).visibility !== "hidden";
        return visible && rect.height < 44;
      }).map((element) => ({
        tag: element.tagName,
        className: element.className,
        text: element.textContent?.trim().slice(0, 60),
        height: element.getBoundingClientRect().height,
      })),
    );
    expect(undersized, route).toEqual([]);
  }
});

test("@f023 reduced-motion preference suppresses interaction transitions", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4321/en/learn/signals/");
  const transitionSeconds = await page.locator(".checkpoint-option").first().evaluate((element) => Number.parseFloat(getComputedStyle(element).transitionDuration));
  expect(transitionSeconds).toBeLessThanOrEqual(0.00001);
  await context.close();
});
