<template>
  <el-menu
    :mode="appStore.themeSettings.layout"
    :default-active="activeMenu"
    :collapse="collapse"
    background-color="#192035"
    text-color="#fff"
    active-text-color="#ffd04b"
    @select="elMenuSelect"
    :ellipsis="false"
  >
    <el-menu-item
      onclick="location.href='/'"
      :class="{ logo: true, logo_active: collapse }"
    >
      <img src="@/assets/logo.png" alt="" />
      <span>司南耕耘</span>
    </el-menu-item>

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
.logo {
  font-size: 18px;
  transition: all 1s;
  img {
    width: 45px;
  }
  span {
    margin-left: 12px;
  }
}
.logo_active {
  transition: all 1s;
  display: flex;
  justify-content: center;
  align-items: center;
  animation-name: opacityKeyframes;
  animation-duration: 1s;
  span {
    margin-left: 0px;
  }
}

@keyframes opacityKeyframes {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

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
