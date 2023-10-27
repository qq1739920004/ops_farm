<!--  -->
<template>
    <div>
        <el-dialog style="border-radius: 8px;" v-model="dialogVisible" :title="newRecords.id ? '编辑' : '新建'" width="544px"
            height="580px">
            <el-form label-width="140px" style="width: 90%" ref="formRef" :model="props.newRecords" :rules="rules">
                <el-form-item label="设备类型" prop="terminalType">
                    <el-select style="width: 100%;" v-model="props.newRecords.terminalType" class="m-2" placeholder="请选择"
                        prop="terminalType">
                        <el-option value="AG360" label="AG360" />
                        <el-option value="AG502" label="AG502" />
                        <el-option value="AG501" label="AG501" />
                    </el-select>
                </el-form-item>
                <el-form-item label="铭牌SN" prop="npn">
                    <el-input v-model="newRecords.npn"></el-input>
                </el-form-item>
                <el-form-item label="平板SN" prop="sn">
                    <el-input v-model="newRecords.sn"></el-input>
                </el-form-item>
                <el-form-item label="电机SN" prop="motorSn">
                    <el-input v-model="newRecords.motorSn"></el-input>
                </el-form-item>
                <el-form-item label="天线1_SN" prop="antennaOne">
                    <el-input v-model="newRecords.antennaOne"></el-input>
                </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
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
let formRef = ref()
const props = defineProps({
    newRecords: {
        type: Object,
        default: {
            id: null,
            npn: '',
            sn: '',
            motorSn: '',
            antennaOne: '',
            terminalType: 'AG501',
            type: 'all'
        }
    }
})
const emits = defineEmits(['push'])
const ApiData = reactive<any>({})
const dialogVisible = ref<boolean>(false)
defineExpose({
    dialogVisible,
    formRef
})
const editSubmit = async () => {
    Object.assign(ApiData, props.newRecords)
    await formRef.value.validate()
    editInfo()
    dialogVisible.value = false
}
const editInfo = async () => {
    try {
        await carModuleInfoUpdate_API(ApiData)
        ElMessage({ type: 'success', message: '编辑成功' })
        emits('push', '')
    }
    catch {
      //  ElMessage({ type: 'error', message: '编辑失败' })
    }
}

const addInfo = async () => {
    try {
        await carModuleInfoSave_API(ApiData)
        ElMessage({ type: 'success', message: '添加成功' })
        emits('push', '')
    }
    catch {
       // ElMessage({ type: 'error', message: '添加失败' })
    }
}
const submit = async () => {
    Object.assign(ApiData, props.newRecords)
    await formRef.value.validate()
    dialogVisible.value = false
    addInfo()
}


const rules = {
    terminalType: [{ required: true, message: '请选择种类', trigger: 'blur' },],
    npn: [{ required: true, message: '请输入铭牌名称', trigger: 'blur' },],
    sn: [{ required: true, message: '请输入平板SN', trigger: 'blur' }],
    motorSn: [{ required: true, message: '请输入电机SN', trigger: 'blur' }],
    antennaOne: [{ required: true, message: '请输入天线1_SN', trigger: 'blur' }],
}
</script>

<style lang="scss" scoped>
.dialog-footer {
    display: flex;
    justify-content: space-around;
}
</style>