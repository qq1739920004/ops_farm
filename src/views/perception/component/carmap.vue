<template>
  <div class="carmap">
    <div id="container"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import type { MonitorObj } from "@/api/perception/type";
import AMapLoader from "@amap/amap-jsapi-loader";
import { shallowRef } from "@vue/reactivity";

interface Props {
  provinceCars: MonitorObj["provinceCars"];
}

const map = shallowRef(null);
const props = withDefaults(defineProps<Props>(), {
  provinceCars: () => [
    {
      name: "",
      totalNum: 0,
      onlineNum: 0,
      code: "",
      cityName: "",
    },
  ],
});

let dataList = props.provinceCars;
let mask: any = [];
let bounds: any = [];
//开始画出来
function startDraw(AMap: any) {
  console.log(mask);
  console.log(22);
  map.value = new AMap.Map("container", {
    center: [126.968714, 46.654147], // 中国的大致中心点
    zoom: 8, // 设置一个合适的缩放级别以显示多个城市
    backgroundColor: "transparent",
    mask: mask, // 设置遮罩层
    disableSocket: true,
    showLabel: false,
    labelzIndex: 130,
    pitch: 40,
    // 允许缩放
    zoomEnable: true,
    //隐藏地图logo
    showLogo: false,
    layers: [new AMap.TileLayer.RoadNet(), new AMap.TileLayer.Satellite()],
  });
  for (let i = 0; i < bounds.length; i += 1) {
    new AMap.Polyline({
      path: mask[i],
      strokeColor: "#99ffff",
      strokeWeight: 4,
      map: map.value,
    });
  }
}
// 初始化地图并绘制省份边界
function initMap(cityArr: string[]) {
  AMapLoader.load({
    key: "efbfb05a199884bfaaa3146624896021",
    version: "2.0",
    plugins: ["AMap.DistrictSearch", "AMap.Polyline"],
  })
    .then((AMap) => {
      drawingCity(AMap, cityArr);
    })
    .catch((e) => {
      console.log(e);
    });
}
function drawingCity(AMap: any, cityArr: string[]) {
  let district = new AMap.DistrictSearch({
    // subdistrict: 1,
    extensions: "all",
    level: "city",
  });
  cityArr.forEach((cityName,index) => {
    district.search(cityName, (status: any, result: any) => {
      if (status != "complete") return;
      bounds = result.districtList[0].boundaries;
      for (let i = 0; i < bounds.length; i += 1) {
        mask.push([bounds[i]]);
      }
      if (index === cityArr.length - 1) {
        startDraw(AMap);
      }
    });
  });
}
function purifyCityArr(data: MonitorObj["provinceCars"]) {
  let arr: string[] = [];
  data.forEach((item) => {
    if (item.code) {
      arr.push(item.code.padEnd(6, "0"));
    }
  });
  return arr;
}
onMounted(() => {
  let cityArr = purifyCityArr(dataList);
  initMap(cityArr);
});
</script>

<style scoped lang="scss">
.carmap {
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
    /* 隐藏地图的版权信息 */
    :deep .amap-scale,
    :deep .amap-copyright,
    :deep .amap-logo {
      display: none !important;
    }
  }
}
</style>
