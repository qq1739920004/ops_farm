<template>
  <el-menu
    :mode="appStore.layout"
    :default-active="activeMenu"
    :collapse="collapse"
    :background-color="variables.appMenuColor"
    text-color="#fff"
    active-text-color="#fff"
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
import { useRoute, useRouter } from "vue-router";
import SlidebarItem from "./SlidebarItem.vue";
import useAppStore from "@/store/app";
import variables from "@/styles/variables.module.scss";
const appStore = useAppStore();
const route = useRoute();
const router = useRouter();
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
    width: 48px;
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
.el-menu--vertical {
  background-image: url("@/assets/layout/slidebar.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}
.el-menu--vertical:not(.el-menu--collapse) {
  width: 210px;
  min-height: 400px;
}
.el-menu--horizontal {
  height: 100%;
}
.el-menu--horizontal.el-menu {
  border-bottom: none;
}

:deep(.el-menu-item.is-active) {
  background: linear-gradient(90deg, rgba(76, 176, 79, 0) 0%, var(--el-color-primary) 100%);
}
</style>
