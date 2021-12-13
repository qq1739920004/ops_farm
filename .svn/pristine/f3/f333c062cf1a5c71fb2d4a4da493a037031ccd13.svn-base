<template>
  <div class="history_map_container">
    <div id="new_history_map"></div>
    <!-- 菜单 -->
    <div class="menu_bar">
      <div>
        <el-button
          type="success"
          icon="el-icon-back"
          size="small"
          @click="goBack"
        >返回</el-button>
      </div>
      <div class="menu_content">
        <div class="menu_content_title">
          <span>轨迹查询 </span>
          <i class="el-icon-info"></i>
        </div>
        <div class="menu_content_select">
          <el-select
            v-model="provinceId"
            placeholder="请选择"
            size="small"
            @change="handleProvinceChange"
          >
            <el-option
              v-for="item in provinceOptions"
              :key="item.provinceCode"
              :label="item.provinceName"
              :value="item.provinceCode"
            />
          </el-select>
        </div>
        <div class="menu_content_search">
          <el-input
            v-model="searchValue"
            placeholder="请输入内容"
            size="small"
            clearable
          >
            <template slot="append"><i class="el-icon-search"></i></template>
          </el-input>
        </div>
        <div class="menu_content_date">
          <el-row>
            <el-col :span="6" style="line-height: 2"> 开始时间 </el-col>
            <el-col :span="18">
              <el-date-picker
                v-model="startDate"
                size="small"
                type="datetime"
                :clearable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
                @change="handleDateChange"
              />
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px">
            <el-col :span="6" style="line-height: 2"> 结束时间 </el-col>
            <el-col :span="18">
              <el-date-picker
                v-model="endDate"
                size="small"
                type="datetime"
                :clearable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
                @change="handleDateChange"
              />
            </el-col>
          </el-row>
        </div>
        <div class="menu_content_list">
          <div
            v-if="listData.length === 0"
            style="padding: 10px; text-align: center"
          >
            暂无数据
          </div>
          <el-collapse v-model="activeNames" accordion>
            <el-collapse-item
              v-for="(item, index) in listData"
              :key="index"
              :name="index"
            >
              <template slot="title">
                <div class="company_name">
                  {{ item.companyName }}
                </div>
              </template>
              <div class="menu_content_car_list">
                <el-row
                  v-for="(subItem, subIndex) in item.carList"
                  :key="subIndex"
                  class="car_list_row"
                >
                  <el-col class="car_name" :span="8" :offset="2">{{
                    subItem.car.name || '/'
                  }}</el-col>
                  <el-col :span="10" :offset="1">{{
                    subItem.deviceSn || '/'
                  }}</el-col>
                  <el-col :span="3">
                    <el-radio
                      v-model="deviceId"
                      :label="subItem.car.deviceId"
                    />
                  </el-col>
                </el-row>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div
          class="but_container"
          style="text-align: center; padding: 10px; background: #fff"
        >
          <el-button
            size="small"
            type="success"
            :icon="loading ? 'el-icon-loading' : 'el-icon-search'"
            :disabled="loading"
            @click="getHistoryRoute"
          >查询</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const L = window.L
import mapMixin from '@/utils/mapMix'
import gcoord from 'gcoord'
const statrIcon = require('@/assets/locationManage/start.png')
const endIcon = require('@/assets/locationManage/end.png')
import { provinceList_path, filterCar_path, singleCarTrack_path } from '@/api/vehicleManage'
export default {
  mixins: [mapMixin],
  data() {
    return {
      provinceId: '65',
      provinceOptions: [],
      searchValue: '',
      startDate: '',
      endDate: '',
      activeNames: [1],
      listData: [],
      deviceId: '',
      loading: false,
      polyline: [],
      startMarker: [],
      endMarker: [],
      color: ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#f1c40f', '#d35400']
    }
  },

  methods: {
    setMapId() {
      this.domID = 'new_history_map' // 地图id
    },

    setDefaultDate() {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      this.startDate =
        start.toLocaleDateString().split('/').join('-') +
        ' ' +
        start.toTimeString().slice(0, 8)
      this.endDate =
        end.toLocaleDateString().split('/').join('-') +
        ' ' +
        end.toTimeString().slice(0, 8)
    },

    handleProvinceChange() {
      this.getCarList()
    },

    handleDateChange() {
      this.getCarList()
    },

    goBack() {
      this.$router.go(-1)
    },

    // 获取省份列表
    getProvinceList() {
        provinceList_path().then((res) => {
        try {
          if (res.data.data) {
            this.provinceOptions = res.data.data
          }
        } catch (error) {
          console.log(error)
        }
      })
    },

    // 检查时间跨度
    checkDate(startDate, endDate) {
      try {
        if (!this.startDate) {
          this.$message.warning('请选择开始时间')
          return false
        }
        if (!this.endDate) {
          this.$message.warning('请选择结束时间')
          return false
        }

        let startStamp = new Date(this.startDate).getTime()
        let endStamp = new Date(this.endDate).getTime()
        if (startStamp > endStamp) {
          this.$message.warning('开始时间须小于结束时间')
          return false
        }
        if (endStamp - startStamp > 3600 * 24 * 60 * 1000) {
          this.$message.warning('时间范围过长,超过两个月')
          return false
        }

        return true
      } catch (error) {
        console.log(error)
        return false
      }
    },

    // 获取车辆列表数据
    getCarList() {
      if (!this.checkDate()) return
      filterCar_path({
          code: this.provinceId,
          st: this.startDate,
          et: this.endDate
        }).then((res) => {
          try {
            this.listData = []
            this.deviceId = ''
            // if(res.data.code === 101) {
            //     this.$message.warning('时间范围过长,超过两个月');
            //     return;
            // }
            if (res.data.data.length === 0) {
              this.$message.warning(
                '没有符合筛选条件的车辆，请检查时间跨度和省份选择'
              )
            }
            if (res.data.data && res.data.data.length) {
              this.listData = res.data.data
              this.$message.success('已根据筛选条件自动过滤不符合条件车辆')
            }
          } catch (error) {
            console.log(error)
          }
        })
    },

    getHistoryRoute() {
      if (!this.deviceId) {
        this.$message.warning('请选择车辆')
        return
      }
      this.loading = true
      singleCarTrack_path({
          deviceId: this.deviceId,
          st: this.startDate,
          et: this.endDate
        }).then((res) => {
          try {
            if (res.data.code === 100) {
              if (res.data.data.length && res.data.data[0]['list'].length) {
                this.removeOverlay()
                res.data.data.forEach((item, index) => {
                  this.drawPath(item.list, item, this.color[index % 5])
                })
              } else {
                this.$message.warning('暂无数据,请重新筛选时间')
              }
            }
            if (res.data.code === 101) {
              this.$message.warning('时间范围过长，超过两个月')
            }
            this.loading = false
          } catch (error) {
            console.log(error)
            this.loading = false
          }
        })
        .catch((err) => {
          console.log(err)
          this.loading = false
        })
    },

    drawPath(pathArray = [], popup = {}, color = 'green') {
      if (!pathArray.length) {
        console.warn('空的集合')
        return
      }

      let temArray = []
      pathArray.forEach((item) => {
        let point = this.coorTransform([item.pos_x, item.pos_y])
        temArray.push(point)
      })

      let iconStart = L.icon({
        iconUrl: statrIcon,
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      })
      let iconEnd = L.icon({
        iconUrl: endIcon,
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      })

      let text = `
                <div class="litte_popup_warpper">
                    <div class="popup_line">
                        <div class="popup_line_name">作业名称:</div>
                        <div class="popup_line_value">${popup.workName}</div>
                    </div>
                    <div class="popup_line">
                        <div class="popup_line_name">作业面积:</div>
                        <div class="popup_line_value">${
                          popup.workArea
                        } (亩)</div>
                    </div>
                    <div class="popup_line">
                        <div class="popup_line_name">开始时间:</div>
                        <div class="popup_line_value">${this.dateTimeTrans(
                          popup.workSt
                        )}</div>
                    </div>
                    <div class="popup_line">
                        <div class="popup_line_name">结束时间:</div>
                        <div class="popup_line_value">${this.dateTimeTrans(
                          popup.workEt
                        )}</div>
                    </div>
                </div>
            `
      let polyline = L.polyline(temArray, { color: color }).addTo(this.map)
      this.polyline.push(polyline)

      let startMarker = L.marker(temArray[0], { icon: iconStart }).addTo(
        this.map
      )
      this.startMarker.push(startMarker)

      let endMarker = L.marker(temArray[temArray.length - 1], {
        icon: iconEnd
      }).addTo(this.map)
      this.endMarker.push(endMarker)

      L.featureGroup([polyline, startMarker, endMarker])
        .bindPopup(text)
        .addTo(this.map)

      this.map.fitBounds(temArray)
    },

    removeOverlay() {
      if (this.polyline.length) {
        this.polyline.forEach((item) => item.remove())
        this.polyline = []
      }
      if (this.startMarker.length) {
        this.startMarker.forEach((item) => item.remove())
        this.startMarker = []
      }
      if (this.endMarker.length) {
        this.endMarker.forEach((item) => item.remove())
        this.endMarker = []
      }
    },

    coorTransform(point = [], mapType = 1) {
      // 经纬度顺序 gcoor 需要 [116.403988, 39.914266] 经度在前
      // if( !pointInChina(point) ) {
      //     return point;
      // }
      /*eslint-disable */
      let p = [point[1], point[0]]
      switch (mapType) {
        case 0:
          let [a, b] = gcoord.transform(p, gcoord.WGS84, gcoord.GCJ02)
          return [b, a]
        case 1:
          let [c, d] = gcoord.transform(p, gcoord.WGS84, gcoord.GCJ02)
          return [d, c]
        case 2:
          let [e, f] = gcoord.transform(p, gcoord.WGS84, gcoord.GCJ02)
          return [f, e]
        default:
          let [g, h] = gcoord.transform(p, gcoord.WGS84, gcoord.GCJ02)
          return [h, g]
      }
    },
  },

  mounted() {
    this.setDefaultDate()
    this.getProvinceList()
    this.getCarList()
  },
}
</script>
<style scoped lang='scss'>
.history_map_container {
  height: 100%;
  position: relative;
  #new_history_map {
    height: 100%;
  }
  .menu_bar {
    position: absolute;
    z-index: 999;
    left: 10px;
    top: 10px;
    width: 300px;
    text-align: left;
    font-size: 14px;
    .menu_content {
      padding-top: 10px;
      .menu_content_title {
        margin: 0;
        padding: 10px;
        font-size: inherit;
        font-weight: inherit;
        background-color: #4cb04f;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        color: #ffffff;
        text-align: center;
      }
      .menu_content_select {
        background: #ffffff;
        padding: 5px 10px;
        .el-select {
          width: 100%;
        }
      }
      .menu_content_search {
        background: #ffffff;
        padding: 0 10px 10px 10px;
      }
      .menu_content_date {
        background: #ffffff;
        padding: 5px 10px;
        font-size: 14px;
        .el-date-editor {
          width: 210px;
        }
      }
      .menu_content_list {
        min-height: 100px;
        max-height: 400px;
        overflow: auto;
        position: relative;
        background-color: #ffffff;
        .company_name {
          padding-left: 10px;
        }
        .menu_content_car_list {
          // max-height: 200px;
          // overflow-y: auto;
          // overflow-x: hidden;
          .car_list_row {
            cursor: pointer;
            overflow: hidden;
            .car_name {
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
            .el-radio__label {
              position: absolute;
              right: 0px;
              top: -2px;
              width: 250px;
              height: 23px;
              color: transparent;
            }
          }
          .car_list_row:hover {
            background: #f5f5f5;
          }
        }
      }
    }
  }

  .litte_popup_warpper {
    .popup_line {
      display: flex;
      padding: 4px;
      .popup_line_name {
        padding-right: 10px;
      }
      .popup_line_value {
      }
    }
  }
}
</style>