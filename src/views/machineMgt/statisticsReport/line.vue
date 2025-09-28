<template>
  <div class="app_container">
    <h4 class="title">激活总量折线图</h4>
    <div class="echartLine" id="echartLine"></div>



  </div>
</template>
<script setup lang="ts">
import {ref,reactive,onMounted} from "vue"
import * as echarts from "echarts";
import {statisticalLineData} from '@/api/statisticsReport';
let seriesData:any[]=[];
let xAxisList:any[]=[];
onMounted(async ()=>{
    const {outTotalList,deliveryTimeList}=(await statisticalLineData()).data;
    seriesData=outTotalList;
    xAxisList=deliveryTimeList;
    initEchartLine();
   
})
const initEchartLine=()=> {
      let myChart = echarts.init(document.getElementById("echartLine"));
      const textColor = "#A4A4A4";
      let option = {
        tooltip: {
          trigger: "axis",
        },
        grid: {
          top: "15%",
          left: "5%",
          right: "10%",
          bottom: "15%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: xAxisList,
          axisLabel: {
            // 坐标轴字体颜色
            color: textColor,
            fontSize: 16,
            interval: 0,
          },
          axisLine: {
            lineStyle: {
              color: textColor,
            },
          },
          axisTick: {
            // y轴刻度线
            show: true,
          },
          splitLine: {
            // 网格
            show: false,
          },
          boundaryGap: true,
        },
        yAxis: {
          type: "value",
          min: 0,
          name: "激活数量(个)",
         
          nameTextStyle: {
            color: "#A4A4A4",
            fontSize: 14,
            padding: [0, 0, 0, 80],
          },
          axisLabel: {
            // 坐标轴字体颜色
            color: textColor,
            fontSize: 16,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            // y轴刻度线
            show: false,
          },
          splitLine: {
            // 网格
            show: true,
            lineStyle: {
              color: "#e8eefe",
            },
          },
        },

        series: [
          {
            name: "激活数量",
            type: "line",
            //symbol: "circle",
            symbolSize: 8,
            z: 1,
            itemStyle: {
              color: "#33B838",
            },
            lineStyle: {
              color: "#33B838",
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
                    color: "#33B838",
                  },
                  {
                    offset: 1,
                    color: "#ffffff",
                  },
                ],
              },
            },
            data: seriesData,
          },
        ],
      };
      myChart.setOption(option);
    }

</script>
<style lang="scss" scoped>

.echartLine {
  width: 100%;
  height: 500px;
}
.title{
  text-align: center;
  font-size: 18px;
}


</style>
