<template>
  <el-row :gutter="10">
    <el-col :span="8">
      <el-statistic
        :value="fmData?.device.onlineDevice"
        value-style="font-size:48px"
      >
        <template #suffix >
          <el-icon :size="10" color="rgb(67, 207, 124)" v-show="changeNumOnline >= 0">
            <Top />
          </el-icon>
          <el-icon :size="10" color="rgb(240, 37, 37)" v-show="changeNumOnline < 0">
            <Bottom />
          </el-icon>
          <span :class="[changeNumOnline >= 0 ? 'icon-greed' : 'icon-red']">{{
            Math.abs(Math.floor(changeNumOnline))
          }}</span>
        </template>
      </el-statistic>
      <div class="bottom_title">{{$t('statisticsReport.online')}}</div>
    </el-col>

    <el-col :span="8">
      <el-statistic
        :value="fmData?.workArea.todayArea"
        value-style="font-size:48px"
      >
      <template #suffix >
          <el-icon :size="10"  color="rgb(67, 207, 124)" v-show="changeNumtodayArea >= 0">
            <Top />
          </el-icon>
          <el-icon :size="10" color="rgb(240, 37, 37)" v-show="changeNumtodayArea < 0">
            <Bottom />
          </el-icon>
          <span :class="[changeNumtodayArea >= 0 ? 'icon-greed' : 'icon-red']">{{
            Math.abs(Math.floor(changeNumtodayArea))
          }}</span>
        </template>
      </el-statistic>
      <div class="bottom_title">{{$t('statisticsReport.todayWorkingArea')}}</div>
    </el-col>

    <el-col :span="8">
      <el-statistic :value="fmData?.car.newCar" value-style="font-size:48px">
        <template #suffix>
          <el-icon :size="10" color="rgb(67, 207, 124)" v-show="changeNumnewCar >= 0">
            <Top />
          </el-icon>
          <el-icon :size="10" color="rgb(240, 37, 37)" v-show="changeNumnewCar < 0">
            <Bottom />
          </el-icon>
          <span :class="[changeNumnewCar >= 0 ? 'icon-greed' : 'icon-red']">{{
            Math.abs(Math.floor(changeNumnewCar))
          }}</span>
        </template>
      </el-statistic>
      <div class="bottom_title">{{$t('statisticsReport.newVehicle')}}</div>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { watch, ref, PropType, onMounted } from "vue";
import type { FarmMachineObj } from "@/api/statisticsReport/type";
import socket from "@/store/socket";
import { Top, Bottom } from "@element-plus/icons-vue";
const realTime = socket();
let changeNumOnline = ref(0);
let changeNumtodayArea = ref(0);
let changeNumnewCar = ref(0);

const props = defineProps({
  farmMachineData: {
    type: Object as PropType<FarmMachineObj>,
  },
});
const fmData = ref<FarmMachineObj>();

onMounted(() => {
  fmData.value = props.farmMachineData;
});

watch(props, (newValue) => {
  fmData.value = newValue.farmMachineData;
});
watch(
  () => realTime.socketData,
  (newValue:any) => {
    console.log(newValue)
    console.log(343);
    if(newValue.type == "monitor"){
      if (fmData.value) {
      let tempNumOnline = newValue.data.onlineDevice - fmData.value.device.onlineDevice;
      // let tempNumtodayArea = newValue.totalDevice - fmData.value.workArea.todayArea;
      let tempNumnewCar = newValue.data.todayCar - fmData.value.car.newCar;
      changeNumOnline.value = tempNumOnline ? tempNumOnline : changeNumOnline.value;
      // changeNumtodayArea.value= newValue.totalDevice - fmData.value.workArea.todayArea;
      changeNumnewCar.value = tempNumnewCar ? tempNumnewCar : changeNumnewCar.value;
      fmData.value.device.onlineDevice = newValue.data.onlineDevice;
      // fmData.value.workArea.todayArea = newValue.totalDevice;
      fmData.value.car.newCar = newValue.data.todayCar;
    }
    }
    
  },
  { deep: true }
);
</script>

<style scoped>
.el-col {
  text-align: center;

  .el-statistic {
    margin-left: 12px;
  

    .icon-greed {
      font-size: 12px;
      color: rgba(67, 207, 124, 1);
    }
    .icon-red {
      font-size: 12px;
      color: rgb(240, 37, 37);
    }
  }

  .bottom_title {
    display: inline-flex;
    align-items: center;
    font-size: 18px;
    color: rgba(166, 166, 166, 1);
  }
}
</style>
