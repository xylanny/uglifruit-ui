import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "utils",
    environment: "jsdom", // 测试运行在JSDOM模拟的浏览器环境中
    include: ["__tests__/**/*.{test,spec}.{ts,tsx}"], // 测试文件位置
    clearMocks: true, // 每个测试用例开始前，清空所有mock的调用记录
    restoreMocks: true, // 每个测试用例开始前，所有mock恢复到原始实现

    // 覆盖率配置（V8引擎原生）
    coverage: {
      provider: "v8",
      reporter: ["text"],
      include: ["**/*.{ts,tsx,vue}"],
      exclude: [
        "index.ts",
        "**/*.config.ts",
        "**/*.d.ts",
        "**/__tests__/**",
        "**/*.stories.{ts,tsx,js,jsx}",
      ],
    },
  },
});
