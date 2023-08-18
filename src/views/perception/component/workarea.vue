<template>
  <div class="box">
    <div class="title">
      <span>|</span>&nbsp
      <span>▸</span>
      各车辆作业面积 亩
      <span>◂</span>
    </div>
    <div class="charts" ref="bar">

    </div>
  </div>
</template>
    
<script setup lang='ts'>
import * as echarts from 'echarts'
import { ref, toRaw, watch, onUnmounted, onMounted } from 'vue'

const props = defineProps(['carArea'])
const carname = toRaw(props.carArea)
const listy = Object.values(carname)
const listx = Object.keys(carname)
const option = {
  xAxis: {
    type: 'value',
    show: false
  },
  yAxis: {
    type: 'category',
    data: listx
  },
  grid: {
    left: 35,
    top: 10,
    right: 15,
    bottom: 10
  },
  series: [
    {
      data: listy,
      type: 'bar',
      barWidth: 10,
      showBackground: true,
      label: {
        show: true, position: 'right',
        color: 'white',
      },
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
          offset: 0,
          color: 'rgba(0, 255, 179, 0.58)'
        }, {
          offset: 1,
          color: 'rgba(94, 255, 0, 0.9)'
        }]),
      },
      backgroundStyle: {
        color: 'rgba(51, 187, 196, 0.32)'
      }
    }
  ]
};
// 获取图表节点
let bar = ref();
var mycharts: any;

const initEcharts = () => {
  mycharts = echarts.init(bar.value)
  mycharts.setOption(option)
}

onMounted(() => {
  initEcharts()
})


watch(props, (newValue) => {
  option.yAxis.data = Object.keys(newValue.carArea)
  option.series[0].data = Object.values(newValue.carArea)
  mycharts.setOption(option)
})

onUnmounted(() => {
  mycharts.dispose;
});

</script>

<style lang="scss" scoped>
.box {
  background: url(../image/border_green.png) no-repeat;
  background-size: 100% 100%;
  margin: 10px 10px 10px 15px;

  .title {
    height: 40px;
    line-height: 27px;

    background: linear-gradient(to right, rgba(31, 61, 43, 1), rgba(48, 117, 76, 0));
    border: 0.8px solid;
    border-image: linear-gradient(to right, rgb(63, 255, 140, 0.8), rgba(48, 117, 76, 0)) 1;
    border-left-style: none;
    border-right-style: none;

    span {
      font-size: 20px;
    }

    span:first-child {
      font-size: 30px;
      font-weight: 900;
    }
  }

  .charts {
    height: calc(100% - 40px);
    // background-color: rgb(233, 208, 212, 0.2);
  }
}
</style>