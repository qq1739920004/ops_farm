<template>
  <div class="box">
    <div class="title">
      <img src="~@/assets/systemPerceptionImage/stateIcon.png" alt="">
      <span>状态通知栏</span> 
    </div>

    <div class="state">
    <TransitionGroup name="list" tag="ul">
        <li v-for="item in dataArr" :key="item.sn||item.deviceSn">
          <div class="state_time">{{ item.time }}</div>
          <div class="state_main">
            <span v-if="!item.onlineTcp" class="circle-out">●</span>
            <span v-else class="circle-login">●</span>
            <div :class="['state_bar',item.onlineTcp?'state_bar_login':'state_bar_out']">
              <span>{{ item.sn||item.deviceSn }}</span>
              <el-tooltip
        class="box-item"
        effect="dark"
        :content="item.name||item.position"
        placement="top-end"
      >
      <span>{{ nameOut(item.name||item.position)  }}</span>

      </el-tooltip>
              <span>
                <el-tag v-if="!item.onlineTcp" type="danger" size="small" effect="dark"
                  >离线</el-tag>
                <el-tag v-else type="success" size="small" effect="dark"
                  >上线</el-tag>
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
      dataArr.value.push({
        time:getTime(item),
        ...item
      })
    })
  })
watch(()=>props.stateObj,(newValue)=>{
  if(newValue){
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
  transform: translateX(1.875vw); /* 30px */
}

.list-leave-active {
  position: absolute;
}

.box {
  background: url(@/assets/systemPerceptionImage/border_green.png) no-repeat;
  background-size: 100% 100%;
  margin: 0rem 0.625rem 0.625rem 0.9375rem; /* 0px 10px 10px 15px */
  padding: 0.9375rem 0 0.9375rem 0.625rem; /* 15px 0 0 10px */
  .title {
    height: 3vh; /* 40px */
    display: flex;
    margin-bottom: 0.3125rem;
    align-items: center;
    padding-top: 0.4375rem;
    > img {
      margin-top: -0.625rem; /* -10px */
    }
    border-left-style: none;
    border-right-style: none;
    span {
      font-size: 1rem; /* 16px */
    }
  }

  .state {
    height: calc(100% - 2.5vh); /* 100% - 40px */
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: scrollbar;
    ul > li {
      margin-top: 0.625rem; /* 10px */
      padding-top: 0.625rem; /* 10px */
      height: 6.4vh; /* 60px */
      font-size: 0.8rem;
    }

    .state_time {
      padding-left: 2.5rem; /* 40px */
    }

    .state_main {
      padding-left: 0.3125rem; /* 5px */
      height: calc(100% - 1.25rem); /* 100% - 20px */
      display: flex;

      .circle-out {
        padding-left: 0.3125rem; /* 5px */
        flex: 1;
        display: flex;
        align-items: center;
        color: rgb(243, 19, 19);
      }
      .circle-login {
        @extend .circle-out;
        color: rgb(103, 194, 58);
      }

      .state_bar {
        position: relative;
        background-size: 100% 100%;
        flex: 20;
        display: flex;
        align-items: center;
        line-height: 1.875rem; /* 30px */
        padding: 0 0.9375rem; /* 0 15px */
        span:first-child {
          position: absolute;
          left: 1.25rem; /* 20px */
        }

        span:nth-child(2) {
          position: absolute;
          right: 5rem; /* 80px */
        }

        span:nth-child(3) {
          position: absolute;
          right: 5rem; /* 80px */
          display: flex;
          align-items: center;
        }
      }
      .state_bar_login {
        background: url(@/assets/systemPerceptionImage/rectangle_green.png) no-repeat;
        background-size: cover;
      }
      .state_bar_out {
        background: url(@/assets/systemPerceptionImage/rectangle_red.png) no-repeat;
        background-size: cover;
      }
    }
  }
}
</style>
