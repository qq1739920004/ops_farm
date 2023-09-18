<template>
  <div class="charttwo">
    <div class="container" ref="main"></div>
    <div class="pic">
      <div class="pic-item" v-for="(item,index) in tem">
        <img v-if="index===0" src="@/assets/statisticsReport/xinhao1.png" alt="" />
        <img v-if="index===1" src="@/assets/statisticsReport/xinhao2.png" alt="" />
        <img v-if="index===2" src="@/assets/statisticsReport/xinhao3.png" alt="" />
        <span :class="{'device-gree':index===0,'device-yellow':index===1,'device-red':index===2}">{{item.name}}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, PropType } from "vue";
import * as echarts from "echarts";
import type { getStatisticsReportnetworkAPIResponse } from "@/api/statisticsReport/type";
const main = ref();
let tem=ref()
const props = defineProps({
  data: {
    type: Object as PropType<
      getStatisticsReportnetworkAPIResponse["data"]["onlineFarmMachines"]
    >,
    default: () => ({}),
  },
});

onMounted(() => {
  init();
});
watch(
  () => props.data,
  () => {
    init();
  },
  { deep: true }
);
function init() {
  if (Object.keys(props.data).length) {
    let carList = props.data;
    let strong = 0;
    let medium = 0;
    let weak = 0;
    carList.forEach((item) => {
      // 统计信号
      item.netSignal <= 1 ? weak++ : "";
      item.netSignal === 2 ? medium++ : "";
      item.netSignal >= 3 ? strong++ : "";
    });
    tem.value = [
      {
        value: strong,
        name: "强",
        itemStyle: { color: "rgba(67, 207, 124, 1)" },
      },
      {
        value: medium,
        name: "中",
        itemStyle: { color: "rgba(255, 195, 0, 1)" },
      },
      { value: weak, name: "弱", itemStyle: { color:  "rgba(255, 87, 51, 1)" } },
    ];
  let myChart = echarts.init(main.value);
  window.addEventListener('resize', () => {
    myChart.resize()
  })
  let option = {
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderColor: "#fff",
          // borderWidth: 2
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: tem.value ,
      },
    ],
  };
  myChart.setOption(option);
  }

}
</script>

<style scoped lang="scss">
.charttwo {
  width: 100%;
  height: 100%;
  display: flex;
}
.container {
  width: 40%;
  height: 100%;
}
.pic {
  width: 50%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .pic-item {
    display: flex;
    height: 70px;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    span {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .templatespan {
      content: "";
      display: block;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .device-gree::before {
      @extend .templatespan;
      background-color: #43cf7c;
    }
    .device-red::before {
      @extend .templatespan;
      background-color: #ff5733;
    }
    .device-yellow::before {
      @extend .templatespan;
      background-color: #ffc300;
    }
  }
}
</style>
