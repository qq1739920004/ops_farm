<template>
  <el-menu
    :mode="mode"
    :default-active="activeMenu"
    :collapse="collapse"
    background-color="#192035"
    text-color="#fff"
    active-text-color="#ffd04b"
    @select="elMenuSelect"
    :ellipsis="false"
  >
    <Slidebar-item
      v-for="route in router.options.routes"
      :key="route.path"
      :item="route"
      :base-path="route.path"
    />
  </el-menu>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import SlidebarItem from "./SlidebarItem.vue";
import useAppStore from "@/store/app";
const appStore = useAppStore();
const router = useRouter();
const route = useRoute();
const emit = defineEmits(["handleChange"]);
defineProps({
  collapse: {
    type: Boolean,
    default: false,
  },
});
const mode = computed(() => {
  return appStore.themeSettings.navigation == "left"
    ? "vertical"
    : "horizontal";
});

const activeMenu = computed(() => {
  if (route.meta.activeMenu) {
    return route.meta.activeMenu;
  } else {
    return route.path;
  }
});
function elMenuSelect() {
  emit("handleChange");
}
</script>

<style lang="scss" scoped>
.el-menu {
  border-right: none;
}
.el-menu--vertical:not(.el-menu--collapse) {
  width: 210px;
  min-height: 400px;
}
.el-menu--horizontal {
  height: 100%;
}
</style>
