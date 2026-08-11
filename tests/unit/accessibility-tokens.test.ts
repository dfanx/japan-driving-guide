import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const cssPath = fileURLToPath(
  new URL("../../src/styles/global.css", import.meta.url),
);
const css = readFileSync(cssPath, "utf8");

function rgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  return [0, 2, 4].map((index) => Number.parseInt(value.slice(index, index + 2), 16)) as [number, number, number];
}

function luminance(hex: string): number {
  const [red, green, blue] = rgb(hex).map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrast(foreground: string, background: string): number {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

describe("F023 accessible presentation tokens", () => {
  it.each([
    ["primary on white", "#315f78", "#ffffff"],
    ["action on white", "#117b82", "#ffffff"],
    ["alert on white", "#c94646", "#ffffff"],
    ["soft text on canvas", "#4f6571", "#f5f9fa"],
    ["muted text on subtle surface", "#5b707b", "#eaf2f5"],
  ])("keeps %s at WCAG AA normal-text contrast", (_name, foreground, background) => {
    expect(contrast(foreground, background)).toBeGreaterThanOrEqual(4.5);
  });

  it("defines visible keyboard focus and reduced-motion fallbacks", () => {
    expect(css).toContain("a:focus-visible");
    expect(css).toContain("outline: 3px solid var(--color-action)");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain("animation-duration: 0.01ms !important");
    expect(css).toContain("transition-duration: 0.01ms !important");
  });
});
