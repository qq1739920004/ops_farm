<!--  -->
<template>
    <div>
        <el-dialog style="border-radius: 8px;" v-model="dialogVisible" title="车型模版" width="847px" height="336px" center>
            <div class="content">
                车辆类型：<el-select v-model="selectValue" class="m-2" placeholder="Select"
                    style="width: 170px;height: 32px;border-radius: 2px;background: rgba(255, 255, 255, 1);border: 1px solid rgba(220, 223, 230, 1);">
                    <el-option label="东方红" value="东方红" />
                    <el-option label="东风" value="东风" />
                </el-select>
            </div>
            <div class="tableData">
                <div class="line1">
                    <div>拖拉机厂家:</div><div class="data">东方红</div>
                    <div>型号:</div><div class="data">13m</div>
                    <div>农机轴距:</div><div class="data">13m</div>
                </div>
                <div class="line1 line2">
                    <div>农机前轮间距:</div><div class="data">13m</div>
                    <div>天线高度:</div><div class="data">13m</div>
                    <div>天线左距离:</div><div class="data">13m</div>
                </div>
                <div class="line1" style="margin-bottom:20px">
                    <div>天线前后偏移:</div><div class="data">13m</div>
                    <div>马力:</div><div class="data">13m</div>
                    <div>前轮陀螺:</div><div class="data">13m</div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const dialogVisible = ref<boolean>(false)
const selectValue = ref('东方红')
defineExpose({
    dialogVisible
}
)

</script>

<style lang="scss" scoped>
.content {
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0px;
    line-height: 23.17px;
    color: rgba(0, 0, 0, 1);
    margin-bottom: 18px;
    margin-left: 12px;

}

.tableData {
    .line1 {
        width: 795px;
        height: 50px;
        opacity: 1;
        background: rgba(233, 242, 242, 1);
        display: flex;
        align-items: center;

        div {
            width: 16.6%;
            text-align: right;

        }

        .data {
            text-align: left;
            display: block;
            width: 16.6%;
            margin-left: 20px;
            font-size: 16px;
            font-weight: 400;
            letter-spacing: 0px;
            color: rgba(0, 0, 0, 1);

        }
    }

    .line2 {
        background: rgba(255, 255, 255, 1);
    }
}
</style>