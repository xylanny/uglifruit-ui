<template>
  <span
    class="u-tag"
    :class="[
      `u-tag--${type}`,
      `u-tag--${size}`,
      `u-tag--${effect}`,
      {
        'is-round': round,
        'is-disabled': disabled,
        'is-closable': closable,
      },
    ]"
    @click="handleClick"
  >
    <span class="u-tag__content">
      <slot></slot>
    </span>

    <span v-if="closable" class="u-tag__close" @click.stop="handleClose">
      <slot name="close">
        <UIcon :icon="closeIcon ?? DEFAULT_CLOSE_ICON" size="1x" />
      </slot>
    </span>
  </span>
</template>

<script setup lang="ts">
import { UIcon } from "../Icon";
import { COMPONENT_NAME, DEFAULT_CLOSE_ICON } from "./constants";
import type { TagEmits, TagProps } from "./types";

defineOptions({
  name: COMPONENT_NAME,
});

const props = withDefaults(defineProps<TagProps>(), {
  type: "primary",
  size: "default",
  effect: "light",
  closable: false,
  round: false,
  disabled: false,
});

const emits = defineEmits<TagEmits>();

function handleClick(event: MouseEvent) {
  if (props.disabled) return;
  emits("click", event);
}

function handleClose(event: MouseEvent) {
  if (props.disabled) return;
  emits("close", event);
}
</script>

<style lang="css">
@import url("./style.css");
</style>
