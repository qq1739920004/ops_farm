<template>
  <div class="box">
    <div class="title">
      <span>|</span>&nbsp
      <span class="arrows-shadow">▸</span>
      状态通知栏
      <span class="arrows-shadow">◂</span>
    </div>

    <div class="state" :style="{
      '--lineHeight':(dataArr.length-1)*70+'px'
    }">
      <img class="state-line" src="@/assets/perceptionImage/stateLine.png" alt="">
    <TransitionGroup name="list" tag="ul">
        <li v-for="item in dataArr" :key="item.sn||item.deviceSn">
          <div class="state_time">{{ item.time }}</div>
          <div class="state_main">
            <span v-if="item.offlineTime!=item.onlineTime" class="circle-out">●</span>
            <span v-else class="circle-login">●</span>
            <div :class="['state_bar',item.offlineTime==item.onlineTime?'state_bar_login':'state_bar_out']">
              <span>{{ item.sn||item.deviceSn }}</span>
              <el-tooltip
        class="box-item"
        effect="dark"
        :content="item.name||item.position"
        placement="top-end"
      >
      <span>{{ nameOut(item.name||item.position)  }}</span>

      </el-tooltip>
              <span class="state-tips">
                  <img v-if="item.offlineTime!=item.onlineTime" src="@/assets/perceptionImage/stateOut.png" alt="">
                  <img v-else src="@/assets/perceptionImage/stateIn.png" alt="">
                </span>
            </div>
          </div>
        </li>
    </TransitionGroup>

    </div>
  </div>
</template>

<script setup lang="ts">
import {ref,onMounted,watch,PropType} from 'vue';
import {getState} from '@/api/perception/index.ts';
import type {recordsType} from '@/api/perception/type.ts';

const props=defineProps({
  stateObj:{
    type:Object as PropType<recordsType>,
  }
})
let dataArr=ref<recordsType[]>([]) 
  function nameOut(value:string){
  if(value.length>10){
    console.log(value.substring(0,10));
    return `${value.substring(0,10)}...`
  }else{
    return value
  }
}
function getTime(item:recordsType){
  if (item.offlineTime==item.onlineTime) {
    return item.onlineTime
  }else{
    return item.offlineTime
  }
}
onMounted(() => {
  getState({
    currentPage:1,
    pageSize:5
  }).then((res)=>{
    res.data.records.map((item)=>{
      if(item){
      dataArr.value.push({
        time:getTime(item),
        ...item
      })
    }

    })
  })
watch(()=>props.stateObj,(newValue)=>{
  if(newValue && !newValue.judgeLevel){
  dataArr.value.unshift({
    time:getTime(newValue),
    ...newValue
  })
}

})
// let ii=ref(3)
//   setInterval(() => {
//   dataArr.value.unshift({
//     carId:ii.value,
//     time:'2021/02/02 12:32',
//     name:'上海',
//     name:'A300',
//     online:1,
//   })
//   ii.value++
// }, 2000);
})

</script>
<style lang="scss" scoped>
.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-leave-active {
  position: absolute;
}
.box {
  background: url(@/assets/perceptionImage/border_green.png) no-repeat;
  background-size: 100% 100%;
  margin: 0px 10px 10px 15px;

  .title {
    height: 40px;
    line-height: 27px;

    background: linear-gradient(
      to right,
      rgba(31, 61, 43, 1),
      rgba(48, 117, 76, 0)
    );
    border: 0.8px solcarId;
    border-image: linear-gradient(
        to right,
        rgb(63, 255, 140, 0.8),
        rgba(48, 117, 76, 0)
      )
      1;
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

  .state {
    position: relative;
    .state-line{
      position: absolute;
      height: var(--lineHeight);
      width: 1px;
      transition: all 1s;
      left: 14px;
      top: 48px;
      z-index: -9;
      opacity: 0.6;
    }
    height: calc(100% - 40px);
    overflow: auto;
    //影藏滚动条
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: scrollbar;
    ul > li {
      margin-top: 10px;
      padding-top: 10px;

      height: 60px;
      font-size: 12px;
    }

    .state_time {
      padding-left: 40px;
    }

    .state_main {
      padding-left: 5px;
      // height: 40px;
      height: calc(100% - 20px);
      display: flex;

      .circle-out {
        font-size:16px ;
        padding-left: 5px;
        flex: 1;
        color: rgb(243, 19, 19);
      }
      .circle-login{
        @extend .circle-out;
        color: rgb(103, 194, 58);
      }

      .state_bar {
        .state-tips{
          position: absolute;
          right: 26px;
          top: -1px;
          img{
            width: 45px;
            height: 30px;
          }
          
          
        }
        position: relative;
        background-size: 100% 100%;
        flex: 20;
        line-height: 30px;
        padding: 0 15px;
        span:first-child {
          position: absolute;
          left: 20px;
        }

        span:nth-child(2) {
          position: absolute;
          right: 80px;
        }

     
      }
      .state_bar_login{
        background: url(@/assets/perceptionImage/rectangle_green.png) no-repeat;

      }
      .state_bar_out{
        background: url(@/assets/perceptionImage/rectangle_red.png) no-repeat;

      }
    }
  }
}
</style>
