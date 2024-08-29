<!--  -->
<template>
  <div class="map_container">
    <div id="child6_map" class=""></div>
    <div class="map_utils">
      <div class="map_utils_item flex-align-center">
        <el-select
          style="width: 111px"
          v-model="mapId"
          placeholder=""
          @change="hangleSelectChange"
        >
          <el-option
            v-for="(item, index) in mapOptions"
            :key="index"
            :label="item.mapName"
            :value="item.mapId"
          />
        </el-select>
      </div>
      <div class="map_utils_item">
        <el-tooltip
          effect="light"
          :content="t('sinoMap.Clickmetoreturntotheoverallsituation')"
        >
          <el-button @click="handleMapCenter()">
            <el-icon size="16"><RefreshRight /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
      <div class="map_utils_item">
        <el-tooltip effect="light" :content="t('sinoMap.ranging')">
          <el-button @click="calculateDistance">
            <SvgIcon icon="ranging" size="16" />
          </el-button>
        </el-tooltip>
      </div>
      <div class="map_utils_item" v-if="calculationObj.length > 0">
        <el-tooltip effect="light" :content="t('work.clear')">
          <el-button style="color: rgba(76, 176, 79, 1)" @click="clearDistance">
            <el-icon> <Delete /> </el-icon
          ></el-button>
        </el-tooltip>
      </div>
    </div>
    <div class="head_top">
      <div class="left">
        <div class="choose_area">
          <div class="my-2 ml-4"></div>
          <el-radio-group v-model="radio2">
            <el-radio :label="1">轨迹线</el-radio>
            <el-radio :label="2">轨迹点</el-radio>
          </el-radio-group>
        </div>
        <el-select
          style="width: 270px; margin-right: 10px"
          v-model="pageInfo.companyId"
          :placeholder="$t('work.pleaseSelect')"
          @change="changeBlur1"
        >
          <template #prefix>
            <span class="select_title">{{ $t("work.unit") }}:</span>
          </template>
          <el-option
            style="width: 230px"
            v-for="item in dealerList"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>

        <el-select-v2
          :style="{
            width: '250px',
            '--content-text': '\'' + $t('work.currentVehicle') + '\'',
          }"
          filterable
          v-model="pageInfo.carId"
          :options="optionsList"
          :placeholder="$t('work.pleaseSelect')"
          @change="changeBlur2"
        >
        </el-select-v2>
      </div>
    </div>
  </div>
 
</template>

<script setup lang="ts">
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import "leaflet/dist/leaflet.css";
// import "leaflet.markercluster";
// import "leaflet.markercluster/dist/MarkerCluster.css";
// import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { ref, reactive, watch, onMounted } from "vue";
import {
  PageObj,
  dealerCarObj,
  dealerCarResponseData,
  paddyWorkObj,
  paddyWorkListResponsenumber,
} from "@/api/jobManagement/type";
import { carDealerResponseData, carDealerObj } from "@/api/machineryList/type";
import { useRoute } from "vue-router";
import { getCarDealerList_API, paddyWorkList_API } from "@/api/jobManagement/index";
import { carDealer_API } from "@/api/machineryList/index";
import { historyList_path } from "@/api/jobManagement/taskManage/index";

import gcoord from "gcoord";
import { mapTitleLayers } from "./mapTitleLayers";
import a from "@/assets/jobManage/a.png";
import b from "@/assets/jobManage/b.png";
import c from "@/assets/jobManage/c.png";
import SvgIcon from "@/components/SvgIcon/index.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const radio2 = ref(1);
// 提交的车辆数组
const ids = ref<any>([]);
const L = window.L;
// 提交数据
const pageInfo = reactive<PageObj>({
  carId: "",
  name: "",
  companyId:  "",
  currentPage: 1,
  pageSize: 5000,
  st: "",
  et: "",
});
const CarDealerList = ref<dealerCarObj[]>([]);
const dealerList = ref<carDealerObj[]>([]);
const paddyWorkList = ref<paddyWorkObj[]>([]);

onMounted(() => {
  initMap();
  getDealerList();
});

// 地图相关
let map = <any>null;
const originPoint = ref<any>([31.172800343248, 121.406021546488]);
const originZoom = ref<any>(5);
// const tileLayer = reactive<any>([])
// const tileUrl = reactive<any>({})
// Object.assign(tileUrl, mapTitleLayers)
const pickupMode = ref<boolean>(false);
const pickedPoints = ref<any[]>([]);
let ViewGroup = <any>null;
let calculationObj = <any[]>reactive([]);
const mapId = ref(0);
const mapOptions = reactive([
  {
    mapName: "卫星地图",
    mapId: 0,
  },
  {
    mapName: "高德地图",
    mapId: 1,
  },
  // {
  //     mapName: '谷歌地图',
  //     mapId: 2
  // },
  {
    mapName: "天地图",
    mapId: 3,
  },
]);
const markerCollect = <any>{};

const markerCollect2 = <any>{};
function initMap() {
  map = L.map("child6_map", {
    attributionControl: false,
    closePopupOnClick: false,
    zoomControl: false,
  }).setView(originPoint.value, originZoom.value);
  handleMapChange(mapId.value);
  map.on("click", function (event: any) {
    if (pickupMode.value) {
      let point = event.latlng;
      pickedPoints.value.push(point);
      let icon = L.icon({
        iconUrl: c,
        iconAnchor: [23, 46],
      });

      let marker = L.marker(point, { icon: icon }).addTo(map);
      calculationObj.push(marker);
      if (pickedPoints.value.length === 2) {
        let distance = pickedPoints.value[0].distanceTo(pickedPoints.value[1]); //算距离
        let polyline = L.polyline(pickedPoints.value, { color: "red" })
          .addTo(map)
          .bindPopup(`相距:${distance.toFixed(3)}米`)
          .openPopup(); //划线
        calculationObj.push(polyline);
        map.fitBounds(pickedPoints.value); //适应视野
        //恢复状态
        pickupMode.value = false;
        pickedPoints.value = [];
        const mapId = document.getElementById("child6_map");
        if (mapId) {
          mapId.style.cursor = "grab";
        }
        return;
      }
    }
  });
}
const handleMapChange = (mapId: any) => {
  switch (mapId) {
    case 0:
      changeTileLayer("Google", "Satellite");
      break;
    case 1:
      changeTileLayer("GaoDe", "Normal");
      break;
    case 2:
      changeTileLayer("Google", "Normal");
      break;
    case 3:
      changeTileLayer("TianDiTu", "Normal");
      break;
  }
};
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

// 测距
const calculateDistance = () => {
  const mapId = document.getElementById("child6_map");
  if (mapId) {
    mapId.style.cursor = "crosshair";
  }
  pickupMode.value = true; //开启拾取模式
};
function handleMapCenter() {
  map.setView(originPoint.value, originZoom.value);
}

// 清除测距
const clearDistance = () => {
  if (calculationObj.length) {
    calculationObj.forEach((item) => {
      map.removeLayer(item);
    });
    calculationObj = [];
  }
  pickupMode.value = false;
  pickedPoints.value = [];
  const mapId = document.getElementById("child6_map");
  if (mapId) {
    mapId.style.cursor = "grab";
  }
};
// 更改底地图
const hangleSelectChange = () => {
  handleMapChange(mapId.value);
};
// 保存记录
const saveMarker = (workId: any, markerObj: any) => {
  try {
    markerCollect[workId]["marker"] = markerObj;
  } catch (err) {
    console.log(err);
  }
};
const saveMarker2 = (workId: any, markerObj: any) => {
  try {
    markerCollect2[workId]["marker"] = markerObj;
  } catch (err) {
    console.log(err);
  }
};
const tranpatrnt = ref<any>([]);
const emptyIds = ref(false);
const loadWorkData = (workId: any) => {
  historyList_path(workId)
    .then((res) => {
      let key = Object.keys(res.data);
      getMachineInfo();
      key.map((item) => {
        if (!item.length || res.data[item] === null || !res.data[item].length) {
          emptyIds.value = true;
          // ElMessage.warning(`${item}暂无作业数据`);
          return;
        } else {
          emptyIds.value = false;
          let PointListTransed = res.data[item].map((item2: any) => {
            return coorTransform([item2.posX as never, item2.posY as never], mapId.value); // 转换坐标
          });
          tranpatrnt.value.push(PointListTransed);
          let line = L.polyline(PointListTransed, { color: "#00ff00", weight: 8 }).addTo(
            map
          );

          saveMarker(workId, [{ markerObj: line, name: "lines" }]);
        }
      });
      if (ids.value.length >= 2 || emptyIds.value === true) {
        map.fitBounds(tranpatrnt.value);
      }
    })
    .catch(() => {
      return false;
    });
};
const drawLine = (workId: any, res: any) => {
  let key = Object.keys(res.data);
  getMachineInfo();
  key.map((item) => {
    if (!item.length || res.data[item] === null || !res.data[item].length) {
      emptyIds.value = true;
      // ElMessage.warning(`${item}暂无作业数据`);
      return;
    } else {
      emptyIds.value = false;
      let PointListTransed = res.data[item].map((item2: any) => {
        return coorTransform([item2.posX as never, item2.posY as never], mapId.value); // 转换坐标
      });
      tranpatrnt.value.push(PointListTransed);
      let line = L.polyline(PointListTransed, { color: "#00ff00", weight: 8 })
        .bindPopup("111")
        .addTo(map);
      saveMarker(workId, [{ markerObj: line, name: "lines" }]);
    }
  });
  if (ids.value.length >= 2 || emptyIds.value === true) {
    map.fitBounds(tranpatrnt.value);
  }
};
//坐标转换
const coorTransform = (point = [], mapType = 1) => {
  //经纬度顺序 gcoor 需要 [116.403988, 39.914266] 经度在前
  // if (!pointInChina(point)) {
  //     return point
  // }
  let p: any = [point[1], point[0]];
  switch (mapType) {
    case 0:
      let [a, b] = gcoord.transform(p, gcoord.WGS84, gcoord.GCJ02);
      return [b, a];
    case 1:
      let [c, d] = gcoord.transform(p, gcoord.WGS84, gcoord.GCJ02);
      return [d, c];
    case 2:
      let [e, f] = gcoord.transform(p, gcoord.WGS84, gcoord.BD09);
      return [f, e];
    case 3:
      let [g, h] = gcoord.transform(p, gcoord.WGS84, gcoord.GCJ02);
      return [h, g];
    default:
      let [i, j] = gcoord.transform(p, gcoord.WGS84, gcoord.GCJ02);
      return [j, i];
  }
};
// 地图绘制方法
const addPathAB = (item: any) => {
  if (item.lineptax && item.lineptay && item.lineptbx && item.lineptby) {
    try {
      let pointA = coorTransform(
        [item.lineptay as never, item.lineptax as never],
        mapId.value
      );
      let pointB = coorTransform(
        [item.lineptby as never, item.lineptbx as never],
        mapId.value
      );
      let l1 = L.latLng(item.lineptax, item.lineptay);
      let l2 = L.latLng(item.lineptbx, item.lineptby);
      // let distance = l1.distanceTo(l2).toFixed(0);
      let iconA = L.icon({
        iconUrl: a,
        iconAnchor: [12, 30],
        popupAnchor: [0, -30],
      });
      let iconB = L.icon({
        iconUrl: b,
        iconAnchor: [12, 30],
        popupAnchor: [0, -30],
      });
      let markerA = L.marker(pointA as never, { icon: iconA }).addTo(map);
      let markerB = L.marker(pointB as never, { icon: iconB }).addTo(map);
      let line = L.polyline([pointA, pointB], {
        color: "red",
        dashArray: [9, 9],
      })
        // .bindTooltip(`AB点距离 ${distance} 米`, { permanent: true })
        .addTo(map);
      map.fitBounds([pointA, pointB]);
      saveMarker2(item.id, [
        {
          markerObj1: markerA,
          name: "markerA",
          markerObj2: markerB,
          name2: "markerB",
          markerObj3: line,
          name3: "lines",
        },
      ]);
    } catch (err) {
      console.log(err);
    }
  }
};
// 删除区域
const removeMarker = (workId: any) => {
  try {
    if (markerCollect[workId]["marker"].length) {
      let a = markerCollect[workId]["marker"];
      a.forEach((item: any) => {
        console.log(item);
        if (item.markerObj) {
          map.removeLayer(item.markerObj);
          // map.removeLayer(item.markerObj2)
        }
        if (item.markerObj2) {
          map.removeLayer(item.markerObj2);
        }
      });
      markerCollect[workId]["marker"] = [];
    }
    if (markerCollect2[workId]["marker"].length) {
      let a = markerCollect2[workId]["marker"];
      a.forEach((item: any) => {
        console.log(item);
        if (item.markerObj1) {
          map.removeLayer(item.markerObj1);
          // map.removeLayer(item.markerObj2)
        }
        if (item.markerObj2) {
          map.removeLayer(item.markerObj2);
        }
        if (item.markerObj3) {
          map.removeLayer(item.markerObj3);
        }
        // map.removeLayer(item.markerObj)
      });
      markerCollect2[workId]["marker"] = [];
    }
  } catch (err) {
    console.log(err);
  }
};
const hasMarker = (workId: any) => {
  return markerCollect[workId]["marker"].length > 0;
};
const machine = reactive<any>({});
const getMachineInfo = () => {
  paddyWorkList.value.forEach((element: any) => {
    if (ids.value.includes(element.id)) {
      machine[element.id] = element;
    }
  });
};
const hasMarkerField = (workId: any, field: any) => {
  let a = markerCollect[workId]["marker"].find((element: any) => element.name === field);
  if (a && a[field] !== null) {
    return true;
  } else {
    return false;
  }
};
// 清除全部
const clearAllMarkers = () => {
  try {
    for (let key in markerCollect) {
      if (Object.keys(markerCollect).length) {
        if (markerCollect[key]["marker"].length) {
          markerCollect[key]["marker"].forEach((item: any) => {
            if (item && item.markerObj) {
              map.removeLayer(item.markerObj);
              if (item && item.markerObj2) {
                map.removeLayer(item.markerObj2);
              }
            }
          });
        }
      }
    }
    for (let key in markerCollect2) {
      if (Object.keys(markerCollect2).length) {
        if (markerCollect2[key]["marker"].length) {
          markerCollect2[key]["marker"].forEach((item: any) => {
            if (item && item.markerObj1) {
              map.removeLayer(item.markerObj1);
              if (item && item.markerObj2) {
                map.removeLayer(item.markerObj2);
                if (item && item.markerObj3) {
                  map.removeLayer(item.markerObj3);
                }
              }
            }
          });
        }
      }
    }
    clearDistance();
  } catch (err) {
    console.log(err);
  }
};
// 数据相关
const getDealerList = async () => {
  const res: carDealerResponseData = await carDealer_API();
  if (res.data.length > 1) {
    dealerList.value = [{ id: "", name: t("devicelist.totalDealer") }, ...res.data];
    pageInfo.companyId = "";
  } else {
    dealerList.value = res.data;
  }
  getDealerCarList();
};

let optionsList = <any>[];
// 获取经销商下车辆列表
const getDealerCarList = async () => {
  const res: dealerCarResponseData = await getCarDealerList_API(pageInfo.companyId);
  if (res.data == null) {
    CarDealerList.value = [];
  } else {
    CarDealerList.value = res.data;
    optionsList = CarDealerList.value.map((item: any, _idx) => ({
      value: item.id,
      label: `${item.nameNpn}`,
    }));
    pageInfo.carId = res.data[0].id;
    getPaddyWorkList(true);
  }
};
const getPaddyWorkList = async (flag: Boolean) => {
  const res: paddyWorkListResponsenumber = await paddyWorkList_API(pageInfo);
  paddyWorkList.value = res.data.records;

  let tem = res.data.records;
  tem.forEach((element) => {
    // console.log(element)
    // paddyWorkList.value.push(element)
    markerCollect[element.id] = { marker: [] };
    markerCollect2[element.id] = { marker: [] };
    element.checked = false;
  });
};
const changeBlur1 = () => {
  getDealerCarList();
  clearAllMarkers();
  Object.assign(markerCollect, {});
  Object.assign(markerCollect2, {});
  ids.value = [];
  paddyWorkList.value = [];
  pageInfo.currentPage = 1;
  pageInfo.pageSize = 5000;
  pageInfo.carId = "请选择";
};
const changeBlur2 = () => {
  clearAllMarkers();
  Object.assign(markerCollect, {});
  Object.assign(markerCollect2, {});
  pageInfo.currentPage = 1;
  pageInfo.pageSize = 5000;
  ids.value = [];
  paddyWorkList.value = [];
  getPaddyWorkList(true);
};
watch(
  () => pageInfo.currentPage,
  () => {
    getPaddyWorkList(false);
  }
);
// watch(
//   () => ids.value,
//   async (newVal, oldVal) => {
//     paddyWorkList.value.forEach((item: any) => {
//       if (ids.value.includes(item.id as never)) {
//         item.checked = true;
//       } else {
//         item.checked = false;
//       }
//     });
//     for (var i = 0; i < newVal.length; i++) {
//       if (!oldVal.includes(newVal[i]) ) {
//         console.log(i)
//         const res: any = await historyList_path(newVal[i]);
//         drawLine(newVal[i], res);
//         if (res.code === 0) {
//         } else {
//           break;
//         }
//       }
//     }

//     // newVal.forEach((item: any) => {
//     //   if (!oldVal.includes(item)) {
//     //     try {
//     //       loadWorkData(item);
//     //       console.log("111");
//     //     } catch {
//     //       throw Error();
//     //     }
//     //   }
//     // });
//     oldVal.forEach((item: any) => {
//       if (!newVal.includes(item)) {
//         removeMarker(item);
//       }
//     });
//   }
// );
watch(
  () => paddyWorkList.value,
  (newData) => {
    if (newData.length) {
      Object.assign(machine, {});
      newData.forEach((subItem) => {
        if (subItem.checked) {
          //   if (!hasMarker(subItem.id)) {
          // addPathAB(subItem)
          // }
          // if (!hasMarkerField(subItem.id, 'lines')) {
          //      loadWorkData(subItem.id)
          // }
        } else {
          removeMarker(subItem.id);
        }
      });
    }
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
:deep(.el-select-v2__placeholder::before) {
  content: var(--content-text);
  margin-right: 2px;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 23.17px;
  color: rgba(115, 121, 133, 1);
}

.map_container {

  height: 100%;
  position: relative;

  #child6_map {
    height: 100%;

  }

  .map_selector {
    position: absolute;
    bottom: 10px;
    right: 135px;
    z-index: 999;
    width: 99px;
    height: 32px;
    opacity: 1;
    border-radius: 4px;
  }

  .map_button {
    position: absolute;
    bottom: 10px;
    right: 10px;
    z-index: 999;
    max-width: 110px;
    height: 32px;
    opacity: 1;
    border-radius: 4px;
  }

  .map_button2 {
    position: absolute;
    bottom: 10px;
    right: 90px;
    z-index: 999;
    max-width: 110px;
    width: 39px;
    height: 32px;
    opacity: 1;
    border-radius: 4px;
  }

  .head_top {
    display: flex;
    justify-content: space-between;
    padding: 0px 10px;

    .left {
      :deep(.el-select-v2__wrapper) {
          background: url("@/assets/monitoring/inputBack.png") no-repeat center center;
          background-size: 105% 100%;

        .el-select-v2__placeholder {
          color: #fff !important;
          background-color: transparent;
        }
        .el-select-v2__placeholder::before{
        color: #fff !important;
      }
      }
      :deep(.el-input__wrapper) {
        border: none;
      }
     
      z-index: 999;
      position: absolute;
      left: 10px;
      top: 10px;
      display: flex;
      .choose_area {
        margin-right: 10px;
        height: 32px;
        align-items: center;
        display: flex;
        background: url("@/assets/monitoring/inputBack.png") no-repeat center center;
        background-size: 105% 100%;

        border: 1px solid #fff;
        border-radius: 5px;
        padding: 6px 10px;
        color: #fff;
        :deep(.el-radio) {
          color: white;
        }
      }
      :deep(.el-select) {
        width: 330px;
        .el-input__wrapper {
          color: #fff !important;
          background: url("@/assets/monitoring/inputBack.png") no-repeat center center;
          background-size: 105% 100%;
        }
        .el-input__inner {
          color: #fff !important;
          background-color: transparent;
          
        }
        .select_title {
          color: #fff !important;
        }
      }

      .select_title {
        font-size: 16px;
        font-weight: 500;
        letter-spacing: 0px;
        line-height: 26.06px;
      }

      .select_title2 {
        margin-top: 2px;
        font-size: 14px;
        font-weight: 400;
        letter-spacing: 0px;
        line-height: 23.17px;
        color: rgba(115, 121, 133, 1);
      }

      .el_icon {
        cursor: pointer;
        margin-left: auto;
        margin-right: 10px;
        margin-bottom: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 16px;
        height: 16px;
      }

      .empty_list {
        transition: 0.5s all;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 10px;
        height: 20px;
        color: var(--el-text-color);
        padding-bottom: 5px;
      }

      .empty_list2 {
        transition: 0.5s all;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 10px;
        height: 0px;
        color: var(--el-text-color);
        overflow: hidden;
      }

      .infiniteMenu {
        padding-top: 10px;
        margin-top: 5px;
        margin-left: auto;
        width: 194px;
        border-radius: 4px;
        background-color: var(--el-bg-color);

        .li_title {
          cursor: default;
          padding: 3px 5px;
          margin-left: 10px;
          width: 75px;
          height: 27px;
          border-radius: 4px;
          background-color: rgba(67, 207, 124, 1);
          color: #fff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .infinite-list {
          max-height: 300px;
          transition: all 1s;
          padding: 0;
          margin: 0;
          list-style: none;

          span {
            width: 100%;
            display: block;
            display: flex;
            justify-content: center;
            font-size: 10px;
          }
        }

        .infinite-list::-webkit-scrollbar {
          display: none;
        }

        .infinite-list .infinite-list-item {
          display: flex;
          align-items: center;
          justify-content: space-around;
          width: 95%;
          height: 50px;
          opacity: 1;
          border-radius: 4px;
          background: rgba(199, 242, 216, 1);
          margin: 8px 5px;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
          color: #fff;
        }

        .infinite-list .infinite-list-item2 {
          display: flex;
          align-items: center;
          justify-content: space-around;
          width: 95%;
          height: 50px;
          opacity: 1;
          border-radius: 4px;
          background-color: var(--el-bg-color);
          margin: 8px 5px;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
          color: var(--el-text-color);
        }

        .infinite-list .infinite-list-item + .list-item {
          margin-top: 10px;
        }
      }

      .infiniteMenu2 {
        padding-top: 10px;
        margin-top: 5px;
        margin-left: auto;
        width: 194px;
        border-radius: 4px;
        background-color: var(--el-bg-color);

        .li_title {
          cursor: default;
          padding: 3px 5px;
          margin-left: 10px;
          width: 75px;
          height: 27px;
          border-radius: 4px;
          background-color: rgba(67, 207, 124, 1);
          color: #fff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .infinite-list {
          transition: all 1s;
          max-height: 0px;
          padding: 0;
          margin: 0;
          list-style: none;

          span {
            width: 100%;
            display: block;
            display: flex;
            justify-content: center;
            font-size: 10px;
          }
        }

        .infinite-list::-webkit-scrollbar {
          display: none;
        }

        .infinite-list .infinite-list-item {
          display: flex;
          align-items: center;
          justify-content: space-around;
          width: 95%;
          height: 50px;
          opacity: 1;
          border-radius: 4px;
          background: rgba(199, 242, 216, 1);
          margin: 8px 5px;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
          color: #fff;
        }

        .infinite-list .infinite-list-item2 {
          display: flex;
          align-items: center;
          justify-content: space-around;
          width: 95%;
          height: 50px;
          opacity: 1;
          border-radius: 4px;
          background-color: var(--el-bg-color);
          margin: 8px 5px;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
          color: var(--el-text-color);
        }

        .infinite-list .infinite-list-item + .list-item {
          margin-top: 10px;
        }
      }
    }
  }
}

:deep(.leaflet-popup-content-wrapper) {
  background-color: var(--el-bg-color);
  color: var(--color-scheme);

  .popup_outsiders {
    opacity: 1;
    border-radius: 4px;
    width: 241px;

    .popupTitle {
      line-height: 27px;
      width: 97px;
      height: 27px;
      opacity: 1;
      border-radius: 8px;
      color: #fff;
      background-color: rgba(67, 207, 124, 1);
      overflow: hidden;
      margin-left: auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 5px;
      padding-left: 10px;
    }

    .popupMain {
      display: flex;
      justify-content: space-around;
      align-items: center;
      font-size: 16px;
      font-weight: 400;
      letter-spacing: 0px;
      height: 27px;
      margin-bottom: 10px;
    }

    .popupSn {
      display: flex;
      justify-content: center;
      align-items: center;

      .popupSn_inner {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 33px;
        width: 222px;
        opacity: 1;
        border-radius: 16px;
        background: rgba(233, 242, 242, 1);
        font-size: 16px;
        font-weight: 400;
        letter-spacing: 0px;
        color: rgba(0, 186, 173, 1);

        div:nth-child(1) {
          margin-right: 20px;
        }
      }
    }

    .popupArea {
      margin-top: 5px;
      margin-bottom: 5px;
      display: flex;
      justify-content: space-between;
      height: 40px;

      .left {
        display: flex;
        justify-content: space-around;
        align-items: center;

        height: 100%;

        .leftArea {
          margin-right: 5px;
          font-size: 16px;
          font-weight: 600;
        }

        .leftArea::before {
          margin-right: 5px;
          content: "";
          display: inline-block;
          width: 20px;
          height: 20px;
          background: url(@/assets/jobManage/@3x.png);
          background-size: cover;
          vertical-align: middle;
        }

        .rightArea {
          font-size: 16px;
          font-weight: 400;
          letter-spacing: 0px;
          line-height: 23.17px;
          color: rgba(166, 166, 166, 1);
          text-align: left;
          vertical-align: top;
        }
      }

      .right {
        display: flex;
        justify-content: space-around;
        align-items: center;

        .leftArea::before {
          margin-right: 5px;
          content: "";
          display: inline-block;
          width: 20px;
          height: 20px;
          background: url(@/assets/jobManage/falsh@3x.png);
          background-size: cover;
          vertical-align: middle;
        }

        .rightArea {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 50px;
          height: 23px;
          opacity: 1;
          border-radius: 16px;
          background: rgba(0, 186, 173, 0.34);
          font-size: 16px;
          font-weight: 400;
          letter-spacing: 0px;
          line-height: 23.17px;
          color: rgba(0, 125, 117, 1);
        }
      }
    }

    .popupArea2 {
      margin-bottom: 9px;

      .left {
        font-size: 16px;
        font-weight: 400;
        letter-spacing: 0px;
        line-height: 23.17px;
        color: rgba(166, 166, 166, 1);
        text-align: left;
        vertical-align: top;
      }

      .right {
        font-size: 16px;
        font-weight: 400;
        letter-spacing: 0px;
        line-height: 23.17px;

        text-align: left;
        vertical-align: top;
      }
    }

    .popupBottom {
      position: relative;
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      flex-wrap: nowrap;

      .leftt {
        white-space: nowrap;
        font-size: 16px;
        line-height: 18px;

        margin-right: 5px;
      }

      .left::after {
        content: "";
        display: inline-block;
        margin-right: 5px;
        width: 16px;
        height: 16px;
        background: url(@/assets/jobManage/right@3x.png);
        background-size: cover;
        vertical-align: middle;
      }

      .rightt {
        white-space: nowrap;
        margin-left: 5px;
        font-size: 16px;
        line-height: 18px;

        text-align: left;
        vertical-align: top;
      }

      .right::before {
        margin-left: 5px;
        content: "";
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url(@/assets/jobManage/right@3x.png);
        background-size: cover;
        vertical-align: middle;
      }
    }
  }
}

:deep(.leaflet-marker-icon) {
  .map-circle-name {
    width: 50px;
    height: 50px;
    opacity: 1;
    border-radius: 50%;
    background-image: url("../taskManage/image.png@3x.png");
    background-color: #fff;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
}

:deep(.el-checkbox__input.is-checked
    .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner) {
  border-color: rgba(67, 207, 124, 1) !important;
  background-color: rgba(67, 207, 124, 1) !important;
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
.map_utils {
  background: url("@/assets/monitoring/inputBack.png") no-repeat center center;
  background-size: 105% 100%;

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
</style>
