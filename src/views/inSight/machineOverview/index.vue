<!--  -->
<template>
  <div class="app_container">
    <div class="table_container app_card" style="height: 100%">
      <div v-show="!status.formShow">
        <!-- <div v-show="!status.provinceShow" class="head_container">
      <el-page-header :content="pageTitle" @back="goBack" />
    </div> -->
        <div class="head_container">
          <div class="time">
            <div class="demo-date-picker">
              <div class="block">
                <el-date-picker
                  v-model="timeRange"
                  type="daterange"
                  start-placeholder="Start Date"
                  end-placeholder="End Date"
                  @change="changteTime"
                />
              </div>
            </div>
            <!-- <p :class="isActive == 1 ? 'active' : ''" @click="onDayClick">
              {{ $t("work.today") }}
            </p> -->
            <p :class="isActive == 2 ? 'active' : ''" @click="onMonthClick">
              {{ $t("work.thisMonth") }}
            </p>
            <p :class="isActive == 3 ? 'active' : ''" @click="onYearClick">
              {{ $t("work.thisYear") }}
            </p>
          </div>
        </div>
        <!-- 省份卡片容器 -->
        <div v-show="status.provinceShow" class="province_card">
          <!-- intro无法选中v-for中渲染的元素 -->
          <div
            v-for="(item, index) in provinceCountData"
            :key="index"
            class="province_card_item"
          >
            <div class="item_title">
              <div class="item_title_province">
                <div>
                  {{ item.name || "/" }}
                </div>
              </div>
              <div
                v-if="item.addrcode !== '-1'"
                class="item_title_city"
                @click.native="handleProButClick(item)"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="$t('work.prefectureCityList')"
                  placement="top"
                >
                  <div class="cityline">
                    <span v-if="locale === 'zh'"> 省 </span>
                    <span v-else> Country/Region </span><el-icon><ArrowRight /></el-icon>
                  </div>
                </el-tooltip>
              </div>
            </div>
            <div style="cursor: pointer" @click="handleProCardClick(item)">
              <el-row class="item_text">
                <div class="title_data">
                  <div style="width: 25%">{{ $t("work.onlineTotalVehicles") }}</div>
                  <div style="width: 40%">{{ $t("work.todayTotalOperation") }}</div>
                  <div style="width: 35%">{{ $t("work.todayTime") }}</div>
                </div>
              </el-row>
              <el-row class="item_count">
                <div class="title_data">
                  <div style="width: 25%">{{ item.onlineNum || "--" }}</div>
                  <div style="width: 40%" v-if="locale.includes('zh')">
                    {{ item.todayArea ? item.todayArea.toFixed(2) : "--" }}
                  </div>
                  <div style="width: 40%" v-if="locale.includes('en')">
                    {{ item.todayArea ? (item.todayArea/15).toFixed(2) : "--" }}
                  </div>
                  <div style="width: 35%">
                    {{ item.todayDuration ? item.todayDuration.toFixed(2) : "--" }}
                  </div>
                </div>
              </el-row>
              <div class="bottom_data">
                <div>
                  <div class="l">{{ t("statisticsReport.Cumulativevehicles") }}</div>
                  <div class="r">{{ item.totalNum || "/" }}</div>
                </div>
                <div>
                  <div class="l">{{ t("statisticsReport.jobthousand") }}</div>
                  <div class="r" v-if="locale.includes('zh')">
                    {{ Math.floor(item.beforeArea * 100) / 100 || "/" }}
                  </div>
                  <div class="r" v-if="locale.includes('en')">
                    {{ Math.floor(item.beforeArea * 100/15) / 100 || "/" }}
                  </div>
                </div>
                <div>
                  <div class="l2">{{ t("statisticsReport.CumulativeDuration") }}(h)</div>
                  <div class="r2">{{ item.beforeDuration || "/" }}</div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="provinceCountData.length === 0"
            style="margin: auto; padding-top: 50px"
          >
            {{ $t("work.noData") }}
          </div>
        </div>
        <!-- 地级市卡片容器 -->
        <div v-show="status.cityShow" class="city_card">
          <div v-for="(item, index) in cityCountData" :key="index" class="city_card_item">
            <el-row class="item_title">
              <div class="item_title_province">
                <SvgIcon @click="goBack" icon="goBack" /><span @click="goBack">
                  <span v-if="locale === 'zh'"> 省 </span>
                  <span v-else> Continent </span>
                </span>
                <div style="margin-left: 20px">
                  {{ item.name || "/" }}
                </div>
              </div>
            </el-row>
            <!-- @click="handleCityCardClick(item)" -->
            <div style="cursor: pointer" @click="handleCityCardClick(item)">
              <el-row class="item_text">
                <div class="title_data">
                  <div style="width: 25%">{{ $t("work.onlineTotalVehicles") }}</div>
                  <div style="width: 50%">{{ $t("work.todayTotalOperation") }}</div>
                  <div style="width: 35%">{{ $t("work.todayTime") }}</div>
                </div>
              </el-row>
              <el-row class="item_count">
                <div class="title_data">
                  <div style="width: 25%">{{ item.onlineNum || "--" }}</div>
                  <div style="width: 50%" v-if="locale.includes('zh')">
                    {{ item.todayArea ? item.todayArea.toFixed(2) : "--" }}
                  </div>
                  <div style="width: 50%" v-if="locale.includes('en')">
                    {{ item.todayArea ? (item.todayArea/15).toFixed(2) : "--" }}
                  </div>
                  <div style="width: 35%">
                    {{ item.todayDuration ? item.todayDuration.toFixed(2) : "--" }}
                  </div>
                </div>
              </el-row>
              <div class="bottom_data">
                <div>
                  <div class="l">{{ t("statisticsReport.Cumulativevehicles") }}</div>
                  <div class="r">{{ item.totalNum || "/" }}</div>
                </div>
                <div>
                  <div class="l">{{ t("statisticsReport.jobthousand") }}</div>
                  <div class="r" v-if="locale.includes('zh')">
                    {{ Math.floor(item.beforeArea * 100) / 100 || "/" }}
                  </div>
                  <div class="r" v-if="locale.includes('en')">
                    {{ Math.floor(item.beforeArea * 100/15) / 100 || "/" }}
                  </div>
                </div>
                <div>
                  <div class="l2">{{ t("statisticsReport.CumulativeDuration") }}(h)</div>
                  <div class="r2">{{ item.beforeDuration || "/" }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="status.formShow" class="table_card">
        <span
          ><el-button class="btn" type="success" @click="goBack">
            <SvgIcon icon="goBack" /><span></span
            >{{ t("statisticsReport.backCard") }}</el-button
          ></span
        >
        <div class="tabletopline">
          <div class="privince_card">
            {{ provinceName }}
          </div>
          <div class="title">{{ t("messages.onlineCount") }}:</div>
          <div class="value">
            {{ chartValue.onlineNum }}
          </div>
          <div class="title">{{ t("statisticsReport.totalNumber") }}：</div>
          <div class="value">
            {{ chartValue.totalNum }}
          </div>
          <div class="title">{{ t("statisticsReport.jobthousand") }}:</div>
          <div class="value" v-if="locale.includes('zh')">
            {{ chartValue.beforeAreaSum }}
          </div>
          <div class="value" v-if="locale.includes('en')">
            {{( chartValue.beforeAreaSum/15 ).toFixed(2)}}
          </div>
          <div class="title">{{ t("statisticsReport.CumulativeDuration") }}(h):</div>
          <div class="value">
            {{ chartValue.beforeDurationSum }}
          </div>
        </div>
        <div class="head_container">
          <div class="time2">
            <!-- <p :class="isActive == 1 ? 'active' : ''" @click="onDayClick">
              {{ $t("work.today") }}
            </p> -->
            <p :class="isActive == 2 ? 'active' : ''" @click="onMonthClick2">
              {{ $t("work.thisMonth") }}
            </p>
            <p :class="isActive == 3 ? 'active' : ''" @click="onYearClick2">
              {{ $t("work.thisYear") }}
            </p>
            <div class="demo-date-picker">
              <div class="block">
                <el-date-picker
                  v-model="timeRange"
                  type="daterange"
                  start-placeholder="Start Date"
                  end-placeholder="End Date"
                  @change="changteTime2"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- <sn-table :carNewList="formData" @changeSort="changeSort" />
            <el-row type="flex" justify="end" style="margin-top:10px;margin-right:10px;">
                <Pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @pageChange="currentChange">
                </Pagination>
            </el-row> -->
        <div id="provinceChart"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import {
  catStartList_API,
  provinceChart_API,
  provinceChartSea_API,
  catStartSeaList_API,
} from "@/api/inSight/index";
import SvgIcon from "@/components/SvgIcon/index.vue";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();
import * as echarts from "echarts";
const isActive = ref(2);

// 省份数据列表
const provinceCountData = ref<any>([]);
// 地级市数据列表
const cityCountData = ref<any[]>([]);
// 城市数组
const timeRange = ref<any>([
  new Date(new Date().setHours(23, 59, 59, 999)).getTime() - 3600 * 1000 * 24 * 30,
  new Date(new Date().setHours(23, 59, 59, 999)).getTime(),
]);

const statusStark = ref([
  {
    provinceShow: true,
    provinceName: "",
    provinceCode: null,
    cityShow: false,
    cityName: "",
    cityCode: null,
    formShow: false,
  },
]);
const status = ref({
  provinceShow: true,
  provinceName: "",
  provinceCode: null,
  cityShow: false,
  cityName: "",
  cityCode: null,
  formShow: false,
});
const currentPage = ref<number>(1);
const getCityDataNewList = async (val: string) => {
  if (locale.value === "zh") {
    const res: any = await catStartList_API({
      stTime: timestampToTime(timeRange.value[0]),
      etTime: timestampToTime(timeRange.value[1]),
      addrcode: val,
    });
    cityCountData.value = res.data;
  } else {
    const res: any = await catStartSeaList_API({
      stTime: timestampToTime(timeRange.value[0]),
      etTime: timestampToTime(timeRange.value[1]),
      continentId: val,
    });
    cityCountData.value = res.data;
  }
};
const changteTime = () => {
  isActive.value = 0;
  if (status.value.provinceShow) {
    getProvinceDataNewList();
  } else {
    getCityDataNewList(addrcode.value);
  }
  provinceChart.clear();
  // getChartData(addrcode.value);
};
const changteTime2 = () => {
  provinceChart.clear();
  getChartData(chartId.value,chartIndex.value);
};
//今天
// const onDayClick = () => {
//   isActive.value = 1;
//   timeRange.value = [
//     new Date(new Date().setHours(0, 0, 0)).getTime(),
//     new Date(new Date().setHours(23, 59, 59, 999)).getTime(),
//   ];
//   getProvinceDataNewList();
//   getCityDataNewList(addrcode.value);
//   provinceChart.clear();
//   getChartData(addrcode.value);
// };
//这个月
const onMonthClick = () => {
  isActive.value = 2;
  timeRange.value = [
    new Date(new Date().setHours(0, 0, 0)).getTime() - 3600 * 1000 * 24 * 30,
    new Date(new Date().setHours(23, 59, 59, 999)).getTime(),
  ];
  if (status.value.provinceShow) {
    getProvinceDataNewList();
  } else {
    getCityDataNewList(addrcode.value);
  }
  provinceChart.clear();
  // getChartData(addrcode.value);
};
// 这一年
const onYearClick = () => {
  isActive.value = 3;
  timeRange.value = [
    new Date(new Date().setHours(0, 0, 0)).getTime() - 3600 * 1000 * 24 * 365,
    new Date(new Date().setHours(23, 59, 59, 999)).getTime(),
  ];
  if (status.value.provinceShow) {
    getProvinceDataNewList();
  } else {
    getCityDataNewList(addrcode.value);
  }
  provinceChart.clear();
  // getChartData(addrcode.value);
};
const onMonthClick2 = () => {
  isActive.value = 2;
  timeRange.value = [
    new Date(new Date().setHours(0, 0, 0)).getTime() - 3600 * 1000 * 24 * 30,
    new Date(new Date().setHours(23, 59, 59, 999)).getTime(),
  ];
  // getProvinceDataNewList();
  // getCityDataNewList(addrcode.value);
  provinceChart.clear();
  getChartData(chartId.value,chartIndex.value);
};
// 这一年
const onYearClick2 = () => {
  isActive.value = 3;
  timeRange.value = [
    new Date(new Date().setHours(0, 0, 0)).getTime() - 3600 * 1000 * 24 * 365,
    new Date(new Date().setHours(23, 59, 59, 999)).getTime(),
  ];
  // getProvinceDataNewList();
  // getCityDataNewList(addrcode.value);
  provinceChart.clear();
  getChartData(chartId.value,chartIndex.value);
};
const addrcode = ref<any>("");
const provinceName = ref<any>("");
// 点击...
const handleProButClick = (item: any) => {
  if (item.code === "-1") return;
  if (item.addrcode === "-1") return;
  // addrcode.value = item.addrcode;
  getCityDataNewList(item.addrcode);
  let iStatus = {
    provinceShow: false,
    provinceName: item.name,
    provinceCode: item.code,
    cityShow: true,
    cityName: "",
    cityCode: null,
    formShow: false,
  };
  status.value = iStatus;
  statusStark.value.push(status.value);
};
// 点击城市
const handleCityCardClick = (item: any) => {
  // console.log(item)
  // addrcode.value = item.addrcode;
  provinceName.value = item.name;
  let iStatus = {
    provinceShow: false,
    provinceName: item.name,
    provinceCode: item.code,
    cityShow: false,
    cityName: "",
    cityCode: null,
    formShow: true,
  };
  status.value = iStatus;
  statusStark.value.push(status.value);
  getChartData(item.addrcode, 2);
};
// 点击省份
const handleProCardClick = (item: any) => {
  addrcode.value = item.addrcode;
  provinceName.value = item.name;
  let iStatus = {
    provinceShow: false,
    provinceName: item.name,
    provinceCode: item.code,
    cityShow: false,
    cityName: "",
    cityCode: null,
    formShow: true,
  };
  status.value = iStatus;
  statusStark.value.push(status.value);

  getChartData(item.addrcode, 1);
};
// 计算
// const pageTitle = computed(() => {
//   return status.value.provinceName + " " + status.value.cityName;
// });
const goBack = () => {
  // 使用栈记录状态
  currentPage.value = 1;
  statusStark.value.pop();
  const iStatus = statusStark.value[statusStark.value.length - 1];
  status.value = iStatus;

  if (iStatus.provinceShow) {
    getProvinceDataNewList();
  } else {
    getCityDataNewList(addrcode.value);
  }
};
const chartValue = ref<any>({});
const chartId = ref('')
const chartIndex = ref('')
// 获取列表
const getChartData = async (addrcode: any, index: any) => {
  let code = {
    provinceCode: "",
    cityCode: "",
  };
  chartId.value = addrcode
  chartIndex.value = index
  status.value.provinceCode ? (code.provinceCode = status.value.provinceCode) : "";
  status.value.cityCode ? (code.cityCode = status.value.cityCode) : "";
  let res: any;
  if (locale.value === "zh") {
    res = await provinceChart_API({
      stTime: timestampToTime(timeRange.value[0]),
      etTime: timestampToTime(timeRange.value[1]),
      addrcode: addrcode,
    });
  } else {
    if (index === 1) {
      res = await provinceChartSea_API({
        stTime: timestampToTime(timeRange.value[0]),
        etTime: timestampToTime(timeRange.value[1]),
        continentId: addrcode,
      });
    } else {
      res = await provinceChartSea_API({
        stTime: timestampToTime(timeRange.value[0]),
        etTime: timestampToTime(timeRange.value[1]),
        countryCode: addrcode,
      });
    }
  }
  const data = res.data;
  chartValue.value = res.data;
  if (data.length == 0) {
    ElMessage.warning(t("work.noData"));
  }
  const dateData = data.timeList;
  const farmData = data.carStatPaddyOneVOS;
  if(locale.value.includes('zh')) {
    const beforeArea = farmData.map((item: any) => {
    return item.beforeArea;
  });
  const beforeDuration = farmData.map((item: any) => {
    return item.beforeDuration;
  });
  ChartCreate(dateData, beforeArea, beforeDuration);
  } else {
    const beforeArea = farmData.map((item: any) => {
    return (item.beforeArea/15).toFixed(2);
  });
  const beforeDuration = farmData.map((item: any) => {
    return (item.beforeDuration/15).toFixed(2);
  });
  ChartCreate(dateData, beforeArea, beforeDuration);
  }

};
let provinceChart: any;
function initChart() {
  var chartDom = document.getElementById("provinceChart");
  provinceChart = echarts.init(chartDom);
}
function ChartCreate(date: any, x: any, y: any) {
  var option;
  const dateList = date;
  const valueListx = x;
  const valueListy = y;
  option = {
    // title: {
    //   //标题组件
    //   text: ` {a|} ${t("statisticsReport.thousandArea")}`, //'循环泵历史状态',
    //   textStyle: {
    //     fontSize: 14,
    //     fontWeight: 400,
    //     color: "#565656",
    //   },
    // },
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: [
      {
        axisLabel: {
          formatter: function (params: any) {
            //x轴时间换行问题
            var newParamsName = "";
            var paramsNameNumber = params.length;
            var provideNumber = 11;
            var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
            if (paramsNameNumber > provideNumber) {
              for (var p = 0; p < rowNumber; p++) {
                var tempStr = "";
                var start = p * provideNumber;
                var end = start + provideNumber;
                if (p == rowNumber - 1) {
                  tempStr = params.substring(start, paramsNameNumber);
                } else {
                  tempStr = params.substring(start, end) + "\n";
                }
                newParamsName += tempStr;
              }
            } else {
              newParamsName = params;
            }
            return newParamsName;
          },
          textStyle: {
            color: "#363636",
            fontSize: "10",
          },
        },
        axisTick: {
          show: false, // 是否显示坐标轴刻度
        },

        splitNumber: 10,
        boundaryGap: false,
        data: dateList,
        // splitLine: {
        //   show: true,
        //   lineStyle: {
        //     color: "#CBDBF2",
        //   },
        // },

        axisLine: {
          show: true,
          lineStyle: {
            color: "#CBDBF2",
          },
        },
      },
    ],
    yAxis: [
      {
        name: `  ${t("statisticsReport.thousandArea")}`,
        type: "value",
        // max: function (value: any) {
        //   // console.log(value);
        //   if (value.max !== -Infinity) {
        //     return value.max;
        //   } else {
        //     return 100;
        //   }
        // },
        // min: function (value: any) {
        //   if (value.min !== Infinity) {
        //     return value.min;
        //   } else {
        //     return 0;
        //   }
        // },
        splitNumber: 5,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false, // 是否显示坐标轴刻度
        },
        splitLine: {
          show: true,
        },
      },
      {
        name: ` ${t("statisticsReport.CumulativeDuration") + "(h)"}`,
        alignTicks: true,
        type: "value",
      },
    ],
    series: [
      {
        name: `${t("work.acreage")}`,
        showSymbol: true, //是否默认展示圆点
        type: "line",
        data: valueListx,
        yAxisIndex: 0,
        lineStyle: {
          color: "#227AC1",
        },
        areaStyle: {
          // 折现下是否填充
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(34, 122, 193, 1)", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(255, 255, 255, 0.1)", // 100% 处的颜色
              },
            ],
            global: false,
          },
        },
      },
      {
        name: `${t("statisticsReport.workingHours")}`,
        showSymbol: true, //是否默认展示圆点
        type: "line",
        yAxisIndex: 1,
        data: valueListy,
        lineStyle: {
          color: "#30A925",
        },
        areaStyle: {
          // 折现下是否填充
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(48, 169, 37, 1)", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(255, 255, 255, 0.1)", // 100% 处的颜色
              },
            ],
            global: false,
          },
        },
      },
    ],
    dataZoom: [
      {
        type: "inside", //详细配置可见echarts官网
      },
    ],
    color: ["#227AC1", "#30A925"],
    legend: {
      icon: "rectangle",
      // right: "10%",
      // top: "10",
      data: [t("work.acreage"), t("statisticsReport.workingHours")],
    },
  };
  provinceChart.setOption(option);
  nextTick(() => {
    provinceChart.resize();
  });
}
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
const getProvinceDataNewList = async () => {
  if (locale.value === "zh") {
    const res: any = await catStartList_API({
      stTime: timestampToTime(timeRange.value[0]),
      etTime: timestampToTime(timeRange.value[1]),
    });
    provinceCountData.value = res.data;
  } else {
    const res: any = await catStartSeaList_API({
      stTime: timestampToTime(timeRange.value[0]),
      etTime: timestampToTime(timeRange.value[1]),
      continentId: -1,
    });
    provinceCountData.value = res.data;
  }
};

onMounted(() => {
  initChart();
  getProvinceDataNewList();
  window.addEventListener("resize", () => {
    provinceChart.resize();
  });
});
onUnmounted(() => {
  window.removeEventListener("resize", () => {
    provinceChart.resize();
  });
  provinceChart.dispose();
});
</script>

<style lang="scss" scoped>
.province_card,
.city_card {
  color: black;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  position: relative;

  .car_item_online {
    background-color: #e7ffe6 !important;
  }
  .province_card_item,
  .city_card_item {
    width: 300px;

    background: url("@/assets/common/city_back.png");
    background-size: cover;
    border-radius: 5px;
    padding: 10px;
    margin: 10px;
    transition: all 0.25s;
    box-sizing: border-box;

    .item_title {
      display: flex;
      justify-content: space-between;
      padding: 5px;
      .cityline {
        display: flex;
        align-items: center;
      }
      .item_title_province {
        align-items: center;
        display: flex;
        font-size: 16px;
        font-weight: bold;
        text-align: left;
        svg {
          cursor: pointer;
        }
        span {
          font-size: 12px;
          cursor: pointer;
          color: #4cb04f;
          line-height: 14px;
        }
        div {
          height: 26px;
          min-width: 69px;
          border-radius: 8px;
          background-color: #4cb04f;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .item_title_city {
        font-size: 14px;
        color: #4cb04f;
        cursor: pointer;
        text-align: right;
        padding-right: 10px;
      }
    }

    .item_text {
      font-size: 14px;
      color: #333333;
      padding: 10px 0px;
      text-align: left;
      .title_data {
        width: 100%;
        display: flex;

        div {
          display: flex;
          justify-content: center;
          width: 33%;
        }
      }
    }

    .item_count {
      text-align: left;
      font-size: 22px;
      .title_data {
        width: 100%;
        display: flex;

        div {
          display: flex;
          justify-content: center;
          width: 33%;
          font-weight: bold;
          font-size: 32px;
          color: #4cb04f;
        }
      }
      // .item_count_each {
      //     display: flex;
      //     justify-content: center;
      //     align-items: center;
      //     >span {
      //         display: block;
      //     }
      // }
      .bold {
        font-size: 26px;
      }

      .online_car {
        color: #00c853;
      }
    }
    .bottom_data {
      width: 100%;
      div {
        display: flex;
        justify-content: space-between;
        width: 100%;
        font-size: 12px;

        .l {
          line-height: 24px;
          width: 50%;
          border-bottom: rgba(76, 176, 79, 0.15) 1px solid;
        }
        .r {
          line-height: 24px;
          width: 50%;
          border-bottom: rgba(76, 176, 79, 0.15) 1px solid;
          display: flex;
          justify-content: flex-end;
          margin-right: 5px;
        }
        .l2 {
          line-height: 24px;
          width: 50%;
        }
        .r2 {
          line-height: 24px;
          width: 50%;

          display: flex;
          justify-content: flex-end;
          margin-right: 5px;
        }
      }
    }
  }
}

.province_card_item:hover {
  // background-color: #E7FFE6;
  box-shadow: 5px 5px 10px gray;
}

.city_card_item:hover {
  // background-color: #E7FFE6;
  box-shadow: 5px 5px 10px gray;
}
.time {
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
    margin-left: 18px;
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
.time2 {
  height: 32px;
  display: flex;
  justify-content: flex-end;
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
    margin-right: 18px;
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
#provinceChart {
  height: 350px;
  width: 100%;
  background-color: #fff;
  border: 1px solid rgba(244, 248, 252, 0.46);
}
.tabletopline {
  div {
    margin: 8px;
  }
  .value {
    font-weight: bold;
    font-size: 24px;
    color: #4cb04f;
    line-height: 28px;
  }
  .value2 {
    font-weight: bold;
    font-size: 24px;

    line-height: 28px;
  }
  .privince_card {
    padding: 0 3px;
    height: 44px;
    min-width: 44px;
    background: #4cb04f;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn {
  background: transparent;
  color: var(--el-button-bg-color);
}
</style>
