<template>
    <div class="box">
        <div class="title">
            <span>|</span>&nbsp
            <span>▸</span>
            各车辆作业面积 亩
            <span>◂</span>
        </div>
        <div class="charts" ref="bar">
          
        </div>
    </div>
</template>
    
<script setup lang='ts'>
import * as echarts from 'echarts'
import { ref, onMounted,toRaw} from 'vue'

const dataList=defineProps(['carArea'])
const carname=toRaw(dataList.carArea)
const listy=Object.values(carname)
const listx=Object.keys(carname)
// 模拟数据
listx.push('car2','car1','car2','car1','car2','car1','car2','car1','car2')
listy.push(12,13,4,5,6,7,8,9,10)

// 获取图表节点
let bar = ref();
onMounted(()=>{
  let mycharts= echarts.init(bar.value) 
  mycharts.setOption(option)
})
const option = {
  xAxis: {
    type: 'value'
  
  },
  yAxis: {
      type: 'category',
    data: listx
  },
  grid:{
    left:35,
    top:10,
    right:10,
    bottom:25
  },
  series: [
    {
      data: listy,
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(51, 187, 196, 0.32)'
      }
    }
  ]
};
</script>

<style lang="scss" scoped>
.box {
    background: url(../image/border_green.png) no-repeat;
    background-size: 100% 100%;
    margin: 10px 10px 10px 15px;

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
        background-color: rgb(233, 208, 212, 0.2);
    }
}


</style>