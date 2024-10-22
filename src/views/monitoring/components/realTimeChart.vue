<template>
  <div class="realTimeChart_component">
    <el-dialog @open="beforeOpen" v-model="dialogVisible" :title="props.sn + t('messages.Realtimedrivingtrendchart')" width="40%" center>
      <p>
        <el-icon class="el-icon-warning-outline" />
        <span>{{ t('chart.last3') }}</span>
      </p>
      <div class="charts_container">
      
        <div id="xoffset"></div>
       
        <div id="speed"></div>
       
        <div id="direction"></div>
       
        <div id="difference"></div>
        <div class="judgeLevel">
          <span :class="['level' + judgeLevel]">{{$t('work.level')}}:{{ judgeLevel }} </span>
          <el-tooltip effect="dark" :content="t('chart.lan1')">
            <el-icon>
              <InfoFilled />
            </el-icon>
          </el-tooltip>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { driveStatusPath_API } from '@/api/monitoring/index'
import { driveStatusPathResponseData } from '@/api/monitoring/type'
import { useI18n } from "vue-i18n";
import * as echarts from 'echarts'
const props = defineProps({
  sn: {
    type: String,
    default: ''
  },
  socketData: {
    type: Object,
    default: {}
  }
});
const { t } = useI18n();
const dialogVisible = ref<boolean>(false)
const judgeLevel = ref<string>()
let chartOffset = <any>null
let chartSpeed = <any>null
let chartDirection = <any>null
let chartDifference = <any>null
defineExpose({
  dialogVisible,
}
)

const optionOffset = {
  grid: {
    top: 30,
    left: 40,
    right: 30,
    bottom: 50,
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
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
    name: t('work.time'),
    nameLocation: 'center',
    nameGap: 30
  },
  yAxis: {
    type: 'value',
    splitLine: {
      show: false
    },
    axisTick: {
      show: true,
      inside: true,
      alignWithLabel: true
    },
    axisLine: {
      show: true,
    },

    name: `${t('chart.lateralDeviation')}(cm)`,
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
      name: t('chart.lateralDeviation'),
      type: 'line',
      showSymbol: false,
      data: [],
      emphasis: {
        scale: false
      },
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

// 速度echarts配置
const optionSpeed = {
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
    formatter(params: any) {
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
      show: true,
      inside: true,
      alignWithLabel: true
    },
    axisLine: {
      onZero: false
    },
    data: [],
    name: t('work.time'),
    nameLocation: 'center',
    nameGap: 30
  },
  yAxis: {
    type: 'value',
    splitLine: {
      show: false
    },
    axisTick: {
      show: true,
      inside: true,
      alignWithLabel: true
    },
    axisLine: {
      show: true,
    },
    name: `${t('chart.speed')}(km/h)`,
    position: 'left',
    nameTextStyle: {
      align: 'center'
    }
  },
  series: [
    {
      name: `${t('chart.speed')}`,
      type: 'line',
      showSymbol: false,
      data: [],
      emphasis: {
        scale: false
      }
    }
  ]
}

// 航向角echarts配置
const optionDirection = {
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
    name: `${t('work.time')}s`,
    nameLocation: 'center',
    nameGap: 30
  },
  yAxis: {
    type: 'value',
    splitLine: {
      show: false
    },
    axisTick: {
      show: true,
      inside: true,
      alignWithLabel: true
    },
    axisLine: {
      show: true,
    },
    name: `${t('chart.headingAngle')}(°)`,
    position: 'left',
    nameTextStyle: {
      align: 'center'
    }
  },
  series: [
    {
      name: t('chart.headingAngle'),
      type: 'line',
      showSymbol: false,
      data: [],
      emphasis: {
        scale: false
      }
    }
  ]
}

// 差分龄期echarts配置
const optionDifference = {
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
    name: `${t('work.time')}s`,
    nameLocation: 'center',
    nameGap: 30
  },
  yAxis: {
    type: 'value',
    splitLine: {
      show: false
    },
    axisTick: {
      show: true,
      inside: true,
      alignWithLabel: true
    },
    axisLine: {
      show: true,
    },
    name: `${t('chart.DifferentialAge')}(s)`,
    position: 'left',
    nameTextStyle: {
      align: 'center'
    }
  },
  series: [
    {
      name: t('chart.DifferentialAge'),
      type: 'line',
      showSymbol: false,
      data: [],
      emphasis: {
        scale: false
      }
    }
  ]
}
// 初始化echarts实例
const initCharts = () => {
  chartOffset = echarts.init(document.getElementById('xoffset'))
  chartSpeed = echarts.init(document.getElementById('speed'))
  chartDirection = echarts.init(document.getElementById('direction'))
  chartDifference = echarts.init(document.getElementById('difference'))
}
// 格式除处理
const dateTimeTrans = (timestamp: number) => {
  try {
    if (!timestamp) return '/'
    let dateObj = timestamp ? new Date(timestamp) : new Date();
    let dateString = dateObj.toLocaleDateString().split('/').map(i => i.padStart(2, '0')).join('-');
    let timeString = dateObj.toTimeString().slice(0, 8);
    return dateString + ' ' + timeString;
  } catch (error) {
    console.log(error);
    return '/';
  }
}
const handleMessageChange = (data: any) => {
  try {
    if (data.deviceSn === props.sn) {
      // 过滤非自动驾驶驾驶状态的值；
      if (data.data.driveState === 0) {
        data.data.xOffset = null
        // data.data.speed = null;
        // data.data.heading = null;
      }
      let time = dateTimeTrans(data.data.gnssTime).slice(11)
      let xOffset = data.data.xOffset
      let speed = data.data.speed
      let direction = data.data.heading
      let diffAge = data.data.diffAge
      // x轴数据更新
      optionOffset.xAxis.data.push(time as never)
      optionSpeed.xAxis.data.push(time as never)
      optionDirection.xAxis.data.push(time as never)
      optionDifference.xAxis.data.push(time as never)
      // x轴数据
      // if(this.optionOffset.xAxis.data.length >= 30) {
      // 	this.optionOffset.xAxis.data.shift();
      // 	this.optionSpeed.xAxis.data.shift();
      // 	this.optionDirection.xAxis.data.shift();
      // 	this.optionDifference.xAxis.data.shift();
      // }
      // 系列数据
      optionOffset.series[0].data.push(xOffset as never)
      optionSpeed.series[0].data.push(speed as never)
      optionDirection.series[0].data.push(direction as never)
      optionDifference.series[0].data.push(diffAge as never)
      // 系列数据
      // if(this.optionOffset.series[0].data.length >= 30) {
      // 	this.optionOffset.series[0].data.shift();
      // 	this.optionSpeed.series[0].data.shift();
      // 	this.optionDirection.series[0].data.shift();
      // 	this.optionDifference.series[0].data.shift();
      // }
      // setOption
      chartOffset ? chartOffset.setOption(optionOffset) : ''
      chartSpeed ? chartSpeed.setOption(optionSpeed) : ''
      chartDirection ? chartDirection.setOption(optionDirection) : ''
      chartDifference ? chartDifference.setOption(optionDifference) : ''
    }
  } catch (error) {
    console.log(error)
  }
}
// 获取数据
const loadData = async () => {
  const res: driveStatusPathResponseData = await driveStatusPath_API(props.sn)
  judgeLevel.value = res.data.judgeLevel
  let data = res.data.list
  let time = <any>[];
  let xOffset = <any>[];
  let speed = <any>[];
  let direction = <any>[];
  let diffAge = <any>[]
  data.forEach(element => {
    time.push(dateTimeTrans(element.gnssTime).slice(11))
    xOffset.push(element.xoffset)
    speed.push(element.speed)
    direction.push(element.heading)
    diffAge.push(element.diffAge)
  })

  optionOffset.xAxis.data = time
  optionSpeed.xAxis.data = time.map((i: any) => i) // 隐匿问题、对象指针引用，需要准备三个不同的对象！！！
  optionDirection.xAxis.data = time.map((i: any) => i)
  optionDifference.xAxis.data = time.map((i: any) => i)

  optionOffset.series[0].data = xOffset
  optionSpeed.series[0].data = speed
  optionDirection.series[0].data = direction
  optionDifference.series[0].data = diffAge
  chartOffset.setOption(optionOffset)
  chartSpeed.setOption(optionSpeed)
  chartDirection.setOption(optionDirection)
  chartDifference.setOption(optionDifference)
  listenMessage(props.socketData)
}
// 处理websocket数据
const listenMessage = (data: any) => {
  if (
    data.type === 'farmPt' &&
    data.module === 'farm' &&
    data.action === 'online'
  ) {
    handleMessageChange(data)
  }
}
const beforeOpen = () => {
  initCharts()
  loadData()
}
watch(
  () => props.socketData,
  (socketData) => {
    listenMessage(socketData)
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.realTimeChart_component {
  position: relative;

  #xoffset {
    height: 200px;
  }

  #difference {
    height: 170px;
  }

  #direction {
    height: 180px;
  }

  #speed {
    height: 180px;
  }

  .judgeLevel {
    position: absolute;
    right: 40px;
    top: 95px;

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
