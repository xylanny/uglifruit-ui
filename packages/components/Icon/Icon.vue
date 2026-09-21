<template>
  <i
    class="ta-icon"
    :class="[type ? `ta-icon--${type}` : '']"
    :style="customStyles"
    v-bind="$attrs"
  >
    <font-awesome-icon v-bind="filterProps" />
  </i>
</template>

<script setup lang="ts">
import type { IconProps } from "./type";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { omit } from "lodash-es";
import { computed } from "vue";

defineOptions({
  name: "UIcon",
  inheritAttrs: false,
});

const props = defineProps<IconProps>();
const filterProps = computed(() => omit(props, ["type", "color"])); // 排除type、color本组件库使用的属性
const customStyles = computed(() => ({ color: props.color ?? void 0 }));
</script>

<style lang="css">
@import url("./style.css");
</style>
