import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [vue()], // 编译SFC
  test: {
    name: "components",
    environment: "jsdom",
    include: ["__tests__/**/*.{test,spec}.{ts,tsx}"],
    clearMocks: true,
    restoreMocks: true,

    coverage: {
      provider: "v8",
      reporter: ["text"],
      include: ["**/*.{ts,tsx,vue}"],
      exclude: [
        "**/index.ts",
        "**/*.config.ts",
        "**/*.d.ts",
        "**/__tests__/**",
        "**/*.stories.{ts,tsx,js,jsx}",
        "**/types.ts",
        "**/constants.ts",
      ],
    },
  },
});
