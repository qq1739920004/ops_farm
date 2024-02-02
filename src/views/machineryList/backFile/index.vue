<!--  -->
<template>
    <div>
        <el-table :data="fileListData" style="width:100%" v-loading="loading">
            <el-table-column type="index" :label="$t('work.item') + ':'" :width="60">
            </el-table-column>
            <el-table-column label="文件名称">
                <template #="{ row }">
                    <div class="fileName">
                        <a :href="baseUrl + '/log_download/' + parentSn + '/' + row">{{ row.name }}</a>
                    </div>
                </template>
            </el-table-column>

            <el-table-column :label="$t('work.operation') + ':'">
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
// import { getBackFileSnList } from '@/api/machineryList/index'
import axios from 'axios'
const route = useRoute()
const fileListData = ref<any>([])
const total = ref(0)
const current = ref(1)
const pageSize = ref(10)
const parentSn = route.query.sn
// const parentPid = route.query.pid
const baseUrl = import.meta.env.VITE_APP_BASE_DOWNLOAD
const loading = ref(false)

const getFileList = () => {
    loading.value = true;
    let postData: any = {
        current: current.value,
        size: pageSize.value,
        sn: parentSn,
        pid: 9004
    }
    // const res = await getBackFileSnList(postData)
    axios.post(`${import.meta.env.VITE_APP_BASE_NGW}/lu/log/ftpDirListFiles`, postData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
    }).then((res: any) => {
        loading.value = false;
        fileListData.value = []
        res.data.records?
        res.data.records.forEach((item: any) => {
            fileListData.value.push({ isBack: false, name: item })
        }) : ''
        // fileListData.value.push({ isBack: true, name: '回传文件' })
        total.value = res.data.total
    })


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