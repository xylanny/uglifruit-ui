import type { InjectionKey } from "vue";
import type { CollapseContext } from "./types";

export const COMPONENT_NAME = "UCollapse";

export const COLLAPSE_CTX_KEY: InjectionKey<CollapseContext> =
  Symbol("collapseContext");
