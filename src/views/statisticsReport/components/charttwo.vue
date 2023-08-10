
<template>

    <div class="container" ref="main">
        
    </div>
    <div class="pic">
        <img src="@/assets/statisticsReport/xinhao1.png" alt="">
        <img src="@/assets/statisticsReport/xinhao2.png" alt="">
        <img src="@/assets/statisticsReport/xinhao3.png" alt="">
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

    var myChart = echarts.init(main.value,);

    var option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '60%',
            right: '10%',
            icon: 'circle',
            itemHeight: 20,
            itemGap: 50, // 修改间距
            textStyle: {
                fontSize: 20,
                color: "black",
                padding: [0, 0, 0, 20], // 修改文字和图标距离
            },

        },

        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: true,
                center: ['20%', '45%'],
                itemStyle: {
                    borderColor: '#fff',
                    // borderWidth: 2
                },
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
    width: 100%;
    height: 100%;
}
.pic{
box-sizing: border-box;
 position: absolute;  
 top:91px;
 left: 200px; 
 img{
    margin-right: 70px;
 }
}
</style>

