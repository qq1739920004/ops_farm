<!--  -->
<template>
    <div>
        <div v-show="!status.provinceShow" class="head_container">
            <el-page-header :content="pageTitle" @back="goBack" />
        </div>
        <!-- 省份卡片容器 -->
        <div v-show="status.provinceShow" class="province_card">
            <!-- intro无法选中v-for中渲染的元素 -->
            <div class="intro">
                <div class="intro_item"></div>
            </div>
            <div v-for="(item, index) in provinceCountData" :key="index" class="province_card_item"
                :class="[{ car_item_online: item.onlineCar > 0 }]">
                <el-row class="item_title">
                    <el-col :span="12" class="item_title_province">{{
                        item.name || "/"
                    }}</el-col>
                    <el-col :span="12" class="item_title_city" @click.native="handleProButClick(item)">
                        <el-tooltip class="item" effect="dark" content="地级市列表" placement="top">
                            <el-icon>
                                <More />
                            </el-icon>
                        </el-tooltip>
                    </el-col>
                </el-row>
                <div style="cursor: pointer" @click="handleProCardClick(item)">
                    <el-row class="item_text">
                        <el-col :span="10">在线/累计车辆</el-col>
                        <el-col :span="14">今日/累计作业(千亩)</el-col>
                    </el-row>
                    <el-row class="item_count">
                        <el-col :span="10" class="item_count_each">
                            <span class="bold" :class="{ online_car: item.onlineCar > 0 }">{{
                                item.onlineCar || "--"
                            }}</span>
                            <span style="padding: 0 5px">/</span>
                            <span>{{ item.totalCar || "--" }}</span>
                        </el-col>
                        <el-col :span="14">
                            <span class="bold">{{
                                item.todayArea ? (item.todayArea / 1000).toFixed(2) : "--"
                            }}</span>
                            <span style="padding: 0 5px">/</span>
                            <span>{{
                                item.totalArea ? (item.totalArea / 1000).toFixed(2) : "--"
                            }}</span>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div v-if="provinceCountData.length === 0" style="margin: auto; padding-top: 50px">
                暂无数据
            </div>
        </div>
        <!-- 地级市卡片容器 -->
        <div v-show="status.cityShow" class="city_card">
            <div v-for="(item, index) in cityCountData" :key="index" class="city_card_item"
                :class="{ car_item_online: item.onlineCar > 0 }">
                <el-row class="item_title">
                    <el-col :span="12" class="item_title_province">{{
                        item.name || "/"
                    }}</el-col>
                    <el-col :span="12" class="item_title_city" />
                </el-row>
                <div style="cursor: pointer" @click="handleCityCardClick(item)">
                    <el-row class="item_text">
                        <el-col :span="10">在线/累计车辆</el-col>
                        <el-col :span="14">今日/累计作业(千亩)</el-col>
                    </el-row>
                    <el-row class="item_count">
                        <el-col :span="10">
                            <span class="bold" :class="{ online_car: item.onlineCar > 0 }">{{
                                item.onlineCar || "--"
                            }}</span>
                            <span style="padding: 0 5px">/</span>
                            <span>{{ item.totalCar || "--" }}</span>
                        </el-col>
                        <el-col :span="14">
                            <span class="bold">{{
                                item.todayArea ? (item.todayArea / 1000).toFixed(2) : "--"
                            }}</span>
                            <span style="padding: 0 5px">/</span>
                            <span>{{
                                item.totalArea ? (item.totalArea / 1000).toFixed(2) : "--"
                            }}</span>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
        <div v-show="status.formShow" class="table_card">
            <sn-table :carNewList="formData" @changeSort="changeSort" />
            <el-row type="flex" justify="end" style="margin-top:10px;margin-right:10px;">
                <Pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @pageChange="currentChange">
                </Pagination>
            </el-row>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { getProvinceDataNewList_API, getCityDataNewList_API } from '@/api/machineryList/sn-card/index'
import { ProvinceDataNewListObj, ProvinceDataNewListResponseData, CityDataNewListResponseData, CityDataNewListObj } from '@/api/machineryList/sn-card/type'
import { carNewList_API } from '@/api/machineryList/index'
import { newListObj, carNewListResponseData } from '@/api/machineryList/type'
import snTable from './sn-table.vue'
import Pagination from '@/components/Pagination/index.vue'
// 省份数据列表
const provinceCountData = reactive<ProvinceDataNewListObj[]>([])
// 地级市数据列表
const cityCountData = reactive<CityDataNewListObj[]>([])
// 城市数组
const formData = reactive<newListObj[]>([])
const statusStark = ref([
    {
        provinceShow: true,
        provinceName: '',
        provinceCode: null,
        cityShow: false,
        cityName: '',
        cityCode: null,
        formShow: false
    }
])
const status = reactive({
    provinceShow: true,
    provinceName: '',
    provinceCode: null,
    cityShow: false,
    cityName: '',
    cityCode: null,
    formShow: false
})
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const total = ref<number>(10)
// const registerAuthority = ref<boolean>(false)
const order = ref('1')
// 获取省份数据
const getProvinceDataNewList = async () => {
    const res: ProvinceDataNewListResponseData = await getProvinceDataNewList_API()
    Object.assign(provinceCountData, res.data)
}
getProvinceDataNewList()
// 获取地级市数据
const getCityDataNewList = async (val: string) => {
    const res: CityDataNewListResponseData = await getCityDataNewList_API(val)
    Object.assign(cityCountData, res.data)
}
// 点击...
const handleProButClick = (item: any) => {
    if (item.code === '-1') return;
    getCityDataNewList(item.code);
    let iStatus = {
        provinceShow: false,
        provinceName: item.name,
        provinceCode: item.code,
        cityShow: true,
        cityName: '',
        cityCode: null,
        formShow: false
    };
    Object.assign(status, iStatus)
    statusStark.value.push(status);
}
// 点击城市
const handleCityCardClick = (item: any) => {
    let iStatus = {
        provinceShow: false,
        provinceName: status.provinceName,
        provinceCode: status.provinceCode,
        cityShow: false,
        cityName: item.name,
        cityCode: item.code,
        formShow: true
    };
    Object.assign(status, iStatus)
    statusStark.value.push(status);
    getListData()
}
// 点击省份
const handleProCardClick = (item: any) => {
    let iStatus = {
        provinceShow: false,
        provinceName: item.name,
        provinceCode: item.code,
        cityShow: false,
        cityName: '',
        cityCode: null,
        formShow: true
    };
    Object.assign(status, iStatus)
    statusStark.value.push(status);
    getListData()

}
// 计算
const pageTitle = computed(() => {
    return status.provinceName + ' ' + status.cityName;
})
const goBack = () => {
    // 使用栈记录状态
    currentPage.value = 1;
    Object.assign(formData, [])
    statusStark.value.pop();
    const iStatus = statusStark.value[statusStark.value.length - 1];
    Object.assign(status, iStatus)
}
// 获取列表
const getListData = async () => {
    let code = {
        provinceCode: '',
        cityCode: ''
    };
    status.provinceCode
        ? (code.provinceCode = status.provinceCode)
        : '';
    status.cityCode ? (code.cityCode = status.cityCode) : '';
    console.log(code);
    const res: carNewListResponseData = await carNewList_API({
        currentPage: currentPage.value,
        pageSize: pageSize.value,
        order: order.value,
        ...code
    })
    total.value = res.data.total
    Object.assign(formData, res.data.records)

    // registerAuthority.value = res.data.records
}
const currentChange = (val: any) => {
    currentPage.value = val.currentPage
    pageSize.value = val.pageSize
    getListData()
}
const changeSort = (val: string) => {
    order.value = val
    getListData()
}
</script>

<style lang="scss" scoped>
.province_card,
.city_card {
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    position: relative;

    .car_item_online {
        background-color: #e7ffe6 !important;
    }

    .intro {
        width: 310px;
        height: 120px;
        position: absolute;
        top: 20px;
        left: 20px;

        .intro_item {
            position: absolute;
            top: 10px;
            right: 15px;
            width: 40px;
            height: 25px;
        }
    }

    .province_card_item,
    .city_card_item {
        width: 310px;
        background-color: #f5f5f5;
        border-radius: 5px;
        padding: 10px;
        margin: 10px;
        transition: all 0.25s;
        box-sizing: border-box;

        .item_title {
            padding: 5px;

            .item_title_province {
                font-size: 16px;
                font-weight: bold;
                text-align: left;
            }

            .item_title_city {
                font-size: 14px;
                color: #4cb04f;
                cursor: pointer;
                text-align: right;
                padding-right: 10px;
            }
        }

        .item_text {
            font-size: 14px;
            color: #333333;
            padding: 10px 0px;
            text-align: left;
        }

        .item_count {
            text-align: left;
            font-size: 22px;

            // .item_count_each {
            //     display: flex;
            //     justify-content: center;
            //     align-items: center;
            //     >span {
            //         display: block;
            //     }
            // }
            .bold {
                font-size: 26px;
            }

            .online_car {
                color: #00c853;
            }
        }
    }
}

.province_card_item:hover {
    // background-color: #E7FFE6;
    box-shadow: 5px 5px 10px gray;
}

.city_card_item:hover {
    // background-color: #E7FFE6;
    box-shadow: 5px 5px 10px gray;
}
</style>