<template>
  <div class="map_conatiner">
    <div id="map"></div>
    <div class="map_utils">
      <el-select v-model="value" @change="hangleSelectChange">
        <el-option label="高德地图" :value="0" />
        <el-option label="卫星地图" :value="1" />
        <el-option label="google" :value="2" />
        <el-option label="天地图" :value="3" />
      </el-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { mapTitleLayers } from "./mapTitleLayers";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.chinatmsproviders";

// import { monitorGet_API } from "@/api/monitoring";

let map: any = null;

let value = ref(1);

onMounted(() => {
  initMap();
});

// 初始化地图数据
function initMap() {
  map = L.map("map", {
    minZoom: 1, //最小缩放值
    maxZoom: 18, //最大缩放值
    center: L.latLng(31.086444, 121.734942), //注意和其他地图经纬度格式区别
    zoom: 5, //初始缩放值
    zoomControl: false, //是否启用地图缩放控件
    attributionControl: false, //是否启用地图属性控件
  });
  hangleSelectChange(); // 获取瓦片图
}

// 更改底地图
const hangleSelectChange = () => {
  handleMapChange(value.value);
};
function changeTileLayer(mapName = "GaoDe", mapType = "Satellite") {
  if (!map) {
    console.warn("未初始化底图实例");
    return;
  }
  let mapUrl = mapTitleLayers[mapName][mapType];

  let options = reactive<any>({});
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
function handleMapChange(mayType: number) {
  switch (mayType) {
    case 0:
      changeTileLayer("GaoDe", "Normal"); // 高德地图
      break;
    case 1:
      changeTileLayer("GaoDe", "Satellite"); //卫星地图
      break;
    case 2:
      changeTileLayer("Google", "Normal"); // google地图
      break;
    case 3:
      changeTileLayer("TianDiTu", "Normal"); // 天地图
      break;
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
