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
            detailList.vehicleName || "--"
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
            <div class="top">{{ t("work.averageSpeed") }}(km/h)</div>
            <div class="bottom">{{ detailList.avgSpeed || "--" }}</div>
          </div>
          <div class="info_box">
            <div class="top">{{ t("work.allTime") }}(h)</div>
            <div class="bottom">{{ detailList.durationSeconds || "--" }}</div>
          </div>
          <div class="info_box">
            <div class="top">{{ t("work.totalMile") }}(km)</div>
            <div class="bottom">{{ detailList.totalDistance || "--" }}</div>
          </div>
          <div class="info_box">
            <div class="top">{{ t("work.averageOil") }}(L/h)</div>
            <div class="bottom">{{ detailList.avgFuelConsumption || "--" }}</div>
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
        <div id="carChart"></div>
        <div id="cornerChart"></div>
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
let carChart: any;
let cornerChart: any;
const { t } = useI18n();
const detailList = ref<any>({});
const logList = ref([]);
const route = useRoute();
const getTaskInfo = async () => {
  const res = await taskDetail_API({
    id: route.query.id,
  });
  detailList.value = res.data;
  logList.value = detailList.value.logList;
  const speedList = logList.value.map((item: any) => {
    return item.speed;
  });
  const createTimeList = logList.value.map((item: any) => {
    return item.createTime;
  });
  const cornerList = logList.value.map((item: any) => {
    return item.rollAngle;
  });
  ChartCreate(createTimeList, speedList);
  ChartCreate2(createTimeList, cornerList)
};
getTaskInfo();
const radio = ref(1);
const changeRadio = (e: any) => {
  radio.value = e;
};
function ChartCreate(date: any, x: any) {
  var option;
  const dateList = date;
  const valueListx = x;
  option = {
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "28%",
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: [
      {
        axisLabel: {
          formatter: function (params: any) {
            //x轴时间换行问题
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
          textStyle: {
            color: "#1F1F1F",
            fontSize: "10",
          },
        },
        axisTick: {
          show: false, // 是否显示坐标轴刻度
        },

        splitNumber: 10,
        boundaryGap: false,
        data: dateList,
        axisLine: {
          show: true,
          lineStyle: {
            color: "#DCE4F6",
          },
        },
      },
    ],
    yAxis: [
      {
        name: `  ${t("chart.speed")}`,
        type: "value",
        splitNumber: 5,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false, // 是否显示坐标轴刻度
        },
        splitLine: {
          show: true,
        },
      },
    ],
    series: [
      {
        name: t("chart.speed"),
        showSymbol: false, //是否默认展示圆点
        type: "line",
        data: valueListx,
        yAxisIndex: 0,
        lineStyle: {
          color: "#7Bc47D",
        },
      },
    ],
    dataZoom: [
      {
        type: "inside", //详细配置可见echarts官网
      },
    ],
    color: ["#7Bc47D"],
  };
  carChart.setOption(option);
  nextTick(() => {
    carChart.resize();
  });
}
function ChartCreate2(date: any, x: any) {
  var option;
  const dateList = date;
  const valueListx = x;
  option = {
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "28%",
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: [
      {
        axisLabel: {
          formatter: function (params: any) {
            //x轴时间换行问题
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
          textStyle: {
            color: "#1F1F1F",
            fontSize: "10",
          },
        },
        axisTick: {
          show: false, // 是否显示坐标轴刻度
        },

        splitNumber: 10,
        boundaryGap: false,
        data: dateList,
        axisLine: {
          show: true,
          lineStyle: {
            color: "#DCE4F6",
          },
        },
      },
    ],
    yAxis: [
      {
        name: `  ${t("work.RollAngle")}°`,
        type: "value",
        splitNumber: 5,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false, // 是否显示坐标轴刻度
        },
        splitLine: {
          show: true,
        },
      },
    ],
    series: [
      {
        name: t("work.RollAngle")+'°',
        showSymbol: false, //是否默认展示圆点
        type: "line",
        data: valueListx,
        yAxisIndex: 0,
        lineStyle: {
          color: "#7Bc47D",
        },
      },
    ],
    dataZoom: [
      {
        type: "inside", //详细配置可见echarts官网
      },
    ],
    color: ["#7Bc47D"],
  };
  cornerChart.setOption(option);
  nextTick(() => {
    cornerChart.resize();
  });
}
function initChart() {
  var chartDom = document.getElementById("carChart");
  var cornerDom = document.getElementById("cornerChart");
  carChart = echarts.init(chartDom);
  cornerChart = echarts.init(cornerDom);
}

onMounted(() => {
  initChart();
  window.addEventListener("resize", () => {
    carChart.resize();
  });
  window.addEventListener("resize", () => {
    cornerChart.resize();
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
    height: calc(33% - 14px);
    width: 100%;
    #carChart {
      height: 350px;
      width: 48%;
      background-color: #fff;
      border: 1px solid rgba(244, 248, 252, 0.46);
    }
    #cornerChart {
      height: 350px;
      width: 48%;
      background-color: #fff;
      border: 1px solid rgba(244, 248, 252, 0.46);
    }
  }
}
</style>
