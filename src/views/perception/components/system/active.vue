<template>
  <div class="box">
    <div class="title">
      <img src="~@/assets/systemPerceptionImage/activeIcon.png" alt="" />
      <span>{{$t('perception.vehicleActivity')}}</span>
    </div>

    <div class="charts" ref="bar"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onUnmounted, watch } from "vue";
import { getActiveData } from "@/api/perception/index.ts";
import { getCurrentTimeAndMidnight } from "@/utils/getTimeInfo.ts";
import type { CarData, ChartData } from "@/api/perception/type.ts";
let props = defineProps({
  dataNow: {
    type: Object as () => ChartData,
    default: () => {},
  },
});
let bar = ref();
let mycharts: any;
let data: CarData["data"];
let timeArr: string[] = [];
let countArr: any[] = [];
let intervalV=ref(1000)
watch(
  () => props.dataNow,
  (val: ChartData) => {
    if (val) {
      data.chart.push(val);
      updataOption();
      mycharts.setOption(option);
    }
  },
  { deep: true }
);
getActiveData(getCurrentTimeAndMidnight()).then((res) => {
  data = res.data;
  updataOption();
  initEcharts();
});
function updataOption() {
  timeArr = data.chart.map((item) => item.formatDate);
  countArr = data.chart.map((item) => {
    return { value: item.count };
  });
console.log(Math.max(...countArr.map(res=>res.value))/3);
  countArr[countArr.length - 1] = {
    value: countArr.at(-1).value,
    symbolSize: 15,
    itemStyle: {
      color: "#54d176",
      borderColor: "rgba(67, 208, 125,.5)",
      borderWidth: 15, //拐点边框大小，
    },
  };
  intervalV.value=Math.floor(Math.max(...countArr.map(res=>res.value))/2)
  option.xAxis[0].data = timeArr;
  option.yAxis[0].interval = intervalV.value;
  option.series[0].data = countArr;
}
const option = {
  color: ["#54d176"],
  tooltip: {
    show: true, // 显示提示框,
    trigger: "axis", // 'axis' 表示与坐标轴触发，适用于柱状图、折线图等
    renderMode: "html",
    boxWidth: 400,
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
    },
  },

  grid: {
    left: "2%",
    right: "6%",
    bottom: "8%",
    containLabel: true,
  },
  xAxis: [
    {
      type: "category",
      data: timeArr,
      boundaryGap: false,
      axisTick: {
        show: false, // 不显示坐标轴刻度线
      },
      axisLine: {
        lineStyle: {
          color: "#ffffff",
        },
      },
      //x底部文字
      axisLabel: {
        textStyle: {
          padding: [10, 0, 0, 0], //表示 [上, 右, 下, 左] 的边距。
          color: "rgba(230, 247, 255, 0.50)",
          fontSize: '0.75rem',
        },
        formatter: function (value:any) {
                return value.substring(10);
            }
      },
    },
  ],
  yAxis: [
    {
      type: "value",
      //y右侧文字
      axisLabel: {
        textStyle: {
          color: "rgba(230, 247, 255, 0.50)",
          fontSize: '1rem',
        },
      },
      interval:intervalV.value,
      // y轴的分割线
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(230, 247, 255, 0.20)",
        },
      },
    },
  ],
  series: [
    {
      name: "在线车辆",
      type: "line",
      smooth: true,
      symbol: "circle", //拐点设置为实心
      symbolSize: 10, //拐点大小
      tooltip: {
        trigger: "axis",
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "line", // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      lineStyle: {
        normal: {
          width: 3,
          shadowColor: "#1890FF",
          shadowBlur: 20,
        },
      },
      areaStyle: {
        opacity: 1,
        //右下左上
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "rgba(2, 122, 62, .8)",
          },
          {
            offset: 0.3,
            color: "rgba(2, 122, 62, 0.5)",
          },
          {
            offset: 1,
            color: "rgba(2, 122, 62, 0)",
          },
        ]),
      },
      data: countArr,
    },
  ],
};
window.addEventListener('resize', () => {
    // 当浏览器大小改变时，重绘ECharts图表
    mycharts.resize();
});
const initEcharts = () => {
  mycharts = echarts.init(bar.value);
  mycharts.setOption(option);
};

onUnmounted(() => {
  mycharts.dispose;
});
</script>
<style lang="scss" scoped>
.box {
  background: url(@/assets/systemPerceptionImage/border_green.png) no-repeat;
  background-size: 100% 100%;
  margin: 0rem 0.625rem 0.625rem 0.9375rem;
  padding: 0.625rem 0 0 0.625rem;
  .title {
    height: 2.1vh;
    line-height: 2.88vh;
    display: flex;
    padding-top: 0.4375rem;
    align-items: center;
    > img {
      margin-top: -1.06vh;
    }
    border-left-style: none;
    border-right-style: none;
    span {
      font-size: 1rem;
    }
    span:first-child {
      font-size: 1.5625rem;
      font-weight: 900;
    }
  }
  .charts {
    width: 100%;
    height: calc(100% - 3.5vh);
  }
}
</style>
