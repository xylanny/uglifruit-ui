<template>
  <div class="u-collapse-item" :class="{ 'is-disabled': disabled }">
    <div
      class="u-collapse-item__header"
      :class="{
        'is-disabled': disabled,
        'is-active': isActive,
      }"
      :id="`item-header-${name}`"
      @click="handleClick"
    >
      <span class="u-collapse-item__title">
        <slot name="title">{{ title }}</slot>
      </span>
      <u-icon v-show="!disabled" class="header-angle" icon="angle-right" />
    </div>

    <Transition
      name="u-collapse"
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @before-leave="onBeforeLeave"
      @leave="onLeave"
      @after-leave="onAfterLeave"
    >
      <div v-show="isActive" class="u-collapse-item__wrapper">
        <div class="u-collapse-item__content" :id="`item-content-${name}`">
          <slot></slot>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import type { CollapseItemProps } from "./types";
import { COLLAPSE_CTX_KEY } from "./constants";
import UIcon from "../Icon/Icon.vue";

defineOptions({
  name: "UCollapseItem",
});

const props = defineProps<CollapseItemProps>();
const ctx = inject(COLLAPSE_CTX_KEY, void 0);
const isActive = computed(() => ctx?.activeNames.value.includes(props.name));

function handleClick() {
  if (props.disabled) return;

  ctx?.handleItemClick(props.name);
}

function onBeforeEnter(el: Element) {
  const htmlEl = el as HTMLElement;
  htmlEl.style.height = "0";
  htmlEl.style.overflow = "hidden";
}

function onEnter(el: Element) {
  const htmlEl = el as HTMLElement;
  htmlEl.style.height = `${htmlEl.scrollHeight}px`;
}

function onAfterEnter(el: Element) {
  const htmlEl = el as HTMLElement;
  htmlEl.style.height = "";
  htmlEl.style.overflow = "";
}

function onBeforeLeave(el: Element) {
  const htmlEl = el as HTMLElement;
  htmlEl.style.height = `${htmlEl.scrollHeight}px`;
  htmlEl.style.overflow = "hidden";
}

function onLeave(el: Element) {
  const htmlEl = el as HTMLElement;
  // 强制reflow，确保from值生效
  void htmlEl.offsetHeight;
  htmlEl.style.height = "0";
}

function onAfterLeave(el: Element) {
  const htmlEl = el as HTMLElement;
  htmlEl.style.height = "";
  htmlEl.style.overflow = "";
}
</script>

<style lang="css">
@import url("./style.css");
</style>
