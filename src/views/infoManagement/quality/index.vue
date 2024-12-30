<template>
  <div class="app_container">
    <div class="table_container app_card">
      <div class="search_container">
        <div class="input_area">
          <el-input
            :placeholder="$t('work.plzSN')"
            v-model="pageInfo.key"
            class="input-with-select"
            @keyup.enter.native="search"
            clearable
            @clear="search"
          >
            <template #append>
              <el-button icon="Search" @click="search" />
            </template>
          </el-input>
          <div class="kind">{{ $t("work.deviceType") }}：</div>
          <el-select
            v-model="pageInfo.terminalType"
            class="m-2"
            :placeholder="$t('work.deviceType')"
            @change="changeBlur"
          >
            <el-option value="AG360" label="AG360" />
            <el-option value="AG502" label="AG502" />
            <el-option value="AG501" label="AG501" />
            <el-option value="AG502_JP" label="AG502JP" />
          </el-select>
        </div>
        <div>
          <el-button type="primary" @click="openExportDia">
            <el-icon class="el-icon--left">
              <SvgIcon icon="export" size="16" /> </el-icon
            >{{ $t("work.export") }}</el-button
          >
          <el-button v-auth="448" type="primary" icon="Plus" @click="openDialog">{{
            $t("work.new")
          }}</el-button>
        </div>
      </div>
      <el-table
        @selection-change="handleSelectionChange"
        :data="records"
        v-show="scence == '1' || scence == '4'"
        stripe
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          type="index"
          width="80"
          :label="$t('work.item')"
          align="center"
        />
        <el-table-column :label="$t('work.labelSN')" align="center">
          <template #="{ row }">
            {{ row.npn || "/" }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('work.guarantee')" align="center">
          <template #="{ row }">
            <div
              v-if="
                row.warrantyDate &&
                Date.parse(row.warrantyDate.toString()) >
                  Date.parse(new Date().toString())
              "
            >
              {{ row.warrantyDate.split(" ")[0] }}
            </div>
            <div v-if="!row.warrantyDate">
              <el-tag
                style="
                  color: rgba(255, 112, 112, 1);
                  width: 78px;
                  height: 26px;
                  opacity: 1;
                  border-radius: 4px;
                  background: rgba(255, 212, 212, 1);
                  border: 1px solid rgba(255, 212, 212, 1);
                "
                class="mx-1"
                type="danger"
                effect="dark"
                >{{ $t("work.noactive") }}</el-tag
              >
            </div>
            <div
              v-if="
                row.warrantyDate &&
                Date.parse(row.warrantyDate.toString()) <=
                  Date.parse(new Date().toString())
              "
            >
              <el-tag
                style="
                  color: rgba(42, 130, 228, 1);
                  width: 78px;
                  height: 26px;
                  opacity: 1;
                  border-radius: 4px;
                  background: rgba(171, 210, 255, 1);
                  border: 1px solid rgba(171, 210, 255, 1);
                "
                class="mx-1"
                effect="dark"
                >{{ $t("work.due") }}</el-tag
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('work.gnssPoleSN')" align="center">
          <template #="{ row }">
            {{ row.sn || "/" }}
          </template>
        </el-table-column>
        <el-table-column label="HUB SN" align="center">
          <template #="{ row }">
            {{ row.hubSn || "/" }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('work.motorSN')" align="center">
          <template #="{ row }">
            {{ row.motorSn || "/" }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('work.steeringSN')" align="center">
          <template #="{ row }">
            {{ row.steeringWheelSn || "/" }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('work.bobyIMUSN')" align="center">
          <template #="{ row }">
            {{ row.carImuSn || "/" }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('work.frontSN')" align="center">
          <template #="{ row }">
            {{ row.wheelImuSn || "/" }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('work.operation')" align="center" width="200">
          <template #="{ row }">
            <div class="edit-btn">
              <el-button
                v-auth="446"
                type="primary"
                link
                @click="edit(row)"
                :disabled="row.warrantyDate ? true : false"
                >{{ $t("work.edit") }}
              </el-button>
              <!-- <el-button v-auth="445" @click="removeTradeMark(row.id)" type="danger" link>{{$t('work.delete')}}</el-button> -->
              <el-button
                v-auth="505"
                class="aftersale_btn"
                type="primary"
                link
                @click="gotoAfterSale(row)"
                >{{ $t("work.afterSale") }}</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        @selection-change="handleSelectionChange"
        :data="records"
        v-show="scence == '2'"
        stripe
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          type="index"
          width="80"
          :label="$t('work.item') + ':'"
          align="center"
        />
        <el-table-column :label="$t('work.labelSN')" align="center">
          <template #="{ row }">
            {{ row.npn || "/" }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('work.guarantee')" align="center">
          <template #="{ row }">
            <div
              v-if="
                row.warrantyDate &&
                Date.parse(row.warrantyDate.toString()) >
                  Date.parse(new Date().toString())
              "
            >
              {{ row.warrantyDate.split(" ")[0] }}
            </div>
            <div v-if="!row.warrantyDate">
              <el-tag
                style="
                  color: rgba(255, 112, 112, 1);
                  width: 68px;
                  height: 26px;
                  opacity: 1;
                  border-radius: 4px;
                  background: rgba(255, 212, 212, 1);
                  border: 1px solid rgba(255, 212, 212, 1);
                "
                class="mx-1"
                type="danger"
                effect="dark"
                >{{ $t("work.noactive") }}</el-tag
              >
            </div>
            <div
              v-if="
                row.warrantyDate &&
                Date.parse(row.warrantyDate.toString()) <=
                  Date.parse(new Date().toString())
              "
            >
              <el-tag
                style="
                  color: rgba(42, 130, 228, 1);
                  width: 68px;
                  height: 26px;
                  opacity: 1;
                  border-radius: 4px;
                  background: rgba(171, 210, 255, 1);
                  border: 1px solid rgba(171, 210, 255, 1);
                "
                class="mx-1"
                effect="dark"
                >{{ $t("work.due") }}</el-tag
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('work.PlateSN')" align="center">
          <template #="{ row }">
            {{ row.sn || "/" }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('work.MotorSN')" align="center">
          <template #="{ row }">
            {{ row.motorSn || "/" }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('work.BodySN')" align="center">
          <template #="{ row }">
            {{ row.carImuSn || "/" }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('work.Antenna1_SN')" align="center">
          <template #="{ row }">
            {{ row.antennaOne || "/" }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('work.Antenna2_SN')" align="center">
          <template #="{ row }">
            {{ row.antennaTwo || "/" }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('work.operation')" align="center" width="200">
          <template #="{ row }">
            <div class="edit-btn">
              <el-button
                v-auth="446"
                type="primary"
                link
                @click="edit(row)"
                :disabled="row.warrantyDate ? true : false"
                >{{ $t("work.edit") }}
              </el-button>
              <!-- <el-button v-auth="445" @click="removeTradeMark(row.id)" type="danger" link>{{$t('work.delete')}}</el-button> -->
              <el-button
                v-auth="505"
                class="aftersale_btn"
                type="primary"
                link
                @click="gotoAfterSale(row)"
                >{{ $t("work.afterSale") }}</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        @selection-change="handleSelectionChange"
        :data="records"
        v-show="scence == '3'"
        stripe
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          type="index"
          width="80"
          :label="$t('work.item')"
          align="center"
        />
        <el-table-column :label="$t('work.labelSN')" width="200" align="center">
          <template #="{ row }">
            {{ row.npn || "/" }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('work.guarantee')" align="center">
          <template #="{ row }">
            <div
              v-if="
                row.warrantyDate &&
                Date.parse(row.warrantyDate.toString()) >
                  Date.parse(new Date().toString())
              "
            >
              {{ row.warrantyDate.split(" ")[0] }}
            </div>
            <div v-if="!row.warrantyDate">
              <el-tag
                style="
                  color: rgba(255, 112, 112, 1);
                  width: 68px;
                  height: 26px;
                  opacity: 1;
                  border-radius: 4px;
                  background: rgba(255, 212, 212, 1);
                  border: 1px solid rgba(255, 212, 212, 1);
                "
                class="mx-1"
                type="danger"
                effect="dark"
                >{{ $t("work.noactive") }}</el-tag
              >
            </div>
            <div
              v-if="
                row.warrantyDate &&
                Date.parse(row.warrantyDate.toString()) <=
                  Date.parse(new Date().toString())
              "
            >
              <el-tag
                style="
                  color: rgba(42, 130, 228, 1);
                  width: 68px;
                  height: 26px;
                  opacity: 1;
                  border-radius: 4px;
                  background: rgba(171, 210, 255, 1);
                  border: 1px solid rgba(171, 210, 255, 1);
                "
                class="mx-1"
                effect="dark"
                >{{ $t("work.due") }}</el-tag
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('work.PlateSN')" align="center">
          <template #="{ row }">
            {{ row.sn || "/" }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('work.MotorSN')" align="center">
          <template #="{ row }">
            {{ row.motorSn }}
          </template>
        </el-table-column>
        <!-- <el-table-column :label="$t('work.BodySN')" align="center">
                    <template #="{ row }">
                        {{ row.carImuSn || '/' }}
                    </template>
                </el-table-column> -->
        <el-table-column :label="$t('work.frontSN')" align="center">
          <template #="{ row }">
            {{ row.wheelImuSn || "/" }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('work.Antenna3_SN')" align="center">
          <template #="{ row }">
            {{ row.antennaOne || "/" }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('work.operation')" align="center" width="200">
          <template #="{ row }">
            <div class="edit-btn">
              <el-button
                v-auth="446"
                type="primary"
                link
                @click="edit(row)"
                :disabled="row.warrantyDate ? true : false"
                >{{ $t("work.edit") }}
              </el-button>
              <!-- <el-button v-auth="445" @click="removeTradeMark(row.id)" type="danger" link>{{$t('work.delete')}}</el-button> -->
              <el-button
                v-auth="505"
                type="primary"
                link
                @click="gotoAfterSale(row)"
                class="aftersale_btn"
                >{{ $t("work.afterSale") }}</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :total="total"
        :currentPage="pageInfo.currentPage"
        :pageSize="pageInfo.pageSize"
        @pageChange="currentChange"
      >
      </Pagination>
    </div>
    <div class="dialog">
      <el-dialog
        style="border-radius: 8px"
        v-model="dialogVisible"
        :title="newRecords.id ? $t('work.edit') : $t('work.new')"
        width="544px"
        height="580px"
      >
        <el-form
          label-width="140px"
          style="width: 90%"
          ref="formRef"
          :model="newRecords"
          :rules="rules"
        >
          <el-form-item :label="$t('work.deviceType')" prop="terminalType">
            <el-select
              v-model="newRecords.terminalType"
              class="m-2"
              :placeholder="$t('work.pleaseSelect')"
              width="120px"
              style="width: 100%"
              prop="terminalType"
            >
              <el-option value="AG360" label="AG360" />
              <el-option value="AG502" label="AG502" />
              <el-option value="AG501" label="AG501" />
              <el-option value="AG502_JP" label="AG502JP" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('work.labelSN')" prop="npn">
            <el-input v-model="newRecords.npn"></el-input>
          </el-form-item>
          <el-form-item :label="$t('work.gnssPoleSN')" prop="sn">
            <el-input v-model="newRecords.sn"></el-input>
          </el-form-item>
          <el-form-item label="HUB SN" prop="hubSn">
            <el-input v-model="newRecords.hubSn"></el-input>
          </el-form-item>
          <el-form-item :label="$t('work.MotorSN')" prop="motorSn">
            <el-input v-model="newRecords.motorSn"></el-input>
          </el-form-item>
          <el-form-item :label="$t('work.steeringSN')" prop="steeringWheelSn">
            <el-input v-model="newRecords.steeringWheelSn"></el-input>
          </el-form-item>
          <el-form-item :label="$t('work.bobyIMUSN')" prop="carImuSn">
            <el-input v-model="newRecords.carImuSn"></el-input>
          </el-form-item>
          <el-form-item :label="$t('work.frontSN')" prop="wheelImuSn">
            <el-input v-model="newRecords.wheelImuSn"></el-input>
          </el-form-item>
        </el-form>

        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" v-if="!newRecords.id" @click="submit">
              {{ $t("work.submit") }}
            </el-button>
            <el-button type="primary" v-else @click="editSubmit">
              {{ $t("work.submit") }}
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <G502Dia @push="pushValue" ref="G502D" :newRecords="newRecords"></G502Dia>
    <G501Dia @push="pushValue" ref="G501D" :newRecords="newRecords"></G501Dia>
    <G502DiaJp @push="pushValue" ref="G502DJP" :newRecords="newRecords"></G502DiaJp>
  </div>
</template>

<script setup lang="ts">
import G502Dia from "../components/G502Dia.vue";
import G502DiaJp from "../components/G502DiaJp.vue";
import G501Dia from "../components/G501Dia.vue";
import Pagination from "@/components/Pagination/index.vue";
import { reactive, ref, nextTick, watch } from "vue";
// carModuleInfoOperationDelete_API
import {
  carModuleInfo_API,
  carModuleInfoSave_API,
  carModuleInfoUpdate_API,
  CarModuleInfoExport_API,
} from "@/api/infoManagement/index";
import {
  RecordsObj,
  carModuleInfoResponseData,
  PageObj,
  newRecordsObj,
} from "@/api/infoManagement/type";
import { useRouter } from "vue-router";
import SvgIcon from "@/components/SvgIcon/index.vue";
const pageInfo = reactive<PageObj>({
  key: "",
  terminalType: "AG502",
  currentPage: 1,
  pageSize: 10,
});
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const $router = useRouter();
const scence = ref<string>("2");
const total = ref<number>(10);
const records = ref<RecordsObj[]>([]);
const dialogVisible = ref<boolean>(false);
const G502D = ref();
const G502DJP = ref();
const G501D = ref();
const multipleSelection = ref<RecordsObj[]>([]);
const newRecords = reactive<newRecordsObj>({
  carImuSn: "",
  hubSn: "",
  antennaTwo: "",
  wheelImuSn: "",
  id: null,
  superCattleModuleInfo: "",
  sn: "",
  npn: "",
  steeringWheelSn: "",
  antennaOne: "",
  type: "all",
  terminalType: "",
  motorSn: "",
  userName: "",
  tel: "",
});

let formRef = ref();
const pushValue = () => {
  getInfoMangementInfo();
};
const getInfoMangementInfo = async () => {
  const res: carModuleInfoResponseData = await carModuleInfo_API(pageInfo);
  records.value = res.data.records;
  total.value = res.data.total;
};
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val;
};
// const validatorwarrantyDate = (_rule: any, value: any, callBack: any) => {
//     let zz = /^([1-2][0-9][0-9][0-9]-[0-1]{0,1}[0-9]-[0-3]{0,1}[0-9])\s(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/
//     if (zz.test(value)) {
//         callBack();
//     } else {
//         callBack(new Error("时间的格式应为:2020-01-01 09:11:23"));
//     }
// };
const rules = {
  terminalType: [{ required: true, message: t("messages.plzenter"), trigger: "blur" }],
  npn: [{ required: true, message: t("messages.plzenter"), trigger: "blur" }],
  name: [{ required: true, message: t("messages.plzenter"), trigger: "blur" }],
  // warrantyDate: [{ required: true, validator: validatorwarrantyDate }],
  sn: [{ required: true, message: t("messages.plzenter"), trigger: "blur" }],
  hubSn: [{ required: true, message: t("messages.plzenter"), trigger: "blur" }],
  motorSn: [{ required: true, message: t("messages.plzenter"), trigger: "blur" }],
  steeringWheelSn: [{ required: true, message: t("messages.plzenter"), trigger: "blur" }],
  carImuSn: [{ required: true, message: t("messages.plzenter"), trigger: "blur" }],
  wheelImuSn: [{ required: true, message: t("messages.plzenter"), trigger: "blur" }],
};

getInfoMangementInfo();
const currentChange = (val: any) => {
  pageInfo.currentPage = val.currentPage;
  pageInfo.pageSize = val.pageSize;
  getInfoMangementInfo();
};
const search = () => {
  getInfoMangementInfo();
};
const changeBlur = () => {
  if (pageInfo.terminalType == "AG360") {
    scence.value = "1";
  }
  if (pageInfo.terminalType == "AG502") {
    scence.value = "2";
  }
  if (pageInfo.terminalType == "AG501") {
    scence.value = "3";
  }
  if (pageInfo.terminalType == "AG502_JP") {
    scence.value = "4";
  }
  getInfoMangementInfo();
};
const addInfo = async () => {
  try {
    await carModuleInfoSave_API(newRecords);
  } catch {}
};
const editInfo = async () => {
  try {
    await carModuleInfoUpdate_API(newRecords);
  } catch {}
};
const edit = (row: any) => {
  if (scence.value == "1") {
    dialogVisible.value = true;
  }
  if (scence.value == "2") {
    G502D.value.dialogVisible = true;
  }
  if (scence.value == "3") {
    G501D.value.dialogVisible = true;
  }
  if (scence.value == "4") {
    G502DJP.value.dialogVisible = true;
  }
  newRecords.carImuSn = row.carImuSn;
  newRecords.hubSn = row.hubSn;
  newRecords.antennaTwo = row.antennaTwo;
  newRecords.wheelImuSn = row.wheelImuSn;
  newRecords.id = row.id;
  newRecords.superCattleModuleInfo = row.superCattleModuleInfo;
  newRecords.sn = row.sn;
  newRecords.npn = row.npn;
  newRecords.steeringWheelSn = row.steeringWheelSn;
  newRecords.antennaOne = row.antennaOne;
  newRecords.terminalType = row.terminalType;
  newRecords.motorSn = row.motorSn;
  newRecords.userName = row.username;
  newRecords.tel = row.tel;
  nextTick(() => {
    formRef?.value.clearValidate();
    G501D.value.formRef?.clearValidate();
    G502D.value.formRef?.clearValidate();
    G502DJP.value.formRef?.clearValidate();
  });
};
watch(
  () => newRecords.terminalType,
  () => {
    if (newRecords.terminalType == "AG502") {
      dialogVisible.value = false;
      G502D.value.dialogVisible = true;
      G501D.value.dialogVisible = false;
      G502DJP.value.dialogVisible = false;
    }
    if (newRecords.terminalType == "AG360") {
      dialogVisible.value = true;
      G502D.value.dialogVisible = false;
      G501D.value.dialogVisible = false;
      G502DJP.value.dialogVisible = false;
    }
    if (newRecords.terminalType == "AG501") {
      dialogVisible.value = false;
      G501D.value.dialogVisible = true;
      G502D.value.dialogVisible = false;
      G502DJP.value.dialogVisible = false;
    }
    if (newRecords.terminalType == "AG502_JP") {
      dialogVisible.value = false;
      G502DJP.value.dialogVisible = true;
      G502D.value.dialogVisible = false;
      G501D.value.dialogVisible = false;
    }
  }
);
const editSubmit = async () => {
  await formRef.value.validate();
  editInfo();
  getInfoMangementInfo();
  dialogVisible.value = false;
};
const openDialog = () => {
  dialogVisible.value = true;
  nextTick(() => {
    G501D.value.formRef?.clearValidate();
    formRef.value.clearValidate();
    G502D.value.formRef?.clearValidate();
    G502DJP.value.formRef?.clearValidate();
    newRecords.carImuSn = "";
    newRecords.hubSn = "";
    newRecords.antennaTwo = "";
    newRecords.wheelImuSn = "";
    newRecords.id = null;
    newRecords.superCattleModuleInfo = "";
    newRecords.sn = "";
    newRecords.npn = "";
    newRecords.steeringWheelSn = "";
    newRecords.antennaOne = "";
    newRecords.type = "all";
    newRecords.motorSn = "";
    newRecords.terminalType = "";
    newRecords.userName = "";
    newRecords.tel = "";
  });
};
//  const removeTradeMark = (id: any) => {
//     ElMessageBox.confirm(
//         '此操作将永久删除，是否继续?',
//         'Warning',
//         {
//             confirmButtonText: '确定',
//             cancelButtonText: '取消',
//             type: 'warning',
//         }
//     ).then(async () => {
//         try {
//             await carModuleInfoOperationDelete_API(id)
//             ElMessage({ type: 'success', message: '删除成功' })
//             pageInfo.key = ''
//             getInfoMangementInfo()
//         }
//         catch {
//             // ElMessage({ type: 'error', message: '删除失败' })
//         }
//     }).catch(() => {
//         ElMessage({
//             message: '取消删除',
//         })
//     })

// }
const submit = async () => {
  await formRef.value.validate();
  dialogVisible.value = false;
  addInfo();
};

const gotoAfterSale = (row: any) => {
  $router.push({
    path: "/infoManagement/quality/aftersale",
    query: { id: row.id },
  });
};
const openExportDia = () => {
  CarModuleInfoExport_API(pageInfo).then((res) => {
    let name = "信息.xlsx";
    const type = "application/vnd.ms-excel;charset=utf-8"; //excel文件
    let u = window.URL.createObjectURL(new Blob([res.data], { type: type }));
    let a = document.createElement("a");
    a.download = name;
    a.href = u;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
};
</script>

<style lang="scss" scoped>
.search_container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  .input_area {
    display: flex;
    align-items: center;

    .input-with-select {
      margin-right: 20px;
      width: 240px;
      height: 32px;
      opacity: 1;
      border-radius: 2px;
    }

    .kind {
      height: 21px;
      opacity: 1;
      /** 文本1 */
      font-size: 14px;
      font-weight: 400;
      letter-spacing: 0px;
      line-height: 20.27px;
    }

    .m-2 {
      width: 179px;
      height: 32px;
      opacity: 1;
      border-radius: 4px;
      border: 1px rgba(220, 223, 230, 1);
    }
  }
}

.edit-btn {
  display: flex;
  justify-content: space-around;

  .aftersale_btn {
    word-wrap: break-word;
    overflow-wrap: break-word;
    white-space: normal;
    height: auto;
    overflow: hidden;
  }
}

.dialog-footer {
  display: flex;
  justify-content: space-around;
}

.dialog {
  .dia-input-words {
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0px;
    line-height: 23.17px;
    text-align: left;
    vertical-align: top;
  }

  .dia-input {
    width: 280px;
    height: 32px;
    opacity: 1;
    border-radius: 2px;
    border: 1px solid rgba(220, 223, 230, 1);
  }
}
</style>
