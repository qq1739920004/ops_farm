<template>
    <div class='app_container'>
        <el-row class="help_search" :gutter="40">
            <el-col :span="4" class="help_search_phone">
                <div>
                    <el-input placeholder="请输入SN、电话" class="input-with-select" v-model="key">
                        <template #append>
                            <el-button :icon="Search" @click="search()" />
                        </template>
                    </el-input>
                </div>
            </el-col>

            <el-col :span="5" class="help_search_state">
                <span>状态：</span>
                <el-select v-model="state" placeholder="全部">
                    <el-option label="待处理" value="0" />
                    <el-option label="已处理" value="1" />
                </el-select>
            </el-col>
            <el-col :span="2" :offset="13">
                <el-button :icon=Search>待处理</el-button>
            </el-col>
        </el-row>

        <el-row class="help_table">
            <el-table type="index" :header-cell-style="{
                background: 'rgba(240, 240, 240, 1)', color: '#000000'
            }" :data="helpList">
                <el-table-column label="序号" width="70" type="index" />
                <el-table-column label="SN" width="130" prop="sn" />
                <el-table-column label="状态" width="130" prop="status" :filters="[
                    { text: '待处理', value: '0' },
                    { text: '已处理', value: '1' },
                ]" :filter-method="filterTag">

                    <template #default="scope">
                        <el-tag :type="scope.row.status === 'Home' ? '' : 'success'" disable-transitions>{{ scope.row.status
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="求助时间" width="150" prop="helpTime" />
                <el-table-column label="处理时间" width="150" prop="handleTime" />
                <el-table-column label="历时" width="130" prop="consumeTime" />
                <el-table-column label="处理人" width="130" prop="handlerName" />
                <el-table-column label="管理员" width="130" prop="managerName" />
                <el-table-column label="指派时间" width="130" prop="assignTime" />
                <el-table-column label="备注" width="" prop="info" />
                <el-table-column label="操作" width="130" prop="status" />
            </el-table>
        </el-row>

        <el-row type="flex" justify="center">
            <Pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @pageChange="currentChange">
            </Pagination>
        </el-row>

    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import Pagination from '@/components/Pagination/index.vue'
import { getHelpHandlingfoAPI } from '@/api/helpHanding/index'
const state = ref<string>('')
const key = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = ref<number>(3)
const helpTimeOrder = ref<number>(0)
const handleTimeOrder = ref(1)
const helpList = ref([])
const total = ref<number>(10)
const assignTimeOrder = ref(1)

// 分页查询
const getHelpHandling = async () => {
    const res: any = await getHelpHandlingfoAPI({
        'key': key.value,
        "status": state.value, 'currentPage': currentPage.value, 'pageSize': pageSize.value,
        "helpTimeOrder": helpTimeOrder.value,
        "handleTimeOrder": handleTimeOrder.value,
        "assignTimeOrder": assignTimeOrder.value
    })
    console.log('res.data:', res.data)
    helpList.value = res.data.records
    total.value = res.data.total
}

getHelpHandling()
const currentChange = (val: any) => {
    currentPage.value = val.currentPage
    pageSize.value = val.pageSize
    getHelpHandling()
}

const search = () => {
    getHelpHandling()
}

const filterTag = (value: string, row: any) => {
    return row.status === value
}
</script>

<style lang="scss" scoped>
.app_container {
    .help_search {
        height: 60px;
        padding-left: 17px;
        padding-top: 8px;
        font-size: 14px;
    }

}
</style>