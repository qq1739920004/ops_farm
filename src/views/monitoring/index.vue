<template>
  <div class="map_container">
    <sino-map :markerData="markerData" :mapCenter="mapCenter" />
    <div class="search_box">
      <el-autocomplete
        v-model="searchSn"
        :fetch-suggestions="querySearch"
        placeholder="SN、铭牌SN、车辆名、公司、电话"
        @select="handleSelect"
        clearable
      >
        <template #suffix>
          <el-icon><Search /></el-icon>
        </template>
        <template #default="{ item }">
          <div v-if="item.markerId">
            <span>{{ item.carName }}</span>
            |
            <span>{{ item.sn }}</span>
            |
            <span>{{ item.npn }}</span>
          </div>
          <div v-if="item.markerId">
            <span>{{ item.companyName }}</span>
            |
            <span>{{ item.tel }}</span>
          </div>
          <div v-if="!item.markerId">{{ item }}</div>
        </template>
      </el-autocomplete>
    </div>
    <div class="statistics_box">
      <ul class="top">
        <li>
          <span>{{ dataStatistics.device?.totalDevice }}</span>
          <span>总数</span>
        </li>
        <li>
          <span>{{ dataStatistics.workArea?.todayArea.toFixed(2) }}</span>
          <span>今日作业(亩)</span>
        </li>
        <li>
          <span>{{ dataStatistics.device?.onlineDevice }}</span>
          <span>在线数</span>
        </li>
        <li>
          <span>{{ dataStatistics.workArea?.totalArea.toFixed(2) }}</span>
          <span>累计作业(万亩)</span>
        </li>
        <li class="bottom_li">
          <span>{{ dataStatistics.drive?.driving }}</span>
          <div>
            <span>工作中</span>
            <div></div>
          </div>
        </li>
        <li class="bottom_li">
          <span>{{ dataStatistics.drive?.standbyDevice }}</span>
          <div>
            <span>待机</span>
            <div></div>
          </div>
        </li>
      </ul>
      <ul class="center">
        <li v-for="(item, index) in dataStatistics.type" :key="index">
          <label>
            <el-checkbox
              size="large"
              v-model="item.checked"
              @change="markerTypeChange"
            />
            <SvgIcon :icon="item.typeName" size="22" />
            <span class="label">{{ item.typeName }}</span>
          </label>
          <span class="value">{{ item.onlineCount }}</span>
        </li>
        <br />
      </ul>
    </div>
    <div
      :class="{
        notice_box: true,
        notice_box_active: notice_box_isActive,
      }"
    >
      <div class="header" @click="notice_box_isActive = !notice_box_isActive">
        <h3>状态通知</h3>
        <el-icon v-if="!notice_box_isActive" color="#fff"
          ><ArrowDownBold
        /></el-icon>
        <el-icon v-else color="#fff"><ArrowUpBold /></el-icon>
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
                  item.state == 0 ? "离线" : item.state == 1 ? "上线" : "告警"
                }}</span>
              </div>
              <div class="r">
                <p v-if="item.state == 2" class="state_2">驾驶效果差</p>
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
    </div>

    <!-- 实时趋势驾驶图diaLog -->
    <realTimeChart
      ref="realTime"
      :sn="sn"
      :socketData="socketStore.socketData"
    />
    <RemoteControl
      :isChange="isChange"
      :terminalType="terminalType"
      :version="version"
      :type="type"
      :carId="carId"
      :sn="sn"
      :name="name"
    />
  </div>
</template>

<script setup lang="ts">
import AG302 from "@/assets/icons/AG302.svg";
import AG302_warn from "@/assets/icons/AG302_warn.svg";
import AG360 from "@/assets/icons/AG360.svg";
import AG360_warn from "@/assets/icons/AG360_warn.svg";
import AG501 from "@/assets/icons/AG501.svg";
import AG501_warn from "@/assets/icons/AG501_warn.svg";
import AG501Pro from "@/assets/icons/AG501Pro.svg";
import AG501Pro_warn from "@/assets/icons/AG501Pro_warn.svg";
import AG502 from "@/assets/icons/AG502.svg";
import AG502_warn from "@/assets/icons/AG502_warn.svg";
import AG302Android from "@/assets/icons/AG302Android.svg";
import AG302Android_warn from "@/assets/icons/AG302Android_warn.svg";
import AGunknown from "@/assets/icons/AGunknown.svg";
import AGunknown_warn from "@/assets/icons/AGunknown_warn.svg";
import wifi_0 from "@/assets/monitoring/wifi_0.png";
import wifi_1 from "@/assets/monitoring/wifi_1.png";
import wifi_2 from "@/assets/monitoring/wifi_2.png";
import wifi_3 from "@/assets/monitoring/wifi_3.png";
import wifi_4 from "@/assets/monitoring/wifi_4.png";
import SinoMap from "@/components/SinoMap/index.vue";
import SvgIcon from "@/components/SvgIcon/index.vue";
import realTimeChart from "./components/realTimeChart.vue";
import RemoteControl from "@/components/remoteAdjust/index.vue";
import { reactive, ref, watch } from "vue";
import useSocketStore from "@/store/socket";
import { useRouter } from "vue-router";
import {
  onlineFarmMachinePosition_API,
  farmMachineDataStatistics_API,
  carLog_API,
} from "@/api/monitoring";
const router = useRouter();
const socketStore = useSocketStore();
let markerData = reactive<any>([]);
let dataStatistics = ref<any>({});
let carLogList: any = ref([]);

let sn = ref();
let realTime = ref();
let terminalType = ref();
let version = ref();
let carId = ref();
let name = ref();
let type = ref();
let notice_box_isActive = ref(false);
let isChange = ref(false);
// let searchForm = reactive({ sn: "" });

const searchSn = ref(""); // sn 车辆名 公司 手机号
const mapCenter = reactive<any>({
  markerId: "",
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
    // if (markerData.length <= 0) return;
    handleSocketData(socketData);
  },
  { deep: true }
);

getFaromDataStatistics();
getOnlineFarmPosition();
getCarLogList();

socketStore.connect();
//查询设备地图定位
function searchDevicePosition(id: any) {
  mapCenter.markerId = id;
}

// sn、车辆名、公司名、电话 搜索
function querySearch(queryString: string, cb: any) {
  // if (!queryString) return;
  let filterData = markerData.filter((item: any) => {
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
  cb(filterData);
  return;
}
// 搜索框确认选择
function handleSelect(item: any) {
  if (!item.markerId) return;
  mapCenter.markerId = item.markerId;
}

// 处理socketData数据
function handleSocketData(socketData: any) {
  if (socketData.module == "farm" && socketData.type == "farmPt") {
    let { action, data } = socketData;
    if (action == "upline") {
      const markerId = data.sn;
      const markerVisible = true;
      const markerLng = data.posX;
      const markerLat = data.posY;
      const markerIcon = createMarkerIcon(data);
      const markerPopup = createMarkerPopup(data);
      markerData.push({
        markerId,
        markerVisible,
        markerLng,
        markerLat,
        markerIcon,
        markerPopup,
      });
    }
    if (action == "offline") {
      const markerId = data.sn;
      const idx = markerData.findIndex(
        (item: any) => item.markerId == markerId
      );
      markerData.splice(idx, 1);
    }
    if (action == "online") {
      const markerId = data.sn;
      const markerLng = data.posX;
      const markerLat = data.posY;
      const markerIcon = createMarkerIcon(data);
      const markerPopup = createMarkerPopup(data);
      const find = markerData.find((item: any) => item.markerId == markerId);
      if (!find) return;
      find.markerLng = markerLng;
      find.markerLat = markerLat;
      find.markerIcon = markerIcon;
      find.markerPopup = markerPopup;
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
    });
  }
  if (socketData.module == "farm" && socketData.type == "monitorArea") {
    const { data } = socketData;
    dataStatistics.value.workArea.todayArea = data.todayArea;
    dataStatistics.value.workArea.totalArea = data.totalArea;
  }
  if (socketData.module == "farm" && socketData.type == "monitorCarNum") {
    const { data } = socketData;
    dataStatistics.value.drive.driving = data.driving;
    dataStatistics.value.drive.standbyDevice = data.standbyDevice;
  }
  if (socketData.module == "farm" && socketData.type == "notification") {
    const { data } = socketData;
    let list = data.list;
    list.forEach((item: any) => {
      if (item.judgeLevel) {
        // 告警状态
        item.state = 2;
        item.color = "#e9c75d";
      } else if (item.offlineTime !== item.onlineTime) {
        // 离线状态
        item.state = 0;
        item.color = "#919392";
      } else {
        // 上线状态
        item.state = 1;
        item.color = "#58c15e";
      }
    });
    carLogList.value.unshift(...list);
  }
}

// 获取车辆列表日志信息
async function getCarLogList() {
  let params = {
    currentPage: 1,
    pageSize: 100,
  };
  const { data } = await carLog_API(params);
  carLogList.value = data;
  carLogList.value.forEach((item: any) => {
    if (item.judgeLevel) {
      // 告警状态
      item.state = 2;
      item.color = "#e9c75d";
    } else if (item.offlineTime !== item.onlineTime) {
      // 离线状态
      item.state = 0;
      item.color = "#919392";
    } else {
      // 上线状态
      item.state = 1;
      item.color = "#58c15e";
    }
  });
}

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
  onlineFarmMachines.forEach((item: any) => {
    item.markerId = item.sn;
    item.markerLng = item.posX;
    item.markerLat = item.posY;
    item.markerIcon = createMarkerIcon(item);
    item.markerPopup = createMarkerPopup(item);
    item.markerVisible = true;
  });
  onlineFarmMachines = onlineFarmMachines.filter(
    (item: any) => item.markerLng || item.markerLng == 0
  );
  markerData.push(...onlineFarmMachines);
}

//
function markerTypeChange() {
  let types = dataStatistics.value.type.filter((item: any) => item.checked);
  types = types.map((item: any) => item.typeName);
  markerData.forEach((item: any) => (item.markerVisible = false));
  types.forEach((item: any) => {
    let findList = markerData.filter((v: any) => {
      if (
        (v.terminalType == "AG302Android" || v.terminalType == "AG501Pro") &&
        v.terminalType == item
      ) {
        return true;
      }
      if (
        v.terminalType != "AG302Android" &&
        v.terminalType != "AG501Pro" &&
        v.terminalType.includes(item)
      ) {
        return true;
      }
    });
    findList.forEach((item: any) => {
      item.markerVisible = true;
    });
  });
}

// marker弹窗
function createMarkerPopup(item: any) {
  const driveState: any = {
    0: "非自动驾驶",
    1: "自动驾驶",
    2: "自动驾驶", //自动驾驶
  };
  const onlineStatus: any = {
    0: "status_1",
    1: "status_2",
    2: "status_3",
  };
  const workingStatus: any = {
    优: "status_3",
    中: "status_2",
    差: "status_0",
    null: "status_1",
  };
  const snTypeReflect: any = {
    0: "无效解",
    1: "单点解",
    2: "差分解",
    3: "浮动解",
    4: "固定解",
  };
  const diffSource: any = {
    0: "电台",
    1: "网络",
    3: "罗网",
  };
  const netSignalImg: any = {
    0: wifi_0,
    1: wifi_1,
    2: wifi_2,
    3: wifi_3,
    4: wifi_4,
  };
  const netSignal: any = {
    0: "弱",
    1: "较弱",
    2: "一般",
    3: "较强",
    4: "强",
  };

  let openRemote: any = true; //是否远程管理

  if (item.onlineTcp == 0 || item.driveState != 0) {
    openRemote = false; // 禁用
  } else {
    if (
      item.terminalType == "AG320" ||
      item.terminalType.includes("AG360") ||
      item.terminalType == "AG502"
    ) {
      openRemote = true; // 可用
    } else {
      openRemote = false; // 禁用
    }
  }

  const cardUsage =
    item.cardUsage == 1 ? "卡1" : item.cardUsage == 2 ? "卡2" : "双卡";
  const popup = `<div class="map_popup">
        <ul class="popup_container">
          <li>
            <div class="l">
              <div class="label">车辆名称:</div>
              <div class="value">${item.carName}</div>
            </div>
            <div class="r">
              <div class="label">SN:</div>
              <div class="value"  style="cursor: pointer;text-decoration: underline;" onclick='goMachineryList_markerPopup(${JSON.stringify(
                item
              )})'>${item.sn}</div>
            </div>
          </li>
          <li>
            <div class="l">
              <div class="label">车主姓名:</div>
              <div class="value">${item.carOwnerName}</div>
            </div>
            <div class="r">
              <div class="label">铭牌号:</div>
              <div class="value">${item.npn || "/"}</div>
            </div>
          </li>
          <li>
            <div class="l">
              <div class="label">公司名称:</div>
              <div class="value">${item.companyName}</div>
            </div>
          </li>
          <li>
            <div class="l">
              <div class="label">工作状态:</div>
              <div class="value">
                <span class='status ${workingStatus[item.judgeLevel]}'></span>
                <span>${item.judgeLevel || "无"}</span>
              </div>
            </div>
            <div class="r">
              <div class="label">驾驶状态:</div>
              <div class="value">
                <span class='status ${onlineStatus[item.driveState]}'></span>
                <span>${driveState[item.driveState]}</span>
              </div>
            </div>
          </li>
          <li>
            <div class="l">
              <div class="label">解状态:</div>
              <div class="value">
                <span class='status ${
                  item.solStat == 4 ? "status_3" : "status_0"
                }'></span>
                <span>${snTypeReflect[item.solStat] || "未知解"}</span>
              </div>
            </div>
            <div class="r">
              <div class="label">差分链:</div>
              <div class="value">${diffSource[item.diffSource] || "/"} (${
    item.diffAge
  }s)</div>
            </div>
          </li>
          <li>
            <div class="l">
              <div class="label">卫星数量:</div>
              <div class="value">${item.satNum}</div>
            </div>
            <div class="r">
              <div class="label">基站距离:</div>
              <div class="value">${(item.baseDist / 1000).toFixed(3)} Km</div>
            </div>
          </li>
          <li>
            <div class="l">
              <div class="label">4G信号:</div>
              <div class="value">
                <img src=${netSignalImg[item.netSignal]}>
                <span>${netSignal[item.netSignal] || "/"}</span>
              </div>
            </div>
            <div class="r">
              <div class="label">终端类型:</div>
              <div class="value">${item.terminalType}</div>
            </div>
          </li>
          <li>
            <div class="l">
              <div class="label">经度:</div>
              <div class="value">${dmsTrans(item.posX)}</div>
            </div>
            <div class="r">
              <div class="label">卡状态:</div>
              <div class="value">${cardUsage}</div>
            </div>
          </li>
          <li>
            <div class="l">
              <div class="label">纬度:</div>
              <div class="value">${dmsTrans(item.posY)}</div>
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
            }" onclick='openRemote_markerPopup(${JSON.stringify(
    item
  )})'>远程管理</div>
            <div class="btn" onclick='goTaskMachine_markerPopup(${JSON.stringify(
              item
            )})'>历史轨迹</div>
          </li>
          <li>
            <div class="btn ${
              item.driveState == 0 ? "disabled" : ""
            }" onclick='openRealTimeChart_markerPopup(${JSON.stringify(
    item
  )})'>实时驾驶趋势图</div>
            <div class="btn" onclick='gohistoryChart_markerPopup(${JSON.stringify(
              item
            )})'>历史驾驶趋势图</div>
          </li>
        </ul>
      </div>`;

  return popup;
}
// marker 图标
function createMarkerIcon(item: any) {
  const { terminalType, driveState } = item;
  let icon: string = "";
  if (terminalType.includes("AG360")) {
    icon = driveState == 0 ? AG360_warn : AG360;
  } else if (terminalType.includes("AG501") && terminalType != "AG501Pro") {
    icon = driveState == 0 ? AG501_warn : AG501;
  } else if (terminalType == "AG501Pro") {
    icon = driveState == 0 ? AG501Pro_warn : AG501Pro;
  } else if (terminalType.includes("AG502")) {
    icon = driveState == 0 ? AG502_warn : AG502;
  } else if (terminalType.includes("AG302") && terminalType != "AG302Android") {
    icon = driveState == 0 ? AG302_warn : AG302;
  } else if (terminalType == "AG302Android") {
    icon = driveState == 0 ? AG302Android_warn : AG302Android;
  } else {
    icon = driveState == 0 ? AGunknown_warn : AGunknown;
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
    let float2 = decimal2 - int2;
    let decimal3 = float2 * 60;
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
  router.push({ path: "/monitoring/taskMachine", query: { sn: arg.sn } });
}
// marker-弹窗-前往历史趋势图
function gohistoryChart_markerPopup(arg: any) {
  router.push({ path: "/monitoring/historyChart", query: { sn: arg.sn } });
}
// marker-弹窗-实时趋势图
function openRealTimeChart_markerPopup(arg: any) {
  if (arg.driveState == 0) return;
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
  transition-property: opacity, background-color !important; /* 仅过渡opacity和background-color属性 */
  /* 其他样式 */
}
.map_container {
  height: 100%;
  position: relative;
  .search_box {
    left: 10px;
    top: 10px;
    position: absolute;
    z-index: 999;
    :deep(.el-autocomplete) {
      width: 280px;
    }
  }
  .statistics_box {
    padding: 10px;
    right: 10px;
    top: 10px;
    position: absolute;
    z-index: 999;
    width: 304px;
    background: url("@/assets/monitoring/bg_1.png") no-repeat center center;
    background-size: cover;

    .top {
      display: flex;
      flex-wrap: wrap;
      border-bottom: 2px solid rgba(0, 218, 216, 0.3);
      padding-bottom: 10px;

      li {
        width: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        span:first-child {
          color: #fff;
          font-size: 24px;
        }

        span:last-child {
          color: #00baad;
          font-size: 14px;
          font-weight: 700;
        }
      }
      .bottom_li {
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
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background-color: #43cf7c;
          }
        }
      }
      .bottom_li:last-child {
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
        :deep(.el-checkbox) {
          margin-right: 8px;

          .el-checkbox__inner {
            background-color: transparent;
            border: 1px solid #00fff7;
          }
        }

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
    width: 304px;
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
}
:deep(.map_popup) {
  width: 360px;
  .popup_container {
    font-size: 14px;
    li {
      display: flex;
      line-height: 22px;

      &:nth-child(3) {
        margin-bottom: 12px;
      }

      .l {
        display: flex;
        width: 50%;
      }

      .r {
        display: flex;
        width: 50%;
      }

      .label {
        width: 66px;
        flex-shrink: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .value {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        img {
          width: 12px;
          height: 12px;
          margin-right: 2px;
        }
      }

      .status {
        display: inline-block;
        width: 8px;
        height: 8px;
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
    padding-top: 12px;

    li {
      display: flex;
      justify-content: space-around;
      line-height: 22px;

      .btn {
        color: var(--el-color-primary);
        font-size: 14px;
        cursor: pointer;

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
</style>
