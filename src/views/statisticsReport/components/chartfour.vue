
<template>
    <div class="container" ref="main"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted,PropType} from "vue";
import * as echarts from "echarts";
import type {getStatisticsWxAPIResponse} from '@/api/statisticsReport/type'

const props=defineProps({
    data:{
        type:Object as PropType<getStatisticsWxAPIResponse['data']>,
        required:true
    }
})
console.log(111);
console.log(props.data);
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
            data: props.data.chart.date
        },
        yAxis: {
            type: 'value'
        }, grid: {
            right: 40,
            bottom: 30,
            top: 60,
            left: 50
        }, title: {
            text: '功能统计',
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
                data: props.data.chart.data,
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

