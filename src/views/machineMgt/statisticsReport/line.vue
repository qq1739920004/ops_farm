<template>
  <div class="line-container app-container">
    <div class="content-container">
      <div class="header">
        <h4 class="title"></h4>
        <div class="filter-box">
          <el-radio-group 
            v-model="viewType" 
            style="margin-right: 15px"
            @change="handleViewTypeChange"
          >
            <el-radio-button value="month">月维度</el-radio-button>
            <el-radio-button value="day">日维度</el-radio-button>
          </el-radio-group>
          <div class="date-picker">
            <month-range-picker 
              v-if="viewType === 'month'"
              v-model="dateRange"
              @change="handleDateChange">
            </month-range-picker>
            <el-date-picker
              v-else
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              :disabled-date="dayPickerOptions.disabledDate"
              @change="handleDateChange"
              style="width: 320px; height: 40px;"
            >
            </el-date-picker>
          </div>
        </div>
      </div>
      <div class="echartLine" ref="echartLineRef"></div>
      <div class="echartBar" ref="echartBarRef"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useRoute } from "vue-router";
import * as echarts from "echarts";
import { statisticalLineData } from "@/api/statisticsReport";
import MonthRangePicker from "../components/MonthRangePicker.vue";

const route = useRoute();

// 图表 DOM 引用
const echartLineRef = ref<HTMLDivElement>();
const echartBarRef = ref<HTMLDivElement>();

// 图表实例（非响应式）
let lineChart: echarts.ECharts | null = null;
let barChart: echarts.ECharts | null = null;

// 响应式数据
const viewType = ref("month");
const seriesData = ref<number[]>([]);
const xAxisList = ref<string[]>([]);
const inOutData = ref<number[][]>([]);
const companyId = ref<string | null>(null);

// 日期范围
const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();
const startDate = new Date(currentYear, currentMonth - 11, 1);
const endDate = new Date(currentYear, currentMonth, 1);

const dateRange = ref<string[]>([formatDate(startDate), formatDate(endDate)]);

// picker 选项
const dayPickerOptions = {
  disabledDate: (time: Date) => {
    return time.getTime() > Date.now();
  },
};

// 格式化日期为 yyyy-MM
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${year}-${month}`;
}

// 格式化日期为 yyyy-MM-dd
function formatDateDay(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 处理视图类型切换
function handleViewTypeChange() {
  const now = new Date();
  if (viewType.value === "month") {
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const startDate = new Date(currentYear, currentMonth - 11, 1);
    const endDate = new Date(currentYear, currentMonth, 1);
    dateRange.value = [formatDate(startDate), formatDate(endDate)];
  } else {
    const startDate = new Date();
    startDate.setDate(now.getDate() - 29);
    dateRange.value = [formatDateDay(startDate), formatDateDay(now)];
  }
  getLineData();
}

// 获取折线图数据
function getLineData() {
  const params: any = {};
  if (
    dateRange.value &&
    Array.isArray(dateRange.value) &&
    dateRange.value.length === 2
  ) {
    const isMonth = viewType.value === "month";
    params.type = isMonth ? 1 : 2;
    params.stTime = dateRange.value[0];
    params.etTime = dateRange.value[1];

    // 添加 companyId 参数
    if (companyId.value) {
      params.companyId = companyId.value;
    }

    statisticalLineData(params).then((res: any) => {
      seriesData.value = res.data.outTotalList;
      xAxisList.value = res.data.deliveryTimeList;
      inOutData.value = res.data.outInDeliveryVOS;
      nextTick(() => {
        initEchartLine();
        initEchartBar();
      });
    });
  }
}

// 处理日期改变
function handleDateChange(val: string[] | null) {
  if (!val) {
    return;
  }
  getLineData();
}

// 处理窗口 resize
function handleResize() {
  if (lineChart) lineChart.resize();
  if (barChart) barChart.resize();
}

// 初始化折线图
function initEchartLine() {
  if (!echartLineRef.value) return;
  if (lineChart) {
    lineChart.dispose();
    lineChart = null;
  }
  lineChart = echarts.init(echartLineRef.value);
  const textColor = "#A4A4A4";

  const option = {
    tooltip: {
      trigger: "axis",
    },
    grid: {
      top: "14%",
      left: "2%",
      right: "2%",
      bottom: "5%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: xAxisList.value,
      axisLabel: {
        color: textColor,
        fontSize: 16,
      },
      axisLine: {
        lineStyle: {
          color: textColor,
        },
      },
      axisTick: {
        show: true,
      },
      splitLine: {
        show: false,
      },
      boundaryGap: true,
    },
    yAxis: {
      type: "value",
      min: 0,
      name: "出库总量",
      nameTextStyle: {
        color: "#000000",
        fontSize: 18,
        padding: [0, 0, 0, 80],
        fontWeight: "bold",
      },
      axisLabel: {
        color: textColor,
        fontSize: 16,
      },
      axisLine: {
        show: true,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#e8eefe",
        },
      },
    },
    series: [
      {
        type: "line",
        symbol: "circle",
        symbolSize: 8,
        showSymbol: true,
        itemStyle: {
          color: "#5487FF",
        },
        lineStyle: {
          color: "#5487FF",
        },
        areaStyle: {
          color: {
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            type: "linear",
            global: false,
            colorStops: [
              {
                offset: 0,
                color: "rgba(84,135,255,0.5)",
              },
              {
                offset: 0.7,
                color: "rgba(84,135,255,0.1)",
              },
            ],
          },
        },
        data: seriesData.value,
      },
    ],
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 100,
      },
    ],
  };
  lineChart.setOption(option);
}

// 初始化柱状图
function initEchartBar() {
  if (!echartBarRef.value) return;
  if (barChart) {
    barChart.dispose();
    barChart = null;
  }
  barChart = echarts.init(echartBarRef.value);
  const textColor = "#A4A4A4";

  const inData = inOutData.value.map((item) => item[0]);
  const outData = inOutData.value.map((item) => item[1]);

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      data: ["入库", "出库"],
      left: "center",
      top: "5%",
    },
    grid: {
      top: "18%",
      left: "2%",
      right: "2%",
      bottom: "0%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: xAxisList.value,
      axisLabel: {
        color: textColor,
        fontSize: 16,
      },
      axisLine: {
        lineStyle: {
          color: textColor,
        },
      },
      axisTick: {
        show: true,
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: "value",
      name: "出库分析",
      nameTextStyle: {
        color: "#000000",
        fontSize: 18,
        padding: [0, 0, 0, 80],
        fontWeight: "bold",
      },
      axisLabel: {
        color: textColor,
        fontSize: 16,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: textColor,
        },
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#e8eefe",
        },
      },
    },
    series: [
      {
        name: "入库",
        type: "bar",
        barGap: "0%",
        barMaxWidth: 48,
        itemStyle: {
          color: "#2b8eff",
          opacity: 1,
          borderRadius: 0,
        },
        label: {
          show: true,
          position: "top",
          fontSize: 14,
          color: "#333333",
          fontWeight: "normal",
          formatter: function (params: any) {
            return params.value > 0 ? params.value : "";
          },
        },
        emphasis: {
          itemStyle: {
            opacity: 0.9,
          },
        },
        data: inData,
      },
      {
        name: "出库",
        type: "bar",
        barMaxWidth: 48,
        itemStyle: {
          color: "#00e169",
          opacity: 1,
          borderRadius: 0,
        },
        label: {
          show: true,
          position: "top",
          fontSize: 14,
          color: "#333333",
          fontWeight: "normal",
          formatter: function (params: any) {
            return params.value > 0 ? params.value : "";
          },
        },
        emphasis: {
          itemStyle: {
            opacity: 0.9,
          },
        },
        data: outData,
      },
    ],
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 100,
      },
    ],
  };
  barChart.setOption(option);
}

// 生命周期钩子
onMounted(() => {
  // 从路由 query 获取 companyId
  companyId.value = (route.query.companyId as string) || null;
  nextTick(() => {
    getLineData();
  });
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  if (lineChart) {
    lineChart.dispose();
    lineChart = null;
  }
  if (barChart) {
    barChart.dispose();
    barChart = null;
  }
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 20px;
}

.title {
  text-align: center;
  font-size: 18px;
  margin: 0;
}
.filter-box {
  display: flex;
  align-items: center;
}
.line-container {
  height: calc(100% - 50px);
  background-color: white;
}
.echartLine {
  width: 100%;
  height: 300px;
  margin-bottom: 20px;
}

.echartBar {
  width: 100%;
  height: 300px;
}

/* 添加以下样式来修改日历图标颜色 */
.date-picker .el-input__icon {
  color: #5ba4f7;
  font-size: 18px;
}

/* 可选：当鼠标悬停时的颜色 */
.date-picker .el-input__icon:hover {
  color: #4070e8;
}

/* 增大 radio 按钮 */
.filter-box .el-radio-group .el-radio-button__inner {
  padding: 9px 15px;
  font-size: 12px;
}
</style>
