<template>
  <div class="box">
    <div class="title">
      <img src="~@/assets/systemPerceptionImage/yearIcon.png" alt="" />
      <span>当年统计数</span>
    </div>
    <div class="content-box">
      <div class="item-box">
        <span>当年新增农机</span>
        <div class="value-box">
          <span class="circle"></span><span>{{ Math.trunc(addNowYearDevice) }}</span
          ><span class="unit">/辆</span>
        </div>
      </div>
      <div class="item-box">
        <span>当年累计作业面积</span>
        <div class="value-box">
          <span class="circle"></span><span  class="area">{{ Math.trunc(totalArea) }}</span
          ><span class="unit">/亩</span>
        </div>
      </div>
    </div>

    <!-- <div class="charts" id="myChart">
            <div class="chart_today" >
                {{Math.trunc(todayArea)  }}
            </div>
            <div class="chart_year" ref="bar2">
                {{Math.trunc(totalArea)  }}
            </div>
        </div> -->
  </div>
</template>

<script setup lang="ts">
defineProps({
  totalArea: {
    type: Number,
    default: 0,
  },
  addNowYearDevice: {
    type: Number,
    default: 0,
  },
});
</script>
<style lang="scss" scoped>
  .box {
  background: url(@/assets/systemPerceptionImage/border_year_green.png) no-repeat;
  background-size: 100% 100%;
  margin: 0rem 0.625rem 0.625rem 0.9375rem;
  padding: 0.375rem 0 0 0.625rem;
  
  .content-box {
    .area{
      font-size: 1.8rem;
    }
    display: flex;
    width: 100%;
    height:calc(100% - 0.8rem);
    text-align: center;
    justify-content: space-evenly;
    align-items: center;
    .value-box {
      width: 8.6979vw;
      height: 8.5271vh;
      color: #47cf82;
      font-size: 2.2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(
        180deg,
        rgba(25, 105, 73, 0.5) 0%,
        rgba(25, 105, 73, 0.06) 100%
      );
      .circle {
        width: 0.4167vw;
        height: 0.4167vw;
        background-color: transparent;
        border-radius: 50%;
        border: 0.125rem solid #b8b9b9de;
        margin-right: 0.625rem;
        position: relative;
        &::after {
          content: "";
          width: 0.4167vw;
          background-color: #b8b9b971;
          height: 0.4167vw;
          border-radius: 50%;
          position: absolute;
          left: -0.125rem;
          top: -0.125rem;
          animation: ripple 1s linear infinite;
        }
        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(5);
            opacity: 0;
          }
        }
      }
      .unit {
        font-size: 0.9375rem;
        margin-left: 0.25rem;
        transform: translateY(0.375rem);
      }
    }
  }
  .title {
    height: 2.8vh;
    padding-top: 0.5375rem;
    display: flex;
    align-items: center;
    > img {
      margin-top: -0.625rem;
    }
    span {
      font-size:1rem;
    }
    span:first-child {
      font-size: 1.5625rem;
      font-weight: 900;
    }
  }
  .charts {
    height: calc(100% - 4.2vh);
    display: flex;
    > div {
      background-color: rgba(196, 204, 158, 0.8);
      background: url(@/assets/perceptionImage/year_bg.png) no-repeat 0;
      background-size: cover;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.5625rem;
    }
  }
  .charts_title {
    height: 1.56vh;
    display: flex;
    justify-content: center;
    > div {
      width: 50%;
      text-align: center;
      font-size: 1.25rem;
    }
  }
}
</style>
