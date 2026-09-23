import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleRight,
  faCheck,
  faHeart,
  faPlus,
  faSearch,
  faSpinner,
  faStar,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import type { Preview } from "@storybook/vue3-vite";
import "@uglifruits/theme/index.css"; // 全局样式导入

library.add(
  faSearch,
  faUser,
  faStar,
  faHeart,
  faSpinner,
  faCheck,
  faXmark,
  faPlus,
  faAngleRight,
);

// 在浏览器环境运行的前置配置
const preview: Preview = {
  parameters: {
    layout: "centered", // 组件实例在画布正中间，四周留白
  },
};

export default preview;
