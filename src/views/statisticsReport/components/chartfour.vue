
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
            // 处理片周围的空白
            top: '4%',
            left: '3%',
            right: '4%',
            bottom: '8%',
            containLabel: true
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
    height: 248px;
}
</style>

