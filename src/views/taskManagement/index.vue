<!--  -->
<template>
  <div class="app_container">
    <div class="app_card">
      <div class="top_line">
        <div class="left">
          <el-input
            v-model="pageInfo.keyword"
            style="width: 240px; margin-left: 10px"
            :placeholder="$t('messages.plzenter')"
          >
          </el-input>
          <el-select-v2
            style="width: 240px; margin-left: 10px"
            filterable
            clearable
            v-model="pageInfo.sn"
            :options="options"
            :placeholder="$t('work.pleaseSelect')"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { listVehicle_API, pageTask_API } from "@/api/fieldManagement/indx";

import { useI18n } from "vue-i18n";
const timeRange = ref<any>([
  new Date(new Date().setHours(23, 59, 59, 999)).getTime() - 3600 * 1000 * 24 * 30,
  new Date(new Date().setHours(23, 59, 59, 999)).getTime(),
]);
const { t } = useI18n();
const carList = ref<any>([]);
let options = ref<any>([]);
const pageInfo = reactive({
  keyword: "",
  stTime: "",
  etTime: "",
  currentPage: 1,
  pageSize: 10,
  sn: "",
});
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
  pageInfo.stTime = timeRange.value[0];
  pageInfo.etTime = timeRange.value[1];
  const res = await pageTask_API(pageInfo);
};
const changteTime = () => {
  isActive.value = 0;
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
</style>
