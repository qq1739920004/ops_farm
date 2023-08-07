<template>
    <div class='app_container'>



        <el-row class="help_search" :gutter="40">
            <el-col :span="4" class="help_search_phone">
                <div>
                    <el-input placeholder="请输入SN、电话" class="input-with-select">
                        <template #append>
                            <el-button :icon="Search" />
                        </template>
                    </el-input>

                </div>
            </el-col>

            <el-col :span="5" class="help_search_state">
                <span>状态：</span>
                <el-select v-model="value" placeholder="全部">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-col>
            <el-col :span="2" :offset="13">
                <el-button :icon="Search">待处理</el-button>
            </el-col>
        </el-row>

        <el-row class="help_table">
            <el-table type="index" :header-cell-style="{
                background: 'rgba(240, 240, 240, 1)', color: '#000000'
            }">
                <el-table-column label="序号" width="70" />
                <el-table-column label="SN" width="130" />
                <el-table-column label="状态" width="130" />
                <el-table-column label="求助时间" width="150" />
                <el-table-column label="处理时间" width="150" />
                <el-table-column label="历时" width="130" />
                <el-table-column label="处理人" width="130" />
                <el-table-column label="管理员" width="130" />
                <el-table-column label="指派时间" width="130" />
                <el-table-column label="备注" width="" />
                <el-table-column label="操作" width="130" />
            </el-table>
        </el-row>

        <el-row type="flex" justify="center">
            <Pagination />
        </el-row>

    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import Pagination from '@/components/Pagination/index.vue'
const value = ref()


</script>

<style lang="scss" scoped>
.app_container {

    .help_title {
        height: 40px;
        padding: 7px 40px;
        font-size: 18px;
        font-weight: 550;
        background-color: rgba(245, 245, 245, 1);
        box-sizing: border-box;
    }

    .help_search {
        height: 60px;
        padding-left: 17px;
        padding-top: 8px;
        font-size: 14px;
    }

    .help_table {
        border: 1px solid;
        margin: 4px;
    }
}
</style>