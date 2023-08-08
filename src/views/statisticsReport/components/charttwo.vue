
<template>
    <div class="container">
        <div class="left" ref="main"></div>
    </div>
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

    var myChart = echarts.init(main.value, null, {
        width: 600,
        height: 140
    });

    var option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center',
            icon: 'circle'
        },

        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: true,
                itemStyle: {
                    borderColor: '#fff',
                    // borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                legend: {
                    orient: 'horizontal',
                    x: 850,
                    y: 400
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
                    { value: 1048, name: '1', itemStyle: { color: 'rgba(67, 207, 124, 1)' } },
                    { value: 735, name: '2', itemStyle: { color: 'rgba(255, 87, 51, 1)' } },
                    { value: 580, name: '3', itemStyle: { color: 'rgba(255, 195, 0, 1)' } },
                ]
            }
        ]
    };
    myChart.setOption(option);

}
</script>


<style scoped lang="scss">
.container {

    display: flex;
    justify-content: space-around;

    .left {

        margin-left: 10px;
        background-color: pink;

    }


}
</style>

