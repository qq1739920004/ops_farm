<template>
  <div class="box">
    <div class="title">
      <span>|</span>&nbsp
      <span class="arrows-shadow">▸</span>
      状态通知栏
      <span class="arrows-shadow">◂</span>
    </div>

    <div class="state">
    <TransitionGroup name="list" tag="ul">
        <li v-for="item in dataArr" :key="item.carId">
          <div class="state_time">{{ item.time }}</div>
          <div class="state_main">
            <span v-if="!item.online" class="circle-out">●</span>
            <span v-else class="circle-login">●</span>
            <div :class="['state_bar',item.online?'state_bar_login':'state_bar_out']">
              <span>{{ item.name }}</span>
              <span>{{ item.cityName }}</span>
              <span>
                <el-tag v-if="!item.online" type="danger" size="small" effect="dark"
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
import {ref,onMounted} from 'vue';
import {getStateWs,getState} from '@/api/perception/index.ts';

// const props = defineProps({
//   provinceCars: {
//     type: Object,
//   },
// });
// let dataArr=ref([
//   {
//     carId:0,
//     code:0,
//   time:'2021/02/02 12:32',
//   offlineTime: "2023-08-09 12:58:26",
// onlineTime: "2023-08-09 12:54:27",
// sn: "100750740000",
//   name:'上海',
//   carName:'A300',
//   online:0,
// }
let dataArr=ref([
  {
    carId:0,
    code:0,
  time:'2021/02/02 12:32',
  name:'上海',
  cityName:'A300',
  online:0,
},
  {
    carId:1,

  time:'2021/02/02 12:32',
  name:'上海',
  cityName:'A300',
  online:1,
},
  {
    carId:2,

  time:'2021/02/02 12:32',
  name:'上海',
  cityName:'A300',
  online:0,
}
]) 
let ii=ref(3)
onMounted(() => {
  getStateWs(dataArr)
  getState({
    currentPage:1,
    pageSize:5
  }).then(res=>{
    console.log(res.data.records[0])
  })
  setInterval(() => {
  dataArr.value.unshift({
    carId:ii.value,
    time:'2021/02/02 12:32',
    name:'上海',
    cityName:'A300',
    online:1,
  })
  ii.value++
}, 2000);
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
  background: url(../image/border_green.png) no-repeat;
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
    height: calc(100% - 40px);
    overflow: auto;
    //影藏滚动条
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: scrollbar;
    scrollbar-wcarIdth: thin;
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
        padding-left: 5px;
        flex: 1;
        color: rgb(243, 19, 19);
      }
      .circle-login{
        @extend .circle-out;
        color: rgb(103, 194, 58);
      }

      .state_bar {
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

        span:nth-child(3) {
          padding-top: 5px;
          position: absolute;
          right: 80px;
        }
      }
      .state_bar_login{
        background: url(../image/rectangle_green.png) no-repeat;

      }
      .state_bar_out{
        background: url(../image/rectangle_red.png) no-repeat;

      }
    }
  }
}
</style>
