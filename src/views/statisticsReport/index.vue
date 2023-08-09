<template>
    <div class="app_container">
        <div class="top">
            <div class="chart1">
                <div class="chart_title">实时统计</div>
                <Chartone></Chartone>
            </div>
            <div class="chart2">
                <div class="chart_title">网络状况</div>

                <Charttwo></Charttwo>


            </div>
            <div class="chart3">
                <div class="chart_title">省份在线车辆排名</div>

                <Chartthree> </Chartthree>
            </div>
        </div>
        <div class='center'>
            <div class="chart4">
                <!-- <div class="chart_title">功能统计</div> -->
                <Chartfour></Chartfour>
            </div>
            <div class="chart5">
                <!-- <div class="chart_title">运输统计</div> -->
                <Chartfive></Chartfive>
            </div>
        </div>

        <div class="bottom">
            <div class="chart6">
                <!-- <div class="chart_title">访问次数统计</div> -->
                <Chartsix></Chartsix>
            </div>
            <div class="chart7">
                <!-- <div class="chart_title">车辆分布与作业信息</div> -->
                <Chartseven></Chartseven>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>


//引入echarts

import Chartone from './components/chartone.vue'
import Charttwo from './components/charttwo.vue'
import Chartthree from './components/chartthree.vue'
import Chartfour from './components/chartfour.vue'
import Chartfive from './components/chartfive.vue'
import Chartsix from './components/chartsix.vue'
import Chartseven from './components/chartseven.vue'

</script>

<style lang="scss" scoped>
.chart_title {
    font-size: 24px;
    margin: 16px 0px 0px 26px;
}

.chart1,
.chart2,
.chart3,
.chart4,
.chart5,
.chart6,
.chart7 {

    box-shadow: 2px 2px 20px 2px rgba(0, 0, 0, .25);
    border-radius: 15px;
    margin-left: 10px;

}

.top {

    height: 203px;
    display: flex;
    justify-content: space-around;
    margin-top: 10px;

    .chart1 {
        width: 36%;
    }

    .chart2 {
        display: flex;
        flex-direction: column;
       position: relative;
       
        width: 36%;
    }

    .chart3 {
        width: 28%;
    }
}

.center {
    height: 305px;
    display: flex;
    justify-content: space-around;
    margin-top: 20px;

    .chart4 {
        width: 50%;
    }

    .chart5 {
        width: 50%;
    }

}

.bottom {
    height: 305px;
    display: flex;
    justify-content: space-around;
    margin-top: 20px;

    .chart6 {
        width: 50%;
    }

    .chart7 {
        width: 50%;

    }
}
</style>