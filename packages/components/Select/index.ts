import { attachInstall } from "@uglifruits/utils";
import Select from "./Select.vue";
import SelectOption from "./SelectOption.vue";

export const USelect = attachInstall(Select);
export const USelectOption = attachInstall(SelectOption);

export * from "./types";
