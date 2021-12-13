<template>
  <div class="page7_child2_container">
    <div>
      <gis-map
        :locating-device-sn="locatingDeviceSn"
        @openRealTimeDrive="openRealTimeDrive"
        @openHistoryDrive="openHistoryDrive"
      />
      <!-- 刘海屏 -->
      <!-- <div class="bang_container" :class="{'bang_container_fold': fold}" v-if="false">
                    <div class="indicator_box">
                        <div class="indicator_box_left">
                            <div class="indicator_item_box">
                                <div class="title">农机设备在线数</div>
                                <div class="circle">
                                    <circle-progress v-bind="circleProgressConfig"></circle-progress>
                                </div>
                                <div class="count">
                                    <counter :number="totalDevice" :prefix="prefix"></counter>
                                </div>
                                <div class="online" @click="redirectToCarList" style="cursor:pointer;">
                                    <counter :number="onlineDevice"></counter>
                                </div>
                            </div>
                            <div class="indicator_item_box">
                                <div class="title">今日作业面积(亩)</div>
                                <div class="circle">
                                    <circle-progress v-bind="circleProgressConfig1"></circle-progress>
                                </div>
                                <div class="count" style="white-space: nowrap">
                                    <counter :number="parseInt(totalArea)" :prefix="prefix2"></counter>
                                </div>
                                <div class="online">
                                    <counter :number="parseInt(todayArea)"></counter>
                                </div>
                            </div>
                        </div>
                        <div class="split_line"></div>
                        <div class="indicator_box_right">
                            <table>
                                <tr>
                                    <th style="color:#FFA90A;">省份排名</th>
                                    <th style="color:#FFA90A;">在线数</th>
                                </tr>
                                <tr v-for="(item, index ) in provinceRanking " :key="index">
                                    <td style="white-space:nowrap;text-overflow: ellipsis;">
                                        <span class="province_rank">{{ item.rank }}</span>
                                        <span style="padding-left:2px;" :title="item.name">  {{ item.name ? item.name.slice(0, 3) : ''}}</span>
                                    </td>
                                    <td style="font-size:18px;font-weight:bold;">
                                        <counter :number="item.online"></counter>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div class="split_line"></div>
                        <div class="indicator_box_button">
                            <el-row>
                                <el-row style="font-size:14px;margin-top:5px;color:#f75f25;">网络情况</el-row>
                                <el-row class="net_singal">
                                    <img width="14" height="14" src="./map/img/net/strong.png" alt="">&nbsp;
                                    <span class="count1">强 </span>
                                    <span class="net_singal_count">
                                        <counter :number="netSingalCount[0]"></counter>
                                    </span>
                                </el-row>
                                <el-row class="net_singal">
                                    <img width="14" height="14" src="./map/img/net/middle.png" alt="">&nbsp;
                                    <span class="count2">中 </span>
                                    <span class="net_singal_count">
                                        <counter :number="netSingalCount[1]"></counter>
                                    </span>
                                </el-row>
                                <el-row class="net_singal">
                                    <img width="14" height="14" src="./map/img/net/weak.png" alt=""> &nbsp;
                                    <span class="count3">弱 </span>
                                    <span class="net_singal_count">
                                        <counter :number="netSingalCount[2]"></counter>
                                    </span>
                                </el-row>
                            </el-row>
                        </div>
                    </div>
                    <div class="button_box">
                        <el-row>
                            <el-col :span="12" :offset="0">
                            </el-col>
                            <el-col :span="6">
                            </el-col>
                        </el-row>
                    </div>
                    <div class="fold_control" @click="fold = !fold" :class="{ 'fold': fold }"></div>
                </div> -->
      <!-- 通知栏 -->
      <div v-show="farmSuperAdministrator" class="status_notification">
        <div
          class="status_notification_title"
          @click="statusFold = !statusFold"
        >
          <span>状态通知</span>
          <img
            width="20"
            height="20"
            :class="{ img_status_fold: statusFold }"
            src="./map/img/icon.png"
            alt=""
          />
        </div>
        <div
          class="status_notification_body"
          :class="{ status_notification_fold: statusFold }"
        >
          <el-timeline v-infinite-scroll="loadMoreData">
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :icon="activity.icon"
              :color="activity.color"
              :timestamp="activity.time"
            >
              <div class="status_notification_body_item">
                <div v-if="activity.color === 'red'" class="warn_content">
                  驾驶效果差 &nbsp;
                </div>
                <div class="status_notification_body_item_line1">
                  <div
                    class="car_name"
                    :class="
                      activity.color === 'gray'
                        ? 'car_name_offline'
                        : activity.color === 'red'
                          ? 'car_name_waring'
                          : 'car_name_online'
                    "
                  >
                    {{ activity.carName }}
                  </div>
                  <div
                    style="
                      padding-right: 3px;
                      cursor: pointer;
                      text-decoration: underline;
                    "
                    @click="handleClick(activity.deviceSn)"
                  >
                    {{ activity.deviceSn }}
                  </div>
                </div>
                <div
                  class="status_notification_body_item_line2"
                  :title="activity.position"
                >
                  {{ activity.position }}
                </div>
              </div>
            </el-timeline-item>
            <span
              v-if="!endData"
              class="view_more"
              @click="loadMoreData"
            >查看更多</span>
            <span
              v-else
              class="view_more"
              @click="loadMoreData"
            >没有更多了</span>
          </el-timeline>
        </div>
      </div>
      <!-- 新刘海 -->
      <div v-show="farmSuperAdministrator" class="new_bang">
        <!-- 在线设备 -->
        <div class="new_item">
          <el-row>
            <el-col class="title">农机设备在线数</el-col>
          </el-row>
          <div class="indicator_item_box">
            <div class="circle">
              <circle-progress v-bind="circleProgressConfig" />
            </div>
            <div class="count">
              <counter :number="totalDevice" :prefix="prefix" />
            </div>
            <div
              class="online"
              style="cursor: pointer"
              @click="redirectToCarList"
            >
              <counter :number="onlineDevice" />
            </div>
          </div>
        </div>
        <div class="line_split"></div>
        <!-- 省份排名 -->
        <div class="new_item">
          <el-row>
            <el-col :span="12" class="title">省份排名</el-col>
            <el-col :span="12" class="title">在线数</el-col>
          </el-row>
          <el-row v-for="(item, index) in provinceRanking" :key="index">
            <el-col :span="6">
              <img :src="rankingUrl[index]" width="18" height="22" alt="" />
            </el-col>
            <el-col :span="8" class="privince_name">{{
              item.name ? item.name.slice(0, 3) : ''
            }}</el-col>
            <el-col :span="8" :offset="2">
              <counter :number="item.online" />
            </el-col>
          </el-row>
        </div>
        <div class="line_split"></div>
        <!-- 网络 -->
        <div class="new_item">
          <el-row>
            <el-col :span="12" class="title">网络状况</el-col>
            <el-col :span="12" class="title">农机数</el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <img
                width="14"
                height="14"
                src="./map/img/net/strong.png"
                alt=""
              />
              <span style="color: #03c2a1"> 强</span>
            </el-col>
            <el-col :span="12">
              <counter :number="netSingalCount[0]" />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <img
                width="14"
                height="14"
                src="./map/img/net/middle.png"
                alt=""
              />
              <span style="color: #ffb92a"> 中</span>
            </el-col>
            <el-col :span="12">
              <counter :number="netSingalCount[1]" />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <img width="14" height="14" src="./map/img/net/weak.png" alt="" />
              <span style="color: #d75a05"> 弱</span>
            </el-col>
            <el-col :span="12">
              <counter :number="netSingalCount[2]" />
            </el-col>
          </el-row>
        </div>
        <div class="line_split"></div>
        <!-- 作业信息 -->
        <div class="new_item">
          <el-row>
            <el-col class="title_">今日作业面积(亩)</el-col>
          </el-row>
          <el-row style="">
            <counter :number="parseInt(todayArea)" />
          </el-row>
          <el-row class="title_" style="margin-top: 10px">
            累计作业面积(万亩)
          </el-row>
          <el-row style="margin-top: 5px">
            <counter
              :number="parseFloat((parseInt(totalArea) / 10000).toFixed(2))"
            />
          </el-row>
        </div>
      </div>
    </div>
    <el-dialog
      v-dialogDrag
      :title="dialogTitle"
      center
      :visible.sync="realtimeDriveVisible"
      class="driveDialog"
      destroy-on-close
    >
      <realtime-drive
        v-if="realtimeDriveVisible"
        :device-sn="currentDeviceSn"
        @dataChange="dataChange"
      />
    </el-dialog>

    <div v-if="historyDriveVisible" class="history_container">
      <history-drive :device-sn="currentDeviceSn" @back="goBack" />
    </div>
  </div>
</template>
<script>
import gisMap from './map/map'
import circleProgress from './components/circleProgress'
import realtimeDrive from './components/realtimeDrive.vue'
import historyDrive from './components/historyDrive.vue'
import bus from '@/utils/socket/bus'
import {
  farmMachineDataStatistics_path,
  carLog_path
} from '@/api/locationManage'
export default {
  components: {
    gisMap,
    circleProgress,
    realtimeDrive,
    historyDrive
  },
  data() {
    return {
      realtimeDriveVisible: false,
      historyDriveVisible: false,
      fold: false,
      statusFold: document.body.clientWidth <= 1000 || false,
      totalDevice: 0,
      onlineDevice: 0,
      todayArea: 0,
      totalArea: 0,
      pageSize: 5,
      endData: false,
      locatingDeviceSn: '',
      circleProgressConfig: {
        canvasHeight: 100,
        canvasWidth: 120,
        coordinates: [60, 60],
        radius: 40,
        startAngle: -Math.PI, // 3点钟反向为0弧度；或者 2PI 弧度；结束角度必须大于起始角度！
        endAngle: 0, // end 结束角度 必须大于start起始角度
        data: 0, // 数据配置
        speed: 100, // 此为requestAnimateFrame接口,速度为浏览器刷新频率20ms绘制的整体进度条除以speed的粒度；可调试选择合适速度
        anticlockwise: false, // false 为顺时针；
        // 样式配置
        gradientDirection: 'to left', // 支持css语法规范 默认to left
        gradientColor: {
          // 支持css颜色名，梯度颜色配置 0~1； 只设置0 表示只使用一个颜色；放射性渐变暂不支持；
          0: 'rgba(44,134,255,0.9)',
          1: 'rgba(4,134,255,0.5)'
        },
        lineStyle: {
          lineWidth: 10, // 线条宽度
          lineCap: 'butt', // butt:默认,向线条的每个末端添加平直的边缘; round :向线条的每个末端添加圆形线帽; square :向线条的每个末端添加正方形线帽。
          lineDash: [20, 0] // 第一项表示线条分段长度，第二项表示分段间隔
        },
        circleBackground: 'rgba(50,22,235,0.1)', // 环形进度条的背景配置；其他样式默认和动画进度条相同；
        enableCircleBackground: true // 默认开启环形背景
      },
      circleProgressConfig1: {
        canvasHeight: 100,
        canvasWidth: 120,
        coordinates: [60, 60],
        radius: 40,
        startAngle: -Math.PI,
        endAngle: 0,
        data: 0,
        speed: 100,
        anticlockwise: false,
        gradientDirection: 'to left',
        gradientColor: {
          0: 'rgba(36,189,169,0.9)',
          1: 'rgba(36,189,169,0.5)'
        },
        lineStyle: {
          lineWidth: 10,
          lineCap: 'butt',
          lineDash: [20, 0]
        },
        circleBackground: 'rgba(50,22,235,0.1)',
        enableCircleBackground: true
      },
      provinceRanking: [
        {
          name: '未知',
          rank: 1,
          online: 0,
          count: 0,
          workArea: 0
        },
        {
          name: '未知',
          rank: 2,
          online: 0,
          count: 0,
          workArea: 0
        },
        {
          name: '未知',
          rank: 3,
          online: 0,
          count: 0,
          workArea: 0
        }
      ],
      rankingUrl: [
        './map/img/yellow2.png',
        './map/img/gray2.png',
        './map/img/red2.png'
      ],
      activities: [],
      currentDeviceSn: '',
      styleSheet1: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'normal',
        letterSpacing: 'normal'
      },
      prefix: {
        content: '总数：'
      },
      prefix2: {
        content: '累计：'
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.currentDeviceSn + '实时驾驶趋势图'
    },
    netSingalCount() {
      return this.$store.state.index.netSingalCount
    },
    farmSuperAdministrator() {
      return this.$store.state.index.farmSuperAdministrator
    }
  },
  mounted() {
    this.loadIndicatorData()
    this.loadStatusData()
    this.listenMessage()
    this.moveBang()
  },

  methods: {
    dataChange(data) {
      this.realtimeDriveVisible = data
    },
    goBack() {
      this.historyDriveVisible = false
    },

    loadIndicatorData() {
      farmMachineDataStatistics_path().then((res) => {
        try {
          this.todayArea = parseInt(res.data.workArea.todayArea)
          this.totalArea = parseInt(res.data.workArea.totalArea)
          this.totalDevice = res.data.device.totalDevice
          this.onlineDevice = res.data.device.onlineDevice
          this.provinceRanking = res.data.provinceRank.slice(0, 3)
          // 处理环形进度条，进度条按照百分比显示，需要转化;
          let precentDevice = Math.ceil(
            (this.onlineDevice / this.totalDevice) * 100
          )
          let precentArea = Math.ceil((this.todayArea / this.totalArea) * 100)
          this.$nextTick(() => {
            this.circleProgressConfig.data = precentDevice
            this.circleProgressConfig1.data = precentArea
          })
        } catch (err) {
          console.log(err)
        }
      })
    },
    loadStatusData() {
      carLog_path({
        currentPage: 1,
        pageSize: this.pageSize
      }).then((res) => {
        try {
          let temp = res.data.page.list
          let total = res.data.page.total
          temp.forEach((element) => {
            if (element.offlineTime !== element.onlineTime) {
              element.color = 'gray'
              element.time = this.dateTimeTrans(element.offlineTime)
            } else {
              element.color = '#25C114'
              element.time = this.dateTimeTrans(element.onlineTime)
            }
            if (element.judgeLevel) {
              element.color = 'red'
            }
          })
          this.activities = temp
          if (this.pageSize > total) {
            this.endData = true
          }
        } catch (err) {
          console.log(err)
        }
      })
    },
    loadMoreData() {
      this.pageSize += 5
      this.loadStatusData()
    },
    openRealTimeDrive(deviceSn) {
      this.realtimeDriveVisible = true
      this.currentDeviceSn = deviceSn
    },
    openHistoryDrive(deviceSn) {
      this.historyDriveVisible = true
      this.currentDeviceSn = deviceSn
    },
    openHistoryTrace(data) {
      this.$router.push({
        name: 'historyRoute',
        params: {
          deviceSn: data.deviceSn,
          provinceCode: data.addrcode.substr(0, 2)
        }
      })
    },

    redirectToCarList() {
      this.$router.push({
        name: 'carList'
      })
    },

    // 处理websocket数据
    listenMessage() {
      bus.$on('message', (data) => {
        this.handleMessageChange(data)
      })
    },

    handleMessageChange(data) {
      try {
        if (data.module === 'farm' && data.type === 'workAreaCount') {
          this.updateWorkArea(data.data.workArea)
        }
        if (data.module === 'farm' && data.type === 'farmCount') {
          this.updateRankAndCount(data.data)
        }
        if (data.module === 'farm' && data.type === 'notification') {
          this.updateNoti(data.data.list)
        }
      } catch (error) {
        console.log(error)
      }
    },

    // 更新作业统计
    updateWorkArea(data) {
      this.totalArea = data.totalArea
      this.todayArea = data.todayArea
      let precentArea = Math.ceil((this.todayArea / this.totalArea) * 100)
      this.circleProgressConfig1.data = precentArea
    },

    // 更新排名和在线数
    updateRankAndCount(data) {
      this.provinceRanking = data.provinceRank.slice(0, 3)
      this.totalDevice = data.device.totalDevice
      this.onlineDevice = data.device.onlineDevice
      let precentDevice = Math.ceil(
        (this.onlineDevice / this.totalDevice) * 100
      )
      this.circleProgressConfig.data = precentDevice
    },

    // 更新通知数据
    updateNoti(data) {
      let length = data.length
      data.forEach((element) => {
        if (element.offlineTime !== element.onlineTime) {
          element.color = 'gray'
          element.time = this.dateTimeTrans(element.offlineTime)
        } else {
          element.color = '#25C114'
          element.time = this.dateTimeTrans(element.onlineTime)
        }
        if (element.judgeLevel) {
          element.color = 'red'
        }
      })
      length >= this.activities.length
        ? (this.activities = data)
        : (this.activities.splice(0, length),
          this.activities.unshift.apply(this.activities, data))
    },

    handleClick(sn) {
      this.locatingDeviceSn = sn
    },

    // 移动刘海屏
    moveBang() {
      let bang = document.querySelector('.new_bang')
      // closure
      let preX
      let preY
      let move = false

      bang.onmousedown = function (e) {
        bang.style.left = bang.offsetLeft + 'px'
        bang.style.top = bang.offsetTop + 'px'
        preX = e.clientX
        preY = e.clientY
        bang.style.cursor = 'move'
        move = true
      }

      bang.onmouseup = function (e) {
        bang.style.cursor = 'auto'
        move = false
        if (bang.offsetTop < 0) bang.style.top = 0
        if (bang.offsetLeft < 0) bang.style.left = 0
        // bang.style.left = 'calc((100% - 620px) / 2)';  // 恢复自适应
      }

      bang.onmousemove = function (params) {
        if (!move) return
        let deltaX = params.clientX - preX
        let deltaY = params.clientY - preY
        bang.style.left = parseInt(bang.style.left) + deltaX + 'px'
        bang.style.top = parseInt(bang.style.top) + deltaY + 'px'
        preX = params.clientX
        preY = params.clientY
      }
    }
  }
}
</script>
<style scoped lang="scss">
.page7_child2_container {
  position: relative;
  height: 100%;
  > div:first-child {
    width: 100%;
    height: 100%;
    .bang_container {
      transition: all 0.5s;
      position: absolute;
      top: -3px;
      left: 0px;
      right: 0px;
      margin: auto;
      width: 60%;
      min-width: 900px;
      height: 160px;
      z-index: 999;
      background-image: url('./map/img/back1.png');
      background-size: 100% 100%;
      .indicator_box {
        width: 62%;
        height: 65%;
        max-width: 700px !important;
        margin: auto;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
        .indicator_box_left {
          display: flex;
          justify-content: space-around;
          width: 37%;
          .indicator_item_box {
            width: 120px;
            height: 130px;
            position: relative;
            .title {
              color: #2e97ff;
              font-size: 14px;
              text-align: center;
              height: 30px;
              line-height: 30px;
              white-space: nowrap;
            }
            .circle {
              height: 100px;
            }
            .count {
              position: absolute;
              bottom: 5px;
              height: 30px;
              line-height: 30px;
              text-align: center;
              color: #fff;
              width: 100%;
            }
            .online {
              padding-top: 9px;
              box-sizing: border-box !important;
              position: absolute;
              font-size: 16px;
              font-weight: bold;
              width: 60px;
              height: 30px;
              line-height: 30px;
              border-top-left-radius: 30px;
              border-top-right-radius: 30px;
              left: 0;
              right: 0;
              margin: auto;
              bottom: 40px;
              color: #fff;
              background: rgba($color: #0486ff, $alpha: 0.3);
            }
          }
          .indicator_item_box:nth-child(2) {
            .title {
              color: #24bda9;
            }
            .online {
              background: rgba($color: #24bda9, $alpha: 0.3);
            }
          }
        }
        .indicator_box_right {
          width: 40%;
          height: 100%;
          padding-top: 3px;
          position: relative;
          table {
            width: 100%;
            text-align: center;
            font-size: 14px;
            tr {
              color: #fff;
              th {
                font-weight: normal;
                white-space: nowrap;
                text-align: left;
              }
              td {
                padding: 3px;
                text-align: left;
                span.province_rank {
                  display: inline-block;
                  $width: 25px;
                  width: $width;
                  height: $width;
                  line-height: $width;
                  background-repeat: no-repeat;
                  background-size: 100% 100%;
                  white-space: nowrap;
                  text-align: center;
                }
              }
            }
            tr:nth-child(2) {
              span.province_rank {
                background: url('./map/img/yellow1.png');
                background-repeat: no-repeat;
                background-position: 3px -2px;
                // background-size: 100% 100%;
              }
            }
            tr:nth-child(3) {
              span.province_rank {
                background: url('./map/img/gray1.png');
                background-repeat: no-repeat;
                // background-size: 100% 100%;
                background-position: 3px -2px;
                color: rgb(75, 73, 73);
              }
            }
            tr:nth-child(4) {
              span.province_rank {
                background: url('./map/img/red1.png');
                background-repeat: no-repeat;
                // background-size: 100% 100%;
                background-position: 3px -2px;
              }
            }
          }
        }
        .split_line {
          border-left: 1px solid;
          border-color: rgba($color: #bbbbbb, $alpha: 0.3);
          transform: scale(0.9);
        }
        .indicator_box_button {
          width: 13%;
          position: relative;
          // left: 10px;
          .el-button {
            background: rgba($color: #0a0a0a, $alpha: 0.5);
            color: #fff;
            font-size: 14px;
            border: none;
          }
          .el-button::before {
            color: #1989fa;
          }
          .el-button:hover {
            border: 1px solid #dcdfe6;
          }
          .net_singal {
            text-align: left;
            padding: 7.5px 0px 5px 9px;
            color: #fff;
            font-size: 14px;
            display: flex;
            align-items: center;
            .net_singal_count {
              font-size: 18px;
              font-weight: 700;
              padding-left: 10px;
            }
            .count1 {
              padding-left: 3px;
              color: #24a190;
            }
            .count2 {
              padding-left: 3px;
              color: #ffb92a;
            }
            .count3 {
              padding-left: 3px;
              color: #bd4f23;
            }
          }
        }
      }
      .button_box {
        width: 50%;
        margin: auto;
        padding-top: 3px;
        .el-button {
          background: rgba($color: #0a0a0a, $alpha: 0.5);
          color: #fff;
          font-size: 14px;
          border: none;
        }
        .el-button::before {
          color: #1989fa;
        }
        .el-button:hover {
          border: 1px solid #dcdfe6;
        }
      }
      .fold_control {
        width: 88px;
        height: 18px;
        background-image: url('./map/img/icon.png');
        background-repeat: no-repeat;
        background-position: 50%;
        position: absolute;
        margin: auto;
        left: 0px;
        right: 0px;
        bottom: 2px;
        transition: all 0.5s;
        cursor: pointer;
      }
      .fold {
        transform: rotate(180deg);
      }
    }
    .bang_container_fold {
      transform: translateY(-140px);
    }
    .status_notification {
      width: 360px;
      position: absolute;
      bottom: 10px;
      right: 10px;
      background: rgba($color: #000000, $alpha: 0.7);
      z-index: 999;
      border-radius: 4px;
      padding: 0px 10px 10px 0px;
      overflow-y: auto;
      // box-shadow: 0 0 19px #4CB04F inset;
      box-shadow: 0px 0px 10px rgba(134, 240, 143, 0.8) inset;
      .status_notification_title {
        color: #fff;
        padding: 12px;

        text-align: left;
        cursor: pointer;
        position: relative;
        img {
          position: absolute;
          left: 0px;
          top: 0px;
          bottom: 0px;
          right: 0px;
          margin: auto;
          cursor: pointer;
          transform: rotate(180deg);
          transition: all 0.5s;
        }

        .img_status_fold {
          transform: rotate(0deg);
        }
      }
      .status_notification_body {
        // height: 366px;
        height: 35vh;
        overflow: auto;
        overflow-x: hidden;
        transition: all 0.5s;
        .status_notification_body_item {
          position: relative;
          .warn_content {
            font-size: 12px;
            background: red;
            border-radius: 3px;
            padding: 1px 3px;
            width: fit-content;
            color: #fff;
          }
          .status_notification_body_item_line1 {
            color: #fff;
            display: flex;
            justify-content: space-between;
            font-weight: 100;
            // position: relative;
            align-items: center;
            .car_name_online:before {
              content: '上线';
              display: block;
              position: absolute;
              left: -30px;
              top: 1px;
              font-size: 12px;
              color: #25c114;
            }
            .car_name_offline:before {
              content: '下线';
              display: block;
              position: absolute;
              left: -30px;
              top: 1px;
              font-size: 12px;
              color: gray;
            }
            .car_name_waring:before {
              content: '警告';
              display: block;
              position: absolute;
              left: -30px;
              top: 1px;
              font-size: 12px;
              color: red;
            }
          }
          .status_notification_body_item_line2 {
            font-size: 12px;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-weight: 100;
            color: rgba($color: #fff, $alpha: 0.6);
            text-align: left;
          }
        }
        .view_more {
          cursor: pointer;
          color: #24bda9;
        }
      }
      .status_notification_fold {
        height: 0px;
        overflow: hidden;
      }

      ::v-deep .el-timeline {
        padding-inline-start: 20px;
        text-align:center;
        padding-top:5px;
      }
     ::v-deep .el-timeline-item__wrapper {
        padding-left: 48px;
        text-align:left;
      }
      .el-timeline-item__timestamp {
        text-align: left;
        color: rgba($color: #fff, $alpha: 0.6);
        font-size: 14px;
      }
    }
  }
  .history_container {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 1009;
    background-color: #fff;
  }

  // 新刘海
  .new_bang {
    position: absolute;
    top: 10px;
    // left: 0px;
    // right: 0px;
    // margin: auto;
    left: calc((100% - 620px) / 2);
    width: 620px;
    height: 130px;
    background: url('./map/img/bg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    z-index: 999;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #fff;
    font-family: TiHei;
    font-size: 16px;
    .new_item {
      box-sizing: border-box;
      text-align: center;
      width: 150px;
      height: 130px;
      padding-top: 13px;

      .el-col {
        height: 27px;
      }
      .title {
        color: #2e97ff;
      }
      .title_ {
        color: #24bda9;
      }
      .privince_name {
        text-align-last: justify;
        overflow: hidden;
      }
      .indicator_item_box {
        width: 100%;
        position: relative;
        bottom: 10px;
        .circle {
          height: 100px;
        }

        .count {
          position: absolute;
          bottom: 5px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          color: #fff;
          width: 100%;
        }
        .online {
          padding-top: 9px;
          box-sizing: border-box !important;
          position: absolute;
          font-size: 16px;
          font-weight: bold;
          width: 60px;
          height: 30px;
          line-height: 30px;
          border-top-left-radius: 30px;
          border-top-right-radius: 30px;
          left: 0;
          right: 0;
          margin: auto;
          bottom: 40px;
          color: #fff;
          background: rgba($color: #0486ff, $alpha: 0.3);
        }
      }
    }
    .line_split {
      height: 60%;
      border-left: 1px solid rgba($color: #ffffff, $alpha: 0.2);
      position: relative;
      top: 20%;
    }
  }

  .driveDialog {
    .el-dialog {
      margin: unset;
      margin-top: unset !important;
      left: 25%;
      top: 5%;
      @media (min-width: 1920px) {
        width: 40%;
      }
      @media (max-width: 1919px) {
        height: 90%;
        width: 45%;
      }
    }
    .el-dialog__body {
      padding-top: 0;
      @media (max-width: 1919px) {
        height: calc(100% - 60px);
      }
    }
  }
}
</style>

