<template>
  <div class="car-extra-panel">
    <VehicleJobStatsTab :vehicle="vehicle" :active="true" />
  </div>
</template>

<script setup lang="ts">
import VehicleJobStatsTab from './VehicleJobStatsTab.vue'

defineProps<{ vehicle: any }>()
</script>

<style scoped lang="scss">
.car-extra-panel {
  flex: 1;
  height: 100%;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  padding:0 16px;
  box-sizing: border-box;
}
</style>

