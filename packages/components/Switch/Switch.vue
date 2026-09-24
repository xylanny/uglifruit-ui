<template>
  <div
    class="u-switch"
    :class="[
      `u-switch--${size}`,
      {
        'is-checked': isChecked,
        'is-disabled': disabled || loading,
        'is-loading': loading,
        'is-focus': isFocused,
      },
    ]"
    @click="handleClick"
  >
    <!-- 左侧文字：未选中时高亮 -->
    <span
      v-if="inactiveText"
      class="u-switch__label u-switch__label--left"
      :class="{ 'is-active': !isChecked }"
    >
      {{ inactiveText }}
    </span>

    <!-- 开关主体 -->
    <span class="u-switch__core" :style="coreStyle">
      <span class="u-switch__action">
        <UIcon
          v-if="loading"
          class="u-switch__loading"
          icon="spinner"
          size="1x"
          spin
        />
      </span>
      <input
        ref="_ref"
        class="u-switch__input"
        type="checkbox"
        :name="name"
        :checked="isChecked"
        :disabled="disabled || loading"
        tabindex="-1"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
    </span>

    <!-- 右侧文字：选中时高亮 -->
    <span
      v-if="activeText"
      class="u-switch__label u-switch__label--right"
      :class="{ 'is-active': isChecked }"
    >
      {{ activeText }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { COMPONENT_NAME } from "./constants";
import type {
  SwitchEmits,
  SwitchExpose,
  SwitchProps,
  SwitchValue,
} from "./types";
import { UIcon } from "../Icon";

defineOptions({
  name: COMPONENT_NAME,
});

const props = withDefaults(defineProps<SwitchProps>(), {
  modelValue: false,
  activeValue: true,
  inactiveValue: false,
  disabled: false,
  loading: false,
  size: "default",
  activeText: "",
  inactiveText: "",
  activeColor: "",
  inactiveColor: "",
  name: "",
});

const emits = defineEmits<SwitchEmits>();

// DOM 引用
const _ref = ref<HTMLInputElement | null>(null);

// 状态
const isFocused = ref(false);

// 计算属性
const isChecked = computed(() => props.modelValue === props.activeValue);

const coreStyle = computed(() => {
  const color = isChecked.value ? props.activeColor : props.inactiveColor;
  if (!color) return {};
  return { backgroundColor: color, borderColor: color };
});

// 方法
const handleClick = () => {
  if (props.disabled || props.loading) return;
  const newValue: SwitchValue = isChecked.value
    ? props.inactiveValue
    : props.activeValue;
  emits("update:modelValue", newValue);
  emits("change", newValue);
};

const focus = () => {
  _ref.value?.focus();
};

const blur = () => {
  _ref.value?.blur();
};

defineExpose<SwitchExpose>({
  ref: _ref,
  focus,
  blur,
});
</script>

<style>
@import url("./style.css");
</style>
