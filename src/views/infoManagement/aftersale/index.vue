<!--  -->
<template>
    <div class="app-container">
        <div class="middle-area">
            <div class="left">
                <div class="lefttitle">基本信息</div>
                <div class="leftcontent">
                    <el-row :gutter="16">
                        <el-col :span="11" :offset="2">
                            客户名称:{{ topvalue.username }}
                        </el-col>
                        <el-col :span="11">
                            手机号码:{{ topvalue.tel }}
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24" :offset="3">
                            经销商：{{ topvalue.companyName }}
                        </el-col>
                    </el-row>
                    <el-row :gutter="16">
                        <el-col :span="10" :offset="3">
                            创建人:{{ topvalue.creatorName }}
                        </el-col>
                        <el-col :span="9">
                            注册码:{{ topvalue.code }}
                        </el-col>
                    </el-row>
                    <el-row :gutter="16">
                        <el-col :span="11" :offset="2">
                            罗网期限:{{ topvalue.netDate?.split(' ')[0] }}
                        </el-col>
                        <el-col :span="11">
                            质保期限:{{ topvalue.warrantyDate?.split(' ')[0] }}
                        </el-col>
                    </el-row>
                    <el-row :gutter="16">
                        <el-col :span="11" :offset="2">
                            软件期限{{ topvalue.expirationTime?.split(' ')[0] }}
                        </el-col>
                        <el-col :span="11">
                            星基期限:{{ topvalue.satelliteDate?.split(' ')[0] }}
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="right">
                <div class="righttitle">部件</div>
                <div class="rightcontent">
                    <el-row :gutter="2">
                        <el-col :span="3" :offset="2">
                            铭牌SN:
                        </el-col>
                        <el-col :span='8'>
                            {{ topvalue.npn || '/' }}
                        </el-col>
                    </el-row>
                    <el-row :gutter="16">
                        <el-col :span="3" :offset="2">
                            平板SN:
                        </el-col>
                        <el-col :span='8'>
                            <el-input v-model="topvalue.sn" class="input-with-select">
                                <template #append>
                                    <el-button @click="changeSnBtn(topvalue.sn)"
                                        style=" width: 74px;height: 32px;background: rgba(76, 176, 79, 1); color:#fff">更换</el-button>
                                </template>
                            </el-input>

                        </el-col>
                    </el-row>
                    <el-row :gutter="16">
                        <el-col :span="3" :offset="2">
                            电机SN:
                        </el-col>
                        <el-col :span='8'>
                            <el-input v-model="topvalue.motorSn" class="input-with-select">
                                <template #append>
                                    <el-button @click="changeMotorSnBtn(topvalue.motorSn)"
                                        style=" width: 74px;height: 32px;background: rgba(76, 176, 79, 1); color:#fff">更换</el-button>
                                </template>
                            </el-input>

                        </el-col>
                    </el-row>
                    <el-row :gutter="16" v-if="scence != '1'">
                        <el-col :span="3" :offset="2">
                            车身SN
                        </el-col>
                        <el-col :span='8'>
                            <el-input v-model="topvalue.carImuSn" class="input-with-select">
                                <template #append>
                                    <el-button @click="changeCarImuSnBtn(topvalue.carImuSn)"
                                        style=" width: 74px;height: 32px;background: rgba(76, 176, 79, 1); color:#fff">更换</el-button>
                                </template>
                            </el-input>

                        </el-col>
                    </el-row>
                    <el-row :gutter="16" v-if="scence != '1'">
                        <el-col :span="3" :offset="2">
                            前轮SN
                        </el-col>
                        <el-col :span='8'>
                            <el-input v-model="topvalue.wheelImuSn" class="input-with-select">
                                <template #append>
                                    <el-button @click="changeWheelImuSnBtn(topvalue.wheelImuSn)"
                                        style=" width: 74px;height: 32px;background: rgba(76, 176, 79, 1); color:#fff">更换</el-button>
                                </template>
                            </el-input>

                        </el-col>
                    </el-row>
                    <el-row :gutter="16" v-if="scence != '1'">
                        <el-col :span="3" :offset="2">
                            天线_1SN
                        </el-col>
                        <el-col :span='8'>
                            <el-input v-model="topvalue.antennaOne" class="input-with-select">
                                <template #append>
                                    <el-button @click="changeAntennaOneBtn(topvalue.antennaOne)"
                                        style=" width: 74px;height: 32px;background: rgba(76, 176, 79, 1); color:#fff">更换</el-button>
                                </template>
                            </el-input>

                        </el-col>
                    </el-row>
                    <el-row :gutter="16" v-if="scence == '2'">
                        <el-col :span="3" :offset="2">
                            天线_2SN
                        </el-col>
                        <el-col :span='8'>
                            <el-input v-model="topvalue.antennaTwo" class="input-with-select">
                                <template #append>
                                    <el-button @click="changeAntennaTwoBtn(topvalue.antennaTwo)"
                                        style=" width: 74px;height: 32px;background: rgba(76, 176, 79, 1); color:#fff">更换</el-button>
                                </template>
                            </el-input>

                        </el-col>
                    </el-row>
                    <el-row :gutter="16" v-if="scence == '1'">
                        <el-col :span="3" :offset="2">
                            HUB_SN
                        </el-col>
                        <el-col :span='8'>
                            <el-input v-model="topvalue.hubSn" class="input-with-select">
                                <template #append>
                                    <el-button @click="changeHubSnBtn(topvalue.hubSn)"
                                        style=" width: 74px;height: 32px;background: rgba(76, 176, 79, 1); color:#fff">更换</el-button>
                                </template>
                            </el-input>

                        </el-col>
                    </el-row>
                    <el-row :gutter="16" v-if="scence == '1'">
                        <el-col :span="3" :offset="2">
                            一体机SN
                        </el-col>
                        <el-col :span='8'>
                            <el-input v-model="topvalue.sn" class="input-with-select">
                                <template #append>
                                    <el-button @click="changeSnBtn(topvalue.sn)"
                                        style=" width: 74px;height: 32px;background: rgba(76, 176, 79, 1); color:#fff">更换</el-button>
                                </template>
                            </el-input>

                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
        <div class="bottomarea">
            <div class="bottomtitle">
                <div>变更信息</div>
                <el-button @click="getInfo">
                    加载信息
                </el-button>
            </div>
            <div class="main">
                <el-table :data="tableData" style="width: 100%;" :row-style="{ height: '60px' }"
                    :cell-style="{ padding: '10px' }">
                    <el-table-column type="index" label="序号" width="80" />
                    <el-table-column prop="dateTime" label="时间" width="200" />
                    <el-table-column prop="operation" label="操作" />
                </el-table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { RecordsObj, carModuleInfoOperationLogResponseData, LogObj, carMoudleInfoGetLeftResponseData, MoudleInfoGetLeftObj } from "@/api/infoManagement/type"
import { reactive, ref } from 'vue';
import { carModuleInfoGet_API, carModuleInfoOperationLog_API, carModuleInfoUpdate_API } from '@/api/infoManagement/index'
import { ElMessage } from 'element-plus'
const scence = ref<string>('')
let $route = useRoute()
scence.value = JSON.parse($route.query.scence as string)
const saleObj = reactive<RecordsObj>({
    carImuSn: '',
    hubSn: '',
    code: '',
    expirationTime: '',
    netDate: '',
    superCattleModuleInfo: '',
    npn: '',
    warrantyDate: '',
    tel: '',
    creatorName: '',
    companyId: 0,
    satelliteDate: '',
    terminalType: '',
    id: null,
    steeringWheelSn: '',
    wheelImuSn: '',
    antennaTwo: '',
    creatorId: 0,
    userId: 0,
    motorSn: '',
    username: '',
    antennaOne: '',
    companyName: '',
    sn: '',
    type: ''
})
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
    code: ''
})
Object.assign(saleObj, JSON.parse($route.query.row as string))
const tableData = reactive<LogObj[]>([])
const getInfo = async () => {
    const res: carModuleInfoOperationLogResponseData = await carModuleInfoOperationLog_API(saleObj.id as number)
    console.log(res);
    Object.assign(tableData, res.data)

}
const getTopInfo = async () => {
    const res: carMoudleInfoGetLeftResponseData = await carModuleInfoGet_API(saleObj.id as number)
    Object.assign(topvalue, res.data)
}
getTopInfo()
const changeSnBtn = async (val: string) => {
    const res: any = await carModuleInfoUpdate_API({ 'sn': val, 'type': '', 'id': topvalue.id })
    if (res.code == 200) {
        ElMessage({ type: 'success', message: '编辑成功' })
        getTopInfo
    }
    else {
        ElMessage({ type: 'error', message: '编辑失败' })
    }
}
const changeMotorSnBtn = async (val: string) => {
    const res: any = await carModuleInfoUpdate_API({ 'motorSn': val, 'type': '', 'id': topvalue.id })
    if (res.code == 200) {
        ElMessage({ type: 'success', message: '编辑成功' })
        getTopInfo
    }
    else {
        ElMessage({ type: 'error', message: '编辑失败' })
    }
}

const changeCarImuSnBtn = async (val: string) => {
    const res: any = await carModuleInfoUpdate_API({ 'carImuSn': val, 'type': '', 'id': topvalue.id })
    if (res.code == 200) {
        ElMessage({ type: 'success', message: '编辑成功' })
        getTopInfo
    }
    else {
        ElMessage({ type: 'error', message: '编辑失败' })
    }
}
const changeWheelImuSnBtn = async (val: string) => {
    const res: any = await carModuleInfoUpdate_API({ 'wheelImuSn': val, 'type': '', 'id': topvalue.id })
    if (res.code == 200) {
        ElMessage({ type: 'success', message: '编辑成功' })
        getTopInfo
    }
    else {
        ElMessage({ type: 'error', message: '编辑失败' })
    }
}

const changeAntennaOneBtn = async (val: string) => {
    const res: any = await carModuleInfoUpdate_API({ 'antennaOne': val, 'type': '', 'id': topvalue.id })
    if (res.code == 200) {
        ElMessage({ type: 'success', message: '编辑成功' })
        getTopInfo
    }
    else {
        ElMessage({ type: 'error', message: '编辑失败' })
    }
}
const changeAntennaTwoBtn = async (val: string) => {
    const res: any = await carModuleInfoUpdate_API({ 'antennaTwo': val, 'type': '', 'id': topvalue.id })
    if (res.code == 200) {
        ElMessage({ type: 'success', message: '编辑成功' })
        getTopInfo
    }
    else {
        ElMessage({ type: 'error', message: '编辑失败' })
    }
}
const changeHubSnBtn = async (val: string) => {
    const res: any = await carModuleInfoUpdate_API({ 'hubSn': val, 'type': '', 'id': topvalue.id })
    if (res.code == 200) {
        ElMessage({ type: 'success', message: '编辑成功' })
        getTopInfo
    }
    else {
        ElMessage({ type: 'error', message: '编辑失败' })
    }
}

</script>

<style lang="scss" scoped>
.app-container {
    .middle-area {
        height: 24.25rem;
        margin-top: 20px;
        border-bottom: 1px solid rgba(235, 238, 245, 1);
        display: flex;

        .left {
            padding: 15px 0 0 60px;
            height: 100%;
            width: 50%;

            .lefttitle {
                margin-bottom: 20px;
                font-size: 18px;
                font-weight: 400;
                letter-spacing: 0px;
                line-height: 26.06px;
                color: rgba(0, 0, 0, 1);
                text-align: left;
                vertical-align: top;
            }

            .leftcontent {
                margin-left: -10px;
                font-size: 16px;
                font-weight: 400;
                letter-spacing: 0px;
                line-height: 23.17px;
                color: rgba(0, 0, 0, 1);

                .el-row {
                    margin-bottom: 20px;

                }
            }
        }

        .right {
            padding: 15px 0 0 0;
            height: 100%;
            width: 50%;

            .righttitle {
                margin-bottom: 20px;
                font-size: 18px;
                font-weight: 400;
                letter-spacing: 0px;
                line-height: 26.06px;
                color: rgba(0, 0, 0, 1);
                text-align: left;
                vertical-align: top;
            }

            .rightcontent {
                margin-left: -10px;
                font-size: 16px;
                font-weight: 400;
                letter-spacing: 0px;
                line-height: 23.17px;
                color: rgba(0, 0, 0, 1);

                .el-row {
                    margin-bottom: 10px;
                    align-items: center;
                    font-size: 16px;
                    font-weight: 400;
                    letter-spacing: 0px;
                    line-height: 23.17px;
                    color: rgba(0, 0, 0, 1);
                    text-align: left;
                    vertical-align: top;

                    .el-input {
                        width: 280px;
                        height: 32px;
                        opacity: 1;
                        border-radius: 2px;
                        border: 1px solid rgba(220, 223, 230, 1);
                    }

                }
            }

        }
    }

    .bottomarea {
        padding-bottom: 10px;
        width: 100%;
        height: 468px;

        .bottomtitle {
            width: 15%;
            display: flex;
            height: 50px;
            align-items: center;
            justify-content: space-around;
        }

        .el-button {
            width: 104px;
            height: 32px;
            opacity: 1;
            border-radius: 4px;
            background: rgba(76, 176, 79, 1);
            color: #fff
        }

        .main {
            margin-left: 120px;
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