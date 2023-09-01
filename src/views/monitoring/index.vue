<template>
  <div class="map_conatiner">
    <div id="map"></div>
    <div class="map_utils">
      <el-select v-model="mapTitleOptionsValue" @change="hangleSelectChange">
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
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"



// import { monitorGet_API } from "@/api/monitoring";

let map: any = null;
// 地图瓦片图选项
let mapTitleOptions = [
  { id: 0, lable: "高德地图" },
  { id: 1, lable: "卫星地图" },
  { id: 2, lable: "google地图" },
  { id: 3, lable: "天地图" },
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
  hangleSelectChange(); // 获取瓦片图

  let data = [
    { lng: 29.06097, lat: 111.93969 },
    { lng: 29.06097, lat: 11.93969 },
    { lng: 59.06097, lat: 111.93969 },
  ];

  for (var i = 0; i <= 100; i++) {
    data.push({ lng: 59.06097, lat: 111.93969 });
  }



  let markerArr: any = [];
  let markerGroup = L.markerClusterGroup();
  data.forEach((item) => {
    const marker = L.marker([item.lng, item.lat]);
    marker.bindPopup("<b>Hello world!</b><br>I am a popup.")
    markerArr.push(marker);
  });

  


  // console.log(markerGroup,'---80')
  // let markerGroup = L.layerGroup(markerArr);
  // markerGroup.addTo(map);
  // markerGroup.clearLayers();

  // ----------------------

  // let markerGroup = L.layerGroup().addTo(map);
  // data.forEach(item => {
  //   let marker = L.marker([item.lng,item.lat]);
  //   markerGroup.addLayer(marker);

  // })

  // let markerGroup = L.markerClusterGroup()
  // data.forEach(item => {
  //   let marker = L.marker([item.lng,item.lat]);
  //   markerGroup.addLayer(marker)
  // })

  markerGroup.addLayers(markerArr)
  markerGroup.addTo(map)
 
  // markerGroup.removeLayer(markerArr[0])

  // map.addLayer(markerGroup);

}

// 更改底地图
const hangleSelectChange = () => {
  handleMapChange(mapTitleOptionsValue.value);
};
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
