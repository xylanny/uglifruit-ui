<template>
  <div class="u-collapse">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { provide, ref, watch, watchEffect } from "vue";
import type { CollapseEmits, CollapseItemName, CollapseProps } from "./types";
import { COLLAPSE_CTX_KEY } from "./constants";

defineOptions({
  name: "UCollapse",
});

const props = defineProps<CollapseProps>();

const activeNames = ref(props.moduleValue);

watchEffect(() => {
  if (props.accordion && activeNames.value.length > 1) {
    console.warn("accordion mode should only have one active item");
  }
});

const emits = defineEmits<CollapseEmits>();

function updateActiveNames(newNames: CollapseItemName[]) {
  activeNames.value = newNames;
  emits("update:moduleValue", newNames);
  emits("change", newNames);
}

watch(
  () => props.moduleValue,
  (newNames) => updateActiveNames(newNames),
);

function handleItemClick(item: CollapseItemName) {
  let _activeNames = [...activeNames.value];

  if (props.accordion) {
    _activeNames = [_activeNames[0] === item ? "" : item];
    updateActiveNames(_activeNames);
    return;
  }

  const index = _activeNames.indexOf(item);
  if (index > -1) {
    _activeNames.splice(index, 1);
  } else {
    _activeNames.push(item);
  }

  updateActiveNames(_activeNames);
}

provide(COLLAPSE_CTX_KEY, {
  activeNames,
  handleItemClick,
});
</script>

<style lang="css">
@import url("./style.css");
</style>
