<template>
  <div class="app_container">
    <div class="app_card">
      <div class="search_container">
        <div class="button_area">
          <el-button v-auth="2003" type="primary" @click="newDeviceVisible = true">{{
            t("project.newDevice")
          }}</el-button>
        </div>
      </div>
      <el-table :data="deviceList">
        <!-- <el-table-column
        type="name"
        :label="t('devicelist.item')"
        width="60"
        align="center"
      /> -->

        <el-table-column label="SN" prop="sn" align="center"> </el-table-column>

        <el-table-column :label="t('message.operate')" align="center">
          <template #="{ row }">
            <el-button v-auth="2005" type="primary" text @click="toSendTask(row.id)">{{
              t("project.sendTask")
            }}</el-button>
            <el-button v-auth="2005" type="warning" text @click="pauseTask(row.id)">{{
              t("project.pauseTask")
            }}</el-button>
            <el-button v-auth="2004" @click="deleteDevice(row.id)" text type="danger">{{
              t("message.delete")
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :total="total"
        :currentPage="listParams.currentPage"
        :pageSize="listParams.pageSize"
        @pageChange="currentChange"
      >
      </Pagination>
    </div>

    <newDevice v-model:visible="newDeviceVisible" @refresh="getDeviceList"> </newDevice>
    <sendTask
      v-model:visible="sendTaskVisible"
      :id="currentDeviceId"
      @refresh="getDeviceList"
    >
    </sendTask>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { deviceList_API, updateDevice_API,deleteDevice_API } from "@/api/project";
import newDevice from "./components/newDevice.vue";
import sendTask from "./components/sendTask.vue";
import { ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
const route = useRoute();
const { t } = useI18n();
const total = ref<number>(0);
const listParams = reactive<any>({
  currentPage: 1,
  pageSize: 10,
  projectId: route.params.id,
});
const newDeviceVisible = ref<boolean>(false);
const sendTaskVisible = ref<boolean>(false);
const deviceList = ref<any[]>([]);
onMounted(() => {
  getDeviceList();
});
const currentDeviceId = ref<number>();
const toSendTask = (id: number) => {
  currentDeviceId.value = id;
  console.log(currentDeviceId.value);
  sendTaskVisible.value = true;
};
const pauseTask = async (id: number) => {
  const sendTaskForm = {
    id,
    taskTime: 0,
  };
  await updateDevice_API(sendTaskForm);
  getDeviceList();
};
const deleteDevice = (id: number) => {
  ElMessageBox.confirm(t("tip.deleteDevice"), t("message.tip"), {
    confirmButtonText: t("message.confirm"),
    cancelButtonText: t("message.cancel"),
    type: "warning",
    center: true,
    customClass:'delete-confirm-container',
    confirmButtonClass:'delete-confirm-btn'
  })
    .then(async () => {
        await deleteDevice_API(id)
        getDeviceList();
    })
    .catch(() => {});
};
const getDeviceList = async () => {
  const { data } = await deviceList_API(listParams);
  total.value = data.total;
  deviceList.value = data.records;
};
const currentChange = (val: any) => {
  listParams.currentPage = val.currentPage;
  listParams.pageSize = val.pageSize;
  getDeviceList();
};
</script>
<style lang="scss" scoped>
.button_area {
  float: right;
}
</style>
