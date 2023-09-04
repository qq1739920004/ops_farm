<template>
  <div class="top">
    <div class="top_left">
      <div class="top_tittle">
        <router-link to='/monitoring'>
          <img src="../../perception/image/top_title_logo.png" key="" alt="" />
          <img src="../../perception/image/top_title_word.png" alt="" />
        </router-link>

      </div>
      <div class="top_num">
        <div>
          <img  src="../../perception/image/top_number1.png" alt="" />
          <div class="word">
            <p>{{ monitorData.onlineDevice }}</p>
            <p>当前在线数 </p>
          </div>
        </div>
        <div>
          <img  src="../../perception/image/top_number2.png" alt="" />
          <div class="word">
            <p>{{ monitorData.addNowYearDevice }}</p>
            <p>当年新增农机</p>
          </div>
        </div>
        <div>
          <div class="rotate-dance">
            <img  src="../../perception/image/top_number3.png" alt="" />
            <img class="rotate-content" src="../../perception/image/car.png" alt="">
          </div>
          <div class="word">
            <p>{{ monitorData.totalDevice }}</p>
            <p>农机总数</p>
          </div>
        </div>
        <div>
          <div class="rotate-dance2">
            <img  src="../../perception/image/top_number3.png" alt="" />
            <img class="rotate-content" src="../../perception/image/consumer.png" alt="">
          </div>
          <div class="word">
            <p>{{ monitorData.activeDevice }}</p>
            <p>已售农机数</p>
          </div>
        </div>
      </div>
    </div>

      <district-info></district-info>
  </div>
</template>
<script setup lang='ts'>
import districtInfo from '@/views/perception/component/districtInfo.vue';
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

  .top_left {
    flex: 1;
    height: 223px;

    .top_tittle {
      height: 83px;
      margin-bottom: 15px;
      padding: 10px 0 0 40px;

      img {
        width: auto;
        height: auto;
        vertical-align: middle;
      }

      img:nth-child(2) {
        padding-left: 28px;
      }
    }

    .top_num {
      height: 140px;
      margin-left:23px ;
      // background-color: rgb(210, 149, 159, 0.2);
      display: flex;
      justify-content:start;
      >div {
        height: 140px;
        display: flex;
        padding: 0 15px;

        img {
          max-width: 100%;
          height: 100px;
          top: 20%;
          left: 5%;
        }

        .word {
          margin-left: 19px;
          :first-child {
            margin: 0px;
            font-size: 50px;
            color: rgba(67, 207, 124, 1);
          }

          :last-child {
            margin: 0px;
            font-size: 16px;
            color: rgba(255, 255, 255, 0.9);
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
      height: 100%;
      border-top: 2px solid #40b971;
      box-shadow: 0px -10px 4px rgba(255, 255, 255, 0.039);
      border-radius: 50%;
      content: "";
      display: block;
   }
  .rotate-dance{
    .rotate-content{
      width: 28px;
      height: 26px!important;
      position: absolute;
      left: 36px!important;
      top: 38px!important;
    }
   position: relative;
   width: 100px;
   height: 100px;
    &::after{
      @extend .rotate;
      animation: rotate-danc 3s linear infinite;
    }
    &::before{
      @extend .rotate;
      //反着运行动画
      animation: rotate-danc 3s linear infinite reverse;
    }
  }
  .rotate-dance2{
    @extend .rotate-dance;
    .rotate-content{
      width: 26px;
      height: 24px !important;

    }
    &::after{
      border-top: 2px solid #b1c144;
    }
    &::before{
      border-top: 2px solid #b1c144;
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
  