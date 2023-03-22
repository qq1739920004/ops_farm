<template>
  <div class="historyDriveContainer">
    <page-head title="historyDrive" :show-back="showBack" @back="goBack" />
    <div class="dateContainer">
      <el-date-picker
        v-model="filterDate"
        type="date"
        placeholder="选择日期"
        :picker-options="dateOptions"
        :clearable="false"
        class="filterDatePicker"
        @change="filterDateChange"
      />
      <el-time-picker
        v-model="timeRange"
        is-range
        :clearable="false"
        range-separator="-"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        placeholder="选择时间范围"
        format="HH:mm"
        class="timeRangePicker"
        @change="refreshData"
      />
      <el-tooltip class="item" effect="dark" content="刷新数据" placement="top">
        <i class="el-icon-refresh" @click="refreshData"></i>
      </el-tooltip>
    </div>
    <div class="chartContainer">
      <div class="hDiffContainer">
        <p class="title">横向偏差</p>
        <div id="history_hDiffChart"></div>
      </div>
      <div class="speedContainer">
        <p class="title">车速</p>
        <div id="history_speedChart"></div>
      </div>
      <div class="azimuthContainer">
        <p class="title">车航向</p>
        <div id="history_azimuthChart"></div>
      </div>
    </div>
  </div>
</template>

<script>
// let now = +new Date(1997, 9, 3)
// let oneDay = 24 * 3600 * 1000
import { formatDate } from '@/utils/tool.js'
import { tendency_path } from '@/api/locationManage'
import echarts from 'echarts'
export default {
  props: {
    deviceSn: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showBack: true,
      hDiffData: [],
      hDiffXLabel: [],
      // hDiffResult:'优',
      hDiffRate: 0.75,
      speedData: [],
      azimuthData: [],
      dateRange: [],
      // startTime:'',
      // endTime:'',
      timeRange: [],
      dateOptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.now()
        }
      },
      filterDate: new Date(),
      formatLabel: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      history_hDiffChart: null,
      history_speedChart: null,
      history_azimuthChart: null
    }
  },
  computed: {
    hDiffRateStr() {
      return this.hDiffRate * 100 + '%'
    },
    hDiffResult() {
      if (this.hDiffRate >= 0.9) {
        return '优'
      } else if (this.hDiffRate >= 0.7) {
        return '良'
      } else {
        return '差'
      }
    },
    rankBackground() {
      if (this.hDiffRate >= 0.9) {
        return '#FFAFAB'
      } else if (this.hDiffRate >= 0.7) {
        return '#FFD591'
      } else {
        return '#F5222D'
      }
    },
    rateColor() {
      if (this.hDiffRate >= 0.9) {
        return '#0E8A00'
      } else if (this.hDiffRate >= 0.7) {
        return '#D46B08'
      } else {
        return '#F5222D'
      }
    },
    startTime() {
      return new Date(
        this.filterDate.getFullYear(),
        this.filterDate.getMonth(),
        this.filterDate.getDate(),
        this.timeRange[0].getHours(),
        this.timeRange[0].getMinutes()
      )
    },
    endTime() {
      return new Date(
        this.filterDate.getFullYear(),
        this.filterDate.getMonth(),
        this.filterDate.getDate(),
        this.timeRange[1].getHours(),
        this.timeRange[1].getMinutes()
      )
    },
    labelInterval() {
      return Math.round(this.hDiffXLabel.length / 15)
    }
  },
  mounted() {
    this.hDiffData = []
    // let now = new Date()
    let dateStart = new Date()
    dateStart.setHours(0, 0, 0)
    this.timeRange = [dateStart, new Date()]
    this.refreshData()
  },
  methods: {
    filterDateChange() {
      let todayStart = new Date().setHours(0, 0, 0, 0)
      let rangeTimeStart = new Date(
        this.filterDate.getFullYear(),
        this.filterDate.getMonth(),
        this.filterDate.getDate()
      )
      let rangeTimeEnd = new Date(
        this.filterDate.getFullYear(),
        this.filterDate.getMonth(),
        this.filterDate.getDate()
      )
      rangeTimeStart.setHours(0, 0, 0, 0)
      if (this.filterDate.getTime() < todayStart) {
        rangeTimeEnd.setHours(23, 59, 59, 999)
        this.timeRange = [rangeTimeStart, rangeTimeEnd]
      } else {
        this.timeRange = [rangeTimeStart, new Date()]
      }
      this.refreshData()
    },
    startTimeChange() {
      this.endTime = new Date(
        this.startTime.getFullYear(),
        this.startTime.getMonth(),
        this.startTime.getDate(),
        this.endTime.getHours(),
        this.endTime.getMinutes()
      )
      this.refreshData()
    },
    goBack() {
      this.$emit('back')
    },
    formatHour(time) {
      let gnsstime = new Date(time)
      let h = gnsstime.getHours()
      h = h < 10 ? '0' + h : h
      let minute = gnsstime.getMinutes()
      minute = minute < 10 ? '0' + minute : minute
      let second = gnsstime.getSeconds()
      second = second < 10 ? '0' + second : second
      return h + ':' + minute + ':' + second
    },
    refreshData() {
      tendency_path({
          sn: this.deviceSn,
          st: formatDate(this.startTime),
          et: formatDate(this.endTime)
        }).then((res) => {
          if (res.data.code == 'ok') {
            // this.$message.success('刷新成功');
            if (res.data.page.length == 0) {
              this.$message.warning('无历史驾驶数据')
            }
            let allData = res.data.page
            this.hDiffXLabel = []
            this.hDiffData = []
            this.speedData = []
            this.azimuthData = []
            this.hDiffXLabel = []
            allData.forEach((item, index) => {
              if (index == 0) {
                this.hDiffXLabel.push(this.formatHour(this.startTime))
                this.hDiffData.push(0)
                this.speedData.push(0)
                this.azimuthData.push(0)
                if (
                  this.formatHour(item.gnssTime) !=
                  this.formatHour(this.startTime)
                ) {
                  this.hDiffXLabel.push(this.formatHour(item.gnssTime))
                  // this.hDiffData.push(item.xoffset);
                  this.hDiffData.push(item.xoffset * 100)
                  this.speedData.push(item.speed)
                  this.azimuthData.push(item.heading)
                } else {
                  this.hDiffData[index] = item.xoffset * 100
                  this.speedData[index] = item.speed
                  this.azimuthData[index] = item.heading
                }
              } else if (index == allData.length - 1) {
                if (
                  this.formatHour(item.gnssTime) !=
                  this.formatHour(this.endTime)
                ) {
                  this.hDiffXLabel.push(this.formatHour(item.gnssTime))
                  // this.hDiffData.push(item.xoffset);
                  this.hDiffData.push(item.xoffset * 100)
                  this.speedData.push(item.speed)
                  this.azimuthData.push(item.heading)
                } else {
                  this.hDiffData[index] = item.xoffset * 100
                  this.speedData[index] = item.speed
                  this.azimuthData[index] = item.heading
                }
                this.hDiffXLabel.push(this.formatHour(this.endTime))
                this.hDiffData.push(0)
                this.speedData.push(0)
                this.azimuthData.push(0)
              } else {
                this.hDiffXLabel.push(this.formatHour(item.gnssTime))
                this.hDiffData.push(item.xoffset * 100)
                // this.hDiffData.push(item.xoffset);
                this.speedData.push(item.speed)
                this.azimuthData.push(item.heading)
              }
            })
            this.initHDiffChart()
            this.initSpeedChart()
            this.initAzimuthChart()
          }
        })
    },
    formatTime(date) {
      return [date.getHours(), date.getMinutes()].join(':')
    },
    initHDiffChart() {
      if (this.history_hDiffChart != null) {
        this.history_hDiffChart.dispose()
      }
      this.history_hDiffChart = echarts.init(
        document.getElementById('history_hDiffChart')
      )
      // let _this = this
      let option = {
        grid: {
          top: 30,
          // left: 30,
          // right: 20,
          bottom: 20,
          left: 40,
          right: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          },
          extraCssText: 'text-align:left'
        },
        dataZoom: [
          {
            start: 0,
            show: false
            // startValue: this.formatHour(this.startTime)
          },
          {
            type: 'inside'
          }
        ],
        xAxis: {
          type: 'category',
          splitLine: {
            show: false
          },
          axisTick: {
            inside: true
          },
          axisLine: {
            onZero: false
          },
          data: this.hDiffXLabel,
          name: '时间s',
          nameLocation: 'center',
          nameGap: 30,
          axisLabel: {
            interval: this.labelInterval
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisTick: {
            inside: true
          },
          name: '偏差(cm)',
          position: 'left',
          splitNumber: 4
          // nameLocation: 'middle',
          // nameGap:30,
          // nameRotate: 90
        },
        visualMap: {
          show: false,
          pieces: [{ gte: -3, lte: 3, color: '#25C114' }],
          outOfRange: {
            color: '#F5222D'
          }
        },
        series: [
          {
            name: '横向偏差',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: this.hDiffData,
            markLine: {
              silent: true,
              symbol: ['none', 'none'],
              data: [
                {
                  yAxis: 3
                },
                {
                  yAxis: -3
                }
              ]
            }
          }
        ]
      }
      console.log(this.hDiffData,'---363');
      this.history_hDiffChart.setOption(option)
      this.history_hDiffChart.on('dataZoom', (res) => {
        this.history_speedChart.setOption({
          dataZoom: [
            {
              start: res.batch[0].start,
              end: res.batch[0].end,
              show: false
            },
            {
              type: 'inside'
            }
          ]
        })
        this.history_azimuthChart.setOption({
          dataZoom: [
            {
              start: res.batch[0].start,
              end: res.batch[0].end,
              show: false
            },
            {
              type: 'inside'
            }
          ]
        })
      })
    },
    initSpeedChart() {
      if (this.history_speedChart != null) {
        this.history_speedChart.dispose()
      }
      this.history_speedChart = echarts.init(
        document.getElementById('history_speedChart')
      )
      let option = {
        grid: {
          top: 30,

          bottom: 20,
          left: 40,
          right: 30,
          containLabel: true
        },
        dataZoom: [
          {
            start: 0,
            show: false
          },
          {
            type: 'inside'
          }
        ],
        color: ['#666666'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          },
          formatter(params) {
            let result = ''
            let dotHtml =
              '<span style="display:flex;align-items:center"><span style="display:inline-block;line-height:8px;margin-right:5px;border-radius:8px;border:2px #fff solid;width:8px;height:8px;background-color:#666666;"></span>'
            result +=
              params[0].axisValue +
              '<br>' +
              dotHtml +
              '<span>' +
              params[0].seriesName +
              ':' +
              params[0].value +
              '</span></span>'
            return result
          },
          extraCssText: 'text-align:left'
        },
        xAxis: {
          type: 'category',
          splitLine: {
            show: false
          },
          axisTick: {
            inside: true
          },
          axisLine: {
            onZero: false
          },
          data: this.hDiffXLabel,
          name: '时间s',
          nameLocation: 'center',
          nameGap: 30,
          axisLabel: {
            interval: this.labelInterval
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisTick: {
            inside: true
          },
          name: '速度(km/h)',
          position: 'left',
          splitNumber: 3,
          minInterval: 1
          // nameLocation: 'middle',
          // nameGap:30,
          // nameRotate: 90
        },
        series: [
          {
            name: '速度',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: this.speedData
          }
        ]
      }
      this.history_speedChart.setOption(option)
      this.history_speedChart.on('dataZoom', (res) => {
        this.history_hDiffChart.setOption({
          dataZoom: [
            {
              start: res.batch[0].start,
              end: res.batch[0].end,
              show: false
            },
            {
              type: 'inside'
            }
          ]
        })
        this.history_azimuthChart.setOption({
          dataZoom: [
            {
              start: res.batch[0].start,
              end: res.batch[0].end,
              show: false
            },
            {
              type: 'inside'
            }
          ]
        })
      })
    },
    initAzimuthChart() {
      if (this.history_azimuthChart != null) {
        this.history_azimuthChart.dispose()
      }
      this.history_azimuthChart = echarts.init(
        document.getElementById('history_azimuthChart')
      )
      let option = {
        grid: {
          top: 30,
          left: 40,
          right: 30,
          bottom: 20,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          },
          extraCssText: 'text-align:left'
        },
        dataZoom: [
          {
            start: 0,
            show: false
          },
          {
            type: 'inside'
          }
        ],
        color: ['#409EFF'],
        xAxis: {
          type: 'category',
          splitLine: {
            show: false
          },
          axisTick: {
            inside: true
          },
          axisLine: {
            onZero: false
          },
          data: this.hDiffXLabel,
          name: '时间s',
          nameLocation: 'center',
          nameGap: 30,
          axisLabel: {
            interval: this.labelInterval
          }
        },
        yAxis: {
          type: 'value',
          // boundaryGap: [0, '100%'],
          splitLine: {
            show: false
          },
          axisTick: {
            inside: true
          },

          name: '航向角(°)',
          position: 'left',
          splitNumber: 4
          // nameLocation: 'middle',
          // nameGap:30,
          // nameRotate: 90
        },
        series: [
          {
            name: '航向角',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: this.azimuthData
            // lineStyle:{
            //     color:"#409EFF"
            // }
          }
        ]
      }
      this.history_azimuthChart.setOption(option)
      this.history_azimuthChart.on('dataZoom', (res) => {
        this.history_hDiffChart.setOption({
          dataZoom: [
            {
              start: res.batch[0].start,
              end: res.batch[0].end,
              show: false
            },
            {
              type: 'inside'
            }
          ]
        })
        this.history_speedChart.setOption({
          dataZoom: [
            {
              start: res.batch[0].start,
              end: res.batch[0].end,
              show: false
            },
            {
              type: 'inside'
            }
          ]
        })
      })
    },
    randomData(min, max) {
      var now = new Date()
      let value = this.RandomNumBoth(min, max)
      return {
        // name: now.toString(),
        value: [[now.getHours(), now.getMinutes()].join(':'), value]
      }
    },
    RandomNumBoth(Min, Max) {
      var Range = Max - Min
      var Rand = Math.random()
      var num = Min + Math.round(Rand * Range) // 四舍五入
      return num
    }
  }
}
</script>
<style scoped lang="scss">
.historyDriveContainer {
  height: 100%;
  overflow: hidden;
  > .dateContainer {
    text-align: left;
    margin-left: 20px;
    margin-top: 16px;
    // .el-range-editor.el-input__inner{
    //     height:32px;
    // }
    .filterDatePicker {
      width: 160px;
      margin-right: 10px;
    }
    .timeRangePicker {
      margin-right: 10px;
      width: 220px;
    }
  }
  > .chartContainer {
    height: calc(100% - 100px);
    height: -webkit-calc(100% - 100px);
    height: -moz-calc(100% - 100px);

    @media (max-width: 1919px) {
      padding: 10px 5%;
    }
    @media (min-width: 1920px) {
      padding: 20px 10%;
    }
    box-sizing: border-box;
    overflow: auto;
    > div {
      @media (max-width: 1919px) {
        height: 200px;
      }
      @media (min-width: 1920px) {
        height: 33%;
        padding-bottom: 30px;
        box-sizing: border-box;
      }
      // &:last-child{
      //     margin-bottom: 20px;
      // }
      > p {
        margin: 0;
      }
      > div {
        height: calc(100% - 30px);
        height: -webkit-calc(100% - 30px);
        height: -moz-calc(100% - 30px);

        width: 100%;
      }
    }
  }
}
</style>
