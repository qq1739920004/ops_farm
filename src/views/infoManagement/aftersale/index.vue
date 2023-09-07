<!--  -->
<template>
    <div class="app_container ">
        <div class="table_container app_card">
            <div class="middle-area">
                <div class="left ">
                    <div class="lefttitle">基本信息</div>
                    <div class="leftcontent">
                        <el-row :gutter="16">
                            <el-col :span="10" :offset="2">
                                <el-descriptions title="">
                                    <el-descriptions-item label="客户名称:">{{ topvalue.username }}</el-descriptions-item>
                                </el-descriptions>
                            </el-col>
                            <el-col :span="11">
                                <el-descriptions title="">
                                    <el-descriptions-item label="客户手机号码名称:">{{ topvalue.tel }}</el-descriptions-item>
                                </el-descriptions>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="11" :offset="3">
                                <el-descriptions title="">
                                    <el-descriptions-item label="经销商：">{{ topvalue.companyName }}</el-descriptions-item>
                                </el-descriptions>
                            </el-col>
                        </el-row>
                        <el-row :gutter="16">
                            <el-col :span="9" :offset="3">
                                <el-descriptions title="">
                                    <el-descriptions-item label="创建人:">{{ topvalue.creatorName }}</el-descriptions-item>
                                </el-descriptions>
                            </el-col>
                            <el-col :span="11">
                                <el-descriptions title="">
                                    <el-descriptions-item label="注册码:">{{ topvalue.code }}</el-descriptions-item>
                                </el-descriptions>
                            </el-col>
                        </el-row>
                        <el-row :gutter="16">
                            <el-col :span="10" :offset="2">
                                <el-descriptions title="">
                                    <el-descriptions-item label="罗网期限:">{{ topvalue.netDate?.split(' ')[0]
                                    }}</el-descriptions-item>
                                </el-descriptions>
                            </el-col>
                            <el-col :span="11">
                                <el-descriptions title="">
                                    <el-descriptions-item label="质保期限:">{{ topvalue.warrantyDate?.split(' ')[0]
                                    }}</el-descriptions-item>
                                </el-descriptions>
                            </el-col>
                        </el-row>
                        <el-row :gutter="16">
                            <el-col :span="10" :offset="2">
                                <el-descriptions title="">
                                    <el-descriptions-item label="软件期限:">{{ topvalue.expirationTime?.split(' ')[0]
                                    }}</el-descriptions-item>
                                </el-descriptions>
                            </el-col>
                            <el-col :span="11">
                                <el-descriptions title="">
                                    <el-descriptions-item label="星基期限:">{{ topvalue.satelliteDate?.split(' ')[0]
                                    }}</el-descriptions-item>
                                </el-descriptions>
                            </el-col>

                        </el-row>
                    </div>
                </div>
                <div class="right">
                    <div class="righttitle">部件</div>
                    <div class="rightcontent">
                        <el-form :model="topvalue" ref="formRef">
                            <el-form-item label="铭牌SN:" label-width="110px" prop="npn">
                                {{ topvalue.npn || '/' }}
                            </el-form-item>
                            <el-form-item label="平板SN:" label-width="110px" prop="sn">
                                <el-input v-model="topvalue.sn">
                                    <template #append>
                                        <el-button @click="changeSnBtn(topvalue.sn)"
                                            style=" width: 74px;height: 32px;background: var(--el-color-primary); color:#fff">更换</el-button>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="电机SN:" label-width="110px" prop="motorSn">
                                <el-input v-model="topvalue.motorSn">
                                    <template #append>
                                        <el-button @click="changeMotorSnBtn(topvalue.motorSn)"
                                            style=" width: 74px;height: 32px;background: var(--el-color-primary); color:#fff">更换</el-button>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item v-if="scence != '1'" label="车身SN:" label-width="110px" prop="carImuSn">
                                <el-input v-model="topvalue.carImuSn">
                                    <template #append>
                                        <el-button @click="changeCarImuSnBtn(topvalue.carImuSn)"
                                            style=" width: 74px;height: 32px;background: var(--el-color-primary); color:#fff">更换</el-button>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item v-if="scence != '1'" label="前轮SN:" label-width="110px" prop="wheelImuSn">
                                <el-input v-model="topvalue.wheelImuSn">
                                    <template #append>
                                        <el-button @click="changeWheelImuSnBtn(topvalue.wheelImuSn)"
                                            style=" width: 74px;height: 32px;background: var(--el-color-primary); color:#fff">更换</el-button>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item v-if="scence != '1'" label="天线_1SN:" label-width="110px" prop="antennaOne">
                                <el-input v-model="topvalue.antennaOne">
                                    <template #append>
                                        <el-button @click="changeAntennaOneBtn(topvalue.antennaOne)"
                                            style=" width: 74px;height: 32px;background: var(--el-color-primary); color:#fff">更换</el-button>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item v-if="scence == '2'" label="天线_2SN:" label-width="110px" prop="antennaTwo">
                                <el-input v-model="topvalue.antennaTwo">
                                    <template #append>
                                        <el-button @click="changeAntennaTwoBtn(topvalue.antennaTwo)"
                                            style=" width: 74px;height: 32px;background: var(--el-color-primary); color:#fff">更换</el-button>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item v-if="scence == '1'" label="HUB_SN:" label-width="110px" prop="hubSn">
                                <el-input v-model="topvalue.hubSn">
                                    <template #append>
                                        <el-button @click="changeHubSnBtn(topvalue.hubSn)"
                                            style=" width: 74px;height: 32px;background: var(--el-color-primary); color:#fff">更换</el-button>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item v-if="scence == '1'" label="一体机SN:" label-width="110px" prop="sn">
                                <el-input v-model="topvalue.sn">
                                    <template #append>
                                        <el-button @click="changeSnBtn(topvalue.sn)"
                                            style=" width: 74px;height: 32px;background: var(--el-color-primary); color:#fff">更换</el-button>
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
            <div class="bottomarea">
                <div class="bottomtitle">
                    <span>变更信息</span>
                    <el-button type="primary" @click="getInfo">
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

    if (res.data.length > 0) {
        Object.assign(tableData, res.data)
        ElMessage({ type: 'success', message: '获取成功' })
    } else {
        ElMessage({ message: '暂无变更记录' })
    }

}
const getTopInfo = async () => {
    const res: carMoudleInfoGetLeftResponseData = await carModuleInfoGet_API(saleObj.id as number)
    Object.assign(topvalue, res.data)
}
getTopInfo()
const changeSnBtn = async (val: string) => {
    const res: any = await carModuleInfoUpdate_API({ 'sn': val, 'type': '', 'id': topvalue.id })
    if (res.code == 0) {
        ElMessage({ type: 'success', message: '编辑成功' })
        getTopInfo
    }
    else {
        ElMessage({ type: 'error', message: '编辑失败' })
    }
}
const changeMotorSnBtn = async (val: string) => {
    const res: any = await carModuleInfoUpdate_API({ 'motorSn': val, 'type': '', 'id': topvalue.id })
    if (res.code == 0) {
        ElMessage({ type: 'success', message: '编辑成功' })
        getTopInfo
    }
    else {
        ElMessage({ type: 'error', message: '编辑失败' })
    }
}

const changeCarImuSnBtn = async (val: string) => {
    const res: any = await carModuleInfoUpdate_API({ 'carImuSn': val, 'type': '', 'id': topvalue.id })
    if (res.code == 0) {
        ElMessage({ type: 'success', message: '编辑成功' })
        getTopInfo
    }
    else {
        ElMessage({ type: 'error', message: '编辑失败' })
    }
}
const changeWheelImuSnBtn = async (val: string) => {
    const res: any = await carModuleInfoUpdate_API({ 'wheelImuSn': val, 'type': '', 'id': topvalue.id })
    if (res.code == 0) {
        ElMessage({ type: 'success', message: '编辑成功' })
        getTopInfo
    }
    else {
        ElMessage({ type: 'error', message: '编辑失败' })
    }
}

const changeAntennaOneBtn = async (val: string) => {
    const res: any = await carModuleInfoUpdate_API({ 'antennaOne': val, 'type': '', 'id': topvalue.id })
    if (res.code == 0) {
        ElMessage({ type: 'success', message: '编辑成功' })
        getTopInfo
    }
    else {
        ElMessage({ type: 'error', message: '编辑失败' })
    }
}
const changeAntennaTwoBtn = async (val: string) => {
    const res: any = await carModuleInfoUpdate_API({ 'antennaTwo': val, 'type': '', 'id': topvalue.id })
    if (res.code == 0) {
        ElMessage({ type: 'success', message: '编辑成功' })
        getTopInfo
    }
    else {
        ElMessage({ type: 'error', message: '编辑失败' })
    }
}
const changeHubSnBtn = async (val: string) => {
    const res: any = await carModuleInfoUpdate_API({ 'hubSn': val, 'type': '', 'id': topvalue.id })
    if (res.code == 0) {
        ElMessage({ type: 'success', message: '编辑成功' })
        getTopInfo
    }
    else {
        ElMessage({ type: 'error', message: '编辑失败' })
    }
}

</script>

<style lang="scss" scoped>
.app_container {
    .middle-area {
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
            }

            .leftcontent {
                margin-left: -10px;
                font-size: 16px;
                font-weight: 400;
                letter-spacing: 0px;
                line-height: 23.17px;


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
            }

            .rightcontent {

                ::v-deep(.el-form-item__label) {
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
                    color: #303133;
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
            padding: 20px 0 0 60px;
            margin-bottom: 20px;
            height: 50px;

            span {
                margin-right: 34px;
            }
        }

        .el-button {
            width: 104px;
            height: 32px;
            opacity: 1;
            border-radius: 4px;
        }

        .main {
            margin-left: 167px;
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