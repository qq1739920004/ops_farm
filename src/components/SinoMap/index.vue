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
import gcoord from "gcoord";
// @ts-ignore
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import "leaflet.markercluster";
// import "leaflet.markercluster/dist/MarkerCluster.css";
// import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { mapTileLayers } from "./utils/mapTileLayers";
import { ref, reactive, onMounted, watch, computed } from "vue";
import SvgIcon from "@/components/SvgIcon/index.vue";
import { useI18n } from "vue-i18n";
import fixed_icon from "./assets/fixed.png";
import AG360 from "@/assets/icons/AG360.svg";
import AG360_warn from "@/assets/icons/AG360_warn.svg";
import AG360_offline from "@/assets/icons/AG360_offline.svg";
import green from "@/assets/monitoring/green.svg";
import yellow from "@/assets/monitoring/yellow.svg";
import gray from "@/assets/monitoring/gray.svg";
// import AG302 from "@/assets/icons/AG302.svg";
// import AG302_warn from "@/assets/icons/AG302_warn.svg";
// import AG501 from "@/assets/icons/AG501.svg";
// import AG501_warn from "@/assets/icons/AG501_warn.svg";
// import AG501Pro from "@/assets/icons/AG501Pro.svg";
// import AG501Pro_warn from "@/assets/icons/AG501Pro_warn.svg";
// import AG502 from "@/assets/icons/AG502.svg";
// import AG502_warn from "@/assets/icons/AG502_warn.svg";
// import AG302Android from "@/assets/icons/AG302Android.svg";
// import AG302Android_warn from "@/assets/icons/AG302Android_warn.svg";
// import MC100 from "@/assets/icons/MC100.svg";
// import MC100_warn from "@/assets/icons/MC100_warn.svg";
// import AGunknown from "@/assets/icons/AGunknown.svg";
// import AGunknown_warn from "@/assets/icons/AGunknown_warn.svg";
// import MT801 from "@/assets/icons/MT801.svg";
// import MT801_warn from "@/assets/icons/MT801_warn.svg";
// import MT802 from "@/assets/icons/MT802.svg";
// import MT802_warn from "@/assets/icons/MT802_warn.svg";
// import SA200 from "@/assets/icons/SA200.svg";
// import SA200_warn from "@/assets/icons/SA200_warn.svg";
// import {markerTypeIcon,markerTypeIconSmall} from '@/utils/enumerate'
const L = window.L;

const { t } = useI18n();

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
  lineStyle: {
    type: Object,
    default: {
      color: "#8be668",
      weight: 4,
    },
  },
  polygonStyle: {
    type: Object,
    default: {
      radius: 20000,
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
    // 清空marker点
    markerArr.length = 0;
    markerClusterGroup.clearLayers();
    markerGroup.clearLayers();

    createMarker(markerData);
  }
);
const markerDataHiddenNow = ref<any>([])
watch(
  () => props.markerDataHidden,
  (markerDataHidden) => {
    markerDataHiddenNow.value = markerDataHidden
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
  () => props.mapCenter,
  (mapCenter) => {
    handleMapCenter(mapCenter);
  },
  { deep: true }
);
watch(
  () => props.polygonStyle,
  () => {
    createPolygon(props.polygonData);
  },
  { deep: true }
);

let map: any = null; // map实例对象
let polyline: any = null;
let mapRenderMode = props.mapRenderMode || "dom";
let mapRenderModeLength = ref(0);
let mapRenderModeLengthMax = 500; //数量超过1000，强制转为 polymer 聚合引擎
const isCanvasMap: boolean = mapRenderMode == "canvas";
let markerArr: any = []; // marker坐标点数字
let polygonArr: any = [];
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
    // {
    //   id: 2,
    //   lable: "sinoMap.googleMap",
    //   mapName: "Google",
    //   mapType: "Normal",
    // },
    // { id: 3, lable: "天地图", mapName: "TianDiTu", mapType: "Normal" },
  ],
});

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
  handleMapCenter(props.mapCenter);
  createMarker(props.markerData);
  createLine(props.lineData);
  map.zoomIn();
});

// 创建地图marker点
function createMarker(list: any) {
  mapRenderModeLength.value += list.length;
  list.forEach((item: any) => {
    let marker: any;
    const [markerLng, markerLat] = gcoordLngLat(item.markerLng, item.markerLat);
    const icon = createIcon(item);
    if (icon) {
      marker = L.marker([markerLat, markerLng], {
        icon,
        zIndexOffset: item.onlineTcp ? 1000 : 500,
        riseOnHover: true,
      });
    } else {
      marker = L.marker([markerLat, markerLng]);
    }
    marker.bindPopup(item.markerPopup);
    if (item.markerName) {
      marker
        .bindTooltip(item.markerName, {
          permanent: true,
          direction: "top",
          offset: [0, -15],
        })
        .openTooltip();
    }
    marker.markerId = item.markerId; // marker对象上设置唯一标识
    marker.markerType = item.markerType; // marker对象上设置唯一标识
    marker.driveState = item.driveState;
    marker.onlineTcp = item.onlineTcp;
    markerArr.push(marker);
    markerAddToMap(item.markerType, marker);
    // changeZoom()
  });
  map.zoomIn();
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
  if (mapRenderMode == "canvas") {
    props.markerDataHidden.includes(markerType)
      ? ""
      : markerCanvasGroup.addMarker(marker);
  }
  if (mapRenderMode == "dom") {
    props.markerDataHidden.includes(markerType) ? "" : markerGroup.addLayer(marker);
  }
  if (mapRenderMode == "polymer") {
    props.markerDataHidden.includes(markerType)
      ? ""
      : markerClusterGroup.addLayer(marker);
  }
}
// 修改地图marker点
function updateMarker(item: any) {
  const currentMarker = markerArr.find((i: any) => i.markerId == item.markerId);
  const currentMarkerIndex = markerArr.findIndex((i: any) => i.markerId == item.markerId);
  if (!currentMarker || !item.markerLng || !item.markerLat) {
    return;
  }
  const [markerLng, markerLat] = gcoordLngLat(item.markerLng, item.markerLat);
  currentMarker.setLatLng([markerLat, markerLng]);
  currentMarker.getPopup().setContent(item.markerPopup);

  if (
    currentMarker.markerType != item.markerType &&
    !props.markerDataHidden.includes(item.markerType)
  ) {
    //点的markerType发生变化才更新点的图标
    let icon = createIcon(item);

    if (mapRenderMode == "canvas") {
      //要重新建一个marker，不然地图缩放setIcon点会缩放
      const newMarker = L.marker([markerLat, markerLng], {
        icon,
        zIndexOffset: item.onlineTcp ? 1000 : 500,
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
      const newMarker = L.marker([markerLat, markerLng], {
        icon,
        zIndexOffset: item.onlineTcp ? 1000 : 500,
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
  map.setZoom(map.getZoom() + 1);
  map.setZoom(map.getZoom() - 1);
}
// 修改地图marker显隐藏
function updateMarkerVisible(list: any) {
  console.log(list);
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
  TMarkers.value = includedMarkers
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
const TMarkers = ref<any>([])
// 创建icon图标
function createIcon(item: any) {
  if (item.markerIcon) {
    const markerIcon = getRelativeIcon(item.markerIcon);
    return markerIcon;
    // return L.icon({
    //   iconUrl: item.markerIcon, // SVG图标的路径
    //   iconSize: [25, 28], // 图标的大小 [宽度, 高度]
    //   iconAnchor: [12, 14], // 图标的锚点位置 [水平, 垂直]
    //   popupAnchor: [-2, -28], // 弹出窗口的锚点位置 [水平, 垂直]
    // });
  }
  if (item.markerTitle) {
    return L.divIcon({
      className: "custom-icon",
      // html:  item.markerTitle,
      // '<div style="transform: rotate(' +
      // (item.markerRotate || 0) +
      // 'deg)">' +
      // item.markerTitle +
      // "</div>",
      html: `<div style="transform: rotate(${item.markerRotate || 0}deg)">
   ${item.markerTitle}
    </div>`,
      iconSize: [40, 10], // 图标的大小 [宽度, 高度]
      // iconAnchor: [null, null], // 图标的锚点位置 [水平, 垂直]
    });
  }
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

    zoomSnap: 1,
    zoomAnimation: mapRenderMode == "canvas" ? false : true,
  });

  markerGroup.addTo(map);
  markerClusterGroup.addTo(map);
  initCanvasGroup();
  mapTileChange();
  // initRanging();
  mapzoomChange();
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
// 创建多面形
function createPolygon(list: any) {
  polygonArr.forEach((item: any) => {
    item.remove();
  });
  polygonArr.length = 0;

  const { radius } = props.polygonStyle;

  list.forEach((item: any) => {
    item.forEach((v: any) => {
      const [markerLng, markerLat] = gcoordLngLat(v[0], v[1]);
      var circle = L.circle([markerLat, markerLng], {
        radius, // 半径（单位：米）
        color: "none",
        fillColor: "#5AF269",
        fillOpacity: 0.3,
      }).addTo(map);
      polygonArr.push(circle);
    });
  });
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
      arr.push(gcoordLngLat(v[0], v[1]).reverse());
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
  const mapTitleOption = mapTileOptions.list.find((item) => item.id == mapTileOptions.id);
  changeTileLayer(mapTitleOption?.mapName, mapTitleOption?.mapType);
}
// 处理地图定位
function handleMapCenter(data: any) {
  if (!data) {
    let latLng: any = [];
    if (props.mapCenter.center) {
      latLng = props.mapCenter.center.map((item: any) => {
        return gcoordLngLat(item[1], item[0]);
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
  const [lat, lng] = gcoord.transform([markerLat, markerLng], gcoord.WGS84, gcoord.GCJ02);
  return [lng, lat];
}
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
    changeMarkerIcon();
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

  // if (markerType.includes("AG360")) {
  //   icon = driveState == 0 ? AG360_warn : AG360;
  // } else if (markerType.includes("AG501") && markerType != "AG501Pro") {
  //   icon = driveState == 0 ? AG501_warn : AG501;
  // } else if (markerType == "AG501Pro") {
  //   icon = driveState == 0 ? AG501Pro_warn : AG501Pro;
  // } else if (markerType.includes("AG502")) {
  //   icon = driveState == 0 ? AG502_warn : AG502;
  // } else if (markerType.includes("AG302") && markerType != "AG302Android") {
  //   icon = driveState == 0 ? AG302_warn : AG302;
  // } else if (markerType == "AG302Android") {
  //   icon = driveState == 0 ? AG302Android_warn : AG302Android;
  // } else if (item.markerType.includes("MC100")) {
  //   icon = driveState == 0 ? MC100_warn : MC100;
  // } else if (item.markerType.includes("MT801")) {
  //   icon = driveState == 0 ? MT801_warn : MT801;
  // } else if (item.markerType.includes("MT802")) {
  //   icon = driveState == 0 ? MT802_warn : MT802;
  // } else if (item.markerType.includes("SA200")) {
  //   icon = driveState == 0 ? SA200_warn : SA200;
  // } else {
  //   icon = driveState == 0 ? AGunknown_warn : AGunknown;
  // }

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

  // if (markerType.includes("AG360")) {
  //   icon = driveState == 0 ? yellow : green;
  // } else if (markerType.includes("AG501") && markerType != "AG501Pro") {
  //   icon = driveState == 0 ? yellow : green;
  // } else if (markerType == "AG501Pro") {
  //   icon = driveState == 0 ? yellow : green;
  // } else if (markerType.includes("AG502")) {
  //   icon = driveState == 0 ? yellow : green;
  // } else if (markerType.includes("AG302") && markerType != "AG302Android") {
  //   icon = driveState == 0 ? yellow : green;
  // } else if (markerType == "AG302Android") {
  //   icon = driveState == 0 ? yellow : green;
  // } else if (item.markerType.includes("MC100")) {
  //   icon = driveState == 0 ? yellow : green;
  // } else {
  //   icon = driveState == 0 ? yellow : green;
  // }

  return icon;
}
function changeMarkerIcon() {
  initCanvasGroup();
  const newMarkers: any = [];
  if (isIconChange.value) {
    if (iconChangeLimit.value) {
      //显示大图标
      markerArr.forEach((marker: any, index: number) => {
        // if(!markerTypeIcon[marker.markerType]){return}
        const normalIcon = getRelativeIcon(createMarkerIcon(marker));
        const newMarker = L.marker(marker.getLatLng(), {
          icon: normalIcon,
          zIndexOffset: marker.onlineTcp ? 1000 : 500,
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
          zIndexOffset: marker.onlineTcp ? 1000 : 500,
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
  } else {
    markerArr.forEach((marker: any, index: number) => {
      // if(!markerTypeIcon[marker.markerType]){return}
      const normalIcon = getRelativeIcon(createMarkerIcon(marker));
      const newMarker = L.marker(marker.getLatLng(), {
        icon: normalIcon,
        zIndexOffset: marker.onlineTcp ? 1000 : 500,
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
  updateMarkerVisible(markerDataHiddenNow.value)
  map.setView(map.getCenter());
}
// 地图缩放处理事件
function mapzoomChange() {
  let flag1 = false;
  let flag2 = false;
  if (mapRenderMode == "canvas") {
    map.on("mouseup", () => {
      //解决地图移动时，其他图层和canvas不同步
      changeZoom();
    });
  }
  map.on("zoomend", function () {
    let zoom = map.getZoom();
    currentZoom.value = zoom;
    let fontSize: number;
    if (zoom <= 10) {
      fontSize = zoom / 5;
      flag2 = false;
    } else {
      fontSize = 14;
      flag2 = true;
    }
    setProperty();
    function setProperty() {
      document.documentElement.style.setProperty("--map-font-size", `${fontSize}px`);
    }
    if (flag1 != flag2) {
      setlatLng();
    }
    function setlatLng() {
      flag1 = flag2;
      markerArr.forEach((item: any) => {
        if (item.getTooltip()) {
          item.getTooltip().setLatLng(item.getLatLng());
        }
        // 特殊处理
        let icon = item.getIcon();
        if (icon.options.className) {
          zoom <= 10
            ? (icon.options.iconSize = [50, 10])
            : (icon.options.iconSize = [300, 20]);
          item.setIcon(icon);
        }
      });
    }
    map.setView(map.getCenter());
    map.fitBounds(map.getBounds());
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
// 初始化测距
function initRanging() {
  map.on("click", function (event: any) {
    if (pickupMode) {
      let icon = L.icon({
        iconUrl: fixed_icon, // SVG图标的路径
        iconSize: [32, 32], // 图标的大小 [宽度, 高度]
        iconAnchor: [16, 32], // 图标的锚点位置 [水平, 垂直]
        popupAnchor: [-2, -28], // 弹出窗口的锚点位置 [水平, 垂直]
      });
      let point = event.latlng;
      pickedPoints.push(point);
      let marker = L.marker(point, { icon }).addTo(map);
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
defineExpose({
  handleMapCenter,
  mapTileChange,
  iconChangeLimit,
  isIconChange,
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
</style>
