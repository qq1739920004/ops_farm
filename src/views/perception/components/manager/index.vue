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
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`;
});


window.onresize = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`;
};
function getScale(w = 1920, h = 937) {
  const ww = window.innerWidth / w;
  const wh = window.innerHeight / h;
  return ww < wh ? ww : wh;
}
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
    //upline是上线，offline是下线，online是在线
  //   if (action == "upline") {
  //     const markerId = data.data.sn;
  //     const markerLng = data.data.posY;
  //     const markerLat = data.data.posX;
  //     const markerType = createMarkerType(data.data);
  //     const markerIcon = createMarkerIcon(data.data);
  //     markerDataHandle.value = {
  //       markerId,
  //       markerLng,
  //       markerLat,
  //       markerType,
  //       markerIcon,
  //       markerHandle: "add",
  //     };
  //   }
  //   if (action == "offline") {
  //     const markerId = data.data.sn;
  //     markerDataHandle.value = {
  //       markerId,
  //       markerHandle: "delete",
  //     };
  //   }
  //   if (action == "online") {
  //     const markerId = data.data.sn;
  //     const markerLng = data.data.posY;
  //     const markerLat = data.data.posX;
  //     const markerType = createMarkerType(data.data);//设备类型
  //     const markerIcon = createMarkerIcon(data.data);//设备图标
  //     markerDataHandle.value = {
  //       markerId,
  //       markerLng,
  //       markerLat,
  //       markerType,
  //       markerIcon,
  //       markerHandle: "update",
  //     };
  //   }
  }
}
onUnmounted(() => {
  console.log(112)
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
  background-size: cover, contain, 100% 100%;
  background-position: center;
  color: white;

  .screen {
    width: 1920px;
    height: 937px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform-origin: left top;
    .top {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 223px;
      .top_time {
        align-self: flex-start;
      }
    }
    .bottom {
      display: flex;
      height: 779px;
      width: 100%;
      .left {
        flex: 1;
        display: flex;
        height: 100%;

        flex-direction: column;
        .workarea {
          height: 400px;
        }
        .year {
          height: 270px;
        }
      }
      .middle {
        width: 1039px;
        height: 100%;
      }

      .right {
        transform: translateY(-40px);
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        .online {
          height: 300px;
        }
        .state {
          height: 400px;
        }
      }
    }
  }
}
</style>
