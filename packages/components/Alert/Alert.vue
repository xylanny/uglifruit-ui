<template>
  <div
    v-if="visible"
    class="u-alert"
    :class="{
      [`u-alert--${type}`]: type,
      'is-center': center,
    }"
  >
    <UIcon
      v-if="showIcon && resolvedIcon"
      class="u-alert__icon"
      :icon="resolvedIcon"
      size="1x"
    />

    <div class="u-alert__content">
      <div v-if="title || $slots.title" class="u-alert__title">
        <slot name="title">{{ title }}</slot>
      </div>

      <div v-if="description || $slots.default" class="u-alert__description">
        <slot>{{ description }}</slot>
      </div>
    </div>

    <div v-if="closable" class="u-alert__close" @click="handleClose">
      <template v-if="closeText">
        {{ closeText }}
      </template>
      <UIcon v-else icon="xmark" size="1x" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { UIcon } from "../Icon";
import { COMPONENT_NAME, TYPE_ICON_MAP } from "./constants";
import type { AlertEmits, AlertProps } from "./types";

defineOptions({
  name: COMPONENT_NAME,
});

const props = withDefaults(defineProps<AlertProps>(), {
  type: "info",
  closable: true,
  showIcon: true,
  center: false,
});

const emits = defineEmits<AlertEmits>();

const visible = ref(true);

const resolvedIcon = computed(() => {
  if (!props.showIcon) return undefined;
  return TYPE_ICON_MAP[props.type];
});

const handleClose = (e: MouseEvent) => {
  visible.value = false;
  emits("close", e);
};
</script>

<style lang="css">
@import url("./style.css");
</style>
