<template>
    <div class="box">
        <div class="title">
            <span>|</span>&nbsp
            <span>▸</span>
            当年统计数
            <span>◂</span>
        </div>

        <div class="charts">
            <div class="chart_today" ref="bar1">--</div>
            <div class="chart_year" ref="bar2">22</div>
        </div>

    </div>
</template>
    
<script setup lang='ts'>
import * as echarts from 'echarts'
import { ref,  watch } from 'vue'

const props = defineProps({
    totalArea: {
        type: Number,
        default: 0,
    },
    todayArea: {
        type: Number,
        default: 0,
    },
});

let todayArea = ref<number>()
let totalArea = ref<number>()
watch(props, (newValue) => {
    
    todayArea.value = newValue.todayArea
    totalArea.value = newValue.totalArea
    option1.series[0].data=[todayArea.value,100-todayArea.value ]
    option2.series[0].data=[totalArea.value,100-totalArea.value ]
    initEcharts()  
});

let bar1 = ref();
let bar2 = ref();
// onMounted(() => {
    
//    initEcharts()
// })


const initEcharts=()=>{
    let mycharts1 = echarts.init(bar1.value)
    mycharts1.setOption(option1)
    let mycharts2 = echarts.init(bar2.value)
    mycharts2.setOption(option2)
}

let option1 = {
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '5%',
        left: 'center'
    },
    series: [
        {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 40,
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [
                0,0,

            ]
        }
    ]
};

let option2 = {
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '5%',
        left: 'center'
    },
    series: [
        {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 40,
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [
                0,0,

            ]
        }
    ]
};
// console.log('option',option.series[0].data)
</script>
<style lang="scss" scoped>
.box {
    background: url(../image/border_green.png) no-repeat;
    background-size: 100% 100%;
    margin: 0px 10px 10px 15px;

    .title {
        height: 40px;
        line-height: 27px;

        background: linear-gradient(to right, rgba(31, 61, 43, 1), rgba(48, 117, 76, 0));
        border: 0.8px solid;
        border-image: linear-gradient(to right, rgb(63, 255, 140, 0.8), rgba(48, 117, 76, 0)) 1;
        border-left-style: none;
        border-right-style: none;

        span {
            font-size: 20px;
        }

        span:first-child {
            font-size: 30px;
            font-weight: 900;
        }
    }

    .charts {
        height: calc(100% - 40px);
        display: flex;

        >div {
            width: 50%;
            background-color: rgb(233, 208, 212, 0.2);

        }

        // .chart_today{

        // }
        // .chart_year{
        //     width: 50%;
        //     background-color: red;
        // }
    }
}
</style>