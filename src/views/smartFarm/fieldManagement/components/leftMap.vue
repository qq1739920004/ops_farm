<template>
  <div class="SinoMap_component">
    <div :id="mapContainerId" style="height: 70px; width: 110px"></div>
  </div>
</template>

<script setup lang="ts">
import { mapTileLayers } from "./utils/mapTileLayers";
import { ref, reactive, onMounted, onUnmounted, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { gcoordLngLat } from "sino-tool-v3";

const { t, locale } = useI18n();
const props = defineProps({
  mapKey: {
    // 必须传递的唯一标识，用于生成容器ID
    type: String,
    required: true,
  },
  mapTile: {
    type: Array,
    default: [0, 1, 2],
  },
  handleOb: {
    type: Object,
    default: () => ({
      markerId: null,
    }),
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
    default: "", // 原生dom渲染， 或者 polymer 聚合引擎；
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
  polygonData: {
    type: Array,
    default: [],
  },

  boundariesID: {
    type: Array,
    default: [],
  },
  lineStyle: {
    type: Object,
    default: {
      color: "#8be668",
      weight: 4,
    },
  },
  nameList: {
    type: Array,
    default: [],
  },
});
const mapContainerId = computed(() => `leaflet-map-${props.mapKey}`);
const defaultMapCenter = [31.086444, 121.734942];
const defaultMapZoom = 4;


let mapInstance: any = null; // map实例对象
let markerArr: any = []; // marker坐标点数字

// 地图瓦片图选项 
let mapTileOptions = reactive({
  id: props.mapTile[0],
  list: [
    {
      id: 0,
      lable: "sinoMap.SatellitesMap",
      mapName: "GaoDe",
      mapType: "Satellite",
    },
    {
      id: 1,
      lable: "sinoMap.AMAP",
      mapName: "GaoDe",
      mapType: "Normal",
    },
    {
      id: 2,
      lable: "sinoMap.googleMap",
      mapName: "Google",
      mapType: "Normal",
    },
    // { id: 3, lable: "天地图", mapName: "TianDiTu", mapType: "Normal" },
  ],
});
if (locale.value.includes("zh")) {
  mapTileOptions.id = 0;
  mapTileOptions.list[0] = {
    id: 0,
    lable: "sinoMap.SatellitesMap",
    mapName: "GaoDe",
    mapType: "Satellite",
  };
} else {
  mapTileOptions.id = 2;
  mapTileOptions.list[0] = {
    id: 0,
    lable: "sinoMap.SatellitesMap",
    mapName: "Google",
    mapType: "Satellite",
  };
}
watch(
  () => locale.value,
  (value) => {
    if (value === "zh") {
      mapTileOptions.id = 0;
      mapTileOptions.list[0] = {
        id: 0,
        lable: "sinoMap.SatellitesMap",
        mapName: "GaoDe",
        mapType: "Satellite",
      };
      mapTileChange();
    } else {
      mapTileOptions.id = 2;
      mapTileOptions.list[0] = {
        id: 0,
        lable: "sinoMap.SatellitesMap",
        mapName: "Google",
        mapType: "Satellite",
      };
      mapTileChange();
    }
  },
  { deep: true }
);
mapTileOptions.list = mapTileOptions.list.filter((item: any) =>
  props.mapTile.includes(item.id)
);
onMounted(() => {
  // 确保容器DOM存在且未被初始化

  // 添加瓦片图层
  initMap();
  handleMapCenter(props.mapCenter);
  createPolygon(props.polygonData);
});

// 初始化加载地图
function initMap() {
  mapInstance = L.map(mapContainerId.value, {
    minZoom: 3, //最小缩放值
    maxZoom: 18, //最大缩放值
    // center: props.mapCenter.center, //注意和其他地图经纬度格式区别
    // zoom: props.mapCenter.zoom, //初始缩放值
    zoomControl: false, //是否启用地图缩放控件
    attributionControl: false, //是否启用地图属性控件
    zoomSnap: 1,
    dragging: false, // 禁用鼠标拖拽
    scrollWheelZoom: false, // 禁用鼠标滚轮缩放
    doubleClickZoom: false, // 禁用双击缩放
    boxZoom: false, // 禁用框选缩放
    touchZoom: false, // 禁用触摸缩放（针对移动设备）
  });

  mapTileChange();
}

// 图商发生变化
function mapTileChange() {
  const mapTitleOption = mapTileOptions.list.find((item) => item.id == mapTileOptions.id);
  changeTileLayer(mapTitleOption?.mapName, mapTitleOption?.mapType);
}
// 处理地图定位
function handleMapCenter(data: any) {
  if (!data) {
    let latLng: any = [];
    if (props.mapCenter.center) {
      latLng = props.mapCenter.center.map((item: any) => {
        return gcoordLngLat(item[0], item[1]);
      });
      var bounds = L.latLngBounds(latLng);
      mapInstance.fitBounds(bounds);
      props.mapCenter.zoom ? mapInstance.setZoom(props.mapCenter.zoom) : "";
    } else {
      mapInstance.setView(defaultMapCenter, defaultMapZoom);
    }
    return;
  }
  if (data.markerId) {
    const findMarker = markerArr.find((item: any) => item.markerId == data.markerId);
    findMarker.openPopup();
    mapInstance.fitBounds([findMarker._latlng]);
    mapInstance.setZoom(mapInstance.getZoom() - 2);
  } else if (data.center && data.center.length > 0) {
    let latLng: any = [];
    latLng = data.center.map((item: any) => {
      return gcoordLngLat(item[0], item[1]);
    });
    var bounds = L.latLngBounds(latLng);
    mapInstance.fitBounds(bounds);
    data.zoom ? mapInstance.setZoom(data.zoom) : "";
  } else {
    mapInstance.setView(defaultMapCenter, defaultMapZoom);
  }
}
let currentLayers: any = [];
// 设置图商
function changeTileLayer(mapName = "GaoDe", mapType = "Satellite") {
  if (!mapInstance) {
    console.warn("未初始化底图实例");
    return;
  }
  if (currentLayers.length) {
    currentLayers.forEach((layer: any) => layer.remove());
    currentLayers = [];
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
    let layer = L.tileLayer(mapUrl[key], options).addTo(mapInstance);
    currentLayers.push(layer);
  }
}

function createPolygon(list: any) {
  if (list.length === 0) {
    return;
  }
  let polytrueData: any = [];

  list.forEach((it: any) => {
    let innerList = it.map((point: any) => {
      let position = gcoordLngLat(point.split(",")[1], point.split(",")[0]);
      return position;
    });
    polytrueData.push(innerList);
  });
  polytrueData.map((item: any, index: any) => {
    var polygon = L.polygon(item, {
      color: "#83FFA4",
      fillColor: "#4CB04F",
      fillOpacity: 0.44,
    }).addTo(mapInstance);
    mapInstance.fitBounds(polytrueData);
  });
}

defineExpose({
  handleMapCenter,
  mapTileChange,
});
</script>

<style lang="scss" scoped>
:root {
  --map-font-size: 1px;
}
.SinoMap_component {
  position: relative;
  height: 100%;
}

.map_utils {
  background: url("@/assets/monitoring/inputBack.png") no-repeat center center;
  background-size: 105% 105%;

  border: 1px solid #fff;
  border-radius: 5px;
  padding: 6px 10px;
  color: #fff;

  .map_utils_item {
    height: 15px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    .el-checkbox__label {
      color: #fff;
    }
    .item {
      padding: 0 6px;
      display: flex;
      align-items: center;

      p {
        text-decoration: underline;
        color: #fff;
        font-size: 14px;
        cursor: pointer;
        margin: 0;
      }
      .el-dropdown-link {
        color: #fff;
        display: flex;
        align-items: center;
      }
    }
    &:first-child {
      padding-left: 0;
    }
    &:last-child {
      padding-right: 0;
    }
    .el-button {
      background-color: transparent;
      border: none;
      padding: 0;
    }
    :deep(.el-input__wrapper) {
      background: transparent !important;
      border: none;
      box-shadow: none;
      padding: 0;
      .el-input__inner {
        color: white;
      }
      .el-input__wrapper:focus {
        box-shadow: none !important;
      }
    }

    .el-icon {
      color: #fff;
    }
    .el-scrollbar {
      padding: 0 10px !important;
    }

    svg {
      cursor: pointer;
      use {
        fill: #fff;
      }
    }
    .el-dropdown-link {
      color: #fff;
      display: flex;
      align-items: center;
    }

    &:not(:last-child) {
      border-right: 1px solid #fff;
    }
  }
}
.map_utils {
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 999;
  display: flex;
  .map_utils_item {
    margin-right: 6px;
  }
}

:deep(.leaflet-popup) {
  color: white;
  .leaflet-popup-content-wrapper {
    background: url("@/assets/monitoring/Union@.png");
    background-size: contain;
    background-size: 100% 103%;
    color: var(--color-scheme);
  }

  .leaflet-popup-content {
    width: auto !important;
  }

  .leaflet-popup-tip {
    background-color: #388874;
  }
}
:deep(.custom-icon) {
  color: #ffdf00;
  font-size: var(--map-font-size);
  font-weight: 700;
  div {
    background: linear-gradient(
      90deg,
      rgba(0, 135, 245, 1) 0%,
      rgba(0, 123, 255, 0) 100%
    );
    border: 1px solid #ffffff;
    border-radius: 5px;
    padding: 2px 5px;
  }
}
:deep(.leaflet-tooltip) {
  font-size: 8px;
}

:deep(.el-select) {
  --el-select-input-focus-border-color: transparent;
}
:deep(.el-select__wrapper) {
  background-color: transparent;
  box-shadow: none;
  color: white;
}
:deep(.el-select__placeholder) {
  color: white;
}
:deep(.el-select__wrapper:hover) {
  background-color: transparent;
  box-shadow: none;
  color: white;
}
/* 自定义文字样式 */
.custom-text {
  background: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.text-icon {
  font-weight: bold;
  color: #333;
}
</style>
