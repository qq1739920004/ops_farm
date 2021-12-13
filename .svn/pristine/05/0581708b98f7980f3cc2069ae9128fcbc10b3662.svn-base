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
          日志管理
        </div>
      </el-col>
    </el-row>
    <div class="loadFild">
      <div class="textload">
        <div class="fileImg">
          <img src="@/assets/common/loadfile.png" style />
          <div class="text">{{ fileName }}</div>
        </div>
        <div class="detailTime">
          <span class="time">{{ time }}</span>
          <!-- <span class="big">10kb</span> -->
        </div>
      </div>
      <div class="clickLoad">
        <el-button class="newLog" @click="updateLog">获取最新日志</el-button>
        <el-button class="loadtext" :disabled="isDisable" type="text" @click="loadLog">下载</el-button>
      </div>
    </div>
  </div>
</template>

<script>
 import { formatDate } from '@/components/common/tool'
 import { logInfo_path, logUpdate_path } from '@/api/vehicleManage'
export default {
  data() {
    return {
      carObj: {},
      time: '',
      fileName: '',
      isDisable: true
    };
  },

  computed: {},
  mounted() {
    // this.carObj = this.$route.query.data;
    this.carObj = this.$route.query.data;
    this.httpFile();
  },
  methods: {
    httpFile() {
        logInfo_path({
          carId: this.carObj.id
        }).then(res => {
          try {
            if (res.data.data.updateTime != null) {
              this.time = formatDate(res.data.data.updateTime)
              this.fileName = res.data.data.fileName
              this.isDisable = false
            } else {
               this.$message.warning('当前无日志记录，请点击获取最新日志');
            }
          } catch (err) {
            console.log(err);
          }
        });
    },
    updateLog() {
        logUpdate_path({
          carId: this.carObj.id
        }).then(res => {
          try {
            if (res.data.data == 1) {
              this.$message.success('查询成功,正在获取文件，请耐心等待');
            } else {
              this.$message.warning('查询失败');
            }
          } catch (err) {
            console.log(err);
          }
        });
    },
    loadLog() {
      window.open(
        '/farm/car/log/download?carId=' + this.carObj.id, '_blank'
      )
    },
    backToVersion() {
      // this.$router.push("/page1/child4");
      // this.$router.push("/page2/child1");
      this.$router.go(-1);
    }
  }
};
</script>
<style scoped lang ='scss'>
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

    .loadFild {
        margin-top: 50px;
        margin-left: 50px;

        .textload {
            width: 285px;
            height: 185px;
            background: #E6F7FF;

            .fileImg {
                padding-top: 20px;

                img {
                    width: 80px;
                    height: 80px;
                }

                .text {
                    font-size: 18px;
                    margin-top: 10px;
                    color: #101010;
                    font-weight: normal;
                }
            }
            .detailTime {
                margin-top: 15px;

                .time {
                    float: left;
                    color: #000000;
                    font-size: 12px;
                    margin-left: 80px;
                }

                .big {
                    float: right;
                    color: #000000;
                    font-size: 12px;
                    margin-right: 10px;
                }
            }
        }
        .clickLoad {
            text-align: center;
            width: 285px;
            margin-top: 10px;
            .newLog {
                padding: 0;
                color: #1890FF;
                font-size: 14px;
                padding-right: 20px;
                cursor: pointer;
                border: 0;
                border-right: 2px solid #efefef;
            }
            .loadtext {
                // color: #1890FF;
                font-size: 14px;
                padding-left: 20px;
                cursor: pointer;
                border: 0;
            }
        }
    }
}
</style>
