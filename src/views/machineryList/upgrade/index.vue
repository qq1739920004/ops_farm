<!--  -->
<template>
  <div class="app_container">
    <div class="table_container app_card">
      <div class="top_line">
        <div class="top_title">
          <div>{{ t("work.vehicleType") }}</div>
          <div class="select_area">
            <el-select
              v-model="terminalType"
              @change="changeType"
              :placeholder="$t('work.pleaseSelect')"
            >
              <el-option
                v-for="item in terminalOptions"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="top_title" v-for="(item, index) in nameList" :key="index">
          <div>{{ item.name }}</div>
          <div class="select_area">
            <el-select
              v-model="value[index]"
              clearable
              multiple
              collapse-tags
              :placeholder="$t('work.pleaseSelect')"
            >
              <el-option
                v-for="item in modelList[index]"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="top_title">
          <div>{{ t("devicelist.location") }}</div>
          <div class="select_area">
            <el-select
              clearable
              multiple
              collapse-tags
              v-model="areaValue"
              :placeholder="$t('work.pleaseSelect')"
            >
              <el-option
                v-for="item in areaOptions"
                :key="item"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="search_area">
        <el-button type="primary" v-auth="2182" @click="getpageModelSnList">{{
          t("work.search")
        }}</el-button>
      </div>
      <div class="bottom_line" v-if="fileListTitle.length">
        <el-table
          :data="fileListData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" :label="$t('work.item') + ':'" :width="60">
          </el-table-column>
          <el-table-column
            align="center"
            v-for="(item, index) in fileListTitle"
            :key="index"
            :label="item"
          >
            <template template #="{ row }">{{ row[index].value || "--" }} </template>
          </el-table-column>
        </el-table>
        <div class="pag">
          <Pagination
            :total="total"
            :currentPage="pageInfo.currentPage"
            :pageSize="pageInfo.pageSize"
            @pageChange="currentChange"
          >
          </Pagination>
        </div>
        <div class="btn_area">
          <el-button type="danger" v-auth="2183" @click="upfradeConfirm">{{
            t("devicelist.upgrade")
          }}</el-button>
        </div>
      </div>
      <el-dialog
        v-model="dialogVisible"
        center
        :title="t('devicelist.upgrade')"
        width="500"
      >
        <el-form
          label-width="140px"
          style="width: 90%"
          ref="formRef"
          :model="newRecords"
          :rules="rules"
        >
          <el-form-item :label="$t('work.firmwareType')" prop="mid">
            <el-select
              v-model="newRecords.mid"
              @change="changeMid"
              :placeholder="$t('work.pleaseSelect')"
              style="width: 240px"
            >
              <el-option
                v-for="(item, index) in nameList"
                :key="index"
                :label="item.name"
                :value="item.mid"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('work.firmwareVersion')" prop="version">
            <el-select
              v-model="newRecords.version"
              style="width: 240px"
              :placeholder="$t('work.pleaseSelect')"
            >
              <el-option
                v-for="(item, index) in firmwareList"
                :key="index"
                :label="item.filename"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="danger" @click="confirmUpgrade">{{
              t("work.forceUpgrade")
            }}</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import Pagination from "@/components/Pagination/index.vue";
import { ref, reactive } from "vue";
import {
  getmodelTitleList_API,
  getmodelList_API,
  getmodelPackageList_API,
  getpageModelSnList_API,
  modeUpgrade_API,
} from "@/api/machineryList/ungrade/index";

const { t } = useI18n();
const terminalOptions = ["AG502", "AG501Pro"];
let pageInfo = reactive<any>({
  key: "",
  currentPage: 1,
  pageSize: 10,
});
const newRecords = ref<any>({
  mid: "",
  version: "",
});
const rules = {
  mid: [{ required: true, message: t("work.pleaseSelect"), trigger: "blur" }],
  version: [{ required: true, message: t("work.pleaseSelect"), trigger: "blur" }],
};
const formRef = ref<any>("");
const dialogVisible = ref(false);
const fileListData = ref([]);
const fileListTitle = ref([]);
const modelListVOs = ref([]);
const snList = ref([]);
const terminalType = ref("AG502");
const value = ref([]);
const nameList = ref<any>([]);
const modelList = ref<any>([]);
const areaValue = ref([]);
const total = ref(0);
const firmwareList = ref<any>([]);
const changeType = () => {
  value.value = [];
  fileListData.value = [];
  fileListTitle.value = [];
  areaValue.value = [];
  newRecords.value = {
    mid: "",
    version: "",
  };
  pageInfo = {
    key: "",
    currentPage: 1,
    pageSize: 10,
  };
  getModel();
};
const upfradeConfirm = () => {
  if (snList.value.length === 0) {
    ElMessage.warning(t("messages.pleaseSelectDevice"));
  } else {
    dialogVisible.value = true;
  }
};
const currentChange = (val: any) => {
  pageInfo.currentPage = val.currentPage;
  pageInfo.pageSize = val.pageSize;
  getpageModelSnList();
};

const areaOptions = [
  {
    label: "北京市",
    value: 110000,
  },
  {
    label: "天津市",
    value: 120000,
  },
  {
    label: "河北省",
    value: 130000,
  },
  {
    label: "山西省",
    value: 140000,
  },
  {
    label: "内蒙古自治区",
    value: 150000,
  },

  {
    label: "辽宁省",
    value: 210000,
  },
  {
    label: "吉林省",
    value: 220000,
  },
  {
    label: "黑龙江省",
    value: 230000,
  },
  {
    label: "上海市",
    value: 310000,
  },
  {
    label: "江苏省",
    value: 320000,
  },
  {
    label: "浙江省",
    value: 330000,
  },
  {
    label: "安徽省",
    value: 340000,
  },

  {
    label: "福建省",
    value: 350000,
  },
  {
    label: "江西省",
    value: 360000,
  },

  {
    label: "山东省",
    value: 370000,
  },

  {
    label: "河南省",
    value: 410000,
  },
  {
    label: "湖北省",
    value: 420000,
  },
  {
    label: "湖南省",
    value: 430000,
  },
  {
    label: "广东省",
    value: 440000,
  },
  {
    label: "广西壮族自治区",
    value: 450000,
  },

  {
    label: "海南省",
    value: 460000,
  },
  {
    label: "香港特别行政区",
    value: 810000,
  },
  {
    label: "澳门特别行政区",
    value: 820000,
  },
  {
    label: "重庆市",
    value: 500000,
  },
  {
    label: "四川省",
    value: 510000,
  },
  {
    label: "贵州省",
    value: 520000,
  },
  {
    label: "云南省",
    value: 530000,
  },
  {
    label: "西藏自治区",
    value: 540000,
  },
  {
    label: "陕西省",
    value: 610000,
  },
  {
    label: "甘肃省",
    value: 620000,
  },
  {
    label: "青海省",
    value: 630000,
  },
  {
    label: "宁夏回族自治区",
    value: 640000,
  },
  {
    label: "新疆维吾尔自治区",
    value: 650000,
  },
  {
    label: "台湾省",
    value: 710000,
  },
];

const handleSelectionChange = (val: any) => {
  if (val.length === pageInfo.pageSize || val.lenght === total.value) {
    isAll.value = 1;
  } else {
    isAll.value = 0;
  }
  snList.value = val.map((item: any) => {
    return item[0].value;
  });
};

const getModel = async () => {
  const res = await getmodelTitleList_API(terminalType.value === "AG502" ? 9008 : 9018);
  nameList.value = res.data.map((item: any) => {
    return { name: item.name, mid: item.mid };
  });
  getModelList(res.data);
};
const getModelList = async (data: any) => {
  const res = await getmodelList_API({
    terminalType: terminalType.value,
    modelCarDTOS: data,
  });
  modelListVOs.value = res.data;
  modelList.value = res.data.map((item: any) => {
    return item.stringList;
  });
};
const getpageModelSnList = async () => {
  const lis = modelListVOs.value;
  lis.map((item: any, index) => {
    value.value[index] ? (item.stringList = value.value[index]) : (item.stringList = []);
  });
  const res = await getpageModelSnList_API({
    currentPage: pageInfo.currentPage,
    pageSize: pageInfo.pageSize,
    terminalType: terminalType.value,
    addrcodeList: areaValue.value,
    modelListVOs: lis,
  });
  fileListData.value = res.data.cellData;
  fileListTitle.value = res.data.headers;
  total.value = res.data.total;
};
const changeMid = () => {
  newRecords.value.version = "";
  getmodelPackage(newRecords.value.mid);
};
const getmodelPackage = async (mid: any) => {
  const res = await getmodelPackageList_API(mid);
  firmwareList.value = res.data;
};
const isAll = ref(0);
const confirmUpgrade = async () => {
  await formRef.value.validate();
  const lis = modelListVOs.value;
  lis.map((item: any, index) => {
    value.value[index] ? (item.stringList = value.value[index]) : (item.stringList = []);
  });
  try {
    const res = await modeUpgrade_API({
      modelPageDTO: {
        key: "",
        currentPage: pageInfo.currentPage,
        pageSize: pageInfo.pageSize,
        terminalType: terminalType.value,
        addrcodeList: areaValue.value,
        modelListVOs: lis,
      },
      isALL: isAll.value,
      snList: snList.value,
      updateModel: 9,
      upgradeWay: 0,
      mid: newRecords.value.version.mid,
      versionName: newRecords.value.version.versionName,
      versionCode: newRecords.value.version.versionCode,
      filepath: newRecords.value.version.filepath,
      filesize: newRecords.value.version.filesize,
    });
    ElMessage.success(t('work.upgradeSuccess'))
    dialogVisible.value = false
  } catch {
    dialogVisible.value = false
  }
};
getModel();

// getModelList();
</script>

<style lang="scss" scoped>
.top_line {
  padding-top: 20px;
  width: 100%;
  height: 50%;
  display: flex;
  flex-wrap: wrap;
  .top_title {
    width: 25%;
    height: 80px;
    padding-left: 20px;
    .select_area {
      width: 270px;
      margin-top: 5px;
    }
  }
}
:deep(.el-tag) {
  background-color: var(--el-color-primary-light-8);
  border-radius: 5px;
}
:deep(.el-tag__content) {
  color: var(--el-color-primary);
  border-radius: 3px;
}
.pag {
  display: flex;
  justify-content: center;
}
.search_area {
  display: flex;
  justify-content: center;
  margin: 20px;
}
.dialog-footer {
  display: flex;
  justify-content: center;
}
.btn_area {
  display: flex;
  justify-content: center;
  margin: 20px;
}
</style>
