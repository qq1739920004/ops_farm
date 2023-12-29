<!--  <div class="line line2">
                <div class="tit">{{$t('work.companyName')}}:</div>
                <div class="data">{{ NewDetail.companyName }}</div>
                <div class="tit">创始人:</div>
                <div class="data">{{ NewDetail.creatorName }}</div>
            </div>
            <div class="line line2 ">
                <div class="tit">{{$t('devicelist.name')}}:</div>
                <div class="data">{{ NewDetail.userName }}</div>
                <div class="tit">{{$t('devicelist.tel')}}:</div>
                <div class="data">{{ NewDetail.tel }}</div>
            </div>
            <div class="line line3">
                <div class="tit">{{$t('work.vehicleManufacturer')}}:</div>
                <div class="data data4">{{ NewDetail.factory }}</div>
                <div class="tit">{{$t('work.vehicleModel')}}:</div>
                <div class="data data4">{{ NewDetail.model }}</div>
                <div class="tit">年龄:</div>
                <div class="data data4">{{ NewDetail.age }}</div>
            </div>
            <div class="line line2 ">
                <div class="tit">{{$t('work.sunflowerSN')}}:</div>
                <div class="data data4"> {{ NewDetail.sunFlowerSn }}</div>
                <div class="tit">{{$t('work.softwareVersion')}}:</div>
                <div class="data ">{{ NewDetail.softwareVersion }}</div>
            </div>
            <div class="line line2 ">
                <div class="tit">{{$t('work.creationTime')}}:</div>
                <div class="data">{{ NewDetail.createTime?.split(' ')[0] }}</div>
                <div class="tit">{{$t('work.updateTime')}}: </div>
                <div class="data">{{ NewDetail.updateTime?.split(' ')[0] }}</div>
            </div>
            <div v-if="props.terminalType != 'AG302'">
                <div class="line line2 ">
                    <div class="tit">{{$t('work.boardFirmwareNumber')}}:</div>
                    <div class="data">{{ NewDetail.board }}</div>
                    <div class="tit">{{$t('work.EC20FirmwareNumber')}}: </div>
                    <div class="data">{{ NewDetail.ec20 }}</div>
                </div>
                <div class="line line2 ">
                    <div class="tit">{{$t('work.radioFirmwareNumber')}}:</div>
                    <div class="data">{{ NewDetail.radioStation }}</div>
                    <div class="tit">{{$t('work.bodyIMUFirmwareNumber')}}: </div>
                    <div class="data">{{ NewDetail.carImu }}</div>
                </div>
                <div class="line line2 ">
                    <div class="tit">{{$t('work.bobyIMUSN')}}:</div>
                    <div class="data">{{ NewDetail.carImuSn }}</div>
                    <div class="tit">{{$t('work.frontWheelIMUFirmwareNumber')}}: </div>
                    <div class="data">{{ NewDetail.wheelImu }}</div>
                </div>
                <div class="line line2 ">
                    <div class="tit">{{$t('work.frontSN')}}:</div>
                    <div class="data">{{ NewDetail.wheelImuSn }}</div>
                    <div class="tit">{{$t('work.motorFirmwareNumber')}}: </div>
                    <div class="data">{{ NewDetail.motor }}</div>
                </div>
                <div class="line line2 ">
                    <div class="tit">{{$t('work.MotorSN')}}:</div>
                    <div class="data">{{ NewDetail.motorSn }}</div>
                    <div class="tit">{{$t('work.multifunctionSteeringWheelFirmwareNumber')}}: </div>
                    <div class="data">{{ NewDetail.steeringWheel }}</div>
                </div>
                <div class="line line2 ">
                    <div class="tit">{{$t('work.steeringSN')}}:</div>
                    <div class="data">{{ NewDetail.steeringWheelSn }}</div>
                    <div class="tit">{{$t('work.hubBluetoothFirmwareNumber')}}: </div>
                    <div class="data">{{ NewDetail.hubBluetooth }}</div>
                </div>
                <div class="line line2 ">
                    <div class="tit">{{$t('work.hubFirmwareNumber')}}:</div>
                    <div class="data">{{ NewDetail.hubSn }}</div>
                    <div class="tit">Hub_SN: </div>
                    <div class="data">{{ NewDetail.hub }}</div>
                </div>
            </div> -->
<template>
    <el-dialog @open="getNewDetail" v-model="dialogVisible" title="详情" center height="600px" width="1108px">
        <div class="titleArea">
            {{$t('work.basicInformation')}}
        </div>
        <div class="tableData">
            <div class="line line3">
                <div class="tit">SN:</div>
                <div class="data data4 " :class="NewDetail.onlineTcp != 0 ? 'circlearea' : ''">{{ NewDetail.sn }}
                    <span v-if="NewDetail.onlineTcp != 0">({{$t('work.online')}}) <span class="circle"></span></span>
                    <span v-else>({{$t('work.offline')}}) <span class="circle2"></span> </span>
                </div>
                <div class="tit">{{$t('work.drivingStatus')}}:</div>
                <!-- 0:未自动驾驶 1：{{$t('work.goOnline')}} 2：{{$t('work.online')}} -->
                <div class="data" v-if="NewDetail.driveState == 0">{{$t('work.notAutonomousDriving')}}</div>
                <div class="data" v-if="NewDetail.driveState == 1">{{$t('work.goOnline')}}</div>
                <div class="data" v-if="NewDetail.driveState == 2">{{$t('work.online')}}</div>
                <div class="tit">{{$t('work.companyName')}}:</div>
                <div class="data">{{ NewDetail.companyName }}</div>
            </div>
            <div class="line line3">
                <div class="tit">{{$t('devicelist.name')}}:</div>
                <div class="data">{{ NewDetail.userName }}</div>
                <div class="tit">{{$t('devicelist.tel')}}:</div>
                <div class="data">{{ NewDetail.tel }}</div>
                <div class="tit">{{$t('work.vehicleManufacturer')}}:</div>
                <div class="data">{{ NewDetail.factory }}</div>
            </div>
            <div class="line line3">
                <div class="tit">{{$t('work.vehicleModel')}}:</div>
                <div class="data">{{ NewDetail.model }}</div>
                <div class="tit">{{$t('work.vehicleAge')}}:</div>
                <div class="data">{{ NewDetail.age }}</div>
                <div class="tit">{{$t('work.sunflowerSN')}}:</div>
                <div class="data">{{ NewDetail.sunFlowerSn }}</div>
            </div>
            <div class="line line3">
                <div class="tit">{{$t('work.creationTime')}}:</div>
                <div class="data">{{ NewDetail.createTime }}</div>
                <div class="tit">{{$t('work.updateTime')}}:</div>
                <div class="data">{{ NewDetail.updateTime }}</div>
                <div class="tit">{{$t('work.lastOnlineTime')}}:</div>
                <div class="data">{{ NewDetail.lastOnlineTime }}</div>
            </div>
        </div>
        <div class="titleArea" v-if="props.terminalType != 'AG302'">
          {{$t('work.moduleInformation')}}

        </div>
        <div class="tableData" v-if="props.terminalType != 'AG302'">
            <div class="line line3">
                <div class="tit">{{$t('work.boardFirmwareNumber')}}:</div>
                <div class="data">{{ NewDetail.board }}</div>
                <div class="tit">{{$t('work.EC20FirmwareNumber')}}:</div>
                <div class="data">{{ NewDetail.ec20 }}</div>
                <div class="tit">{{$t('work.radioFirmwareNumber')}}:</div>
                <div class="data">{{ NewDetail.sunFlowerSn }}</div>
            </div>
            <div class="line line3">
                <div class="tit">{{$t('work.bodyIMUFirmwareNumber')}}:</div>
                <div class="data">{{ NewDetail.carImu }}</div>
                <div class="tit">{{$t('work.bobyIMUSN')}}:</div>
                <div class="data">{{ NewDetail.carImuSn }}</div>
                <div class="tit">{{$t('work.frontWheelIMUFirmwareNumber')}}:</div>
                <div class="data">{{ NewDetail.wheelImu }}</div>
            </div>
            <div class="line line3">
                <div class="tit">{{$t('work.frontSN')}}:</div>
                <div class="data">{{ NewDetail.wheelImuSn }}</div>
                <div class="tit">{{$t('work.motorFirmwareNumber')}}:</div>
                <div class="data">{{ NewDetail.motor }}</div>
                <div class="tit">{{$t('work.MotorSN')}}:</div>
                <div class="data">{{ NewDetail.motorSn }}</div>
            </div>
            <div class="line line4">
                <div class="tit1">{{$t('work.multifunctionSteeringWheelFirmwareNumber')}}:</div>
                <div class="data">{{ NewDetail.steeringWheel }}</div>
                <div class="tit1">{{$t('work.steeringSN')}}:</div>
                <div class="data">{{ NewDetail.steeringWheelSn }}</div>
                <div class="tit1">{{$t('work.hubBluetoothFirmwareNumber')}}:</div>
                <div class="data">{{ NewDetail.hubBluetooth }}</div>
            </div>
            <div class="line line3">
                <div class="tit">{{$t('work.hubFirmwareNumber')}}:</div>
                <div class="data">{{ NewDetail.hub }}</div>
                <div class="tit">Hub_SN:</div>
                <div class="data">{{ NewDetail.hubSn }}</div>
                <div class="tit">{{$t('work.softwareVersion')}}:</div>
                <div class="data">{{ NewDetail.softwareVersion }}</div>
            </div>

        </div>
        <div class="titleArea">
          {{$t('work.expirationTime')}}
        </div>
        <div class="tableData">

            <div class="line line3">
                <div class="tit">{{$t('work.softwareExpiration')}}:</div>
                <div class="data">{{ NewDetail.expirationTime }}</div>
                <div class="tit">{{$t('work.warrantyExpiration')}}:</div>
                <div class="data">{{ NewDetail.warrantyDate }}</div>
                <div class="tit">{{$t('work.nettingExpiration')}}:</div>
                <div class="data">{{ NewDetail.netDate }}</div>

            </div>


            <div class="line line3">
                <div class="tit">{{$t('work.satelliteBaseExpiration')}}:</div>
                <div class="data">{{ NewDetail.satelliteDate }}</div>
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
const props = defineProps(['carId', 'terminalType', "netDate",
    "expirationTime",
    "satelliteDate",
    "warrantyDate"])
const NewDetail = reactive<carNewDetailObj>({
    "id": 0,
    "onlineTcp": 0,
    "driveState": 0,
    "factory": "",
    "age": 0,
    "creatorName": "",
    "creatorTel": "",
    "satelliteDate":"",
    "sunFlowerSn": "",
    "softwareVersion": "",
    "createTime": "",
    "updateTime": "",
    'netDate':"",
    "sn": "",
    "name": "",
    "companyName": "",
    "warrantyDate":'',
    "expirationTime":'',
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
    const res: carNewDetailResponseData = await carNewDetail_API(carId.value,1)
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
    margin-bottom: 10px;

    .line:nth-child(2n-1) {
        // background: rgba(233, 242, 242, 1);
        // color: #606266;
        background-color: var(--el-fill-color-lighter);

        .tit {
            height: 35px;
            width: 130px;
            background-color: rgba(233, 242, 242, 1);
        }
      
    }

    .line {
        .tit {
            display: flex;
            align-items: center;
            padding-left: 10px;
            height: 35px;
            width: 130px;
            font-size: 12px;
            font-weight: 400;
            letter-spacing: 0px;
        }
        .tit1 {
            display: flex;
            align-items: center;
            padding-left: 10px;
            height: 51px;
            width: 130px;
            font-size: 12px;
            font-weight: 400;
            letter-spacing: 0px;
        }
    }
    .line4 {
        width: 100%;
        height: 51px;
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
    .line3 {
        width: 100%;
        height: 40px;
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