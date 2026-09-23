import type { Ref } from "vue";

export type CollapseItemName = string | number;

export interface CollapseProps {
  moduleValue: CollapseItemName[];
  title?: string;
  accordion?: boolean;
}

export interface CollapseEmits {
  (e: "update:moduleValue", value: CollapseItemName[]): void;
  (e: "change", value: CollapseItemName[]): void;
}

export interface CollapseContext {
  activeNames: Ref<CollapseItemName[]>;
  handleItemClick(name: CollapseItemName): void;
}

export interface CollapseItemProps {
  name: CollapseItemName;
  title?: string;
  disabled?: boolean;
}
