<template>
  <div class="map_conatiner">
    <div id="map"></div>
    <div class="map_utils">
      <el-select
        v-model="mapTitleOptionsValue"
        @change="mapTitleOptionsValueChange"
      >
        <el-option
          v-for="item in mapTitleOptions"
          :key="item.id"
          :label="item.lable"
          :value="item.id"
        />
      </el-select>
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
          <SvgIcon icon="AG302_warn" size="22" />
          <span class="label">待机</span>
          <span class="value">988</span>
        </li>
        <li>
          <SvgIcon icon="AG302_warn" size="22" />
          <span class="label">待机</span>
          <span class="value">988</span>
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
            v-for="(activity, index) in activities"
            :key="index"
          
            :color="activity.color"
            :hollow="activity.hollow"
            
          >
            <div class="item">
              <div class="l">
                <span class="state state_2">告警</span>
              </div>
              <div class="r">
                <div class="title">
                  <span>东风</span>
                  <span>SN2424234</span>
                </div>
                <p>24m23klrjkfjegerjg你铿套38</p>
                <p>2022-22-22</p>
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
import AGunknown from "@/assets/icons/AGunknown.svg";
import AGunknown_warn from "@/assets/icons/AGunknown_warn.svg";
import wifi_0 from "@/assets/monitoring/wifi_0.png";
import wifi_1 from "@/assets/monitoring/wifi_1.png";
import wifi_2 from "@/assets/monitoring/wifi_2.png";
import wifi_3 from "@/assets/monitoring/wifi_3.png";
import wifi_4 from "@/assets/monitoring/wifi_4.png";
import gcoord from "gcoord";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { mapTitleLayers } from "./utils/mapTitleLayers";
import realTimeChart from "./components/realTimeChart.vue";
import SvgIcon from "@/components/SvgIcon/index.vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.chinatmsproviders";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import {
  onlineFarmMachinePosition_API,
  farmMachineDataStatistics_API,
} from "@/api/monitoring";
import RemoteControl from "@/components/remoteAdjust/index.vue";
const router = useRouter();
let map: any = null; // map实例对象
let markerArr: any = []; // marker坐标点数字
let deviceList: any = []; // 设备列表
let renderMode = "dom"; // 原生dom渲染， 或者 polymer 聚合引擎；
let markerGroup = L.layerGroup();
//@ts-ignore
let markerClusterGroup = L.markerClusterGroup();
// 地图瓦片图选项
let mapTitleOptions = [
  { id: 0, lable: "高德地图", mapName: "GaoDe", mapType: "Normal" },
  { id: 1, lable: "卫星地图", mapName: "GaoDe", mapType: "Satellite" },
  { id: 2, lable: "google地图", mapName: "Google", mapType: "Normal" },
  { id: 3, lable: "天地图", mapName: "TianDiTu", mapType: "Normal" },
];
let sn = ref();
let realTime = ref();
let terminalType = ref();
let version = ref();
let carId = ref();
let name = ref();
let type = ref();
let mapTitleOptionsValue = ref(mapTitleOptions[1].id);
let dataStatistics: any = ref([]); // 数据统计数据
let notice_box_isActive = ref(false);
const activities = ref([
  {
    content: "Custom icon",
    timestamp: "2018-04-12 20:46",

   
  },
  {
    content: "Custom color",
    timestamp: "2018-04-03 20:46",
    color: "#0bbd87",


  },
  {
    content: "Custom size",
    timestamp: "2018-04-03 20:46",
  },
  {
    content: "Custom hollow",
    timestamp: "2018-04-03 20:46",

    hollow: true,
  },
  {
    content: "Default node",
    timestamp: "2018-04-03 20:46",
  },
  {
    content: "Default node",
    timestamp: "2018-04-03 20:46",
  },
  {
    content: "Default node",
    timestamp: "2018-04-03 20:46",
  },
]);
const iconOption: any = {
  typeLabel: "terminalType",
  statusLabel: "driveState",
  iconList: [
    {
      typeValue: "",
      icon: {
        0: AGunknown_warn,
        1: AGunknown,
        2: AGunknown,
      },
    },
    {
      typeValue: ["AG302", "AG302Pro", "AG302Android"],
      icon: {
        0: AG302_warn,
        1: AG302,
        2: AG302,
      },
    },
    {
      typeValue: ["AG360", "AG360Pro"],
      icon: {
        0: AG360_warn,
        1: AG360,
        2: AG360,
      },
    },
    {
      typeValue: ["AG501"],
      icon: {
        0: AG501_warn,
        1: AG501,
        2: AG501,
      },
    },
    {
      typeValue: ["AG501Pro"],
      icon: {
        0: AG501Pro_warn,
        1: AG501Pro,
        2: AG501Pro,
      },
    },
    {
      typeValue: ["AG502"],
      icon: {
        0: AG502_warn,
        1: AG502,
        2: AG502,
      },
    },
  ],
};

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

onMounted(() => {
  initMap();
  getFaromDataStatistics();
  getOnlineFarmPosition();
});

// 获取统计数据
async function getFaromDataStatistics() {
  const { data } = await farmMachineDataStatistics_API();
  dataStatistics.value = data;
  dataStatistics.value.type.forEach((item: any) => (item.checked = true));
}

// 初始化获取设备数据
async function getOnlineFarmPosition() {
  const { data } = await onlineFarmMachinePosition_API({});
  deviceList = data.onlineFarmMachines;
  createMarker();
}
// function realTimeChartHandleClose() {
//   realTimeChartVisible.value = false;
// }

// marker点类型筛选
function markerTypeChange() {
  clearMapMarkers();
  markerGroup.clearLayers();
  let typeNames = dataStatistics.value.type.filter((item: any) => item.checked);
  typeNames = typeNames.map((item: any) => item.typeName);
  markerArr.forEach((item: any) => {
    typeNames.forEach((v: any) => {
      if (item.detail.terminalType.search(v) > -1) {
        if (renderMode == "dom") {
          markerGroup.addLayer(item);
        }
        if (renderMode == "polymer") {
          markerClusterGroup.addLayer(item);
        }
      }
    });
  });

  // markerGroup.length = 10

  // let mm = markerArr.filter((item: any) => item.detail.terminalType.indexOf('AG302') > -1)
  // markerClusterGroup.addLayers(mm)
  // console.log(markerArr,'--219')

  //   markerArr[0].setLatLng([0,0])

  //  let ii  =  L.icon({
  //     iconUrl: AG302 , // SVG图标的路径
  //     iconSize: [25, 28], // 图标的大小 [宽度, 高度]
  //     iconAnchor: [14, 28], // 图标的锚点位置 [水平, 垂直]
  //     popupAnchor: [-2, -28], // 弹出窗口的锚点位置 [水平, 垂直]
  //   })
  //   markerArr[0].setIcon(ii)
  //   markerArr[0].getPopup().setContent('fwefjw')

  // console.log(markerArr[0], "--223");
  // markerArr[1].setLatLng([0,0])
  // markerArr[2].setLatLng([0,0])
  // console.log(markerArr[0].getPopup())
}

// 创建地图marker点
function createMarker() {
  deviceList.forEach((item: any) => {
    const [posY, posX] = gcoord.transform(
      [item.posY, item.posX],
      gcoord.WGS84,
      gcoord.GCJ02
    );
    const icon = createIcon(item);
    const popup = createPopup(item);
    const marker: any = L.marker([posX, posY], { icon });
    marker.bindPopup(popup);
    marker.detail = item;
    markerArr.push(marker);
  });
  if (renderMode == "dom") {
    markerGroup = L.layerGroup(markerArr);
    markerGroup.addTo(map);
  }
  if (renderMode == "polymer") {
    markerClusterGroup.addLayers(markerArr);
    markerClusterGroup.addTo(map);
    // let marker = L.marker([59.06097, 111.93969]);
    // marker.addTo(markerClusterGroup);
  }
}

// 创建popup
function createPopup(item: any) {
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

// 创建icon图标
function createIcon(item: any) {
  const { typeLabel, statusLabel, iconList } = iconOption;
  let defaultIcon = iconList.find((item: any) => !item.typeValue);
  if (!defaultIcon) defaultIcon = iconList[0];
  const typeValue = item[typeLabel];
  iconList.forEach((v: any) => {
    if (!v.typeValue.includes(typeValue)) return;
    item.icon = v.icon[item[statusLabel]];
  });
  if (!item.icon) {
    item.icon = defaultIcon.icon[item[statusLabel]];
  }
  return L.icon({
    iconUrl: item.icon, // SVG图标的路径
    iconSize: [25, 28], // 图标的大小 [宽度, 高度]
    iconAnchor: [14, 28], // 图标的锚点位置 [水平, 垂直]
    popupAnchor: [-2, -28], // 弹出窗口的锚点位置 [水平, 垂直]
  });
}

// 初始化加载地图
function initMap() {
  map = L.map("map", {
    minZoom: 1, //最小缩放值
    maxZoom: 18, //最大缩放值
    center: L.latLng(31.086444, 121.734942), //注意和其他地图经纬度格式区别
    zoom: 4, //初始缩放值
    zoomControl: false, //是否启用地图缩放控件
    attributionControl: false, //是否启用地图属性控件
  });
  mapTitleOptionsValueChange();
}

// 清空地图marker点位
function clearMapMarkers() {
  if (renderMode == "dom") {
    markerGroup.clearLayers();
  }
  if (renderMode == "polymer") {
    markerClusterGroup.clearLayers();
  }
}

// 图商发生变化
function mapTitleOptionsValueChange() {
  const mapTitleOption = mapTitleOptions.find(
    (item) => item.id == mapTitleOptionsValue.value
  );
  changeTileLayer(mapTitleOption?.mapName, mapTitleOption?.mapType);
}

// 设置图商
function changeTileLayer(mapName = "GaoDe", mapType = "Satellite") {
  if (!map) {
    console.warn("未初始化底图实例");
    return;
  }
  let mapUrl = mapTitleLayers[mapName][mapType];
  let options: any = {};
  options.subdomains = mapTitleLayers[mapName]["Subdomains"];
  if ("tms" in mapTitleLayers[mapName]) {
    options.tms = mapTitleLayers[mapName]["tms"];
  }
  if ("key" in mapTitleLayers[mapName]) {
    options.key = mapTitleLayers[mapName]["key"];
  }
  for (let key in mapUrl) {
    L.tileLayer(mapUrl[key], options).addTo(map);
  }
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
.map_conatiner {
  height: 100%;
  position: relative;

  #map {
    height: 100%;
  }

  .map_utils {
    position: absolute;
    z-index: 999;
    bottom: 10px;
    left: 10px;
    display: flex;

    .el-select {
      width: 120px;
    }
  }
  .statistics_box {
    padding: 12px;
    right: 10px;
    top: 10px;
    position: absolute;
    z-index: 999;
    width: 360px;
    // height: 260px;
    background: url("@/assets/monitoring/bg_1.png") no-repeat center center;
    background-size: 100% 100%;
    .top {
      display: flex;
      flex-wrap: wrap;
      border-bottom: 2px solid rgba(0, 218, 216, 0.3);
      padding-bottom: 12px;

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
          font-size: 14px;
          margin-right: 16px;
          margin-left: 8px;
        }
        .value {
          font-size: 18px;
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
    height: 400px;
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
      padding: 0 12px;
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
              color: #e9c75d;
            }
            .state_2 {
              color: #58c15e;
            }
          }
          .r {
            flex:1;
            .title {
              color: #fff;
              font-size: 14px;
              display:flex;
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

// map popup

:deep(.leaflet-popup) {
  .leaflet-popup-content-wrapper {
    background-color: var(--el-bg-color);
    color: var(--color-scheme);
  }

  .leaflet-popup-content {
    width: auto !important;
  }

  .leaflet-popup-tip {
    background-color: var(--el-bg-color);
  }

  .map_popup {
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
}
</style>
