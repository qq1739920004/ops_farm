<!--  -->
<template>
  <div class="map_container">
    <div class="left_area">
      <div class="top_line">
        <div class="point_area" @click="gotoback">
          <svg
            t="1742801953306"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="5868"
            width="24"
            height="24"
          >
            <path
              d="M569.664 352.896c130.986667 0 237.162667 106.176 237.162667 237.162667 0 130.986667-106.176 237.184-237.162667 237.184H213.909333v79.061333h355.754667c174.656 0 316.224-141.589333 316.224-316.245333 0-174.634667-141.568-316.224-316.224-316.224h-283.52l100.266667-100.245334-55.893334-55.893333L134.826667 313.386667l195.669333 195.669333 55.893333-55.893333-100.266666-100.245334h283.52z"
              fill="#2c2c2c"
              p-id="5869"
            ></path></svg
          >{{ t("work.newField") }}
        </div>
      </div>
      <el-form
        style="width: 100%"
        ref="formRef"
        :model="fieldList"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item :label="t('work.farmName')" prop="name">
          <div class="select_inner">
            <el-input style="width: 200px" v-model="fieldList.name"></el-input>
          </div>
        </el-form-item>

        <el-form-item :label="t('farm.farmIntro')" prop="farmIntro">
          <el-input style="width: 200px" v-model="fieldList.farmIntro"></el-input>
        </el-form-item>
        <el-form-item :label="t('work.address')" prop="address">
          <el-input style="width: 200px" v-model="fieldList.address"></el-input>
        </el-form-item>
        <el-form-item :label="t('work.remark')" prop="remark">
          <el-input style="width: 200px" v-model="fieldList.remark"></el-input>
        </el-form-item>
        <el-form-item label="系统图片" prop="systemLogo">
          <div class="uploadImg_area">
            <div class="image_area">
              <el-upload
                class="avatar-uploader"
                action=""
                :http-request="Upload"
                :show-file-list="false"
                :on-change="handleChange"
                :before-upload="checkFileType"
              >
                <template #default>
                  <div class="upload-btn">
                    <div v-if="systemLogoBlob" class="img_upload">
                      <el-image
                        class="el_img"
                        style="width: 150px; height: 100px"
                        :src="systemLogoBlob"
                        preview-teleported="true"
                        fit="scale-down"
                      >
                      </el-image>
                    </div>
                    <div v-else class="img_upload">
                      <el-icon class="upload-icon"><Plus /></el-icon>
                    </div>
                  </div>
                </template>
              </el-upload>
              <div class="addImg">
                <el-button type="primary" @click="uploadImg">{{
                  t("work.addPic")
                }}</el-button>
              </div>
            </div>

            <!-- <div class="addImg">{{ t('work.picLimit') }}</div> -->
          </div>
        </el-form-item>
        <el-form-item label="环境照片" prop="environmentPhoto">
          <div class="uploadImg_area">
            <div class="image_area">
              <el-upload
                class="avatar-uploader"
                action=""
                :http-request="Upload"
                :show-file-list="false"
                :on-change="handleChange2"
                :before-upload="checkFileType"
              >
                <template #default>
                  <div class="upload-btn">
                    <div v-if="environmentPhotoBlob" class="img_upload">
                      <el-image
                        class="el_img"
                        style="width: 150px; height: 100px"
                        :src="environmentPhotoBlob"
                        preview-teleported="true"
                        fit="scale-down"
                      >
                      </el-image>
                    </div>
                    <div v-else class="img_upload">
                      <el-icon class="upload-icon"><Plus /></el-icon>
                    </div>
                  </div>
                </template>
              </el-upload>
              <div class="addImg">
                <el-button type="primary" @click="uploadImg2">{{
                  t("work.addPic")
                }}</el-button>
              </div>
            </div>

            <!-- <div class="addImg">{{ t('work.picLimit') }}</div> -->
          </div>
        </el-form-item>
      </el-form>
      <div class="btn_area">
        <el-button type="primary" @click="addField"> {{ t("farm.newFarm") }} </el-button>
      </div>
    </div>
    <div class="select_area">
      <el-select
        v-model="words"
        filterable
        remote
        clearable
        reserve-keyword
        style="width: 230px; color: #fff"
        :placeholder="t('work.searchAddress')"
        :remote-method="remoteMethod"
        @change="handleSelectBranchCom"
      >
        <el-option
          v-for="(item, index) in remoteOptions"
          :key="item.uuid"
          :label="item.name"
          :value="item.name"
        >
          <span style="float: left">{{ item.name }}</span>
          <span
            style="float: right; color: var(--el-text-color-secondary); font-size: 13px"
          >
            {{ item.province }}{{ item.city }} {{ item.district }}
          </span>
        </el-option>
      </el-select>
    </div>
    <detail-map ref="sinoMapRef" :mapCenter="mapCenter" @boundries="getBoundaries" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import detailMap from "./components/detailMap.vue";
import router from "@/router";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import { ElMessage } from "element-plus";
import { farmList_API, addFarm_API, suggest_API } from "@/api/fieldManagement/indx";
import { gcoordLngLat } from "sino-tool-v3";
import { uploadImg_API } from "@/api/carManagement/index";
const words = ref(null);
const formRef = ref<any>();
const farmList = ref<any>([]);
const mapCenter = ref<any>({
  markerId: null,
  center: [[121.734942, 31.086444]],
  zoom: 4,
});
const remoteOptions = ref<any>([]);
// 关键字查询
async function wordsSearch(e: any) {
  if (e) {
    const res = await suggest_API({ address: e });
    if (res.data.length > 0) {
      remoteOptions.value = res.data;
    }
  }
}
function remoteMethod(e: any) {
  wordsSearch(e);
}
const Upload = () => {};
const trueImg = ref("");
const trueImg2 = ref("");
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
const systemLogoBlob = ref("");
const environmentPhotoBlob = ref("");
const handleChange = (file: any, fileList: any) => {
  fieldList.systemLogo = "";
  systemLogoBlob.value = URL.createObjectURL(file.raw);
  trueImg.value = file.raw;
};
const handleChange2 = (file: any, fileList: any) => {
  fieldList.environmentPhoto = "";
  environmentPhotoBlob.value = URL.createObjectURL(file.raw);
  trueImg2.value = file.raw;
};
const uploadImg = async () => {
  if (!trueImg.value) {
    return ElMessage.warning("请选择图片");
  }
  let formDataE = new FormData();
  formDataE.append("file", trueImg.value);

  const { data } = await uploadImg_API(formDataE);
  fieldList.systemLogo = data;
};
const uploadImg2 = async () => {
  if (!trueImg2.value) {
    return ElMessage.warning("请选择图片");
  }
  let formDataE = new FormData();
  formDataE.append("file", trueImg2.value);

  const { data } = await uploadImg_API(formDataE);
  fieldList.environmentPhoto = data;
};
const fieldList = reactive({
  name: "",

  farmIntro: "",
  address: "",
  remark: "",
  locationContour: [],

  systemLogo: "",
  environmentPhoto: "",
});
function handleSelectBranchCom(e: any) {
  if (e) {
    const a = remoteOptions.value.find((item: any) => {
      return item.name === e;
    });
    mapCenter.value.center = [
      [
        gcoordLngLat(a.location.lng, a.location.lat)[1],
        gcoordLngLat(a.location.lng, a.location.lat)[0],
      ],
    ];
    mapCenter.value.zoom = 16;
  }
}

const getBoundaries = (e: any) => {
  fieldList.locationContour = JSON.parse(e);
};

const rules = {
  name: [{ required: true, message: t("messages.plzenter"), trigger: "change" }],
  systemLogo: [{ required: true, message: t("work.plzImg"), trigger: "change" }],
  environmentPhoto: [{ required: true, message: t("work.plzImg"), trigger: "change" }],
};
const addField = async () => {
  await formRef.value.validate();
  if (fieldList.locationContour.length === 0) {
    return ElMessage.warning("农场不能为空！");
  }
  if (fieldList.locationContour) {
    await addFarm_API(fieldList);
  } else {
    ElMessage.warning("请添加农场");
  }
};
async function getFarmList() {
  const { data } = await farmList_API();
  farmList.value = data;
}
getFarmList();
const gotoback = () => {
  router.go(-1);
};
</script>

<style lang="scss" scoped>
.map_container {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  position: relative;

  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  .left_area {
    position: absolute;
    left: 10px;
    top: 50px;
    padding-left: 10px;
    width: 22%;
    margin: 5px;
    border-radius: 5px;
    z-index: 9999;
    position: absolute;

    height: 735px;
    padding: 4px;
    background-color: rgba(16, 34, 15, 0.68);
    color: #fff;
    background-size: 130% 130%;
    z-index: 999;
    :deep(.el-form-item__label) {
      color: #fff;
    }
    .btn_area {
      display: flex;
      width: 100%;
      justify-content: center;
    }
    .top_line {
      width: 100%;
      .point_area {
        cursor: pointer;
        width: fit-content;
        display: flex;
        align-items: center;
        height: 42px;
      }
    }
    .select_inner {
      cursor: pointer;

      display: flex;
      align-items: center;
      img {
        margin-left: 10px;
        width: 26px;
        height: 26px;
      }
    }
  }
  .select_area {
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 99999;
    border-bottom: 2px solid;
    border-image: linear-gradient(
        to right,
        rgba(145, 145, 145, 0),
        rgba(247, 247, 247, 0.53),
        rgba(145, 145, 145, 0)
      )
      1;
    display: flex;
    align-items: center;
    justify-content: center;
    :deep(.el-select__wrapper) {
      background: url("@/assets/monitoring/inputBack.png") no-repeat center center;
      background-size: 105% 105%;
      color: white;
    }
    :deep(.el-select__placeholder) {
      color: #fff;
    }
    :deep(.el-select__input) {
      color: white;
    }
  }
  .search_area {
    position: absolute;
    left: 10px;
    top: 10px;
    width: 264px;
    z-index: 99999;
    :deep(.el-input__wrapper) {
      background: url("@/assets/monitoring/inputBack.png") no-repeat center center;
      background-size: 105% 105%;
      color: white !important;
    }
    :deep(.el-input__inner) {
      color: #fff;
    }
    :deep(.el-input__placeholder) {
      color: #fff;
    }
  }
}
.uploadImg_area {
  width: 100px;
}
.upload-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 100px;
  border: 2px dashed #c0c4cc;
  border-radius: 6px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.upload-btn:hover {
  border-color: #409eff;
  background-color: #f0f7ff;
}
.addImg {
  margin-left: 15px;
  z-index: 99999;
  position: absolute;
  right: 20px;
  top: 30px;
}
</style>
