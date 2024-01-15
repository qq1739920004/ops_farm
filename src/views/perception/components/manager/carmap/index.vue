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
    <div class="select-box">
            <div @click="selectChange(1)" :class="['select-text',selectOption==1?'t-shadow':'']">
              总览
            </div>
            <div @click="selectChange(2)" :class="['select-text',selectOption==2?'t-shadow':'']">
              详情
            </div>
          </div>
    <div id="container"></div>
  </div>
</template>

<script setup lang="ts">
// 导入Vue相关的库
import { onMounted, ref ,watch,shallowRef,} from "vue";
// 导入类型定义
import type { MonitorObj } from "@/api/perception/type";
import { getGeojson } from '@/api/perception/index.ts';
// 导入高德地图加载器
import AMapLoader from "@amap/amap-jsapi-loader";
import { purifyBaiduData, purifyCityArr } from './utils';
import { poly3d } from "./polygon3d";
import { setMarker,updateChart,clearBarMarker,BarMarkerCenter } from "./setMarker";
import { mapEvent } from './mapEvent';
import type { onlineMaker } from "@/api/perception/type";
import { useI18n } from "vue-i18n";
import {starDeviceLocation,updateDeviceMarker,clearDeviceMarker} from './deviceLocation.ts';
const { t } = useI18n();
interface Props {
  provinceCars: MonitorObj["provinceCars"];
  markerDataHandle?:onlineMaker;
  markerSelect:string
}
const emits = defineEmits(["mapFinish"]);
const AMap=shallowRef()
const cityArr = ref<string[]>([]);
const map = ref();
const selectOption = ref(1);
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
  markerSelect:'1'
});

let dataList = props.provinceCars;
let polylines: any = [];
let mask: any = [];
let maskPoly: any = [];
//开始画出来
function startDraw(AMap: any) {
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
  setMarker(AMap, map, dataList,cityArr.value.length,t);
  //注册的所有时间
  mapEvent(map);
  // 使用setFitView自动调整视图以适应所有的折线
  map.value.setFitView(polylines);
  emits("mapFinish");
}
function selectChange(value:number){
  selectOption.value=value
  if(value==1){
    barShow()
  }else{
    deviceShow()
  }
}
//总览选项
function barShow(){
  clearDeviceMarker()
  BarMarkerCenter(map)
  // setMarker(AMap.value, map, dataList,cityArr.value.length,t);
}
//详情选项
function deviceShow(){
  clearBarMarker()
  starDeviceLocation(AMap.value, map)
  // starDeviceLocation(AMap.value, map)
}
// 初始化地图
function initMap(cityArr: string[]) {
  AMapLoader.load({
    key: "604de37af9e617ea3d9d26f306743698",
    version: "2.0",
    plugins: ["AMap.DistrictSearch", "AMap.Polyline"],
  })
    .then((amap: any) => {
      AMap.value=amap
      drawingCity(amap, cityArr);
    })
    .catch((e: any) => {
      console.log(e);
    });
}
// 使用百度地图API服务获取边界数据
async function drawingCity(AMap: any, cityArr: string[]) {
  const paramsArr=new Set(cityArr);
  const response = await getGeojson(Array.from(paramsArr).join(','));
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
      startDraw(AMap);
    }
  }
}
onMounted(() => {
  let { codeArr } = purifyCityArr(dataList);
  cityArr.value = codeArr;
  initMap(codeArr);
});
watch(() =>props.provinceCars, () => {
  updateChart(props.provinceCars)
}, { deep: true })

watch(() =>props.markerDataHandle, () => {
  if(props.markerDataHandle){
    updateDeviceMarker(props.markerDataHandle)
  }
})
defineExpose({
  selectChange,
  barShow,
  deviceShow
})
</script>

<style scoped lang="scss">

.select-box{
  z-index: 999;
  width: 106px;
  height:80px;
  background-image:url('@/assets/perceptionImage/mapSelectBg.png');
  background-repeat: no-repeat;
  background-size: cover;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
    left: 10px;
    bottom: 95px;
    .t-shadow{
      text-shadow: -6px 0px 10px #fff,6px 0px 10px #fff;
    }
    .select-text{
      width: 100%;
      cursor: pointer;
      flex:1;
      font-size: 18px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
    }
}
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
    right: 10px;
    bottom: 95px;
    width: 78px;
    padding:6px 0px 6px 10px;
    height: 66px;
    background: url('@/assets/perceptionImage/mapBarInfoNew.png') no-repeat;
    background-size: contain;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
  }
}

.carmap::after {
  content: '';
  position: absolute;
  top: -10px;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('@/assets/perceptionImage/mapBack.png') no-repeat;
  background-position: center;
  background-origin: content-box;
  background-size: 749px;
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

.map-info {
  z-index: 999;
  font-size: 14px;
  display: flex;
  width: 100%;
  justify-content:start;
  align-items: center;

  >span {
    padding-left: 5px;
  }

  .gree,
  .yellow {
    width: 16px;
height: 16px;
    background-color: #ffeb3b;
  }

  .gree {
    background-color: #40b971;
  }
}
</style>
