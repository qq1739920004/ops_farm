<!--  -->
<template>
  <div class="app_container">
    <div class="table_container app_card">
      <div class="top_line">
        <div class="top_title">
          <div>{{ t("work.vehicleType") }}</div>
          <div class="select_area">
            <el-select
              filterable
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
              filterable
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
              filterable
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
          @select="handleSelectionChange"
          @select-all="handleSelectAll"
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
              filterable
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
              filterable
              style="width: 240px"
              :placeholder="$t('work.pleaseSelect')"
            >
              <el-option
                v-for="(item, index) in firmwareList"
                :key="index"
                :label="item.filename"
                :value="item.id"
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
const terminalOptions = ["AG502", "AG501Pro", "MT901D", "SA1000"];
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
  newRecords.value = {
    mid: "",
    version: "",
  };

  if (snList.value.length === 0 && isAll.value === 0) {
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
    value: 11,
  },
  {
    label: "天津市",
    value: 12,
  },
  {
    label: "河北省",
    value: 13,
  },
  {
    label: "山西省",
    value: 14,
  },
  {
    label: "内蒙古自治区",
    value: 15,
  },

  {
    label: "辽宁省",
    value: 21,
  },
  {
    label: "吉林省",
    value: 22,
  },
  {
    label: "黑龙江省",
    value: 23,
  },
  {
    label: "上海市",
    value: 31,
  },
  {
    label: "江苏省",
    value: 32,
  },
  {
    label: "浙江省",
    value: 33,
  },
  {
    label: "安徽省",
    value: 34,
  },

  {
    label: "福建省",
    value: 35,
  },
  {
    label: "江西省",
    value: 36,
  },

  {
    label: "山东省",
    value: 37,
  },

  {
    label: "河南省",
    value: 41,
  },
  {
    label: "湖北省",
    value: 42,
  },
  {
    label: "湖南省",
    value: 43,
  },
  {
    label: "广东省",
    value: 44,
  },
  {
    label: "广西壮族自治区",
    value: 45,
  },

  {
    label: "海南省",
    value: 46,
  },
  {
    label: "香港特别行政区",
    value: 81,
  },
  {
    label: "澳门特别行政区",
    value: 82,
  },
  {
    label: "重庆市",
    value: 50,
  },
  {
    label: "四川省",
    value: 51,
  },
  {
    label: "贵州省",
    value: 52,
  },
  {
    label: "云南省",
    value: 53,
  },
  {
    label: "西藏自治区",
    value: 54,
  },
  {
    label: "陕西省",
    value: 61,
  },
  {
    label: "甘肃省",
    value: 62,
  },
  {
    label: "青海省",
    value: 63,
  },
  {
    label: "宁夏回族自治区",
    value: 64,
  },
  {
    label: "新疆维吾尔自治区",
    value: 65,
  },
  {
    label: "台湾省",
    value: 71,
  },
];
const handleSelectAll = (val: any) => {
  snList.value = [];
  if (val.length !== 0) {
    isAll.value = 1;
  } else {
    isAll.value = 0;
  }
};
const handleSelectionChange = (val: any) => {
  if (val.length === total.value) {
    isAll.value = 1;
  } else {
    isAll.value = 0;
  }

  snList.value = val.map((item: any) => {
    return item[0].value;
  });
};

const getModel = async () => {
  let num: any;
  if (terminalType.value === "AG502") {
    num = 9008;
  } else if (terminalType.value === "AG501Pro") {
    num = 9018;
  } else if (terminalType.value === "MT901D") {
    num = 9034;
  } else {
    num = 9036;
  }
  const res = await getmodelTitleList_API(num);
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
  let postValue:any
   firmwareList.value.find((item: any) => {
        if(item.id ===newRecords.value.version) {
          postValue = item
        }
      })

  try {
   await modeUpgrade_API({
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
      mid: postValue.mid,
      versionName: postValue.versionName,
      versionCode: postValue.versionCode,
      filepath: postValue.filepath,
      filesize: postValue.filesize,
    });
    ElMessage.success(t("work.upgradeSuccess"));
    dialogVisible.value = false;
  } catch {
    dialogVisible.value = false;
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
