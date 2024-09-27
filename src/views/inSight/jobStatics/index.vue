<!--  -->
<template>
  <div class="app_container">
    <div class="table_container app_card">
      <div class="search_container">
        <div class="input_area">
          <el-select
            v-if="dealerList.length > 1"
            filterable
            v-model="pageInfo.companyId"
            class="input-with-select"
            :placeholder="$t('work.pleaseSelect')"
            @change="changeBlur1"
          >
            <el-option
              v-for="item in dealerList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
          <el-input
            style="width: 179px; margin-right: 20px"
            v-if="dealerList.length === 1"
            v-model="dealerList[0].name"
            disabled
          />
          <el-select-v2
            style="width: 210px"
            filterable
            v-model="pageInfo.id"
            :options="options"
            :placeholder="$t('work.pleaseSelect')"
            @change="changeBlur2"
          >
          </el-select-v2>
        </div>
        <div class="time">
          <div class="demo-date-picker">
            <div class="block">
              <el-date-picker
                v-model="timeRange"
                type="daterange"
                start-placeholder="Start Date"
                end-placeholder="End Date"
                @change="changteTime"
              />
            </div>
          </div>
          <!-- <p :class="isActive == 1 ? 'active' : ''" @click="onDayClick">
              {{ $t("work.today") }}
            </p> -->
          <p :class="isActive == 2 ? 'active' : ''" @click="onMonthClick">
            {{ $t("work.thisMonth") }}
          </p>
          <p :class="isActive == 3 ? 'active' : ''" @click="onYearClick">
            {{ $t("work.thisYear") }}
          </p>
        </div>
      </div>
      <div class="title_list">
        <div class="title">{{ t("statisticsReport.jobacres") }}</div>
        <div class="value">
          {{ carChartValue.beforeAreaSum  }}
        </div>
        <div class="title">{{ t("statisticsReport.CumulativeDuration") }}(h)</div>
        <div class="value">
          {{ carChartValue.beforeDurationSum  }}
        </div>
      </div>
      <div id="carChart"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref, reactive, onMounted, onUnmounted, nextTick } from "vue";
import { carDealer_API } from "@/api/machineryList/index";
import { CarStatPaddyChart_API } from "@/api/inSight/index";
import { getCarDealerList_API } from "@/api/jobManagement/index";
import { ElMessage } from "element-plus";
import * as echarts from "echarts";
const { t } = useI18n();
const timeRange = ref<any>([
  new Date(new Date().setHours(23, 59, 59, 999)).getTime() - 3600 * 1000 * 24 * 30,
  new Date(new Date().setHours(23, 59, 59, 999)).getTime(),
]);
const isActive = ref<number>(2);
const pageInfo = reactive<any>({
  id: "",
  companyId: "",
});
const dealerList = ref<any[]>([]);
let carChart: any;
let options = <any>[];
let CarDealerList = ref<any[]>([]);
const carChartValue = ref<any>({});
const changeBlur1 = () => {
  pageInfo.id = ''
  carChart.clear();
  getDealerCarList();
};
const changeBlur2 = () => {
  getCarChart();
};
const getCarChart = async () => {
  const res = await CarStatPaddyChart_API({
    ...pageInfo,
    stTime: timestampToTime(timeRange.value[0]),
    etTime: timestampToTime(timeRange.value[1]),
  });
  carChartValue.value = res.data;
  const data = res.data;
  if (data.length == 0) {
    ElMessage.warning("暂无数据");
  }
  const dateData = data.timeList;
  const farmData = data.carStatPaddyOneVOS;
  const beforeArea = farmData.map((item: any) => {
    return item.beforeArea;
  });
  const beforeDuration = farmData.map((item: any) => {
    return item.beforeDuration;
  });
  ChartCreate(dateData, beforeArea, beforeDuration);
};

function initChart() {
  var chartDom = document.getElementById("carChart");
  carChart = echarts.init(chartDom);
}

function ChartCreate(date: any, x: any, y: any) {
  var option;
  const dateList = date;
  const valueListx = x;
  const valueListy = y;
  option = {
    // title: {
    //   //标题组件
    //   text: ` 面积(千亩)`, //'循环泵历史状态',
    //   textStyle: {
    //     fontSize: 14,
    //     fontWeight: 400,
    //     color: "#565656",
    //   },
    // },
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
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
            color: "#363636",
            fontSize: "10",
          },
        },
        axisTick: {
          show: false, // 是否显示坐标轴刻度
        },

        splitNumber: 10,
        boundaryGap: false,
        data: dateList,
        // splitLine: {
        //   show: true,
        //   lineStyle: {
        //     color: "#CBDBF2",
        //   },
        // },

        axisLine: {
          show: true,
          lineStyle: {
            color: "#CBDBF2",
          },
        },
      },
    ],
    yAxis: [
      {
        name: `  ${t("statisticsReport.thousandArea")}`,
        type: "value",
        // max: function (value: any) {
        //   // console.log(value);
        //   if (value.max !== -Infinity) {
        //     return value.max;
        //   } else {
        //     return 100;
        //   }
        // },
        // min: function (value: any) {
        //   if (value.min !== Infinity) {
        //     return value.min;
        //   } else {
        //     return 0;
        //   }
        // },
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
      {
        name: ` ${t("statisticsReport.CumulativeDuration") + "(h)"}`,

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
        name: `${t('work.acreage')}`,
        showSymbol: true, //是否默认展示圆点
        type: "line",
        data: valueListx,
        yAxisIndex: 0,
        lineStyle: {
          color: "#227AC1",
        },
        areaStyle: {
          // 折现下是否填充
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(34, 122, 193, 1)", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(255, 255, 255, 0.1)", // 100% 处的颜色
              },
            ],
            global: false,
          },
        },
      },
      {
        name: `${t('statisticsReport.workingHours')}`,
        showSymbol: true, //是否默认展示圆点
        type: "line",
        yAxisIndex: 1,
        data: valueListy,
        lineStyle: {
          color: "#30A925",
        },
        areaStyle: {
          // 折现下是否填充
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(48, 169, 37, 1)", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(255, 255, 255, 0.1)", // 100% 处的颜色
              },
            ],
            global: false,
          },
        },
      },
    ],
    dataZoom: [
      {
        type: "inside", //详细配置可见echarts官网
      },
    ],
    color: ["#227AC1", "#30A925"],
    legend: {
      icon: "rectangle",
      // right: "10%",
      // top: "10",
      data: [t("work.acreage"), t("statisticsReport.workingHours")],
    },
  };
  carChart.setOption(option);
  nextTick(() => {
    carChart.resize();
  });
}
// 获取经销商下车辆列表
const getDealerCarList = async () => {
  const res: any = await getCarDealerList_API(pageInfo.companyId);
  // dataItems.value = []
  // pageData.value.pageIndex = 1
  if (res.data == null) {
    CarDealerList.value = [];
  } else {
    CarDealerList.value = res.data;
    options = CarDealerList.value.map((item: any, _idx) => {
      return {
          value: item.id,
          label: item.sn + "(" + item.npn + ")",
        };
    });
    options.unshift({value:'',label:t('work.allcars')})
   
    getCarChart();
  }
};
function timestampToTime(timestamp: any) {
  var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + "-";
  var M =
    (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
  var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  var h = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  var m = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ":";
  var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
}
const getDealerList = async () => {
  const res: any = await carDealer_API();
  if (res.data.length > 1) {
    dealerList.value = [{ id: "", name: t("devicelist.totalDealer") }, ...res.data];
    pageInfo.companyId = "";
  } else {
    dealerList.value = res.data;
    pageInfo.companyId = res.data[0].id;
  }
  getDealerCarList();
};
const changteTime = () => {
  isActive.value = 0;
  carChart.clear();
  getCarChart();
};
//这个月
const onMonthClick = () => {
  isActive.value = 2;
  timeRange.value = [
    new Date(new Date().setHours(0, 0, 0)).getTime() - 3600 * 1000 * 24 * 30,
    new Date(new Date().setHours(23, 59, 59, 999)).getTime(),
  ];
  carChart.clear();
  getCarChart();
};
// 这一年
const onYearClick = () => {
  isActive.value = 3;
  timeRange.value = [
    new Date(new Date().setHours(0, 0, 0)).getTime() - 3600 * 1000 * 24 * 365,
    new Date(new Date().setHours(23, 59, 59, 999)).getTime(),
  ];
  carChart.clear();
  getCarChart();
};

getDealerList();

onMounted(() => {
  initChart();
  window.addEventListener("resize", () => {
    carChart.resize();
  });
});
onUnmounted(() => {
  window.removeEventListener("resize", () => {
    carChart.resize();
  });
  carChart.dispose();
});
</script>

<style lang="scss" scoped>
.search_container {
  display: flex;
  margin-bottom: 20px;
  flex-wrap: wrap;

  .input_area {
    display: flex;
    width: 25%;

    .input-with-select {
      width: 179px;
      height: 32px;
      opacity: 1;
      border-radius: 4px;
      margin-right: 20px;
    }

    .m-2 {
      width: 179px;
      height: 32px;
      opacity: 1;
    }
  }

  .time {
    margin-left: 10px;
    height: 32px;
    display: flex;

    .demo-date-picker {
      display: flex;

      .gang {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0px 10px;
        height: 32px;
        opacity: 1;
        line-height: 21px;
        /** 文本1 */
        font-size: 14px;
        font-weight: 400;
        letter-spacing: 0px;
        line-height: 20.27px;
      }
    }

    p {
      margin-left: 32px;
      line-height: 5px;
      height: 20px;
      font-size: 14px;
      vertical-align: middle;
      font-family: SourceHanSansSC-regular;

      &:hover {
        cursor: pointer;
        color: var(--el-color-primary);
      }

      &.active {
        color: var(--el-color-primary);
      }
    }

    .date_picker {
      line-height: 32px;
      width: 240px;
      height: 32px;
    }
  }

  .button_area {
    .btn2 {
      width: 32px;
      height: 32px;
      border-radius: 4px;
      border: 1.5px solid var(--el-color-primary);
      color: var(--el-color-primary);
    }
  }
}
#carChart {
  height: 350px;
  width: 100%;
  background-color: #fff;
  border: 1px solid rgba(244, 248, 252, 0.46);
}
.title_list {
  display: flex;
  justify-content: center;
  align-items: center;
  div {
    margin: 8px;
  }
  .value {
    font-weight: bold;
    font-size: 24px;
    color: #4cb04f;
    line-height: 28px;
  }
}
</style>
