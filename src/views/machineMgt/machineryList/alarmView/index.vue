<!--  -->
<template>
  <div class="app_container">
    <div class="table_container app_card">
      <div class="search_container">
        <div class="left">
          <span>{{ t("work.currentVehicle") }}</span
          >{{ route.query.sn }}
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
        <el-table class="date-icon" style="max-width: 100%" :data="pageList" stripe height="calc(100vh - 240px)">
          <el-table-column type="index" :label="$t('devicelist.item')"  width="120"/>
          <el-table-column label="SN" > {{route.query.sn}}</el-table-column>
          <el-table-column :label="$t('devicelist.type')" prop="grade">
            <template #default="scope">
              <div v-if="scope.row.grade === 1" class="grade_area">
                {{ t("messages.Alarms") }}
              </div></template
            >
          </el-table-column>
          <el-table-column
            :label="t('work.describe')"
            prop="content"
            :filter-multiple="false"
          >
          <template #default="scope"> {{  contentList[scope.row.content] || '--' }}</template>
          </el-table-column>
          <el-table-column :label="t('work.time')" prop="time" :filter-multiple="false">
            <template #default="scope"> {{ (scope.row.time) }}</template>
          </el-table-column>
        </el-table>
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
import { useI18n } from "vue-i18n";
import { ref, reactive} from "vue";
import { statPage_API } from "@/api/inSight/index.ts";
import { useRoute } from "vue-router";
import Pagination from "@/components/Pagination/index.vue";
const { t } = useI18n();
const pageList = ref<any>([]);
const timeRange = ref<any>([
  new Date(new Date().setHours(0, 0, 0)).getTime(),
  new Date(new Date().setHours(23, 59, 59, 999)).getTime(),
]);
const contentList:any = {
  1001:t('content.LOSS_COURSE'),
  1002:t('content.LOSS_LOCATION'),
  1003:t('content.LOSS_MOTOR_VALUE_MAX'),
  1005:t('content.LOSS_MOTOR_VALUE'),
  1006:t('content.LOSS_FRONT_GYRO'),
  1007:t('content.LOSS_BODY_GYRO'),
  1008:t('content.LOSS_MOTOR'),
  1009:t('content.LOSS_SMART_WHEEL'),
  1010:t('content.LOSS_RTK_DATA'),
  1011:t('content.LOSS_LOCATION_BUT_SIGNAL'),
  1012:t('content.LOSS_BASE_LINE'),
}
const route = useRoute();
const isActive = ref<number>(1);
const total = ref<number>(0);
const pageInfo = reactive<any>({
  id: route.query.id || "",
  currentPage: 1,
  pageSize: 10,
});
const currentChange = (val: any) => {
  pageInfo.currentPage = val.currentPage;
  pageInfo.pageSize = val.pageSize;
  getStateData();
};
const getStateData = async () => {
  const res = await statPage_API({
    ...pageInfo,
    stTime: timestampToTime(timeRange.value[0]),
    etTime: timestampToTime(timeRange.value[1]),
  });
  pageList.value = res.data.records;
  total.value = res.data.total;
};
const changteTime = () => {
  isActive.value = 0;
  getStateData();
};
const disabledDate = (time: any) => {
  return time.getTime() >= Date.now();
};
function timestampToTime(timestamp: any) {
  var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + "-";
  var M =
    (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
  var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  var h = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  var m = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ":";
  var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
}
const onDayClick = () => {
  isActive.value = 1;
  timeRange.value = [
    new Date(new Date().setHours(0, 0, 0)).getTime(),
    new Date(new Date().setHours(23, 59, 59, 999)).getTime(),
  ];
  getStateData();
};
//这个月
const onMonthClick = () => {
  isActive.value = 2;
  timeRange.value = [
    new Date(new Date().setHours(0, 0, 0)).getTime() - 3600 * 1000 * 24 * 30,
    new Date(new Date().setHours(23, 59, 59, 999)).getTime(),
  ];
  getStateData();
};
// 这一年
const onYearClick = () => {
  isActive.value = 3;
  timeRange.value = [
    new Date(new Date().setHours(0, 0, 0)).getTime() - 3600 * 1000 * 24 * 365,
    new Date(new Date().setHours(23, 59, 59, 999)).getTime(),
  ];
  getStateData();
};
getStateData();
</script>

<style lang="scss" scoped>
.table_area {
  margin-top: 10px;
}
.search_container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left {
    margin-right: 20px;
    span {
      font-weight: bold;
      font-size: 16px;
    }
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
}
.grade_area {
  width: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25px;
  background: #ffc6c6;
  border-radius: 4px;
  color: #ff3c30;
}
</style>
