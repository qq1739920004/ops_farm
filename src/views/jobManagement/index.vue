<template>
    <div class='app_container'>
        <div class="middle-area">
            <div class="input_area">
                <el-select v-model="pageInfo.company" class="input-with-select" placeholder="请选择" @blur="changeBlur">
                    <el-option value="xxxxxxxxxx" label="xxxxx" />
                    <el-option value="xxxxxxxxxx" label="xxxxx" />
                    <el-option value="xxxxxxxxxx" label="xxxxx" />
                </el-select>
                <el-select v-model="pageInfo.car" class="m-2" placeholder="请选择" @blur="changeBlur">
                    <el-option value="xxx" label="xxx" />
                    <el-option value="xxx" label="xxx" />
                    <el-option value="xxx" label="xxx" />
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
               >
                <el-table-column type="index" width="80" label="序号" align="center" />
                <el-table-column label="作业名称" width="180" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="作业类型" width="140" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="作业面积" width="" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="作业周期" width="" show-overflow-tooltip />
                <el-table-column label="作业地点" width="" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="SN" width="" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="铭牌号" width="" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="所属车辆" width="" show-overflow-tooltip>
                </el-table-column>

            </el-table>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { reactive, ref, watch } from 'vue'
const pageInfo = reactive({
    car: '车辆',
    key: '',
    company: '智能合作社'
})
const value1 = ref<Date>(new Date())
const value2 = ref<Date>(new Date())
const isActive = ref<number>(1)
const a = ref('')
watch(() => [value1.value, value2.value], () => {
    if (value2.value && value1.value && value2.value.getTime() < value1.value.getTime()) {
        a.value = value1.value
        value1.value = value2.value
        value2.value = a.value
    }
})
const disabledDate = (time: Date) => {
    return time.getTime() > Date.now()
}
const changeBlur = () => {

}
const openExportDia = () => {

}
const onDayClick = () => {
    isActive.value = 1;
    value1.value = new Date();
    value2.value = new Date();
}
const onMonthClick = () => {
    isActive.value = 2;
    value2.value = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
    value1.value = start
}
const onYearClick = () => {
    isActive.value = 3;
    value2.value = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
    value1.value = start
}
const changeA = () => {
    isActive.value = 0;
    console.log('value改变');

}
</script>

<style lang="scss" scoped>
.middle-area {
    height: 86px;

    .input_area {
        .input-with-select {
            position: absolute;
            left: 220px;
            top: 113px;
            width: 179px;
            height: 32px;
            opacity: 1;
            border-radius: 4px;
            background: rgba(255, 255, 255, 1);

            border: 1px solid rgba(220, 223, 230, 1);
        }

        .m-2 {
            position: absolute;
            left: 439px;
            top: 113px;
            width: 179px;
            height: 32px;
            opacity: 1;
            border-radius: 4px;
            background: rgba(255, 255, 255, 1);

            border: 1px solid rgba(220, 223, 230, 1);
        }

    }

    .time {
        height: 32px;
        display: flex;
        position: absolute;
        left: 1128px;
        top: 124px;

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
        margin: 16px 10px;

        .btn1 {
            position: absolute;
            left: 1733px;
            top: 123px;
            width: 97px;
            height: 32px;
            opacity: 1;
            border-radius: 4px;
            background: rgba(76, 176, 79, 1);
        }

        .btn2 {
            position: absolute;
            left: 1685px;
            top: 124px;
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