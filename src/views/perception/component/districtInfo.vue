<template>
  <div class="top_time">
    <div class="temp" v-if="weather">
      <span>{{ weather.now.temp }}℃</span>
      <span>{{ weather.now.text }}</span>
      <!-- <img class="top_time_pic" src="../../perception/image/cloud.png" alt="" /> -->
      <img
        class="top_time_pic"
        src="~@/assets/perceptionImage/cloud.png"
        alt=""
      />
    </div>
    <div class="time">
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
// import {getWeatherAPI} from '@/api/perception/index.ts';
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
  console.log(JSON.parse(res.data));
  weather = JSON.parse(res.data);
}
weatherService();
</script>

<style scoped lang="scss">
.top_time {
  height: 223px;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  padding-right: 25px;
  font-size: 20px;

  span {
    padding-right: 15px;
  }

  .temp {
    display: flex;
    justify-content: center;
    align-items: center;
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
</style>
