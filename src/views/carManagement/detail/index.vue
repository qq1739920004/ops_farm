<!--  -->
<template>
  <div class="app_container">
    <div class="top">
      <div class="de_box top_left">
        <div class="top_inner">
          <div class="img_line">
            <el-image
              class="el_img1"
              :src="detailList.imageUrl ? detailList.imageUrl : carM"
              preview-teleported="true"
              fit="scale-down"
            >
            </el-image>
          </div>
          <div class="name_area">
            <div class="info_area">
              <div class="title_line">{{ detailList.name }}</div>
              <div class="brand_line">{{ detailList.brand }}|{{ detailList.model }}</div>
            </div>
            <div class="car_btn">
              <el-button type="primary" style="width: 102px" @click="editCars">{{
                t("work.edit")
              }}</el-button>
            </div>
          </div>
        </div>
        <div class="line">
          <div></div>
        </div>
        <div class="bottom_inner">
          <div class="bottom_info">
            <div><img :src="frame" alt="" /></div>
            <div class="ingo_tit">{{ t("work.workMile") + "(km)" }}</div>
            <div class="value_tit">{{ detailList.sumWorkMileage || "--" }}</div>
          </div>
          <div class="bottom_info">
            <div><img :src="sand" alt="" /></div>
            <div class="ingo_tit">{{ t("statisticsReport.workingHours") + "(h)" }}</div>
            <div class="value_tit">{{ detailList.sumWorkDuration || "--" }}</div>
          </div>
          <div class="bottom_info">
            <div><img :src="oil" alt="" /></div>
            <div class="ingo_tit">{{ t("work.averageOil") + "(L/h)" }}</div>
            <div class="value_tit">{{ detailList.avgFuelConsumption || "--" }}</div>
          </div>
          <div class="bottom_info">
            <div><img :src="speed" alt="" /></div>
            <div class="ingo_tit">{{ t("work.averageSpeed") + "(km/h)" }}</div>
            <div class="value_tit">{{ detailList.avgSpeed || "--" }}</div>
          </div>
        </div>
      </div>
      <div class="de_box top_right">
        <div class="top_line">
          <div class="green_box"></div>
          {{ t("work.deviceInfo") }}
        </div>
        <div class="info_value">{{ t("work.deviceType") }}:{{ detailList.model }}</div>
        <div class="info_value">{{ t("devicelist.deviceSN") }}:{{ detailList.sn }}</div>
      </div>
    </div>
    <div class="bottom">
      <div class="de_box bottom_left">
        <div class="top_line">
          <div class="green_box"></div>
          <div class="rightbn">
            <div>
              {{ t("work.lastPosition") }}
            </div>
            <div class="time_box">
              {{ detailList.lastTime }}
            </div>
          </div>
        </div>
        <div class="map_box">
          <detail-map ref="sinoMapRef" :markerData="markerData" />
          <div class="carinfo_box">
            <div class="lat_line">
              <div class="left">
                <div class="top_line">
                  {{ detailList.lastSpeed || "--" }}<span>km/h</span>
                </div>
                <div class="bottom_line">
                  <img :src="speed1" alt="" />{{ t("work.currentSpeed") }}
                </div>
              </div>
              <div class="right">
                <div class="top_line">
                  {{ detailList.lastWorkMileage || "--" }}<span>L/h</span>
                </div>
                <div class="bottom_line">
                  <img :src="oil1" alt="" />{{ t("work.currentFuel") }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="de_box bottom_right">
        <div class="top_line" style="display: flex">
          <div class="green_box"></div>
          {{ t("messages.AlarmsInfo") }}
        </div>
        <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
          <li
            v-for="(item, index) in pageList"
            :key="index"
            class="infinite-list-item list_line"
          >
            <div class="green_cyc"></div>
            <div class="content_area">{{ contentList[item.content] }}</div>
            <div class="">{{ item.time }}</div>
          </li>
        </ul>
      </div>
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
                v-model.number="carParams.carId"
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
          <div class="addImg">{{ t("work.picLimit") }}</div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="editVehicles">
            {{ $t("work.edit") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { ref, reactive } from "vue";
import { useI18n } from "vue-i18n";
import detailMap from "./components/detailMap.vue";
import { statPage_API } from "@/api/inSight/index.ts";
import {
  detail_API, 
  uploadImg_API,
  getBindSnVO_API,
  updateVehicle_API,
} from "@/api/carManagement/index";
import sand from "@/assets/common/Gsand.png";
import oil from "@/assets/common/goil.png";
import speed1 from "@/assets/common/speed.png";
import oil1 from "@/assets/common/oil.png";
import speed from "@/assets/common/greSpeed.png";
import frame from "@/assets/common/frame.png";
import startCar from "@/assets/common/car.png";
import carM from '@/assets/common/car.png'
const { t } = useI18n();
const detailList = ref<any>({});
let markerData = ref<any>([]);
const carParams = ref<any>({});
const route = useRoute();
const normalImg = ref("");

const dialogVisible = ref(false);
const carFormRef = ref();
let optionsList = ref<any>([]);
const load = () => {
  pageInfo.currentPage++;
  getStateData();
};
normalImg.value =
  import.meta.env.MODE === "development"
    ? "http://140.207.166.210:9030/farm/vehicle/images/878e0d80-37f1-4bdb-8bd9-b9224051b3d6.png"
    : "https://cloud.sinognss.com/farm/vehicle/images/878e0d80-37f1-4bdb-8bd9-b9224051b3d6.png";
const getDetailData = async () => {
  const { data } = await detail_API({ id: route.query.id });
  detailList.value = data;
  markerData.value = [
    {
      markerId: detailList.value.id,
      markerLng: detailList.value.lastPosY,
      markerLat: detailList.value.lastPosX,
      markerIcon: detailList.value.imageUrl || normalImg.value,
    },
  ];
};
const rules = {
  name: [{ required: true, message: t("work.enterValue"), trigger: "blur" }],
  brand: [{ required: true, message: t("work.enterValue"), trigger: "blur" }],
  model: [{ required: true, message: t("work.enterValue"), trigger: "blur" }],
  carId: [{ required: true, message: t("work.enterValue"), trigger: "blur" }],
};
getDetailData();
const trueImg = ref("");
const uploadImg = async () => {
  if (!trueImg.value) {
    return ElMessage.warning("请选择图片");
  }
  let formDataE = new FormData();
  formDataE.append("file", trueImg.value);

  const { data } = await uploadImg_API(formDataE);
  carParams.value.imageUrl = data;
};
const editCars = () => {
  dialogVisible.value = true;
  getSNList();
  carParams.value = JSON.parse(JSON.stringify(detailList.value));
};
const closeDia = () => {
  carParams.value = {};
  carFormRef.value.resetFields();
  trueImg.value = "";
};
const getSNList = async () => {
  const { data } = await getBindSnVO_API();
  if (!data.length) {
    optionsList.value = [];
  } else {
    optionsList.value = data.map((item: any, _idx: any) => ({
      value: item.carId,
      label: item.sn,
    }));
    optionsList.value.unshift({
      value: detailList.value.carId,
      label: detailList.value.sn,
    });
  }
};
// route.query.id || ""
const pageInfo = reactive<any>({
  id: route.query.id || "",
  currentPage: 1,
  pageSize: 10,
});
const pageList = ref<any>([]);
const getStateData = async () => {
  const res = await statPage_API({
    ...pageInfo,
  });
  pageList.value.push(...res.data.records);
};
getStateData();
const handleChange = (file: any, fileList: any) => {
  carParams.value.imageUrl = URL.createObjectURL(file.raw);
  trueImg.value = file.raw;
};
const checkFileType = (file: any) => {
  const fileName = file.name;
  const fileType = fileName.substring(fileName.lastIndexOf("."));
  // jpeg,.png,.jpg,.bmp,.gif
  if (fileType === ".png") {
    // 不处理
  } else {
    ElMessage.error(t("work.plzImg") + "(.png)");
    return false;
  }
};
const Upload = () => {};
const contentList: any = {
  1001: t("content.LOSS_COURSE"),
  1002: t("content.LOSS_LOCATION"),
  1003: t("content.LOSS_MOTOR_VALUE_MAX"),
  1005: t("content.LOSS_MOTOR_VALUE"),
  1006: t("content.LOSS_FRONT_GYRO"),
  1007: t("content.LOSS_BODY_GYRO"),
  1008: t("content.LOSS_MOTOR"),
  1009: t("content.LOSS_SMART_WHEEL"),
  1010: t("content.LOSS_RTK_DATA"),
  1011: t("content.LOSS_LOCATION_BUT_SIGNAL"),
  1012: t("content.LOSS_BASE_LINE"),
};
const editVehicles = async () => {
  await carFormRef.value.validate();
  try {
    await updateVehicle_API(carParams.value);
    dialogVisible.value = false;
    ElMessage.success(t("messages.editSuccess"));
    getDetailData();
  } catch {}
};
</script>

<style lang="scss" scoped>
.de_box {
  box-sizing: border-box;
  padding: 16px;
  overflow-x: hidden;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  box-shadow: 0 0 12px rgb(0 0 0 / 5%);
}
.top {
  display: flex;
  height: 35%;
  .top_left {
    width: 50%;
    height: 250px;
    .top_inner {
      height: 48%;
      width: 100%;
      display: flex;
      .name_area {
        display: flex;
        width: 100%;
        height: 100%;
        padding: 10px;
        justify-content: space-between;
        .title_line {
          color: #4cb04f;
          font-size: 16px;
          font-weight: 1000;
        }
        .brand_line {
          color: #b5b5b5;
          font-size: 12px;
        }
        .car_btn {
          display: flex;
          align-items: center;
          padding-left: 20px;
        }
      }
    }
    .line {
      margin: 8px 0;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      div {
        width: 98%;
        height: 2px;
        background-color: #ededed;
      }
    }
    .bottom_inner {
      width: 100%;
      display: flex;
      .bottom_info {
        height: 100%;
        width: 25%;
        div {
          height: 40%;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 34px;
            height: 34px;
          }
        }
        .ingo_tit {
          height: 20%;
          font-size: 12px;
          color: #868686;
        }
        .value_tit {
          font-size: 28px;
          color: #4cb04f;
          font-weight: 1000;
        }
      }
    }
  }
  .top_right {
    width: 50%;
    height: 250px;
    .top_line {
      display: flex;
    }
    .info_value {
      padding-left: 6px;
      color: #565656;
      font-size: 14px;
      margin: 4px 0;
    }
  }
}
.bottom {
  display: flex;
  height: 65%;
  .bottom_left {
    width: 50%;
    height: 500px;
    .top_line {
      display: flex;
    }
  }
  .bottom_right {
    width: 50%;
    height: 500px;
  }
}
.el_img1 {
  width: 104px;
  height: 104px;
  background-color: #e6e6e6;
  border-radius: 10px;
}
.green_box {
  height: 24px;
  width: 4px;
  background-color: #4cb04f;
  margin-right: 6px;
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
.map_box {
  position: relative;
  height: calc(100% - 24px);
  border-radius: 5px;
  width: 100%;
  .carinfo_box {
    position: absolute;
    left: 10px;
    top: 10px;
    border-radius: 4px;
    height: 80px;
    width: 245px;
    background-color: #fff;
    z-index: 99999;
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
  }
}
.rightbn {
  display: flex;
  justify-content: space-between;
  width: 100%;
  .time_box {
    font-size: 12px;
  }
}

.infinite-list {
  height: 90%;
  padding: 0;
  margin: 0;
  list-style: none;
}
.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  height: 30px;
  margin: 10px;
  color: #9c9c9c;
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
.list_line {
  display: flex;
  .green_cyc {
    height: 14px;
    margin-right: 30px;
    width: 14px;
    background-color: #4cb04f;
    border-radius: 50%;
  }
  .content_area {
    width: 50%;
  }
}
::-webkit-scrollbar {
  width: 0px;
}
</style>
