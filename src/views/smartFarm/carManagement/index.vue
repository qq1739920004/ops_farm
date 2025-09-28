<template>
  <div class="app_container">
    <div class="table_container app_card">
      <div class="search_container">
        <div class="input_area">
          <el-input
            :placeholder="$t('work.inputCarInfo')"
            class="input-with-select"
            v-model="keyword"
            @keyup.enter.native="search"
            clearable
            @clear="search"
          >
            <template #append>
              <el-button icon="Search" @click="search" />
            </template>
          </el-input>
        </div>
        <div>
          <el-button v-auth="2237" type="primary" @click="addCars">{{
            $t("work.newVehicles")
          }}</el-button>
        </div>
      </div>
      <div class="table_area">
        <div
          class="car_table"
          v-for="(item, index) in carList"
          :key="index"
          @click="gotoDetail(item.id)"
        >
          <div class="info_container">
            <div class="title_line">
              {{ item.name }}
            </div>
            <div class="brand_line">{{ item.brand }}|{{ item.model }}</div>
            <div class="img_line">
              <el-image
                v-if="item.imageUrl"
                class="el_img"
                style="width: 258px; height: 196px; background-color: #f7f7f7"
                :src="item.imageUrl"
                preview-teleported="true"
                fit="scale-down"
              >
              </el-image>
              <el-image
                v-else
                class="el_img"
                style="width: 258px; height: 196px; background-color: #f7f7f7"
                :src="carM"
                preview-teleported="true"
                fit="scale-down"
              >
              </el-image>
            </div>
            <div class="lat_line">
              <div class="left">
                <div class="top_line">{{ item.avgSpeed || "--" }}<span>km/h</span></div>
                <div class="bottom_line">
                  <img :src="speed" alt="" />{{ t("work.averageSpeed") }}
                </div>
              </div>
              <div class="right">
                <div class="top_line">
                  {{ item.avgFuelConsumption || "--" }}<span>L/h</span>
                </div>
                <div class="bottom_line">
                  <img :src="oil" alt="" />{{ t("work.averageOil") }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Pagination
        :total="total"
        :currentPage="currentPage"
        :pageSize="pageSize"
        @pageChange="currentChange"
      >
      </Pagination>
    </div>

    <el-dialog
      style="border-radius: 8px"
      v-model="dialogVisible"
      :title="$t('work.newVehicles')"
      width="850px"
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
            <el-form-item :label="$t('work.vehicleName')" prop="name">
              <el-input v-model="carParams.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('work.brand')" prop="brand">
              <el-input v-model="carParams.brand"></el-input>
            </el-form-item>
            <el-form-item :label="$t('work.model')" prop="model">
              <el-input v-model="carParams.model"></el-input>
            </el-form-item>
            <el-form-item :label="$t('work.bindDevice')" prop="carId">
              <el-select-v2
                style="width: 192px"
                filterable
                clearable
                v-model="carParams.carId"
                :options="optionsList"
                :placeholder="$t('work.pleaseSelect')"
              >
              </el-select-v2
            ></el-form-item>
            <el-form-item :label="$t('work.licensePlate')" prop="licensePlate">
              <el-input v-model="carParams.licensePlate"></el-input>
            </el-form-item>
            <el-form-item :label="$t('work.registrationNo')" prop="registrationNo">
              <el-input v-model="carParams.registrationNo"></el-input>
            </el-form-item>
            <el-form-item :label="$t('work.age')" prop="age">
              <el-input v-model="carParams.age"></el-input>
            </el-form-item>
            <el-form-item :label="$t('work.powefr')" prop="power">
              <el-input v-model="carParams.power"></el-input>
            </el-form-item>
            <el-form-item :label="$t('work.fuel')" prop="fuel">
              <el-input v-model="carParams.fuel"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div calss="uploadImg_area">
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
                  >
                  </el-image>
                  <div class="edit_img">
                    <img src="@/assets/common/edit.png" alt="" />
                  </div>
                </div>
                <div v-else class="img_upload">
                  <!-- <el-icon class="avatar-uploader-icon"><Plus /></el-icon> -->
                  <el-image
                    class="el_img"
                    style="width: 450px; height: 300px"
                    :src="startCar"
                    preview-teleported="true"
                    fit="scale-down"
                  >
                  </el-image>
                  <div class="edit_img">
                    <img src="@/assets/common/edit.png" alt="" />
                  </div>
                </div>
              </div>
            </el-upload>
          </div>
          <div class="addImg">
            <el-button type="primary" @click="uploadImg">{{
              t("work.addPic")
            }}</el-button>
          </div>
          <!-- <div class="addImg">{{ t('work.picLimit') }}</div> -->
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="addVehicle">
            {{ $t("work.newVehicles") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import Pagination from "@/components/Pagination/index.vue";
import {
  pageVehicle_API,
  uploadImg_API,
  getBindSnVO_API,
  addVehicle_API,
} from "@/api/carManagement/index";
import { useRouter } from "vue-router";
import { useStorage } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import startCar from "@/assets/common/car.png";
import speed from "@/assets/common/speed.png";
import oil from "@/assets/common/oil.png";
import carM from "@/assets/common/car.png";
const { t } = useI18n();
const keyword = ref<any>("");
const normalImg = ref("");
normalImg.value =
  import.meta.env.MODE === "development"
    ? "http://140.207.166.210:9030/farm/vehicle/images/878e0d80-37f1-4bdb-8bd9-b9224051b3d6.png"
    : "https://cloud.sinognss.com/farm/vehicle/images/878e0d80-37f1-4bdb-8bd9-b9224051b3d6.png";
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const dialogVisible = ref(false);
const carFormRef = ref();

const router = useRouter();
let carParams = reactive({
  id: "",
  farmId: useStorage("farmId", ""),
  carId: "",
  name: "",
  brand: "",
  model: "",
  licensePlate: "",
  registrationNo: "",
  age: "",
  power: "",
  fuel: "",
  imageUrl: "",
  companyId: "",
});
const trueImg = ref("");
const addCars = () => {
  dialogVisible.value = true;
  getSNList();
};
const closeDia = () => {
  carParams.id = "";
  carParams.carId = "";
  carParams.name = "";
  carParams.brand = "";
  carParams.model = "";
  carParams.licensePlate = "";
  carParams.registrationNo = "";
  carParams.age = "";
  carParams.power = "";
  carParams.fuel = "";
  carParams.imageUrl = "";
  carParams.companyId = "";

  carFormRef.value.resetFields();
  trueImg.value = "";
};
const handleChange = (file: any, fileList: any) => {
  carParams.imageUrl = URL.createObjectURL(file.raw);
  trueImg.value = file.raw;
};
let optionsList = ref<any>([]);
const getSNList = async () => {
  const { data } = await getBindSnVO_API();
  if (!data.length) {
    optionsList.value = [];
  } else {
    optionsList.value = data.map((item: any, _idx: any) => ({
      value: item.carId,
      label: item.sn,
    }));
  }
  console.log(optionsList);
};
const uploadImg = async () => {
  if (!trueImg.value) {
    return ElMessage.warning("请选择图片");
  }
  let formDataE = new FormData();
  formDataE.append("file", trueImg.value);

  const { data } = await uploadImg_API(formDataE);
  carParams.imageUrl = data;
};
const checkFileType = (file: any) => {
  const fileName = file.name;
  const fileType = fileName.substring(fileName.lastIndexOf("."));
  // jpeg,.png,.jpg,.bmp,.gif
  // if (fileType === ".png") {
  //   // 不处理
  // } else {
  //   ElMessage.error(t("work.plzImg") + "(.png)");
  //   return false;
  // }
};
const addVehicle = async () => {
  await carFormRef.value.validate();
  try {
    await addVehicle_API(carParams);
    dialogVisible.value = false;
    ElMessage.success(t("messages.addSuccess"));
    getVehicle();
  } catch {}
};
const Upload = () => {};
const search = () => {
  getVehicle();
};
const carList = ref<any>([]);
const currentChange = (val: any) => {
  currentPage.value = val.currentPage;
  pageSize.value = val.pageSize;
  getVehicle();
};
const getVehicle = async () => {
  const { data } = await pageVehicle_API({
    currentPage: currentPage.value,
    pageSize: pageSize.value,
    companyId: "",
    keyword: keyword.value,
  });
  total.value = data.total;
  carList.value = data.records;
};
getVehicle();

const rules = {
  name: [{ required: true, message: t("work.enterValue"), trigger: "blur" }],
  brand: [{ required: true, message: t("work.enterValue"), trigger: "blur" }],
  model: [{ required: true, message: t("work.enterValue"), trigger: "blur" }],
  carId: [{ required: true, message: t("work.enterValue"), trigger: "blur" }],
};

const gotoDetail = (item: any) => {
  router.push({
    path: "carManagement/detail",
    query: {
      id: item,
    },
  });
};
</script>

<style lang="scss" scoped>
.search_container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  .input_area {
    display: flex;
    align-items: center;

    .input-with-select {
      margin-right: 20px;
      width: 240px;
      height: 32px;
      opacity: 1;
      border-radius: 2px;
    }

    .kind {
      width: 70px;
      height: 21px;
      opacity: 1;
      /** 文本1 */
      font-size: 14px;
      font-weight: 400;
      letter-spacing: 0px;
      line-height: 20.27px;
    }
  }
}
.form_area {
  display: flex;
  .form_left {
    width: 450px;
  }
  .uploadImg_area {
    width: 300px;
  }
}
.img_upload {
  display: flex;
  justify-content: center;
  align-items: center;
}
.image_area {
  position: relative;
  opacity: 0.4;
  width: 350px;
  border-radius: 10px;
  background-color: #b1b1b1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 250px;
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
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
  z-index: 9999;
  cursor: pointer;
}
.addImg {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 7px 0;
}
.table_area {
  cursor: pointer;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .car_table {
    width: 20%;
    height: 330px;
    margin-bottom: 20px;
    .info_container {
      width: 85%;
      height: 100%;
      background-color: #f7f7f7;
      border-radius: 5px;
      padding: 10px;
      .title_line {
        color: #4cb04f;
        font-size: 16px;
      }
      .brand_line {
        color: #b5b5b5;
        font-size: 12px;
      }
      .lat_line {
        margin-top: 10px;
        display: flex;
        height: 70px;
        .left {
          width: 50%;

          font-size: 12px;
          color: #868686;
          .top_line {
            height: 50%;
            align-items: center;
            justify-content: center;

            display: flex;
            color: #4cb04f;
            font-size: 26px;
            span {
              color: #000;
              font-size: 12px;
            }
          }
          .bottom_line {
            height: 50%;
            justify-content: center;

            display: flex;
            align-items: center;
          }
          img {
            width: 18px;
            height: 18px;
          }
        }
        .right {
          width: 50%;

          font-size: 12px;
          color: #868686;
          .top_line {
            height: 50%;
            justify-content: center;
            align-items: center;
            display: flex;
            color: #4cb04f;
            font-size: 26px;
            span {
              color: #000;
              font-size: 12px;
            }
          }
          .bottom_line {
            height: 50%;
            justify-content: center;

            display: flex;
            align-items: center;
          }
          img {
            width: 18px;
            height: 18px;
          }
        }
      }
      .img_line {
        display: flex;
        justify-content: center;
        :deep(.el-image__inner) {
          background-color: #e6e6e6;
          padding: 10px;
          border-radius: 8px;
        }
      }
    }
  }
}
</style>
