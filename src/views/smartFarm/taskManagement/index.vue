<!--  -->
<template>
  <div class="app_container">
    <div class="app_card">
      <div class="top_line">
        <div class="left">
          <el-input
            v-model="pageInfo.keyword"
            style="width: 240px; margin-left: 10px"
            :placeholder="$t('messages.plzTaskName')"
            clearable
            @change="getPageList"
          >
          </el-input>
          <el-select-v2
            style="width: 240px; margin-left: 10px"
            filterable
            clearable
            v-model="pageInfo.sn"
            :options="options"
            :placeholder="$t('work.pleaseSelect')"
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
              {{ item.taskName }}
            </div>
            <div class="carName">
              {{ item.vehicleName || "--" }}
            </div>
            <div class="map_container">
              <detail-map :ggaData="tableList[index].ggaList" :mapRenderMode="'canvas'" />
            </div>
            <div class="bottm_line">
              <div class="top">
                <div class="left">
                  <img src="@/assets/common/stTime.png" alt="" />
                  {{ item.startTime || "--" }}
                </div>
                <div class="right">
                  <img src="@/assets/common/time.png" alt="" />
                  {{ item.durationSeconds || "--" }}
                </div>
              </div>
              <div class="bottom">
                <div class="left">
                  <img src="@/assets/common/edTime.png" alt="" />
                  {{ item.endTime || "--" }}
                </div>
                <div class="right">
                  <img src="@/assets/common/taskLine.png" alt="" />
                  {{ item.totalDistance || "--" }}km
                </div>
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
import { ref, reactive } from "vue";
import { listVehicle_API, pageTask_API } from "@/api/fieldManagement/indx";
import detailMap from "./components/detailMap.vue";
import { useI18n } from "vue-i18n";
import router from "@/router";
const timeRange = ref<any>([
  new Date(new Date().setHours(23, 59, 59, 999)).getTime() - 3600 * 1000 * 24 * 30,
  new Date(new Date().setHours(23, 59, 59, 999)).getTime(),
]);
const { t } = useI18n();
const carList = ref<any>([]);
let options = ref<any>([]);
const pageInfo = reactive<any>({
  keyword: "",
  stTime: "",
  etTime: "",
  currentPage: 1,
  pageSize: 10,
  sn: "",
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
  const res = await listVehicle_API();
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
const disabledDate = (time: Date) => {
  return time.getTime() > Date.now() + 8.64e7;
};
const isActive = ref<number>(2);
const getPageList = async () => {
  // pageInfo.stTime = 1;
  // pageInfo.etTime = 1000000000000000;
  pageInfo.stTime = timeRange.value[0];

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
    height: 318px;
    width: 20%;
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
        color: #4cb04f;
        font-size: 16px;
      }
      .carName {
        color: #b5b5b5;
        font-size: 12px;
      }
      .map_container {
        width: 100%;
        height: 196px;
      }
      .bottm_line {
        height: 66px;
        width: 100%;
        .top {
          font-size: 12px;
          color: #000000;
          display: flex;
          width: 100%;
          height: 50%;
          .left {
            width: 60%;
            display: flex;
            align-items: center;
          }
          .right {
            width: 40%;
            display: flex;
            align-items: center;
          }
        }
        .bottom {
          font-size: 12px;
          color: #000000;
          display: flex;
          height: 50%;
          width: 100%;
          .left {
            width: 60%;
            display: flex;
            align-items: center;
          }
          .right {
            width: 40%;
            display: flex;
            align-items: center;
          }
        }
        img {
          width: 15px;
          height: 15px;
          margin: 0 8px;
        }
      }
    }
  }
}
</style>
