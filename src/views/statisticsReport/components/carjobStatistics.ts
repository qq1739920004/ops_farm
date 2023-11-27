import { shallowRef } from "vue";
import type { ShallowRef } from "vue";
import type { getStatisticsReportcarjobAPIResponse } from "@/api/statisticsReport/type";
//导入echarts的option类型
import type { EChartsOption } from "echarts";
export function carjobOption(
  data: getStatisticsReportcarjobAPIResponse["data"],
  optionfnStatistics: ShallowRef<EChartsOption>,
  t:any
) {
  let xAxisData: string[] = [];
  let carSum: number[] = [];
  let carOnline: number[] = [];
  let carWorked: number[] = [];
  data.rank.map((item) => {
    xAxisData.push(item.name);
    carSum.push(item.allCarCount);
    carOnline.push(item.onlineCarCount);
    carWorked.push(item.workedArea);
  })
  let option = shallowRef<EChartsOption>({});
  option.value = {
    grid: {
      right: 50,
      bottom: 30,
      top: 80,
    },
    title: {
      text: t('statisticsReport.vehicleLocationAndProject'),
      left: 13,
      top: 16,
      textStyle: {
        color: "rgb(0, 0, 0)",
        fontSize: 24,
        fontWeight: "normal",
      },
    },
    dataZoom: [
      {
        type: 'inside',
        realtime: true,
        zoomOnMouseWheel: true
      }
    ],
    tooltip: {
      show: true,
      trigger: 'axis'
    },
   legend: {
      data: [ t('statisticsReport.total'),t('statisticsReport.todayOnline'),t('statisticsReport.cumulativeProject')],
      right: '30',
      top: '20',
   },
   xAxis: [
      {
         type: 'category',
         data: xAxisData,
         axisPointer: {
            type: 'shadow'
         },
         axisLabel: {
          rotate: 45  // 旋转45度
      }
      }
   ],
   yAxis: [
      {
         type: 'value',
        //  name: '单位: 亩',
         nameTextStyle: {
          padding: [0, 0, 0, -30] // 四个数字分别为上右下左与原位置距离
         }
      },
   ],
   series: [
    {
       name: t('statisticsReport.todayOnline'),
       type: 'bar',
       barWidth:5,
       data: carOnline,
       itemStyle: {
                color: '#409eff',
       },
    },
    {
       name: t('statisticsReport.total'),
       type: 'bar',
       barWidth:5,
       itemStyle: {
                color: '#FFE131',
       },
       data: carSum
    },
    {
       name: t('statisticsReport.cumulativeProject'),
       type: 'bar',
       barWidth: 5,
       itemStyle: {
                color: '#00fb8d',
       },
       data: carWorked
    },
 ]
  },
  optionfnStatistics.value = option.value;
  return option;
}
