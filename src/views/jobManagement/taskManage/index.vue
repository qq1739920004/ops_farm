<!--  -->
<template>
  <div class="page7_child6_container">
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
    <div class="color_list" v-show="radio2 === 2">
      <div class="out_area">
        <div class="cycle1"></div>
        <div>{{ t("job.fix") }}</div>
      </div>
      <div class="out_area">
        <div class="cycle2"></div>
        <div>{{ t("job.others") }}</div>
      </div>
      <div class="out_area">
        <div class="cycle3"></div>
        <div>{{ t("job.SatelliteBase") }}</div>
      </div>
    </div>
    <div class="head_top">
      <div class="left">
        <div class="choose_area">
          <div class="my-2 ml-4"></div>
          <el-radio-group v-model="radio2" @change="changeRadio">
            <el-radio :label="1">{{ t("job.lines") }}</el-radio>
            <el-radio :label="2">{{ t("job.point") }}</el-radio>
          </el-radio-group>
        </div>
        <!-- <el-select
          style="width: 270px; margin-right: 10px"
          v-model="pageInfo.companyId"
          :placeholder="$t('work.pleaseSelect')"
          @change="changeBlur1"
          :disabled="dealerList.length === 1 ? true : false"
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
        </el-select> -->
        <el-select-v2
          filterable
          v-model="pageInfo.carId"
          :options="optionsList"
          :placeholder="$t('work.pleaseSelect')"
          @change="changeBlur2"
        >
        </el-select-v2>
        <div class="time">
          <div class="demo-date-picker">
            <div class="block">
              <el-date-picker
                v-model="timeRange"
                type="daterange"
                :disabled-date="disabledDate"
                start-placeholder="Start Date"
                end-placeholder="End Date"
                @change="changteTime"
                :default-time="defaultTime"
              />
            </div>
          </div>
        </div>
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
import { ElMessage } from "element-plus";
import { getCarDealerList_API, paddyWorkList_API } from "@/api/jobManagement/index";
import { carDealer_API } from "@/api/machineryList/index";
import { historyList_path } from "@/api/jobManagement/taskManage/index";
import gcoord from "gcoord";
import { mapTitleLayers } from "./mapTitleLayers";
import c from "@/assets/jobManage/c.png";
import SvgIcon from "@/components/SvgIcon/index.vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
const { t } = useI18n();
const radio2 = ref(1);
const route = useRoute();
// 提交的车辆数组
const ids = ref<any>([]);
const isShow = ref<boolean>(true);
const disabledDate = (time: any) => {
  return time.getTime() >= Date.now();
};
const defaultTime = ref<[Date, Date]>([
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
]);
const L = window.L;
// 提交数据
const pageInfo = reactive<any>({
  carId: "",
  name: "",
  companyId: "",
  currentPage: 1,
  pageSize: 5000,
});
const total = ref<number>(0);
const CarDealerList = ref<dealerCarObj[]>([]);
const dealerList = ref<carDealerObj[]>([]);
const paddyWorkList = ref<paddyWorkObj[]>([]);

onMounted(() => {
  initMap();
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
// let ViewGroup = <any>null;
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
  // {
  //   mapName: "天地图",
  //   mapId: 3,
  // },
]);
const markerCollect = <any>{};
const changteTime = () => {
  clearAllMarkers();
  Object.assign(markerCollect, {});
  Object.assign(markerCollect2, {});
  radio2.value = 1;

  pageInfo.currentPage = 1;
  pageInfo.pageSize = 5000;
  ids.value = [];
  paddyWorkList.value = [];
  loadValue.value = [];
  getPaddyWorkList(true);
};
function timestampToTime(timestamp: any) {
  var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + "-";
  var M =
    (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
  var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  var h = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  var m = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ":";
  var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
}
const markerCollect2 = <any>{};
const timeRange = ref<any>([
  new Date(new Date().setHours(0, 0, 0)).getTime() - 3600 * 1000 * 24 * 15,
  new Date(new Date().setHours(23, 59, 59)).getTime(),
]);
const changeRadio = (item: any) => {
  clearAllMarkers();
  if (item === 1) {
    let paddyListIdList = paddyWorkList.value.map((item) => {
      return item.id;
    });
    ids.value = paddyListIdList;

    
    setTimeout(() => {
      drawLine(paddyListIdList, loadValue.value);
    }, 100);
  }
  if (item === 2) {
    let paddyListIdList = paddyWorkList.value.map((item) => {
      return item.id;
    });
    ids.value = paddyListIdList;

    setTimeout(() => {
      drawSolLine(paddyListIdList, loadValue.value);
    }, 100);
  }
};
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
  //  ViewGroup = L.layerGroup().addTo(map);

  //   // 显示/隐藏 图层组

  //   ViewGroup.eachLayer((item:any) => {
  //     item.setOpacity(1);
  //   });

  //   ViewGroup.eachLayer((item:any) => {
  //     item.setOpacity(0);
  //   });
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
// const changeTileLayer = (mapName = 'Google', mapType = 'Satellite') => {
//     try {
//         if (!map) {
//             console.warn('未初始化底图实例')
//             return
//         }
//         // if (tileLayer.length) {
//         //     tileLayer.forEach((layer: any) => layer.remove())
//         //     Object.assign(tileLayer, [])
//         // }
//         let mapUrl = tileUrl[mapName][mapType]
//         let options: any = {}
//         options.subdomains = tileUrl[mapName]['Subdomains']
//         if ('tms' in tileUrl[mapName]) {
//             options.tms = tileUrl[mapName]['tms']
//         }
//         if ('key' in tileUrl[mapName]) {
//             options.key = tileUrl[mapName]['key']
//         }
//         for (let key in mapUrl) {
//             // let layer = L.tileLayer(mapUrl[key], options).addTo(map)
//             // tileLayer.push(layer as never)
//             L.tileLayer(mapUrl[key], options).addTo(map);
//         }
//     } catch (error) {
//         console.log(error)
//     }
// }

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

// 农业分类
// const workTypeReflect = reactive<any>({
//   1: t("devicelist.status1"),
//   2: t("devicelist.status2"),
//   3: t("devicelist.status3"),
//   4: t("devicelist.status4"),
//   5: t("devicelist.status5"),
//   6: t("devicelist.status6"),
// });
// 画线
// const middlePoint = ref<any>([0, 0]);
// const middleKey = ref<number>(0);
const loadValue = ref<any>([]);
const tranpatrnt = ref<any>([]);
const emptyIds = ref(false);
const loadWorkData = (workId: any) => {
  historyList_path(workId)
    .then((res) => {
      loadValue.value.push(res);
      let key = Object.keys(res.data);
      getMachineInfo();
      const area: any = res.data["workedArea"];
      const time: any = res.data["paddyDuration"];

      const mil: any = res.data["workMileage"];
      const mile: any = Math.floor(mil * 100) / 100000;
      key.map((item, index) => {
        if (
          !item.length ||
          res.data[item] === null ||
          !res.data[item].length ||
          item === "workMileage" ||
          item === "workedArea" ||
          item === "paddyDuration"
        ) {
          emptyIds.value = true;

          return;
        } else {
          let nameTitle: any = item;
          emptyIds.value = false;
          if (res.data[item].length === 0) {
            ElMessage.warning(`${item}暂无作业数据`);
          } else {
            let PointListTransed = res.data[item].map((item2: any) => {
              return coorTransform(
                [item2.posX as never, item2.posY as never],
                mapId.value
              ); // 转换坐标
            });

            let line = L.polyline(PointListTransed, { color: "#00ff00", weight: 8 })
              .bindPopup(
                `<div class="map_popup">
              <div> <div class="name">${nameTitle}</div>
             <div class="value">${area}${t("job.mu")}</div>
             </div>
              <div> <div >${t("job.acTime")}</div>
             <div class="value">${time}</div>
             </div>
              <div> <div >${t("job.milerage")}</div>
             <div class="value">${mile}km</div>
             </div>
             </div>`
              )
              .addTo(map);
            tranpatrnt.value.push(PointListTransed);
            saveMarker(workId, [{ markerObj: line, name: "lines" }]);
            map.fitBounds(line.getBounds(), { maxZoom: 16 });
          }
        }
      });
    })
    .catch(() => {
      return false;
    });
};
const drawLine = (workId: any, ress: any) => {
  const res = ress;
  res.map((it: any, index: any) => {
    let key = Object.keys(it.data);
    const area: any = it.data["workedArea"];
    const time: any = it.data["paddyDuration"];
    const mil: any = it.data["workMileage"];
    const mile: any = Math.floor(mil * 100) / 100000;
    getMachineInfo();
    key.map((item) => {
      if (
        !item.length ||
        it.data[item] === null ||
        !it.data[item].length ||
        item === "workMileage" ||
        item === "workedArea" ||
        item === "paddyDuration"
      ) {
        emptyIds.value = true;
        // ElMessage.warning(`${item}暂无作业数据`);
        return;
      } else {
        let nameTitle: any = item;
        emptyIds.value = false;
        let PointListTransed = it.data[item].map((item2: any) => {
          return coorTransform([item2.posX as never, item2.posY as never], mapId.value); // 转换坐标
        });
        tranpatrnt.value.push(PointListTransed);
        let line = L.polyline(PointListTransed, { color: "#00ff00", weight: 8 })
          .bindPopup(
            `<div class="map_popup">
              <div> <div class="name" >${nameTitle}</div>
             <div class="value">${area}${t("job.mu")}</div>
             </div>
              <div> <div >${t("job.acTime")}</div>
             <div class="value">${time}</div>
             </div>
              <div> <div >${t("job.milerage")}</div>
             <div class="value">${mile}km</div>
             </div>
             </div>`
          )
          .addTo(map);

        saveMarker(workId[index], [{ markerObj: line, name: "lines" }]);
      }
    });
  });
};
let eleDataObject = <any>[];
const drawSolLine = (workId: any, ress: any) => {
  const res = ress;

  res.map((it: any, index: any) => {
    let key = Object.keys(it.data);
    const area: any = it.data["workedArea"];
    const time: any = it.data["paddyDuration"];
    const mil: any = it.data["workMileage"];
    const mile: any = Math.floor(mil * 100) / 100000;
    getMachineInfo();
    key.map((item) => {
      if (
        !item.length ||
        it.data[item] === null ||
        !it.data[item].length ||
        item === "workMileage" ||
        item === "workedArea" ||
        item === "paddyDuration"
      ) {
        emptyIds.value = true;
        // ElMessage.warning(`${item}暂无作业数据`);
        return;
      } else {

        const solSatList: any = [];
        let nameTitle: any = item;
        emptyIds.value = false;
        let PointListTransed = it.data[item].map((item2: any) => {
          solSatList.push(item2.solStat);
          return coorTransform([item2.posX as never, item2.posY as never], mapId.value); // 转换坐标
        });
        tranpatrnt.value.push(PointListTransed);
        let line = L.polyline(PointListTransed, { color: "#5C5C5C", weight: 1 })
          .bindPopup(
            `<div class="map_popup">
              <div> <div class="name" >${nameTitle}</div>
             <div class="value">${area}${t("job.mu")}</div>
             </div>
              <div> <div >${t("job.acTime")}</div>
             <div class="value">${time}</div>
             </div>
              <div> <div >${t("job.milerage")}</div>
             <div class="value">${mile}km</div>
             </div>
             </div>`
          )
          .addTo(map);
        saveMarker2(workId[index], [
          {
            markerObj: line,
            name: "lines",
          },
        ]);
        PointListTransed.map((item3: any, index: any) => {
          if (solSatList[index] === 4) {
            let line2 = L.circle(item3, {
              radius: 1,
              color: "#00FF00",
              fillOpacity: 1,
            }).addTo(map);
            eleDataObject.push(line2);
          } else if (solSatList[index] === 15) {
            let line2 = L.circle(item3, {
              radius: 1,
              color: "#3F48CC",
              fillOpacity: 1,
            }).addTo(map);
            eleDataObject.push(line2);
          } else {
            let line2 = L.circle(item3, {
              radius: 1,
              color: "#ED1C24",
              fillOpacity: 1,
            }).addTo(map);
            eleDataObject.push(line2);
          }
        });
      }
    });
  });
};

// const drawLine = (workId: any, res: any) => {
//   let key = Object.keys(res.data);
//   getMachineInfo();
//   key.map((item) => {
//     if (!item.length || res.data[item] === null || !res.data[item].length) {
//       emptyIds.value = true;
//       // ElMessage.warning(`${item}暂无作业数据`);
//       return;
//     } else {
//       emptyIds.value = false;
//       let PointListTransed = res.data[item].map((item2: any) => {
//         return coorTransform([item2.posX as never, item2.posY as never], mapId.value); // 转换坐标
//       });
//       tranpatrnt.value.push(PointListTransed);
//       let line = L.polyline(PointListTransed, { color: "#00ff00", weight: 8 })
//         .bindPopup("111")
//         .addTo(map);
//       saveMarker(workId, [{ markerObj: line, name: "lines" }]);
//       // 取中间点
//       // {
//       //   middlePoint.value = [0, 0];
//       //   middleKey.value = 0;
//       //   PointListTransed.forEach((item: any, index: any) => {
//       //     middlePoint.value[0] = middlePoint.value[0] + item[0];
//       //     middlePoint.value[1] = middlePoint.value[1] + item[1];
//       //     middleKey.value = index + 1;
//       //   });
//       //   middlePoint.value[0] = middlePoint.value[0] / middleKey.value;
//       //   middlePoint.value[1] = middlePoint.value[1] / middleKey.value;
//       // }
//       //   let htmlStr = '<p><div class="map-circle-name"></div><p/>';
//       //   let icon = L.divIcon({
//       //     html: htmlStr,
//       //     iconSize: [98, 98],
//       //     className: "iconImage",
//       //   });
//       //   let marker = L.marker(middlePoint.value, { icon: icon }).addTo(map);
//       // map.setView(middlePoint.value, 18);
//       //   line
//       //     .bindPopup(
//       //       `<div class="popup_outsiders">
//       //         <div class="popupTitle">
//       //                 ${machine[workId].name}
//       //         </div>
//       //         <div class="popupMain">
//       //             <div><svg t="1693188673815" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4052" width="22" height="22"><path d="M370.513 874.855c-48.815-20.02-92.685-50.082-129.215-87.716-69.276-71.384-112.122-170.011-112.122-278.945 0-108.918 42.846-207.544 112.122-278.929 69.836-71.953 170.267-107.93 270.706-107.93 100.423 0 200.861 35.977 270.688 107.93 69.276 71.384 112.131 170.01 112.131 278.929 0 108.934-42.855 207.561-112.131 278.945-36.52 37.633-80.399 67.694-129.205 87.716-45.187 18.524-93.334 27.811-141.483 27.811-48.166 0-96.298-9.288-141.491-27.811l0 0zM512.005 199.998c-80.213 0-160.425 28.732-216.19 86.211-33.202 34.203-58.802 76.253-73.97 123.216-4.189 15.772 1.398 23.218 16.742 22.364 50.317-1.991 158.745-3.58 181.017-4.735-19.13 22.356-30.724 51.706-30.724 83.843 0 35.031 13.779 66.757 36.06 89.716 7.949 8.2 16.994 15.277 26.875 20.983 18.62 10.778 39.397 16.165 60.19 16.174 20.785-0.008 41.563-5.396 60.181-16.174 9.881-5.707 18.919-12.783 26.875-20.983 22.281-22.959 36.06-54.684 36.06-89.716 0-32.136-11.603-61.488-30.716-83.843 22.263 1.155 130.691 2.744 181.001 4.735 15.345 0.853 20.94-6.593 16.742-22.364-15.159-46.962-40.762-89.012-73.971-123.216-55.764-57.48-135.968-86.211-216.174-86.211l0 0zM581.084 439.837c-35.645-36.729-102.534-36.729-138.178 0-17.676 18.215-28.613 43.389-28.613 71.185 0 27.811 10.937 52.978 28.613 71.199 6.813 7.011 14.615 13.002 23.19 17.704 28.483 15.645 63.324 15.645 91.808 0 8.566-4.702 16.377-10.694 23.182-17.704 17.684-18.222 28.62-43.389 28.62-71.199 0.001-27.794-10.936-52.969-28.62-71.185l0 0zM529.738 548.203c13.365-6.761 22.564-20.933 22.564-37.307 0-17.353-10.337-32.221-25.008-38.428-9.71-4.108-20.875-4.108-30.586 0-14.672 6.208-25.008 21.076-25.008 38.428 0 16.373 9.191 30.546 22.555 37.307 11.074 5.588 24.423 5.588 35.483 0l0 0zM575.449 817.192c58.964-12.818 111.669-43.147 152.728-85.459 42.896-44.2 73.092-101.47 84.509-165.509 4.109-17.369-3.143-22.69-15.848-22.272-25.626-0.56-51.261-0.452-75.691 4.293-87.041 16.909-118.171 60.19-133.574 159.829-5.595 36.193-9.151 78.547-12.123 109.118l0 0zM448.541 817.192c-2.963-30.572-6.528-72.925-12.114-109.118-15.404-99.638-46.54-142.919-133.583-159.829-24.423-4.745-50.065-4.853-75.691-4.293-12.699-0.418-19.957 4.902-15.841 22.272 11.408 64.039 41.614 121.309 84.501 165.509 41.068 42.312 93.764 72.64 152.728 85.459z" fill="#4ce277" p-id="4053"></path></svg></div>
//       //             <div>${machine[workId].carName}</div>
//       //             <div><svg t="1693188945416" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6118" width="22" height="22"><path d="M511.913993 941.605241c-255.612968 0-385.311608-57.452713-385.311608-170.810012 0-80.846632 133.654964-133.998992 266.621871-151.88846L393.224257 602.049387c-79.986561-55.904586-118.86175-153.436587-118.86175-297.240383 0-139.33143 87.211154-222.586259 233.423148-222.586259l7.912649 0c146.211994 0 233.423148 83.254829 233.423148 222.586259 0 54.184445 0 214.67361-117.829666 297.412397l-0.344028 16.685369c132.966907 18.061482 266.105829 71.041828 266.105829 151.716445C897.225601 884.152528 767.526961 941.605241 511.913993 941.605241zM507.957668 141.567613c-79.470519 0-174.250294 28.382328-174.250294 163.241391 0 129.698639 34.230808 213.469511 104.584579 255.784982 8.944734 5.332437 14.277171 14.965228 14.277171 25.286074l0 59.344868c0 15.309256-11.524945 28.0383-26.662187 29.414413-144.319839 14.449185-239.959684 67.429531-239.959684 95.983874 0 92.199563 177.346548 111.637158 325.966739 111.637158 148.792206 0 325.966739-19.26558 325.966739-111.637158 0-28.726356-95.639845-81.534688-239.959684-95.983874-15.48127-1.548127-27.006215-14.621199-26.662187-30.102469l1.376113-59.344868c0.172014-10.148833 5.676466-19.437594 14.277171-24.770032 70.525785-42.487485 103.208466-123.678145 103.208466-255.784982 0-135.031077-94.779775-163.241391-174.250294-163.241391L507.957668 141.567613 507.957668 141.567613z" fill="#4ce277" p-id="6119"></path></svg></div>
//       //             <div>${machine[workId].userName}</div>
//       //         </div>
//       //         <div class="popupSn"> <div class="popupSn_inner"><div>SN号:</div> <div>${
//       //           machine[workId].sn
//       //         }</div></div></div>
//       //         <div class="popupArea">
//       //         <div class="left">
//       //             <div class="leftArea">${machine[workId].workedArea}</div>
//       //             <div class="rightArea">亩</div>
//       //         </div>
//       //         <div class="right">
//       //             <div class="leftArea"></div>
//       //             <div class="rightArea">${
//       //               workTypeReflect[machine[workId].worktype] || "/"
//       //             }</div>
//       //         </div>
//       //         </div>
//       //         <div class="popupArea2"> <span class="left">农具：</span> <span class="right">${
//       //           machine[workId].toolName || "/"
//       //         }</span></div>
//       //         <div class="popupBottom"> <div class="leftt">${
//       //           machine[workId].createtime
//       //         }</div> <span class="left"></span><span class="left"></span><span class="left"></span></div>
//       //         <div class="popupBottom"><span class="right"></span><span class="right"></span><span class="right"></span> <span class="rightt">${
//       //           machine[workId].updatetime
//       //         }</span></div>
//       //         </div>`
//       //     )
//       //     .addTo(map)
//       //     .openPopup();
//       //   saveMarker(workId, [
//       //     { markerObj: line, name: "lines", markerObj2: marker, name2: "picture" },
//       //   ]);
//     }
//   });
//   if (ids.value.length >= 2 || emptyIds.value === true) {
//     map.fitBounds(tranpatrnt.value);
//   }
// };
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
// const addPathAB = (item: any) => {
//   if (item.lineptax && item.lineptay && item.lineptbx && item.lineptby) {
//     try {
//       let pointA = coorTransform(
//         [item.lineptay as never, item.lineptax as never],
//         mapId.value
//       );
//       let pointB = coorTransform(
//         [item.lineptby as never, item.lineptbx as never],
//         mapId.value
//       );
//       let l1 = L.latLng(item.lineptax, item.lineptay);
//       let l2 = L.latLng(item.lineptbx, item.lineptby);
//       // let distance = l1.distanceTo(l2).toFixed(0);
//       let iconA = L.icon({
//         iconUrl: a,
//         iconAnchor: [12, 30],
//         popupAnchor: [0, -30],
//       });
//       let iconB = L.icon({
//         iconUrl: b,
//         iconAnchor: [12, 30],
//         popupAnchor: [0, -30],
//       });
//       let markerA = L.marker(pointA as never, { icon: iconA }).addTo(map);
//       let markerB = L.marker(pointB as never, { icon: iconB }).addTo(map);
//       let line = L.polyline([pointA, pointB], {
//         color: "red",
//         dashArray: [9, 9],
//       })
//         // .bindTooltip(`AB点距离 ${distance} 米`, { permanent: true })
//         .addTo(map);
//       map.fitBounds([pointA, pointB]);
//       saveMarker2(item.id, [
//         {
//           markerObj1: markerA,
//           name: "markerA",
//           markerObj2: markerB,
//           name2: "markerB",
//           markerObj3: line,
//           name3: "lines",
//         },
//       ]);
//     } catch (err) {
//       console.log(err);
//     }
//   }
// };
// 删除区域
// const removeMarker = (workId: any) => {
//   try {
//     if (markerCollect[workId]["marker"].length) {
//       let a = markerCollect[workId]["marker"];
//       a.forEach((item: any) => {
//         console.log(item);
//         if (item.markerObj) {
//           map.removeLayer(item.markerObj);
//           // map.removeLayer(item.markerObj2)
//         }
//         if (item.markerObj2) {
//           map.removeLayer(item.markerObj2);
//         }
//       });
//       markerCollect[workId]["marker"] = [];
//     }
//     if (markerCollect2[workId]["marker"].length) {
//       let a = markerCollect2[workId]["marker"];
//       a.forEach((item: any) => {
//         if (item.markerObj1) {
//           map.removeLayer(item.markerObj1);
//           // map.removeLayer(item.markerObj2)
//         }
//         if (item.markerObj2) {
//           map.removeLayer(item.markerObj2);
//         }
//         if (item.markerObj3) {
//           map.removeLayer(item.markerObj3);
//         }
//         // map.removeLayer(item.markerObj)
//       });
//       markerCollect2[workId]["marker"] = [];
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };
// const hasMarker = (workId: any) => {
//   return markerCollect[workId]["marker"].length > 0;
// };
const machine = reactive<any>({});
const getMachineInfo = () => {
  paddyWorkList.value.forEach((element: any) => {
    if (ids.value.includes(element.id)) {
      machine[element.id] = element;
    }
  });
};
// const hasMarkerField = (workId: any, field: any) => {
//   let a = markerCollect[workId]["marker"].find((element: any) => element.name === field);
//   if (a && a[field] !== null) {
//     return true;
//   } else {
//     return false;
//   }
// };
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
    eleDataObject.forEach((item: any) => {
      map.removeLayer(item);
    });
    // for (let key in markerCollect2) {
    //   if (Object.keys(markerCollect2).length) {
    //     if (markerCollect2[key]["marker"].length) {
    //       markerCollect2[key]["marker"].forEach((item: any) => {
    //         if (item && item.markerObj1) {
    //           map.removeLayer(item.markerObj1);
    //           if (item && item.markerObj2) {
    //             map.removeLayer(item.markerObj2);
    //             if (item && item.markerObj3) {
    //               map.removeLayer(item.markerObj3);
    //             }
    //           }
    //         }
    //       });
    //     }
    //   }
    // }
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
    pageInfo.companyId = res.data[0].id;
  }
  getDealerCarList();
};
// const changeisShow = (val: boolean) => {
//   isShow.value = val;
// };
getDealerList();
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
      label: item.npn ? item.sn + "(" + item.npn + ")" : item.sn,
    }));

    pageInfo.carId = route.query.carId ? +route.query.carId : "" || res.data[0].id;
    getPaddyWorkList(true);
  }
};
const getPaddyWorkList = async (flag: Boolean) => {
  const res: paddyWorkListResponsenumber = await paddyWorkList_API({
    ...pageInfo,
    st: timestampToTime(timeRange.value[0]),
    et: timestampToTime(timeRange.value[1]),
  });
  paddyWorkList.value = res.data.records;
  if (res.data.records.length === 0) {
    ElMessage.warning(`暂无作业数据`);
    loadValue.value = [];
  }
  let tem = res.data.records;
  tem.forEach((element) => {
    markerCollect[element.id] = { marker: [] };
    markerCollect2[element.id] = { marker: [] };
    // element.checked = false;
  });
  if (paddyWorkList.value.length) {
    let paddyListIdList = paddyWorkList.value.map((item) => {
      return item.id;
    });
    total.value = res.data.total;
    if (flag === true) {
      // ids.value.push(paddyWorkList.value[0].id as never);
      ids.value = paddyListIdList;
      // paddyWorkList.value[0].checked = true;
      loadValue.value = [];
      paddyListIdList.forEach((item: any) => {
        loadWorkData(item);
      });

      // let subItem = paddyWorkList.value.find((data) => {
      //   if (data.id === paddyWorkList.value[0].id) {
      //     return data;
      //   }
      // });
      // addPathAB(subItem);
    }
  }
};
// const changeBlur1 = () => {
//   getDealerCarList();
//   clearAllMarkers();
//   Object.assign(markerCollect, {});
//   Object.assign(markerCollect2, {});
//   radio2.value = 1;
//   ids.value = [];
//   paddyWorkList.value = [];
//   pageInfo.currentPage = 1;
//   pageInfo.pageSize = 5000;
//   pageInfo.carId = "请选择";
// };
const changeBlur2 = () => {
  clearAllMarkers();
  Object.assign(markerCollect, {});
  Object.assign(markerCollect2, {});
  radio2.value = 1;
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
//       if (!oldVal.includes(newVal[i]) && i !== 0) {
//         const res: any = await historyList_path(newVal[i]);
//         console.log(newVal[i]);
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
// watch(
//   () => paddyWorkList.value,
//   (newData) => {
//     if (newData.length) {
//       Object.assign(machine, {});
//       newData.forEach((subItem) => {
//         if (subItem.checked) {
//           //   if (!hasMarker(subItem.id)) {
//           // addPathAB(subItem)
//           // }
//           // if (!hasMarkerField(subItem.id, 'lines')) {
//           //      loadWorkData(subItem.id)
//           // }
//         } else {
//           removeMarker(subItem.id);
//         }
//       });
//     }
//   },
//   { deep: true }
// );
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

.page7_child6_container {
  width: 100%;
  height: 100%;
  position: relative;

  #child6_map {
    height: 100%;
    width: 100%;
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
        background-size: 105% 105%;
        .el-select-v2__suffix {
          color: #fff !important;
        }
        .el-select-v2__placeholder {
          color: #fff !important;
          background-color: transparent;
        }
        .el-select-v2__placeholder::before {
          color: #fff !important;
        }

        .el-select-v2__combobox-input {
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
        background-size: 105% 105%;

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
          background-size: 105% 105%;
        }
        .el-input__inner {
          color: #fff !important;
          background-color: transparent;
          &::placeholder {
            color: #fff !important;
          }
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
.color_list {
  position: absolute;
  z-index: 999;
  bottom: 10px;
  right: 10px;
  min-width: 142px;
  height: 90px;
  opacity: 1;
  color: black;
  border-radius: 5px;
  font-size: 14px;
  color: white;
  background-color: rgba(18, 65, 56, 0.63);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  border: 1px solid #ffffff;
  .out_area {
    height: 33%;
    width: 100%;
    display: flex;
    align-items: center;
  }
  .cycle1 {
    height: 15px;
    width: 15px;
    border-radius: 50%;
    background-color: #00ff00;
    margin: 0 6px 0 5px;
  }
  .cycle2 {
    height: 15px;
    width: 15px;
    border-radius: 50%;
    background-color: #ed1c24;
    margin: 0 6px 0 5px;
  }
  .cycle3 {
    height: 15px;
    width: 15px;
    border-radius: 50%;
    background-color: #3f48cc;
    margin: 0 6px 0 5px;
  }
}
:deep(.map_popup) {
  width: 220px;

  color: #fff;
  .name {
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
  }
  div {
    width: 100%;
    margin-top: 5px;
    height: 30px;
    display: flex;
    align-items: center;
    div {
      width: 100px;

      margin-right: 20px;
    }
  }
}
:deep(.leaflet-popup) {
  width: 220px;
  color: white;
  .leaflet-popup-content-wrapper {
    background-color: rgba(0, 0, 0, 0.67);
    color: var(--color-scheme);
  }

  .leaflet-popup-content {
    width: auto !important;
  }

  .leaflet-popup-tip {
    background-color: rgba(0, 0, 0, 0.67);
  }
}
.time {
  margin-left: 10px;
  height: 32px;
  background: url("@/assets/monitoring/inputBack.png");
  background-size: 100% 100%;
  :deep(.el-input__wrapper) {
    background: transparent !important;
    box-shadow: none;
    padding: 0;
    color: white;

    .el-range-separator,
    .el-range-input {
      color: #fff;
    }
    .el-icon {
      color: #4cb04f;
      margin-left: 5px;
    }
  }
}
:deep(.el-select) {
  --el-select-input-focus-border-color: transparent;
}
</style>
