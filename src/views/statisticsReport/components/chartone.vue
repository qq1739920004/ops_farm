<template>
   

        <el-row :gutter="16">
        <el-col :span="8">
            <el-statistic :value="2661" value-style="font-size:48px">
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
            <el-statistic :value="2661" value-style="font-size:48px">
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
            <el-statistic :value="2661" value-style="font-size:48px">
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



</script>
  
<style scoped>

.el-col {
    text-align: center;

    .el-statistic {
        margin-left: 12px;

        .el-icon {
            margin-left: 4px;
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
  