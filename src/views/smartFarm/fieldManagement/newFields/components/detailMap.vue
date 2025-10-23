<template>
  <div class="SinoMap_component">
    <div id="map" :class="{ 'crosshair-cursor': isDrawing }"></div>
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
      <!-- <div class="map_utils_item">
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
      </div> -->
    </div>
    ​
    <el-button-group class="btm_plo">
      <el-button
        style="width: 100px"
        type="primary"
        @click="offDraw"
        v-if="isEdit"
        :disabled="isDraw"
        >{{ t("work.doneEdit") }}</el-button
      >
      <el-button
        style="min-width: 100px"
        type="primary"
        @click="drawPolygons"
        v-if="!isEdit"
        :disabled="isDraw"
        >{{ t("work.editField") }}</el-button
      >
      <el-button type="primary" @click="deleteDraw" v-if="pointsArray.length > 0">
        <el-icon> <Delete /> </el-icon
      ></el-button>
    </el-button-group>
    <el-button-group class="btm_plo2">
      <el-button
        style="min-width: 100px"
        type="primary"
        @click="mapRanging"
        :disabled="isEdit"
        >{{ t("work.editAB") }}</el-button
      >
      <el-button type="primary" @click="clearMapRanging" v-if="rangingArray.length > 0">
        <el-icon> <Delete /> </el-icon
      ></el-button>
    </el-button-group>
    ​
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
import { gcoordLngLat } from "sino-tool-v3";

import { gcj02ToWgs84 } from "@/utils/coordTransform";
const emit = defineEmits(["areaValue", "lengthValue", "boundries", "pickedPoints"]);

const { t, locale } = useI18n();
const isDrawing = ref(false);
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
});
let pickupMode: boolean = false; // 是否地图拾取模式
let pickedPoints: any = [];
let rangingArray: any = reactive([]);
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
  () => props.markerData,
  (markerData, markerDataOld) => {
    if (markerDataOld === markerData) {
      return;
    }
    console.log("createMarker改变");
    markerArr.length = 0;
    markerClusterGroup.clearLayers();
    markerGroup.clearLayers();
    createMarker(markerData);
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
  () => props.boundariesID,

  (boundariesID) => {
    findBoundaries(boundariesID);
  }
);
watch(
  () => props.handleOb,
  (mapCenter) => {
    handleMapCenter(mapCenter);
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
const markerDataN = ref<any>([]);
// 创建地图marker点
function createMarker(list: any) {
  markerDataN.value = list;
  mapRenderModeLength.value += list.length;

  list.forEach((item: any) => {
    let marker: any;
    if (item.markerLng && item.markerLat) {
      const position: any = gcoordLngLat(item.markerLng, item.markerLat);
      const icon = createIcon(item);
      if (icon) {
        marker = L.marker(position, {
          icon,
          zIndexOffset: item.onlineTcp === 1 ? 1000 : 999,
          riseOnHover: true,
        });
      } else {
        marker = L.marker(position);
      }
      // marker.bindPopup(item.markerPopup);
      if (item.markerName) {
        marker.bindTooltip(item.markerName, {
          permanent: true,
          direction: "top",
          offset: [0, -15],
        });
      }
      marker.markerId = item.markerId; // marker对象上设置唯一标识
      marker.markerType = item.markerType; // marker对象上设置唯一标识
      marker.driveState = item.driveState;
      marker.onlineTcp = item.onlineTcp;

      markerArr.push(marker);
      markerAddToMap(item.markerType, marker);
      map.setView(position, 18);
    }

    // changeZoom()
  });

  // changeZoom()
}

let points: any = [];
let polygon: any;
let timer: any;
const area = ref<any>("");
const length = ref<any>("");
const pickedPointsArray = ref<any>([]);
const offDraw = () => {
  polygon.setLatLngs(points);
    isDrawing.value = false;
  isEdit.value = false;
  //触发双击事件，结束绘制
  map.fire("dblclick");
  map.off("click");
  map.off("dblclick");
  area.value = calculatePolygonArea(pointsArray.value);
  length.value = calculatePolygonPerimeter(pointsArray.value);
  let turePoint: any = [];
  pointsArray.value.forEach((item: any) => {
    if (item.length > 0) {
      turePoint.push(item);
    }
  });
  emit("boundries", JSON.stringify(turePoint));
};
watch(
  () => area.value,
  () => {
    emit("areaValue", area.value);
  }
);
watch(
  () => length.value,
  () => {
    emit("lengthValue", length.value);
  }
);
watch(
  () => pickedPointsArray.value,
  () => {
    emit("pickedPoints", JSON.stringify(pickedPointsArray.value));
  },
  { deep: true }
);
//清除多边形图层组
const deleteDraw = () => {
  polyGonArray.forEach((item: any) => {
    map.removeLayer(item);
  });
  polyGonArray = [];
  pointsArray.value = [];
  area.value = "";
};
let polyGonArray: any = [];
const isEdit = ref(false);
const pointsArray = ref<any>([]);
const polygons = ref([]);
// 禁用所有多边形交互
const disablePolygonsInteraction = () => {
  polygons.value.forEach((polygon) => {
    polygon.setStyle({ interactive: false });
    // Leaflet原生方法：通过设置鼠标事件穿透
    if (polygon._path) {
      polygon._path.style.pointerEvents = "none";
    }
  });
};

// 启用所有多边形交互
const enablePolygonsInteraction = () => {
  polygons.value.forEach((polygon) => {
    polygon.setStyle({ interactive: true });
    if (polygon._path) {
      polygon._path.style.pointerEvents = "auto";
    }
  });
};

function drawPolygons() {
  points = [];
  isEdit.value = true;
  isDrawing.value = true;

  polygon = new L.polygon(points, {
    color: "#83FFA4",
    fillColor: "#83FFA4",
    fillOpacity: 0.44,
  }).addTo(map);
  polygons.value.push(polygon);
  map.off("dblclick"); //首次绘制时取消默认双击放大地图事件
  map.on("click", onClick);
  function onClick(e) {
    clearTimeout(timer); // 先清定时器
    timer = setTimeout(() => {
      // 再延迟执行
      points.push([e.latlng.lat, e.latlng.lng]);
      polygon.setLatLngs(points);
      map.on("mousemove", onMove);
      map.on("dblclick", onDoubleClick);
    }, 10);
  }
  function onMove(e) {
    points.push([e.latlng.lat, e.latlng.lng]);
    polygon.setLatLngs(points);
    points.pop();
  }
  function openRealTimeChart_markerPopup(arg: any) {
    map.removeLayer(polyGonArray[arg]);
    pointsArray.value[arg] = [];
    let turePoint: any = [];
    pointsArray.value.forEach((item: any) => {
      if (item.length > 0) {
        turePoint.push(item);
      }
    });
    emit("boundries", JSON.stringify(turePoint));
    area.value = calculatePolygonArea(pointsArray.value);
    length.value = calculatePolygonPerimeter(pointsArray.value);
  }
  // @ts-ignore
  window.openRealTimeChart_markerPopup = openRealTimeChart_markerPopup;
  function onDoubleClick(e) {
    let pointsItem: any;
    clearTimeout(timer);
    map.off("mousemove");
    if (polygon._latlngs[0].length > 0) {
      polyGonArray.push(polygon);
    }
    polyGonArray.forEach((item: any, index: any) => {
      console.log(item);
      item.bindPopup(
        `  <div class='popup_click ' onclick='openRealTimeChart_markerPopup(${index})'>${t(
          "work.delete"
        )}</div>`
      );
    });

    pointsItem = points.map((item: any) => {
      return gcj02ToWgs84(item[0], item[1]).join(",");
    });
    if (pointsItem.length > 0) {
      pointsItem.push(pointsItem[0]);
      if (pointsItem[0]) {
        pointsArray.value.push(pointsItem);
      }
    }
    points = [];
    polygon = new L.polygon(points, {
      color: "#83FFA4",
      fillColor: "#83FFA4",
      fillOpacity: 0.44,
    }).addTo(map);
    setTimeout(() => {
      offDraw();
    
    }, 10);
  }
}
function calculateDistance(lat1: any, lng1: any, lat2: any, lng2: any) {
  const R = 6371e3; // 地球半径(米)
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 计算多边形周长
function calculatePolygonPerimeter(points: any) {
  let allLength: any = 0;
  points.forEach((item: any) => {
    if (item.length < 2) return 0;
    let perimeter = 0;
    let n = item.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      perimeter += calculateDistance(
        item[i].split(",")[0],
        item[i].split(",")[1],
        item[j].split(",")[0],
        item[j].split(",")[1]
      );
    }

    allLength += perimeter;
  });
  return allLength;
}
// 计算球面多边形面积（单位：mu）
function calculatePolygonArea(points: any) {
  let Alltotal: any = 0;
  points.forEach((item: any) => {
    if (item.length < 3) return 0;

    let total = 0;
    const radius = 6378137; // 地球半径(米)

    // 将经纬度转换为弧度
    const coords = item.map((point: any) => ({
      lat: (point.split(",")[0] * Math.PI) / 180,
      lng: (point.split(",")[1] * Math.PI) / 180,
    }));
    for (let i = 0; i < coords.length; i++) {
      const j = (i + 1) % coords.length;
      const p1 = coords[i];
      const p2 = coords[j];

      total += (p2.lng - p1.lng) * (2 + Math.sin(p1.lat) + Math.sin(p2.lat));
    }

    total = (total * radius * radius) / 2;
    Alltotal = Alltotal + Math.abs(total);
  });
  return (Alltotal * 3) / 2000;
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
  markerGroup.addTo(map);
  markerClusterGroup.addTo(map);
  initCanvasGroup();
  mapTileChange();
  // initRanging();
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
// 创建多面形
function createPolygon(list: any) {
  polygonArr.forEach((item: any) => {
    item.remove();
  });
  polygonArr.length = 0;
  // 双重polylineData数组
  const polytrueData: any = [];
  const tureP: any = [];
  // 处理数据格式
  list.map((it: any) => {
    it.forEach((inner: any, index: any) => {
      let innerList = inner.boundaries.map((point: any) => {
        let position = gcoordLngLat(point.split(",")[1], point.split(",")[0]);
        return position;
      });
      polytrueData.push(innerList);
      let listInner = inner.boundaries.map((point: any) => {
        return point;
      });
      tureP.push(listInner);
    });
  
    return polytrueData;
  });
  drawPolygonFarm(polytrueData);
}
const drawPolygonFarm = (polytrueData: any) => {
  let pickPoints: any = [];
  polytrueData.map((item: any, index: any) => {
    pickPoints.push(item);
    var polygon: any = L.polygon(item, {
        color: "#FFFFFF",
    fillColor: "#FFFFFF",
    fillOpacity: 0.2,
    }).addTo(map);

    polygonArr.push(polygon);
  });
  map.fitBounds(pickPoints);
};
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
  if (polyline) {
    polyline.remove();
  }

  const latLng: any = [];
  list.forEach((item: any) => {
    let arr: any = [];
    item.forEach((v: any) => {
      arr.push(gcoordLngLat(v[0], v[1]));
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
      console.log(pickedPoints);
      let point1 = gcj02ToWgs84(pickedPoints[0].lat, pickedPoints[0].lng);
      let point2 = gcj02ToWgs84(pickedPoints[1].lat, pickedPoints[1].lng);

      const t = {
        s72: 0,
        s94: {
          s73: [point1.join(","), point2.join(",")],
        },
      };
      pickedPointsArray.value.push(t);

      let distance = pickedPoints[0].distanceTo(pickedPoints[1]); //算距离
      let polyline = L.polyline(pickedPoints, { color: "red" })
        .addTo(map)
        // .bindPopup(`相距:${distance.toFixed(3)}米`)
        .openPopup(); //划线
      rangingArray.push(polyline);
      map.fitBounds(pickedPoints); //适应视野
      //恢复状态
      pickupMode = false;
      isDraw.value = false;
      isDrawing.value =false
      pickedPoints = [];
      try {
      
        map.off("click", mapClick);
        enablePolygonsInteraction();
      } catch (err) {
        console.log(err);
      }
      return;
    }
  }
};
const isDraw = ref(false);
// 地图测距
function mapRanging() {
  isDraw.value = true;
  isDrawing.value =true
  try {
    // @ts-ignore
    
    disablePolygonsInteraction();
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
}
// 地图缩放处理事件

// 清除地图测距
function clearMapRanging() {
  if (rangingArray.length) {
    rangingArray.forEach((item: any) => {
      map.removeLayer(item);
    });
    rangingArray.length = 0;
    pickedPointsArray.value = [];
  }
  pickupMode = false;
  pickedPoints = [];
  pickedPoints.length = 0;
  isDraw.value = false;
  isDrawing.value =false
  try {
  
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
.btm_plo {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 999;
}
.btm_plo2 {
  position: absolute;
  top: 50px;
  right: 10px;
  z-index: 999;
}
:deep(.leaflet-popup-content) {
  cursor: pointer;
}
#map {
  cursor: grab; /* 默认鼠标样式 */
}

/* 十字坐标型鼠标样式 - 仅在绘制状态生效 */
.crosshair-cursor {
  cursor: crosshair !important;
}
</style>
