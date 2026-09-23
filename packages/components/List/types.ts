export interface ListProps<T> {
  items: T[]; // 列表数据
  itemKey?: string | ((item: T, index: number) => string | number | symbol); // key
  itemHeight: number; // 每项的固定高度
  containerHeight: number | string; // 容器高度
  buffer?: number; // 上/下缓存数
}

export interface ListEmits {
  (e: "scroll", event: Event): void; // 用户滚动更新scrollTop
  (e: "rangeChange", range: ListRange): void;
}

export interface ListRange {
  start: number;
  end: number;
}

export interface ListExpose {
  scrollToIndex(index: number): void;
  scrollToTop(): void;
  scrollToBottom(): void;
}
