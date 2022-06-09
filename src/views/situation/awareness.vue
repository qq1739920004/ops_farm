<template>
  <div id="awareness" class="awareness">
    <div class="full_screen">
      <!-- 全屏tooltip会失效 -->
      <!-- <el-tooltip class="item" effect="light" content="点我全屏" placement="bottom-start"> -->
      <i
        class="el-icon-full-screen"
        :title="isFullScreen ? '退出全屏' : '点我全屏'"
        @click="handleClick"
      ></i>
      <!-- </el-tooltip> -->
    </div>
    <div class="banner_container">
      <div class="banner_title">{{userId == 11 ? '北方雷科态势感知平台' : '司南耕耘态势感知平台'}}</div>
      <div class="banner_time">
        {{ currentTime }}
      </div>
    </div>
    <div class="grid_container">
      <div class="online_device">
        <el-row class="row_title" style="text-align: center">
          <el-col :span="6" style="color: #03b469" :offset="6">作业车辆</el-col>
          <el-col :span="6" style="color: #a37524">待机车辆</el-col>
          <el-col :span="6" style="color: #0594a6">注册车辆</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="car_type">AG302</el-col>
          <el-col :span="6" class="outstanding" style="color: #01eb81">{{
            working302
          }}</el-col>
          <el-col :span="6" class="outstanding" style="color: #feef00">{{
            standby302
          }}</el-col>
          <el-col :span="6" class="outstanding" style="color: #23ccfb">{{
            total302
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="car_type">AG360</el-col>
          <el-col :span="6" class="outstanding" style="color: #01eb81">{{
            working360
          }}</el-col>
          <el-col :span="6" class="outstanding" style="color: #feef00">{{
            standby360
          }}</el-col>
          <el-col :span="6" class="outstanding" style="color: #23ccfb">{{
            total360
          }}</el-col>
        </el-row>
      </div>
      <div class="abnormal_device">
        <div>
          <span class="outstanding" style="color: red">{{ abNormalCar }}</span>
        </div>
      </div>
      <div class="today_area">
        <div>
          <div class="grid_item_title">今日作业(亩)</div>
          <div
            class="outstanding"
            style="color: #ffb519; padding-left: 20px; text-align: left"
          >
            {{ todayArea }}
          </div>
        </div>
        <div>
          <div class="grid_item_title">累计作业(万亩)</div>
          <div
            class="outstanding"
            style="color: #448aff; padding-left: 20px; text-align: left"
          >
            {{ (totalArea / 10000).toFixed(2) }}
          </div>
        </div>
      </div>

      <div class="province_count">
        <div class="grid_item_title">
          <i
            v-if="!provinceCountShow"
            class="el-icon-d-arrow-left"
            style="cursor: pointer"
            @click="backToProvince"
          ></i>
          {{ provinceCountShow ? "省份统计" : "地级市统计" }}
        </div>
        <div class="count_table_container">
          <el-row class="row_title">
            <el-col :span="4" style="color: #769279">省市</el-col>
            <el-col :span="4" style="color: #56bd1a">在线车辆</el-col>
            <el-col :span="4" style="color: #04a3b6">注册车辆</el-col>
            <el-col :span="6" style="color: #b38223">今日作业(亩)</el-col>
            <el-col :span="6" style="color: #2e64b4">累计作业(亩)</el-col>
          </el-row>
          <!-- 省份渲染列表 -->
          <div v-if="provinceCountShow" class="row_province_container">
            <el-row
              v-for="(item, index) in provinceCountData"
              :key="index"
              class="row_item"
              @click.native="handleProvinceClick(item)"
            >
              <el-col
                :span="4"
                style="color: #9ccc9f; height: 32px; line-height: 32px"
                class="row_title_province"
                ><span class="province_name">{{ item.name }}</span></el-col
              >
              <el-col
                :span="4"
                style="color: #6be90b; height: 32px; line-height: 32px"
                >{{ item.onlineCar || 0 }}</el-col
              >
              <el-col
                :span="4"
                style="color: #00eaff; height: 32px; line-height: 32px"
                >{{ item.totalCar || 0 }}</el-col
              >
              <el-col
                :span="6"
                style="color: #eca91c; height: 32px; line-height: 32px"
                >{{ item.todayArea || 0 }}</el-col
              >
              <el-col
                :span="6"
                style="color: #448aff; height: 32px; line-height: 32px"
                >{{ item.totalArea || 0 }}</el-col
              >
              <i class="el-icon-arrow-right"></i>
            </el-row>
          </div>
          <!-- 地级市 -->
          <div v-else>
            <el-row
              v-for="(item, index) in cityCountData"
              :key="index"
              class="row_item"
              @click.native="handleCityClick(item)"
            >
              <el-col
                :span="4"
                style="color: #9ccc9f; height: 32px; line-height: 32px"
                class="row_title_province"
                :title="item.name"
                >{{ item.name }}</el-col
              >
              <el-col
                :span="4"
                style="color: #6be90b; height: 32px; line-height: 32px"
                >{{ item.onlineCar || 0 }}</el-col
              >
              <el-col
                :span="4"
                style="color: #00eaff; height: 32px; line-height: 32px"
                >{{ item.totalCar || 0 }}</el-col
              >
              <el-col
                :span="6"
                style="color: #eca91c; height: 32px; line-height: 32px"
                >{{ item.todayArea || 0 }}</el-col
              >
              <el-col
                :span="6"
                style="color: #448aff; height: 32px; line-height: 32px"
                >{{ item.totalArea || 0 }}</el-col
              >
            </el-row>
          </div>
        </div>
      </div>

      <div class="active_device">
        <div class="grid_item_title">车辆活跃度</div>
        <div class="vehicle_legend">
          <div
            class="legend_item"
            :class="{ legend_item1: carIndex === 0 }"
            @click="changeActive(0)"
          ></div>
          <div style="margin-right: 8px">今日</div>
          <div
            class="legend_item"
            :class="{ legend_item2: carIndex === 1 }"
            @click="changeActive(1)"
          ></div>
          <div style="margin-right: 8px">当月</div>
          <div
            class="legend_item"
            :class="{ legend_item3: carIndex === 2 }"
            @click="changeActive(2)"
          ></div>
          <div style="margin-right: 8px">本年</div>
        </div>
        <div id="vehicleChart"></div>
      </div>
      <div class="work_area">
        <div class="grid_item_title">作业面积</div>
        <div class="area_legend">
          <div
            class="legend_item"
            :class="{ legend_item1: areaIndex === 0 }"
            @click="changeArea(0)"
          ></div>
          <div style="margin-right: 8px">今日</div>
          <div
            class="legend_item"
            :class="{ legend_item2: areaIndex === 1 }"
            @click="changeArea(1)"
          ></div>
          <div style="margin-right: 8px">当月</div>
          <div
            class="legend_item"
            :class="{ legend_item3: areaIndex === 2 }"
            @click="changeArea(2)"
          ></div>
          <div style="margin-right: 8px">本年</div>
        </div>
        <div id="areaChart"></div>
      </div>

      <div class="map">
        <div id="awareness_map"></div>
        <div class="awareness_map_legend">
          <div class="working">作业车辆</div>
          <div class="notworking">待机车辆</div>
          <div class="abnormal">异常车辆</div>
        </div>
        <div class="awareness_map_control">
          <el-checkbox v-model="roadNet" @change="handleRoadnetChange"
            >路网</el-checkbox
          >
          <el-checkbox v-model="heatMap" @change="handleHeatMapChange"
            >热力图</el-checkbox
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import gcoord from "gcoord";
import bus from "@/utils/socket/bus";
import {
  farmMachineDataStatistics_path,
  carDataCount_path,
  provinceDataList_path,
  cityDataList_path,
  onlineFarmMachinePosition_path,
  district_path,
  statCar_path,
  paddyWorkStat_path,
} from "@/api/situation";
let working = require("@/assets/situation/working.png");
let notworking = require("@/assets/situation/notworking.png");
const L = window.L;
export default {
  data() {
    return {
      userId: this.$store.state.user.userId,
      provinceCountData: [],
      cityCountData: [],
      provinceCountShow: true,
      farmMarkers: [],
      vehicleChart: null,
      areaChart: null,
      map: null,
      tileUrl: L.TileLayer.ChinaProvider.providers,
      tileLayer: [],
      originPoint: [36.172800343248, 100.406021546488],
      originZoom: 4,
      maxZoom: 18,
      minZoom: 1,
      mapName: 0,
      boundary: [],

      todayArea: 0,
      totalArea: 0,
      total302: 0,
      total360: 0,
      abNormalCar: 0,
      working302: 0,
      standby302: 0,
      working360: 0,
      standby360: 0,

      carIndex: 0,
      areaIndex: 0,
      currentTime: "",
      timerId: null,
      isFullScreen: false,
      valve: null, // 统计节流
      roadNet: true,
      heatMap: true,
      heatLayer: null, // 动态添加无需初始化
      vehicleOptions: {
        grid: {
          right: 30,
          bottom: 30,
          top: 10,
        },
        tooltip: {
          show: true,
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: [],
          axisLine: {
            lineStyle: {
              color: "#B9C8DB",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: "#0490AB",
          },
        },
        yAxis: {
          type: "value",
          name: "车辆数",
          axisLine: {
            lineStyle: {
              color: "#B9C8DB",
            },
          },
          splitNumber: 3,
          minInterval: 1,
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: "#384155",
            },
          },
          axisLabel: {
            color: "#0490AB",
          },
          nameTextStyle: {
            color: "#0490AB",
          },
        },
        series: [
          {
            data: [],
            smooth: true,
            type: "line",
            itemStyle: {
              color: "#20FF8A",
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "#20FF8A", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(32, 255, 138, 0.1)", // 100% 处的颜色
                  },
                ],
              },
            },
          },
        ],
      },
      areaOptions: {
        grid: {
          right: 30,
          bottom: 30,
          top: 10,
        },
        tooltip: {
          show: true,
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: [
            "2020-03-01",
            "2020-03-01",
            "2020-03-01",
            "2020-03-01",
            "2020-03-01",
            "2020-03-01",
            "2020-03-01",
          ],
          axisLine: {
            lineStyle: {
              color: "#B9C8DB",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: "#0490AB",
          },
        },
        yAxis: {
          type: "value",
          name: "作业面积(亩)",
          axisLine: {
            lineStyle: {
              color: "#B9C8DB",
            },
          },
          splitNumber: 3,
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: "#384155",
            },
          },
          axisLabel: {
            color: "#0490AB",
          },
          nameTextStyle: {
            color: "#0490AB",
          },
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line",
            smooth: true,
            itemStyle: {
              color: "#20FF8A",
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "#20FF8A",
                  },
                  {
                    offset: 1,
                    color: "rgba(32, 255, 138, 0.1)",
                  },
                ],
              },
            },
          },
        ],
      },
    };
  },
  mounted() {
    this.initChart();
    this.initMap();
    this.getProvinceCount();
    this.loadIndiData();
    this.loadOnlineFarmData();
    this.getActiveCar();
    this.getWorkArea();
    // this.listenMessage();
    this.timerId = setInterval(() => {
      this.getCurrntTime();
    }, 1000);
  },

  beforeDestroy() {
    let that = this;
    bus.$off("message");
    this.timerId ? clearInterval(this.timerId) : "";
    this.vehicleChart ? this.vehicleChart.dispose() : "";
    this.areaChart ? this.areaChart.dispose() : "";
    window.removeEventListener("resize", that.reloadChart);
  },

  created() {
    let that = this;
    window.addEventListener("resize", that.reloadChart);
  },
  methods: {
    handleClick() {
      let fullscreenEnabled =
        document.fullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.msFullscreenEnabled;
      var fullscreenElement =
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement;
      if (!fullscreenEnabled) {
        console.log("浏览器当前不能全屏");
        return;
      }
      if (fullscreenElement) {
        document.exitFullscreen().then((res) => {
          this.reloadChart();
          this.isFullScreen = false;
        });
      } else {
        document
          .getElementById("awareness")
          .requestFullscreen()
          .then((res) => {
            this.reloadChart();
            this.isFullScreen = true;
          });
      }
    },

    initChart() {
      this.vehicleChart = echarts.init(document.getElementById("vehicleChart"));
      this.areaChart = echarts.init(document.getElementById("areaChart"));
    },

    reloadChart() {
      this.vehicleChart.dispose();
      this.vehicleChart = null;
      this.vehicleChart = echarts.init(document.getElementById("vehicleChart"));
      this.vehicleChart.setOption(this.vehicleOptions);
      this.areaChart.dispose();
      this.areaChart = null;
      this.areaChart = echarts.init(document.getElementById("areaChart"));
      this.areaChart.setOption(this.areaOptions);
    },

    initMap() {
      this.map = L.map("awareness_map", { zoomControl: false }).setView(
        this.originPoint,
        this.originZoom
      );
      this.handleMapChange(this.mapName);
    },

    handleMapChange(mapId) {
      switch (mapId) {
        case 0:
          this.changeTileLayer("Google", "Satellite");
          break;
        case 1:
          this.changeTileLayer("GaoDe", "Normal");
          break;
        case 2:
          this.changeTileLayer("Google", "Normal");
          break;
        case 3:
          this.changeTileLayer("TianDiTu", "Normal");
          break;
      }
    },
    changeTileLayer(mapName = "Google", mapType = "Satellite") {
      try {
        if (!this.map) {
          console.warn("未初始化底图实例");
          return;
        }
        if (this.tileLayer.length) {
          this.tileLayer.forEach((layer) => layer.remove());
          this.tileLayer = [];
        }
        let mapUrl = this.tileUrl[mapName][mapType];
        let options = {};
        options.subdomains = this.tileUrl[mapName]["Subdomains"];
        if ("tms" in this.tileUrl[mapName]) {
          options.tms = this.tileUrl[mapName]["tms"];
        }
        if ("key" in this.tileUrl[mapName]) {
          options.key = this.tileUrl[mapName]["key"];
        }
        for (let key in mapUrl) {
          let layer = L.tileLayer(mapUrl[key], options).addTo(this.map);
          this.tileLayer.push(layer);
        }
      } catch (error) {
        console.log(error);
      }
    },

    changeActive(index) {
      if (index === this.carIndex) return;
      this.carIndex = index;
      this.getActiveCar(index);
    },

    changeArea(index) {
      if (index === this.areaIndex) return;
      this.areaIndex = index;
      this.getWorkArea(index);
    },

    // 获取统计数据
    loadIndiData() {
      farmMachineDataStatistics_path().then((res) => {
        try {
          this.todayArea = res.data.workArea.todayArea;
          this.totalArea = res.data.workArea.totalArea;
        } catch (error) {
          console.log(error);
        }
      });
      carDataCount_path().then((res) => {
        try {
          if (res.data.data) {
            this.working302 = res.data.data.workAG302;
            this.standby302 = res.data.data.noWorkAG302;
            this.working360 = res.data.data.workAG360;
            this.standby360 = res.data.data.noWorkAG360;
            this.total302 = res.data.data.AG302;
            this.total360 = res.data.data.AG360;
          }
        } catch (error) {
          console.log(error);
        }
      });
    },

    // 获取省份统计数据
    getProvinceCount() {
      provinceDataList_path().then((res) => {
        try {
          if (res.data.data) {
            this.provinceCountData = res.data.data;
          }
        } catch (error) {
          console.log(error);
        }
      });
    },

    // 获取地级市省份数据
    getCityCount(provinceCode) {
      if (!provinceCode) return;
      this.cityCountData = [];
      cityDataList_path({ provinceCode: provinceCode }).then((res) => {
        try {
          if (res.data.data) {
            this.cityCountData = res.data.data;
          }
        } catch (error) {
          console.log(error);
        }
      });
    },

    handleProvinceClick(item) {
      this.provinceCountShow = false;
      this.getCityCount(item.code);
      this.getBoundary(item.name);
    },

    handleCityClick(item) {
      this.getBoundary(item.name);
    },

    // 获取省份行政区域边界
    getBoundary(name) {
      if (name === "未知省份") {
        name = "中国";
      }
      let params = {
        keywords: name,
        subdistrict: 0,
        extensions: "all",
        key: "066eeeeb08237a3bf45006dff87bed26",
      };
      district_path(params).then((res) => {
        try {
          let data = res.data.districts[0].polyline;
          if (!data) return;

          let dataArea = data.split("|"); // 不同区域
          let area = dataArea.map((item) =>
            item.split(";").map((i) =>
              i
                .split(",")
                .reverse()
                .map((j) => parseFloat(j))
            )
          );
          this.clearBoundary();
          this.drawBoundary(area);
        } catch (error) {
          console.log(error);
        }
      });
    },

    drawBoundary(area = []) {
      let allPoints = [];
      area.forEach((item) => {
        let polygon = L.polygon(item, { color: "#409EFF" }).addTo(this.map);
        allPoints = allPoints.concat(item);
        this.boundary.push(polygon);
      });
      this.map.fitBounds(allPoints);
    },

    clearBoundary() {
      this.boundary.forEach((item) => item.remove());
      this.boundary = [];
    },

    backToProvince() {
      this.provinceCountShow = true;
      this.clearBoundary();
      this.map.setView(this.originPoint, this.originZoom);
    },

    getCurrntTime() {
      let tem = {
        0: "日",
        1: "一",
        2: "二",
        3: "三",
        4: "四",
        5: "五",
        6: "六",
      };
      let current = new Date();
      let year = current.getFullYear();
      let month = current.getMonth() + 1;
      let day = current.getDate();
      let weekday = current.getDay();
      let time = current.toTimeString().slice(0, 8);
      // let content = `${time} ${year}-${month}-${day}`;
      this.currentTime = `${time} ${year}年${month}月${day}日 星期${tem[weekday]}`;
    },

    // 获取车辆活跃度
    /**
     * @params 0:当日 1：当月 2 当年
     */
    getActiveCar(indi = 0) {
      let st, et;
      let date = new Date();
      let day = date.getDate(); // 今天
      let month = date.getMonth() + 1; // 当月
      let year = date.getFullYear(); // 年份
      switch (indi) {
        case 0:
          st = `${year}-${month}-${day} 00:00:00`;
          et = `${year}-${month}-${day} 23:59:59`;
          break;
        case 1:
          st = `${year}-${month}-01 00:00:00`;
          et = `${year}-${month}-${day} 23:59:59`;
          break;
        case 2:
          st = `${year}-01-01 00:00:00`;
          et = `${year}-${month}-${day} 23:59:59`;
          break;
      }
      this.vehicleChart.showLoading({
        type: "default",
        text: "loading",
        color: "#ffffff",
        textColor: "#ffffff",
        maskColor: "rgba(255, 255, 255, 0.1)",
      });
      statCar_path({
        st: st,
        et: et,
      }).then((res) => {
        try {
          this.vehicleOptions.xAxis.data = res.data.chart.date;
          this.vehicleOptions.series[0].data = res.data.chart.data.map(
            (item) => item[0]
          );
          this.vehicleChart.setOption(this.vehicleOptions);
          this.vehicleChart.hideLoading();
        } catch (error) {
          console.log(error);
        }
      });
    },

    // 获取作业面积
    getWorkArea(indi = 0) {
      let st, et;
      let date = new Date();
      let day = date.getDate(); // 今天
      let month = date.getMonth() + 1; // 当月
      let year = date.getFullYear(); // 年份
      switch (indi) {
        case 0:
          st = `${year}-${month}-${day} 00:00:00`;
          et = `${year}-${month}-${day} 23:59:59`;
          break;
        case 1:
          st = `${year}-${month}-01 00:00:00`;
          et = `${year}-${month}-${day} 23:59:59`;
          break;
        case 2:
          st = `${year}-01-01 00:00:00`;
          et = `${year}-${month}-${day} 23:59:59`;
          break;
      }
      this.areaChart.showLoading({
        type: "default",
        text: "loading",
        color: "#ffffff",
        textColor: "#ffffff",
        maskColor: "rgba(255, 255, 255, 0.1)",
      });
      paddyWorkStat_path({
        // /farm/stat/paddyWork
        st: st,
        et: et,
      }).then((res) => {
        try {
          this.areaOptions.xAxis.data = res.data.chart.map(
            (item) => item.formatDate
          );
          this.areaOptions.series[0].data = res.data.chart.map(
            (item) => item.workedArea
          );
          this.areaChart.setOption(this.areaOptions);
          this.areaChart.hideLoading();
        } catch (error) {
          console.log(error);
        }
      });
    },

    /**
     * @地图相关逻辑
     */

    loadOnlineFarmData() {
      onlineFarmMachinePosition_path().then((res) => {
        try {
          let data = res.data.onlineFarmMachines;
          if (data.length) {
            this.appendMarkers(data);
            this.countDeviceDynamic();
            this.initHeatMap();
          }
          this.listenMessage();
        } catch (error) {
          console.log(error);
        }
      });
    },

    appendMarkers(farmDataArray = []) {
      try {
        // let that = this;
        farmDataArray.forEach((item) => {
          let point = this.createMarkerPoint(item);
          // let icon = this.createMarkerIcon(item);
          // let marker = L.marker(point, {icon: icon}).addTo(this.map);
          let popup = this.createPopup(item);
          let options = this.createCircleMarkerOptions(item);
          let marker = L.circleMarker(point, options)
            .bindPopup(popup)
            .addTo(this.map);
          this.saveFarmMarker(item.sn, marker, item);
        });
      } catch (error) {
        console.log(error);
      }
    },

    createMarkerPoint(item) {
      try {
        return gcoord
          .transform([item.posY, item.posX], gcoord.WGS84, gcoord.GCJ02)
          .reverse();
      } catch (error) {
        console.log(error);
        return [0, 0];
      }
    },

    createMarkerIcon(item) {
      try {
        let icon = L.icon({
          iconUrl: item.driveState === 0 ? notworking : working,
          iconAnchor: [4, 8],
        });
        return icon;
      } catch (error) {
        console.log(error);
      }
    },

    createCircleMarkerOptions(item) {
      try {
        let status = {};
        status.radius = 4;
        status.stroke = false;
        status.fillOpacity = 0.9;
        status.fillColor =
          item.driveState === 0
            ? "#FFF000"
            : item.solStat === 4
            ? "#01EF83"
            : "#ff0000";
        status.fill =
          item.driveState === 0
            ? "#FFF000"
            : item.solStat === 4
            ? "#01EF83"
            : "#ff0000";

        return status;
      } catch (error) {
        console.log(error);
        return {
          radius: 4,
          stroke: false,
          fillOpacity: 0.9,
          fillColor: "#ff0000",
          fill: "ff0000",
        };
      }
    },

    createPopup(item) {
      let content = `
                <div>
                    <h5>${item.sn}</h5>
                </div>
            `;
      return content;
    },

    saveFarmMarker(sn, marker, markerData) {
      this.farmMarkers.push({
        sn: sn,
        marker: marker,
        markerData: markerData,
      });
    },

    getFarmMarker(sn) {
      try {
        let markerObj = this.farmMarkers.find((item) => item.sn === sn);
        return markerObj ? markerObj["marker"] : undefined;
      } catch (error) {
        console.log(error);
        return;
      }
    },

    removeFarmMarker(sn) {
      let index = this.farmMarkers.findIndex((item) => item.sn === sn);
      if (index >= 0) {
        let markerObj = this.farmMarkers[index];
        markerObj ? markerObj["marker"].remove() : "";
        this.farmMarkers.splice(index, 1);
      } else {
        console.log("删除点失败，因为没有找到对应的marker");
      }
    },

    // 动态计算在线数量，作业、和待机的农机设备
    countDeviceDynamic() {
      if (!this.valve) {
        this.valve = setTimeout(() => {
          this.valve = null;
          this.count();
        }, 2000);
      }
    },

    count() {
      let working302 = 0;
      let standby302 = 0;
      let working360 = 0;
      let standby360 = 0;
      let abNormalCar = 0;
      this.farmMarkers.forEach((item) => {
        item.markerData.driveState !== 0 && item.markerData.solStat !== 4
          ? abNormalCar++
          : "";
        if (item.markerData.terminalType === "AG302") {
          item.markerData.driveState === 0 ? ++standby302 : ++working302;
        } else {
          item.markerData.driveState === 0 ? ++standby360 : ++working360;
        }
      });
      this.working302 = working302;
      this.standby302 = standby302;
      this.working360 = working360;
      this.standby360 = standby360;
      this.abNormalCar = abNormalCar;
    },

    /**
     * @websocket逻辑
     */

    // 处理websocket数据
    listenMessage() {
      bus.$on("message", (data) => {
        this.handleMessageChange(data);
      });
    },

    // 筛选农机消息-派发处理
    handleMessageChange(data) {
      if (data.module === "farm" && data.type === "farmPt") {
        this.handleFarmMarkerChange(data);
      }
      if (data.module === "farm" && data.type === "workAreaCount") {
        this.totalArea = data.data.workArea.totalArea;
        this.todayArea = data.data.workArea.todayArea;
      }

      this.countDeviceDynamic();
    },

    // 区分消息类型
    handleFarmMarkerChange(data) {
      if (data.action === "online") {
        let marker = this.getFarmMarker(data.deviceSn);
        if (marker) {
          this.updateFarmMarker(marker, data.data);
          this.updateFarmMarkerData(data.deviceSn, data.data);
        } else {
          this.appendMarkers([data.data]);
        }
      }
      if (data.action === "offline") {
        let marker = this.getFarmMarker(data.deviceSn);
        if (marker) {
          this.removeFarmMarker(data.deviceSn);
        }
      }
      if (data.action === "upline") {
        let marker = this.getFarmMarker(data.deviceSn);
        if (!marker) {
          this.appendMarkers([data.data]);
        }
      }
    },

    // 更新农机信息
    updateFarmMarker(marker, data) {
      this.updateFarmMarkerPosition(marker, data);
      this.updateFarmMarkerIcon(marker, data);
    },

    // 更新位置信息
    updateFarmMarkerPosition(marker, data) {
      let point = this.createMarkerPoint(data);
      marker.setLatLng(point);
    },

    // 更新图标状态
    updateFarmMarkerIcon(marker, data) {
      // let icon = this.createMarkerIcon(data);
      // marker.setIcon(icon);
      let options = this.createCircleMarkerOptions(data);
      marker.setStyle(options);
    },

    // 更新marker原始数据-用于筛选
    updateFarmMarkerData(sn, data) {
      let markerObj = this.farmMarkers.find((item) => item.sn === sn);
      markerObj ? (markerObj["markerData"] = data) : "";
    },

    // 切换显示路网
    handleRoadnetChange(e) {
      if (e) {
        this.tileLayer[1].addTo(this.map);
      } else {
        this.tileLayer[1].remove();
      }
    },

    handleHeatMapChange(e) {
      if (e) {
        let latLngs = this.farmMarkers.map((item) => [
          item.marker._latlng.lat,
          item.marker._latlng.lng,
        ]);
        this.heatLayer = L.heatLayer(latLngs, { radius: 25 }).addTo(this.map);
      } else {
        this.heatLayer ? this.heatLayer.remove() : "";
        this.heatLayer = null;
      }
    },

    initHeatMap() {
      let latLngs = this.farmMarkers.map((item) => [
        item.marker._latlng.lat,
        item.marker._latlng.lng,
      ]);
      this.heatLayer = L.heatLayer(latLngs, { radius: 25 }).addTo(this.map);
    },
  },
};
</script>
<style scoped lang ='scss'>
.awareness {
  background-color: #030b21;
  height: 100%;
  min-width: 1100px;
  position: relative;
  font-size: 20px;
  .full_screen {
    position: absolute;
    top: 40px;
    left: 20px;
    cursor: pointer;
    color: #22ced9;
    z-index: 999;
  }
  .banner_container {
    height: 100px;
    background: url("~@/assets/common/aware.png");
    background-size: 100% 80%;
    background-repeat: no-repeat;
    background-position: 0px 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .banner_title {
      background-image: linear-gradient(to right, #21ff89, #00ffcc, #21ff89);
      background-size: 200% 200%;
      font-size: 2em;
      letter-spacing: 4px;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: effect 6s infinite;
    }
    .banner_time {
      position: absolute;
      color: #20ff8a;
      font-size: 1em;
      right: 20px;
      bottom: 20px;
      letter-spacing: 1px;
    }
    @keyframes effect {
      0% {
        background-position: 0% 0%;
      }
      50% {
        background-position: 100% 100%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
  }
  .grid_container {
    height: calc(100% - 100px);
    display: grid;
    grid-template-columns: repeat(24, 1fr);
    grid-template-rows: repeat(24, 1fr);
    grid-gap: 10px;
    padding: 10px;
    box-sizing: border-box;
    > div {
      box-shadow: inset 0 0 10px #21ff89;
      text-align: left;
      padding-top: 10px;
    }
    .grid_item_title {
      color: #9ecea1;
      font-size: 1em;
      font-weight: bold;
      letter-spacing: 1px;
      position: relative;
      padding-left: 22px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .grid_item_title:before {
      content: " ";
      display: inline-block;
      width: 8px;
      height: 100%;
      background: #9ecea1;
      position: absolute;
      left: 10px;
    }
    .outstanding {
      font-size: 2em;
      font-weight: 600;
      overflow: hidden;
      white-space: nowrap;
      text-align: center;
    }
    .online_device {
      grid-area: 1 / 1 / 7 / 8;
      color: #21ff89;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .row_title {
        font-size: 1em;
        font-weight: bold;
        .el-col {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .car_type {
        height: 45px;
        line-height: 45px;
        color: #9ecea1;
        font-size: 1em;
        font-weight: bold;
        letter-spacing: 1px;
        position: relative;
        padding-left: 22px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .car_type:before {
        content: " ";
        display: inline-block;
        width: 8px;
        height: 50%;
        background: #9ecea1;
        position: absolute;
        top: 25%;
        left: 10px;
      }
    }
    .abnormal_device {
      grid-area: 1 / 12 / 3 / 13;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999;
      background-color: rgba($color: #000000, $alpha: 0.6);
    }
    .today_area {
      grid-area: 1 / 8 / 7 / 12;
      color: #21ff89;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }

    // 省份统计
    .province_count {
      grid-area: 7 / 1 / 18 / 12;
      .count_table_container {
        padding: 0px 10px;
        font-size: 1em;
        height: calc(100% - 40px);
        overflow-y: auto;
        .el-icon-arrow-right {
          position: absolute;
          right: 10px;
          color: #21ff89;
        }
        .row_title {
          padding: 4px 0px;
          > div {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .row_province_container {
          overflow-y: auto;
        }
        .row_item {
          margin: 5px 0px;
          padding: 5px;
          background-color: #093a3c;
          // font-family: 'DS-Digital';
          cursor: pointer;
          transition: all 0.3s;
          .row_title_province {
            // white-space: nowrap;
            overflow: hidden;
            // text-overflow: ellipsis;
            // font-family: 'TiHei';
            text-align: left;

            .province_name {
              text-align: justify;
              display: inline-block;
              width: 65px;
            }
            .province_name:after {
              content: "";
              display: inline-block;
              width: 100%;
            }
          }
        }
        .row_item:hover {
          background: #0e575a;
          box-shadow: inset 0 0 10px #21ff89;
        }
      }
    }
    .active_device {
      grid-area: 18 / 1 / 25 / 12;
      position: relative;
      #vehicleChart {
        height: calc(100% - 35px);
      }
      .vehicle_legend {
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
        font-size: 14px;
        align-items: center;
        color: #fff;
        .legend_item {
          width: 20px;
          height: 10px;
          cursor: pointer;
          margin-right: 2px;
          background-color: gray;
        }
        .legend_item1 {
          background-color: #00ffcc;
        }
        .legend_item2 {
          background-color: #22ced9;
        }
        .legend_item3 {
          background-color: #feb419;
        }
      }
    }
    .work_area {
      grid-area: 18 / 12 / 25 / 25;
      position: relative;
      #areaChart {
        height: calc(100% - 35px);
      }
      .area_legend {
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
        font-size: 14px;
        align-items: center;
        color: #fff;
        .legend_item {
          width: 20px;
          height: 10px;
          cursor: pointer;
          margin-right: 2px;
          background-color: gray;
        }
        .legend_item1 {
          background-color: #00ffcc;
        }
        .legend_item2 {
          background-color: #22ced9;
        }
        .legend_item3 {
          background-color: #feb419;
        }
      }
    }
    .map {
      grid-area: 1 / 12 / 18 / 25;
      padding: 0px;
      position: relative;
      #awareness_map {
        width: 100%;
        height: 100%;
      }
      .awareness_map_legend {
        position: absolute;
        left: 10px;
        bottom: 10px;
        z-index: 999;
        font-size: 14px;
        background-color: rgba($color: #000000, $alpha: 0.6);
        padding: 5px 10px;
        border-radius: 5px;
        > .working {
          color: #21ff89;
        }
        > .working:before {
          content: "";
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #21ff89;
          margin-right: 4px;
        }

        > .notworking {
          color: #fff000;
        }
        > .notworking:before {
          content: "";
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #fff000;
          margin-right: 4px;
        }
        > .abnormal {
          color: red;
        }
        > .abnormal:before {
          content: "";
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: red;
          margin-right: 4px;
        }
      }
      .awareness_map_control {
        position: absolute;
        right: 10px;
        bottom: 10px;
        z-index: 999;
        background-color: rgba($color: #000000, $alpha: 0.6);
        padding: 3px;
        border-radius: 5px;
      }
    }
  }
}

@media screen and (max-width: 1366px) {
  .awareness {
    font-size: 16px;
  }
}

// @media screen and (min-height: 1920px) {
//     .awareness {
//         font-size: 24px;
//     }
// }
</style>
