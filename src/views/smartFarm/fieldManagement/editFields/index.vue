<!--  -->

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
          >{{ t("work.editField") }}
        </div>
      </div>
      <el-form
        style="width: 100%"
        ref="formRef"
        :model="fieldList"
        :rules="rules"
        label-width="100px"
      >
        <el-row class="item_title">
          <el-col :span="11" class="item_title_province"
            ><el-form-item :label="t('work.FieldName')" prop="name">
              <el-input
                style="width: 200px"
                v-model="fieldList.name"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="11" class="item_title_city">
            <el-form-item :label="t('work.FiledLength')" prop="perimeter">
              <el-input
                disabled
                style="width: 200px"
                v-model="fieldList.perimeter"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="item_title">
          <el-col :span="11" class="item_title_province">
            <el-form-item :label="t('work.FieldArea')" prop="area">
              <el-input
                disabled
                style="width: 200px"
                v-model="fieldList.area"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="11" class="item_title_city">
            <el-form-item :label="t('work.describe')" prop="description">
              <el-input style="width: 200px" v-model="fieldList.description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item
          :label="t('farm.color')"
          prop="color"
          :rules="[
            {
              required: radio !== '1', // 当类型不是1时才需要校验
              message: `${t('work.pleaseSelect')}`,
              trigger: 'blur',
            },
          ]"
        >
          <el-radio-group v-model="radio" class="ml-4" @change="changeRadio">
            <el-radio label="1" style="margin-right: 30px; color: #fff">{{
              $t("farm.notSet")
            }}</el-radio>
            <el-radio label="2" style="color: #fff"
              ><div style="display: flex; align-items: center">
                {{ $t("farm.set") }}
                <div class="color_area" @click.stop="isSHowColorPicker = true">
                  <div
                    v-if="fieldList.color"
                    class="color-preview"
                    :style="{ backgroundColor: fieldList.color }"
                  ></div>
                  <div v-else class="color-preview2"></div>
                </div></div
            ></el-radio>
          </el-radio-group>
          <transition name="height-expand">
            <div class="customColor_area" v-if="isSHowColorPicker">
              <CustomColorPicker
                v-model="fieldList.color"
                @confirm="handleConfirm"
                @clear="handleClear"
              />
            </div>
          </transition>
        </el-form-item>
      </el-form>
      <div class="btn_area">
        <el-button type="primary" @click="editField">
        {{ t("work.save") }}
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
      :lineData="lineData"
      :markerData="markerData"
      :color="fieldList.color"
      @areaValue="getArea"
      @lengthValue="getLength"
      @boundries="getBoundaries"
      @pickedPoints="getPickerPoints"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import detailMap from "./components/detailMap.vue";
import router from "@/router";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { useStorage } from "@vueuse/core";
import { gcoordLngLat } from "sino-tool-v3";
const route = useRoute();
const { t } = useI18n();
import {
  farmList_API,
  suggest_API,
  block_API,
  updateBlock_API,
} from "@/api/fieldManagement/indx";
const words = ref(null);
const formRef = ref<any>();
const isSHowColorPicker = ref(false);
const farmList = ref<any>([]);
const filedDetail = ref<any>({});
const mapCenter = ref<any>({
  markerId: null,
  center: [[121.734942, 31.086444]],
  zoom: 4,
});
const fieldList = reactive({
  id: "",
  farmId: useStorage("farmId", ""),
  name: "",
  color: "",
  perimeter: "",
  area: "",
  description: "",
  referenceLines: [],
  boundaries: [],
  obstacles: [],
});
const polygonData = ref<any>([]);
const lineData = ref<any>([]);
const markerData = ref<any>([]);
const remoteOptions = ref<any>([]);
const getDetails = async () => {
  const { data } = await block_API({ id: route.query.id });
  filedDetail.value = data;
  fieldList.id = data.id;
  fieldList.farmId = data.farmId ? data.farmId : "";
  fieldList.name = data.name;
  fieldList.perimeter = data.perimeter;
  fieldList.area = data.area;
  fieldList.description = data.description;
  fieldList.obstacles = data.obstacles;
  fieldList.boundaries = data.boundaries;
  fieldList.referenceLines = data.referenceLines;
  fieldList.color = data.color;
  const boundaries = data.boundaries.map((item: any) => {
    return {
      id: route.query.id,
      boundaries: item,
    };
  });

  const referenceLines = data.referenceLines.map((item: any) => {
    return {
      id: route.query.id,
      referenceLines: item,
    };
  });
  console.log(referenceLines);
  const obstacles = data.obstacles.map((item: any) => {
    return {
      id: route.query.id,
      obstacles: item,
    };
  });
  polygonData.value[0] = boundaries;
  lineData.value[0] = referenceLines;
  markerData.value[0] = obstacles;
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

const getArea = (e: any) => {
  fieldList.area = e;
};
const getLength = (e: any) => {
  fieldList.perimeter = e;
};
const getBoundaries = (e: any) => {
  fieldList.boundaries = JSON.parse(e);
};
const getPickerPoints = (e: any) => {
  fieldList.referenceLines = JSON.parse(e);
};
const rules = {
  name: [{ required: true, message: t("messages.plzenter"), trigger: "change" }],
  perimeter: [{ required: false, message: t("messages.plzenter"), trigger: "change" }],
  area: [{ required: true, message: t("messages.plzenter"), trigger: "change" }],
};
const editField = async () => {
  if (!fieldList.farmId) {
    return ElMessage.warning(t("farm.plzFarmId"));
  }
  await formRef.value.validate();
  ElMessageBox.confirm(t("work.overConfirmation"), "Warning", {
    confirmButtonText: t("work.submit"),
    cancelButtonText: t("work.cancel"),
    type: "warning",
  })
    .then(async () => {
      let uploadParams = {
        id: fieldList.id,
        farmId: fieldList.farmId,
        name: fieldList.name,
        perimeter: fieldList.perimeter,
        color: fieldList.color || "#83FFA4",
        area: fieldList.area,
        description: fieldList.description,
        referenceLines: fieldList.referenceLines,
        boundaries: fieldList.boundaries,
        obstacles: fieldList.obstacles,
      };
      try {
        await updateBlock_API(uploadParams);
        ElMessage.success(t("work.updateSuccess"));
        router.go(-1);
      } catch {}
    })
    .catch(() => {});
};
async function getFarmList() {
  const { data } = await farmList_API();
  farmList.value = data;
}
getFarmList();
const gotoback = () => {
  router.go(-1);
};
function handleConfirm(selected: any) {
  fieldList.color = selected;
  isSHowColorPicker.value = false;
}

function handleClear() {
  fieldList.color = "";
  isSHowColorPicker.value = false;
}
const radio = ref("2");
const changeRadio = () => {
  if (radio.value === "1") {
    fieldList.color = "";
  }
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
    width: 620px;
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
    z-index: 999;
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
.color-preview {
  width: 24px;
  height: 24px;
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.5);
}
.color-preview2 {
  width: 24px;
  height: 24px;
  border-radius: 2px;
  background-image: url("@/assets/common/commonColor.png");
}
.color_area {
  width: 30px;
  height: 30px;
  padding: 3px;
  background-color: #fff;
  border-radius: 2px;
  cursor: pointer;
  margin-left: 10px;
}
.crop-form {
  max-width: 800px;
  margin: 20px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.crop-item {
  margin-bottom: 10px;
}

.crop-fields {
  display: flex;
  align-items: center;
  gap: 10px;
}

.time-picker {
  width: 300px;
}

.crop-select {
  flex: 1;
  min-width: 140px;
}

.add-btn {
  margin-bottom: 10px;
}

:deep(.el-form-item__error) {
  padding-top: 5px;
}
.customColor_area {
  position: absolute;
  left: 0;
  top: 40px;
  z-index: 9999;
}
/* 显示动画 */
.height-expand-enter-from {
  /* 初始状态：高度为0，隐藏溢出内容 */
  height: 0;
  overflow: hidden;
  opacity: 0; /* 可选：添加透明度变化 */
}

.height-expand-enter-active {
  /* 动画过程：高度过渡到auto（实际高度） */
  transition: height 0.3s ease-out, opacity 0.3s ease-out;
}

.height-expand-enter-to {
  /* 最终状态：高度自动（由内容决定） */
  height: auto;
}

/* 隐藏动画 */
.height-expand-leave-from {
  /* 初始状态：保持实际高度 */
  height: auto;
}

.height-expand-leave-active {
  /* 动画过程：高度过渡到0 */
  overflow: hidden;
  transition: height 0.3s ease-in, opacity 0.3s ease-in;
}

.height-expand-leave-to {
  /* 最终状态：高度为0 */
  height: 0;
}
</style>
