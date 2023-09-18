<template>
  <div class="SinoMap_component">
    <div id="map"></div>
    <div class="map_utils">
      <el-select v-model="mapTileOptions.id" @change="mapTileChange">
        <el-option
          v-for="item in mapTileOptions.list"
          :key="item.id"
          :label="item.lable"
          :value="item.id"
        />
      </el-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import gcoord from "gcoord";
// @ts-ignore
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { mapTileLayers } from "./utils/mapTileLayers";
import { reactive, onMounted, watch } from "vue";

const props = defineProps({
  mapTile: {
    type: Array,
    default: [0, 1, 2],
  },
  markerData: {
    type: Array,
    default: [],
  },
});
let markerData_flat: any = [];
let lastMarkerData_flat: any = []; // 上一次markerData数据
watch(
  () => props.markerData,
  (markerData) => {
    markerData_flat = arryFlat(markerData);
    diffArray(lastMarkerData_flat, markerData_flat);
    lastMarkerData_flat = markerData_flat
  },
  { deep: true }
);

let map: any = null; // map实例对象
let renderMode = "polymer"; // 原生dom渲染， 或者 polymer 聚合引擎；
let markerArr: any = []; // marker坐标点数字

//@ts-ignore
let markerClusterGroup = L.markerClusterGroup();
let markerGroup = L.featureGroup();
// 地图瓦片图选项
let mapTileOptions = reactive({
  id: props.mapTile[0],
  list: [
    { id: 0, lable: "卫星地图", mapName: "GaoDe", mapType: "Satellite" },
    { id: 1, lable: "高德地图", mapName: "GaoDe", mapType: "Normal" },
    { id: 2, lable: "google地图", mapName: "Google", mapType: "Normal" },
    { id: 3, lable: "天地图", mapName: "TianDiTu", mapType: "Normal" },
  ],
});

mapTileOptions.list = mapTileOptions.list.filter((item: any) =>
  props.mapTile.includes(item.id)
);

onMounted(() => {
  initMap();
  createMarker(markerData_flat);
});

// 处理markerId后扁平化数组
function arryFlat(data: any) {
  data = JSON.parse(JSON.stringify(data))
  data.forEach((item: any, index: number) => {
    item.forEach((v: any) => {
      v.markerId = v.markerId + "_" + index;
    });
  });

  return data.flat();
}

function diffArray(arr1: any, arr2: any) {
  // 新增了marker点
  if (arr1.length < arr2.length) {
    let resList: any = [];
    arr2.forEach((item: any) => {
      let flag = true;
      arr1.forEach((v: any) => {
        if (item.markerId == v.markerId) {
          flag = false;
        }
      });
      if (flag) resList.push(item);
    });
    createMarker(resList);
  }
  // 删除了marke点
  if (arr1.length > arr2.length) {
    let resList: any = [];
    arr1.forEach((item: any) => {
      let flag = true;
      arr2.forEach((v: any) => {
        if (item.markerId == v.markerId) {
          flag = false;
        }
      });
      if (flag) resList.push(item);
    });
    removeMarker(resList);
  }

  // 更新了marker点
  if (arr1.length == arr2.length) {
    let resList: any = [];
    let resVisibleList: any = [];
    arr1.forEach((item: any) => {
      arr2.forEach((v: any) => {
        if (item.markerId == v.markerId) {
          if (JSON.stringify(item) != JSON.stringify(v)) {
            resList.push(v);
            if (item.markerVisible != v.markerVisible) {
              resVisibleList.push(v);
            }
          }
        }
      });
    });
    updateMarkerVisible(resVisibleList);
    updateMarker(resList);
  }
}
// 创建地图marker点
function createMarker(list: any) {
  list.forEach((item: any) => {
    let marker: any;
    const [markerLng, markerLat] = gcoordLngLat(item.markerLng, item.markerLat);
    const icon = createIcon(item);
    if (icon) {
      marker = L.marker([markerLng, markerLat], { icon });
    } else {
      marker = L.marker([markerLng, markerLat]);
    }
    marker.bindPopup(item.markerPopup);
    marker.markerId = item.markerId; // marker对象上设置唯一标识
    markerArr.push(marker);
    if (renderMode == "dom") {
      item.markerVisible ? markerGroup.addLayer(marker) : "";
    }
    if (renderMode == "polymer") {
      item.markerVisible ? markerClusterGroup.addLayers(marker) : "";
    }
  });

  // if (markerArr.length > 0) {
  //   var groupBounds = markerGroup.getBounds();

  //   // 使用 fitBounds 方法来适应包含所有标记的边界框
  //   map.fitBounds(groupBounds);
  // }
  // console.log(markerArr, "--145");
  // var groupBounds = markerArr.getBounds();
  // console.log(groupBounds, "--147");
  // 使用 fitBounds 方法来适应包含所有标记的边界框
}
// 删除地图marker点
function removeMarker(list: any) {
  list.forEach((item: any) => {
    markerArr.forEach((v: any, i: number) => {
      if (item.markerId == v.markerId) {
        if (renderMode == "dom") {
          markerGroup.removeLayer(v);
        }
        if (renderMode == "polymer") {
          markerClusterGroup.removeLayer(v);
        }
        markerArr.splice(i, 1);
      }
    });
  });
  console.log(markerArr.length)
  console.log(markerData_flat.length)
}
// 修改地图marker点
function updateMarker(list: any) {
  list.forEach((item: any) => {
    markerArr.forEach((v: any) => {
      if (item.markerId == v.markerId) {
        const icon = createIcon(item);
        const [markerLng, markerLat] = gcoordLngLat(
          item.markerLng,
          item.markerLat
        );
        if (icon) v.setIcon(icon);
        v.setLatLng([markerLng, markerLat]);
        v.getPopup().setContent(item.markerPopup);
      }
    });
  });
}
// 修改地图marker显隐藏
function updateMarkerVisible(list: any) {
  list.forEach((item: any) => {
    markerArr.forEach((v: any) => {
      if (item.markerId == v.markerId) {
        if (renderMode == "dom") {
          item.markerVisible
            ? markerGroup.addLayer(v)
            : markerGroup.removeLayer(v);
        }
        if (renderMode == "polymer") {
          item.markerVisible
            ? markerClusterGroup.addLayers(v)
            : markerClusterGroup.removeLayer(v);
        }
      }
    });
  });
}
// 创建icon图标
function createIcon(item: any) {
  if (!item.markerIcon) return;
  return L.icon({
    iconUrl: item.markerIcon, // SVG图标的路径
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
  markerGroup.addTo(map);
  markerClusterGroup.addTo(map);
  mapTileChange();
}

// 图商发生变化
function mapTileChange() {
  const mapTitleOption = mapTileOptions.list.find(
    (item) => item.id == mapTileOptions.id
  );
  changeTileLayer(mapTitleOption?.mapName, mapTitleOption?.mapType);
}

// 设置图商
function changeTileLayer(mapName = "GaoDe", mapType = "Satellite") {
  if (!map) {
    console.warn("未初始化底图实例");
    return;
  }
  let mapUrl = mapTileLayers[mapName][mapType];
  let options: any = {};
  options.subdomains = mapTileLayers[mapName]["Subdomains"];
  if ("tms" in mapTileLayers[mapName]) {
    options.tms = mapTileLayers[mapName]["tms"];
  }
  if ("key" in mapTileLayers[mapName]) {
    options.key = mapTileLayers[mapName]["key"];
  }
  for (let key in mapUrl) {
    L.tileLayer(mapUrl[key], options).addTo(map);
  }
}
// 处理经纬度偏差
function gcoordLngLat(markerLng: number, markerLat: number) {
  const [lat, lng] = gcoord.transform(
    [markerLat, markerLng],
    gcoord.WGS84,
    gcoord.GCJ02
  );
  return [lng, lat];
}
</script>

<style lang="scss" scoped>
.SinoMap_component {
  position: relative;
  height: 100%;
}
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
}
</style>
