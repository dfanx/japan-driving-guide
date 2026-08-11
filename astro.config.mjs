import { defineConfig } from "astro/config";

const rawBase = process.env.SITE_BASE_PATH?.trim() || "/";
const base = `/${rawBase.replace(/^\/+|\/+$/g, "")}/`.replace(/^\/\/$/, "/");

export default defineConfig({
  output: "static",
  base,
});
