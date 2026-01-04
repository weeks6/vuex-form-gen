import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/

console.log(import.meta);
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  base: process.env.NODE_ENV === "production" ? "/vuex-form-gen/" : "",
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
            @use "@/styles/variables.scss" as *;
          `,
      },
    },
  },
});
