<template>
  <div class="driveContainer">
    <p>
      <el-icon class="el-icon-warning-outline" />
      <span>仅显示最新3分钟数据</span>
    </p>
    <div class="charts_container">
      <p style="text-align:center;">橫向偏差</p>
      <div id="xoffset"></div>
      <p style="text-align:center;">车速</p>
      <div id="speed"></div>
      <p style="text-align:center;">车航向</p>
      <div id="direction"></div>
      <p style="text-align:center;">差分龄期</p>
      <div id="difference"></div>
      <div class="judgeLevel">
        <span :class="['level' + judgeLevel]">等级:{{ judgeLevel }} </span>
        <el-tooltip effect="dark">
          <div slot="content">
            所有3min展示的点中，横向偏差在（-3，3）占总点比，<br />>=90%为优、>=70%为中、&lt;70%为差
          </div>
          <el-icon class="el-icon-info" />
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import bus from '@/utils/socket/bus'
import { driveStatus_path } from '@/api/locationManage'

export default {
  props: {
    deviceSn: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      judgeLevel: '',
      chartOffset: null,
      chartSpeed: null,
      chartDirection: null,
      chartDifference: null,
      // 橫向偏差echarts配置
      optionOffset: {
        grid: {
          top: 30,
          left: 40,
          right: 30,
          bottom: 50,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          }
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
            onZero: true
          },
          data: [],
          name: '时间s',
          nameLocation: 'center',
          nameGap: 30
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisTick: {
            inside: true
          },
          name: '横向偏差(cm)',
          position: 'left',
          nameTextStyle: {
            align: 'center'
          }
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
            data: [],
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
      },

      // 速度echarts配置
      optionSpeed: {
        grid: {
          top: 30,
          left: 40,
          right: 30,
          bottom: 50,
          containLabel: true
        },
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
          }
        },
        color: ['#666666'],
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
          data: [],
          name: '时间s',
          nameLocation: 'center',
          nameGap: 30
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
          nameTextStyle: {
            align: 'center'
          }
        },
        series: [
          {
            name: '速度',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: []
          }
        ]
      },

      // 航向角echarts配置
      optionDirection: {
        grid: {
          top: 30,
          left: 40,
          right: 30,
          bottom: 50,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          }
        },
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
          data: [],
          name: '时间s',
          nameLocation: 'center',
          nameGap: 30
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisTick: {
            inside: true
          },
          name: '航向角(°)',
          position: 'left',
          nameTextStyle: {
            align: 'center'
          }
        },
        series: [
          {
            name: '航向角',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: []
          }
        ]
      },

      // 差分龄期echarts配置
      optionDifference: {
        grid: {
          top: 30,
          left: 40,
          right: 30,
          bottom: 50,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          }
        },
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
          data: [],
          name: '时间s',
          nameLocation: 'center',
          nameGap: 30
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisTick: {
            inside: true
          },
          name: '差分龄期(s)',
          position: 'left',
          nameTextStyle: {
            align: 'center'
          }
        },
        series: [
          {
            name: '差分龄期',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: []
          }
        ]
      }
    }
  },

  mounted() {
    this.initCharts()
    this.loadData()
  },

  beforeDestroy() {
    this.chartOffset ? this.chartOffset.dispose() : ''
    this.chartOffset = null

    this.chartSpeed ? this.chartSpeed.dispose() : ''
    this.chartSpeed = null

    this.chartDirection ? this.chartDirection.dispose() : ''
    this.chartDirection = null

    bus.$off('message')
  },

  methods: {
    loadData() {
      driveStatus_path({ sn: this.deviceSn }).then(res => {
          try {
            if (
              res.data &&
              res.data.data &&
              res.data.data.list &&
              res.data.data.list.length
            ) {
              this.judgeLevel = res.data.data.judgeLevel
              let data = res.data.data.list
              let time = [];
                let xOffset = [];
                let speed = [];
                let direction = [];
                let diffAge = []
              data.forEach(element => {
                time.push(this.dateTimeTrans(element.gnssTime).slice(11))
                xOffset.push(element.xOffset)
                speed.push(element.speed)
                direction.push(element.heading)
                diffAge.push(element.diffAge)
              })

              this.optionOffset.xAxis.data = time
              this.optionSpeed.xAxis.data = time.map(i => i) // 隐匿问题、对象指针引用，需要准备三个不同的对象！！！
              this.optionDirection.xAxis.data = time.map(i => i)
              this.optionDifference.xAxis.data = time.map(i => i)

              this.optionOffset.series[0].data = xOffset
              this.optionSpeed.series[0].data = speed
              this.optionDirection.series[0].data = direction
              this.optionDifference.series[0].data = diffAge

              this.chartOffset.setOption(this.optionOffset)
              this.chartSpeed.setOption(this.optionSpeed)
              this.chartDirection.setOption(this.optionDirection)
              this.chartDifference.setOption(this.optionDifference)

              this.listenMessage()
            }
          } catch (error) {
            console.log(error)
          }
        })
    },

    // 初始化echarts实例
    initCharts() {
      this.chartOffset = echarts.init(document.getElementById('xoffset'))
      this.chartSpeed = echarts.init(document.getElementById('speed'))
      this.chartDirection = echarts.init(document.getElementById('direction'))
      this.chartDifference = echarts.init(document.getElementById('difference'))
    },

    // 处理websocket数据
    listenMessage() {
      bus.$on('message', data => {
        if (
          data.type === 'farmPt' &&
          data.module === 'farm' &&
          data.action === 'online'
        ) {
          this.handleMessageChange(data)
        }
      })
    },

    handleMessageChange(data) {
      try {
        if (data.deviceSn === this.deviceSn) {
          // 过滤非自动驾驶驾驶状态的值；
          if (data.data.driveState === 0) {
            data.data.xOffset = null
            // data.data.speed = null;
            // data.data.heading = null;
          }
          let time = this.dateTimeTrans(data.data.gnssTime).slice(11)
          let xOffset = data.data.xOffset
          let speed = data.data.speed
          let direction = data.data.heading
          let diffAge = data.data.diffAge
          // x轴数据更新
          this.optionOffset.xAxis.data.push(time)
          this.optionSpeed.xAxis.data.push(time)
          this.optionDirection.xAxis.data.push(time)
          this.optionDifference.xAxis.data.push(time)
          // x轴数据
          // if(this.optionOffset.xAxis.data.length >= 30) {
          // 	this.optionOffset.xAxis.data.shift();
          // 	this.optionSpeed.xAxis.data.shift();
          // 	this.optionDirection.xAxis.data.shift();
          // 	this.optionDifference.xAxis.data.shift();
          // }
          // 系列数据
          this.optionOffset.series[0].data.push(xOffset)
          this.optionSpeed.series[0].data.push(speed)
          this.optionDirection.series[0].data.push(direction)
          this.optionDifference.series[0].data.push(diffAge)
          // 系列数据
          // if(this.optionOffset.series[0].data.length >= 30) {
          // 	this.optionOffset.series[0].data.shift();
          // 	this.optionSpeed.series[0].data.shift();
          // 	this.optionDirection.series[0].data.shift();
          // 	this.optionDifference.series[0].data.shift();
          // }
          // setOption
          this.chartOffset ? this.chartOffset.setOption(this.optionOffset) : ''
          this.chartSpeed ? this.chartSpeed.setOption(this.optionSpeed) : ''
          this.chartDirection
            ? this.chartDirection.setOption(this.optionDirection)
            : ''
          this.chartDifference
            ? this.chartDifference.setOption(this.optionDifference)
            : ''
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style scoped lang="scss">
.driveContainer {
  height: 100%;
  overflow-y: auto;
  position: relative;
  > div {
    > p {
      &.footer {
        margin-top: 0;
        text-align: center;
      }
      &.title {
        margin-bottom: 0;
        display: flex;
        justify-content: space-around;
        > span {
          flex: 1;
          text-align: center;
          &:last-child {
            text-align: right;
            > span:first-child {
              padding: 3px 8px;
              margin-right: 4px;
            }
          }
        }
      }
    }
    > div {
      height: 200px;
      width: 100%;
    }
  }
  .judgeLevel {
    position: absolute;
    right: 0px;
    top: 10px;
    width: fit-content;
    height: auto;
    .level优 {
      padding: 2px 5px;
      border-radius: 2px;
      background-color: #b7eb8f;
    }
    .level中 {
      padding: 2px 5px;
      border-radius: 2px;
      background-color: #ffd591;
    }
    .level差 {
      padding: 2px 5px;
      border-radius: 2px;
      background-color: #ffafab;
    }
  }
}
</style>
