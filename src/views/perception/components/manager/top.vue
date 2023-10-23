<template>
  <div class="top">
    <div class="top_left">
      <div class="top_tittle">
        <router-link to="/monitoring">
          <img src="~@/assets/perceptionImage/top_title_logo.png" key="" alt="" />
          <h1>{{companyName}}数字大屏</h1>
        </router-link>
      </div>
      <div class="top_num">
        <div>
          <img class="top-left" src="~@/assets/perceptionImage/top_number1.png" alt="" />
          <div class="word">
            <p>{{ onlineDeviceValue }}</p>
            <p>当前在线数</p>
          </div>
        </div>
        <div>
          <img class="top-left" src="~@/assets/perceptionImage/top_number2.png" alt="" />
          <div class="word">
            <p>{{ addNowYearDeviceValue }}</p>
            <p>当年新增农机</p>
          </div>
        </div>
        <div>
          <div class="rotate-dance">
            <img class="top-rigth" src="~@/assets/perceptionImage/top_number4.png" alt="" />
            <img class="rotate-content" src="~@/assets/perceptionImage/car.png" alt="" />
          </div>
          <div class="word2">
            <p>{{ totalDeviceValue }}</p>
            <p>农机总数</p>
          </div>
        </div>
        <div>
          <div class="rotate-dance2">
            <img class="top-rigth" src="~@/assets/perceptionImage/top_number3.png" alt="" />
            <img class="rotate-content" src="~@/assets/perceptionImage/consumer.png" alt="" />
          </div>
          <div class="word2">
            <p class="yellow-text">{{ activeDeviceValue }}</p>
            <p>已售农机数</p>
          </div>
        </div>
      </div>
    </div>
    <district-info></district-info>
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
  height: 223px;
  justify-content: space-between;

  .top_left {
    flex: 2.2;
    height: 223px;

    .top_tittle {
      height: 83px;
      margin-bottom: 15px;
      padding: 0;
      display: flex;
      justify-content: start;
      align-items: center;

      img {
        width: 60px;
        margin:0 20px 0 15px;

      }

      h1 {
        text-shadow: 0px 3px 4px rgba(255, 255, 255, 0.3),
          0px 2px 32px rgba(153, 255, 194, 0.8);
        font-size: 42px;
        font-weight: 400;
        letter-spacing: 12px;
        font-family: 'perceptionTitle';
      }

      a {
        display: flex;
        align-items: center;
      }
    }

    .top_num {
      height: 140px;
      margin-left: 15px;
      // background-color: rgb(210, 149, 159, 0.2);
      display: flex;
      justify-content: start;

      >div {
        height: 140px;
        display: flex;

        .top-left {
          width: 82px;
          height: 85.5px;
        }

        .word {
          margin-left: 19px;

          :first-child {
            margin: 0px;
            line-height: 60px;
            font-size: 50px;
            color: rgba(67, 207, 124, 1);
          }

          :last-child {
            margin: 0px;
            font-size: 16px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.9);
          }
        }

        .word2 {
          min-width: 80px;

          .yellow-text {
            color: #ffc300;
          }

          padding-top: 12px;

          :first-child {
            margin: 0px;
          }

          color: rgba(67, 207, 124, 1);
          font-size: 36px;

          :last-child {
            margin: 0px;
            margin-top: -8px;
            font-size: 16px;
            font-weight: 500;
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

  .rotate {
    position: absolute;
    width: 64px;
    height: 64px;
    border-top: 2px solid #40b971;
    box-shadow: 0px -10px 4px rgba(255, 255, 255, 0.039);
    border-radius: 50%;
    content: "";
    display: block;
  }

  .rotate-dance {
    display: flex;
    justify-content: center;
    align-items: center;

    .top-rigth {
      width: 64px !important;
      height: 64px !important;
    }

    .rotate-content {
      width: 24px;
      height: 24px !important;
      position: absolute;
      left: 50% !important;
      top: 50% !important;
      transform: translate(-50%, -50%);
    }

    position: relative;
    width: 100px;
    height: 100px;

    &::after {
      @extend .rotate;
      animation: rotate-danc 3s linear infinite;
    }

    &::before {
      @extend .rotate;
      //反着运行动画
      animation: rotate-danc 3s linear infinite reverse;
    }
  }

  .rotate-dance2 {
    @extend .rotate-dance;

    .rotate-content {
      width: 22px;
      height: 20px !important;
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
