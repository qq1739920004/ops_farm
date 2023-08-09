
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
            bottom: 30,
            top: 60,
            left: 50
        },
        title: {
            text: '访问次数统计',
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
                    name: '态势监控',
                    icon: 'roundRect'
                },
                {
                    name: '农机列表',
                    icon: 'roundRect'
                }
            ]
        },
        tooltip: {
            show: true,
            trigger: 'axis'
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
                color: '#000'
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
                type: 'line',
                name: '态势监控',
                itemStyle: {
                    color: '#FFBA37'
                }
            },
            {
                data: [],
                smooth: false,
                type: 'line',
                name: '农机列表',
                itemStyle: {
                    color: '#44AAFF'
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

