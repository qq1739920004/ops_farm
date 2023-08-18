<template>
  <div class="top">
    <div class="top_left">
      <div class="top_tittle">
        <router-link to='/monitoring'>
          <img src="../../perception/image/top_title_logo.png" key="" alt="" />
          <img src="../../perception/image/top_title_word.png" alt="" />
        </router-link>

      </div>
      <div class="top_num">
        <div>
          <img src="../../perception/image/top_number1.png" alt="" />
          <div class="word">
            <p>{{ monitorData.todayArea }}</p>
            <p>当前在线数 </p>
          </div>
        </div>
        <div>
          <img src="../../perception/image/top_number2.png" alt="" />
          <div class="word">
            <p>{{ monitorData.addNowYearDevice }}</p>
            <p>当年新增农机</p>
          </div>
        </div>
        <div>
          <img src="../../perception/image/top_number3.png" alt="" />
          <div class="word">
            <p>{{ monitorData.totalDevice }}</p>
            <p>农机总数</p>
          </div>
        </div>
        <div>
          <img src="../../perception/image/top_number4.png" alt="" />
          <div class="word">
            <p>-</p>
            <p>已售农机数</p>
          </div>
        </div>
      </div>
    </div>

    <div class="top_time">
      <div class="temp">
        <span>16℃</span>
        <span>多云</span>
        <img class="top_time_pic" src="../../perception/image/cloud.png" alt="" />
      </div>
      <div class="time">
        <span>周六</span>
        <span>14:54:45</span>
        <span>2022.10.08</span>
      </div>
    </div>
  </div>
</template>
<script setup lang='ts'>
// defineProps(['monitorData'])

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
  height: 223px;

  flex-direction: column;
  flex-wrap: wrap;

  .top_left {
    width: 50%;
    flex: 1;
    height: 223px;

    .top_tittle {
      height: 83px;
      padding: 10px 0 0 40px;

      img {
        width: auto;
        height: auto;
        vertical-align: middle;
      }

      img:nth-child(2) {
        padding-left: 28px;
      }
    }

    .top_num {
      height: 140px;
      // background-color: rgb(210, 149, 159, 0.2);
      display: flex;

      >div {
        width: 250px;
        height: 140px;
        position: relative;

        img {
          position: absolute;
          max-width: 100%;
          height: 100px;
          top: 20%;
          left: 5%;
        }

        .word {
          position: absolute;
          top: 20%;
          right: 10%;

          :first-child {
            margin: 0px;
            font-size: 50px;
            color: rgba(67, 207, 124, 1);
          }

          :last-child {
            margin: 0px;
            font-size: 16px;
            color: rgba(255, 255, 255, 0.9);
          }
        }
      }
    }
  }

  .top_time {
    width: 50%;
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
}
</style>
  