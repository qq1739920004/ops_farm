import { shallowRef } from "vue";
import type { ShallowRef } from "vue";
import type { getStatisticsWxAPIResponse } from "@/api/statisticsReport/type";
//导入echarts的option类型
import type { EChartsOption } from "echarts";

export function fnOption(
  data: getStatisticsWxAPIResponse["data"],
  optionfnStatistics: ShallowRef<EChartsOption>,
  t: any
) {
  let option = shallowRef<EChartsOption>({});
  option.value = {
    grid: {
      right: 30,
      bottom: 30,
      top: 80,
      left: 40
    },
    title: {
      text: t('statisticsReport.newVehicle'),
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
          name: t('statisticsReport.parameter'),
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
        data: data.chart.data,
        smooth: false,
        type: 'line',
        name: t('statisticsReport.parameter'),
        itemStyle: {
          color: '#00FB8D'
        }
      }
    ]
  },

  optionfnStatistics.value = option.value;
  return option;
}
