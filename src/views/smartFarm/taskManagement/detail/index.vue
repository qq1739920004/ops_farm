<!--  -->
<template>
  <div class="app_container">
    <div class="app_card">
      <div class="top_line">
        <div class="left">
          <span style="color: #ff9500; font-size: 16px; font-weight: bold; margin-right: 10px; padding: 2px 8px; background: rgba(0, 0, 0, 0); border-radius: 4px">{{ detailList.operationName || "--" }}</span>
          <span style="color: #4cb04f; font-size: 16px">{{ detailList.taskName || "--" }}</span>
          <span style="color: #b5b5b5; font-size: 12px">{{ detailList.vehicleName?detailList.vehicleName+"/"+detailList.sn:"--" }}</span>
        </div>
        <div class="right" v-show="radio === 1">
          <div class="cycle1"></div>
          {{ t('work.startPoint') }}
          <div class="cycle2"></div>
          {{ t('work.endPoint') }}
          <div class="cycle3"></div>
          {{ t('work.lowSpeed') }}
          <div class="cycle4"></div>
          {{ t('work.highSpeed') }}
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
          <!-- 第一行：作业统计和时间信息 -->
          <div class="info_row">
            <div class="info_box">
                <div class="bottom"><span> {{ t("work.workArea") }}:{{ formatAreaValue(detailList.totalArea, 3) || "--" }} {{ getAreaUnit() }}</span><span> {{ t("work.remainingArea") }}:{{ formatAreaValue(detailList.missedArea, 3) || "--" }} {{ getAreaUnit() }}</span></div>
              <div class="bottom progress_row">
                <img src="@/assets/common/stTime.png" alt="">
                <el-progress 
                  :percentage="calculateProgress(detailList)" 
                  :show-text="false"
                  :stroke-width="8"
                />
                <div class="progress_value">{{ calculateProgress(detailList) }}%</div>
              </div>
            </div>
   
            <div class="info_box">
              <div class="bottom">{{ t("work.workDuration") }}:{{ detailList.durationSeconds || "--" }}</div>
              <div class="bottom"> <img class="timepng" src="@/assets/common/time.png" alt="" />{{ detailList.startTime || "--" }} - {{ detailList.endTime || "--" }}</div>
            </div>
           
            <div class="info_box">
              <div class="bottom"><span> {{ t("work.toolName") }}:{{ detailList.toolName || "--" }}</span><span> {{ t("work.toolWidth") }}(m):{{ detailList.width !== null && detailList.width !== undefined ? detailList.width : "--" }}</span></div>
              <div class="bottom"><span>{{ t("work.overlapWidth") }}(m):{{ detailList.overlapWidth !== null && detailList.overlapWidth !== undefined ? detailList.overlapWidth : "--" }}</span><span>{{ t("work.offset") }}(m):{{ detailList.offset !== null && detailList.offset !== undefined ? detailList.offset : "--" }}</span></div>
            </div>
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
import { useAreaConversion } from '@/utils/areaConversion';
import detailMap from "./components/detailMap.vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import * as echarts from "echarts";
let xOffsetChart: any;
let speedChart: any;
let pitchAngleChart: any;
let rollAngleChart: any;
const { t } = useI18n();
const { formatAreaValue, getAreaUnit } = useAreaConversion();
const route = useRoute();

// 计算作业进度百分比
const calculateProgress = (detailList: any) => {
  if (!detailList.totalArea) return 0;
  
  const totalArea = detailList.totalArea ;
  const missedArea = detailList.missedArea || 0;
  const totalReseedArea = detailList.totalReseedArea || 0;
  const denominator = totalArea + missedArea - totalReseedArea;
  
  if (denominator <= 0) return 0;
  
  return Math.round((totalArea / denominator) * 100);
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
    return item.xoffset ?? 0;
  });
  const speedList = logList.value.map((item: any) => {
    return item.speed ?? 0;
  });
  const pitchAngleList = logList.value.map((item: any) => {
    return item.headingOffset ?? 0;
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
    grid: { left: "6%", right: "4%", bottom: "3%", top: "28%", containLabel: true },
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
      name: `${t("chart.lateralDeviation")}(m)`,
      type: "value",
      splitNumber: 5,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: true }
    }],
    series: [{
      name: t("chart.lateralDeviation"),
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
      name: `${t("chart.headingAngle")}(°)`,
      type: "value",
      splitNumber: 5,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: true }
    }],
    series: [{
      name: `${t("chart.headingAngle")}`,
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
      height: auto;
      background: linear-gradient(rgba(4, 49, 41, 0.5) 27%, rgba(18, 65, 56, 0.2) 100%);
      padding: 10px 0;
      color: white;
      
      .info_row {
        display: flex;
        align-items: center;
        justify-content: space-around;
        margin-bottom: 8px;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
      
      .info_box {
        padding: 0 8px;
        flex: 1;
        font-weight: 1000;
        text-align: center;
        
        .top {
          font-size: 12px;
          margin-bottom: 4px;
          opacity: 0.9;
        }
        .progress_row{
          display: flex;
          align-items: center;
          justify-content: center;
          .el-progress{
            width: 220px;
            margin:0 10px;
          }
          img{
            width: 16px;
            height: 16px;
            margin:0 5px;
          }
        }
        .bottom {
          font-size: 16px;
          font-weight: bold;
          span{
            margin-right: 16px; 
          }
          .timepng{
            width: 16px;
            height: 16px;
            margin:0 5px;
            line-height: 16px;
            vertical-align: -3px;
          }
        }
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
