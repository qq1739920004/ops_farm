<template>
    <div class="box">
        <div class="title">
            <span>|</span>&nbsp
            <span>▸</span>
            各类型农机在线数
            <span>◂</span>
        </div>

        <div class="charts" ref="bar">
        </div>

    </div>
</template>
    
<script setup lang='ts'>
import * as echarts from 'echarts'
import { ref, watch } from 'vue'

let bar = ref()
const props = defineProps({
    typeCounts: {
        type: Object
    }
})
const initEcharts = () => {
    let mycharts = echarts.init(bar.value)
    mycharts.setOption(option)
}
let dataList = [{
    typeName: "car",
    onlineCount: 0,
    totalCount: 0
}]

watch(props, (newValue) => {

    dataList = JSON.parse(JSON.stringify(newValue.typeCounts))
    option.yAxis.data = dataList.map(r => r.typeName)
    option.series[0].data = dataList.map(r => r.onlineCount)
    initEcharts()
})


const option = {
    backgroundColor: "",
    tooltip: {
        show: false,
    },
    grid: {
        top: "5%",
        left: "3%",
        right: "2%",
        bottom: "1%",
        containLabel: true,
    },
    xAxis: {
        type: "value",
        axisLabel: {
            color: "#fff",
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: "rgba(21, 200, 221,0.2)",
            },
        },

    },
    yAxis: {
        type: "category",
        axisLabel: {
            color: "#fff",
        },
        axisLine: {
            show: false,
        },
        splitLine: {
            show: false,
        },
        axisTick: {
            show: false,
        },
        data: dataList.map(r => r.typeName),
    },
    series: [
        {
           
            type: "bar",
            symbol: "path://M1 1,L140 1,L140 15,L1 15,Z",
            symbolKeepAspect: false,
            stack: "triangle",
            barWidth: 16,
            itemStyle: {
                borderWidth: 0,
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    {
                        offset: 0,
                        color: "rgba(99, 229, 255, 0.07)",
                    },
                    {
                        offset: 1,
                        color: "rgba(94, 255, 0, 1)",
                    },
                ]),
            },
            label: {
                show: true,
                position: "right",
                color: "#3EFFE8",
                fontSize: 12,
                formatter: "{c}",
            },
            data: dataList.map(r => r.onlineCount),
        },
        {
            name: "顶端1",
            type: "scatter",
            stack: "triangle",
            yAxisIndex: 0,
            data: [0, 0, 0, 0, 0],
            label: false,
            symbolSize: 16,
            symbolOffset: [-8, 0],
            // symbol: "path://M12 0,L16 0,L0 16,L0 12,Z",
            symbol: "path://M0 12,L0 16,L16 0,L12 12,Z",
            itemStyle: {
                borderWidth: 0,
                color: "#8AEBEE",
                opacity: 1,
            },
            z: 2,
        },
        {
            name: "顶端2",
            type: "scatter",
            stack: "triangle",
            yAxisIndex: 0,
            data: [0, 0, 0, 0, 0],
            label: false,
            symbolSize: 17,
            symbolOffset: [-7, 0],
            symbol: "path://M0 16L16 16L16 0Z",
            itemStyle: {
                color: "#0A181E", // 与背景色相同
                opacity: 1,
            },
            z: 2,
        },
    ],
};

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
        
    }


}
</style>