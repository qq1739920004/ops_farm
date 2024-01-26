<template>
  <div class="carmap">
    <div class="map-bar-info">
      <div class='map-info'>
        <div class="yellow"></div>
        <span>{{selectOption==1?$t('perception.total'):$t('messages.Standby')}}</span>
      </div>
      <div class='map-info'>
        <div class="gree"></div>
        <span>{{selectOption==1?$t('perception.tonline'):$t('messages.InOperation')}}</span>
      </div>

    </div>
    <div class="select-box">
            <div @click="selectChange(1)" :class="['select-text',selectOption==1?'t-shadow':'']">
              {{$t('perception.altogether')}}
            </div>
            <div @click="selectChange(2)" :class="['select-text',selectOption==2?'t-shadow':'']">
              {{$t('perception.detail')}}
            </div>
          </div>
    <div id="container"></div>
  </div>
</template>

<script setup lang="ts">
// 导入Vue相关的库
import { onMounted,onUnmounted, ref ,watch,shallowRef,} from "vue";
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
import {starDeviceLocation,updateDeviceMarker,clearDeviceMarker,isOne} from './deviceLocation.ts';
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
let watchOne=ref(false)
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
    if(watchOne.value) return
    watchOne.value=true
    startDeviceWatch()
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
onUnmounted(()=>{
  isOne.value=false
})
watch(() =>props.provinceCars, () => {
  updateChart(props.provinceCars)
}, { deep: true })
function startDeviceWatch(){
  watch(() =>props.markerDataHandle, () => {
  if(props.markerDataHandle){
    updateDeviceMarker(props.markerDataHandle,selectOption.value)
  }
})
}

defineExpose({
  selectChange,
  barShow,
  deviceShow
})
</script>

<style scoped lang="scss">

.select-box{
  z-index: 999;
  width: calc(136 / 1920 * 100vw);
  height: calc(80 / 937 * 100vh);
  background-image: url('@/assets/perceptionImage/mapSelectBg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  left: calc(10 / 1920 * 100vw);
  bottom: calc(30 / 937 * 100vh);
  .t-shadow{
    text-shadow: calc(-6 / 1920 * 100vw) 0px calc(15 / 1920 * 100vw) #fff, calc(6 / 1920 * 100vw) 0px calc(15 / 1920 * 100vw) #fff;
    background: url('@/assets/perceptionImage/mapArrow.png') no-repeat;
    background-size:  100% 100%;
    background-position: center;
  }
  .select-text{
    width: 100%;
    cursor: pointer;
    flex: 1;
    font-size: 1rem; // 18px 转换为 rem
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }
}

.carmap {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9;
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
    z-index: 999;
    right: calc(10 / 1920 * 100vw);
    bottom: calc(30 / 937 * 100vh);
    width: calc(136 / 1920 * 100vw);
    padding: calc(6 / 937 * 100vh) 0 calc(6 / 937 * 100vh) calc(20 / 1920 * 100vw);
    height: calc(66 / 937 * 100vh);
    background: url('@/assets/perceptionImage/mapBarInfoNew.png') no-repeat;
    background-size: 100% 100%;
    font-size: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
  }
}

.carmap::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 93%;
  background: url('@/assets/perceptionImage/mapBack.png') no-repeat;
  background-position: center;
  background-origin: content-box;
  background-size: contain;
  animation: rotate 30s linear infinite;
  z-index: -9;
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
  font-size: 0.875rem; // 14px 转换为 rem
  display: flex;
  width: 100%;
  justify-content: start;
  align-items: center;
  >span {
    padding-left: calc(5 / 1920 * 100vw);
  }
  .gree, .yellow {
    width: calc(16 / 1920 * 100vw); // 图标背景大小保持不变
    height: calc(16 / 937 * 100vh); // 图标背景大小保持不变
    background-color: #ffeb3b;
  }
  .gree {
    background-color: #40b971;
  }
}

</style>
