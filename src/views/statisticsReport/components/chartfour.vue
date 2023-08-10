
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

        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        }, grid: {
            right: 30,
            bottom: 30,
            top: 60,
            left: 50

        }, title: {
            text: '访问次数统计',
            left: 26,
            top: 16,
            textStyle: {
                color: 'rgb(0, 0, 0)',
                fontSize: 24,
                fontWeight: 'normal'
            }
        },
        series: [
            {
                data: [150, 230, 224, 218, 135, 147, 260],
                type: 'line'
            }
        ]
    };
    myChart.setOption(option);

}
</script>


<style scoped lang="scss">
.container {
    width: 100%;
    height: 100%;
}
</style>

