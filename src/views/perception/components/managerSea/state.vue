<template>
  <div class="box">
    <div class="title">
      <span>|</span>&nbsp
      <span class="arrows-shadow">▸</span>
      {{$t('perception.statusNotification')}}
      <span class="arrows-shadow">◂</span>
    </div>

    <div class="state" :style="{
      '--lineHeight':`calc((${(dataArr.length-1)*70} / 937 * 100vh)`
    }">
      <img class="state-line" src="@/assets/perceptionImage/stateLine.png" alt="">
    <TransitionGroup name="list" tag="ul">
        <li v-for="item in dataArr" :key="item.onlineTime+item.onlineTcp">
          <div class="state_time">
            <span>{{ item.time }}</span>
            <span>{{ item.sn||item.deviceSn }}</span>
          </div>
          <div class="state_main">
            <span v-if="!item.onlineTcp" class="circle-out">●</span>
            <span v-else class="circle-login">●</span>
            <div :class="['state_bar',item.onlineTcp?'state_bar_login':'state_bar_out']">
              <span>{{ item.userNameCar||'未知'}}</span>
              <el-tooltip
        class="box-item"
        effect="dark"
        :content="item.name||item.position"
        placement="top-end"
      >
      <span>{{ nameOut(item.name||item.position||'未知')  }}</span>

      </el-tooltip>
              <div class="state-tips">
                  <img v-if="!item.onlineTcp" src="@/assets/perceptionImage/stateOut.png" alt="">
                  <img v-else src="@/assets/perceptionImage/stateIn.png" alt="">
              </div>
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
    return `${value.substring(0,10)}...`
  }else{
    return value
  }
}
function getTime(item:recordsType){
  if (item.onlineTcp) {
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
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(calc(30 / 1920 * 100vw));
}

.list-leave-active {
  position: absolute;
}

.box {
  background: url(@/assets/perceptionImage/border_green.png) no-repeat;
  background-size: 100% 100%;
  margin: 0px calc(10 / 1920 * 100vw) calc(10 / 937 * 100vh) calc(15 / 1920 * 100vw);

  .title {
    height: calc(40 / 937 * 100vh);
    line-height: calc(27 / 937 * 100vh);

    background: linear-gradient(
      to right,
      rgba(31, 61, 43, 1),
      rgba(48, 117, 76, 0)
    );
    border: calc(0.8 / 1920 * 100vw) solid;
    border-image: linear-gradient(
        to right,
        rgb(63, 255, 140, 0.8),
        rgba(48, 117, 76, 0)
      )
      1;
    border-left-style: none;
    border-right-style: none;

    span {
      font-size: 1.25rem; /* 20px 转换为 rem */
    }

    span:first-child {
      font-size: 1.875rem; /* 30px 转换为 rem */
      font-weight: 900;
    }
  }

  .state {
    position: relative;
    .state-line {
      position: absolute;
      height: var(--lineHeight);
      width: 1px;
      transition: all 1s;
      left: calc(14 / 1920 * 100vw);
      top: calc(48 / 937 * 100vh);
      z-index: -9;
      opacity: 0.6;
    }
    height: calc(100% - calc(40 / 937 * 100vh));
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: scrollbar;
    ul > li {
      margin-top: calc(10 / 937 * 100vh);
      padding-top: calc(10 / 937 * 100vh);
      height: calc(60 / 937 * 100vh);
      font-size: 0.75rem; /* 12px 转换为 rem */
    }

    .state_time {
      display: flex;
      justify-content: space-between;
      padding-left: calc(40 / 1920 * 100vw);
      padding-right: calc(35 / 1920 * 100vw);
    }

    .state_main {
      padding-left: calc(5 / 1920 * 100vw);
      height: calc(100% - calc(20 / 937 * 100vh));
      display: flex;

      .circle-out {
        font-size:1rem; /* 16px 转换为 rem */
        padding-left: calc(5 / 1920 * 100vw);
        flex: 1;
        color: rgb(243, 19, 19);
      }
      .circle-login {
        @extend .circle-out;
        color: rgb(103, 194, 58);
      }

      .state_bar {
        display: flex;
        align-items: center;
        .state-tips {
          position: absolute;
          right: calc(26 / 1920 * 100vw);
          display: flex;
          align-items: center;
          img {
            width: 45px; // 图标背景大小保持不变
            height: 30px; // 图标背景大小保持不变
          }
        }
        position: relative;
        background-size: 100% 100%; // 背景大小保持不变
        flex: 20;
        line-height: calc(30 / 937 * 100vh);
        padding: 0 calc(15 / 1920 * 100vw);
        span:first-child {
          position: absolute;
          left: calc(20 / 1920 * 100vw);
        }

        span:nth-child(2) {
          position: absolute;
          right: calc(80 / 1920 * 100vw);
        }
      }
      .state_bar_login {
        background: url(@/assets/perceptionImage/rectangle_green.png) no-repeat; 
        background-size: 100% 100%;
      }
      .state_bar_out {
        background: url(@/assets/perceptionImage/rectangle_red.png) no-repeat; 
        background-size: 100% 100%;
      }
    }
  }
}

</style>
