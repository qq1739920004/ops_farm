<template>
  <div class="car-extra-panel">
    <slot />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.car-extra-panel {
  flex: 1;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  padding: 16px;
  box-sizing: border-box;
}
</style>

