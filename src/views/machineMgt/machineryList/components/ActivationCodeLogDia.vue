<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('devicelist.codeRecord')"
    width="1000px"
    :close-on-click-modal="false"
  >
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="sn" :label="$t('devicelist.sn')" min-width="150" align="center" />
      <!-- <el-table-column prop="npn" label="NPN" width="180" align="center" /> -->
      <el-table-column prop="codeType" :label="$t('devicelist.codeType')" min-width="100" align="center">
        <template #default="{ row }">
            {{ row.codeType }}
        </template>
      </el-table-column>
      <el-table-column prop="registerDays" :label="$t('devicelist.registrationDuration')" min-width="100" align="center">
          <template #default="{ row }">
            {{ row.registerDays === -1 ? $t('devicelist.expiredNow') : (row.registerDays === 65535 ? $t('devicelist.permanent') : row.registerDays) }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="registerDays" label="注册时长" width="100" align="center">
      </el-table-column> -->
      <el-table-column prop="operatorName" :label="$t('devicelist.operator')" min-width="120" align="center" />
      <el-table-column prop="createTime" :label="$t('devicelist.operateTime')" min-width="180" align="center">
          <template #default="{ row }">
            {{ row.createTime ? dayjs(row.createTime).format("YYYY-MM-DD HH:mm:ss") : '' }}
          </template>
      </el-table-column>
      <el-table-column prop="operateStatus" label="状态" align="center" />
      <el-table-column prop="remark" label="备注" min-width="180" align="center" show-overflow-tooltip />
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { getActivationCodeLog_API } from "@/api/machineryList/index";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const dialogVisible = ref(false);
const tableData = ref([]);
const loading = ref(false);

const open = (sn: string) => {
  dialogVisible.value = true;
  getList(sn);
};

const getList = async (sn: string) => {
  loading.value = true;
  try {
    const res = await getActivationCodeLog_API({ sn });
    if (res.code === 0) {
      tableData.value = res.data;
    }
  } finally {
    loading.value = false;
  }
};

defineExpose({
  open,
});
</script>

<style scoped>
</style>
