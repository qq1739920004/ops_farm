<!--  -->
<template>
    <div class="outsider">
        <el-dialog style="border-radius: 8px;" @open="openRemoteAdjust" v-model="dialogVisible" title="远程管理" width="1112px"
            height="496px" center>
            <div class="top">
                <span>车辆名称：</span>
                <span>车辆类型：{{ props.terminalType }}</span>360
            </div>
            <div class="menuArea">
                <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
                    active-text-color="rgba(76, 176, 79, 1)" active-background-color="rgba(76, 176, 79, 1)">
                    <el-menu-item index="1">车辆参数</el-menu-item>
                    <el-menu-item index="2">校准参数</el-menu-item>
                    <el-menu-item index="3">PID参数</el-menu-item>
                    <!--
                    <el-menu-item index="9" v-if="carKind == 'AG302'">PID曲线参数</el-menu-item>
                    <el-menu-item index="10" v-if="carKind == 'AG302'">PID超低速参数</el-menu-item> -->
                    <!-- <el-menu-item index="4">基本参数</el-menu-item>
                    <el-menu-item index="8">高级参数1</el-menu-item> -->
                    <el-menu-item index="5" @click="gotoChafen">差分设置</el-menu-item>
                    <el-menu-item index="6">在线升级</el-menu-item>
                    <el-menu-item index="7">日志回传</el-menu-item>
                </el-menu>

            </div>
            <div class="mainContent">
                <el-form ref="carFormRef" v-show="activeIndex == '1'" :rules="rules" :inline="true"
                    :label-position="labelPosition" label-width="160px" :model="paramParamsData"
                    style="max-width: 1012px;margin-bottom:20px">
                    <el-row>
                        <el-col v-if="carParamsData" :span="12" v-for="(value, key, index) in carParamsData" :key="index">
                            <el-form-item class="item" :label="carParamsData[key].name" :prop="key">
                                <el-input style=" width: 280px;height: 32px;" v-model="paramParamsData[key as never]" />
                            </el-form-item>
                        </el-col>
                        <el-col v-else :span="24" align="center">
                            无数据
                        </el-col>
                    </el-row>
                    <div class="buttonarea">
                        <el-button style="margin-right: 100px;" type="danger">取消</el-button>
                        <el-button type="primary" @click="updateCarParams">确定</el-button>
                    </div>
                </el-form>
                <el-form v-show="activeIndex == '2'" :rules="rules" :inline="true" :label-position="labelPosition"
                    label-width="160px" :model="CalibParamsData" style="max-width: 1012px;margin-bottom:20px">
                    <el-row>
                        <el-col v-if="CalibTitleData" :span="12" v-for="(value, key, index) in CalibTitleData" :key="index">
                            <el-form-item class="item" :label="CalibTitleData[key].name" :prop="key">
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
                <el-form v-show="activeIndex == '3'" :rules="rules" :inline="true" :label-position="labelPosition"
                    label-width="160px" :model="PidParamsData" style="max-width: 1012px;margin-bottom:20px">
                    <el-row>
                        <el-col v-if="PidTitleData" :span="12" v-for="(value, key, index) in PidTitleData" :key="index">
                            <el-form-item class="item" :label="(PidTitleData[key].name)" :prop="key">
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

                <el-form v-show="activeIndex == '5'" :rules="rules" :inline="true" :label-position="labelPosition"
                    label-width="160px" :model="chaFenlist" style="max-width: 1012px;margin-bottom:20px">
                    <el-row style="margin-bottom: 10px;">
                        <el-col :span="12" :offset="6">
                            <el-form-item class="item" label="工作模式：" prop="name">
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
                                <el-form-item class="item" label="服务器IP:" prop="name">
                                    <el-input style=" width: 280px;
                height: 32px;" v-model="chaFenlist.insideHost" />
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row style="margin-bottom: 10px;">
                            <el-col :span="12" :offset="6">
                                <el-form-item class="item" label="端口：" prop="name">
                                    <el-input style=" width: 280px;
                height: 32px;" v-model="chaFenlist.insidePort" />
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row style="margin-bottom: 10px;">
                            <el-col :span="12" :offset="6">
                                <el-form-item class="item" label="源节点：" prop="name">
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
                                <el-form-item class="item" label="用户名：" prop="name">
                                    <el-input style=" width: 280px;
                height: 32px;" v-model="chaFenlist.insideUsername" />
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row style="margin-bottom: 10px;">
                            <el-col :span="12" :offset="6">
                                <el-form-item class="item" label="密码：" prop="name">
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

                <el-form v-show="activeIndex == '6'" :rules="rules" :inline="true" :label-position="labelPosition"
                    label-width="160px" :model="formLabelAlign" style="max-width: 1012px;margin-bottom:20px">
                    <div class="mktitle">
                        双天线一体机
                    </div>
                    <el-row style="margin-top:40px ;">
                        <el-col :span="12" :offset="6">
                            <el-form-item class="item" label="模块选择：" prop="name">
                                <el-radio-group text-color="rgba(76, 176, 79, 1)" style="transform: translateY(-5px);"
                                    v-model="formLabelAlign.radio1" class="ml-4">
                                    <el-radio v-for="(item, index) in updateModelItem" :key="index" :label="item.label"
                                        size="large" style="margin-right: 30px;">{{ item.name }}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row>
                        <el-col :span="12" :offset="6">
                            <el-form-item class="item" label="模块选择：" prop="name">
                                <el-radio-group text-color="rgba(76, 176, 79, 1)" style="transform: translateY(-5px);"
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
                                <el-select style=" width: 280px;
                height: 32px;" v-model="formLabelAlign.filename">
                                    <el-option v-for="(item,index) in productList" :key="index" :value="index" :label="item.filename"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <div class="buttonarea">
                        <el-button type="danger">强制升级</el-button>
                    </div>
                </el-form>
                <!--
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
                </el-form> -->
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref, reactive } from 'vue'
import { paramDescribeObj, paramDescribeResponseData, carParamsDataObj, paramsParamObj, paramCarParamResponseData, paramcalibParamData, CalibParamsDataObj, updateInfoObj, paramSourceNodeREsponseData, chaFenObj, updateCarResponseData, GetcarProductpackageResponseData, GetcarProductpackageObj } from '@/api/machineryList/remoteAdjust/type'
import { paramParamDescribe_API, paramCarParam_API, paramCalibParam_API, paramCarParamUpdate_API, pidParamParam_API, getSourceNode_path, updateCar_API, updatePidParm_API, updateCalibParam_API, GetcarProductpackage_API } from '@/api/machineryList/remoteAdjust/index'
import { carNewList_API } from '@/api/machineryList/index'
import { pageInfo } from '@/api/machineryList/type'

const carFormRef = ref()
const dialogVisible = ref<boolean>(false)
const activeIndex = ref<string>('1')
const labelPosition = ref('right')
const props = defineProps(['terminalType', 'type', 'version', 'carId', 'sn'])
const carParamsData = ref<carParamsDataObj[] | null>([])
const CalibTitleData = ref<carParamsDataObj[] | null>([])
const PidTitleData = ref<{}[] | null>([])
const productList = ref<GetcarProductpackageObj[]>([])
const pageInfo = reactive<pageInfo>({
    key: '',
    currentPage: 1,
    pageSize: 3,
    companyId: '',
    order: '1'
})
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
    filename:0
})

const getProductList = async () => {
    const res: GetcarProductpackageResponseData = await GetcarProductpackage_API({ 'pid': formLabelAlign.pid, 'versionType': formLabelAlign.radio2 })
    productList.value = res.data
}

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
    Object.assign(paramParamsData, JSON.parse(res.data.paramJson))
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
    updateInfo.value.carId = props.carId
    updateInfo.value.paramJson = (JSON.stringify(paramParamsData))
    const res = await paramCarParamUpdate_API(updateInfo.value)
    if (res.code == 200) {
        ElMessage({ type: 'success', message: '修改成功' })
    }
    else {
        ElMessage({ type: 'error', message: '修改失败' })
    }
}
// 更新PID参数
const updatePidParams = async () => {
    updateInfo.value.carId = props.carId
    updateInfo.value.paramJson = (JSON.stringify(PidParamsData))
    const res = await updatePidParm_API(updateInfo.value)
    if (res.code == 200) {
        ElMessage({ type: 'success', message: '修改成功' })
    }
    else {
        ElMessage({ type: 'error', message: '修改失败' })
    }

}
// 更新校准参数更新校准数据updateCalibParam_API
const updateCalibParams = async () => {
    updateInfo.value.carId = props.carId
    updateInfo.value.paramJson = (JSON.stringify(PidParamsData))
    const res = await updateCalibParam_API(updateInfo.value)
    if (res.code == 200) {
        ElMessage({ type: 'success', message: '修改成功' })
    }
    else {
        ElMessage({ type: 'error', message: '修改失败' })
    }

}
// 获取校准参数对应的值
const getCalib = async () => {
    const res: paramcalibParamData = await paramCalibParam_API(props.carId)
    Object.assign(CalibParamsData, JSON.parse(res.data.paramJson))
}
// PID参数对应的值
const getPid = async () => {
    const res: paramcalibParamData = await pidParamParam_API((props.carId))
    Object.assign(PidParamsData, JSON.parse(res.data.paramJson))
}

const dateValue = ref<Date[]>([new Date(), new Date()])

const changeDate = () => {
    console.log(dateValue.value);

}
const handleSelect = (key: string) => {
    activeIndex.value = key
}
// 情况差分数据
const getChafenList = async () => {
    const res: any = await carNewList_API(pageInfo)
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
// 更新差分数据
const updateChafenData = async () => {
    const res: updateCarResponseData = await updateCar_API({
        id: props.carId,
        workPattern: workPattern.value.type,
        insideHost: chaFenlist.value.insideHost,
        insidePort: chaFenlist.value.insidePort,
        insideSourceNode: chaFenlist.value.insideSourceNode,
        insideUsername: chaFenlist.value.insideUsername,
        insidePassword: chaFenlist.value.insidePassword
    })
    if (res.code == 200) {
        ElMessage({ type: 'success', message: '更新成功' })
    } else {
        ElMessage({ type: 'error', message: '更新失败' })
    }

}

const gotoChafen = () => {
    sourceNode.value = []
    workPattern.value.type = '3'
}

const disabledDate = (time: Date) => {
    return time.getTime() > Date.now()
}



const rules = {
    Vehicle01: [{ required: true, message: '请输入值', trigger: 'blur' }],
    Vehicle10: [{ required: true, message: '请输入值', trigger: 'blur' }],
    Vehicle11: [{ required: true, message: '请输入值', trigger: 'blur' }],
    Vehicle12: [{ required: true, message: '请输入值', trigger: 'blur' }],
    Vehicle13: [{ required: true, message: '请输入值', trigger: 'blur' }],
    Vehicle14: [{ required: true, message: '请输入值', trigger: 'blur' }],
    Vehicle02: [{ required: true, message: '请输入值', trigger: 'blur' }],
    Vehicle03: [{ required: true, message: '请输入值', trigger: 'blur' }],
    Vehicle04: [{ required: true, message: '请输入值', trigger: 'blur' }],
    Vehicle05: [{ required: true, message: '请输入值', trigger: 'blur' }],
    Vehicle06: [{ required: true, message: '请输入值', trigger: 'blur' }],
    Vehicle07: [{ required: true, message: '请输入值', trigger: 'blur' }],
    Vehicle08: [{ required: true, message: '请输入值', trigger: 'blur' }],
    Vehicle09: [{ required: true, message: '请输入值', trigger: 'blur' }],
    Vehicle15: [{ required: true, message: '请输入值', trigger: 'blur' }],
    Vehicle16: [{ required: true, message: '请输入值', trigger: 'blur' }],
    Vehicle17: [{ required: true, message: '请输入值', trigger: 'blur' }],
    Vehicle18: [{ required: true, message: '请输入值', trigger: 'blur' }],


}
</script>

<style lang="scss" scoped>
.outsider {
    width: 1012px;
    height: 496px;

    .top {
        position: absolute;
        top: 61px;
        left: 20px;

        span {
            font-size: 14px;
            font-weight: 400;
            letter-spacing: 0px;
            line-height: 20.27px;
            color: rgba(0, 0, 0, 1);
        }
    }

    .menuArea {
        .el-menu-demo {
            display: flex;
            justify-content: space-around;
        }

        .el-menu-item {
            margin: 10px 12px 0 12px;
            font-size: 16px;
            font-weight: 400;
            letter-spacing: 0px;
            line-height: 23.17px;
            color: rgba(70, 75, 84, 1);


        }

        .el-menu-item:focus,
        .el-menu-item:hover {
            outline: 0;
            background-color: #0263a3;
            color: rgba(70, 75, 84, 1);
            background-color: #fff;
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
            color: rgba(0, 0, 0, 1);
        }

        ::v-deep(.item .el-form-item__label) {
            font-size: 16px;
            font-weight: 400;
            letter-spacing: 0px;
            line-height: 23.17px;
            color: rgba(0, 0, 0, 1);
            display: block;
            height: 32px;
            line-height: 16px;
            display: flex;
            align-items: center;
        }

        ::v-deep(.ml-4 .el-radio__label:hover) {
            color: rgba(76, 176, 79, 1);

        }

        ::v-deep(.ml-4 .el-radio__input.is-checked+.el-radio__label) {
            color: rgba(76, 176, 79, 1);
        }

        ::v-deep(.ml-4 .el-radio__input.is-checked .el-radio__inner) {
            background: rgba(76, 176, 79, 1);
            border-color: rgba(76, 176, 79, 1);
        }

        ::v-deep(.ml-4 .el-radio__inner:hover) {
            border-color: rgba(76, 176, 79, 1);
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
}
</style>