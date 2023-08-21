<template>
    <div class='app_container'>
        <div class="middle-area">
            <div class="input_area">
                <el-select v-model="pageInfo.companyId" class="input-with-select" placeholder="请选择" @blur="changeBlur1">
                    <el-option v-for="item in dealerList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                </el-select>
                <el-select v-model="pageInfo.carId" class="m-2" placeholder="请选择" @blur="changeBlur2">
                    <el-option v-for="item in CarDealerList" :label="item.nameNpn" :value="item.id" :key="item.id"></el-option>
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
                <el-button type="success" class="btn1" @click="openExportDia">导出</el-button>
                <el-button icon="MapLocation" class="btn2"></el-button>
            </div>
        </div>
        <div class="tableArea">
            <el-table
                :header-cell-style="{ background: 'rgba(247, 247, 247, 1)', height: '40px', color: 'rgba(0, 0, 0, 1)', font: '14px' }"
                :data="paddyWorkList">
                <el-table-column type="index" width="80" label="序号" align="center" />
                <el-table-column label="作业名称" show-overflow-tooltip prop="name" align="center">
                </el-table-column>
                <el-table-column label="作业类型" show-overflow-tooltip align="center">
                    <template #="{ row }">
                        <el-tag v-if="row.workType" type="success" round
                            style="color:rgba(0, 125, 117, 1);width: 50px;height: 23px;background-color:rgba(168, 232, 227, 1)">播种</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="作业面积" show-overflow-tooltip align="center">
                    <template #="{ row }">
                        {{ row.workedArea }}亩</template>
                </el-table-column>
                <el-table-column label="作业周期" width="200" show-overflow-tooltip align="center">
                    <template #="{ row }">
                        <el-row justify="center">
                            {{ row.createtime }}
                        </el-row>
                        <el-row justify="center">
                            {{ row.updatetime }}
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column label="作业地点" prop="position" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="SN" show-overflow-tooltip prop="sn">
                </el-table-column>
                <el-table-column label="铭牌号" show-overflow-tooltip prop="npn">
                </el-table-column>
                <el-table-column label="所属车辆" show-overflow-tooltip prop="carName">
                </el-table-column>

            </el-table>
        </div>
        <div class="bottom">
            <Pagination :total="total" :currentPage="pageInfo.currentPage" :pageSize="pageInfo.pageSize"
                @pageChange="currentChange">
            </Pagination>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { reactive, ref, watch } from 'vue'
import Pagination from '@/components/Pagination/index.vue'
import { paddyWorkList_API, getCarDealerList_API } from '@/api/jobManagement/index'
import { carDealer_API } from '@/api/machineryList/index'
import { PageObj, paddyWorkListResponsenumber, paddyWorkObj, dealerCarObj, dealerCarResponseData } from '@/api/jobManagement/type'
import { carDealerResponseData, carDealerObj } from '@/api/machineryList/type'

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
// 获取列表数据
const paddyWorkList = ref<paddyWorkObj[]>([])
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
const changeBlur1 = (val: any) => {
    getPaddyWorkList()
}
const changeBlur2 = () => {
    getPaddyWorkList()
}
const openExportDia = () => {

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
    pageInfo.st = formartDate(value1.value)
    pageInfo.et = formartDate(value2.value)
    getPaddyWorkList()
    isActive.value = 0;
}


</script>

<style lang="scss" scoped>
.middle-area {
    display: flex;
    justify-content: space-between;
    margin: 0px 10px 0 10px;
    height: 60px;
    align-items: center;


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
        .btn1 {
            width: 97px;
            height: 32px;
            opacity: 1;
            border-radius: 4px;
            background: rgba(76, 176, 79, 1);
        }

        .btn2 {
            width: 32px;
            height: 32px;
            opacity: 1;
            border-radius: 4px;
            border: 1.5px solid rgba(67, 207, 124, 1);
            background: rgba(255, 255, 255, 1);
            color: rgba(67, 207, 124, 1);
        }
    }

}
</style>