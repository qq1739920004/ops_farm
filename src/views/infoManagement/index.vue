<template>
    <div class='app_container'>
        <div class="middle-area">
            <div class="input_area">
                <el-input placeholder="请输入SN号" v-model="pageInfo.key" class="input-with-select"
                    @keyup.enter.native="search">
                    <template #append>
                        <el-button :icon="Search" @click="search" />
                    </template>
                </el-input>
                <div class="kind">
                    设备类型：
                </div>
                <el-select v-model="pageInfo.terminalType" class="m-2" placeholder="请选择" @blur="changeBlur">
                    <el-option value="G360" label="G360" />
                    <el-option value="G502" label="G502" />
                    <el-option value="G501" label="G501" />
                </el-select>
            </div>
            <div class="button_area">
                <el-button type="success" class="btn1" :icon="Search" @click="openExportDia">导出</el-button>
                <el-button type="success" class="btn2" :icon="Plus" @click="openDialog">新建</el-button>
            </div>
        </div>
        <div>
            <el-table :header-cell-style="{
                background: 'rgba(247, 247, 247, 1)', height: '40px', color: 'rgba(0, 0, 0, 1)', font: '14px'
            }" @selection-change="handleSelectionChange" style="width: 100%" :data="records" v-show="scence == '1'">
                <el-table-column type="selection" width="55" />
                <el-table-column type="index" width="80" label="序号" align="center" />
                <el-table-column prop="npn" label="铭牌SN" width="180" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="质保日期" width="140" show-overflow-tooltip>
                    <template #="{ row }">
                        <div v-if="row.expirationTime">{{ row.expirationTime.split(' ')[0] }}</div>

                        <div v-else>
                            <el-tag>123</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="sn" label="一体机SN" width="" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="hubSn" label="HUB_SN" width="" show-overflow-tooltip />
                <el-table-column prop="motorSn" label="电机SN" width="" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="superCattleModuleInfo" label="多功能方向盘SN" width="" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="wheelImuSn" label="车身IMU_SN" width="" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="steeringWheelSn" label="前轮IMU_SN" width="" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="操作" show-overflow-tooltip align="center">
                    <template #="{ row }">
                        <div class="edit-btn">
                            <div class="left">
                                <el-button class="edit" size="small" @click="edit(row)" text>编辑 </el-button>
                                <el-popconfirm :title="`您确定要删除${row.sn}?`" width="250px" icon="Delete"
                                    @confirm="removeTradeMark(row.id)">
                                    <template #reference>
                                        <el-button class="delete" size="small" text>删除</el-button>
                                    </template>
                                </el-popconfirm>
                            </div>
                            <div class="right">
                                <el-button text size="small" @click="gotoAfterSale(row)" class="aftersale">售后</el-button>
                                <el-button text size="small" class="aftersale">处理</el-button>
                            </div>
                        </div>
                    </template>
                </el-table-column>

            </el-table>
            <el-table @selection-change="handleSelectionChange" style="width: 100%" :header-cell-style="{
                background: 'rgba(247, 247, 247, 1)', height: '40px', color: 'rgba(0, 0, 0, 1)', font: '14px'
            }" :data="records" v-show="scence == '2'">
                <el-table-column type="selection" width="55" />
                <el-table-column type="index" width="80" label="序号" align="center" />
                <el-table-column prop="npn" label="铭牌SN" width="180" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="质保日期" width="140" show-overflow-tooltip>
                    <template #="{ row }">
                        <div v-if="row.expirationTime">{{ row.expirationTime.split(' ')[0] }}</div>
                        <div v-else>
                            <el-tag>123</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="sn" label="平板SN" width="" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="motorSn" label="电机SN" width="" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="carImuSn" label="车身SN" width="" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="wheelImuSn" label="天线1_SN" width="" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="wheelImuSn" label="天线2_SN" width="" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="操作" show-overflow-tooltip align="center">
                    <template #="{ row }">
                        <div class="edit-btn">
                            <div class="left">
                                <el-button class="edit" size="small" @click="edit(row)" text>编辑 </el-button>
                                <el-popconfirm :title="`您确定要删除${row.sn}?`" width="250px" icon="Delete"
                                    @confirm="removeTradeMark(row.id)">
                                    <template #reference>
                                        <el-button class="delete" size="small" text>删除</el-button>
                                    </template>
                                </el-popconfirm>
                            </div>
                            <div class="right">
                                <el-button text size="small" @click="gotoAfterSale(row)" class="aftersale">售后</el-button>
                                <el-button text size="small" class="aftersale">处理</el-button>
                            </div>
                        </div>
                    </template>
                </el-table-column>

            </el-table>
            <el-table @selection-change="handleSelectionChange" style="width: 100%" :header-cell-style="{
                background: 'rgba(247, 247, 247, 1)', height: '40px'
            }" :data="records" v-show="scence == '3'">
                <el-table-column type="selection" width="55" />
                <el-table-column type="index" width="80" label="序号" align="center" />
                <el-table-column prop="npn" label="铭牌SN" width="200" show-overflow-tooltip align="center">
                </el-table-column>
                <el-table-column label="维保信息" width="280" show-overflow-tooltip align="center">
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
                                    {{ row.netDate.split(' ')[0] }}
                                </el-col>
                            </el-row>
                            <el-row :gutter="16"
                                style="margin-bottom: 4px ;font-size: 12px;font-weight: 400;letter-spacing: 0px;line-height: 17.38px;color: rgba(128, 128, 128, 1);">
                                <el-col :span="7" :offset="2">
                                    软件
                                </el-col>
                                <el-col :span="15">
                                    {{ row.warrantyDate.split(' ')[0] }}
                                </el-col>
                            </el-row>
                            <el-row :gutter="16"
                                style="margin-bottom: 4px ;font-size: 12px;font-weight: 400;letter-spacing: 0px;line-height: 17.38px;color: rgba(128, 128, 128, 1);">
                                <el-col :span="7" :offset="2">
                                    星基
                                </el-col>
                                <el-col :span="15">
                                    {{ row.satelliteDate.split(' ')[0] }}
                                </el-col>
                            </el-row>
                            <el-row :gutter="16"
                                style="margin-bottom: 4px ;font-size: 12px;font-weight: 400;letter-spacing: 0px;line-height: 17.38px;color: rgba(128, 128, 128, 1);">
                                <el-col :span="7" :offset="2">
                                    质保
                                </el-col>
                                <el-col :span="15">
                                    {{ row.expirationTime.split(' ')[0] }}
                                </el-col>
                            </el-row>
                        </el-popover>
                    </template>
                    <!-- <template #="{ row, $index }">
                        <div v-if="row.expirationTime">{{ row.expirationTime.split(' ')[0] }}</div>
                        <div v-else>
                            <el-tag>123</el-tag>
                        </div>
                    </template> -->
                </el-table-column>
                <el-table-column prop="sn" label="平板SN" width="" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="motorSn" label="电机SN" width="" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="carImuSn" label="车身SN" width="" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="steeringWheelSn" label="前轮SN" width="" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="wheelImuSn" label="天线1_SN" width="" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="操作" show-overflow-tooltip align="center">
                    <template #="{ row }">
                        <div class="edit-btn">
                            <div class="left">
                                <el-button class="edit" size="small" @click="edit(row)" text>编辑 </el-button>
                                <el-popconfirm :title="`您确定要删除${row.sn}?`" width="250px" icon="Delete"
                                    @confirm="removeTradeMark(row.id)">
                                    <template #reference>
                                        <el-button class="delete" size="small" text>删除</el-button>
                                    </template>
                                </el-popconfirm>
                            </div>
                            <div class="right">
                                <el-button text size="small" @click="gotoAfterSale(row)" class="aftersale">售后</el-button>
                                <el-button text size="small" class="aftersale">处理</el-button>
                            </div>
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
        <div class="dialog">
            <el-dialog style="border-radius: 8px;" v-model="dialogVisible" :title="newRecords.id ? '编辑' : '新建'"
                width="544px" height="580px">
                <el-form style="width: 100%" ref="formRef" :model="newRecords" :rules="rules">
                    <el-form-item label="设备类型" label-width="140px" prop="terminalType">
                        <el-select v-model="newRecords.terminalType" class="m-2" placeholder="请选择" width="120px"
                            style="width:100%" prop="terminalType">
                            <el-option value="G360" label="G360" />
                            <el-option value="G502" label="G502" />
                            <el-option value="G501" label="G501" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="铭牌SN" label-width="140px" prop="npn">
                        <el-input v-model="newRecords.npn"></el-input>
                    </el-form-item>
                    <el-form-item label="质保日期" label-width="140px" prop="expirationTime">
                        <el-input v-model="newRecords.expirationTime"></el-input>
                    </el-form-item>
                    <el-form-item label="一体机SN" label-width="140px" prop="sn">
                        <el-input v-model="newRecords.sn"></el-input>
                    </el-form-item>
                    <el-form-item label="HUB_SN" label-width="140px" prop="hubSn">
                        <el-input v-model="newRecords.hubSn"></el-input>
                    </el-form-item>
                    <el-form-item label="电机SN" label-width="140px" prop="motorSn">
                        <el-input v-model="newRecords.motorSn"></el-input>
                    </el-form-item>
                    <el-form-item label="多功能方向盘SN" label-width="140px" prop="superCattleModuleInfo">
                        <el-input v-model="newRecords.superCattleModuleInfo"></el-input>
                    </el-form-item>
                    <el-form-item label="车身IMU_SN" label-width="140px" prop="wheelImuSn">
                        <el-input v-model="newRecords.wheelImuSn"></el-input>
                    </el-form-item>
                    <el-form-item label="前轮IMU_SN" label-width="140px" prop="steeringWheelSn">
                        <el-input v-model="newRecords.steeringWheelSn"></el-input>
                    </el-form-item>
                </el-form>

                <template #footer>
                    <span class="dialog-footer">
                        <el-button type="danger" @click="cancel">取消</el-button>
                        <el-button type="primary" v-if="!newRecords.id" @click="submit">
                            确定
                        </el-button>
                        <el-button type="primary" v-else @click="editSubmit">
                            确定
                        </el-button>
                    </span>
                </template>
            </el-dialog>
        </div>
        <G502Dia ref="G502D" :newRecords=newRecords></G502Dia>
        <G501Dia ref="G501D" :newRecords=newRecords></G501Dia>
        <exporDia ref="exporD"></exporDia>
    </div>
</template>

<script setup lang='ts'>
import G502Dia from './components/G502Dia.vue'
import G501Dia from './components/G501Dia.vue'
import exporDia from './components/exporDia.vue'
import Pagination from '@/components/Pagination/index.vue'
import { reactive, ref, nextTick, watch } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { carModuleInfo_API, carModuleInfoSave_API, carModuleInfoUpdate_API, carModuleInfoOperationDelete_API } from '@/api/infoManagement/index'
import { ElMessage } from 'element-plus'
import { RecordsObj, carModuleInfoResponseData, PageObj, newRecordsObj, changeResponseData, editResponseData, carMoudleInfoDeleteResponseData } from "@/api/infoManagement/type"
import { useRouter } from 'vue-router'
const pageInfo = reactive<PageObj>({
    key: '',
    terminalType: '',
    currentPage: 1,
    pageSize: 3
})
const $router = useRouter()
const scence = ref<string>('1')
const total = ref<number>(10)
const records = ref<RecordsObj[]>([])
const dialogVisible = ref<boolean>(false)
const G502D = ref()
const G501D = ref()
const exporD = ref()
const multipleSelection = ref<RecordsObj[]>([])
const newRecords = reactive<newRecordsObj>({
    carImuSn: "",
    hubSn: "",
    antennaTwo: "",
    wheelImuSn: "",
    id: null,
    superCattleModuleInfo: "",
    sn: "",
    npn: "",
    steeringWheelSn: "",
    warrantyDate: "",
    antennaOne: "",
    type: "",
    terminalType: "",
    motorSn: "",
    expirationTime: "",
})

let formRef = ref()
const getInfoMangementInfo = async () => {
    const res: carModuleInfoResponseData = await carModuleInfo_API(pageInfo)
    records.value = res.data.records
    total.value = res.data.total
}
const handleSelectionChange = (val: any) => {
    multipleSelection.value = val
    console.log(multipleSelection.value);

}
const rules = {
    terminalType: [{ required: true, message: '请输入活动名称', trigger: 'blur' }, { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
    npn: [{ required: true, message: '请输入铭牌名称', trigger: 'blur' }, { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
    expirationTime: [{ required: true, message: '请输入质保日期', trigger: 'blur' }],
    sn: [{ required: true, message: '请输入一体机SN', trigger: 'blur' }],
    hubSn: [{ required: true, message: '请输入HUB_SN', trigger: 'blur' }],
    motorSn: [{ required: true, message: '请输入电机SN', trigger: 'blur' }],
    superCattleModuleInfo: [{ required: true, message: '请输入多功能方向盘SN', trigger: 'blur' }],
    wheelImuSn: [{ required: true, message: '请输入车身IMU_SN', trigger: 'blur' }],
    steeringWheelSn: [{ required: true, message: '请输入前轮IMU_SN', trigger: 'blur' }],
}
getInfoMangementInfo()
const currentChange = (val: any) => {
    pageInfo.currentPage = val.currentPage
    pageInfo.pageSize = val.pageSize
    getInfoMangementInfo()
}
const search = () => {
    getInfoMangementInfo()
}
const changeBlur = () => {
    if (pageInfo.terminalType == 'G360') {
        scence.value = '1'
    } if (pageInfo.terminalType == 'G502') {
        scence.value = '2'
    } if (pageInfo.terminalType == 'G501') {
        scence.value = '3'
    }
    getInfoMangementInfo()

}
const addInfo = async () => {
    const res: changeResponseData = await carModuleInfoSave_API(newRecords)
    if (res.code == 200) {
        ElMessage({ type: 'success', message: '添加成功' })
    }
    else {
        ElMessage({ type: 'error', message: '添加失败' })
    }
}
const editInfo = async () => {
    const res: editResponseData = await carModuleInfoUpdate_API(newRecords)
    if (res.code == 200) {
        ElMessage({ type: 'success', message: '编辑成功' })
    }
    else {
        ElMessage({ type: 'error', message: '编辑失败' })
    }
}
const edit = (row: any) => {
    if (scence.value == '1') {
        dialogVisible.value = true
    }
    if (scence.value == '2') {
        G502D.value.dialogVisible = true
    }
    if (scence.value == '3') {
        G501D.value.dialogVisible = true
    }
    newRecords.carImuSn = row.carImuSn
    newRecords.hubSn = row.hubSn
    newRecords.antennaTwo = row.antennaTwo
    newRecords.wheelImuSn = row.wheelImuSn
    newRecords.id = row.id
    newRecords.superCattleModuleInfo = row.superCattleModuleInfo
    newRecords.sn = row.sn
    newRecords.npn = row.npn
    newRecords.steeringWheelSn = row.steeringWheelSn
    newRecords.warrantyDate = row.warrantyDate
    newRecords.antennaOne = row.antennaOne
    newRecords.type = row.type
    newRecords.terminalType = row.terminalType
    newRecords.expirationTime = row.expirationTime
    newRecords.motorSn = row.motorSn
    nextTick(() => {
        formRef.value.clearValidate()
        G501D.value.formRef?.clearValidate()
        G502D.value.formRef?.clearValidate()
    })
}
watch(
    () => newRecords.terminalType,
    () => {
        if (newRecords.terminalType == 'G502') {
            dialogVisible.value = false
            G502D.value.dialogVisible = true
            G501D.value.dialogVisible = false
        } if (newRecords.terminalType == 'G360') {
            dialogVisible.value = true
            G502D.value.dialogVisible = false
            G501D.value.dialogVisible = false
        } if (newRecords.terminalType == 'G501') {
            dialogVisible.value = false
            G501D.value.dialogVisible = true
            G502D.value.dialogVisible = false
        }
    })
const editSubmit = async () => {
    await formRef.value.validate()
    editInfo()
    dialogVisible.value = false
}
const openDialog = () => {
    dialogVisible.value = true
    nextTick(() => {
        G501D.value.formRef?.clearValidate()
        formRef.value.clearValidate()
        G502D.value.formRef?.clearValidate()
        newRecords.carImuSn = ''
        newRecords.hubSn = ''
        newRecords.antennaTwo = ''
        newRecords.wheelImuSn = ''
        newRecords.id = null
        newRecords.superCattleModuleInfo = ''
        newRecords.sn = ''
        newRecords.npn = ''
        newRecords.steeringWheelSn = ''
        newRecords.warrantyDate = ''
        newRecords.antennaOne = ''
        newRecords.type = ''
        newRecords.motorSn = ''
        newRecords.expirationTime = ''
        newRecords.terminalType = ''
    })

}
const removeTradeMark = async (id: any) => {
    const res: carMoudleInfoDeleteResponseData = await carModuleInfoOperationDelete_API(id)
    if (res.code == 200) {
        ElMessage({ type: 'success', message: '删除成功' })
    }
    else {
        ElMessage({ type: 'error', message: '删除失败' })
    }
}
const submit = async () => {
    await formRef.value.validate()
    dialogVisible.value = false
    addInfo()
}
const cancel = () => {
    dialogVisible.value = false
    formRef.value.resetFields()
}
const gotoAfterSale = (row: any) => {
    console.log(row);
    $router.push({
        name: 'aftersale', query: { row: JSON.stringify(row), scence: JSON.stringify(scence.value) }
    })
}
const openExportDia = () => {
    exporD.value.dialogVisible = true
}
</script>

<style lang="scss" scoped>
.top-bar {
    top: 60px;
    width: 100%;
    height: 40px;
    opacity: 1;
    background: rgba(245, 245, 245, 1);

    // .title {
    //     padding-top: 7px;
    //     margin-left: 40px;
    //     width: 72px;
    //     height: 27px;
    //     opacity: 1;
    //     font-size: 18px;
    //     font-weight: 400;
    //     letter-spacing: 0px;
    //     line-height: 26.06px;
    //     color: rgba(0, 0, 0, 1);
    // }
}

.middle-area {
    height: 86px;

    .input_area {
        .input-with-select {
            margin-left: 10px;
            position: absolute;
            left: 210px;
            top: 113px;
            width: 280px;
            height: 32px;
            opacity: 1;
            border-radius: 2px;
        }

        .kind {
            position: absolute;
            left: 543px;
            top: 119px;
            width: 70px;
            height: 21px;
            opacity: 1;
            /** 文本1 */
            font-size: 14px;
            font-weight: 400;
            letter-spacing: 0px;
            line-height: 20.27px;
            color: rgba(0, 0, 0, 1);
            text-align: left;
            vertical-align: top;

        }

        .m-2 {
            position: absolute;
            left: 629px;
            top: 113px;
            width: 179px;
            height: 32px;
            opacity: 1;
            border-radius: 4px;
            background: rgba(255, 255, 255, 1);

            border: 1px solid rgba(220, 223, 230, 1);
        }

    }

    .button_area {
        margin: 16px 10px;

        .btn1 {
            position: absolute;
            left: 1603px;
            top: 114px;
            width: 107px;
            height: 32px;
            opacity: 1;
            border-radius: 4px;
            background: rgba(76, 176, 79, 1);
        }

        .btn2 {
            position: absolute;
            left: 1736px;
            top: 114px;
            width: 74px;
            height: 32px;
            opacity: 1;
            border-radius: 4px;
            background: rgba(76, 176, 79, 1);
        }
    }

}

.edit-btn {
    display: flex;
    align-items: center;

    .left {
        .edit {
            margin-left: 10px;
            margin-right: -15px;
            font-size: 14px;
            font-weight: 400;
            letter-spacing: 0px;
            line-height: 20.27px;
            color: rgba(76, 176, 79, 1);
            text-align: left;
            vertical-align: top;
        }

        .delete {
            margin-right: -15px;
            font-size: 14px;
            font-weight: 400;
            letter-spacing: 0px;
            line-height: 20.27px;
            color: rgba(255, 87, 51, 1);
            text-align: left;
            vertical-align: top;
        }
    }

    .right {
        display: flex;
        flex-direction: column;
        align-items: end;

        .aftersale {
            color: rgba(76, 176, 79, 1);
        }
    }
}

.dialog-footer {
    display: flex;
    justify-content: space-around;
}

.dialog {

    .dia-input-words {
        font-size: 16px;
        font-weight: 400;
        letter-spacing: 0px;
        line-height: 23.17px;
        color: rgba(0, 0, 0, 1);
        text-align: left;
        vertical-align: top;
    }

    .dia-input {
        width: 280px;
        height: 32px;
        opacity: 1;
        border-radius: 2px;

        border: 1px solid rgba(220, 223, 230, 1);
    }

}
</style>