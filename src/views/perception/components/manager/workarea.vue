http://localhost:8088/#/monitoring<template>
  <div class="box">
    <div class="title">
      <span>|</span>&nbsp
      <span class="arrows-shadow">▸</span>
      {{$t('perception.workingAreaMu')}}
      <span class="arrows-shadow">◂</span>
    </div>
    <div class="charts-box" :style="{ '--nullText':'\''+$t('perception.nullDeviceArea')+'\''}">
      <div :class="['charts',isnull?'charts-null':'']" ref="bar"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { ref, watch, onUnmounted, onMounted } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps(["carAreas"]);
let carAreas = ref([]);
let isnull=ref(false) 
isnull.value=!props.carAreas.some((item:any)=>item.carArea>0)
if(isnull.value){
  carAreas.value=props.carAreas
}else{
  carAreas.value=props.carAreas.filter((item:any)=>item.carArea>0)
}
let chartIcon = `data:image/png;base64,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`;
const listy = carAreas.value.map((item: any) => item.carArea);
const listx = carAreas.value.map((item: any) => item.userNameCar);
// 获取图表节点
let bar = ref();
let mycharts: echarts.ECharts = {} as echarts.ECharts;
type DataZoomMove = {
  start: number;
  end: number;
};
const dataZoomMove: DataZoomMove = {
  start: 0,
  end: 5,
};
const option = {
  tooltip: {
            show: true, // 显示提示框,
            trigger: 'axis', // 'axis' 表示与坐标轴触发，适用于柱状图、折线图等
            renderMode: 'html',
            boxWidth: 400,
        },
  xAxis: {
    type: "value",
    show: false,
  },
  yAxis: {
    axisLabel: {
      show: true,
      margin: 2,
      textStyle: {
        fontSize: 14,
        //文字颜色
        color: "#cccfce",
      },
      // 调整左侧文字的3个属性，缺一不可
      verticalAlign: "bottom", //文字垂直对齐方式，默认自动
      align: "left", //文字水平对齐方式，默认自动
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
    left: "5%",
    top: '5%',
    bottom: '2%',
    right: "20%",
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
      name:t('work.are'),
      barGap: "0%", // 柱子之间的间隔，这里没有间隔
      data: listy,
      type: "bar",
      barWidth: 12,
      showBackground: true,
      label: {
        show: true, //是否显示标签
        position: "right", //标签位置
        color: "#3aed81", //标签颜色
        fontSize:13,
        //字体
        fontFamily: "perceptionFont",
        formatter: function (params: any) {
          //标签内容
          if (params.value > 0) {
            //大于0显示标签
            //取小数点2位
            return `{a|} ${params.value.toFixed(2)}`;
          } else {
            return `   0`;
          }
        },
        distance: -20,
        rich: {
          a: {
            widht: 40,
            height:40,
            backgroundColor: {
              image: chartIcon,
            },
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
      dataZoomMove.end = 4;
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
  window.addEventListener("resize", () => {
    mycharts.resize();
  });
});
watch(props, (newV) => {
  let newValue={...newV}
  isnull.value=!newV.carAreas.some((item:any)=>item.carArea>0)
  console.log(isnull.value);
if(isnull.value){
  newValue.carAreas=newV.carAreas
}else{
  newValue.carAreas=newV.carAreas.filter((item:any)=>item.carArea>0)
}
  isDataUpdated.value = true;
  option.yAxis.data = newValue.carAreas.map((item: any) => item.userNameCar);
  option.series[0].data = newValue.carAreas.map((item: any) => item.carArea);
   // 设置新数据后，保持当前的滚动位置
   option.dataZoom[0].startValue = dataZoomMove.start;
  option.dataZoom[0].endValue = dataZoomMove.end;
  mycharts.setOption(option,true);
});

onUnmounted(() => {
  mycharts.dispose;
  window.removeEventListener("resize", () => {
    mycharts.resize();
  });
});
</script>

<style lang="scss" scoped>
.box {
  background: url(@/assets/perceptionImage/border_green.png) no-repeat;
  background-size: 100% 100%;
  margin: 0.625rem 0.625rem 0.625rem 0.9375rem;
  .title {
    height: 2.5rem;
    line-height: 1.6875rem;

    background: linear-gradient(
      to right,
      rgba(31, 61, 43, 1),
      rgba(48, 117, 76, 0)
    );
    border: 0.05rem solid;
    border-image: linear-gradient(
        to right,
        rgb(63, 255, 140, 0.8),
        rgba(48, 117, 76, 0)
      )
      1;
    border-left-style: none;
    border-right-style: none;

    span {
      font-size: 1.25rem;
    }

    span:first-child {
      font-size: 1.875rem;
      font-weight: 900;
    }
  }

  .charts-box {
    position: relative;
    width: 100%;
    height: calc(100% - 2.5rem);
    .charts {
      width: 100%;
      height: 100%;
    }
    .charts-null{
      filter: grayscale(100%);
      background-color: #0211093c;
    }
    .charts-null::after{
      content: var(--nullText);
      font-size: 18px;
      letter-spacing: 3px;
      font-weight: 700;
      position: absolute;
      top:calc(50% - 18px);
      text-align: center;
      width: 100%;
    }

    // background-color: rgb(233, 208, 212, 0.2);
  }
}
</style>
