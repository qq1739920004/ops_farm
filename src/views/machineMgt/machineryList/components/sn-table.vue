<!--  -->
<template>
  <el-table
    class="date-icon"
    style="max-width: 100%"
    height="calc(100vh - 240px)"
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
      :label="$t('devicelist.owner')"
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
      v-if="!isChangfa && locale == 'zh'"
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

    <el-table-column :label="$t('devicelist.location')" align="center" width="120">
      <template #="{ row }">
        <div style="color: rgba(130, 130, 130, 1)" v-if="row.addrcode !== '-2'">
          {{
            cityCodeList[row.addrcode] ||
            cityCodeList[row.addrcode.substring(0, 4) + "00"] ||
            cityCodeList[row.addrcode.substring(0, 2) + "0000"]
          }}
        </div>
        <div v-else>{{ countryList[row.countryCode] }}</div>
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
      width="120"
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
      width="120"
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
        <div
          v-if="
            row.terminalType === 'AG502' ||
            row.terminalType === 'AG501Pro' ||
            row.terminalType === 'AG501' ||
            row.terminalType === 'AG502_JP' ||
            row.terminalType === 'AG501Pro_JP'
          "
        >
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
        </div>
        <div v-else>--</div>
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
      :label="$t('work.activationTime')"
      prop="activationTime"
      align="center"
      width="180"
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
        {{ row.activationTime || "--" }}
        <!-- </el-tooltip> -->
      </template>
    </el-table-column>
    <el-table-column
      sortable
      :label="$t('devicelist.lastOnlineTime')"
      prop="createtime"
      align="center"
      width="180"
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
    <el-table-column
      :label="$t('devicelist.source')"
      prop="createtime"
      align="center"
      width="60"
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
        {{ row.origin != 1 ? '其他' :'B2B' }}
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
    <el-table-column
      :label="$t('devicelist.operation')"
      :width="locale == 'jp' ? 650 : 475"
    >
      <template #="{ row }">
        <el-button
          v-if="row.origin != 1"
          :disabled="row.onlineTcp === 1 ? false : true"
          v-auth="476"
          :style="
            locale == 'en' ? 'width: 85px' : locale == 'jp' ? 'width:95px' : 'width:65px'
          "
          type="primary"
          text
          @click="gotoRegister(row.id, row.sn, row.deviceId)"
          >{{ $t("devicelist.swRegistration") }}</el-button
        >
        <el-tooltip
          v-if="row.origin == 1"
          :content="getRegisterButtonTip(row)"
          :disabled="!getRegisterButtonTip(row)"
          placement="top"
        >
          <span style="display: inline-block; margin-right: 12px">
            <el-button
              :disabled="!!getRegisterButtonTip(row)"
              :style="
                locale == 'en' ? 'width: 85px' : locale == 'jp' ? 'width:95px' : 'width:65px'
              "
              type="primary"
              text
              @click="gotoRegister2(row.id, row.sn, row.deviceId)"
              >{{ $t("devicelist.getRegistrationCode") }}</el-button
            >
          </span>
        </el-tooltip>
        <el-tooltip
          style="margin-right: 6px"
          :disabled="row.openRemote ? true : false"
          class="box-item"
          effect="dark"
          :content="$t('devicelist.deviceStatys')"
          placement="top-start"
        >
          <el-button
            :style="
              locale == 'en'
                ? 'width: 85px'
                : locale == 'jp'
                ? 'width:95px'
                : 'width:65px'
            "
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
          :style="
            locale == 'en' ? 'width: 75px' : locale == 'jp' ? 'width:75px' : 'width:55px'
          "
          type="primary"
          text
          @click="gotoMap(row.id)"
          >{{ $t("devicelist.historyTrack") }}</el-button
        >
        <el-button
          v-auth="458"
          :style="
            locale == 'en' ? 'width: 40px' : locale == 'jp' ? 'width:85px' : 'width:40px'
          "
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
        <!-- <el-button
          :style="
            locale == 'en' ? 'width: 75px' : locale == 'jp' ? 'width:75px' : 'width:55px'
          "
          text
          type="primary"
          @click="gotoalarm(row.id, row.sn)"
          >{{ $t("menus.alarmView") }}</el-button
        > -->
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
  <RegisterDia2 ref="RegisterD2" :sn="sn" :carId="carId" :deviceId="deviceId"></RegisterDia2>
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
import { terminalTypeList_API } from "@/api/machineryList/index";
import RemoteControl from "@/components/remoteAdjust/index.vue";
import RegisterDia from "./registerDia.vue";
import RegisterDia2 from "./registerDia2.vue";
import { useRouter } from "vue-router";
import { cityCodeList } from "./citycode2";
import { useI18n } from "vue-i18n";
import useUserStore from "@/store/user";
const userStore = useUserStore();
const { locale } = useI18n();
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
const RegisterD2 = ref();
const paramVersionnum = ref<string>("");
const paramType = ref<string>("");
const name = ref<string>("");
const deviceId = ref<string>("");
const isChange = ref(false);
const isLanguage = ref<any>(localStorage.language);

const getRegisterButtonTip = (row: any) => {
  const tips = [];
  console.log(userStore.permissionList,'userStore.permissionList');
  if (row.activationStatus != 1) {
    tips.push(t("statisticsReport.notActived"));
  }
  if (!userStore.permissionList.includes(2849)) {
    tips.push("没有取注册码权限");
  }
  return tips.join('; ');
};
const handleFunctionList = () => {
  let apiArr = [
    { text: t("statisticsReport.notActived"), value: 0 },
    { text: t("statisticsReport.actived"), value: 1 },
  ];
  return apiArr;
};
const terminalList = ref([]);
const getTerminalType = async () => {
  const res = await terminalTypeList_API();
  terminalList.value = res.data.map((item: any) => {
    return {
      text: item,
      value: item,
    };
  });
};
getTerminalType();
const handleTerminalTypeList = () => {
  let apiArr = terminalList.value;
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
// const gotoalarm = (id: any, sn: any) => {
//   router.push({ path: "/machineryList/alarmView", query: { id: id, sn: sn } });
// };
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
    router.push({ path: "monitoring", query: { markerId: sn } });
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
const gotoRegister2 = (val: any, val2: any, val3: any) => {
  carId.value = val;
  sn.value = val2;
  deviceId.value = val3;
  RegisterD2.value.dialogVisible = true;
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
const countryList = ref<any>({
  "0": "China",
  "1070000": "Guam",
  "1090000": "Heard Island and McDonald Islands",
  "1170000": "British Indian Ocean Territory",
  "1250000": "Jersey",
  "1320000": "Kiribati",
  "1470000": "Saint Martin",
  "1540000": "Marshall Islands",
  "1610000": "Northern Mariana Islands",
  "1640000": "Montserrat",
  "1710000": "New Caledonia",
  "1730000": "Norfolk Island",
  "1760000": "Niue",
  "180000": "Aland",
  "1800000": "Nauru",
  "1850000": "Pitcairn Islands",
  "1880000": "Palau",
  "1890000": "Papua New Guinea",
  "20000": "Singapore",
  "20500": "Thailand",
  "2060000": "South Georgia and the South Sandwich Islands",
  "2080000": "Svalbard and Jan Mayen",
  "2090000": "Solomon Islands",
  "2250000": "Turks and Caicos Islands",
  "2300000": "Tokelau",
  "2330000": "Tonga",
  "2370000": "Tuvalu",
  "240000": "American Samoa",
  "2510000": "Vanuatu",
  "2520000": "Wallis and Futuna",
  "2530000": "Samoa",
  "26000": "Japan",
  "260000": "French Southern Territories",
  "2700000": "Sint Maarten",
  "30000": "South Korea",
  "31000": "Australia",
  "31020": "Brunei",
  "31030": "Indonesia",
  "31080": "India",
  "31130": "Sri Lanka",
  "31180": "Maldives",
  "31190": "Malaysia",
  "31220": "Nepal",
  "31230": "New Zealand",
  "31260": "Philippines",
  "32370": "Vietnam",
  "340000": "Bonaire, Sint Eustatius and Saba",
  "390000": "Bahamas",
  "39509": "Ecuador",
  "39584": "Suriname",
  "39644": "Uruguay",
  "39797": "Brazil",
  "39874": "Argentina",
  "39949": "Venezuela",
  "40024": "French Guiana",
  "40177": "Saint Barthelemy",
  "40228": "Chile",
  "40382": "Colombia",
  "40465": "Peru",
  "40540": "Guyana",
  "40717": "Bolivia",
  "40879": "Paraguay",
  "42409": "St Helena, Ascension, and T. Cunha",
  "44504": "Gaza Strip",
  "46609": "Czech Republic",
  "46751": "Slovakia",
  "46873": "Greece",
  "46974": "Hungary",
  "47200": "Poland",
  "47765": "Latvia",
  "47934": "Estonia",
  "47999": "Croatia",
  "48180": "Bulgaria",
  "48258": "Romania",
  "48509": "Turkey",
  "49182": "Ukraine",
  "49454": "Albania",
  "49596": "Cyprus UN Neutral Zone",
  "49841": "France",
  "49987": "Italy",
  "500000": "Bouvet Island",
  "50147": "Austria",
  "50292": "Belgium",
  "50353": "Luxembourg",
  "50415": "Vatican",
  "50466": "Switzerland",
  "50664": "Germany",
  "51168": "Monaco",
  "51270": "Spain",
  "51372": "Finland",
  "51441": "England",
  "51603": "Scotland",
  "51685": "Wales",
  "51757": "Sweden",
  "51820": "Greenland",
  "51828": "Denmark",
  "51933": "Portugal",
  "52012": "Ireland",
  "52088": "Northern Ireland",
  "52164": "Norway",
  "52233": "Isle of Man",
  "52386": "Netherlands",
  "52448": "Iceland",
  "52709": "British Sovereign Base Areas",
  "52762": "Turkish Republic of Northern Cyprus",
  "54000": "Curasao",
  "540000": "Cocos Islands",
  "54001": "Antigua and Barbuda",
  "54002": "Honduras",
  "54003": "United States",
  "54004": "Dominican Republic",
  "54005": "Dominica",
  "54006": "El Salvador",
  "54007": "Martinique",
  "54008": "Guatemala",
  "54009": "British Virgin Islands",
  "54010": "Saint Kitts and Nevis",
  "54012": "Grenada",
  "54013": "Jamaica",
  "54014": "Saint Vincent and the Grenadines",
  "54015": "Canada",
  "54016": "Aruba",
  "54017": "Guadeloupe",
  "54019": "Costa Rica",
  "54020": "Anguilla",
  "54021": "Panama",
  "54024": "Bermuda",
  "54025": "Mexico",
  "54026": "United States Minor Outlying Islands",
  "54027": "Belize",
  "54028": "Puerto Rico",
  "54029": "Haiti",
  "54030": "Palestina",
  "54031": "Virgin Islands",
  "54032": "Nicaragua",
  "54033": "Trinidad and Tobago",
  "54034": "Saint Pierre and Miquelon",
  "54035": "Saint Lucia",
  "54037": "Barbados",
  "54038": "Cayman Islands",
  "54039": "Cuba",
  "610000": "Cook Islands",
  "65533": "Mauritius",
  "680000": "Christmas Island",
  "70001": "Bhutan",
  "70002": "Andorra",
  "70003": "Gibraltar",
  "70004": "Liechtenstein",
  "70005": "San Marino",
  "70006": "Malta",
  "70007": "French Polynesia",
  "70008": "Fiji",
  "70009": "East Timor",
  "70010": "North Korea",
  "70011": "Cambodia",
  "70012": "Laos",
  "70013": "Bangladesh",
  "70014": "Myanmar",
  "70015": "Mongolia",
  "70016": "Slovenia",
  "70017": "Lithuania",
  "70018": "Bosnia and Herzegovina",
  "70019": "Moldova",
  "70020": "Montenegro",
  "70021": "Armenia",
  "70022": "Kyrgyzstan",
  "70023": "Kazakhstan",
  "70024": "Azerbaijan",
  "70025": "Tajikistan",
  "70026": "Uzbekistan",
  "70027": "Turkmenistan",
  "70028": "Georgia",
  "70029": "Macedonia",
  "70030": "Kosovo",
  "70031": "Serbia",
  "70032": "Cyprus",
  "70033": "Belarus",
  "70034": "Russia",
  "70035": "Pakistan",
  "70036": "Botswana",
  "70037": "Lesotho",
  "70038": "Swaziland",
  "70039": "Malawi",
  "70040": "Burundi",
  "70041": "Uganda",
  "70042": "South Sudan",
  "70043": "Rwanda",
  "70044": "Zimbabwe",
  "70045": "Niger",
  "70046": "Mali",
  "70047": "Burkina Faso",
  "70048": "Chad",
  "70049": "Ethiopia",
  "70050": "Central African Republic",
  "70051": "Zambia",
  "70052": "Morocco",
  "70053": "Algeria",
  "70054": "Western Sahara",
  "70055": "Mauritania",
  "70056": "Libya",
  "70057": "Cabo Verde",
  "70058": "Gambia",
  "70059": "Senegal",
  "70060": "Guinea-Bissau",
  "70061": "Guinea",
  "70062": "Jordan",
  "70063": "Israel",
  "70064": "Lebanon",
  "70065": "Syria",
  "70066": "Iraq",
  "70067": "Bahrain",
  "70068": "Qatar",
  "70069": "Afghanistan",
  "70070": "Kuwait",
  "70071": "Iran",
  "70072": "Sierra Leone",
  "70073": "Liberia",
  "70074": "CtedIvoire",
  "70075": "Ghana",
  "70076": "Togo",
  "70077": "Benin",
  "70078": "Nigeria",
  "70079": "Sao Tome and Principe",
  "70080": "Cameroon",
  "70081": "Democratic Republic of the Congo",
  "70082": "Angola",
  "70083": "Equatorial Guinea",
  "70084": "Gabon",
  "70085": "Republic of the Congo",
  "70086": "Namibia",
  "70087": "South Africa",
  "70088": "Mozambique",
  "70089": "Reunion",
  "70091": "Madagascar",
  "70092": "Comoros",
  "70093": "Mayotte",
  "70094": "Seychelles",
  "70095": "Tanzania",
  "70096": "Kenya",
  "70097": "Somalia",
  "70098": "Yemen",
  "70099": "Oman",
  "70100": "United Arab Emirates",
  "70101": "Saudi Arabia",
  "70102": "Egypt",
  "70103": "Djibouti",
  "70104": "Eritrea",
  "70105": "Sudan",
  "70106": "Tunisia",
  "870000": "Falkland Islands",
  "890000": "Faroe Islands",
  "900000": "Micronesia",
  "940000": "Guernsey",
});
// 历史轨迹
const gotoMap = (id: string) => {
  router.push({ path: "machineryList/taskMachine", query: { carId: id } });
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
