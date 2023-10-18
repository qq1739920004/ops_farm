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
          <el-dropdown-item
            :disabled="locale == 'zh-cn'"
            @click="changeLang('zh-cn')"
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
        <span>
          <span>{{ userStore.userInfo.nickName }}</span>
          <el-icon><arrow-down /></el-icon>
        </span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="goUserCenter">用户中心</el-dropdown-item>
          <el-dropdown-item divided @click="drawer = true"
            >主题设置</el-dropdown-item
          >
          <el-dropdown-item @click="logOut" divided>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>

  <!--  -->
  <el-drawer v-model="drawer" :with-header="false">
    <span>主题设置</span>
    <div class="item theme_item">
      <el-divider>主题</el-divider>
      <div>
        <el-switch
          inline-prompt
          v-model="appStore.isDark"
          @change="changeIsDark"
          active-icon="Sunny"
          inactive-icon="Moon"
        />
      </div>
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
  </el-drawer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import useAppStore from "@/store/app";
import useUserStore from "@/store/user";
import { useFullscreen } from "@vueuse/core";
import SvgIcon from "@/components/SvgIcon/index.vue";
const { locale } = useI18n();
const appStore = useAppStore();
const userStore = useUserStore();
const { isFullscreen, toggle } = useFullscreen();
let drawer = ref(false);

// 主题颜色
const themeColors = ref<string[]>([
  "#33B838",
  "#409EFF",
  "#304156",
  "#11a983",
  "#13c2c2",
  "#6959CD",
  "#f5222d",
]);

// 修改主题颜色
function changeThemeColor(arg: string) {
  appStore.updateThemeColor(arg);
}

function changeNavgation(arg: string) {
  appStore.updateLayout(arg);
}
function changeIsDark() {
  appStore.updateIsDark();
}
// 修改语言
function changeLang(value: string) {
  locale.value = value;
  appStore.updateLanguage(value);
}
// 退出登录
function logOut() {
  userStore.clearUserInfo();
  location.href = "/";
}
// 前往用户中心
function goUserCenter() {
  window.open('/ucFrontEnd')
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
    div {
      display: flex;
      img {
        width: 25px;
      }
      span {
        display: flex;
        align-items: flex-end;
        span {
          margin: 0 3px;
        }
      }
    }
  }
}
.el-drawer {
  .theme_item {
    div {
      display: flex;
      justify-content: center;
    }
  }
  .themeColor_item {
    ul {
      display: flex;
      justify-content: center;
      li {
        width: 30px;
        height: 30px;
        margin-left: 12px;
        cursor: pointer;
        border-radius: 3px;
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
