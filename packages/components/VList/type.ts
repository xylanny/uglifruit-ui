export interface VListProps<T> {
  items: T[]; // 列表数据
  itemKey?: string | ((item: T, index: number) => string | number | symbol); // key
  itemHeight: number; // 每项的固定高度
  containerHeight: number | string; // 容器高度
  buffer?: number; // 上/下缓存数
}

export interface VListEmits {
  (e: "scroll", event: Event): void; // 用户滚动更新scrollTop
  (e: "rangeChange", range: VListRange): void;
}

export interface VListRange {
  start: number;
  end: number;
}

export interface VListExpose {
  scrollToIndex(index: number): void;
  scrollToTop(): void;
  scrollToBottom(): void;
}
