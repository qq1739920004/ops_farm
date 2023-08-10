<template>
    <div class="app_container">
        <div class="title">
            <el-icon>
                <Back @click="back" />
            </el-icon>
            <span>详情</span>
        </div>
        <div class="middle">
            <el-button type="success" plain>远程管理</el-button>
            <el-button type="success" plain @click="handle">处理</el-button>
        </div>
        <div class="card1">
            <div class="card_title">基本信息</div>
            <div>neirong</div>
        </div>
        <div class="card2">
            <div class="card_title">报警信息</div>
        </div>
        <div class="card3">
            <div class="card_title">参数变更记录</div>
        </div>
        <div class="card4">
            <div class="card_title">参数信息</div>
            <div class="secondTitle">
                <span>|</span>
                <span>车辆参数</span>
            </div>
            <div class="message">
               ---
            </div>
            <div class="secondTitle">
                <span>|</span>
                <span>校准参数</span>
            </div>
            <div class="message">
                <div v-for="(value, name, index)  in calibParam.value" :key="index">
                    <span>{{ name + ':' }}</span>
                    <span>{{ value }}</span>
                </div>
            </div>
            <div class="secondTitle">
                <span>|</span>
                <span>PID参数</span>
            </div>
            <div class="message">
                ---
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { onMounted, ref, reactive } from 'vue'
import { getHelpHandlingCarParamAPI, getHelpHandlingParamChangeRecordAPI, getHelpHandlingCalibParamAPI, getHelpHandlingFinishAPI } from '@/api/helpHanding/index'
import type { HelpHandlingCarParamData } from '@/api/helpHanding/type'

const $router = useRouter()
let $route = useRoute()
let carId = ref<string>('')
// 车辆参数响应数据
const carParam = reactive<any>({
    carId: 0,
    updateTime: 0,
    createTime: 0,
    paramJson: ''
})

// 校准参数响应数据
const calibParam = reactive<any>({
})

// 返回求助处理页
const back = () => {
    $router.push({
        path: '/helpHandling'
    });
}

onMounted(
    () => {
        carId.value = ($route.query.carId as string)
    }
)
// 获取车辆参数
const getHelpHandlingCarParam = async () => {
    const res: HelpHandlingCarParamData = await getHelpHandlingCarParamAPI(Number(carId.value))
    carParam.value = res.data
}
// 获取参数描述
const getHelpHandlingParamChangeRecord = async () => {
    try {
        const res: any = await getHelpHandlingParamChangeRecordAPI(Number(carId.value))
        carParam.value = res.data
    } catch { }

}
// 校准参数
const getHelpHandlingCalibParam = async () => {
    const res: any = await getHelpHandlingCalibParamAPI(Number(carId.value))
    calibParam.value = JSON.parse(res.data.paramJson)
    console.log(' calibParam.value', calibParam.value)

}
getHelpHandlingCarParam()
getHelpHandlingParamChangeRecord()
getHelpHandlingCalibParam()

// 完成处理请求
const getHelpHandlingFinish = async () => {
    try {
        await getHelpHandlingFinishAPI(Number(carId.value))
    } catch (err: any) {

    }
}

const handle = () => {
    // statues 0
    getHelpHandlingFinish()
    console.log('---finish')
}

</script>

<style lang="scss" scoped>
.app_container {
    .title {
        height: 50px;
        line-height: 50px;

        span {
            margin-left: 20px
        }
    }

    .middle {
        width: 100%;
        text-align: right;
    }

    .card1,
    .card2,
    .card3,
    .card4 {
        width: 100%;
        border: 1px solid rgba(53, 45, 45, 0.144);
        margin-top: 10px;

        .card_title {
            padding-left: 10px;
            height: 40px;
            line-height: 40px;
            background-color: rgb(236, 236, 236);
        }

        .secondTitle {
            text-align: left;
            font-size: 14px;
            color: black;
            margin-top: 10px;

            span:first-child {
                padding-right: 2px;
                vertical-align: text-bottom;
                color: #4cb04f;
                font-weight: 900;
            }
        }

        .message {
            margin-top: 10px;
            text-align: left;
            display: flex;
            flex-wrap: wrap;
            width: 100%;

            >div {
                display: inline-block;
                font-size: 14px;
                color: #8c8c8c;
                width: 15%;
                margin-bottom: 10px;

                span:nth-child(2) {
                    color: #101010;
                }
            }
        }

    }
}</style>