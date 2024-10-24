<template>
  <div class="app_container">
    <div class="app_card">
      <div class="search_container">
        <!-- <div class="input_area"></div> -->
        <div class="button_area">
          <el-button v-auth="1999" type="primary" @click="toNewProject()">{{
            t("project.newProject")
          }}</el-button>
        </div>
      </div>
      <el-table :data="projectList">
        <el-table-column
          type="index"
          :label="t('devicelist.item')"
          width="60"
          align="center"
        />
        <el-table-column :label="t('project.projectName')" prop="projectName">
        </el-table-column>
        <el-table-column
          :label="t('message.creator')"
          prop="createName"
          width="110"
          align="center"
        >
        </el-table-column>

        <el-table-column
          :label="t('message.remark')"
          prop="remark"
          align="center"
          width="160"
        >
        </el-table-column>

        <el-table-column :label="t('message.operate')" width="475" align="center">
          <template #="{ row }">
            <el-button
              v-auth="1997"
              type="primary"
              text
              @click="router.push(`/projectManagement/device/${row.id}`)"
              >{{ t("menus.deviceManage") }}</el-button
            >
            <el-button
              v-auth="1998"
              type="primary"
              text
              @click="router.push(`/projectManagement/land/${row.id}`)"
              >{{ t("menus.landManage") }}</el-button
            >
            <el-button v-auth="2000" type="primary" text @click="toNewProject(row)">{{
              t("message.edit")
            }}</el-button>
            <el-button v-auth="2001" @click="deleteProject(row.id)" text type="danger">{{
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

    <newProject
      v-model:visible="newProjectVisible"
      :data="projectData"
      @refresh="getProjectList"
    >
    </newProject>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { projectList_API,deleteProject_API } from "@/api/project";
import { useI18n } from "vue-i18n";
import newProject from "./components/newProject.vue";
import { ElMessageBox } from "element-plus";
const { t } = useI18n();
import { useRouter } from "vue-router";
const router = useRouter();
const projectList = ref<any[]>([]);
const newProjectVisible = ref<boolean>(false);
const projectData = ref<any>({});
const total = ref<number>(0);
const listParams = reactive<any>({
  currentPage: 1,
  pageSize: 10,
});
onMounted(() => {
  getProjectList();
});
const getProjectList = async () => {
  const { data } = await projectList_API(listParams);
  total.value = data.total;
  projectList.value = data.records;
};
const currentChange = (val: any) => {
  listParams.currentPage = val.currentPage;
  listParams.pageSize = val.pageSize;
  getProjectList();
};
const toNewProject = (row?: any) => {
  newProjectVisible.value = true;
  projectData.value = row || {};
};
const deleteProject = (id: number) => {
  ElMessageBox.confirm(t("tip.deleteProject"), t("message.tip"), {
    confirmButtonText: t("message.confirm"),
    cancelButtonText: t("message.cancel"),
    type: "warning",
    center: true,
    customClass:'delete-confirm-container',
    confirmButtonClass:'delete-confirm-btn'
  })
    .then(async () => {
        await deleteProject_API(id)
      getProjectList();
    })
    .catch(() => {});
};
</script>
<style lang="scss" scoped>
.button_area {
  float: right;
}
:deep(.delete-confirm-container){
    .delete-confirm-btn{
        background-color: var(--danger-color)!important;
    }
}
</style>
