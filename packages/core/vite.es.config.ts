import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";
import dts from "vite-plugin-dts";

const componentDirs = readdirSync(
  resolve(import.meta.dirname, "../components"),
  { withFileTypes: true },
)
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

const S = "[\\\\/]";

const chunkGroups = [
  {
    name: "vendor",
    test: new RegExp(`${S}node_modules${S}`),
    priority: 10,
    minSize: 0,
  },
  {
    name: "utils",
    test: new RegExp(`${S}packages${S}utils${S}`),
    priority: 20,
    minSize: 0,
  },
  {
    name: "hooks",
    test: new RegExp(`${S}packages${S}hooks${S}`),
    priority: 20,
    minSize: 0,
  },
  ...componentDirs.map((dir) => ({
    name: dir,
    test: new RegExp(`${S}packages${S}components${S}${dir}${S}`),
    priority: 20,
    minSize: 0,
  })),
];

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

        codeSplitting: {
          groups: chunkGroups,
        },
      },
    },
  },
});
