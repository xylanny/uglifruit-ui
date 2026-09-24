import type { Component, Ref } from "vue";

export type ButtonType = "primary" | "success" | "warning" | "danger" | "info";

export type NativeType = "submit" | "button" | "reset";

export type ButtonSize = "large" | "default" | "small";

export interface ButtonProps {
  tag?: string | Component;
  type?: ButtonType;
  size?: ButtonSize;
  nativeType?: NativeType;
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingIcon?: string;
  throttled?: boolean;
  duration?: number;
  plain?: boolean;
  circle?: boolean;
  round?: boolean;
}

export interface ButtonEmits {
  (e: "click", payload: MouseEvent): void;
}

export interface ButtonExpose {
  ref: Ref<HTMLButtonElement | null>;
}
