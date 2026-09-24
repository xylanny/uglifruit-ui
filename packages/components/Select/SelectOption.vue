<template>
  <li
    v-show="visible"
    class="u-select-option"
    :class="{ 'is-selected': selected, 'is-disabled': disabled }"
    @click.stop="handleClick"
  >
    <slot>{{ currentLabel }}</slot>
    <UIcon
      v-if="selected"
      class="u-select-option__icon"
      icon="check"
      size="1x"
    />
  </li>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted } from "vue";
import { OPTION_COMPONENT_NAME, SELECT_CTX_KEY } from "./constants";
import type { SelectOptionProps, SelectValue } from "./types";
import { UIcon } from "../Icon";

defineOptions({
  name: OPTION_COMPONENT_NAME,
});

const props = withDefaults(defineProps<SelectOptionProps>(), {
  label: "",
  disabled: false,
});

const select = inject(SELECT_CTX_KEY, void 0);

const currentLabel = computed(() =>
  props.label === "" ? String(props.value) : props.label,
);

const selected = computed(() => {
  if (!select) return false;
  return select.selectedValues.value.includes(props.value);
});

const visible = computed(() => {
  if (!select || !select.filterable.value) return true;
  const query = select.filterQuery.value;
  if (!query) return true;
  return String(currentLabel.value).toLowerCase().includes(query.toLowerCase());
});

const handleClick = () => {
  if (props.disabled) return;
  select?.handleOptionSelect(props.value);
};

onMounted(() => {
  select?.registerOption({
    value: props.value,
    label: currentLabel.value,
    disabled: props.disabled,
  });
});

onUnmounted(() => {
  select?.unregisterOption(props.value as SelectValue);
});
</script>
