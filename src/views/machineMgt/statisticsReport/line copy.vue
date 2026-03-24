<template>
  <div class="line-container app-container">
    <div class="content-container">
      <div class="header">
        <h4 class="title"></h4>
        <div class="filter-box">
          <el-radio-group 
            v-model="viewType" 
            size="small" 
            style="margin-right: 15px"
            @change="handleViewTypeChange"
          >
            <el-radio-button label="month">月维度</el-radio-button>
            <el-radio-button label="day">日维度</el-radio-button>
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
              value-format="yyyy-MM-dd"
              :picker-options="dayPickerOptions"
              @change="handleDateChange"
              size="small"
              style="width: 300px"
            >
            </el-date-picker>
          </div>
        </div>
      </div>
      <div class="echartLine" ref="echartLine"></div>
      <div class="echartBar" ref="echartBar"></div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import { statisticalLineData } from "@/api/index.js";
import MonthRangePicker from "../components/MonthRangePicker.vue";

export default {
  name: "SinoTerminalServiceLine",
  components: {
    MonthRangePicker,
  },
  data() {
    // 计算默认的时间范围
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // 计算开始时间（前12个月）
    const startDate = new Date(currentYear, currentMonth - 11, 1);
    // 结束时间为当前月
    const endDate = new Date(currentYear, currentMonth, 1);

    return {
      viewType: "month",
      seriesData: [],
      xAxisList: [],
      inOutData: [],
      dateRange: [this.formatDate(startDate), this.formatDate(endDate)],
      lineChart: null, // 添加图表实例引用
      barChart: null, // 添加图表实例引用
      pickerOptions: {
        disabledDate: (time) => {
          // 禁用当前月之后的日期
          const currentMonth = new Date();
          currentMonth.setDate(1); // 设置为当月1号
          return time.getTime() > currentMonth.getTime();
        },
      },
      dayPickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.now();
        },
      },
    };
  },
  mounted() {
    this.getLineData();
    // 添加窗口resize监听
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    // 组件销毁前移除监听
    window.removeEventListener("resize", this.handleResize);
    // 销毁图表实例
    this.lineChart && this.lineChart.dispose();
    this.barChart && this.barChart.dispose();
  },
  methods: {
    // 添加日期格式化方法
    formatDate(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      return `${year}-${month}`;
    },

    formatDateDay(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    handleViewTypeChange() {
      const now = new Date();
      if (this.viewType === "month") {
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const startDate = new Date(currentYear, currentMonth - 11, 1);
        const endDate = new Date(currentYear, currentMonth, 1);
        this.dateRange = [this.formatDate(startDate), this.formatDate(endDate)];
      } else {
        const startDate = new Date();
        startDate.setDate(now.getDate() - 29);
        this.dateRange = [
          this.formatDateDay(startDate),
          this.formatDateDay(now),
        ];
      }
      this.getLineData();
    },

    // 新增获取数据的方法
    getLineData() {
      const params = {};
      // 只有当时间范围存在且有效时才添加时间参数
      if (
        this.dateRange &&
        Array.isArray(this.dateRange) &&
        this.dateRange.length === 2
      ) {
        // 1: 月维度, 2: 日维度
          const isMonth = this.viewType === "month";
          params.type = isMonth ? 1 : 2;
          params.stTime = this.dateRange[0];
          params.etTime = this.dateRange[1];
  

        statisticalLineData(params).then((res) => {
          this.seriesData = res.data.outTotalList;
          this.xAxisList = res.data.deliveryTimeList;
          this.inOutData = res.data.outInDeliveryVOS;
          this.initEchartLine();
          this.initEchartBar();
        });
      }
    },

    // 新增时间改变的处理方法
    handleDateChange(val) {
      // 如果时间为空（点击清空按钮），不做处理
      if (!val) {
        return;
      }
      this.getLineData();
    },

    // 添加resize处理方法
    handleResize() {
      this.lineChart && this.lineChart.resize();
      this.barChart && this.barChart.resize();
    },

    // 折线图配置
    initEchartLine() {
      if (this.lineChart) {
        this.lineChart.dispose();
      }
      this.lineChart = echarts.init(this.$refs.echartLine);
      const textColor = "#A4A4A4";

      let option = {
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
          data: this.xAxisList,
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
            symbolSize: 10,
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
            data: this.seriesData,
          },
        ],
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 100,
            zoomLock: false,
            moveOnMouseMove: true,
          },
        ],
      };
      this.lineChart.setOption(option);
    },

    // 柱状图配置
    initEchartBar() {
      if (this.barChart) {
        this.barChart.dispose();
      }
      this.barChart = echarts.init(this.$refs.echartBar);
      const textColor = "#A4A4A4";

      // 处理入库出库数据
      const inData = this.inOutData.map((item) => item[0]);
      const outData = this.inOutData.map((item) => item[1]);

      let option = {
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
          data: this.xAxisList,
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
              formatter: function (params) {
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
              formatter: function (params) {
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
            zoomLock: false,
            moveOnMouseMove: true,
          },
        ],
      };
      this.barChart.setOption(option);
    },
  },
};
</script>
<style>
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
}
.echartLine {
  width: 100%;
  height: 43%;
  margin-bottom: 20px;
}

.echartBar {
  width: 100%;
  height: 43%;
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
</style>
