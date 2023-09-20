<template>
  <div class="map_container">
    <sino-map :markerData="markerData" />
    <div class="search_box">
      <!-- <el-select
        v-model="searchForm.sn"
        multiple
        filterable
        remote
        reserve-keyword
        placeholder="Please enter a keyword"
        :remote-method="remoteMethod"
      > -->
      <!-- <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        /> -->
      <!-- </el-select> -->
    </div>
    <div class="statistics_box">
      <ul class="top">
        <li>
          <span>{{ dataStatistics.device?.totalDevice }}</span>
          <span>总数</span>
        </li>
        <li>
          <span>{{ dataStatistics.workArea?.todayArea }}</span>
          <span>今日作业(亩)</span>
        </li>
        <li>
          <span>{{ dataStatistics.device?.onlineDevice }}</span>
          <span>在线数</span>
        </li>
        <li>
          <span>{{ dataStatistics.workArea?.totalArea }}</span>
          <span>累计作业(万亩)</span>
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
            <SvgIcon icon="AG302" size="22" />
            <span class="label">{{ item.typeName }}</span>
          </label>
          <span class="value">{{ item.onlineCount }}</span>
        </li>
        <br />
      </ul>
      <ul class="bottom">
        <li>
          <SvgIcon icon="AG302" size="22" />
          <span class="label">工作中</span>
          <span class="value">{{ dataStatistics.drive?.driving }}</span>
        </li>
        <li>
          <SvgIcon icon="AG302_warn" size="22" />
          <span class="label">待机</span>
          <span class="value">{{ dataStatistics.drive?.standbyDevice }}</span>
        </li>
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
                  <span>{{ item.deviceSn }}</span>
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
    <realTimeChart ref="realTime" :sn="sn" />
    <RemoteControl
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
// let searchForm = reactive({ sn: "" });

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
    if (markerData.length <= 0) return;
    handleSocketData(socketData);
  },
  { deep: true }
);

getFaromDataStatistics();
getOnlineFarmPosition();
getCarLogList();

socketStore.connect();

// const options = ref([]);

// function querySearch(queryString: string, cb: any) {
//   cb([{ value: 1, link: 2 }]);
//   return;
// }
// function handleSelect(item: any) {
//   console.log(item, "---193");
// }
// function remoteMethod(query: string) {
//   console.log(query, "--194");
// }

// 处理socketData数据
function handleSocketData(socketData: any) {
  if (socketData.module == "farm" && socketData.type == "farmPt") {
    let { action, data } = socketData;
    if (action == "upline") {
      data.markerId = data.sn;
      data.markerVisible = true;
      data.markerLng = data.posX;
      data.markerLat = data.posY;
      data.markerIcon = createMarkerIcon(data);
      // data.markerPopup = createMarkerPopup(data);
      markerData[0].push(data);
    }
    if (action == "offline") {
      const idx = markerData[0].find((item: any) => item.markerId == data.sn);
      markerData[0].splice(idx, 1);
    }
    if (action == "online") {
      data.markerId = data.sn;
      data.markerLng = data.posX;
      data.markerLat = data.posY;
      data.markerIcon = createMarkerIcon(data);
      // data.markerPopup = createMarkerPopup(JSON.parse(JSON.stringify(data)));
      const find = markerData[0].find(
        (item: any) => item.markerId == data.markerId
      );
      find.markerLng = data.markerLng;
      find.markerLat = data.markerLat;
      find.markerIcon = data.markerIcon;
      // find.markerPopup =  data.markerPopup
    }
  }
  if (socketData.module == "farm" && socketData.type == "monitor") {
    const { data } = socketData;
    dataStatistics.value.device.totalDevice = data.totalDevice;
    dataStatistics.value.device.onlineDevice = data.onlineDevice;
  }
  if (socketData.module == "farm" && socketData.type == "monitorArea") {
    const { data } = socketData;
    dataStatistics.value.workArea.todayArea = data.todayArea;
    dataStatistics.value.workArea.totalArea = data.totalArea;
  }
  if (socketData.module == "farm" && socketData.type == "monitorCarNum") {
    const { data } = socketData;
    dataStatistics.value.drive.driving = data.driving;
    dataStatistics.value.workArea.standbyDevice = data.standbyDevice;
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
  const onlineFarmMachines = data.onlineFarmMachines;
  onlineFarmMachines.forEach((item: any) => {
    item.markerId = item.sn;
    item.markerLng = item.posX;
    item.markerLat = item.posY;
    item.markerIcon = createMarkerIcon(item);
    item.markerPopup = createMarkerPopup(item);
    item.markerVisible = true;
  });
  markerData.push(onlineFarmMachines);
}

//
function markerTypeChange() {
  let types = dataStatistics.value.type.filter((item: any) => item.checked);
  types = types.map((item: any) => item.typeName);
  markerData[0].forEach((item: any) => (item.markerVisible = false));
  types.forEach((item: any) => {
    let findList = markerData[0].filter((v: any) => {
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
    0: "未开始",
    1: "入线",
    2: "在线", //自动驾驶
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
            <div class="btn" onclick='openRemote_markerPopup(${JSON.stringify(
              item
            )})'>远程管理</div>
            <div class="btn" onclick='goTaskMachine_markerPopup(${JSON.stringify(
              item
            )})'>历史轨迹</div>
          </li>
          <li>
            <div class="btn" onclick='openRealTimeChart_markerPopup(${JSON.stringify(
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
  //
  // console.log(arg)
  sn.value = arg.sn;
  realTime.value.dialogVisible = true;
}
// marker-弹窗-远程管理
function openRemote_markerPopup(arg: any) {
  console.log(arg.terminalType);

  terminalType.value = arg.terminalType;
  version.value = arg.version;
  type.value = arg.type;
  carId.value = arg.carId;
  sn.value = arg.sn;
  name.value = arg.carName;
}
</script>

<style lang="scss" scoped>
.map_container {
  height: 100%;
  position: relative;
  .search_box {
    left: 10px;
    top: 10px;
    position: absolute;
    z-index: 999;
    //     :deep(.el-autocomplete) {
    //       width: 500px;
    // }
    .el-select {
      position: relative;
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
              color: #919392;
            }
            .state_1 {
              color: #58c15e;
            }
            .state_2 {
              color: #e9c75d;
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
  }
}
:deep(.map_popup) {
  width: 360px;
  .popup_container {
    font-size: 14px;
    li {
      display: flex;
      line-height: 22px;

      &:nth-child(2) {
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
    }
  }
}
</style>
