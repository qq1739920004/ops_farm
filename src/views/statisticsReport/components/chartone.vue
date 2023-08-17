<template>
   

        <el-row :gutter="16">
        <el-col :span="8">
            <el-statistic :value=fmData?.device.onlineDevice value-style="font-size:48px">
                <template #suffix>
                    <el-icon :size="10">
                        <Top />
                    </el-icon>
                    <span class="icon_title">11</span>
                </template>
            </el-statistic>
            <div class="bottom_title">
                车辆在线数
            </div>
        </el-col>

        <el-col :span="8">
            <el-statistic :value=fmData?.workArea.todayArea value-style="font-size:48px">
                <template #suffix>

                    <el-icon :size="10">
                        <Top />
                    </el-icon>
                    <span class="icon_title">11</span>
                </template>
            </el-statistic>
            <div class="bottom_title">
                今日作业面积(亩)
            </div>
        </el-col>

        <el-col :span="8">
            <el-statistic :value=fmData?.car.newCar value-style="font-size:48px">
                <template #suffix>

                    <el-icon :size="10">
                        <Top />
                    </el-icon>
                    <span class="icon_title">11</span>
                </template>
            </el-statistic>
            <div class="bottom_title">
                今日新增车辆
            </div>
        </el-col>


    </el-row>
  
   
</template>
  
<script lang="ts" setup>
import { watch,ref,PropType, onMounted } from 'vue';
import type{ FarmMachineObj } from '@/api/statisticsReport/type';

const props = defineProps({
    farmMachineData: {
        type: Object as PropType<FarmMachineObj> 
    }
})
const fmData=ref<FarmMachineObj>()

onMounted(()=>{
    fmData.value=props.farmMachineData
})

watch(props, (newValue) => {
    fmData.value=newValue.farmMachineData
    console.log('  farmMachineData', props.farmMachineData)
});


</script>
  
<style scoped>

.el-col {
    text-align: center;

    .el-statistic {
        margin-left: 12px;
        .el-icon {
            color: rgba(67, 207, 124, 1);
            background-color: rgba(222, 255, 235, 1);
        }

        .icon_title {
            font-size: 12px;
            color: rgba(67, 207, 124, 1);
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
  