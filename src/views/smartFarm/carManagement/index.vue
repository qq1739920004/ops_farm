<template>
  <div class="car-management-page">
    <div class="car-management-page__main">
      <div class="car-management-page__left">
        <CarListPanel
          v-model:searchForm="searchForm"
          :cars="displayCars"
          :loading="loading.list"
          :finished="pagination.finished"
          :active-id="selectedCarId"
          @search="handleSearch"
          @create="addCars"
          @select="handleSelect"
          @loadMore="handleLoadMore"
        />
      </div>
      <div class="car-management-page__right">
        <div class="car-management-page__right-top">
          <CarInfoPanel :vehicle="displayVehicle" :loading="loading.detail" @edit="handleEdit" />
        </div>
        <div class="car-management-page__right-bottom">
          <CarExtraPanel :vehicle="displayVehicle" />
        </div>
      </div>
    </div>

    <el-dialog
      class="car-management-dialog"
      v-model="dialogVisible"
      :title="isEdit ? t('work.edit') : t('work.newVehicles')"
      width="920px"
      center
      @close="closeDia"
    >
      <div class="form_area">
        <div class="form_left">
          <el-form
            ref="carFormRef"
            :validate-on-rule-change="false"
            :rules="rules"
            :inline="true"
            label-position="right"
            label-width="160px"
            :model="carParams"
            style="max-width: 1012px; margin-bottom: 20px"
          >
            <!-- 农场选择已注释,自动从全局状态获取 -->
            <!-- <el-form-item :label="t('work.farmName')" prop="farmId">
              <el-select
                style="width: 192px"
                v-model="carParams.farmId"
                :placeholder="t('work.pleaseSelect')"
                clearable
              >
                <el-option
                  v-for="farm in farmOptions"
                  :key="farm.id"
                  :label="farm.name"
                  :value="farm.id"
                />
              </el-select>
            </el-form-item> -->
            <el-form-item :label="t('work.vehicleName')" prop="name">
              <el-input v-model="carParams.name"></el-input>
            </el-form-item>
            <el-form-item :label="t('work.brand')" prop="brand">
              <el-input v-model="carParams.brand"></el-input>
            </el-form-item>
            <el-form-item :label="t('work.model')" prop="model">
              <el-input v-model="carParams.model"></el-input>
            </el-form-item>
            <el-form-item :label="t('work.bindDevice')" prop="carId">
              <el-select-v2
                style="width: 192px"
                filterable
                clearable
                v-model="carParams.carId"
                :options="optionsList"
                :placeholder="t('work.pleaseSelect')"
              />
            </el-form-item>
            <el-form-item :label="t('work.vehicleType')" prop="vehicleType">
              <el-cascader
                style="width: 192px"
                v-model="carParams.vehicleType"
                :options="vehicle"
                :props="cascaderProps"
                clearable
              />
            </el-form-item>
            <el-form-item :label="t('work.buyTime')" prop="buyTime">
              <el-date-picker
                style="width: 192px"
                v-model="carParams.buyTime"
                type="datetime"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                clearable
              />
            </el-form-item>
            <el-form-item :label="t('work.licensePlate')" prop="licensePlate">
              <el-input v-model="carParams.licensePlate"></el-input>
            </el-form-item>
            <el-form-item :label="t('work.registrationNo')" prop="registrationNo">
              <el-input v-model="carParams.registrationNo"></el-input>
            </el-form-item>
            <!-- <el-form-item :label="t('work.age')" prop="age">
              <el-input v-model="carParams.age"></el-input>
            </el-form-item> -->
            <el-form-item :label="t('work.powefr')" prop="power">
              <el-input v-model="carParams.power"></el-input>
            </el-form-item>
            <el-form-item :label="t('work.fuel')" prop="fuel">
              <el-input v-model="carParams.fuel"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="uploadImg_area">
          <div class="image_area">
            <el-upload
              accept=".png"
              class="avatar-uploader"
              action=""
              :http-request="Upload"
              :show-file-list="false"
              :on-change="handleChange"
              :before-upload="checkFileType"
            >
              <div>
                <div v-if="carParams.imageUrl" class="img_upload">
                  <el-image
                    class="el_img"
                    style="width: 450px; height: 300px"
                    :src="carParams.imageUrl"
                    preview-teleported="true"
                    fit="scale-down"
                  />
                  <div class="edit_img">
                    <img src="@/assets/common/edit.png" alt="" />
                  </div>
                </div>
                <div v-else class="img_upload">
                  <el-image
                    class="el_img"
                    style="width: 450px; height: 300px"
                    :src="startCar"
                    preview-teleported="true"
                    fit="scale-down"
                  />
                  <div class="edit_img">
                    <img src="@/assets/common/edit.png" alt="" />
                  </div>
                </div>
              </div>
            </el-upload>
          </div>
          <!-- <div class="addImg">
            <el-button type="primary" @click="uploadImg">{{ t('work.addPic') }}</el-button>
          </div> -->
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="addVehicle">
            {{ isEdit ? t('work.edit') : t('work.newVehicles') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useStorage } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import CarListPanel from './components/CarListPanel.vue';
import CarInfoPanel from './components/CarInfoPanel.vue';
import CarExtraPanel from './components/CarExtraPanel.vue';
import {
  pageVehicle_API,
  uploadImg_API,
  getBindSnVO_API,
  addVehicle_API,
  detail_API,
} from '@/api/carManagement/index';
import { updateVehicle_API } from '@/api/carManagement/index';
import { sysDict_API } from '@/api/fieldManagement/indx'; // farmList_API 已不再需要
import startCar from '@/assets/common/car.png';

const { t } = useI18n();
const farmIdStorage = useStorage("farmId", "");

const searchForm = reactive({
  name: '',
  sn: '',
});

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  finished: false,
});

const loading = reactive({
  list: false,
  detail: false,
});

const dialogVisible = ref(false);
const isEdit = ref(false);
const carFormRef = ref();
const trueImg = ref<File | null>(null);

const vehicle = ref<any[]>([]);
// const farmOptions = ref<any[]>([]); // 不再需要,农场ID自动从全局状态获取
const optionsList = ref<any[]>([]);
const carList = ref<any[]>([]);
const selectedCarId = ref<string | number | null>(null);
const vehicleDetail = ref<any | null>(null);

const carParams = reactive<any>({
  id: '',
  farmId: '',
  carId: '',
  name: '',
  brand: '',
  model: '',
  licensePlate: '',
  registrationNo: '',
  age: '',
  power: '',
  fuel: '',
  imageUrl: '',
  companyId: '',
  vehicleType: [],
  buyTime: '',
});

const cascaderProps = {
  value: 'bizKey',
  label: 'bizValue',
  children: 'children',
  checkStrictly: true,
};

const flattenVehicleType = computed(() => {
  const map = new Map<string, string>();
  const traverse = (nodes: any[]) => {
    nodes?.forEach((node) => {
      map.set(String(node.bizKey), node.bizValue);
      if (node.children?.length) {
        traverse(node.children);
      }
    });
  };
  traverse(vehicle.value || []);
  return map;
});

const getVehicleTypeLabel = (value: any) => {
  if (value === null || value === undefined || value === '') {
    return '';
  }
  const key = Array.isArray(value) ? value[value.length - 1] : value;
  return flattenVehicleType.value.get(String(key)) || '';
};

const displayCars = computed(() =>
  carList.value.map((item) => ({
    ...item,
    vehicleTypeLabel:
      getVehicleTypeLabel(item.vehicleType) || item.vehicleTypeName || '--',
  }))
);

const displayVehicle = computed(() => {
  if (!vehicleDetail.value) return null;
  const installDate =
    vehicleDetail.value.installDate ||
    vehicleDetail.value.installTime ||
    vehicleDetail.value.bindTime ||
    vehicleDetail.value.install_date;
  return {
    ...vehicleDetail.value,
    vehicleTypeLabel:
      getVehicleTypeLabel(vehicleDetail.value.vehicleType) ||
      vehicleDetail.value.vehicleTypeName,
    installDate,
  };
});

const resetCarParams = () => {
  carParams.id = '';
  carParams.farmId = farmIdStorage.value; // 自动设置为当前农场ID
  carParams.carId = '';
  carParams.name = '';
  carParams.brand = '';
  carParams.model = '';
  carParams.licensePlate = '';
  carParams.registrationNo = '';
  carParams.age = '';
  carParams.power = '';
  carParams.fuel = '';
  carParams.imageUrl = '';
  carParams.companyId = '';
  carParams.vehicleType = [];
  carParams.buyTime = '';
  trueImg.value = null;
};

const buildKeyword = () => {
  const values = [searchForm.name, searchForm.sn]
    .map((item) => (item || '').trim())
    .filter(Boolean);
  // 去除重复值
  return [...new Set(values)].join(' ');
};

const fetchVehicleTypes = async () => {
  try {
    const { data } = await sysDict_API({ dicKey: 'vehicle_type' });
    vehicle.value = data || [];
  } catch (error) {
    console.error("Failed to fetch vehicle types:", error);
    vehicle.value = [];
  }
};

// fetchFarmOptions 已不再需要,因为农场ID自动从全局状态获取
// const fetchFarmOptions = async () => {
//   try {
//     const { data } = await farmList_API();
//     farmOptions.value = data || [];
//   } catch (error) {
//     console.error("Failed to fetch farm list:", error);
//     farmOptions.value = [];
//   }
// };

const getSNList = async () => {
  try {
    const { data } = await getBindSnVO_API();
    optionsList.value = (data || []).map((item: any) => ({
      value: item.carId,
      label: item.sn,
    }));
  } catch (error) {
    console.error("Failed to fetch device SN list:", error);
    optionsList.value = [];
  }
};

const fetchCarList = async (reset = false) => {
  if (loading.list) return;
  loading.list = true;
  try {
    if (reset) {
      pagination.currentPage = 1;
      pagination.finished = false;
      pagination.total = 0;
    }
    const params: Record<string, any> = {
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize,
      farmId: farmIdStorage.value,
      keyword: buildKeyword(),
    };
    if (searchForm.name.trim()) params.name = searchForm.name.trim();
    if (searchForm.sn.trim()) params.sn = searchForm.sn.trim();

    const { data } = await pageVehicle_API(params);
    const records = data?.records || [];

    if (reset) {
      carList.value = records;
    } else {
      carList.value = [...carList.value, ...records];
    }

    pagination.total = data?.total ?? 0;
    pagination.finished =
      carList.value.length >= pagination.total || records.length === 0;

    if (!carList.value.length) {
      selectedCarId.value = null;
    } else if (
      reset ||
      !selectedCarId.value ||
      !carList.value.some((item) => item.id === selectedCarId.value)
    ) {
      selectedCarId.value = carList.value[0].id;
    }
  } catch (error) {
    console.error("Failed to fetch vehicle list:", error);
    if (reset) {
      carList.value = [];
      selectedCarId.value = null;
    }
  } finally {
    loading.list = false;
  }
};

const fetchVehicleDetail = async (id: string | number) => {
  try {
    loading.detail = true;
    const { data } = await detail_API({ id });
    vehicleDetail.value = data || null;
  } catch (error) {
    console.error("Failed to fetch vehicle detail:", error);
    vehicleDetail.value = null;
  } finally {
    loading.detail = false;
  }
};

const handleSearch = (form: Record<string, any>) => {
  Object.assign(searchForm, { name: "", sn: "" }, form);
  fetchCarList(true);
};

const handleSelect = (item: any) => {
  if (!item || !item.id || item.id === selectedCarId.value) return;
  selectedCarId.value = item.id;
};

const handleLoadMore = async () => {
  if (loading.list || pagination.finished) return;
  pagination.currentPage += 1;
  await fetchCarList();
};

const addCars = () => {
  dialogVisible.value = true;
  isEdit.value = false;
  carParams.farmId = farmIdStorage.value; // 自动设置为当前农场ID
  getSNList();
  // fetchFarmOptions(); // 不再需要获取农场列表
};

const handleEdit = async (item: any) => {
  try {
    isEdit.value = true;
    dialogVisible.value = true;
    loading.detail = true;
    const { data } = await detail_API({ id: item.id });
    // 预填表单
    Object.assign(carParams, {
      id: data.id,
      farmId: farmIdStorage.value, // 使用当前农场ID而不是原数据中的farmId
      carId: data.carId,
      name: data.name,
      brand: data.brand,
      model: data.model,
      licensePlate: data.licensePlate,
      registrationNo: data.registrationNo,
      age: data.age,
      power: data.power,
      fuel: data.fuel,
      imageUrl: data.imageUrl,
      companyId: data.companyId,
      vehicleType: data.vehicleType ? [String(data.vehicleType)] : [],
      buyTime: data.buyTime,
    });
    await getSNList();
    // await Promise.all([getSNList(), fetchFarmOptions()]); // 不再需要获取农场列表
    // 确保当前绑定的SN存在于选项中
    if (
      carParams.carId &&
      !optionsList.value.some((opt) => String(opt.value) === String(carParams.carId))
    ) {
      optionsList.value.unshift({
        value: carParams.carId,
        label: data.sn,
      });
    }
  } catch (e) {
    console.error('Failed to open edit form:', e);
  } finally {
    loading.detail = false;
  }
};

const closeDia = () => {
  resetCarParams();
  carFormRef.value?.resetFields?.();
};

const handleChange = async (file: any) => {
  // validate file type
  const pass = checkFileType(file);
  if (pass === false) return false;
  // preview immediately
  carParams.imageUrl = URL.createObjectURL(file.raw);
  trueImg.value = file.raw;
  // upload immediately
  try {
    const formData = new FormData();
    formData.append('file', trueImg.value);
    const { data } = await uploadImg_API(formData);
    carParams.imageUrl = data;
  } catch (e) {
    ElMessage.error((t("work.plzImg") || "Please select an image") + " upload failed");
  }
  return true;
};

// uploadImg 函数已不再使用,图片上传在handleChange中处理
// const uploadImg = async () => {
//   if (!trueImg.value) {
//     return ElMessage.warning(t("work.plzImg") || "Please select an image");
//   }
//   const formData = new FormData();
//   formData.append('file', trueImg.value);
//   const { data } = await uploadImg_API(formData);
//   carParams.imageUrl = data;
// };

const checkFileType = (file: any) => {
  const fileName = file.name || '';
  const fileType = fileName.substring(fileName.lastIndexOf('.'));
  const allowTypes = [".png", ".jpg", ".jpeg"];
  if (!allowTypes.includes(fileType.toLowerCase())) {
    const tip = t("work.plzImg") || "Please select an image";
    ElMessage.error(`${tip}(.png/.jpg/.jpeg)`);
    return false;
  }
  return true;
};

const addVehicle = async () => {
  await carFormRef.value?.validate?.();
  let vehicleTypeValue = carParams.vehicleType;
  if (Array.isArray(vehicleTypeValue)) {
    vehicleTypeValue = vehicleTypeValue[vehicleTypeValue.length - 1];
  }
  try {
    const payload = {
      id: carParams.id,
      farmId: carParams.farmId,
      carId: carParams.carId,
      name: carParams.name,
      brand: carParams.brand,
      model: carParams.model,
      licensePlate: carParams.licensePlate,
      registrationNo: carParams.registrationNo,
      age: carParams.age,
      power: carParams.power,
      fuel: carParams.fuel,
      imageUrl: carParams.imageUrl,
      companyId: carParams.companyId,
      buyTime: carParams.buyTime,
      vehicleType: vehicleTypeValue,
    };
    if (isEdit.value) {
      await updateVehicle_API(payload);
      ElMessage.success(t('work.editSuccess'));
      // 更新详情信息
      if (selectedCarId.value) {
        await fetchVehicleDetail(selectedCarId.value);
      }
    } else {
      await addVehicle_API(payload);
      ElMessage.success(t('messages.addSuccess'));
    }
    dialogVisible.value = false;
    resetCarParams();
    fetchCarList(true);
    
  } catch (error) {
    console.error("Failed to add vehicle:", error);
  }
};

const Upload = () => {};

watch(selectedCarId, (id) => {
  if (!id) {
    vehicleDetail.value = null;
    return;
  }
  fetchVehicleDetail(id);
});

// 监听农场切换
watch(
  () => farmIdStorage.value,
  () => {
    fetchCarList(true);
  },
  { deep: true }
);

const rules = {
  // farmId: [{ required: true, message: t('work.enterValue'), trigger: 'blur' }], // 农场ID自动获取,无需验证
  name: [{ required: true, message: t('work.enterValue'), trigger: 'blur' }],
  brand: [{ required: true, message: t('work.enterValue'), trigger: 'blur' }],
  model: [{ required: true, message: t('work.enterValue'), trigger: 'blur' }],
  carId: [{ required: true, message: t('work.enterValue'), trigger: 'blur' }],
  vehicleType: [{ required: true, message: t('work.enterValue'), trigger: 'change' }],
  buyTime: [{ required: true, message: t('work.enterValue'), trigger: 'blur' }],
};

onMounted(() => {
  fetchVehicleTypes();
  fetchCarList(true);
});
</script>

<style scoped lang="scss">
.car-management-page {
  display: flex;
  flex-direction: column;
  height: calc(100% - 40px);
}

.car-management-page__main {
  flex: 1;
  height: 100%;
  display: flex;
  gap: 1px;
}

.car-management-page__left {
  flex: 0 0 20%;
  min-width: 280px;
  height: 100%;
  min-height: 0; /* enable inner scroll */
}

.car-management-page__right {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-height: 0; /* ensure right side fills and splits correctly */
}

.car-management-page__right-top {
  flex: 2;
  min-height: 260px;
}

.car-management-page__right-bottom {
  flex: 5;
  min-height: 0;
}

.form_area {
  display: flex;
  gap: 24px;
}

.form_left {
  width: 520px;
}

.uploadImg_area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image_area {
  position: relative;
  width: 100%;
  max-width: 450px;
  min-height: 300px;
  border-radius: 10px;
  background-color: #b1b1b1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.img_upload {
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-uploader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.edit_img {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  pointer-events: none;
  z-index: 999;
}

.addImg {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 12px 0;
}
</style>

