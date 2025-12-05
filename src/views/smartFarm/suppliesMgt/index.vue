<template>
  <div class="supplies-management-page">
    <div class="supplies-management-page__header">
      <div class="supplies-management-page__search">
        <el-input
          v-model="searchForm.keyword"
          :placeholder="t('supplies.searchPlaceholder')"
          clearable
          style="width: 300px"
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        />
        <el-select
          v-model="searchForm.type"
          :placeholder="t('supplies.allTypes')"
          clearable
          style="width: 150px"
          @change="handleSearch"
          @clear="handleSearch"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        
        <el-button type="primary" @click="handleSearch" :loading="loading.list">
          <el-icon><Search /></el-icon>
          {{ t('work.search') }}
        </el-button>
      </div>
      <el-button type="primary" @click="handleCreate">
        {{ t('supplies.newSupplies') }}
      </el-button>
    </div>

    <div class="supplies-management-page__table">
      <el-table
        v-loading="loading.list"
        :data="suppliesList"
        stripe
        height="calc(100% - 100px)"
      >
        <el-table-column :label="t('supplies.suppliesImage')" align="center" min-width="100">
          <template #default="{ row }">
            <div class="image-container">
              <el-image
                v-if="row.imageUrl"
                :src="row.imageUrl"
                style="width: 60px; height: 60px"
                fit="cover"
                :preview-src-list="[row.imageUrl]"
                preview-teleported
              />
              <div v-else class="no-image">{{ t('supplies.noImage') }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" :label="t('supplies.suppliesName')" align="center" min-width="80" />
        <el-table-column prop="stockQuantity" :label="t('supplies.stock')" align="center" min-width="120">
          <template #default="{ row }">
            {{ row.stockQuantity || 0 }} kg
          </template>
        </el-table-column>
        <el-table-column prop="type" :label="t('supplies.type')" align="center" min-width="100">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.type)">
              {{ getTypeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="productionEnterprise" :label="t('supplies.manufacturer')" align="center" min-width="120" />
        <el-table-column prop="operateTime" :label="t('work.creationTime')" align="center" min-width="140">
          <template #default="{ row }">
            {{ formatDate(row.operateTime) }}
          </template>
        </el-table-column>
        <el-table-column :label="t('supplies.stockFlow')" align="center" min-width="110">
          <template #default="{ row }">
            <el-button 
              type="primary" 
              text 
              @click="handleViewFlow(row)"
              :disabled="!row.stockFlowCount"
            >
              {{ row.stockFlowCount || 0 }}{{ t('supplies.records') }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column 
          :label="t('work.operation')" 
          align="center" 
          min-width="160" 
          fixed="right"
        >
          <template #default="{ row }">
            <div class="operation-buttons">
              <el-button type="primary" text @click="handleInStock(row)">
                {{ t('supplies.inStock') }}
              </el-button>
              <el-button type="primary" text @click="handleOutStock(row)">
                {{ t('supplies.outStock') }}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="supplies-management-page__pagination">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 新建农资对话框 -->
    <el-dialog
      v-model="dialogVisible.create"
      :title="t('supplies.newSupplies')"
      width="800px"
      center
      @close="resetForm"
    >
      <div class="create-form-container">
        <div class="create-form-left">
          <el-form
            ref="createFormRef"
            :model="createForm"
            :rules="createRules"
            label-width="120px"
          >
            <el-form-item :label="t('supplies.type')" prop="type">
              <el-select v-model="createForm.type" :placeholder="t('work.pleaseSelect')" style="width: 100%">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('supplies.suppliesName')" prop="name"  >
              <el-input v-model="createForm.name" :placeholder="t('supplies.enterSuppliesName')" />
            </el-form-item>
            <el-form-item :label="t('supplies.manufacturer')">
              <el-input v-model="createForm.productionEnterprise" :placeholder="t('supplies.enterManufacturer')" />
            </el-form-item>
          </el-form>
        </div>
        <div class="create-form-right">
          <div class="upload-image-area">
            <el-upload
              accept=".png,.jpg,.jpeg"
              class="supplies-uploader"
              action=""
              :http-request="handleUpload"
              :show-file-list="false"
              :on-change="handleImageChange"
              :before-upload="checkFileType"
            >
              <div class="upload-content">
                <div v-if="createForm.imageUrl" class="image-preview">
                  <el-image
                    style="width: 280px; height: 200px"
                    :src="createForm.imageUrl"
                    fit="cover"
                  />
                  <div class="edit-overlay">
                    <el-icon><Edit /></el-icon>
                  </div>
                </div>
                <div v-else class="upload-placeholder">
                  <el-icon :size="40"><Plus /></el-icon>
                  <div>{{ t('supplies.uploadImage') }}</div>
                </div>
              </div>
            </el-upload>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="dialogVisible.create = false">{{ t('work.cancel') }}</el-button>
        <el-button type="primary" @click="handleSubmitCreate" :loading="loading.create">
          {{ t('work.submit') }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 入库对话框 -->
    <el-dialog
      v-model="dialogVisible.inStock"
      :title="`${t('supplies.inStock')} - ${currentSupplies?.name || ''}`"
      width="500px"
      center
      @close="resetStockForm"
    >
      <el-form
        ref="inStockFormRef"
        :model="stockForm"
        :rules="stockRules"
        label-width="120px"
        style="padding: 0 20px"
      >
        <el-form-item :label="t('supplies.inStockAmount')" prop="quantity">
          <el-input-number
            v-model="stockForm.quantity"
            :min="0.01"
            :step="1"
            :precision="2"
            style="width: 200px"
            :placeholder="t('supplies.enterAmount')"
          />
          <span style="margin-left: 8px; color: #909399">{{ currentSupplies?.unit || 'kg' }}</span>
        </el-form-item>
        <el-form-item :label="t('supplies.operator')" prop="operator">
          <el-input v-model="stockForm.operator" :placeholder="t('supplies.enterOperator')" />
        </el-form-item>
        <el-form-item :label="t('supplies.remark')">
          <el-input
            v-model="stockForm.remark"
            type="textarea"
            :rows="3"
            :placeholder="t('supplies.enterRemark')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible.inStock = false">{{ t('work.cancel') }}</el-button>
        <el-button type="primary" @click="handleSubmitInStock" :loading="loading.inStock">
          {{ t('supplies.confirmInStock') }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 出库对话框 -->
    <el-dialog
      v-model="dialogVisible.outStock"
      :title="`${t('supplies.outStock')} - ${currentSupplies?.name || ''}`"
      width="500px"
      center
      @close="resetStockForm"
    >
      <el-form
        ref="outStockFormRef"
        :model="stockForm"
        :rules="stockRules"
        label-width="120px"
        style="padding: 0 20px"
      >
        <el-form-item :label="t('supplies.currentStock')">
          <span style="font-weight: bold">
            {{ currentSupplies?.stockQuantity || 0 }} kg
          </span>
        </el-form-item>
        <el-form-item :label="t('supplies.outStockAmount')" prop="quantity">
          <el-input-number
            v-model="stockForm.quantity"
            :min="0.01"
            :max="currentSupplies?.stockQuantity || 0"
            :precision="2"
            :step="1"
            style="width: 100%"
            :placeholder="t('supplies.enterAmount')"
          />
          <span style="margin-left: 8px; color: #909399">kg</span>
        </el-form-item>
        <el-form-item :label="t('supplies.operator')" prop="operator">
          <el-input v-model="stockForm.operator" :placeholder="t('supplies.enterOperator')" />
        </el-form-item>
        <el-form-item :label="t('supplies.remark')">
          <el-input
            v-model="stockForm.remark"
            type="textarea"
            :rows="3"
            :placeholder="t('supplies.enterRemark')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible.outStock = false">{{ t('work.cancel') }}</el-button>
        <el-button type="primary" @click="handleSubmitOutStock" :loading="loading.outStock">
          {{ t('supplies.confirmOutStock') }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 库存流水对话框 -->
    <el-dialog
      v-model="dialogVisible.flow"
      :title="`${t('supplies.stockFlowDetail')} - ${currentSupplies?.name || ''}`"
      width="800px"
      center
    >
      <el-table
        v-loading="loading.flow"
        :data="flowList"
        stripe
        max-height="400px"
      >
        <el-table-column prop="flowType" :label="t('supplies.flowType')" width="100">
          <template #default="{ row }">
            <el-tag :type="row.flowType === 1 ? 'success' : 'warning'">
              {{ row.flowType === 1 ? t('supplies.inStock') : t('supplies.outStock') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" :label="t('supplies.amount')" width="120">
          <template #default="{ row }">
            {{ row.flowType === 1 ? '+' : '-' }}{{ row.quantity }} kg
          </template>
        </el-table-column>
        <el-table-column prop="operator" :label="t('supplies.operator')" width="100" />
        <el-table-column prop="operateTime" :label="t('work.time')" width="180">
          <template #default="{ row }">
            {{ formatDate(row.operateTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" :label="t('supplies.remark')" min-width="150" show-overflow-tooltip />
      </el-table>
      
      <div v-if="flowPagination.total > 0" class="flow-pagination-container">
        <el-pagination
          v-model:current-page="flowPagination.currentPage"
          v-model:page-size="flowPagination.pageSize"
          :page-sizes="[10, 20, 30]"
          :total="flowPagination.total"
          layout="total, prev, pager, next"
          background
          @current-change="handleFlowPageChange"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { useStorage } from '@vueuse/core';
import { Search, Plus, Edit } from '@element-plus/icons-vue';
import {
  getSuppliesList_API,
  createSupplies_API,
  inStockSupplies_API,
  outStockSupplies_API,
  getSuppliesFlow_API,
  uploadSuppliesImg_API,
} from '@/api/suppliesMgt/index';

const { t } = useI18n();
const farmIdStorage = useStorage('farmId', '');

// 响应式数据
const searchForm = reactive({
  keyword: '',
  type: undefined as number | undefined,
});

const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0,
});

const flowPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
});

const loading = reactive({
  list: false,
  create: false,
  inStock: false,
  outStock: false,
  flow: false,
});

const dialogVisible = reactive({
  create: false,
  inStock: false,
  outStock: false,
  flow: false,
});

const suppliesList = ref<any[]>([]);
const flowList = ref<any[]>([]);
const currentSupplies = ref<any>(null);
const uploadedImageFile = ref<File | null>(null);

// 表单数据
const createForm = reactive({
  type: undefined as number | undefined,
  name: '',
  productionEnterprise: '', // 生产企业（可选）
  imageUrl: '', // 图片URL
});

const stockForm = reactive({
  quantity: 0,
  operator: '',
  remark: '',
});

// 表单引用
const createFormRef = ref();
const inStockFormRef = ref();
const outStockFormRef = ref();

// 类型选项（根据API文档：1种子、2农药、3肥料、4其他）
const typeOptions = [
  { value: 1, label: t('supplies.seed') },
  { value: 2, label: t('supplies.pesticide') },
  { value: 3, label: t('supplies.fertilizer') },
  { value: 4, label: t('supplies.other') },
];

// 表单验证规则
const createRules = {
  type: [{ required: true, message: t('work.enterValue'), trigger: 'change' }],
  name: [{ required: true, message: t('work.enterValue'), trigger: 'blur' }],
  // productionEnterprise 是可选的，不需要验证
};

const stockRules = {
  quantity: [
    { required: true, message: t('work.enterValue'), trigger: 'blur' },
    { type: 'number', min: 0.01, message: t('supplies.amountMustGreaterThanZero'), trigger: 'blur' }
  ],
  operator: [
    { required: true, message: t('work.enterValue'), trigger: 'blur' }
  ],
};

// 计算属性和方法
const getTypeLabel = (type: number) => {
  const option = typeOptions.find(item => item.value === type);
  return option?.label || type;
};

const getTypeTagType = (type: number) => {
  // 1种子、2农药、3肥料、4其他
  const typeMap: Record<number, string> = {
    1: 'primary',    // 种子 - 蓝色primary
    2: 'primary',     // 农药 - 红色danger
    3: 'primary',    // 肥料 - 绿色success
    4: 'primary',       // 其他 - 灰色info
  };
  return typeMap[type] || 'info';
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleString('zh-CN');
};

// 事件处理方法
const handleSearch = () => {
  pagination.currentPage = 1;
  fetchSuppliesList();
};

const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  pagination.currentPage = 1;
  fetchSuppliesList();
};

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page;
  fetchSuppliesList();
};

const handleCreate = () => {
  dialogVisible.create = true;
};

const handleInStock = (row: any) => {
  currentSupplies.value = row;
  dialogVisible.inStock = true;
};

const handleOutStock = (row: any) => {
  currentSupplies.value = row;
  dialogVisible.outStock = true;
};

const handleViewFlow = (row: any) => {
  currentSupplies.value = row;
  flowPagination.currentPage = 1;
  dialogVisible.flow = true;
  fetchFlowList();
};

const handleFlowPageChange = (page: number) => {
  flowPagination.currentPage = page;
  fetchFlowList();
};

const resetForm = () => {
  createForm.type = undefined;
  createForm.name = '';
  createForm.productionEnterprise = '';
  createForm.imageUrl = '';
  uploadedImageFile.value = null;
  createFormRef.value?.clearValidate();
};

const resetStockForm = () => {
  stockForm.quantity = 0;
  stockForm.operator = '';
  stockForm.remark = '';
  inStockFormRef.value?.resetFields();
  outStockFormRef.value?.resetFields();
};

const handleImageChange = async (file: any) => {
  // validate file type
  const pass = checkFileType(file);
  if (pass === false) return false;
  // preview immediately
  createForm.imageUrl = URL.createObjectURL(file.raw);
  uploadedImageFile.value = file.raw;
  // upload immediately
  try {
    if (uploadedImageFile.value) {
      const formData = new FormData();
      formData.append('file', uploadedImageFile.value);
      const { data } = await uploadSuppliesImg_API(formData);
      createForm.imageUrl = data;
    }
  } catch (e) {
    ElMessage.error(t('supplies.uploadImageFailed') || 'Upload image failed');
  }
  return true;
};

const handleUpload = () => {};

const checkFileType = (file: any) => {
  const fileName = file.name || '';
  const fileType = fileName.substring(fileName.lastIndexOf('.'));
  const allowTypes = [".png", ".jpg", ".jpeg"];
  if (!allowTypes.includes(fileType.toLowerCase())) {
    ElMessage.error(t('supplies.pleaseSelectImage') || 'Please select an image (.png/.jpg/.jpeg)');
    return false;
  }
  return true;
};

const handleSubmitCreate = async () => {
  try {
    await createFormRef.value?.validate();
    loading.create = true;
    
    const payload = {
      ...createForm,
      farmId: Number(farmIdStorage.value),
    };
    await createSupplies_API(payload);
    ElMessage.success(t('messages.addSuccess'));
    
    dialogVisible.create = false;
    resetForm();
    fetchSuppliesList();
  } catch (error) {
    console.error('Create supplies failed:', error);
  } finally {
    loading.create = false;
  }
};

const handleSubmitInStock = async () => {
  try {
    await inStockFormRef.value?.validate();
    loading.inStock = true;
    
    await inStockSupplies_API({
      amId: currentSupplies.value.id,
      quantity: stockForm.quantity,
      operator: stockForm.operator,
      remark: stockForm.remark,
    });
    ElMessage.success(t('supplies.inStockSuccess'));
    
    dialogVisible.inStock = false;
    resetStockForm();
    fetchSuppliesList();
  } catch (error) {
    console.error('In stock failed:', error);
  } finally {
    loading.inStock = false;
  }
};

const handleSubmitOutStock = async () => {
  try {
    await outStockFormRef.value?.validate();
    
    if (stockForm.quantity > (currentSupplies.value?.stockQuantity || 0)) {
      ElMessage.error(t('supplies.outStockExceedsStock'));
      return;
    }
    
    loading.outStock = true;
    
    await outStockSupplies_API({
      amId: currentSupplies.value.id,
      quantity: stockForm.quantity,
      operator: stockForm.operator,
      remark: stockForm.remark,
    });
    ElMessage.success(t('supplies.outStockSuccess'));
    
    dialogVisible.outStock = false;
    resetStockForm();
    fetchSuppliesList();
  } catch (error) {
    console.error('Out stock failed:', error);
  } finally {
    loading.outStock = false;
  }
};

// 数据获取方法
const fetchSuppliesList = async () => {
  try {
    loading.list = true;
    
    const params = {
      farmId: Number(farmIdStorage.value),
      name: searchForm.keyword || undefined,
      type: searchForm.type || undefined,
      current: pagination.currentPage,
      size: pagination.pageSize,
    };
    
    const response = await getSuppliesList_API(params);
    suppliesList.value = response.data?.records || [];
    pagination.total = response.data?.total ?? 0;
  } catch (error) {
    console.error('Fetch supplies list failed:', error);
    ElMessage.error(t('supplies.fetchListFailed'));
  } finally {
    loading.list = false;
  }
};

const fetchFlowList = async () => {
  try {
    loading.flow = true;
    
    const params = {
      amId: currentSupplies.value.id,
      current: flowPagination.currentPage,
      size: flowPagination.pageSize,
    };
    
    const { data } = await getSuppliesFlow_API(params);
    flowList.value = data?.records || [];
    flowPagination.total = data?.total ?? 0;
  } catch (error) {
    console.error('Fetch flow list failed:', error);
    ElMessage.error(t('supplies.fetchFlowFailed'));
  } finally {
    loading.flow = false;
  }
};

// 监听农场切换
watch(
  () => farmIdStorage.value,
  () => {
    pagination.currentPage = 1;
    fetchSuppliesList();
  }
);

onMounted(() => {
  fetchSuppliesList();
});
</script>

<style scoped lang="scss">
.supplies-management-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  background-color: var(--el-bg-color-page);
}

.supplies-management-page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.supplies-management-page__search {
  display: flex;
  align-items: center;
  gap: 12px;
}

.supplies-management-page__table {
  flex: 1;
  background-color: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  min-height: 0;
}

.supplies-management-page__pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding: 16px 0;
}

.image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 4px 0;
}

.no-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
  color: var(--el-text-color-placeholder);
  font-size: 12px;
}

.operation-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0px;
  flex-wrap: wrap;
}

.flow-pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding: 10px 0;
}

.create-form-container {
  display: flex;
  gap: 20px;
  padding: 0 20px;
}

.create-form-left {
  flex: 1;
}

.create-form-right {
  width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-image-area {
  width: 100%;
}

.supplies-uploader {
  width: 100%;
  
  :deep(.el-upload) {
    width: 100%;
  }
}

.upload-content {
  width: 100%;
  cursor: pointer;
}

.image-preview {
  position: relative;
  width: 280px;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  
  &:hover .edit-overlay {
    opacity: 1;
  }
}

.edit-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  
  .el-icon {
    color: white;
    font-size: 24px;
  }
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 280px;
  height: 200px;
  border: 2px dashed var(--el-border-color);
  border-radius: 8px;
  background-color: var(--el-fill-color-light);
  transition: all 0.3s;
  
  &:hover {
    border-color: var(--el-color-primary);
    background-color: var(--el-fill-color);
  }
  
  .el-icon {
    color: var(--el-text-color-placeholder);
    margin-bottom: 8px;
  }
  
  div {
    color: var(--el-text-color-regular);
    font-size: 14px;
  }
}

.avatar-uploader {
  .image-preview {
    position: relative;
    cursor: pointer;
    
    &:hover .image-overlay {
      opacity: 1;
    }
  }
  
  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
    border-radius: 4px;
    
    .el-icon {
      color: white;
      font-size: 20px;
    }
  }
  
  .upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 150px;
    border: 2px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    transition: border-color 0.3s;
    
    &:hover {
      border-color: var(--el-color-primary);
    }
    
    .el-icon {
      font-size: 28px;
      color: var(--el-text-color-placeholder);
      margin-bottom: 8px;
    }
    
    div {
      color: var(--el-text-color-regular);
      font-size: 14px;
    }
  }
}
</style>