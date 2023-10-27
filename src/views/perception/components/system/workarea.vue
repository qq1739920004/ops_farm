<template>
  <div class="box">
    <div class="title">
      <img src="~@/assets/systemPerceptionImage/onlineNumIcon.png" alt="">
      <span>各省在线数/总数</span>
    </div>
    <div class="charts-box">
      <div class="charts" ref="bar"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { ref, watch, onUnmounted, onMounted } from "vue";

const props = defineProps(["carAreas"]);
let chartIcon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAXCAYAAADgKtSgAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAALuSURBVEiJ1ZTNaxNBGMbfmd24Jn6VxWbKZLYs6VJxqQhGUBbBXvTg0T/CXsTiScWrBw8eRCl6t4eAtLdaPbcXpSrx0ChtpaVtqBs2mGCqM+zMeGi2hJK09eOgDwwLw+zveeZ9hxfgHxECACSEOPu3oRgAsJTymtb6tdb6SWv/j6EGAKSiKDqvlHoTRdF5IcSIlPLa7xokYNPzPIsQcsi27aPlcvki5/z+wsKC7/v+gZbxLxkgAMCFQiHFGEu7rttDCMnmcjnWaDQe6C2VS6XSkOd5FgCY+zXYBlNKM4wxO5fLMUrpiSiKHuo2KaU+zs3NnXJd9+B+DTAAmIyxNGPMppT2E0KGwjB8pDsoMWjdYNcSIQAwPM+zwjAc5Zy/J4QMbWxsPO4EbjcolUpD9Xr9nJTyaTcDDACper1+nXP+rlgsXu2WuIPKy8vLJ4UQI61nug1MUoPv+2h9ff0DAKDBwcHTq6urX/bTKCnlUhAEKxjjM0qp951Kgn3fP5DP549NT09fWVtbe04pvTwzM3Nvt8ic8xfZbJYsLS1dEEKMtJcFtX2R7/tmGIZWOp0+IoSwTdPsBYDj4+PjZ4aHh2/vTCSEeDkwMHAjjuOvGONmpVIRACABQANsdXhb1WoV9fT0YK01TqVSRhzHBgAYk5OT9UKhsOi67oXkLOf8led5t5RS3yzL+m5ZlqjVaioB74QjAADHcaDRaICUEkzTRIZhgFIKJiYmwiAIPjmOc5Fz/iqfz9+J47iBMW5KKX+srKzELXBHeJIeKKV6c3NTp9NprZRSWmuJEBKO41iWZb0OgmBsbGysf2pq6rNS6rtt23G1WpXt4G5CAGC6rnvQtu2j2WyW9PX1ucVi8Wqz2fwwPz9/t1arPatUKjcJIYd+Z8YgaA2t3t7ew4wxmxCSnZ2dvSSEeBuG4SilNLMXeDe3ZM7gKIoMIQSWUiLDMHQmk5GLi4sSAJIGdizHXldBO1YivWN1/XkvdTuzZ/P+X/0ED5XU2wnYGsEAAAAASUVORK5CYII=`;
let plist=props.carAreas
const listy = plist.map((item: any) => item.onlineNum);
const listyTotal = plist.map((item: any) => item.totalNum);

const listx = plist.map((item: any) => item.name);
// 获取图表节点
let bar = ref();
let mycharts: echarts.ECharts = {} as echarts.ECharts;
type DataZoomMove = {
  start: number;
  end: number;
};
const dataZoomMove: DataZoomMove = {
  start: 0,
  end: 7,
};

const option = {
  xAxis: {
    type: "value",
    axisLabel: {
        show: false  // 隐藏x轴的标签
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: "#354941",
        //虚线
        type: "dashed",
      },
    },
  },
  yAxis: {
    axisLabel: {
      show: true,
      interval: 0,  // 显示所有标签
      margin: 2,
      textStyle: {
        fontSize: 14,
        //文字颜色
        color: "#cccfce",
      },
      // 调整左侧文字的3个属性，缺一不可
      //调整文字上右下左
      padding: [15, 0, 15, 0],
    },
    type: "category",
    data: listx,
    inverse: true,
    splitLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLine: {
      show: false,
    },
  },
  grid: {
    containLabel: true,
    left: "5%",
    right: "20%",
    top: "10%",
    bottom: "5%",
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
  series: [
    {
      barGap: "0%", // 柱子之间的间隔，这里没有间隔
      data: listy,
      type: "bar",
      barWidth: 8,
      showBackground: true,
      label: {
        show: true, //是否显示标签
        position: "right", //标签位置
        color: "#3aed81", //标签颜色
        formatter: function (params: any) {
          //标签内容
          if (params.value > 0) {
            //大于0显示标签
            //取小数点2位
            return `{a|} ${params.value} / {b|${listyTotal[params.dataIndex]}}`;
          } else {
            return `     ${params.value} / {b|${listyTotal[params.dataIndex]}}`;
          }

        },
        distance: -12,//
        rich: {
          a: {
            widht: 22,
            height:22,
            backgroundColor: {
              image: chartIcon,
            },
          },
          ano:{
            widht: 22,
            height:22,
          },
          b:{
            color:'#34abad',
            fontSize: 15,
          }
        },
      },
      itemStyle: {
        //设置柱子边距
        borderRadius: [2, 20, 20, 2],
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          {
            offset: 0,
            color: "rgba(0, 255, 179, 0.58)",
          },
          {
            offset: 1,
            color: "rgba(94, 255, 0, 0.9)",
          },
        ]),
      },
      backgroundStyle: {
        color: "none",
      },
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
    if (dataZoomMove.end > listx.length - 1) {
      dataZoomMove.start = 0;
      dataZoomMove.end = 7;
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
window.addEventListener('resize', () => {
    // 当浏览器大小改变时，重绘ECharts图表
    mycharts.resize();
});
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
  isDataUpdated.value = true;
  let plist=newValue.carAreas
  option.yAxis.data = plist.map((item: any) => item.name);
  option.series[0].data = plist.map((item: any) => item.totalNum);
   // 设置新数据后，保持当前的滚动位置
   option.dataZoom[0].startValue = dataZoomMove.start;
  option.dataZoom[0].endValue = dataZoomMove.end;
  mycharts.setOption(option,true);
});

onUnmounted(() => {
  mycharts.dispose;
});
</script>

<style lang="scss" scoped>
.box {
  background: url(@/assets/systemPerceptionImage/border_green_state.png) no-repeat;
  background-size: 100% 100%;
  margin: 0rem 0.625rem 2.125rem 0.9375rem; /* 0px 10px 34px 15px */
  padding: 0.625rem 0 0 0.625rem; /* 10px 0 0 10px */
  
  .title {
    height: 2.1vh; /* 40px */
    display: flex;
    align-items: center;
    padding-top: 0.4375rem;

    > img {
      margin-top: -0.625rem; /* -10px */
    }
    
    border-left-style: none;
    border-right-style: none;

    span {
      font-size: 1rem; /* 16px */
    }
  }

  .charts-box {
    position: relative;
    width: 100%;
    height: calc(100% - 2.1vh); /* 100% - 40px */
    
    .charts {
      width: 100%;
      height: 100%;
    }

    // background-color: rgb(233, 208, 212, 0.2);
  }
}
</style>
