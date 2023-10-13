<!--  <div class="line line2">
                <div class="tit">公司名称:</div>
                <div class="data">{{ NewDetail.companyName }}</div>
                <div class="tit">创始人:</div>
                <div class="data">{{ NewDetail.creatorName }}</div>
            </div>
            <div class="line line2 ">
                <div class="tit">车主姓名:</div>
                <div class="data">{{ NewDetail.userName }}</div>
                <div class="tit">车主电话:</div>
                <div class="data">{{ NewDetail.tel }}</div>
            </div>
            <div class="line line3">
                <div class="tit">车辆厂家:</div>
                <div class="data data4">{{ NewDetail.factory }}</div>
                <div class="tit">车辆型号:</div>
                <div class="data data4">{{ NewDetail.model }}</div>
                <div class="tit">年龄:</div>
                <div class="data data4">{{ NewDetail.age }}</div>
            </div>
            <div class="line line2 ">
                <div class="tit">向日葵SN:</div>
                <div class="data data4"> {{ NewDetail.sunFlowerSn }}</div>
                <div class="tit">软件版本:</div>
                <div class="data ">{{ NewDetail.softwareVersion }}</div>
            </div>
            <div class="line line2 ">
                <div class="tit">创建时间:</div>
                <div class="data">{{ NewDetail.createTime?.split(' ')[0] }}</div>
                <div class="tit">更新时间: </div>
                <div class="data">{{ NewDetail.updateTime?.split(' ')[0] }}</div>
            </div>
            <div v-if="props.terminalType != 'AG302'">
                <div class="line line2 ">
                    <div class="tit">板卡固件号:</div>
                    <div class="data">{{ NewDetail.board }}</div>
                    <div class="tit">EC20固件号: </div>
                    <div class="data">{{ NewDetail.ec20 }}</div>
                </div>
                <div class="line line2 ">
                    <div class="tit">电台固件号:</div>
                    <div class="data">{{ NewDetail.radioStation }}</div>
                    <div class="tit">车身IMU固件号: </div>
                    <div class="data">{{ NewDetail.carImu }}</div>
                </div>
                <div class="line line2 ">
                    <div class="tit">车身IMU_SN:</div>
                    <div class="data">{{ NewDetail.carImuSn }}</div>
                    <div class="tit">前轮IMU固件号: </div>
                    <div class="data">{{ NewDetail.wheelImu }}</div>
                </div>
                <div class="line line2 ">
                    <div class="tit">前轮IMU_SN:</div>
                    <div class="data">{{ NewDetail.wheelImuSn }}</div>
                    <div class="tit">电机固件号: </div>
                    <div class="data">{{ NewDetail.motor }}</div>
                </div>
                <div class="line line2 ">
                    <div class="tit">电机SN:</div>
                    <div class="data">{{ NewDetail.motorSn }}</div>
                    <div class="tit">多功能方向盘固件号: </div>
                    <div class="data">{{ NewDetail.steeringWheel }}</div>
                </div>
                <div class="line line2 ">
                    <div class="tit">多功能方向盘SN:</div>
                    <div class="data">{{ NewDetail.steeringWheelSn }}</div>
                    <div class="tit">Hub蓝牙固件号: </div>
                    <div class="data">{{ NewDetail.hubBluetooth }}</div>
                </div>
                <div class="line line2 ">
                    <div class="tit">Hub固件号:</div>
                    <div class="data">{{ NewDetail.hubSn }}</div>
                    <div class="tit">Hub_SN: </div>
                    <div class="data">{{ NewDetail.hub }}</div>
                </div>
            </div> -->
<template>
    <el-dialog @open="getNewDetail"  v-model="dialogVisible" title="详情" center height="600px" width="1108px">
        <div class="titleArea">
            基本信息
        </div>
        <div class="tableData">
            <div class="line line3">
                <div class="tit">SN:</div>
                <div class="data data4 " :class="NewDetail.onlineTcp != 0 ? 'circlearea' : ''">{{ NewDetail.sn }}
                    <span v-if="NewDetail.onlineTcp != 0">(在线) <span class="circle"></span></span>
                    <span v-else>(离线) <span class="circle2"></span> </span>
                </div>
                <div class="tit">驾驶状态:</div>
                <!-- 0:未自动驾驶 1：上线 2：在线 -->
                <div class="data" v-if="NewDetail.driveState == 0">未自动驾驶</div>
                <div class="data" v-if="NewDetail.driveState == 1">上线</div>
                <div class="data" v-if="NewDetail.driveState == 2">在线</div>
                <div class="tit">公司名称:</div>
                <div class="data">{{ NewDetail.companyName }}</div>
            </div>
            <div class="line line3">
                <div class="tit">车主姓名:</div>
                <div class="data">{{ NewDetail.userName }}</div>
                <div class="tit">车主电话:</div>
                <div class="data">{{ NewDetail.tel }}</div>
                <div class="tit">车辆厂家:</div>
                <div class="data">{{ NewDetail.factory }}</div>
            </div>
            <div class="line line3">
                <div class="tit">车辆型号:</div>
                <div class="data">{{ NewDetail.model }}</div>
                <div class="tit">车龄:</div>
                <div class="data">{{ NewDetail.age }}</div>
                <div class="tit">向日葵SN:</div>
                <div class="data">{{ NewDetail.sunFlowerSn }}</div>
            </div>

        </div>
        <div class="titleArea" v-if="props.terminalType != 'AG302'">
            模块信息
        </div>
        <div class="tableData" v-if="props.terminalType != 'AG302'">
            <div class="line line3">
                <div class="tit">板卡固件号:</div>
                <div class="data">{{ NewDetail.board }}</div>
                <div class="tit">EC20固件号:</div>
                <div class="data">{{ NewDetail.ec20 }}</div>
                <div class="tit">电台固件号:</div>
                <div class="data">{{ NewDetail.sunFlowerSn }}</div>
            </div>
            <div class="line line3">
                <div class="tit">车身IMU固件号:</div>
                <div class="data">{{ NewDetail.carImu }}</div>
                <div class="tit">车身IMU_SN:</div>
                <div class="data">{{ NewDetail.carImuSn }}</div>
                <div class="tit">前轮IMU固件号:</div>
                <div class="data">{{ NewDetail.wheelImu }}</div>
            </div>
            <div class="line line3">
                <div class="tit">前轮IMU_SN:</div>
                <div class="data">{{ NewDetail.wheelImuSn }}</div>
                <div class="tit">电机固件号:</div>
                <div class="data">{{ NewDetail.motor }}</div>
                <div class="tit">电机SN:</div>
                <div class="data">{{ NewDetail.motorSn }}</div>
            </div>
            <div class="line line3">
                <div class="tit">多功能方向盘固件号:</div>
                <div class="data">{{ NewDetail.steeringWheel }}</div>
                <div class="tit">多功能方向盘SN:</div>
                <div class="data">{{ NewDetail.steeringWheelSn }}</div>
                <div class="tit">Hub蓝牙固件号:</div>
                <div class="data">{{ NewDetail.hubBluetooth }}</div>
            </div>
            <div class="line line3">
                <div class="tit">Hub固件号:</div>
                <div class="data">{{ NewDetail.hub }}</div>
                <div class="tit">Hub_SN:</div>
                <div class="data">{{ NewDetail.hubSn }}</div>
                <div class="tit">软件版本:</div>
                <div class="data">{{ NewDetail.softwareVersion }}</div>
            </div>

        </div>
        <div class="titleArea">
            时间信息
        </div>
        <div class="tableData">

            <div class="line line3">
                <div class="tit">创建时间:</div>
                <div class="data">{{ NewDetail.createTime }}</div>
                <div class="tit">更新时间:</div>
                <div class="data">{{ NewDetail.updateTime }}</div>
                <div class="tit">最近上线时间:</div>
                <div class="data">{{ NewDetail.lastOnlineTime }}</div>
            </div>


        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { carNewDetail_API } from '@/api/machineryList/index'
import { carNewDetailResponseData, carNewDetailObj } from '@/api/machineryList/type'
const dialogVisible = ref<boolean>(false)
const carId = ref<Number>(0)
defineExpose({
    dialogVisible
}
)
const props = defineProps(['carId', 'terminalType'])
const NewDetail = reactive<carNewDetailObj>({
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


const getNewDetail = async () => {
    carId.value = props.carId
    const res: carNewDetailResponseData = await carNewDetail_API(carId.value)
    Object.assign(NewDetail, res.data)

}

</script>

<style lang="scss" scoped>

.titleArea {
    text-align: left;
    font-size: 18px;
    font-weight: 400;
    letter-spacing: 0px;
    line-height: 26.06px;
    color: var(--el-menu-text-color);
    margin-bottom: 10px;
    margin-left: 10px;
}

.tableData {
    margin-bottom: 30px;

    .line:nth-child(2n-1) {
        // background: rgba(233, 242, 242, 1);
        // color: #606266;
        background-color: var(--el-fill-color-lighter);

        .tit {
            height: 41px;
            width: 130px;
            background-color: rgba(233, 242, 242, 1);
        }
    }

    .line {
        .tit {
            display: flex;
            align-items: center;
            padding-left: 10px;
            height: 41px;
            width: 130px;
            font-size: 12px;
            font-weight: 400;
            letter-spacing: 0px;
        }
    }

    .line3 {
        width: 100%;
        height: 41px;
        opacity: 1;
        display: flex;
        align-items: center;


        .circle {
            width: 10px;
            height: 10px;
            background-color: var(--el-color-primary);
            border-radius: 50%;
            display: inline-block;
            margin-right: 5px;
        }

        .circle2 {
            width: 10px;
            height: 10px;
            background-color: rgba(123, 138, 138, 0.425);
            border-radius: 50%;
            display: inline-block;
            margin-right: 5px;
        }

        .data {
            display: block;
            width: 224px;
            margin-left: 10px;
            font-size: 12px;
            font-weight: 400;
            letter-spacing: 0px;
        }

        .circlearea {
            color: var(--el-color-primary);
        }

    }
}
</style>