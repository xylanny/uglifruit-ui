<template>
  <component
    :is="tag"
    :type="tag === 'button' ? nativeType : undefined"
    class="u-button"
    :class="{
      [`u-button--${type}`]: type,
      [`u-button--${size}`]: size,
      'is-plain': plain,
      'is-circle': circle,
      'is-round': round,
      'is-loading': loading,
    }"
    :disabled="disabled || loading ? true : undefined"
    ref="_ref"
    @click="onClick"
  >
    <template v-if="loading">
      <slot name="loading">
        <UIcon
          class="u-button__icon-loading"
          :icon="loadingIcon ?? 'spinner'"
          size="1x"
          spin
        />
      </slot>
    </template>

    <template v-else>
      <u-icon
        class="u-button__icon"
        v-if="icon && !loading"
        :icon="icon"
        size="1x"
      />
      <slot></slot>
    </template>
  </component>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { COMPONENT_NAME } from "./constants";
import type { ButtonExpose, ButtonEmits, ButtonProps } from "./types";
import { throttle } from "lodash-es";
import { UIcon } from "../Icon";

defineOptions({
  name: COMPONENT_NAME,
});

const props = withDefaults(defineProps<ButtonProps>(), {
  tag: "button",
  nativeType: "button",
  throttled: true,
  duration: 500,
  loading: false,
});

const emits = defineEmits<ButtonEmits>();

const slots = defineSlots();

const handleClick = (e: MouseEvent) => emits("click", e);
const handleThrottledClick = throttle(handleClick, props.duration);
const onClick = (e: MouseEvent) => {
  if (props.throttled) {
    handleThrottledClick(e);
  } else {
    handleClick(e);
  }
};

// DOM引用
const _ref = ref<HTMLButtonElement | null>(null);

defineExpose<ButtonExpose>({
  ref: _ref,
});
</script>

<style>
@import url("./style.css");
</style>
