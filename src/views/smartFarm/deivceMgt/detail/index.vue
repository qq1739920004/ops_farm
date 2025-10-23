<template>
  <div class="app_container">
    <div class="app_card">
      <div class="page-header">
        <h2>{{ isEditMode ? "编辑设备" : "新增设备" }}</h2>
      </div>
      <el-form
        ref="deviceForm"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        class="device-form"
      >
        <!-- 表单第一行 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备序列号" prop="serialNums">
              <el-input
                v-model="formData.serialNums"
                placeholder="请输入设备序列号"
                :disabled="isEditMode"
                clearable
                maxlength="50"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="设备名称" prop="deviceName">
              <el-input
                v-model="formData.deviceName"
                placeholder="请输入设备名称"
                clearable
                maxlength="100"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 表单第二行 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备类型" prop="deviceType">
              <el-select
                v-model="formData.deviceType"
                placeholder="请选择设备类型"
                clearable
              >
                <el-option
                  v-for="(label, value) in deviceTypeMap"
                  :key="value"
                  :label="label"
                  :value="value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="终端类型" prop="termType">
              <el-input-number
                v-model="formData.termType"
                placeholder="请输入终端类型"
                clearable
                maxlength="50"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 表单第三行 -->
        <el-row>
          <!-- <el-col :span="12">
            <el-form-item label="农场" prop="farmId">
              <el-select
                v-model="formData.farmId"
                placeholder="请选择农场"
                @change="handleFarmChange"
                clearable
              >
                <el-option
                  v-for="farm in farms"
                  :key="farm.id"
                  :label="farm.name"
                  :value="farm.id"
                />
              </el-select>
            </el-form-item>
          </el-col> -->

          <el-col :span="12">
            <el-form-item label="地块" prop="blockId">
              <el-select
                v-model="formData.blockId"
                placeholder="请选择地块"
                :disabled="!formData.farmId"
                clearable
              >
                <el-option
                  v-for="block in filteredBlocks"
                  :key="block.id"
                  :label="block.name"
                  :value="block.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 表单第四行 - 经纬度输入 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="纬度" prop="latitude">
              <el-input
                v-model="formData.latitude"
                placeholder="请输入纬度（-90至90之间）"
                clearable
                @input="handleCoordinateInput('latitude')"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="经度" prop="longitude">
              <el-input
                v-model="formData.longitude"
                placeholder="请输入经度（-180至180之间）"
                clearable
                @input="handleCoordinateInput('longitude')"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 表单第五行 -->
        <!-- <el-row>
          <el-col :span="24">
            <el-form-item label="摄像头地址" prop="cameraUrl">
              <el-input
                v-model="formData.cameraUrl"
                placeholder="请输入摄像头URL地址"
                clearable
                maxlength="200"
              />
            </el-form-item>
          </el-col>
        </el-row> -->

        <!-- 表单第六行 -->
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注信息" prop="remark">
              <el-input
                v-model="formData.remark"
                placeholder="请输入备注信息"
                type="textarea"
                rows="3"
                maxlength="500"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 操作按钮 -->
        <el-row>
          <el-col :span="24" class="text-center">
            <el-button type="primary" @click="handleSubmit">
              {{ isEditMode ? "保存修改" : "创建设备" }}
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft } from "@element-plus/icons-vue";
import { ElMessage, ElNotification, ElLoading } from "element-plus";
import { useStorage } from "@vueuse/core";
import { filedPage_API } from "@/api/fieldManagement/indx";
import { useI18n } from "vue-i18n";

import {
  deviceList_API,
  addDevice_API,
  getDetail_API,
  update_API,
} from "@/api/smartFarm/index";
const { t } = useI18n();
// 路由和导航
const route = useRoute();
const router = useRouter();

// 判断是否为编辑模式（存在id参数）
const isEditMode = computed(() => {
  return !!route.query.id;
});

// 设备类型映射
const deviceTypeMap = {
  7: "气象设备",
  8: "灌溉设备",
  9: "田间监测摄像头",
  10: "小虫体智能虫情测报灯",
};

// 农场和地块数据
const farms = ref([]);
const blocks = ref([]);

// 根据选中的农场过滤地块
const filteredBlocks = computed(() => {
  if (!formData.farmId) return [];
  return blocks.value;
});

// 表单数据
const formData = reactive({
  id: "",
  serialNums: "",
  deviceName: "",
  deviceType: null,
  termType: "",
  farmId: useStorage("farmId", ""),
  blockId: null,
  latitude: "",
  longitude: "",
  remark: "",
});

// 自定义纬度验证器
const validateLatitude = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请输入纬度"));
  }

  const num = parseFloat(value);

  if (isNaN(num)) {
    return callback(new Error("请输入有效的数字"));
  }

  if (num < -90 || num > 90) {
    return callback(new Error("纬度值必须在-90到90之间"));
  }

  callback();
};

// 自定义经度验证器
const validateLongitude = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请输入经度"));
  }

  const num = parseFloat(value);

  if (isNaN(num)) {
    return callback(new Error("请输入有效的数字"));
  }

  if (num < -180 || num > 180) {
    return callback(new Error("经度值必须在-180到180之间"));
  }

  callback();
};
// 表单验证规则
const formRules = reactive({
  serialNums: [
    { required: true, message: "请输入设备序列号", trigger: "blur" },
    { max: 50, message: "设备序列号长度不能超过50个字符", trigger: "blur" },
  ],
  deviceName: [
    { required: true, message: "请输入设备名称", trigger: "blur" },
    { max: 100, message: "设备名称长度不能超过100个字符", trigger: "blur" },
  ],
  deviceType: [{ required: true, message: "请选择设备类型", trigger: "change" }],
  termType: [{ required: true, message: "请输入终端类型", trigger: "blur" }],
  farmId: [{ required: true, message: "请选择农场", trigger: "change" }],
  latitude: [
    { required: true, message: "请输入纬度", trigger: "blur" },
    { validator: validateLatitude, trigger: "blur" },
  ],
  longitude: [
    { required: true, message: "请输入经度", trigger: "blur" },
    { validator: validateLongitude, trigger: "blur" },
  ],
  //   cameraUrl: [
  //     { type: "url", message: "请输入有效的URL地址", trigger: "blur", required: false },
  //   ],
});
// 处理经纬度输入，自动过滤非数字字符
const handleCoordinateInput = (field) => {
  formData[field] = formData[field]
    .replace(/[^\d.-]/g, "")
    .replace(/^(\-)*(\d+)\.(\d+)\./g, "$1$2.$3")
    .replace(/^\./g, "")
    .replace(/^(\-)\./g, "$10.")
    .replace(/^0+(\d)/, "$1");
};

// 表单引用
const deviceForm = ref(null);

// 加载农场和地块数据
const loadFarmAndBlockData = async () => {
  try {
    const blockPage = {
      companyId: "",
      keyword: "",
      farmId: formData.farmId,
      currentPage: 1,
      pageSize: 10000,
    };
    const { data } = await filedPage_API(blockPage);
    blocks.value = data.records;
  } catch (error) {
    console.error("加载农场和地块数据失败:", error);
    ElMessage.error("加载农场和地块数据失败，请刷新页面重试");
  } finally {
  }
};

// 加载设备详情（编辑模式）
const loadDeviceDetail = async () => {
  if (!isEditMode.value) return;

  try {
    const deviceId = route.query.id;
    const res = await getDetail_API({ id: route.query.id });

    if (res.code === 0) {
      Object.assign(formData, res.data);
    } else {
      ElMessage.error(`加载失败: ${res.message || "未知错误"}`);
    }
  } catch (error) {}
};

// 农场选择变化时清空地块选择
const handleFarmChange = () => {
  formData.blockId = null;
};
watch(
  () => formData.farmId,
  () => {
    handleFarmChange();
    loadFarmAndBlockData();
  },
  { deep: true }
);
// 提交表单
const handleSubmit = async () => {
  if (!formData.farmId) {
    return ElMessage.warning(t("farm.plzFarmId"));
  }
  // 表单验证
  const valid = await deviceForm.value.validate();
  if (!valid) return;

  try {
    // 模拟API请求
    if (isEditMode.value) {
      await update_API(formData);
      ElMessage({ type: "success", message: t("work.modificationSuccess") });
    } else {
      await addDevice_API(formData);

      ElMessage({ type: "success", message: t("messages.addSuccess") });
    }
  } catch (error) {
    console.error("提交失败:", error);
    ElMessage.error(isEditMode.value ? "更新设备失败" : "创建设备失败");
  }
};

// 返回列表页
const handleBack = () => {
  router.push("/device-list");
};

// 组件挂载时加载数据
onMounted(async () => {
  await loadFarmAndBlockData();

  if (isEditMode.value) {
    await loadDeviceDetail();
  }
});
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px; /* 减少标题下方间距 */
  gap: 12px;
  padding-bottom: 12px;
}

.page-header h2 {
  margin: 0;
  font-size: 18px; /* 减小标题字体 */
  color: #1f2329;
  font-weight: 600;
}

.back-btn {
  padding: 4px 10px; /* 减小按钮尺寸 */
}

.form-card {
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: none;
}

.device-form {
  padding: 16px; /* 减少表单内边距 */
  max-width: 1000px; /* 限制表单最大宽度 */
  margin: 0 auto; /* 居中显示 */
}

/* 限制输入框最大宽度 */

:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  border-radius: 4px;
  height: 32px; /* 减小输入框高度 */

  transition: all 0.2s ease;
}

:deep(.el-input__inner) {
  height: 32px; /* 减小输入框内部高度 */

  font-size: 13px; /* 减小字体大小 */
}

.cancel-btn {
  margin-right: 12px;
}

.text-center {
  text-align: center;
}
</style>
