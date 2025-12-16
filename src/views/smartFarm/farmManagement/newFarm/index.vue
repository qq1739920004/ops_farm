<!--  -->
<template>
  <div class="map_container">
    <div class="left_area">
      <div class="top_line">
        <div class="point_area" @click="gotoback">
          <svg
            t="1758782752275"
            style="margin-right: 8px"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4706"
            width="16"
            height="16"
          >
            <path
              d="M606.2 250.9H436.8V86.8L8 309.2l428.8 222.3V367.4H622c185.3 0 280.6 74.1 280.6 222.3 0 153.5-95.3 227.6-291.1 227.6H113.9v116.5h502.9c264.7 0 397-111.2 397-333.5 0-232.9-137.7-349.4-407.6-349.4z m0 0"
              p-id="4707"
              fill="#ffffff"
            ></path></svg
          >{{ t("farm.newFarm") }}
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
          <el-input
            style="width: 200px"
           :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            v-model="fieldList.farmIntro"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item :label="t('work.address')" prop="address">
          <el-input style="width: 200px" v-model="fieldList.address"></el-input>
        </el-form-item> -->
        <el-form-item :label="t('work.remark')" prop="remark">
          <el-input style="width: 200px" v-model="fieldList.remark"></el-input>
        </el-form-item>
        <el-form-item :label="t('farm.systemImage')" prop="systemLogo">
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
                    <div v-if="systemLogoBlob" class="img_upload" style="position: relative">
                      <el-image
                        class="el_img"
                        style="width: 150px; height: 100px"
                        :src="systemLogoBlob"
                        preview-teleported="true"
                        fit="scale-down"
                      >
                      </el-image>
                      <el-icon 
                        class="delete-icon" 
                        @click.stop="deleteSystemLogo"
                        style="position: absolute; top: 5px; right: 5px; cursor: pointer; background: rgba(0,0,0,0.5); color: white; border-radius: 50%; padding: 4px; font-size: 16px;"
                      >
                        <Close />
                      </el-icon>
                    </div>
                    <div v-else class="img_upload">
                      <el-icon class="upload-icon"><Plus /></el-icon>
                    </div>
                  </div>
                </template>
              </el-upload>
              <div class="addImg">
                <!-- <el-button type="primary" @click="uploadImg">{{
                  t("work.addPic")
                }}</el-button> -->
              </div>
            </div>

            <!-- <div class="addImg">{{ t('work.picLimit') }}</div> -->
          </div>
        </el-form-item>
        <el-form-item :label="t('farm.environmentPhoto')" prop="environmentPhoto">
          <div class="uploadImg_area">
            <div class="image_area">
              <el-upload
                class="avatar-uploader"
                action=""
                :http-request="Upload"
                :show-file-list="false"
                :on-change="handleChangePhoto"
                :before-upload="checkFileType"
              >
                <template #default>
                  <div class="upload-btn">
                    <div v-if="environmentPhotoBlob" class="img_upload" style="position: relative">
                      <el-image
                        class="el_img"
                        style="width: 150px; height: 100px"
                        :src="environmentPhotoBlob"
                        preview-teleported="true"
                        fit="scale-down"
                      >
                      </el-image>
                      <el-icon 
                        class="delete-icon" 
                        @click.stop="deleteEnvironmentPhoto"
                        style="position: absolute; top: 5px; right: 5px; cursor: pointer; background: rgba(0,0,0,0.5); color: white; border-radius: 50%; padding: 4px; font-size: 16px;"
                      >
                        <Close />
                      </el-icon>
                    </div>
                    <div v-else class="img_upload">
                      <el-icon class="upload-icon"><Plus /></el-icon>
                    </div>
                  </div>
                </template>
              </el-upload>
              <el-radio 
                :label="0" 
                v-model="fieldList.bigScreenType" 
                style="margin-left: 10px; color: #fff"
              >
                <span style="color: #fff">{{ t('farm.applyToBigScreen') }}</span>
              </el-radio>
              <!-- <div class="addImg">
                <el-button type="primary" @click="uploadPhoto">{{
                  t("work.addPic")
                }}</el-button>
              </div> -->
            </div>
          </div>
        </el-form-item>
        <el-form-item :label="t('farm.environmentVideo')" prop="environmentVideoUrl">
          <div class="uploadImg_area">
            <div class="image_area">
              <el-upload
                class="avatar-uploader"
                action=""
                :http-request="Upload"
                :show-file-list="false"
                :on-change="handleChangeVideo"
                :before-upload="checkVideoType"
                :accept="'video/*'"
              >
                <template #default>
                  <div class="upload-btn">
                    <div v-if="environmentVideoBlob" class="video_upload" style="position: relative">
                      <video
                        style="width: 150px; height: 100px; object-fit: contain"
                        :src="environmentVideoBlob"
                        controls
                      >
                      </video>
                      <el-icon 
                        class="delete-icon" 
                        @click.stop="deleteEnvironmentVideo"
                        style="position: absolute; top: 5px; right: 5px; cursor: pointer; background: rgba(0,0,0,0.5); color: white; border-radius: 50%; padding: 4px; font-size: 16px;"
                      >
                        <Close />
                      </el-icon>
                    </div>
                    <div v-else class="img_upload">
                      <el-icon class="upload-icon"><Plus /></el-icon>
                    </div>
                  </div>
                </template>
              </el-upload>
              <el-radio 
                :label="1" 
                v-model="fieldList.bigScreenType" 
                style="margin-left: 10px; color: #fff"
              >
                <span style="color: #fff">{{ t('farm.applyToBigScreen') }}</span>
              </el-radio>
            </div>
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
import { farmList_API, addFarm_API, suggest_API, uploadVideo_API } from "@/api/fieldManagement/indx";
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
const trueImgPhoto = ref("");
const trueImgVideo = ref("");
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
const checkVideoType = (file: any) => {
  const fileName = file.name;
  const fileType = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
  const validVideoTypes = [".mp4", ".avi", ".mov", ".wmv", ".flv", ".mkv", ".webm"];
  if (!validVideoTypes.includes(fileType)) {
    ElMessage.error("请上传视频文件");
    return false;
  }
};
const systemLogoBlob = ref("");
const environmentPhotoBlob = ref("");
const environmentVideoBlob = ref("");
const handleChange = (file: any, fileList: any) => {
  fieldList.systemLogo = "";
  systemLogoBlob.value = URL.createObjectURL(file.raw);
  trueImg.value = file.raw;
};
const handleChangePhoto = (file: any, fileList: any) => {
  fieldList.environmentPhoto = "";
  environmentPhotoBlob.value = URL.createObjectURL(file.raw);
  trueImgPhoto.value = file.raw;
};
const handleChangeVideo = (file: any, fileList: any) => {
  fieldList.environmentVideoUrl = "";
  environmentVideoBlob.value = URL.createObjectURL(file.raw);
  trueImgVideo.value = file.raw;
};
const uploadImg = async () => {
  if (!trueImg.value) {
    return ElMessage.warning(t("farm.selectImage"));
  }
  let formDataE = new FormData();
  formDataE.append("file", trueImg.value);

  const { data } = await uploadImg_API(formDataE);
  fieldList.systemLogo = data;
};
const uploadPhoto = async () => {
  if (!trueImgPhoto.value) {
    return;
  }
  let formDataE = new FormData();
  formDataE.append("file", trueImgPhoto.value);
  const { data } = await uploadImg_API(formDataE);
  fieldList.environmentPhoto = data;
};
const uploadVideo = async () => {
  if (!trueImgVideo.value) {
    return;
  }
  let formDataE = new FormData();
  formDataE.append("file", trueImgVideo.value);
  const { data } = await uploadVideo_API(formDataE);
  fieldList.environmentVideoUrl = data;
};
const deleteSystemLogo = () => {
  systemLogoBlob.value = "";
  trueImg.value = "";
  fieldList.systemLogo = "";
};
const deleteEnvironmentPhoto = () => {
  environmentPhotoBlob.value = "";
  trueImgPhoto.value = "";
  fieldList.environmentPhoto = "";
};
const deleteEnvironmentVideo = () => {
  environmentVideoBlob.value = "";
  trueImgVideo.value = "";
  fieldList.environmentVideoUrl = "";
};
const fieldList = reactive({
  name: "",

  farmIntro: "",
  // address: "",
  remark: "",
  locationContour: [],

  systemLogo: "",
  environmentPhoto: "",
  environmentVideoUrl: "",
  bigScreenType: 0, // 0=图片, 1=视频
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
  environmentPhoto: [
    {
      validator: (rule: any, value: any, callback: any) => {
        // 如果选择了图片应用到大屏，则图片必填
        if (fieldList.bigScreenType === 0 && !fieldList.environmentPhoto) {
          callback(new Error(t("work.plzImg")));
        } else {
          callback();
        }
      },
      trigger: "change"
    }
  ],
  environmentVideoUrl: [
    {
      validator: (rule: any, value: any, callback: any) => {
        // 如果选择了视频应用到大屏，则视频必填
        if (fieldList.bigScreenType === 1 && !fieldList.environmentVideoUrl) {
          callback(new Error(t("farm.pleaseUploadVideo")));
        } else {
          callback();
        }
      },
      trigger: "change"
    }
  ],
};
const addField = async () => {
  if (fieldList.locationContour.length === 0) {
    return ElMessage.warning(t("farm.farmCannotBeEmpty"));
  }
  await uploadImg();
  if (trueImgPhoto.value) {
    await uploadPhoto();
  }
  if (trueImgVideo.value) {
    await uploadVideo();
  }
  await formRef.value.validate();
  if (fieldList.locationContour) {
    try {
      await addFarm_API(fieldList);
      ElMessage.success(t("messages.addSuccess"));
      window.dispatchEvent(new Event('refresh-farm-list'));
      router.go(-1);
    } catch {}
  } else {
    ElMessage.warning(t("farm.pleaseAddFarm"));
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
