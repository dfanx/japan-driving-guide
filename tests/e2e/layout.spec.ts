import { expect, test } from "@playwright/test";

const viewports = [
  { name: "mobile", width: 360, height: 800, columns: 1 },
  { name: "desktop", width: 1440, height: 1000, columns: 2 },
] as const;

for (const viewport of viewports) {
  test(`@f006 ${viewport.name} shell fits ${viewport.width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const shell = page.getByTestId("learning-shell");
    await expect(page.getByTestId("app-header")).toBeVisible();
    await expect(shell).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("complementary")).toBeVisible();

    const layout = await page.evaluate(() => {
      const shellElement = document.querySelector<HTMLElement>(
        "[data-testid='learning-shell']",
      );
      if (!shellElement) throw new Error("Learning shell is missing");
      const frameElement = document.querySelector<HTMLElement>(
        "[data-testid='app-frame']",
      );
      const footerElement = document.querySelector<HTMLElement>(".app-footer");
      if (!frameElement || !footerElement) {
        throw new Error("Frame or footer is missing");
      }

      return {
        viewportWidth: document.documentElement.clientWidth,
        contentWidth: document.documentElement.scrollWidth,
        columns: getComputedStyle(shellElement).gridTemplateColumns.split(" ")
          .length,
        footerGap: Math.abs(
          frameElement.getBoundingClientRect().bottom -
            footerElement.getBoundingClientRect().bottom,
        ),
      };
    });

    expect(layout.contentWidth).toBe(layout.viewportWidth);
    expect(layout.columns).toBe(viewport.columns);
    expect(layout.footerGap).toBeLessThanOrEqual(1);

    await page.screenshot({
      path: testInfo.outputPath(`${viewport.name}-${viewport.width}.png`),
      fullPage: true,
    });
  });
}
