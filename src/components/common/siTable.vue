<template>
  <div v-loading="loading" class="table_container_scope">
    <table>
      <tr>
        <th>{{ $t("message.serialNumber") }}</th>
        <th v-for="(item, index) in thead" :key="index">
          <span :class="{ th_icon: item.sort || false }">
            {{ $t(`message.${item.field}`) }}
          </span>
          <div v-if="item.sort" class="th_options">
            <div @click="$emit('order', 0, item.field)">
              {{ $t("message.deleteOrder") }}
            </div>
            <div @click="$emit('order', 1, item.field)">
              {{ $t("message.descending") }}
            </div>
            <div @click="$emit('order', 2, item.field)">
              {{ $t("message.ascending") }}
            </div>
          </div>
          <!-- <div class="th_options" v-if="item.sort">
                        <div @click="sendOrder(2,item.field)">{{$t('message.deleteOrder')}}</div>
                        <div @click="sendOrder(0,item.field)">{{$t('message.descending')}}</div>
                        <div @click="sendOrder(1,item.field)">{{$t('message.ascending')}}</div>
                    </div> -->
        </th>
        <th
          v-if="
            operationShow.editShow ||
              operationShow.deleteShow ||
              operationShow.detailShow ||
              operationShow.registShow
          "
        >
          {{ operationShow.title || $t("message.Operate") }}
        </th>
      </tr>
      <tr v-for="(item, index) in tdata" :key="index">
        <td>{{ index + 1 }}</td>
        <td
          v-for="(subItem, subIndex) in tfield"
          :key="subIndex"
          :title="item[subItem]"
        >
          <!-- only field imudata -->
          <slot :name="subItem" :value="item"></slot>
          <div v-if="subItem != 'expirationTime'">
            <span v-if="subItem !== 'imudata'">{{ item[subItem] }}</span>

            <div v-else class="imu_data">
              <div
                v-for="(imuValue, imuKey, imuIndex) in item[subItem]"
                :key="imuIndex"
                class="imu_data_item"
              >
                {{ imuKey }} {{ imuValue }}
              </div>
            </div>
          </div>
        </td>
        <td
          v-if="
            operationShow.editShow ||
              operationShow.deleteShow ||
              operationShow.detailShow ||
              operationShow.registShow ||
              operationShow.exportShow
          "
          class="control_td"
        >
          <span
            v-if="operationShow.editShow"
            class="td_option td_edit"
            @click="$emit('edit', item)"
          >{{ operationShow.editContent || $t("message.edit") }}</span>
          <span
            v-if="operationShow.deleteShow"
            class="td_option td_edit"
            @click="$emit('delete', item)"
          >{{ operationShow.deleteContent || $t("message.delete") }}</span>
          <span
            v-if="operationShow.detailShow"
            class="td_option td_detail"
            :class="{ disable: detailDisable }"
            :title="detailDisable ? '无权限' : ''"
            @click="$emit('detail', item)"
          >{{ operationShow.detailContent || $t("message.detail") }}</span>
          <span
            v-if="operationShow.registShow"
            class="td_option td_edit"
            :class="{ disable: registDisable }"
            :title="registDisable ? '无权限' : ''"
            @click="$emit('regist', item)"
          >{{ $t("message.regist") }}</span>
          <!-- <span class="td_option td_edit" @click="parmsClick">{{'参数变更记录'}}</span> -->
          <span class="td_option td_edit" @click="alarmRecord(item)">{{
            "报警记录"
          }}</span>
          <!-- <span class="td_option td_edit" v-if="operationShow.exportShow" @click="$emit('exportlog', item)">{{'日志导出'}}</span> -->
          <!-- <span class="td_option td_edit" v-if="operationShow.driveRecord" @click="$emit('drive', item)">{{'驾驶记录'}}</span> -->
          <span
            v-if="operationShow.historyTrace"
            class="td_option td_edit"
            @click="$emit('historyTrace', item)"
          >{{ "历史轨迹" }}</span>
          <span class="td_option td_edit" @click="logManage(item)">{{
            "日志管理"
          }}</span>
          <slot name="td_operate" :value="item"></slot>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    thead: {
      type: Array,
      default: function () {
        return [];
      }
    },
    tdata: {
      type: Array,
      default: function () {
        return [];
      }
    },
    tfield: {
      type: Array,
      default: function () {
        return [];
      }
    },
    operationShow: {
      type: Object,
      default: function () {
        return {
          editShow: true,
          deleteShow: true,
          detailShow: true,
          registShow: true,
          driveRecord: false,
          exportShow: true
        };
      }
    },
    detailDisable: {
      type: Boolean,
      default: false
    },

    registDisable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      timeout: 300,
      timer: null
    };
  },
  computed: {},
  mounted() {},
  created() {
    this.checkData();
  },

  beforeDestroy() {
    this.timer ? clearTimeout(this.timer) : '';
  },
  methods: {
    logManage(item) {
      // this.$router.push({
      //     path:'../../page1/child9',
      //     query: {
      //         data:item
      //     }
      // })
      this.$router.push({
        path: '/vehicleManage/logManage',
         query: {
          data: item
        }
      });
    },
    alarmRecord(item) {
      this.$router.push({
        path: '/vehicleManage/alarmRecord',
        query: {
          data: item
        }
      });
    },
    // parmsClick() {
    //   this.$router.push('../../page1/child7');
    // },
    sendOrder(type, item) {
      this.$emit('order', item, type);
    },
    checkData() {
      if (this.tdata.length === 0) {
        this.loading = true;
        this.timer = setTimeout(() => {
          if (this.timeout > 5000) {
            this.loading = false;
            this.promptData();
            return;
          } else {
            this.checkData();
            this.timeout += 300;
          }
        }, 300);
      } else {
        this.loading = false;
        return;
      }
    },

    promptData() {
      let lang = this.$i18n.locale;
      this.$message({
        type: 'warning',
        message: lang === 'zh' ? '暂无数据' : 'no data'
      });
    }
  }
};
</script>
<style scoped lang ='scss'>
.table_container_scope {
  padding: 0 8px;
  min-height: 500px;
  table {
    width: 100%;
    border-collapse: collapse;
    tr {
      padding: 0 8px;
      border-bottom: 1px solid #f0f0f0;
      transition: all 0.2s;
      th {
        font-weight: normal;
        background: #f0f0f0;
        $height: 40px;
        height: $height;
        line-height: $height;
        word-wrap: 700;
        text-overflow: ellipsis;
        color: #666;
        font-weight: 700;
        font-size: 15px;
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        position: relative;
        text-align: left;
        padding: 0 8px 0 0;
        white-space: nowrap;
        > span.th_icon {
          position: relative;
          padding: 17px 0;
          height: 90%;
          cursor: pointer;
        }

        > span.th_icon:after {
          content: "";
          display: block;
          width: 0px;
          height: 0px;
          border: 5px solid transparent;
          border-top-color: gray;
          position: absolute;
          top: 0px;
          bottom: 0;
          margin: auto;
          right: -12px;
        }

        span.th_icon:hover + .th_options {
          visibility: visible;
        }

        > div.th_options {
          position: absolute;
          left: 0px;
          // right: 0px;
          margin: auto;
          background: #fff;
          // width: 100%;
          width: fit-content;
          // max-width: 150px;
          top: 40px;
          border-radius: 4px;
          line-height: initial;
          visibility: hidden;
          padding: 5px 0px;
          z-index: 999;
          font-weight: 500;
          color: #525151;
          box-shadow: 0 0 10px #dad8d8;
          > div {
            cursor: pointer;
            padding: 8px;
            display: block;
            border-radius: 2px;
            box-sizing: border-box;
          }
          > div:hover {
            background: #f0f0f0;
          }
        }
        > div.th_options:hover {
          visibility: visible;
        }
      }
      td {
        height: 40px;
        font-size: 14px;
        text-align: left;
        padding: 0 8px 0 0;
        .imu_data {
          display: flex;
          justify-content: space-around;
          .imu_data_item {
          }
        }
        > div {
          display: inline-block;
          > span {
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 130px;
          }
        }
      }
      .control_td {
        .disable {
          cursor: not-allowed;
          pointer-events: none;
          color: gray;
        }
      }

      .td_option {
        padding: 0 5px 0 0;
        cursor: pointer;
      }
      .td_edit {
        color: #2d8cf0;
      }
      .td_del {
        color: #ff5d57;
      }
      .td_detail {
        color: #2d8cf0;
      }
    }
    tr:not(:first-child):hover {
      background: #cfdae5;
    }
    tr td:first-child {
      padding-left: 16px;
    }
    tr th:first-child {
      padding-left: 16px;
    }
  }
}
</style>
