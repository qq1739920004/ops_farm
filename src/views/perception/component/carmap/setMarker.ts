import type { MonitorObj } from "@/api/perception/type";
import {ref} from 'vue';
import * as echarts from 'echarts';
let width=ref(40);
let height=ref(220);
let marginTop=ref(110);
let chartList=ref<any>([]);
let chartContainerList=ref<any>([]);
function setMarker(AMap:any,map:any,dataList:MonitorObj["provinceCars"]){
  for(let i=1;i<4;i++){
        const markerContent = document.createElement('div');
        const chartContainer = document.createElement('div');
        chartContainer.style.width = `${width.value}px`;
        chartContainer.style.height = `${height.value}px`;
        chartContainer.style.marginTop = `-${marginTop.value}px`;
        markerContent.appendChild(chartContainer);
        const marker = new AMap.Marker({
            position: [dataList[i].lng,dataList[i].lat],
            content: markerContent,
            map: map.value
        });
        // 使用ECharts初始化柱状图容器并设置数据
        const chart = echarts.init(chartContainer);
        chartList.value.push(chart);
        chartContainerList.value.push(chartContainer);
        const option = {
            xAxis: {
                type: 'category',
                data: [dataList[i].cityName],
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
                type: 'value',
                show: false  // 隐藏y轴
            },
            series: [{
              name: '在线数',
                data: [dataList[i].onlineNum],
                type: 'bar',
                
                itemStyle: {
                //柱子颜色
                  color:'#54d176',
                  borderRadius: [2, 2, 0, 0],
                },
                stack: "total",//设置堆叠
                emphasis: {//
                  focus: "series",
                },
                label: {
                  show: true,
                  color: "white",
                  position: 'top',
                  formatter: "{c}",
                },
            },
            {
              name: '总数',
                data: [dataList[i].totalNum-dataList[i].onlineNum],
                type: 'bar',
                itemStyle: {
                  color:'#eddb39',
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
                  formatter: function(params: any) {
                    return dataList[i].totalNum;  // 显示总数
                },
                },
            }]
        };
        chart.setOption(option);
      }
}
export {setMarker,width,height,marginTop,chartContainerList,chartList}