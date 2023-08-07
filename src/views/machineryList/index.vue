<template>
    <div class="top-bar">
        <div class="title">
            农机列表
        </div>
    </div>
    <div class="middle-area">
        <div class="input_area">
            <el-input placeholder="输入机器码" v-model="input" class="input-with-select">
                <template #append>
                    <el-button :icon="Search" />
                </template>
            </el-input>
            <el-select v-model="selectValue" class="m-2" placeholder="请选择" size="middle">
                <el-option value="公司/经销商" />
                <el-option value="全部" />
            </el-select>
        </div>
        <div class="button_area">
            <el-button type="success" class="btn1">录入经销商设备</el-button>
            <el-button type="success" class="btn2">查看车型模版</el-button>
        </div>
    </div>
    <div class='app_container'>
        <el-table style="width: 100%" stripe>
            <el-table-column type="index" width="80" label="序号" align="center" />

            <el-table-column prop="deviceSn" label="铭牌SN" width="140" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="sunFlowerSn" label="SN" width="140" show-overflow-tooltip>

            </el-table-column>

            <el-table-column prop="userName" label="车主姓名" width="" show-overflow-tooltip>

            </el-table-column>

            <el-table-column prop="model" label="车辆型号" width="" show-overflow-tooltip />

            <el-table-column prop="province" label="设备所在地" width="" show-overflow-tooltip>

            </el-table-column>

            <el-table-column prop="type" label="类型" width="" show-overflow-tooltip>

            </el-table-column>

            <el-table-column prop="workArea" label="过期时间" width="110" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="lastOnlineTime" label="最近上线时间" width="" show-overflow-tooltip>

            </el-table-column>

            <el-table-column prop="expirationTime" label="公司/经销商" width="110" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="softwareVersion" label="星基" width="" show-overflow-tooltip>

            </el-table-column>


            <el-table-column prop="a" label="数据存储">
            </el-table-column>

            <!-- 说明  离线和自动驾驶状态不可编辑 -->
            <el-table-column label="操作" width="370">
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
const input = ref<string>('')
const selectValue = ref<string>('')
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
    display: flex;
    justify-content: space-between;

    .input_area {
        margin: 16px 10px;

        .input-with-select {
            width: 290px;
            height: 32px;
            opacity: 1;
            border-radius: 4px;
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(220, 223, 230, 1);
            margin-right: 40px;
        }

        .m_2 {
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
            width: 131px;
            height: 32px;
            opacity: 1;
            border-radius: 4px;
            background: rgba(76, 176, 79, 1);
        }

        .btn2 {
            width: 116px;
            height: 32px;
            opacity: 1;
            border-radius: 4px;
            background: rgba(76, 176, 79, 1);
        }
    }
}
</style>