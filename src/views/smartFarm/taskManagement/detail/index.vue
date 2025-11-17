<!--  -->
<template>
  <div class="app_container">
    <div class="app_card">
      <div class="top_line">
        <div class="left">
          <span style="color: #4cb04f; font-size: 16px">{{
            detailList.taskName || "--"
          }}</span>
          <span style="color: #b5b5b5; font-size: 12px">{{
            detailList.vehicleName?detailList.vehicleName+"/"+detailList.sn:"--"
          }}</span>
        </div>
        <div class="right" v-show="radio === 1">
          <div class="cycle1"></div>
         {{ t('work.startPoint') }}
          <div class="cycle2"></div>
          {{ t('work.endPoint') }}
          <div class="cycle3"></div>
          {{ t('work.lowSpeed') }}(0-30km/h)
          <div class="cycle4"></div>
          {{ t('work.highSpeed') }}(30-100km/h)
        </div>
        <div class="right" v-show="radio === 2">
          <div class="cycle1"></div>
          {{ t('work.startPoint') }}
          <div class="cycle2"></div>
          {{ t('work.endPoint') }}
          <div class="cycle7"></div>
          {{ t("job.fix") }}
          <div class="cycle5"></div>
          {{ t("job.others") }}
          <div class="cycle6"></div>
          {{ t("job.SatelliteBase") }}
        </div>
      </div>
      <div class="map_container1">
        <detail-map :ggaData="logList" @radio="changeRadio" />
        <div class="map_info">
          <div class="info_box">
            <div class="top">{{ t("work.operationType") }}</div>
            <div class="bottom">{{ detailList.operationName || "--" }}</div>
          </div>
          <div class="info_box">
            <div class="top">{{ t("work.workProgress") }}(%)</div>
            <div class="bottom">{{ getWorkProgress(detailList.missedArea, detailList.totalArea) }}</div>
          </div>
          <div class="info_box">
            <div class="top">{{ t("work.workArea") }}/{{ t("work.remainingArea") }}(亩)</div>
            <div class="bottom">{{ (detailList.totalArea || "--") }}/{{ (detailList.missedArea || "--") }}</div>
          </div>
          <div class="info_box">
            <div class="top">{{ t("work.workDuration") }}(h)</div>
            <div class="bottom">{{ detailList.durationSeconds || "--" }}</div>
          </div>
          <div class="info_box" style="width: 20%">
            <div class="top">{{ t("work.startTime") }}</div>
            <div class="bottom">{{ detailList.startTime || "--" }}</div>
          </div>
          <div class="info_box" style="width: 20%">
            <div class="top">{{ t("work.endTime") }}</div>
            <div class="bottom">{{ detailList.endTime || "--" }}</div>
          </div>
        </div>
      </div>
      <div class="table_container">
        <div id="xOffsetChart"></div>
        <div id="speedChart"></div>
        <div id="pitchAngleChart"></div>
        <div id="rollAngleChart"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { taskDetail_API } from "@/api/fieldManagement/indx";
import detailMap from "./components/detailMap.vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import * as echarts from "echarts";
let xOffsetChart: any;
let speedChart: any;
let pitchAngleChart: any;
let rollAngleChart: any;
const { t } = useI18n();
const route = useRoute();

// 计算作业进度百分比
const getWorkProgress = (missedArea: number, totalArea: number) => {
  if (!totalArea || totalArea === 0) return "--";
  if (!missedArea) missedArea = 0;
  const progress = ((totalArea - missedArea) / totalArea * 100).toFixed(1);
  return progress;
};

const detailList = ref<any>({});
const logList = ref([]);
const getTaskInfo = async () => {
  const res = await taskDetail_API({
    id: route.query.id,
  });
  detailList.value = res.data;
  logList.value = detailList.value.logList;
  const createTimeList = logList.value.map((item: any) => {
    return item.createTime;
  });
  const xOffsetList = logList.value.map((item: any) => {
    const value = item.xOffset !== null && item.xOffset !== undefined ? item.xOffset : 0;
    return value;
  });
  const speedList = logList.value.map((item: any) => {
    return item.speed ?? 0;
  });
  const pitchAngleList = logList.value.map((item: any) => {
    return item.pitchAngle ?? 0;
  });
  const rollAngleList = logList.value.map((item: any) => {
    return item.rollAngle ?? 0;
  });
  
  // Debug: Check the actual data values
  console.log('xOffsetList sample:', xOffsetList.slice(0, 10));
  console.log('speedList sample:', speedList.slice(0, 10));
  createXOffsetChart(createTimeList, xOffsetList);
  createSpeedChart(createTimeList, speedList);
  createPitchAngleChart(createTimeList, pitchAngleList);
  createRollAngleChart(createTimeList, rollAngleList)
};
getTaskInfo();
const radio = ref(1);
const changeRadio = (e: any) => {
  radio.value = e;
};
// 横向偏差图表
function createXOffsetChart(date: any, x: any) {
  const option = {
    tooltip: { trigger: "axis" },
    grid: { left: "3%", right: "4%", bottom: "3%", top: "28%", containLabel: true },
    toolbox: { feature: { saveAsImage: {} } },
    xAxis: [{
      axisLabel: {
        formatter: function (params: any) {
          var newParamsName = "";
          var paramsNameNumber = params.length;
          var provideNumber = 11;
          var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
          if (paramsNameNumber > provideNumber) {
            for (var p = 0; p < rowNumber; p++) {
              var tempStr = "";
              var start = p * provideNumber;
              var end = start + provideNumber;
              if (p == rowNumber - 1) {
                tempStr = params.substring(start, paramsNameNumber);
              } else {
                tempStr = params.substring(start, end) + "\n";
              }
              newParamsName += tempStr;
            }
          } else {
            newParamsName = params;
          }
          return newParamsName;
        },
        textStyle: { color: "#1F1F1F", fontSize: "10" }
      },
      axisTick: { show: false },
      splitNumber: 10,
      boundaryGap: false,
      data: date,
      axisLine: { show: true, lineStyle: { color: "#DCE4F6" } }
    }],
    yAxis: [{
      name: "横向偏差(m)",
      type: "value",
      splitNumber: 5,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: true }
    }],
    series: [{
      name: "横向偏差",
      showSymbol: false,
      type: "line",
      data: x,
      yAxisIndex: 0,
      lineStyle: { color: "#FF6B6B" }
    }],
    dataZoom: [{ type: "inside" }],
    color: ["#FF6B6B"]
  };
  xOffsetChart.setOption(option);
  nextTick(() => { xOffsetChart.resize(); });
}

// 速度图表
function createSpeedChart(date: any, x: any) {
  const option = {
    tooltip: { trigger: "axis" },
    grid: { left: "3%", right: "4%", bottom: "3%", top: "28%", containLabel: true },
    toolbox: { feature: { saveAsImage: {} } },
    xAxis: [{
      axisLabel: {
        formatter: function (params: any) {
          var newParamsName = "";
          var paramsNameNumber = params.length;
          var provideNumber = 11;
          var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
          if (paramsNameNumber > provideNumber) {
            for (var p = 0; p < rowNumber; p++) {
              var tempStr = "";
              var start = p * provideNumber;
              var end = start + provideNumber;
              if (p == rowNumber - 1) {
                tempStr = params.substring(start, paramsNameNumber);
              } else {
                tempStr = params.substring(start, end) + "\n";
              }
              newParamsName += tempStr;
            }
          } else {
            newParamsName = params;
          }
          return newParamsName;
        },
        textStyle: { color: "#1F1F1F", fontSize: "10" }
      },
      axisTick: { show: false },
      splitNumber: 10,
      boundaryGap: false,
      data: date,
      axisLine: { show: true, lineStyle: { color: "#DCE4F6" } }
    }],
    yAxis: [{
      name: `  ${t("chart.speed")}(km/h)`,
      type: "value",
      splitNumber: 5,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: true }
    }],
    series: [{
      name: t("chart.speed"),
      showSymbol: false,
      type: "line",
      data: x,
      yAxisIndex: 0,
      lineStyle: { color: "#7Bc47D" }
    }],
    dataZoom: [{ type: "inside" }],
    color: ["#7Bc47D"]
  };
  speedChart.setOption(option);
  nextTick(() => { speedChart.resize(); });
}

// 航向角图表
function createPitchAngleChart(date: any, x: any) {
  const option = {
    tooltip: { trigger: "axis" },
    grid: { left: "3%", right: "4%", bottom: "3%", top: "28%", containLabel: true },
    toolbox: { feature: { saveAsImage: {} } },
    xAxis: [{
      axisLabel: {
        formatter: function (params: any) {
          var newParamsName = "";
          var paramsNameNumber = params.length;
          var provideNumber = 11;
          var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
          if (paramsNameNumber > provideNumber) {
            for (var p = 0; p < rowNumber; p++) {
              var tempStr = "";
              var start = p * provideNumber;
              var end = start + provideNumber;
              if (p == rowNumber - 1) {
                tempStr = params.substring(start, paramsNameNumber);
              } else {
                tempStr = params.substring(start, end) + "\n";
              }
              newParamsName += tempStr;
            }
          } else {
            newParamsName = params;
          }
          return newParamsName;
        },
        textStyle: { color: "#1F1F1F", fontSize: "10" }
      },
      axisTick: { show: false },
      splitNumber: 10,
      boundaryGap: false,
      data: date,
      axisLine: { show: true, lineStyle: { color: "#DCE4F6" } }
    }],
    yAxis: [{
      name: "航向角(°)",
      type: "value",
      splitNumber: 5,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: true }
    }],
    series: [{
      name: "航向角",
      showSymbol: false,
      type: "line",
      data: x,
      yAxisIndex: 0,
      lineStyle: { color: "#4ECDC4" }
    }],
    dataZoom: [{ type: "inside" }],
    color: ["#4ECDC4"]
  };
  pitchAngleChart.setOption(option);
  nextTick(() => { pitchAngleChart.resize(); });
}

// 横滚角图表
function createRollAngleChart(date: any, x: any) {
  const option = {
    tooltip: { trigger: "axis" },
    grid: { left: "3%", right: "4%", bottom: "3%", top: "28%", containLabel: true },
    toolbox: { feature: { saveAsImage: {} } },
    xAxis: [{
      axisLabel: {
        formatter: function (params: any) {
          var newParamsName = "";
          var paramsNameNumber = params.length;
          var provideNumber = 11;
          var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
          if (paramsNameNumber > provideNumber) {
            for (var p = 0; p < rowNumber; p++) {
              var tempStr = "";
              var start = p * provideNumber;
              var end = start + provideNumber;
              if (p == rowNumber - 1) {
                tempStr = params.substring(start, paramsNameNumber);
              } else {
                tempStr = params.substring(start, end) + "\n";
              }
              newParamsName += tempStr;
            }
          } else {
            newParamsName = params;
          }
          return newParamsName;
        },
        textStyle: { color: "#1F1F1F", fontSize: "10" }
      },
      axisTick: { show: false },
      splitNumber: 10,
      boundaryGap: false,
      data: date,
      axisLine: { show: true, lineStyle: { color: "#DCE4F6" } }
    }],
    yAxis: [{
      name: `  ${t("work.RollAngle")}°`,
      type: "value",
      splitNumber: 5,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: true }
    }],
    series: [{
      name: t("work.RollAngle"),
      showSymbol: false,
      type: "line",
      data: x,
      yAxisIndex: 0,
      lineStyle: { color: "#FFB74D" }
    }],
    dataZoom: [{ type: "inside" }],
    color: ["#FFB74D"]
  };
  rollAngleChart.setOption(option);
  nextTick(() => { rollAngleChart.resize(); });
}

function initChart() {
  var xOffsetDom = document.getElementById("xOffsetChart");
  var speedDom = document.getElementById("speedChart");
  var pitchAngleDom = document.getElementById("pitchAngleChart");
  var rollAngleDom = document.getElementById("rollAngleChart");
  xOffsetChart = echarts.init(xOffsetDom);
  speedChart = echarts.init(speedDom);
  pitchAngleChart = echarts.init(pitchAngleDom);
  rollAngleChart = echarts.init(rollAngleDom);
}

onMounted(() => {
  initChart();
  window.addEventListener("resize", () => {
    xOffsetChart.resize();
    speedChart.resize();
    pitchAngleChart.resize();
    rollAngleChart.resize();
  });
});
</script>

<style lang="scss" scoped>
.app_container {
  height: calc(100% - 40px);
}
.app_card {
  height: 100%;
  width: 100%;
  .top_line {
    display: flex;
    align-items: center;
    height: 24px;
    width: 100%;
    margin-bottom: 10px;
    span {
      margin-right: 20px;
    }
    .right {
      position: absolute;
      right: 30px;

      display: flex;
      align-items: center;
      font-size: 14px;
      .cycle1 {
        margin: 0 5px 0 10px;
        width: 12px;
        height: 12px;
        background: #56eeff;
        border-radius: 0px 0px 0px 0px;
        border-radius: 50%;
      }
      .cycle2 {
        margin: 0 5px 0 10px;
        width: 12px;
        height: 12px;
        background: #ff8341;
        border-radius: 0px 0px 0px 0px;
        border-radius: 50%;
      }
      .cycle3 {
        margin: 0 5px 0 10px;
        width: 12px;
        height: 12px;
        background: #5eff7b;
        border-radius: 0px 0px 0px 0px;
        border-radius: 50%;
      }
      .cycle4 {
        margin: 0 5px 0 10px;
        width: 12px;
        height: 12px;
        background: #ff54ac;
        border-radius: 0px 0px 0px 0px;
        border-radius: 50%;
      }
      .cycle5 {
        margin: 0 5px 0 10px;
        width: 12px;
        height: 12px;
        background-color: #ed1c24;
        border-radius: 0px 0px 0px 0px;
        border-radius: 50%;
      }
      .cycle6 {
        margin: 0 5px 0 10px;
        width: 12px;
        height: 12px;
        background-color: #3f48cc;
        border-radius: 0px 0px 0px 0px;
        border-radius: 50%;
      }
      .cycle7 {
        margin: 0 5px 0 10px;
        width: 12px;
        height: 12px;

        border-radius: 0px 0px 0px 0px;
        border-radius: 50%;
        background-color: #00ff00;
      }
    }
  }
  .map_container1 {
    height: calc(67% - 20px);
    width: 100%;
    position: relative;
    .map_info {
      position: absolute;
      width: 100%;
      z-index: 9999;
      bottom: 0;
      height: 84px;
      background: linear-gradient(rgba(4, 49, 41, 0.5) 27%, rgba(18, 65, 56, 0.2) 100%);
      display: flex;
      align-items: center;
      color: white;
      .info_box {
        padding: 0 4px;
        width: 15%;
        font-weight: 1000;
      }
    }
  }
  .table_container {
    display: flex;
    flex-wrap: wrap;
    height: 600px;
    width: 100%;
    gap: 4px;
    overflow-y: auto;
    overflow-x: hidden;
    #xOffsetChart, #speedChart, #pitchAngleChart, #rollAngleChart {
      height: 280px;
      width: calc(50% - 2px);
      background-color: #fff;
      border: 1px solid rgba(244, 248, 252, 0.46);
    }
  }
}
</style>
