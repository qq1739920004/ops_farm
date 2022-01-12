<template>
  <div class="chart_warpper">
    <div class="chart_item_contianer">
      <div id="chart_fun"></div>
      <div class="legend_container">
        <chart-legend @params="getChartFunTimeParams" />
      </div>
    </div>
    <div class="chart_item_contianer">
      <div id="chart_ops"></div>
      <div class="legend_container">
        <chart-legend @params="getChartOpsTimeParams" />
      </div>
    </div>
    <div class="chart_item_contianer">
      <div id="chart_visit"></div>
      <div class="legend_container">
        <chart-legend @params="getChartVisitTimeParams" />
      </div>
    </div>
    <div class="chart_item_contianer">
      <div id="chart_car"></div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import chartLegend from './legend.vue'
import {
  wxAndParam_path,
  remote_path,
  page_path,
  province_path
} from '@/api/statistics'
export default {
  components: {
    chartLegend
  },
  data() {
    return {
      chartFun: null,
      chartOps: null,
      chartVisit: null,
      chartCar: null,
      st: '',
      et: '',
      timerLock: null,
      // 功能统计配置
      optionsFun: {
        grid: {
          right: 30,
          bottom: 30,
          top: 60,
          left: 80
        },
        title: {
          text: '功能统计',
          left: 10,
          top: 10,
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal'
          }
        },
        legend: {
          type: 'plain',
          zlevel: 9,
          top: 10,
          right: 10,
          data: [
            {
              name: '参数同步',
              icon: 'roundRect'
            }
          ]
        },
        tooltip: {
          show: true,
          trigger: 'axis'
        },
        dataZoom: [
          {
            type: 'inside',
            realtime: true,
            zoomOnMouseWheel: true
          }
        ],
        xAxis: {
          type: 'category',
          data: [],
          axisLine: {
            lineStyle: {
              color: '#B9C8DB'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#000'
          }
        },
        yAxis: {
          type: 'value',
          name: '',
          axisLine: {
            lineStyle: {
              color: '#B9C8DB'
            }
          },
          splitNumber: 3,
          axisTick: {
            show: false
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: '#384155'
            }
          },
          axisLabel: {
            color: '#000'
          },
          nameTextStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            data: [],
            smooth: false,
            type: 'line',
            name: '参数同步',
            itemStyle: {
              color: '#00FB8D'
            }
            // areaStyle: {
            //     color: {
            //         type: 'linear',
            //         x: 0,
            //         y: 0,
            //         x2: 0,
            //         y2: 1,
            //         colorStops: [
            //             {
            //                 offset: 0, color: '#20FF8A' // 0% 处的颜色
            //             },
            //             {
            //                 offset: 1, color: 'rgba(32, 255, 138, 0.1)' // 100% 处的颜色
            //             }
            //         ],
            //     }
            // }
          }
        ]
      },
      // 运维统计配置
      optionsOps: {
        grid: {
          right: 30,
          bottom: 30,
          top: 60,
          left: 50
        },
        title: {
          text: '运维统计',
          left: 10,
          top: 10,
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal'
          }
        },
        legend: {
          type: 'plain',
          zlevel: 9,
          top: 10,
          right: 10,
          data: [
            {
              name: '远程校准',
              icon: 'roundRect'
            },
            {
              name: '设置数据链',
              icon: 'roundRect'
            },
            {
              name: '注册',
              icon: 'roundRect'
            },
              {
              name: '小程序',
              icon: 'roundRect'
            }
          ]
        },
        tooltip: {
          show: true,
          trigger: 'axis'
        },
        dataZoom: [
          {
            type: 'inside',
            realtime: true,
            zoomOnMouseWheel: true
          }
        ],
        xAxis: {
          type: 'category',
          data: [],
          axisLine: {
            lineStyle: {
              color: '#B9C8DB'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#000'
          }
        },
        yAxis: {
          type: 'value',
          name: '',
          axisLine: {
            lineStyle: {
              color: '#B9C8DB'
            }
          },
          splitNumber: 3,
          axisTick: {
            show: false
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: '#384155'
            }
          },
          axisLabel: {
            color: '#000'
          },
          nameTextStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            data: [],
            smooth: false,
            type: 'line',
            name: '远程校准',
            itemStyle: {
              color: '#44AAFF'
            }
          },
          {
            data: [],
            smooth: false,
            type: 'line',
            name: '设置数据链',
            itemStyle: {
              color: '#FF4A3A'
            }
          },
          {
            data: [],
            smooth: false,
            type: 'line',
            name: '注册',
            itemStyle: {
              color: '#00E581'
            }
          },
           {
            data: [],
            smooth: false,
            type: 'line',
            name: '小程序',
            itemStyle: {
              color: 'orange'
            }
          }
        ]
      },
      // 访问次数统计配置
      optionsVisit: {
        grid: {
          right: 30,
          bottom: 30,
          top: 60,
          left: 50
        },
        title: {
          text: '访问次数统计',
          left: 10,
          top: 10,
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal'
          }
        },
        legend: {
          type: 'plain',
          zlevel: 9,
          top: 10,
          right: 10,
          data: [
            {
              name: '态势监控',
              icon: 'roundRect'
            },
            {
              name: '农机列表',
              icon: 'roundRect'
            }
          ]
        },
        tooltip: {
          show: true,
          trigger: 'axis'
        },
        dataZoom: [
          {
            type: 'inside',
            realtime: true,
            zoomOnMouseWheel: true
          }
        ],
        xAxis: {
          type: 'category',
          data: [],
          axisLine: {
            lineStyle: {
              color: '#B9C8DB'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#000'
          }
        },
        yAxis: {
          type: 'value',
          name: '',
          axisLine: {
            lineStyle: {
              color: '#B9C8DB'
            }
          },
          splitNumber: 3,
          axisTick: {
            show: false
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: '#384155'
            }
          },
          axisLabel: {
            color: '#000'
          },
          nameTextStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            data: [],
            smooth: false,
            type: 'line',
            name: '态势监控',
            itemStyle: {
              color: '#FFBA37'
            }
          },
          {
            data: [],
            smooth: false,
            type: 'line',
            name: '农机列表',
            itemStyle: {
              color: '#44AAFF'
            }
          }
        ]
      },
      // 车辆分布与作业信息配置
      optionsCar: {
        grid: {
          right: 30,
          bottom: 60,
          top: 60,
          left: 60
        },
        title: {
          text: '车辆分布与作业信息',
          left: 10,
          top: 10,
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal'
          }
        },
        legend: {
          type: 'plain',
          zlevel: 9,
          top: 10,
          right: 10,
          data: [
            {
              name: '车辆总数',
              icon: 'roundRect'
            },
            {
              name: '今日上线',
              icon: 'roundRect'
            },
            {
              name: '累计作业',
              icon: 'roundRect'
            }
          ]
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          textStyle: {
            align: 'left'
          }
        },
        dataZoom: [
          {
            type: 'inside',
            realtime: true,
            zoomOnMouseWheel: true
          }
        ],
        xAxis: {
          type: 'category',
          data: [],
          axisLine: {
            lineStyle: {
              color: '#B9C8DB'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#000',
            interval: 0,
            rotate: 30,
            fontSize: 12
          }
        },
        yAxis: {
          type: 'value',
          name: '',
          axisLine: {
            lineStyle: {
              color: '#B9C8DB'
            }
          },
          splitNumber: 3,
          axisTick: {
            show: false
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: '#384155'
            }
          },
          axisLabel: {
            color: '#000'
          },
          nameTextStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            data: [],
            smooth: false,
            type: 'bar',
            name: '车辆总数',
            itemStyle: {
              color: '#FFBA37'
            }
          },
          {
            data: [],
            smooth: false,
            type: 'bar',
            name: '今日上线',
            itemStyle: {
              color: '#44AAFF'
            }
          },
          {
            data: [],
            smooth: false,
            type: 'bar',
            name: '累计作业',
            itemStyle: {
              color: '#00E581'
            }
          }
        ]
      }
    }
  },
  created() {
    let that = this
    this.setStartDateParams()
    window.addEventListener('resize', that.reloadCharts)
  },
  mounted() {
    this.initCharts()
    this.getChartFunData()
    this.getChartOpsData()
    this.getChartVisitData()
    this.getCarCountData()
  },

  beforeDestroy() {
    let that = this
    window.removeEventListener('resize', that.reloadCharts)
  },

  methods: {
    initCharts() {
      this.chartFun = echarts.init(document.getElementById('chart_fun'))
      this.chartOps = echarts.init(document.getElementById('chart_ops'))
      this.chartVisit = echarts.init(document.getElementById('chart_visit'))
      this.chartCar = echarts.init(document.getElementById('chart_car'))
    },

    reloadCharts() {
      console.log('%c 触发resize事件', 'color:#16E3C0')
      if (this.timerLock) {
        clearTimeout(this.timerLock) // 防抖
      }
      this.timerLock = setTimeout(() => {
        console.log('%c 执行chart Reload', 'color:#FFCC3C')
        this.chartFun.dispose()
        this.chartFun = null
        this.chartFun = echarts.init(document.getElementById('chart_fun'))
        this.chartFun.setOption(this.optionsFun)

        this.chartOps.dispose()
        this.chartOps = null
        this.chartOps = echarts.init(document.getElementById('chart_ops'))
        this.chartOps.setOption(this.optionsOps)

        this.chartVisit.dispose()
        this.chartVisit = null
        this.chartVisit = echarts.init(document.getElementById('chart_visit'))
        this.chartVisit.setOption(this.optionsVisit)

        this.chartCar.dispose()
        this.chartCar = null
        this.chartCar = echarts.init(document.getElementById('chart_car'))
        this.chartCar.setOption(this.optionsCar)
      }, 300)
    },

    getChartFunTimeParams(p) {
      this.getChartFunData(p.st, p.et)
    },
    getChartOpsTimeParams(p) {
      this.getChartOpsData(p.st, p.et)
    },
    getChartVisitTimeParams(p) {
      this.getChartVisitData(p.st, p.et)
    },

    getChartFunData(st = this.st, et = this.et) {
      this.chartFun.showLoading({
        type: 'default',
        text: 'loading',
        color: '#44AAFF',
        textColor: '#44AAFF',
        maskColor: 'rgba(255, 255, 255, 0.5)'
      })
      wxAndParam_path({
        st: st,
        et: et
      }).then(res => {
        try {
          this.optionsFun.xAxis.data = res.data.chart.date
          this.optionsFun.series[0].data = res.data.chart.data
          this.chartFun.setOption(this.optionsFun)
          this.chartFun.hideLoading()
        } catch (error) {
          console.log(error)
        }
      })
    },

    getChartOpsData(st = this.st, et = this.et) {
      this.chartOps.showLoading({
        type: 'default',
        text: 'loading',
        color: '#44AAFF',
        textColor: '#44AAFF',
        maskColor: 'rgba(255, 255, 255, 0.5)'
      })
      remote_path({
        st: st,
        et: et
      }).then(res => {
        try {
          console.log(res,'---620')
          this.optionsOps.xAxis.data = res.data.chart.date
          this.optionsOps.series[0].data = res.data.chart.data.map(i => i[0])
          this.optionsOps.series[1].data = res.data.chart.data.map(i => i[1])
          this.optionsOps.series[2].data = res.data.chart.data.map(i => i[2])
          this.optionsOps.series[3].data = res.data.chart.data.map(i => i[3])
          //小程序接口获取统计数据
          this.chartOps.setOption(this.optionsOps)
          this.chartOps.hideLoading()
        } catch (error) {
          console.log(error)
        }
      })
    },

    getChartVisitData(st = this.st, et = this.et) {
      this.chartVisit.showLoading({
        type: 'default',
        text: 'loading',
        color: '#44AAFF',
        textColor: '#44AAFF',
        maskColor: 'rgba(255, 255, 255, 0.5)'
      })
      page_path({
        st: st,
        et: et
      }).then(res => {
        try {
          this.optionsVisit.xAxis.data = res.data.chart.date
          this.optionsVisit.series[0].data = res.data.chart.data.map(i => i[0])
          this.optionsVisit.series[1].data = res.data.chart.data.map(i => i[1])
          this.chartVisit.setOption(this.optionsVisit)
          this.chartVisit.hideLoading()
        } catch (error) {
          console.log(error)
        }
      })
    },

    getCarCountData() {
      province_path().then(res => {
        try {
          let name = []
          let allCarCount = []
          let onlineCarCount = []
          let workedArea = []
          res.data.rank.forEach(element => {
            name.push(element.name)
            allCarCount.push(element.allCarCount)
            onlineCarCount.push(element.onlineCarCount)
            workedArea.push(element.workedArea)
          })
          this.optionsCar.xAxis.data = name
          this.optionsCar.series[0].data = allCarCount
          this.optionsCar.series[1].data = onlineCarCount
          this.optionsCar.series[2].data = workedArea
          this.chartCar.setOption(this.optionsCar)
        } catch (error) {
          console.log(error)
        }
      })
    },

    setStartDateParams() {
      let date = new Date()
      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()
      this.st = `${year}-${month}-${day} 00:00:00`
      this.et = `${year}-${month}-${day} 23:59:59`
    }
  }
}
</script>
<style scoped lang="scss">
.chart_warpper {
  width: 100%;
  height: 70%;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 15px;
  box-sizing: border-box;
  padding: 10px;
  .chart_item_contianer {
    position: relative;
    border: 1px solid #e1e1e1;
    #chart_fun,
    #chart_ops,
    #chart_visit,
    #chart_car {
      height: 100%;
    }
    .legend_container {
      position: absolute;
      width: 120px;
      top: 6px;
      left: 70px;
    }
  }
}
</style>
