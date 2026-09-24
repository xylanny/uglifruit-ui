<template>
  <div
    ref="_ref"
    class="u-select"
    :class="[
      `u-select--${size}`,
      {
        'is-disabled': disabled,
        'is-multiple': multiple,
        'is-focus': isFocused,
      },
    ]"
    @click="toggleMenu"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <div class="u-select__trigger" :class="{ 'is-focus': isFocused }">
      <!-- 多选标签 -->
      <div v-if="multiple" class="u-select__tags">
        <UTag
          v-for="val in selectedValues"
          :key="String(val)"
          class="u-select__tag"
          type="info"
          closable
          @close="removeTag(val)"
        >
          {{ getLabel(val) }}
        </UTag>
        <span v-if="selectedValues.length === 0" class="u-select__placeholder">
          {{ placeholder }}
        </span>
      </div>

      <!-- 单选显示 -->
      <template v-else>
        <span v-if="selectedLabel" class="u-select__selected">
          {{ selectedLabel }}
        </span>
        <span v-else class="u-select__placeholder">{{ placeholder }}</span>
      </template>

      <!-- 筛选输入 -->
      <input
        v-if="filterable"
        ref="_inputRef"
        v-model="filterQuery"
        class="u-select__input"
        :class="{ 'is-hidden': !isFocused && multiple }"
        :disabled="disabled"
        :placeholder="multiple && selectedValues.length > 0 ? '' : placeholder"
        type="text"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />

      <!-- 图标 -->
      <span class="u-select__suffix">
        <UIcon
          v-if="showClearIcon"
          class="u-select__icon u-select__icon--clear"
          icon="circle-xmark"
          size="1x"
          @click.stop="handleClear"
        />
        <UIcon
          v-else
          class="u-select__icon u-select__icon--arrow"
          :class="{ 'is-reverse': isMenuVisible }"
          icon="angle-down"
          size="1x"
        />
      </span>
    </div>

    <!-- 下拉菜单 -->
    <Transition name="u-select-dropdown">
      <div v-show="isMenuVisible" class="u-select__menu">
        <ul class="u-select__list">
          <slot></slot>
          <li v-if="filteredOptions.length === 0" class="u-select__empty">
            {{ filterQuery ? noMatchText : noDataText }}
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  provide,
  ref,
  watch,
} from "vue";
import { COMPONENT_NAME, SELECT_CTX_KEY } from "./constants";
import type {
  SelectEmits,
  SelectOptionMeta,
  SelectProps,
  SelectValue,
} from "./types";
import { UIcon } from "../Icon";
import { UTag } from "../Tag";

defineOptions({
  name: COMPONENT_NAME,
});

const props = withDefaults(defineProps<SelectProps>(), {
  modelValue: undefined,
  multiple: false,
  disabled: false,
  clearable: false,
  filterable: false,
  placeholder: "请选择",
  size: "default",
  multipleLimit: 0,
  noDataText: "无数据",
  noMatchText: "无匹配数据",
});

const emits = defineEmits<SelectEmits>();

// DOM 引用
const _ref = ref<HTMLDivElement | null>(null);
const _inputRef = ref<HTMLInputElement | null>(null);

// 状态
const isFocused = ref(false);
const isHovering = ref(false);
const isMenuVisible = ref(false);
const filterQuery = ref("");
const options = ref<SelectOptionMeta[]>([]);

// 计算属性
const selectedValues = computed<SelectValue[]>(() => {
  if (props.multiple) {
    return Array.isArray(props.modelValue) ? props.modelValue : [];
  }
  return props.modelValue === undefined || props.modelValue === null
    ? []
    : [props.modelValue as SelectValue];
});

const selectedLabel = computed(() =>
  selectedValues.value.length > 0 ? getLabel(selectedValues.value[0]) : "",
);

const showClearIcon = computed(
  () =>
    props.clearable &&
    !props.disabled &&
    selectedValues.value.length > 0 &&
    (isHovering.value || isFocused.value),
);

const filteredOptions = computed(() => {
  if (!filterQuery.value || !props.filterable) return options.value;
  return options.value.filter((opt) =>
    String(opt.label).toLowerCase().includes(filterQuery.value.toLowerCase()),
  );
});

// 方法
const getLabel = (value: SelectValue) => {
  const option = options.value.find((o) => o.value === value);
  return option ? option.label : String(value);
};

const toggleMenu = () => {
  if (props.disabled) return;
  if (props.filterable) _inputRef.value?.focus();
  isMenuVisible.value = !isMenuVisible.value;
  emits("visible-change", isMenuVisible.value);
};

const handleOptionSelect = (value: SelectValue) => {
  if (props.multiple) {
    const newValues = [...selectedValues.value];
    const index = newValues.indexOf(value);
    if (index > -1) {
      newValues.splice(index, 1);
    } else {
      if (props.multipleLimit > 0 && newValues.length >= props.multipleLimit)
        return;
      newValues.push(value);
    }
    emits("update:modelValue", newValues);
    emits("change", newValues);
  } else {
    emits("update:modelValue", value);
    emits("change", value);
    isMenuVisible.value = false;
    emits("visible-change", false);
    filterQuery.value = "";
  }
  nextTick(() => _inputRef.value?.focus());
};

const removeTag = (value: SelectValue) => {
  const newValues = selectedValues.value.filter((v) => v !== value);
  emits("update:modelValue", newValues);
  emits("change", newValues);
};

const handleClear = () => {
  emits("update:modelValue", props.multiple ? [] : undefined);
  emits("change", props.multiple ? [] : undefined);
  emits("clear");
  filterQuery.value = "";
};

const registerOption = (option: SelectOptionMeta) => {
  options.value.push(option);
};

const unregisterOption = (value: SelectValue) => {
  options.value = options.value.filter((o) => o.value !== value);
};

const handleClickOutside = (e: MouseEvent) => {
  if (!_ref.value?.contains(e.target as Node)) {
    isMenuVisible.value = false;
    emits("visible-change", false);
  }
};

// 注入上下文
provide(SELECT_CTX_KEY, {
  selectedValues,
  handleOptionSelect,
  options,
  registerOption,
  unregisterOption,
  filterQuery,
  filterable: computed(() => props.filterable),
});

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

watch(isMenuVisible, (val) => {
  if (!val) filterQuery.value = "";
});

defineExpose({
  ref: _ref,
  focus: () => _inputRef.value?.focus(),
  blur: () => _inputRef.value?.blur(),
});
</script>

<style>
@import url("./style.css");
</style>
