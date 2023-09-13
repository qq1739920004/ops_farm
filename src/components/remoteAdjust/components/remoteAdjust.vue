<!--  -->
<template>
    <el-dialog style="border-radius: 8px;" @open="openRemoteAdjust" v-model="dialogVisible" title="远程管理" width="1012px"
        height="516px" center>
        <div class="top">
            <span style="margin-right: 20px;">车辆名称：{{ props.name || '/' }}</span>
            <span>车辆类型：{{ props.terminalType }}</span>
        </div>
        <div class="menuArea">
            <el-tabs stretch v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                <el-tab-pane label="车辆参数" name="1"></el-tab-pane>
                <el-tab-pane label="校准参数" name="2"></el-tab-pane>
                <el-tab-pane label="PID参数" name="3"></el-tab-pane>
                <el-tab-pane label="差分设置" name="5" @click="gotoChafen"></el-tab-pane>
                <el-tab-pane label="在线升级" name="6"></el-tab-pane>
                <el-tab-pane label="日志回传" name="7"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="mainContent">
            <el-form ref="carFormRef" v-show="activeIndex == '1'" :rules="carParamRules" :inline="true"
                :label-position="labelPosition" label-width="160px" :model="paramParamsData"
                style="max-width: 1012px;margin-bottom:20px">
                <el-row>
                    <el-col v-if="carParamsData" :span="12" v-for="(value, key, index) in carParamsData" :key="index">
                        <el-form-item class="item" :label="value['name']" :prop="key">
                            <el-input style=" width: 280px;height: 32px;" v-model="paramParamsData[key as never]" />
                        </el-form-item>
                    </el-col>
                    <el-col v-else :span="24" align="center">
                        无数据
                    </el-col>
                </el-row>
                <div class="buttonarea">
                    <el-button type="primary" @click="updateCarParams">确定</el-button>
                </div>
            </el-form>
            <el-form ref="calibFormRef" v-show="activeIndex == '2'" :rules="CalibParamRules" :inline="true"
                :label-position="labelPosition" label-width="160px" :model="CalibParamsData"
                style="max-width: 1012px;margin-bottom:20px">
                <el-row>
                    <el-col v-if="CalibTitleData" :span="12" v-for="(value, key, index) in CalibTitleData" :key="index">
                        <el-form-item class="item" :label="value['name']" :prop="key">
                            <el-input style=" width: 280px;height: 32px;" v-model="CalibParamsData[key as never]" />
                        </el-form-item>
                    </el-col>
                    <el-col v-else :span="24" align="center">
                        无数据
                    </el-col>
                </el-row>
                <div class="buttonarea">
                    <el-button type="primary" @click="updateCalibParams">确定</el-button>
                </div>
            </el-form>
            <el-form ref="pidFormRef" v-show="activeIndex == '3'" :rules="pibParamRules" :inline="true"
                :label-position="labelPosition" label-width="160px" :model="PidParamsData"
                style="max-width: 1012px;margin-bottom:20px">
                <el-row>
                    <el-col v-if="PidTitleData" :span="12" v-for="(value, key, index) in PidTitleData" :key="index">
                        <el-form-item class="item" :label="(value.name)" :prop="key">
                            <el-input style=" width: 280px;height: 32px;" v-model="PidParamsData[key]" />
                        </el-form-item>
                    </el-col>
                    <el-col v-else :span="24" align="center">
                        无数据
                    </el-col>
                </el-row>
                <div class="buttonarea">
                    <el-button type="primary" @click="updatePidParams">确定</el-button>
                </div>
            </el-form>

            <el-form ref="moudleRef" v-show="activeIndex == '5'" :rules="rules" :inline="true"
                :label-position="labelPosition" label-width="160px" :model="chaFenlist"
                style="max-width: 1012px;margin-bottom:20px">
                <el-row style="margin-bottom: 10px;">
                    <el-col :span="12" :offset="6">
                        <el-form-item class="item" label="工作模式：" prop="type">
                            <el-select v-model="workPattern.type" style=" width: 280px;
                height: 32px;">
                                <el-option label="内置网络" :value="'1'" />
                                <el-option label="罗网" :value="'3'" disabled />
                                <!-- <el-option label="外置网络" :value="2"></el-option> -->
                            </el-select>
                        </el-form-item>
                    </el-col>

                </el-row>
                <div v-show="workPattern.type != '3'">
                    <el-row style="margin-bottom: 10px;">
                        <el-col :span="12" :offset="6">
                            <el-form-item class="item" label="服务器IP:" prop="insideHost">
                                <el-input style=" width: 280px;
                height: 32px;" v-model="chaFenlist.insideHost" />
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row style="margin-bottom: 10px;">
                        <el-col :span="12" :offset="6">
                            <el-form-item class="item" label="端口：" prop="insidePort">
                                <el-input style=" width: 280px;
                height: 32px;" v-model="chaFenlist.insidePort" />
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row style="margin-bottom: 10px;">
                        <el-col :span="12" :offset="6">
                            <el-form-item class="item" label="源节点：" prop="insideSourceNode">
                                <el-select style=" width: 280px;
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
                                <el-input style=" width: 280px;
                height: 32px;" v-model="chaFenlist.insideUsername" />
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row style="margin-bottom: 10px;">
                        <el-col :span="12" :offset="6">
                            <el-form-item class="item" label="密码：" prop="insidePassword">
                                <el-input type="password" show-password style=" width: 280px;
                height: 32px;" v-model="chaFenlist.insidePassword" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <div class="buttonarea">
                        <el-button class="btn3" style="" @click="getExtendSourceNode">获取源节点</el-button>
                        <el-button type="primary" @click="updateChafenData">设置</el-button>
                    </div>
                </div>
            </el-form>

            <el-form ref="formLabelAlignRef" v-show="activeIndex == '6'" :rules="rules" :inline="true"
                :label-position="labelPosition" label-width="160px" :model="formLabelAlign"
                style="max-width: 1012px;margin-bottom:20px">
                <div class="mktitle">
                    双天线一体机
                </div>
                <el-row style="margin-top:40px ;">
                    <el-col :span="12" :offset="6">
                        <el-form-item class="item" label="模块选择：" prop="radio1">
                            <el-radio-group text-color="var(--el-color-primary)" style="transform: translateY(-5px);"
                                v-model="formLabelAlign.radio1" class="ml-4">
                                <el-radio v-for="(item, index) in updateModelItem" :key="index" :label="item.label"
                                    size="large" style="margin-right: 30px;">{{ item.name }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row>
                    <el-col :span="12" :offset="6">
                        <el-form-item class="item" label="模块选择：" prop="radio2">
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
                        <el-form-item class="item" label="版本选择：" prop="filename">
                            <el-select style=" width: 280px;
                height: 32px;" v-model="formLabelAlign.filename">
                                <el-option v-for="(item, index) in productList" :key="index" :value="index"
                                    :label="item.filename"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <div class="buttonarea">
                    <el-button type="danger" @click="updateProductListBtn">强制升级</el-button>
                </div>
            </el-form>

            <el-form v-show="activeIndex == '7'" :rules="rules" :inline="true" :label-position="labelPosition"
                label-width="160px" :model="formLabelAlign" style="max-width: 1012px;margin-bottom:20px">

                <el-row>
                    <el-col align="center">
                        <el-form-item class="item" label="时间范围:&nbsp&nbsp" label-width="140px">
                            <el-date-picker style="width: 348px;
                                height: 38px;" v-model="dateValue" type="daterange" range-separator="-"
                                @change="changeDate" :disabled-date="disabledDate" start-placeholder="Start date"
                                end-placeholder="End date" size="large" />
                        </el-form-item>
                    </el-col>

                </el-row>


                <div class="buttonarea">
                    <el-button type="primary">回传</el-button>
                </div>
            </el-form>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, reactive, computed } from 'vue'
import { paramDescribeObj, paramDescribeResponseData, paramsParamObj, paramCarParamResponseData, paramcalibParamData, CalibParamsDataObj, updateInfoObj, paramSourceNodeREsponseData, chaFenObj, GetcarProductpackageResponseData, GetcarProductpackageObj } from '@/api/machineryList/remoteAdjust/type'
import { paramParamDescribe_API, paramCarParam_API, paramCalibParam_API, paramCarParamUpdate_API, pidParamParam_API, getSourceNode_path, updateCar_API, updatePidParm_API, updateCalibParam_API, GetcarProductpackage_API, packageUpgradeCar_API } from '@/api/machineryList/remoteAdjust/index'
import { carNewList_API } from '@/api/machineryList/index'
import { pageInfo } from '@/api/machineryList/type'
import type { TabsPaneContext } from 'element-plus'

const activeName = ref('1')
const handleClick = (tab: TabsPaneContext) => {
    activeIndex.value = tab.props.name as never
}
const carFormRef = ref()
const calibFormRef = ref()
const pidFormRef = ref()
const moudleRef = ref()
const formLabelAlignRef = ref()
const dialogVisible = ref<boolean>(false)
const activeIndex = ref<string>('1')
const labelPosition = ref('right')
const props = defineProps(['terminalType', 'type', 'version', 'carId', 'sn', 'name'])
const carParamsData = ref<any | null>([])
const CalibTitleData = ref<any | null>([])
const PidTitleData = ref<any | null>([])
const productList = ref<GetcarProductpackageObj[]>([])
const pageInfo = reactive<pageInfo>({
    key: '',
    currentPage: 1,
    pageSize: 10,
    companyId: '',
    order: '1'
})
// 车辆参数列表
const paramParamsData = reactive<paramsParamObj | {}>({
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
const PidParamsData = reactive<any>({})
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
const updateModelItem = reactive([{
    'label': '11', 'name': 'EC20'
}, {
    'label': '12', 'name': '板卡'
}
])
const formLabelAlign = reactive({
    name: '',
    region: '',
    type: '',
    radio1: '11',
    radio2: '2',
    pid: '11001',
    filename: 0
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
    }
}
// 获取车辆参数对应的值
const getParamParams = async () => {
    const res: paramCarParamResponseData = await paramCarParam_API(props.carId)
    res.data ? Object.assign(paramParamsData, JSON.parse(res.data.paramJson)) : ''
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
                    ElMessage({ type: 'error', message: '修改失败' })
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
                    ElMessage({ type: 'error', message: '修改失败' })
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
                    ElMessage({ type: 'error', message: '修改失败' })
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

const dateValue = ref<Date[]>([new Date(), new Date()])

const changeDate = () => {
    console.log(formartDate(dateValue.value[0]), formartDate(dateValue.value[1]));

}
// 情况差分数据
const getChafenList = async () => {
    const res: any = await carNewList_API(JSON.stringify(pageInfo))
    chaFenlist.value = res.data.records[0]

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
                ElMessage({ type: 'error', message: '获取源节点数据失败' })
            }
        } catch (err) {
            ElMessage({ type: 'error', message: '获取源节点数据失败' })
        }
    });
}
// 更新差分数据moudleRef
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
                    ElMessage({ type: 'error', message: '修改失败' })
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
// 在线升级更新数据
const updateProductList = async () => {
    try {
        await packageUpgradeCar_API({ 'installPackageId': productList.value[formLabelAlign.filename].id, 'sn': props.sn, 'updateModel': formLabelAlign.radio1, 'upgradeWay': 2 })
        ElMessage({ type: 'success', message: '修改成功' })
    }
    catch {
        ElMessage({ type: 'error', message: '修改失败' })
    }
}
const updateProductListBtn = () => {
    updateProductList()
}

const disabledDate = (time: Date) => {
    return time.getTime() > Date.now()
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

// 时间格式转换
function add0(m: any) {
    return m < 10 ? '0' + m : m;
}
const formartDate = (val: Date) => {
    var y = val.getFullYear();
    var m = val.getMonth() + 1;
    var d = val.getDate();
    var h = val.getHours();
    var mm = val.getMinutes();
    var s = val.getSeconds();
    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}
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
        position: absolute;
        top: 0px;
        left: 417px;
        width: 96px;
        height: 24px;
        opacity: 1;
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