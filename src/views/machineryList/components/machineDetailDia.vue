<!--  -->
<template>
    <div>
        <el-dialog style="border-radius: 8px;" v-model="dialogVisible" title="详情" width="793px" height="392px">
            <div class="tableData">
                <div class="line line1">
                    <div>拖拉机厂家:</div>
                    <div class="data">东方红</div>
                    <div>型号:</div>
                    <div class="data">13m</div>
                    <div>农机轴距:</div>
                    <div class="data">13m</div>
                </div>
                <div class="line line3">
                    <div>天线前后偏移:</div>
                    <div class="half">13m</div>
                    <div>马力:</div>
                    <div class="data">13m</div>
                </div>
                <div class="line line1 ">
                    <div>农机前轮间距:</div>
                    <div class="data">13m</div>
                    <div>天线高度:</div>
                    <div class="data">13m</div>
                    <div>天线左距离:</div>
                    <div class="data">13m</div>
                </div>
                <div class="line line1">
                    <div>偏移:</div>
                    <div class="data">13m</div>
                    <div>马力:</div>
                    <div class="data">13m</div>
                    <div>前陀螺:</div>
                    <div class="data">13m</div>
                </div>
                <div class="line line1 ">
                    <div>天线前后偏移:</div>
                    <div class="data">13m</div>
                    <div>马力:</div>
                    <div class="data">13m</div>
                    <div>前轮陀螺:</div>
                    <div class="data">13m</div>
                </div>
                <div class="line line2 ">
                    <div class="tit">天线前后偏移:</div>
                    <div class="data">13m</div>
                    <div class="bottomr">更新时间: <span>2001-3-1</span></div>
                </div>
                <div class="line line2 ">
                    <div class="tit">天线前后偏移:</div>
                    <div class="data">13m</div>
                    <div class="bottomr">最近自动驾驶时间: <span>2001-3-1</span></div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const dialogVisible = ref<boolean>(false)
defineExpose({
    dialogVisible
}
)

</script>

<style lang="scss" scoped>
.tableData {
    .line:nth-child(2n-1) {
        background: rgba(233, 242, 242, 1);
    }

    .line1 {
        width: 722px;
        height: 41px;
        opacity: 1;
        display: flex;
        align-items: center;

        div {
            width: 16.6%;
            text-align: right;

        }

        .data {
            text-align: left;
            display: block;
            width: 16.6%;
            margin-left: 20px;
            font-size: 16px;
            font-weight: 400;
            letter-spacing: 0px;
            color: rgba(0, 0, 0, 1);

        }
    }

    .line2 {
        width: 722px;
        height: 41px;
        opacity: 1;
        display: flex;
        align-items: center;
        flex-flow: nowrap;

        .tit {
            width: 16.6%;
            text-align: right;
        }

        .data {
            align-items: center;
            text-align: left;
            display: block;
            width: 33.3%;
            margin-left: 20px;
            font-size: 16px;
            font-weight: 400;
            letter-spacing: 0px;
            color: rgba(0, 0, 0, 1);

        }

        .bottomr {
            width: 50%;

            span {
                margin-left: 20px;
                font-size: 14px;
                font-weight: 400;
                letter-spacing: 0px;
                line-height: 20.27px;
                color: rgba(0, 0, 0, 1);
                text-align: left;
                vertical-align: top
            }
        }
    }

    .line3 {
        width: 722px;
        height: 41px;
        opacity: 1;
        display: flex;
        align-items: center;

        div {
            width: 16.6%;
            text-align: right;

        }

        .half {
            text-align: left;
            display: block;
            width: 50%;
            margin-left: 20px;
            font-size: 16px;
            font-weight: 400;
            letter-spacing: 0px;
            color: rgba(0, 0, 0, 1);
        }

        .data {
            text-align: left;
            display: block;
            width: 16.6%;
            margin-left: 20px;
            font-size: 16px;
            font-weight: 400;
            letter-spacing: 0px;
            color: rgba(0, 0, 0, 1);

        }
    }
}
</style>