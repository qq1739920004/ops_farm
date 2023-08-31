<template>
    <div class='app_container'>
        <div class="search_container app_card">
            <div class="input_area">
                <el-select v-model="pageInfo.companyId" class="input-with-select" placeholder="请选择" @change="changeBlur1">
                    <el-option v-for="item in dealerList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                </el-select>
                <el-select v-model="pageInfo.carId" class="m-2" placeholder="请选择" @change="changeBlur2">

                    <el-option v-if="CarDealerList.length" v-for="item in CarDealerList" :label="item.nameNpn"
                        :value="item.id" :key="item.id"></el-option>
                    <el-option value="请选择" v-else disabled>该公司下暂无车辆,请选择其他公司</el-option>
                </el-select>
            </div>
            <div class="time">
                <p :class="isActive == 1 ? 'active' : ''" @click="onDayClick">今日</p>
                <p :class="isActive == 2 ? 'active' : ''" @click="onMonthClick">本月</p>
                <p :class="isActive == 3 ? 'active' : ''" @click="onYearClick">今年</p>
                <div class="demo-date-picker">
                    <div class="block">
                        <el-date-picker style="width: 144px;" class=".date_picker1" v-model="value1" type="date"
                            placeholder="Pick a day" size="default" :disabled-date="disabledDate" @change="changeA()" />
                    </div>
                    <div class="gang">--</div>
                    <div class="block">
                        <el-date-picker style="width: 144px;" class=".date_picker2" v-model="value2" type="date"
                            placeholder="Pick a day" :disabled-date="disabledDate" size="default" @change="changeA()" />
                    </div>
                </div>
            </div>
            <div class="button_area">
                <el-button type="primary" @click="openExportDia">导出</el-button>
                <el-button type="primary" @click="router.push({ path: '/jobManagement/taskManage' })" icon="MapLocation"
                    class="btn2"></el-button>
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
    carId: 10005,
    name: '',
    companyId: 3,
    currentPage: 1,
    pageSize: 3,
    st: '',
    et: ''
})
const CarDealerList = reactive<dealerCarObj[]>([])
const value1 = ref<Date>()
const value2 = ref<Date>()
const isActive = ref<number>(0)
const a = ref<Date>()
const total = ref<number>(10)
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
    dealerList.value = res.data
}
getDealerList()
// 获取经销商下车辆列表
const getDealerCarList = async () => {
    const res: dealerCarResponseData = await getCarDealerList_API(pageInfo.companyId)
    Object.assign(CarDealerList, res.data)
}
getDealerCarList()
// 获取数据
const getPaddyWorkList = async () => {
    const res: paddyWorkListResponsenumber = await paddyWorkList_API(pageInfo)
    total.value = res.data.total
    paddyWorkList.value = res.data.records
}
getPaddyWorkList()
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
        justify-content: space-between;

        .input-with-select {
            width: 179px;
            height: 32px;
            opacity: 1;
            border-radius: 4px;
            background: rgba(255, 255, 255, 1);
            border: 1px rgba(220, 223, 230, 1);
        }

        .m-2 {
            width: 179px;
            height: 32px;
            opacity: 1;
            border-radius: 4px;
            background: rgba(255, 255, 255, 1);
            border: 1px rgba(220, 223, 230, 1);
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
                width: 10px;
                height: 32px;
                opacity: 1;
                line-height: 21px;
                /** 文本1 */
                font-size: 14px;
                font-weight: 400;
                letter-spacing: 0px;
                line-height: 20.27px;
                color: rgba(0, 0, 0, 1);
            }
        }

        p {
            margin-right: 32px;
            line-height: 5px;
            width: 28px;
            height: 20px;
            color: rgba(51, 51, 51, 1);
            font-size: 14px;
            vertical-align: middle;
            font-family: SourceHanSansSC-regular;

            &:hover {
                cursor: pointer;
                color: rgba(76, 176, 79, 1);
            }

            &.active {
                color: rgba(76, 176, 79, 1);
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
            opacity: 1;
            border-radius: 4px;
            border: 1.5px solid var(--el-color-primary);
            background-color: #fff;
            color: var(--el-color-primary);
        }


    }

}
</style>