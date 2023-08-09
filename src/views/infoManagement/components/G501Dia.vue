<!--  -->
<template>
    <div>
        <el-dialog v-model="dialogVisible" :title="newRecords.id ? '编辑' : '新建'" width="544px" height="580px">
            <el-form style="width: 100%" ref="formRef" :model="newRecords" :rules="rules">
                <el-form-item label="设备类型" label-width="140px" prop="terminalType">
                    <el-select v-model="newRecords.terminalType" class="m-2" placeholder="请选择" width="120px"
                        style="width:100%" prop="terminalType">
                        <el-option value="G360" label="G360" />
                        <el-option value="G502" label="G502" />
                        <el-option value="G501" label="G501" />
                    </el-select>
                </el-form-item>
                <el-form-item label="铭牌SN" label-width="140px" prop="npn">
                    <el-input v-model="newRecords.npn"></el-input>
                </el-form-item>
                <el-form-item label="质保日期" label-width="140px" prop="expirationTime">
                    <el-input v-model="newRecords.expirationTime"></el-input>
                </el-form-item>
                <el-form-item label="平板SN" label-width="140px" prop="sn">
                    <el-input v-model="newRecords.sn"></el-input>
                </el-form-item>
                <el-form-item label="电机SN" label-width="140px" prop="motorSn">
                    <el-input v-model="newRecords.motorSn"></el-input>
                </el-form-item>
                <el-form-item label="天线1_SN" label-width="140px" prop="wheelImuSn">
                    <el-input v-model="newRecords.wheelImuSn"></el-input>
                </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button type="danger" @click="cancel">取消</el-button>
                    <el-button type="primary" v-if="!newRecords.id" @click="submit">
                        确定
                    </el-button>
                    <el-button type="primary" v-else @click="editSubmit">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { carModuleInfoSave_API, carModuleInfoUpdate_API } from '@/api/infoManagement/index'
import { changeResponseData, editResponseData } from "@/api/infoManagement/type"
let formRef = ref()
const props = defineProps({
    newRecords: {
        type: Object,
        default: {
            npn: '',
            expirationTime: '',
            sn: '',
            motorSn: '',
            wheelImuSn: '',
            terminalType: 'G501'
        }
    }
})
const dialogVisible = ref<boolean>(false)
defineExpose({ //
    dialogVisible,
    formRef
});
const editSubmit = async () => {
    await formRef.value.validate()
    editInfo()
    dialogVisible.value = false
}
const editInfo = async () => {
    const res: editResponseData = await carModuleInfoUpdate_API(props.newRecords.value)
    if (res.code == 200) {
        ElMessage({ type: 'success', message: '编辑成功' })
    }
    else {
        ElMessage({ type: 'error', message: '编辑失败' })
    }
}
const cancel = () => {
    dialogVisible.value = false
    formRef.value.resetFields()
}
const addInfo = async () => {
    const res: changeResponseData = await carModuleInfoSave_API(props.newRecords.value)
    if (res.code == 200) {
        ElMessage({ type: 'success', message: '添加成功' })
    }
    else {
        ElMessage({ type: 'error', message: '添加失败' })
    }
}
const submit = async () => {
    await formRef.value.validate()
    dialogVisible.value = false
    addInfo()
}
const rules = {
    terminalType: [{ required: true, message: '请输入活动名称', trigger: 'blur' }, { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
    npn: [{ required: true, message: '请输入铭牌名称', trigger: 'blur' }, { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
    expirationTime: [{ required: true, message: '请输入质保日期', trigger: 'blur' }],
    sn: [{ required: true, message: '请输入平板SN', trigger: 'blur' }],
    motorSn: [{ required: true, message: '请输入电机SN', trigger: 'blur' }],
    wheelImuSn: [{ required: true, message: '天线1_SN', trigger: 'blur' }],
}
</script>

<style lang="scss" scoped>
    .dialog-footer {
        display: flex;
        justify-content: space-around;
    }
</style>