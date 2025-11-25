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
          <header class="info-section__header">
            <span>{{ t('work.vehicleInfo') }}</span>
            <img 
              src="@/assets/common/edit_pen (1).png" 
              alt="编辑" 
              class="edit-icon"
              @click="emitEdit"
            />
          </header>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-item__label">{{ t('work.vehicleName') }}</span>
              <span class="info-item__value">{{ vehicle.name || '--' }}</span>
            </div>
            <div class="info-item">
              <span class="info-item__label">{{ t('work.licensePlate') }}</span>
              <span class="info-item__value">{{ vehicle.licensePlate || '--' }}</span>
            </div>
            <div class="info-item">
              <span class="info-item__label">{{ t('work.vehicleType') }}</span>
              <span class="info-item__value">{{ vehicle.vehicleTypeLabel || '--' }}</span>
            </div>
            <div class="info-item">
              <span class="info-item__label">{{ t('work.brand') }}</span>
              <span class="info-item__value">{{ vehicle.brand || '--' }}</span>
            </div>
            <div class="info-item">
              <span class="info-item__label">{{ t('work.model') }}</span>
              <span class="info-item__value">{{ vehicle.model || '--' }}</span>
            </div>
            <div class="info-item">
              <span class="info-item__label">{{ t('work.power') }}</span>
              <span class="info-item__value">{{ vehicle.power || '--' }}</span>
            </div>
            <div class="info-item">
              <span class="info-item__label">{{ t('work.registrationNo') }}</span>
              <span class="info-item__value">{{ vehicle.registrationNo || '--' }}</span>
            </div>
            <div class="info-item">
              <span class="info-item__label">{{ t('work.fuelType') }}</span>
              <span class="info-item__value">{{ vehicle.fuel || '--' }}</span>
            </div>
            <div class="info-item">
              <span class="info-item__label">{{ t('work.purchaseDate') }}</span>
              <span class="info-item__value">{{ formatDate(vehicle.buyTime) }}</span>
            </div>
          </div>
        </section>
        <section class="info-section">
          <header class="info-section__header">{{ t('work.terminalInfo') }}</header>
          <div class="info-grid info-grid--single">
            <div class="info-item">
              <span class="info-item__label">SN</span>
              <span class="info-item__value">{{ vehicle.sn || '--' }}</span>
            </div>
            <div class="info-item">
              <span class="info-item__label">{{ t('work.installDate') }}</span>
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
import { useI18n } from "vue-i18n";
import { Picture } from "@element-plus/icons-vue";
import startCar from "@/assets/common/car.png";

const { t } = useI18n();

const props = defineProps<{
  vehicle: Record<string, any> | null;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", value: any): void;
}>();

const { vehicle, loading } = toRefs(props);

const defaultImage = startCar;

const formatDate = (value?: string) => {
  if (!value) return "--";
  return value.split(" ")[0];
};

const emitEdit = () => {
  if (props.vehicle) {
    emit("edit", props.vehicle);
  }
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
  display: flex;
  align-items: center;
  gap: 16px;
}

.edit-icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.7;
  }
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
  font-size: 14px;
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

