<!--  -->
<template>
  <el-table :data="props.paddyWorkList" stripe>
    <el-table-column
      type="index"
      :label="$t('devicelist.item')"
      width="80"
      align="center"
    />
    <el-table-column :label="$t('work.project')" prop="name" align="center">
    </el-table-column>
    <el-table-column :label="$t('devicelist.type')" align="center">
      <template #="{ row }">
        <el-tag
          round
          style="
            color: rgba(0, 125, 117, 1);
            width: 50px;
            height: 23px;
            background-color: rgba(168, 232, 227, 1);
            border: none;
          "
        >
          {{ workTypeReflect[row.worktype] || "/" }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column :label="$t('work.acreage')" align="center">
      <template #="{ row }"> {{ row.workedArea }}{{ $t("work.are") }}</template>
    </el-table-column>
    <el-table-column :label="$t('work.acTime')" align="center">
      <template #="{ row }"> {{ row.paddyDuration }}</template>
    </el-table-column>
    <el-table-column :label="$t('job.milerage')+'(km)'" align="center">
      <template #="{ row }"> {{ (row.workMileage / 1000).toFixed(2) }}</template>
    </el-table-column>
    <el-table-column :label="$t('work.location')" prop="position" align="center">
    </el-table-column>

    <el-table-column label="SN" prop="sn" align="center"> </el-table-column>
    <el-table-column :label="$t('devicelist.labelSN')" prop="npn" align="center">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <el-icon>
            <MapLocation
              style="color: var(--el-color-primary); width: 16px; height: 16px"
            />
          </el-icon>
          <span style="margin-left: 10px">{{ scope.row.npn }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column :label="$t('devicelist.name')" prop="userName" align="center">
    </el-table-column>
    <el-table-column :label="$t('devicelist.tel')" prop="tel" align="center">
    </el-table-column>
    <el-table-column :label="$t('work.projectTime')" align="center" width="200px">
      <template #="{ row }">
        <el-row justify="center">
          {{ row.createtime }}
        </el-row>
        <el-row justify="center">
          {{ row.updatetime }}
        </el-row>
      </template>
    </el-table-column>
    <!-- <el-table-column :label="$t('work.vehicle')" prop="carName" align="center">
    </el-table-column> -->
  </el-table>
  <slot></slot>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps(["paddyWorkList"]);
const workTypeReflect = reactive<any>({
  1: t("devicelist.status1"),
  2: t("devicelist.status2"),
  3: t("devicelist.status3"),
  4: t("devicelist.status4"),
  5: t("devicelist.status5"),
  6: t("devicelist.status6"),
});
</script>

<style lang="scss" scoped></style>
