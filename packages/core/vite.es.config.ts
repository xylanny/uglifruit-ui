import { resolve } from "node:path";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      root: resolve(import.meta.dirname, ".."),
      tsconfigPath: resolve(import.meta.dirname, "./tsconfig.build.json"),
      outDirs: resolve(import.meta.dirname, "dist/types"),
    }),
  ],

  build: {
    outDir: "dist/es",

    lib: {
      entry: resolve(import.meta.dirname, "./index.ts"),
      name: "uglifruits-ui",
      fileName: "index",
      formats: ["es"],
    },

    rolldownOptions: {
      external: [
        "vue",
        "@fortawesome/vue-fontawesome",
        "@fortawesome/fontawesome-svg-core",
        "@fortawesome/free-solid-svg-icons",
      ],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "index.css";
          return assetInfo.name as string;
        },
      },
    },
  },
});
