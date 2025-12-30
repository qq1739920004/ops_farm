<!--  -->
<template>
  <div class="app_container">
    <div class="app_card">
      <div class="top_line">
        <div class="left">
          <el-input
            v-model="pageInfo.keyword"
            style="width: 180px; margin-left: 10px"
            :placeholder="$t('messages.plzTaskName')"
            clearable
            @change="getPageList"
          >
          </el-input>
          <el-select-v2
            style="width: 180px; margin-left: 10px"
            filterable
            clearable
            v-model="pageInfo.sn"
            :options="options"
            :placeholder="$t('work.pleaseSelectCar')"
            @change="getPageList"
          >
          </el-select-v2>
          <el-select-v2
            style="width: 180px; margin-left: 10px"
            filterable
            clearable
            v-model="pageInfo.blockId"
            :options="blockOptions"
            :placeholder="$t('work.pleaseSelectBlock')"
            @change="getPageList"
          >
          </el-select-v2>
          <el-select-v2
            style="width: 180px; margin-left: 10px"
            filterable
            clearable
            v-model="pageInfo.operationType"
            :options="taskTypeOptions"
            :placeholder="$t('work.pleaseSelectOperationType')"
            @change="getPageList"
          >
          </el-select-v2>
        </div>
        <div class="time">
          <p :class="isActive == 1 ? 'active' : ''" @click="onDayClick">
            {{ $t("work.today") }}
          </p>
          <p :class="isActive == 2 ? 'active' : ''" @click="onMonthClick">
            {{ $t("work.thisMonth") }}
          </p>
          <p :class="isActive == 3 ? 'active' : ''" @click="onYearClick">
            {{ $t("work.thisYear") }}
          </p>
          <div class="demo-date-picker">
            <div class="block">
              <el-date-picker
                value-format="x"
                :disabled-date="disabledDate"
                v-model="timeRange"
                type="datetimerange"
                start-placeholder="Start Date"
                end-placeholder="End Date"
                @change="changteTime"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="table_area">
        <div class="table_box" v-for="(item, index) in tableList" :key="index">
          <div class="table_inner" @click="gotoDetails(item.id)">
            <div class="inner_name">
              <span>{{ item.operationName }}</span>
              <span>{{ item.taskName }}</span>
            </div>
     
            <div class="map_container">
              <detail-map :key="`${pageInfo.farmId}-${item.id}`" :ggaData="tableList[index].ggaList" :mapRenderMode="'canvas'" />
            </div>
            <div class="bottm_line">
                     <div class="line_row">
                  <img src="@/assets/common/device.png" alt="" />

              {{ item.vehicleName?item.vehicleName+"/"+item.sn:"--" }}
            </div>
            <div class="line_row">
                <img src="@/assets/icons/fieldManagement_menu2.svg" alt="">
                <div class="left">
                  {{t('project.landName') }}：{{ item.blockName || "--" }} 
                </div>
              </div>
              <div class="line_row">
                <div class="time_range">
                  <img src="@/assets/common/time.png" alt="" />
                  {{ item.startTime || "--" }} - {{ item.endTime || "--" }}
                </div>
              </div>
               
              <div class="line_row">
                <img src="@/assets/common/filed.png" alt="">
                <div class="left">
                  {{ t('work.workAreaMu') }}：{{ formatAreaValue(item.totalArea) || "--" }}{{ getAreaUnit() }}   
                </div>
                <div class="right">
                  {{ t('work.remainingAreaMu') }}：{{ formatAreaValue(item.missedArea) || "--" }}{{ getAreaUnit() }}   
                </div>
              </div>
             
              <div class="line_row progress_row">
                  <img src="@/assets/common/stTime.png" alt="">

                <el-progress 
                  :percentage="item.totalArea && item.totalArea > 0 ? ((item.totalArea - (item.missedArea || 0)) / item.totalArea * 100).toFixed(0) : 0" 
                  :show-text="false"
                  :stroke-width="8"
                />
                <div class="progress_value">{{ item.totalArea && item.totalArea > 0 ? ((item.totalArea - (item.missedArea || 0)) / item.totalArea * 100).toFixed(0) : 0 }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Pagination
        :total="total"
        :currentPage="pageInfo.currentPage"
        :pageSize="pageInfo.pageSize"
        @pageChange="currentChange"
      >
      </Pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { getCarList_API, pageTask_API, getFarmBlockList_API, getTaskType_API } from "@/api/fieldManagement/indx";
import { useDictMapping } from '@/utils/dictMapping';
import { useAreaConversion } from '@/utils/areaConversion';
import detailMap from "./components/detailMap.vue";
import { useI18n } from "vue-i18n";
import router from "@/router";
import { useStorage } from "@vueuse/core";
const timeRange = ref<any>([
  new Date(new Date().setHours(23, 59, 59, 999)).getTime() - 3600 * 1000 * 24 * 30,
  new Date(new Date().setHours(23, 59, 59, 999)).getTime(),
]);
const { t } = useI18n();
const { getDictOptions } = useDictMapping();
const { formatAreaValue, getAreaUnit } = useAreaConversion();
const carList = ref<any>([]);
let options = ref<any>([]);
let blockOptions = ref<any>([]);
let taskTypeOptions = ref<any>([]);
const pageInfo = reactive<any>({
  keyword: "",
  stTime: "",
  etTime: "",
  farmId: useStorage("farmId", ""),
  currentPage: 1,
  pageSize: 10,
  sn: "",
  blockId: "",
  operationType: "",
});

const total = ref(0);
const tableList = ref<any>([]);
const gotoDetails = (id: any) => {
  router.push({
    path: "taskManagement/detail",
    query: {
      id: id,
    },
  });
};
const getCarList = async () => {
  const res = await getCarList_API({ farmId: pageInfo.farmId });
  carList.value = res.data;
  options.value = carList.value.map((item: any, _idx: any) => {
    return {
      value: item.sn,
      label: item.name ? item.name + "(" + item.sn + ")" : item.sn,
    };
  });
  options.value.unshift({
    label: t("work.allcars"),
    value: "",
  });
};
const getBlockOptions = async () => {
  const farmId = useStorage("farmId", "").value;
  if (!farmId) {
    blockOptions.value = [];
    return;
  }
  const res = await getFarmBlockList_API({ farmId });
  const list = res?.data || [];
  blockOptions.value = list.map((item: any) => ({ value: item.id, label: item.name }));
};
const getTaskTypeOptions = async () => {
  const res = await getTaskType_API({ dicKey: "work_category", level: 2 });
  const data = res?.data || [];
  // 使用字典映射工具转换
  taskTypeOptions.value = getDictOptions(data);
};
const disabledDate = (time: Date) => {
  return time.getTime() > Date.now() + 8.64e7;
};
const isActive = ref<number>(2);

// 监听农场切换
watch(
  () => pageInfo.farmId,
  () => {
    getCarList();
    getBlockOptions();
    getPageList();
  },
  { deep: true }
);

const getPageList = async () => {
  // pageInfo.stTime = 1;
  // pageInfo.etTime = 1000000000000000;
  pageInfo.stTime = timeRange.value[0];
  pageInfo.farmId = useStorage("farmId", "").value;
  pageInfo.etTime = timeRange.value[1];
  const res = await pageTask_API(pageInfo);
  total.value = res.data.total;
  tableList.value = res.data.records;
};
const changteTime = () => {
  isActive.value = 0;
  getPageList();
};
const currentChange = (val: any) => {
  pageInfo.currentPage = val.currentPage;
  pageInfo.pageSize = val.pageSize;
  getPageList();
};
const onDayClick = () => {
  isActive.value = 1;
  timeRange.value = [
    new Date(new Date().setHours(0, 0, 0)).getTime(),
    new Date(new Date().setHours(23, 59, 59, 999)).getTime(),
  ];
  getPageList();
};
//这个月
const onMonthClick = () => {
  isActive.value = 2;
  timeRange.value = [
    new Date(new Date().setHours(0, 0, 0)).getTime() - 3600 * 1000 * 24 * 30,
    new Date(new Date().setHours(23, 59, 59, 999)).getTime(),
  ];
  getPageList();
};
// 这一年
const onYearClick = () => {
  isActive.value = 3;
  timeRange.value = [
    new Date(new Date().setHours(0, 0, 0)).getTime() - 3600 * 1000 * 24 * 365,
    new Date(new Date().setHours(23, 59, 59, 999)).getTime(),
  ];
  getPageList();
};
getCarList();
getBlockOptions();
getTaskTypeOptions();
getPageList();
</script>

<style lang="scss" scoped>
.top_line {
  display: flex;
  justify-content: space-between;
}
.time {
  margin-left: 10px;
  height: 32px;
  display: flex;

  .demo-date-picker {
    display: flex;

    .gang {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0px 10px;
      height: 32px;
      opacity: 1;
      line-height: 21px;
      /** 文本1 */
      font-size: 14px;
      font-weight: 400;
      letter-spacing: 0px;
      line-height: 20.27px;
    }
  }

  p {
    margin-right: 32px;
    line-height: 5px;
    height: 20px;
    font-size: 14px;
    vertical-align: middle;
    font-family: SourceHanSansSC-regular;

    &:hover {
      cursor: pointer;
      color: var(--el-color-primary);
    }

    &.active {
      color: var(--el-color-primary);
    }
  }

  .date_picker {
    line-height: 32px;
    width: 240px;
    height: 32px;
  }
}
.table_area {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  .table_box {
    height: 388px;
    width: 25%;
    display: flex;
    justify-content: center;
    .table_inner {
      cursor: pointer;
      padding: 8px;
      height: 100%;
      width: 90%;
      background-color: #f7f7f7;
      border-radius: 8px;
      .inner_name {
        //第一个span
        span:first-child{
          color: #33b838;
          font-weight: bold;
        }
        //第二个span
        span:last-child{
        font-size: 12px;

        }
        font-size: 16px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 6px;
      }
      .carName {
        font-size: 12px;
      }
      .map_container {
        width: 100%;
        height: 196px;
      }
      .bottm_line {
        width: 100%;
        padding-top: 6px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        
        .line_row {
          font-size: 12px;
          color: #000000;
          display: flex;
          align-items: center;
          width: 100%;
          
          .time_range {
            display: flex;
            align-items: center;
            width: 100%;
          }
          
          .left {
            flex: 1;
            display: flex;
            align-items: center;
          }
          .right {
            flex: 1;
            display: flex;
            align-items: center;
          }
          
          &.progress_row {
            gap: 8px;
            :deep(.el-progress) {
              flex: 1;
            }
            .progress_value {
              min-width: 40px;
              text-align: left;
              font-weight: 500;
            }
          }
        }
        
        img {
          width: 15px;
          height: 15px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
