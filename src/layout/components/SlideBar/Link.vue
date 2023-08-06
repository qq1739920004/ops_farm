<template>
  <component :is="type" v-bind="linkProps(props.to)">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { isExternal } from "@/utils";
const props = defineProps({
  to: {
    type: String,
    required: true,
  },
});

const type = computed(() => {
  if (isExternal(props.to)) {
    return "a";
  }
  return "router-link";
});

function linkProps(to: string) {
  if (isExternal(to)) {
    return {
      href: to,
      target: "_blank",
      rel: "noopener",
    };
  }
  return {
    to: to,
  };
}
</script>

<style lang="scss" scoped></style>
