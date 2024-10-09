<!--  -->
<template>
  <el-table
    class="date-icon"
    style="max-width: 100%"
    @sort-change="changesort"
    :data="props.carNewList"
    stripe
    @filter-change="filterChange"
  >
    <el-table-column
      type="index"
      :label="$t('devicelist.item')"
      width="60"
      align="center"
    />
    <el-table-column
      v-if="!isChangfa"
      :label="$t('devicelist.name')"
      prop="userName"
      align="center"
    >
    </el-table-column>
    <el-table-column
      v-if="!isChangfa"
      :label="$t('devicelist.tel')"
      prop="tel"
      width="110"
      align="center"
    >
    </el-table-column>
    <el-table-column
      v-if="!isChangfa"
      prop="npn"
      :label="$t('devicelist.labelSN')"
      width="180"
      align="center"
    >
      <template #default="scope">
        {{ scope.row.npn }}
      </template>
    </el-table-column>
    <el-table-column label="SN" prop="sn" align="center" width="180"
      ><template #default="scope">
        <div
          :class="scope.row.onlineTcp === 1 ? 'sn_area1' : 'sn_area2'"
          @click="gotoMonitor(scope.row.sn, scope.row.onlineTcp)"
        >
          <el-icon>
            <MapLocation
              :style="
                scope.row.onlineTcp === 1
                  ? 'color:var(--el-color-primary); width: 16px;height: 16px;'
                  : 'color:var(--el-color-info-light-5); width: 16px; height: 16px;'
              "
            />
          </el-icon>
          <span style="margin-left: 10px">{{ scope.row.sn }}</span>
        </div>
      </template>
    </el-table-column>

    <el-table-column  :label="$t('devicelist.location')" align="center">
      <template #="{ row }">
        <div style="color: rgba(130, 130, 130, 1)">
          {{
            cityCodeList[row.addrcode] ||
            cityCodeList[row.addrcode.substring(0, 4) + "00"] ||
            cityCodeList[row.addrcode.substring(0, 2) + "0000"]
          }}
        </div>
      </template>
    </el-table-column>
    <el-table-column
       v-if="isChangfa"
      :label="$t('devicelist.type')"
      prop="terminalType"
      align="center"
    >
    </el-table-column>
    <el-table-column
       v-if="!isChangfa"
      :filters="handleTerminalTypeList()"
      column-key="filterTerminalType"
      :filter-multiple="false"
      :label="$t('devicelist.type')"
      prop="terminalType"
      align="center"
    >
    </el-table-column>
    <el-table-column
      v-if="!isChangfa"
      :label="t('statisticsReport.activationStatus')"
      align="center"
      :filters="handleFunctionList()"
      prop="activationStatus"
      column-key="filterfunction"
      :filter-multiple="false"
    >
      <template #="{ row }">
        <!-- v-if="row.expirationTime && Date.parse(row.expirationTime.toString()) > Date.parse(new Date().toString())"> -->
        <!-- <div style="display: flex; justify-content: center">
          <el-tag
            v-if="
              row.expirationTime &&
              Date.parse(row.expirationTime.toString()) >
                Date.parse(new Date().toString())
            "
            style="
              color: rgba(42, 130, 228, 1);
              width: 80px;
              height: 26px;
              opacity: 1;
              border-radius: 4px;
              background: rgba(171, 210, 255, 1);
              border: 1px solid rgba(171, 210, 255, 1);
            "
          >
            {{ row.expirationTime.split(" ")[0] }}</el-tag
          >
          <el-tag
            v-else
            style="
              color: rgba(255, 112, 112, 1);
              width: 60px;
              height: 26px;
              opacity: 1;
              border-radius: 4px;
              background: rgba(255, 212, 212, 1);
              border: 1px solid rgba(255, 212, 212, 1);
            "
            class="mx-1"
            type="danger"
            effect="dark"
            >已过期</el-tag
          >
        </div> -->
        <div style="display: flex; justify-content: center">
          <el-tag
            v-if="row.activationStatus == 1"
            style="
              color: rgba(42, 130, 228, 1);
              width: 80px;
              height: 26px;
              opacity: 1;
              border-radius: 4px;
              background: rgba(171, 210, 255, 1);
              border: 1px solid rgba(171, 210, 255, 1);
            "
          >
            {{ t("statisticsReport.actived") }}</el-tag
          >
          <div v-else>{{ t("statisticsReport.notActived") }}</div>
        </div>
      </template>
    </el-table-column>
    
    <!-- <el-table-column label="过期时间" >
            <template #="{ row }">
                <el-popover placement="right" :width="200" trigger="hover" style="">
                    <template #reference>
                        <el-button type="primary"
                            style="width: 52px;height: 26px;opacity: 1;font-size: 14px;text-align: left;vertical-align: top;">查看</el-button>
                    </template>
                    <el-row :gutter="16"
                        style="margin-bottom: 4px ;font-size: 12px;font-weight: 400;letter-spacing: 0px;line-height: 17.38px;color: rgba(202, 204, 207, 1);">
                        <el-col :span="7" :offset="2">
                            类型
                        </el-col>
                        <el-col :span="15">
                            过期时间
                        </el-col>
                    </el-row>
                    <el-row :gutter="16"
                        style="margin-bottom: 4px ;font-size: 12px;font-weight: 400;letter-spacing: 0px;line-height: 17.38px;">
                        <el-col :span="7" :offset="2">
                            罗网
                        </el-col>
                        <el-col :span="15">
                            {{ row.netDate?.split(' ')[0] }}
                        </el-col>
                    </el-row>
                    <el-row :gutter="16"
                        style="margin-bottom: 4px ;font-size: 12px;font-weight: 400;letter-spacing: 0px;line-height: 17.38px;">
                        <el-col :span="7" :offset="2">
                            软件
                        </el-col>
                        <el-col :span="15">
                            {{ row.expirationTime?.split(' ')[0] }}
                        </el-col>
                    </el-row>
                    <el-row :gutter="16"
                        style="margin-bottom: 4px ;font-size: 12px;font-weight: 400;letter-spacing: 0px;line-height: 17.38px;">
                        <el-col :span="7" :offset="2">
                            星基
                        </el-col>
                        <el-col :span="15">
                            {{ row.satelliteDate?.split(' ')[0] }}
                        </el-col>
                    </el-row>
                    <el-row :gutter="16"
                        style="margin-bottom: 4px ;font-size: 12px;font-weight: 400;letter-spacing: 0px;line-height: 17.38px;">
                        <el-col :span="7" :offset="2">
                            质保
                        </el-col>
                        <el-col :span="15">
                            {{ row.warrantyDate?.split(' ')[0] }}
                        </el-col>
                    </el-row>
                </el-popover>
            </template>
        </el-table-column> -->
    <el-table-column
      sortable
      :label="$t('devicelist.lastOnlineTime')"
      prop="createtime"
      align="center"
      width="160"
    >
      <template #="{ row }">
        <!-- <el-tooltip
          style="margin-right: 6px"
          :disabled="false"
          class="box-item"
          effect="dark"
          :content="row.lastOnlineTime"
          placement="top-start"
        > -->
        {{ row.lastOnlineTime }}
        <!-- </el-tooltip> -->
      </template>
    </el-table-column>
    <!-- <el-table-column label="公司/经销商" >
            <template #="{ row }">
                {{ row.companyName || '/' }}
            </template>
        </el-table-column> -->
    <!-- <el-table-column label="星基" >
            <template #="{ row }">
              
                <el-switch v-auth='473' v-model="row.satelliteStatus" :before-change="beforeSwitchChange" @change="changeCarStatus(row)"
                    :active-value="1" :inactive-value="0" class="ml-2" inline-prompt active-text="开" inactive-text="关" />
            </template>
        </el-table-column> -->
    <!-- <el-table-column label="数据存储" >
            <template #="{ row }">
                <el-switch v-auth='474' :before-change="beforeSwitchChange"
                    @change="changeLogStatus(row.sn, row.isTransfer)" v-model="row.isTransfer" class="ml-2" inline-prompt
                    active-text="开" inactive-text="关" />
            </template>
        </el-table-column> -->
    <!-- 说明  离线和自动驾驶状态不可编辑 -->
    <el-table-column :label="$t('devicelist.operation')" width="475" align="center">
      <template #="{ row }">
        <el-button
          :disabled="row.onlineTcp === 1 ? false : true"
          v-auth="476"
          :style="isLanguage == 'en' ? 'width: 85px' : 'width:65px'"
          type="primary"
          text
          @click="gotoRegister(row.id, row.sn, row.deviceId)"
          >{{ $t("devicelist.swRegistration") }}</el-button
        >
        <el-tooltip
          style="margin-right: 6px"
          :disabled="row.openRemote ? true : false"
          class="box-item"
          effect="dark"
          :content="$t('devicelist.deviceStatys')"
          placement="top-start"
        >
          <el-button
            :style="isLanguage == 'en' ? 'width: 85px' : 'width:65px'"
            :disabled="!row.openRemote"
            type="primary"
            text
            @click="
              gotoRemote(
                row.terminalType,
                row.paramVersionnum,
                row.paramType,
                row.id,
                row.sn,
                row.name
              )
            "
            >{{ $t("devicelist.remoteMgt") }}</el-button
          >
        </el-tooltip>
        <!-- <el-button v-auth="531" style="width: 62px;margin-right: 6px;" type="primary" text
                    @click="toFileList(row)">文件存储</el-button> -->

        <el-button
          v-auth="503"
          :style="isLanguage == 'en' ? 'width: 75px' : 'width:55px'"
          type="primary"
          text
          @click="gotoMap(row.id)"
          >{{ $t("devicelist.historyTrack") }}</el-button
        >
        <el-button
          v-auth="458"
          :style="isLanguage == 'en' ? 'width: 40px' : 'width:40px'"
          type="primary"
          text
          @click="
            gotoMachineDetail(
              row.id,
              row.terminalType,
              row.netDate?.split(' ')[0],
              row.expirationTime?.split(' ')[0],
              row.satelliteDate?.split(' ')[0],
              row.warrantyDate?.split(' ')[0]
            )
          "
          >{{ $t("devicelist.details") }}</el-button
        >
        <el-button
          :style="isLanguage == 'en' ? 'width: 75px' : 'width:55px'"
          text
          type="primary"
          @click="gotoalarm(row.id, row.sn)"
          >{{ $t("menus.alarmView") }}</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <slot></slot>
  <MachineDetailDia
    ref="MachineD"
    :carId="carId"
    :terminalType="terminalType2"
    :netDate="netDate"
    :expirationTime="expirationTime"
    :satelliteDate="satelliteDate"
    :warrantyDate="warrantyDate"
  ></MachineDetailDia>
  <MachineDetail501Dia
    ref="Machine501D"
    :carId="carId"
    :terminalType="terminalType2"
    :netDate="netDate"
    :expirationTime="expirationTime"
    :satelliteDate="satelliteDate"
    :warrantyDate="warrantyDate"
  ></MachineDetail501Dia>
  <RemoteControl
    :isChange="isChange"
    :terminalType="terminalType"
    :paramVersionnum="paramVersionnum"
    :paramType="paramType"
    :carId="carId"
    :sn="sn"
    :name="name"
  />
  <RegisterDia ref="RegisterD" :sn="sn" :carId="carId" :deviceId="deviceId"></RegisterDia>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
// import { ElMessage } from 'element-plus'
// import { carStatus_API, logOpen_API } from '@/api/machineryList/index'
// import { logOpen_API } from '@/api/machineryList/index'
// import { pageInfo, carStatusObj } from '@/api/machineryList/type'
import { pageInfo } from "@/api/machineryList/type";
import MachineDetailDia from "./machineDetailDia.vue";
import MachineDetail501Dia from "./machineDetail501Dia.vue";
import RemoteControl from "@/components/remoteAdjust/index.vue";
import RegisterDia from "./registerDia.vue";
import { useRouter } from "vue-router";
import { cityCodeList } from "./citycode2";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const router = useRouter();
const props = defineProps(["carNewList"]);

const emits = defineEmits(["changeSort", "datachange", "typechange"]);
// const switchStatus = ref<boolean>(false)
const sn = ref();
const MachineD = ref();
const Machine501D = ref();
const netDate = ref<string>("");
const expirationTime = ref<string>("");
const satelliteDate = ref<string>("");
const warrantyDate = ref<string>("");
const RegisterD = ref();
const paramVersionnum = ref<string>("");
const paramType = ref<string>("");
const name = ref<string>("");
const deviceId = ref<string>("");
const isChange = ref(false);
const isLanguage = ref<any>(localStorage.language);
const handleFunctionList = () => {
  let apiArr = [
    { text: t("statisticsReport.notActived"), value: 0 },
    { text: t("statisticsReport.actived"), value: 1 },
  ];
  return apiArr;
};
const handleTerminalTypeList = () => {
  let apiArr = [
    { text: "AG360", value: "AG360" },
    { text: "AG502", value: "AG502" },
    { text: "AG501", value: "AG501" },
    { text: "AG302Android", value: "AG302Android" },
    { text: "AG302", value: "AG302" },
    { text: "AG501Pro", value: "AG501Pro" },
  ];
  return apiArr;
};
// 车辆ID
const carId = ref<number>();
const terminalType = ref<string>("");
const terminalType2 = ref<string>("");
// 星基请求参数
// const carStatus = ref<carStatusObj>({
//     'ids': [],
//     'commandType': 0,
//     'commandStatus': 0
// })
const pageInfo = reactive<any>({
  order: "1",
});
const isChangfa = import.meta.env.MODE === "changFa";
const gotoalarm = (id: any, sn: any) => {
  router.push({ path: "/machineryList/alarmView", query: { id: id, sn: sn } });
};
const changesort = (val: any) => {
  switch (val.order) {
    case "ascending":
      pageInfo.order = "2";
      break;
    case "descending":
      pageInfo.order = "1";
      break;
    case null:
      pageInfo.order = "1";
      break;
  }
  emits("changeSort", pageInfo.order);
};
// 取消首次触发change钩子
// const beforeSwitchChange = () => {
//     switchStatus.value = true;
//     return switchStatus.value;
// }
// const changeCarStatus = async (val: any) => {
//     if (switchStatus.value == true) {
//         carStatus.value.ids.push(val.id)
//         carStatus.value.commandType = 11
//         carStatus.value.commandStatus = val.satelliteStatus
//         try {
//             await carStatus_API(carStatus.value)
//             ElMessage({ type: 'success', message: '修改成功', duration: 1000 })
//         }
//         catch {
//             ElMessage({ type: 'error', message: '修改失败', duration: 1000 })
//         }
//         carStatus.value.ids = []
//     }

// }
// 文件存储
// const toFileList = (row: any) => {
//     router.push({
//         path: 'machineryList/file', query: {
//             pid: row.type == 4 ? 9004 : "",
//             sn: row.sn,
//         }
//     })
// }
// 更改日志上传状态
// const changeLogStatus = async (val: string, val2: string) => {
//     if (switchStatus) {
//         console.log(val, val2);
//         try {
//             await logOpen_API({ 'sn': val, 'flag': val2 })
//             ElMessage({ type: 'success', message: '修改成功', duration: 1000 })
//         }
//         catch {
//             ElMessage({ type: 'error', message: '修改失败', duration: 1000 })
//         }
//     }
// }
// 跳转 monitor
const gotoMonitor = (sn: any, onlineTcp: any) => {
  if (onlineTcp === 1) {
    router.push({ path: "/monitoring", query: { markerId: sn } });
  } else {
  }
};
const gotoMachineDetail = (
  val: any,
  val2: any,
  val7: any,
  val8: any,
  val9: any,
  val10: any
) => {
  carId.value = val;
  terminalType2.value = val2;

  netDate.value = val7;
  expirationTime.value = val8;
  satelliteDate.value = val9;
  warrantyDate.value = val10;
  if (val2 === "AG501Pro") {
    Machine501D.value.dialogVisible = true;
  } else {
    MachineD.value.dialogVisible = true;
  }
};
const gotoRegister = (val: any, val2: any, val3: any) => {
  carId.value = val;
  sn.value = val2;
  deviceId.value = val3;
  RegisterD.value.dialogVisible = true;
};
const gotoRemote = (val: any, val2: any, val3: any, val4: any, val5: any, val6: any) => {
  terminalType.value = val;
  paramVersionnum.value = val2;
  paramType.value = val3;
  carId.value = val4;
  sn.value = val5;
  name.value = val6;
  isChange.value = !isChange.value;
};
// 历史轨迹
const gotoMap = (id: string) => {
  router.push({ path: "/machineryList/taskMachine", query: { carId: id } });
};

const filterChange = (filterObj: any) => {
  let activeValue;
  let terValue;
  if (filterObj.filterfunction) {
    filterObj.filterfunction[0] === undefined
      ? (activeValue = "")
      : (activeValue = filterObj.filterfunction[0]);
    emits("datachange", {
      activationStatus: activeValue,
    });
  }
  if (filterObj.filterTerminalType) {
    terValue = filterObj.filterTerminalType[0];
    emits("typechange", {
      terminalType: terValue,
    });
  }
};
</script>

<style lang="scss">
.sn_area1 {
  display: flex;
  align-items: center;
}

.sn_area2 {
  display: flex;
  align-items: center;
  // color: var(--el-color-info-light-5)
}

.sn_area1:hover {
  cursor: pointer;
}
@font-face {
  font-family: "iconfont";
  /* Project id 4170432 */
  src: url("//at.alicdn.com/t/c/font_4170432_7yaivfndq74.woff2?t=1712801132666")
      format("woff2"),
    url("//at.alicdn.com/t/c/font_4170432_7yaivfndq74.woff?t=1712801132666")
      format("woff"),
    url("//at.alicdn.com/t/c/font_4170432_7yaivfndq74.ttf?t=1712801132666")
      format("truetype");
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-filter1:before {
  content: "\e73b";
}

.icon-filter:before {
  content: "\e62e";
}

.icon-yanziwancheng:before {
  content: "\e61e";
}

.icon-guanbi:before {
  content: "\e61f";
}

.el-table__column-filter-trigger {
  //由于我需要的icon不是element-ui中的，因此需要替换
  //如果你需要的icon在element-ui中就不需要这行
  .el-icon {
    font-family: "jg-iconfont" !important;
    font-size: 13px; //通过保持和标题的字体大小一致来实现居中
    transform: scale(1); //通过scale来实现icon的放大和缩小
  }

  .el-icon:before {
    margin-left: 10px;
    font-family: "iconfont" !important;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 12px;
    font-style: normal;
    content: "\e73b"; //要替换的图标
  }
}
</style>
