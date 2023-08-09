<template>
  <div class="app_container">
    <el-button type="primary" icon="Plus">123</el-button>
    <el-icon>
      <Delete />
    </el-icon>

    <SvgIcon size="200" icon="vue"></SvgIcon>

    <SvgIcon color="red" icon="language"></SvgIcon>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SvgIcon from "@/components/SvgIcon/index.vue";
let num = ref(0);
console.log(num.value);
</script>

<style lang="scss" scoped></style>
