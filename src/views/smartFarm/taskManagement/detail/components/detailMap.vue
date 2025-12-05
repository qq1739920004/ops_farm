<template>
  <div class="SinoMap_component">
    <div id="map" ref="mapContainer"></div>
    <div class="choose_area">
      <div class="my-2 ml-4"></div>
      <el-radio-group v-model="radio2" @change="changeRadio">
        <el-radio :label="1">{{ t("job.lines") }}</el-radio>
        <el-radio :label="2">{{ t("job.point") }}</el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mapTileLayers } from "./utils/mapTileLayers";
import { ref, reactive, onMounted, watch, computed, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import fixed_icon from "./assets/fixed.png";
import AG360 from "@/assets/icons/AG360.svg";
import AG360_warn from "@/assets/icons/AG360_warn.svg";
import AG360_offline from "@/assets/icons/AG360_offline.svg";
import green from "@/assets/monitoring/green.svg";
import yellow from "@/assets/monitoring/yellow.svg";
import gray from "@/assets/monitoring/gray.svg";
import { gcoordLngLat, getMapView } from "sino-tool-v3";
import st from "@/assets/common/markerSt.png";
import ed from "@/assets/common/markerEd.png";
const mapContainer = ref(null);
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
  ggaData: {
    type: Array,
    default: [],
  },
});
let pickupMode: boolean = false; // 是否地图拾取模式
let pickedPoints: any = [];
let rangingArray: any = reactive([]);
let ABlineArray: any = [];
let markerArray: any = [];
let polygonArr: any = [];
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
  }
);
watch(
  () => props.ggaData,

  (ggaData) => {
    if (ggaData.length > 0) {
      handleGGaData(ggaData);
    }
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
function drawPoint(gga: any, position: any) {
  if (gga.quality === 4) {
    let circle = L.circle(position, {
      radius: 1,
      color: "#00FF00",
      fillOpacity: 1,
    }).addTo(map);
    cycleArray.push(circle);
  } else if (gga.quality === 15) {
    let circle = L.circle(position, {
      radius: 1,
      color: "#3F48CC",
      fillOpacity: 1,
    }).addTo(map);
    cycleArray.push(circle);
  } else {
    let circle = L.circle(position, {
      radius: 1,
      color: "#ED1C24",
      fillOpacity: 1,
    }).addTo(map);
    cycleArray.push(circle);
  }
}
function drawline(position: any, speed: any, dataPoints: any) {
  // 标准：米/像素 = 156543.03392 * cos(lat) / 2^zoom
  const getMetersPerPixel = (zoom: number, latitude: number) => {
    return 156543.03392 * Math.cos(latitude * Math.PI / 180) / Math.pow(2, zoom);
  };

  const currentZoom = map.getZoom();
  
  // 调试：显示当前zoom级别
  console.log(`当前zoom=${currentZoom}`);
  
  for (let i = 0; i < position.length - 1; i++) {
    // 使用后一端点的线宽（优先），无则回退前一端点，最后默认3m
    const nextWidth = dataPoints[i + 1]?.lineWidth;
    const prevWidth = dataPoints[i]?.lineWidth;
    const lineWidthInMeters = (nextWidth ?? prevWidth ?? 1);

    // 调试：输出前5条线段的数据
    if (i < 5) {
      console.log(`线段${i}: 前点lineWidth=${prevWidth}, 后点lineWidth=${nextWidth}, 使用=${lineWidthInMeters}m`);
    }

    // 计算线段中点纬度用于米/像素换算
    const midLatitude = (position[i][0] + position[i + 1][0]) / 2;
    const mpp = getMetersPerPixel(currentZoom, midLatitude);

    // 米 -> 像素；降低最小像素限制到0.5px，让不同宽度能显示出差异
    const lineWidthInPixels = Math.max(0.5, lineWidthInMeters / mpp);
    
    if (i < 5) {
      console.log(`  -> mpp=${mpp.toFixed(4)}, 原始像素=${(lineWidthInMeters / mpp).toFixed(2)}, 最终像素=${lineWidthInPixels.toFixed(2)}px`);
    }

    if (speed[i] <= 30) {
      let line = L.polyline([position[i], position[i + 1]], {
        color: "#5EFF7B",
        weight: lineWidthInPixels,
      }).addTo(map);
      ABlineArray.push(line);
    } else {
      let line = L.polyline([position[i], position[i + 1]], {
        color: "#FF54AC",
        weight: lineWidthInPixels,
      }).addTo(map);
      ABlineArray.push(line);
    }
  }
}
function parseGPGGA(gpggaStr: any) {
  try {
    // 移除校验和部分
    const mainPart = gpggaStr.split("*")[0];
    const fields = mainPart.split(",");

    if (fields[0] !== "$GPGGA") {
      console.warn("不是有效的 GPGGA 字符串");
      return null;
    }

    // 解析纬度
    const rawLat = fields[2];
    const latDir = fields[3];
    const latDeg = parseFloat(rawLat.substring(0, 2));
    const latMin = parseFloat(rawLat.substring(2));
    const latitude = (latDeg + latMin / 60) * (latDir === "N" ? 1 : -1);

    // 解析经度
    const rawLon = fields[4];
    const lonDir = fields[5];
    const lonDeg = parseFloat(rawLon.substring(0, 3));
    const lonMin = parseFloat(rawLon.substring(3));
    const longitude = (lonDeg + lonMin / 60) * (lonDir === "E" ? 1 : -1);

    return {
      gpggaStr, // 保存原始字符串
      latitude,
      longitude,
      quality: parseInt(fields[6]),
      numSats: parseInt(fields[7]),
      hdop: parseFloat(fields[8]),
      altitude: parseFloat(fields[9]),
      altUnit: fields[10],
    };
  } catch (error) {
    console.error("GPGGA 解析错误:", error);
    return null;
  }
}
function handleGGaData(data: any) {
  // const date = data.slice(0, 100);

  const positionList = data.map((item: any) => {
    return gcoordLngLat(item.posY, item.posX);
  });
  let iconSt = L.icon({
    iconUrl: st,
    iconAnchor: [16, 32],
  });
  let iconEd = L.icon({
    iconUrl: ed,
    iconAnchor: [16, 32],
  });
  let marker = L.marker(positionList[0], { icon: iconSt }).addTo(map);
  let marker1 = L.marker(positionList[positionList.length - 1], { icon: iconEd }).addTo(
    map
  );
  markerArray.push(marker, marker1);
  const speedList = data.map((item: any) => {
    return item.speed;
  });
  if (radio2.value === 2) {
    data.forEach((item: any) => {
      // const gga: any = parseGPGGA(item.deviceGGA);
      const position = gcoordLngLat(item.posY, item.posX);

      drawPoint(item.solStat, position);
    });
  } else {
    drawline(positionList, speedList, data);
  }

  var bounds = L.latLngBounds(positionList);
  map.fitBounds(bounds);
  map.setView(map.getCenter());
}
const radio2 = ref(1);
const clearMarkers = () => {
  cycleArray.forEach((item: any) => {
    map.removeLayer(item);
  });
  ABlineArray.forEach((item: any) => {
    map.removeLayer(item);
  });
  markerArray.forEach((item: any) => {
    map.removeLayer(item);
  });
};
const emits = defineEmits(["radio"]);
const changeRadio = () => {
  clearMarkers();
  handleGGaData(props.ggaData);
  emits("radio", radio2.value);
};
onMounted(() => {
  initMap();

  // createLine(props.lineData);
  handleMapCenter(props.mapCenter);
});
onBeforeUnmount(() => {
  if (map) {
    map.remove();
  }
});
// 删除全部
function deleteAllMarkers() {
  ABlineArray.forEach((item: any) => {
    map.removeLayer(item);
  });
  polygonArr.forEach((item: any) => {
    map.removeLayer(item);
  });
  cycleArray.forEach((item: any) => {
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
      iconSize: [40, 10], // 图标的大小 [宽度, 高度]
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
  if (mapContainer.value) {
    map = L.map(mapContainer.value, {
      minZoom: 3, //最小缩放值
      maxZoom: 22, //最大缩放值
      // center: props.mapCenter.center, //注意和其他地图经纬度格式区别
      // zoom: props.mapCenter.zoom, //初始缩放值
      zoomControl: false, //是否启用地图缩放控件
      attributionControl: false, //是否启用地图属性控件
      renderer: canvasLabel,
      zoomSnap: 1,
      zIndex: 9999,
      // scrollWheelZoom: false, // 禁用鼠标滚轮缩放
      // doubleClickZoom: false, // 禁用双击缩放
      // touchZoom: false, // 禁用触摸缩放
      // boxZoom: false, // 禁用框选缩放
      // keyboard: false, // 禁用键盘快捷键缩放
      // dragging: false,
    });
  }

  mapInstance.value = map;
  markerGroup.addTo(map);
  markerClusterGroup.addTo(map);
  initCanvasGroup();
  mapTileChange();
  // initRanging();
  mapZoomChange();
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
// 创建多面形
function createPolygon(list: any) {
  if (list.length === 0) {
    return;
  }
  polygonArr.forEach((item: any) => {
    item.remove();
  });
  polygonArr.length = 0;
  // 双重polylineData数组
  const polytrueData: any = [];
  // 处理数据格式
  list.map((item: any) => {
    item.forEach((it: any) => {
      it.boundaries.forEach((inner: any, index: any) => {
        let innerList = inner.map((point: any) => {
          let position = gcoordLngLat(point.split(",")[1], point.split(",")[0]);
          return position;
        });
        polytrueData.push(innerList);
      });
    });
    return polytrueData;
  });
  drawPolygon(polytrueData);
}
const drawPolygon = (polytrueData: any) => {
  let pickPoints: any = [];
  polytrueData.map((item: any) => {
    pickPoints.push(item);
    var polygon = L.polygon(item, {
      color: "#83FFA4",
      fillColor: "#4CB04F",
      fillOpacity: 0.44,
    }).addTo(map);
    polygonArr.push(polygon);
  });
  map.fitBounds(pickPoints);
};
// 创建线
function createLine(list: any) {
  if (list.length === 0) {
    return;
  }
  list.forEach((item: any) => {
    item.forEach((it: any) => {
      if (it.referenceLines.length) {
        it.referenceLines.forEach((line: any) => {
          if (line.s72 === 0) {
            let arr = [
              gcoordLngLat(line.s94.s73[0].split(",")[1], line.s94.s73[0].split(",")[0]),
              gcoordLngLat(line.s94.s73[1].split(",")[1], line.s94.s73[1].split(",")[0]),
            ];

            let ABline = L.polyline(arr, { color: "red" }).addTo(map);
            ABlineArray.push(ABline);
          }
        });
      }
    });
  });

  // list.forEach((item: any) => {
  //   let arr: any = [];
  //   item.forEach((v: any) => {
  //     arr.push(gcoordLngLat(v[0], v[1]));
  //   });
  //   latLng.push(arr);
  // });

  // const { color, weight } = props.lineStyle;

  // polyline = L.polyline(latLng, {
  //   color,
  //   weight,
  // }).addTo(map);
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
.choose_area {
  position: absolute;
  left: 10px;
  top: 10px;
  margin-right: 10px;
  height: 32px;
  align-items: center;
  display: flex;
  background: url("@/assets/monitoring/inputBack.png") no-repeat center center;
  background-size: 105% 105%;
  z-index: 9999;
  border: 1px solid #fff;
  border-radius: 5px;
  padding: 6px 10px;
  color: #fff;
  :deep(.el-radio) {
    color: white;
  }
}
</style>
