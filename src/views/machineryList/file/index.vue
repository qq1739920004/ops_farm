<!--  -->
<template>
    <div>
        <el-table :data="fileListData" style="width:100%" v-loading="loading">
            <el-table-column type="index" :label="$t('work.item') + ':'" :width="60">
            </el-table-column>
            <el-table-column label="文件名称">
                <template #="{ row }">
                    <div class="fileName">
                        <a :href="baseUrl + '/log_download/' + '9004' + '/' + parentSn + '/' + row.name"
                            v-if="!row.isBack">{{ row.name }}</a>
                        <span @click="toBackFile" v-else>{{ row.name }}</span>
                    </div>
                </template>
            </el-table-column>

            <el-table-column :label="$t('work.operation') + ':'">
                <template #="{ row }">
                    <el-button type="text" v-if="!row.isBack">
                        <a :href="baseUrl + '/log_download/' + '9004' + '/' + parentSn + '/' + '/' + row.name">下载</a>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from "vue-router";
// import { getChildrenFileList_API } from '@/api/machineryList/index'
import axios from 'axios'
const route = useRoute()
const router = useRouter()
const fileListData = ref<any>([])
const total = ref(0)
const current = ref(1)
const pageSize = ref(10)
const parentSn = route.query.sn
const parentPid = route.query.pid
const baseUrl = import.meta.env.VITE_APP_BASE_DOWNLOAD
const loading = ref(false)
const getFileList = async () => {
    loading.value = true;
    let postData: any = {
        current: current.value,
        size: pageSize.value,
        sn: parentSn
    }
    axios.post(`${import.meta.env.VITE_APP_BASE_NGW}/lu/log/filesForSn`, postData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' } }).then((res: any) => {
        loading.value = false;
        fileListData.value = []
        fileListData.value.push({ isBack: true, name: '回传文件' })
        res.data.records?
        res.data.records.forEach((item: any) => {
            fileListData.value.push({ isBack: false, name: item })
        }):''
        total.value = res.data.total
    })
    // const res = await getChildrenFileList_API(postData)


}
getFileList()
const toBackFile = () => {
    router.push({ path: `/machineryList/backFile`, query: { sn: parentSn, pid: parentPid } })
}  
</script>

<style lang="scss" scoped>
.fileName {
    text-decoration: underline;
    color: rgb(64, 158, 255);
    cursor: pointer;
}
</style>