import type { MonitorObj } from "@/api/perception/type";
import { ref ,shallowRef} from 'vue';
import * as echarts from 'echarts';
let width=ref(40);
let height=ref(160);
let marginTop=ref(80);
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

function setMarker(AMap:any,map:any,dataList:MonitorObj["provinceCars"]){
  for(let i=1;i<=dataList.length;i++){
    if(!dataList[i].code) return
        const markerContent = document.createElement('div');
        const markerContent2 = document.createElement('div');
        markerContent2.style.width = `${width.value}px`;
        markerContent2.style.height = `${height.value}px`;
        markerContent2.style.marginTop = `-${marginTop.value}px`;
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

        },
            xAxis: {
                type: 'category',
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
                  formatter: function() {
                    return dataList[i].totalNum;  // 显示总数
                },
                },
            }]
        };
        optionsList.value.push(option);
        chart.setOption(option);
      }
      isUpdata.value=true;
}
export {setMarker,updateChart,width,height,marginTop,chartContainerList,chartList}