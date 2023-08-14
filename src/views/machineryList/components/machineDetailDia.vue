<!--  -->
<template>
    <div>
        <el-dialog style="border-radius: 8px;" @open="getNewDetail" v-model="dialogVisible" title="详情" width="893px"
            height="392px">
            <div class="tableData">
                <div class="line line1">
                    <div>SN:</div>
                    <div class="data">{{ NewDetail.sn }}</div>
                    <div>在线装填:</div>
                    <div v-if="NewDetail.onlineTcp != 0" class="data ">在线 <span class="circle"></span></div>
                    <div v-else class="data">离线 <span class="circle2"></span></div>
                    <div>驾驶状态:</div>
                    <div class="data">{{ NewDetail.driveState }}</div>
                </div>
                <div class="line line3">
                    <div>公司名称:</div>
                    <div class="half">{{ NewDetail.companyName }}</div>
                    <div>车主姓名:</div>
                    <div class="data">{{ NewDetail.userName }}</div>
                </div>
                <div class="line line1 ">
                    <div>在线装填:</div>
                    <div class="data">{{ NewDetail.driveState }}</div>
                    <div>车辆名称:</div>
                    <div class="data">{{ NewDetail.name }}</div>
                    <div>车辆厂家:</div>
                    <div class="data">{{ NewDetail.factory }}</div>
                </div>
                <div class="line line1">
                    <div>车辆型号:</div>
                    <div class="data">{{ NewDetail.model }}</div>
                    <div>车龄:</div>
                    <div class="data">{{ NewDetail.age }}</div>
                    <div>创始人:</div>
                    <div class="data">{{ NewDetail.creatorName }}</div>
                </div>
                <div class="line line1 ">
                    <div>创建人电话:</div>
                    <div class="data">{{ NewDetail.tel }}</div>
                    <div>向日葵SN:</div>
                    <div class="data">{{ NewDetail.sunFlowerSn }}</div>
                    <div>软件版本:</div>
                    <div class="data">{{ NewDetail.softwareVersion }}</div>
                </div>
                <div class="line line2 ">
                    <div class="tit">创建时间:</div>
                    <div class="data">{{ NewDetail.createTime?.split(' ')[0] }}</div>
                    <div class="tit">更新时间: </div>
                    <div class="data">{{ NewDetail.updateTime?.split(' ')[0] }}</div>
                </div>
                <div class="line line2 ">
                    <div class="tit">最近上线时间:</div>
                    <div class="data">{{ NewDetail.lastOnlineTime?.split(' ')[0] }}</div>
                    <div class="tit">最近自动驾驶时间: </div>
                    <div class="data">{{ NewDetail.lastAutoDriveTime?.split(' ')[0] }}</div>
                </div>
            </div>
        </el-dialog>
    </div>
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
const props = defineProps(['carId'])
const NewDetail = reactive<carNewDetailObj>({
    "id": 0,
    "npn": "",
    "sn": "",
    "name": "",
    "userName": "",
    "model": "",
    "province": "",
    "terminalType": "",
    "expirationTime": "",
    "warrantyDate": "",
    "satelliteDate": "",
    "netDate": "",
    "lastOnlineTime": "",
    "companyName": "",
    "satelliteStatus": 0,
    "codePower": false,
    "isTransfer": false,
    "version": 0,
    "type": 0,
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
    "lastAutoDriveTime": "",
    "tel": ""
})


const getNewDetail = async () => {
    carId.value = props.carId
    const res: carNewDetailResponseData = await carNewDetail_API(carId.value)
    Object.assign(NewDetail, res.data)

}

</script>

<style lang="scss" scoped>
.tableData {

    .line:nth-child(2n-1) {
        background: rgba(233, 242, 242, 1);
    }

    .line1 {
        width: 100%;
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

            .circle {
                width: 10px;
                height: 10px;
                background-color: rgba(76, 176, 79, 1);
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
        }
    }

    .line2 {
        width: 100%;
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
        width: 100%;
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