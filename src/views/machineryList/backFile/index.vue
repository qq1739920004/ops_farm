<!--  -->
<template>
    <div>
        <el-table :data="fileListData" style="width:100%" v-loading="loading">
            <el-table-column type="index" label="序号" :width="60">
            </el-table-column>
            <el-table-column label="文件名称">
                <template #="{ row }">
                    <div class="fileName">
                        <a :href="baseUrl + '/log_download/' + parentSn + '/' + row" >{{ row }}</a>
                    </div>
                </template>
            </el-table-column>

            <el-table-column label="操作">
                <template #="{ row }">
                    <el-button type="text" v-if="!row.isBack">
                        <a :href="baseUrl + '/log_download/' + parentSn + '/' + row">下载</a>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from "vue-router";
import { getChildrenFileList_API } from '@/api/machineryList/index'

const route = useRoute()
const fileListData = ref<any>([])
const total = ref(0)
const current = ref(1)
const pageSize = ref(10)
const parentSn = route.query.sn
const baseUrl = import.meta.env.VITE_APP_BASE_API
const loading = ref(false)

const getFileList = async () => {
    loading.value = true;
    let postData = {
        current: current.value,
        size: pageSize.value,
        sn: parentSn
    }
    const res = await getChildrenFileList_API(postData)
    loading.value = false;
    fileListData.value = []
    res.data.records.forEach((item: any) => {
        fileListData.value.push({ isBack: false, name: item })
    })
    // fileListData.value.push({ isBack: true, name: '回传文件' })
    total.value = res.data.total

}
getFileList()

</script>

<style lang="scss" scoped>
.fileName {
    text-decoration: underline;
    color: rgb(64, 158, 255);
    cursor: pointer;
}
</style>