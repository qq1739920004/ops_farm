<template>
  <div class="map_container">
    <sino-map
      ref="sinoMapRef"
      :markerData="markerData"
      :markerDataHandle="markerDataHandle"
      :markerDataHidden="markerDataHidden"
      :mapCenter="mapCenter"
      :handleOb="handleOb"
      mapRenderMode="canvas"
    />
    <div class="search_box">
      <!--    :placeholder="$t('messages.SNLabelSNcarName')" -->
      <el-autocomplete
        :style="{ width: labelWidth }"
        v-model="searchSn"
        :fetch-suggestions="querySearch"
        @select="handleSelect"
        clearable
      >
        <template #suffix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
        <template #default="{ item }">
          <div :class="{ bt_1: item.border && item.markerId }">
            <div v-if="item.markerId">
              <span>{{ item.sn }}</span>

              <span v-if="item.carName"> | {{ item.carName }}</span>

              <span v-if="item.npn"> | {{ item.npn }}</span>
            </div>
            <div v-if="item.markerId">
              <span>{{ item.companyName }}</span>

              <span v-if="item.tel"> | {{ item.tel }}</span>
            </div>
            <div v-if="!item.markerId">{{ item }}</div>
          </div>
        </template>
      </el-autocomplete>
    </div>
    <div
      :class="{
        statistics_box: true,
        statistics_box_active: statistics_box_isActive,
      }"
    >
      <div class="header" @click="statistics_box_isActive = !statistics_box_isActive">
        <el-icon v-if="!statistics_box_isActive" color="#fff">
          <ArrowUpBold />
        </el-icon>
        <el-icon v-else color="#fff">
          <ArrowDownBold />
        </el-icon>
      </div>
      <ul class="top">
        <li class="top_line">
          <div>{{ dataStatistics.device?.totalDevice }}</div>
          <div>{{ $t("messages.total") }}</div>
        </li>
        <li class="top_line">
          <div>{{ dataStatistics.device?.onlineDevice }}</div>
          <div>{{ $t("messages.onlineCount") }}</div>
        </li>

        <li>
          <div v-if="locale.includes('zh')">{{ dataStatistics.workArea?.todayArea.toFixed(2) }}</div>
          <div v-else>{{ (dataStatistics.workArea?.todayArea/15).toFixed(2) }}</div>
          <div>{{ $t("messages.todaysOperation") }}</div>
        </li>
        <li>
          <el-tooltip
            class="item"
            effect="dark"
            :disabled="isShowTooltip"
            :content="dataStatistics.workArea?.totalArea / 10000"
            placement="top"
          >
            <div style="text-overflow: ellipsis; overflow: hidden">
              <!-- <span ref="refName" @mouseover="onMouseOver" v-if="locale =='en'">
                {{
                  dataStatistics.workArea
                    ? (dataStatistics.workArea?.totalArea / 10000/15).toFixed(3)
                    : ""
                }}
              </span>
              <span ref="refName" @mouseover="onMouseOver" v-else>
                {{
                  dataStatistics.workArea
                    ? (dataStatistics.workArea?.totalArea / 10000).toFixed(2)
                    : ""
                }}
              </span> -->
              <span ref="refName" @mouseover="onMouseOver" v-if="locale.includes('zh')">
                {{
                  dataStatistics.workArea
                    ? (dataStatistics.workArea?.totalArea / 10000).toFixed(2)
                    : ""
                }}
              </span>
              <span ref="refName" @mouseover="onMouseOver" v-else>
                {{
                  dataStatistics.workArea
                    ? (dataStatistics.workArea?.totalArea / 15*10000).toFixed(2)
                    : ""
                }}
              </span>
            </div>
          </el-tooltip>

          <!-- <div v-if="locale =='zh'">{{ $t("messages.cumulativeOperation") }}</div>
          <div v-if="locale =='en'">km²</div> -->
          
         <div >{{ $t("messages.cumulativeOperation") }}</div>
        </li>
        <li>
          <div>{{ dataStatistics.workDuration?.todayDuration }}</div>
          <div>{{ $t("messages.todayTime") }}(h)</div>
        </li>
        <li>
          <div>
            {{
              dataStatistics.workArea
                ? (dataStatistics.workDuration?.beforeDuration).toFixed(2)
                : ""
            }}
          </div>
          <div>{{ $t("messages.culTime") }}(h)</div>
        </li>
        <div
          style="
            height: 2px;
            width: 100%;
            background-color: rgba(0, 218, 216, 0.3);
            margin: 15px 0;
          "
        ></div>
        <li class="bottom_li">
          <span class="num_test">{{ dataStatistics.drive?.driving }}</span>
          <div>
            <el-checkbox
              size="large"
              v-model="onlineList[0].checked"
              @change="markerTypeChange()"
            />
            <span>{{ $t("messages.InOperation") }}</span>
            <div></div>
          </div>
        </li>
        <li class="bottom_li bottom_li2">
          <span class="num_test">{{ dataStatistics.drive?.standbyDevice }}</span>
          <div>
            <el-checkbox
              size="large"
              v-model="onlineList[1].checked"
              @change="markerTypeChange()"
            />
            <span>{{ $t("messages.Standby") }}</span>
            <div></div>
          </div>
        </li>
        <li class="bottom_li">
          <span class="num_test">
            {{ dataStatistics.device?.totalDevice - dataStatistics.device?.onlineDevice }}
          </span>
          <div class="outside">
            <el-checkbox
              size="large"
              v-model="onlineList[2].checked"
              @change="markerTypeChange()"
            />
            <span> {{ $t("messages.Offline") }}</span>

            <div class="offline_area"></div>
          </div>
        </li>
      </ul>
      <ul class="center" style="margin-left:10px"> 
        <li v-for="(item, index) in dataStatistics.type" :key="index">
          <label>
            <el-checkbox
              size="large"
              v-model="item.checked"
              @change="markerTypeChange()"
            />
            <!-- <SvgIcon :icon="item.typeName" size="22" /> -->
            <span class="label">{{ item.typeName }}</span>
          </label>
          <span class="value">{{ item.onlineCount }}</span
          >/ <span class="value">{{ item.totalCount }}</span>
        </li>
        <br />
      </ul>
    </div>
    <!-- <div
      :class="{
        notice_box: true,
        notice_box_active: notice_box_isActive,
      }"
    >
      <div class="header" @click="notice_box_isActive = !notice_box_isActive">
        <h3>{{ $t("messages.StatusNotification") }}</h3>
        <el-icon v-if="!notice_box_isActive" color="#fff">
          <ArrowDownBold />
        </el-icon>
        <el-icon v-else color="#fff">
          <ArrowUpBold />
        </el-icon>
      </div>
      <div class="content">
        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in carLogList"
            :key="index"
            :color="item.color"
          >
            <div class="item">
              <div class="l">
                <span class="state" :style="{ color: item.color }">{{
                  item.state == 0
                    ? $t("messages.Offline")
                    : item.state == 1
                    ? $t("messages.Online")
                    : $t("messages.Alarms")
                }}</span>
              </div>
              <div class="r">
                <p v-if="item.state == 2" class="state_2">
                  {{ $t("messages.Poordrivingperformance") }}
                </p>
                <div class="title">
                  <span>{{ item.carName }}</span>
                  <span @click="searchDevicePosition(item.markerId)">{{
                    item.deviceSn
                  }}</span>
                </div>
                <p>{{ item.position }}</p>
                <p v-if="item.state != 2">
                  {{ item.state == 0 ? item.offlineTime : item.onlineTime }}
                </p>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div> -->

    <!-- 实时趋势驾驶图diaLog -->
    <realTimeChart ref="realTime" :sn="sn" :socketData="socketStore.socketData" />
    <RemoteControl
      :isChange="isChange"
      :terminalType="terminalType"
      :paramVersionnum="version"
      :paramType="type"
      :carId="carId"
      :sn="sn"
      :name="name"
    />
  </div>
</template>

<script setup lang="ts">
import AG360 from "@/assets/icons/AG360.svg";
import AG360_warn from "@/assets/icons/AG360_warn.svg";
import AG360_offline from "@/assets/icons/AG360_offline.svg";
// import AG302 from "@/assets/icons/AG302.svg";
// import AG302_warn from "@/assets/icons/AG302_warn.svg";
// import AG501 from "@/assets/icons/AG501.svg";
// import AG501_warn from "@/assets/icons/AG501_warn.svg";
// import AG501Pro from "@/assets/icons/AG501Pro.svg";
// import AG501Pro_warn from "@/assets/icons/AG501Pro_warn.svg";
// import AG502 from "@/assets/icons/AG502.svg";
// import AG502_warn from "@/assets/icons/AG502_warn.svg";
// import AG302Android from "@/assets/icons/AG302Android.svg";
// import AG302Android_warn from "@/assets/icons/AG302Android_warn.svg";
// import MC100 from "@/assets/icons/MC100.svg";
// import MC100_warn from "@/assets/icons/MC100_warn.svg";
// import AGunknown from "@/assets/icons/AGunknown.svg";
// import AGunknown_warn from "@/assets/icons/AGunknown_warn.svg";
import satelite from "@/assets/monitoring/sa1.png";
import satelite2 from "@/assets/monitoring/sa2.png";
import wifi_0 from "@/assets/monitoring/s-1.png";
import wifi_1 from "@/assets/monitoring/s-2.png";
import wifi_2 from "@/assets/monitoring/s-3.png";
import wifi_3 from "@/assets/monitoring/s-4.png";
import wifi_4 from "@/assets/monitoring/s-5.png";
import green from "@/assets/monitoring/green.svg";
import gray from "@/assets/monitoring/gray.svg";
import yellow from "@/assets/monitoring/yellow.svg";
import SinoMap from "@/components/SinoMap/index.vue";
// import SvgIcon from "@/components/SvgIcon/index.vue";
import realTimeChart from "./components/realTimeChart.vue";
import RemoteControl from "@/components/remoteAdjust/index.vue";
// import MT801 from "@/assets/icons/MT801.svg";
// import MT801_warn from "@/assets/icons/MT801_warn.svg";
// import MT802 from "@/assets/icons/MT802.svg";
// import MT802_warn from "@/assets/icons/MT802_warn.svg";
// import SA200 from "@/assets/icons/SA200.svg";
// import SA200_warn from "@/assets/icons/SA200_warn.svg";
import { reactive, ref, watch, onUnmounted, computed, onMounted } from "vue";
import useSocketStore from "@/store/socket";
import { useRouter, useRoute } from "vue-router";
import {
  onlineFarmMachinePosition_API,
  farmMachineDataStatistics_API,
} from "@/api/monitoring";
// carLog_API,
import { useI18n } from "vue-i18n";
const sinoMapRef = ref();
const { t } = useI18n();
const { locale } = useI18n();
const refName = ref<any>(null);
let mapRenderModeLengthMax = 500;
const router = useRouter();
const route = useRoute();
const onlineList = ref<any>([
  { checked: true, typeName: "online1" },
  { checked: true, typeName: "online2" },
  { checked: true, typeName: "offline" },
]);
const socketStore = useSocketStore();
let markerData = ref<any>([]);
let markerDataHidden = ref<any>([]);
let markerDataHandle = ref<any>({});
let dataStatistics = ref<any>({});
const isShowTooltip = ref(true);
// let carLogList: any = ref([]);
const statistics_box_isActive = ref(false);
let sn = ref();
let realTime = ref();
let terminalType = ref();
let version = ref();
let carId = ref();
let name = ref();
let type = ref();
// let notice_box_isActive = ref(false);
let isChange = ref(false);
// let searchForm = reactive({ sn: "" });

const searchSn = ref(""); // sn 车辆名 公司 手机号
const mapCenter = reactive<any>({
  markerId: "",
  mapCenter: [],
});

// @ts-ignore
window.goMachineryList_markerPopup = goMachineryList_markerPopup;
// @ts-ignore
window.goTaskMachine_markerPopup = goTaskMachine_markerPopup;
// @ts-ignore
window.gohistoryChart_markerPopup = gohistoryChart_markerPopup;
// @ts-ignore
window.openRealTimeChart_markerPopup = openRealTimeChart_markerPopup;
// @ts-ignore
window.openRemote_markerPopup = openRemote_markerPopup;

watch(
  () => socketStore.socketData,
  (socketData) => {
    handleSocketData(socketData);
  },
  { deep: true }
);
function onMouseOver() {
  let parentWidth = refName.value.parentNode.offsetWidth;
  let contentWidth = refName.value.offsetWidth;
  // 判断是否开启tooltip功能
  if (contentWidth > parentWidth) {
    isShowTooltip.value = false;
  } else {
    isShowTooltip.value = true;
  }
}

const labelWidth = computed(() => {
  return locale.value == "zh" ? "280px" : "350px";
});

onUnmounted(() => {
  socketStore.close();
});
onMounted(() => {
  socketStore.connect();
});

getFaromDataStatistics();
getOnlineFarmPosition();
// getCarLogList();

//查询设备地图定位
// function searchDevicePosition(id: any) {
//   mapCenter.markerId = id;
// }

// sn、车辆名、公司名、电话 搜索
function querySearch(queryString: string, cb: any) {
  // if (!queryString) return;
  let filterData = markerData.value.filter((item: any) => {
    if (item.sn && item.sn.includes(queryString)) {
      return true;
    }
    if (item.npn && item.npn.includes(queryString)) {
      return true;
    }
    if (item.carName && item.carName.includes(queryString)) {
      return true;
    }
    if (item.companyName && item.companyName.includes(queryString)) {
      return true;
    }
    if (item.tel && item.tel.includes(queryString)) {
      return true;
    }
  });
  if (filterData.length <= 0) {
    cb(["无数据"]);
    return;
  }
  if (filterData.length > 3) filterData.length = 3;
  filterData.forEach((item: any) => {
    item.border = true;
    item.value = item.sn;
  });
  filterData[filterData.length - 1].border = false;
  cb(filterData);
  return;
}
const handleOb = reactive<any>({
  markerId:''
})
// 搜索框确认选择
function handleSelect(item: any) {
  if (!item.markerId) return;
 handleOb.markerId = item.markerId
}

// 处理socketData数据
function handleSocketData(socketData: any) {
  if (socketData.module == "farm" && socketData.type == "farmPt") {
    let { action, data } = socketData;
    if (action == "upline") {
      if (sinoMapRef.value.isIconChange) {
        const markerId = data.sn;
        const markerLng = data.posY;
        const markerLat = data.posX;
        const onlineTcp = data.onlineTcp;
        const driveState = data.driveState;
        const markerType = createMarkerType(data);
        const markerIcon = sinoMapRef.value.iconChangeLimit
          ? createMarkerIcon(data)
          : createMarkerIconSmall(data);
        const markerPopup = createMarkerPopup(data);
        markerDataHandle.value = {
          markerId,
          onlineTcp,
          driveState,
          markerLng,
          markerLat,
          markerType,
          markerIcon,
          markerPopup,
          markerHandle: "add",
        };
      } else {
        const markerId = data.sn;
        const markerLng = data.posY;
        const markerLat = data.posX;
        const markerType = createMarkerType(data);
        const markerIcon = createMarkerIcon(data);
        const markerPopup = createMarkerPopup(data);
        const onlineTcp = data.onlineTcp;
        const driveState = data.driveState;
        markerDataHandle.value = {
          markerId,
          onlineTcp,
          driveState,
          markerLng,
          markerLat,
          markerType,
          markerIcon,
          markerPopup,
          markerHandle: "add",
        };
      }
    }
    if (action == "offline") {
      if (sinoMapRef.value.isIconChange) {
        const markerId = data.sn;
        const markerLng = data.posY;
        const markerLat = data.posX;
        const onlineTcp = data.onlineTcp;
        const driveState = data.driveState;
        const markerType = createMarkerType(data);
        const markerIcon = sinoMapRef.value.iconChangeLimit
          ? createMarkerIcon(data)
          : createMarkerIconSmall(data);
        const markerPopup = createMarkerPopup(data);
        markerDataHandle.value = {
          markerId,
          onlineTcp,
          driveState,
          markerLng,
          markerLat,
          markerType,
          markerIcon,
          markerPopup,
          markerHandle: "delete",
        };
      } else {
        const markerId = data.sn;
        const markerLng = data.posY;
        const markerLat = data.posX;
        const markerType = createMarkerType(data);
        const markerIcon = createMarkerIcon(data);
        const markerPopup = createMarkerPopup(data);
        const onlineTcp = data.onlineTcp;
        const driveState = data.driveState;
        markerDataHandle.value = {
          markerId,
          onlineTcp,
          driveState,
          markerLng,
          markerLat,
          markerType,
          markerIcon,
          markerPopup,
          markerHandle: "delete",
        };
      }
    }
    if (action == "online") {
      if (sinoMapRef.value.isIconChange) {
        const markerIcon = sinoMapRef.value.iconChangeLimit
          ? createMarkerIcon(data)
          : createMarkerIconSmall(data);
        const markerId = data.sn;
        const markerLng = data.posY;
        const onlineTcp = data.onlineTcp;
        const driveState = data.driveState;
        const markerLat = data.posX;
        const markerType = createMarkerType(data);
        const markerPopup = createMarkerPopup(data);
        markerDataHandle.value = {
          markerId,
          markerLng,
          markerLat,
          onlineTcp,
          driveState,
          markerType,
          markerIcon,
          markerPopup,
          markerHandle: "update",
        };
      } else {
        const markerIcon = createMarkerIcon(data);
        const markerId = data.sn;
        const markerLng = data.posY;
        const markerLat = data.posX;
        const onlineTcp = data.onlineTcp;
        const driveState = data.driveState;
        const markerType = createMarkerType(data);
        const markerPopup = createMarkerPopup(data);
        markerDataHandle.value = {
          markerId,
          markerLng,
          markerLat,
          onlineTcp,
          driveState,
          markerType,
          markerIcon,
          markerPopup,
          markerHandle: "update",
        };
      }
    }
  }
  if (socketData.module == "farm" && socketData.type == "monitor") {
    const { data } = socketData;
    dataStatistics.value.device.totalDevice = data.totalDevice;
    dataStatistics.value.device.onlineDevice = data.onlineDevice;
    dataStatistics.value.drive.driving = data.driving;
    dataStatistics.value.drive.standbyDevice = data.standbyDevice;
    const typeCounts = data.typeCounts;
    dataStatistics.value.type.forEach((item: any, index: number) => {
      item.onlineCount = typeCounts[index].onlineCount;
      item.totalCount = typeCounts[index].totalCount;
    });
  }
  if (socketData.module == "farm" && socketData.type == "monitorArea") {
    const { data } = socketData;
    dataStatistics.value.workArea.todayArea = data.todayArea;
    dataStatistics.value.workArea.totalArea = data.totalArea;
    dataStatistics.value.workDuration.todayDuration = data.todayDuration;
    dataStatistics.value.workDuration.beforeDuration = data.beforeDuration;
  }
  if (socketData.module == "farm" && socketData.type == "monitorCarNum") {
    const { data } = socketData;
    dataStatistics.value.drive.driving = data.driving;
    dataStatistics.value.drive.standbyDevice = data.standbyDevice;
    dataStatistics.value.device.onlineDevice = data.driving + data.standbyDevice;
  }
  // if (socketData.module == "farm" && socketData.type == "notification") {
  //   const { data } = socketData;
  //   let list = data.list;
  //   list.forEach((item: any) => {
  //     if (item.judgeLevel) {
  //       // 告警状态
  //       item.state = 2;
  //       item.color = "#e9c75d";
  //     } else if (item.offlineTime !== item.onlineTime) {
  //       // 离线状态
  //       item.state = 0;
  //       item.color = "#919392";
  //     } else {
  //       // 上线状态
  //       item.state = 1;
  //       item.color = "#58c15e";
  //     }
  //   });
  //   carLogList.value.splice(0, list.length, ...list);
  // }
}

// 获取车辆列表日志信息
// async function getCarLogList() {
//   let params = {
//     currentPage: 1,
//     pageSize: 100,
//   };
//   const { data } = await carLog_API(params);
//   carLogList.value = data;
//   carLogList.value.forEach((item: any) => {
//     if (item.judgeLevel) {
//       // 告警状态
//       item.state = 2;
//       item.color = "#e9c75d";
//     } else if (item.offlineTime !== item.onlineTime) {
//       // 离线状态
//       item.state = 0;
//       item.color = "#919392";
//     } else {
//       // 上线状态
//       item.state = 1;
//       item.color = "#58c15e";
//     }
//   });
// }

// 获取统计数据
async function getFaromDataStatistics() {
  const { data } = await farmMachineDataStatistics_API();
  dataStatistics.value = data;
  dataStatistics.value.type.forEach((item: any) => (item.checked = true));
}

// 初始化获取设备数据
async function getOnlineFarmPosition() {
  const { data } = await onlineFarmMachinePosition_API({});
  let onlineFarmMachines = data.onlineFarmMachines;
  let trueList = <any>[];
  onlineFarmMachines.map((item: any) => {
    if (item.posX !== null) trueList.push(item);
  });
  onlineFarmMachines.forEach((item: any) => {
    item.markerId = item.sn;
    item.markerLng = item.posY;
    item.markerLat = item.posX;
    item.markerType = createMarkerType(item);
    if (trueList.length > mapRenderModeLengthMax) {
      if (sinoMapRef.value.iconChangeLimit) {
        item.markerIcon = createMarkerIcon(item);
      } else {
        item.markerIcon = createMarkerIconSmall(item);
      }
    } else {
      item.markerIcon = createMarkerIcon(item);
    }

    item.markerPopup = createMarkerPopup(item);
    item.driveState = item.driveState;
  });
  onlineFarmMachines = onlineFarmMachines.filter(
    (item: any) => item.markerLng || item.markerLng == 0
  );
  markerData.value = onlineFarmMachines;

  route.query.markerId ? (mapCenter.markerId = route.query.markerId) : "";
  mapCenter.center = onlineFarmMachines.map((item: any) => {
    return [item.posY, item.posX];
  });
}

//
function markerTypeChange() {
  let types = [];

  let typ1 = onlineList.value.filter((item: any) => !item.checked);
  typ1 = typ1.map((item: any) => item.typeName);
  let typ2 = dataStatistics.value.type.filter((item: any) => !item.checked);
  typ2 = typ2.map((item: any) => item.typeName);
  types.push(...typ1, ...typ2);
  markerDataHidden.value = types;
}

function createMarkerType(item: any) {
  if (item.terminalType && item.terminalType.includes("AG360")) {
    return "AG360";
  } else if (
    item.terminalType &&
    item.terminalType.includes("AG501") &&
    item.terminalType != "AG501Pro" &&
    item.terminalType != "AG501_CF"
  ) {
    return "AG501";
  } else if (item.terminalType && item.terminalType == "AG501Pro") {
    return "AG501Pro";
  } else if (item.terminalType && item.terminalType == "AG501_CF") {
    return "AG501_CF";
  } else if (item.terminalType && item.terminalType.includes("AG502")) {
    return "AG502";
  } else if (
    item.terminalType &&
    item.terminalType.includes("AG302") &&
    item.terminalType != "AG302Android"
  ) {
    return "AG302";
  } else if (item.terminalType && item.terminalType == "AG302Android") {
    return "AG302Android";
  } else if (item.terminalType && item.terminalType.includes("MC100")) {
    return "MC100";
  } else if (item.terminalType && item.terminalType.includes("SA200")) {
    return "SA200";
  } else if (item.terminalType && item.terminalType.includes("MT801")) {
    return "MT801Pro";
  } else if (item.terminalType && item.terminalType.includes("MT802")) {
    return "MT802";
  } else {
    return "";
  }
}

// marker弹窗
function createMarkerPopup(item: any) {
  const driveState: any = {
    0: t("messages.auto1"),
    1: t("messages.auto2"),
    2: t("messages.auto2"), //自动驾驶
  };
  const onlineStatus: any = {
    0: "status_1",
    1: "status_2",
    2: "status_3",
    null: "status_1",
  };
  const workingStatus: any = {
    优: "status_3",
    中: "status_2",
    差: "status_0",
    null: "status_1",
  };
  const workingStatus2: any = {
    优: t("messages.excellent"),
    中: t("messages.medium"),
    差: t("messages.bad"),
    null: null,
  };
  const snTypeReflect: any = {
    0: t('messages.invalidSolution'),
    1: t('messages.singleSolution'),
    2: t('messages.differenceSolution'),
    3: t('messages.floatingSolution'),
    4: t('messages.fixedSolution'),
    15:t('messages.SatelliteBaseSolution'),
  };
  const diffSource: any = {
    0: t("messages.radioStation"),
    1: t("messages.network"),
    3: t("messages.net"),
  };
  const netSignalImg: any = {
    0: wifi_0,
    1: wifi_1,
    2: wifi_2,
    3: wifi_3,
    4: wifi_4,
  };
  // const netSignal: any = {
  //   0: "弱",
  //   1: "较弱",
  //   2: "一般",
  //   3: "较强",
  //   4: "强",
  // };

  let openRemote: any = true; //是否远程管理

  if (item.onlineTcp === 0 || item.driveState != 0) {
    openRemote = false; // 禁用
  } else {
    // if (
    //   item.terminalType.includes("MT") ||
    //   item.terminalType.includes("AG360") ||
    //   item.terminalType == "AG502" ||
    //   item.terminalType == "AG302" ||
    //   item.terminalType.includes("AG501")
    // ) {
    //   openRemote = true; // 可用
    // } else {
    //   openRemote = false; // 禁用
    // }
    openRemote = true;
  }

  const cardUsage = item.cardUsage == 1 ? t('messages.card1') : item.cardUsage == 2 ? t('messages.card2') : t('messages.doubleCard');
  const popup = `<div class="map_popup">

        <ul class="popup_container">
         <li>
            <div class="le">

              <span > <img class="sate" src= ${
                item.onlineTcp == 0 ? satelite2 : satelite
              }></span>
             <span class="value">${item.satNum || "--"}</span>
            </div>
            <div class="re" >
              <div class="value" style="margin-left: auto;margin-right:20px">
                <img src=${netSignalImg[item.netSignal]}>
                <span>4G</span>
              </div>
            </div>
          </li>
          <li>
            <div class="l">
              <div class="label">${t("messages.carName")}</div>
              <div class="value">${item.carName || "--"}</div>
            </div>
            <div class="r">
              <div class="label">SN</div>
              <div class="value"  style="cursor: pointer;text-decoration: underline;" onclick='goMachineryList_markerPopup(${JSON.stringify(
                item
              )})'>${item.sn || "--"}</div>
            </div>
          </li>
          <li>
            <div class="l">
           <div class="label">${t("work.companyName")}</div>
              <div class="value">${item.companyName || "--"}</div>
            </div>
            <div class="r">
              <div class="label">${t("messages.labelSN")}</div>
              <div class="value">${item.npn || "--"}</div>
            </div>
          </li>

          <li>
            <div class="l">
              <div class="label">${t("messages.workingcondition")}</div>
              <div class="value">
                <span class='${
                  item.judgeLevel ? "status " + workingStatus[item.judgeLevel] : ""
                } '></span>
                <span>${workingStatus2[item.judgeLevel] || "--"}</span>
              </div>
            </div>
            <div class="r">
              <div class="label">${t("work.drivingStatus")}</div>
              <div class="value">
                <span class='${
                  driveState[item.driveState]
                    ? "status " + onlineStatus[item.driveState]
                    : ""
                }'></span>
                <span>${driveState[item.driveState] || "--"}</span>
              </div>
            </div>
          </li>
          <li>
            <div class="l">
              <div class="label">${t("work.solStat")}</div>
              <div class="value">
                <span class='${
                  snTypeReflect[item.solStat]
                    ? item.solStat == 4
                      ? "status status_3"
                      : "status status_0"
                    : ""
                }'></span>
                <span>${snTypeReflect[item.solStat] || "--"}</span>
              </div>
            </div>
            <div class="r">
              <div class="label">${t("work.differentialChains")}</div>
              <div class="value">${diffSource[item.diffSource] || "--"} (${
    item.diffAge !== null ? item.diffAge + "s" : "--"
  })</div>
            </div>
          </li>
          <li>
            <div class="l">
          <div class="label">${t("work.baseDis")}</div>
              <div class="value">${
                item.baseDist ? (item.baseDist / 1000).toFixed(3) + "km" : "--"
              }</div>
            </div>
            <div class="r">
               <div class="label">${t("work.terminalType")}</div>
              <div class="value">${item.terminalType || "--"}</div>
            </div>
          </li>

          <li>
            <div class="l">
              <div class="label">${t("work.lon")}</div>
              <div class="value">${dmsTrans(item.posY) || "--"}</div>
            </div>
            <div class="r">
              <div class="label">${t("work.lat")}</div>
              <div class="value">${dmsTrans(item.posX) || "--"}</div>

            </div>
          </li>
          <li>
            <div class="l">
               <div class="label">${t("work.CarStatus")}</div>
              <div class="value">${cardUsage}</div>
            </div>
            <div class="r">
              <div class="label"></div>
              <div class="value"></div>
            </div>
          </li>
        </ul>
        <ul class="btns_container">
          <li>
          
            <div class="btn ${
              !openRemote ? "disabled" : ""
            }" onclick='openRemote_markerPopup(${JSON.stringify(item)})'>${t(
    "work.remoteManagement"
  )}</div>
            <div class="btn" onclick='goTaskMachine_markerPopup(${JSON.stringify(
              item
            )})'>${t("devicelist.historyTrack")}</div>
          </li>
          <li>
            <div class="btn ${
              item.driveState == 0 || item.onlineTcp == 0 ? "disabled" : ""
            }" onclick='openRealTimeChart_markerPopup(${JSON.stringify(item)})'>${t(
    "messages.Realtimedrivingtrendchart"
  )}</div>
            <div class="btn" onclick='gohistoryChart_markerPopup(${JSON.stringify(
              item
            )})'>${t("menus.historicaldrivingtrendchart")}</div>
          </li>
        </ul>
      </div>`;

  return popup;
}
// marker 图标
function createMarkerIcon(item: any) {
  const { terminalType, driveState, onlineTcp } = item;
  let icon: string = "";
  if (onlineTcp === 0) {
    icon = AG360_offline;
  } else {
    icon = driveState == 0 ? AG360_warn : AG360;
  }
  // if (terminalType && terminalType.includes("AG360")) {
  //   icon = driveState == 0 ? AG360_warn : AG360;
  // } else if (
  //   terminalType &&
  //   terminalType.includes("AG501") &&
  //   terminalType != "AG501Pro"
  // ) {
  //   icon = driveState == 0 ? AG501_warn : AG501;
  // } else if (terminalType && terminalType == "AG501Pro") {
  //   icon = driveState == 0 ? AG501Pro_warn : AG501Pro;
  // } else if (terminalType && terminalType.includes("AG502")) {
  //   icon = driveState == 0 ? AG502_warn : AG502;
  // } else if (
  //   terminalType &&
  //   terminalType.includes("AG302") &&
  //   terminalType != "AG302Android"
  // ) {
  //   icon = driveState == 0 ? AG302_warn : AG302;
  // } else if (terminalType && terminalType == "AG302Android") {
  //   icon = driveState == 0 ? AG302Android_warn : AG302Android;
  // } else if (item.markerType && item.markerType.includes("MC100")) {
  //   icon = driveState == 0 ? MC100_warn : MC100;
  // } else if (item.markerType && item.markerType.includes("MT801")) {
  //   icon = driveState == 0 ? MT801_warn : MT801;
  // } else if (item.markerType && item.markerType.includes("MT802")) {
  //   icon = driveState == 0 ? MT802_warn : MT802;
  // } else if (item.markerType && item.markerType.includes("SA200")) {
  //   icon = driveState == 0 ? SA200_warn : SA200;
  // } else {
  //   icon = driveState == 0 ? AGunknown_warn : AGunknown;
  // }
  return icon;
}
function createMarkerIconSmall(item: any) {
    const { terminalType, driveState, onlineTcp } = item;
  let icon: string = "";
  if (onlineTcp === 0) {
    icon = gray;
  } else {
    icon = driveState == 0 ? yellow : green;
  }

  return icon;
}
// 处理经纬度
function dmsTrans(decimal: any) {
  try {
    if (!decimal) {
      return 0;
    }
    let int = parseInt(decimal);
    let float = decimal - int;
    let decimal2: any = float * 60;
    let int2 = parseInt(decimal2);
    if(int2 <0) {
      int2 = -int2
    }
   
    let float2 = decimal2 - int2;
    let decimal3 = float2 * 60;
    if(decimal3<0) {
      decimal3 = -decimal3
    }
    return `${int}°${int2}'${decimal3.toFixed(3)}''`;
  } catch (err) {
    console.log(err);
    return decimal;
  }
}

// marker弹窗-前往农机列表
function goMachineryList_markerPopup(arg: any) {
  router.push({ path: "/machineryList", query: { sn: arg.sn } });
}
// marker弹窗-前往历史轨迹
function goTaskMachine_markerPopup(arg: any) {
  router.push({
    path: "/monitoring/taskMachine",
    query: { sn: arg.sn, carId: arg.carId },
  });
}
// marker-弹窗-前往历史趋势图
function gohistoryChart_markerPopup(arg: any) {
  router.push({ path: "/monitoring/historyChart", query: { sn: arg.sn } });
}
// marker-弹窗-实时趋势图
function openRealTimeChart_markerPopup(arg: any) {
  if (arg.driveState == 0 || arg.onlineTcp == 0) return;
  sn.value = arg.sn;
  realTime.value.dialogVisible = true;
}
// marker-弹窗-远程管理
function openRemote_markerPopup(arg: any) {
  if (arg.driveState != 0) return;
  isChange.value = !isChange.value;
  terminalType.value = arg.terminalType;
  version.value = arg.version;
  type.value = arg.type;
  carId.value = arg.carId;
  sn.value = arg.sn;
  name.value = arg.carName;
}
</script>

<style lang="scss" scoped>
.el-timeline {
  --el-timeline-node-color: #63d7a8;
}

:deep(.el-autocomplete) {
  transition-property: opacity, background-color !important;
  /* 仅过渡opacity和background-color属性 */
  /* 其他样式 */
}

:deep(.autocomplete_item) {
  background-color: pink !important;
}

.map_container {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  position: relative;

  .search_box {
    left: 10px;
    top: 10px;
    position: absolute;
    z-index: 999;

    :deep(.el-autocomplete) {
      width: 330px;
      .el-input__wrapper {
        color: #fff !important;
        background: url("@/assets/monitoring/inputBack.png") no-repeat center center;
        background-size: 105% 100%;
        .is-focus {
          box-shadow: none;
        }
      }
      .el-input__inner {
        color: #fff !important;
        background-color: transparent;
        &::placeholder {
          color: #fff !important;
        }
      }
    }
  }

  .statistics_box {
    padding: 10px;
    right: 10px;
    transition: all 0.3s;

    top: 10px;
    position: absolute;
    z-index: 999;
    width: 360px;
    background: url("@/assets/monitoring/bg_1.png") no-repeat center center;
    background-size: cover;

    .header {
      cursor: pointer;
      display: flex;
      justify-content: end;
      align-items: center;
      height: 30px;
      padding: 0 12px;

      h3 {
        color: #fff;
        margin: 0;
        font-size: 16px;
      }
    }
    .top {
      display: flex;
      flex-wrap: wrap;
      padding-left: 10px;
      .top_line {
        width: 50%;
        .outside {
          display: flex;
          align-items: center;
        }
        .offline_area {
          margin-left: 5px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #d6d6d6;
        }
      }
      li {
        width: 50%;

        div:first-child {
          color: #fff;
          font-size: 24px;
          font-family: D-DIN-DIN, D-DIN-DIN;
          font-weight: bold;
        }

        div:last-child {
          color: #00baad;
          font-size: 14px;
          font-weight: 700;
        }
      }

      .bottom_li {
        width: 33%;
        margin-bottom: -5px;
        .offline_area {
          margin-left: 5px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #d6d6d6;
        }
        span {
          font-family: D-DIN-DIN, D-DIN-DIN;
          font-weight: bold;
          font-size: 20px;
          color: #ffffff;
        }
        div {
          display: flex;
          align-items: center;

          span {
            color: #00baad;
            font-size: 14px;
            font-weight: 700;
            margin-right: 6px;
          }

          div {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #43cf7c;
          }
        }
      }

      .bottom_li2 {
        div {
          div {
            background-color: #f7c23c;
          }
        }
      }
    }

    .center,
    .bottom {
      display: flex;
      flex-wrap: wrap;

      li {
        width: 50%;
        color: #fff;
        display: flex;
        align-items: center;
        height: 35px;

        label {
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .label {
          font-size: 12px;
          margin-right: 8px;
          margin-left: 3px;
        }

        .value {
          font-size: 14px;
          font-weight: 700;
        }
      }
    }
  }

  .notice_box {
    position: absolute;
    z-index: 999;
    right: 10px;
    bottom: 10px;
    width: 320px;
    height: 397px;
    transition: all 0.3s;
    background: url("@/assets/monitoring/bg_2.png") no-repeat center center;
    background-size: cover;

    .header {
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      padding: 0 12px;

      h3 {
        color: #fff;
        margin: 0;
        font-size: 16px;
      }
    }

    .content {
      // background-color: red;
      overflow: scroll;
      height: calc(100% - 40px);
      padding: 12px 12px 0px 12px;

      :deep(.el-timeline-item) {
        .item {
          display: flex;

          .l {
            .state {
              font-size: 14px;
              margin-right: 10px;
            }

            .state_0 {
              color: #232c1e;
            }

            .state_1 {
              color: #58c15e;
            }

            .state_2 {
              color: #e9c65d;
            }
          }

          .r {
            flex: 1;

            .title {
              color: #fff;
              font-size: 14px;
              display: flex;
              justify-content: space-between;

              span:last-child {
                text-decoration: underline;
                font-size: 12px;
                cursor: pointer;
              }
            }

            p {
              margin: 0;
              font-size: 12px;
              color: #919392;
            }
          }
        }
      }
    }
  }

  .notice_box_active {
    height: 40px;
    overflow: hidden;
  }
  .statistics_box_active {
    height: 40px;
    overflow: hidden;
  }
}

:deep(.map_popup) {
  width: 300px;

  .popup_container {
    font-size: 14px;
    .sate {
      width: 22px;
      height: 18px;
      margin-right: 2px;
    }

    li {
      display: flex;
      line-height: 20px;

      margin-bottom: 8px;
      .le {
        width: 50%;
        display: flex;
      }

      .re {
        width: 50%;
        display: flex;
      }
      .l {
        width: 50%;
      }

      .r {
        width: 50%;
      }

      .label {
        color: #bebebe;

        flex-shrink: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .value {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 16px;
        img {
          width: 12px;
          height: 12px;
          margin-right: 2px;
        }
      }

      .status {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 2px;
      }

      .status_0 {
        background-color: #ea3729;
      }

      .status_1 {
        background-color: #666666;
      }

      .status_3 {
        background-color: #5dbe3c;
      }

      .status_2 {
        background-color: #76fafd;
      }
    }
  }

  .btns_container {
    padding-top: 2px;

    li {
      display: flex;
      justify-content: space-around;


      .btn {
        display: flex;
        justify-content: center;
        overflow: hidden;
        color: var(--el-color-primary);
        font-size: 14px;
        cursor: pointer;
        width: 120px;
        &:hover {
          opacity: 0.8;
        }
      }

      .disabled {
        cursor: not-allowed !important;
        color: #8f8f8f !important;
      }
    }
  }
}

.bt_1 {
  border-bottom: 1px solid var(--el-color-info-light-7);
}

:deep(.el-select .el-input.is-focus .el-input__wrapper) {
  box-shadow: none !important;
}
:deep(.el-checkbox) {
  margin-right: 8px;

  .el-checkbox__inner {
    background-color: transparent;
    border: 1px solid #00fff7;
  }
}
.num_test {
  width: 100%;
  margin-bottom: -6px;
  display: flex;
  justify-content: center;
  padding-right: 18px;
}
  :deep(.el-select__wrapper) {
    background: transparent;

    box-shadow: none !important;
    color: #fff;
  }
  :deep(.el-select__wrapper .el-tooltip__trigger .el-tooltip__trigger) {
    box-shadow: none !important;
  }
  :deep(.el-select__placeholder) {
    color: #fff;
  }

</style>
