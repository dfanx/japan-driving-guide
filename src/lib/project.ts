export const projectSummary = {
  name: "Japan Driving Guide",
  audience: "Overseas visitors driving in Japan",
  locales: ["zh-TW", "en"],
} as const;

export function hasRequiredLocales(locales: readonly string[]): boolean {
  return locales.includes("zh-TW") && locales.includes("en");
}

