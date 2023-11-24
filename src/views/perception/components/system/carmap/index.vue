<template>
  <div class="carmap">
    <div class="map-bar-info">
      <div class='map-info'>
        <div class="yellow"></div>
        <span>总数</span>
      </div>
      <div class='map-info'>
        <div class="gree"></div>
        <span>在线数</span>
      </div>

    </div>
    <div id="container"></div>
  </div>
</template>

<script setup lang="ts">
// 导入Vue相关的库
import { onMounted, ref, watch, nextTick } from "vue";
// 导入类型定义
import type { MonitorObj } from "@/api/perception/type";
// 导入高德地图加载器
import AMapLoader from "@amap/amap-jsapi-loader";
import { setMarker, updateChart } from "./setMarker";
import { mapEvent } from './mapEvent';
interface Props {
  provinceCars: MonitorObj["provinceCars"];
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
let mask: any = [];
//开始画出来
function startDraw(AMap: any) {
  map.value = new AMap.Map("container", {
    center: [104.114129, 37.550339], // 中国的大致中心点
    zoom: 4.4, // 设置一个合适的缩放级别以显示多个城市
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
  // poly3d(AMap, maskPoly, map, polylines);
  // //标注
  map.value.on('complete', function () {
    // 地图加载完成后调用setMarker方法
    nextTick(() => {
      setMarker(AMap, map, dataList);
    })
  });
  //注册的所有时间
  mapEvent(map);
  // 使用setFitView自动调整视图以适应所有的折线
  emits("mapFinish");

  // map.value.setFitView(polylines);
  // setTimeout(() => {
  //   emits("mapFinish");
  // }, 1000);
}

// 初始化地图
function initMap() {
  AMapLoader.load({
    key: "604de37af9e617ea3d9d26f306743698",
    version: "2.0",
    plugins: ["AMap.DistrictSearch", "AMap.Polyline", "AMap.DistrictLayer"],
  })
    .then((AMap: any) => {
      AMap.plugin('AMap.DistrictSearch', function () {
        let district = new AMap.DistrictSearch({ // 创建行政区查询对象
          extensions: 'all', // 返回行政区边界坐标等具体信息
          level: 'province' // 设置查询行政区级别为国 
        });
        district.search('中国', function (status: any, result: any) {
          if (status == 'complete') {
            drawingCity(AMap, result.districtList[0].boundaries);
          }
        })
      })
    })
    .catch((e: any) => {
      console.log(e);
    });
}
async function drawingCity(AMap: any, data: any) {
  //数据处理
  for (let i = 0; i < data.length; i += 1) {//构造MultiPolygon的path
    data[i] = [data[i]]
  }
  mask = data;
  startDraw(AMap);
}
onMounted(() => {
  initMap();
});
watch(() => props.provinceCars, () => {
  updateChart(props.provinceCars)
}, { deep: true })
</script>

<style scoped lang="scss">
:deep(.echarts-container) {
  transition: opacity .3s;
  /* 0.3秒的淡入淡出效果 */
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
    z-index: 99;
    position: absolute;
    bottom: 20px;
    left: 10px;
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
  background-size: 739px;
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
