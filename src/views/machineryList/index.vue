<template>
    <div class="app-container">
        <div class="middle-area">
            <div class="input_area">
                <el-input placeholder="请输入SN号" class="input-with-select">
                    <template #append>
                        <el-button icon="Search" @click="search" />
                    </template>
                </el-input>
                <el-select class="m_2" placeholder="请选择">
                    <el-option value="G360" label="G360" />
                    <el-option value="G502" label="G502" />
                    <el-option value="G501" label="G501" />
                </el-select>
            </div>
            <div class="button_area">
                <el-button type="success" class="btn1" @click="gotoInput">录入经销商设备</el-button>
                <el-button type="success" class="btn2" @click="gotoCarModule">查看车型模版</el-button>
            </div>
        </div>
        <div class='table_container'>
            <el-table style="width: 100%" :data="tableData">
                <el-table-column type="index" label="序号" width="80" align="center" />

                <el-table-column label="铭牌SN" show-overflow-tooltip>
                    <template #default="scope">
                        <div style="display: flex; align-items: center">
                            <el-icon>
                                <MapLocation style="color:rgba(82, 196, 26, 1); width: 16px; height: 16px;" />
                            </el-icon>
                            <span style="margin-left: 10px">{{ scope.row.one }}</span>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="SN" show-overflow-tooltip prop="one">

                </el-table-column>

                <el-table-column label="车主姓名" show-overflow-tooltip prop="one">

                </el-table-column>

                <el-table-column label="车辆型号" show-overflow-tooltip prop="one" />

                <el-table-column label="设备所在地" show-overflow-tooltip>
                    <template #="{ row }">
                        <div style="color: rgba(130, 130, 130, 1)">
                            {{ row.place }}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="类型" show-overflow-tooltip prop="one">

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
                                    {{ row.createtime.split(' ')[0] }}
                                </el-col>
                            </el-row>
                            <el-row :gutter="16"
                                style="margin-bottom: 4px ;font-size: 12px;font-weight: 400;letter-spacing: 0px;line-height: 17.38px;color: rgba(128, 128, 128, 1);">
                                <el-col :span="7" :offset="2">
                                    软件
                                </el-col>
                                <el-col :span="15">
                                    {{ row.createtime.split(' ')[0] }}
                                </el-col>
                            </el-row>
                            <el-row :gutter="16"
                                style="margin-bottom: 4px ;font-size: 12px;font-weight: 400;letter-spacing: 0px;line-height: 17.38px;color: rgba(128, 128, 128, 1);">
                                <el-col :span="7" :offset="2">
                                    星基
                                </el-col>
                                <el-col :span="15">
                                    {{ row.createtime.split(' ')[0] }}
                                </el-col>
                            </el-row>
                            <el-row :gutter="16"
                                style="margin-bottom: 4px ;font-size: 12px;font-weight: 400;letter-spacing: 0px;line-height: 17.38px;color: rgba(128, 128, 128, 1);">
                                <el-col :span="7" :offset="2">
                                    质保
                                </el-col>
                                <el-col :span="15">
                                    {{ row.createtime.split(' ')[0] }}
                                </el-col>
                            </el-row>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="最近上线时间" show-overflow-tooltip prop="one">

                </el-table-column>

                <el-table-column label="公司/经销商" show-overflow-tooltip prop="one">
                </el-table-column>

                <el-table-column label="星基" show-overflow-tooltip align="center">
                    <template #="{ row }">
                        <el-switch v-model="row.flag" class="ml-2" inline-prompt active-text="开" inactive-text="关"
                            style="width: 48px;height: 20px; --el-switch-on-color: #13ce66; --el-switch-off-color: rgba(204, 204, 204, 1)" /></template>
                </el-table-column>
                <el-table-column label="数据存储" align="center">
                    <template #="{ row }">
                        <el-switch v-model="row.flag" class="ml-2" inline-prompt active-text="开" inactive-text="关"
                            style="width: 48px;height: 20px; --el-switch-on-color: #13ce66; --el-switch-off-color: rgba(204, 204, 204, 1)" /></template>
                </el-table-column>

                <!-- 说明  离线和自动驾驶状态不可编辑 -->
                <el-table-column label="操作" width="350" show-overflow-tooltip>
                    <template #="{ row }">
                        <div class="tableBtn">
                            <el-button class="elbutton" size="small" text>详情 </el-button>
                            <el-popconfirm :title="`您确定要删除${row.one}?`" width="250px" icon="Delete">
                                <template #reference>
                                    <el-button class="elbutton" size="small" text>历史轨迹</el-button>
                                </template>
                            </el-popconfirm>
                            <el-button text class="elbutton" size="small">远程调参</el-button>
                            <el-button text class="elbutton" size="small">文件存储</el-button>
                            <el-button text class="elbutton" size="small">注册</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <InputDia ref="inputD"></InputDia>
        <CarModuleDia ref="carModuleD"></CarModuleDia>
    </div>
</template>

<script setup lang='ts'>
import InputDia from './components/inputDia.vue'
import CarModuleDia from './components/carModuleDia.vue'
import { reactive, ref } from 'vue'
const tableData = reactive([{
    one: '123',
    two: '321',
    three: '11',
    four: '11',
    five: '11',
    six: '11',
    seven: '13333',
    flag: false,
    createtime: "2021-11-08 00:58:11",
    place: '新疆'

}])
const inputD = ref()
const carModuleD = ref()
const search = () => {
}
const gotoInput = () => {
    inputD.value.dialogVisible = true
}
const gotoCarModule = () => {
    carModuleD.value.dialogVisible = true
}

</script>

<style lang="scss" scoped>
.middle-area {
    height: 86px;

    .input_area {
        margin: 16px 10px;

        .input-with-select {
            position: absolute;
            left: 225px;
            top: 116px;
            width: 290px;
            height: 32px;
            opacity: 1;
            border-radius: 4px;
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(220, 223, 230, 1);
            margin-right: 40px;
        }

        .m_2 {
            position: absolute;
            left: 540px;
            top: 116px;
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
            left: 1573px;
            top: 116px;
            width: 131px;
            height: 32px;
            opacity: 1;
            border-radius: 4px;
            background: rgba(76, 176, 79, 1);
        }

        .btn2 {
            position: absolute;
            left: 1714px;
            top: 116px;
            width: 116px;
            height: 32px;
            opacity: 1;
            border-radius: 4px;
            background: rgba(76, 176, 79, 1);
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