<template>
  <div class="top">
    <div class="top_left">
      <!-- <img src="~@/assets/systemPerceptionImage/top_title_logo.png" class="top-img"  key=""  alt="" /> -->
      <div class="top_tittle" v-if="isChangfa">
        <router-link to='/monitoring'>
          <img src="~@/assets/perceptionImage/logochangfa-usercenter.png" key=""  alt="" />
          <h1>常发农装感知平台</h1>
        </router-link>
      </div>
      <div class="top_tittle" v-else>
        <router-link to='/monitoring'>
          <img src="~@/assets/perceptionImage/top_title_logo.png" key=""  alt="" />
          <h1>CTFarm Perception Platform</h1>
        </router-link>

      </div>
      <div class="top_num">
        <div>
          <img  src="~@/assets/systemPerceptionImage/top_number1.png" alt=""  />
          <div class="word">
            <p>{{ monitorData.todayAcDevice || 0 }}</p>
            <p>{{$t('perception.activeToday')}} </p>
          </div>
        </div>
        <div>
          <img  src="~@/assets/systemPerceptionImage/top_number2.png" alt="" />
          <div class="word">
            <p>{{ Math.floor(monitorData.todayArea) }}</p>
            <p>{{$t('perception.todayWorkingArea')}}</p>
          </div>
        </div>
        <div>
          <div class="rotate-dance">
            <img  src="~@/assets/systemPerceptionImage/top_number3.png" alt="" />
            <img class="rotate-content" src="~@/assets/perceptionImage/car.png" alt="">
          </div>
          <div class="word">
            <p>{{ monitorData.totalDevice }}</p>
            <p>{{$t('perception.totalVehicle')}}</p>
          </div>
        </div>
        <div>
          <div class="rotate-dance2">
            <img  src="~@/assets/systemPerceptionImage/top_number3.png" alt="" />
            <img class="rotate-content" src="~@/assets/systemPerceptionImage/onlineCar.png" alt="">
          </div>
          <div class="word">
            <p>{{ monitorData.onlineDevice }}</p>
            <p>{{$t('perception.online')}}</p>
          </div>
        </div>
        <div>
          <div class="rotate-dance2">
            <img  src="~@/assets/systemPerceptionImage/top_number3.png" alt="" />
            <img class="rotate-content" src="~@/assets/systemPerceptionImage/activeCar.png" alt="">
          </div>
          <div class="word">
            <p>{{ monitorData.activeDevice }}</p>
            <p>{{$t('perception.activeAmount')}}</p>
          </div>
        </div>
      </div>
    </div>

      <district-info></district-info>
  </div>
</template>
<script setup lang='ts'>
import districtInfo from './districtInfo.vue';
const isChangfa = import.meta.env.MODE === "changFa";

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
  height: 11.6vh;
  flex-direction: column;
  flex-wrap: wrap;
  .top-img {
    position: absolute;
    top: 0;
    left: 0;
  }

  .top_left {
    flex: 1;
    height: 11.6vh;

    .top_tittle {
      padding-top: 2.8rem;
      height: 3.18vh;
      display: flex;
      justify-content: start;
      align-items: center;
      margin-bottom: 2.6rem;
      h1 {
        text-shadow: 0px 0.125rem 2rem rgba(255, 255, 255, 0.8);
        font-size: 2.625rem;
        font-weight: 400;
        letter-spacing: 0.3125rem;
        font-family: 'perceptionTitle';
        cursor: pointer;
        z-index: 9;
        color: rgba(255, 255, 255, 1);
      }
      a {
        display: flex;
        align-items: center;
      }
      img:nth-child(1) {
        width: 3.75rem;
        position: relative;
        margin: 0 1.05rem 0 2.1rem;
        z-index: 9;
      }
    }

    .top_num {
      height: 7.5rem;
      margin-left: 1.4375rem;
      display: flex;
      justify-content: start;
      > div {
        height: 7.5rem;
        display: flex;
        padding: 0 0.9375rem;
        img {
          height: 100%;
        }

        .word {
          margin-left: 0.8125rem;
          display: flex;
          flex-direction: column;
          justify-content: start;
          :first-child {
            margin: 0px;
            font-size: 2.75rem;
            color: rgba(67, 207, 124, 1);
          }

          :last-child {
            margin: 0px;
            font-size: 1rem;
            color: white;
          }
        }
      }
    }
  }

  .top_time {
    height: 11.6vh;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    font-size: 1.25rem;

    span {
      padding-right: 0.9375rem;
    }

   

    .time {
      :nth-child(2) {
        font-size: 2.179rem;
      }
    }
  }

  .rotate {
    width: 100%;
    border-top: 0.125rem solid #40b971;
    box-shadow: 0px -0.625rem 0.25rem rgba(255, 255, 255, 0.039);
    border-radius: 50%;
    content: "";
    display: block;
  }

  .rotate-dance {
    position: relative;

    img:nth-child(1){
      position: absolute;
      left: 0.15rem !important;
      top: 0 !important;
    }
    .rotate-content {
      width: 1.625rem;
      height: 1.625rem !important;
    }
    display: flex;
    justify-content: center;
    align-items: center;
    width: 5rem;
    height: 5rem;
  }

  .rotate-dance2 {
    @extend .rotate-dance;
    .rotate-content {
      width: 1.625rem;
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
  