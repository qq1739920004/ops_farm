<template>
  <div class="app_container">
    <div class="top">
      <div class="chart1">
        <div class="chart_title">实时统计</div>
        <Chartone :farmMachineData="farmMachineData"></Chartone>
      </div>
      <div class="chart2">
        <div class="chart_title">网络状况</div>

        <chart-net :data="networkData"></chart-net>
      </div>
      <div class="chart3">
        <div class="chart_title">省份在线车辆排名</div>
        <Chartthree :farmMachineData="farmMachineData"> </Chartthree>
      </div>
    </div>
    <div class="center">
      <div class="chart4">
        <chartBase
          @time-select="getStatisticsWx"
          :options="optionfnStatistics"
        ></chartBase>
      </div>
      <div class="chart5">
        <chartBase
          @time-select="getStatisticsRemote"
          :options="optionTransportStatistics"
        ></chartBase>
      </div>
    </div>

    <div class="bottom">
      <div class="chart6">
        <chartBase
          @time-select="getStatisticsStat"
          :options="optionVisitStatistics"
        ></chartBase>
      </div>
      <div class="chart7">
        <chartBase
          :options="optionCarjobStatistics"
          :istimeBox="false"
        ></chartBase>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Chartone from './components/chartone.vue'
import chartNet from './components/chartNet.vue'
import Chartthree from './components/chartthree.vue'
import chartBase from './components/chartBase.vue'
import { fnOption } from './components/fnStatistics'
import { transportOption } from './components/transportStatistics'
import { visitOption } from './components/visitStatistics'
import {carjobOption} from './components/carjobStatistics';

import { ref, shallowRef,onMounted,onUnmounted} from 'vue'
import {getStatisticsReportfarmMachineAPI,getStatisticsReportcarjobAPI,getStatisticsReportnetworkAPI,getStatisticsWxAPI,getStatisticsRemoteAPI,getStatisticsStatAPI} from '@/api/statisticsReport/index'
import type {FarmMachineObj,getStatisticsReportnetworkAPIResponse} from '@/api/statisticsReport/type'
import type {EChartsOption} from 'echarts'
import realTimeStore from '@/store/realTimeData';
type timeType={
    st:string,
    et:string
}
let date = new Date()
  let day = date.getDate() // 今天
  let month = date.getMonth() + 1 // 当月
  let year = date.getFullYear() // 年份
let time:timeType={
  st:`${year}-${month}-01 00:00:00`,
  et:`${year}-${month}-${day} 23:59:59`
}
const realTime=realTimeStore()
const farmMachineData=ref<FarmMachineObj>()
const networkData=ref<getStatisticsReportnetworkAPIResponse['data']['onlineFarmMachines']>()
let optionfnStatistics=shallowRef<EChartsOption>({})
let optionTransportStatistics=shallowRef<EChartsOption>({})
let optionVisitStatistics=shallowRef<EChartsOption>({})
  let optionCarjobStatistics=shallowRef<EChartsOption>({})

onMounted(()=>{
  realTime.startRealTimeData()
    getStatisticsReportfarmMachine()
    getStatisticsWx(time)
    getStatisticsRemote(time)
    getStatisticsStat(time)
    getStatisticsReportnetwork()
    getStatisticsReportcarjob()
})
onUnmounted(()=>{
  realTime.closeRealTimeData()
})
// 农机数据统计
const getStatisticsReportfarmMachine=async()=>{
   try{
    const res=await getStatisticsReportfarmMachineAPI()
    farmMachineData.value=res.data
   }catch(err){
    console.log(err)
   }
}

// 功能统计，参数同步统计
const getStatisticsWx=async(time:timeType)=>{
    try{
      let res= await getStatisticsWxAPI({
        st:time.st,
        et:time.et
      })
      fnOption(res.data,optionfnStatistics)
   }catch(err){
    optionfnStatistics.value={}
    console.log(err)
   }
}
// 远程校准次数、设置数据链次数、注册次数，小程序合并接口
const getStatisticsRemote=async(time:timeType)=>{
    try{
      let res= await getStatisticsRemoteAPI({
        st:time.st,
        et:time.et
      })

      transportOption(res.data,optionTransportStatistics)
   }catch(err){
    optionTransportStatistics.value={}
    console.log(err)
   }
}
//访问次数统计
const getStatisticsStat=async(time:timeType)=>{
    try{
      let res= await getStatisticsStatAPI({
        st:time.st,
        et:time.et
      })
      visitOption(res.data,optionVisitStatistics)
   }catch(err){
    optionVisitStatistics.value={}
    console.log(err)
   }
}
//网络状况
const getStatisticsReportnetwork=async()=>{
    try{
      let res= await getStatisticsReportnetworkAPI()
      networkData.value=res.data.onlineFarmMachines
   }catch(err){
    console.log(err)
   }
}
//作业面积统计
const getStatisticsReportcarjob=async()=>{
    try{
      let res= await getStatisticsReportcarjobAPI()
      carjobOption(res.data,optionCarjobStatistics)
   }catch(err){
    optionCarjobStatistics.value={}
    console.log(err)
   }
}
</script>

<style lang="scss" scoped>
.chart_title {
  font-size: 24px;
  margin: 16px 0px 0px 26px;
}
.app_container{
  width: 100%;
  padding:8px 0px;
  box-sizing: border-box;
  margin: 0;
  border: 0;
  background-color: var(--el-bg-color-page);
}
.chart1,
.chart2,
.chart3,
.chart4,
.chart5,
.chart6,
.chart7 {
  box-shadow: 2px 2px 10px 2px rgba(0, 0, 0, 0.25);
  border-radius: 15px;
}

.top {
  height: 203px;
  display: flex;
  justify-content: space-around;

  .chart1 {
    width: 36%;
  }

  .chart2 {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 32%;
  }

  .chart3 {
    width: 28%;
  }
}

.center {
  height: 305px;
  display: flex;
  justify-content: space-around;
  margin-top: 13px;

  .chart4 {
    width: 48%;
  }

  .chart5 {
    width: 48%;
  }
}

.bottom {
  height: 310px;
  display: flex;
  justify-content: space-around;
  margin-top: 13px;

  .chart6 {
    width: 48%;
  }

  .chart7 {
    width: 48%;
  }
}
</style>
