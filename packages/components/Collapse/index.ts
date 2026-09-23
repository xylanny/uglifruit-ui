import { attachInstall } from "@uglifruits/utils";
import CollapseItem from "./CollapseItem.vue";
import Collapse from "./Collapse.vue";

export const UCollapse = attachInstall(Collapse);
export const UCollapseItem = attachInstall(CollapseItem);

export * from "./types";
