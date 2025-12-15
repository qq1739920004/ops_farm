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
          >{{ t("work.returnField") }}
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
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            style="width: 200px"
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
                    <div v-if="fieldList.systemLogo || systemLogoBlob" class="img_upload" style="position: relative">
                      <el-image
                        class="el_img"
                        style="width: 150px; height: 100px"
                        :src="systemLogoBlob || fieldList.systemLogo"
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
              <!-- <div class="addImg">
                <el-button type="primary" @click="uploadImg">{{
                  t("work.addPic")
                }}</el-button>
              </div> -->
            </div>

            <!-- <div class="addImg">{{ t('work.picLimit') }}</div> -->
          </div>
        </el-form-item>
        <el-form-item :label="t('farm.environmentPhoto')" prop="environmentPhoto">
          <div class="uploadImg_area">
            <el-radio-group v-model="environmentPhotoMediaType" style="margin-bottom: 10px">
              <el-radio label="image"><span style="color: #fff">图片</span></el-radio>
              <el-radio label="video"><span style="color: #fff">视频</span></el-radio>
            </el-radio-group>
            <div class="image_area">
              <el-upload
                class="avatar-uploader"
                action=""
                :http-request="Upload"
                :show-file-list="false"
                :on-change="handleChange2"
                :before-upload="environmentPhotoMediaType === 'image' ? checkFileType : checkVideoType"
                :accept="environmentPhotoMediaType === 'image' ? 'image/*' : 'video/*'"
              >
                <template #default>
                  <div class="upload-btn">
                    <div
                      v-if="(fieldList.environmentPhoto || environmentPhotoBlob) && environmentPhotoMediaType === 'image'"
                      class="img_upload"
                      style="position: relative"
                    >
                      <el-image
                        class="el_img"
                        style="width: 150px; height: 100px"
                        :src="environmentPhotoBlob || fieldList.environmentPhoto"
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
                    <div v-else-if="(fieldList.environmentVideoUrl || environmentPhotoBlob) && environmentPhotoMediaType === 'video'" class="video_upload" style="position: relative">
                      <video
                        style="width: 150px; height: 100px; object-fit: contain"
                        :src="environmentPhotoBlob || fieldList.environmentVideoUrl"
                        controls
                      >
                      </video>
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
              <!-- <div class="addImg">
                <el-button type="primary" @click="uploadImg2">{{
                  t("work.addPic")
                }}</el-button>
              </div> -->
            </div>

            <!-- <div class="addImg">{{ t('work.picLimit') }}</div> -->
          </div>
        </el-form-item>
      </el-form>
      <div class="btn_area">
        <el-button type="primary" @click="editField">
          {{ t("farm.editFarm") }}
        </el-button>
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
    <detail-map
      ref="sinoMapRef"
      :mapCenter="mapCenter"
      :polygonData="polygonData"
      @boundries="getBoundaries"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import detailMap from "./components/detailMap.vue";
import router from "@/router";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { gcoordLngLat } from "sino-tool-v3";
import { uploadImg_API } from "@/api/carManagement/index";
const route = useRoute();
const { t } = useI18n();
import { suggest_API, farmDetail_API, updateFarm_API, uploadVideo_API } from "@/api/fieldManagement/indx";
const words = ref(null);
const formRef = ref<any>();
const farmList = ref<any>([]);
const filedDetail = ref<any>({});
const mapCenter = ref<any>({
  markerId: null,
  center: [[121.734942, 31.086444]],
  zoom: 4,
});
const Upload = () => {};
const trueImg = ref("");
const trueImg2 = ref("");
const systemLogoBlob = ref("");
const environmentPhotoBlob = ref("");
const environmentPhotoMediaType = ref("image");
// 监听媒体类型切换,清空已选择的文件
watch(environmentPhotoMediaType, () => {
  if (environmentPhotoBlob.value) {
    deleteEnvironmentPhoto();
  }
});
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
  let formDataE = new FormData();
  formDataE.append("file", trueImg.value);

  const { data } = await uploadImg_API(formDataE);
  fieldList.systemLogo = data;
};
const uploadImg2 = async () => {
  let formDataE = new FormData();
  formDataE.append("file", trueImg2.value);

  if (environmentPhotoMediaType.value === "image") {
    const { data } = await uploadImg_API(formDataE);
    fieldList.environmentPhoto = data;
    fieldList.environmentVideoUrl = ""; // 清空视频字段
  } else {
    const { data } = await uploadVideo_API(formDataE);
    fieldList.environmentVideoUrl = data;
    fieldList.environmentPhoto = ""; // 清空图片字段
  }
};
const deleteSystemLogo = () => {
  systemLogoBlob.value = "";
  trueImg.value = "";
  fieldList.systemLogo = "";
};
const deleteEnvironmentPhoto = () => {
  environmentPhotoBlob.value = "";
  trueImg2.value = "";
  fieldList.environmentPhoto = "";
  fieldList.environmentVideoUrl = "";
};
const fieldList = reactive<any>({
  name: "",
  id: "",
  farmIntro: "",
  // address: "",
  remark: "",
  locationContour: [],

  systemLogo: "",
  environmentPhoto: "",
  environmentVideoUrl: "",
});
const polygonData = ref<any>([]);

const remoteOptions = ref<any>([]);
const getDetails = async () => {
  const { data } = await farmDetail_API({ id: route.query.id });
  filedDetail.value = data;
  fieldList.id = route.query.id;
  fieldList.name = data.name;
  fieldList.farmIntro = data.farmIntro;
  // fieldList.address = data.address;
  fieldList.remark = data.remark;
  fieldList.environmentPhoto = data.environmentPhoto;
  fieldList.environmentVideoUrl = data.environmentVideoUrl;
  fieldList.systemLogo = data.systemLogo;
  fieldList.locationContour = JSON.parse(data.locationContour);
  
  // 根据数据判断媒体类型
  if (data.environmentVideoUrl) {
    environmentPhotoMediaType.value = "video";
  }
  
  const boundaries = fieldList.locationContour.map((item: any) => {
    return {
      id: route.query.id,
      boundaries: item,
    };
  });

  polygonData.value[0] = boundaries;
};
getDetails();
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
      required: true,
      validator: (rule: any, value: any, callback: any) => {
        // 根据媒体类型检查对应的字段
        if (environmentPhotoMediaType.value === "image") {
          if (!fieldList.environmentPhoto) {
            callback(new Error(t("work.plzImg")));
          } else {
            callback();
          }
        } else {
          if (!fieldList.environmentVideoUrl) {
            callback(new Error("请上传视频"));
          } else {
            callback();
          }
        }
      },
      trigger: "change"
    }
  ],
};
const editField = async () => {
  if (fieldList.locationContour.length === 0) {
    return ElMessage.warning(t("farm.farmCannotBeEmpty"));
  }
  if (trueImg.value) {
    await uploadImg();
  }
  if (trueImg2.value) {
    await uploadImg2();
  }

  await formRef.value.validate();
  ElMessageBox.confirm(t("work.overConfirmation"), "Warning", {
    confirmButtonText: t("work.submit"),
    cancelButtonText: t("work.cancel"),
    type: "warning",
  })
    .then(async () => {
      try {
        await updateFarm_API(fieldList);
        ElMessage.success(t("work.updateSuccess"));
        router.go(-1);
      } catch {}
    })
    .catch(() => {});
};

const gotoback = () => {
  router.go(-1);
};
</script>

<style lang="scss" scoped>
.outarea {
  height: 100%;
  width: 100%;
  display: flex;
}
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
