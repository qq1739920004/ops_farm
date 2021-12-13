<template>
  <div class="detailContainer">
    <el-row class="pagetitle">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <img src="@/assets/common/icon_return_normal.png" style="vertical-align: text-bottom;padding-right:10px;cursor:pointer;" @click="backToVersion" />详情</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" style="text-align:right">
        <el-button class="farButton" :disabled="messageData.onlineTcp===0?true:false" @click="clickLink">远程管理</el-button>
        <el-button class="dealButton" @click="clickEnter">处理</el-button>
      </el-col>
    </el-row>
    <el-row class="mainContent">
      <el-col :span="24">
        <div class="content">
          <div class="title">
            基本信息
            <span class="downIcon" @click="clickOpen">
              {{ openContent }}
              <i :class="isShow?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
            </span>
          </div>
          <div class="message">
            <div>
              <span>类型：</span>
              <span>{{ messageData.terminalType }}</span>
            </div>
            <div>
              <span>软件版本:</span>
              <span>{{ messageData.softwareVersion }}</span>
            </div>
            <div>
              <span>过期时间：</span>
              <span>{{ timeTrans(messageData.expirationTime) }}</span>
            </div>
            <div>
              <span>车辆厂家：</span>
              <span>{{ messageData.factory }}</span>
            </div>
            <div>
              <span>车辆型号：</span>
              <span>{{ messageData.model }}</span>
            </div>
            <a v-show="isShow" class="openClass">
              <div>
                <span>SN:</span>
                <span>{{ messageData.deviceSn }}</span>
              </div>
              <div>
                <span>车辆名称：</span>
                <span>{{ messageData.name }}</span>
              </div>
              <div>
                <span>车主姓名：</span>
                <span>{{ messageData.userName }}</span>
              </div>
              <div>
                <span>车主电话：</span>
                <span>{{ messageData.tel || "/" }}</span>
              </div>
              <div>
                <span>公司名称：</span>
                <span>{{ messageData.companyName }}</span>
              </div>
              <div>
                <span>设备所在地：</span>
                <span>{{ messageData.province }}</span>
              </div>
              <div>
                <span>车龄：</span>
                <span>{{ messageData.age }}</span>
              </div>
              <div>
                <span>创建人：</span>
                <span>{{ messageData.creatorName }}</span>
              </div>
              <div>
                <span>创建人电话：</span>
                <span>{{ messageData.creatorTel }}</span>
              </div>
              <div>
                <span>创建时间：</span>
                <span>{{ timeTrans(messageData.createTime) }}</span>
              </div>
              <div>
                <span>最近上线时间：</span>
                <span>{{ timeTrans(messageData.lastOnlineTime) }}</span>
              </div>
              <div>
                <span>在线时间总时长：</span>
                <span>{{ millisecondFormat(messageData.onlineTimeCount) }}</span>
              </div>
              <div>
                <span>最近自动驾驶时间：</span>
                <span>{{ timeTrans(messageData.lastAutoDriveTime) }}</span>
              </div>
              <div>
                <span>自动驾驶时间总时长：</span>
                <span>{{ millisecondFormat(messageData.autoDriveTimeCount) || "/" }}</span>
              </div>
            </a>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row class="alarmContent">
      <el-col :span="24">
        <div class="left">
          <div class="title">报警信息</div>
          <div v-if="alarmTable.length!=0" class="table">
            <el-table class="deviceTable" :data="alarmTable">
              <!-- <el-table-column type="index" width="80" label="序号"></el-table-column> -->
              <el-table-column prop="content" label="报警内容" />
              <el-table-column prop="grade" label="报警等级">
                <template slot-scope="scope">
                  <span>
                    <i
                      :class="scope.row.grade=='一级' ? 'el-icon-caret-top' : 'el-icon-caret-top color'"
                    ></i>
                    {{ scope.row.grade }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="content" label="报警模块" />
              <el-table-column prop="time" label="报警时间" />
            </el-table>
            <el-pagination
              background
              layout="total, prev, pager, next, jumper"
              :total="total"
              :page-size="pageSize"
              :current-page="currentPageNum"
              style="margin-top:10px;"
              @current-change="pageSelect"
            />
          </div>
          <div v-else style="color:#999999">
            暂无数据
          </div>
        </div>
      </el-col>
      <el-col :span="24">
        <div class="right">
          <div class="title">参数变更记录</div>
          <div class="table">
            <el-table class="deviceTable" :data="paramTable" :row-class-name="tableRowClass">
              <!-- <el-table-column type="index" width="80" label="序号"></el-table-column> -->
              <el-table-column prop="time" label="变更时间" width="180">
                <template slot-scope="scope">
                  <span>{{ scope.row.time }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="content" label="参数名称(变更前→变更后)">
                <template slot-scope="scope">
                  <span v-for="(item, index) in scope.row.content" :key="index" style="padding-right: 10px;">
                    {{ item.name }}(<span style="color:#FF0000">{{ item.oldParam }}</span>→<span style="color:#FF0000">{{ item.newParam }}</span>)
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row v-if="messageData.terminalType === 'AG360'" class="moduleContent">
      <el-col :span="24">
        <div class="content">
          <div class="title">模块信息</div>
          <div class="message">
            <div>
              <span>板卡固件号：</span>
              <span>{{ messageData.board || '/' }}</span>
            </div>
            <div>
              <span>EC20固件号：:</span>
              <span>{{ messageData.ec20 || '/' }}</span>
            </div>
            <div>
              <span>电台固件号：</span>
              <span>{{ messageData.radioStation || '/' }}</span>
            </div>
            <div>
              <span>车身IMU固件号：</span>
              <span>{{ messageData.wheelImu || '/' }}</span>
            </div>
            <div>
              <span>车身IMU_SN：</span>
              <span>{{ messageData.carImuSn || '/' }}</span>
            </div>
            <div>
              <span>前轮IMU固件号:</span>
              <span>{{ messageData.wheelImu || '/' }}</span>
            </div>
            <div>
              <span>前轮IMU_SN：</span>
              <span>{{ messageData.wheelImuSn || '/' }}</span>
            </div>
            <div>
              <span>电机固件号：</span>
              <span>{{ messageData.motor || '/' }}</span>
            </div>
            <div>
              <span>电机SN：</span>
              <span>{{ messageData.motorSn || '/' }}</span>
            </div>
            <div>
              <span>多功能方向盘固件号：</span>
              <span>{{ messageData.steeringWheel || '/' }}</span>
            </div>
            <div>
              <span>多功能方向盘SN：</span>
              <span>{{ messageData.steeringWheelSn || '/' }}</span>
            </div>
            <div>
              <span>Hub蓝牙固件号：</span>
              <span>{{ messageData.hubBluetooth || '/' }}</span>
            </div>
            <div>
              <span>Hub固件号：</span>
              <span>{{ messageData.hub || '/' }}</span>
            </div>
            <div>
              <span>Hub_SN：</span>
              <span>{{ messageData.hubSn || '/' }}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row class="parmsContent">
      <el-col :span="24">
        <div class="content">
          <div class="title">参数信息</div>
          <div class="secondTitle">
            <span>|</span>
            <span>差分信息</span>
          </div>
          <div v-if="radioType === 0" class="message">
            <div>
              <span>工作模式：</span>
              <span>内置电台</span>
            </div>
            <div>
              <span>协议:</span>
              <span>{{ radioParamModel.protocol }}</span>
            </div>
            <div>
              <span>信道：</span>
              <span>{{ custom }}</span>
            </div>
            <div>
              <span>模式：</span>
              <span>{{ radioParamModel.radioStatus }}</span>
            </div>
            <div>
              <span>功率：</span>
              <span>{{ radioParamModel.radioPower }}</span>
            </div>
            <!-- <div>
              <span>差分期龄:</span>
              <span>AG302</span>
            </div> -->
          </div>
          <div v-if="radioType === 1" class="message">
            <div>
              <span>工作模式：</span>
              <span>内置网络</span>
            </div>
            <div>
              <span>服务器ip:</span>
              <span>{{ netParamModel.insideHost }}</span>
            </div>
            <div>
              <span>端口：</span>
              <span>{{ netParamModel.insidePort }}</span>
            </div>
            <div>
              <span>源节点：</span>
              <span>{{ netParamModel.insideSourceNode }}</span>
            </div>
            <div>
              <span>用户名：</span>
              <span>{{ netParamModel.insideUsername }}</span>
            </div>
            <div>
              <span>密码：</span>
              <span>{{ netParamModel.insidePassword }}</span>
            </div>
            <!-- <div>
              <span>差分期龄:</span>
              <span>AG302</span>
            </div> -->
          </div>
          <div v-if="radioType === 3" class="message">
            <div>
              <span>工作模式：</span>
              <span>罗网</span>
            </div>
          </div>
          <div class="secondTitle">
            <span>|</span>
            <span>车辆参数</span>
          </div>
          <div class="message">
            <div v-for="(value, key, index) in carParamModel" :key="index">
              <span>{{ carParamDes[key]?carParamDes[key].name:'' }}：</span>
              <span>{{ carParamModel[key] }}</span>
            </div>
          </div>
          <div class="secondTitle">
            <span>|</span>
            <span>校准参数</span>
          </div>
          <div class="message">
            <div v-for="(value, key, index) in calibParamModel" :key="index">
              <span>{{ calibParamDes[key]?calibParamDes[key].name:'' }}：</span>
              <span>{{ calibParamModel[key] }}</span>
            </div>
          </div>
          <div class="secondTitle">
            <span>|</span>
            <span>PID参数</span>
          </div>
          <div class="message">
            <div v-for="(value, key, index) in pidParamModel" :key="index">
              <span>{{ pidParamDes[key]?pidParamDes[key].name:'' }}：</span>
              <span>{{ pidParamModel[key] }}</span>
            </div>
          </div>
          <div v-if="messageData.terminalType === 'AG302'">
            <div class="secondTitle">
              <span>|</span>
              <span>PID曲线参数</span>
            </div>
            <div class="message">
              <div v-for="(value, key, index) in pidCurve.model" :key="index">
                <span>{{ pidCurve.des[key]?pidCurve.des[key].name:'' }}：</span>
                <span>{{ pidCurve.model[key] }}</span>
              </div>
            </div>
            <div class="secondTitle">
              <span>|</span>
              <span>PID超低速参数</span>
            </div>
            <div class="message">
              <div v-for="(value, key, index) in pidLowSpeed.model" :key="index">
                <span>{{ pidLowSpeed.des[key]?pidLowSpeed.des[key].name:'' }}：</span>
                <span>{{ pidLowSpeed.model[key] }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- <el-row class="parmsContent">
      <el-col :span="24">
        <div class="content">
          <div class="title">处理措施</div>
          <div class="secondTitle">已与农机手联系，通过远程参数设置解决问题</div>
          <div class="message">
            <div style="width:auto">
              <span>2020-11-30 10:33:02</span>
              <span style="color:#8c8c8c;margin-left:30px">处理人:王聪</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row> -->
    <el-dialog title="指派" :visible.sync="enterDialogVisible" width="467px" center class="dealDialog">
      <el-form ref="addDeviceForm" :model="addDeviceForm" class="addDeviceFormContainer" :rules="addDeviceFormRules" label-width="120px" label-position="left">
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="addDeviceForm.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="继续指派：">
          <el-select v-model="addDeviceForm.region" placeholder="请选择" clearable @change="changePro">
            <el-option
              v-for="(item,index) in optionsPro"
              :key="index"
              :label="item.name"
              :value="item"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.tel }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align: center;">
        <el-button type="primary" :disabled="disabled" @click="enterConfirm">指派</el-button>
        <el-button type="primary" :disabled="!disabled" class="buttonBlue" @click="enterConfirm">完成处理</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
let paramsData = null;
import { formatDate } from '@/components/common/tool.js';
import { alarmRecordList_path, paramChangeRecordGet_path, carList_path,
paramDescribe_path, carParamGet_path, calibParamGet_path,
pidParamGet_path, pidCurveParamGet_path, pidSlsParamGet_path, handlerList_path, helpUpdate_path } from '@/api/handle'
export default {
  data() {
    return {
      enterDialogVisible: false,
      disabled: true,
      addDeviceForm: {
        region: '',
        remark: ''
      },
     handId: '',
      addDeviceFormRules: {
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      },
      optionsPro: [],
      openContent: '展开',
      isShow: false,
      paramTable: [],
      // currentPageParam: 1,
      // pageSizeParam: 10,
      // totalParam: 0,
      alarmTable: [],
      currentPageNum: 1,
      pageSize: 10,
      total: 0,
      messageData: {},
      // 车辆参数
      carParamDes: {},
      carParamModel: {},
      // 校准参数
      calibParamDes: {},
      calibParamModel: {},
      // pid参数
      pidParamDes: {},
      pidParamModel: {},
      // pid 曲线参数
      pidCurve: {
          model: {},
          des: {}
      },
      // pid 超低速参数
      pidLowSpeed: {
          model: {},
          des: {}
      },
      // 差分信息 内置电台
      radioParamModel: {
        protocol: null,
        radioChannel: null,
        radioStatus: null,
        radioPower: null
      },
      // 差分信息 内置网络
      netParamModel: {
        insideHost: '',
        insidePort: '',
        insideSourceNode: '',
        insideUsername: '',
        insidePassword: ''
      },
      // 内置电台 信道
      custom: 0,
      // 区分差分信息类型
      radioType: 0,
      setArr: []
    };
  },
  watch: {
      'addDeviceForm.region': function(newVal) {
            if (newVal) {
              this.disabled = false
            } else {
              this.disabled = true
            }
      }
  },
  mounted() {
    paramsData = this.$route.query.data;
    paramsData ? localStorage.setItem('paramsData', JSON.stringify(paramsData)) : paramsData = JSON.parse(localStorage.getItem('paramsData'))
    this.loadData();
    this.httpAlarm();
    this.httpParam();
    this.getCarParam();
    this.getCalibParam();
    this.getPidParam();
    if (paramsData.terminalType != 'AG360' && paramsData.terminalType != 'AG360Pro') {
      this.getPidCurveParam()
      this.getPidLowSpeedParam()
    }
  },
  methods: {
    timeTrans(tiemStamp) {
			if (!tiemStamp) return '/'
			return new Date(tiemStamp)
				.toLocaleString('chinese', { hour12: false })
				.split('/')
				.join('-');
		},
    millisecondFormat(millisecond) {
			try {
				let second = Math.round(millisecond / 1000); // 四舍五入
				let days, hours, minute, left;
				if (second >= 24 * 3600) {
					days = parseInt(second / (24 * 3600));
					left = second - days * 24 * 3600;
					hours = parseInt(left / 3600);
					left = left - hours * 3600;
					minute = parseInt(left / 60);
					left = left - minute * 60;
					return `${days}天 ${hours}小时 ${minute}分钟 ${left}秒`
				}
				if (second >= 3600) {
					hours = parseInt(second / 3600);
					left = second - hours * 3600;
					minute = parseInt(left / 60);
					left = left - minute * 60;
					return `${hours}小时 ${minute}分钟 ${left}秒`
				}
				if (second >= 60) {
					minute = parseInt(second / 60);
					left = second - minute * 60;
					return `${minute}分钟 ${left}秒`
				}
				if (second >= 0) {
					return `${second}秒`
				}
			} catch (error) {
				console.log(error);
				return 'error';
			}
		},
    // 报警列表
    httpAlarm() {
        alarmRecordList_path({
          carId: paramsData.carId,
          //  carId: 553,
          currentPage: this.currentPageNum,
          pageSize: this.pageSize
        }).then(res => {
          try {
            if (res.data.data.list.length != 0) {
              let arr = res.data.data.list;
              this.total = res.data.data.total;
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
    // 参数变更列表
    httpParam() {
        paramChangeRecordGet_path({
          carId: paramsData.carId
        }).then(res => {
          try {
            if (res.data.data != {}) {
              // 过滤参数变更记录由于类型变化而变化的值。
              let filterParams = {};
              for (let key in res.data.data) {
                let value = res.data.data[key].filter(element => !(element.newParam == element.oldParam));
                if (value.length === 0) continue;
                filterParams[key] = value;
              }
              let paramObj = filterParams;
              for (let item in paramObj) {
                this.paramTable.push(
                  {
                    time: formatDate(Number(item)),
                    content: paramObj[item]
                    }
                  )
              }
              this.paramTable.sort(function(a, b) {
                return a.time < b.time ? 1 : -1;
              })
              let isStop = true
              let day = null
              let firstData = new Date(this.paramTable[0].time).getDate()
              this.paramTable.forEach(function(item) {
                if (firstData == new Date(item.time).getDate()) {
                  item.corlNum = 0
                } else if (isStop) {
                  day = new Date(item.time).getDate()
                  item.corlNum = 1
                  isStop = false
                } else if (day == new Date(item.time).getDate()) {
                   if (isStop) {
                      item.corlNum = 0
                   } else {
                      item.corlNum = 1
                   }
                 } else {
                     isStop = true
                      item.corlNum = 0
                 }
              })
            }
          } catch (err) {
            console.log(err);
          }
        });
    },
    tableRowClass(val) {
      if (val.row.corlNum == 0) {
        return 'row-bg';
      }
    },
    // 基本信息
    loadData() {
        carList_path({
          currentPage: 1,
          pageSize: 10,
          // name: "S10001091000",
          name: paramsData.sn,
          field: 0,
          order: 2
        }).then(res => {
          try {
            this.messageData = res.data.page.list.map(item => {
              return { ...item, ...item.car };
            });
            this.messageData = this.messageData[0]
            this.getRadioParam(this.messageData)
            this.getNetParam(this.messageData)
          } catch (err) {
            this.loading = false;
            console.log(err);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 获取参数描述
    async getParamDes(version = 0, type = 0, paramType) {
      let paramTypeTrans = {
          car: '车辆参数',
          calib: '校准参数',
          pid: 'PID参数',
          pid_curve: 'PID曲线参数',
          pid_superLowSpeed: 'PID超低速参数'
      };
      let des = await paramDescribe_path({
          version: version,
          type: type,
          paramType: paramType
      }).then(res => {
          try {
              let paramDes = (res.data.paramVersion && res.data.paramVersion.paramJson) ? JSON.parse(res.data.paramVersion.paramJson) : 0; // 0表示获取参数描述失败
              paramDes === 0 ? this.$message.warning(`${paramTypeTrans[paramType] || '参数'} 描述为空`) : '';
              return Promise.resolve(paramDes);
          } catch (err) {
              console.log(err);
              this.$message.warning('参数描述为空');
              return Promise.resolve(0);
          }
      });

      return des;
    },
    // 获取车辆参数
    async getCarParam() {
        let tem = await this.getParamDes(paramsData.version, paramsData.type, 'car');
        //  let tem = await this.getParamDes(4, 4, 'car');
        if (!tem) { return }
        this.carParamDes = tem;
        carParamGet_path({
            carId: paramsData.carId
              //  carId: 553,
        }).then(res => {
            try {
                if (res.data.data) {
                    let paramJSON = res.data.data.paramJson;
                    let paramData = JSON.parse(paramJSON);
                    this.carParamModel = null;
                    this.carParamModel = paramData;
                } else {
                    this.$message.warning('车辆参数为空')
                }
            } catch (err) {
                console.log(err);
            }
        })
    },
    // 获取校准参数
    async getCalibParam() {
        let tem = await this.getParamDes(paramsData.version, paramsData.type, 'calib');
        // let tem = await this.getParamDes(4, 4, 'calib');
        if (!tem) { return }
        this.calibParamDes = tem;
        calibParamGet_path({
            carId: paramsData.carId
            //  carId: 553,
        }).then(res => {
            try {
                if (res.data.data) {
                    let paramJSON = res.data.data.paramJson;
                    let paramData = JSON.parse(paramJSON);
                    this.calibParamModel = null;
                    this.calibParamModel = paramData;
                } else {
                    this.$message.warning('校准参数为空')
                }
            } catch (err) {
                console.log(err);
            }
        })
    },
    // 获取PID参数
    async getPidParam() {
        let tem = await this.getParamDes(paramsData.version, paramsData.type, 'pid');
          // let tem = await this.getParamDes(4, 4, 'pid');
        if (!tem) { return }
        this.pidParamDes = tem;
        pidParamGet_path({
            carId: paramsData.carId
            // carId: 553,
        }).then(res => {
            try {
                if (res.data.data) {
                    let paramJSON = res.data.data.paramJson;
                    let paramData = JSON.parse(paramJSON);
                    this.pidParamModel = null;
                    this.pidParamModel = paramData;
                } else {
                    this.$message.warning('PID参数为空')
                }
            } catch (err) {
                console.log(err);
            }
        })
    },
    // 获取pid曲线参数
    async getPidCurveParam() {
        let tem = await this.getParamDes(paramsData.version, paramsData.type, 'pid_curve');
        // let tem = await this.getParamDes(24, 1, 'pid_curve');
        if (!tem) return;
        this.pidCurve.des = tem;
        pidCurveParamGet_path({
            carId: paramsData.carId
            // carId: 260,
        }).then(res => {
            try {
                if (!res.data.data) return;
                let paramJSON = res.data.data.paramJson;
                let paramData = JSON.parse(paramJSON);
                this.pidCurve.model = paramData;
            } catch (error) {
                console.log(error);
            }
        })
    },
    // 获取pid超低速参数
    async getPidLowSpeedParam() {
        let tem = await this.getParamDes(paramsData.version, paramsData.type, 'pid_superLowSpeed');
        // let tem = await this.getParamDes(24, 1, 'pid_superLowSpeed');
        if (!tem) return;
        this.pidLowSpeed.des = tem;
        pidSlsParamGet_path({
            carId: paramsData.carId
            // carId: 260,
        }).then(res => {
            try {
                if (!res.data.data) return;
                let paramJSON = res.data.data.paramJson;
                let paramData = JSON.parse(paramJSON);
                this.pidLowSpeed.model = paramData;
            } catch (error) {
                console.log(error);
            }
        })
    },
    // 获取电台
    getRadioParam(item) {
      try {
          for (let key in this.radioParamModel) {
              this.radioParamModel[key] = item[key];
          }
          this.custom = this.radioParamModel['radioChannel'] / 10000 || 0;
          this.radioType = item.workPattern
      } catch (err) {
          console.log(err);
      }
    },
    // 获取网络差分数据
    getNetParam(item) {
      try {
          for (let key in this.netParamModel) {
              this.netParamModel[key] = item[key] ? item[key] : null;
          }
      } catch (err) {
          console.log(err);
      }
    },
    clickOpen() {
      this.isShow = !this.isShow;
      this.isShow ? (this.openContent = '收起') : (this.openContent = '展开');
    },
    pageSelect(index) {
      this.currentPageNum = index;
      this.httpAlarm()
    },
    // pageSelectParam(index) {
    //   this.currentPageParam = index;
    // },
    clickEnter() {
      this.enterDialogVisible = true
      handlerList_path().then(res => {
          try {
              if (res.data.data) {
                 this.optionsPro = res.data.data.list;
              } else {
                  this.$message.warning('车辆参数为空')
              }
          } catch (err) {
              console.log(err);
          }
      })
    },
    clickLink() {
      this.$router.push({
          name: 'carList',
          params: {
            deviceSn: this.messageData.deviceSn
          }
      });
    },
    backToVersion() {
      this.$router.go(-1);
    },
    enterConfirm() {
      let postData = {
            id: paramsData.id,
            handlerId: this.handId,
            info: this.addDeviceForm.remark
      }
      this.$refs.addDeviceForm.validate((valid) => {
        if (valid) {
            helpUpdate_path(postData).then(res => {
            if (res.data == 1) {
                this.$message({
                  message: '指派成功',
                  type: 'success'
                });
                this.enterDialogVisible = false
                this.$router.go(-1)
            } else {
              this.$message({
                  message: '指派失败',
                  type: 'error'
                });
            }
          }).catch(function (error) { console.log(error); });
        }
      })
    },
    changePro(e) {
      this.addDeviceForm.region = e.name
      this.handId = e.id
    }
  }
};
</script>
<style lang="scss" scoped>
.detailContainer {
  margin: 0px 10px;
  overflow: auto;
  .dealButton{
    background: #4CB04F;
    color: #fff;
    padding: 7px 15px;
    margin: 10px 0;
  }
  .farButton{
    // background: #fff;
    // color: #333333;
    padding: 7px 15px;
    margin-right: 10px;
  }
  .pagetitle {
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 20px;
    text-align: left;
    background: #f5f7f9;
    box-sizing: border-box;
    padding-left: 20px;
  }
  .title {
    font-size: 16px;
    color: #101010;
    text-align: left;
    margin-bottom: 20px;
  }
  .content {
    padding: 10px;
    .downIcon {
      float: right;
      color: #4cb04f;
      font-size: 14px;
      cursor: pointer;
    }
    .message {
      margin-top: 10px;
      text-align: left;
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      > div {
        display: inline-block;
        font-size: 14px;
        color: #8c8c8c;
        width: 20%;
        margin-bottom: 10px;
        span:nth-child(2) {
          color: #101010;
        }
      }
    }
  }
  .mainContent {
    border: 1px solid #e1e1e1;
    .openClass {
      > div {
        display: inline-block;
        font-size: 14px;
        color: #8c8c8c;
        width: 20%;
        margin-bottom: 10px;
        span:nth-child(2) {
          color: #101010;
        }
      }
    }
  }
  .alarmContent {
    margin-top: 20px;
    .table{
      overflow: auto;
      height: 195px;
        .el-icon-caret-top{
          font-size: 20px;
          vertical-align: middle;
          color: #FF0000;
          &.color{
              color: #FFBA37;;
          }
        }
    }
    .left {
      padding: 10px;
      border: 1px solid #e1e1e1;
      max-height: 231px;
      margin-right: 5px;
      .table {
        margin-top: 20px;
      }
    }
    .right {
      padding: 10px;
      border: 1px solid #e1e1e1;
      height: auto;
      // margin-left: 5px;
      margin-top: 15px;
      .table{
        height: auto;
      }
    }
  }
  .moduleContent {
    // height: 159px;
    border: 1px solid #e1e1e1;
    margin-top: 20px;
  }
  .parmsContent {
    // height: 444px;
    border: 1px solid #e1e1e1;
    margin-top: 20px;
    margin-bottom: 20px;
    .secondTitle {
      text-align: left;
      font-size: 14px;
      color: #101010;
      margin-top: 10px;
      span:first-child {
        padding-right: 2px;
        vertical-align: text-bottom;
        color: #4cb04f;
        font-weight: 900;
      }
    }
  }
  .buttonBlue{
    float:right;
    background:#4CB04F;
     border-color: #4CB04F;
  }
  .is-disabled {
    background-color: #a0cfff!important;
    border-color: #a0cfff!important;
  }
}
</style>
<style lang='scss' scoped>
.el-table th {
  background: #f0f0f0;
  padding: 0;
}
  .dealDialog .el-form--label-left .el-form-item__label{
    text-align:right;
  }
  .dealDialog .el-dialog__body{
    padding-right:80px;
  }
  .el-table .row-bg{
    background: #cccccc;
  }
</style>
