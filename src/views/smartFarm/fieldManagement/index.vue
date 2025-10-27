<!--  -->
<template>
  <div class="map_container">
    <detail-map
      ref="sinoMapRef"
      :mapCenter="mapCenter"
      :polygonData="polygonData"
      :polygonData2="polygonData2"
      :lineData="lineData"
      :boundariesID="boundariesID"
      :markerData="markerData"
      :nameList="nameList"
      :colorList="colorList"
      @clickId="clickId"
      @lineSend="clickLines"
    />

    <!-- <div class="select_area">
      <el-select
        v-model="words"
        filterable
        remote
        clearable
        reserve-keyword
        style="width: 245px; color: #fff"
        :placeholder="t('work.searchAddress')"
        :remote-method="remoteMethod"
        @change="handleSelectBranchCom"
       
      >
        <el-option
          v-for="item in remoteOptions"
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
    </div> -->

    <div class="infinite-list_out">
      <div class="search_area">
        <div class="left">
          <el-input
            v-model="pageInfo.keyword"
            @change="changeKeyWord"
            :placeholder="t('work.searchField')"
            clearable
          >
          </el-input>
        </div>
        <div class="right">
          <!-- 下拉菜单触发器 -->
          <el-dropdown placement="bottom" @command="handleCommand" :show-arrow="false">
            <!-- 加号按钮 - 仅保留加号，无背景和hover效果 -->
            <el-button class="plus-button" text circle>
              <svg
                t="1758786305119"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="5826"
                width="16"
                height="16"
              >
                <path
                  d="M576 64H448v384H64v128h384v384h128V576h384V448H576z"
                  fill="#ffffff"
                  p-id="5827"
                ></path>
              </svg>
            </el-button>

            <!-- 下拉菜单内容 -->
            <template #dropdown>
              <el-dropdown-menu class="custom-dropdown">
                <el-dropdown-item command="manual" class="dropdown-item">
                  <el-icon class="item-icon"><Edit /></el-icon>
                  <span>手动创建</span>
                </el-dropdown-item>
                <el-dropdown-item command="import" class="dropdown-item">
                  <el-icon class="item-icon"><Upload /></el-icon>
                  <span>导入创建</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <!-- <div class="select_inner">
        <el-select
          @change="changeKeyWord"
          clearable
          filterable
          style="width: 100%"
          v-model="pageInfo.farm"
          :placeholder="$t('work.farmName')"
          transfer="true"
          :popper-append-to-body="false"
        >
          <el-option
            v-for="(item, index) in farmList"
            :key="index"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </div> -->
      <ul
        v-infinite-scroll="load"
        infinite-scroll-immediate="false"
        class="infinite-list"
        style="overflow: auto"
      >
        <li
          v-for="(item, index) in fieldList"
          :key="index"
          class="infinite-list-item list_line"
          :class="index === choosenIndex ? 'chooseLi' : ''"
          @click.stop="getBlock(index, item.id, item.boundaries)"
        >
          <div style="">
            <leftMap
              :polygon-data="item.boundaries"
              :mapCenter="mapCenter"
              :map-key="item.id"
              :color="colorList[index]"
              :init-delay="index * 10"
            />
          </div>
          <div class="left">
            <div class="top">
              <!-- <img src="@/assets/common/filed.png" alt="" /> -->
              <div class="trun_area">
                <TruncatedString :text="item.name" :maxLength="18" />
              </div>
              <!-- <div v-if="item.shared" class="shared_area">{{ t("work.isShared") }}</div>
              <div v-else class="unshared_area">{{ t("work.noShared") }}</div> -->
              <!-- <div class="unshared_area">
                {{ t("statisticsReport.thousandArea") }}:
              </div> -->
              <div class="unshared_area">
                {{ item.area ? item.area.toFixed(2) : 0 }}{{ t("work.are") }}
              </div>
            </div>
            <div class="bottom">
              {{ item.creator || "--" }} | {{ item.modifier || "--" }}
            </div>

            <div class="arrow_area">
              <img src="@/assets/common/rightArrow.png" alt="" />
            </div>
          </div>
        </li>
        <!-- <div class="new_img" @click="gotoNewCars">
          <img src="@/assets/common/new.png" alt="" /> {{ t("work.new") }}
        </div> -->
      </ul>
    </div>
    <div class="info_box" v-show="infoShow">
      <div class="top_line">
        <div>{{ fieldInfo.name }}</div>
        <div>
          <el-button
            type="primary"
            size="small"
            style="margin-left: 10px"
            @click="goEdit(fieldInfo.id)"
            link
          >
            {{ t("work.edit") }}
          </el-button>
          <el-button link type="danger" size="small" @click="deleteFields(fieldInfo.id)">
            {{ t("work.delete") }}
          </el-button>
        </div>
      </div>
      <div class="info_line">
        <el-row>
          <el-col :span="locale === 'en' ? 12 : 8">
            {{ t("work.allArea") + "(mu)" }}:</el-col
          >
          <el-col :span="12"> {{ fieldInfo.area }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="locale === 'en' ? 12 : 8">
            {{ t("work.circumference") + "(m)" }}:</el-col
          >
          <el-col :span="12"> {{ fieldInfo.perimeter }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="locale === 'en' ? 12 : 8"> {{ t("work.creationTime") }}:</el-col>
          <el-col :span="12"> {{ fieldInfo.createTime }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="locale === 'en' ? 12 : 8"> {{ t("work.creator") }}:</el-col>
          <el-col :span="12"> {{ fieldInfo.creator }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="locale === 'en' ? 12 : 8"> {{ t("work.modifyTime") }}:</el-col>
          <el-col :span="12"> {{ fieldInfo.modifyTime }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="locale === 'en' ? 12 : 8"> {{ t("work.modifier") }}:</el-col>
          <el-col :span="12"> {{ fieldInfo.modifier }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="locale === 'en' ? 12 : 8"> {{ t("work.describe") }}:</el-col>
          <el-col class="wrap-col" :span="12"> {{ fieldInfo.description }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="locale === 'en' ? 12 : 8"> {{ t("work.address") }}:</el-col>
          <el-col :span="12">
            {{ fieldInfo.address }}
            <!-- <el-button
              link
              type="primary"
              size="small"
              @click="checkShare(fieldInfo.id, fieldInfo.createType)"
              >{{ t("work.shareDevice") }}</el-button
            > -->
            <div style="display: flex">
              <el-button link type="primary" size="small">分享边界</el-button>
              <el-button
                link
                type="primary"
                size="small"
                v-if="fieldInfo.haveReference"
                @click="showlines(fieldInfo.companyId)"
                >显示作业线</el-button
              >
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" :title="t('work.share')" center width="500px">
      <div class="top_att" v-if="creatorType === 1">
        {{ t("work.patAtt") }}
      </div>
      <div class="dia_select">
        {{ t("work.shareDevice") }}:

        <el-select-v2
          style="width: 240px; margin-left: 10px"
          filterable
          v-model="pickedSn"
          :options="options"
          :placeholder="$t('work.pleaseSelect')"
        >
        </el-select-v2>
      </div>

      <div class="dia_select1">
        <el-button type="primary" @click="shareCar(fieldInfo.id)">{{
          t("work.share")
        }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-model="dialogVisible2"
      :title="t('work.share')"
      center
      width="500px"
      @close="selectedCarId = ''"
    >
      <div class="dia_select">
      
        <el-select
          filterable
          v-model="selectedCarId"
          class="input-with-select"
          style="width: 300px"
          :placeholder="$t('work.pleaseSelect')"
        >
          <el-option
            v-for="item in carList2"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
      </div>

      <div class="dia_select1">
        <el-button @click="dialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm2">确认下发</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import detailMap from "./components/detailMap.vue";
import leftMap from "./components/leftMap.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { gcoordLngLat } from "sino-tool-v3";
import { useStorage } from "@vueuse/core";

import {
  filedPage_API,
  suggest_API,
  farmList_API,
  block_API,
  farmDetail_API,
  deleteBlock_API,
  share_API,
  listVehicle_API,
  shareCar_API,
  getCarList_API,
  pushReferenceLine_API,
} from "@/api/fieldManagement/indx";
import router from "@/router";
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();
const sinoMapRef = ref<any>();
const lineData = ref<any>([]);
const dialogVisible2 = ref(false);
const dialogVisible = ref(false);
const markerData = ref<any>([]);
const choosenIndex = ref<any>("");
const polygonData = ref<any>([]);
const polygonData2 = ref<any>([]);
const nameList = ref<any>([]);
const colorList = ref<any>([]);
const boundariesID = ref<any>([]);
const selectedCarId = ref("");
const loading = ref(false);
const fieldInfo = ref<any>({});
let options = <any>[];
const words = ref();
const farmList = ref<any>([]);
const total = ref(0);
const infoShow = ref(false);
const pickedSn = ref("");
const companyId = ref("");
const mapCenter = ref<any>({
  markerId: null,
  center: [[121.734942, 31.086444]],
  zoom: 4,
});
const carList = ref<any>([]);
const carList2 = ref<any>([]);
const remoteOptions = ref<any>([]);

const pageInfo = reactive<any>({
  companyId: "",
  keyword: "",
  farmId: useStorage("farmId", ""),
  currentPage: 1,
  pageSize: 900,
});
const showlines = (id: any) => {
  // {
  //       linesId: 1234,
  //       referenceLines: [
  //         {
  //           id: 12,
  //           referenceLines: {
  //             s72: 0,
  //             s94: {
  //               s73: ["31.246616964,121.46553773", "31.246616965,121.46553772"], // ab两个点
  //             },
  //           },
  //         },
  //         {
  //           id: 13,
  //           referenceLines: {
  //             s72: 2,
  //             s94: {
  //               s73: [
  //                 "31.246616964,121.46553773",
  //                 "31.246616965,121.46553772",
  //                 "31.246616965,121.46553772",
  //                 "31.246616965,121.46553772",
  //               ], // abcd四个点
  //               s81: 0, // 基准线  0:AB 1:BC 2:CD 3:DA
  //               s82: 0, // 掉头方向 0:无方向 1:左掉头 2:右掉头
  //               s83: 5.0, //转弯半径 m
  //               s84: 2.2, // 边界距离 m
  //               s85: 1, //跨行数
  //             },
  //           },
  //         },
  //         {
  //           id: 14,
  //           referenceLines: {
  //             s72: 4,
  //             s94: {
  //               s73: ["31.246616964,121.46553773"], // 单点
  //               s83: 5.0, // 同心圆最小半径
  //             },
  //           },
  //         },
  //         {
  //           id: 15,
  //           referenceLines: {
  //             s72: 5,
  //             s94: {
  //               s73: ["31.246616964,121.46553773", "31.246616965,121.46553772"], // 任意点
  //               s76: 2, // 曲线点个数
  //             },
  //           },
  //         },
  //         {
  //           id: 16,
  //           referenceLines: {
  //             s72: 6,
  //             s94: {
  //               s73: ["31.246616964,121.46553773", "31.246616965,121.46553772"], // 任意点
  //             },
  //           },
  //         },
  //         {
  //           id: 17,
  //           referenceLines: {
  //             s72: 7,
  //             s94: {
  //               s73: [
  //                 "31.246616964,121.46553773",
  //                 "31.246616965,121.46553772",
  //                 "31.246616964,121.46553773",
  //               ], // 三个点
  //               s83: 5.0, // 圆半径
  //             },
  //           },
  //         },
  //         {
  //           id: 18,
  //           referenceLines: {
  //             s72: 8,
  //             s94: {
  //               s73: [
  //                 "31.246616964,121.46553773",
  //                 "31.246616965,121.46553772",
  //                 "31.246616965,121.46553772",
  //                 "31.246616964,121.46553773",
  //               ], // 任意首尾封闭点集
  //             },
  //           },
  //         },
  //         {
  //           id: 19,
  //           referenceLines: {
  //             s72: -101,
  //             s94: {
  //               s73: ["31.246616964,121.46553773"], // 单点
  //               s77: 0.4887, // 航向
  //             },
  //           },
  //         },
  //         {
  //           id: 20,
  //           referenceLines: {
  //             s72: -102,
  //             s94: {
  //               s73: ["31.246616964,121.46553773", "31.246616965,121.46553772"],
  //               //两点
  //               s82: 0, // 田块方向  1:左 2:右
  //               s83: 5.0, // 转弯半径 m
  //               s84: 2.2, // 边界距离 m
  //               s85: 1, //跨行数
  //             },
  //           },
  //         },
  //       ],
  //     },
  lineData.value.push({
    linesId: fieldInfo.value.id,
    referenceLines: fieldInfo.value.referenceLines,
  });
  companyId.value = id;
};
const getCarList2 = async () => {
  const res = await getCarList_API({
    companyId: companyId.value,
  });
  carList2.value = res.data;
};
const handleConfirm2 = async () => {
  if (!selectedCarId.value) {
    ElMessage.warning("请选择车辆");
  } else {
    try {
      await pushReferenceLine_API({
        ReferenceLineId: lineValue.value,
        vehicleId: selectedCarId.value,
      });
      ElMessage.success("下发成功");
      dialogVisible2.value = false;
      lineValue.value = "";
      selectedCarId.value = "";
    } catch {}
  }
};
watch(
  () => pageInfo.farmId,
  () => {
    changeKeyWord();
    getDetails();
  },
  { deep: true }
);

const locationContour = ref([]);
const getDetails = async () => {
  const { data } = await farmDetail_API({ id: pageInfo.farmId });

  locationContour.value = JSON.parse(data.locationContour);
  const boundaries = locationContour.value.map((item: any) => {
    return {
      id: pageInfo.farmId,
      boundaries: item,
    };
  });

  polygonData2.value[0] = boundaries;
};
getDetails();

const reReqList = () => {
  pageInfo.currentPage = 1;
  pageInfo.pageSize = 900;
  fieldList.value = [];
  loading.value = false;
  choosenIndex.value = "";
  sinoMapRef.value.deleteAllMarkers();
  fieldInfo.value = [];
  infoShow.value = false;
  polygonData.value = [];
  nameList.value = [];
  colorList.value = [];
  lineData.value = [];
  markerData.value = [];
  getFieldData();
};
const shareCar = async (id: any) => {
  if (!pickedSn.value) {
    return ElMessage.warning(t("work.pleaseSelect"));
  }
  try {
    await shareCar_API({
      id: id,
      carId: pickedSn.value,
    });
    ElMessage.success(t("work.shareSuccess"));
    dialogVisible.value = false;
    reReqList();
  } catch {}
};

const fieldList = ref<any>([]);
const load = () => {
  if (pageInfo.currentPage * pageInfo.pageSize < total.value) {
    pageInfo.currentPage++;
    getFieldData();
  }
};
const goEdit = (id: any) => {
  router.push({ path: `fieldManagement/editFields`, query: { id: id } });
};

const handleCommand = (command: any) => {
  if (command === "manual") {
    // 手动创建逻辑
    gotoNewCars();
  } else if (command === "import") {
    // 导入创建逻辑
  }
};

const getCarList = async () => {
  const res = await listVehicle_API();
  carList.value = res.data;
  options = carList.value.map((item: any, _idx: any) => {
    return {
      value: item.carId,
      label: item.name ? item.name + "(" + item.sn + ")" : item.sn,
    };
  });
};

const deleteFields = async (id: any) => {
  try {
    await deleteBlock_API({ id: id });
    ElMessage.success(t("work.deleteSuccess"));
    reReqList();
  } catch {}
};
// 1平台 2终端
const creatorType = ref<any>(1);
const checkShare = async (id: any, type: any) => {
  creatorType.value = type;
  try {
    await share_API({ id: id });
    dialogVisible.value = true;
    pickedSn.value = "";
  } catch {}
};
const changeKeyWord = () => {
  reReqList();
};
getCarList();
const gotoNewCars = () => {
  router.push({ path: `fieldManagement/newFields` });
};
const getBlock = async (index: any, id: any, boundaries: any) => {
  if (choosenIndex.value === index) {
    infoShow.value = false;
    choosenIndex.value = "";
    boundariesID.value = [];
  } else {
    boundariesID.value = [];
    infoShow.value = true;
    const res = await block_API({ id: id });
    fieldInfo.value = res.data;

    boundariesID.value = boundaries;
    choosenIndex.value = index;
  }
};
const getFieldData = async () => {
  const { data } = await filedPage_API(pageInfo);
  total.value = data.total;
  if (fieldList.value.length >= data.total) {
    loading.value = true;
  } else {
    fieldList.value.push(...data.records);
    const name = data.records.map((item: any) => {
      return item.name;
    });
    const color = data.records.map((item: any) => {
      return item.color;
    });
    const boundaries = data.records.map((item: any, index: any) => {
      return {
        id: name[index],
        boundaries: item.boundaries,
        clickId: item.id,
      };
    });
    // const referenceLines = data.records.map((item: any, index: any) => {
    //   return {
    //     id: name[index],
    //     referenceLines: item.referenceLines,
    //   };
    // });
    const obstacles = data.records.map((item: any, index: any) => {
      return {
        id: name[index],
        obstacles: item.obstacles,
      };
    });
    nameList.value.push(...name);
    polygonData.value.push(boundaries);
    // lineData.value.push(referenceLines);
    markerData.value.push(obstacles);
    colorList.value.push(...color);
  }
};
getFieldData();
// const clickLeft = () => {
//   infoShow.value = false;
//   boundariesID.value = [];
//   choosenIndex.value = "";
// };
const lineValue = ref("");

function clickId(index: any, id: any, boundaries: any) {
  getBlock(index, id, boundaries);
}
function clickLines(lineId: any) {
  lineValue.value = lineId;
  getCarList2();
  dialogVisible2.value = true;
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
// 关键字查询
async function wordsSearch(e: any) {
  if (e) {
    const res = await suggest_API({ address: e });
    remoteOptions.value = res.data;
  }
}
</script>

<style lang="scss" scoped>
.map_container {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  position: relative;

  .select_area {
    position: absolute;
    left: 374px;
    top: 24px;
    z-index: 99999;
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
  .select_inner {
    height: 55px;
    margin-left: 2%;
    width: 96%;
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
}
.info_box {
  position: absolute;
  top: 72px;
  left: 374px;
  width: 264px;
  padding: 4px 8px;
  background-color: rgba(16, 34, 15, 0.68);
  color: #fff;
  background-size: 130% 130%;
  z-index: 999;
  .top_line {
    display: flex;
    padding: 0 5px;
    justify-content: space-between;
  }
  .info_line {
    font-size: 13px;
    .el-row {
      margin: 4px 0;
    }
  }
}
.infinite-list_out {
  position: absolute;
  top: 10px;
  left: 10px;
  height: 95%;
  width: 354px;
  padding: 4px;
  background-color: rgba(16, 34, 15, 0.68);
  color: #fff;
  background-size: 130% 130%;
  z-index: 999;
  .search_area {
    width: 96%;
    margin-bottom: 20px;
    margin-top: 10px;
    margin-left: 2%;
    --el-text-color-placeholder: #fff;
    display: flex;
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

    .left {
      width: 85%;
    }
    .right {
      width: 15%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.infinite-list {
  height: 90%;
  width: 100%;
  margin: 0;
}
.infinite-list .infinite-list-item {
  padding: 0 2% 0 1%;
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 80px;
  width: 100%;
  border-bottom: 2px solid;
  border-image: linear-gradient(
      to right,
      rgba(145, 145, 145, 0),
      rgba(247, 247, 247, 0.53),
      rgba(145, 145, 145, 0)
    )
    1;
}

.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}

.list_line {
  display: flex;
  img {
    width: 22px;

    height: 22px;
    margin-right: 4px;
  }
  .left {
    margin-left: 3px;
    width: 100%;
    position: relative;
    .arrow_area {
      width: 30px;
      cursor: pointer;
      position: absolute;
      top: calc(50% - 11px);
      right: 0px;
      z-index: 999999;
      img {
        width: 14px;
        height: 14px;
      }
    }
    .unshared_area {
      padding: 0 3px;
      font-size: 14px;
      // border: 1px solid rgba(160, 176, 172, 1);

      border-radius: 10px;

      top: calc(50% - 11px);
      display: flex;
      height: 22px;
      align-items: center;
    }
    .shared_area {
      padding: 0 3px;
      font-size: 14px;
      // border: 1px solid rgba(54, 177, 110, 1);
      color: rgba(54, 177, 110, 1);
      border-radius: 10px;

      top: calc(50% - 11px);
      display: flex;
      height: 22px;
      align-items: center;
    }
    .top {
      height: 50%;
      width: 85%;
      align-items: center;
    }
    .bottom {
      height: 50%;
      width: 85%;
      font-size: 12px;
      color: rgba(129, 178, 167, 1);
      display: flex;
      align-items: center;
    }
  }
}
.chooseLi {
  background: linear-gradient(
    90deg,
    rgba(76, 176, 79, 0) 0%,
    var(--el-color-primary) 100%
  );
}
.new_img {
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 14px;
  cursor: pointer;
  img {
    margin-right: 5px;
    width: 20px;
    height: 20px;
  }
}
.dia_select {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dia_select1 {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
}
.top_att {
  color: red;
  padding: 10px 50px;
}
.trun_area {
  display: flex;
  align-items: center;
  width: 60px;
}
.map_left {
  width: 180px;
  height: 80px;
}

// db

/* 核心样式：完全重置按钮样式 */
.plus-button {
  /* 重置所有基础样式 */
  background-color: transparent !important;
  color: #333 !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;

  /* 移除Element Plus的内置过渡效果 */
  transition: none !important;
}

/* 关键：覆盖所有状态下的样式 */
.plus-button:hover,
.plus-button:focus,
.plus-button:active,
.plus-button:focus-visible {
  background-color: transparent !important;
  color: #333 !important;
  border-color: transparent !important;
  box-shadow: none !important;
  outline: none !important;
  transform: none !important;
}

/* 确保图标显示正常 */
.plus-button .el-icon {
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 下拉菜单样式保持不变 */
.custom-dropdown {
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: none;
  padding: 4px 0;
  min-width: 160px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f5f7fa;
}

.item-icon {
  margin-right: 8px;
  font-size: 16px;
}
.wrap-col {
  /* 确保容器有明确宽度（el-col 通常由 span 控制，可省略） */
  width: 100%;
  /* 强制文本换行（默认 normal 即可，但如果被覆盖需显式设置） */
  white-space: normal;
  /* 可选：当单词过长时强制拆分换行（针对英文/数字） */
  word-break: break-all; /* 或 break-word */
  /* 可选：添加边框便于观察 */
}
</style>
