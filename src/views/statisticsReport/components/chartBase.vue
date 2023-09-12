
<template>
  <div class="chart-base">
    <div class="container" ref="main"></div>
    <time-box @timeSelect="timeSelect"></time-box>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted,PropType,watch} from "vue";
import * as echarts from "echarts";
import timeBox from './timeBox.vue';
const emits=defineEmits(['timeSelect'])
const props = defineProps({
  options: {
    type: Object as PropType<echarts.EChartsCoreOption>,
    default: () => ({})
  }
});
const main = ref()
let myChart: echarts.ECharts
function init() {
  myChart = echarts.init(main.value);
  window.addEventListener('resize', () => {
    myChart.resize()
  })
  myChart.showLoading();
}
function setOption(){
  myChart.setOption(props.options);
  myChart.hideLoading();
}
function timeSelect(data:any){
  emits('timeSelect',data)
  myChart.showLoading();
}
onMounted(
  () => {
    init()
  }
)
watch(() => props.options, () => {
  setOption()
}, { deep: true })
</script>


<style scoped lang="scss">
.chart-base{
  width: 100%;
  height: 100%;
  position: relative;
  border: 1px solid #e1e1e1;
}
.container {
  width: 100%;
  height: 100%;
}

</style>

