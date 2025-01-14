<!--  -->
<template>
    <div>
        <el-dialog style="border-radius: 8px;" v-model="dialogVisible" :title="newRecords.id ? $t('work.edit') :  $t('work.new')" width="544px"
            height="580px">
            <el-form label-width="140px" style="width: 90%" ref="formRef" :model="props.newRecords" :rules="rules">
                <el-form-item :label="$t('work.deviceType')" prop="terminalType">
                    <el-select style="width: 100%;" v-model="props.newRecords.terminalType" class="m-2" :placeholder="$t('work.pleaseSelect')"
                        prop="terminalType">
                        <!-- <el-option value="AG360" label="AG360" /> -->
                        <el-option value="AG502" label="AG502" />
                        <el-option value="AG501" label="AG501" />
                        <el-option value="AG502_JP" label="AG502JP" />
                        <el-option value="AG501PRO_JP" label="AG501PROJP" />
                        <el-option value="MT802" label="MT802" />
                        <el-option value="MT901" label="MT901" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('work.labelSN')" prop="npn">
                    <el-input v-model="newRecords.npn"></el-input>
                </el-form-item>
                <el-form-item :label="$t('work.PlateSN')" prop="sn">
                    <el-input v-model="newRecords.sn"></el-input>
                </el-form-item>
                <el-form-item :label="$t('work.motorSN')" prop="motorSn">
                    <el-input v-model="newRecords.motorSn"></el-input>
                </el-form-item>
                <el-form-item :label="$t('work.Antenna1_SN')" prop="antennaOne">
                    <el-input v-model="newRecords.antennaOne"></el-input>
                </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" v-if="!newRecords.id" @click="submit">
                        {{ $t('work.submit') }}
                    </el-button>
                    <el-button type="primary" v-else @click="editSubmit">
                        {{ $t('work.submit') }}
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from "vue-i18n";
const { t } = useI18n();
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
        ElMessage({ type: 'success', message: t('work.editSuccess') })
        emits('push', '')
    }
    catch {
      //  ElMessage({ type: 'error', message: '编辑失败' })
    }
}

const addInfo = async () => {
    try {
        await carModuleInfoSave_API(ApiData)
        ElMessage({ type: 'success', message: t('messages.addSuccess') })
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
    terminalType: [{ required: true, message: t('messages.plzenter'), trigger: 'blur' },],
    npn: [{ required: true, message: t('messages.plzenter'), trigger: 'blur' },],
    sn: [{ required: true, message:t('messages.plzenter') ,trigger: 'blur' }],
    motorSn: [{ required: true, message: t('messages.plzenter'), trigger: 'blur' }],
    antennaOne: [{ required: true, message: t('messages.plzenter'), trigger: 'blur' }],
}
</script>

<style lang="scss" scoped>
.dialog-footer {
    display: flex;
    justify-content: space-around;
}
</style>