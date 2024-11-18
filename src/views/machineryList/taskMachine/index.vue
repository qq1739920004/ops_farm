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
    <div class="color_list">
      <div class="out_area">
        <div class="cycle1"></div>
        <div>{{ $t('job.fix') }}</div>
      </div>
      <div class="out_area">
        <div class="cycle2"></div>
        <div>{{ $t('job.others') }}</div>
      </div>
      <div class="out_area">
        <div class="cycle3"></div>
        <div>{{ $t('job.SatelliteBase') }}</div>
      </div>
    </div>
    <div class="demo-date-picker">
      <div class="top_sn">{{ $t("work.historicalTrack") }}-{{ pageInfoData.sn }}</div>
      <div class="block">
        <span>{{ $t("work.startDate") }}</span>
        <el-date-picker
          class="date_picker"
          v-model="value1"
          type="datetime"
          placeholder="Select date and time"
          :clearable="false"
          prefix-icon="Clock"
          :disabled-date="disabledDate"
          @change="changeA()"
        />
      </div>
      <div class="block">
        <span>{{ $t("work.endDate") }}:</span>
        <el-date-picker
          class="date_picker"
          v-model="value2"
          type="datetime"
          placeholder="Select date and time"
          :clearable="false"
          prefix-icon="Clock"
          :disabled-date="disabledDate"
          @change="changeA()"
        />
      </div>
      <div class="btn_area">
        <!-- <el-button type="primary" icon="Search" v-if="!loading" @click="getSingleCarTrick">查询</el-button>
                  <el-button type="primary" loading v-else>查询</el-button> -->
        <el-button
          type="primary"
          icon="Search"
          @click="getSingleCarTrick"
          :loading="loading"
          :disabled="loading"
        >
          {{$t('work.search')}}
        </el-button>
      </div>
    </div>
    <div class="head_top">
      <div class="left">
        <el-button type="primary" icon="back" @click="router.go(-1)">{{
          $t("work.goBack")
        }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const L = window.L;
import { singleCarTrackResponseData } from "@/api/machineryList/type";
import { getSingleCarTrick_API } from "@/api/machineryList/index";
import { ref, reactive, watch, onMounted } from "vue";
import router from "@/router";
import SvgIcon from "@/components/SvgIcon/index.vue";
import { ElMessage } from "element-plus";
import gcoord from "gcoord";
import { useRoute } from "vue-router";
import { mapTitleLayers } from "./mapTitleLayers";
import { useI18n } from "vue-i18n";
import c from "@/assets/jobManage/c.png";
const { t } = useI18n();
const route = useRoute();
const pickedPoints = ref<any[]>([]);
// 提交的车辆数组
// 按钮控制
let calculationObj = <any[]>reactive([]);
const loading = ref<boolean>(false);
const pickupMode = ref<boolean>(false);
// 提交数据
const pageInfoData = reactive<any>({
  carId: "",
  st: "",
  et: "",
  currentPage: 1,
  pageSize: 20000,
});
const calculateDistance = () => {
  const mapId = document.getElementById("child6_map");
  if (mapId) {
    mapId.style.cursor = "crosshair";
  }
  pickupMode.value = true; //开启拾取模式
};
const value1 = ref<Date>();
let eleDataObject = <any>[];
const value2 = ref<Date>();
const a = ref<Date>();
function handleMapCenter() {
  map.setView(originPoint.value, originZoom.value);
}

onMounted(() => {
  pageInfoData.carId = route.query.carId;
  value2.value = new Date();
  const start = new Date();
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
  value1.value = start;
  pageInfoData.st = formartDate(value1.value);
  pageInfoData.et = formartDate(value2.value);

  initMap();
  getSingleCarTrick();
});
// 时间格式转换
function add0(m: any) {
  return m < 10 ? "0" + m : m;
}
const formartDate = (val: Date) => {
  var y = val.getFullYear();
  var m = val.getMonth() + 1;
  var d = val.getDate();
  var h = val.getHours();
  var mm = val.getMinutes();
  var s = val.getSeconds();
  return (
    y + "-" + add0(m) + "-" + add0(d) + " " + add0(h) + ":" + add0(mm) + ":" + add0(s)
  );
};
// 禁止选取的时间
const disabledDate = (time: Date) => {
  return time.getTime() > Date.now();
};
// 监视日期，起始日期大于末尾日期则交换1
watch(
  () => [value1.value, value2.value],
  () => {
    if (value2.value && value1.value && value2.value.getTime() < value1.value.getTime()) {
      a.value = value1.value;
      value1.value = value2.value;
      value2.value = a.value;
    }
  }
);
// 更改实际time1
const changeA = () => {
  if (value1.value && value2.value) {
    pageInfoData.st = formartDate(value1.value);
    pageInfoData.et = formartDate(value2.value);
  }
};

// 地图相关
let map = <any>null;
const originPoint = ref<any>([31.172800343248, 121.406021546488]);
const originZoom = ref<any>(5);
// const tileLayer = reactive<any>([])
// const tileUrl = reactive<any>({})
// Object.assign(tileUrl, mapTitleLayers)
const mapId = ref(0);
const mapOptions = reactive([
  {
    mapName: t('sinoMap.SatellitesMap'),
    mapId: 0,
  },
  {
    mapName: t('sinoMap.AMAP'),
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
const markerCollect = reactive<any>({
  marker: [],
});

function initMap() {
  map = L.map("child6_map", {
    attributionControl: false,
    closePopupOnClick: false,
    zoomControl: false,
    zoomAnimation: false,
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

// 更改底地图
const hangleSelectChange = () => {
  handleMapChange(mapId.value);
};
// 保存记录
const saveMarker = (markerObj: any) => {
  try {
    markerCollect["marker"] = markerObj;
  } catch (err) {
    console.log(err);
  }
};

// 画线
const getSingleCarTrick = async () => {
  loading.value = true;
  removeMarker();
  const solSatList: any = [];
  const turePoint: any = [];
  let total: any;
  let times: any;
  getSingleCarTrick_API(pageInfoData)
    .then(async (res: any) => {
      if (!res.data || res.data.records.length === 0 || res.data.records === null) {
        loading.value = false;
        ElMessage.warning(t('work.noTrace'));
        return;
      } else {
        total = res.data.total;
        times = Math.ceil(total / 20000);
        if (times > 1) {
          for (let i = 0; i < times; i++) {
            const ress: any = await getSingleCarTrick_API(pageInfoData);
            ress.data.records.map((item3: any) => {
              solSatList.push(item3.solStat);
              turePoint.push(
                coorTransform([item3.posX as never, item3.posY as never], mapId.value)
              );
            });
            pageInfoData.currentPage++;
          }
          ElMessage.success(t('work.taceSuccess'));
          let line = L.polyline(turePoint, {
            color: "#5C5C5C",
            weight: 1,
          }).addTo(map);
          turePoint.map((item: any, index: any) => {
            if (solSatList[index] === 4) {
              let line2 = L.circle(item, {
                radius: 1,
                color: "#22B14C",
                fillOpacity: 1,
              }).addTo(map);
              eleDataObject.push(line2);
            } else if (solSatList[index] === 15) {
              let line2 = L.circle(item, {
                radius: 1,
                color: "#3F48CC",
                fillOpacity: 1,
              }).addTo(map);
              eleDataObject.push(line2);
            } else {
              let line2 = L.circle(item, {
                radius: 1,
                color: "#ED1C24",
                fillOpacity: 1,
              }).addTo(map);
              eleDataObject.push(line2);
            }
          });
          saveMarker([{ markerObj: line, name: "lines" }]);

          map.fitBounds(turePoint);
          loading.value = false;
        } else {
          let PointListTransed = res.data.records.map((item2: any) => {
            solSatList.push(item2.solStat);
            return coorTransform([item2.posX as never, item2.posY as never], mapId.value); // 转换坐标
          });

          ElMessage.success(t('work.taceSuccess'));
          let line = L.polyline(PointListTransed, { color: "#5C5C5C", weight: 1 }).addTo(
            map
          );
          PointListTransed.map((item: any, index: any) => {
            if (solSatList[index] === 4) {
              let line2 = L.circle(item, {
                radius: 1,
                color: "#22B14C",
                fillOpacity: 1,
              }).addTo(map);
              eleDataObject.push(line2);
            } else if (solSatList[index] === 15) {
              let line2 = L.circle(item, {
                radius: 1,
                color: "#3F48CC",
                fillOpacity: 1,
              }).addTo(map);
              eleDataObject.push(line2);
            } else {
              let line2 = L.circle(item, {
                radius: 1,
                color: "#ED1C24",
                fillOpacity: 1,
              }).addTo(map);
              eleDataObject.push(line2);
            }
          });
          saveMarker([{ markerObj: line, name: "lines" }]);

          map.fitBounds(PointListTransed);
          loading.value = false;
        }
      }
    })
    .catch((e) => {
      console.log(e);
      loading.value = false;
    });

  loading.value = false;
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
// 删除区域
const removeMarker = () => {
  try {
    if (markerCollect["marker"].length) {
      let a = markerCollect["marker"];
      a.forEach((item: any) => {
        if (item.markerObj) {
          map.removeLayer(item.markerObj);
        }
      });
      markerCollect["marker"] = [];
      eleDataObject.forEach((item: any) => {
        map.removeLayer(item);
      });
      pageInfoData.currentPage = 1;
    } else {
    }
  } catch (err) {
    console.log(err);
  }
};
</script>

<style lang="scss" scoped>
.page7_child6_container {
  width: 100%;
  height: 100%;
  position: relative;

  #child6_map {
    height: 100%;
    width: 100%;
  }
  .color_list {
    position: absolute;
    z-index: 999;
    top: 50px;
    right: 10px;
    min-width: 142px;
    height: 90px;
    opacity: 1;
    color: black;
    border-radius: 5px;
    font-size: 14px;
    color: white;
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
      background-color: #33b838;
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
  .map_selector {
    position: absolute;
    bottom: 10px;
    left: 10px;
    z-index: 999;
    width: 99px;
    height: 32px;
    opacity: 1;
    border-radius: 4px;
  }

  .demo-date-picker {
    position: absolute;
    z-index: 999;
    top: 50px;
    left: 10px;
    width: 302px;
    height: 164px;
    opacity: 1;
    border-radius: 5px;
    background: rgba(255, 255, 255, 1);

    .top_sn {
      border-radius: 4px 4px 0 0;
      padding: 13px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 26px;
      opacity: 1;
      background: var(--el-color-primary);
      font-size: 14px;
      color: rgba(255, 255, 255, 1);
      margin-bottom: 12px;
    }

    .block {
      height: 42px;
      width: 100%;

      :deep(.date_picker) {
        width: 187px;
        height: 30px;
        opacity: 1;
        border-radius: 4px;
      }

      span {
        margin-left: 21px;
        font-size: 12px;
        line-height: 17.38px;
        color: black;
      }
    }

    .btn_area {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .head_top {
    .left {
      z-index: 999;
      position: absolute;
      left: 10px;
      top: 10px;
    }
  }
}
:deep(.el-select .el-input.is-focus .el-input__wrapper) {
  box-shadow: none !important;
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
:deep(.el-select) {
  --el-select-input-focus-border-color: transparent;
}
</style>
