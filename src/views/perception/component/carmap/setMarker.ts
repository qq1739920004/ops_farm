import type { MonitorObj } from "@/api/perception/type";
import { ref,shallowRef } from 'vue';
import * as echarts from 'echarts';
type EChartsParams = {
  value: number;
};
let width=ref(50);
let height=ref(220);
let marginTop=ref(110);
let numCurent=ref(0)
let chartList=shallowRef<any>([]);
let chartContainerList=ref<any>([]);
let optionsList=ref<any>([]);
let isUpdata=ref(false);
function updateChart(dataList:MonitorObj["provinceCars"]){
  if(!isUpdata.value) return
  optionsList.value.forEach((item:any,index:number)=>{
    item.xAxis.data[0]=dataList[index+1].cityName
    item.series[0].data[0]=dataList[index+1].onlineNum
    item.series[1].data[0]=dataList[index+1].totalNum-dataList[index+1].onlineNum
    chartList.value[index].setOption(item,true)
  })
}

function setMarker(AMap:any,map:any,dataList:MonitorObj["provinceCars"],length:number){
  for(let i=1;i<length;i++){
        const markerContent = document.createElement('div');
        const chartContainer = document.createElement('div');
        chartContainer.style.width = `${width.value}px`;
        chartContainer.style.height = `${height.value}px`;
        chartContainer.style.marginTop = `-${marginTop.value}px`;
        markerContent.appendChild(chartContainer);
        new AMap.Marker({
            position: [dataList[i].lng,dataList[i].lat],
            content: markerContent,
            map: map.value
        });
        // 使用ECharts初始化柱状图容器并设置数据
        const chart = echarts.init(chartContainer);
        chartList.value.push(chart);
        chartContainerList.value.push(chartContainer);
        const option = {
          tooltip: {
            show: true, // 显示提示框,
            trigger: 'axis', // 'axis' 表示与坐标轴触发，适用于柱状图、折线图等
            renderMode: 'html',
            boxWidth: 400,
            formatter: function(params:any) {
              // params 是一个包含每个系列数据点信息的数组
              // 您可以根据 params 的内容自定义 tooltip 的格式
              let tooltipHtml = '<div style="border:1px solid #ccc;padding:10px;">';
              tooltipHtml += '<h4 style="margin:0;">' + params[0].name + '</h4>';
              params.forEach(function(param:any) {
                tooltipHtml += '<p style="margin:0;">';
                tooltipHtml += '<span style="display:inline-block;width:10px;height:10px;background:' + param.color + ';"></span>';
                // 判断系列名称并显示相应的数据
                if (param.seriesName === '在线数') {
                    tooltipHtml += ' ' + param.seriesName + ': ' + param.data;
                    numCurent.value=param.data
                } else if (param.seriesName === '总数') {
                    tooltipHtml += ' ' + param.seriesName + ': ' + (param.data+numCurent.value); // 使用 totalNum
                }
                tooltipHtml += '</p>';
            });
            tooltipHtml += '</div>';
            return tooltipHtml;
          },
        },
          xAxis: {
              type: 'category',
              data: [dataList[i].cityName],
              axisTick: {
                  show: false,
              },
              axisLabel: {
                  show: true,
                  color: "white",
                  formatter: function(value: string) {
                    let result = '';
                    for (let i = 0; i < value.length; i += 3) {
                        let lineText = value.substr(i, 3);
                        result += `{line${i / 3 + 1}|${lineText}}\n`;
                    }
                    return result.trim();
                },
                rich: {
                    line1: { align: 'left', width: '100%' },
                    line2: { align: 'left', width: '100%' },
                    line3: { align: 'left', width: '100%' },
                    line4: { align: 'left', width: '100%' },
                    line5: { align: 'left', width: '100%' }
                }
              },
              axisLine: {
                  show: false,
              },
          },
          yAxis: {
              type: 'value',
              show: false  // 隐藏y轴
          },
          series: [{
              name: '在线数',
              data: [dataList[i].onlineNum],
              //如果是0，就不显示这个值
              

              type: 'bar',
              itemStyle: {
                  color: '#54d176',
                  borderRadius: [2, 2, 0, 0],
              },
              stack: "total", //设置堆叠
              emphasis: {
                  focus: "series",
              },
              label: {
                  show: true,
                  color: "white",
                  position: 'top',
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
              name: '总数',
              data: [dataList[i].totalNum - dataList[i].onlineNum],
              type: 'bar',
              itemStyle: {
                  color: '#eddb39',
                  borderRadius: [2, 2, 0, 0],
              },
              stack: "total",
              emphasis: {
                  focus: "series",
              },
              label: {
                  show: true,
                  color: "white",
                  position: 'top',
                  formatter: function () {
                      return dataList[i].totalNum;  // 显示总数
                  },
              },
          },{
            name: '隐藏的总数',
            data: [dataList[i].totalNum], // 存储您想要在 tooltip 中显示的值
            type: 'bar',
            stack: "total",
            itemStyle: {
                opacity: 0 // 设置为 0 以隐藏这个系列
            },
            tooltip: {
                show: false // 确保 tooltip 不会显示这个系列的值
            }
        }]
      };
      optionsList.value.push(option);
      chart.setOption(option);
      }
      isUpdata.value=true;
}
export {setMarker,updateChart,width,height,marginTop,chartContainerList,chartList}