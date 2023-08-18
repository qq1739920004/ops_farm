<template>
    <div class="box">
        <div class="title">
            <span>|</span>&nbsp
            <span>▸</span>
            当年统计数
            <span>◂</span>
        </div>

        <div class="charts" id="myChart">
            <div class="chart_today" ref="bar1"></div>
            <div class="chart_year" ref="bar2"></div>
        </div>

    </div>
</template>
    
<script setup lang='ts'>
import * as echarts from 'echarts'
import { ref, watch, onUnmounted, onMounted } from 'vue'
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

let bar1 = ref();
let bar2 = ref();
var mycharts1: any;
var mycharts2: any;
// 渐变色
const gradientColor = {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [{
        offset: 0,
        color: 'rgba(38, 255, 251, 1)'
    }, {
        offset: 1,
        color: 'rgba(0, 255, 166, 1)'
    }]
};
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
            radius: ['40%', '60%'],
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
            itemStyle: {
                color: function (colors: any) {
                    var colorList = [
                        'rgba(0, 255, 166, 0.1)',
                        gradientColor
                    ];
                    return colorList[colors.dataIndex];
                }


            },
            data: [
                0, 0,

            ],

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
            radius: ['40%', '60%'],
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
            itemStyle: {
                color: function (colors: any) {
                    var colorList = [
                        'rgba(0, 255, 166, 0.1)',
                        gradientColor

                    ];
                    return colorList[colors.dataIndex];
                }
            },
            labelLine: {
                show: false
            },
            data: [
                0, 0,
            ]
        }
    ]
};


const initEcharts = () => {
    mycharts1 = echarts.init(bar1.value)
    mycharts2 = echarts.init(bar2.value)

    mycharts1.setOption(option1)
    mycharts2.setOption(option2)
}
onMounted(() => {
    initEcharts()
})



watch(props, (newValue) => {
    todayArea.value = newValue.todayArea
    totalArea.value = newValue.totalArea
    option1.series[0].data = [todayArea.value, 100 - todayArea.value]
    option2.series[0].data = [totalArea.value, 100 - totalArea.value]

    mycharts1.setOption(option1)
    mycharts2.setOption(option2)
});

onUnmounted(() => {
    mycharts1.dispose;
    mycharts2.dispose;
});



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
            // background-color: rgb(233, 208, 212, 0.2);

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