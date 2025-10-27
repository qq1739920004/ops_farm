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
            <div class="route_select">
              <div v-if="showSelect" class="select-container">
                <el-select
                  v-if="dataReady"
                  style="width: 200px"
                  v-model="selectedValue"
                  placeholder="请选择农场"
                 
                >
                  <el-option
                    v-for="farm in selectOptions"
                    :key="farm.id"
                    :value="farm.id"
                    :label="farm.name"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
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
  <div v-if="appStore.device == 'mobile'" class="app-layout-mobile">
    <el-container>
      <el-header height="50px">
        <SvgIcon @click="changeDrawerVisible" icon="exit-fold" color="#fff" size="24" />
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
import { watchEffect, ref, watch, onMounted } from "vue";
import SlideBar from "./components/SlideBar/index.vue";
import Navbar from "./components/Navbar.vue";
import SvgIcon from "@/components/SvgIcon/index.vue";
import Breadcrumb from "./components/Breadcrumb/index.vue";
import { farmList_API } from "@/api/fieldManagement/indx";
import AppMain from "./components/AppMain.vue";
import { useWindowSize } from "@vueuse/core";
import useAppStore from "@/store/app";
// import usePermissionStore from "@/store/permission";
// const permissionStore = usePermissionStore();
import { useRoute } from "vue-router";
import { useStorage } from "@vueuse/core";
onMounted(() => {
   if(localStorage.getItem('isBlock') ==='true'){
      getFarmList();
    }
  
});
const selectedValue = useStorage('farmId', '', localStorage, {
  serializer: {
    read: (v) => {
      if (v === '' || v === null || v === undefined) return ''
      const num = Number(v)
      return isNaN(num) ? '' : num
    },
    write: (v) => {
      if (v === '' || v === null || v === undefined) return ''
      return String(v)
    }
  }
})
const dataReady = ref(false);
// 在组件或组合式函数中
const route = useRoute();
const appStore = useAppStore();
const { width } = useWindowSize();
const WIDTH = 750;
const showSelect = ref(false); // 是否显示单选框
const selectOptions = ref<any>([]);

// 检查路由是否以 smartFarm 开头
const checkRoute = () => {
  showSelect.value = route.path.startsWith("/smartFarm");
};
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
watch(
  () => route.path,
  () => {
    checkRoute();
  },
  { deep: true }
);
async function getFarmList() {
  try {
    const { data } = await farmList_API();
    selectOptions.value = data;
    selectedValue.value = selectOptions.value[0].id
    setTimeout(() => {
    dataReady.value = true;
  }, 10);
  } catch {}  
}
checkRoute();

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
      background-image: url("@/assets/layout/navbar.png");
      background-repeat: no-repeat;
      background-position: center center;
      background-size: contain;
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
.route_select {
  color: #fff;
}

.select-container {
  :deep(.el-select__wrapper) {
    background-color: transparent;
    color: #fff;
  }
  :deep(.el-select__selected-item) {
    color: #fff;
  }
}
</style>
