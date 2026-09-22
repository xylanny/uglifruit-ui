import vue from "@vitejs/plugin-vue";
import type { StorybookConfig } from "@storybook/vue3-vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(ts|tsx)"], //Story文件位置

  addons: [], // 不使用Storybook的插件

  // 使用vue3+vite，（加载对应的渲染器而将Story渲染为Vue组件、使用Vite作为构建器、挂载Vue特有的docgen）
  framework: {
    name: "@storybook/vue3-vite",
    options: {
      docgen: "vue-component-meta",
    },
  },

  // Vite配置（Storybook交给Vite之前，会调用viteFinal做最后一次修改；这里额外挂上@vitejs/plugin-vue，才能编译.vue文件）
  viteFinal: (config) => mergeConfig(config, { plugins: [vue()] }),
};

export default config;
