<template>
  <div class="app_container">
    <HelloWorld msg="1234656" />
    <el-button @click="changeLang('zh')">中文</el-button>
    <el-button @click="changeLang('en')">英文</el-button>
    <el-button>1235352343</el-button>
    <p>1231</p>
    <p>{{ userStore.nickName }}</p>
    <p>{{ userStore.ddNickname }}</p>
    <p>{{ $t("messages.age") }}</p>
    <img src="@/assets/header.png" alt="">
    <img src="@/assets/header.png" alt="">
    <img src="@/assets/header.png" alt="">
    <p>
    <img src="@/assets/header.png" alt="">

    </p>

  </div>
</template>

<script setup lang="ts">
import { selectUserRecentVisitList_path } from "@/api";
import HelloWorld from "@/components/HelloWorld.vue";
import useUserStore from "@/store/user";
import { useI18n } from "vue-i18n";
const { locale } = useI18n();
const userStore = useUserStore();

userStore.updateNickName("修改了名称123");



function changeLang(value: string) {
  locale.value = value;
}

// userStore.count1()
</script>

<style lang="scss" scoped></style>
