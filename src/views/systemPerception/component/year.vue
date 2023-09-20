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
          <span class="circle"></span><span>{{ Math.trunc(totalArea) }}</span
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
  margin: 0px 10px 10px 15px;
  padding: 6px 0 0 10px;
  .content-box {
    display: flex;
    width: 100%;
    text-align: center;
    justify-content: space-evenly;
    align-items: center;

    .value-box {
      width: 167px;
      height: 80px;
      color: #47cf82;
      font-size: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(
        180deg,
        rgba(25, 105, 73, 0.5) 0%,
        rgba(25, 105, 73, 0.06) 100%
      );
      .circle {
        width: 8px;
        height: 8px;
        background-color: transparent;
        border-radius: 50%;
        border: 2px solid #b8b9b9de;
        margin-right: 10px;
        position: relative;
        &::after {
          content: "";
          width: 8px;
          background-color: #b8b9b971;
          height: 8px;
          border-radius: 50%;
          position: absolute;
          left: -2px;
          top: -2px;
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
        font-size: 18px;
        margin-left: 4px;
        transform: translateY(6px);
      }
    }
  }
  .title {
    height: 40px;
    line-height: 27px;
    display: flex;
    margin-bottom: 5px;
    align-items: center;
    > img {
      margin-top: -10px;
    }

    border-left-style: none;
    border-right-style: none;

    span {
      font-size: 16px;
    }

    span:first-child {
      font-size: 30px;
      font-weight: 900;
    }
  }

  .charts {
    height: calc(100% - 80px);
    display: flex;
    > div {
      background-color: rgba(196, 204, 158, 0.8);
      flex: 1;
      background: url(@/assets/perceptionImage/year_bg.png) no-repeat 0;
      background-size: cover;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 30px;
    }
  }
  .charts_title {
    height: 30px;
    display: flex;
    justify-content: center;
    > div {
      width: 50%;
      text-align: center;
      font-size: 20px;
    }
  }
}
</style>
