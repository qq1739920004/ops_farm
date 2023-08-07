<template>
    <div>
        <div class="top-bar">
            <div class="title">
                信息管理
            </div>
        </div>
        <div class="middle-area">
            <div class="input_area">
                <el-input placeholder="请输入SN号" v-model="key" class="input-with-select" @keyup.enter.native="search">
                    <template #append>
                        <el-button :icon="Search" @click="search" />
                    </template>
                </el-input>
                <div class="kind">
                    设备类型：
                </div>
                <el-select v-model="terminalType" class="m-2" placeholder="请选择" @blur="changeBlur">
                    <el-option value="G360" label="G360" />
                    <el-option value="G501" label="G502" />
                    <el-option value="G502" label="G501" />
                </el-select>
            </div>
            <div class="button_area">
                <el-button type="success" class="btn1" :icon="Search">导出</el-button>
                <el-button type="success" class="btn2" :icon="Plus" @click="openDialog">新建</el-button>
            </div>
        </div>
        <div class='app_container'>
            <el-table style="width: 100%" stripe :data="records">
                <el-table-column type="index" width="80" label="序号" align="center" />
                <el-table-column prop="npn" label="铭牌SN" width="180" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="质保日期" width="140" show-overflow-tooltip>
                    <template #="{ row, $index }">
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
                <el-table-column label="操作" width="300" show-overflow-tooltip>
                    <template #="{ row, $index }">
                        <div class="edit-btn">
                            <div class="left">
                                <span class="edit" @click="edit(row)">编辑 </span>
                                <span class="delete">删除</span>
                            </div>
                            <div class="right">
                                <div>售后</div>
                                <div>处理</div>
                            </div>
                        </div>
                    </template>
                </el-table-column>

            </el-table>
        </div>
        <div class="bottom">
            <Pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @pageChange="currentChange">
            </Pagination>
        </div>
        <div class="dialog">
            <el-dialog v-model="dialogVisible" :title="newRecords.id ? '编辑' : '新建'" width="544px" height="580px">
                <el-form style="width: 100%" ref="formRef" :model="newRecords" :rules="rules">
                    <el-form-item label="设备类型" label-width="140px" prop="terminalType">
                        <el-select v-model="newRecords.terminalType" class="m-2" placeholder="请选择" @blur="changeBlur"
                            width="120px" style="width:100%" prop="terminalType">
                            <el-option value="G360" label="G360" />
                            <el-option value="G501" label="G502" />
                            <el-option value="G502" label="G501" />
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
                            确定1
                        </el-button>
                        <el-button type="primary" v-else @click="editSubmit">
                            确定2
                        </el-button>
                    </span>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<script setup lang='ts'>
import Pagination from '@/components/Pagination/index.vue'
import { reactive, ref, nextTick } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { getInfoMangementInfoAPI, addInfoMangementInfoAPI, editInfoMangementInfoAPI } from '@/api/infoManagement/index'


const key = ref<string>('')
const terminalType = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = ref<number>(3)
const total = ref<number>(10)
const records = ref([])
const dialogVisible = ref<boolean>(false)
const newRecords = reactive<any>({
    "carImuSn": "",
    "hubSn": "",
    "antennaTwo": "",
    "wheelImuSn": "",
    "id": "",
    "superCattleModuleInfo": "",
    "sn": "",
    "npn": "",
    "steeringWheelSn": "",
    "warrantyDate": "",
    "antennaOne": "",
    "type": "",
    "terminalType": "",
    "motorSn": ""
})
let formRef = ref()
const getInfoMangementInfo = async () => {
    const res: any = await getInfoMangementInfoAPI({ 'key': key.value, 'terminalType': terminalType.value, 'currentPage': currentPage.value, 'pageSize': pageSize.value })
    records.value = res.data.records
    total.value = res.data.total
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
    currentPage.value = val.currentPage
    pageSize.value = val.pageSize
    getInfoMangementInfo()
}
const search = () => {
    getInfoMangementInfo()
}
const changeBlur = () => {
    getInfoMangementInfo()

}
const addInfo = async () => {
    const res: any = await addInfoMangementInfoAPI(newRecords)
    console.log(res);
}
const editInfo = async () => {
    const res: any = await editInfoMangementInfoAPI(newRecords)
    console.log(res);
}
// 编辑
// "carImuSn": "",
// "hubSn": "",
//     "antennaTwo": "",
//     "wheelImuSn": "",
//     "id": "",
//     "superCattleModuleInfo": "",
//     "sn": "",
//     "npn": "",
//     "steeringWheelSn": "",
//     "warrantyDate": "",
//     "antennaOne": "",
//     "type": "",
//     "terminalType": "",
//     "motorSn": ""
const edit = (row: any) => {
    dialogVisible.value = true
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
    newRecords.motorSn = row.motorSn
    nextTick(() => {
        formRef.value.clearValidate()
    })
}
const editSubmit = () => {
    editInfo()
}
const openDialog = () => {
    dialogVisible.value = true
    nextTick(() => {
        formRef.value.clearValidate()
        newRecords.carImuSn = ''
        newRecords.hubSn = ''
        newRecords.antennaTwo = ''
        newRecords.wheelImuSn = ''
        newRecords.id = ''
        newRecords.superCattleModuleInfo = ''
        newRecords.sn = ''
        newRecords.npn = ''
        newRecords.steeringWheelSn = ''
        newRecords.warrantyDate = ''
        newRecords.antennaOne = ''
        newRecords.type = ''
        newRecords.terminalType = ''
        newRecords.motorSn = ''
    })
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
</script>

<style lang="scss" scoped>
.top-bar {
    top: 60px;
    width: 100%;
    height: 40px;
    opacity: 1;
    background: rgba(245, 245, 245, 1);

    .title {
        padding-top: 7px;
        margin-left: 40px;
        width: 72px;
        height: 27px;
        opacity: 1;
        font-size: 18px;
        font-weight: 400;
        letter-spacing: 0px;
        line-height: 26.06px;
        color: rgba(0, 0, 0, 1);
    }
}

.middle-area {
    height: 50px;

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
            left: 1703px;
            top: 114px;
            width: 107px;
            height: 32px;
            opacity: 1;
            border-radius: 4px;
            background: rgba(76, 176, 79, 1);
        }

        .btn2 {
            position: absolute;
            left: 1826px;
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
        margin-right: 10px;

        div {
            margin-right: 3px
        }

        .edit {
            font-size: 14px;
            font-weight: 400;
            letter-spacing: 0px;
            line-height: 20.27px;
            color: rgba(76, 176, 79, 1);
            text-align: left;
            vertical-align: top;
        }

        .delete {
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
        font-size: 14px;
        font-weight: 400;
        letter-spacing: 0px;
        line-height: 20.27px;
        color: rgba(76, 176, 79, 1);
        text-align: left;
        vertical-align: top;
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