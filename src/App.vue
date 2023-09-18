<template>
  <el-config-provider :locale="appStore.locale">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { ElConfigProvider } from "element-plus";
import useAppstore from "@/store/app";
const appStore = useAppstore()

</script>

<style scoped lang="scss"></style>
