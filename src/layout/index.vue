<template>
  <!-- 宽屏 -->
  <div v-if="appStore.device == 'desktop'" class="app-layout-desktop">
    <!-- 竖屏 -->
    <el-container v-if="appStore.layout == 'vertical'">
      <SlideBar :collapse="collapse" />
      <el-container>
        <el-header height="50px">
          <div class="header_content">
            <SvgIcon
              @click="changeCollapse"
              cursor="pointer"
              :icon="collapse ? 'exit-fold' : 'fold'"
              color="#fff"
              size="24"
            />
            <Breadcrumb />
          </div>

          <Navbar />
        </el-header>
        <el-main>
          <AppMain />
        </el-main>
      </el-container>
    </el-container>
    <!-- 横屏 -->
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
        <SvgIcon
          @click="changeDrawerVisible"
          icon="exit-fold"
          color="#fff"
          size="24"
        />
        <Navbar />
      </el-header>
      <el-main> <AppMain /></el-main>
    </el-container>
    <el-drawer direction="ltr" v-model="drawerVisible" :with-header="false">
      <SlideBar @handleChange="changeDrawerVisible" />
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { watchEffect, ref } from "vue";
import SlideBar from "./components/SlideBar/index.vue";
import Navbar from "./components/Navbar.vue";
import SvgIcon from "@/components/SvgIcon/index.vue";
import Breadcrumb from "./components/Breadcrumb/index.vue";
import AppMain from "./components/AppMain.vue";
import { useWindowSize } from "@vueuse/core";
import useAppStore from "@/store/app";

const appStore = useAppStore();
const { width } = useWindowSize();
const WIDTH = 750;

let drawerVisible = ref(false);
let collapse = ref(false);

watchEffect(() => {
  if (WIDTH > width.value) {
    // 小屏
    appStore.updateDevice("mobile");
  } else {
    appStore.updateDevice("desktop");
  }
});

function changeDrawerVisible() {
  drawerVisible.value = !drawerVisible.value;
}

function changeCollapse() {
  collapse.value = !collapse.value;
}
</script>

<style lang="scss" scoped>
.app-layout-mobile {
  height: 100%;
  .el-container {
    height: 100%;
    .el-header {
      background-color: var(--app-menu-color);
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
    flex: 1;
    .el-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: var(--app-menu-color);
      background-image: url('@/assets/layout/navbar.png');
      background-repeat: no-repeat;
      background-position: center center;
      background-size:contain;
      .header_content {
        display: flex;
        align-items: center;
        .svg-icon {
          margin-right: 16px;
        }
      }
    }
  }
}
.el-main {
  height: 100%;
  padding: 0;
}
</style>
