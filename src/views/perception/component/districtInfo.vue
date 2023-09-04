<template>
  <div class="top_time">
    <div class="temp">
      <span>16℃</span>
      <span>多云</span>
      <!-- <img class="top_time_pic" src="../../perception/image/cloud.png" alt="" /> -->
      <img
        class="top_time_pic"
        src="~@/views/perception/image/cloud.png"
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
// import {getWeatherAPI} from '@/api/perception/index.ts';
const time = ref(getCurrentDateTime());
setInterval(() => {
  time.value = getCurrentDateTime();
}, 1000);
// getWeatherAPI().then(res => {
//   console.log(res)
// })


</script>

<style scoped lang="scss">
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
</style>
