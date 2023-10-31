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
            v-if="carAreas.length"
          />
          <Year class="year" :totalArea="totalArea" :todayArea="todayArea" />
        </div>

        <div class="middle">
          <Carmap
            v-if="carAreas.length"
            @mapFinish="mapFinish"
            :provinceCars="provinceCars"
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

// 监测数据
const monitorData = ref<MonitorObj>();
//状态通知
let stateObj = ref<recordsType>();
// 各车辆作业面积
const carAreas = ref<Array<object>>([]);

const todayArea = ref<number>();
const totalArea = ref<number>();
// 各类型农机在线数
const typeCounts = ref<Array<object>>([]);
// 各省车辆状态
const provinceCars = ref<MonitorObj["provinceCars"]>();
const getMonitor = async () => {
  const res = await getMonitorAPI();
  monitorData.value = res.data;
  carAreas.value = res.data.carAreas;
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
        transform: translateY(-20px);
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
