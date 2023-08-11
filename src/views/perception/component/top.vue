<template>
     <div class="top">
                <div class="top_left">
                    <div class="top_title">
                        <img src="../../perception/image/top_title_logo.png" alt="" class="top_title_logo">
                        <img src="../../perception/image/top_title_word.png" alt="" class="top_title_word">
                    </div>
                    <div class="top_number">
                        <div class="top_number_item">
                            <img src="../../perception/image/top_number1.png" alt="">
                            <span class="num">151</span>
                            <span class="itle">当前在线数</span>
                        </div>

                        <div class="top_number_item">
                            <img src="../../perception/image/top_number2.png" alt="">
                            <span class="num">151</span>
                            <span class="itle">当年新增农机</span>
                        </div>

                        <div class="top_number_item">
                            <img src="../../perception/image/top_number3.png" alt="">
                            <span class="num">151</span>
                            <span class="itle">农机总数</span>
                        </div>

                        <div class="top_number_item">
                            <img src="../../perception/image/top_number4.png" alt="">
                            <span class="num">151</span>
                            <span class="itle">已售农机数</span>
                        </div>


                    </div>
                </div>
                <div class="top_right">
                    <div class="top_temp">
                        <span>20度</span>
                        <span>多云</span>
                        
                        <img src="../../perception/image/cloud.png" alt="">
                    </div>
                    <div class="top_time">
                        <span>周六</span>
                        <span class="t">14:54:45</span>
                        <span>2022.11.11</span>
                    </div>
                </div>

            </div>
</template>



<style lang="scss" scoped>
          .top {
              height: 16%;
              position: relative;

              .top_left {
                  .top_title {
                      padding-left: 48px;

                      img {
                          display: inline-block;
                          vertical-align: middle;
                      }
                  }

                  .top_number {
                      position: absolute;
                      top: 80px;
                      left: 23px;

                      .top_number_item {
                          display: inline;
                          position: relative;
                          width: 235px;
                          height: 60px;
                          margin-left: 5px;

                          img {
                              width: 53px;
                              height: 53px;
                          }

                          .num {
                              position: absolute;
                              top: -52px;
                              color: rgba(67, 207, 124, 1);
                              font-size: 40px;
                          }

                          .title {
                              position: absolute;
                              left: 120px;
                              color: rgba(255, 255, 255, 0.9);
                              font-size: 16px;
                          }

                      }
                  }
              }


              .top_right {
                  position: absolute;
                  top: 20px;
                  right: 20px;
                div{
                    text-align: right;
                }
                  span{
                    
                    margin-right: 20px;
                  }
                  .t{
                   
                    font-size: 20px;
                  }
              }

          }

</style>