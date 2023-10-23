<template>
  <div class="top_time">
    <!-- <div class="temp" v-if="weather">
      <span>{{ weather.now.temp }}℃</span>
      <span>{{ weather.now.text }}</span>
      <img v-if="weather.now.text=='阴'" class="top_time_pic" src="~@/assets/perceptionImage/cloud.png" alt="" />
      <img v-else-if="weather.now.text=='晴'" class="top_time_pic" src="~@/assets/perceptionImage/shine.png" alt="" />
      <img v-else-if="weather.now.text.includes('雷')" class="top_time_pic" src="~@/assets/perceptionImage/thunder.png" alt="" />
      <img v-else-if="weather.now.text==='小雨'" class="top_time_pic" src="~@/assets/perceptionImage/rain.png" alt="" />
      <img v-else-if="weather.now.text.includes('雨')" class="top_time_pic" src="~@/assets/perceptionImage/bigrain.png" alt="" />
      <img v-else-if="weather.now.text==='多云'" class="top_time_pic" src="~@/assets/perceptionImage/weatherElse.png" alt="" />
      <img v-else class="top_time_pic" src="~@/assets/perceptionImage/weatherElse.png" alt="" />
    </div> -->
    <div class="time">
      <!-- <span>{{ time.week }}</span> -->
      <span>{{ time.date }}</span>
      <span>{{ time.time }}</span>

    </div>
    <!-- //公司logo -->
    <div class="corporation-logo">
      <img src="@/assets/perceptionImage/corporation-logo.png" alt="">
    </div>
    <div class="logo-text">
      <img @click="screenChange(false)" class="zoom" v-if="isZoom" src="@/assets/perceptionImage/out.svg" alt="">
      <img @click="screenChange(true)" class="zoom" v-else src="@/assets/perceptionImage/zoom.svg" alt="">
      <span>北斗农机智能监管平台</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { getCurrentDateTime } from "@/utils/getTimeInfo";
import {fullScreen} from '@/utils/fullScreen.ts';
// import { getWeather } from "@/api/perception/index.ts";
// import {getWeatherAPI} from '@/api/perception/index.ts';
let isZoom=ref(false)
function screenChange(zValue:boolean){
  isZoom.value=zValue
  fullScreen()
}
const time = ref(getCurrentDateTime());
// let weather: any = ref(null);
setInterval(() => {
  time.value = getCurrentDateTime();
}, 1000);
// getWeatherAPI().then(res => {
//   console.log(res)
// })
async function weatherService() {
  // let res: any = await getWeather();
  // weather = JSON.parse(res.data);
}

weatherService();
</script>

<style scoped lang="scss">
.top_time {
  height: 223px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: start !important;
  padding-right: 25px;
  margin-top: 10px;
  font-size: 20px;

  span {
    padding-right: 15px;
  }

  .temp {
    display: flex;
    justify-content: center;
    align-items: center;
    .top_time_pic {
      width: 41px;
      vertical-align: middle;
      padding-right: 15px;
    }
  }

  .time {
    color: #64cc77;
    :nth-child(2) {
      font-size: 34.87px;
    }
   
  }
  .logo-text{
      font-size: 22px;
      display: flex;
      align-items: center;
      .zoom{
        width: 20px;
        height: 20px;
        margin-right: 16px;
        cursor: pointer;
      }
    }
}
</style>
