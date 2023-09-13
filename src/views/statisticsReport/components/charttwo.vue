<template>
  <div class="charttwo">
    <div class="container" ref="main"></div>
    <div class="pic">
      <div class="pic-item">
        <img src="@/assets/statisticsReport/xinhao1.png" alt="" />
        <span class="device-gree">1</span>
      </div>
      <div class="pic-item">
        <img src="@/assets/statisticsReport/xinhao2.png" alt="" />
        <span class="device-yellow">2</span>
      </div>
      <div class="pic-item">
        <img src="@/assets/statisticsReport/xinhao3.png" alt="" />
        <span class="device-red">3</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
const main = ref();
onMounted(() => {
  init();
});
function init() {
  let myChart = echarts.init(main.value);

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
        data: [
          {
            value: 1048,
            name: "1",
            itemStyle: { color: "rgba(67, 207, 124, 1)" },
          },
          {
            value: 735,
            name: "2",
            itemStyle: { color: "rgba(255, 87, 51, 1)" },
          },
          {
            value: 580,
            name: "3",
            itemStyle: { color: "rgba(255, 195, 0, 1)" },
          },
        ],
      },
    ],
  };
  myChart.setOption(option);
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
    .templatespan{
      content: "";
      display: block;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      margin-right: 10px;
    }
      .device-gree::before{
      @extend .templatespan; 
      background-color: #43cf7c;
    }
    .device-red::before{
      @extend .templatespan; 
      background-color: #ff5733;
    }
    .device-yellow::before{
      @extend .templatespan; 
      background-color: #ffc300;
    }

  }
}
</style>
