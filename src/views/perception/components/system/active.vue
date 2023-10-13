<template>
  <div class="box">
    <div class="title">
      <img src="~@/assets/systemPerceptionImage/activeIcon.png" alt="">
      <span>车辆活跃度</span> 
    </div>

    <div class="charts" ref="bar"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onUnmounted,watch} from "vue";
import {getActiveData} from '@/api/perception/index.ts';
import {getCurrentTimeAndMidnight} from '@/utils/getTimeInfo.ts';
import type {CarData,ChartData} from '@/api/perception/type.ts';
let props= defineProps({
 dataNow:{
   type:Object as ()=>ChartData,
   default:()=>{}
 }
  
});
let bar = ref();
let mycharts: any;
let data:CarData['data']
let timeArr:string[]=[]
let countArr:any[]=[]
watch(()=>props.dataNow,(val:ChartData)=>{
  if(val){
    data.chart.push(val)
    updataOption()
    mycharts.setOption(option);
  }
},{deep:true})
getActiveData(getCurrentTimeAndMidnight()).then((res)=>{
  data=res.data
  updataOption()
  initEcharts();
})
function updataOption(){
  timeArr=data.chart.map(item=>item.formatDate)
  countArr=data.chart.map(item=>{return{value:item.count}})
  countArr[countArr.length-1]={value:countArr.at(-1).value,symbolSize:15,
            itemStyle:{
              color:'#54d176',
              borderColor:'rgba(67, 208, 125,.5)',
              borderWidth:15,//拐点边框大小，
            }}
            option.xAxis[0].data=timeArr
            option.series[0].data=countArr
}
const option = {
  color: ['#54d176'],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: timeArr,
      boundaryGap: false,
      axisTick:{
        show:false // 不显示坐标轴刻度线
      },
  
      axisLine:{
        lineStyle:{
          color:'#ffffff'
        },
      },
      //x底部文字
      axisLabel: {
        textStyle: {
          padding: [10, 0, 0, 0],//表示 [上, 右, 下, 左] 的边距。
          color: 'rgba(230, 247, 255, 0.50)',
          fontSize:16
        }
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      //y右侧文字
      axisLabel: {
        textStyle: {
           color: 'rgba(230, 247, 255, 0.50)',
          fontSize:16
        }
      },
      // y轴的分割线
      splitLine: {
        show: true,
        lineStyle: {
          color:'rgba(230, 247, 255, 0.20)',
         
        }
      }
    }
  ],
  series: [
    {
      name: '在线车辆',
      type: 'line',
      smooth: true,
      symbol:'circle',//拐点设置为实心
      symbolSize:10,//拐点大小
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'line' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      lineStyle: {
        normal: {
          width: 3,
          shadowColor: "#1890FF",
          shadowBlur: 20
        }
      },
      areaStyle: {
        opacity: 1,
        //右下左上
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(2, 122, 62, .8)'
          },
          {
            offset: 0.3,
            color: 'rgba(2, 122, 62, 0.5)'
          },
          {
            offset: 1,
            color: 'rgba(2, 122, 62, 0)'
          }
        ])
      },
      data: countArr
    }
  ]
}

const initEcharts = () => {
  mycharts = echarts.init(bar.value);
  mycharts.setOption(option);
};


onUnmounted(() => {
  mycharts.dispose;
});
</script>
<style lang="scss" scoped>
.box {
  background: url(@/assets/systemPerceptionImage/border_green.png) no-repeat;
  background-size: 100% 100%;
  margin: 0px 10px 10px 15px;
  padding:10px 0 0 10px ;
  .title {
    height: 40px;
    line-height: 27px;
    display: flex;
    align-items: center;
    >img{
      margin-top: -10px;
    }
  
    border-left-style: none;
    border-right-style: none;

    span {
      font-size:16px ;

    }

    span:first-child {
      font-size: 30px;
      font-weight: 900;
    }
  }

  .charts {
    width: 100%;
    height: calc(100% - 40px);
  }
}
</style>
