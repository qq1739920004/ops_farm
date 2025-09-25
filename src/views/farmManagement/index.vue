<template>
  <div class="app_container">
    <div class="table_container app_card">
      <div class="search_container">
        <div class="input_area">
          <el-input
            v-model="pageInfo.key"
            class="input-with-select"
            @keyup.enter.native="getList"
            clearable
            @clear="getList"
          >
            <template #append>
              <el-button icon="Search" @click="getList" />
            </template>
          </el-input>
        </div>
        <div class="button_area">
          <el-button style="margin-right: 5px" type="primary" @click="newFarm"
            >新建农场</el-button
          >
        </div>
      </div>
      <el-table :data="farmListData" class="date-icon" style="max-width: 100%" stripe>
        <!-- 农场名称列 -->
        <el-table-column prop="name" label="农场名称" align="center" min-width="150" />

        <!-- 地址列 -->
        <el-table-column prop="address" label="地址" align="center" min-width="200" />

        <!-- 创建人列 -->
        <el-table-column prop="creator" label="创建人" align="center" min-width="120" />

        <!-- 创建时间列 -->
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          min-width="180"
        />

        <!-- 操作列 -->
        <el-table-column
          :label="$t('devicelist.operation')"
          align="center"
          :width="locale == 'jp' ? 650 : 475"
        >
          <template #default="scope">
            <div class="operation-buttons">
              <el-button type="primary" text @click="editFarm(scope.row.id)">{{ t("work.edit") }}</el-button>
              <el-button type="primary" text @click="">{{
                t("devicelist.details")
              }}</el-button>
              <el-button type="primary" text @click="">{{ t("work.delete") }}</el-button>
              <el-button
                :style="
                  locale == 'en'
                    ? 'width: 85px'
                    : locale == 'jp'
                    ? 'width:95px'
                    : 'width:65px'
                "
                type="primary"
                text
                @click=""
                >{{ t("farm.enterDp") }}</el-button
              >
              <el-button
                :style="
                  locale == 'en'
                    ? 'width: 85px'
                    : locale == 'jp'
                    ? 'width:95px'
                    : 'width:65px'
                "
                type="primary"
                text
                @click=""
                >{{ t("farm.PicMgt") }}</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :total="total"
        :currentPage="pageInfo.currentPage"
        :pageSize="pageInfo.pageSize"
        @pageChange="currentChange"
      >
      </Pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

import Pagination from "@/components/Pagination/index.vue";
import { reactive, ref, onMounted } from "vue";
import { pageList_API } from "@/api/machineryList/index";
import { useI18n } from "vue-i18n";
const { locale, t } = useI18n();
let $route = useRoute();
const router = useRouter();
const total = ref(0);
const farmListData = ref([]);
const pageInfo = reactive({
  currentPage: 1,
  pageSize: 10,
  key: "",
});
const currentChange = (val: any) => {
  pageInfo.currentPage = val.currentPage;
  pageInfo.pageSize = val.pageSize;
  getList();
};
const getList = async () => {
  const { data } = await pageList_API({
    pageNum: pageInfo.currentPage,
    pageSize: pageInfo.pageSize,
    key: pageInfo.key,
  });
  farmListData.value = data.records;
  total.value = data.total;
};
const newFarm = () => {
  router.push({
    path: "farmManagement/newFarm",
  });
};
const editFarm = (id:any) => {
    router.push({
    path: "farmManagement/editFarm",
    query:{
      id:id
    }
  });
}
onMounted(() => {
  getList();
});
</script>

<style lang="scss" scoped>
.search_container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;

  .input_area {
    .input-with-select {
      width: 290px;
      height: 32px;
      opacity: 1;
      border-radius: 4px;
      margin-right: 20px;
    }

    .m_2 {
      width: 179px;
      height: 32px;
      opacity: 1;
      border-radius: 4px;
    }
  }

  .button_group2 {
    margin-left: 20px;

    .el-button {
      height: 32px;
      font-size: 20px;
      padding: 5px 15px;
    }

    .tab_active {
      color: var(--el-color-primary);
      border-color: var(--el-color-primary);
    }
  }
}
</style>
