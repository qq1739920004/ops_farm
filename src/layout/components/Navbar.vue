<template>
  <div class="navbar_component">
    <div class="setting-item" @click="toggle">
      <SvgIcon
        color="#fff"
        :icon="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
      />
    </div>
    <el-dropdown class="lang-dropdown">
      <SvgIcon icon="language" size="22" />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :disabled="locale == 'zh'" @click="changeLang('zh')"
            >中文</el-dropdown-item
          >
          <el-dropdown-item
            divided
            :disabled="locale == 'en'"
            @click="changeLang('en')"
            >English</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-dropdown class="avatar-dropdown">
      <div>
        <img src="@/assets/header.png" alt="" />
        <el-icon><arrow-down /></el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>用户中心</el-dropdown-item>
          <el-dropdown-item divided @click="drawer = true"
            >主题设置</el-dropdown-item
          >
          <el-dropdown-item divided>退出登陆</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>

  <!--  -->
  <el-drawer v-model="drawer" :with-header="false">
    <span>主题设置</span>
    <div class="item layout_item">
      <el-divider>导航设置</el-divider>
      <ul class="layout">
        <el-tooltip content="左侧模式" placement="bottom">
          <li
            @click="changeNavgation('vertical')"
            :class="'layout-item layout-left '"
          >
            <div />
            <div />
          </li>
        </el-tooltip>
        <el-tooltip content="顶部模式" placement="bottom">
          <li
            @click="changeNavgation('horizontal')"
            :class="'layout-item layout-top '"
          >
            <div />
            <div />
          </li>
        </el-tooltip>
      </ul>
    </div>
    <div class="item themeColor_item">
      <el-divider>主题颜色</el-divider>
      <ul>
        <li
          v-for="(color, index) in themeColors"
          :key="index"
          :style="{ background: color }"
          @click="changeThemeColor(color)"
        />
      </ul>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import useAppstore from "@/store/app";
import SvgIcon from "@/components/SvgIcon/index.vue";
import { useFullscreen } from "@vueuse/core";
const { locale } = useI18n();
const appStore = useAppstore();
const { isFullscreen, toggle } = useFullscreen();
let drawer = ref(false);

// 主题颜色
const themeColors = ref<string[]>([
  "#67ae5b",
  "#409EFF",
  "#304156",
  "#11a983",
  "#13c2c2",
  "#6959CD",
  "#f5222d",
]);

// 修改主题颜色
function changeThemeColor(arg1: string) {
  appStore.updateThemeSettings("themeColor", arg1);
}

function changeNavgation(arg: string) {
  appStore.updateThemeSettings("layout", arg);
}

function changeLang(value: string) {
  locale.value = value;
}
</script>

<style lang="scss" scoped>
.navbar_component {
  display: flex;
  align-items: center;
  .setting-item {
    margin-right: 8px;
    cursor: pointer;
  }
  .lang-dropdown {
    color: #fff;
    cursor: pointer;
    margin-right: 10px;
  }
  .avatar-dropdown {
    color: #fff;
    cursor: pointer;
    img {
      width: 25px;
    }
  }
}
.el-drawer {
  .themeColor_item {
    ul {
      display:flex;
      justify-content: center;
      li {
        width: 30px;
        height: 30px;
        margin-left: 12px;
        cursor: pointer;
        border-radius:3px;

      }
    }
  }
    .layout {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      width: 100%;
      height: 50px;

      &-item {
        position: relative;
        width: 18%;
        height: 45px;
        overflow: hidden;
        cursor: pointer;
        background: #f0f2f5;
        border-radius: 4px;
      }

      &-item.is-active {
        border: 2px solid var(--el-color-primary);
      }

      &-mix div:nth-child(1) {
        width: 100%;
        height: 30%;
        background: #1b2a47;
        box-shadow: 0 0 1px #888;
      }

      &-mix div:nth-child(2) {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 30%;
        height: 70%;
        background: #1b2a47;
        box-shadow: 0 0 1px #888;
      }

      &-top div:nth-child(1) {
        width: 100%;
        height: 30%;
        background: #1b2a47;
        box-shadow: 0 0 1px #888;
      }

      &-left div:nth-child(1) {
        width: 30%;
        height: 100%;
        background: #1b2a47;
      }

      &-left div:nth-child(2) {
        position: absolute;
        top: 0;
        right: 0;
        width: 70%;
        height: 30%;
        background: #fff;
        box-shadow: 0 0 1px #888;
      }
    }
  
}
</style>
