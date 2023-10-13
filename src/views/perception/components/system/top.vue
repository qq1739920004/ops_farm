<template>
  <div class="top">
    <div class="top_left">
      <!-- <img src="~@/assets/systemPerceptionImage/top_title_logo.png" class="top-img"  key=""  alt="" /> -->
      <div class="top_tittle">
        <router-link to='/monitoring'>
          <img src="~@/assets/perceptionImage/top_title_logo.png" key=""  alt="" />
          <img src="~@/assets/perceptionImage/top_title_word.png" alt="" />
        </router-link>

      </div>
      <div class="top_num">
        <div>
          <img  src="~@/assets/systemPerceptionImage/top_number1.png" alt=""  />
          <div class="word">
            <p>{{ monitorData.todayAcDevice }}</p>
            <p>今日活跃数 </p>
          </div>
        </div>
        <div>
          <img  src="~@/assets/systemPerceptionImage/top_number2.png" alt="" />
          <div class="word">
            <p>{{ Math.floor(monitorData.todayArea) }}</p>
            <p>今日作业面积</p>
          </div>
        </div>
        <div>
          <div class="rotate-dance">
            <img  src="~@/assets/systemPerceptionImage/top_number3.png" alt="" />
            <img class="rotate-content" src="~@/assets/perceptionImage/car.png" alt="">
          </div>
          <div class="word">
            <p>{{ monitorData.totalDevice }}</p>
            <p>农机总数</p>
          </div>
        </div>
        <div>
          <div class="rotate-dance2">
            <img  src="~@/assets/systemPerceptionImage/top_number3.png" alt="" />
            <img class="rotate-content" src="~@/assets/systemPerceptionImage/onlineCar.png" alt="">
          </div>
          <div class="word">
            <p>{{ monitorData.onlineDevice }}</p>
            <p>在线农机数</p>
          </div>
        </div>
        <div>
          <div class="rotate-dance2">
            <img  src="~@/assets/systemPerceptionImage/top_number3.png" alt="" />
            <img class="rotate-content" src="~@/assets/systemPerceptionImage/activeCar.png" alt="">
          </div>
          <div class="word">
            <p>{{ monitorData.activeDevice }}</p>
            <p>激活农机数</p>
          </div>
        </div>
      </div>
    </div>

      <district-info></district-info>
  </div>
</template>
<script setup lang='ts'>
import districtInfo from './districtInfo.vue';
defineProps({
  monitorData: {
    type: Object,
    default: {
      onlineDevice: 0,
      addNowYearDevice: 0,
      totalDevice: 0,
      activeDevice: 0,
      todayArea: 0,
      totalArea: 0,
      typeCounts: [
        {
          typeName: '',
          onlineCount: 0,
          totalCount: 0
        }
      ],
      provinceCars: [
        {
          name: '',
          totalNum: 0,
          onlineNum: 0
        }
      ],
      carArea: {
        key: 0
      }

    }
  }
})


</script>

<style scoped lang="scss">
.top {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  height: 223px;
  flex-direction: column;
  flex-wrap: wrap;
  .top-img{
      position: absolute;
      top: 0;
      left: 0;
    }
  .top_left {
    flex: 1;
    height: 223px;
    
    .top_tittle {
      height: 61px;
      display: flex;
      padding: 0;
      justify-content: start;
      align-items: center;
      margin-bottom: 15px;
      a{
        display: flex;
        align-items: center;
      }
      img:nth-child(1){
        width: 140px;
        position: relative;
        z-index: 9;

      }
      img:nth-child(2){
        width: 382px;
        position: relative;
        left: -20px;
        z-index: 9;
      }
     
    }

    .top_num {
      height: 120px;
      margin-left:23px ;
      // background-color: rgb(210, 149, 159, 0.2);
      display: flex;
      justify-content:start;
      >div {
        height: 120px;
        display: flex;
        padding: 0 15px;
        img {
          height: 100%;
          top: 20%;
          left: 5%;
        }

        .word {
          margin-left: 13px;
          display: flex;
          flex-direction: column;
          justify-content: start;
          :first-child {
            margin: 0px;
            font-size: 44px;
            color: rgba(67, 207, 124, 1);
          }

          :last-child {
            margin: 0px;
            font-size: 16px;
            color: white;
          }
        }
      }
    }
  }

  .top_time {
    height: 223px;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    font-size: 20px;

    span {
      padding-right: 15px;
    }

    .temp {
      .top_time_pic {
        vertical-align: middle;
        padding-right: 15px;
      }
    }

    .time {
      :nth-child(2) {
        font-size: 34.87px;
      }
    }
  }
  .rotate{
     position:absolute;
      top: 0px;
      left: -2px;
      width: 100%;
      border-top: 2px solid #40b971;
      box-shadow: 0px -10px 4px rgba(255, 255, 255, 0.039);
      border-radius: 50%;
      content: "";
      display: block;
   }
  .rotate-dance{
    .rotate-content{
      width: 26px;
      height: 26px!important;
      position: absolute;
      left: 24px!important;
      top: 26px!important;
    }
   position: relative;
   width: 80px;
   height: 80px;

  }
  .rotate-dance2{
    @extend .rotate-dance;
    .rotate-content{
      width: 26px;
    }
}
  @keyframes rotate-danc {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
  