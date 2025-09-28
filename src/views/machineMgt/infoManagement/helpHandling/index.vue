<template>
  <div class="app_container">
    <!-- 搜索 -->

    <!-- 表格 -->
    <div class="table_container app_card">
      <div class="search_container">
        <div>
          <el-input
            :placeholder="$t('work.enterSNOrPhone')"
            v-model="helpHandling.key"
            @keyup.enter.native="search()"
          >
            <template #append>
              <el-button icon="Search" @click="search()" />
            </template>
          </el-input>
        </div>
        <div class="state">
          <span>{{ $t("devicelist.state") }}：</span>
          <el-select
            style="width: 180px"
            v-model="helpHandling.status"
            :placeholder="$t('work.pleaseSelect')"
            @change="chooseStatus"
          >
            <el-option value="0" :label="$t('work.pending')" />
            <el-option value="1" :label="$t('work.assigned')" />
            <el-option value="2" :label="$t('work.processed')" />
          </el-select>
        </div>
        <div class="tag">
          <el-tag type="danger" class="el_tag_uncount">
            <el-icon :size="20">
              <Edit />
            </el-icon>
            {{ $t("work.pending") }} {{ helpHandlingUncount }}
          </el-tag>
        </div>
      </div>
      <el-table type="index" @sort-change="changeTableSort" :data="helpList" stripe>
        <el-table-column
          :label="$t('devicelist.item')"
          type="index"
          align="center"
          width="60px"
        />
        <el-table-column label="SN" prop="sn" align="center" />
        <el-table-column :label="$t('devicelist.state')" prop="status" align="center">
          <template #="{ row }">
            <div v-if="row.status == 0">
              <el-tag
                style="
                  color: rgba(255, 112, 112, 1);
                  background: rgba(255, 212, 212, 1);
                  border: 1px solid rgba(255, 212, 212, 1);
                "
                >{{ $t("work.pending") }}</el-tag
              >
            </div>
            <div v-if="row.status == 1">
              <el-tag>{{ $t("work.assigned") }}</el-tag>
            </div>
            <div v-if="row.status == 2">
              <el-tag>{{ $t("work.processed") }}</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('work.helpTime')"
          prop="helpTime"
          :sortable="'custom'"
          align="center"
        >
        </el-table-column>

        <el-table-column
          :label="$t('work.processTime')"
          prop="handleTime"
          sortable
          align="center"
        />
        <el-table-column :label="$t('work.period')" prop="consumeTime" align="center" />
        <el-table-column :label="$t('work.handler')" prop="handlerName" align="center" />
        <el-table-column :label="$t('work.admin')" prop="managerName" align="center" />
        <el-table-column
          :label="$t('work.assignTime')"
          prop="assignTime"
          align="center"
        />
        <el-table-column :label="$t('work.remark')" prop="info" />
        <el-table-column :label="$t('work.operation')" prop="status" align="center">
          <template #="{ row }">
            <el-button
              v-auth="506"
              size="small"
              text
              type="success"
              @click="handleEdit(row)"
              :disabled="row.status == 2"
              >{{ $t("work.processed2") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :total="total"
        :currentPage="helpHandling.currentPage"
        :pageSize="helpHandling.pageSize"
        @pageChange="currentChange"
      >
      </Pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import Pagination from "@/components/Pagination/index.vue";
import { getHelpHandlingAPI, getHelpHandlingUncountAPI } from "@/api/helpHanding/index";
import type {
  RecordsObj,
  HelpHandlingObj,
  HelpHandlingResponseData,
  HelpHandlingUncountData,
} from "@/api/helpHanding/type";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
const { locale } = useI18n();
const helpList = ref<RecordsObj[]>([]);
const total = ref<number>(10);
const helpHandlingUncount = ref<HelpHandlingUncountData>();
const helpHandling = reactive<HelpHandlingObj>({
  key: "",
  status: null,
  currentPage: 1,
  pageSize: 10,
  helpTimeOrder: 0,
  handleTimeOrder: 0,
  assignTimeOrder: 0,
});
onMounted(() => {
  // getHelpHandling();
});

const changeTableSort = (column: any) => {
  if (column.prop === "helpTime") {
    if (column.order === "ascending") {
      helpHandling.helpTimeOrder = 2;
      getHelpHandling();
      // console.log('helpTime升序')
    } else if (column.order === "descending") {
      helpHandling.helpTimeOrder = 1;
      getHelpHandling();
      // console.log('helpTime降序')
    }
  } else if (column.prop === "handleTime") {
    if (column.order === "ascending") {
      helpHandling.handleTimeOrder = 2;
      getHelpHandling();
      // console.log('handletime升序')
    } else if (column.order === "descending") {
      helpHandling.handleTimeOrder = 1;
      getHelpHandling();
      // console.log('handletime降序')
    }
  } else {
  }
};

const getHelpHandling = async () => {
  const res: HelpHandlingResponseData = await getHelpHandlingAPI(helpHandling);
  helpList.value = res.data.records;
  total.value = res.data.total;
  for (var item in helpList.value) {
    const s = tsToStr(helpList.value[item].consumeTime);
    helpList.value[item].consumeTime = s;
  }
};

const getHelpHandlingUncount = async () => {
  const res = await getHelpHandlingUncountAPI();
  helpHandlingUncount.value = res.data;
};

const tsToStr = (nowtime: any) => {
  // $t('work.processed2')$t('work.period')  将时间戳转化为时间格式
  let date = new Date(parseInt(nowtime) * 1000);
  // let Year = date.getFullYear();
  // let Moth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  let Day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  let Hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  let Minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  let Sechond = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  if(locale.value.includes('zh')) {
    let GMT = Day + "天" + Hour + "小时" + Minute + "分钟" + Sechond + "秒";
      return GMT;
  } else {
    let GMT = Day + "d " + Hour + "h " + Minute + "m " + Sechond + "s";
      return GMT;
  }


};

getHelpHandling();
getHelpHandlingUncount();

const currentChange = (val: any) => {
  helpHandling.currentPage = val.currentPage;
  helpHandling.pageSize = val.pageSize;
  getHelpHandling();
};

const search = () => {
  getHelpHandling();
};

const $router = useRouter();
const handleEdit = (row: RecordsObj) => {
  $router.push({
    path: "helpHandling/handle",
    query: { helpList: JSON.stringify(row) },
  });
};

// 状态查询
const chooseStatus = () => {
  getHelpHandling();
};
</script>

<style lang="scss" scoped>
.search_container {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
  flex-wrap: wrap;

  .state {
    margin-left: 20px;
    display: flex;
    align-items: center;

    span {
      font-size: 14px;
      font-weight: 400;
      letter-spacing: 0px;
      line-height: 20.27px;
    }
  }

  .tag {
    margin-left: auto;
  }

  .el_tag_uncount {
    margin-right: 0px;
    vertical-align: middle;

    .el-icon {
      display: inline-block;
      margin-right: 5px;
    }
  }
}
</style>
