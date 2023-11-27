import type { MonitorObj } from "@/api/perception/type";
import { ref, shallowRef } from "vue";
import * as echarts from "echarts";
type EChartsParams = {
  value: number;
};
let width = ref(40);
let height = ref(160);
let marginTop = ref(80);
let numCurent = ref(0);
let chartList = shallowRef<any>([]);
let chartContainerList = ref<any>([]);
let optionsList = ref<any>([]);
let isUpdata = ref(false);  
function updateChart(dataList: MonitorObj["provinceCars"]) {
  if (!isUpdata.value) return;
  optionsList.value.forEach((item: any, index: number) => {
    item.xAxis.data[0] = dataList[index + 1].cityName;
    item.series[0].data[0] = dataList[index + 1].onlineNum;
    item.series[1].data[0] =
      dataList[index + 1].totalNum - dataList[index + 1].onlineNum;
    chartList.value[index].setOption(item, true);
  });
}

function setMarker(AMap: any, map: any, dataList: MonitorObj["provinceCars"],t:any) {
  for (let i = 0; i <= dataList.length; i++) {
    if (!dataList[i].code) return;
    const markerContent = document.createElement("div");
    const markerContent2 = document.createElement("div");
    markerContent2.style.width = `${width.value}px`;
    markerContent2.style.height = `${height.value}px`;
    markerContent2.style.marginTop = `-${marginTop.value}px`;
    const chartContainer = document.createElement("div");
    chartContainer.style.width = `${width.value}px`;
    chartContainer.style.height = `${height.value}px`;
    chartContainer.style.marginTop = `-${marginTop.value}px`;
    markerContent.appendChild(chartContainer);
    new AMap.Marker({
      position: [dataList[i].lng, dataList[i].lat],
      content: markerContent,
      map: map.value,
      zIndex: 999999,
    });
   
    // 使用ECharts初始化柱状图容器并设置数据
    const chart = echarts.init(chartContainer);
    chartList.value.push(chart);
    chartContainerList.value.push(chartContainer);
      // 为ECharts容器添加一个类，以应用上面的CSS样式
      chartContainer.classList.add('echarts-container');

      chart.on('mouseover', function() {
          // 将所有ECharts容器的透明度设置为0，从而实现淡出效果
          chartContainerList.value.forEach((container:any) => {
              container.style.opacity = '0';
          });
          // 将当前的ECharts容器的透明度设置为1，从而实现淡入效果
          chartContainer.style.opacity = '1';
      });
  
      chart.on('mouseout', function() {
          // 将所有ECharts容器的透明度设置为1，从而实现淡入效果
          chartContainerList.value.forEach((container:any) => {
              container.style.opacity = '1';
          });
      });
    const option = {
      tooltip: {
        show: true, // 显示提示框,
        trigger: "axis", // 'axis' 表示与坐标轴触发，适用于柱状图、折线图等
        renderMode: "html",
        boxWidth: 400,
        backgroundColor: "rgba(85, 104, 79, 0.5)", // 设置背景颜色为透明
        textStyle: {
          color: "#FFFFFF", // 设置字体颜色为白色
        },
        borderColor: "rgba(67, 207, 124, 1)", // 设置边框颜色
        borderWidth: 1, // 设置边框宽度，可以根据需要调整
        z: 100, // 设置柱状图的层级
        formatter: function (params: any) {
          // params 是一个包含每个系列数据点信息的数组
          // 您可以根据 params 的内容自定义 tooltip 的格式
          let tooltipHtml = '<div style="padding:10px; z-index: 1;">';
          tooltipHtml += '<h4 style="margin:0;">' + params[0].name + "</h4>";
          params.forEach(function (param: any) {
            tooltipHtml += '<p style="margin:0;">';
            tooltipHtml +=
              '<span style="display:inline-block;width:10px;height:10px;background:' +
              param.color +
              ';"></span>';
            // 判断系列名称并显示相应的数据
            if (param.seriesName === t('perception.tonline')) {
              tooltipHtml += " " + param.seriesName + ": " + param.data;
              numCurent.value = param.data;
            } else if (param.seriesName === t('perception.total')) {
              tooltipHtml +=
                " " + param.seriesName + ": " + (param.data + numCurent.value); // 使用 totalNum
            }
            tooltipHtml += "</p>";
          });
          tooltipHtml += "</div>";
          return tooltipHtml;
        },
      },
      xAxis: {
        type: "category",
        data: [dataList[i].name],
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: true,
          color: "white",
        },
        axisLine: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        show: false, // 隐藏y轴
      },
      series: [
        {
          z: 50, // 设置柱状图的层级
          name: t('perception.tonline'),
          data: [dataList[i].onlineNum],
          type: "bar",

          itemStyle: {
            //柱子颜色
            color: "#54d176",
            borderRadius: [2, 2, 0, 0],
          },
          stack: "total", //设置堆叠
          emphasis: {
            //
            focus: "series",
          },
          label: {
            show: true,
            color: "#16A157",
            position: "top",
            formatter: function(params:EChartsParams) {
              // 如果在线数为0，则不显示
              if (params.value === 0) {
                  return '';
              }
              return params.value;
          },
          },
        },
        {
          z: 50, // 设置柱状图的层级
          name: t('perception.total'),
          data: [dataList[i].totalNum - dataList[i].onlineNum],
          type: "bar",
          itemStyle: {
            color: "#eddb39",
            borderRadius: [2, 2, 0, 0],
          },
          stack: "total",
          emphasis: {
            focus: "none",
          },
          label: {
            show: true,
            color: "white",
            position: "top",
            formatter: function () {
              return dataList[i].totalNum; // 显示总数
            },
          },
        },
      ],
    };
    optionsList.value.push(option);
    chart.setOption(option);
  }
  isUpdata.value = true;
}
export {
  setMarker,
  updateChart,
  width,
  height,
  marginTop,
  chartContainerList,
  chartList,
};
