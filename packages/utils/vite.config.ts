import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: resolve(import.meta.dirname, "./tsconfig.build.json"),
      outDirs: resolve(import.meta.dirname, "dist/types"),
    }),
  ],

  build: {
    outDir: "dist",

    lib: {
      entry: resolve(import.meta.dirname, "./index.ts"),
      name: "uglifruits-utils",
      fileName: "index",
      formats: ["es"],
    },

    rolldownOptions: {
      external: [],
    },
  },
});
