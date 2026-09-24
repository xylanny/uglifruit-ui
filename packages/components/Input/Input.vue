<template>
  <div
    class="u-input"
    :class="{
      [`u-input--${size}`]: size,
      'is-disabled': disabled,
      'is-focus': focused,
    }"
  >
    <u-icon
      v-if="prefixIcon"
      class="u-input__prefix-icon"
      :icon="prefixIcon"
      size="1x"
    />

    <input
      ref="_ref"
      class="u-input__inner"
      :type="currentType"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :minlength="minlength"
      :autofocus="autofocus"
      :autocomplete="autocomplete"
      :name="name"
      @input="onInput"
      @change="onChange"
      @focus="onFocus"
      @blur="onBlur"
    />

    <u-icon
      v-if="showClearIcon"
      class="u-input__clear-icon"
      icon="circle-xmark"
      size="1x"
      @click="clear"
    />

    <u-icon
      v-else-if="showPassword && type === 'password'"
      class="u-input__suffix-icon"
      :icon="passwordVisible ? 'eye' : 'eye-slash'"
      size="1x"
      @click="togglePassword"
    />

    <u-icon
      v-else-if="suffixIcon"
      class="u-input__suffix-icon"
      :icon="suffixIcon"
      size="1x"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { COMPONENT_NAME } from "./constants";
import type { InputEmits, InputExpose, InputProps } from "./types";
import { UIcon } from "../Icon";

defineOptions({
  name: COMPONENT_NAME,
});

const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
  size: "default",
  disabled: false,
  readonly: false,
  clearable: false,
  showPassword: false,
  autofocus: false,
});

const emits = defineEmits<InputEmits>();

const passwordVisible = ref(false);

const focused = ref(false);

const currentType = computed(() => {
  if (props.type === "password") {
    return passwordVisible.value ? "text" : "password";
  }
  return props.type;
});

const showClearIcon = computed(
  () =>
    props.clearable &&
    !props.disabled &&
    !props.readonly &&
    focused.value &&
    props.modelValue !== undefined &&
    props.modelValue !== "",
);

const onInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  emits("update:modelValue", value);
  emits("input", value);
};

const onChange = (e: Event) => {
  emits("change", (e.target as HTMLInputElement).value);
};

const onFocus = (e: FocusEvent) => {
  focused.value = true;
  emits("focus", e);
};

const onBlur = (e: FocusEvent) => {
  focused.value = false;
  emits("blur", e);
};

const togglePassword = () => {
  passwordVisible.value = !passwordVisible.value;
};

// DOM引用
const _ref = ref<HTMLInputElement | null>(null);

const focus = () => _ref.value?.focus();
const blur = () => _ref.value?.blur();

const clear = () => {
  emits("update:modelValue", "");
  emits("input", "");
  emits("clear");
  focus();
};

defineExpose<InputExpose>({
  ref: _ref,
  focus,
  blur,
  clear,
});
</script>

<style>
@import url("./style.css");
</style>
