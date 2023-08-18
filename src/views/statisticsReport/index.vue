<template>
    <div class="app_container">
        <div class="top">
            <div class="chart1">
                <div class="chart_title" >实时统计</div>
                <Chartone :farmMachineData="farmMachineData"></Chartone>
            </div>
            <div class="chart2">
                <div class="chart_title">网络状况</div>

                <Charttwo></Charttwo>


            </div>
            <div class="chart3">
                <div class="chart_title">省份在线车辆排名</div>

                <Chartthree :farmMachineData="farmMachineData"> </Chartthree>
            </div>
        </div>
        <div class='center'>
            <div class="chart4">
     
                <Chartfour></Chartfour>
            </div>
            <div class="chart5">
              
                <Chartfive></Chartfive>
            </div>
        </div>

        <div class="bottom">
            <div class="chart6">
             
                <Chartsix></Chartsix>
            </div>
            <div class="chart7">
               
                <Chartseven></Chartseven>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import Chartone from './components/chartone.vue'
import Charttwo from './components/charttwo.vue'
import Chartthree from './components/chartthree.vue'
import Chartfour from './components/chartfour.vue'
import Chartfive from './components/chartfive.vue'
import Chartsix from './components/chartsix.vue'
import Chartseven from './components/chartseven.vue'
import {onUnmounted, ref, watch,onMounted} from 'vue'
import {getStatisticsReportfarmMachineAPI} from '@/api/statisticsReport/index'
import type {FarmMachineObj} from '@/api/statisticsReport/type'
const farmMachineData=ref<FarmMachineObj>()


const curTime = ref<number>(Date.now())
const setCurTime = () => {
  curTime.value = Date.now()
}
const timer=setInterval(()=>{
    setCurTime()
},1000)


onMounted(()=>{
    
    getStatisticsReportfarmMachine()
})

watch(curTime,()=>{
    getStatisticsReportfarmMachine()

})




// 农机数据统计
const getStatisticsReportfarmMachine=async()=>{
   try{
    const res=await getStatisticsReportfarmMachineAPI()
    farmMachineData.value=res.data
    // console.log(res.data)
   }catch(err){
    console.log(err)
   }    
}

// // 功能统计，参数同步统计
// const getStatisticsWx=async()=>{
//     const res=await getStatisticsWxAPI()
//     console.log(res)
 
// }

onUnmounted(()=>{
    clearInterval(timer)
})

</script>

<style lang="scss" scoped>
.chart_title {
    font-size: 24px;
    margin: 16px 0px 0px 26px;
}

.chart1,
.chart2,
.chart3,
.chart4,
.chart5,
.chart6,
.chart7 {
    box-shadow: 2px 2px 20px 2px rgba(0, 0, 0, .25);
    border-radius: 15px;
}

.top {

    height: 203px;
    display: flex;
    justify-content: space-around;
    margin-top: 10px;

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
    margin-top: 20px;

    .chart4 {
        width: 48%;
    }

    .chart5 {
        width: 48%;
    }

}

.bottom {
    height: 305px;
    display: flex;
    justify-content: space-around;
    margin-top: 20px;

    .chart6 {
        width: 48%;
    }

    .chart7 {
        width: 48%;

    }
}
</style>