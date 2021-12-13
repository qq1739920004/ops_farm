<template>
  <div class="realtime_container">
    <div class="title">实时统计</div>
    <el-row class="content">
      <el-col :span="6" class="online_data">
        <div class="online_data_item">
          <div>车辆在线数</div>
          <div class="online_data_num">{{ onlineDevice }}</div>
        </div>
        <div class="online_data_item">
          <div>今日作业面积(亩)</div>
          <div class="online_data_num">{{ todayArea }}</div>
        </div>
        <div class="online_data_item">
          <div>今日新增车辆</div>
          <div class="online_data_num">{{ newCar }}</div>
        </div>
      </el-col>

      <el-col :span="1" class="online_data">
        <el-divider direction="vertical" />
      </el-col>

      <el-col :span="10" class="online_data">
        <div id="onlineCarRankChart"></div>
      </el-col>

      <el-col :span="1" class="online_data">
        <el-divider direction="vertical" />
      </el-col>

      <el-col :span="6" class="online_data">
        <div id="networkPieChart" style="height: 100%; width: 100%"></div>
        <div class="legend_icon">
          <div class="legend_icon_item">
            <img :src="strong" alt="avatar" />
            <span>{{ optionsNet.series[0].data[0]['value'] }}</span>
          </div>
          <div class="legend_icon_item">
            <img :src="middle" alt="avatar" />
            <span>{{ optionsNet.series[0].data[1]['value'] }}</span>
          </div>
          <div class="legend_icon_item">
            <img :src="weak" alt="avatar" />
            <span>{{ optionsNet.series[0].data[2]['value'] }}</span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import echarts from 'echarts'
import bus from '@/utils/socket/bus'
import {
  farmMachineDataStatistics_path,
  onlineFarmMachinePosition_path
} from '@/api/statistics'

const a = require('@/views/locationManage/map/img/s4.png')
const b = require('@/views/locationManage/map/img/s2.png')
const c = require('@/views/locationManage/map/img/s0.png')
export default {
  data() {
    return {
      strong: a,
      middle: b,
      weak: c,
      onlineDevice: 0,
      todayArea: 0,
      newCar: 0,
      chartRank: null,
      chartNet: null,
      timerLock: null,
      throttle: null,
      // 直方图配置
      optionsRank: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          },
          extraCssText: 'text-align:left'
        },
        color: ['#319AFF'],
        title: {
          text: '省份在线车辆排名',
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal'
          }
        },
        grid: {
          left: 10,
          top: 30,
          bottom: 20,
          containLabel: true
        },
        xAxis: {
          type: 'value',
          min: 0,
          name: '(辆)',
          minInterval: 1,
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#BFBFBF'
            }
          },
          axisLabel: { color: '#333333' },
          nameTextStyle: { color: '#333333' }
        },
        yAxis: {
          type: 'category',
          data: [],
          axisTick: { show: false },
          axisLine: {
            lineStyle: {
              color: '#BFBFBF'
            }
          },
          axisLabel: { color: '#333333' }
        },
        series: [
          {
            name: '在线车辆',
            type: 'bar',
            data: [],
            barWidth: 15
          }
        ]
      },
      // 饼图配置
      optionsNet: {
        color: ['#14CFAF', '#FFBA37', '#FF4A3A'],
        title: {
          text: '网络情况',
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 5,
          top: 30,
          data: ['强', '中', '弱'],
          // itemWidth: 10,
          // itemHeight: 10,
          itemGap: 20,
          icon: 'roundRect',
          formatter: function(name) {
            return ''
          }
        },
        series: [
          {
            name: '网络状况',
            type: 'pie',
            radius: ['60%', '80%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 0, name: '强' },
              { value: 0, name: '中' },
              { value: 0, name: '弱' }
            ],
            left: '30%'
          }
        ]
      }
    }
  },
  computed: {
    netSingalCount() {
      return this.$store.state.index.netSingalCount
    }
  },
  created() {
    let that = this
    window.addEventListener('resize', that.reloadCharts)
  },

  mounted() {
    this.initChart()
    this.loadData()
    this.loadOnlineCar()
    this.listenMessage()
  },
  beforeDestroy() {
    let that = this
    bus.$off('message')
    this.chartNet ? this.chartNet.dispose() : ''
    this.chartRank ? this.chartRank.dispose() : ''
    window.removeEventListener('resize', that.reloadCharts)
  },
  methods: {
    initChart() {
      this.chartRank = echarts.init(
        document.getElementById('onlineCarRankChart')
      )
      this.chartNet = echarts.init(document.getElementById('networkPieChart'))
    },

    reloadCharts() {
      if (this.timerLock) {
        clearTimeout(this.timerLock)
      }
      this.timerLock = setTimeout(() => {
        this.chartRank.dispose()
        this.chartRank = null
        this.chartRank = echarts.init(
          document.getElementById('onlineCarRankChart')
        )
        this.chartRank.setOption(this.optionsRank)

        this.chartNet.dispose()
        this.chartNet = null
        this.chartNet = echarts.init(document.getElementById('networkPieChart'))
        this.chartNet.setOption(this.optionsNet)
      }, 300)
    },

    // 请求统计数据接口
    loadData() {
      farmMachineDataStatistics_path().then(res => {
        try {
          if (res.data) {
            this.todayArea = res.data.workArea.todayArea
            this.newCar = res.data.car.newCar
            this.onlineDevice = res.data.device.onlineDevice
            // 初始化省份排名
            let series = res.data.provinceRank
              .map(item => item.online)
              .reverse()
            let yAxis = res.data.provinceRank.map(item => item.name).reverse()

            this.optionsRank.series[0].data = series
            this.optionsRank.yAxis.data = yAxis
            this.chartRank.setOption(this.optionsRank)
          }
        } catch (err) {
          console.log(err)
        }
      })
    },

    // 请求在线车辆接口
    loadOnlineCar() {
      onlineFarmMachinePosition_path().then(res => {
        try {
          if (res.data.onlineFarmMachines) {
            let carList = res.data.onlineFarmMachines
            let strong = 0
            let medium = 0
            let weak = 0
            carList.forEach(item => {
              // 统计信号
              item.netSignal <= 1 ? weak++ : ''
              item.netSignal === 2 ? medium++ : ''
              item.netSignal >= 3 ? strong++ : ''
            })
            let tem = [
              { value: strong, name: '强' },
              { value: medium, name: '中' },
              { value: weak, name: '弱' }
            ]
            this.optionsNet.series[0].data = tem
            this.chartNet.setOption(this.optionsNet)
          }
        } catch (error) {
          console.log(error)
        }
      })
    },

    // 处理websocket数据
    listenMessage() {
      bus.$on('message', data => {
        this.handleMessageChange(data)
      })
    },

    handleMessageChange(data) {
      if (data.module === 'farm' && data.type === 'farmPt') {
        if (data.action === 'upline') {
          // 针对上线的车辆
          // this.loadData();
          // this.loadOnlineCar();
          this.count()
          return
        }
      }
      if (data.module === 'farm' && data.type === 'farmCount') {
        // 针对统计的消息
        // this.loadData();
        // this.loadOnlineCar();
        this.count()
        return
      }
    },

    count() {
      if (!this.throttle) {
        this.throttle = setTimeout(() => {
          this.throttle = null
          this.loadData()
          this.loadOnlineCar()
        }, 6000)
      }
    }
  }
}
</script>
<style scoped lang="scss">
.realtime_container {
  height: 30%;
  box-sizing: border-box;
  overflow: hidden;
  text-align: left;
  .title {
    padding: 10px 15px;
    height: 40px;
    box-sizing: border-box;
    font-weight: 400;
    font-size: 20px;
  }
  .content {
    height: calc(100% - 42px);
    .online_data {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: left;
      position: relative;
      .online_data_item {
        padding-left: 20px;
        > div {
          padding: 3px 0px;
        }
        .online_data_num {
          font-size: 28px;
        }
      }
      #onlineCarRankChart {
        width: 100%;
        height: 100%;
      }
      #networkPieChart {
        width: 100%;
        height: 100%;
      }
      .legend_icon {
        position: absolute;
        top: 33px;
        left: 45px;
        height: 88px;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        .legend_icon_item {
          > span {
            padding-left: 8px;
          }
        }
      }
      .el-divider {
        height: 80%;
      }
    }
  }
}
</style>
