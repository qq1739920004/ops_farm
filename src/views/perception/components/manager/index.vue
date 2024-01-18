<template>
  <div class="container">
    <!-- 内容展示区 -->
    <div class="screen" ref="screen">
      <div class="top">
        <Top :monitorData="monitorData" :companyName="companyName" />
      </div>
      <div class="bottom">
        <div class="left">
          <Workarea
            class="workarea"
            :carAreas="carAreas"
            v-if="provinceCars?.length"

          />
          <Year class="year" :totalArea="totalArea" :todayArea="todayArea" />
        </div>

        <div class="middle">
          <Carmap
            v-if="provinceCars?.length"
            @mapFinish="mapFinish"
            :provinceCars="provinceCars"
            :markerDataHandle="markerDataHandle"
            :markerSelect="markerSelect"
          ></Carmap>
        </div>
        <div class="right">
          <Online
            class="online"
            v-if="typeCounts.length"
            :typeCounts="typeCounts"
          ></Online>
          <State class="state" :stateObj="stateObj"></State>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted,onUnmounted, watch } from "vue";
import Top from "./top.vue";
import Year from "./year.vue";
import Carmap from "./carmap/index.vue";
import Workarea from "./workarea.vue";
import State from "./state.vue";
import Online from "./online.vue";
import { getMonitorAPI,getUserAuth } from "@/api/perception/index.ts";
import type { MonitorObj, recordsType } from "@/api/perception/type";
import socket from "@/store/socket";
import type { onlineMaker } from "@/api/perception/type";


defineProps({
  companyName:{
    type:String,
    default:'XXXXXX',
  },
});

getUserAuth().then(res=>{
  console.log(res);
})
const realTime = socket();
realTime.connect();
//marker选项，1.总览，2.详情
const markerSelect = ref<string>("1");
// 监测数据
const monitorData = ref<MonitorObj>();
//状态通知
let stateObj = ref<recordsType>();
// 各车辆作业面积
const carAreas = ref<Array<object>>([]);
//设备位置marker
let markerDataHandle = ref<onlineMaker>();

const todayArea = ref<number>();
const totalArea = ref<number>();
// {{$t('perception.numberOfAgriculturalMachineryOnline')}}
const typeCounts = ref<Array<object>>([]);
// 各省车辆状态
const provinceCars = ref<MonitorObj["provinceCars"]>();
const getMonitor = async () => {
  const res = await getMonitorAPI();
  monitorData.value = res.data;
  carAreas.value = res.data.carAreas.filter(item=>item.carArea)
  todayArea.value = res.data.todayArea;
  totalArea.value = res.data.totalArea;
  typeCounts.value = res.data.typeCounts;
  provinceCars.value = res.data.provinceCars;
};

// 屏幕
let screen = ref();
function mapFinish() {
  watch(
  () => realTime.socketData,
  (socketData) => {
    handleSocketData(socketData);
  },
  { deep: true }
);
}

onMounted(() => {
  getMonitor();
  // screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`;
//       setTimeout(() => {
// //         provinceCars.value=[
// //     {
// //         "name": "吉林",
// //         "cityName": "四平市",
// //         "totalNum": 8,
// //         "onlineNum": 1,
// //         "code": "220000",
// //         "cityCode": "220300",
// //         "lng": "124.35648",
// //         "lat": "43.171993"
// //     },
// //     {
// //         "name": "未知省份",
// //         "cityName": "",
// //         "totalNum": 0,
// //         "onlineNum": 0
// //     }
// // ]
// // markerDataHandle.value={
// //         "carId": 10005,
// //         "carName": "yujiangjun",
// //         "carOwnerName": "zm",
// //         "companyName": "任命的公司",
// //         "companyId": 342,
// //         "lateralOffset": 65.7,
// //         "version": 7,
// //         "type": 4,
// //         "tel": "18351806109",
// //         "terminalType": "AG502",
// //         "addrcode": "220322",
// //         "creatorId": 15,
// //         "npn": "S10001097000",
// //         "posX": 43.29361085037895,
// //         "posY": 124.36168581450472,
// //         "posZ": 18.145,
// //         "coordType": "WGS84",
// //         "solStat": 1,
// //         "heading": 0.1844,
// //         "speed": 10,
// //         "driveState": 0,
// //         "satNum": 32,
// //         "baseDist": 1500,
// //         "diffSource": 1,
// //         "xOffset": 65.7,
// //         "headingOffset": 0.157,
// //         "netSignal": 0,
// //         "gnssTime": 1705367997344,
// //         "diffAge": 2,
// //         "dirSolState": 1,
// //         "cardUsage": 1,
// //         "sn": "S10001097000",
// //     "action": "upline",
// // };
//     }, 10000);

});


// window.onresize = () => {
//   screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`;
// };
// function getScale(w = 1920, h = 937) {
//   const ww = window.innerWidth / w;
//   const wh = window.innerHeight / h;
//   return ww < wh ? ww : wh;
// }
function handleSocketData(data: any) {
  if (data.type == "monitor") {
      monitorData.value = data.data;
      typeCounts.value = data.data.typeCounts;
      provinceCars.value = data.data.provinceCars;
      stateObj.value = data.data.wsNowCar;
  } else if (data.type == "monitorArea") {
      carAreas.value = data.data.carAreas;
      todayArea.value = data.data.todayArea;
      totalArea.value = data.data.totalArea;
  // }else if (data.type == "notification") {
  //   if(data.data.list.some((item:recordsType)=>{
  //     item.judgeLevel
  //   })){
  //   }else{
  //     if(stateObj.value && (stateObj.value.onlineTime !=data.data.list[0].onlineTime)){
  //       stateObj.value = data.data.list[0]
  //     }
  //   }
  } 
 else if (data.module == "farm" && data.type == "farmPt") {
    markerDataHandle.value={...data.data,action:data.action};
  }
}
onUnmounted(() => {
  realTime.close()
})
</script>

<style lang="scss" scoped>
 :deep(.echarts-container) {
    transition: opacity .3s;  /* 0.3秒的淡入淡出效果 */
}
.container {
  width: 100%;
  height: 100%;
  max-height: 100vh;
  max-width: 100vw;
  background: url(@/assets/perceptionImage/scene.png) no-repeat,
    url(@/assets/perceptionImage/border_lr.png) no-repeat,
    url(@/assets/perceptionImage/border_tb.png) no-repeat;
  background-color: rgba(2, 28, 14, 1);
  background-size: 100% 100%, 100% 100%, 100% 100%;
  background-position: center;
  color: white;

  .screen {
    width: 100vw; /* 宽度转换为视口宽度的百分比 */
    height: calc(937 / 937 * 100vh); /* 高度转换为视口高度的百分比 */
    .top {
      display: flex;
      padding-top: calc(10 / 937 * 100vh);
      justify-content: space-between;
      width: 100%;
      height: calc(223 / 937 * 100vh); /* 转换为视口高度的百分比 */
      .top_time {
        align-self: flex-start;
      }
    }
    .bottom {
      display: flex;
      height: calc(100vh - calc(233 / 937 * 100vh)); /* 转换为视口高度的百分比 */
      width: 100%;
      .left {
        flex: 1;
        height: 100%;
        .workarea {
          height: calc(390 / 937 * 100vh); /* 转换为视口高度的百分比 */
        }
        .year {
          margin-top: 16px;
          height: calc(264 / 937 * 100vh); /* 转换为视口高度的百分比 */
        }
      }
      .middle {
        width: calc(1039 / 1920 * 100vw); /* 转换为视口宽度的百分比 */
        height: 100%;
      }
      .right {
        transform: translateY(calc(-43 / 937 * 100vh)); /* 保持 px 单位，因为它是一个相对的偏移量 */
        flex: 1;
        height: 100%;
        .online {
          height: calc(295 / 937 * 100vh); /* 转换为视口高度的百分比 */
        }
        .state {
          height: calc(395 / 937 * 100vh); /* 转换为视口高度的百分比 */
        }
      }
    }
  }
}
</style>
