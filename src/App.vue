<template>
  <el-config-provider :locale="appStore.locale">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { ElConfigProvider } from "element-plus";
import useAppStore from "@/store/app";
const appStore = useAppStore()

</script>

<style scoped lang="scss"></style>
