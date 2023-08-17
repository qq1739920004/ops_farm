<template>
    <div class="app_container">
        <div class="middle-area">
            <div class="input_area">
                <el-input placeholder="请输入SN号" v-model="pageInfo.key" class="input-with-select"
                    @keyup.enter.native="search">
                    <template #append>
                        <el-button icon="Search" @click="search" />
                    </template>
                </el-input>
                <el-select class="m_2" placeholder="请选择" v-model="pageInfo.companyId" @blur="changeBlur">
                    <el-option value="1" label="公司/经销商" />
                    <el-option value="2" label="全部" />
                </el-select>
            </div>
            <div class="button_area">
                <el-button type="primary" class="btn1" @click="gotoInput">录入经销商设备</el-button>
                <el-button type="primary" class="btn2" @click="gotoCarModule">查看车型模版</el-button>
            </div>
        </div>
        <div class='table_container'>
            <el-table :default-sort="{ prop: 'createtime', order: 'descending' }" :header-cell-style="{
                background: 'rgba(247, 247, 247, 1)', height: '40px', color: 'rgba(0, 0, 0, 1)', font: '14px'
            }" style="width: 100%" :data="carNewList">
                <el-table-column type="index" label="序号" width="60" align="center" />

                <el-table-column label="铭牌SN" show-overflow-tooltip>
                    <template #default="scope">
                        <div style="display: flex; align-items: center">
                            <el-icon>
                                <MapLocation style="color:rgba(82, 196, 26, 1); width: 16px; height: 16px;" />
                            </el-icon>
                            <span style="margin-left: 10px">{{ scope.row.npn }}</span>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="SN" show-overflow-tooltip prop="sn">

                </el-table-column>

                <el-table-column label="车主姓名" show-overflow-tooltip prop="userName">

                </el-table-column>

                <el-table-column label="车辆型号" show-overflow-tooltip prop="model" />

                <el-table-column label="设备所在地" show-overflow-tooltip>
                    <template #="{ row }">
                        <div style="color: rgba(130, 130, 130, 1)">
                            {{ row.province }}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="类型" show-overflow-tooltip prop="terminalType">

                </el-table-column>

                <el-table-column label="过期时间" show-overflow-tooltip>
                    <template #="{ row }">
                        <el-popover placement="right" :width="200" trigger="hover" style="">
                            <template #reference>
                                <el-button
                                    style="width: 52px;height: 26px;opacity: 1;border:1px rgba(222, 255, 235, 1) solid;background: rgba(222, 255, 235, 1);font-size: 14px;font-weight: 400;letter-spacing: 0px;line-height: 20.27px;color: rgba(76, 176, 79, 1);text-align: left;vertical-align: top;">查看</el-button>
                            </template>
                            <el-row :gutter="16"
                                style="margin-bottom: 4px ;font-size: 12px;font-weight: 400;letter-spacing: 0px;line-height: 17.38px;color: rgba(202, 204, 207, 1);">
                                <el-col :span="7" :offset="2">
                                    类型
                                </el-col>
                                <el-col :span="15">
                                    过期时间
                                </el-col>
                            </el-row>
                            <el-row :gutter="16"
                                style="margin-bottom: 4px ;font-size: 12px;font-weight: 400;letter-spacing: 0px;line-height: 17.38px;color: rgba(128, 128, 128, 1);">
                                <el-col :span="7" :offset="2">
                                    罗网
                                </el-col>
                                <el-col :span="15">
                                    {{ row.netDate?.split(' ')[0] }}
                                </el-col>
                            </el-row>
                            <el-row :gutter="16"
                                style="margin-bottom: 4px ;font-size: 12px;font-weight: 400;letter-spacing: 0px;line-height: 17.38px;color: rgba(128, 128, 128, 1);">
                                <el-col :span="7" :offset="2">
                                    软件
                                </el-col>
                                <el-col :span="15">
                                    {{ row.expirationTime?.split(' ')[0] }}
                                </el-col>
                            </el-row>
                            <el-row :gutter="16"
                                style="margin-bottom: 4px ;font-size: 12px;font-weight: 400;letter-spacing: 0px;line-height: 17.38px;color: rgba(128, 128, 128, 1);">
                                <el-col :span="7" :offset="2">
                                    星基
                                </el-col>
                                <el-col :span="15">
                                    {{ row.satelliteDate?.split(' ')[0] }}
                                </el-col>
                            </el-row>
                            <el-row :gutter="16"
                                style="margin-bottom: 4px ;font-size: 12px;font-weight: 400;letter-spacing: 0px;line-height: 17.38px;color: rgba(128, 128, 128, 1);">
                                <el-col :span="7" :offset="2">
                                    质保
                                </el-col>
                                <el-col :span="15">
                                    {{ row.warrantyDate?.split(' ')[0] }}
                                </el-col>
                            </el-row>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column sortable label="最近上线时间" show-overflow-tooltip prop="createtime" width="140">
                    <template #="{ row }">
                        {{ row.lastOnlineTime?.split(' ')[0] }}
                    </template>
                </el-table-column>

                <el-table-column label="公司/经销商" show-overflow-tooltip prop="companyName">
                </el-table-column>

                <el-table-column label="星基" show-overflow-tooltip align="center">
                    <template #="{ row }">
                        <!-- v-model="row.satelliteStatus" 
                            :active-value="1"
                            :inactive-value="0" -->
                        <el-switch v-model="stitch" :before-change="beforeSwitchChange" @change="changeCarStatus(row)"
                            :active-value="1" :inactive-value="0" class="ml-2" inline-prompt active-text="开"
                            inactive-text="关"
                            style="width: 48px;height: 20px; --el-switch-on-color: #13ce66; --el-switch-off-color: rgba(204, 204, 204, 1)" />
                    </template>
                </el-table-column>
                <el-table-column label="数据存储" align="center">
                    <template #="{ row }">
                        <el-switch :before-change="beforeSwitchChange" @change="changeLogStatus(row.sn, row.isTransfer)"
                            v-model="row.isTransfer" class="ml-2" inline-prompt active-text="开" inactive-text="关"
                            style="width: 48px;height: 20px; --el-switch-on-color: #13ce66; --el-switch-off-color: rgba(204, 204, 204, 1)" />
                    </template>
                </el-table-column>

                <!-- 说明  离线和自动驾驶状态不可编辑 -->
                <el-table-column label="操作" width="350" show-overflow-tooltip>
                    <template #="{ row }">
                        <div class="tableBtn">
                            <el-button class="elbutton" size="small" text
                                @click="gotoMachineDetail(row.id, row.terminalType)">详情 </el-button>
                            <el-button class="elbutton" size="small" text>历史轨迹</el-button>
                            <el-button text class="elbutton" size="small"
                                @click="gotoRemote(row.terminalType, row.version, row.type, row.id)">远程调参</el-button>
                            <el-button text class="elbutton" size="small">文件存储</el-button>
                            <el-button text class="elbutton" size="small" @click="gotoRegister">注册</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="bottom">
            <Pagination :total="total" :currentPage="pageInfo.currentPage" :pageSize="pageInfo.pageSize"
                @pageChange="currentChange">
            </Pagination>
        </div>
        <InputDia ref="inputD"></InputDia>
        <CarModuleDia ref="carModuleD"></CarModuleDia>
        <MachineDetailDia ref="MachineD" :carId="carId" :terminalType="terminalType"></MachineDetailDia>
        <RemoteAdjustDia360 ref="RemoteD" :terminalType="terminalType" :version="version" :type="type" :carId="carId">
        </RemoteAdjustDia360>
        <RemoteAdjustDia302 ref="RemoteD302" :terminalType="terminalType" :version="version" :type="type" :carId="carId">
        </RemoteAdjustDia302>
        <RemoteAdjustDia502 ref="RemoteD502" :terminalType="terminalType" :version="version" :type="type" :carId="carId">
        </RemoteAdjustDia502>
        <RegisterDia ref='RegisterD'></RegisterDia>
    </div>
</template>

<script setup lang='ts'>
import InputDia from './components/inputDia.vue'
import Pagination from '@/components/Pagination/index.vue'
import CarModuleDia from './components/carModuleDia.vue'
import MachineDetailDia from './components/machineDetailDia.vue'
import RemoteAdjustDia360 from './components/remoteAdjust.vue'
import RemoteAdjustDia302 from './components/remoteAdjust302.vue'
import RemoteAdjustDia502 from './components/remoteAdjust502.vue'
import RegisterDia from './components/registerDia.vue'
import { reactive, ref, nextTick } from 'vue'
import { carNewList_API, carStatus_API, logOpen_API, logClose_API } from '@/api/machineryList/index'
import { newListObj, carNewListResponseData, pageInfo, carStatusObj } from '@/api/machineryList/type'
const total = ref<number>(10)
const pageInfo = reactive<pageInfo>({
    key: '',
    currentPage: 1,
    pageSize: 3,
    companyId: '',
    order: '1'
})
const stitch = ref<number>(1)
const inputD = ref()
const carModuleD = ref()
const MachineD = ref()
const RemoteD = ref()
const RemoteD302 = ref()
const RemoteD502 = ref()
const RegisterD = ref()
const version = ref<string>('')
const type = ref<string>('')
// 车辆列表
const carNewList = ref<newListObj[]>([])
// 车辆ID 
const carId = ref<number>()
const terminalType = ref<string>('')
// 星基请求参数
const carStatus = ref<carStatusObj>({
    'ids': [],
    'commandType': 0,
    'commandStatus': 0
})
const switchStatus = ref<boolean>(false)

const search = () => {
    getCarList()
}
const changeBlur = () => {
    getCarList()
}
const currentChange = (val: any) => {
    pageInfo.currentPage = val.currentPage
    pageInfo.pageSize = val.pageSize
    getCarList()
}
const gotoInput = () => {
    inputD.value.dialogVisible = true
}
const gotoCarModule = () => {
    carModuleD.value.dialogVisible = true
}
const gotoMachineDetail = (val: any, val2: any) => {
    carId.value = val
    terminalType.value = val2
    MachineD.value.dialogVisible = true
}
const gotoRemote = (val: any, val2: any, val3: any, val4: any) => {
    terminalType.value = val
    version.value = val2
    type.value = val3
    carId.value = val4
    if (terminalType.value == 'AG360') {
        RemoteD.value.dialogVisible = true
    } if (terminalType.value == 'AG302') {
        RemoteD302.value.dialogVisible = true
    } if (terminalType.value == 'AG502') {
        RemoteD502.value.dialogVisible = true
    } else {
        RemoteD.value.dialogVisible = true
    }
    nextTick(() => {
        RemoteD.value.carFormRef?.clearValidate()
    })

}
const gotoRegister = () => {
    RegisterD.value.dialogVisible = true
}
// 获取车辆列表
const getCarList = async () => {
    const res: carNewListResponseData = await carNewList_API(pageInfo)
    carNewList.value = res.data.records
    total.value = res.data.total
}


// 取消首次触发change钩子
const beforeSwitchChange = (val: any) => {
    switchStatus.value = true;
    return switchStatus.value;
}

// 更改星基状态
const changeCarStatus = async (val: any) => {
    if (switchStatus) {
        carStatus.value.ids = val.id
        carStatus.value.commandType = 11
        carStatus.value.commandStatus = val.satelliteStatus
    }
    await carStatus_API(carStatus.value)


}

// 更改日志上传状态
const changeLogStatus = async (val: any, val2: any) => {
    if (switchStatus) {
        console.log(val, val2);
        if (val2 == true) {
            await logOpen_API(val)
        } else {
            await logClose_API(val)
        }

    }
}
getCarList()

</script>

<style lang="scss" scoped>
.middle-area {
    height: 60px;
    display: flex;
    justify-content: space-between;
    margin: 0px 10px 0 10px;
    align-items: center;

    .input_area {
        .input-with-select {
            width: 290px;
            height: 32px;
            opacity: 1;
            border-radius: 4px;
            background: rgba(255, 255, 255, 1);
            border: 1px rgba(220, 223, 230, 1);
            margin-right: 40px;
        }

        .m_2 {
            width: 179px;
            height: 32px;
            opacity: 1;
            border-radius: 4px;
            background: rgba(255, 255, 255, 1);
            border: 1px rgba(220, 223, 230, 1);
        }

    }

}

.table_container {
    .tableBtn {
        .elbutton {
            width: 57px;
            height: 21px;
            opacity: 1;
            /** 文本1 */
            font-size: 14px;
            font-weight: 400;
            letter-spacing: 0px;
            line-height: 20.27px;
            color: rgba(76, 176, 79, 1);
            text-align: left;
            vertical-align: top;
        }

    }
}
</style>