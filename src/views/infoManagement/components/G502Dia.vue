<!--  -->
<template>
    <div>
        <el-dialog v-model="dialogVisible" :title="newRecords.id ? '编辑' : '新建'" width="544px" height="580px">
            <el-form style="width: 100%" ref="formRef" :model="newRecords" :rules="rules">
                <el-form-item label="设备类型" label-width="140px" prop="terminalType">
                    <el-select v-model="newRecords.terminalType" class="m-2" placeholder="请选择" width="120px"
                        style="width:100%" prop="terminalType">
                        <el-option value="AG360" label="G360" />
                        <el-option value="AG502" label="G502" />
                        <el-option value="AG501" label="G501" />
                    </el-select>
                </el-form-item>
                <el-form-item label="铭牌SN" label-width="140px" prop="npn">
                    <el-input v-model="newRecords.npn"></el-input>
                </el-form-item>
                <el-form-item label="质保日期" label-width="140px" prop="warrantyDate">
                    <el-input v-model="newRecords.warrantyDate"></el-input>
                </el-form-item>
                <el-form-item label="平板SN" label-width="140px" prop="sn">
                    <el-input v-model="newRecords.sn"></el-input>
                </el-form-item>
                <el-form-item label="电机SN" label-width="140px" prop="motorSn">
                    <el-input v-model="newRecords.motorSn"></el-input>
                </el-form-item>
                <el-form-item label="天线1_SN" label-width="140px" prop="antennaOne">
                    <el-input v-model="newRecords.antennaOne"></el-input>
                </el-form-item>
                <el-form-item label="天线2_SN" label-width="140px" prop="antennaTwo">
                    <el-input v-model="newRecords.antennaTwo"></el-input>
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
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { carModuleInfoSave_API, carModuleInfoUpdate_API } from '@/api/infoManagement/index'
import { changeResponseData, editResponseData } from "@/api/infoManagement/type"
const formRef = ref()
const props = defineProps({
    newRecords: {
        type: Object,
        default: {
            id: null,
            npn: '',
            warrantyDate: '',
            sn: '',
            motorSn: '',
            antennaTwo: '',
            antennaOne: '',
            terminalType: 'AG502',
            type: 'all'
        }
    }
})
const ApiData = reactive<any>({})
const dialogVisible = ref<boolean>(false)
defineExpose({ //
    dialogVisible,
    formRef,
});
const emits = defineEmits(['push'])
const editSubmit = async () => {
    Object.assign(ApiData, props.newRecords)
    await formRef.value.validate()
    editInfo()
    dialogVisible.value = false
}
const editInfo = async () => {
    const res: editResponseData = await carModuleInfoUpdate_API(ApiData)
    if (res.code == 0) {
        ElMessage({ type: 'success', message: '编辑成功' })
        emits('push', '')
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
    const res: changeResponseData = await carModuleInfoSave_API(ApiData)
    if (res.code == 0) {
        ElMessage({ type: 'success', message: '添加成功' })
        emits('push', '')
    }
    else {
        ElMessage({ type: 'error', message: '添加失败' })
    }
}
const submit = async () => {
    Object.assign(ApiData, props.newRecords)
    await formRef.value.validate()
    dialogVisible.value = false
    addInfo()
}
const validatorwarrantyDate = (rule: any, value: any, callBack: any) => {
    let zz = /^([1-2][0-9][0-9][0-9]-[0-1]{0,1}[0-9]-[0-3]{0,1}[0-9])\s(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/
    if (zz.test(value)) {
        callBack();
    } else {
        callBack(new Error("时间的格式应为:2010-01-01 09:11:23!"));
    }
};
const rules = {
    terminalType: [{ required: true, message: '请选择种类', trigger: 'blur' }],
    npn: [{ required: true, message: '请输入铭牌名称', trigger: 'blur' }],
    warrantyDate: [{ required: true, validator: validatorwarrantyDate }],
    sn: [{ required: true, message: '请输入平板SN', trigger: 'blur' }],
    motorSn: [{ required: true, message: '请输入电机SN', trigger: 'blur' }],
    antennaOne: [{ required: true, message: '请输入天线1_SN名称', trigger: 'blur' }],
    antennaTwo: [{ required: true, message: '请输入天线2_SN名称', trigger: 'blur' }],
}
</script>

<style lang="scss" scoped>
.dialog-footer {
    display: flex;
    justify-content: space-around;
}
</style>