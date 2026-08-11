import astro from "eslint-plugin-astro";

export default [
  {
    ignores: [
      ".astro/**",
      "dist/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
  ...astro.configs["flat/recommended"],
];

