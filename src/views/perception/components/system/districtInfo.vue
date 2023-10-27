<template>
  <div class="top_time">
    <div class="temp" v-if="weather">
      <span>{{ weather.now.temp }}℃</span>
      <span>{{ weather.now.text }}</span>
      <img v-if="weather.now.text=='阴'" class="top_time_pic" src="~@/assets/perceptionImage/cloud.png" alt="" />
      <img v-else-if="weather.now.text=='晴'" class="top_time_pic" src="~@/assets/perceptionImage/shine.png" alt="" />
      <img v-else-if="weather.now.text.includes('雷')" class="top_time_pic" src="~@/assets/perceptionImage/thunder.png" alt="" />
      <img v-else-if="weather.now.text==='小雨'" class="top_time_pic" src="~@/assets/perceptionImage/rain.png" alt="" />
      <img v-else-if="weather.now.text.includes('雨')" class="top_time_pic" src="~@/assets/perceptionImage/bigrain.png" alt="" />
      <img v-else-if="weather.now.text==='多云'" class="top_time_pic" src="~@/assets/perceptionImage/weatherElse.png" alt="" />
      <img v-else class="top_time_pic" src="~@/assets/perceptionImage/weatherElse.png" alt="" />
    </div>
    <div class="time">
      <img @click="screenChange(false)" class="zoom" v-if="isZoom" src="@/assets/perceptionImage/zoom.svg" alt="">
      <img @click="screenChange(true)" class="zoom" v-else src="@/assets/perceptionImage/out.svg" alt="">
      <span>{{ time.week }}</span>
      <span>{{ time.time }}</span>
      <span>{{ time.date }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { getCurrentDateTime } from "@/utils/getTimeInfo";
import { getWeather } from "@/api/perception/index.ts";
import {fullScreen} from '@/utils/fullScreen.ts';

// import {getWeatherAPI} from '@/api/perception/index.ts';
let isZoom=ref(true)
function screenChange(zValue:boolean){
  isZoom.value=zValue
  fullScreen()
}
const time = ref(getCurrentDateTime());
let weather: any = ref(null);
setInterval(() => {
  time.value = getCurrentDateTime();
}, 1000);
// getWeatherAPI().then(res => {
//   console.log(res)
// })
async function weatherService() {
  let res: any = await getWeather();
  weather = JSON.parse(res.data);
}
weatherService();
</script>

<style scoped lang="scss">
.top_time {
  height: 23.8vh; /* 223px */
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  padding-right: 1.3021vw; /* 25px */
  font-size: 1.0417vw; /* 20px */

  span {
    padding-right: 0.7812vw; /* 15px */
  }

  .temp {
    transform: translate(1.3542vw,-3.5922vh); /* 26px,-44px */
    display: flex;
    justify-content: center;
    align-items: center;
    .top_time_pic {
      width: 2.1354vw; /* 41px */
      vertical-align: middle;
      padding-right: 0.7812vw; /* 15px */
    }
  }

  .time {
    .zoom {
      width: 1.25vw; /* 24px */
      height: 2.56vh; /* 24px */
      margin-right: 0.8333vw; /* 16px */
      vertical-align: middle;
      cursor: pointer;
    }
    :nth-child(3) {
      font-size: 1.8151vw; /* 34.87px */
    }
  }
}
</style>
