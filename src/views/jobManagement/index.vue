<template>
    <div class='app_container'>
        <div class="search_container app_card">
            <div class="input_area">
                <el-select v-if="dealerList.length > 1" filterable v-model="pageInfo.companyId" class="input-with-select"
                    placeholder="请选择" @change="changeBlur1">
                    <el-option v-for="item in dealerList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                </el-select>
                <el-input style="width:179px;margin-right: 20px;" v-if="dealerList.length === 1"
                    v-model="dealerList[0].name" disabled />
                <el-select-v2  style="width: 230px;" filterable v-model="pageInfo.carId" :options="options" placeholder="请选择"
                    @change="changeBlur2">
                </el-select-v2>
                <!-- <el-select v-load-more="loadmore" filterable  v-model="pageInfo.carId"
                    class="m-2" placeholder="请选择" remote-show-suffix @change="changeBlur2">
                    <el-option v-if="CarDealerList" v-for="item in dataItems" :label="item.nameNpn" :value="item.id"
                        :key="item.id"></el-option>
                    <el-option value="请选择" v-else disabled>该公司下暂无车辆,请选择其他公司</el-option>
                </el-select> -->

            </div>
            <div class="time">
                <p :class="isActive == 1 ? 'active' : ''" @click="onDayClick">今日</p>
                <p :class="isActive == 2 ? 'active' : ''" @click="onMonthClick">本月</p>
                <p :class="isActive == 3 ? 'active' : ''" @click="onYearClick">今年</p>
                <div class="demo-date-picker">
                    <div class="block">
                        <el-date-picker style="width: 144px;" class=".date_picker1" v-model="value1" type="date"
                            placeholder="请选择日期" size="default" :disabled-date="disabledDate" @change="changeA()" />
                    </div>
                    <div class="gang">--</div>
                    <div class="block">
                        <el-date-picker style="width: 144px;" class=".date_picker2" v-model="value2" type="date"
                            placeholder="请选择日期" :disabled-date="disabledDate" size="default" @change="changeA()" />
                    </div>
                </div>
            </div>
            <div class="button_area">
                <el-button type="primary" @click="openExportDia">导出</el-button>
                <el-button
                    @click="router.push({ path: '/jobManagement/taskManage', query: { companyId: pageInfo.companyId, carId: pageInfo.carId } })"
                    icon="MapLocation" class="btn2"></el-button>
            </div>
        </div>
        <div class="table_container app_card">
            <sn-table :paddyWorkList="paddyWorkList">
                <div>
                    <Pagination :total="total" :currentPage="pageInfo.currentPage" :pageSize="pageInfo.pageSize"
                        @pageChange="currentChange">
                    </Pagination>
                </div>
            </sn-table>
        </div>
    </div>
</template>

<script setup lang='ts'>
import snTable from './components/sn-table.vue'
// import vLoadMore from '@/utils/loadData'
import { reactive, ref, watch } from 'vue'
import Pagination from '@/components/Pagination/index.vue'
import { paddyWorkList_API, getCarDealerList_API, getPaddyWorkExport_API } from '@/api/jobManagement/index'
import { carDealer_API } from '@/api/machineryList/index'
import { PageObj, paddyWorkListResponsenumber, paddyWorkObj, dealerCarObj, dealerCarResponseData } from '@/api/jobManagement/type'
import { carDealerResponseData, carDealerObj } from '@/api/machineryList/type'
import router from '@/router'
// 控制table显示与否
// 时间格式转换
function add0(m: any) {
    return m < 10 ? '0' + m : m;
}
// 数据懒加载


const formartDate = (val: Date) => {
    var y = val.getFullYear();
    var m = val.getMonth() + 1;
    var d = val.getDate();
    var h = val.getHours();
    var mm = val.getMinutes();
    var s = val.getSeconds();
    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}
// 获取列表数据
const paddyWorkList = ref<paddyWorkObj[]>([])
// 提交数据
const pageInfo = reactive<PageObj>({
    carId: '',
    name: '',
    companyId: '',
    currentPage: 1,
    pageSize: 10,
    st: '',
    et: ''
})

let CarDealerList = ref<dealerCarObj[]>([])
// const dataItems = ref<dealerCarObj[]>([])
const value1 = ref<Date>()
const value2 = ref<Date>()
const isActive = ref<number>(0)
const a = ref<Date>()
const total = ref<number>(10)
// const pageData = ref({
//     pageIndex: 1, pageSize: 50
// })
// 数据懒加载
// const loadmore = () => {
//     pageData.value.pageIndex++
//     let num = pageData.value.pageIndex * pageData.value.pageSize;
//     dataItems.value = CarDealerList.value.filter((_item, index) => {
//         return index < num
//     })
// }

// 页码变化
const currentChange = (val: any) => {
    pageInfo.currentPage = val.currentPage
    pageInfo.pageSize = val.pageSize
    getPaddyWorkList()
}
// 经销商列表
const dealerList = ref<carDealerObj[]>([])
const getDealerList = async () => {
    const res: carDealerResponseData = await carDealer_API()
    if (res.data.length > 1) {
        dealerList.value = [{ 'id': '', 'name': '全部经销商' }, ...res.data]
        pageInfo.companyId = ''
    } else {
        dealerList.value = res.data
        pageInfo.companyId = res.data[0].id
    }
    getDealerCarList()
}
getDealerList()
let options = <any>[]
// 获取经销商下车辆列表
const getDealerCarList = async () => {
    const res: dealerCarResponseData = await getCarDealerList_API(pageInfo.companyId)
    // dataItems.value = []
    // pageData.value.pageIndex = 1
    if (res.data == null) {
        CarDealerList.value = []
    }
    else {
        CarDealerList.value = res.data
        options = CarDealerList.value.map((item: any, _idx) => ({
            value: item.id,
            label: `${item.nameNpn}`,
        }))
        // dataItems.value = CarDealerList.value.filter((_item, index) => {
        //     return index < 50
        // })
        pageInfo.carId = res.data[0].id
        getPaddyWorkList()
    }
}

// 获取数据
const getPaddyWorkList = async () => {
    const res: paddyWorkListResponsenumber = await paddyWorkList_API(pageInfo)
    total.value = res.data.total
    paddyWorkList.value = res.data.records
}
// 监视日期，起始日期大于末尾日期则交换
watch(() => [value1.value, value2.value], () => {
    if (value2.value && value1.value && value2.value.getTime() < value1.value.getTime()) {
        a.value = value1.value
        value1.value = value2.value
        value2.value = a.value
    }
})

// 禁止选择今日以后的日期
const disabledDate = (time: Date) => {
    return time.getTime() > Date.now()
}
const changeBlur1 = () => {
    getDealerCarList()
    pageInfo.carId = '请选择'
    paddyWorkList.value = []
}
const changeBlur2 = () => {
    getPaddyWorkList()
}
const openExportDia = () => {
    getPaddyWorkExport_API(pageInfo).then((res) => {
        let name = '作业.xlsx';
        const type = 'application/vnd.ms-excel;charset=utf-8'; //excel文件
        let u = window.URL.createObjectURL(new Blob([res], { type: type }));
        let a = document.createElement('a');
        a.download = name;
        a.href = u;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
    })

}
//今天
const onDayClick = () => {
    isActive.value = 1;
    value1.value = new Date();
    value2.value = new Date();
    pageInfo.st = formartDate(value1.value)
    pageInfo.et = formartDate(value2.value)
    getPaddyWorkList()
}
//这个月
const onMonthClick = () => {
    isActive.value = 2;
    value2.value = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
    value1.value = start
    pageInfo.st = formartDate(value1.value)
    pageInfo.et = formartDate(value2.value)
    getPaddyWorkList()
}
// 这一年
const onYearClick = () => {
    isActive.value = 3;
    value2.value = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
    value1.value = start
    pageInfo.st = formartDate(value1.value)
    pageInfo.et = formartDate(value2.value)
    getPaddyWorkList()
}
// 事件改变回调
const changeA = () => {
    if (value1.value && value2.value) {
        pageInfo.st = formartDate(value1.value as Date)
        pageInfo.et = formartDate(value2.value as Date)
        getPaddyWorkList()
    }
    isActive.value = 0;
}


</script>

<style lang="scss" scoped>
.search_container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    flex-wrap: wrap;


    .input_area {
        display: flex;
        width: 25%;

        .input-with-select {
            width: 179px;
            height: 32px;
            opacity: 1;
            border-radius: 4px;
            margin-right: 20px;
        }

        .m-2 {
            width: 179px;
            height: 32px;
            opacity: 1;
        }

    }

    .time {
        height: 32px;
        display: flex;

        .demo-date-picker {
            display: flex;

            .gang {
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0px 10px;
                height: 32px;
                opacity: 1;
                line-height: 21px;
                /** 文本1 */
                font-size: 14px;
                font-weight: 400;
                letter-spacing: 0px;
                line-height: 20.27px;
            }
        }

        p {
            margin-right: 32px;
            line-height: 5px;
            width: 28px;
            height: 20px;
            font-size: 14px;
            vertical-align: middle;
            font-family: SourceHanSansSC-regular;

            &:hover {
                cursor: pointer;
                color: var(--el-color-primary);
            }

            &.active {
                color: var(--el-color-primary);
            }
        }

        .date_picker {
            line-height: 32px;
            width: 240px;
            height: 32px;
        }
    }

    .button_area {

        .btn2 {
            width: 32px;
            height: 32px;
            border-radius: 4px;
            border: 1.5px solid var(--el-color-primary);
            color: var(--el-color-primary);
        }


    }

}
</style>