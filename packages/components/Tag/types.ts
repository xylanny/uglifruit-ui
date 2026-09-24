export type TagType = "primary" | "success" | "warning" | "danger" | "info";

export type TagSize = "large" | "default" | "small";

export type TagEffect = "light" | "dark" | "plain";

export interface TagProps {
  type?: TagType;
  size?: TagSize;
  effect?: TagEffect;
  closable?: boolean;
  round?: boolean;
  disabled?: boolean;
  closeIcon?: string;
}

export interface TagEmits {
  (e: "close", event: MouseEvent): void;
  (e: "click", event: MouseEvent): void;
}
