import type { Ref } from "vue";

export type SwitchValue = string | number | boolean;

export interface SwitchProps {
  modelValue?: SwitchValue;
  activeValue?: SwitchValue;
  inactiveValue?: SwitchValue;
  disabled?: boolean;
  loading?: boolean;
  size?: "large" | "default" | "small";
  activeText?: string;
  inactiveText?: string;
  activeColor?: string;
  inactiveColor?: string;
  name?: string;
}

export interface SwitchEmits {
  (e: "update:modelValue", value: SwitchValue): void;
  (e: "change", value: SwitchValue): void;
}

export interface SwitchExpose {
  ref: Ref<HTMLInputElement | null>;
  focus: () => void;
  blur: () => void;
}
