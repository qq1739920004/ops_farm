<!--  -->
<template>
    <el-dialog style="border-radius: 8px;" @open="openRemoteAdjust" @close="closeRemoteAdjust" v-model="dialogVisible"
        :title="$t('work.remoteManagement')" width="1012px" height="516px" center>
        <div class="top">
            <span style="margin-right: 20px;">{{ $t('work.vehicleName') }}：{{ props.name || '/' }}</span>
            <span>{{ $t('work.vehicleType') }}：{{ props.terminalType }}</span>
        </div>
        <div class="menuArea">
            <el-tabs stretch v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                <el-tab-pane :label="$t('work.vehicleParameters')" name="1"></el-tab-pane>
                <el-tab-pane :label="$t('work.calibrationParameters')" name="2"></el-tab-pane>
                <el-tab-pane label="基本参数" name="3"></el-tab-pane>
                <el-tab-pane label="高级参数1" name="4"></el-tab-pane>
                <el-tab-pane :label="$t('work.onlineUpgrade')" name="6"></el-tab-pane>
                <el-tab-pane :label="$t('work.remoteSetting')" name="5" @click="gotoChafen"></el-tab-pane>
                <!-- <el-tab-pane label="日志回传" name="7"></el-tab-pane> -->
            </el-tabs>

        </div>
        <div class="mainContent">
            <el-form :validate-on-rule-change="false" ref="carFormRef" v-show="activeName == '1'" :rules="carParamRules"
                :inline="true" :label-position="labelPosition" label-width="160px" :model="paramParamsData"
                style="max-width: 1012px;margin-bottom:20px">
                <el-row>
                    <el-col v-if="carParamsData" :span="12" v-for="(value, key, index) in carParamsData" :key="index">
                        <el-form-item class="item" :label="value.name" :prop="key">
                            <el-input style=" width: 280px;height: 32px;" v-model="paramParamsData[key as never]" />
                        </el-form-item>
                    </el-col>
                    <el-col v-else :span="24" align="center">
                        {{ $t('work.noData') }}
                    </el-col>
                </el-row>
                <div class="buttonarea">
                    <el-button v-if="carParamsData" type="primary" @click="updateCarParams">{{ $t('work.submit')
                    }}</el-button>
                </div>
            </el-form>
            <el-form :validate-on-rule-change="false" ref="calibFormRef" v-show="activeName == '2'" :rules="CalibParamRules"
                :inline="true" :label-position="labelPosition" label-width="160px" :model="CalibParamsData"
                style="max-width: 1012px;margin-bottom:20px">
                <el-row>
                    <el-col v-if="CalibTitleData" :span="12" v-for="(value, key, index) in CalibTitleData" :key="index">
                        <el-form-item class="item" :label="value.name" :prop="key">
                            <el-input style=" width: 280px;height: 32px;" v-model="CalibParamsData[key as never]" />
                        </el-form-item>
                    </el-col>
                    <el-col v-else :span="24" align="center">
                        {{ $t('work.noData') }}
                    </el-col>
                </el-row>
                <div class="buttonarea">
                    <el-button v-if="CalibTitleData" type="primary" @click="updateCalibParams">{{ $t('work.submit')
                    }}</el-button>
                </div>
            </el-form>
            <el-form :validate-on-rule-change="false" ref="pidFormRef" v-show="activeName == '3'" :rules="pibParamRules"
                :inline="true" :label-position="labelPosition" label-width="160px" :model="basicParamsData"
                style="max-width: 1012px;margin-bottom:20px">
                <el-row>
                    <el-col v-if="basicTitleData" :span="12" v-for="(value, key, index) in basicTitleData" :key="index">
                        <el-form-item class="item" :label="(value.name)" :prop="key">
                            <el-input style=" width: 280px;height: 32px;" v-model="basicParamsData[key]" />
                        </el-form-item>
                    </el-col>
                    <el-col v-else :span="24" align="center">
                        {{ $t('work.noData') }}
                    </el-col>
                </el-row>
                <div class="buttonarea">
                    <el-button v-if="CalibTitleData" type="primary" @click="updatebasicParams">{{ $t('work.submit')
                    }}</el-button>
                </div>
            </el-form>
            <el-form :validate-on-rule-change="false" ref="advanceFormRef" v-show="activeName == '4'"
                :rules="advance1ParamRules" :inline="true" :label-position="labelPosition" label-width="160px"
                :model="advanced1ParamsData" style="max-width: 1012px;margin-bottom:20px">
                <el-row>
                    <el-col v-if="advance1TitleData" :span="12" v-for="(value, key, index) in advance1TitleData"
                        :key="index">
                        <el-form-item class="item" :label="(value.name)" :prop="key">
                            <el-input style=" width: 280px;height: 32px;" v-model="advanced1ParamsData[key]" />
                        </el-form-item>
                    </el-col>
                    <el-col v-else :span="24" align="center">
                        {{ $t('work.noData') }}
                    </el-col>
                </el-row>
                <div class="buttonarea">
                    <el-button v-if="advance1TitleData" type="primary" @click="updateAdvanced1Params">{{ $t('work.submit')
                    }}</el-button>
                </div>
            </el-form>
            <el-form ref="moudleRef" :validate-on-rule-change="false" v-show="activeName == '5'" :rules="rules"
                :inline="true" :label-position="labelPosition" label-width="160px" :model="chaFenlist"
                style="max-width: 1012px;margin-bottom:20px">
                <el-row style="margin-bottom: 10px;">
                    <el-col :span="18" :offset="6">
                        <el-form-item class="item" label="差分设置：">
                            <el-select v-model="workPattern.type" style=" width: 187px;
                height: 32px;">
                                <el-option :label="$t('work.builtInNetwork')" :value="'1'" />
                                <el-option :label="$t('work.netting')" :value="'3'" disabled />
                                <!-- <el-option label="外置网络" :value="2"></el-option> -->
                            </el-select>
                            <el-button :disabled="workPattern.type === '3' ? true : false" style="margin-left: 20px;"
                                type="primary" @click="updateChafenData">{{ $t('work.settings') }}</el-button>
                            <el-button v-show="workPattern.type == '1'" type="primary" text class="btn3" style=""
                                @click="getExtendSourceNode">{{ $t('work.getSourceNode') }}</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div v-show="workPattern.type != '3'">
                    <el-row style="margin-bottom: 10px;">
                        <el-col :span="12" :offset="6">
                            <el-form-item class="item" :label="$t('work.serverIP')" prop="insideHost">
                                <el-input style=" width: 187px;
                height: 32px;" v-model="chaFenlist.insideHost" />
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row style="margin-bottom: 10px;">
                        <el-col :span="12" :offset="6">
                            <el-form-item class="item" :label="$t('work.port')" prop="insidePort">
                                <el-input style=" width: 187px;
                height: 32px;" v-model="chaFenlist.insidePort" />
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row style="margin-bottom: 10px;">
                        <el-col :span="12" :offset="6">
                            <el-form-item class="item" :label="$t('work.sourceNode')" prop="insideSourceNode">
                                <el-select style=" width: 187px;
                height: 32px;" v-model="chaFenlist.insideSourceNode">
                                    <el-option v-for="(item, index) in sourceNode" :key="index" :label="item"
                                        :value="item" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row style="margin-bottom: 10px;">
                        <el-col :span="12" :offset="6">
                            <el-form-item class="item" :label="$t('work.username')" prop="insideUsername">
                                <el-input style=" width: 187px;
                height: 32px;" v-model="chaFenlist.insideUsername" />
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row style="margin-bottom: 10px;">
                        <el-col :span="12" :offset="6">
                            <el-form-item class="item" :label="$t('work.password')" prop="insidePassword">
                                <el-input type="password" show-password style=" width: 187px;
                height: 32px;" v-model="chaFenlist.insidePassword" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <el-row style="margin-bottom: 10px;">
                    <el-col :span="18" :offset="6">
                        <el-form-item class="item" :label="$t('work.logUpload')">
                            <el-row>
                                <el-col align="center">
                                    AG502以及AG502_Android的日志回传功能暂未开放
                                </el-col>
                            </el-row>
                        </el-form-item>

                    </el-col>
                </el-row>
                <el-row style="margin-bottom: 10px;">
                    <el-col :span="12" :offset="6">
                        <el-form-item class="item" :label="$t('work.dataStorage')">
                            <el-switch v-auth='474' :before-change="beforeSwitchChange"
                                @change="changeLogStatus(props.sn, chaFenlist.isTransfer)" v-model="chaFenlist.isTransfer"
                                class="ml-2" inline-prompt active-text="开" inactive-text="关" />
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
            <el-form ref="formLabelAlignRef" :validate-on-rule-change="false" v-show="activeName == '6'" :rules="rules"
                :inline="true" :label-position="labelPosition" label-width="180px" :model="formLabelAlign"
                style="max-width: 1012px;margin-bottom:20px">
                <!-- <div class="mktitle">
                    {{$t('work.dualAntennaOneMachine')}}
                </div> -->
                <el-row>
                    <el-col :span="12" :offset="6">
                        <el-form-item class="item" :label="$t('work.versionType')" prop="name" style="margin-top: 20px;">
                            <el-radio-group @change="changeRadio2" text-color="var(--el-color-primary)"
                                style="transform: translateY(-5px);" v-model="formLabelAlign.radio2" class="ml-4">
                                <el-radio label="1" size="large" style="margin-right: 30px;">{{ $t('work.officialVersion')
                                }}</el-radio>
                                <el-radio label="2" size="large" style="margin-right: 30px;">{{ $t('work.betaVersion')
                                }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row style="margin-bottom: 20px;">
                    <el-col :span="14" :offset="6">
                        <el-form-item class="item" :label="$t('work.versionSelection') + '：'" prop="name">
                            <el-select v-if="productList.length >= 1" style=" width: 187px;
                height: 32px;" v-model="formLabelAlign.filename">
                                <el-option v-for="(item, index) in productList" :key="index" :value="index"
                                    :label="item.filename"></el-option>
                            </el-select>
                            <div v-else style=" width: 187px;height: 32px;">
                                {{ $t('work.noFirmwarePackageForDevice') }}
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>

                <div class="buttonarea">
                    <el-button type="danger" :disabled="productList.length >= 1 ? false : true"
                        @click="updateProductListBtn">{{ $t('work.forceUpgrade') }}</el-button>
                </div>
            </el-form>
            <!-- <el-form :validate-on-rule-change="false" ref="formLabelAlignRef" v-show="activeName == '6'" :rules="rules"
                :inline="true" :label-position="labelPosition" label-width="160px" :model="formLabelAlign"
                style="max-width: 1012px;margin-bottom:20px">
                <el-row>
                    <el-col align="center">
                        AG502以及AG502_Android的升级功能暂未开放
                    </el-col>
                </el-row>
            </el-form> -->

            <!-- <el-form :validate-on-rule-change="false" v-show="activeName == '7'" :rules="rules" :inline="true"
                :label-position="labelPosition" label-width="160px" :model="formLabelAlign"
                style="max-width: 1012px;margin-bottom:20px">
                <el-row>
                    <el-col align="center">
                        AG502以及AG502_Android的日志回传功能暂未开放
                    </el-col>
                </el-row>
            </el-form> -->
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, reactive, computed } from 'vue'
import { paramDescribeObj, paramDescribeResponseData, paramsParamObj, paramCarParamResponseData, paramcalibParamData, paramAdvanced1ParamData, CalibParamsDataObj, updateInfoObj, paramSourceNodeREsponseData, chaFenObj, GetcarProductpackageResponseData, GetcarProductpackageObj } from '@/api/machineryList/remoteAdjust/type'
import { paramParamDescribe_API, paramCarParam_API, paramCalibParam_API, paramCarParamUpdate_API, getSourceNode_path, updateCar_API, updateBasicParm_API, updateCalibParam_API, GetcarProductpackage_API, basicParam_API, getAdvanced1Param_API, advanced1ParamUpdate_API,packageUpgradeCar_API } from '@/api/machineryList/remoteAdjust/index'
import { carNewDetail_API, logOpen_API } from '@/api/machineryList/index'
import type { TabsPaneContext } from 'element-plus'

const activeName = ref('1')

const handleClick = (tab: TabsPaneContext) => {
    activeName.value = tab.props.name as never
}
const carFormRef = ref()
const calibFormRef = ref()
const pidFormRef = ref()
const moudleRef = ref()
const formLabelAlignRef = ref()
const advanceFormRef = ref()
const dialogVisible = ref<boolean>(false)
const labelPosition = ref('right')
const props = defineProps(['terminalType', 'paramType', 'paramVersionnum', 'carId', 'sn', 'name'])
const carParamsData = ref<any | null>([])
const CalibTitleData = ref<any | null>([])
const basicTitleData = ref<any | null>([])
const advance1TitleData = ref<any | null>([])
const basicParamsData = reactive<any>({})
const advanced1ParamsData = reactive<any>({})
const productList = ref<GetcarProductpackageObj[]>([])
// 车辆参数列表
const paramParamsData = reactive<paramsParamObj>({
    'Vehicle1': "",
    'Vehicle10': 0,
    'Vehicle11': 0,
    'Vehicle12': 0,
    'Vehicle13': 0,
    'Vehicle14': "",
    'Vehicle2': "",
    'Vehicle3': 0,
    'Vehicle4': "",
    'Vehicle5': "",
    'Vehicle6': 0,
    'Vehicle7': 0,
    'Vehicle8': 0,
    'Vehicle9': 0,

})
// 车辆更新参数
const updateInfo = ref<updateInfoObj>({
    'carId': '',
    'paramJson': ''
})
// 校准参数列表
const CalibParamsData = reactive<CalibParamsDataObj>({
    "Just1": 0,
    "Just2": 0,
    "Just3": 0,
    "Just7": 0,
    "Just8": 0,
    "Just9": 0
})
const workPattern = ref({
    type: '3'
})


defineExpose({
    dialogVisible,
    carFormRef
}
)
// {
//     'label': '9', 'name': 'AG302'
// }, {
//     'label': '10', 'name': 'EC20配置文件'
// }, {
//     'label': '13', 'name': '电台'
// }, {
//     'label': '15', 'name': '车身IMU'
// },
// {
//     'label': '16', 'name': '车轮IMU'
// },
// {
//     'label': '17', 'name': '电机'
// },
// {
//     'label': '18', 'name': '多功能方向盘'
// },
// {
//     'label': '20', 'name': 'Hub'
// },
// {
//     'label': '21', 'name': 'Hub蓝牙'
// }
const formLabelAlign = reactive({
    name: '',
    region: '',
    type: '',
    radio1: '11',
    radio2: '1',
    pid: '9023',
    filename: 0
})
// 在线升级更新数据
const updateProductList = async () => {
    try {
        await packageUpgradeCar_API({ 'installPackageId': productList.value[formLabelAlign.filename].id, 'sn': props.sn, 'upgradeWay': 1, 'updateModel': '9' })
        ElMessage({ type: 'success', message: '修改成功' })
    }
    catch {
        // ElMessage({ type: 'error', message: '修改失败' })
    }
}
const updateProductListBtn = () => {
    updateProductList()
}

const paramDescribeList = ref<paramDescribeObj>({
    paramVersionnum: '',
    type: '',
    paramType: ''
})
const chaFenlist = ref<chaFenObj>({
    'codePower': true,
    'companyName': '',
    'deviceId': 0,
    'expirationTime': '',
    'extendHost': '',
    'extendPassword': '',
    'extendPort': 0,
    'extendSourceNode': '',
    'extendUsername': '',
    'id': 0,
    'insideHost': '',
    'insidePassword': '',
    'insidePort': 0,
    'insideSourceNode': '',
    'insideUsername': '',
    'isTransfer': false,
    'lastOnlineTime': '',
    'model': '',
    'name': '',
    'netDate': '',
    'npn': '',
    'protocol': 0,
    'province': '',
    'radioChannel': 0,
    'radioPower': 0,
    'radioStatus': 0,
    'satelliteDate': '',
    'satelliteStatus': 0,
    'sn': '',
    'softwareVersion': '',
    'tel': '',
    'terminalType': '',
    'paramType': 0,
    'userName': '',
    'paramVersionnum': 0,
    'warrantyDate': '',
    'workPattern': 0
})
// 源节点列表
const sourceNode = ref<string[]>([])
const switchStatus = ref(false)
const beforeSwitchChange = () => {
    switchStatus.value = true;
    return switchStatus.value;
}
const changeRadio2 = () => {
    getProductList()
}
// 获取车辆参数
const getCarParams = async (val: string) => {
    paramDescribeList.value.paramType = val
    if (paramDescribeList.value.paramType == 'car') {
        const res: paramDescribeResponseData = await paramParamDescribe_API(paramDescribeList.value)
        if (res.data != null) {
            carParamsData.value = JSON.parse(res.data.paramJson)
        } else {
            carParamsData.value = null
        }

    } else if (paramDescribeList.value.paramType == 'calib') {
        const res: paramDescribeResponseData = await paramParamDescribe_API(paramDescribeList.value)
        if (res.data != null) {
            CalibTitleData.value = JSON.parse(res.data.paramJson)
        } else {
            CalibTitleData.value = null
        }
    } else if (paramDescribeList.value.paramType == 'basic') {
        const res: paramDescribeResponseData = await paramParamDescribe_API(paramDescribeList.value)
        if (res.data != null) {
            basicTitleData.value = JSON.parse(res.data.paramJson)
        } else {
            basicTitleData.value = null
        }
    } else if (paramDescribeList.value.paramType == 'advanced1') {
        const res: paramDescribeResponseData = await paramParamDescribe_API(paramDescribeList.value)
        if (res.data != null) {
            advance1TitleData.value = JSON.parse(res.data.paramJson)
        } else {
            advance1TitleData.value = null
        }
    }
}
// 获取车辆参数对应的值
const getParamParams = async () => {
    const res: paramCarParamResponseData = await paramCarParam_API(props.carId)
    res.data ? Object.assign(paramParamsData, JSON.parse(res.data.paramJson)) : ''
}
const closeRemoteAdjust = () => {
    workPattern.value.type = '3'
    carFormRef.value.resetFields()
    calibFormRef.value.resetFields()
    pidFormRef.value.resetFields()
    moudleRef.value.resetFields()
    formLabelAlignRef.value.resetFields()
    advanceFormRef.value.resetFields()
    activeName.value = '1'
}
const changeLogStatus = async (val: string, val2: any) => {
    if (switchStatus) {
        console.log(val, val2);
        try {
            await logOpen_API({ 'sn': val, 'flag': val2 })
            ElMessage({ type: 'success', message: '修改成功', duration: 1000 })
        }
        catch {
            // ElMessage({ type: 'error', message: '修改失败', duration: 1000 })
        }
    }
}
const openRemoteAdjust = () => {
    // 强制更改index为1
    activeName.value = '1'
    // 参数赋值
    paramDescribeList.value.paramVersionnum = props.paramVersionnum
    paramDescribeList.value.type = props.paramType
    paramDescribeList.value.paramType = 'car'
    getCarParams('car')
    if (carParamsData.value != null) {
        getParamParams()
    }
    getCarParams('calib')
    if (CalibTitleData.value != null) {
        getCalib()
    }
    getCarParams('basic')
    if (basicTitleData.value != null) {
        getBasic()
    }
    getCarParams('advanced1')
    if (advance1TitleData.value != null) {
        getAdvanced1()
    }
    getChafenList()
    getProductList()
}
// 更新车辆参数
const updateCarParams = async () => {

    await carFormRef.value.validate()
    ElMessageBox.confirm(
        '此操作将覆盖当前车辆所有参数，是否继续？',
        'Warning',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            updateInfo.value.carId = props.carId
            updateInfo.value.paramJson = (JSON.stringify(paramParamsData))
            paramCarParamUpdate_API(updateInfo.value).then(() => {
                try {
                    ElMessage({ type: 'success', message: '修改成功' })
                }
                catch {
                    // ElMessage({ type: 'error', message: '修改失败' })
                }
            })
        })
        .catch(() => {

        })
}
// 更新基本参数
const updatebasicParams = async () => {
    await pidFormRef.value.validate()
    ElMessageBox.confirm(
        '此操作将覆盖当前车辆所有参数，是否继续？',
        'Warning',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            updateInfo.value.carId = props.carId
            updateInfo.value.paramJson = (JSON.stringify(basicParamsData))

            updateBasicParm_API(updateInfo.value).then(() => {
                try {
                    ElMessage({ type: 'success', message: '修改成功' })
                }
                catch {
                    // ElMessage({ type: 'error', message: '修改失败' })
                }
            })
        })
        .catch(() => {

        })

}
// 更新校准参数更新校准数据
const updateCalibParams = async () => {
    await calibFormRef.value.validate()
    ElMessageBox.confirm(
        '此操作将覆盖当前车辆所有参数，是否继续？',
        'Warning',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            updateInfo.value.carId = props.carId
            updateInfo.value.paramJson = (JSON.stringify(CalibParamsData))
            updateCalibParam_API(updateInfo.value).then(() => {
                try {
                    ElMessage({ type: 'success', message: '修改成功' })
                }
                catch {
                    // ElMessage({ type: 'error', message: '修改失败' })
                }
            })
        })
        .catch(() => {

        })

}
// 获取校准参数对应的值
const getCalib = async () => {
    const res: paramcalibParamData = await paramCalibParam_API(props.carId)
    res.data.paramJson ? Object.assign(CalibParamsData, JSON.parse(res.data.paramJson)) : ''
}
// 基本参数对应的值
const getBasic = async () => {
    const res: paramcalibParamData = await basicParam_API((props.carId))
    res.data.paramJson ? Object.assign(basicParamsData, JSON.parse(res.data.paramJson)) : ''
}
// 高级参数1对应的值
const getAdvanced1 = async () => {
    const { data }: paramAdvanced1ParamData = await getAdvanced1Param_API((props.carId))
    console.log(data);
    data.data.paramJson ? Object.assign(advanced1ParamsData, JSON.parse(data.data.paramJson)) : ''
}
// 更新高级参数1

const updateAdvanced1Params = async () => {
    await advanceFormRef.value.validate()
    ElMessageBox.confirm(
        '此操作将覆盖当前车辆所有参数，是否继续？',
        'Warning',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            updateInfo.value.carId = props.carId
            updateInfo.value.paramJson = (JSON.stringify(advanced1ParamsData))
            advanced1ParamUpdate_API(updateInfo.value).then(() => {
                try {
                    ElMessage({ type: 'success', message: '修改成功' })
                }
                catch {
                    // ElMessage({ type: 'error', message: '修改失败' })
                }
            })
        })
        .catch(() => {

        })

}

// 情况差分数据
const getChafenList = async () => {
    const res: any = await carNewDetail_API(props.carId, 2)
    chaFenlist.value = res.data

}
// 获取源节点
const getExtendSourceNode = () => {
    getSourceNode_path({
        'workPattern': workPattern.value.type,
        'insideHost': chaFenlist.value.insideHost,
        'insidePort': chaFenlist.value.insidePort,
    }).then((res: paramSourceNodeREsponseData) => {
        try {
            if (res.data.length >= 1) {
                sourceNode.value = res.data
                ElMessage({ type: 'success', message: '获取源节点数据成功' })
            } else {
                // ElMessage({ type: 'error', message: '获取源节点数据失败' })
            }
        } catch (err) {
            // ElMessage({ type: 'error', message: '获取源节点数据失败' })
        }
    });
}
// 更新差分数据
const updateChafenData = async () => {
    await moudleRef.value.validate()
    ElMessageBox.confirm(
        '此操作将覆盖当前车辆所有参数，是否继续？',
        'Warning',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })
        .then(() => {
            updateCar_API({
                id: props.carId,
                workPattern: workPattern.value.type,
                insideHost: chaFenlist.value.insideHost,
                insidePort: chaFenlist.value.insidePort,
                insideSourceNode: chaFenlist.value.insideSourceNode,
                insideUsername: chaFenlist.value.insideUsername,
                insidePassword: chaFenlist.value.insidePassword
            }).then(() => {
                try {
                    ElMessage({ type: 'success', message: '修改成功' })
                }
                catch {
                    // ElMessage({ type: 'error', message: '修改失败' })
                }
            })
        })
        .catch(() => {

        })

}

const gotoChafen = () => {
    sourceNode.value = []
    workPattern.value.type = '3'
}

// 获取在线升级数据
const getProductList = async () => {
    const res: GetcarProductpackageResponseData = await GetcarProductpackage_API({ 'pid': formLabelAlign.pid, 'versionType': formLabelAlign.radio2 })
    productList.value = res.data
}
const rules = {
    type: [{ required: true, message: '请输入值', trigger: 'blur' }],
    insideHost: [{ required: true, message: '请输入值', trigger: 'blur' }],
    insidePort: [{ required: true, message: '请输入值', trigger: 'blur' }],
    insideSourceNode: [{ required: true, message: '请输入值', trigger: 'blur' }],
    insideUsername: [{ required: true, message: '请输入值', trigger: 'blur' }],
    insidePassword: [{ required: true, message: '请输入值', trigger: 'blur' }],
    radio1: [{ required: true, message: '请输入值', trigger: 'blur' }],
    radio2: [{ required: true, message: '请输入值', trigger: 'blur' }],
    filename: [{ required: true, message: '请输入值', trigger: 'blur' }],
}
const parseVerification = (objItem: { type: any, name: any, range: any }) => {

    let temRule = [];
    if (objItem.type === "String") {
        let rule1 = {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
        };
        temRule.push(rule1);
    }
    if (objItem.type === "int") {
        if (typeof objItem.range === "string") {
            let [min, max] = objItem.range.split(",").map((element: any) => {
                return Number(element);
            });
            // let rule2 = { min: min, max: max, message: `长度在 ${min} 到 ${max} 位`, trigger: 'blur' };
            let checkInt = (_rule: any, value: any, callback: any) => {
                // 判断数字
                let checkNumber = (input: any) => {

                    let testRe = /^[1-9]\d*|0$/;
                    return testRe.test(input);
                };
                if (!value && value !== 0) {
                    return callback(new Error("请输入参数"));
                }
                if (!checkNumber(value)) {
                    return callback(new Error("值必须为整型"));
                }
                if (value < min || value > max) {
                    return callback(new Error(`范围 ${min} 到 ${max} `));
                }
                callback();
            };
            let rule2 = { validator: checkInt, trigger: "blur" };
            temRule.push(rule2);
        }
        if (Array.isArray(objItem.range)) {
            //
        }
    }
    if (objItem.type === "double") {
        if (objItem.range === "") {
            // let rule3 = { min: 1, max: 8, message: '长度在 1 到 8 位', trigger: 'blur' };
            // temRule.push(rule3);
            let checkDouble = (_rule: any, value: any, callback: any) => {
                // 判断数字
                let checkNumber = (input: any) => {
                    let testRe = /^[-]?[0-9]+.?[0-9]*/;
                    return testRe.test(input);
                };
                if (!value && value !== 0) {
                    return callback(new Error("请输入参数"));
                }
                if (!checkNumber(value)) {
                    return callback(new Error("参数必须为数字"));
                }
                callback();
            };
            let rule3 = { validator: checkDouble, trigger: "blur" };
            temRule.push(rule3);
        }
        if (objItem.range !== "") {
            let checkDouble = (_rule: any, value: any, callback: any) => {
                // 判断数字
                let checkNumber = (input: any) => {
                    let testRe = /^[-]?[0-9]+.?[0-9]*/;
                    return testRe.test(input);
                };
                let [min, max] = objItem.range.split(",").map((element: any) => {
                    return Number(element);
                });
                if (!value && value !== 0) {
                    return callback(new Error("请输入参数"));
                }
                if (!checkNumber(value)) {
                    return callback(new Error("参数必须为数字"));
                }
                if (value < min || value > max) {
                    return callback(new Error(`范围 ${min}到${max}`));
                }
                callback();
            };
            let rule4 = { validator: checkDouble, trigger: "blur" };
            temRule.push(rule4);
        }
    }
    return temRule;
}
const carParamRules = computed(() => {
    let rules = {} as any;
    for (let key in carParamsData.value) {
        let temRule = [] as any;
        let rule1 = { required: true, message: "请输入参数", trigger: "blur" };
        temRule.push(rule1);
        let rule2 = parseVerification(carParamsData.value[key]);
        temRule.push.apply(temRule, rule2);
        rules[key] = temRule;
    }
    return rules;
})
const CalibParamRules = computed(() => {
    let rules = {} as any;
    for (let key in CalibTitleData.value) {
        let temRule = [] as any;
        let rule1 = { required: true, message: "请输入参数", trigger: "blur" };
        temRule.push(rule1);
        let rule2 = parseVerification(CalibTitleData.value[key]);
        temRule.push.apply(temRule, rule2);
        rules[key] = temRule;
    }
    return rules;
})
const pibParamRules = computed(() => {
    let rules = {} as any;
    for (let key in basicTitleData.value) {
        let temRule = [] as any;
        let rule1 = { required: true, message: "请输入参数", trigger: "blur" };
        temRule.push(rule1);
        let rule2 = parseVerification(basicTitleData.value[key]);
        temRule.push.apply(temRule, rule2);
        rules[key] = temRule;
    }
    return rules;
})
const advance1ParamRules = computed(() => {
    let rules = {} as any;
    for (let key in advance1TitleData.value) {
        let temRule = [] as any;
        let rule1 = { required: true, message: "请输入参数", trigger: "blur" };
        temRule.push(rule1);
        let rule2 = parseVerification(advance1TitleData.value[key]);
        temRule.push.apply(temRule, rule2);
        rules[key] = temRule;
    }
    return rules;
})

// watch(() => dialogVisible.value, () => {
//     if (dialogVisible.value == false) {
//         Object.assign(paramParamsData, {
//             'Vehicle1': "",
//             'Vehicle10': 0,
//             'Vehicle11': 0,
//             'Vehicle12': 0,
//             'Vehicle13': 0,
//             'Vehicle14': "",
//             'Vehicle2': "",
//             'Vehicle3': 0,
//             'Vehicle4': "",
//             'Vehicle5': "",
//             'Vehicle6': 0,
//             'Vehicle7': 0,
//             'Vehicle8': 0,
//             'Vehicle9': 0,

//         })
//         Object.assign(CalibParamsData, {
//             "Just1": 0,
//             "Just2": 0,
//             "Just3": 0,
//             "Just7": 0,
//             "Just8": 0,
//             "Just9": 0
//         })
//         Object.assign(basicParamsData, {})
//         Object.assign(advanced1ParamsData, {})
//         workPattern.value = {
//             type: '3'
//         }
//     }
// })
</script>

<style lang="scss" scoped>
.top {
    position: absolute;
    top: 61px;
    left: 20px;

    span {
        font-size: 14px;
        font-weight: 400;
        letter-spacing: 0px;
        line-height: 20.27px;
    }
}

.menuArea {
    .demo-tabs {
        height: 30px;
    }

    :deep(.el-tabs__item) {
        font-size: 16px;
        font-weight: 400;
        line-height: 23.17px;
    }
}

.mainContent {
    margin-top: 40px;
    width: 100%;
    height: 260px;
    overflow-y: scroll;
    position: relative;


    :deep(.item .el-form-item__label) {
        font-size: 16px;
        font-weight: 400;
        letter-spacing: 0px;
        line-height: 23.17px;

        display: block;
        height: 32px;
        line-height: 16px;
        display: flex;
        align-items: center;
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



    .buttonarea {
        width: 100%;
        text-align: center;
        margin-top: 20px;


        .btn3 {
            width: 112px;
            height: 40px;
        }

        .btn4 {
            width: 144px;
            height: 38px;
            opacity: 1;
            border-radius: 4px;
            background: rgba(255, 93, 56, 1);
        }
    }


}
</style>