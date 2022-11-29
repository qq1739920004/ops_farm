<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      @sort-change="handleSortChange"
    >
      <el-table-column type="index" width="50" label="序号" align="center" />

      <el-table-column
        prop="deviceSn"
        label="SN"
        width="140"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <i
            class="el-icon-map-location"
            :class="
              scope.row.onlineTcp === 0
                ? 'el-icon-map-location_offline'
                : 'el-icon-map-location_online'
            "
            style="position: relative; top: 1px"
            @click="redirectGisMap(scope.row.deviceSn)"
          >
          </i>
          <span>{{ scope.row.deviceSn || "/" }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="sunFlowerSn"
        label="向日葵SN"
        width="140"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.car.sunFlowerSn || "/" }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="userName"
        label="车主姓名"
        width=""
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.userName || "/" }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="model"
        label="车辆型号"
        width=""
        show-overflow-tooltip
      />

      <el-table-column
        prop="province"
        label="设备所在地"
        width=""
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.province || "/" }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="type" label="类型" width="" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.terminalType || "AG302" }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column
        prop="workArea"
        label="亩数"
        width="100"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.workArea
              ? scope.row.workArea.toFixed(2)
              : scope.row.workArea
          }}</span>
        </template>
      </el-table-column> -->

      <el-table-column
        prop="expirationTime"
        label="过期时间"
        width="110"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-tag
            :type="testExpiration(scope.row.expirationTime)['type']"
            size="small"
          >
            {{ testExpiration(scope.row.expirationTime)["text"] }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="softwareVersion"
        label="软件版本"
        width=""
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.softwareVersion || "/" }}</span>
        </template>
      </el-table-column>

      <el-table-column
        sortable="custom"
        prop="lastOnlineTime"
        label="最近上线时间"
        width=""
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.lastOnlineTime | dateTimeTrans }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="a" label="数据存储">
        <template slot-scope="scope">
          <el-switch
            class="switch"
            v-model="scope.row.isTransfer"
            :width="50"
            :active-value="true"
            :inactive-value="false"
            @change="changeIsTranfer(scope.row)"
            active-text="是"
            inactive-text="否"
          ></el-switch>
        </template>
      </el-table-column>

      <!-- 说明  离线和自动驾驶状态不可编辑 -->
      <el-table-column label="操作" width="370">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="getParamDetail(scope.row)"
            >详情</el-button
          >
          <el-button type="text" size="small" @click="toHistoryTrace(scope.row)"
            >历史轨迹</el-button
          >
          <!-- <el-button
            type="text"
            size="small"
            @click="popupLineABDialog(scope.row)"
            >AB线</el-button
          > -->

          <el-button
            type="text"
            size="small"
            :disabled="scope.row.onlineTcp === 0 || scope.row.driveState !== 0"
            @click="handleRemoteControl(scope.row)"
          >
            <el-tooltip
              class="item"
              effect="dark"
              :content="
                scope.row.onlineTcp === 0
                  ? '设备离线'
                  : scope.row.driveState !== 0
                  ? '自动驾驶状态禁止远程管理'
                  : ''
              "
              placement="top-start"
              :disabled="
                scope.row.onlineTcp !== 0 && scope.row.driveState === 0
              "
            >
              <span>远程管理</span>
            </el-tooltip>
          </el-button>

          <!-- v-show="['AG302'].includes(scope.row.terminalType)" -->
          <el-button
            type="text"
            size="small"
            :disabled="
              scope.row.onlineTcp === 0 || !registerAuthority || !isRegister
            "
            @click="handleRegist(scope.row)"
          >
            <el-tooltip
              placement="top-start"
              class="item"
              effect="dark"
              :disabled="scope.row.onlineTcp !== 0"
              :content="scope.row.onlineTcp === 0 ? '设备离线' : ''"
            >
              <span>注册</span>
            </el-tooltip>
          </el-button>

          <!-- <el-button
            v-if="['AG360', 'AG360Pro'].includes(scope.row.terminalType)"
            type="text"
            size="small"
            disabled
            @click="toAlarmRecord(scope.row)"
          >报警记录</el-button> -->
          <el-button
            type="text"
            :disabled="
              scope.row.type != 4 || scope.row.car.terminalType == 'AG302'
            "
            @click="toFileList(scope.row)"
            >文件存储</el-button
          >

          <!-- <el-button
            v-if="['AG360', 'AG360Pro'].includes(scope.row.terminalType)"
            type="text"
            size="small"
            disabled
            @click="toLogManage(scope.row)"
            >日志管理</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 详情 -->
    <el-dialog
      :visible.sync="dialogVisibleDetail"
      title="详情"
      width="680px"
      class="detailDialog"
    >
      <div v-loading="dialogVisibleDetailLoading">
        <el-row>
          <el-col :span="4"
            ><div class="grid-content detailL">SN：</div></el-col
          >
          <el-col :span="8"
            ><div class="grid-content">{{ detailData.deviceSn }}</div></el-col
          >
          <el-col :span="4"
            ><div class="grid-content detailL">在线状态：</div></el-col
          >
          <el-col :span="8">
            <div class="grid-content">
              <img
                style="position: relative; bottom: 1px; right: 0px"
                :src="
                  detailData.onlineTcp === 0 ? './img/o2.png' : './img/o3.png'
                "
              />
              {{ detailData.onlineTcp === 0 ? "离线" : "在线" }}
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4"
            ><div class="grid-content detailL">驾驶状态：</div></el-col
          >
          <el-col v-if="detailData.onlineTcp === 0" :span="8">
            <div class="grid-content">/</div>
          </el-col>
          <el-col v-else :span="8">
            <div v-if="detailData.driveState == 0" class="grid-content">
              未开始
            </div>
            <div v-if="detailData.driveState == 1" class="grid-content">
              入线
            </div>
            <div v-if="detailData.driveState == 2" class="grid-content">
              在线
            </div>
          </el-col>
          <el-col :span="4"
            ><div class="grid-content detailL">公司名称：</div></el-col
          >
          <el-col :span="8">
            <div class="grid-content" :title="detailData.companyName">
              {{ detailData.companyName }}
            </div>
          </el-col>
        </el-row>
        <el-row class="margin48">
          <el-col :span="4"
            ><div class="grid-content detailL">车主姓名：</div></el-col
          >
          <el-col :span="8">
            <div class="grid-content">{{ detailData.userName }}</div>
          </el-col>
          <el-col :span="4"
            ><div class="grid-content detailL">车主电话：</div></el-col
          >
          <el-col :span="8">
            <div class="grid-content">{{ detailData.tel || "/" }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4"
            ><div class="grid-content detailL">车辆名称：</div></el-col
          >
          <el-col :span="8"
            ><div class="grid-content">{{ detailData.name }}</div></el-col
          >
          <el-col :span="4"
            ><div class="grid-content detailL">车辆厂家：</div></el-col
          >
          <el-col :span="8"
            ><div class="grid-content">{{ detailData.factory }}</div></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="4"
            ><div class="grid-content detailL">车辆型号：</div></el-col
          >
          <el-col :span="8"
            ><div class="grid-content">{{ detailData.model }}</div></el-col
          >
          <el-col :span="4"
            ><div class="grid-content detailL">车龄：</div></el-col
          >
          <el-col :span="8"
            ><div class="grid-content">{{ detailData.age }}</div></el-col
          >
        </el-row>
        <el-row class="">
          <el-col :span="4"
            ><div class="grid-content detailL">创建人：</div></el-col
          >
          <el-col :span="8"
            ><div class="grid-content">
              {{ detailData.creatorName }}
            </div></el-col
          >
          <el-col :span="4"
            ><div class="grid-content detailL">创建人电话：</div></el-col
          >
          <el-col :span="8"
            ><div class="grid-content">{{ detailData.creatorTel }}</div></el-col
          >
        </el-row>
        <!-- 神牛固件信息 -->
        <div
          v-if="
            detailData.terminalType === 'AG360Pro' ||
            detailData.terminalType === 'AG360'
          "
        >
          <el-row class="margin48">
            <el-col :span="6"
              ><div class="grid-content detailL">板卡固件号：</div></el-col
            >
            <el-col :span="6"
              ><div class="grid-content" :title="detailData.board">
                {{ detailData.board || "/" }}
              </div></el-col
            >
            <el-col :span="6"
              ><div class="grid-content detailL">EC20固件号：</div></el-col
            >
            <el-col :span="6"
              ><div class="grid-content">
                {{ detailData.ec20 || "/" }}
              </div></el-col
            >
          </el-row>
          <el-row>
            <el-col :span="6"
              ><div class="grid-content detailL">电台固件号：</div></el-col
            >
            <el-col :span="6"
              ><div class="grid-content">
                {{ detailData.radioStation || "/" }}
              </div></el-col
            >
            <el-col :span="6"
              ><div class="grid-content detailL">车身IMU固件号：</div></el-col
            >
            <el-col :span="6"
              ><div class="grid-content">
                {{ detailData.carImu || "/" }}
              </div></el-col
            >
          </el-row>
          <el-row class="">
            <el-col :span="6"
              ><div class="grid-content detailL">车身IMU_SN：</div></el-col
            >
            <el-col :span="6"
              ><div class="grid-content">
                {{ detailData.carImuSn || "/" }}
              </div></el-col
            >
            <el-col :span="6"
              ><div class="grid-content detailL">前轮IMU固件号：</div></el-col
            >
            <el-col :span="6"
              ><div class="grid-content">
                {{ detailData.wheelImu || "/" }}
              </div></el-col
            >
          </el-row>
          <el-row>
            <el-col :span="6"
              ><div class="grid-content detailL">前轮IMU_SN：</div></el-col
            >
            <el-col :span="6"
              ><div class="grid-content">
                {{ detailData.wheelImuSn || "/" }}
              </div></el-col
            >
            <el-col :span="6"
              ><div class="grid-content detailL">电机固件号：</div></el-col
            >
            <el-col :span="6"
              ><div class="grid-content">
                {{ detailData.motor || "/" }}
              </div></el-col
            >
          </el-row>
          <el-row>
            <el-col :span="6"
              ><div class="grid-content detailL">电机SN：</div></el-col
            >
            <el-col :span="6"
              ><div class="grid-content">
                {{ detailData.motorSn || "/" }}
              </div></el-col
            >
            <el-col :span="6"
              ><div class="grid-content detailL">
                多功能方向盘固件号：
              </div></el-col
            >
            <el-col :span="6"
              ><div class="grid-content">
                {{ detailData.steeringWheel || "/" }}
              </div></el-col
            >
          </el-row>
          <el-row class="">
            <el-col :span="6"
              ><div class="grid-content detailL" style="white-space: nowrap">
                多功能方向盘SN：
              </div></el-col
            >
            <el-col :span="6"
              ><div class="grid-content">
                {{ detailData.steeringWheelSn || "/" }}
              </div></el-col
            >
            <el-col :span="6"
              ><div class="grid-content detailL">Hub蓝牙固件号：</div></el-col
            >
            <el-col :span="6"
              ><div class="grid-content">
                {{ detailData.hubBluetooth || "/" }}
              </div></el-col
            >
          </el-row>
          <el-row class="">
            <el-col :span="6"
              ><div class="grid-content detailL">Hub固件号：</div></el-col
            >
            <el-col :span="6"
              ><div class="grid-content">
                {{ detailData.hub || "/" }}
              </div></el-col
            >
            <el-col :span="6"
              ><div class="grid-content detailL">Hub_SN：</div></el-col
            >
            <el-col :span="6"
              ><div class="grid-content">
                {{ detailData.hubSn || "/" }}
              </div></el-col
            >
          </el-row>
        </div>
        <el-row class="margin48">
          <el-col :span="4"
            ><div class="grid-content detailL">创建时间：</div></el-col
          >
          <el-col :span="8">
            <div class="grid-content">
              {{ detailData.createTime | dateTimeTrans }}
            </div>
          </el-col>
          <el-col :span="4"
            ><div class="grid-content detailL">更新时间：</div></el-col
          >
          <el-col :span="8">
            <div class="grid-content">
              {{ detailData.updateTime | dateTimeTrans }}
            </div>
          </el-col>
        </el-row>
        <!-- 最后时间+总时长 -->
        <el-row class="">
          <el-col :span="8"
            ><div class="grid-content detailL">最近上线时间：</div></el-col
          >
          <el-col :span="8">
            <div class="grid-content">
              {{ detailData.lastOnlineTime | dateTimeTrans }}
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="grid-content detailL">在线时间总时长：</div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              {{ millisecondFormat(detailData.onlineTimeCount) || "/" }}
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="grid-content detailL">最近自动驾驶时间：</div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              {{ detailData.lastAutoDriveTime | dateTimeTrans }}
            </div></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="grid-content detailL">自动驾驶时间总时长：</div>
          </el-col>
          <el-col :span="8"
            ><div class="grid-content">
              {{ millisecondFormat(detailData.autoDriveTimeCount) || "/" }}
            </div></el-col
          >
        </el-row>
      </div>
    </el-dialog>

    <!-- 远程控制 -->
    <remote
      v-if="remoteControl"
      :marker-data="remoteScopeData"
      @closeMe="remoteControl = false"
    />

    <!-- 注册 -->
    <el-dialog
      :visible.sync="dialogVisibleRegist"
      width="630px"
      class="registDialogBig"
      title="注册设备"
    >
      <div class="registDialog">设备SN号：{{ registerData.deviceSn }}</div>
      <div class="registDialog">注册时长：</div>
      <el-radio-group v-model="registDate" @change="selectDateChange">
        <el-radio
          v-for="item in registerArr"
          :key="item.value"
          :label="item.value"
          >{{ item.name }}</el-radio
        >
      </el-radio-group>
      <div class="btndiv">
        <el-button type="primary" size="small" @click="registEmit"
          >设置</el-button
        >
      </div>
      <div class="period">注册有效期至：{{ period }}</div>
      <div slot="footer" class="dialog-footer"></div>
    </el-dialog>

    <!-- AB线 -->
    <el-dialog :visible.sync="dialogLineAB" title="AB线复用" width="690px">
      <div class="line_ab_container">
        <div class="line_ab_header">
          <div>附近在线车辆SN</div>
          <div>距离</div>
        </div>
        <el-collapse v-model="activeItem" accordion>
          <el-collapse-item
            v-for="(item, index) in neighborList"
            :key="index"
            :name="index"
          >
            <template slot="title">
              <div class="collapse_item_title">
                <div>
                  <i
                    class="el-icon-map-location"
                    style="color: #4cb04f; position: relative; top: 0px"
                  ></i>
                  <span>{{ item.sn }}</span>
                </div>
                <div>
                  {{ item.distance ? (item.distance * 1000).toFixed(1) : "/" }}
                  m
                </div>
              </div>
            </template>
            <div class="collapse_item_main">
              <el-row style="background-color: #f5f5f5; padding: 2px">
                <el-col :span="3" :offset="3">作业名称</el-col>
                <el-col :span="6">创建时间</el-col>
                <el-col :span="6">A点</el-col>
                <el-col :span="6">B点</el-col>
              </el-row>
              <el-row
                v-for="(subItem, subIndex) in item.paddyWorks"
                :key="subIndex"
                class="row_paddywork"
              >
                <el-col :span="2" :offset="1">
                  <el-radio
                    v-model="radio"
                    :label="subItem.id"
                    @change="handlePaddyWorkClick(subItem)"
                  >
                    <span style="visibility: hidden"> 0</span>
                  </el-radio>
                </el-col>
                <el-col :span="3">{{ subItem.name }}</el-col>
                <el-col :span="6">{{
                  subItem.createtime | dateTimeTrans
                }}</el-col>
                <el-col :span="6">
                  <div>{{ subItem.lineptax || "/" }}</div>
                  <div>{{ subItem.lineptay || "/" }}</div>
                </el-col>
                <el-col :span="6">
                  <div>{{ subItem.lineptbx || "/" }}</div>
                  <div>{{ subItem.lineptby || "/" }}</div>
                </el-col>
              </el-row>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div v-if="neighborList.length === 0" style="padding: 20px">
          暂无附近车辆
        </div>
        <div style="padding-top: 50px">
          <el-button type="primary" @click="handleReuseClick">复用</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import remote from "@/views/locationManage/components/remote";
import {
  logOpen_path,
  logClose_path,
  carDetail_path,
} from "@/api/vehicleManage";

import {
  activationCodeAdd_path,
  searchNearABPt_path,
  pushABPoint_path,
  permissionList,
} from "@/api/vehicleManage";
export default {
  components: {
    remote,
  },
  props: {
    tableData: {
      type: Array,
      required: true,
    },
    registerAuthority: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isRegister: true,
      dialogVisibleDetailLoading: true,
      registerArr1: [{ name: "3个月", value: 90 }],
      registerArr: [
        { name: "立即过期", value: -1 },
        { name: "3天", value: 3 },
        { name: "7天", value: 7 },
        { name: "15天", value: 15 },
        { name: "20天", value: 20 },
        { name: "1个月", value: 30 },
        { name: "2个月", value: 60 },
        { name: "6个月", value: 180 },
        { name: "1年", value: 365 },
        { name: "永久", value: 65535 },
      ],
      dialogVisibleDetail: false, // 详情弹窗状态
      remoteControl: false, // 远程管理弹窗状态
      dialogVisibleRegist: false, // 注册弹窗状态
      detailData: {}, // 详情弹窗模型
      dialogLineAB: false, // AB线弹窗
      remoteScopeData: {},
      registerData: {},
      registDate: 3,
      period: this.getPlusDayDate(3),
      activeItem: [],
      neighborList: [],
      radio: "",
      paddyWork: null,
      car: null,
    };
  },

  mounted() {
    this.getUserRole();
  },
  methods: {
    handleSortChange(data) {
      this.$emit("sortChange", data);
    },
    changeIsTranfer(row) {
      let params = {
        sn: row.sn,
      };

      if (row.isTransfer) {
        // 开
        logOpen_path(params).then((res) => {
          if (res.data.code == 200) {
            this.$message({ type: "success", message: "修改成功" });
          }
        });
      } else {
        logClose_path(params).then((res) => {
          if (res.data.code == 200) {
            this.$message({ type: "success", message: "修改成功" });
          }
        });
      }
    },
    //获取用户权限
    getUserRole() {
      permissionList({}).then((res) => {
        if (res.data.code == "ok") {
          let data = res.data.data;
          if (data.indexOf(77) > -1) {
          } else if (data.indexOf(83) > -1) {
            //只允许查看3天的注册时长
            this.registerArr.length = 1;
          } else if (data.indexOf(108) > -1) {
            //只允许查看3个月的注册时长
            this.registerArr = this.registerArr1;
            this.registDate = 90;
            this.selectDateChange(90);
          } else {
            this.isRegister = false;
          }
        }
      });
    },
    toFileList(row) {
      this.$router.push({
        path: "/vehicleManage/file",
        query: {
          pid: row.type == 4 ? 9004 : "",
          sn: row.sn,
        },
      });
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
          return `${days}天 ${hours}小时 ${minute}分钟 ${left}秒`;
        }
        if (second >= 3600) {
          hours = parseInt(second / 3600);
          left = second - hours * 3600;
          minute = parseInt(left / 60);
          left = left - minute * 60;
          return `${hours}小时 ${minute}分钟 ${left}秒`;
        }
        if (second >= 60) {
          minute = parseInt(second / 60);
          left = second - minute * 60;
          return `${minute}分钟 ${left}秒`;
        }
        if (second >= 0) {
          return `${second}秒`;
        }
      } catch (error) {
        console.log(error);
        return "error";
      }
    },

    registEmit() {
      console.log({
        carId: this.registerData.id,
        oemSn: this.registerData.deviceSn,
        deviceId: this.registerData.deviceId,
        date: this.registDate,
      });
      activationCodeAdd_path({
        carId: this.registerData.id,
        oemSn: this.registerData.deviceSn,
        deviceId: this.registerData.deviceId,
        date: this.registDate,
      }).then((res) => {
        try {
          if (res.data || res.data == 0) {
            if (res.data === 1) {
              this.$message.success("注册成功");
            } else {
              this.$message.warning("注册次数已达上限");
            }
            this.dialogVisibleRegist = false;
          } else {
            this.$message.warning("注册失败");
          }
        } catch (err) {
          console.log(err);
        }
      });
    },

    getPlusDayDate(days) {
      try {
        if (days === 65535) return "2197/6/6";
        let future = Date.now() + days * 24 * 3600 * 1000;
        return new Date(future).toLocaleDateString();
      } catch (error) {
        console.log(error);
      }
    },

    selectDateChange(val) {
      this.period = this.getPlusDayDate(val);
    },

    // 判断过期时间
    testExpiration(timeStamp) {
      try {
        let now = Date.now();
        let gap = Number(timeStamp) - now;
        let delta = 3 * 24 * 3600 * 1000;
        if (!timeStamp) return { type: "info", text: "/" };
        switch (true) {
          case gap <= 0:
            return { type: "danger", text: "已过期" };
          case gap >= 0 && gap <= delta:
            return { type: "warning", text: "3天后过期" };
          case gap > delta:
            return {
              type: "primary",
              text: new Date(timeStamp).toJSON().slice(0, 10),
            };
        }
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * @操作按钮
     */

    // 详情
    getParamDetail(item) {
      this.dialogVisibleDetail = true;
      this.dialogVisibleDetailLoading = true;
      let params = {
        carId: item.id,
      };
      carDetail_path(params).then((res) => {
        if (res.status == 200) {
          this.detailData = { ...item, ...res.data.carCustom };
          this.dialogVisibleDetailLoading = false;
        }
      });
    },

    // 远程管理
    /**
     * @说明carId等同于id
     * @carName等同于name
     * @oemSn等同于deviceSn
     */
    handleRemoteControl(scopeRow) {
      scopeRow.carId = scopeRow.carId ? scopeRow.carId : scopeRow.id;
      scopeRow.carName = scopeRow.carName ? scopeRow.carName : scopeRow.name;
      scopeRow.oemSn = scopeRow.oemSn ? scopeRow.oemSn : scopeRow.deviceSn;
      this.remoteScopeData = null;
      this.remoteScopeData = scopeRow;
      this.remoteControl = true;
    },

    // 注册
    handleRegist(item) {
      this.registerData = item; // 保存当前注册对象数据
      this.dialogVisibleRegist = true;
    },

    // 报警记录路由
    toAlarmRecord(item) {
      this.$router.push({
        path: "/vehicleManage/alarmRecord",
        query: {
          data: item,
        },
      });
    },

    // 历史轨迹路由
    toHistoryTrace(item) {
      // this.$router.push({
      // 	name: "historyRoute",
      // 	params: {
      // 		deviceSn: item.deviceSn,
      // 		provinceCode: item.addrcode && item.addrcode.substr(0, 2),
      // 	},
      // });
      this.$emit("showLocus", item);
    },

    // 日志管理
    toLogManage(item) {
      this.$router.push({
        path: "/vehicleManage/logManage",
        query: {
          data: item,
        },
      });
    },

    // 重定向到监控页面
    redirectGisMap(sn) {
      this.$router.push({
        name: "gisMonitoring",
        params: { deviceSn: sn },
      });
    },

    // AB线弹出
    popupLineABDialog(row) {
      this.dialogLineAB = true;
      this.car = row;
      this.getNeighborCar(row.sn);
    },

    // 获取附近车辆列表
    getNeighborCar(sn = "666666666666") {
      searchNearABPt_path({
        sn: sn,
        distance: 3,
      }).then((res) => {
        try {
          if (res.data.data) {
            this.neighborList = res.data.data;
          }
        } catch (error) {
          console.log(error);
        }
      });
    },

    handleReuseClick() {
      if (!this.radio) {
        this.$message.warning("请选择一个AB线信息");
        return;
      }
      this.$confirm("将下发基于当前AB线信息的作业，继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        pushABPoint_path({
          paddyWorkName: this.paddyWork.name,
          A: `${this.paddyWork.lineptax},${this.paddyWork.lineptay}`,
          B: `${this.paddyWork.lineptbx},${this.paddyWork.lineptby}`,
          sn: this.car.sn,
        }).then((res) => {
          if (res.data.code === 1) {
            this.$message.success("复用成功");
          } else {
            this.$message.success("下发失败，请稍后再试");
          }
        });

        this.dialogLineAB = false;
      });
    },

    // 保存作业信息
    handlePaddyWorkClick(e) {
      this.paddyWork = e;
    },
  },
};
</script>
<style scoped lang='scss'>
.el-icon-map-location {
  font-size: 16px;
  position: relative;
  bottom: 2px;
  right: 3px;
}
.el-icon-map-location_online {
  color: #52c41a;
  cursor: pointer;
}
.el-icon-map-location_offline {
  pointer-events: none;
  color: #cccccc;
}

.el-form-item__label {
  text-align: left;
  padding-left: 30px;
  box-sizing: border-box;
  white-space: nowrap;
}
.registDialogBig {
  .registDialog {
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: 15px;
    font-weight: bold;
    text-align: left;
  }
  .btndiv {
    margin: 10px 0;
  }
  .period {
    width: 100%;
    text-align: left;
  }
  .el-radio {
    margin-right: 0;
    width: 120px;
    text-align: left;
    padding: 5px 0px;
  }
}

.detailDialog .el-dialog__body {
  padding: 30px 0px 30px 80px;
  box-sizing: border-box;
}
.editDialog .el-dialog__body {
  padding: 10px 20px 20px 80px;
  box-sizing: border-box;
}
.detailDialog .el-row {
  box-sizing: border-box;
  margin: 0;
  font-size: 14px;
  text-align: left;
  line-height: 32px;
  color: #333333;
}
.margin48 {
  margin-top: 24px !important;
}
.grid-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.line_ab_container {
  height: 500px;
  .line_ab_header {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 5px;
  }
  .el-collapse-item__header {
    padding-left: 10px;
  }
  .collapse_item_title {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .collapse_item_main {
    text-align: left;
    .row_paddywork {
      border-bottom: 1px solid #eee;
      transition: all 0.2s;
    }
    .row_paddywork:hover {
      background-color: #f5f5f5;
    }
  }
}
</style>
<style scoped lang ='scss'>
.switch ::v-deep .el-switch__label {
  position: absolute;
  color: #fff !important;
  z-index: 1;
  display: none;
}
.switch ::v-deep .is-active {
  display: block;
}
.switch ::v-deep.el-switch__label--left span {
  margin-left: 20px;
}
.el-switch__label--left {
  margin-right: 0;
}
</style>
