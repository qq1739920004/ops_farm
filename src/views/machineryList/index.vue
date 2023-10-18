<template>
    <div class="app_container">
        <div class="search_container app_card">
            <div class="input_area">
                <el-input placeholder="请输入SN号、铭牌SN" v-model="pageInfo.key" class="input-with-select" @keyup.enter.native="search"
                    clearable @clear="clearAll">
                    <template #append>
                        <el-button icon="Search" @click="search" />
                    </template>
                </el-input>
                <el-select filterable v-if="dealerList.length > 1" class="m_2" placeholder="公司/经销商"
                    v-model="pageInfo.companyId" @change="changeBlur">
                    <el-option v-for="item in dealerList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                </el-select>
                <el-input v-if="dealerList.length == 1" class="m_2" v-model="dealerList[0].name" @change="changeBlur"
                    disabled>
                </el-input>
            </div>
            <div class="button_area">
                <el-button style="margin-right: 20px;" type="primary" @click="gotoInput">录入经销商设备</el-button>
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
                        @pageChange="currentChange" :disabled="dealerList.length == 0 ? true : false">
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
import { useRoute } from 'vue-router'
import InputDia from './components/inputDia.vue'
import Pagination from '@/components/Pagination/index.vue'
import { reactive, ref, onMounted } from 'vue'
import { carNewList_API } from '@/api/machineryList/index'
import { newListObj, carNewListResponseData, pageInfo } from '@/api/machineryList/type'
import snTable from './components/sn-table.vue'
import snCard from './components/sn-card.vue'
import { carDealer_API } from '@/api/machineryList/index'
import { carDealerResponseData, carDealerObj } from '@/api/machineryList/type'
let $route = useRoute()
// 控制table显示与否
const tableShow = ref<boolean>(true)
const total = ref<number>(10)
// 经销商列表
const dealerList = ref<carDealerObj[]>([])
const pageInfo = reactive<pageInfo>({
    key: '',
    currentPage: 1,
    pageSize: 10,
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
    if (res.data == null) {
    } else {
        dealerList.value = [{ 'id': '', 'name': '全部经销商' }, ...res.data]
        if (dealerList.value.length == 1) {
            pageInfo.companyId = dealerList.value[0].id
        }
        getCarList()
    }
}
const clearAll = () => {
    tableShow.value = true
    getCarList()
}
// 获取车辆列表
const getCarList = async () => {
    const res: carNewListResponseData = await carNewList_API(JSON.stringify(pageInfo))
    carNewList.value = res.data.records.map(item => {
        return {
            ...item,
            openRemote: (item.terminalType === 'AG502' || item.terminalType === 'AG302' || item.terminalType.includes('AG360')) && item.onlineTcp === 1 && (item.driveState !== 1 && item.driveState !== 2) ? false : true,
        }


    })
    total.value = res.data.total
}
const switchTabShow = (val: boolean) => {
    tableShow.value = val
}

onMounted(() => {
    getCarList()
    getRouterParam()
    getDealerList()
})
const getRouterParam = () => {
    pageInfo.key = <string>$route.query.sn
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
            margin-right: 20px;
        }

        .m_2 {
            width: 179px;
            height: 32px;
            opacity: 1;
            border-radius: 4px;

        }

    }

    .button_group2 {
        margin-left: 20pX;

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