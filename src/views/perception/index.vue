<template>
    <div class='app_container'>
        <!-- 面向经销展示内容区 -->
        <div class="screen" ref="screen">
            <Top />


            <div class="bottom">
                <div class="left">
                    <div class="left1">
                        <div class="title">
                            <el-icon>
                                <CaretLeft />
                            </el-icon>
                            各车辆作业面积
                            <el-icon>
                                <CaretRight />
                            </el-icon>
                        </div>
                        <div class="contain">

                        </div>

                    </div>
                    <div class="left2">当年统计数</div>
                </div>
                <div class="middle">middle</div>
                <div class="right">
                    <div class="right1">各类型农机在线数</div>
                    <div class="right2">状态通知栏</div>
                </div>
            </div>


        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, } from 'vue'
import Top from '../perception/component/top.vue'
let screen = ref()

</script>

<style lang="scss" scoped>  .app_container {
      background: url(../perception/image/map.png), url(../perception/image/border.png) no-repeat;
      background-color: rgba(2, 28, 14, 1);
      background-size: cover, 1680px 870px;
      background-position: 20px, 10px;
      color: white;

      .screen {
          margin: 15px;
          min-width: 1100px;
          background: no-repeat;
          background-size: contain;
          height: 860px;



          .bottom {

              display: flex;
              height: 84%;


              .right {
                  flex: 1;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-around;

                  .right1 {
                      height: 35%;
                      border: 1px solid rgba(67, 207, 124, 1);
                  }

                  .right2 {
                      height: 55%;
                      border: 1px solid rgba(67, 207, 124, 1);
                  }
              }

              .middle {
                  flex: 2;
                  flex-direction: column;
              }

              .left {
                  flex: 1;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-around;

                  .left1 {
                      //   border: 1px solid rgba(67, 207, 124, 1);
                      height: 50%;

                      .title {

                          height: 40px;
                          line-height: 40px;
                          
                          background: linear-gradient(to right, rgba(31, 61, 43, 1), rgba(48, 117, 76, 0));
                          border: 2px solid;
                          border-image: linear-gradient(to right, rgb(63, 255, 140), rgba(48, 117, 76, 0)) 1;
                          border-left-style:none;
                          border-right-style:none;
                        }
                  }

                  .left2 {
                      border: 1px solid rgba(67, 207, 124, 1);
                      height: 40%;
                  }
              }
          }
      }

  }</style>