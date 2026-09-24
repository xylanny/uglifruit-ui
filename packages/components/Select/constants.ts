import type { InjectionKey } from "vue";
import type { SelectContext } from "./types";

export const COMPONENT_NAME = "USelect";
export const OPTION_COMPONENT_NAME = "USelectOption";

export const SELECT_CTX_KEY: InjectionKey<SelectContext> =
  Symbol("selectContext");
