<template>
  <div class="tab-content job-stats-content">
    <div class="stats-overview">
      <div class="stats-card">
        <div class="stats-icon">
          <img src="/src/assets/icons/total_work.svg" :alt="t('work.totalWorkArea')" width="56" height="56">
        </div>
        <div class="stats-content">
          <h3>{{ t('work.totalWorkArea') }}</h3>
          <p class="stats-value">{{ statsData.totalWorkArea.toFixed(2) }} <span>{{ t('work.areaUnit') }}</span></p>
          <p class="stats-desc">{{ t('work.allTime') }}</p>
        </div>
      </div>

      <div class="stats-card">
        <div class="stats-icon">
          <img src="/src/assets/icons/year_work.svg" :alt="t('work.yearWorkArea')" width="56" height="56">
        </div>
        <div class="stats-content">
          <h3>{{ t('work.yearWorkArea') }}</h3>
          <p class="stats-value">{{ statsData.currentYearWorkArea.toFixed(2) }} <span>{{ t('work.areaUnit') }}</span></p>
          <p class="stats-desc">{{ new Date().getFullYear() }}{{ t('work.year') }}</p>
        </div>
      </div>

      <div class="stats-card">
        <div class="stats-icon">
          <img src="/src/assets/icons/day_work.svg" :alt="t('messages.todaysOperation')" width="56" height="56">
        </div>
        <div class="stats-content">
          <h3>{{ t('messages.todaysOperation') }}</h3>
          <p class="stats-value">{{ statsData.todayWorkArea.toFixed(2) }} <span>{{ t('work.areaUnit') }}</span></p>
          <p class="stats-desc">{{ formatToday() }}</p>
        </div>
      </div>

      <div class="stats-card">
        <div class="stats-icon">
          <img src="/src/assets/icons/time_work.svg" :alt="t('work.todayWorkDuration')" width="56" height="56">
        </div>
        <div class="stats-content">
          <h3>{{ t('work.todayWorkDuration') }}</h3>
          <p class="stats-value">{{ statsData.todayCountNum }} <span>{{ t('work.durationUnit') }}</span></p>
          <p class="stats-desc">{{ formatToday() }}</p>
        </div>
      </div>
    </div>

    <div class="detailed-data-section">
      <div class="left-panel">
        <div class="control-panel">
          <div class="date-controls">
            <el-select v-model="selectedYear" :placeholder="t('work.selectYear')" class="year-select">
              <el-option v-for="year in yearOptions" :key="year" :label="year + t('work.year')" :value="year" />
            </el-select>
            <el-select v-model="selectedMonth" :placeholder="t('work.selectMonth')" class="month-select">
              <el-option v-for="month in monthOptions" :key="month" :label="month + t('work.month')" :value="month" />
            </el-select>
          </div>
          <div class="view-toggle">
            <div class="toggle-buttons">
              <div class="toggle-button" :class="{ active: viewMode === 'year' }" @click="viewMode = 'year'">{{ t('work.year') }}</div>
              <div class="toggle-button" :class="{ active: viewMode === 'month' }" @click="viewMode = 'month'">{{ t('work.month') }}</div>
            </div>
          </div>
        </div>

        <div class="data-grid">
          <div v-if="viewMode === 'year'" class="month-grid">
            <div v-for="month in 12" :key="month" class="month-card" :class="{ active: selectedMonth === month }"
              @click="selectMonth(month)">
              <div class="month-title">{{ month }}{{ t('work.month') }}</div>
              <div class="month-data">
                <div class="data-item">
                  <span class="value" :class="{ 'zero-data': getMonthData(month, 'area') === 0 }">
                    <span v-if="getMonthData(month, 'area') > 0"><i class="dot"></i>{{ getMonthData(month, 'area') }}
                      {{ t('work.areaUnit') }}</span>
                  </span>
                </div>
                <div class="data-item">
                  <span class="value" :class="{ 'zero-data': getMonthData(month, 'hours') === 0 }">
                    <span v-if="getMonthData(month, 'hours') > 0" style="color: #feac03;"><i class="dot"
                        style="background-color: #feac03;"></i>{{ getMonthData(month, 'hours') }} {{ t('work.durationUnit') }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="day-grid">
            <div v-for="day in getDaysInMonth(selectedYear, selectedMonth)" :key="day" class="day-card"
              :class="{ active: selectedDay === day, 'has-data': getDayData(day, 'area') > 0 }" @click="selectDay(day)">
              <div class="day-title">{{ day }}{{ t('work.day') }}</div>
              <div class="day-data">
                <div class="data-item">
                  <span class="value" :class="{ 'zero-data': getDayData(day, 'area') === 0 }">
                    <span v-if="getDayData(day, 'area') > 0"><i
                        style="display:inline-block;width:8px;height:8px;border-radius:50%;background-color:#41cb79;margin-right:4px;"></i>{{
                          getDayData(day, 'area') }} {{ t('work.areaUnit') }}</span>
                  </span>
                </div>
                <div class="data-item">
                  <span class="value" :class="{ 'zero-data': getDayData(day, 'hours') === 0 }">
                    <span v-if="getDayData(day, 'hours') > 0"><i
                        style="display:inline-block;width:8px;height:8px;border-radius:50%;background-color:#feac03;margin-right:4px;"></i>{{
                          getDayData(day, 'hours') }} {{ t('work.durationUnit') }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="right-panel">
        <div class="chart-container">
          <div ref="trendChart" class="trend-chart"></div>
        </div>
        <div class="chart-container">
          <div ref="ringChart" class="ring-chart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { getCarWorkAreaStats_path, getVehicleDailyWorkAreaStats_path, getVehicleMonthlyWorkAreaStats_path,getVehicleMonthlyWorkAreaStats_type_path } from '@/api/carManagement/index'
import * as echarts from 'echarts'

const { t } = useI18n()

const props = defineProps({
  vehicle: { type: Object, required: true },
  active: { type: Boolean, default: true }
})

const statsData = reactive({ totalWorkArea: 0, currentYearWorkArea: 0, todayWorkArea: 0, todayCountNum: 0 })
const selectedYear = ref(new Date().getFullYear())
const selectedMonth = ref(new Date().getMonth() + 1)
const selectedDay = ref(new Date().getDate())
const viewMode = ref('year')

const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = currentYear - 5; i <= currentYear; i++) years.push(i)
  return years
})
const monthOptions = computed(() => Array.from({ length: 12 }, (_, i) => i + 1))

const detailedData = reactive({ monthlyData: {}, dailyData: {} })
const monthlyOperationTypeData = ref({ totalMonthAreaMu: 0, operationTypeAreaList: [] })

const trendChart = ref(null)
const ringChart = ref(null)
let trendChartResizeHandler = null
let ringChartResizeHandler = null

const formatToday = () => {
  const today = new Date()
  return `${today.getMonth() + 1}${t('work.month')}${today.getDate()}${t('work.day')}`
}

const getJobStats = async () => {
  try {
    if (!props.vehicle?.id) { ElMessage.warning(t('work.vehicleInfoIncomplete')); return }
    const res = await getCarWorkAreaStats_path({ vehicleId: props.vehicle.id })
    if (res && res.code === 0 && res.data) {
      const d = res.data
      statsData.totalWorkArea = d.totalWorkArea || 0
      statsData.currentYearWorkArea = d.currentYearWorkArea || 0
      statsData.todayWorkArea = d.todayWorkArea || 0
      //秒换算成小时
      statsData.todayCountNum = Math.round(d.todayCountNum / 3600 * 100) / 100
    } else {
      ElMessage.warning(t('work.getStatsFailed'))
      statsData.totalWorkArea = 0
      statsData.currentYearWorkArea = 0
      statsData.todayWorkArea = 0
      statsData.todayCountNum = 0
    }
  } catch (e) {
    ElMessage.error(t('work.getStatsFailed'))
    statsData.totalWorkArea = 0
    statsData.currentYearWorkArea = 0
    statsData.todayWorkArea = 0
    statsData.todayCountNum = 0
  }
}

const getMonthData = (month, type) => {
  const y = detailedData.monthlyData[selectedYear.value]
  if (!y || !y[month]) return 0
  return type === 'area' ? y[month].area : y[month].hours
}

const getDayData = (day, type) => {
  const key = `${selectedYear.value}-${selectedMonth.value}`
  const m = detailedData.dailyData[key]
  if (!m || !m[day]) return 0
  return type === 'area' ? m[day].area : m[day].hours
}

const getDaysInMonth = (year, month) => {
  const days = new Date(year, month, 0).getDate()
  return Array.from({ length: days }, (_, i) => i + 1)
}

const selectMonth = async (month) => {
  selectedMonth.value = month
  await getDailyWorkData(selectedYear.value, month)
  await getMonthlyOperationTypeData(selectedYear.value, month)
  updateCharts()
}

const selectDay = (day) => { selectedDay.value = day }

const getYearlyMonthlyData = async (year) => {
  try {
    if (!props.vehicle?.id) return
    const res = await getVehicleMonthlyWorkAreaStats_path({ vehicleId: props.vehicle.id, year })
    if (res && res.code === 0 && res.data) {
      detailedData.monthlyData[year] = {}
      res.data.forEach(m => {
        if (m.month) detailedData.monthlyData[year][m.month] = { area: m.totalWorkAreaMu || 0, hours: m.totalWorkDuration ? Math.round(m.totalWorkDuration / 3600 * 100) / 100 : 0 }
      })
    } else {
      detailedData.monthlyData[year] = {}
    }
  } catch (e) {
    detailedData.monthlyData[year] = {}
  }
}

const getDailyWorkData = async (year, month) => {
  try {
    if (!props.vehicle?.id) return
    const res = await getVehicleDailyWorkAreaStats_path({ vehicleId: props.vehicle.id, year, month })
    if (res && res.code === 0 && res.data) {
      const key = `${year}-${month}`
      detailedData.dailyData[key] = {}
      res.data.forEach(d => {
        if (d.date) {
          const day = new Date(d.date).getDate()
          detailedData.dailyData[key][day] = { area: d.workArea || 0, hours: d.workDuration ? Math.round(d.workDuration / 3600 * 100) / 100 : 0 }
        }
      })
    } else {
      detailedData.dailyData[`${year}-${month}`] = {}
    }
  } catch (e) {
    detailedData.dailyData[`${year}-${month}`] = {}
  }
}

const getMonthlyOperationTypeData = async (year, month) => {
  try {
    if (!props.vehicle?.id) return
    const res = await getVehicleMonthlyWorkAreaStats_type_path({ vehicleId: props.vehicle.id, year, month })
    if (res && res.code === 0 && res.data) {
      monthlyOperationTypeData.value = {
        totalMonthAreaMu: res.data.totalMonthAreaMu || 0,
        operationTypeAreaList: res.data.operationTypeAreaList || []
      }
    } else {
      monthlyOperationTypeData.value = { totalMonthAreaMu: 0, operationTypeAreaList: [] }
    }
  } catch (e) {
    monthlyOperationTypeData.value = { totalMonthAreaMu: 0, operationTypeAreaList: [] }
  }
}

const updateCharts = async () => {
  await nextTick()
  const key = `${selectedYear.value}-${selectedMonth.value}`
  const monthData = detailedData.dailyData[key] || {}
  const daysInMonth = getDaysInMonth(selectedYear.value, selectedMonth.value)
  const dates = daysInMonth.map(d => `${selectedMonth.value}/${d}`)
  const areaData = daysInMonth.map(d => monthData[d]?.area || 0)
  const hoursData = daysInMonth.map(d => monthData[d]?.hours || 0)

  const trendOptions = {
    title: { text: `${selectedYear.value}${t('work.year')}${selectedMonth.value}${t('work.month')}${t('work.workTrend')}`, left: 'center', top: '2%', textStyle: { color: '#333', fontSize: 16 } },
    tooltip: { show: true, trigger: 'axis', backgroundColor: 'rgba(0,0,0,0.8)', borderColor: '#3aed81', borderWidth: 1, textStyle: { color: '#fff', fontSize: 14 }, confine: false, appendToBody: true, extraCssText: 'z-index: 99999 !important; pointer-events: auto !important;' },
    legend: { data: [t('work.workArea'), t('work.duration')], top: '18%', textStyle: { color: '#a0a8b8' } },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '30%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: dates, axisLine: { lineStyle: { color: 'rgba(58,237,129,0.3)' } }, axisLabel: { color: '#a0a8b8', fontSize: 10 }, splitLine: { show: false } },
    yAxis: [
      { type: 'value', name: `${t('work.area')}(${t('work.areaUnit')})`, position: 'left', nameTextStyle: { color: '#000000', fontSize: 12 }, axisLine: { lineStyle: { color: 'rgba(58,237,129,0.3)' } }, axisLabel: { color: '#a0a8b8' }, splitLine: { show: true, lineStyle: { color: 'rgba(58,237,129,0.1)', type: 'solid' } } },
      { type: 'value', name: `${t('work.duration')}(${t('work.durationUnit')})`, position: 'right', nameTextStyle: { color: '#000000', fontSize: 12 }, axisLine: { lineStyle: { color: 'rgba(255,165,0,0.3)' } }, axisLabel: { color: '#a0a8b8' }, splitLine: { show: true, lineStyle: { color: 'rgba(58,237,129,0.1)', type: 'solid' } } }
    ],
    series: [
      { name: t('work.workArea'), type: 'line', data: areaData, smooth: true, lineStyle: { color: '#33b838' }, itemStyle: { color: '#33b838' }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(67,207,124,0.3)' }, { offset: 1, color: 'rgba(67,207,124,0.1)' }] } } },
      { name: t('work.duration'), type: 'line', yAxisIndex: 1, data: hoursData, smooth: true, lineStyle: { color: '#feac03' }, itemStyle: { color: '#feac03' } }
    ]
  }

  const operationTypeList = monthlyOperationTypeData.value.operationTypeAreaList || []
  const totalMonthArea = monthlyOperationTypeData.value.totalMonthAreaMu || 0
  
  const pieData = operationTypeList.length > 0 
    ? operationTypeList.map((item, index) => ({
        value: item.areaMu || 0,
        name: item.operationName || t('work.unknownType'),
        itemStyle: { 
          color: ['#33b838', '#feac03', '#3aed81', '#00bfff', '#ff6b6b', '#9b59b6'][index % 6]
        }
      }))
    : [{ value: 1, name: t('work.noData'), itemStyle: { color: 'rgba(58,237,129,0.2)' } }]
  
  const ringOptions = {
    title: { 
      text: `${selectedMonth.value}${t('work.month')}${t('work.workTypeDistribution')}(${t('work.areaUnit')})`, 
      left: 'center', 
      top: '0%', 
      textStyle: { fontSize: 16, color: '#333' } 
    },
    tooltip: { 
      show: true,
      trigger: 'item',
      formatter: (params) => {
        // 如果是无数据的占位项，只显示提示信息
        if (operationTypeList.length === 0) {
          return params.name
        }
        return `${params.name}: ${Number(params.value).toFixed(1)} ${t('work.areaUnit')}`
      },
      appendToBody: true,
      extraCssText: 'z-index: 9999; position: absolute;'
    },
    legend: {
      orient: 'vertical',
      right: '15%',
      top: 'center',
      textStyle: { color: '#a0a8b8', fontSize: 12 },
      show: operationTypeList.length > 0,
      tooltip: { show: false }
    },
    series: [{ 
      type: 'pie', 
      radius: ['45%', '80%'], 
      center: ['35%', '55%'], 
      data: pieData,
      label: { 
        show: operationTypeList.length > 0,
        position: 'inside',
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        formatter: (params) => (Number(params.value) > 0 ? `${Number(params.value).toFixed(1)}` : '')
      },
      labelLine: { show: false },
      emphasis: { 
        label: { show: true },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      animation: true, 
      animationDuration: 2000 
    }]
  }

  if (trendChart.value) {
    try {
      if (trendChart.value._chartInstance) trendChart.value._chartInstance.dispose()
      trendChart.value._chartInstance = echarts.init(trendChart.value)
      trendChart.value._chartInstance.setOption(trendOptions)
      if (trendChartResizeHandler) window.removeEventListener('resize', trendChartResizeHandler)
      trendChartResizeHandler = () => { if (trendChart.value._chartInstance) trendChart.value._chartInstance.resize() }
      window.addEventListener('resize', trendChartResizeHandler)
    } catch (e) { }
  }
  if (ringChart.value) {
    try {
      if (ringChart.value._chartInstance) ringChart.value._chartInstance.dispose()
      ringChart.value._chartInstance = echarts.init(ringChart.value)
      ringChart.value._chartInstance.setOption(ringOptions)
      if (ringChartResizeHandler) window.removeEventListener('resize', ringChartResizeHandler)
      ringChartResizeHandler = () => { if (ringChart.value._chartInstance) ringChart.value._chartInstance.resize() }
      window.addEventListener('resize', ringChartResizeHandler)
    } catch (e) { }
  }
}

const initCharts = async () => { await nextTick(); if (trendChart.value || ringChart.value) updateCharts() }

const loadDataAndInit = async () => {
  if (!props.vehicle?.id) return
  await getJobStats()
  await getYearlyMonthlyData(selectedYear.value)
  await getDailyWorkData(selectedYear.value, selectedMonth.value)
  await getMonthlyOperationTypeData(selectedYear.value, selectedMonth.value)
  setTimeout(() => { initCharts() }, 300)
}

watch(() => props.vehicle?.id, async (nv) => { if (nv && props.active) await loadDataAndInit() })
watch(() => props.active, async (active) => { if (active && props.vehicle?.id) await loadDataAndInit() })

watch(selectedYear, async () => { if (props.vehicle?.id) { await getYearlyMonthlyData(selectedYear.value); await getDailyWorkData(selectedYear.value, selectedMonth.value); await getMonthlyOperationTypeData(selectedYear.value, selectedMonth.value); setTimeout(() => { updateCharts() }, 100) } })
watch(selectedMonth, async () => { if (props.vehicle?.id) { await getDailyWorkData(selectedYear.value, selectedMonth.value); await getMonthlyOperationTypeData(selectedYear.value, selectedMonth.value); setTimeout(() => { updateCharts() }, 100) } })
watch(viewMode, () => { setTimeout(() => { updateCharts() }, 100) })

onMounted(async () => { if (props.active && props.vehicle?.id) await loadDataAndInit() })
onUnmounted(() => {
  if (trendChart.value?._chartInstance) trendChart.value._chartInstance.dispose()
  if (ringChart.value?._chartInstance) ringChart.value._chartInstance.dispose()
  if (trendChartResizeHandler) { window.removeEventListener('resize', trendChartResizeHandler); trendChartResizeHandler = null }
  if (ringChartResizeHandler) { window.removeEventListener('resize', ringChartResizeHandler); ringChartResizeHandler = null }
})

defineExpose({ reload: loadDataAndInit })
</script>

<style lang="scss" scoped>
@use "sass:math";
// px 转为 vw 的函数
$designWidth: 1920;
$designHeight: 937;

@function vw($px) {
  @return math.div($px, $designWidth) * 100vw;
}

// px 转为 vh 的函数
@function vh($px) {
  @return math.div($px, $designHeight) * 100vh;
}

$primary-color: #42b983;

:root {
  --main-background-color: rgba(0, 0, 0, 0.58);
  --theme-color: #2E4794;
  --border-color: #409eff;
}

.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #41cb79;
  margin-right: 4px;
}

.tab-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding-bottom: 14px;
  height: 100%;
}

.job-stats-content {
  .stats-overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(vw(280), 1fr));
    gap: vw(20);
    margin-top: vh(6);
    align-items: start;

    .stats-card {
      border: 1px solid rgba(51, 184, 56, 1);
      border-radius: vw(12);
      padding: vh(16) vw(20);
      display: flex;
      align-items: center;
      min-height: vh(110);
      transition: all 0.3s ease;

      &:hover {
        background: rgba(67, 207, 124, 0.15);
        border-color: rgba(67, 207, 124, 0.5);
        transform: translateY(-vh(2));
      }

      .stats-icon {
        margin-right: vw(25);
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
          width: vw(48);
          height: vh(48);
        }
      }

      .stats-content {
        flex: 1;

        h3 {
          color: #000000;
          font-size: vw(18);
          margin: 0 0 vh(10) 0;
          font-weight: normal;
        }

        .stats-value {
          color: #33b838;
          font-size: vw(28);
          font-weight: bold;
          margin: 0 0 vw(5) 0;
          line-height: 1.2;

          span {
            font-size: vw(20);
          }
        }

        .stats-desc {
          color: #6b7280;
          font-size: vw(14);
          margin: 0;
          opacity: 0.8;
        }
      }
    }
  }

  .detailed-data-section {
    display: flex;
    gap: vw(30);
    margin-top: vh(10);
    flex: 1;
    min-height: 0;

    .left-panel {
      flex: 0 0 63%;
      display: flex;
      border: 1px solid #33b838;
      padding: vh(16) vw(20);
      border-radius: vw(12);
      flex-direction: column;

      .control-panel {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: vh(5);
        // padding-bottom: vh(2);
        // border-bottom: 1px solid rgba(67, 207, 124, 0.2);

        .date-controls {
          display: flex;
          gap: vw(15);

          :deep(.el-select) {
            width: vw(150);

            .el-input__wrapper {
              background: rgba(67, 207, 124, 0.1);
              border: 1px solid rgba(67, 207, 124, 0.3);
              box-shadow: none;

              &.is-focus {
                border-color: rgba(67, 207, 124, 0.8);
              }

              .el-input__inner {
                color: #ffffff;
                font-size: vw(12);

                &::placeholder {
                  color: #6b7280;
                }
              }
            }
          }

          :deep(.el-select-dropdown) {
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid rgba(67, 207, 124, 0.3);

            .el-select-dropdown__item {
              color: #ffffff;

              &:hover {
                background: rgba(67, 207, 124, 0.2);
              }

              &.selected {
                background: rgba(67, 207, 124, 0.3);
                color: #43cf7c;
              }
            }
          }
        }

        .view-toggle {
          .toggle-buttons {
            display: flex;
            border-radius: vw(6);
            overflow: hidden;

            .toggle-button {
              border: 1px solid rgba(67, 207, 124, 0.3);
              padding: vh(8) vw(20);
              color: #a0a8b8;
              font-size: vw(14);
              cursor: pointer;
              transition: all 0.3s ease;
              border-right: none;

              &:first-child {
                border-radius: vw(6) 0 0 vw(6);
                border-right: 1px solid rgba(67, 207, 124, 0.3);
              }

              &:last-child {
                border-radius: 0 vw(6) vw(6) 0;
                border-right: 1px solid rgba(67, 207, 124, 0.3);
              }

              &:hover {
                background: rgba(67, 207, 124, 0.2);
                color: #43cf7c;
              }

              &.active {
                border-color: #33b838;
                color: #33b838;
                font-weight: bold;
              }
            }
          }
        }
      }

      .data-grid {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;

        .month-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: vw(15);
          height: 100%;
          flex: 1;

          .month-card {
            border: 1px solid rgba(67, 207, 124, 0.3);
            border-radius: vw(8);
            padding: vh(8) vw(12);
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
              background: rgba(67, 207, 124, 0.15);
              border-color: rgba(67, 207, 124, 0.5);
              transform: translateY(-vh(2));
            }

            &.active {
              border-color: #33b838;

              .month-title {
                color: #000000;
              }
            }

            .month-title {
              color: #747474;
              font-size: 14px;
              font-weight: bold;
              margin-bottom: vh(16);
              text-align: center;
            }

            .month-data {
              .data-item {
                display: flex;
                justify-content: center;
                margin-bottom: vh(5);
                font-size: vw(14);

                .label {
                  color: white;
                }

                .value {
                  color: #33b838;
                  font-weight: bold;
                  min-width: vw(100);

                  &.zero-data {
                    color: #a0a8b8;
                  }
                }
              }
            }
          }
        }

        .day-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          grid-template-rows: repeat(5, 1fr);
          gap: vw(8);
          height: 100%;
          flex: 1;

          .day-card {
            border: 1px solid rgba(67, 207, 124, 0.2);
            border-radius: vw(6);
            padding: vh(8) vw(8);
            cursor: pointer;
            transition: all 0.3s ease;
            min-height: vh(60);
            display: flex;
            flex-direction: column;
            justify-content: center;

            &.has-data {
              background: rgba(67, 207, 124, 0.1);
              border-color: rgba(67, 207, 124, 0.3);
            }

            &:hover {
              background: rgba(67, 207, 124, 0.15);
              border-color: rgba(67, 207, 124, 0.5);
            }

            &.active {
              border-color: #43cf7c;

              .day-title {
                color: #43cf7c;
              }
            }

            .day-title {
              color: #747474;
              font-size: vw(16);
              font-weight: bold;
              display: flex;
              justify-content: center;
              margin-bottom: vh(5);
            }

            .day-data {
              .data-item {
                display: flex;
                justify-content: center;
                margin-bottom: vh(2);
                font-size: vw(12);

                .value {
                  color: #43cf7c;
                  font-weight: bold;
                  min-width: vw(76);

                  &.zero-data {
                    color: #a0a8b8;
                  }
                }
              }
            }
          }
        }
      }
    }

    .right-panel {
      flex: 0 0 35%;
      display: flex;
      flex-direction: column;
      gap: vh(20);
      height: 100%;

      .chart-container {
        flex: 1;
        border: 1px solid #33b838;
        border-radius: vw(12);
        padding: vh(10) vw(10) 0;
        display: flex;
        flex-direction: column;
        max-height: calc(50% - vh(10));

        .chart-title {
          color: #43cf7c;
          font-size: vw(16);
          font-weight: bold;
          margin-bottom: vh(10);
          text-align: center;
          flex-shrink: 0;
        }

        .trend-chart,
        .ring-chart {
          flex: 1;
          min-height: vh(150);
          width: 100%;
        }
      }
    }
  }
}
</style>
