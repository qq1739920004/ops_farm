<template>
  <div class="navbar_component">
    <el-dropdown class="lang-dropdown">
      <div>
        <span>中文</span>
        <el-icon><arrow-down /></el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="changeLang('zh')">中文</el-dropdown-item>
          <el-dropdown-item @click="changeLang('en')">English</el-dropdown-item>
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
          <el-dropdown-item @click="drawer = true">主题设置</el-dropdown-item>
          <el-dropdown-item >退出登陆</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>

  <!--  -->
  <el-drawer v-model="drawer" title="I am the title" :with-header="false">
    <span>主题设置</span>
    <div class="item">
      <el-divider>导航设置</el-divider>

      <ul class="layout">
        <el-tooltip content="左侧模式" placement="bottom">
          <li @click="changeNavgation('vertical')" :class="'layout-item layout-left '">
            <div />
            <div />
          </li>
        </el-tooltip>
        <el-tooltip content="顶部模式" placement="bottom">
          <li @click="changeNavgation('horizontal')"  :class="'layout-item layout-top '">
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
import useAppstore from '@/store/app'
const { locale } = useI18n();
const appStore = useAppstore()

let drawer = ref(false);

function changeNavgation(arg: string) {
  drawer.value = !drawer.value 
  appStore.updateThemeSettings('layout',arg)

}

function changeLang(value: string) {
  locale.value = value;
}
</script>

<style lang="scss" scoped>
.navbar_component {
  display: flex;
  align-items: center;
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
