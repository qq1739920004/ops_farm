<!--  -->
<template>
    <el-table @sort-change="changesort" :data="props.carNewList" stripe>
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="铭牌SN" align="center" width="180">
            <template #default="scope">
                <div style="display: flex; align-items: center">
                    <el-icon>
                        <MapLocation style="color:var(--el-color-primary); width: 16px; height: 16px;" />
                    </el-icon>
                    <span style="margin-left: 10px">{{ scope.row.npn }}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="SN" align="center" prop="sn">
        </el-table-column>
        <el-table-column label="车主姓名" align="center" prop="userName">
        </el-table-column>
        <el-table-column label="车辆型号" align="center" prop="model" />
        <el-table-column label="设备所在地" align="center">
            <template #="{ row }">
                <div style="color: rgba(130, 130, 130, 1)">
                    {{ row.province }}
                </div>
            </template>
        </el-table-column>
        <el-table-column label="类型" align="center" prop="terminalType">
        </el-table-column>
        <el-table-column label="过期时间" align="center">
            <template #="{ row }">
                <el-popover placement="right" :width="200" trigger="hover" style="">
                    <template #reference>
                        <el-button type="primary"
                            style="width: 52px;height: 26px;opacity: 1;font-size: 14px;text-align: left;vertical-align: top;">查看</el-button>
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
                        style="margin-bottom: 4px ;font-size: 12px;font-weight: 400;letter-spacing: 0px;line-height: 17.38px;">
                        <el-col :span="7" :offset="2">
                            罗网
                        </el-col>
                        <el-col :span="15">
                            {{ row.netDate?.split(' ')[0] }}
                        </el-col>
                    </el-row>
                    <el-row :gutter="16"
                        style="margin-bottom: 4px ;font-size: 12px;font-weight: 400;letter-spacing: 0px;line-height: 17.38px;">
                        <el-col :span="7" :offset="2">
                            软件
                        </el-col>
                        <el-col :span="15">
                            {{ row.expirationTime?.split(' ')[0] }}
                        </el-col>
                    </el-row>
                    <el-row :gutter="16"
                        style="margin-bottom: 4px ;font-size: 12px;font-weight: 400;letter-spacing: 0px;line-height: 17.38px;">
                        <el-col :span="7" :offset="2">
                            星基
                        </el-col>
                        <el-col :span="15">
                            {{ row.satelliteDate?.split(' ')[0] }}
                        </el-col>
                    </el-row>
                    <el-row :gutter="16"
                        style="margin-bottom: 4px ;font-size: 12px;font-weight: 400;letter-spacing: 0px;line-height: 17.38px;">
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
        <el-table-column sortable label="最近上线时间" align="center" prop="createtime" width="140">
            <template #="{ row }">
                {{ row.lastOnlineTime?.split(' ')[0] }}
            </template>
        </el-table-column>
        <el-table-column label="公司/经销商" align="center">
            <template #="{ row }">
                {{ row.companyName || '/' }}
            </template>
        </el-table-column>
        <el-table-column label="星基" align="center">
            <template #="{ row }">
                <!-- v-model="row.satelliteStatus" 
                            :active-value="1"
                            :inactive-value="0" -->
                <el-switch v-model="row.satelliteStatus" :before-change="beforeSwitchChange" @change="changeCarStatus(row)"
                    :active-value="1" :inactive-value="0" class="ml-2" inline-prompt active-text="开" inactive-text="关" />
            </template>
        </el-table-column>
        <el-table-column label="数据存储" align="center">
            <template #="{ row }">
                <el-switch :before-change="beforeSwitchChange" @change="changeLogStatus(row.sn, row.isTransfer)"
                    v-model="row.isTransfer" class="ml-2" inline-prompt active-text="开" inactive-text="关" />
            </template>
        </el-table-column>
        <!-- 说明  离线和自动驾驶状态不可编辑 -->
        <el-table-column label="操作" align="center" width="290">
            <template #="{ row }">
                <el-button style="margin-right: -10px;" type="primary" link
                    @click="gotoMachineDetail(row.id, row.terminalType)">详情</el-button>
                <el-button style="margin-right: -10px;" type="primary" link
                    @click="gotoMap(row.sn, row.npn)">历史轨迹</el-button>
                <el-tooltip style="margin-right: -10px;"
                    :disabled="row.onlineTcp === 0 || row.driveState === (1 || 2) ? false : true" class="box-item"
                    effect="dark" content="车辆离线或处于自动驾驶状态" placement="top-start">
                    <el-button style="margin-right: -10px;"
                        :disabled="row.onlineTcp === 0 || row.driveState === (1 || 2) ? true : false" type="primary" link
                        @click="gotoRemote(row.terminalType, row.version, row.type, row.id, row.sn, row.name)">远程调参</el-button>
                </el-tooltip>
                <el-button style="margin-right: -10px;" type="primary" link>文件存储</el-button>
                <el-button style="margin-right: -10px;" type="primary" link
                    @click="gotoRegister(row.id, row.sn, row.deviceId)">注册</el-button>
            </template>
        </el-table-column>
    </el-table>
    <slot></slot>
    <MachineDetailDia ref="MachineD" :carId="carId" :terminalType="terminalType"></MachineDetailDia>
    <RemoteAdjustDia360 ref="RemoteD" :terminalType="terminalType" :version="version" :type="type" :carId="carId" :sn="sn"
        :name="name">
    </RemoteAdjustDia360>
    <RemoteAdjustDia302 ref="RemoteD302" :terminalType="terminalType" :version="version" :type="type" :carId="carId"
        :sn="sn" :name="name">
    </RemoteAdjustDia302>
    <RemoteAdjustDia502 ref="RemoteD502" :terminalType="terminalType" :version="version" :type="type" :carId="carId"
        :sn="sn" :name="name">
    </RemoteAdjustDia502>
    <RegisterDia ref='RegisterD' :sn="sn" :carId="carId" :deviceId="deviceId"></RegisterDia>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { carStatus_API, logOpen_API, logClose_API } from '@/api/machineryList/index'
import { pageInfo, carStatusObj } from '@/api/machineryList/type'
import MachineDetailDia from './machineDetailDia.vue'
import RemoteAdjustDia360 from './remoteAdjust.vue'
import RemoteAdjustDia302 from './remoteAdjust302.vue'
import RemoteAdjustDia502 from './remoteAdjust502.vue'
import RegisterDia from './registerDia.vue'
import { useRouter } from 'vue-router'

const router = useRouter();
const props = defineProps(['carNewList'])
const emits = defineEmits(['changeSort'])
const switchStatus = ref<boolean>(false)
const sn = ref()
const MachineD = ref()
const RemoteD = ref()
const RemoteD302 = ref()
const RemoteD502 = ref()
const RegisterD = ref()
const version = ref<string>('')
const type = ref<string>('')
const name = ref<string>('')
const deviceId = ref<string>('')
// 车辆ID 
const carId = ref<number>()
const terminalType = ref<string>('')
// 星基请求参数
const carStatus = ref<carStatusObj>({
    'ids': [],
    'commandType': 0,
    'commandStatus': 0
})
const pageInfo = reactive<any>({
    order: '1'
})
const changesort = (val: any) => {
    switch (val.order) {
        case 'ascending': pageInfo.order = '2'; break
        case 'descending': pageInfo.order = '1'; break
        case null: pageInfo.order = '1'; break
    }
    emits('changeSort', pageInfo.order)
}
// 取消首次触发change钩子
const beforeSwitchChange = () => {
    switchStatus.value = true;
    return switchStatus.value;
}
console.log(props.carNewList);
const changeCarStatus = async (val: any) => {
    if (switchStatus) {
        carStatus.value.ids.push(val.id)
        carStatus.value.commandType = 11
        carStatus.value.commandStatus = val.satelliteStatus
    }
    const res = await carStatus_API(carStatus.value)
    if (res.code == 0) {
        ElMessage({ type: 'success', message: '修改成功', duration: 1000 })

    }
    else {
        ElMessage({ type: 'error', message: '修改失败', duration: 1000 })
    }
    carStatus.value.ids = []

}
// 更改日志上传状态
const changeLogStatus = async (val: any, val2: any) => {
    if (switchStatus) {
        console.log(val, val2);
        if (val2 == true) {
            const res = await logOpen_API(val)
            if (res.code == 0) {
                ElMessage({ type: 'success', message: '修改成功', duration: 1000 })

            }
            else {
                ElMessage({ type: 'error', message: '修改失败', duration: 1000 })
            }
        } else {
            const res = await logClose_API(val)
            if (res.code == 0) {
                ElMessage({ type: 'success', message: '修改成功', duration: 1000 })

            }
            else {
                ElMessage({ type: 'error', message: '修改失败', duration: 1000 })
            }
        }

    }
}
const gotoMachineDetail = (val: any, val2: any) => {
    carId.value = val
    terminalType.value = val2
    MachineD.value.dialogVisible = true
}
const gotoRegister = (val: any, val2: any, val3: any) => {
    carId.value = val
    sn.value = val2
    deviceId.value = val3
    RegisterD.value.dialogVisible = true
}
const gotoRemote = (val: any, val2: any, val3: any, val4: any, val5: any, val6: any) => {
    terminalType.value = val
    version.value = val2
    type.value = val3
    carId.value = val4
    sn.value = val5
    name.value = val6
    if (terminalType.value == 'AG360') {
        RemoteD.value.dialogVisible = true
    } if (terminalType.value == 'AG302') {
        RemoteD302.value.dialogVisible = true
    } if (terminalType.value == 'AG502') {
        RemoteD502.value.dialogVisible = true
    }
    nextTick(() => {
        RemoteD.value.carFormRef?.clearValidate()
    })

}
// 历史轨迹
const gotoMap = (sn: string, npn: string) => {
    console.log(sn, npn);
    router.push({ path: 'machineryList/taskMachine', query: { sn, npn } })
}
</script>

<style lang="scss" scoped></style>