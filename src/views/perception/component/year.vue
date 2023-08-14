<template>
    <div class="box">
        <div class="title">
            <span>|</span>&nbsp
            <span>▸</span>
            当年统计数
            <span>◂</span>
        </div>

        <div class="charts" >
            <div class="chart_today" ref="bar1">--</div>
            <div class="chart_year" ref="bar2">22</div>
        </div>

    </div>
</template>
    
<script setup lang='ts'>
// import * as echarts from 'echarts'
// import { ref, onMounted} from 'vue'
// let bar1 = ref();
// onMounted(()=>{
//   let mycharts= echarts.init(bar1.value) 
//   mycharts.setOption(option)
// })

// let option = {
//   tooltip: {
//     trigger: 'item'
//   },
//   legend: {
//     top: '5%',
//     left: 'center'
//   },
//   series: [
//     {
//       name: 'Access From',
//       type: 'pie',
//       radius: ['40%', '70%'],
//       avoidLabelOverlap: false,
//       label: {
//         show: false,
//         position: 'center'
//       },
//       emphasis: {
//         label: {
//           show: true,
//           fontSize: 40,
//           fontWeight: 'bold'
//         }
//       },
//       labelLine: {
//         show: false
//       },
//       data: [
//         { value: 1048, name: 'Search Engine' },
//         { value: 735, name: 'Direct' },
        
//       ]
//     }
//   ]
// };
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
        display: flex;
      
       >div{
        width: 50%;
  background-color: rgb(233, 208, 212, 0.2);
            
       }
        // .chart_today{
           
        // }
        // .chart_year{
        //     width: 50%;
        //     background-color: red;
        // }
    }
}
</style>