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
      <div class="map_utils_item">
        <el-tooltip effect="light" content="点回回全局">
          <el-button @click="handleMapCenter('')">
            <SvgIcon icon="refresh" />
          </el-button>
        </el-tooltip>
      </div>
      <div class="map_utils_item">
        <el-tooltip effect="light" content="测距">
          <el-button @click="mapRanging">
            <SvgIcon icon="ranging" />
          </el-button>
        </el-tooltip>
        <el-button
          class="clear_btn"
          v-if="rangingArray.length > 0"
          @click="clearMapRanging"
          type="danger"
          >清除</el-button
        >
      </div>
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
import { ref, reactive, onMounted, watch } from "vue";
import SvgIcon from "@/components/SvgIcon/index.vue";

const props = defineProps({
  mapTile: {
    type: Array,
    default: [0, 1, 2],
  },
  mapCenter: {
    type: Object,
    default: () => ({
      markerId: null,
      center: [[121.734942, 31.086444]],
      zoom: 4,
    }),
  },
  mapRenderMode: {
    type: String,
    default: "dom", // 原生dom渲染， 或者 polymer 聚合引擎；
  },
  markerData: {
    type: Array,
    default: [],
  },
  markerDataHidden: {
    type: Array,
    default: [],
  },
  markerDataHandle: {
    type: Object,
    default: () => ({}),
  },
  lineData: {
    type: Array,
    default: [],
  },
  lineStyle: {
    type: Object,
    default: {
      color: "#8dfc96",
      weight: 2,
    },
  },
});
let pickupMode: boolean = false; // 是否地图拾取模式
let pickedPoints: any = [];
let rangingArray: any = reactive([]);
const defaultMapCenter = [31.086444, 121.734942];
const defaultMapZoom = 4;

watch(
  () => props.markerData,
  (markerData) => {
    createMarker(markerData);
  },
  { deep: true }
);
watch(
  () => props.markerDataHidden,
  (markerDataHidden) => {
    updateMarkerVisible(markerDataHidden);
  },
  { deep: true }
);
watch(
  () => props.markerDataHandle,
  (markerDataHandle) => {
    if (markerDataHandle.markerHandle == "add") {
      createMarker([markerDataHandle]);
    }
    if (markerDataHandle.markerHandle == "delete") {
      removeMarker([markerDataHandle]);
    }
    if (markerDataHandle.markerHandle == "update") {
      updateMarker([markerDataHandle]);
    }
  },
  { deep: true }
);
watch(
  () => props.lineData,
  (lineData) => {
    createLine(lineData);
  },
  { deep: true }
);
watch(
  () => props.mapCenter,
  (mapCenter) => {
    handleMapCenter(mapCenter);
  },
  { deep: true }
);

let map: any = null; // map实例对象
let polyline: any = null;
let mapRenderMode = props.mapRenderMode;
let mapRenderModeLength = ref(0);
let mapRenderModeLengthMax = 300; //数量超过1000，强制转为 polymer 聚合引擎
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

watch(
  () => mapRenderModeLength,
  (mapRenderModeLength) => {
    if (mapRenderModeLength.value > mapRenderModeLengthMax && mapRenderMode == 'dom') {
      markerClusterGroup.clearLayers();
      markerGroup.clearLayers();
      mapRenderMode = "polymer";
      updateMarkerVisible(props.markerDataHidden);
    }
  },
  { deep: true }
);

onMounted(() => {
  initMap();
  handleMapCenter(props.mapCenter);
  createMarker(props.markerData);
  createLine(props.lineData);
});

// 创建地图marker点
function createMarker(list: any) {
  mapRenderModeLength.value += list.length;
  list.forEach((item: any) => {
    let marker: any;
    const [markerLng, markerLat] = gcoordLngLat(item.markerLng, item.markerLat);
    const icon = createIcon(item);
    if (icon) {
      marker = L.marker([markerLat, markerLng], { icon });
    } else {
      marker = L.marker([markerLat, markerLng]);
    }
    marker.bindPopup(item.markerPopup);

    marker.markerId = item.markerId; // marker对象上设置唯一标识
    marker.markerType = item.markerType; // marker对象上设置唯一标识
    markerArr.push(marker);
    if (mapRenderMode == "dom") {
      props.markerDataHidden.includes(item.markerType)
        ? ""
        : markerGroup.addLayer(marker);
    }
    if (mapRenderMode == "polymer") {
      props.markerDataHidden.includes(item.markerType)
        ? ""
        : markerClusterGroup.addLayer(marker);
    }
  });
}
// 删除地图marker点
function removeMarker(list: any) {
  mapRenderModeLength.value -= list.length;
  list.forEach((item: any) => {
    markerArr.forEach((v: any, i: number) => {
      if (item.markerId == v.markerId) {
        if (mapRenderMode == "dom") {
          markerGroup.removeLayer(v);
        }
        if (mapRenderMode == "polymer") {
          markerClusterGroup.removeLayer(v);
        }
        markerArr.splice(i, 1);
      }
    });
  });
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
        v.setLatLng([markerLat, markerLng]);
        v.getPopup().setContent(item.markerPopup);
      }
    });
  });
}
// 修改地图marker显隐藏
function updateMarkerVisible(list: any) {
  markerArr.forEach((item: any) => {
    if (mapRenderMode == "dom") {
      if (list.includes(item.markerType)) {
        markerGroup.removeLayer(item);
      } else {
        markerGroup.addLayer(item);
      }
    }
    if (mapRenderMode == "polymer") {
      if (list.includes(item.markerType)) {
        markerClusterGroup.removeLayer(item);
      } else {
        markerClusterGroup.addLayer(item);
      }
    }
  });
}
// 创建icon图标
function createIcon(item: any) {
  if (!item.markerIcon) return;
  return L.icon({
    iconUrl: item.markerIcon, // SVG图标的路径
    iconSize: [25, 28], // 图标的大小 [宽度, 高度]
    iconAnchor: [12, 14], // 图标的锚点位置 [水平, 垂直]
    popupAnchor: [-2, -28], // 弹出窗口的锚点位置 [水平, 垂直]
  });
}

// 初始化加载地图
function initMap() {
  map = L.map("map", {
    minZoom: 1, //最小缩放值
    maxZoom: 18, //最大缩放值
    // center: props.mapCenter.center, //注意和其他地图经纬度格式区别
    // zoom: props.mapCenter.zoom, //初始缩放值
    zoomControl: false, //是否启用地图缩放控件
    attributionControl: false, //是否启用地图属性控件
  });

  markerGroup.addTo(map);
  markerClusterGroup.addTo(map);
  mapTileChange();
  initRanging();
}
// 创建线
function createLine(list: any) {
  if (polyline) {
    polyline.remove();
  }
  const latLng: any = [];
  list.forEach((item: any) => {
    let arr: any = [];
    item.forEach((v: any) => {
      arr.push(gcoordLngLat(v[1], v[0]));
    });
    latLng.push(arr);
  });

  const { color, weight } = props.lineStyle;

  polyline = L.polyline(latLng, {
    color,
    weight,
  }).addTo(map);
}

// 图商发生变化
function mapTileChange() {
  const mapTitleOption = mapTileOptions.list.find(
    (item) => item.id == mapTileOptions.id
  );
  changeTileLayer(mapTitleOption?.mapName, mapTitleOption?.mapType);
}
// 处理地图定位
function handleMapCenter(data: any) {
  if (!data) {
    map.setView(defaultMapCenter, defaultMapZoom);
    return;
  }
  if (data.markerId) {
    const findMarker = markerArr.find(
      (item: any) => item.markerId == data.markerId
    );
    findMarker.openPopup();
    map.fitBounds([findMarker._latlng]);
    map.setZoom(map.getZoom() - 2);
  } else if (data.center && data.center.length > 0) {
    let latLng: any = [];
    latLng = data.center.map((item: any) => {
      return gcoordLngLat(item[1], item[0]);
    });
    var bounds = L.latLngBounds(latLng);
    map.fitBounds(bounds);
    data.zoom ? map.setZoom(data.zoom) : "";
  } else {
    map.setView(defaultMapCenter, defaultMapZoom);
  }
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

// 地图测距
function mapRanging() {
  try {
    // @ts-ignore
    document.getElementById("map").style.cursor = "crosshair"; // 改变鼠标状态
  } catch (err) {
    console.log(err);
  }
  pickupMode = true; //开启拾取模式
}

// 清除地图测距
function clearMapRanging() {
  if (rangingArray.length) {
    rangingArray.forEach((item: any) => {
      map.removeLayer(item);
    });
    rangingArray.length = 0;
  }
  pickupMode = false;
  pickedPoints = [];
  try {
    // @ts-ignore
    document.getElementById("_map").style.cursor = "grab";
  } catch (err) {
    console.log(err);
  }
}
// 初始化测距
function initRanging() {
  map.on("click", function (event: any) {
    if (pickupMode) {
      let point = event.latlng;
      pickedPoints.push(point);
      let marker = L.marker(point).addTo(map);
      rangingArray.push(marker);
      if (pickedPoints.length === 2) {
        let distance = pickedPoints[0].distanceTo(pickedPoints[1]); //算距离
        let polyline = L.polyline(pickedPoints, { color: "red" })
          .addTo(map)
          .bindPopup(`相距:${distance.toFixed(3)}米`)
          .openPopup(); //划线
        rangingArray.push(polyline);
        map.fitBounds(pickedPoints); //适应视野
        //恢复状态
        pickupMode = false;
        pickedPoints = [];
        try {
          // @ts-ignore
          document.getElementById("map").style.cursor = "grab";
        } catch (err) {
          console.log(err);
        }
        return;
      }
    }
  });
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
  align-items: center;

  .el-select {
    width: 120px;
  }

  .map_utils_item {
    margin-left: 6px;

    .clear_btn {
      margin-left: 6px;
    }
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
