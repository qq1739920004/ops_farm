<template>
  <div class="top">
    <div class="top_left">
      <div class="top_tittle" v-if="isChangfa">
        <router-link to="/monitoring">
          <img src="~@/assets/perceptionImage/logochangfa-usercenter.png" key="" alt="" />
          <h1>常发导航北斗农机智能监管平台</h1>
        </router-link>
      </div>
      <div class="top_tittle" v-else>
        <router-link to="/monitoring">
          <img src="~@/assets/perceptionImage/top_title_logo.png" key="" alt="" />
          <h1>司南导航北斗农机智能监管平台</h1>
        </router-link>
      </div>
      <div class="top_num">
        <div>
          <img class="top-left" src="~@/assets/perceptionImage/top_number1.png" alt="" />
          <div class="word">
            <p>{{ onlineDeviceValue }}</p>
            <p>{{$t('perception.tonline')}}</p>
          </div>
        </div>
        <div>
          <img class="top-left" src="~@/assets/perceptionImage/top_number2.png" alt="" />
          <div class="word">
            <p>{{ addNowYearDeviceValue }}</p>
            <p>{{$t('perception.newlyIncreased')}}</p>
          </div>
        </div>
        <div>
          <div class="rotate-dance">
            <img class="top-rigth" src="~@/assets/perceptionImage/top_number4.png" alt="" />
            <img class="rotate-content" src="~@/assets/perceptionImage/car.png" alt="" />
          </div>
          <div class="word2">
            <p>{{ totalDeviceValue }}</p>
            <p>{{$t('perception.totalVehicle')}}</p>
          </div>
        </div>
        <div>
          <div class="rotate-dance2">
            <img class="top-rigth" src="~@/assets/perceptionImage/top_number3.png" alt="" />
            <img class="rotate-content" src="~@/assets/perceptionImage/consumer.png" alt="" />
          </div>
          <div class="word2">
            <p class="yellow-text">{{ activeDeviceValue }}</p>
            <p>{{$t('perception.soldVehicle')}}</p>
          </div>
        </div>
      </div>
    </div>
    <district-info :companyName="companyName"></district-info>
  </div>
</template>
<script setup lang="ts">
import districtInfo from "./districtInfo.vue";
import { ref, watch } from "vue";
import { gsap } from 'gsap';
const props = defineProps({
  companyName:{
    type:String,
    default:'XXXXXX',
  },
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
          typeName: "",
          onlineCount: 0,
          totalCount: 0,
        },
      ],
      provinceCars: [
        {
          name: "",
          totalNum: 0,
          onlineNum: 0,
        },
      ],
      carArea: {
        key: 0,
      },
    },
  },
});
// 定义初始值
const initialValue = 0;
const isChangfa = import.meta.env.MODE === "changFa";

// 创建一个ref来保存动画值
let totalDeviceValue = ref(initialValue);
let activeDeviceValue = ref(initialValue);
let onlineDeviceValue = ref(initialValue);
let addNowYearDeviceValue = ref(initialValue);
let durationTime = ref(3)
function animationTop(animatedValue: any, newValue: number) {
  gsap.to(animatedValue, {
    value: newValue,
    duration: durationTime.value, // 动画持续时间，可以根据需要调整
    onUpdate: () => {
      animatedValue.value = Math.round(animatedValue.value);
    },
    //动画结束
    onComplete: () => {
      durationTime.value = 0.5
    },
  });
}
watch(() => props.monitorData.totalDevice, (newValue) => {
  animationTop(totalDeviceValue, newValue)
})
watch(() => props.monitorData.activeDevice, (newValue) => {
  animationTop(activeDeviceValue, newValue)
})
watch(() => props.monitorData.onlineDevice, (newValue) => {
  animationTop(onlineDeviceValue, newValue)
})
watch(() => props.monitorData.addNowYearDevice, (newValue) => {
  animationTop(addNowYearDeviceValue, newValue)
})
</script>

<style scoped lang="scss">
.top {
  font-family: 'perceptionFont';
  box-sizing: border-box;
  display: flex;
  width: 100%;
  height: calc(223 / 937 * 100vh);
  justify-content: space-between;

  .top_left {
    flex: 2.2;
    height: calc(223 / 937 * 100vh);

    .top_tittle {
      height: calc(83 / 937 * 100vh);
      padding: 0;
      display: flex;
      justify-content: start;
      align-items: center;

      img {
        width: 60px; // 图标大小保持不变
        margin: 0 calc(20 / 1920 * 100vw) 0 calc(15 / 1920 * 100vw);
      }

      h1 {
        text-shadow: 0px calc(2 / 937 * 100vh) calc(32 / 937 * 100vh) rgba(153, 255, 194, 0.8);
        font-size: 2.5rem; /* 40px 转换为 rem */
        font-weight: 600;
        letter-spacing: calc(10 / 1920 * 100vw);
      }

      a {
        display: flex;
        align-items: center;
      }
    }

    .top_num {
      height: calc(140 / 937 * 100vh);
      margin-left: calc(15 / 1920 * 100vw);
      display: flex;
      justify-content: start;
      padding-top: calc(10 / 937 * 100vh);
      >div {
        height: calc(100 / 937 * 100vh);
        display: flex;
        align-items: center;
        .top-left {
          width: 82px;
          height: 85.5px;
        }

        .word {
          margin-left: calc(19 / 1920 * 100vw);

          :first-child {
            margin: 0px;
            line-height: calc(60 / 937 * 100vh);
            font-size: 3.125rem; /* 50px 转换为 rem */
            color: rgba(67, 207, 124, 1);
          }

          :last-child {
            margin: 0px;
            font-size: 1rem; /* 16px 转换为 rem */
            font-weight: 600;
            color: rgba(255, 255, 255, 0.9);
          }
        }

        .word2 {
          min-width: calc(80 / 1920 * 100vw);

          .yellow-text {
            color: #ffc300;
          }

          padding-top: calc(12 / 937 * 100vh);

          :first-child {
            margin: 0px;
          }

          color: rgba(67, 207, 124, 1);
          font-size: 2.25rem; /* 36px 转换为 rem */

          :last-child {
            margin: 0px;
            margin-top: calc(-8 / 937 * 100vh);
            font-size: 1rem; /* 16px 转换为 rem */
            font-weight: 500;
            color: rgba(255, 255, 255, 0.9);
          }
        }
      }
    }
  }

  .top_time {
    height: calc(168 / 937 * 100vh);
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    font-size: 1.25rem; /* 20px 转换为 rem */

    span {
      padding-right: calc(15 / 1920 * 100vw);
    }

    .temp {
      .top_time_pic {
        vertical-align: middle;
        padding-right: calc(15 / 1920 * 100vw);
      }
    }

    .time {
      :nth-child(2) {
        font-size: 2.179375rem; /* 34.87px 转换为 rem */
      }
    }
  }

  .rotate {
    position: absolute;
    width: 64px; // 图标大小保持不变
    height: 64px; // 图标大小保持不变
    border-top: 2px solid #40b971;
    box-shadow: 0px calc(-10 / 937 * 100vh) 4px rgba(255, 255, 255, 0.039);
    border-radius: 50%;
    content: "";
    display: block;
  }

  .rotate-dance {
    display: flex;
    justify-content: center;
    align-items: center;

    .top-rigth {
      width: 64px !important; // 图标大小保持不变
      height: 64px !important; // 图标大小保持不变
    }

    .rotate-content {
      width: 24px; // 图标大小保持不变
      height: 24px !important; // 图标大小保持不变
      position: absolute;
      left: 50% !important;
      top: 50% !important;
      transform: translate(-50%, -50%);
    }

    position: relative;
    width: calc(100 / 1920 * 100vw);
    height: calc(100 / 937 * 100vh);

    &::after {
      @extend .rotate;
      animation: rotate-danc 3s linear infinite;
    }

    &::before {
      @extend .rotate;
      animation: rotate-danc 3s linear infinite reverse;
    }
  }

  .rotate-dance2 {
    @extend .rotate-dance;

    .rotate-content {
      width: 22px; // 图标大小保持不变
      height: 20px !important; // 图标大小保持不变
    }

    &::after {
      border-top: 2px solid #b1c144;
    }

    &::before {
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
