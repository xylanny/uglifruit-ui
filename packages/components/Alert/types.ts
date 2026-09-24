export type AlertType = "success" | "info" | "warning" | "danger";

export interface AlertProps {
  title?: string;
  type?: AlertType;
  description?: string;
  closable?: boolean;
  showIcon?: boolean;
  center?: boolean;
  closeText?: string;
}

export interface AlertEmits {
  (e: "close", payload: MouseEvent): void;
}
