<template>
  <div class="carmap">
    <div class="map-bar-info">
      <el-checkbox-group v-model="checkedList" @change="setMarkerPoints">
        <el-checkbox :value="item.value" v-for="(item, index) in mapLegend" :key="index">
          <span class="dot" :style="{ backgroundColor: item.color }"></span>
          <span>{{ item.name }}</span>
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <div id="container"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import world from "@/utils/world.json";
import { onlineFarmMachinePosition_API } from "@/api/monitoring";

// 导入Vue相关的库
import { onMounted, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const emit = defineEmits(["mapFinish"]);
let mapChart: any = null,
  markerPoints: any[] = [],
  mapOption: any = {};
const mapLegend = computed(() => {
  return [
    {
      name: t("messages.InOperation"),
      color: "#43CF7C",
      value: 1,
    },
    {
      name: t("messages.Standby"),
      color: "#F7C23C",
      value: 2,
    },
    {
      name: t("messages.Offline"),
      color: "#C1C1C1",
      value: 3,
    },
  ];
});
const initMapChart = () => {
  let goeList = getGeoList();
  mapOption = {
    animationDuration: 0,
    animationEasing: "cubicInOut",
    tooltip: {
      trigger: "none",

      show: false,
      enterable: true,
      triggerOn: "click",

      borderColor: "#fff",
      backgroundColor: "rgba(20,120,186,0.5)",
      borderWidth: 1,
    },
    grid: {
      left: "center",
      // top:0
    },

    geo: goeList,

    series: [
      {
        type: "scatter",
        id: 2,
        coordinateSystem: "geo",
        zlevel: 10,
        z: 10,
        data: [],
        animation: true,
        progressiveThreshold: 10000,
        //silent:true,
        tooltip: {
          show: true,
          className: "project-tooltip",
          backgroundColor: "rgba(16, 40, 60, 0.9)",
          borderWidth: 0,
          trigger: "item",
        },
      },
      {
        type: "effectScatter",
        id: 3,
        coordinateSystem: "geo",
        silent: true,
        zlevel: 20,
        z: 20,
        rippleEffect: {
          brushType: "fill",
          scale: 6,
          period: 4,
        },
        data: [],
      },
    ],
  };
  initMapChartInstance();
};
let mapData: any = [];
const getMapData = async () => {
  // const { data } = await map_API();
  mapData = (await onlineFarmMachinePosition_API({})).data.onlineFarmMachines;
  appendMarkerPoints(mapData);
  emit("mapFinish");
};
const appendMarkerPoints = (pointList: any[] = []) => {
  pointList.forEach((item) => {
    if (item.posX != null && item.posY != null) {
      let markerPoint = {
        sn: item.sn,

        symbolSize: 9,
        value: [item.posY, item.posX],
        type: item.onlineTcp ? (item.driveState == 0 ? 2 : 1) : 3,
        itemStyle: {
          // color: item.online ? "#12C4FF" : "#C1C1C1",
          color: item.onlineTcp
            ? item.driveState == 0
              ? "#F7C23C"
              : "#43CF7C"
            : "#C1C1C1",
          opacity: 1,
        },
      };

      markerPoints.push(markerPoint);
    }
  });
  setMarkerPoints();
};
const checkedList = ref<any[]>([1, 2, 3]);
const setMarkerPoints = () => {
  mapOption.series[0].data = markerPoints.filter((i: any) =>
    checkedList.value.includes(i.type)
  );
  mapChart?.clear();
  mapChart?.setOption(mapOption);
};
const getGeoList = () => {
  let goeList: any[] = [];
  let geo: any = {};
  let itemStyle = {
    areaColor: "#000000",
    borderWidth: 0.8,
    borderColor: "#50DA7F",
  };
  geo = {
    map: "world",
    itemStyle: itemStyle,
    emphasis: {
      itemStyle: itemStyle,
      label: {
        show: false,
      },
    },
    zoom: 1.2,
    label: {
      show: false,
    },
  };
  goeList.push(geo);

  return goeList;
};
const initMapChartInstance = () => {
  if (mapChart != null) {
    mapChart.dispose();
  }
  mapChart = echarts.init(document.getElementById("container"));
  mapChart.setOption(mapOption);
  //this.initGDSalliteMap();
};
onMounted(() => {
  echarts.registerMap("world", world as any);
  initMapChart();
  getMapData();
});
</script>

<style scoped lang="scss">
:deep(.echarts-container) {
  transition: opacity 0.3s;
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

  .map-bar-info {
    z-index: 99;
    position: absolute;
    bottom: 20px;
    left: 10px;
    background-size: contain;
    :deep(.el-checkbox-group) {
      display: flex;
      flex-direction: column;
      .el-checkbox {
        @include flex($col: center);
        margin-bottom: vh(12);

        .el-checkbox__input {
          position: relative;
          left: 100px;
        }
        .el-checkbox__label {
          font-size: vw(20);
          @include flex($col: center);
          color: #fff;
          position: relative;
          left: vw(-20);
          padding-left: 0;
          padding-right: vw(10);
          > span:first-child {
            @include setCircle(vw(18));
            margin-right: vw(8);
          }
        }
      }
      .el-checkbox__input.is-checked,
      .el-checkbox__input.is-focus {
        .el-checkbox__inner {
          background-color: transparent;
          border-color: #fff;
        }
      }
      .el-checkbox__inner {
        transition: none;
      }
    }
  }
}

.carmap::after {
  content: "";
  position: absolute;
  top: -50px;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("@/assets/perceptionImage/mapBack.png") no-repeat;
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

  > span {
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
.map-legend {
  position: absolute;
  bottom: vh(50);
  left: 12%;
  :deep(.el-checkbox-group) {
    display: flex;
    flex-direction: column;
    .el-checkbox {
      @include flex($col: center);
      margin-bottom: vh(12);

      .el-checkbox__input {
        position: relative;
        left: 100px;
      }
      .el-checkbox__label {
        font-size: vw(20);
        @include flex($col: center);
        color: #fff;
        position: relative;
        left: vw(-20);
        padding-left: 0;
        padding-right: vw(10);
        > span:first-child {
          @include setCircle(vw(18));
          margin-right: vw(8);
        }
      }
    }
    .el-checkbox__input.is-checked,
    .el-checkbox__input.is-focus {
      .el-checkbox__inner {
        background-color: transparent;
        border-color: #fff;
      }
    }
    .el-checkbox__inner {
      transition: none;
    }
  }
}
.dot {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  margin-right: 5px;
}
</style>
