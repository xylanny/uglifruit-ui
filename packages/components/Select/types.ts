import type { Ref } from "vue";

export type SelectSize = "large" | "default" | "small";

export type SelectValue = string | number | boolean;

export interface SelectProps {
  modelValue?: SelectValue | SelectValue[];
  multiple?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  filterable?: boolean;
  placeholder?: string;
  size?: SelectSize;
  multipleLimit?: number;
  noDataText?: string;
  noMatchText?: string;
}

export interface SelectEmits {
  (
    e: "update:modelValue",
    value: SelectValue | SelectValue[] | undefined,
  ): void;
  (e: "change", value: SelectValue | SelectValue[] | undefined): void;
  (e: "visible-change", visible: boolean): void;
  (e: "clear"): void;
}

export interface SelectOptionProps {
  value: SelectValue;
  label?: string | number;
  disabled?: boolean;
}

export interface SelectOptionMeta {
  value: SelectValue;
  label: string | number;
  disabled: boolean;
}

export interface SelectContext {
  selectedValues: Ref<SelectValue[]>;
  handleOptionSelect: (value: SelectValue) => void;
  options: Ref<SelectOptionMeta[]>;
  registerOption: (option: SelectOptionMeta) => void;
  unregisterOption: (value: SelectValue) => void;
  filterQuery: Ref<string>;
  filterable: Ref<boolean>;
}
