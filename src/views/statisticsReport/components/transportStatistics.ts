import { shallowRef } from "vue";
import type { ShallowRef } from "vue";
import type { getStatisticsRemoteAPIResponse } from "@/api/statisticsReport/type";
//导入echarts的option类型
import type { EChartsOption } from "echarts";
export function transportOption(
  data: getStatisticsRemoteAPIResponse["data"],
  optionfnStatistics: ShallowRef<EChartsOption>
) {
  let option = shallowRef<EChartsOption>({});
 const purifyData:number[][]=[[],[],[],[]]
  data.chart.data.forEach((item)=>{
    purifyData[0].push(item[0])
    purifyData[1].push(item[1])
    purifyData[2].push(item[2])
    purifyData[3].push(item[3])
  })
  option.value = {
    grid: {
      right: 30,
      bottom: 30,
      top: 80,
      left: 40
    },
    title: {
      text: '运维统计',
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
          name: '远程校准',
          icon: 'roundRect'
        },
        {
          name: '设置数据链',
          icon: 'roundRect'
        },
        {
          name: '注册',
          icon: 'roundRect'
        },
        {
          name: '小程序',
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
      axisLabel: {
        color: '#000'
      },
      nameTextStyle: {
        color: '#fff'
      }
    },
    series: [
      {
        data: purifyData[0],
        smooth: false,
        type: 'line',
        name: '远程校准',
        itemStyle: {
          color: '#44AAFF'
        }
      },
      {
        data: purifyData[1],
        smooth: false,
        type: 'line',
        name: '设置数据链',
        itemStyle: {
          color: '#FF4A3A'
        }
      },
      {
        data: purifyData[2],
        smooth: false,
        type: 'line',
        name: '注册',
        itemStyle: {
          color: '#00E581'
        }
      },
      {
        data: purifyData[3],
        smooth: false,
        type: 'line',
        name: '小程序',
        itemStyle: {
          color: '#ffa500'
        }
      }
    ]
  },

  optionfnStatistics.value = option.value;
  return option;
}
