<template>
  <div class="containerDetail">
    <page-head title="seekList" />
    <el-row class="searchbox">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark searchdiv">
          <el-input
            v-model="searchValue"
            placeholder="输入SN、电话"
            clearable
            class="input-with-select"
            @keyup.enter.native="loadData"
            @clear="loadData"
          >
            <el-button slot="append" icon="el-icon-search" @click="loadData" />
          </el-input>
        </div>
        <div class="selectItem">
          <span style="font-size: 14px">状态：</span>
          <el-select
            v-model="valuePro"
            placeholder="请选择"
            style="margin-right: 10px"
            @change="changePro"
          >
            <el-option
              v-for="(item, index) in optionsPro"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div class="awaitMessage">
            <span></span>
            <span>待处理</span>
            <span>{{ awaitNum }}</span>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row class="tablebox">
      <el-table :data="deviceData" style="width: 100%">
        <el-table-column type="index" width="50" label="序号" />
        <el-table-column
          prop="tel"
          label="电话"
          width=""
          show-overflow-tooltip
        />
        <el-table-column prop="sn" label="SN" width="" show-overflow-tooltip>
          <template slot-scope="scope">
            <i
              v-if="scope.row.dealstatus === '待处理'"
              class="el-icon-map-location"
              :class="
                scope.row.onlineTcp === 0
                  ? 'el-icon-map-location_offline'
                  : 'el-icon-map-location_online'
              "
              style="position: relative; top: 1px"
              @click="redirectGisMap(scope.row.sn)"
            ></i>
            <span>{{ scope.row.sn || "/" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <!-- <span class="yuan" :style="scope.row.bg"></span> -->
            <span :style="scope.row.bg">{{ scope.row.dealstatus }}</span>
          </template>
        </el-table-column>
        <!--  label="求救时间" -->
        <el-table-column prop="warntime" width="" show-overflow-tooltip>
          <template slot="header">
            <el-dropdown @command="sortRank">
              <span class="el-dropdown-link">
                求助时间
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="{ name: 'del', type: null }"
                >删除排序</el-dropdown-item>
                <el-dropdown-item
                  :command="{ name: 'desc', type: 'help_time' }"
                >降序排序</el-dropdown-item>
                <el-dropdown-item
                  :command="{ name: 'asc', type: 'help_time' }"
                >升序排序</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
            <div style="width: 100%">
              {{ scope.row.helpTime | dateTimeTrans }}
            </div>
          </template>
        </el-table-column>
        <!--  label="处理时间" -->
        <el-table-column prop="warntime" width="" show-overflow-tooltip>
          <template slot="header">
            <el-dropdown @command="sortRank">
              <span class="el-dropdown-link">
                处理时间
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="{ name: 'del', type: null }"
                >删除排序</el-dropdown-item>
                <el-dropdown-item
                  :command="{ name: 'desc', type: 'handle_time' }"
                >降序排序</el-dropdown-item>
                <el-dropdown-item
                  :command="{ name: 'asc', type: 'handle_time' }"
                >升序排序</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
            <div style="width: 100%">
              {{ scope.row.handleTime | dateTimeTrans }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="历时" width="" show-overflow-tooltip>
          <template slot-scope="scope">
            <div
              v-if="scope.row.dealstatus === '待处理'"
              style="width: 100%; color: #faad14"
            >
              {{
                scope.row.helpTime == null
                  ? "/"
                  : millisecondFormat(new Date().getTime() - scope.row.helpTime)
              }}
            </div>
            <div v-else style="width: 100%">
              {{
                scope.row.handleTime == null && scope.row.helpTime == null
                  ? "/"
                  : millisecondFormat(scope.row.handleTime - scope.row.helpTime)
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="handlerName"
          label="处理人"
          width=""
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div style="width: 100%">
              {{ scope.row.handlerName == null ? "/" : scope.row.handlerName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="managerName" label="管理员">
          <template slot-scope="scope">
            <div style="width: 100%">
              {{ scope.row.managerName == null ? "/" : scope.row.managerName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="warntime" width="" show-overflow-tooltip>
          <template slot="header">
            <el-dropdown @command="sortRank">
              <span class="el-dropdown-link">
                指派时间
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="{ name: 'del', type: null }"
                >删除排序</el-dropdown-item>
                <el-dropdown-item
                  :command="{ name: 'desc', type: 'assign_time' }"
                >降序排序</el-dropdown-item>
                <el-dropdown-item
                  :command="{ name: 'asc', type: 'assign_time' }"
                >升序排序</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
            <div style="width: 100%">
              {{ scope.row.assignTime | dateTimeTrans }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.info == null ? "/" : scope.row.info }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <span
              v-if="scope.row.dealstatus === '待处理'"
              class="optionbtn"
              @click="handleDetail(scope.$index, scope.row)"
            >处理</span>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end">
        <el-pagination
          background
          layout="total,prev, pager, next,jumper"
          :current-page="current"
          :page-size="pagesize"
          :total="total"
          @current-change="changePage"
        />
      </el-row>
    </el-row>
  </div>
</template>
<script>
import { helpList_path } from '@/api/handle';
/* eslint-disable */
export default {
  name: "Warnlog",
  data() {
    return {
      searchValue: "",
      current: 1,
      total: 0,
      pagesize: 10,
      deviceData: [],
      orderObj: {
        sortField: "",
        sortType: "",
      },
      optionsPro: [
        {
          label: "已处理",
          value: 2,
        },
        {
          label: "已指派",
          value: 1,
        },
        {
          label: "待处理",
          value: 0,
        },
        {
          label: "全部",
          value: null,
        },
      ],
      valuePro: null,
      awaitNum: 0,
    };
  },
  mounted() {
    this.loadData();
    this.messageCout();
  },
  methods: {
    messageCout() {
      this.$store.dispatch("index/setMessageNum");
      //     helpList_path({
      // 	currentPage: 1,
      // 	pageSize: 10,
      // 	name: "",
      // 	fieldName: "",
      // 	orderName: "",
      // 	status: 0,
      // }).then((response) => {
      // 	this.awaitNum = response.data.data.total;
      // 	this.$store.dispatch("index/setMessageNum", response.data.data.total);
      // })
      // .catch(function (error) {
      // 	console.log(error);
      // });
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
    timeTrans(tiemStamp) {
      if (!tiemStamp) return "/";
      return new Date(tiemStamp)
        .toLocaleString("chinese", { hour12: false })
        .split("/")
        .join("-");
    },
    redirectGisMap(sn) {
      this.$router.push({
        name: "gisMonitoring",
        params: { deviceSn: sn },
      });
    },
    changePro() {
      this.loadData();
    },
    sortRank(rankInfo) {
      this.orderObj.sortField = rankInfo.type;
      switch (rankInfo.name) {
        case "del":
          this.orderObj.sortType = null;
          break;
        case "desc":
          this.orderObj.sortType = "desc";
          break;
        case "asc":
          this.orderObj.sortType = "asc";
          break;
      }
      this.loadData();
    },
    loadData() {
      helpList_path({
        currentPage: this.current,
        pageSize: 10,
        name: this.searchValue,
        fieldName: this.orderObj.sortField,
        orderName: this.orderObj.sortType,
        status: this.valuePro,
      })
        .then((response) => {
          this.deviceData = response.data.data.list.map((item) => {
            item.managerName == null ? "/" : item.managerName;
            item.handlerName == null ? "/" : item.handlerName;
            switch (item.status) {
              case 0:
                item.dealStatus = "待处理";
                item.bg =
                  "background:#FFE9E8;color:#FF2222;padding:4px;animation: fade 1000m00s infinite;-webkit-animation: fade 1000ms infinite;";
                break;
              case 1:
                item.dealStatus = "已指派";
                item.bg = "background:#E6F7FF;color:#1890FF;padding:4px";
                break;
              case 2:
                item.dealStatus = "已处理";
                item.bg = "background:#E6FFD0;color:#52C41A;padding:4px";
                break;
              default:
                break;
            }
            return {
              ...item,
              sn: item.sn,
              handlerName: item.handlerName,
              managerName: item.managerName,
              helpTime: item.helpTime,
              handleTime: item.handleTime,
              assignTime: item.assignTime,
              dealstatus: item.dealStatus,
              onlineTcp: item.onlineTcp,
            };
          });
          this.total = response.data.data.total;
          this.pagesize = response.data.data.pageSize;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    changePage(currentPage) {
      this.current = currentPage;
      this.loadData();
    },
    handleDetail(index, row) {
      this.$router.push({
        path: "/handle/seekDetail",
        query: {
          data: row,
        },
      });
    },
  },
};
</script>
<style scoped lang='scss'>
.containerDetail {
  @keyframes fade {
    from {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    to {
      opacity: 1;
    }
  }

  @-webkit-keyframes fade {
    from {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    to {
      opacity: 1;
    }
  }
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .mgl10 {
    margin-left: 10px;
  }
  .mgt10 {
    margin-top: 10px;
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
  .searchbox {
    height: 50px;
    padding: 8px 4px;
    box-sizing: border-box;
    font-size: 12px;
    .searchdiv {
      width: 260px;
      height: 100%;
      float: left;
      .el-input__inner {
        height: 32px;
        line-height: 32px;
      }
      .el-input-group__append,
      .el-input-group__prepend {
        padding: 0 10px;
      }
    }
  }
  .el-icon-map-location_offline {
    pointer-events: none;
    color: #cccccc;
  }
  .el-icon-map-location_online {
    color: #52c41a;
    cursor: pointer;
  }
  .selectItem {
    display: flex;
    flex-wrap: nowrap;
    padding-left: 30px;
    align-items: center;
    .el-input__inner {
      height: 32px;
      width: 116px;
    }
    .el-input__suffix {
      top: 5px;
    }
    .el-select {
      width: auto;
    }
    .awaitMessage {
      margin-left: auto;
      margin-right: 10px;
      width: 140px;
      text-align: left;
      border: 1px solid #ff0000;
      height: 28px;
      line-height: 28px;
      background: #fff1f0;
      border-radius: 5px;
      span:first-child {
        width: 5px;
        height: 5px;
        background-color: red;
        border-radius: 50%;
        display: inline-block;
        margin-right: 5px;
        margin-left: 10px;
        vertical-align: middle;
      }
      span:nth-child(3) {
        float: right;
        margin-right: 10px;
        color: #ff0000;
      }
    }
  }
  .tablebox {
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 10px;
    .el-table th {
      background: #f0f0f0;
      padding: 8px 0;
    }
    .el-table tr > .cell {
      font-size: 14px;
    }
    .el-table th > .cell {
      font-size: 15px;
      color: #606266;
    }
    .yuan {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 4px;
      margin-right: 4px;
    }
    .optionbtn {
      color: #409eff;
      display: inline-block;
      cursor: pointer;
      margin-right: 8px;
    }
    .el-pagination {
      margin-top: 20px;
    }
  }
}
</style>