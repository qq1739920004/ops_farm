<template>
  <div class="map_conatiner">
    <div id="map"></div>
    <div class="map_utils">
      <el-select v-model="mapTitleOptionsValue" @change="mapTitleOptionsValueChange">
        <el-option v-for="item in mapTitleOptions" :key="item.id" :label="item.lable" :value="item.id" />
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



}

// 初始化获取设备数据
async function getOnlineFarmPosition() {
  const { data } = await onlineFarmMachinePosition_API({});
  deviceList = data.onlineFarmMachines;
  createMarker();
}

// 创建地图marker点
function createMarker() {
  const { typeLabel, statusLabel, iconList } = iconOption;
  let defaultIcon = iconList.find((item: any) => !item.typeValue);
  if (!defaultIcon) defaultIcon = iconList[0];
  deviceList.forEach((item: any) => {
    const typeValue = item[typeLabel];
    iconList.forEach((v: any) => {
      if (!v.typeValue.includes(typeValue)) return;
      item.icon = v.icon[item[statusLabel]];
    });
    if (!item.icon) {
      item.icon = defaultIcon.icon[item[statusLabel]];
    }
    const icon = L.icon({
      iconUrl: item.icon, // SVG图标的路径
      iconSize: [25, 28], // 图标的大小 [宽度, 高度]
      iconAnchor: [14, 28], // 图标的锚点位置 [水平, 垂直]
      popupAnchor: [-2, -28], // 弹出窗口的锚点位置 [水平, 垂直]
    });
    const marker = L.marker([item.posX, item.posY], { icon: icon });
    marker.bindPopup(`<b>Hello world!</b><br>${item.terminalType}`);
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
</style>
