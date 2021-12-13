<template>
  <div class="totalDeviceContainer">
    <el-row class="pagetitle">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <img
            src="@/assets/common/icon_return_normal.png"
            style="vertical-align: text-bottom;padding-right:10px;cursor:pointer;"
            @click="backToVersion"
          />
          报警记录
        </div>
      </el-col>
    </el-row>
    <!-- <div class="search_bar">
      <div class="input_area">
        <el-input
          size="small"
          @clear="resetData()"
          @keyup.enter.native="searchData()"
          clearable
          v-model="input"
          placeholder="全部报警内容"
        >
          <el-button
            :class="{'no_click': !input}"
            slot="append"
            icon="el-icon-search"
            @click="searchData()"
          ></el-button>
        </el-input>
      </div>
    </div>-->
    <div class="content">
      <div class="tableLeft">
        <el-table class="deviceTable" :data="alarmTable">
          <el-table-column type="index" width="80" label="序号" />
          <el-table-column prop="grade" label="报警等级">
            <template slot-scope="scope">
              <span>
                <i :class="scope.row.grade=='一级' ? 'el-icon-caret-top' : 'el-icon-caret-top color'"></i>
                {{ scope.row.grade }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="content" label="报警内容" />
          <el-table-column prop="time" label="报警时间" />
        </el-table>
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :total="total"
          :page-size="pageSize"
          :current-page="currentPageNum"
          @current-change="pageSelect"
        />
      </div>
      <div class="chartRight">
        <div class="warningContainer">
          <div class="right">
            <div id="warningPieChart" class="warningPieChart"></div>
            <div class="pieCount">
              <p>报警次数</p>
              <p>{{ total }}</p>
            </div>
          </div>
          <div class="left">
            <div class="warningItemContainer">
              <p class="countTitle">一级报警次数统计</p>
              <el-row>
                <el-col :span="12">集线器故障</el-col>
                <el-col :span="6">{{ concentratorObj.concentrator }}</el-col>
                <el-col :span="6">{{ concentratorObj.concentratorPer }}</el-col>
              </el-row>
              <el-row>
                <el-col :span="12">力矩电机故障</el-col>
                <el-col :span="6">{{ motorObj.motor }}</el-col>
                <el-col :span="6">{{ motorObj.motorPer }}</el-col>
              </el-row>
              <el-row>
                <el-col :span="12">智能方向盘故障</el-col>
                <el-col :span="6">{{ steeringWheelObj.steeringWheel }}</el-col>
                <el-col :span="6">{{ steeringWheelObj.steeringWheelPer }}</el-col>
              </el-row>
              <el-row>
                <el-col :span="12">智能方向盘电量过低</el-col>
                <el-col :span="6">{{ steeringWheelObj.steeringWheelEle }}</el-col>
                <el-col :span="6">{{ steeringWheelObj.steeringWheelElePer }}</el-col>
              </el-row>
              <el-row>
                <el-col :span="12">前轮速率陀螺故障</el-col>
                <el-col :span="6">{{ wheelSpeedObj.wheelSpeed }}</el-col>
                <el-col :span="6">{{ wheelSpeedObj.wheelSpeedPer }}</el-col>
              </el-row>
              <el-row>
                <el-col :span="12">车身速率陀螺故障</el-col>
                <el-col :span="6">{{ carSpeedObj.carSpeed }}</el-col>
                <el-col :span="6">{{ carSpeedObj.carSpeedPer }}</el-col>
              </el-row>
            </div>
            <div class="warningItemContainer">
              <p class="countTitle">二级报警次数统计</p>
              <el-row>
                <el-col :span="12">差分期龄过大</el-col>
                <el-col :span="6">{{ poorObj.poor }}</el-col>
                <el-col :span="6">{{ poorObj.poorPer }}</el-col>
              </el-row>
              <el-row>
                <el-col :span="12">横线偏差过大</el-col>
                <el-col :span="6">{{ lineObj.line }}</el-col>
                <el-col :span="6">{{ lineObj.linePer }}</el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/components/common/tool';
import { alarmRecordStatistics_path, alarmRecordList_path } from '@/api/vehicleManage'
import echarts from 'echarts'
export default {
  data() {
    return {
      concentratorObj: {
        concentrator: null,
        concentratorPer: null
      },
      motorObj: {
        motor: null,
        motorPer: null
      },
      steeringWheelObj: {
        steeringWheel: null,
        steeringWheelPer: null,
        steeringWheelEle: null,
        steeringWheelElePer: null
      },
      wheelSpeedObj: {
        wheelSpeed: null,
        wheelSpeedPer: null
      },
      carSpeedObj: {
        carSpeed: null,
        carSpeedPer: null
      },
      poorObj: {
        poor: null,
        poorPer: null
      },
      lineObj: {
        line: null,
        linePer: null
      },
      alarmTable: [],
      currentPageNum: 1,
      pageSize: 10,
      total: 0,
      input: '',
      isSizeChange: false,
      warningPieChart: null,
      carObj: {},
      warningPieData: [
        { value: 23, name: '一级报警次数统计' },
        { value: 10, name: '二级报警次数统计' }
      ]
    };
  },
  computed: {},
  watch: {
    isSizeChange() {
      this.initWarningPieChart();
    }
  },
  mounted() {
    // this.carObj = this.$route.query.data;
    this.carObj = this.$route.query.data;
    console.log(this.carObj, '----------------179')
    this.initWarningPieChart();
    window.onresize = () => {
      this.isSizeChange = !this.isSizeChange;
    };
    this.httpAlarm();
    this.httpChart();
  },
  methods: {
    backToVersion() {
      // this.$router.push("/page1/child4");
      // this.$router.push("/page2/child1");
      this.$router.go(-1);
    },
    pageSelect(index) {
      this.currentPageNum = index;
      this.httpAlarm();
    },
    searchData() {
      this.currentPage = 1;
      // this.loadData().then(total => {
      //   this.$message({
      //     showClose: true,
      //     message: `搜索到${total}条记录`,
      //     type: "success"
      //   });
      // });
    },
    httpChart() {
        alarmRecordStatistics_path({
          carId: this.carObj.id
        }).then(res => {
          try {
            if (res.data.data != {}) {
                let newObj = res.data.data
                for (let key in newObj) {
                  switch (Number(key)) {
                    case 0:
                      this.concentratorObj.concentrator = newObj[key].split(':')[0]
                      this.concentratorObj.concentratorPer = newObj[key].split(':')[1]
                      break;
                    case 1:
                      this.motorObj.motor = newObj[key].split(':')[0]
                      this.motorObj.motorPer = newObj[key].split(':')[1]
                      break;
                    case 2:
                      this.wheelSpeedObj.wheelSpeed = newObj[key].split(':')[0]
                      this.wheelSpeedObj.wheelSpeedPer = newObj[key].split(':')[1]
                      break;
                    case 3:
                      this.carSpeedObj.carSpeed = newObj[key].split(':')[0]
                      this.carSpeedObj.carSpeedPer = newObj[key].split(':')[1]
                      break;
                    case 4:
                      this.steeringWheelObj.steeringWheel = newObj[key].split(':')[0]
                      this.steeringWheelObj.steeringWheelPer = newObj[key].split(':')[1]
                      break;
                    case 5:
                      this.steeringWheelObj.steeringWheelEle = newObj[key].split(':')[0]
                      this.steeringWheelObj.steeringWheelElePer = newObj[key].split(':')[1]
                      break;
                    case 6:
                      this.poorObj.poor = newObj[key].split(':')[0]
                      this.poorObj.poorPer = newObj[key].split(':')[1]
                      break;
                    case 7:
                      this.lineObj.line = newObj[key].split(':')[0]
                      this.lineObj.linePer = newObj[key].split(':')[1]
                      break;
                  }
                }
            } else {
               this.$message.warning('数据为空');
            }
          } catch (err) {
            console.log(err);
          }
        });
    },
    httpAlarm() {
        alarmRecordList_path({
          carId: this.carObj.id,
          currentPage: this.currentPageNum,
          pageSize: this.pageSize
        }).then(res => {
          try {
            if (res.data.data.list.length != 0) {
              let arr = res.data.data.list;
              this.total = res.data.data.total
              arr.forEach(item => {
                switch (item.grade) {
                  case 1:
                    item.grade = '一级';
                    break;
                  case 2:
                    item.grade = '二级';
                    break;
                }
                switch (item.content) {
                  case 0:
                    item.content = '集线器';
                    break;
                  case 1:
                    item.content = '力矩电机';
                    break;
                  case 2:
                    item.content = '前轮速率陀螺';
                    break;
                  case 3:
                    item.content = '车身速率陀螺';
                    break;
                  case 4:
                    item.content = '多功能方向盘故障';
                    break;
                  case 5:
                    item.content = '多功能方向盘电量过低';
                    break;
                  case 6:
                    item.content = '差分龄期过大';
                    break;
                  case 7:
                    item.content = '横向偏差过大';
                    break;
                }
                item.time = formatDate(item.time);
              });
              this.alarmTable = arr;
            }
          } catch (err) {
            console.log(err);
          }
        });
    },
    initWarningPieChart() {
      let option = {
        color: ['#f2637b', '#fbd437'],

        tooltip: {
          trigger: this.warningPieData[0].value > 0 ? 'item' : 'none',
          formatter: '{b}: {c}',
          show: this.warningPieData[0].value > 0
        },
        series: [
          {
            type: 'pie',
            radius: ['60%', '80%'],
            data: this.warningPieData,
            hoverAnimation: this.warningPieData[0].value > 0,

            itemStyle: {
              normal: {
                label: {
                  // 此处为指示线文字
                  show: false
                },
                borderWidth: this.warningPieData.length == 1 ? 0 : 2,
                borderColor: '#fff'
              }
            }
          }
        ]
      };

      if (this.warningPieChart != null) {
        this.warningPieChart.dispose();
      }
      this.warningPieChart = echarts.init(
        document.getElementById('warningPieChart')
      );
      this.warningPieChart.setOption(option);
    }
  }
};
</script>
<style scoped lang='scss'>
    .totalDeviceContainer {
    overflow: hidden;

    .pagetitle {
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: left;
        background: #F5F7F9;
        box-sizing: border-box;
        padding-left: 20px;
        font-size: 18px;

    }

    .search_bar {
        $height: 46px;
        height: $height;
        line-height: $height;
        position: relative;
        display: flex;
        justify-content: space-between;
        padding-right: 20px;

        >div.input_area {
            width: 280px;
            padding-left: 10px;

            .no_click {
                pointer-events: none;
            }
        }
    }

    .content {
        display: flex;
        flex-wrap: wrap;
        margin-top: 40px;
        .tableLeft {
            width: 53%;
        }

        .chartRight {
            width: 45%;

            .warningContainer {
                display: flex;
                // align-items: center;
                padding: 0 10px;
                height: calc(100% - 31px);
                box-sizing: border-box;
                flex-direction: column;

                >div {
                    flex: 1;
                    height: calc(50% - 8px);
                    &.left {
                        // overflow: auto;
                        width: 40%;
                        height: auto;
                        text-align: left;
                        margin: 0 auto;
                        .warningItemContainer {
                            >div {
                                font-size: 14px;
                                line-height: 28px;
                                margin-left: 18px;

                                >.el-col {
                                    &:first-child {
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                    }

                                    &:not(:first-child) {
                                        text-align: right;
                                    }
                                }
                            }

                            &:first-child {
                                .countTitle:before {
                                    content: '';
                                    display: inline-block;
                                    width: 10px;
                                    height: 10px;
                                    background: #f2637b;
                                    margin-right: 8px;
                                }

                            }

                            &:last-child {
                                .countTitle:before {
                                    content: '';
                                    display: inline-block;
                                    width: 10px;
                                    height: 10px;
                                    background: #fbd437;
                                    margin-right: 8px;
                                }
                            }
                        }
                    }

                    &.right {
                        position: relative;

                        .warningPieChart {
                            height: 275px;
                            width: 275px;
                            margin: 0 auto;
                            margin-bottom: 20px;
                        }

                        .pieCount {
                            position: absolute;
                            top: 110px;
                            left: 50%;
                            margin-left: -32px;
                            text-align: center;

                            >p {
                                margin: 0;

                                &:first-child {
                                    color: #999999;
                                    margin-bottom: 5px;
                                }

                                &:last-child {
                                    font-size: 28px;
                                }
                            }
                        }
                    }

                }
            }
        }
    }

    .deviceTable {
        margin: 0 10px 20px;
        .el-icon-caret-top{
            font-size: 20px;
            vertical-align: middle;
            color: #FF0000;
            &.color{
                color: #FFBA37;;
            }
        }
        tr th {
            font-weight: normal;
            background: #F0F0F0;
            height: 40px;
            line-height: 40px;
            word-wrap: 700;
            text-overflow: ellipsis;
            color: #666;
            font-weight: 700;
            font-size: 15px;
            font-family: 'Avenir', Helvetica, Arial, sans-serif;
            position: relative;
            text-align: left;
            padding: 0 8px 0 0;
            white-space: nowrap;
        }
    }
}
</style>
