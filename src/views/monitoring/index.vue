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
      <!-- <SvgIcon icon="AG360"/> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import AG360Icon from "@/assets/icons/AG360.svg";
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

onMounted(() => {
  initMap();
  getFaromDataStatistics();
  getOnlineFarmPosition();
});

// 获取统计数据
async function getFaromDataStatistics() {
  let res = await farmMachineDataStatistics_API()
  console.log(res)
  // dataStatistics = res
}

// 初始化获取设备数据
async function getOnlineFarmPosition() {
  let res = await onlineFarmMachinePosition_API({});
  deviceList = res.data.onlineFarmMachines;
  console.log(deviceList, "---58");
  createMarker();
}

// 创建地图marker点
function createMarker() {
  deviceList.forEach((item: any) => {
    const icon = L.icon({
      iconUrl: AG360Icon, // SVG图标的路径
      iconSize: [23, 27], // 图标的大小 [宽度, 高度]
      iconAnchor: [14, 28], // 图标的锚点位置 [水平, 垂直]
      popupAnchor: [0, -28], // 弹出窗口的锚点位置 [水平, 垂直]
    });
    const marker = L.marker([item.posX, item.posY], { icon: icon });
    marker.bindPopup("<b>Hello world!</b><br>I am a popup.");
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
    zoom: 5, //初始缩放值
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
