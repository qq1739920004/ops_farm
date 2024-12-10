<!--  -->
<template>
    <div class="app_container ">
        <div class="table_container app_card">
            <div class="middle-area">
                <div class="left ">
                    <div class="lefttitle">{{$t('work.basicInformation')}}</div>
                    <div class="leftcontent">
                        <el-row :gutter="16">
                            <el-col :span="10" :offset="2">
                                <el-descriptions title="">
                                    <el-descriptions-item :label="$t('work.customerName')+':'">{{ topvalue.username }}</el-descriptions-item>
                                </el-descriptions>
                            </el-col>
                            <el-col :span="11">
                                <el-descriptions title="">
                                    <el-descriptions-item :label="$t('work.phoneNumber')+':'">{{ topvalue.tel }}</el-descriptions-item>
                                </el-descriptions>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="11" :offset="3">
                                <el-descriptions title="">
                                    <el-descriptions-item :label="$t('work.dealer')+':'">{{ topvalue.companyName }}</el-descriptions-item>
                                </el-descriptions>
                            </el-col>
                        </el-row>
                        <el-row :gutter="16">
                            <el-col :span="9" :offset="3">
                                <el-descriptions title="">
                                    <el-descriptions-item :label="$t('work.creator')+':'">{{ topvalue.creatorName }}</el-descriptions-item>
                                </el-descriptions>
                            </el-col>
                            <el-col :span="11">
                                <el-descriptions title="">
                                    <el-descriptions-item :label="$t('work.registrationCode')+':'">{{ topvalue.code }}</el-descriptions-item>
                                </el-descriptions>
                            </el-col>
                        </el-row>
                        <el-row :gutter="16">
                            <el-col :span="10" :offset="2">
                                <el-descriptions title="">
                                    <el-descriptions-item :label="$t('work.nettingDuration')+':'">{{ topvalue.netDate?.split(' ')[0]
                                    }}</el-descriptions-item>
                                </el-descriptions>
                            </el-col>
                            <el-col :span="11">
                                <el-descriptions title="">
                                    <el-descriptions-item :label="$t('work.warrantyPeriod')+':'">{{ topvalue.warrantyDate?.split(' ')[0]
                                    }}</el-descriptions-item>
                                </el-descriptions>
                            </el-col>
                        </el-row>
                        <el-row :gutter="16">
                            <el-col :span="10" :offset="2">
                                <el-descriptions title="">
                                    <el-descriptions-item :label="$t('work.softwareDuration')+':'">{{ topvalue.expirationTime?.split(' ')[0]
                                    }}</el-descriptions-item>
                                </el-descriptions>
                            </el-col>
                            <el-col :span="11">
                                <el-descriptions title="">
                                    <el-descriptions-item :label="$t('work.satelliteBaseDuration')+':'">{{ topvalue.satelliteDate?.split(' ')[0]
                                    }}</el-descriptions-item>
                                </el-descriptions>
                            </el-col>

                        </el-row>
                        <el-row :gutter="16">
                            <el-col :span="10" :offset="2">
                                <el-descriptions title="">
                                    <el-descriptions-item :label="$t('work.activationTime')+':'">{{ topvalue.activationTime?.split(' ')[0]
                                    }}</el-descriptions-item>
                                </el-descriptions>
                            </el-col>

                        </el-row>
                    </div>
                </div>
                <div class="right">
                    <div class="righttitle">{{$t('work.component')}}</div>
                    <div class="rightcontent">
                        <el-form :model="topvalue" ref="formRef" :rules="rules" hide-required-asterisk>
                            <el-form-item :label="$t('work.labelSN')+':'" label-width="125px">
                                <span style="color: var(--el-input-text-color,var(--el-text-color-regular))"> {{
                                    topvalue.npn || '/' }}</span>
                            </el-form-item>
                            <el-form-item :label="$t('work.PlateSN')+':'" label-width="125px" prop="sn">
                                <el-input v-model="topvalue.sn">
                                    <template #append>
                                        <el-button @click="changeSnBtn(topvalue.sn)" class="change_btn">{{$t('work.replace')}}</el-button>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item :label="$t('work.MotorSN')+':'" label-width="125px" prop="motorSn">
                                <el-input v-model="topvalue.motorSn">
                                    <template #append>
                                        <el-button @click="changeMotorSnBtn(topvalue.motorSn)"
                                            class="change_btn">{{$t('work.replace')}}</el-button>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item v-if="scence != '1'" :label="$t('work.BodySN')+':'" label-width="125px" prop="carImuSn">
                                <el-input v-model="topvalue.carImuSn">
                                    <template #append>
                                        <el-button @click="changeCarImuSnBtn(topvalue.carImuSn)"
                                            class="change_btn">{{$t('work.replace')}}</el-button>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item v-if="scence != '1'" :label="$t('work.frontWheelSN')+':'" label-width="125px" prop="wheelImuSn">
                                <el-input v-model="topvalue.wheelImuSn">
                                    <template #append>
                                        <el-button @click="changeWheelImuSnBtn(topvalue.wheelImuSn)"
                                            class="change_btn">{{$t('work.replace')}}</el-button>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item v-if="scence != '1'" :label="$t('work.Antenna1_SN')+':'" label-width="125px" prop="antennaOne">
                                <el-input v-model="topvalue.antennaOne">
                                    <template #append>
                                        <el-button @click="changeAntennaOneBtn(topvalue.antennaOne)"
                                            class="change_btn">{{$t('work.replace')}}</el-button>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item v-if="scence == '2'" :label="$t('work.Antenna2_SN')+':'" label-width="125px" prop="antennaTwo">
                                <el-input v-model="topvalue.antennaTwo">
                                    <template #append>
                                        <el-button @click="changeAntennaTwoBtn(topvalue.antennaTwo)"
                                            class="change_btn">{{$t('work.replace')}}</el-button>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item v-if="scence == '1'" label="HUB_SN:" label-width="125px" prop="hubSn">
                                <el-input v-model="topvalue.hubSn">
                                    <template #append>
                                        <el-button @click="changeHubSnBtn(topvalue.hubSn)" class="change_btn">{{$t('work.replace')}}</el-button>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item v-if="scence == '1'" :label="$t('work.gnssPoleSN')+':'" label-width="125px" prop="sn">
                                <el-input v-model="topvalue.sn">
                                    <template #append>
                                        <el-button @click="changeSnBtn(topvalue.sn)" class="change_btn">{{$t('work.replace')}}</el-button>
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
            <div class="bottomarea">
                <div class="bottomtitle">
                    <span>{{$t('work.changeInformation')}}</span>
                    <el-button type="primary" @click="getInfo">
                        {{$t('work.loadInformation')}}
                    </el-button>
                </div>
                <div class="main">
                    <el-table :data="tableData" style="width: 100%;" :row-style="{ height: '60px' }"
                        :cell-style="{ padding: '10px' }">
                        <el-table-column type="index" :label="$t('work.item')+':'" width="80" />
                        <el-table-column prop="dateTime" :label="$t('work.time')+':'" width="200" />
                        <el-table-column prop="operation" :label="$t('work.operation')+':'" />
                    </el-table>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { carModuleInfoOperationLogResponseData, LogObj, carMoudleInfoGetLeftResponseData, MoudleInfoGetLeftObj } from "@/api/infoManagement/type"
import { reactive, ref } from 'vue';
import { carModuleInfoGet_API, carModuleInfoOperationLog_API, carModuleInfoUpdate_API } from '@/api/infoManagement/index'
import { ElMessage } from 'element-plus'
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const scence = ref<string>('')
let $route = useRoute()
const formRef = ref()
const topvalue = reactive<MoudleInfoGetLeftObj>({
    id: 0,
    terminalType: '',
    npn: '',
    sn: '',
    hubSn: '',
    motorSn: '',
    steeringWheelSn: '',
    carImuSn: '',
    wheelImuSn: '',
    antennaOne: '',
    antennaTwo: '',
    superCattleModuleInfo: '',
    warrantyDate: '',
    satelliteDate: '',
    expirationTime: '',
    netDate: '',
    username: '',
    userId: 0,
    companyId: 0,
    companyName: '',
    tel: '',
    creatorName: '',
    creatorId: 0,
    code: '',
    activationTime:''
})
const rules = {
    sn: [{ required: true, message:t('messages.plzenter'), trigger: 'blur' }],
    motorSn: [{ required: true, message:t('messages.plzenter'), trigger: 'blur' }],
    carImuSn: [{ required: true, message: t('messages.plzenter'), trigger: 'blur' }],
    wheelImuSn: [{ required: true, message: t('messages.plzenter'), trigger: 'blur' }],
    antennaOne: [{ required: true, message: t('messages.plzenter'), trigger: 'blur' }],
    antennaTwo: [{ required: true, message: t('messages.plzenter'), trigger: 'blur' }],
    hubSn: [{ required: true, message:t('messages.plzenter'), trigger: 'blur' }],
}
const tableData = reactive<LogObj[]>([])
const getInfo = async () => {
    const res: carModuleInfoOperationLogResponseData = await carModuleInfoOperationLog_API($route.query.id as never)
    if (res.data.length > 0) {
        Object.assign(tableData, res.data)
    } else {
        ElMessage({ message: t('messages.noRecord') })
    }

}
const getStartInfo = async () => {
    const res: carModuleInfoOperationLogResponseData = await carModuleInfoOperationLog_API($route.query.id as never)
    if (res.data.length > 0) {
        Object.assign(tableData, res.data)
    }
}
getStartInfo()
const getTopInfo = async () => {
    const res: carMoudleInfoGetLeftResponseData = await carModuleInfoGet_API($route.query.id as never)
    Object.assign(topvalue, res.data)
    if (res.data.terminalType.includes('AG360')) {
        scence.value = '1'
    } else if (res.data.terminalType.includes("AG502")) {
        scence.value = '2'
    } else {
        scence.value = '3'
    }

}
getTopInfo()
const changeSnBtn = async (val: string) => {
    await formRef.value.validateField('sn')
    try {
        await carModuleInfoUpdate_API({ 'sn': val, 'type': '', 'id': topvalue.id })
        ElMessage({ type: 'success', message: t('work.editSuccess') })
        getTopInfo()
    }
    catch {
        // ElMessage({ type: 'error', message: '编辑失败' })
    }
}
const changeMotorSnBtn = async (val: string) => {
    await formRef.value.validateField('motorSn')
    try {
        await carModuleInfoUpdate_API({ 'motorSn': val, 'type': '', 'id': topvalue.id })
        ElMessage({ type: 'success', message: t('work.editSuccess') })
        getTopInfo()
    }
    catch {
        // ElMessage({ type: 'error', message: '编辑失败' })
    }
}

const changeCarImuSnBtn = async (val: string) => {
    await formRef.value.validateField('carImuSn')
    try {
        await carModuleInfoUpdate_API({ 'carImuSn': val, 'type': '', 'id': topvalue.id })
        ElMessage({ type: 'success', message: t('work.editSuccess') })
        getTopInfo()
    }
    catch {
        // ElMessage({ type: 'error', message: '编辑失败' })
    }
}
const changeWheelImuSnBtn = async (val: string) => {
    await formRef.value.validateField('wheelImuSn')
    try {
        await carModuleInfoUpdate_API({ 'wheelImuSn': val, 'type': '', 'id': topvalue.id })
        ElMessage({ type: 'success', message: t('work.editSuccess') })
        getTopInfo()
    }
    catch {
        // ElMessage({ type: 'error', message: '编辑失败' })
    }
}

const changeAntennaOneBtn = async (val: string) => {
    await formRef.value.validateField('antennaOne')
    try {
        await carModuleInfoUpdate_API({ 'antennaOne': val, 'type': '', 'id': topvalue.id })
        ElMessage({ type: 'success', message: t('work.editSuccess') })
        getTopInfo()
    }
    catch {
       // ElMessage({ type: 'error', message: '编辑失败' })
    }
}
const changeAntennaTwoBtn = async (val: string) => {
    await formRef.value.validateField('antennaTwo')
    try {
        await carModuleInfoUpdate_API({ 'antennaTwo': val, 'type': '', 'id': topvalue.id })
        ElMessage({ type: 'success', message: t('work.editSuccess') })
        getTopInfo()
    }
    catch {
        // ElMessage({ type: 'error', message: '编辑失败' })
    }
}
const changeHubSnBtn = async (val: string) => {
    await formRef.value.validateField('hubSn')
    try {
        await carModuleInfoUpdate_API({ 'hubSn': val, 'type': '', 'id': topvalue.id })
        ElMessage({ type: 'success', message: t('work.editSuccess') })
        getTopInfo 
    }
    catch {
       // ElMessage({ type: 'error', message: '编辑失败' })
    }
}

</script>

<style lang="scss" scoped>
.app_container {

    .middle-area {
        border-bottom: 1px solid rgba(235, 238, 245, 1);
        display: flex;

        .left {
            padding: 16px 0 0 20px;
            height: 100%;
            width: 50%;

            .lefttitle {
                margin-bottom: 20px;
                font-size: 18px;
                font-weight: 400;
                letter-spacing: 0px;
                line-height: 26.06px;
            }

            .leftcontent {
                margin-left: -10px;
                font-size: 16px;
                font-weight: 400;
                letter-spacing: 0px;
                line-height: 23.17px;
                margin-bottom: 20px;

                .el-row {
                    margin-bottom: 15px;
                }


            }
        }

        .right {
            padding: 16px 0 0 0;
            height: 100%;
            width: 50%;

            .righttitle {
                margin-left: 15px;
                margin-bottom: 10px;
                font-size: 18px;
                font-weight: 400;
                letter-spacing: 0px;
                line-height: 26.06px;
            }

            .rightcontent {
                margin-bottom: 20px;
 
                .change_btn {
                    height: 32px;
                    background: var(--el-color-primary);
                    color: #fff
                }

                :deep(.el-form-item) {
                    margin-bottom: 14px;
                }

                :deep(.el-form-item__label) {
                    display: inline-flex;
                    justify-content: flex-end;
                    align-items: flex-start;
                    flex: 0 0 auto;
                    height: 32px;
                    line-height: 32px;
                    padding: 0 12px 0 0;
                    box-sizing: border-box;
                    font-weight: 400;
                    font-size: 14px;
                    color: var(--el-text-color-primary);
                }

                .el-input {
                    width: 280px;
                    height: 32px;
                    opacity: 1;
                    border-radius: 2px;
                    border: 1px rgba(220, 223, 230, 1);
                }


            }

        }
    }

    .bottomarea {
        padding-bottom: 10px;
        width: 100%;
        height: 468px;

        .bottomtitle {
            font-size: 18px;
            font-weight: 400;
            letter-spacing: 0px;
            line-height: 26.06px;
            padding: 20px 0 0 20px;
            margin-bottom: 20px;
            height: 50px;

            span {
                margin-right: 34px;
            }
        }

        .el-button {
            width: 114px;
            height: 32px;
            opacity: 1;
            border-radius: 4px;
        }

        .main {
            margin-left: 124px;
            padding: 20px 8px 0px 8px;
            width: 755px;
            height: 376px;
            opacity: 1;
            border-radius: 8px;
            overflow: scroll;
            border: 1px solid rgba(202, 207, 219, 1);

            /* 隐藏 Chrome、Safari 和 Opera 的滚动条 */
        }

        .main::-webkit-scrollbar {
            display: none;
        }

        /* 隐藏 IE、Edge 和 Firefox 的滚动条 */
        .main {
            -ms-overflow-style: none;
            /* IE and Edge */
            scrollbar-width: none;
            /* Firefox */
        }
    }
}
</style>