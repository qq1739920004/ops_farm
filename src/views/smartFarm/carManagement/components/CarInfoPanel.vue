<template>
  <div class="car-info-panel">
    <div v-if="loading" class="car-info-panel__loading">
      <el-skeleton :rows="4" animated />
    </div>
    <div v-else-if="!vehicle" class="car-info-panel__empty">
      <el-empty description="请选择车辆" />
    </div>
    <div v-else class="car-info-panel__content">
      <div class="car-info-panel__info">
        <section class="info-section">
          <header class="info-section__header">农机信息</header>
          <div class="info-grid">
            <InfoItem label="车辆名称" :value="vehicle.name" />
            <InfoItem label="车牌" :value="vehicle.licensePlate" />
            <InfoItem label="车辆类型" :value="vehicle.vehicleTypeLabel" />
            <InfoItem label="品牌" :value="vehicle.brand" />
            <InfoItem label="型号" :value="vehicle.model" />
            <InfoItem label="马力" :value="vehicle.power" />
            <InfoItem label="整机编号" :value="vehicle.registrationNo" />
            <InfoItem label="燃料类型" :value="vehicle.fuel" />
            <InfoItem label="购买日期" :value="formatDate(vehicle.buyTime)" />
          </div>
        </section>
        <section class="info-section">
          <header class="info-section__header">终端信息</header>
          <div class="info-grid info-grid--single">
            <InfoItem label="设备SN" :value="vehicle.sn" />
            <InfoItem label="安装日期" :value="formatDate(vehicle.installDate)" />
          </div>
        </section>
      </div>
      <div class="car-info-panel__image">
        <el-image
          :src="vehicle.imageUrl || defaultImage"
          fit="cover"
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
import { defineComponent, h, toRefs } from "vue";
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

const InfoItem = defineComponent({
  name: "CarInfoItem",
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      default: "--",
    },
  },
  setup(props) {
    return () =>
      h("div", { class: "info-item" }, [
        h("span", { class: "info-item__label" }, props.label),
        h(
          "span",
          { class: "info-item__value" },
          props.value !== undefined && props.value !== null && props.value !== ""
            ? props.value
            : "--"
        ),
      ]);
  },
});
</script>

<style scoped lang="scss">
.car-info-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  padding: 16px;
  box-sizing: border-box;
}

.car-info-panel__content {
  display: flex;
  flex: 1;
  gap: 16px;
}

.car-info-panel__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.car-info-panel__image {
  width: 240px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.car-info-panel__img {
  width: 100%;
  height: 100%;
  max-height: 260px;
  border-radius: 12px;
  background-color: #f7f7f7;
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
  gap: 12px 16px;
}

.info-grid--single {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item__label {
  font-size: 13px;
  color: #909399;
}

.info-item__value {
  font-size: 15px;
  color: #303133;
  font-weight: 500;
  word-break: break-all;
}
</style>

