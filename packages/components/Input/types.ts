import type { Component, Ref } from "vue";

export type InputType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "tel"
  | "url";

export type InputSize = "large" | "default" | "small";

export interface InputProps {
  modelValue?: string | number;
  type?: InputType;
  size?: InputSize;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  clearable?: boolean;
  showPassword?: boolean;
  maxlength?: number;
  minlength?: number;
  autofocus?: boolean;
  autocomplete?: string;
  name?: string;
  tag?: string | Component;
  prefixIcon?: string;
  suffixIcon?: string;
}

export interface InputEmits {
  (e: "update:modelValue", value: string): void;
  (e: "input", value: string): void;
  (e: "change", value: string): void;
  (e: "focus", payload: FocusEvent): void;
  (e: "blur", payload: FocusEvent): void;
  (e: "clear"): void;
}

export interface InputExpose {
  ref: Ref<HTMLInputElement | null>;
  focus: () => void;
  blur: () => void;
  clear: () => void;
}
