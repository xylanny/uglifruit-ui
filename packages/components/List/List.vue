<template>
  <div class="u-list" ref="_ref" :style="containerStyle" @scroll="handleScroll">
    <!-- 幽灵容器，用于撑开滚动条 -->
    <div class="u-list__phantom" :style="{ height: `${contentHeight}px` }">
      <div
        class="u-list__content"
        :style="{ transform: `translateY(${offsetY}px)` }"
      >
        <div
          v-for="(item, i) in visibleItems"
          :key="getKey(item, startIndex + i)"
          class="u-list__item"
          :style="{ height: `${itemHeight}px` }"
        >
          <slot :item="item" :index="startIndex + i">
            {{ String(item) }}
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
import { computed, ref, watch } from "vue";
import type { CSSProperties } from "vue";
import type { ListEmits, ListExpose, ListProps, ListRange } from "./type";
import { useRaf } from "@uglifruits/hooks";
import { COMPONENT_NAME } from "./constants";

defineOptions({
  name: COMPONENT_NAME,
});

const props = withDefaults(defineProps<ListProps<T>>(), {
  buffer: 10,
});

const emits = defineEmits<ListEmits>();

defineSlots<{
  default(props: { item: T; index: number }): unknown;
}>();

const _ref = ref<HTMLElement>();

// 核心
const scrollTop = ref(0);

// 暂存滚动高度
let pendingScrollTop = 0;

// 容器样式
const containerStyle = computed<CSSProperties>(() => ({
  height:
    typeof props.containerHeight === "number"
      ? `${props.containerHeight}px`
      : props.containerHeight,
}));

// 容器高度，支持多种尺寸输入格式
const containerHeight = computed(() => {
  const h = props.containerHeight;
  if (typeof h === "number") return h;
  if (h.endsWith("px")) return Number.parseFloat(h);
  if (h.endsWith("vh")) {
    return (Number.parseFloat(h) / 100) * window.innerHeight;
  }
  return Number.parseFloat(h) || 400;
});

// 内容高度（> 容器高度）
const contentHeight = computed(() => props.items.length * props.itemHeight);

// 可见项的数量
const visibleCount = computed(
  () => Math.ceil(containerHeight.value / props.itemHeight), // 向下取整
);

// 起始索引
const startIndex = computed(() =>
  /**
   * scrollTop.value / props.itemHeight表示当前滚过了多少条
   * 减去buffer， 防止露白而显得视觉卡顿
   */
  Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.buffer),
);

// 结束索引
const endIndex = computed(() =>
  Math.min(
    props.items.length,
    startIndex.value + visibleCount.value + props.buffer * 2,
  ),
);

// 纵向偏移量
const offsetY = computed(() => startIndex.value * props.itemHeight);

// 可见项数组
const visibleItems = computed(() =>
  props.items.slice(startIndex.value, endIndex.value),
);

// 高频的scroll触发收敛成每帧一次
const { schedule } = useRaf(() => {
  scrollTop.value = pendingScrollTop;
});
function getKey(item: T, index: number): string | number {
  const { itemKey } = props;
  if (typeof itemKey === "function") {
    const key = itemKey(item, index);
    return typeof key === "symbol" ? index : key;
  }
  if (
    typeof itemKey === "string" &&
    item !== null &&
    (typeof item === "object" || typeof item === "function")
  ) {
    return (item as Record<string, unknown>)[itemKey] as string | number;
  }
  return index;
}

function handleScroll(event: Event) {
  pendingScrollTop = (event.target as HTMLElement).scrollTop;

  // 调度到下一帧
  schedule();

  // 原始事件仍然透传
  emits("scroll", event);
}

// rangeChange仅在范围真正变化时emit
let lastRange: ListRange = { start: -1, end: -1 };

watch(
  [startIndex, endIndex],
  ([start, end]) => {
    if (start === lastRange.start && end === lastRange.end) {
      return;
    }

    lastRange = { start, end };
    emits("rangeChange", lastRange);
  },
  { immediate: true },
);

function setScrollTop(value: number) {
  const el = _ref.value;
  if (!el) return;

  el.scrollTop = value;
  pendingScrollTop = value;
  scrollTop.value = value;
}

function scrollToIndex(index: number) {
  const maxIndex = Math.max(props.items.length - 1, 0);
  const clamped = Math.min(Math.max(index, 0), maxIndex);
  setScrollTop(clamped * props.itemHeight);
}

function scrollToTop() {
  setScrollTop(0);
}

function scrollToBottom() {
  setScrollTop(Math.max(contentHeight.value - containerHeight.value, 0));
}

defineExpose<ListExpose>({
  scrollToIndex,
  scrollToTop,
  scrollToBottom,
});
</script>

<style lang="css">
@import url("./style.css");
</style>
