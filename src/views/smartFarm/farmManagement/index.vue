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
            >{{ t('farm.newFarm') }}</el-button
          >
        </div>
      </div>
      <el-table :data="farmListData" class="date-icon" style="max-width: 100%" stripe>
        <!-- 农场名称列 -->

        <el-table-column prop="name" :label="t('farm.farmName')" align="center" min-width="150" />

        <!-- 地址列 -->
        <el-table-column prop="address" :label="t('farm.address')" align="center" min-width="200" />

        <!-- 创建人列 -->
        <el-table-column prop="creator" :label="t('farm.creator')" align="center" min-width="120" />

        <!-- 创建时间列 -->
        <el-table-column
          prop="createTime"
          :label="t('farm.createTime')"
          align="center"
          min-width="180"
        />

        <!-- 操作列 -->
        <el-table-column
          :label="$t('devicelist.operation')"
          align="center"
          :width="locale == 'jp' ? 750 : 575"
        >
          <template #default="scope">
            <div class="operation-buttons">
              <el-button type="primary" text @click="editFarm(scope.row.id)">{{
                t("work.edit")
              }}</el-button>
              <el-button type="primary" text @click="gotoDetails(scope.row.id)">{{
                t("devicelist.details")
              }}</el-button>
              <el-button type="primary" text @click="deleteFarm(scope.row.id)">{{
                t("work.delete")
              }}</el-button>
              <el-button
                type="primary"
                text
                @click="openDialog(scope.row.companyId, scope.row.id, scope.row.name)"
                >{{ t('farm.issue') }}</el-button
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
                @click="openExternalLink(scope.row.id)"
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
              <el-button
                type="primary"
                text
                @click="openViewModeDialog(scope.row.id, scope.row.name, scope.row.viewMode)"
                >显示模式</el-button
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
    <!-- 弹窗组件 -->
    <el-dialog
      v-model="dialogVisible"
      :title="t('farm.issue')"
      width="500px"
      @close="handleClose"
      center
    >
      <el-select
        v-model="selectedIds"
        multiple
        filterable
        clearable
        :placeholder="t('farm.selectVehicles')"
      >
        <el-option
          v-for="vehicle in vehicleList"
          :key="vehicle.id"
          :label="vehicle.name"
          :value="vehicle.id"
        />
      </el-select>

      <template #footer>
        <el-button @click="dialogVisible = false">{{ t('work.cancel') }}</el-button>
        <el-button type="primary" @click="handleDownload">{{ t('farm.confirmIssue') }}</el-button>
      </template>
    </el-dialog>

    <!-- 显示模式弹窗 -->
    <el-dialog
      v-model="viewModeDialogVisible"
      title="大屏模式设置"
      width="400px"
      @close="handleViewModeClose"
      center
    >
      <div style="padding: 20px 0; display: flex; justify-content: center;">
        <el-radio-group v-model="selectedViewMode" class="vertical-radio-group">
          <el-radio :label="1" class="radio-item">
            模式一
          </el-radio>
          <el-radio :label="2" class="radio-item">
            模式二
          </el-radio>
        </el-radio-group>
      </div>

      <template #footer>
        <el-button @click="viewModeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleViewModeConfirm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import Pagination from "@/components/Pagination/index.vue";
import { reactive, ref, onMounted } from "vue";
import { pageList_API, deleteFarm_API } from "@/api/machineryList/index";
import { getCarList_API, pushFarm_API, updateFarm_API } from "@/api/fieldManagement/indx";
import { useI18n } from "vue-i18n";
const { locale, t } = useI18n();
let $route = useRoute();
const router = useRouter();
const total = ref(0);
const farmId = ref();
const farmName = ref();
const selectedIds = ref([]);
const farmListData = ref([]);
const pageInfo = reactive({
  currentPage: 1,
  pageSize: 10,
  key: "",
});
const dialogVisible = ref(false);

// 显示模式弹窗相关变量
const viewModeDialogVisible = ref(false);
const currentFarmId = ref();
const currentFarmName = ref();
const selectedViewMode = ref(1);

const vehicleList = ref<any>([]);
const openDialog = (companyId: any, id: any, name: any) => {
  dialogVisible.value = true;
  getCarList(id);
  farmId.value = id;
  farmName.value = name;
};
const handleClose = () => {
  selectedIds.value = [];
  farmId.value = "";
  farmName.value = "";
};
const openExternalLink = (id: any) => {
  const currentBaseUrl = window.location.protocol + "//" + window.location.host;
  const baseUrl = "http://140.207.166.210:9030";
  // 2. 拼接目标路径（/farmScreen/dashboard）
  let targetUrl;
  if (window.location.host.toLowerCase().includes("localhost")) {
    targetUrl = baseUrl + `/farmScreen/dashboard?farmId=${id}`;
  } else {
    targetUrl = currentBaseUrl + `/farmScreen/dashboard?farmId=${id}`;
  }

  // 3. 新开窗口跳转（窗口名称自定义，尺寸可选）
  window.open(targetUrl, "_blank");
};
// 处理下载逻辑
const handleDownload = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning(t("farm.selectAtLeastOne"));
    return;
  }

  try {
    await pushFarm_API({
      vehicleIds: selectedIds.value,
      id: farmId.value,
      farmName: farmName.value,
    });
    ElMessage.success(t("work.issueSuccess"));
    // 关闭弹窗
    dialogVisible.value = false;
    // 清空选择
    selectedIds.value = [];
  } catch {}
};
const getCarList = async (id: any) => {
  const res = await getCarList_API({
    farmId: id,
  });
  vehicleList.value = res.data;
};

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
const gotoDetails = (id: any) => {
  router.push({
    path: "farmManagement/details",
    query: {
      id: id,
    },
  });
};
const editFarm = (id: any) => {
  router.push({
    path: "farmManagement/editFarm",
    query: {
      id: id,
    },
  });
};
const deleteFarm = (id: any) => {
  ElMessageBox.confirm(t("farm.deleteFarm"), "Warning", {
    confirmButtonText: t("work.submit"),
    cancelButtonText: t("work.cancel"),
    type: "warning",
  })
    .then(async () => {
      try {
        await deleteFarm_API({ id: id });
        ElMessage.success(t("work.deleteSuccess"));
        pageInfo.currentPage = 1;

        pageInfo.pageSize = 10;
        pageInfo.key = "";
        getList();
      } catch {}
    })
    .catch(() => {});
};

// 显示模式相关函数
const openViewModeDialog = (id: any, name: any, currentMode: any) => {
  currentFarmId.value = id;
  currentFarmName.value = name;
  selectedViewMode.value = currentMode || 1;
  viewModeDialogVisible.value = true;
};

const handleViewModeClose = () => {
  currentFarmId.value = "";
  currentFarmName.value = "";
  selectedViewMode.value = 1;
};

const handleViewModeConfirm = async () => {
  try {
    await updateFarm_API({
      id: currentFarmId.value,
      viewMode: selectedViewMode.value
    });
    ElMessage.success("显示模式更新成功");
    viewModeDialogVisible.value = false;
    handleViewModeClose();
    getList(); // 刷新列表
  } catch (error) {
    ElMessage.error("显示模式更新失败");
  }
};

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

// 显示模式弹窗样式
.vertical-radio-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .radio-item {
    margin-right: 0 !important; // 覆盖Element Plus默认的右边距
    margin-bottom: 20px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
