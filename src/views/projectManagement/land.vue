<template>
  <div class="app_container app_card">
    <el-table :data="landList">
      <el-table-column :label="t('project.landName')" prop="area"> </el-table-column>
      <el-table-column :label="t('message.detail')" prop="areaJson" min-width="300" align="center">
      </el-table-column>

      <el-table-column :label="t('message.operate')"  align="center">
        <template #="{ row }">
          <el-button v-auth="2007" @click="deleteLand(row.id)" text type="danger">{{
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
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessageBox } from "element-plus";
import { landList_API, deleteLand_API } from "@/api/project";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import { useRoute } from "vue-router";
const route = useRoute();
const total = ref<number>(0);
const landList = ref<any[]>([]);
onMounted(() => {
  getLandList();
});
const listParams = reactive<any>({
  currentPage: 1,
  pageSize: 10,
  projectId: route.params.id,
});
const getLandList = async () => {
  const { data } = await landList_API(listParams);
  total.value = data.total;
  landList.value = data.records;
};
const currentChange = (val: any) => {
  listParams.currentPage = val.currentPage;
  listParams.pageSize = val.pageSize;
  getLandList();
};
const deleteLand = async (id: number) => {
  ElMessageBox.confirm(t("tip.deleteLand"), t("message.tip"), {
    confirmButtonText: t("message.confirm"),
    cancelButtonText: t("message.cancel"),
    type: "warning",
    center: true,
    confirmButtonClass: "delete-confirm-btn",
  })
    .then(async () => {
      const params={
        id,
        projectId:route.params.id
      }
      await deleteLand_API(params);
      getLandList();
    })
    .catch(() => {});
};
</script>
<style lang="scss" scoped></style>
