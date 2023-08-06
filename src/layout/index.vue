<template>
  <!-- 宽屏 -->
  <div v-if="appStore.device == 'desktop'" class="app-layout-desktop">
    <el-container v-if="appStore.themeSettings.navigation == 'left'">
      <SlideBar :collapse="collapse" />
      <el-container>
        <el-header height="50px">
          <div>
            <Hamburger @click="changeCollapse" />
            <!-- <Breadcrumb /> -->
          </div>
          <Navbar />
        </el-header>
        <el-main>
          <AppMain />
        </el-main>
      </el-container>
    </el-container>
    <el-container v-else>
      <el-header height="50px">
        <SlideBar />
        <Navbar />
      </el-header>
      <el-main>
        <!-- <Breadcrumb /> -->
        <AppMain />
      </el-main>
    </el-container>
  </div>
  <!-- 小屏 -->
  <div v-else class="app-layout-mobile">
    <el-container>
      <el-header height="50px">
        <Hamburger @click="changeMenu" />
        <Navbar />
      </el-header>
      <el-main> <AppMain /></el-main>
    </el-container>
    <el-drawer direction="ltr" v-model="drawer" :with-header="false">
      <SlideBar @handleChange="slideBarHandleChange" />
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { watchEffect, ref } from "vue";
import SlideBar from "./components/SlideBar/index.vue";
import Hamburger from "./components/Hamburger/index.vue";
import Navbar from "./components/Navbar.vue";
// import Breadcrumb from "./components/Breadcrumb/index.vue";
import AppMain from "./components/AppMain.vue";
import { useWindowSize } from "@vueuse/core";
import useAppStore from "@/store/app";

const appStore = useAppStore();
const { width } = useWindowSize();
const WIDTH = 750;

let drawer = ref(false);
let collapse = ref(false);

watchEffect(() => {
  if (WIDTH > width.value) {
    // 小屏
    appStore.updateDevice("mobile");
  } else {
    appStore.updateDevice("desktop");
  }
});

function changeMenu() {
  drawer.value = true;
}
function slideBarHandleChange() {
  drawer.value = !drawer.value;
}

function changeCollapse() {
  collapse.value = !collapse.value;
}
</script>

<style lang="scss" scoped>
.app-layout-mobile {
  .el-container {
    .el-header {
      background-color: #1f222c;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  :deep(.el-drawer) {
    width: 210px !important;
    .el-drawer__body {
      padding: 0;
      .el-menu {
        height: 100%;
      }
    }
  }
}
.app-layout-desktop {
  height: 100%;
  .el-container {
    height: 100%;
    .el-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #1f222c;
    }
  }
}
.el-main {
  padding: 0;
}
</style>
