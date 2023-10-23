<template>
  <div class="box">
    <div class="title">
      <img src="~@/assets/systemPerceptionImage/onlineIcon.png" alt="">
      <span>各类型农机在线数</span> 
    </div>

    <div class="charts" ref="bar"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { ref, watch, onMounted, onUnmounted } from "vue";

let bar = ref();
var mycharts: any;
const props = defineProps({
  typeCounts: {
    type: Object,
  },
});

let dataList = [
  {
    typeName: "car",
    onlineCount: 0,
    totalCount: 0,
  },
];
type DataZoomMove = {
  start: number;
  end: number;
};
const dataZoomMove: DataZoomMove = {
  start: 0,
  end: 3,
};
dataList = JSON.parse(JSON.stringify(props.typeCounts));
let yAxisData: string[] = [];
let xAxisData: number[] = [];
let seriesData: number[] = [];
let maxV = 0;
let seriesDataO: { value: number }[] = [];
dataList.forEach((r) => {
  yAxisData.push(r.typeName);
  xAxisData.push(r.onlineCount);
  seriesData.push(r.totalCount);
  maxV = Math.max(...seriesData);
  seriesDataO.push({ value: r.onlineCount });
});

const option = {
  tooltip: {
            show: true, // 显示提示框,
            trigger: 'axis', // 'axis' 表示与坐标轴触发，适用于柱状图、折线图等
            boxWidth: 400,
        },
  backgroundColor: "",
  grid: {
    containLabel: true,
    bottom: "5%",
    top: "5%",
    left: "3%", // 增加这个值，从而减少第二个yAxis的宽度
    right: "5%",
  },
  dataZoom: [
    {
      show: true, // 为true 滚动条出现
      realtime: true,
      type: "inside", // 内部数据区域缩放和选择
      disabled: true, // 禁用数据区域缩放和选择功能
      startValue: dataZoomMove.start,
      endValue: dataZoomMove.end,
      yAxisIndex: [0, 1], //这个字段的作用是指定哪个轴可以进行缩放操作，这里的0表示x轴，1表示y轴
    },
    {
      //没有下面这块的话，只能拖动滚动条，鼠标滚轮在区域内不能控制外部滚动条
      type: "inside",
      yAxisIndex: 0,
      zoomOnMouseWheel: false, //滚轮是否触发缩放
      moveOnMouseMove: false, //鼠标移动时触发
      moveOnMouseWheel: true, //鼠标滚轮触发移动
    },
  ],
  xAxis: {
    type: "value",
    axisLabel: {
      color: "#fff",
      show: false,
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: "rgba(21, 200, 221,0.2)",
        type: "dashed",
      },
    },
    data: xAxisData,
  },
  yAxis: [
    {
      type: "category",
      axisLabel: {  
        interval: 0, //强制显示所有标签
        formatter: function (value: any) {
          // 动态计算 rank 标签的 left 位置，确保不与 title 冲突
          if (value.length > 6) {
            value = value.substring(0, 5) + "...";
          }
          return "{title|"+value+"}";
        },
        rich: {
          rank: {
            color: "#ffffff",
            align: "left",
          },
          rank2: {
            color: "#ffffff",
            //右边距
            padding: [0, 15, 0, 0],
          },
          title: {
            color: "#43cf7c",
            fontSize: 24,
            align: "left",
            width: 100,
          },
        },
      },
      axisLine: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      data: yAxisData,
    },
    {
      axisLine: {
        show: false,
      },
      type: "category",
      axisTick: {
        show: false,
      },
      inverse: false,
      data: seriesData,
      axisLabel: {
        color: "#43cf7c",
        fontSize: 20,
      },
    },
  ],
  series: [
    {
      type: "pictorialBar",
      symbol: "path://M1 1,L140 1,L140 15,L1 15,Z",
      symbolKeepAspect: false,
      stack: "triangle",
      name:'在线数',
      barWidth: 5,
      itemStyle: {
        borderWidth: 0,
        color: "#43cf7c",
      },
      label: {
        show: true,
        position: "insideRight",
        color: "#f5fff5",
        fontSize: 16,
        offset: [5, -10],
        formatter: function (data: { value: number }) {
          // 柱子顶部分隔线样式
          return [`{value| ${data.value}}{a0| |}`];
        },
        rich: {
          a0: {
            align: "left",
            padding: [20, 0, 0, 0], // 仅移动a0
          },
          value: {
            color: "#f5fff5",
            fontSize: 16,
            align: "right",
          },
        },
      },
      data: seriesDataO,
    },

    {
      name: "背景",
      type: "bar",
      tooltip: { show: false },
      barWidth: 13,
      barGap: "-100%",
      data: seriesData.map(() => maxV),
      itemStyle: {
        normal: {
          color: "#023525",
        },
      },
      z: -1,
    },
  ],
};

const initEcharts = () => {
  mycharts = echarts.init(bar.value);
  mycharts.setOption(option);
};
let isDataUpdated = ref(false);

//设置为定时器类型
let dataZoomMoveTimer:any
const startMoveDataZoom = (
  myChart: echarts.ECharts,
  dataZoomMove: DataZoomMove
) => {
  dataZoomMoveTimer = setInterval(() => {
    if (isDataUpdated.value) {
      // 如果数据已更新，重置标志并跳过此次移动
      isDataUpdated.value = false;
      return;
    }
    dataZoomMove.start += 1;
    dataZoomMove.end += 1;
    if (dataZoomMove.end > yAxisData.length - 1) {
      dataZoomMove.start = 0;
      dataZoomMove.end = 3;
    }
    myChart.setOption({
      dataZoom: [
        {
          type: "inside", // 内部数据区域缩放和选择
          startValue: dataZoomMove.start,
          endValue: dataZoomMove.end,
        },
      ],
    });
  }, 2000);
};
onMounted(() => {
  initEcharts();
  startMoveDataZoom(mycharts, dataZoomMove);
  let chartDom = mycharts.getDom();
  chartDom.addEventListener("mouseout", () => {
    if (dataZoomMoveTimer) return;
    let dataZoomMove_get = (mycharts.getOption() as any).dataZoom[0];
    dataZoomMove.start = dataZoomMove_get.startValue;
    dataZoomMove.end = dataZoomMove_get.endValue;
    startMoveDataZoom(mycharts, dataZoomMove);
  });
  // 移入
  // myChart.on
  chartDom.addEventListener("mouseover", () => {
    clearInterval(dataZoomMoveTimer);
    dataZoomMoveTimer = undefined;
  });
});

watch(props, (newValue) => {
  dataList = JSON.parse(JSON.stringify(newValue.typeCounts));
  let yAxisData: string[] = [];
  let xAxisData: number[] = [];
  let seriesData: number[] = [];
  maxV = Math.max(...seriesData);
  let seriesDataO: { value: number }[] = [];
  dataList.forEach((r) => {
    yAxisData.push(r.typeName);
    xAxisData.push(r.onlineCount);
    seriesData.push(r.totalCount);
    maxV = Math.max(...seriesData);
    seriesDataO.push({ value: r.onlineCount });
  });
  option.yAxis[0].data = yAxisData;
  option.yAxis[1].data = seriesData;
  option.xAxis.data = xAxisData;
  option.series[0].data = seriesDataO;
  option.series[1].data = seriesData.map(() => maxV);
     // 设置新数据后，保持当前的滚动位置
     option.dataZoom[0].startValue = dataZoomMove.start;
  option.dataZoom[0].endValue = dataZoomMove.end;
  mycharts.setOption(option);
});

onUnmounted(() => {
  mycharts.dispose;
});
</script>
<style lang="scss" scoped>
.box {
  background: url(@/assets/systemPerceptionImage/border_green.png) no-repeat;
  background-size: 100% 100%;
  margin: 0px 10px 10px 15px;
  padding:10px 0 0 10px ;
  .title {
    height: 40px;
    line-height: 27px;
    display: flex;
    align-items: center;
    >img{
      margin-top: -10px;
    }
  
    border-left-style: none;
    border-right-style: none;

    span {
      font-size:16px ;

    }

    span:first-child {
      font-size: 30px;
      font-weight: 900;
    }
  }

  .charts {
    height: calc(100% - 40px);
  }
}
</style>
