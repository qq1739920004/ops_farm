<template>
  <div class="container">
    <!-- 内容展示区 -->
    <div class="screen" ref="screen">
      <img
        src="~@/assets/systemPerceptionImage/top_title_logo.png"
        class="top-img"
        key=""
        alt=""
      />

      <div class="top">
        <Top :monitorData="monitorData" />
      </div>

      <div class="bottom">
        <div class="left">
          <Online
            class="online"
            v-if="typeCounts.length"
            :typeCounts="typeCounts"
          ></Online>
          <Year
            class="year"
            :totalArea="totalArea"
            :addNowYearDevice="addNowYearDevice"
          />
          <active class="active" :dataNow="dataNow" />
        </div>

        <div class="middle">
          <Carmap
            v-if="carAreas.length"
            @mapFinish="mapFinish"
            :provinceCars="provinceCars"
          ></Carmap>
        </div>
        <div class="right">
          <Workarea
            class="workarea"
            :carAreas="carAreas"
            v-if="typeCounts.length"
          />
          <State class="state" :stateObj="stateObj"></State>
        </div>
      </div>
      <div class="bottom-logo"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import Top from "./top.vue";
import Year from "./year.vue";
import active from "./active.vue";
import Carmap from "./carmap/index.vue";
import Workarea from "./workarea.vue";
import State from "./state.vue";
import Online from "./online.vue";
import { getMonitorAPI } from "@/api/perception/index.ts";
import type { MonitorObj, recordsType } from "@/api/perception/type";
import socket from "@/store/socket";
import type { ChartData } from "@/api/perception/type.ts";

const realTime = socket();
realTime.connect();

// 监测数据
const monitorData = ref<MonitorObj>();
//状态通知
let stateObj = ref<recordsType>();
// 各省在线数/总数
const carAreas = ref<Array<object>>([]);
const dataNow = ref<ChartData>();
const todayArea = ref<number>();
const totalArea = ref<number>();
const addNowYearDevice = ref(0);
// 各类型农机在线数
const typeCounts = ref<Array<object>>([]);
// 各省车辆状态
const provinceCars = ref<MonitorObj["provinceCars"]>();

const getMonitor = async () => {
  const res = await getMonitorAPI();
  monitorData.value = res.data;
  carAreas.value = res.data.provinceCars;
  todayArea.value = res.data.todayArea;
  addNowYearDevice.value = res.data.addNowYearDevice;
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
function handleSocketData(data: any) {
  if (data.type == "monitor") {
    if (data.data) {
      monitorData.value = { ...data.data, ...monitorData.value };
      typeCounts.value = data.data.typeCounts;
      provinceCars.value = data.data.provinceCars;
      carAreas.value = data.data.provinceCars;
      stateObj.value = data.data.wsNowCar;
    }
  } else if (data.type == "monitorArea") {
    if (data.data) {
      todayArea.value = data.data.todayArea;
      totalArea.value = data.data.totalArea;
    }
  } else if (data.type == "monitorCarNum") {
    if (data.data) {
      monitorData.value!.todayAcDevice = data.data.todayAcDevice;
      dataNow.value = data.data.chart[0];
    }
  }else if (data.type == "notification") {
    stateObj.value = data.data.list[0]
  } 
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
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  width: 100vw;
  background: url(@/assets/perceptionImage/scene.png) no-repeat;
  background-color: rgba(2, 28, 14, 1);
  background-size: cover;
  background-position: center;
  color: white;

  .screen {
    .top-img {
      position: fixed;
      min-width: 1920px;
      top: 0;
    }
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
      height: 182px;
      .top_time {
        align-self: flex-start;
      }
    }
    .bottom {
      display: flex;
      height: 739px;
      width: 100%;
      .left {
        flex: 1;
        display: flex;
        height: 100%;

        flex-direction: column;
        .online {
          height: 270px;
        }
        .year {
          height: 173px;
        }
        .active {
          height: 256px;
        }
      }
      .middle {
        width: 1039px;
        height: 100%;
      }

      .right {
        margin-top: 40px;
        flex: 1;
        height: 100%;
        transform: translateY(-50px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .workarea {
          height: 391px;
        }
        .state {
          height: 358px;
        }
      }
    }
  }

  .bottom-logo {
    width: 100%;
    height: 16px;
    background-image: url("@/assets/systemPerceptionImage/bottom_logo.png");
    background-size: contain;
  }
}
</style>
../perception/component/system/carmap/index.vue