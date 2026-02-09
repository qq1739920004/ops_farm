<template>
  <el-dialog
    v-model="dialogVisible"
    title="取码记录"
    width="700px"
    :close-on-click-modal="false"
  >
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="sn" label="SN" min-width="150" align="center" />
      <!-- <el-table-column prop="npn" label="NPN" width="180" align="center" /> -->
      <el-table-column prop="codeType" label="取码类型" min-width="100" align="center">
        <template #default="{ row }">
            {{ row.codeType }}
        </template>
      </el-table-column>
      <el-table-column prop="registerDays" label="注册时长" min-width="100" align="center">
          <template #default="{ row }">
            {{ row.registerDays === -1 ? '立即过期' : (row.registerDays === 65535 ? '永久' : row.registerDays) }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="registerDays" label="注册时长" width="100" align="center">
      </el-table-column> -->
      <el-table-column prop="operatorName" label="操作人" min-width="120" align="center" />
      <el-table-column prop="createTime" label="操作时间" min-width="180" align="center">
          <template #default="{ row }">
            {{ row.createTime ? dayjs(row.createTime).format("YYYY-MM-DD HH:mm:ss") : '' }}
          </template>
      </el-table-column>
      <!-- <el-table-column prop="operateStatus" label="状态" align="center" /> -->
      <!-- <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip /> -->
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { getActivationCodeLog_API } from "@/api/machineryList/index";
import dayjs from "dayjs";

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
