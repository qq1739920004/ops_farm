<template>
    <div class="app-container">
        <div class="middle-area">
            <div class="input_area">
                <el-input placeholder="请输入SN号" class="input-with-select">
                    <template #append>
                        <el-button :icon="Search" @click="search" />
                    </template>
                </el-input>
                <el-select class="m-2" placeholder="请选择" >
                    <el-option value="G360" label="G360" />
                    <el-option value="G502" label="G502" />
                    <el-option value="G501" label="G501" />
                </el-select>
            </div>
            <div class="button_area">
                <el-button type="success" class="btn1">录入经销商设备</el-button>
                <el-button type="success" class="btn2">查看车型模版</el-button>
            </div>
        </div>
        <div class='app_container'>
            <el-table style="width: 100%">
                <el-table-column type="index" width="80" label="序号" align="center" />

                <el-table-column label="铭牌SN" width="140" show-overflow-tooltip>
                </el-table-column>

                <el-table-column label="SN" width="140" show-overflow-tooltip>

                </el-table-column>

                <el-table-column label="车主姓名" width="" show-overflow-tooltip>

                </el-table-column>

                <el-table-column label="车辆型号" width="" show-overflow-tooltip />

                <el-table-column label="设备所在地" width="" show-overflow-tooltip>

                </el-table-column>

                <el-table-column label="类型" width="" show-overflow-tooltip>

                </el-table-column>

                <el-table-column label="过期时间" width="110" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="最近上线时间" width="" show-overflow-tooltip>

                </el-table-column>

                <el-table-column label="公司/经销商" width="110" show-overflow-tooltip>
                </el-table-column>

                <el-table-column label="星基" width="" show-overflow-tooltip>

                </el-table-column>


                <el-table-column label="数据存储">
                </el-table-column>

                <!-- 说明  离线和自动驾驶状态不可编辑 -->
                <el-table-column label="操作" width="370">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { Search } from '@element-plus/icons-vue'
const search = () => {
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