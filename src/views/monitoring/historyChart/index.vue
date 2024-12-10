<template>
    <div class="app_container">
        <div class="historyDriveContainer app_card">
            <div class="dateContainer ">
                <el-date-picker style="height: 34px; width: 200px;" v-model="filterDate" type="date" :placeholder="t('chart.chooseDate')"
                    :disabled-date="disabledDate" :clearable="false" @change="filterDateChange" />
                <el-time-picker style="height: 34px; width: 240px;margin-left: 10px;margin-right: 10px;" v-model="timeRange"
                    is-range :clearable="false" range-separator="-" 
                    :placeholder="t('chart.chooseTime')" format="HH:mm" @change="refreshData" />
                <el-tooltip class="item" effect="dark" :content="t('chart.refreshData')" placement="top">
                    <el-icon>
                        <Refresh @click="refreshData" />
                    </el-icon>
                </el-tooltip>
            </div>
            <div class="chartContainer">
                <div class="hDiffContainer">
                    <p class="title">{{ t('chart.lateralDeviation') }}</p>
                    <div id="history_hDiffChart"></div>
                </div>
                <div class="speedContainer">
                    <p class="title">{{ t('chart.speed') }}</p>
                    <div id="history_speedChart"></div>
                </div>
                <div class="azimuthContainer">
                    <p class="title">{{ t('chart.CarHeading') }}</p>
                    <div id="history_azimuthChart"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from "vue-router";
import { driveTendency_API } from '@/api/monitoring/index'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { useI18n } from "vue-i18n";
const filterDate = ref(new Date())
const timeRange = ref<Date[]>([])
let hDiffData = <any>[]
    const { t } = useI18n();
let hDiffXLabel = <any>[]
let speedData = <any>[]
let azimuthData = <any>[]
let history_hDiffChart = <any>null
let history_speedChart = ref<any>(null)
let history_azimuthChart = <any>null
const route = useRoute()
const disabledDate = (time: Date) => {
    return time.getTime() > Date.now()
}
function add0(m: any) {
    return m < 10 ? '0' + m : m;
}
const formartDate = (val: Date) => {
    var y = val.getFullYear();
    var m = val.getMonth() + 1;
    var d = val.getDate();
    var h = val.getHours();
    var mm = val.getMinutes();
    var s = val.getSeconds();
    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}
const formatHour = (time: any) => {
    let gnsstime = new Date(time)
    let h: any = gnsstime.getHours()
    h = h < 10 ? '0' + h : h
    let minute: any = gnsstime.getMinutes()
    minute = minute < 10 ? '0' + minute : h
    let second: any = gnsstime.getSeconds()
    second = second < 10 ? '0' + second : second
    return h + ':' + minute + ':' + second
}
const startTime = computed(() => {
    return new Date(
        filterDate.value.getFullYear(),
        filterDate.value.getMonth(),
        filterDate.value.getDate(),
        timeRange.value[0].getHours(),
        timeRange.value[0].getMinutes()
    )
})
const endTime = computed(() => {
    return new Date(
        filterDate.value.getFullYear(),
        filterDate.value.getMonth(),
        filterDate.value.getDate(),
        timeRange.value[1].getHours(),
        timeRange.value[1].getMinutes()
    )
})
const initHDiffChart = () => {
    if (history_hDiffChart != null) {
        history_hDiffChart.dispose()
    }
    history_hDiffChart = echarts.init(
        document.getElementById('history_hDiffChart')
    )
    let option = {
        grid: {
            top: 30,
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
            data: hDiffXLabel,
            name: `${t('work.time')}s`,
            nameLocation: 'center',
            nameGap: 30,
            axisLabel: {
                interval: Math.round(hDiffXLabel.length / 15)
            }
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
            name: `${t('chart.deviation')}(cm)`,
            position: 'left',
            splitNumber: 4
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
                emphasis: {
                    scale: false
                },
                data: hDiffData,
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
    history_hDiffChart.setOption(option)
    history_hDiffChart.on('dataZoom', (res: any) => {
        history_speedChart.value.setOption({
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
        history_azimuthChart.setOption({
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
}
const initSpeedChart = () => {
    if (history_speedChart.value != null) {
        history_speedChart.value.dispose()
    }
    history_speedChart.value = echarts.init(
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
            data: hDiffXLabel,
            name:`${t('work.time')}s`,
            nameLocation: 'center',
            nameGap: 30,
            axisLabel: {
                interval: Math.round(hDiffXLabel.length / 15)
            }
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
            splitNumber: 3,
            minInterval: 1
        },
        series: [
            {
                name: `${t('chart.speed')}`,
                type: 'line',
                showSymbol: false,
                emphasis: {
                    scale: false
                },
                data: speedData
            }
        ]
    }
    history_speedChart.value.setOption(option)
    history_speedChart.value.on('dataZoom', (res: any) => {
        history_hDiffChart.setOption({
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
        history_azimuthChart.setOption({
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
}
const initAzimuthChart = () => {
    if (history_azimuthChart != null) {
        history_azimuthChart.dispose()
    }
    history_azimuthChart = echarts.init(
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
            data: hDiffXLabel,
            name: `${t('work.time')}s`,
            nameLocation: 'center',
            nameGap: 30,
            axisLabel: {
                interval: Math.round(hDiffXLabel.length / 15)
            }
        },
        yAxis: {
            type: 'value',
            // boundaryGap: [0, '100%'],
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
            splitNumber: 4

        },
        series: [
            {
                name: `${t('chart.headingAngle')}`,
                type: 'line',
                showSymbol: false,
                emphasis: {
                    scale: false
                },
                data: azimuthData
                // lineStyle:{
                //     color:"#409EFF"
                // }
            }
        ]
    }
    history_azimuthChart.setOption(option)
    history_azimuthChart.on('dataZoom', (res: any) => {
        history_hDiffChart.setOption({
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
        history_speedChart.value.setOption({
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
}
const refreshData = async () => {
    const res = await driveTendency_API({ sn: route.query.sn as string, st: formartDate(startTime.value), et: formartDate(endTime.value) })
    if (res.data.length == 0) {
        ElMessage({ type: 'warning', message: t('chart.noHis') })
    }
    let allData = res.data
    hDiffXLabel = []
    hDiffData = []
    speedData = []
    azimuthData = []
    allData.forEach((item, index) => {
        if (index == 0) {
            hDiffXLabel.push(formatHour(startTime.value))
            hDiffData.push(0)
            speedData.push(0)
            azimuthData.push(0)
            if (
                formatHour(item.gnssTime) !=
                formatHour(startTime.value)
            ) {
                hDiffXLabel.push(formatHour(item.gnssTime))
                // hDiffData.push(item.xOffset);
                hDiffData.push(item.xoffset * 100)
                speedData.push(item.speed)
                azimuthData.push(item.heading)
            } else {
                hDiffData[index] = item.xoffset * 100
                speedData[index] = item.speed
                azimuthData[index] = item.heading
            }
        } else if (index == allData.length - 1) {
            if (
                formatHour(item.gnssTime) !=
                formatHour(endTime)
            ) {
                hDiffXLabel.push(formatHour(item.gnssTime))
                // hDiffData.push(item.xOffset);
                hDiffData.push(item.xoffset * 100)
                speedData.push(item.speed)
                azimuthData.push(item.heading)
            } else {
                hDiffData[index] = item.xoffset * 100
                speedData[index] = item.speed
                azimuthData[index] = item.heading
            }
            hDiffXLabel.push(formatHour(endTime))
            hDiffData.push(0)
            speedData.push(0)
            azimuthData.push(0)
        } else {
            hDiffXLabel.push(formatHour(item.gnssTime))
            hDiffData.push(item.xoffset * 100)
            // hDiffData.push(item.xOffset);
            speedData.push(item.speed)
            azimuthData.push(item.heading)
        }
    })
    initHDiffChart()
    initSpeedChart()
    initAzimuthChart()
}
const filterDateChange = () => {
    let todayStart = new Date().setHours(0, 0, 0, 0)
    let rangeTimeStart = new Date(
        filterDate.value.getFullYear(),
        filterDate.value.getMonth(),
        filterDate.value.getDate()
    )
    let rangeTimeEnd = new Date(
        filterDate.value.getFullYear(),
        filterDate.value.getMonth(),
        filterDate.value.getDate()
    )
    rangeTimeStart.setHours(0, 0, 0, 0)
    if (filterDate.value.getTime() < todayStart) {
        rangeTimeEnd.setHours(23, 59, 59, 999)
        timeRange.value = [rangeTimeStart, rangeTimeEnd]
    } else {
        timeRange.value = [rangeTimeStart, new Date()]
    }
    refreshData()
}

onMounted(() => {
    hDiffData = []
    let dateStart = new Date()
    dateStart.setHours(0, 0, 0)
    timeRange.value = [dateStart, new Date()]
    refreshData()
})
onBeforeUnmount(() => {

    if (history_hDiffChart) {
        history_hDiffChart.dispose()
    }
    if (history_speedChart.value) {
        history_speedChart.value.dispose()
    }
    if (history_azimuthChart) {
        history_azimuthChart.dispose()
    }
})
</script>

<style lang="scss" scoped>
.historyDriveContainer {
    height: 100%;
    padding: 10px;

    overflow: hidden;

    .dateContainer {
        width: 510px;
        display: flex;
        align-items: center;
        margin-left: 10px;
        margin-top: 10px;
        margin-bottom: 30px;
    }

    .chartContainer {
        height: 700px;


        @media (max-width: 1919px) {
            padding: 10px 5%;
        }

        @media (min-width: 1920px) {
            padding: 20px 10%;
        }

        box-sizing: border-box;
        overflow: auto;

        >div {
            @media (max-width: 1919px) {
                height: 200px;
            }

            @media (min-width: 1920px) {
                height: 33%;
                padding-bottom: 30px;
                box-sizing: border-box;
            }

            p {
                margin: 0;
            }

            div {
                height: calc(100% - 30px);
                height: -webkit-calc(100% - 30px);
                height: -moz-calc(100% - 30px);
                width: 100%;
            }
        }
    }
}
</style>