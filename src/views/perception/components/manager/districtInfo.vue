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
    <span class="manager-name">{{ companyName }}</span>
    <!-- //公司logo -->
    <div class="logo-text">
      <img
        @click="screenChange(false)"
        class="zoom"
        v-if="isZoom"
        src="@/assets/perceptionImage/out.svg"
        alt=""
      />
      <img
        @click="screenChange(true)"
        class="zoom"
        v-else
        src="@/assets/perceptionImage/zoom.svg"
        alt=""
      />
      <div class="time">
        <!-- <span>{{ time.week }}</span> -->
        <span>{{ time.date }}</span>
        <span>{{ time.time }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { getCurrentDateTime } from "@/utils/getTimeInfo";
import { fullScreen } from "@/utils/fullScreen.ts";
// import { getWeather } from "@/api/perception/index.ts";
// import {getWeatherAPI} from '@/api/perception/index.ts';
defineProps({
  companyName: {
    type: String,
    default: "XXXXXX",
  },
});
let isZoom = ref(false);
function screenChange(zValue: boolean) {
  isZoom.value = zValue;
  fullScreen();
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
  height: 168px;
  padding-right: 25px;
  margin-top: 10px;
  font-size: 20px;
  span {
    padding-right: 15px;
  }

  .temp {
    .top_time_pic {
      width: 41px;
      vertical-align: middle;
      padding-right: 15px;
    }
  }
  .manager-name {
    text-shadow: 0px 0px 10px rgba(255, 255, 255, 0.8);
    font-size: 24px;
    letter-spacing: 2px;
    line-height: 34.75px;
    color: rgba(255, 255, 255, 1);
    margin-bottom: 22px;
  }

  .time {
    color: #64cc77;
    :nth-child(2) {
      font-size: 34.87px;
    }
  }
  .logo-text {
    font-size: 22px;
    display: flex;
    align-items: center;
    .zoom {
      width: 24px;
height: 24px;
      margin-right: 16px;
      cursor: pointer;
    }
  }
}
</style>
