
<template>
    <div class="container" ref="main"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";

import * as echarts from "echarts";
const main = ref()
onMounted(
    () => {
        init()
    }
)
function init() {

    var myChart = echarts.init(main.value);

    var option = {
        grid: {
            right: 30,
            bottom: 60,
            top: 60,
            left: 60
        },
        title: {
            text: '车辆分布与作业信息',
            left: 10,
            top: 10,
            textStyle: {
                fontSize: 16,
                fontWeight: 'normal'
            }
        },
        legend: {
            type: 'plain',
            zlevel: 9,
            top: 10,
            right: 10,
            data: [
                {
                    name: '车辆总数',
                    icon: 'roundRect'
                },
                {
                    name: '今日上线',
                    icon: 'roundRect'
                },
                {
                    name: '累计作业',
                    icon: 'roundRect'
                }
            ]
        },
        tooltip: {
            show: true,
            trigger: 'axis',
            textStyle: {
                align: 'left'
            }
        },
        dataZoom: [
            {
                type: 'inside',
                realtime: true,
                zoomOnMouseWheel: true
            }
        ],
        xAxis: {
            type: 'category',
            data: [],
            axisLine: {
                lineStyle: {
                    color: '#B9C8DB'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#000',
                interval: 0,
                rotate: 30,
                fontSize: 12
            }
        },
        yAxis: {
            type: 'value',
            name: '',
            axisLine: {
                lineStyle: {
                    color: '#B9C8DB'
                }
            },
            splitNumber: 3,
            axisTick: {
                show: false
            },
            splitLine: {
                show: false,
                lineStyle: {
                    color: '#384155'
                }
            },
            axisLabel: {
                color: '#000'
            },
            nameTextStyle: {
                color: '#fff'
            }
        },
        series: [
            {
                data: [],
                smooth: false,
                type: 'bar',
                name: '车辆总数',
                itemStyle: {
                    color: '#FFBA37'
                }
            },
            {
                data: [],
                smooth: false,
                type: 'bar',
                name: '今日上线',
                itemStyle: {
                    color: '#44AAFF'
                }
            },
            {
                data: [],
                smooth: false,
                type: 'bar',
                name: '累计作业',
                itemStyle: {
                    color: '#00E581'
                }
            }
        ]
    };
    myChart.setOption(option);

}
</script>


<style scoped lang="scss">
.container {
    width: 785px;
    height: 248px;
    // background-color: pink;
}
</style>

