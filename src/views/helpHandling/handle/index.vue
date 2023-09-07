<template>
    <div class="app_container ">
        <div class="app_card">
            <div class="title table_container">
                <div class="title_area">
                    <el-icon>
                        <Back @click="back" />
                    </el-icon>
                    <span>详情</span>
                </div>
                <div class="btn_area">
                    <el-button type="primary" plain :disabled="baseInfo.onlineTcp === 0 ? false : true"
                        @click="remoteManage">远程管理</el-button>
                    <el-button type="primary" plain @click="handle">处理</el-button>
                </div>
            </div>
            <div class="card1">
                <div class="card_title">基本信息
                    <span class="downIcon" @click="clickOpen">
                        {{ openContent }}
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
                        <span>软件版本：</span>
                        <span>{{ baseInfo.softwareVersion }}</span>
                    </li>
                    <li>
                        <span>更新时间：</span>
                        <span>{{ baseInfo.updateTime }}</span>
                    </li>
                    <li>
                        <span>车辆厂家：</span>
                        <span>{{ baseInfo.factory }}</span>
                    </li>
                    <li>
                        <span>SN:</span>
                        <span>{{ baseInfo.sn }}</span>
                    </li>
                    <a href="" v-show="isShow">

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
                            <span>{{ baseInfo.tel }}</span>
                        </li>

                        <li>
                            <span>车龄：</span>
                            <span>{{ baseInfo.age }}</span>
                        </li>
                        <li>
                            <span>创建人：</span>
                            <span>{{ baseInfo.creatorName }}</span>
                        </li>
                        <li>
                            <span>创建人电话：</span>
                            <span>{{ baseInfo.creatorTel }}</span>
                        </li>
                        <li>
                            <span>创建时间：</span>
                            <span>{{ baseInfo.createTime }}</span>
                        </li>
                        <li>
                            <span>最近上线时间：</span>
                            <span>{{ baseInfo.lastOnlineTime }}</span>
                        </li>
                        <li>
                            <span>最近自动驾驶时间：</span>
                            <span>{{ baseInfo.lastAutoDriveTime }}</span>
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
                    <div> <span>工作模式：</span>
                        <span>罗网</span>
                    </div>

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

                <div class="secondTitle">
                    <span>|</span>
                    <span>PID曲线参数</span>
                </div>
                <div class="message">
                    <div v-for="(value, name, index)  in PidCurveParam.value" :key="index">
                        <span>{{ name + ':' }}</span>
                        <span>{{ value }}</span>
                    </div>
                </div>

                <div class="secondTitle">
                    <span>|</span>
                    <span>PID超低速参数</span>
                </div>
                <div class="message">
                    <div v-for="(value, name, index)  in PidSlsParam.value" :key="index">
                        <span>{{ name + ':' }}</span>
                        <span>{{ value }}</span>
                    </div>
                </div>
            </div>
            <!-- 处理对话框 -->
            <el-dialog v-model="dialogFormVisible" title="指派">
                <el-form :model="helpList" :rules="rules" ref="formRef">
                    <el-form-item label="备注：" label-width="140px" prop="info">
                        <el-input v-model="helpList.info" type="textarea" autocomplete="off" placeholder="请输入备注" />
                    </el-form-item>
                    <el-form-item label="继续指派：" label-width="140px" clearable>
                        <el-select v-model="helpList.handlerName" placeholder="请选择" @change="changeHanlder">
                            <el-option v-for="(item, index) in handlerList" :key="index" :label="item.name" :value="item">
                                <span style="float: left;">{{ item.name }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px;">{{ item.tel }}</span>
                            </el-option>
                        </el-select>

                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button ref="finish" @click="finishConfirm">完成处理</el-button>
                        <el-button ref="assign" type="primary" @click="assignConfirm">
                            指派
                        </el-button>
                    </span>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref, reactive, } from 'vue'
import {
    getHelpHandlingCarParamAPI, getHelpHandlingCalibParamAPI, getHelpHandlingAlarmRecordAPI, getHelpHandlingFinishAPI, getHelpHandlinPIDParamAPI,
    getHelpHandlingParamChangeAPI, getHelpHandlerAPI, getPidCurveParmAPI, getPidSlsParamAPI
} from '@/api/helpHanding/index'
import { carNewDetail_API } from '@/api/machineryList/index'
import type { HelpHandlingParamData, HelpHandlingAlarmData, HelpHandlerData, HandlerUserVO, RecordsObj } from '@/api/helpHanding/type'
import type { carNewDetailResponseData, carNewDetailObj } from '@/api/machineryList/type'

const dialogFormVisible = ref(false)
const $router = useRouter()
let $route = useRoute()

let isShow = ref<Boolean>(false)
let openContent = ref<string>('展开')
let formRef = ref()

const rules = {
    info: [{ required: true, message: '请输入备注', trigger: 'blur' }]
}
const helpList = ref<RecordsObj>({
    "id": 0,
    "tel": "",
    "sn": "",
    "carId": 0,
    "status": 0,
    "helpTime": "",
    "handleTime": "",
    "assignTime": "",
    "consumeTime": 0,
    "managerId": 0,
    "handlerId": 0,
    "managerName": "",
    "handlerName": "",
    "info": ""
})
helpList.value = JSON.parse($route.query.helpList as string)
let carId = ref<Number>(helpList.value.carId)

const handlerList = ref<HandlerUserVO[]>([{
    name: '',
    tel: '',
    handlerId: ''
}])
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
    "tel": '',
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
// PID曲线参数
const PidCurveParam = reactive<any>({})

const PidSlsParam = reactive<any>({})
// 返回求助处理页
const back = () => {
    $router.push({
        path: '/helpHandling'
    });
}



// 指派人列表
const getHandler = async () => {
    const res: HelpHandlerData = await getHelpHandlerAPI()
    handlerList.value = res.data
}
// 基本信息
const getBaseInfo = async () => {
    try {
        const res: carNewDetailResponseData = await carNewDetail_API(Number(carId.value))
        res.data ? baseInfo.value = res.data : ''
    } catch (e) {
        console.log(e)
    }
}
// 报警记录
const getHelpHandlingAlarmRecord = async () => {
    try {
        const res: HelpHandlingAlarmData = await getHelpHandlingAlarmRecordAPI(Number(carId.value))
        if (res.data.total) {
            alarmRecord.value = res.data.records
            alarmRecord.value.forEach((item: any) => {
                switch (item.grade) {
                    case 1:
                        item.grade = '一级';
                        break;
                    case 2:
                        item.grade = '二级';
                        break;
                }
                switch (item.content) {
                    case 0:
                        item.content = '集线器';
                        break;
                    case 1:
                        item.content = '力矩电机';
                        break;
                    case 2:
                        item.content = '前轮速率陀螺';
                        break;
                    case 3:
                        item.content = '车身速率陀螺';
                        break;
                    case 4:
                        item.content = '多功能方向盘故障';
                        break;
                    case 5:
                        item.content = '多功能方向盘电量过低';
                        break;
                    case 6:
                        item.content = '差分龄期过大';
                        break;
                    case 7:
                        item.content = '横向偏差过大';
                        break;
                }
            });
        }


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
    res.data ? carParam.value = JSON.parse(res.data.paramJson) : ''
}
// 获取校准参数
const getHelpHandlingCalibParam = async () => {
    const res: HelpHandlingParamData = await getHelpHandlingCalibParamAPI(Number(carId.value))
    res.data ? calibParam.value = JSON.parse(res.data.paramJson) : ''
}
// 获取PID参数
const getHelpHandlinPIDParam = async () => {
    const res: HelpHandlingParamData = await getHelpHandlinPIDParamAPI(Number(carId.value))
    res.data ? PIDParam.value = JSON.parse(res.data.paramJson) : ''
}
// 获取PID曲线参数
const getPidCurveParam = async () => {
    const res: HelpHandlingParamData = await getPidCurveParmAPI(Number(carId.value))
    res.data ? PidCurveParam.value = JSON.parse(res.data.paramJson) : ''
}
// 获取PID超低速
const getPidSlsParam = async () => {
    const res: HelpHandlingParamData = await getPidSlsParamAPI(Number(carId.value))
    res.data ? PidSlsParam.value = JSON.parse(res.data.paramJson) : ''
}
const getHelpHandlingFinish = async (data: any) => {
    try {
        const res = await getHelpHandlingFinishAPI(data)
        if (res.code == 0) {
            back()
        } else {
            alert('处理失败')
        }
    } catch (err: any) {
        console.log('error')
    }
}
getHandler()
getBaseInfo()
getHelpHandlingAlarmRecord()
getHelpHandlingParamChange()
getHelpHandlingCarParam()
getHelpHandlingCalibParam()
getHelpHandlinPIDParam()
getPidCurveParam()
getPidSlsParam()

const remoteManage = () => {
    $router.push({
        name: 'machineryList',
        query: { sn: baseInfo.value.sn },
    });
}


const clickOpen = () => {
    isShow.value = !isShow.value;
    isShow.value ? (openContent.value = '收起') : (openContent.value = '展开');
}

// 处理指派-选择按钮
const changeHanlder = (e: any) => {
    helpList.value.handlerName = e.name
    helpList.value.handlerId = e.handlerId
}


// 指派按钮
const assignConfirm = async () => {
    await formRef.value.validate()
    helpList.value.status = 1
    dialogFormVisible.value = false

    getHelpHandlingFinish(helpList.value)
}
// 完成处理按钮
const finishConfirm = () => {
    helpList.value.status = 2
    dialogFormVisible.value = false
    getHelpHandlingFinish(helpList.value)
}

const handle = () => {
    dialogFormVisible.value = true
}

</script>

<style lang="scss" scoped>
.app_container {

    .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        line-height: 50px;

        span {
            margin-left: 20px
        }

        .title_area {
            display: flex;
            align-items: center;
        }
    }

    .card1,
    .card2,
    .card3,
    .card4 {
        width: 100%;
        border: 1px solid rgb(236, 236, 236);
        margin-top: 10px;
        border-radius: 4px;

        .card_title {
            padding-left: 10px;
            height: 40px;
            line-height: 40px;
            background-color: rgb(236, 236, 236);
            color: black;
        }

        .secondTitle {
            text-align: left;
            font-size: 14px;
            margin-top: 10px;
            margin-left: 10px;

            span:first-child {
                padding-right: 2px;
                vertical-align: text-bottom;
                color: var(--el-color-primary);
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

    .card4 {
        margin-bottom: 20px;
    }

    .card1 {
        .downIcon {
            float: right;
            color: var(--el-color-primary);
            font-size: 14px;
            cursor: pointer;
            margin-right: 10px;
        }

        .base_info {
            font-size: 14px;

            li {
                display: inline-block;
                width: 20%;
                padding: 5px;
                position: relative;

                :first-child {
                    position: relative;
                    color: #8c8c8c;
                    left: 5px;
                    margin: 0 auto;
                }

                :last-child {
                    position: relative;
                    left: 5px;
                    margin: 0 auto;
                }

            }

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