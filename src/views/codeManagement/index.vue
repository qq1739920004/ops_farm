<!--  -->
<template>
  <div class="app_container">
    <div class="table_container app_card">
    <div class="search_container ">
      <div class="input_area">
        <el-input
          :placeholder="$t('work.inputFactoryNumber')"
          class="input-with-select"
          v-model="searchValue"
          @keyup.enter.native="search"
          clearable
          @clear="search"
        >
          <template #append>
            <el-button icon="Search" @click="search" />
          </template>
        </el-input>
      </div>
      <div>
        <el-button v-auth="575" @click="exportData" type="primary">
          <el-icon class="el-icon--left"> <SvgIcon icon="export" size="16" /> </el-icon
          >{{ $t("work.export") }}</el-button
        >
        <el-button v-auth="576" type="primary" icon="Plus" @click="openDialog">{{
          $t("work.new")
        }}</el-button>
      </div>
    </div>
      <!-- @select="handleSelect" @select-all="handleSelectAll" -->
      <el-table
        :data="tableData"
        style="width: 100%"
        @select="handleSelect"
        @select-all="handleSelectAll"
      >
        <el-table-column type="selection" width="60" align="center" />
        <el-table-column
          type="index"
          :label="$t('work.item')"
          width="80"
          align="center"
        />
        <el-table-column
          prop="factoryNum"
          :label="$t('work.factoryNumber')"
          show-overflow-tooltip
          width=""
          align="center"
        />
        <el-table-column
          prop="model"
          :label="$t('work.model')"
          show-overflow-tooltip
          width=""
          align="center"
        />
        <el-table-column
          prop="ratedVoltage"
          :label="$t('work.ratedVoltage')"
          align="center"
        />
        <el-table-column
          prop="exeStandard"
          :label="$t('work.executiveStandard')"
          show-overflow-tooltip
          width=""
          align="center"
        />
        <el-table-column
          prop="lineAccuracy"
          :label="$t('work.linearAccuracy')"
          align="center"
        />
        <el-table-column
          prop="produceNum"
          :label="$t('work.productionNumber')"
          align="center"
        />
        <el-table-column
          prop="produceTime"
          show-overflow-tooltip
          :label="$t('work.productionDate')"
          align="center"
        />
        <el-table-column
          prop="ratedPower"
          :label="$t('work.ratedPower')"
          align="center"
        />
        <el-table-column :label="$t('work.operation')" align="center" width="160">
          <template template #="{ row }">
            <el-button v-auth="577" type="primary" text @click="handleEdit(row)">{{
              $t("work.edit")
            }}</el-button>
            <el-button
              v-auth="574"
              text
              style="color: #f94a56"
              @click="deleteData(row)"
              >{{ $t("work.delete") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        v-model="dialogVisible"
        :title="formData.id ? $t('work.edit') : $t('work.new')"
        width="660px"
        @close="handleAddDialogClose"
      >
        <el-form ref="formRef" :model="formData" label-width="auto" :rules="rules">
          <el-form-item :label="$t('work.model')" prop="model">
            <el-select v-model="formData.model" style="width: 100%">
              <el-option
                v-for="item in modelList"
                :value="item.value"
                :label="item.label"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item v-show="formData.id" :label="$t('work.model')" prop="model">
                        <el-input v-model="formData.model" />
                    </el-form-item> -->
          <el-form-item :label="$t('work.ratedVoltage')" prop="ratedVoltage">
            <el-input v-model="formData.ratedVoltage" />
          </el-form-item>
          <el-form-item :label="$t('work.productionNumber')" prop="produceNum">
            <el-input v-model="formData.produceNum">
              <!-- <el-button slot="prepend" icon="">AG360</el-button> -->
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('work.executiveStandard')" prop="exeStandard">
            <el-input v-model="formData.exeStandard" />
          </el-form-item>
          <el-form-item :label="$t('work.linearAccuracy')" prop="lineAccuracy">
            <el-input v-model="formData.lineAccuracy">
              <el-button slot="append" icon="">cm</el-button>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('work.companyAddress')" prop="companyAddress">
            <el-input v-model="formData.companyAddress" />
          </el-form-item>
          <el-form-item :label="$t('work.serviceHotline')" prop="serviceTel">
            <el-input v-model="formData.serviceTel" />
          </el-form-item>
          <el-form-item
            :label="$t('work.factoryNumberTemplate')"
            prop="factoryNumTmpl"
            v-if="!formData.id"
          >
            <el-input v-model="formData.factoryNumTmpl" />
          </el-form-item>
          <el-form-item :label="$t('work.factoryNumber')" prop="factoryNum">
            <el-input v-model="formData.factoryNum" />
          </el-form-item>
          <el-form-item :label="$t('work.productionDate')" prop="produceTime">
            <el-date-picker
              v-model="formData.produceTime"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择日期"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item :label="$t('work.ratedPower')" prop="ratedPower">
            <el-input v-model="formData.ratedPower" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="danger" @click="dialogVisible = false">{{
              $t("work.cancel")
            }}</el-button>
            <el-button type="primary" v-if="!formData.id" @click="addData">{{
              $t("work.submit")
            }}</el-button>
            <el-button type="primary" v-else @click="editData">{{
              $t("work.submit")
            }}</el-button>
          </span>
        </template>
      </el-dialog>
      <Pagination
        :total="total"
        :currentPage="currentPage"
        :pageSize="pageSize"
        @pageChange="currentChange"
      >
      </Pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import Pagination from "@/components/Pagination/index.vue";
import SvgIcon from "@/components/SvgIcon/index.vue";
import {
  sacredCowQrList_path,
  sacredCowQrSave_path,
  sacredCowQrUpdate_path,
  sacredCowQrRemove_path,
  sacredCowQrExport_path,
} from "@/api/codeManagement/index";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const tableData = ref<any>([]);
const searchValue = ref("");
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const exportIds = ref([]);
let formData = ref<any>({
  model: "-AG502BD-2.5GD-",
  ratedVoltage: "DC12V",
  produceNum: "",
  exeStandard: "NY/T 3334-2018",
  lineAccuracy: "2.5",
  companyAddress: "上海市嘉定区马陆镇澄浏中路618号2幢3楼",
  serviceTel: "400-630-2933",
  factoryNumTmpl: "",
  factoryNum: "",
  produceTime: "",
  ratedPower: "160W",
});

const modelList = ref([
  {
    label: "-AG502BD-2.5GD-",
    value: "-AG502BD-2.5GD-",
  },
  {
    label: "-AG501BD-2.5GD-",
    value: "-AG501BD-2.5GD-",
  },
  {
    label: "-AG360BD-2.5GD-",
    value: "-AG360BD-2.5GD-",
  },
  {
    label: "-AG360 PRO BD-2.5GD-",
    value: "-AG360 PRO BD-2.5GD-",
  },
]);
const formRef = ref();
const dialogVisible = ref<boolean>(false);
const currentChange = (val: any) => {
  currentPage.value = val.currentPage;
  pageSize.value = val.pageSize;
  getList();
};
const search = () => {
  // 3101200131
  getList();
};
// 格式化时间
function dateTimeTrans(timestamp: any) {
  try {
    if (!timestamp) return "/";
    let dateObj = timestamp ? new Date(timestamp) : new Date();
    let dateString = dateObj
      .toLocaleDateString()
      .split("/")
      .map((i) => i.padStart(2, "0"))
      .join("-");
    let timeString = dateObj.toTimeString().slice(0, 8);
    return dateString + " " + timeString;
  } catch (error) {
    console.log(error);
    return "/";
  }
}
// 获取list数据
const getList = async () => {
  try {
    const res = await sacredCowQrList_path({
      currentPage: currentPage.value,
      pageSize: pageSize.value,
      name: searchValue.value,
    });

    if (res.data.list) {
      tableData.value = null;
      res.data.list.forEach((element: any) => {
        element.produceTime = element.produceTime
          ? dateTimeTrans(element.produceTime)
          : "/";
      });
      tableData.value = res.data.list;
      total.value = res.data.total;
    }
  } catch (error) {
    console.log(error);
  }
};
getList();
const handleEdit = (val: any) => {
  formData.value = val;
  dialogVisible.value = true;
  nextTick(() => {
    formRef.value.clearValidate();
  });
};
const deleteData = (val: any) => {
  ElMessageBox.confirm(t("work.deleteProductConfirmation"), "Warning", {
    confirmButtonText: t("work.submit"),
    cancelButtonText: t("work.cancel"),
    type: "warning",
  }).then(() => {
    sacredCowQrRemove_path({ id: val.id }).then((res) => {
      if (res.code === 0) {
        ElMessage({ type: "success", message: t("work.deleteSuccess") });
        searchValue.value = "";
        currentPage.value = 1;
        pageSize.value = 10;
        getList();
      }
      //   else {
      //     ElMessage({ type: "error", message: t("work.deleteFailed") });
      //   }
    });
  });
};
const rules = {
  model: [{ required: true, message: t("work.enterModel"), trigger: "blur" }],
  ratedVoltage: [
    { required: true, message: t("work.enterRatedVoltage"), trigger: "blur" },
  ],
  produceNum: [
    { required: true, message: t("work.enterProductionNumber"), trigger: "blur" },
  ],
  exeStandard: [
    { required: true, message: t("work.enterExecutiveStandard"), trigger: "blur" },
  ],
  lineAccuracy: [
    { required: true, message: t("work.enterLinearAccuracy"), trigger: "blur" },
  ],
  companyAddress: [
    { required: true, message: t("work.enterCompanyAddress"), trigger: "blur" },
  ],
  serviceTel: [
    { required: true, message: t("work.enterServiceHotline"), trigger: "blur" },
  ],
  factoryNumTmpl: [
    { required: true, message: t("work.enterFactoryNumberTemplate"), trigger: "blur" },
  ],
  factoryNum: [
    { required: true, message: t("work.enterFactoryNumber"), trigger: "blur" },
  ],
  produceTime: [{ required: true, message: t("work.selectDate"), trigger: "blur" }],
  ratedPower: [{ required: true, message: t("work.enterRatedPower"), trigger: "blur" }],
};
// 关闭弹窗
const handleAddDialogClose = () => {
  formData.value = {
    model: "-AG502BD-2.5GD-",
    ratedVoltage: "DC12V",
    produceNum: "",
    exeStandard: "NY/T 3334-2018",
    lineAccuracy: "2.5",
    companyAddress: "上海市嘉定区马陆镇澄浏中路618号2幢3楼",
    serviceTel: "400-630-2933",
    factoryNumTmpl: "",
    factoryNum: "",
    produceTime: "",
    ratedPower: "160W",
  };
};
// 新增数据
const addData = async () => {
  await formRef.value.validate();
  ElMessageBox.confirm("确定新增？", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    try {
      sacredCowQrSave_path(formData.value).then((res) => {
        if (res.code === 0) {
          ElMessage({ type: "success", message: "新增成功" });
          dialogVisible.value = false;
        }
        // else {
        //     res.code === 2
        //         ? ElMessage({ type: 'error', message: '新建失败，出厂编号已存在' })
        //         : "";
        //     res.code === 3
        //         ? ElMessage({ type: 'error', message: '新建失败，出厂编号格式错误' })
        //         : "";
        // }
      });
    } catch {}
  });
};
// 编辑数据
const editData = async () => {
  await formRef.value.validate();
  ElMessageBox.confirm("确定修改？", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    try {
      sacredCowQrUpdate_path(formData.value).then((res) => {
        if (res.code === 0) {
          ElMessage({ type: "success", message: "修改成功" });
          dialogVisible.value = false;
        }
      });
    } catch {}
  });
};
// 点击新建
const openDialog = () => {
  dialogVisible.value = true;

  nextTick(() => {
    formRef.value.clearValidate();
  });
};

const handleSelect = (selection: any) => {
  try {
    exportIds.value = selection.map((item: any) => item.id);
    console.log(exportIds.value)
  } catch (error) {
    console.log(error);
  }
};

const handleSelectAll = (selection: any) => {
  try {
    exportIds.value = selection.map((item: any) => item.id);
  } catch (error) {
    console.log(error);
  }
};
// 导出文件
const exportData = () => {
  const pathValue = exportIds.value.toString()
  console.log(pathValue)
  sacredCowQrExport_path({
    ids: pathValue,
  }).then((res: any) => {
    let name = "二维码管理.xls";
    const type = "application/vnd.ms-excel;charset=utf-8"; //excel文件
    let u = window.URL.createObjectURL(new Blob([res], { type: type }));
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
.dialog-footer {
  display: flex;
  justify-content: space-around;
}

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
      width: 70px;
      height: 21px;
      opacity: 1;
      /** 文本1 */
      font-size: 14px;
      font-weight: 400;
      letter-spacing: 0px;
      line-height: 20.27px;
    }
  }
}
</style>
