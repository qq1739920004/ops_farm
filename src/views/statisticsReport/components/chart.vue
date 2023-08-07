<template>
    <div class="chart_warpper">

        <div class="chart_item_container">
            <div ref="chart_fun" style="width: 100%; height:400px"></div>
            <div>表1</div>
            <div class="legend_container">图标容器1</div>
        </div>

        <div class="chart_item_container">
            <div class="chart_fun">表1</div>
            <div class="legend_container">图标容器1</div>
        </div>

        <div class="chart_item_container">
            <div class="chart_fun">表1</div>
            <div class="legend_container">图标容器1</div>
        </div>

        <div class="chart_item_container">
            <div class="chart_fun">表1</div>
            <div class="legend_container">图标容器1</div>
        </div>
        <div class="chart_item_container">
            <div class="chart_fun">表1</div>
            <div class="legend_container">图标容器1</div>
        </div>
        <div class="chart_item_container">
            <div class="chart_fun">表1</div>
            <div class="legend_container">图标容器1</div>
        </div>
        <div class="chart_item_container">
            <div class="chart_fun">表1</div>
            <div class="legend_container">图标容器1</div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import * as echarts from "echarts";

const chart_fun = ref()

onMounted(
    () => {
        init()
    }
)

function init() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(chart_fun.value);

    // 指定图表的配置项和数据
    var option =
    {

        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },

        yAxis: {
            type: 'value'
        },

        series: [
            {
                data: [150, 230, 224, 218, 135, 147, 260],
                type: 'bar'
            }
        ]
    };


    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}


</script>

<style lang="scss" scoped>
.chart_warpper {
    width: 100%;
    height: 70%;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-gap: 15px;
    box-sizing: border-box;
    padding: 10px;

    .chart_item_contianer {
        position: relative;
        border: 1px solid #e1e1e1;

        #chart_fun,
        #chart_ops,
        #chart_visit,
        #chart_car {
            height: 100%;
        }

        .legend_container {
            position: absolute;
            width: 120px;
            top: 6px;
            left: 70px;
        }
    }
}
</style>