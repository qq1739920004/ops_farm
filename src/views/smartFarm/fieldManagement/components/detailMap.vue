<template>
  <div class="SinoMap_component">
    <div id="map"></div>
    <div class="map_utils">
      <div class="map_utils_item flex-align-center">
        <el-select
          style="width: 111px"
          v-model="mapTileOptions.id"
          @change="mapTileChange"
        >
          <el-option
            v-for="item in mapTileOptions.list"
            :key="item.id"
            :label="t(item.lable)"
            :value="item.id"
          />
        </el-select>
      </div>
      <div class="map_utils_item">
        <el-tooltip
          effect="light"
          :content="t('sinoMap.Clickmetoreturntotheoverallsituation')"
        >
          <el-button @click="handleMapCenter('')">
            <el-icon size="16"><RefreshRight /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
      <div class="map_utils_item">
        <el-tooltip effect="light" :content="t('sinoMap.ranging')">
          <el-button @click="mapRanging">
            <SvgIcon icon="ranging" color="white" />
          </el-button>
        </el-tooltip>
        <div class="map_utils_item" v-if="rangingArray.length > 0">
          <el-tooltip effect="light" :content="t('work.clear')">
            <el-button
              class="clear_btn"
              v-if="rangingArray.length > 0"
              @click="clearMapRanging"
              type="danger"
            >
              <el-icon> <Delete /> </el-icon
            ></el-button>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mapTileLayers } from "./utils/mapTileLayers";
import { ref, reactive, onMounted, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import fixed_icon from "./assets/fixed.png";
import AG360 from "@/assets/icons/AG360.svg";
import AG360_warn from "@/assets/icons/AG360_warn.svg";
import AG360_offline from "@/assets/icons/AG360_offline.svg";
import green from "@/assets/monitoring/green.svg";
import yellow from "@/assets/monitoring/yellow.svg";
import gray from "@/assets/monitoring/gray.svg";
import { gcoordLngLat, getMapView } from "sino-tool-v3";

//引入turf.js
import * as turf from "@turf/turf";
// const L = window.L;

const mapFontSize = computed(() => {
  let fontSize = 16;
  if (currentZoom.value <= 10) {
    fontSize = 12;
  } else if (currentZoom.value == 11) {
    fontSize = 14;
  }
  return fontSize;
});
const { t, locale } = useI18n();

const props = defineProps({
  companyId: {
    type: Number,
    default: "",
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
  colorList: {
    type: Array,
    default: [],
  },
  polygonData: {
    type: Array,
    default: [],
  },
  polygonData2: {
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
let pickupMode: boolean = false; // 是否地图拾取模式
let pickedPoints: any = [];
let rangingArray: any = reactive([]);
let type0_Line: any = [];
let type2_Line: any = [];
let type4_Line: any = [];
let type5_Line: any = [];
let type6_Line: any = [];
let type7_Line: any = [];
let type8_Line: any = [];
let type101_Line: any = [];
let type102_Line: any = [];
let polygonArr: any = [];
let polygonArr2: any = [];
let markerNameArr: any = [];
const targetZoom = 17;
let cycleArray: any = [];
const defaultMapCenter = [31.086444, 121.734942];
const defaultMapZoom = 4;
watch(
  () => props.mapCenter,
  (mapCenter) => {
    setTimeout(() => {
      handleMapCenter(mapCenter);
    }, 10);
  },
  { deep: true }
);
watch(
  () => props.companyId,
  () => {}
);
watch(
  () => props.lineData,
  (lineData) => {
    createLine(lineData);
  },
  { deep: true }
);
watch(
  () => props.polygonData,
  (polygonData) => {
    createPolygon(polygonData);
    // 创建纯文字标记
  },
  { deep: true }
);
watch(
  () => props.polygonData2,
  (polygonData2) => {
    createPolygon2(polygonData2);
    // 创建纯文字标记
  },
  { deep: true }
);
watch(
  () => props.markerData,
  () => {
    createMarker(props.markerData);
  },
  { deep: true }
);

const markerDataHiddenNow = ref<any>([]);
watch(
  () => props.markerDataHidden,
  (markerDataHidden) => {
    markerDataHiddenNow.value = markerDataHidden;
    updateMarkerVisible(markerDataHidden);
  },
  { deep: true }
);
watch(
  () => props.markerDataHandle,
  (markerDataHandle) => {
    if (markerDataHandle.markerHandle == "add") {
      updateMarker(markerDataHandle);
    }
    if (markerDataHandle.markerHandle == "delete") {
      updateMarker(markerDataHandle);
    }
    if (markerDataHandle.markerHandle == "update") {
      updateMarker(markerDataHandle);
    }
  },
  { deep: true }
);

watch(
  () => props.boundariesID,

  (boundariesID) => {
    findBoundaries(boundariesID);
  },
  { deep: true }
);

watch(
  () => props.handleOb,
  (mapCenter) => {
    handleMapCenter(mapCenter);
  },
  { deep: true }
);

let map: any = null; // map实例对象
let mapRenderMode = props.mapRenderMode || "dom";
let mapRenderModeLength = ref(0);
let mapRenderModeLengthMax = 500; //数量超过1000，强制转为 polymer 聚合引擎
const isCanvasMap: boolean = mapRenderMode == "canvas";
let markerArr: any = []; // marker坐标点数字

let markerCanvasGroup: any = null;
//@ts-ignore
let markerClusterGroup = L.markerClusterGroup();
let markerGroup = L.featureGroup();
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

watch(
  () => mapRenderModeLength,
  (mapRenderModeLength) => {
    if (mapRenderModeLength.value > mapRenderModeLengthMax) {
      isIconChange.value = true;
    } else {
      isIconChange.value = false;
    }
  },
  { deep: true }
);

onMounted(() => {
  initMap();

  // createLine(props.lineData);
  handleMapCenter(props.mapCenter);
});

const emits = defineEmits(["clickId", "lineSend"]);
// referLines清除
function clearAllreferLines() {
  type0_Line.forEach((item: any) => {
    map.removeLayer(item);
  });
  type2_Line.forEach((item: any) => {
    map.removeLayer(item);
  });
  type4_Line.forEach((item: any) => {
    map.removeLayer(item);
  });
  type5_Line.forEach((item: any) => {
    map.removeLayer(item);
  });
  type6_Line.forEach((item: any) => {
    map.removeLayer(item);
  });
  type7_Line.forEach((item: any) => {
    map.removeLayer(item);
  });
  type8_Line.forEach((item: any) => {
    map.removeLayer(item);
  });
  type101_Line.forEach((item: any) => {
    map.removeLayer(item);
  });
  type102_Line.forEach((item: any) => {
    map.removeLayer(item);
  });
}
// 删除全部
function deleteAllMarkers() {
  clearAllreferLines();
  polygonArr.forEach((item: any) => {
    map.removeLayer(item);
  });
  markerNameArr.forEach((item: any) => {
    map.removeLayer(item);
  });
  cycleArray.forEach((item: any) => {
    map.removeLayer(item);
  });
  markerNameArr.forEach((item: any) => {
    map.removeLayer(item);
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
        if (mapRenderMode == "canvas") {
          markerCanvasGroup.removeMarker(v, true);
        }
        markerArr.splice(i, 1);
      }
    });
  });
}
function markerAddToMap(markerType: string, marker: any) {
  if (!props.markerDataHidden.includes(markerType)) {
    switch (mapRenderMode) {
      case "canvas":
        markerCanvasGroup.addMarker(marker);
        break;
      case "dom":
        markerGroup.addLayer(marker);
        break;
      case "cluster":
        markerClusterGroup.addLayer(marker);
        break;
    }
  }
}
// 修改地图marker点
function updateMarker(item: any) {
  const currentMarker = markerArr.find((i: any) => i.markerId == item.markerId);
  const currentMarkerIndex = markerArr.findIndex((i: any) => i.markerId == item.markerId);
  if (!currentMarker || !item.markerLng || !item.markerLat) {
    return;
  }
  const position = gcoordLngLat(item.markerLng, item.markerLat);
  currentMarker.setLatLng(position);
  currentMarker.getPopup().setContent(item.markerPopup);

  if (
    currentMarker.markerType != item.markerType &&
    !props.markerDataHidden.includes(item.markerType)
  ) {
    //点的markerType发生变化才更新点的图标
    let icon = createIcon(item);

    if (mapRenderMode == "canvas") {
      //要重新建一个marker，不然地图缩放setIcon点会缩放
      const newMarker = L.marker(position, {
        icon,
        zIndexOffset: item.onlineTcp === 1 ? 1000 : 999,
        riseOnHover: true,
      }).bindPopup(item.markerPopup) as any;
      newMarker.markerId = currentMarker.markerId;
      newMarker.markerType = item.markerType;
      newMarker.onlineTcp = item.onlineTcp;
      newMarker.driveState = item.driveState;
      markerCanvasGroup.removeMarker(currentMarker);
      markerArr.splice(currentMarkerIndex, 1, newMarker);
      props.markerDataHidden.includes(item.markerType)
        ? ""
        : markerCanvasGroup.addMarker(newMarker);
    } else {
      currentMarker.setIcon(icon);
      removeMarker([currentMarker]); //setIcon操作会使点显示出来,先移除再根据筛选框选中情况是否添加marker
      props.markerDataHidden.includes(item.markerType)
        ? ""
        : markerAddToMap(currentMarker.markerType, currentMarker);
    }
  }
  if (
    currentMarker.onlineTcp != item.onlineTcp &&
    !props.markerDataHidden.includes(item.markerType)
  ) {
    //onlineTcp变化
    let icon = createIcon(item);

    if (mapRenderMode == "canvas") {
      //要重新建一个marker，不然地图缩放setIcon点会缩放
      const newMarker = L.marker(position, {
        icon,
        zIndexOffset: item.onlineTcp === 1 ? 1000 : 999,
        riseOnHover: true,
      }).bindPopup(item.markerPopup) as any;
      newMarker.markerId = currentMarker.markerId;
      newMarker.markerType = item.markerType;
      newMarker.onlineTcp = item.onlineTcp;
      newMarker.driveState = item.driveState;
      markerCanvasGroup.removeMarker(currentMarker);
      markerArr.splice(currentMarkerIndex, 1, newMarker);
      props.markerDataHidden.includes(item.markerType)
        ? ""
        : markerCanvasGroup.addMarker(newMarker);
    } else {
      currentMarker.setIcon(icon);
      removeMarker([currentMarker]); //setIcon操作会使点显示出来,先移除再根据筛选框选中情况是否添加marker
      props.markerDataHidden.includes(item.markerType)
        ? ""
        : markerAddToMap(currentMarker.markerType, currentMarker);
    }
  }
}
function changeZoom() {
  // map.setZoom(map.getZoom() + 1, { animate: false });
  // map.setZoom(map.getZoom() - 1, { animate: false });
}
// 修改地图marker显隐藏
function updateMarkerVisible(list: any) {
  let fitlerArr: any;
  if (
    list.includes("online1") &&
    !list.includes("online2") &&
    !list.includes("offline")
  ) {
    fitlerArr = markerArr.filter((j: any) => j.driveState === 0 || j.onlineTcp === 0);
  } else if (
    list.includes("online2") &&
    !list.includes("online1") &&
    !list.includes("offline")
  ) {
    fitlerArr = markerArr.filter((j: any) => j.driveState !== 0 || j.onlineTcp === 0);
  } else if (
    list.includes("offline") &&
    !list.includes("online1") &&
    !list.includes("online2")
  ) {
    fitlerArr = markerArr.filter((j: any) => j.onlineTcp !== 0);
  } else if (
    list.includes("online1") &&
    list.includes("online2") &&
    !list.includes("offline")
  ) {
    fitlerArr = markerArr.filter((j: any) => j.onlineTcp === 0);
  } else if (
    list.includes("online1") &&
    list.includes("offline") &&
    !list.includes("online2")
  ) {
    fitlerArr = markerArr.filter((j: any) => j.driveState === 0);
  } else if (
    list.includes("online2") &&
    list.includes("offline") &&
    !list.includes("online1")
  ) {
    fitlerArr = markerArr.filter((j: any) => j.driveState !== 0 && j.onlineTcp !== 0);
  } else if (
    list.includes("online2") &&
    list.includes("offline") &&
    list.includes("online1")
  ) {
    fitlerArr = [];
  } else {
    fitlerArr = markerArr;
  }
  let includedMarkers = fitlerArr.filter((j: any) => !list.includes(j.markerType));
  TMarkers.value = includedMarkers;
  markerGroup.clearLayers();
  if (mapRenderMode == "dom") {
    includedMarkers.forEach((marker: any) => {
      markerGroup.addLayer(marker);
    });
  } else if (mapRenderMode == "polymer") {
    markerClusterGroup.clearLayers();
    markerClusterGroup.addLayers(includedMarkers);
  } else if (mapRenderMode == "canvas") {
    initCanvasGroup();
    // includedMarkers.length?markerCanvasGroup.addMarkers(includedMarkers.filter((item:any)=>item.markerType != "line")):''
    includedMarkers.length ? markerCanvasGroup.addMarkers(includedMarkers) : "";
    map.setView(map.getCenter()); //缩放也会漂移
  }
}
const TMarkers = ref<any>([]);
// 创建icon图标
function createIcon(item: any) {
  if (item.markerIcon) {
    // const markerIcon = getRelativeIcon(item.markerIcon);
    return L.icon({
      iconUrl: item.markerIcon, // SVG图标的路径
      iconSize: [46, 50], // 图标的大小 [宽度, 高度]
      iconAnchor: [23, 25], // 图标的锚点位置 [水平, 垂直]
      popupAnchor: [-2, -28], // 弹出窗口的锚点位置 [水平, 垂直]
    });
    // return markerIcon;
  }
  if (item.markerTitle) {
    return L.divIcon({
      className: "custom-icon",
      html: `<div style="transform: rotate(${item.markerRotate || 0}deg)">
     ${item.markerTitle}
      </div>`,
      iconSize: [100, 30], // 图标的大小 [宽度, 高度]
      // iconAnchor: [null, null], // 图标的锚点位置 [水平, 垂直]
    });
  }
}
const canvasLabel = new L.CanvasLabel({
  defaultLabelStyle: {
    collisionFlg: false,
    //scale: 1.5,
    zIndex: 10000,
  },
});
const mapInstance = ref<any>();

// 初始化加载地图
function initMap() {
  map = L.map("map", {
    minZoom: 3, //最小缩放值
    maxZoom: 18, //最大缩放值
    // center: props.mapCenter.center, //注意和其他地图经纬度格式区别
    // zoom: props.mapCenter.zoom, //初始缩放值
    zoomControl: false, //是否启用地图缩放控件
    attributionControl: false, //是否启用地图属性控件
    renderer: canvasLabel,
    zoomSnap: 1,
    zIndex: 9999,
  });
  mapInstance.value = map;
  
  // 创建自定义 pane 用于作业线，z-index 高于 markerPane
  map.createPane('referenceLinesPane');
  map.getPane('referenceLinesPane')!.style.zIndex = '650';
  
  markerGroup.addTo(map);
  markerClusterGroup.addTo(map);
  initCanvasGroup();
  mapTileChange();
  // initRanging();
  mapZoomChange();
  map.on("zoomend", handleZoomEnd);
}

function initCanvasGroup() {
  if (map.hasLayer(markerCanvasGroup)) {
    map.removeLayer(markerCanvasGroup);
  }
  markerCanvasGroup = L.canvasIconLayer({}).addTo(map);

  canvasLayerElement = document.getElementsByClassName(
    "leaflet-canvas-icon-layer"
  ) as HTMLCollectionOf<HTMLElement>;
}
// 移动详细视角
function findBoundaries(list: any) {
  if (list.length === 0) {
    // 如果没有选中的边界，恢复所有地块到默认样式
    polygonArr.forEach((polygon: any) => {
      polygon.setStyle({
        fillOpacity: 0.44,
        weight: 1
      });
    });
    return;
  }
  const polytrueData: any = [];
  list.map((inner: any) => {
    let innerList = inner.map((point: any) => {
      let position = gcoordLngLat(point.split(",")[1], point.split(",")[0]);
      return position;
    });
    polytrueData.push(innerList);
  });
  let latLng = polytrueData.map((item: any) => {
    return [item[0], item[1]];
  });
  var bounds = L.latLngBounds(latLng);
  map.fitBounds(bounds);
  
  // 更新地块高亮显示：恢复所有地块到默认样式，然后高亮选中的地块
  polygonArr.forEach((polygon: any) => {
    // 恢复默认样式
    polygon.setStyle({
      fillOpacity: 0.44,
      weight: 1
    });
    
    // 检查是否是选中的地块（通过比较坐标）
    const polygonCoords = polygon.getLatLngs()[0];
    let isSelected = false;
    
    if (polygonCoords && polytrueData.length > 0) {
      const selectedCoords = polytrueData[0];
      // 比较坐标数量
      if (polygonCoords.length === selectedCoords.length) {
        // 简单比较第一个和最后一个坐标点
        const firstMatch = Math.abs(polygonCoords[0].lat - selectedCoords[0][0]) < 0.0001 &&
                          Math.abs(polygonCoords[0].lng - selectedCoords[0][1]) < 0.0001;
        if (firstMatch && polygonCoords.length > 1) {
          const lastIdx = polygonCoords.length - 1;
          const lastMatch = Math.abs(polygonCoords[lastIdx].lat - selectedCoords[lastIdx][0]) < 0.0001 &&
                           Math.abs(polygonCoords[lastIdx].lng - selectedCoords[lastIdx][1]) < 0.0001;
          isSelected = firstMatch && lastMatch;
        } else {
          isSelected = firstMatch;
        }
      }
    }
    
    // 高亮选中的地块
    if (isSelected) {
      polygon.setStyle({
        fillOpacity: 0.7,
        weight: 3
      });
    }
  });
  
  // 延迟刷新地图，确保图层正确渲染
  setTimeout(() => {
    map.invalidateSize();
  }, 100);
}
function createMarker(list: any) {
  if (list.length === 0) {
    return;
  }
  list.forEach((item: any) => {
    item.forEach((it: any) => {
      if (it.obstacles.length) {
        it.obstacles.forEach((marker: any) => {
          let lat: any = gcoordLngLat(marker.split(",")[1], marker.split(",")[0]);
          // 创建一个圆心在[51.505, -0.09]，半径为500米的圆
          var circle = L.circle(lat, {
            radius: 3, // 半径，单位米
            stroke: true, // 是否显示边框
            color: "#FFF", // 边框颜色
            weight: 3, // 边框宽度（像素）
            opacity: 1, // 边框透明度
            fill: true, // 是否填充
            fillColor: "#FFF", // 填充颜色
            fillOpacity: 1, // 填充透明度
            className: "my-circle", // 自定义CSS类名
          }).addTo(map);
          cycleArray.push(circle);
        });
      }
    });
  });
}

function createPolygon2(list: any) {
  polygonArr2.forEach((item: any) => {
    item.remove();
  });
  polygonArr2.length = 0;
  // 双重polylineData数组
  const polytrueData2: any = [];

  // 处理数据格式
  list.map((it: any) => {
    it.forEach((inner: any, index: any) => {
      let innerList = inner.boundaries.map((point: any) => {
        let position = gcoordLngLat(point.split(",")[1], point.split(",")[0]);
        return position;
      });
      polytrueData2.push(innerList);
    });

    return polytrueData2;
  });
  drawPolygon2(polytrueData2);
}

// 创建多面形
function createPolygon(list: any) {
  if (list.length === 0) {
    return;
  }
  polygonArr.forEach((item: any) => {
    item.remove();
  });
  markerNameArr.forEach((item: any) => {
    item.remove();
  });
  polygonArr.length = 0;
  markerNameArr.length = 0;
  // 双重polylineData数组
  const polytrueData: any = [];
  const nameData: any = [];
  const clickIdData: any = [];
  const boundariesData: any = [];
  // 处理数据格式
  list.map((item: any) => {
    item.forEach((it: any) => {
      it.boundaries.forEach((inner: any, index: any) => {
        let innerList = inner.map((point: any) => {
          let position = gcoordLngLat(point.split(",")[1], point.split(",")[0]);
          return position;
        });
        polytrueData.push(innerList);
        nameData.push(it.id);
        clickIdData.push(it.clickId);
        boundariesData.push(it.boundaries);
      });
    });
  });
  drawPolygon(polytrueData, nameData, clickIdData, boundariesData);
}

const handleZoomEnd = () => {
  const currentZoom = map.getZoom();
  markerNameArr.forEach((marker) => {
    if (currentZoom >= targetZoom) {
      // 显示标记
      // marker._icon?.style.setProperty("display", "block", "important");
      map.addLayer(marker);
    } else {
      // 隐藏标记
      map.removeLayer(marker);
    }
  });
};
const drawPolygon2 = (polytrueData: any) => {
  let pickPoints: any = [];
  polytrueData.map((item: any, index: any) => {
    pickPoints.push(item);
    var polygon: any = L.polygon(item, {
      color: "#FFFFFF",
      fillColor: "#FFFFFF",
      fillOpacity: 0.2,
    }).addTo(map);

    polygonArr2.push(polygon);
  });
  map.fitBounds(pickPoints);
};
// 示例：处理坐标的工具函数
const parseCoordinates = (rawCoords) => {
  // 过滤非数组的坐标
  if (!Array.isArray(rawCoords)) return null;

  // 转换每个坐标点为数字，并过滤无效值
  const validCoords = rawCoords
    .map((point) => {
      // 确保坐标点是长度为2的数组
      if (!Array.isArray(point) || point.length !== 2) return null;

      // 转换为数字（处理字符串类型的坐标）
      const lat = Number(point[0]);
      const lng = Number(point[1]);

      // 检查是否为有效数字（排除NaN）
      if (isNaN(lat) || isNaN(lng)) return null;

      return [lat, lng];
    })
    .filter(Boolean); // 过滤null值

  // 确保至少有3个有效点（多边形至少需要3个顶点）
  return validCoords.length >= 3 ? validCoords : null;
};
const drawPolygon = (
  polytrueData: any,
  nameData: any,
  clickIdData: any,
  boundariesData: any
) => {
  let pickPoints: any = [];
  polytrueData.map((item: any, index: any) => {
    pickPoints.push(item);
    const validCoords = parseCoordinates(item);
    if (validCoords) {
      var polygon = L.polygon(item, {
        color: props.colorList[index] as string,
        fillColor: props.colorList[index] as string,
        fillOpacity: 0.44,
      }).addTo(map);
      // 获取多边形中心点
      var center: any = turf.centroid(polygon.toGeoJSON()).geometry.coordinates;
      center = center.reverse(); // Leaflet使用[lat,lng]格式

      // 在中心点添加文本标记
      var marker = L.marker(center, {
        icon: L.divIcon({
          className: "polygon-label",
          html: ` <div class="text-content" style="width:100px; padding: 5px; text-shadow:  m
    -1px -1px 0 #FFFFFF,
     1px -1px 0 #FFFFFF,
    -1px  1px 0 #FFFFFF,
     1px  1px 0 #FFFFFF;">${nameData[index]}</div>`,
          iconSize: [32, 32], // 图标的大小 [宽度, 高度]
        }),
      }).addTo(map);
      if (map.getZoom() < targetZoom) {
        // marker._icon.style.display = "none"; // 隐藏标记图标
        map.removeLayer(marker);
      }
      polygon.on("click", function (e) {
        emits("clickId", index, clickIdData[index], boundariesData[index]);
      });
      polygonArr.push(polygon);
      markerNameArr.push(marker);
    } else {
      console.error(`多边形 ${nameData[index]} 坐标无效:`, item);
    }
  });
  // map.fitBounds(pickPoints);
};
// 创建线
// function createLine(list: any) {
//   if (list.length === 0) {
//     return;
//   }
//   list.forEach((item: any) => {
//     item.forEach((it: any) => {
//       if (it.referenceLines && it.referenceLines.length > 0) {
//         it.referenceLines.forEach((line: any) => {
//           if (line.s72 === 0) {
//             let arr = [
//               gcoordLngLat(line.s94.s73[0].split(",")[1], line.s94.s73[0].split(",")[0]),
//               gcoordLngLat(line.s94.s73[1].split(",")[1], line.s94.s73[1].split(",")[0]),
//             ];

//             let ABline = L.polyline(arr, { color: "red" }).addTo(map);
//             type0_Line.push(ABline);
//           }
//         });
//       }
//     });
//   });

//   // list.forEach((item: any) => {
//   //   let arr: any = [];
//   //   item.forEach((v: any) => {
//   //     arr.push(gcoordLngLat(v[0], v[1]));
//   //   });
//   //   latLng.push(arr);
//   // });

//   // const { color, weight } = props.lineStyle;

//   // polyline = L.polyline(latLng, {
//   //   color,
//   //   weight,
//   // }).addTo(map);
// }

// WGS84转GCJ02（火星坐标系）
const PI = 3.1415926535897932384626;
const a = 6378245.0; // 地球半径
const ee = 0.00669342162296594323; // 扁率
const wgs84ToGcj02 = (lat: any, lng: any) => {
  // 判断是否在国内（不在国内则不转换）
  const outOfChina = (lat: any, lng: any) => {
    return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271;
  };

  if (outOfChina(lat, lng)) {
    return [lat, lng];
  }

  let dLat = transformLat(lng - 105.0, lat - 35.0);
  let dLng = transformLng(lng - 105.0, lat - 35.0);
  const radLat = (lat / 180.0) * PI;
  let magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * PI);
  dLng = (dLng * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * PI);
  const mgLat = lat + dLat;
  const mgLng = lng + dLng;
  return [mgLat, mgLng];
};

// 辅助计算纬度偏差
const transformLat = (x: any, y: any) => {
  let ret =
    -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
  ret += ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(y * PI) + 40.0 * Math.sin((y / 3.0) * PI)) * 2.0) / 3.0;
  ret +=
    ((160.0 * Math.sin((y / 12.0) * PI) + 320 * Math.sin((y * PI) / 30.0)) * 2.0) / 3.0;
  return ret;
};

// 辅助计算经度偏差
const transformLng = (x: any, y: any) => {
  let ret =
    300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
  ret += ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(x * PI) + 40.0 * Math.sin((x / 3.0) * PI)) * 2.0) / 3.0;
  ret +=
    ((150.0 * Math.sin((x / 12.0) * PI) + 300.0 * Math.sin((x / 30.0) * PI)) * 2.0) / 3.0;
  return ret;
};

const handleLine = (line: any) => {
  dialogVisible.value = true;
  console.log(line);
};

window.handleLine = handleLine;

const parseAndTransformCoords = (coordStr: any) => {
  // 先解析为WGS84的[lat, lng]
  const [latStr, lngStr] = coordStr.split(",");
  const wgs84Lat = parseFloat(latStr);
  const wgs84Lng = parseFloat(lngStr);
  if (isNaN(wgs84Lat) || isNaN(wgs84Lng)) return null;

  // 转换为GCJ02坐标（高德地图使用）
  const [gcjLat, gcjLng] = wgs84ToGcj02(wgs84Lat, wgs84Lng);
  return [gcjLat, gcjLng];
};

// 批量转换坐标数组
const parseAndTransformCoordList = (coordStrList: any) => {
  return coordStrList
    .map((coordStr: any) => parseAndTransformCoords(coordStr))
    .filter(Boolean);
};
// 点击事件处理函数（在 Vue 作用域内，可访问 emit）
const handlePopupClick = (e: any) => {
  // 只处理 .popup-btn 的点击
  if (e.target.classList.contains("popup-btn")) {
    // 从 data-line-id 获取 line.id
    const lineId = e.target.getAttribute("data-line-id");
    // 触发 emit 传值
    emits("lineSend", lineId);
  }
};
function drawReferenceLine(line: any) {
  const { s72, s94 } = line;
  console.log(s72);

  const coords = parseAndTransformCoordList(s94.s73);
  if (coords.length === 0) {
    console.warn(`类型 ${s72} 坐标无效`);
    return;
  }
  switch (s72) {
    case 0: // 直线
      if (coords.length >= 2) {
        let ABline = L.polyline(coords, { color: "red", pane: 'referenceLinesPane' }).addTo(map);
        ABline.bindPopup(
          `  <div class="popup-btn"  style='cursor:pointer; color: #1890ff; text-decoration: underline;' data-line-id="${line.id}">下发作业线</div >`
        );
        // 关键：监听弹窗打开事件，绑定点击委托
        ABline.on("popupopen", (e: any) => {
          // 获取弹窗的 DOM 容器（Leaflet 弹窗容器类名为 .leaflet-popup-content-wrapper）
          const popupContainer = e.popup._contentNode.parentNode;

          // 给弹窗容器绑定点击事件（委托给 .popup-btn）
          popupContainer.addEventListener("click", handlePopupClick);
        });

        // 监听弹窗关闭事件，移除事件绑定（避免重复触发）
        ABline.on("popupclose", (e: any) => {
          const popupContainer = e.popup._contentNode.parentNode;
          popupContainer.removeEventListener("click", handlePopupClick);
        });

        type0_Line.push(ABline);
      }
      break;
    case 2: // 2: 自动掉头（多段线）
      let ABline2 = L.polyline(coords, {
        color: "green",
        weight: 2,
        dashArray: "5, 5",
        pane: 'referenceLinesPane'
      }).addTo(map);
      // 可根据s81/s82等参数添加转向辅助线（示例：基准线AB标黄）
      ABline2.bindPopup(
        `  <div class="popup-btn"  style='cursor:pointer; color: #1890ff; text-decoration: underline;' data-line-id="${line.id}">下发作业线</div >`
      );
      // 关键：监听弹窗打开事件，绑定点击委托
      ABline2.on("popupopen", (e: any) => {
        // 获取弹窗的 DOM 容器（Leaflet 弹窗容器类名为 .leaflet-popup-content-wrapper）
        const popupContainer = e.popup._contentNode.parentNode;

        // 给弹窗容器绑定点击事件（委托给 .popup-btn）
        popupContainer.addEventListener("click", handlePopupClick);
      });

      // 监听弹窗关闭事件，移除事件绑定（避免重复触发）
      ABline2.on("popupclose", (e: any) => {
        const popupContainer = e.popup._contentNode.parentNode;
        popupContainer.removeEventListener("click", handlePopupClick);
      });

      // 点击事件处理函数（在 Vue 作用域内，可访问 emit）
      type2_Line.push(ABline2);
      break;
    case 4: // 4: 同心圆（单点+半径）
      if (coords.length === 1) {
        const center = coords[0];
        const radius = s94.s83; // 半径（米）
        // Leaflet的圆默认单位是米，需用L.circle
        let ABline4 = L.circle(center, { radius, color: "blue", fill: false, pane: 'referenceLinesPane' }).addTo(map);
        ABline4.bindPopup(
          `  <div class="popup-btn"  style='cursor:pointer; color: #1890ff; text-decoration: underline;' data-line-id="${line.id}">下发作业线</div >`
        );
        // 关键：监听弹窗打开事件，绑定点击委托
        ABline4.on("popupopen", (e: any) => {
          // 获取弹窗的 DOM 容器（Leaflet 弹窗容器类名为 .leaflet-popup-content-wrapper）
          const popupContainer = e.popup._contentNode.parentNode;

          // 给弹窗容器绑定点击事件（委托给 .popup-btn）
          popupContainer.addEventListener("click", handlePopupClick);
        });

        // 监听弹窗关闭事件，移除事件绑定（避免重复触发）
        ABline4.on("popupclose", (e: any) => {
          const popupContainer = e.popup._contentNode.parentNode;
          popupContainer.removeEventListener("click", handlePopupClick);
        });

        // 点击事件处理函数（在 Vue 作用域内，可访问 emit）

        type4_Line.push(ABline4);
      }
      break;

    case 5: // 5: 等距曲线（多段线）
      let ABline5 = L.polyline(coords, { color: "purple", weight: 2, pane: 'referenceLinesPane' }).addTo(map);
      ABline5.bindPopup(
        `  <div class="popup-btn"  style='cursor:pointer; color: #1890ff; text-decoration: underline;' data-line-id="${line.id}">下发作业线</div >`
      );
      // 关键：监听弹窗打开事件，绑定点击委托
      ABline5.on("popupopen", (e: any) => {
        // 获取弹窗的 DOM 容器（Leaflet 弹窗容器类名为 .leaflet-popup-content-wrapper）
        const popupContainer = e.popup._contentNode.parentNode;

        // 给弹窗容器绑定点击事件（委托给 .popup-btn）
        popupContainer.addEventListener("click", handlePopupClick);
      });

      // 监听弹窗关闭事件，移除事件绑定（避免重复触发）
      ABline5.on("popupclose", (e: any) => {
        const popupContainer = e.popup._contentNode.parentNode;
        popupContainer.removeEventListener("click", handlePopupClick);
      });

      // 点击事件处理函数（在 Vue 作用域内，可访问 emit）

      type5_Line.push(ABline5);
      break;

    case 6: // 6: 自由轨迹（多段线）
      let ABline6 = L.polyline(coords, { color: "orange", weight: 2, pane: 'referenceLinesPane' }).addTo(map);

      ABline6.bindPopup(
        `  <div class="popup-btn"  style='cursor:pointer; color: #1890ff; text-decoration: underline;' data-line-id="${line.id}">下发作业线</div >`
      );
      // 关键：监听弹窗打开事件，绑定点击委托
      ABline6.on("popupopen", (e: any) => {
        // 获取弹窗的 DOM 容器（Leaflet 弹窗容器类名为 .leaflet-popup-content-wrapper）
        const popupContainer = e.popup._contentNode.parentNode;

        // 给弹窗容器绑定点击事件（委托给 .popup-btn）
        popupContainer.addEventListener("click", handlePopupClick);
      });

      // 监听弹窗关闭事件，移除事件绑定（避免重复触发）
      ABline6.on("popupclose", (e: any) => {
        const popupContainer = e.popup._contentNode.parentNode;
        popupContainer.removeEventListener("click", handlePopupClick);
      });
      type6_Line.push(ABline6);
      break;

    case 7: // 7: 三点定圆
      {
        const list = s94 && Array.isArray(s94.s73) ? s94.s73 : [];
        if (list.length < 1) {
          console.warn(`三点定圆坐标无效`);
          break;
        }
        const centerStr = list[list.length - 1];
        const parts = typeof centerStr === "string" ? centerStr.split(",") : [];
        if (parts.length !== 2) {
          console.warn(`三点定圆中心点格式无效: ${centerStr}`);
          break;
        }
        const a = Number(parts[0]);
        const b = Number(parts[1]);
        if (isNaN(a) || isNaN(b)) {
          console.warn(`三点定圆中心点无法解析: ${centerStr}`);
          break;
        }
        let lat: number, lng: number;
        if (Math.abs(a) <= 90 && Math.abs(b) <= 180) {
          lat = a;
          lng = b;
        } else if (Math.abs(b) <= 90 && Math.abs(a) <= 180) {
          lat = b;
          lng = a;
        } else {
          console.warn(`三点定圆中心点范围异常: ${centerStr}`);
          break;
        }
        const [gcjLat, gcjLng] = wgs84ToGcj02(lat, lng);
        const center = [gcjLat, gcjLng];
        const radius = Number(s94.s83);
        if (!radius || isNaN(radius)) {
          console.warn(`三点定圆半径无效: s83=${s94.s83}`);
          break;
        }

        let ABline7 = L.circle(center as any, {
          radius,
          color: "cyan",
          fill: false,
          pane: 'referenceLinesPane'
        }).addTo(map);
        ABline7.bindPopup(
          `  <div class="popup-btn"  style='cursor:pointer; color: #1890ff; text-decoration: underline;' data-line-id="${line.id}">下发作业线</div >`
        );
        ABline7.on("popupopen", (e: any) => {
          const popupContainer = e.popup._contentNode.parentNode;
          popupContainer.addEventListener("click", handlePopupClick);
        });
        ABline7.on("popupclose", (e: any) => {
          const popupContainer = e.popup._contentNode.parentNode;
          popupContainer.removeEventListener("click", handlePopupClick);
        });
        map.fitBounds(ABline7.getBounds());
        type7_Line.push(ABline7);
      }
      break;

    case 8: // 8: 对角耙（封闭多边形）
      if (coords.length >= 3) {
        let ABline8 = L.polygon(coords, { color: "brown", fill: false, weight: 2, pane: 'referenceLinesPane' }).addTo(
          map
        );
        ABline8.bindPopup(
          `  <div class="popup-btn"  style='cursor:pointer; color: #1890ff; text-decoration: underline;' data-line-id="${line.id}">下发作业线</div >`
        );
        // 关键：监听弹窗打开事件，绑定点击委托
        ABline8.on("popupopen", (e: any) => {
          // 获取弹窗的 DOM 容器（Leaflet 弹窗容器类名为 .leaflet-popup-content-wrapper）
          const popupContainer = e.popup._contentNode.parentNode;

          // 给弹窗容器绑定点击事件（委托给 .popup-btn）
          popupContainer.addEventListener("click", handlePopupClick);
        });

        // 监听弹窗关闭事件，移除事件绑定（避免重复触发）
        ABline8.on("popupclose", (e: any) => {
          const popupContainer = e.popup._contentNode.parentNode;
          popupContainer.removeEventListener("click", handlePopupClick);
        });
        type8_Line.push(ABline8);
      }
      break;

    case -101: // -101: 单点+航向（标记+箭头）
      if (coords.length >= 1) {
        // 1. 航向角：由第一个点指向第二个点，计算地理方位角（Leaflet旋转用角度）
        let headingDegree: number;
        const headingFromApi = Number(s94.s77);
        if (!isNaN(headingFromApi)) {
          headingDegree = ((headingFromApi % 360) + 360) % 360;
        } else if (coords.length >= 2) {
          const [lat1, lng1] = coords[0];
          const [lat2, lng2] = coords[1];
          const toRad = (deg: number) => (deg * Math.PI) / 180;
          const toDeg = (rad: number) => (rad * 180) / Math.PI;
          const φ1 = toRad(lat1);
          const φ2 = toRad(lat2);
          const Δλ = toRad(lng2 - lng1);
          const y = Math.sin(Δλ) * Math.cos(φ2);
          const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
          headingDegree = (toDeg(Math.atan2(y, x)) + 360) % 360;
        } else {
          headingDegree = 0;
        }

        // 2. 矢量箭头（多边形绘制，按米为单位控制尺寸）
        const toRadArrow = (deg: number) => (deg * Math.PI) / 180;
        const toDegArrow = (rad: number) => (rad * 180) / Math.PI;
        const destinationArrow = (lat: number, lng: number, distM: number, bearingDeg: number) => {
          const R = 6371000;
          const br = toRadArrow(bearingDeg);
          const φ1 = toRadArrow(lat);
          const λ1 = toRadArrow(lng);
          const δ = distM / R;
          const sinφ1 = Math.sin(φ1);
          const cosφ1 = Math.cos(φ1);
          const sinδ = Math.sin(δ);
          const cosδ = Math.cos(δ);
          const sinφ2 = sinφ1 * cosδ + cosφ1 * sinδ * Math.cos(br);
          const φ2 = Math.asin(sinφ2);
          const y = Math.sin(br) * sinδ * cosφ1;
          const x = cosδ - sinφ1 * sinφ2;
          const λ2 = λ1 + Math.atan2(y, x);
          return [toDegArrow(φ2), ((toDegArrow(λ2) + 540) % 360) - 180] as [number, number];
        };

        let ABline101Line: any;
        if (coords.length >= 2) {
          ABline101Line = L.polyline([coords[0], coords[1]], { color: "lime", weight: 2, pane: 'referenceLinesPane' }).addTo(map);
          // 为线条也添加相同的弹窗和事件
          ABline101Line.bindPopup(
            `  <div class="popup-btn"  style='cursor:pointer; color: #1890ff; text-decoration: underline;' data-line-id="${line.id}">下发作业线</div >`
          );
          ABline101Line.on("popupopen", (e: any) => {
            const popupContainer = e.popup._contentNode.parentNode;
            popupContainer.addEventListener("click", handlePopupClick);
          });
          ABline101Line.on("popupclose", (e: any) => {
            const popupContainer = e.popup._contentNode.parentNode;
            popupContainer.removeEventListener("click", handlePopupClick);
          });
        }

        const anchor = coords.length >= 2 ? coords[1] : coords[0];
        const arrowLengthM = 20;
        const arrowWidthM = 12;
        const backM = 6;
        const baseCenter = destinationArrow(anchor[0], anchor[1], backM, (headingDegree + 180) % 360);
        const tip = destinationArrow(anchor[0], anchor[1], arrowLengthM, headingDegree);
        const baseLeft = destinationArrow(baseCenter[0], baseCenter[1], arrowWidthM / 2, headingDegree - 90);
        const baseRight = destinationArrow(baseCenter[0], baseCenter[1], arrowWidthM / 2, headingDegree + 90);
        let ABline101 = L.polygon([baseLeft, tip, baseRight], {
          color: "lime",
          weight: 2,
          fill: true,
          fillOpacity: 0.8,
          pane: 'referenceLinesPane'
        }).addTo(map);
        ABline101.bindPopup(
          `  <div class="popup-btn"  style='cursor:pointer; color: #1890ff; text-decoration: underline;' data-line-id="${line.id}">下发作业线</div >`
        );
        ABline101.on("popupopen", (e: any) => {
          const popupContainer = e.popup._contentNode.parentNode;
          popupContainer.addEventListener("click", handlePopupClick);
        });
        ABline101.on("popupclose", (e: any) => {
          const popupContainer = e.popup._contentNode.parentNode;
          popupContainer.removeEventListener("click", handlePopupClick);
        });
        if (coords.length >= 2) {
          type101_Line.push(ABline101Line);
          map.fitBounds([coords[0], coords[1]]);
        }
        type101_Line.push(ABline101);
      }
      break;

    case -102: // -102: 循环模式（多段线+转向）
      let ABline102 = L.polyline(coords, { color: "magenta", weight: 2 }).addTo(map);
      // 可根据s82方向添加转向箭头（示例）
      ABline102.bindPopup(
        `  <div  style='cursor:pointer'   onclick='handleLine(${line.id})'>下发作业线</div >`
      );
      type102_Line.push(ABline102);
      break;

    default:
      console.warn(`未处理的类型: ${s72}`);
  }
}

function createLine(list: any) {
  clearAllreferLines();
  if (list.length === 0) {
    return;
  }
  list.forEach((item: any) => {
    if (item.referenceLines && item.referenceLines.length > 0) {
      item.referenceLines.forEach((line: any) => {
        drawReferenceLine(line);
      });
    }
  });
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
      map.fitBounds(bounds);
      props.mapCenter.zoom ? map.setZoom(props.mapCenter.zoom) : "";
    } else {
      map.setView(defaultMapCenter, defaultMapZoom);
    }
    return;
  }
  if (data.markerId) {
    const findMarker = markerArr.find((item: any) => item.markerId == data.markerId);
    findMarker.openPopup();
    map.fitBounds([findMarker._latlng]);
    map.setZoom(map.getZoom() - 2);
  } else if (data.center && data.center.length > 0) {
    let latLng: any = [];
    latLng = data.center.map((item: any) => {
      return gcoordLngLat(item[0], item[1]);
    });
    var bounds = L.latLngBounds(latLng);
    map.fitBounds(bounds);
    data.zoom ? map.setZoom(data.zoom) : "";
  } else {
    map.setView(defaultMapCenter, defaultMapZoom);
  }
}
let currentLayers: any = [];
// 设置图商
function changeTileLayer(mapName = "GaoDe", mapType = "Satellite") {
  if (!map) {
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
    let layer = L.tileLayer(mapUrl[key], options).addTo(map);
    currentLayers.push(layer);
  }
}
// 处理经纬度偏差
// function gcoordLngLat(markerLng: number, markerLat: number) {
//   const [lat, lng] = gcoord.transform([markerLat, markerLng], gcoord.WGS84, gcoord.GCJ02);
//   return [lng, lat];
// }
let canvasLayerElement: any = [];
const setRangeStyle = (style: any) => {
  const mapEelement = document.getElementById("map");
  if (mapEelement) {
    mapEelement.style.cursor = style;
  }

  if (isCanvasMap) {
    canvasLayerElement[0].style.cursor = style;
  }
};
const mapClick = (event: any) => {
  if (pickupMode) {
    let icon = L.icon({
      iconUrl: fixed_icon, // SVG图标的路径
      iconSize: [32, 32], // 图标的大小 [宽度, 高度]
      iconAnchor: [16, 32], // 图标的锚点位置 [水平, 垂直]
      popupAnchor: [-2, -28], // 弹出窗口的锚点位置 [水平, 垂直]
    });
    let point = event.latlng;
    pickedPoints.push(point);
    let marker = L.marker(point, { icon, zIndexOffset: 999 }).addTo(map);
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
        setRangeStyle("grab");
        map.off("click", mapClick);
      } catch (err) {
        console.log(err);
      }
      return;
    }
  }
};
// 地图测距
function mapRanging() {
  try {
    // @ts-ignore
    setRangeStyle("crosshair");
    map.on("click", mapClick);
  } catch (err) {
    console.log(err);
  }
  pickupMode = true; //开启拾取模式
}
const currentZoom = ref<number>(defaultMapZoom);
const isIconChange = ref(false);
const iconChangeLimit = computed<boolean>(() => {
  return currentZoom.value >= 7;
});
function getRelativeIcon(iconUrl: any) {
  if (mapRenderModeLength.value > mapRenderModeLengthMax) {
    return L.icon({
      iconUrl: iconUrl, // SVG图标的路径
      iconSize: iconChangeLimit.value ? [26, 28] : [8, 8], // 图标的大小 [宽度, 高度]
      iconAnchor: iconChangeLimit.value ? [13, 14] : [4, 4], // 图标的锚点位置 [水平, 垂直]
      popupAnchor: iconChangeLimit.value ? [0, -15] : [0, -4],
    });
  } else {
    return L.icon({
      iconUrl: iconUrl, // SVG图标的路径
      iconSize: [26, 28], // 图标的大小 [宽度, 高度]
      iconAnchor: [13, 14], // 图标的锚点位置 [水平, 垂直]
      popupAnchor: [0, -15],
    });
  }
}
watch(
  () => iconChangeLimit.value,
  (_value) => {
    if (isIconChange.value) {
      changeMarkerIcon();
    }
  }
);
function createMarkerIcon(item: any) {
  const { markerType, driveState, onlineTcp } = item;
  let icon: string = "";
  if (onlineTcp == 0) {
    icon = AG360_offline;
  } else {
    icon = driveState == 0 ? AG360_warn : AG360;
  }

  return icon;
}
function createMarkerIconSmall(item: any) {
  const { markerType, driveState, onlineTcp } = item;

  let icon: string = "";
  if (onlineTcp == 0) {
    icon = gray;
  } else {
    icon = driveState == 0 ? yellow : green;
  }

  return icon;
}
function changeMarkerIcon() {
  initCanvasGroup();
  const newMarkers: any = [];
  if (iconChangeLimit.value) {
    //显示大图标
    markerArr.forEach((marker: any, index: number) => {
      // if(!markerTypeIcon[marker.markerType]){return}
      const normalIcon = getRelativeIcon(createMarkerIcon(marker));
      const newMarker = L.marker(marker.getLatLng(), {
        icon: normalIcon,
        zIndexOffset: marker.onlineTcp === 1 ? 1000 : 999,
        riseOnHover: true,
      }).bindPopup(marker.getPopup()) as any;
      newMarker.markerId = marker.markerId;
      newMarker.markerType = marker.markerType;
      newMarker.driveState = marker.driveState;
      newMarker.onlineTcp = marker.onlineTcp;
      newMarkers.push(newMarker);
      markerArr.splice(index, 1, newMarker);
    });
  } else {
    //显示小图标
    markerArr.forEach((marker: any, index: number) => {
      // if(!markerTypeIconSmall[marker.markerType]){return}
      const smallIcon = getRelativeIcon(createMarkerIconSmall(marker));
      const newMarker = L.marker(marker.getLatLng(), {
        icon: smallIcon,
        zIndexOffset: marker.onlineTcp === 1 ? 1000 : 999,
        riseOnHover: true,
      }).bindPopup(marker.getPopup()) as any;
      newMarker.markerId = marker.markerId;
      newMarker.markerType = marker.markerType;
      newMarker.driveState = marker.driveState;
      newMarker.onlineTcp = marker.onlineTcp;
      newMarkers.push(newMarker);
      markerArr.splice(index, 1, newMarker);
    });
  }
  if (newMarkers.length) {
    newMarkers.forEach((v: any) => {
      markerAddToMap(v.markerType, v);
    });
  }

  map.setView(map.getCenter());
  setTimeout(() => {
    updateMarkerVisible(markerDataHiddenNow.value);
  }, 1);
}
const currentView = ref<any[]>([]);
// 地图缩放处理事件
function mapZoomChange() {
  if (isCanvasMap) {
    map.on("mouseup", () => {
      //解决地图移动时，其他图层和canvas不同步
      //点击地图时会触发，如果是测距点击地图则不changeZoom
      !pickupMode ? changeZoom() : (currentView.value = getMapView(map));
    });
  }

  map.on("zoomend", function () {
    currentView.value = getMapView(map);
    currentZoom.value = map.getZoom();
    //动态设置地图标注字体大小
    document.documentElement.style.setProperty(
      "--map-font-size",
      `${mapFontSize.value}px`
    );
    const zoom = map.getZoom();
    const baseSize = 16; // 基准字体大小(在zoom=10时)
    const currentSize = baseSize * Math.pow(1.0, zoom - 10); // 1.2为缩放因子

    // 更新所有可缩放文字
    document.querySelectorAll(".text-content").forEach((el: any) => {
      el.style.fontSize = `${currentSize}px`;
    });
  });
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
  pickedPoints.length = 0;
  try {
    setRangeStyle("grab");
    map.off("click", mapClick);
  } catch (err) {
    console.log(err);
  }
}
defineExpose({
  handleMapCenter,
  mapTileChange,
  iconChangeLimit,
  isIconChange,
  deleteAllMarkers,
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

#map {
  height: 100%;
}
.map_utils {
  background: url("@/assets/monitoring/inputBack.png") no-repeat center center;
  background-size: 105% 105%;

  border: 1px solid #fff;
  border-radius: 5px;
  padding: 6px 10px;
  color: #fff;
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
  right: 10px;
  z-index: 999;
  display: flex;
  .map_utils_item {
    margin-right: 6px;
  }
}

:deep(.leaflet-popup) {
  color: white;
  .leaflet-popup-content-wrapper {
    // background: url("@/assets/monitoring/Union@.png");
    // background-size: contain;
    // background-size: 100% 103%;
    // color: var(--color-scheme);
    width: 100px;
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

/* 关键：通过深度选择器修改弹窗内文字颜色 */
.custom-dialog {
  /* 弹窗容器背景色（确保与文字对比明显） */
  background-color: #fff;
  :deep(.el-select__wrapper) {
    background-color: transparent !important;
    box-shadow: black !important;
    color: black;
  }
  :deep(.el-select__placeholder) {
    color: black !important;
  }
}

/* 弹窗标题文字颜色 */
:deep(.custom-dialog .el-dialog__title) {
  color: #333 !important; /* 强制黑色 */
}

/* 弹窗内容区文字颜色（包括下拉框、提示文字等） */
:deep(.custom-dialog .el-dialog__body) {
  color: #333 !important;
}

/* 下拉框选项文字颜色 */
:deep(.custom-dialog .el-select-dropdown .el-option) {
  color: #333 !important;
}

/* 按钮文字颜色 */
:deep(.custom-dialog .el-button) {
  color: #333 !important;
}

/* 确认按钮（primary类型）文字颜色（通常为白色，按需调整） */
:deep(.custom-dialog .el-button--primary) {
  color: #fff !important;
}
.text-content {
  color: #000000; /* 黑色字体 */
}
</style>
