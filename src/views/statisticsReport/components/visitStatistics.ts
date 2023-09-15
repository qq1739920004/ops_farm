import { shallowRef } from "vue";
import type { ShallowRef } from "vue";
import type { getStatisticsStatAPIResponse } from "@/api/statisticsReport/type";
//导入echarts的option类型
import type { EChartsOption } from "echarts";
export function visitOption(
  data: getStatisticsStatAPIResponse["data"],
  optionfnStatistics: ShallowRef<EChartsOption>
) {
  let option = shallowRef<EChartsOption>({});
 const purifyData:number[][]=[[],[]]
  data.chart.data.forEach((item)=>{
    purifyData[0].push(item[0])
    purifyData[1].push(item[1])
  })
  option.value = {
    grid: {
      right: 30,
      bottom: 30,
      top: 80,
      left: 40
    },
    title: {
      text: '访问次数统计',
      left: 13,
      top: 16,
      textStyle: {
        color: "rgb(0, 0, 0)",
        fontSize: 24,
        fontWeight: "normal",
      },
    },
    legend: {
      type: 'plain',
      zlevel: 9,
      top: 10,
      right: 10,
      data: [
        {
          name: '态势监控',
          icon: 'roundRect'
        },
        {
          name: '农机列表',
          icon: 'roundRect'
        }
      ]
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    dataZoom: [
      {
        type: 'inside',
        realtime: true,
        zoomOnMouseWheel: true
      }
    ],
    xAxis: {
      type: 'category',
      data: data.chart.date,
      axisLine: {
        lineStyle: {
          color: '#B9C8DB'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#000'
      }
    },
    yAxis: {
      type: 'value',
      name: '',
      axisLine: {
        lineStyle: {
          color: '#B9C8DB'
        }
      },
      splitNumber: 3,
      axisTick: {
        show: false
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: '#384155'
        }
      },
      axisLabel: {
        color: '#000'
      },
      nameTextStyle: {
        color: '#fff'
      }
    },
    series: [
      {
        data:purifyData[0],
        smooth: false,
        type: 'line',
        name: '态势监控',
        itemStyle: {
          color: '#FFBA37'
        }
      },
      {
        data:purifyData[1],
        smooth: false,
        type: 'line',
        name: '农机列表',
        itemStyle: {
          color: '#44AAFF'
        }
      }
    ]
  },

  optionfnStatistics.value = option.value;
  return option;
}
