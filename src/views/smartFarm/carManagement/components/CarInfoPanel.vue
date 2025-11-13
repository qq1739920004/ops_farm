<template>
  <div class="car-info-panel">
    <div v-if="loading" class="car-info-panel__loading">
      <el-skeleton :rows="4" animated />
    </div>
    <div v-else-if="!vehicle" class="car-info-panel__empty">
      <!-- <el-empty description="请选择车辆" /> -->
    </div>
    <div v-else class="car-info-panel__content">
      <div class="car-info-panel__info">
        <section class="info-section">
          <header class="info-section__header">农机信息</header>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-item__label">车辆名称</span>
              <span class="info-item__value">{{ vehicle.name || '--' }}</span>
            </div>
            <div class="info-item">
              <span class="info-item__label">车牌</span>
              <span class="info-item__value">{{ vehicle.licensePlate || '--' }}</span>
            </div>
            <div class="info-item">
              <span class="info-item__label">车辆类型</span>
              <span class="info-item__value">{{ vehicle.vehicleTypeLabel || '--' }}</span>
            </div>
            <div class="info-item">
              <span class="info-item__label">品牌</span>
              <span class="info-item__value">{{ vehicle.brand || '--' }}</span>
            </div>
            <div class="info-item">
              <span class="info-item__label">型号</span>
              <span class="info-item__value">{{ vehicle.model || '--' }}</span>
            </div>
            <div class="info-item">
              <span class="info-item__label">马力</span>
              <span class="info-item__value">{{ vehicle.power || '--' }}</span>
            </div>
            <div class="info-item">
              <span class="info-item__label">整机编号</span>
              <span class="info-item__value">{{ vehicle.registrationNo || '--' }}</span>
            </div>
            <div class="info-item">
              <span class="info-item__label">燃料类型</span>
              <span class="info-item__value">{{ vehicle.fuel || '--' }}</span>
            </div>
            <div class="info-item">
              <span class="info-item__label">购买日期</span>
              <span class="info-item__value">{{ formatDate(vehicle.buyTime) }}</span>
            </div>
          </div>
        </section>
        <section class="info-section">
          <header class="info-section__header">终端信息</header>
          <div class="info-grid info-grid--single">
            <div class="info-item">
              <span class="info-item__label">设备SN</span>
              <span class="info-item__value">{{ vehicle.sn || '--' }}</span>
            </div>
            <div class="info-item">
              <span class="info-item__label">安装日期</span>
              <span class="info-item__value">{{ formatDate(vehicle.installDate) }}</span>
            </div>
          </div>
        </section>
      </div>
      <div class="car-info-panel__image">
        <el-image
          :src="vehicle.imageUrl || defaultImage"
          fit="contain"
          class="car-info-panel__img"
        >
          <template #error>
            <div class="car-info-panel__img-placeholder">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-image>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import { Picture } from "@element-plus/icons-vue";
import startCar from "@/assets/common/car.png";

const props = defineProps<{
  vehicle: Record<string, any> | null;
  loading?: boolean;
}>();

const { vehicle, loading } = toRefs(props);

const defaultImage = startCar;

const formatDate = (value?: string) => {
  if (!value) return "--";
  return value.split(" ")[0];
};
</script>

<style scoped lang="scss">
.car-info-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  padding: 10px 10px;
  box-sizing: border-box;
}

.car-info-panel__content {
  display: flex;
  flex: 1;
  gap: 16px;
  align-items: stretch;
  height: 100%;
  min-height: 0;
}

.car-info-panel__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
}

.car-info-panel__image {
  width: 220px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  height: 100%;
  align-self: stretch;
  overflow: visible;
}

.car-info-panel__img {
  width: 100%;
  height: 100%;
  max-height: 100%;
  background-color: #f7f7f7;
}

:deep(.car-info-panel__img .el-image__inner) {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.car-info-panel__img-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #c0c4cc;
  font-size: 32px;
}

.car-info-panel__loading,
.car-info-panel__empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-section__header {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px 16px;
}

.info-grid--single {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
}

.info-item__label {
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
  position: relative;
  padding-right: 4px;
}

.info-item__label::after {
  content: '：';
  position: absolute;
  right: 0;
}

.info-item--single .info-item__label::after {
  content: '：';
}

.info-item__value {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
  line-height: 1.6;
  word-break: break-all;
}
</style>

