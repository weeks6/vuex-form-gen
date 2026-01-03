import { defineConfig } from "vite";
// @ts-ignore
import sass from "vite-plugin-sass";
import vue from "@vitejs/plugin-vue";
// https://vite.dev/config/
export default defineConfig({
  plugins: [sass(), vue()],
});
