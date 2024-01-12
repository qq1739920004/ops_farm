<template>
  <div class="carmap">
    <div class="map-bar-info">
      <div class='map-info'>
        <div class="yellow"></div>
        <span>{{$t('perception.total')}}</span>
      </div>
      <div class='map-info'>
        <div class="gree"></div>
        <span>{{$t('perception.tonline')}}</span>
      </div>

    </div>
    <div id="container"></div>
  </div>
</template>

<script setup lang="ts">
// 导入Vue相关的库
import { onMounted, ref ,watch} from "vue";
// 导入类型定义
import type { MonitorObj } from "@/api/perception/type";
import { getGeojson } from '@/api/perception/index.ts';
// 导入高德地图加载器
import AMapLoader from "@amap/amap-jsapi-loader";
import { purifyBaiduData, purifyCityArr } from './utils';
import { poly3d } from "./polygon3d";
import { setMarker,updateChart } from "./setMarker";
import { mapEvent } from './mapEvent';
import type { onlineMaker } from "@/api/perception/type";
import { useI18n } from "vue-i18n";
import {starDeviceLocation,updateDeviceMarker} from './deviceLocation.ts';
const { t } = useI18n();
interface Props {
  provinceCars: MonitorObj["provinceCars"];
  markerDataHandle?:onlineMaker
}
const emits = defineEmits(["mapFinish"]);
const map = ref();
const props = withDefaults(defineProps<Props>(), {
  provinceCars: () => [
    {
      name: "",
      totalNum: 0,
      onlineNum: 0,
      code: "",
      cityName: "",
      lat: '0',
      lng: '0',
    },
  ],
});

let dataList = props.provinceCars;
let polylines: any = [];
let mask: any = [];
let maskPoly: any = [];
//开始画出来
function startDraw(AMap: any,cityArr: string[]) {
  map.value = new AMap.Map("container", {
    center: [104.137, 36.544], // 中国的大致中心点
    zoom: 5, // 设置一个合适的缩放级别以显示多个城市
    backgroundColor: "transparent",
    mask: mask, // 设置遮罩层
    disableSocket: true,
    showLabel: false,
    //开启3D
    labelzIndex: 130,
    pitch: 40, // 允许缩放
    zoomEnable: true, //隐藏地图logo
    showLogo: false,
    layers: [new AMap.TileLayer.RoadNet(), new AMap.TileLayer.Satellite()],
  });

  //边框
  poly3d(AMap, maskPoly, map, polylines);
  //标注
  // setMarker(AMap, map, dataList,cityArr.length,t);
  starDeviceLocation(AMap, map)
  //注册的所有时间
  mapEvent(map);
  // 使用setFitView自动调整视图以适应所有的折线
  map.value.setFitView(polylines);
  emits("mapFinish");
}

// 初始化地图
function initMap(cityArr: string[]) {
  AMapLoader.load({
    key: "604de37af9e617ea3d9d26f306743698",
    version: "2.0",
    plugins: ["AMap.DistrictSearch", "AMap.Polyline"],
  })
    .then((AMap: any) => {
      drawingCity(AMap, cityArr);
    })
    .catch((e: any) => {
      console.log(e);
    });
}
// 使用百度地图API服务获取边界数据
async function drawingCity(AMap: any, cityArr: string[]) {
  const response = await getGeojson(cityArr.join(','))
  let length = response.data.length;
  for (let i = 0; i < length; i++) {
    const data = JSON.parse(response.data[i])
    if (data.status == 0 && data.districts.length > 0) {
      //数据处理
      let [maskTemp, maskPolyTemp] = purifyBaiduData(AMap, data, cityArr[i])
      mask = maskTemp;
      maskPoly = maskPolyTemp;
    }
    if (i === length - 1) {
      startDraw(AMap,cityArr);
    }
  }
}
onMounted(() => {
  let { codeArr } = purifyCityArr(dataList);
  initMap(codeArr);
});
watch(() =>props.provinceCars, () => {
  updateChart(props.provinceCars)
}, { deep: true })

watch(() =>props.markerDataHandle, () => {
  updateDeviceMarker(props.markerDataHandle)
})
</script>

<style scoped lang="scss">
.carmap {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  #container {
    background-color: transparent;
    background: none;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  /* 隐藏地图的版权信息 */
  :deep(#container) {

    .amap-scale,
    .amap-copyright,
    .amap-logo {
      display: none !important;

    }
  }

  .map-bar-info {
    position: absolute;
    left: 20px;
    bottom: 95px;
    width: 251px;
    height: 41px;
    background: url('@/assets/perceptionImage/mapBarInfo.png') no-repeat;
    background-size: contain;
  }
}

.carmap::after {
  content: '';
  position: absolute;
  top: -50px;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('@/assets/perceptionImage/mapBack.png') no-repeat;
  background-position: center;
  background-origin: content-box;
  background-size: 779px;
  animation: rotate 30s linear infinite;
  z-index: -999;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.map-bar-info,
.map-info {
  z-index: 999;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  >span {
    padding-left: 5px;
  }

  .gree,
  .yellow {
    width: 44px;
    height: 21px;
    background-color: #ffeb3b;
  }

  .gree {
    background-color: #40b971;
  }
}
</style>
