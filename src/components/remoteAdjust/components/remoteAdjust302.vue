<!--  -->
<template>
    <el-dialog @open="openRemoteAdjust" @close="closeRemoteAdjust" style="border-radius: 8px;" v-model="dialogVisible"
        title="远程管理" width="1012px" height="516px" center>
        <div class="top">
            <span>车辆名称：</span>
            <span>车辆类型：{{ props.terminalType }}</span>
        </div>
        <div class="menuArea">
            <el-tabs stretch v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                <el-tab-pane label="车辆参数" name="1"></el-tab-pane>
                <el-tab-pane label="校准参数" name="2"></el-tab-pane>
                <el-tab-pane label="PID参数" name="3"></el-tab-pane>
                <el-tab-pane label="PID曲线参数" name="9"></el-tab-pane>
                <el-tab-pane label="PID超低速参数" name="10"></el-tab-pane>
                <el-tab-pane label="在线升级" name="6"></el-tab-pane>
                <el-tab-pane label="远程设置" name="5" @click="gotoChafen"></el-tab-pane>
                <!-- <el-tab-pane label="日志回传" name="7"></el-tab-pane> -->
            </el-tabs>
        </div>
        <div class="mainContent">
            <el-form ref="carFormRef" :validate-on-rule-change="false" v-show="activeIndex == '1'" :rules="carParamRules"
                :inline="true" :label-position="labelPosition" label-width="160px" :model="paramParamsData"
                style="max-width: 1012px;margin-bottom:20px">
                <el-row>
                    <el-col v-if="carParamsData" :span="12" v-for="(value, key, index) in carParamsData" :key="index">
                        <el-form-item class="item" :label="value.name" :prop="key">
                            <el-input style=" width: 187px;height: 32px;" v-model="paramParamsData[key as never]" />
                        </el-form-item>
                    </el-col>
                    <el-col v-else :span="24" align="center">
                        无数据
                    </el-col>
                </el-row>
                <div class="buttonarea">
                    <el-button :disabled="!carParamsData" type="primary" @click="updateCarParams">确定</el-button>
                </div>
            </el-form>
            <el-form ref="calibFormRef" :validate-on-rule-change="false" v-show="activeIndex == '2'"
                :rules="CalibParamRules" :inline="true" :label-position="labelPosition" label-width="160px"
                :model="CalibParamsData" style="max-width: 1012px;margin-bottom:20px">
                <el-row>
                    <el-col v-if="CalibTitleData" :span="12" v-for="(value, key, index) in CalibTitleData" :key="index">
                        <el-form-item class="item" :label="value.name" :prop="key">
                            <el-input style=" width: 187px;height: 32px;" v-model="CalibParamsData[key as never]" />
                        </el-form-item>
                    </el-col>
                    <el-col v-else :span="24" align="center">
                        无数据
                    </el-col>
                </el-row>
                <div class="buttonarea">
                    <el-button :disabled="!CalibTitleData" type="primary" @click="updateCalibParams">确定</el-button>
                </div>
            </el-form>
            <el-form ref="pidFormRef" :validate-on-rule-change="false" v-show="activeIndex == '3'" :rules="pibParamRules"
                :inline="true" :label-position="labelPosition" label-width="160px" :model="PidParamsData"
                style="max-width: 1012px;margin-bottom:20px">
                <el-row>
                    <el-col v-if="PidTitleData" :span="12" v-for="(value, key, index) in PidTitleData" :key="index">
                        <el-form-item class="item" :label="(value.name)" :prop="key">
                            <el-input style=" width: 187px;height: 32px;" v-model="PidParamsData[key]" />
                        </el-form-item>
                    </el-col>
                    <el-col v-else :span="24" align="center">
                        无数据
                    </el-col>
                </el-row>
                <div class="buttonarea">
                    <el-button :disabled="!PidTitleData" type="primary" @click="updatePidParams">确定</el-button>
                </div>
            </el-form>
            <el-form ref="pidCurveRef" :validate-on-rule-change="false" v-show="activeIndex == '9'" :rules="pidCurveRules"
                :inline="true" :label-position="labelPosition" label-width="160px" :model="pidCurveList"
                style="max-width: 1012px;margin-bottom:20px">
                <el-row>
                    <el-col v-if="PidCurveTitleData" :span="12" v-for="(value, key, index) in PidCurveTitleData"
                        :key="index">
                        <el-form-item class="item" :label="(value.name)" :prop="key">
                            <el-input style=" width: 187px;height: 32px;" v-model="pidCurveList[key]" />
                        </el-form-item>
                    </el-col>
                    <el-col v-else :span="24" align="center">
                        无数据
                    </el-col>
                </el-row>
                <div class="buttonarea">
                    <el-button :disabled="!PidCurveTitleData" type="primary" @click="updatePidCurveParams">确定</el-button>
                </div>
            </el-form>
            <el-form ref="supLowFormRef" :validate-on-rule-change="false" v-show="activeIndex == '10'"
                :rules="pidSupLowRules" :inline="true" :label-position="labelPosition" label-width="160px"
                :model="pidSupLowList" style="max-width: 1012px;margin-bottom:20px">
                <el-row>
                    <el-col v-if="PidSupLowTitleData" :span="12" v-for="(value, key, index) in PidSupLowTitleData"
                        :key="index">
                        <el-form-item class="item" :label="(value.name)" :prop="key">
                            <el-input style=" width: 187px;height: 32px;" v-model="pidSupLowList[key]" />
                        </el-form-item>
                    </el-col>
                    <el-col v-else :span="24" align="center">
                        无数据
                    </el-col>
                </el-row>
                <div class="buttonarea">
                    <el-button :disabled="!PidSupLowTitleData" type="primary" @click="updatePidSupLowParams">确定</el-button>
                </div>
            </el-form>
            <el-form ref="moudleRef" :validate-on-rule-change="false" v-show="activeIndex == '5'" :rules="rules"
                :inline="true" :label-position="labelPosition" label-width="160px" :model="chaFenlist"
                style="max-width: 1012px;margin-bottom:20px">
                <el-row style="margin-bottom: 10px;">
                    <el-col :span="18" :offset="6">
                        <el-form-item class="item" label="工作模式：" prop="type">
                            <el-select v-model="workPattern.type" style=" width: 187px;
                height: 32px;">
                                <el-option label="内置网络" :value="'1'" />
                                <el-option label="罗网" :value="'3'" disabled />
                                <el-option label="内置电台" :value="0"></el-option>
                            </el-select>
                            <el-button v-show="workPattern.type != '0'" :disabled="workPattern.type === '3' ? true : false" style="margin-left: 20px;"
                                type="primary" @click="updateChafenData">设置</el-button>
                            <el-button v-show="workPattern.type == '1'" type="primary" text class="btn3"
                                @click="getExtendSourceNode">获取源节点</el-button>
                            <el-button v-show="workPattern.type == '0'" style="margin-left: 20px;" type="primary"
                                @click="updateChafenData2">设置</el-button>
                        </el-form-item>
                    </el-col>

                </el-row>
                <div v-show="workPattern.type == '1'">
                    <el-row style="margin-bottom: 10px;">
                        <el-col :span="12" :offset="6">
                            <el-form-item class="item" label="服务器IP:" prop="insideHost">
                                <el-input style=" width: 187px;
                height: 32px;" v-model="chaFenlist.insideHost" />
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row style="margin-bottom: 10px;">
                        <el-col :span="12" :offset="6">
                            <el-form-item class="item" label="端口：" prop="insidePort">
                                <el-input style=" width: 187px;
                height: 32px;" v-model="chaFenlist.insidePort" />
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row style="margin-bottom: 10px;">
                        <el-col :span="12" :offset="6">
                            <el-form-item class="item" label="源节点：" prop="insideSourceNode">
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
                            <el-form-item class="item" label="用户名：" prop="insideUsername">
                                <el-input style=" width: 187px;
                height: 32px;" v-model="chaFenlist.insideUsername" />
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row style="margin-bottom: 10px;">
                        <el-col :span="12" :offset="6">
                            <el-form-item class="item" label="密码：" prop="insidePassword">
                                <el-input type="password" show-password style=" width: 187px;
                height: 32px;" v-model="chaFenlist.insidePassword" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div v-show="workPattern.type == '0'">
                    <el-row style="margin-bottom: 10px;">
                        <el-col :span="12" :offset="6">
                            <el-form-item class="item" label="协议：" prop="protocol">
                                <el-select style=" width: 187px;
                height: 32px;" v-model="chaFenlist.protocol">
                                    <el-option label="MAC" :value="0" />
                                    <el-option label="TT450S" :value="1" />
                                    <el-option label="Transparent" :value="2" />
                                    <el-option label="South" :value="3" />

                                </el-select>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row style="margin-bottom: 10px;">
                        <el-col :span="12" :offset="6">
                            <el-form-item class="item" label="信道：" prop="radioChannel">
                                <el-select style=" width: 187px;
                height: 32px;" v-model="chaFenlist.radioChannel">
                                    <el-option v-if="chaFenlist.protocol === 2" label="自定义" :value="0" />
                                    <!-- <el-option v-for="item in radioChannelOptions" :key="item" :label="item" :value="item"></el-option> -->
                                    <el-option v-for="(value, key) in radioChannelOptions" :key="key" :label="value"
                                        :value="value" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-input-number v-show="chaFenlist.radioChannel === 0" label="自定义" :value="0" v-model="custom"
                            clearable size="small" :min="410" :max="470" :step="0.0125" :step-strictly="true" :precision="4"
                            style="position: relative; top: 5px; height: 30px" />
                    </el-row>
                    <el-row style="margin-bottom: 10px;">
                        <el-col :span="12" :offset="6">
                            <el-form-item class="item" label="模式：" prop="radioStatus">
                                <el-select style=" width: 187px;
                height: 32px;" v-model="chaFenlist.radioStatus">
                                    <el-option label="TX_MODE" :value="0" />
                                    <el-option label="RX_MODE" :value="1" /> r
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row style="margin-bottom: 10px;">
                        <el-col :span="12" :offset="6">
                            <el-form-item class="item" label="功率：" prop="radioPower">
                                <el-select style=" width: 187px;
                height: 32px;" v-model="chaFenlist.radioPower">
                                    <el-option label="0.5W" :value="0.5" />
                                    <el-option label="1W" :value="1" />
                                    <el-option label="2W" :value="2" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <el-row style="margin-bottom: 10px;">
                    <el-col :span="18" :offset="6">
                        <el-form-item class="item" label="日志回传:">
                            <el-row>
                                <el-col align="center">
                                    AG302以及A3502_Android的日志回传功能暂未开放
                                </el-col>
                            </el-row>
                        </el-form-item>

                    </el-col>
                </el-row>
                <el-row style="margin-bottom: 10px;">
                    <el-col :span="12" :offset="6">
                        <el-form-item class="item" label="数据存储:">
                            <el-switch v-auth='474' :before-change="beforeSwitchChange"
                                @change="changeLogStatus(props.sn, chaFenlist.isTransfer)" v-model="chaFenlist.isTransfer"
                                class="ml-2" inline-prompt active-text="开" inactive-text="关" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <el-form ref="formLabelAlignRef" :validate-on-rule-change="false" v-show="activeIndex == '6'" :rules="rules"
                :inline="true" :label-position="labelPosition" label-width="160px" :model="formLabelAlign"
                style="max-width: 1012px;margin-bottom:20px">
                <div class="mktitle">
                    双天线一体机
                </div>
                <el-row>
                    <el-col :span="12" :offset="6">
                        <el-form-item class="item" label="版本类型：" prop="name" style="margin-top: 20px;">
                            <el-radio-group text-color="var(--el-color-primary)" style="transform: translateY(-5px);"
                                v-model="formLabelAlign.radio2" class="ml-4">
                                <el-radio label="1" size="large" style="margin-right: 30px;">正式版</el-radio>
                                <el-radio label="2" size="large" style="margin-right: 30px;">测试版</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row style="margin-bottom: 20px;">
                    <el-col :span="12" :offset="6">
                        <el-form-item class="item" label="版本选择：" prop="name">
                            <el-select v-if="productList.length >= 1" style=" width: 187px;
                height: 32px;" v-model="formLabelAlign.filename">
                                <el-option v-for="(item, index) in productList" :key="index" :value="index"
                                    :label="item.filename"></el-option>
                            </el-select>
                            <div v-else style=" width: 187px;height: 32px;">
                                该设备没有固件包
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>

                <div class="buttonarea">
                    <el-button type="danger" :disabled="productList.length >= 1 ? false : true"
                        @click="updateProductListBtn">强制升级</el-button>
                </div>
            </el-form>

            <el-form :validate-on-rule-change="false" v-show="activeIndex == '7'" :rules="rules" :inline="true"
                :label-position="labelPosition" label-width="160px" :model="formLabelAlign"
                style="max-width: 1012px;margin-bottom:20px">
                <el-row>
                    <el-col align="center">
                        AG302以及AG302_Android的日志回传功能暂未开放
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, reactive, computed } from 'vue'
import { paramDescribeObj, paramDescribeResponseData, paramsParamObj, paramCarParamResponseData, paramcalibParamData, CalibParamsDataObj, updateInfoObj, paramSourceNodeREsponseData, chaFenObj, GetcarProductpackageResponseData, GetcarProductpackageObj } from '@/api/machineryList/remoteAdjust/type'
import { paramParamDescribe_API, paramCarParam_API, paramCalibParam_API, paramCarParamUpdate_API, pidParamParam_API, getSourceNode_path, updateCar_API, updatePidParm_API, updateCalibParam_API, GetcarProductpackage_API, packageUpgradeCar_API, pidCurveParam_API, updatePidCurveParm_API, pidSlsParam_API, updatepidSlsParam_API } from '@/api/machineryList/remoteAdjust/index'
import { carNewList_API, logOpen_API } from '@/api/machineryList/index'
import { pageInfo } from '@/api/machineryList/type'
import type { TabsPaneContext } from 'element-plus'

const activeName = ref('1')

const handleClick = (tab: TabsPaneContext) => {
    activeIndex.value = tab.props.name as never
}
const carFormRef = ref()
const calibFormRef = ref()
const pidFormRef = ref()
const pidCurveRef = ref()
const moudleRef = ref()
const formLabelAlignRef = ref()
const supLowFormRef = ref()
const dialogVisible = ref<boolean>(false)
const activeIndex = ref<string>('1')
const labelPosition = ref('right')
const props = defineProps(['terminalType', 'type', 'version', 'carId', 'sn', 'name'])
const carParamsData = ref<any | null>([])
const CalibTitleData = ref<any | null>([])
const PidTitleData = ref<any | null>([])
const PidCurveTitleData = ref<any | null>([])
const PidSupLowTitleData = ref<any | null>([])
const productList = ref<GetcarProductpackageObj[]>([])
const custom = ref<number>(0)
const pageInfo = reactive<pageInfo>({
    key: '',
    currentPage: 1,
    pageSize: 10,
    companyId: '',
    order: '1'
})
const switchStatus = ref(false)
const beforeSwitchChange = () => {
    switchStatus.value = true;
    return switchStatus.value;
}
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
// PID曲线列表
const pidCurveList = reactive<any>({})
// PID超低速曲线列表
const pidSupLowList = reactive<any>({})

const workPattern = ref({
    type: '3'
})
const PidParamsData = reactive<any>({})
defineExpose({
    dialogVisible,
    carFormRef
}
)
const formLabelAlign = reactive({
    name: '',
    region: '',
    type: '',
    radio1: '11',
    radio2: '2',
    pid: '9002',
    filename: 0
})
const radioChannelOptions = reactive({
    1: 4550500,
    2: 4560500,
    3: 4570500,
    4: 4580500,
    5: 4590500,
    6: 4600500,
    7: 4610500,
    8: 4620500,
    9: 4630500,
})
const paramDescribeList = ref<paramDescribeObj>({
    version: '',
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
    'type': 0,
    'userName': '',
    'version': 0,
    'warrantyDate': '',
    'workPattern': 0
})
// 源节点列表
const sourceNode = ref<string[]>([])
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
    } else if (paramDescribeList.value.paramType == 'pid') {
        const res: paramDescribeResponseData = await paramParamDescribe_API(paramDescribeList.value)
        if (res.data != null) {
            PidTitleData.value = JSON.parse(res.data.paramJson)
        } else {
            PidTitleData.value = null
        }
    } else if (paramDescribeList.value.paramType == 'pid_curve') {
        const res: paramDescribeResponseData = await paramParamDescribe_API(paramDescribeList.value)
        if (res.data != null) {
            PidCurveTitleData.value = JSON.parse(res.data.paramJson)
        } else {
            PidCurveTitleData.value = null
        }
    } else if (paramDescribeList.value.paramType == 'pid_superLowSpeed') {
        const res: paramDescribeResponseData = await paramParamDescribe_API(paramDescribeList.value)
        if (res.data != null) {
            PidSupLowTitleData.value = JSON.parse(res.data.paramJson)
        } else {
            PidSupLowTitleData.value = null
        }
    }
    // pidSlsParam_API
}
// 获取车辆参数对应的值
const getParamParams = async () => {
    const res: paramCarParamResponseData = await paramCarParam_API(props.carId)
    res.data.paramJson ? Object.assign(paramParamsData, JSON.parse(res.data.paramJson)) : ''
}
// 获取PID曲线对应的值
const getPidCurveList = async () => {
    const res = await pidCurveParam_API(props.carId)
    res.data.paramJson ? Object.assign(pidCurveList, JSON.parse(res.data.paramJson)) : ''
}
// 获取PID超低速曲线对应的值
const getPidSupLowList = async () => {
    const res = await pidSlsParam_API(props.carId)
    res.data.paramJson ? Object.assign(pidSupLowList, JSON.parse(res.data.paramJson)) : ''
}
const closeRemoteAdjust = () => {
    carFormRef.value.resetFields()
    calibFormRef.value.resetFields()
    pidFormRef.value.resetFields()
    moudleRef.value.resetFields()
    formLabelAlignRef.value.resetFields()
    pidCurveRef.value.resetFields()
    supLowFormRef.value.resetFields()

}
const openRemoteAdjust = () => {
    // 强制更改index为1
    activeIndex.value = '1'
    // 参数赋值
    paramDescribeList.value.version = props.version
    paramDescribeList.value.type = props.type
    paramDescribeList.value.paramType = 'car'
    getCarParams('car')
    if (carParamsData.value != null) {
        getParamParams()
    }
    getCarParams('calib')
    if (CalibTitleData.value != null) {
        getCalib()
    }
    getCarParams('pid')
    if (PidTitleData.value != null) {
        getPid()
    }
    getCarParams('pid_curve')
    if (PidCurveTitleData.value != null) {
        getPidCurveList()
    }
    getCarParams('pid_superLowSpeed')
    if (PidSupLowTitleData.value != null) {
        getPidSupLowList()
    }
    pageInfo.key = props.sn
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
// 更新PID参数
const updatePidParams = async () => {
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
            updateInfo.value.paramJson = (JSON.stringify(PidParamsData))
            updatePidParm_API(updateInfo.value).then(() => {
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
// 更新PID曲线参数
const updatePidCurveParams = async () => {
    await pidCurveRef.value.validate()
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
            updateInfo.value.paramJson = (JSON.stringify(pidCurveList))
            updatePidCurveParm_API(updateInfo.value).then(() => {
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
// 更新超低速曲线参数

const updatePidSupLowParams = async () => {
    await supLowFormRef.value.validate()
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
            updateInfo.value.paramJson = (JSON.stringify(pidSupLowList))
            updatepidSlsParam_API(updateInfo.value).then(() => {
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

// 更新校准参数更新校准数据updateCalibParam_API
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
    res.data ? Object.assign(CalibParamsData, JSON.parse(res.data.paramJson)) : ''
}
// PID参数对应的值
const getPid = async () => {
    const res: paramcalibParamData = await pidParamParam_API((props.carId))
    res.data ? Object.assign(PidParamsData, JSON.parse(res.data.paramJson)) : ''
}
// 情况差分数据
const getChafenList = async () => {
    const res: any = await carNewList_API(JSON.stringify(pageInfo))
    chaFenlist.value = res.data.records[0]
    custom.value = chaFenlist.value.radioChannel as number / 10000 || 0
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
const updateChafenData2 = async () => {
    if (
        chaFenlist.value.protocol === 2 &&
        chaFenlist.value.radioChannel === 0
    ) {
        chaFenlist.value.radioChannel = custom.value * 10000;
    }
    // await updateCar_API({
    //     id: props.carId,
    //     workPattern: workPattern.value.type,
    //     protocol: chaFenlist.value.protocol as number,
    //     radioChannel: chaFenlist.value.radioChannel as number,
    //     radioStatus: chaFenlist.value.radioStatus as number,
    //     radioPower: chaFenlist.value.radioPower as number,
    // }) 
    try {
        await updateCar_API({
            id: props.carId,
            workPattern: workPattern.value.type,
            protocol: chaFenlist.value.protocol as number,
            radioChannel: chaFenlist.value.radioChannel as number,
            radioStatus: chaFenlist.value.radioStatus as number,
            radioPower: chaFenlist.value.radioPower as number,
        })
        ElMessage({ type: 'success', message: '更新成功' })
    } catch {
        // ElMessage({ type: 'error', message: '更新失败' })
    }
}

const gotoChafen = () => {
    sourceNode.value = []
    workPattern.value.type = '3'
}

// 获取在线升级数据
const getProductList = async () => {
    const res: GetcarProductpackageResponseData = await GetcarProductpackage_API({ 'pid': formLabelAlign.pid, 'versionType': formLabelAlign.radio2 })
    if (res.data != null) {
        productList.value = res.data
    }

}
// 在线升级更新数据
const updateProductList = async () => {
    try {
        await packageUpgradeCar_API({ 'installPackageId': productList.value[formLabelAlign.filename].id, 'sn': props.sn, 'upgradeWay': 2 })
        ElMessage({ type: 'success', message: '修改成功' })
    }
    catch {
        // ElMessage({ type: 'error', message: '修改失败' })
    }
}
const updateProductListBtn = () => {
    updateProductList()
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
    protocol: [{ required: true, message: '请输入值', trigger: 'blur' }],
    radioStatus: [{ required: true, message: '请输入值', trigger: 'blur' }],
    radioChannel: [{ required: true, message: '请输入值', trigger: 'blur' }],
    radioPower: [{ required: true, message: '请输入值', trigger: 'blur' }],
}
const parseVerification = (objItem: { type: string, name: string, range: string }) => {

    let temRule = [] as any;
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
            temRule.push.apply(temRule, rule2);
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
    for (let key in PidTitleData.value) {
        let temRule = [] as any;
        let rule1 = { required: true, message: "请输入参数", trigger: "blur" };
        temRule.push(rule1);
        let rule2 = parseVerification(PidTitleData.value[key]);
        temRule.push.apply(temRule, rule2);
        rules[key] = temRule;
    }
    return rules;
})
const pidCurveRules = computed(() => {
    let rules = {} as any;
    for (let key in PidCurveTitleData.value) {
        let temRule = [] as any;
        let rule1 = { required: true, message: "请输入参数", trigger: "blur" };
        temRule.push(rule1);
        let rule2 = parseVerification(PidCurveTitleData.value[key]);
        temRule.push.apply(temRule, rule2);
        rules[key] = temRule;
    }
    return rules;
})
const pidSupLowRules = computed(() => {
    let rules = {} as any;
    for (let key in PidSupLowTitleData.value) {
        let temRule = [] as any;
        let rule1 = { required: true, message: "请输入参数", trigger: "blur" };
        temRule.push(rule1);
        let rule2 = parseVerification(PidSupLowTitleData.value[key]);
        temRule.push.apply(temRule, rule2);
        rules[key] = temRule;
    }
    return rules;
})
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

    .mktitle {
        display: flex;
       width: 100%;
       justify-content: center;
        /** 文本1 */
        font-size: 16px;
        font-weight: 400;
        letter-spacing: 0px;
        line-height: 23.17px;

    }

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

        .btn1 {
            width: 100px;
            height: 38px;
            opacity: 1;
            border-radius: 4px;
            background: rgba(255, 93, 56, 1);
        }

        .btn2 {
            width: 100px;
            height: 38px;
            opacity: 1;
            border-radius: 4px;
            background: var(--el-color-primary)
        }

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