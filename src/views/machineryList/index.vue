<template>
    <div class="app_container">
        <div class="search_container app_card">
            <div class="input_area">
                <el-input placeholder="请输入SN号" v-model="pageInfo.key" class="input-with-select"
                    @keyup.enter.native="search">
                    <template #append>
                        <el-button icon="Search" @click="search" />
                    </template>
                </el-input>
                <el-select class="m_2" placeholder="请选择" v-model="pageInfo.companyId" @change="changeBlur">
                    <el-option v-for="item in dealerList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                </el-select>
            </div>
            <div class="button_area">
                <el-button type="primary" @click="gotoInput">录入经销商设备</el-button>
                <el-button-group class="button_group2">
                    <el-button icon="Expand" :class="{ 'tab_active': tableShow }" @click="switchTabShow(true)" />
                    <el-button icon="menu" :class="{ 'tab_active': !tableShow }" @click="switchTabShow(false)" />
                </el-button-group>
            </div>
        </div>
        <div class="table_container app_card" v-show="tableShow">
            <sn-table :carNewList="carNewList" @changeSort="changeSort">
                <div>
                    <Pagination :total="total" :currentPage="pageInfo.currentPage" :pageSize="pageInfo.pageSize"
                        @pageChange="currentChange">
                    </Pagination>
                </div>
            </sn-table>

        </div>
        <div class="table_container app_card" v-show="!tableShow">
            <sn-card />
        </div>
        <InputDia ref="inputD"></InputDia>
    </div>
</template>

<script setup lang='ts'>
import InputDia from './components/inputDia.vue'
import Pagination from '@/components/Pagination/index.vue'
import { reactive, ref } from 'vue'
import { carNewList_API } from '@/api/machineryList/index'
import { newListObj, carNewListResponseData, pageInfo } from '@/api/machineryList/type'
import snTable from './components/sn-table.vue'
import snCard from './components/sn-card.vue'
import { carDealer_API } from '@/api/machineryList/index'
import { carDealerResponseData, carDealerObj } from '@/api/machineryList/type'
// 控制table显示与否
const tableShow = ref<boolean>(true)
const total = ref<number>(10)
// 经销商列表
const dealerList = ref<carDealerObj[]>([])
const pageInfo = reactive<pageInfo>({
    key: '',
    currentPage: 1,
    pageSize: 3,
    companyId: '',
    order: '1',
    provinceCode: '',
    cityCode: ''
})
const inputD = ref()
// 车辆列表
const carNewList = ref<newListObj[]>([])
// 车辆ID 
const search = () => {
    tableShow.value = true
    getCarList()
}
const changeBlur = () => {
    tableShow.value = true
    getCarList()
}
const currentChange = (val: any) => {
    pageInfo.currentPage = val.currentPage
    pageInfo.pageSize = val.pageSize
    getCarList()
}

const gotoInput = () => {
    inputD.value.dialogVisible = true
}
const changeSort = (val: string) => {
    pageInfo.order = val
    getCarList()
}

// 获取公司列表
const getDealerList = async () => {
    const res: carDealerResponseData = await carDealer_API()
    dealerList.value = res.data
}
getDealerList()
// 获取车辆列表
const getCarList = async () => {
    const res: carNewListResponseData = await carNewList_API(pageInfo)
    carNewList.value = res.data.records
    total.value = res.data.total
}
getCarList()
const switchTabShow = (val: boolean) => {
    tableShow.value = val
}
</script>

<style lang="scss" scoped>
.search_container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    flex-wrap: wrap;

    .input_area {
        .input-with-select {
            width: 290px;
            height: 32px;
            opacity: 1;
            border-radius: 4px;
            background: rgba(255, 255, 255, 1);
            border: 1px rgba(220, 223, 230, 1);
            margin-right: 40px;
        }

        .m_2 {
            width: 179px;
            height: 32px;
            opacity: 1;
            border-radius: 4px;
            background: rgba(255, 255, 255, 1);
            border: 1px rgba(220, 223, 230, 1);
        }

    }

    .button_group2 {
        margin-left: 20PX;

        .el-button {
            height: 32px;
            font-size: 20px;
            padding: 5px 15px;
        }

        .tab_active {
            color: var(--el-color-primary);
            border-color: var(--el-color-primary);
        }
    }

}
</style>