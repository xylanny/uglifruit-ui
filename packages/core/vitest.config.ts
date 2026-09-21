import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [vue()],
  test: {
    name: "core",
    environment: "jsdom",
    include: ["__tests__/**/*.{test,spec}.{ts,tsx}"],
    clearMocks: true,
    restoreMocks: true,

    coverage: {
      provider: "v8",
      reporter: ["text"],
      include: ["**/*.{ts,tsx,vue}"],
      exclude: ["components.ts"],
    },
  },
});
