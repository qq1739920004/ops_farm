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
import { mapTitleLayers } from "./mapTitleLayers";
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
let mapTitleOptionsValue = ref(mapTitleOptions[1].id);
let dataStatistics: any = []; // 数据统计数据

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
      typeValue: ["AG302", "AG302Pro"],
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

onMounted(() => {
  initMap();
  getFaromDataStatistics();
  getOnlineFarmPosition();
});

// 获取统计数据
async function getFaromDataStatistics() {
  const { data } = await farmMachineDataStatistics_API();
  dataStatistics = data;
  console.log(dataStatistics);
}

// 初始化获取设备数据
async function getOnlineFarmPosition() {
  const { data } = await onlineFarmMachinePosition_API({});
  deviceList = data.onlineFarmMachines;
  createMarker();
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
    const marker = L.marker([posX, posY], { icon });
    marker.bindPopup(popup);
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
  console.log(onlineStatus[item.driveState]);
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
              <div class="value">${item.sn}</div>
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
            <div class="btn">远程管理</div>
            <div class="btn">历史轨迹</div>
          </li>
          <li>
            <div class="btn">实时驾驶趋势图</div>
            <div class="btn">历史驾驶趋势图</div>
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
