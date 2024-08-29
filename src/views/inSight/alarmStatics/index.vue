<!--  -->
<template>
  <div class="app_container">
    <div class="table_container app_card">
      <div class="search_container">
        <div class="input_area">
          <el-select
            v-if="dealerList.length > 1"
            filterable
            v-model="pageInfo.companyId"
            class="input-with-select"
            :placeholder="$t('work.pleaseSelect')"
            @change="changeBlur1"
          >
            <el-option
              v-for="item in dealerList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
          <el-input
            style="width: 179px; margin-right: 20px"
            v-if="dealerList.length === 1"
            v-model="dealerList[0].name"
            disabled
          />
          <el-select-v2
            style="width: 350px"
            filterable
            v-model="pageInfo.id"
            :options="options"
            :placeholder="$t('work.pleaseSelect')"
            @change="changeBlur2"
          >
          </el-select-v2>
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
            <p :class="isActive == 1 ? 'active' : ''" @click="onDayClick">
              {{ $t("work.today") }}
            </p>
            <p :class="isActive == 2 ? 'active' : ''" @click="onMonthClick">
              {{ $t("work.thisMonth") }}
            </p>
            <p :class="isActive == 3 ? 'active' : ''" @click="onYearClick">
              {{ $t("work.thisYear") }}
            </p>
          </div>
        </div>
        <div class="number_area">
          <div class="l">
            <SvgIcon icon="allNum" size="22" style="margin-right: 15px" /> 告警总数:
          </div>
          <div class="r">{{ carChartValue.allSum }}</div>
        </div>
      </div>
      <!-- <div class="title_list">
        <div class="title">{{ t("statisticsReport.jobacres") }}</div>
        <div class="value">
          {{ carChartValue.beforeAreaSum * 1000 }}
        </div>
        <div class="title">{{ t("statisticsReport.CumulativeDuration") }}(h)</div>
        <div class="value">
          {{ carChartValue.beforeDurationSum * 1000 }}
        </div>
      </div> -->
      <div id="carChart"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref, reactive, onMounted, onUnmounted, nextTick } from "vue";
import { carDealer_API } from "@/api/machineryList/index";
import { alarmRecordChart_API } from "@/api/inSight/index";
import { getCarDealerList_API } from "@/api/jobManagement/index";
import { ElMessage } from "element-plus";
import SvgIcon from "@/components/SvgIcon/index.vue";
import * as echarts from "echarts";
const { t } = useI18n();
const timeRange = ref<any>([
  new Date(new Date().setHours(23, 59, 59, 999)).getTime() - 3600 * 1000 * 24 * 30,
  new Date(new Date().setHours(23, 59, 59, 999)).getTime(),
]);
const isActive = ref<number>(2);
const pageInfo = reactive<any>({
  id: "",
  companyId: "",
});
const dealerList = ref<any[]>([]);
let carChart: any;
let options = <any>[];
let CarDealerList = ref<any[]>([]);
const carChartValue = ref<any>({});
const changeBlur1 = () => {
  carChart.clear();
  getDealerCarList();
  pageInfo.id = "请选择";
};
const changeBlur2 = () => {
  getCarChart();
};
const getCarChart = async () => {
  const res = await alarmRecordChart_API({
    ...pageInfo,
    stTime: timestampToTime(timeRange.value[0]),
    etTime: timestampToTime(timeRange.value[1]),
  });
  carChartValue.value = res.data;
  const data = res.data;
  if (data.length == 0) {
    ElMessage.warning("暂无数据");
  }
  const dateData = data.timeList;
  const farmData = data.alarmRecordOneVos;
  const sumCount = data.sumList.map((item: any) => {
    return item.count;
  });
  const a = farmData.map((item: any) => {
    return item[0].count;
  });
  const b = farmData.map((item: any) => {
    return item[1].count;
  });
  const c = farmData.map((item: any) => {
    return item[2].count;
  });
  const d = farmData.map((item: any) => {
    return item[4].count;
  });
  const e = farmData.map((item: any) => {
    return item[5].count;
  });
  const f = farmData.map((item: any) => {
    return item[6].count;
  });
  const g = farmData.map((item: any) => {
    return item[7].count;
  });
  const h = farmData.map((item: any) => {
    return item[8].count;
  });
  const i = farmData.map((item: any) => {
    return item[9].count;
  });
  const j = farmData.map((item: any) => {
    return item[10].count;
  });
  const k = farmData.map((item: any) => {
    return item[11].count;
  });

  //   const beforeDuration = farmData.map((item: any) => {
  //     return item.beforeDuration;
  //   });
  ChartCreate(dateData, a, b, c, d, e, f, g, h, i, j, k, sumCount);
};

function initChart() {
  var chartDom = document.getElementById("carChart");
  carChart = echarts.init(chartDom);
}

function ChartCreate(
  date: any,
  a: any,
  b: any,
  c: any,
  d: any,
  e: any,
  f: any,
  g: any,
  h: any,
  i: any,
  j: any,
  k: any,
  sumCount: any
) {
  var option;
  const dateList = date;
  const valueLista = a;
  const valueListb = b;
  const valueListc = c;
  const valueListd = d;
  const valueListe = e;
  const valueListf = f;
  const valueListg = g;
  const valueListh = h;
  const valueListi = i;
  const valueListj = j;
  const valueListk = k;

  option = {
    // title: {
    //   //标题组件
    //   text: ` 面积(千亩)`, //'循环泵历史状态',
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
      top: "30%",
      containLabel: true,
    },
    // toolbox: {
    //   feature: {
    //     saveAsImage: {},
    //   },
    // },
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
        name: `告警次数`,
        type: "value",
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
    ],
    series: [
      {
        name: `航向丢失`,
        showSymbol: true, //是否默认展示圆点
        type: "line",
        data: valueLista,

        lineStyle: {
          color: "#00CD0B",
        },
      },
      {
        name: `定位丢失`,
        showSymbol: true, //是否默认展示圆点
        type: "line",
        data: valueListb,
        lineStyle: {
          color: "#018431",
        },
      },
      {
        name: `电压过低`,
        showSymbol: true, //是否默认展示圆点
        type: "line",
        data: valueListc,

        lineStyle: {
          color: "#D4B500",
        },
      },
      {
        name: `电压过高`,
        showSymbol: true, //是否默认展示圆点
        type: "line",
        data: valueListd,
        lineStyle: {
          color: "#7E3000",
        },
      },
      {
        name: `前轮速率脱落丢失`,
        showSymbol: true, //是否默认展示圆点
        type: "line",
        data: valueListe,

        lineStyle: {
          color: "#F5F500",
        },
      },
      {
        name: `车身速率脱落丢失`,
        showSymbol: true, //是否默认展示圆点
        type: "line",
        data: valueListf,
        lineStyle: {
          color: "#8E8E00",
        },
      },
      {
        name: `电机丢失`,
        showSymbol: true, //是否默认展示圆点
        type: "line",
        data: valueListg,

        lineStyle: {
          color: "#FFEF71",
        },
      },
      {
        name: `智能方向盘丢失`,
        showSymbol: true, //是否默认展示圆点
        type: "line",
        data: valueListh,
        lineStyle: {
          color: "#00A5FF",
        },
      },
      {
        name: `RTK无数据`,
        showSymbol: true, //是否默认展示圆点
        type: "line",
        data: valueListi,

        lineStyle: {
          color: "#C66493",
        },
      },
      {
        name: `无RTK,单点平滑工作中`,
        showSymbol: true, //是否默认展示圆点
        type: "line",
        data: valueListj,
        lineStyle: {
          color: "#CFFF00",
        },
      },
      {
        name: `无线电源异常`,
        showSymbol: true, //是否默认展示圆点
        type: "line",
        data: valueListk,

        lineStyle: {
          color: "#CBD98F",
        },
      },
    ],
    dataZoom: [
      {
        type: "inside", //详细配置可见echarts官网
      },
    ],
    color: [
      "#00CD0B",
      "#018431",
      "#D4B500",
      "#7E3000",
      "#F5F500",
      "#8E8E00",
      "#FFEF71",
      "#00A5FF",
      "#C66493",
      "#CFFF00",
      "#CBD98F",
    ],
    legend: {
      icon: "rectangle",
      formatter: function (name: any) {
        let data = [
          { name: "航向丢失", value: sumCount[0] },
          { name: "定位丢失", value: sumCount[1] },
          { name: "电压过低", value: sumCount[2] },
          { name: "电压过高", value: sumCount[4] },
          { name: "前轮速率脱落丢失", value: sumCount[5] },
          { name: "车身速率脱落丢失", value: sumCount[6] },
          { name: "电机丢失", value: sumCount[7] },
          { name: "智能方向盘丢失", value: sumCount[8] },
          { name: "RTK无数据", value: sumCount[9] },
          { name: "无RTK,单点平滑工作中", value: sumCount[10] },
          { name: "无线电源异常", value: sumCount[11] },
        ];
        let tarValue = 0; // 目前的数值，由于data数据是string型，所以有这步

        for (let i = 0, l = data.length; i < l; i++) {
          if (data[i].name == name) {
            tarValue = data[i].value;
          }
        }
        let p = tarValue;

        return `{b|${"  " + name + " " + " " + p}} `;
      },
      textStyle: {
        fontSize: 14,
        align: "left",
        // 文字块背景色，一定要加上，否则对齐不会生效
        backgroundColor: "transparent",
        rich: {
          b: {
            width: 200,
            height:20,
            fontSize:14,
            lineHeight: 12,
          },
        },
      },
    },
  };
  carChart.setOption(option);
  nextTick(() => {
    carChart.resize();
  });
}
// 获取经销商下车辆列表
const getDealerCarList = async () => {
  const res: any = await getCarDealerList_API(pageInfo.companyId);
  // dataItems.value = []
  // pageData.value.pageIndex = 1
  if (res.data == null) {
    CarDealerList.value = [];
  } else {
    CarDealerList.value = res.data;
    options = CarDealerList.value.map((item: any, _idx) => {
      if (item.nameNpn.includes("()")) {
        return {
          value: item.id,
          label: item.nameNpn.split("(")[0],
        };
      } else {
        return {
          value: item.id,
          label: `${item.nameNpn}`,
        };
      }
    });

    pageInfo.id = res.data[0].id;
    getCarChart();
  }
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
const getDealerList = async () => {
  const res: any = await carDealer_API();
  if (res.data.length > 1) {
    dealerList.value = [{ id: "", name: t("devicelist.totalDealer") }, ...res.data];
    pageInfo.companyId = "";
  } else {
    dealerList.value = res.data;
    pageInfo.companyId = res.data[0].id;
  }
  getDealerCarList();
};
const changteTime = () => {
  isActive.value = 0;
  carChart.clear();
  getCarChart();
};
const onDayClick = () => {
  isActive.value = 1;
  timeRange.value = [
    new Date(new Date().setHours(0, 0, 0)).getTime() - 3600 * 1000 * 24,
    new Date(new Date().setHours(23, 59, 59, 999)).getTime(),
  ];
  carChart.clear();
  getCarChart();
};
//这个月
const onMonthClick = () => {
  isActive.value = 2;
  timeRange.value = [
    new Date(new Date().setHours(0, 0, 0)).getTime() - 3600 * 1000 * 24 * 30,
    new Date(new Date().setHours(23, 59, 59, 999)).getTime(),
  ];
  carChart.clear();
  getCarChart();
};
// 这一年
const onYearClick = () => {
  isActive.value = 3;
  timeRange.value = [
    new Date(new Date().setHours(0, 0, 0)).getTime() - 3600 * 1000 * 24 * 365,
    new Date(new Date().setHours(23, 59, 59, 999)).getTime(),
  ];
  carChart.clear();
  getCarChart();
};

getDealerList();

onMounted(() => {
  initChart();
  window.addEventListener("resize", () => {
    carChart.resize();
  });
});
onUnmounted(() => {
  window.removeEventListener("resize", () => {
    carChart.resize();
  });
  carChart.dispose();
});
</script>

<style lang="scss" scoped>
.search_container {
  display: flex;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: space-between;
  .input_area {
    display: flex;

    .input-with-select {
      width: 179px;
      height: 32px;
      opacity: 1;
      border-radius: 4px;
      margin-right: 20px;
    }

    .m-2 {
      width: 179px;
      height: 32px;
      opacity: 1;
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
        margin-left: 32px;
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

  .number_area {
    width: 246px;
    display: flex;
    align-items: center;
    background: url("@/assets/common/alarm_back.png");
    background-size: cover;
    .l {
      padding-left: 10px;
      width: 50%;
      display: flex;
      align-items: center;
      font-weight: 400;
      font-size: 12px;
      color: #000000;
      line-height: 14px;
    }
    .r {
      width: 50%;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 36px;
      color: #ed1c24;
      line-height: 42px;
    }
  }
  .button_area {
    .btn2 {
      width: 32px;
      height: 32px;
      border-radius: 4px;
      border: 1.5px solid var(--el-color-primary);
      color: var(--el-color-primary);
    }
  }
}
#carChart {
  height: 350px;
  width: 100%;
  background-color: #fff;
  border: 1px solid rgba(244, 248, 252, 0.46);
}
</style>
