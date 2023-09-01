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
import { ref, onMounted } from "vue";
import { mapTitleLayers } from "./mapTitleLayers";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.chinatmsproviders";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

// import { monitorGet_API } from "@/api/monitoring";

let map: any = null;
let markerArr: any = [];

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
});

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

  let data = [
    { lng: 29.06097, lat: 111.93969 },
    { lng: 29.06097, lat: 11.93969 },
    { lng: 59.06097, lat: 111.93969 },
  ];

  for (var i = 0; i <= 100; i++) {
    data.push({ lng: 59.06097, lat: 111.93969 });
  }

  data.forEach((item) => {
    const marker = L.marker([item.lng, item.lat]);
    marker.bindPopup("<b>Hello world!</b><br>I am a popup.");
    markerArr.push(marker);
  });

  // let markerGroup = L.layerGroup(markerArr);
  // markerGroup.addTo(map);

  // let markerClusterGroup = L.markerClusterGroup();
  // markerClusterGroup.addLayers(markerArr);
  // markerClusterGroup.addTo(map);
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
