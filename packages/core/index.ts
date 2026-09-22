import "@uglifruits/theme/index.css";
import components from "./components";
import { createInstaller } from "../utils";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

// 注册第三方图标
library.add(fas);
const installer = createInstaller(components);

export * from "../components";

export default installer;
