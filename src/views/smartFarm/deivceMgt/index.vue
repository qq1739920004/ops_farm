<!--  -->
<template>
  <div class="app_container">
    <div class="table_container app_card">
      <div class="device-table-container">
        <!-- 表格标题和操作区 -->
        <div class="table-header">
          <el-input
            style="width: 260px"
            v-model="keyword"
            @keyup.enter.native="loadData"
            clearable
            @clear="loadData"
          >
            <template #append>
              <el-button icon="Search" @click="loadData" />
            </template>
          </el-input>

          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            {{ $t('deviceMgt.addDevice') }}
          </el-button>
        </div>
        <div class="table-scroll-container">
          <!-- 设备表格 -->
          <el-table stripe :data="tableData" style="width: 100%; margin-bottom: 20px">
            <el-table-column
              type="index"
              width="80"
              :label="$t('work.item')"
              align="center"
            />
            <el-table-column prop="serialNums" :label="$t('deviceMgt.deviceSN')" min-width="120" />
            <el-table-column prop="deviceName" :label="$t('deviceMgt.deviceName')" min-width="120" />
            <el-table-column prop="deviceType" :label="$t('deviceMgt.deviceType')" min-width="120">
              <template #default="scope">
                {{ formatDeviceType(scope.row.deviceType) }}
              </template>
            </el-table-column>
            <!-- <el-table-column prop="termType" label="终端类型" >
            <template #default="scope">
              {{ scope.row.termType }}
            </template>
          </el-table-column> -->
            <el-table-column prop="farmName" :label="$t('deviceMgt.farmName')" min-width="120" />
            <el-table-column prop="blockName" :label="$t('deviceMgt.fieldName')" min-width="120" />
            <el-table-column :label="$t('deviceMgt.location')" min-width="120">
              <template #default="scope">
                <div v-if="scope.row.latitude && scope.row.longitude">
                  {{ scope.row.latitude.toFixed(6) }},
                  {{ scope.row.longitude.toFixed(6) }}
                </div>
                <div v-else>{{ $t('deviceMgt.notSet') }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="cameraUrl" :label="$t('deviceMgt.cameraAddress')" min-width="120">
              <template #default="scope">
                <el-link
                  v-if="scope.row.cameraUrl"
                  :href="scope.row.cameraUrl"
                  target="_blank"
                >
                  {{ $t('deviceMgt.view') }}
                </el-link>
                <span v-else>{{ $t('deviceMgt.none') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="creator" :label="$t('deviceMgt.creator')" min-width="120" />
            <el-table-column prop="createTime" :label="$t('deviceMgt.createdTime')" min-width="120" />
            <el-table-column prop="modifier" :label="$t('deviceMgt.updatedBy')" min-width="120" />
            <el-table-column prop="modifyTime" :label="$t('deviceMgt.updatedTime')" min-width="120" />
            <el-table-column :label="$t('work.operation')" align="center" min-width="220">
              <template #default="scope">
                <el-button
                  type="success"
                  size="small"
                  @click="handleEdit(scope.row)"
                  style="margin-left: 5px"
                  text
                >
                  {{ $t('deviceMgt.edit') }}
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  @click="handleDelete(scope.row)"
                  style="margin-left: 5px"
                  text
                >
                  {{ $t('deviceMgt.delete') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <Pagination
          :total="total"
          :currentPage="currentPage"
          :pageSize="pageSize"
          @pageChange="currentChange"
        >
        </Pagination>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { deviceList_API ,delete_API} from "@/api/smartFarm/index";
import { useStorage } from "@vueuse/core";
import { useRouter } from "vue-router";
const router = useRouter();
// 表格数据相关
const tableData = ref<any>([]);
const total = ref(0);
const loading = ref(false);
const keyword = ref("");
const farmId = useStorage("farmId", "");

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const currentChange = (val: any) => {
  currentPage.value = val.currentPage;
  pageSize.value = val.pageSize;
  loadData();
};
// 设备类型映射
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const deviceTypeMap = {
  7: "气象设备",
  8: "田间监测摄像头",
  9: "小虫体智能虫情测报灯",
  10: "灌溉设备",
};

// // 终端类型映射
// const termTypeMap = {
//   0: "未知",
//   1: "有线",
//   2: "无线",
//   3: "4G",
//   4: "5G",
// };

// 格式化设备类型
const formatDeviceType = (type) => {
  return deviceTypeMap[type] || `${t('deviceMgt.unknown')}(${type})`;
};

// // 格式化终端类型
// const formatTermType = (type) => {
//   return termTypeMap[type] || `未知(${type})`;
// };

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    const id = Number(farmId.value) || '';
    const res = await deviceList_API({
      currentPage: currentPage.value,
      pageSize: pageSize.value,
      keyword: keyword.value,
      farmId: id,
      companyId: "",
    });

    tableData.value = res.data.records;
    total.value = res.data.total;
  } catch (error) {
    console.error(t('deviceMgt.loadFailed'), error);
    ElMessage.error(t('deviceMgt.loadFailed'));
  } finally {
    loading.value = false;
  }
};

watch(
  () => farmId.value,
  () => {
    loadData();
  },
  { deep: true }
);

// 操作按钮事件
const handleAdd = () => {
  // 新增设备逻辑
  router.push({ path: "/smartFarm/deivceMgt/detail" });
};

const handleEdit = (row) => {
  // 编辑设备
  router.push({ path: "/smartFarm/deivceMgt/detail", query: { id: row.id } });
};

const handleDelete = (row) => {
  // 删除设备确认
  ElMessageBox.confirm(t('deviceMgt.confirmDelete'), t('deviceMgt.confirmDeleteDevice'), {
    confirmButtonText: t('deviceMgt.confirm'),
    cancelButtonText: t('deviceMgt.cancel'),
    type: "warning",
  })
    .then(async() => {
   await delete_API({id:row.id})
      ElMessage.success(t('deviceMgt.deleteSuccess'));
      loadData(); // 重新加载数据
    })
    .catch(() => {
      // 取消删除
      ElMessage.info(t('deviceMgt.cancelDelete'));
    });
};

// 组件挂载时加载数据
onMounted(() => {
  loadData();
});
</script>

<style scoped>
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-header h2 {
  margin: 0;
  font-size: 18px;
  color: #1f2329;
}
/* 关键：添加水平滚动容器样式 */
.table-scroll-container {
  width: 100%;
  overflow-x: auto; /* 允许水平滚动 */
  -webkit-overflow-scrolling: touch; /* 优化移动端滚动体验 */
} /* 可选：添加滚动条样式美化 */
.table-scroll-container::-webkit-scrollbar {
  height: 6px;
}

.table-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-scroll-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.table-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
