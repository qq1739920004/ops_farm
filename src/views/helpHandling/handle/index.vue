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
            <div class="card_title">基本信息
                <span class="downIcon" @click="clickOpen">
                    {{openContent}}
                    <el-icon v-if="isShow">
                        <ArrowUp />
                    </el-icon>
                    <el-icon v-else>
                        <ArrowDown />
                    </el-icon>
                </span>
            </div>

            <ul class="base_info">
                <li>
                    <span>类型：</span>
                    <span>{{ baseInfo.model }}</span>
                </li>
                <li>
                    <span>软件版本</span>
                    <span>{{ baseInfo.softwareVersion }}</span>
                </li>
                <li>
                    <span>更新时间</span>
                    <span>{{ baseInfo.updateTime }}</span>
                </li>
                <li>
                    <span>车辆厂家：</span>
                    <span>{{ baseInfo.factory }}</span>
                </li>
                <a href="" v-show="isShow">
                    <li>
                        <span>SN:</span>
                        <span>{{ baseInfo.sn}}</span>
                    </li>
                    <li>
                        <span>车辆名称：</span>
                        <span>{{ baseInfo.name }}</span>
                    </li>
                    <li>
                        <span>车主姓名：</span>
                        <span>{{ baseInfo.factory }}</span>
                    </li>
                    <li>
                        <span>车主电话：</span>
                        <span>{{baseInfo.tel}}</span>
                    </li>
                   
                    <li>
                        <span>车龄：</span>
                        <span>{{ baseInfo.age}}</span>
                    </li>
                    <li>
                        <span>创建人：</span>
                        <span>{{ baseInfo.creatorName}}</span>
                    </li>
                    <li>
                        <span>创建人电话：</span>
                        <span>{{ baseInfo.creatorTel}}</span>
                    </li>
                    <li>
                        <span>创建时间：</span>
                        <span>{{ baseInfo.createTime}}</span>
                    </li>
                    <li>
                        <span>最近上线时间：</span>
                        <span>{{ baseInfo.lastOnlineTime}}</span>
                    </li>
                    <li>
                        <span>最近自动驾驶时间：</span>
                        <span>{{ baseInfo.lastAutoDriveTime}}</span>
                    </li>
                </a>
            </ul>


        </div>
        <div class="card2">
            <div class="card_title">报警信息</div>
            <div class="alarm" v-for="(item, index)  in alarmRecord" :key="index">
                <span>等级：{{ item.grade }}</span>
                <span>时间：{{ item.time }}</span>
                <span>内容：{{ item.content }}</span>
            </div>
        </div>
        <div class="card3">
            <div class="card_title">参数变更记录</div>
            <div class="sub_title">
                <span>变更时间</span>
                <span>参数名称</span>
            </div>
            <div class="change" v-for="(value, key, index) in paramChange" :key="index">
                <span class="change_time">时间：{{ tsToStr(key) }}</span>
                <div>{{ value[0].name }}:（
                    <span style="color: red;">{{ value[0].newParam }}</span>→
                    <span style="color: red;">{{ value[0].oldParam }}</span>
                    ）
                </div>
            </div>
        </div>
        <div class="card4">
            <div class="card_title">参数信息</div>
            <div class="secondTitle">
                <span>|</span>
                <span>差分信息</span>
            </div>
            <div class="message">
                ---
            </div>

            <div class="secondTitle">
                <span>|</span>
                <span>车辆参数</span>
            </div>
            <div class="message">
                <div v-for="(value, name, index)  in carParam.value" :key="index">
                    <span>{{ name + ':' }}</span>
                    <span>{{ value }}</span>
                </div>
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
                <div v-for="(value, name, index)  in PIDParam.value" :key="index">
                    <span>{{ name + ':' }}</span>
                    <span>{{ value }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { onMounted, ref, reactive, } from 'vue'
import { getHelpHandlingCarParamAPI, getHelpHandlingCalibParamAPI, getHelpHandlingAlarmRecordAPI, getHelpHandlingFinishAPI, getHelpHandlinPIDParamAPI, getHelpHandlingParamChangeAPI } from '@/api/helpHanding/index'
import { carNewDetail_API } from '@/api/machineryList/index'
import type { HelpHandlingParamData, HelpHandlingAlarmData, } from '@/api/helpHanding/type'
import type { carNewDetailResponseData, carNewDetailObj } from '@/api/machineryList/type'

const $router = useRouter()
let $route = useRoute()
let carId = ref<string>('')
let isShow = ref<Boolean>(false)
let openContent=ref<string>('展开')
// 基本信息
const baseInfo = ref<carNewDetailObj>({
    "id": 0,
    "onlineTcp": 0,
    "driveState": 0,
    "factory": "",
    "age": 0,
    "creatorName": "",
    "creatorTel": "",
    "sunFlowerSn": "",
    "softwareVersion": "",
    "createTime": "",
    "updateTime": "",
    "sn": "",
    "name": "",
    "companyName": "",
    "userName": "",
    "tel":'',
    "model": "",
    "lastOnlineTime": "",
    "lastAutoDriveTime": "",
    "board": "",
    "ec20": "",
    "radioStation": "",
    "carImu": "",
    "carImuSn": "",
    "wheelImu": "",
    "wheelImuSn": "",
    "motor": "",
    "motorSn": "",
    "steeringWheel": "",
    "steeringWheelSn": "",
    "hubBluetooth": "",
    "hub": "",
    "hubSn": ""
})

// 报警
const alarmRecord = ref<any>([])
// 参数更改响应数据
const paramChange = ref<any>({
})
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
// PID响应数据
const PIDParam = reactive<any>({
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
// 基本信息
const getBaseInfo = async () => {

    const res: carNewDetailResponseData = await carNewDetail_API(Number(carId.value))
    baseInfo.value = res.data
    // console.log(baseInfo.value)

}
// 报警记录
const getHelpHandlingAlarmRecord = async () => {
    try {
        const res: HelpHandlingAlarmData = await getHelpHandlingAlarmRecordAPI(Number(carId.value))
        alarmRecord.value = res.data.list
        alarmRecord.value.forEach((ele: any) => {
            if (ele.content == 0) {
                ele.content = "集线器"
            } else if (ele.content == 1) {
                ele.content = "力矩电机"
            }
            else if (ele.content == 2) {
                ele.content = "前轮速率陀螺"
            }
            else if (ele.content == 3) {
                ele.content = "车身速率陀螺"
            }
            else if (ele.content == 4) {
                ele.content = "多功能方向盘故障"
            }
            else if (ele.content == 5) {
                ele.content = "多功能方向盘电量过低"
            }
            else if (ele.content == 6) {
                ele.content = "差分龄期过大"
            }
            else {
                ele.content = "横向偏差过大"
            }
        });
    }
    catch (err) {
        console.log(err)
    }
}
const tsToStr = (nowtime: any) => {
    // 将时间戳转化为时间格式 模版用
    let date = new Date(parseInt(nowtime));
    let Year = date.getFullYear();
    let Moth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    let Day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    let Hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
    let Minute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    let Sechond = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    let GMT = Year + '-' + Moth + '-' + Day + ' ' + Hour + ':' + Minute + ':' + Sechond;
    return GMT
}
// 参数变更记录
const getHelpHandlingParamChange = async () => {
    try {
        const res: HelpHandlingParamData = await getHelpHandlingParamChangeAPI(Number(carId.value))
        paramChange.value = res.data

    }
    catch (err) {
        console.log(err)
    }
}
// 获取车辆参数
const getHelpHandlingCarParam = async () => {
    const res: HelpHandlingParamData = await getHelpHandlingCarParamAPI(Number(carId.value))
    carParam.value = JSON.parse(res.data.paramJson)
}
// 获取校准参数
const getHelpHandlingCalibParam = async () => {
    const res: HelpHandlingParamData = await getHelpHandlingCalibParamAPI(Number(carId.value))
    calibParam.value = JSON.parse(res.data.paramJson)
}
// 获取PID参数
const getHelpHandlinPIDParam = async () => {
    const res: HelpHandlingParamData = await getHelpHandlinPIDParamAPI(Number(carId.value))
    PIDParam.value = JSON.parse(res.data.paramJson)
}
getBaseInfo()
getHelpHandlingAlarmRecord()
getHelpHandlingParamChange()
getHelpHandlingCarParam()
getHelpHandlingCalibParam()
getHelpHandlinPIDParam()

const clickOpen=()=> {
      isShow.value = !isShow.value;
      isShow.value ? (openContent.value = '收起') : (openContent.value = '展开');
    }

// 完成处理请求
const getHelpHandlingFinish = async () => {
    try {
        await getHelpHandlingFinishAPI(Number(carId.value), 1)
        console.log('chenggong')
    } catch (err: any) {
        console.log('error')
    }
}
// 完成处理按钮
const handle = () => {
    getHelpHandlingFinish()
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
        background-color: white;

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
            margin-left: 10px;

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
            margin-left: 10px;

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

    .card1 {
        .downIcon {
            float: right;
            color: #4cb04f;
            font-size: 14px;
            cursor: pointer;
        }
    }


    .base_info {
        font-size: 14px;

        li {
            display: inline-block;
            margin: 0 20px;
        }

    }

    .alarm {

        margin-left: 10px;
        font-size: 14px;
        color: #8c8c8c;
        margin: 10px;

        span {
            margin: 10px;
        }

    }

    .card3 {
        .sub_title {
            margin-left: 15px;
            margin-top: 10px;
            font-size: 15px;
            font-weight: 600;
            color: #8c8c8c;

            span {
                display: inline-block;
                width: 250px;

            }
        }

        .change {
            margin-left: 10px;

            font-size: 14px;
            color: #8c8c8c;
            margin: 10px;

            .change_time {
                display: inline-block;
                width: 250px;
            }

            div {
                display: inline;
            }

        }
    }


}
</style>