import { resolve } from "node:path";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [vue()],

  build: {
    outDir: "dist/umd",

    lib: {
      entry: resolve(import.meta.dirname, "./index.ts"),
      name: "uglifruits-ui",
      fileName: "index",
      formats: ["umd"],
    },

    rolldownOptions: {
      external: ["vue"],
      output: {
        exports: "named",
        globals: {
          vue: "Vue",
        },

        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "index.css";
          return assetInfo.name as string;
        },
      },
    },
  },
});
