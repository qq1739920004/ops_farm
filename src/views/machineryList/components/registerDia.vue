<!--  -->

<template>
    <div class="content">
        <el-dialog style="border-radius: 8px;" v-model="dialogVisible" title="注册设备" width="630px">
            <!-- <div class="content">
                <div class="up">
                    <span>注册设备SN号：{{ props.sn }}</span>

                </div>
                <div class="down">
                    <div>注册时长：</div>
                    <el-radio-group v-model="date" class="ml-4">
                        <el-radio :label="-1">立即过期</el-radio>
                        <el-radio :label="365">一年</el-radio>
                        <el-radio :label="65535">永久</el-radio>
                    </el-radio-group>
                </div>
            </div> -->
            <el-form style="width: 100%" label-width="160px">
                <el-form-item label="注册设备SN号:" label-width="198px">
                    <span class="span_title"> {{ props.sn }}</span>
                </el-form-item>
                <el-form-item label="注册时长:">
                    <el-radio-group v-model="date" class="ml-4">
                        <el-radio :label="-1">立即过期</el-radio>
                        <el-radio :label="365">一年</el-radio>
                        <el-radio :label="65535">永久</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="activationAddBtn">
                        配置
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { activationCodeAdd_API } from '@/api/machineryList/index'
const dialogVisible = ref<boolean>(false)
const props = defineProps(['carId', 'sn', 'deviceId'])
defineExpose({
    dialogVisible
}
)
const date = ref(365)
const activationAddBtn = async () => {
    dialogVisible.value = false
    try {
        await activationCodeAdd_API({
            carId: props.carId,
            oemSn: props.sn,
            deviceId: props.deviceId,
            date: date.value
        })
        ElMessage({ type: 'success', message: '注册成功' })
    }
    catch {
        ElMessage({ type: 'error', message: '注册失败' })
    }
}
</script>

<style lang="scss" scoped>
.content {

    :deep(.el-form-item__label) {
        font-size: 16px;
        font-weight: 400;

    }

    .span_title {
        font-size: 16px;
        font-weight: 400;

    }

    .ml-4 {

        .el-radio {
            font-size: 16px;
            font-weight: 400;

        }
    }

    :deep(.ml-4 .el-radio__label:hover) {
        color: var(--el-color-primary);

    }

    :deep(.ml-4 .el-radio__input.is-checked+.el-radio__label) {
        color: var(--el-color-primary);
    }

    :deep(.ml-4 .el-radio__input.is-checked .el-radio__inner) {
        background: var(--el-color-primary);
        border-color: var(--el-color-primary);
    }

    :deep(.ml-4 .el-radio__inner:hover) {
        border-color: var(--el-color-primary);
    }




}


.dialog-footer {
    display: flex;
    justify-content: center;
}
</style>