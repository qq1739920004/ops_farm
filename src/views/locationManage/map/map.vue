<template>
  <div class="map_container">
    <div id="_map" class="baidu_map"></div>
    <div class="map_legend_">
      <el-checkbox-group v-model="checkList" @change="handleCheckChanged">
        <el-checkbox
          v-for="(item, index) in legend"
          :key="index"
          :label="index"
          checked
        >
          <img :src="item.imgUrl" width="24px" height="24px" alt="" />
          <span style="padding-left: 4px">{{ item.title }}</span>
          <span style="padding-left: 10px">{{ item.count }}</span>
        </el-checkbox>
      </el-checkbox-group>
      <div class="map_legend_icon">
        <div>
          <img
            src="./img/icon0309/icon_302.png"
            style="position: relative; top: 5px"
            alt=""
          />
          <span>AG302</span>
        </div>
        <div>
          <img
            src="./img/icon0309/icon_360.png"
            style="position: relative; top: 5px"
            alt=""
          />
          <span>神牛</span>
        </div>
      </div>
    </div>
    <div class="search_area">
      <div class="searchInput">
        <el-autocomplete
          v-model="searchValue"
          class="aysoicss"
          clearable
          size="small"
          placeholder="SN、车辆名、车主名、公司、电话"
          :fetch-suggestions="handleInput"
          :trigger-on-focus="false"
          @select="handleSelect"
          @clear="handleClear"
        >
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="handleSearchClick"
          ></i>
          <template slot-scope="{ item }">
            <el-row style="padding: 9px 0px; border-bottom: 1px solid #dcdfe6">
              <el-col :span="12" class="no_wrap">{{
                item.markerData.carName
              }}</el-col>
              <el-col :span="12" class="no_wrap">{{
                item.markerData.sn
              }}</el-col>
              <el-col :span="12" class="no_wrap">{{
                item.markerData.carOwnerName
              }}</el-col>
              <el-col :span="12" class="no_wrap">{{
                item.markerData.companyName
              }}</el-col>
            </el-row>
          </template>
        </el-autocomplete>
      </div>
    </div>
    <div class="back_to_begining">
      <div>
        <el-select
          v-model="mapName"
          size="small"
          :placeholder="$t('message.pleaseSelect')"
          @change="hangleSelectChange"
        >
          <el-option label="卫星地图" :value="0" />
          <el-option label="高德地图" :value="1" />
          <!-- <el-option label="谷歌地图" :value="2"></el-option> -->
        </el-select>
      </div>
      <div>
        <el-tooltip effect="light" content="点我回全局">
          <el-button
            class="el-icon-refresh-left"
            size="small"
            @click="resetMapState"
          />
        </el-tooltip>
      </div>
      <div>
        <el-tooltip effect="light" content="定位">
          <el-button
            class="el-icon-position"
            size="small"
            @click="getCurrentPosition"
          />
        </el-tooltip>
      </div>
      <div>
        <el-tooltip effect="light" content="测距">
          <el-button
            class="el-icon-plus"
            size="small"
            @click="calculateDistance"
          />
        </el-tooltip>
      </div>
      <div v-show="calculationObj.length > 0">
        <el-button class="el-icon-delete" size="small" @click="clearDistance">
          清除</el-button
        >
      </div>
    </div>
    <remote
      v-if="dialogVisibleManage"
      :marker-data="currentMarkerData"
      @closeMe="dialogVisibleManage = false"
    />
    <!-- 历史轨迹 -->
    <div v-if="locusShow" class="history_locus">
      <locus :car-obj="carObj" @closeMe="handleCloseMe" />
    </div>
  </div>
</template>
<script>
/*eslint-disable */
/**
 * @attention
 * @ChinaProvider插件只提供瓦片服务地址
 * @切换瓦片图逻辑应使用changeTileLayer函数
 */

import gcoord from "gcoord";
import remote from "../components/remote";
import pointInChina from "./pointInChina";
import bus from "@/utils/socket/bus";
import locus from "../components/locus";
import {
  onlineFarmMachinePosition_path,
  mapStatus_path,
} from "@/api/locationManage";

const single = require("./img/1single.png");
const location = require("./img/2location.png");
const float = require("./img/3float.png");
const fixed = require("./img/4fixed.png");
const base = require("./img/baseStation.png");
const unknow = require("./img/unknow.png");
const invalid = require("./img/invalid.png");
const fixed_ab = require("./img/fixed_ab.png");
const standby = require("./img/standby.png");

const singal0 = require("./img/s0.png");
const singal1 = require("./img/s1.png");
const singal2 = require("./img/s2.png");
const singal3 = require("./img/s3.png");
const singal4 = require("./img/s4.png");

const onlineStatus1 = require("./img/o1.png");
const onlineStatus2 = require("./img/o2.png");
const onlineStatus3 = require("./img/o3.png");
const redicon = require("./img/redicon.png");

const statusAbnormal = require("./img/stat_abnormal.png");
const statusNormal = require("./img/stat_normal.png");

const loc = require("./img/loc.png");

const ag302Abnormal = require("./img/icon0309/icon_302_abnormal.png");
const ag302Normal = require("./img/icon0309/icon_302_normal.png");
const ag302Standby = require("./img/icon0309/icon_302_standby.png");

const ag360Abnormal = require("./img/icon0309/icon_360_abnormal.png");
const ag360Normal = require("./img/icon0309/icon_360_normal.png");
const ag360Standby = require("./img/icon0309/icon_360_standby.png");

const legendAbnormal = require("./img/icon0309/icon_abnormal.png");
const legendNormal = require("./img/icon0309/icon_normal.png");
const legendStandby = require("./img/icon0309/icon_standby.png");

const focusAbnormal = require("./img/icon0309/focusAbnormal.png");
const focusNormal = require("./img/icon0309/focusNormal.png");
const focusStandby = require("./img/icon0309/Standby.png");

let markerClusterGroup  = L.markerClusterGroup()

let layerGroup = L.layerGroup()

function dmsTrans(decimal) {
  try {
    if (!decimal) {
      return 0;
    }
    let int = parseInt(decimal);
    let float = decimal - int;
    let decimal2 = float * 60;
    let int2 = parseInt(decimal2);
    let float2 = decimal2 - int2;
    let decimal3 = float2 * 60;
    return `${int}°${int2}'${decimal3.toFixed(3)}''`;
  } catch (err) {
    console.log(err);
    return decimal;
  }
}

export default {
  props: {
    locatingDeviceSn: {
      type: String,
      required: false,
    },
  },

  data() {
    return {
      map: null,
      searchValue: "",
      popupSn: "",
      popupShow: false,
      mapName: 0,
      dialogVisibleManage: false,
      currentMarkerData: null,
      pickupMode: false,
      pickedPoints: [],
      calculationObj: [],
      tileUrl: L.TileLayer.ChinaProvider.providers,
      tileLayer: [],
      farmMarkers: [],
      baseMarkers: [],
      positionMarker: [],
      checkList: [],
      legend: [
        {
          imgUrl: legendAbnormal,
          title: "异常",
          count: 0,
        },
        {
          imgUrl: legendNormal,
          title: "正常",
          count: 0,
        },
        {
          imgUrl: legendStandby,
          title: "待机",
          count: 0,
        },
        {
          imgUrl: base,
          title: "基站",
          count: 0,
        },
      ],
      originPoint: [36.172800343248, 100.406021546488],
      originZoom: 5,
      maxZoom: 18,
      minZoom: 1,
      zoom: 1, // 当前地图缩放层级
      criticalZoom: 8, // 地图层级临界值，使用不同的渲染逻辑，高于使用点聚合，低于值使用只更新当前视野值
      valve: null, // 锁,用于统计marker状态的节流逻辑
      currentView: [], // 当前视野坐标数组:左上-右上-右下-左下；
      renderEngine: "dom", // 原生dom渲染， 或者 polymer 聚合引擎；
      domMarkerLimit: 1000, // 使用dom渲染上限
      locusShow: false,
      carObj: {},
      focusMarker: null,
    };
  },
  methods: {
    initMap() {
      this.map = L.map("_map", {
        zoomControl: false,
        maxZoom: this.maxZoom,
      }).setView(this.originPoint, this.originZoom);
      L.control
        .scale({
          maxWidth: 150,
          metric: true,
          imperial: false,
          position: "bottomleft",
        })
        .addTo(this.map);
      this.handleMapChange(this.mapName);
      // 添加聚合图层
      this.map.addLayer(markerClusterGroup);
      this.map.addLayer(layerGroup);
      let that = this;
      //  拾取地图点坐标
      this.map.on("click", function (event) {
        if (that.pickupMode) {
          let point = event.latlng;
          that.pickedPoints.push(point);
          let marker = L.marker(point).addTo(that.map);
          that.calculationObj.push(marker);
          if (that.pickedPoints.length === 2) {
            let distance = that.pickedPoints[0].distanceTo(
              that.pickedPoints[1]
            ); //算距离
            let polyline = L.polyline(that.pickedPoints, { color: "red" })
              .addTo(that.map)
              .bindPopup(`相距:${distance.toFixed(3)}米`)
              .openPopup(); //划线
            that.calculationObj.push(polyline);
            that.map.fitBounds(that.pickedPoints); //适应视野
            //恢复状态
            that.pickupMode = false;
            that.pickedPoints = [];
            try {
              document.getElementById("_map").style.cursor = "grab";
            } catch (err) {
              console.log(err);
            }
            return;
          }
        }
      });

      // 获取缩放层级和视野范围
      this.map.on("zoomend", function (e) {
        that.zoom = e.sourceTarget._zoom;
        console.log("当前缩放层级" + e.sourceTarget._zoom);
        let view = that.map.getBounds();
        that.currentView = [
          [view._southWest.lng, view._northEast.lat],
          [view._northEast.lng, view._northEast.lat],
          [view._northEast.lng, view._southWest.lat],
          [view._southWest.lng, view._southWest.lat],
        ];
      });

      // 获取当前视野
      this.map.on("moveend", function (e) {
        let view = that.map.getBounds();
        that.currentView = [
          [view._southWest.lng, view._northEast.lat],
          [view._northEast.lng, view._northEast.lat],
          [view._northEast.lng, view._southWest.lat],
          [view._southWest.lng, view._southWest.lat],
        ];
      });
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

    // 恢复地图初始状态
    resetMapState() {
      this.map ? this.map.setView(this.originPoint, this.originZoom) : "";
    },

    hangleSelectChange() {
      this.handleMapChange(this.mapName);
    },

    /**
     * @说明
     * 0无效解、1单点解、2差分解、3浮动解、4固定解；但农机没有0和2，统一为浮动解！！！
     * 0: float,
     * 1: single,
     * 2: float,
     * 3: float,
     * 4: fixed
     */

    // 图例筛选 [0-4] 构造筛选条件; 0:自动驾驶异常、1：自动驾驶正常、2：待机
    handleCheckChange(e) {
      if (this.renderEngine === "dom") {
        window.farmMarkers.forEach((item) => {
          item.marker && item.marker.remove();
          if (e.includes(0)) {
            item.markerData.driveState !== 0 && item.markerData.solStat !== 4
              ? item.marker.addTo(layerGroup)
              : "";
          }
          if (e.includes(1)) {
            item.markerData.driveState !== 0 && item.markerData.solStat === 4
              ? item.marker.addTo(layerGroup)
              : "";
          }
          if (e.includes(2)) {
            item.markerData.driveState === 0
              ? item.marker.addTo(layerGroup)
              : "";
          }
        });
      }
      if (this.renderEngine === "polymer") {
        window.farmMarkers.forEach((item) => {
          item.marker && markerClusterGroup.removeLayer(item.marker);
          // item.marker && item.marker.remove();
          if (e.includes(0)) {
            item.markerData.driveState !== 0 && item.markerData.solStat !== 4
              ? item.marker.addTo(markerClusterGroup)
              : "";
          }
          if (e.includes(1)) {
            item.markerData.driveState !== 0 && item.markerData.solStat === 4
              ? item.marker.addTo(markerClusterGroup)
              : "";
          }
          if (e.includes(2)) {
            item.markerData.driveState === 0
              ? item.marker.addTo(markerClusterGroup)
              : "";
          }
        });
      }

      // 基站筛选
      if (e.includes(3)) {
        this.baseMarkers.forEach((item) => item.marker.addTo(this.map));
      } else {
        this.baseMarkers.forEach((item) => item.marker.remove());
      }
    },

    handleCheckChanged(e) {
      let testArray = [];

      function test(markerData = {}, funArray = []) {
        let result = false;
        for (let funItem of funArray) {
          if (funItem(markerData)) {
            result = true;
            break;
          }
        }
        return result;
      }

      function abnormalFilter(markerData) {
        return markerData.driveState !== 0 && markerData.solStat !== 4;
      }
      function normalFilter(markerData) {
        return markerData.driveState !== 0 && markerData.solStat === 4;
      }
      function standbyFilter(markerData) {
        return markerData.driveState === 0;
      }

      if (e.includes(0)) {
        testArray.push(abnormalFilter);
      }
      if (e.includes(1)) {
        testArray.push(normalFilter);
      }
      if (e.includes(2)) {
        testArray.push(standbyFilter);
      }
      // 基站筛选
      if (e.includes(3)) {
        this.baseMarkers.forEach((item) => item.marker.addTo(this.map));
      } else {
        this.baseMarkers.forEach((item) => item.marker.remove());
      }

      let that = this;

      if (this.renderEngine === "dom") {
        /**
         * @leaflet
         * @bug
         * @map中的hasLayer方法生效layerGroup中无法生效
         */
        window.farmMarkers.forEach((item) => {
          if (test(item.markerData, testArray)) {
            that.map.hasLayer(item.marker)
              ? ""
              : item.marker.addTo(layerGroup);
          } else {
            that.map.hasLayer(item.marker) ? item.marker.remove() : "";
          }
        });
      }
      if (this.renderEngine === "polymer") {
        window.farmMarkers.forEach((item) => {
          if (test(item.markerData, testArray)) {
            markerClusterGroup.hasLayer(item.marker)
              ? ""
              : item.marker.addTo(markerClusterGroup);
          } else {
            markerClusterGroup.hasLayer(item.marker)
              ? markerClusterGroup.removeLayer(item.marker)
              : "";
          }
        });
      }
    },

    //本地搜索功能、支持搜索模糊搜索sn、车辆名、车主名、公司
    handleSearch() {
      try {
        if (!this.searchValue) {
          // this.$message.warning('输入sn、车辆名、车主名、公司');
          return;
        }
        if (!window.farmMarkers.length) {
          // this.$message.warning('暂无数据');
          return;
        }
        //模糊匹配markers
        let farmMarkersMatched = window.farmMarkers.filter((item) => {
          return item.sn.includes(this.searchValue);
        });
        let latLngBounds = farmMarkersMatched.map((item) => {
          return [item.marker._latlng];
        });
        farmMarkersMatched.length === 1
          ? farmMarkersMatched[0]["marker"].openPopup()
          : "";
        this.map.fitBounds(latLngBounds);
      } catch (error) {
        console.log(error);
      }
    },

    handleSearchClick() {
      try {
        if (!this.searchValue) {
          this.$message.warning("输入sn、车辆名、车主名、公司");
          return;
        }
        if (!window.farmMarkers.length) {
          this.$message.warning("暂无数据");
          return;
        }
        //模糊匹配markers
        let farmMarkersMatched = window.farmMarkers.filter((item) => {
          return item.sn.includes(this.searchValue);
        });

        let filter = farmMarkersMatched.length;
        this.$message.warning(`搜索到${filter}条记录`);
        if (!filter) return;

        let latLngBounds = farmMarkersMatched.map((item) => {
          return [item.marker._latlng];
        });
        farmMarkersMatched.length
          ? farmMarkersMatched[0]["marker"].openPopup()
          : "";
        this.map.fitBounds(latLngBounds);
      } catch (error) {
        console.log(error);
      }
    },

    handleInput(queryString, cb) {
      try {
        if (!this.searchValue) {
          this.$message.warning("输入sn、车辆名、车主名、公司");
          return;
        }
        if (!window.farmMarkers.length) {
          this.$message.warning("暂无数据");
          return;
        }
        let filterData = window.farmMarkers.filter((item) => {
          return this.testMarker(item.markerData, queryString);
        });
        cb(filterData.slice(0, 10));
      } catch (error) {
        console.log(error);
      }
    },

    // 点击搜索结果
    handleSelect(item) {
      item.marker.addTo(layerGroup);
      item.marker.openPopup();
      this.map.fitBounds([item.marker._latlng]);
    },

    // 清空搜索框
    handleClear() {
      this.resetMapState();
    },

    // 搜索匹配规则
    testMarker(markerData, queryString) {
      try {
        return (
          markerData.sn.toString().includes(queryString) ||
          markerData.carName.includes(queryString) ||
          markerData.carOwnerName.includes(queryString) ||
          markerData.companyName.includes(queryString) ||
          markerData.tel.includes(queryString)
        );
      } catch (error) {
        console.log(error);
        return false;
      }
    },

    getCurrentPosition() {
      let that = this;
      // function succ(position) {
      //     let crd = position.coords;
      //     let p = [crd.latitude, crd.longitude];
      //     that.map.fitBounds([p]);
      // }

      // function fail(error) {
      //     console.log(error);
      //     switch(error.code) {
      //         case error.PERMISSION_DENIED:
      //             that.$message.warning('用户拒绝对获取地理位置的请求');
      //             break;
      //         case error.POSITION_UNAVAILABLE:
      //             that.$message.warning('地理位置信息不可用');
      //             break;
      //         case error.TIMEOUT:
      //             that.$message.warning('请求用户地理位置超时');
      //             break;
      //         case error.UNKNOWN_ERROR:
      //             that.$message.warning('未知错误');
      //             break;
      //         default :
      //             that.$message.warning('地理位置服务不可用');
      //             break;
      //     }
      // }

      // if ("geolocation" in navigator) {
      //     navigator.geolocation.getCurrentPosition(succ, fail);
      // } else {
      //     this.$message.warning('地理位置服务不可用')
      // }

      // 高德地图精确定位服务
      AMap.plugin("AMap.Geolocation", function () {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 10000, //超过10秒后停止定位，默认：5s
          buttonPosition: "RB", //定位按钮的停靠位置
          // buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          // zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
        });
        geolocation.getCurrentPosition(function (status, result) {
          if (status == "complete") {
            onComplete(result);
          } else {
            onError(result);
          }
        });

        function onComplete(data) {
          if (that.positionMarker.length) {
            that.positionMarker[0].remove();
            that.positionMarker = [];
          }
          let point = [data.position.lat, data.position.lng];
          let icon = L.icon({ iconUrl: loc });
          let marker = L.marker(point, { icon: icon }).addTo(that.map);
          that.positionMarker.push(marker);
          that.map.flyToBounds([point]);
        }

        function onError(data) {
          that.$message.warning("地理位置服务不可用");
        }
      });
    },

    loadOnlineFarmData() {
      onlineFarmMachinePosition_path().then((res) => {
        try {
          let data = res.data.onlineFarmMachines;

          if (data && data.length) {
            this.renderEngine =
              data.length >= this.domMarkerLimit ? "polymer" : "dom"; // 初始化确定渲染方式
            //   let testData=JSON.parse(JSON.stringify(data));
            //   let addData=[]
            //   for(let i=1;i<=10;i++){
            //     let data1=JSON.parse(JSON.stringify(data[0]));
            //     data1.posX=data[0].posX+0.00001*i;
            //     addData.push(data1)
            //   }
            // testData.splice(1,0,...addData);
            // this.appendMarkers(testData);
            this.appendMarkers(data);
            this.getRouteParams(); //检查路由参数
            this.handleSearch();
          }
          this.listenMessage();
          this.countSignalAndSnType(); //初始化统计信息
        } catch (error) {
          console.log(error);
        }
      });
    },

    appendMarkers(farmDataArray = []) {
      try {
        let that = this;

        let marker;
        let markers = [];
        farmDataArray.forEach((item, index) => {
          let point = this.createMarkerPoint(item);
          let icon = this.createMarkerIcon(item);

          let popup = this.createMakerPopup(item);

          // let baseMarker = L.marker(point, { icon: icon }).bindPopup(popup, {
          //   maxWidth: 500,
          // });
          if (this.renderEngine === "dom") {
            marker = L.marker(point, {
              icon: icon,
              riseOnHover: false,
              draggable: false,
            })
              .addTo(layerGroup)
              .bindPopup(popup);
          }

          if (this.renderEngine === "polymer") {
            // marker = L.marker(point, { icon: icon });

            // console.log(marker,);



            // // console.log(marker,'--766');
            // markers.push(marker);

            // if (index <= this.domMarkerLimit) {
            //   marker.addTo(markerClusterGroup);
            // }

            // markerClusterGroup.addLayers(
            //   window.farmMarkers.map((item) => item.marker)
            // );
            // if (index <= 1000) {
            //   marker.addTo(markerClusterGroup);
            // }

            marker = L.marker(point, { icon: icon })
              .addTo(markerClusterGroup)
              .bindPopup(popup);
          }

          //此处缺少拦截器，用于拦截新上来的设备，对筛选状态的匹配；动态是否添加到地图;

          //给marker添加双击事件用于聚焦
          marker.on("dblclick", function (event) {
            that.map.fitBounds([event.latlng]);
          });

          marker.on("click", function (event) {
            that.focusMarker = { sn: item.sn, marker, item };
          });

          if (item.baseDist > 30000) {
            marker.bindTooltip("远离基站", {
              permanent: true,
              opacity: 0.9,
              className: "away_from_base",
            });
          }

          // markers.push({sn:item.sn,marker:marker,item:item })

  
          this.saveFarmMarker(item.sn, marker, item);

   
        });
      } catch (error) {
        console.log(error);
      }
    },

    //生成marker点
    createMarkerPoint(item) {
      try {
        return this.coorTransform([item.posX, item.posY], this.mapName);
      } catch (error) {
        console.log(error);
        console.log(item);
        return [0, 0];
      }
    },

    //marker图标
    createMarkerIcon(item) {
      try {
        let imgUrl = unknow;
        if (item.terminalType === "AG302") {
          let icon302 = {
            0: ag302Abnormal,
            1: ag302Abnormal,
            2: ag302Abnormal,
            3: ag302Abnormal,
            4: ag302Normal,
          };
          imgUrl = icon302[item.solStat] || unknow;
          if (item.driveState === 0) {
            imgUrl = ag302Standby;
          }
        }
        if (item.terminalType === "AG360" || item.terminalType === "AG360Pro") {
          let icon360 = {
            0: ag360Abnormal,
            1: ag360Abnormal,
            2: ag360Abnormal,
            3: ag360Abnormal,
            4: ag360Normal,
          };
          imgUrl = icon360[item.solStat] || unknow;
          if (item.driveState === 0) {
            imgUrl = ag360Standby;
          }
        }

        // if(item.solStat === 4 && item.judgeLevel === '差') { //只有当sn_type为4时，才会有judgeLevel

        let icon = L.icon({
          iconUrl: imgUrl,
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });
        return icon;
      } catch (error) {
        console.log(error);
        return L.icon({
          iconUrl: unknow,
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });
      }
    },

    // 聚焦模式下
    createMarkerIconFocus(item) {
      try {
        let imgUrl;
        let focus = {
          0: focusAbnormal,
          1: focusAbnormal,
          2: focusAbnormal,
          3: focusAbnormal,
          4: focusNormal,
        };
        imgUrl = focus[item.solStat] || unknow;
        if (item.driveState === 0) {
          imgUrl = focusStandby;
        }

        let icon = L.icon({
          iconUrl: imgUrl,
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
          iconSize: [32, 32],
        });
        return icon;
      } catch (error) {
        console.log(error);
      }
    },

    //marker弹窗
    createMakerPopup(item) {
      let that = this;
      let onlineStatus = {
        0: onlineStatus1,
        1: onlineStatus2,
        2: onlineStatus3,
      };
      let workingStatus = {
        优: onlineStatus3,
        中: onlineStatus2,
        差: redicon,
      };
      let driveState = {
        0: "未开始",
        1: "入线",
        2: "在线", //自动驾驶
      };
      let snTypeReflect = {
        0: "无效解",
        1: "单点解",
        2: "差分解",
        3: "浮动解",
        4: "固定解",
      };
      let diffSource = {
        0: "电台",
        1: "网络",
        3: "罗网",
      };
      let netSignalImg = {
        0: singal0,
        1: singal1,
        2: singal2,
        3: singal3,
        4: singal4,
      };
      let netSignal = {
        0: "弱",
        1: "较弱",
        2: "一般",
        3: "较强",
        4: "强",
      };
      let content = `
                <div class="farm_popup_container">
                    <div class="popup_line">
                        <div class="popup_line_left">
                            <div class="popup_line_label">车辆名称:</div>
                            <div class="popup_line_value" title="${
                              item.carName
                            }">${item.carName}</div>
                        </div>
                        <div class="popup_line_right">
                            <div class="popup_line_label">SN:</div>
                            <div class="popup_line_value"  style="cursor: pointer;text-decoration: underline;" onclick="redirectCarList('${
                              item.sn
                            }')">${item.sn}</div>
                        </div>
                    </div>
                    <div class="popup_line">
                        <div class="popup_line_left">
                            <div class="popup_line_label">车主姓名:</div>
                            <div class="popup_line_value">${
                              item.carOwnerName || "/"
                            }</div>
                        </div>
                        <div class="popup_line_right">
                            <div class="popup_line_label">公司名称:</div>
                            <div class="popup_line_value" title='${
                              item.companyName
                            }'>${item.companyName}</div>
                        </div>
                    </div>
                    <div class="popup_line" style="margin-top:10px;">
                        <div class="popup_line_left">
                            <div class="popup_line_label">工作状态:</div>
                            <div class="popup_line_value">
                                <img width="8" height="8" src = ${
                                  workingStatus[item.judgeLevel] ||
                                  onlineStatus1
                                }></img>
                                ${item.judgeLevel || "无"}
                            </div>
                        </div>
                        <div class="popup_line_right">
                            <div class="popup_line_label">驾驶状态:</div>
                            <div class="popup_line_value">
                                <img width="8" height="8" src = ${
                                  onlineStatus[item.driveState]
                                }></img>
                                <span>${
                                  driveState[item.driveState] || "/"
                                }</span>
                            </div>
                        </div>
                    </div>
                    <div class="popup_line">
                        <div class="popup_line_left">
                            <div class="popup_line_label">解状态:</div>
                            <div class="popup_line_value">
                                <img width="8" height="8" src = ${
                                  item.solStat === 4
                                    ? statusNormal
                                    : statusAbnormal
                                }></img>
                                <span>${
                                  snTypeReflect[item.solStat] || "未知解"
                                }</span>
                            </div>
                        </div>
                        <div class="popup_line_right">
                            <div class="popup_line_label">差分链:</div>
                            <div class="popup_line_value">${
                              diffSource[item.diffSource] || "/"
                            } (${item.diffAge}s)</div>
                        </div>
                    </div>
                    <div class="popup_line">
                        <div class="popup_line_left">
                            <div class="popup_line_label">卫星数量:</div>
                            <div class="popup_line_value">${item.satNum}</div>
                        </div>
                        <div class="popup_line_right">
                            <div class="popup_line_label">基站距离:</div>
                            <div class="popup_line_value">${
                              (item.baseDist / 1000).toFixed(3) || "/"
                            } Km</div>
                        </div>
                    </div>
                    <div class="popup_line">
                        <div class="popup_line_left">
                            <div class="popup_line_label">4G信号:</div>
                            <div class="popup_line_value">
                                <img width="14" height="14" style="position:relative;top:2px;" src = ${
                                  netSignalImg[item.netSignal]
                                }></img>
                                <span>${netSignal[item.netSignal] || "/"}</span>
                            </div>
                        </div>
                        <div class="popup_line_right">
                            <div class="popup_line_label">终端类型:</div>
                            <div class="popup_line_value">${
                              item.terminalType || "/"
                            }</div>
                        </div>
                        
                    </div>
                    <div class="popup_line">
                        <div class="popup_line_left">
                            <div class="popup_line_label">经度:</div>
                            <div class="popup_line_value">${dmsTrans(
                              item.posY
                            )}</div>
                        </div>
                        <div class="popup_line_left">
                            <div class="popup_line_label">卡状态:</div>
                            <div class="popup_line_value">${
                              item.cardUsage
                                ? item.cardUsage === 1
                                  ? "卡1"
                                  : item.cardUsage === 2
                                  ? "卡2"
                                  : "双卡"
                                : "/"
                            }</div>
                        </div>
                    </div>
                    <div class="popup_line">
                        <div class="popup_line_right">
                            <div class="popup_line_label">纬度:</div>
                            <div class="popup_line_value">${dmsTrans(
                              item.posX
                            )} </div>
                        </div>
                    </div>
                    <div class="popup_fun" style="margin-top:10px;">
                        <div class="popup_fun_left remote_control_${
                          item.driveState
                        }" onclick='remoteControl(${JSON.stringify(
        item
      )})' title="${item.driveState !== 0 ? "自动驾驶状态不可远程管理" : ""}">
                            远程管理
                        </div>
                        <div class="popup_fun_right history_drive_trend" onclick='openHistoryTrace(${JSON.stringify(
                          item
                        )})'>
                            历史轨迹
                        </div>
                    </div>
                    <div class="popup_fun">
                        <div class="popup_fun_left auto_drive_${
                          item.driveState
                        }" onclick="openRealTimeDrive('${item.sn}', ${
        item.driveState
      })" title="${
        item.driveState === 0 ? "非自动驾驶状态，无实时驾驶趋势" : ""
      }">
                            实时驾驶趋势图
                        </div>
                        <div class="popup_fun_right history_drive_trend" onclick="openHistoryDrive('${
                          item.sn
                        }')">
                            历史驾驶趋势图
                        </div>
                    </div>
                </div>
            `;
      return content;
    },

    saveFarmMarker(sn, marker, markerData) {
      window.farmMarkers.push({
        sn: sn,
        marker: marker,
        markerData: markerData,
      });
    },

    getFarmMarker(sn) {
      try {
        let markerObj = window.farmMarkers.find((item) => item.sn === sn);
        return markerObj ? markerObj["marker"] : undefined;
      } catch (error) {
        console.log(error);
        return;
      }
    },

    removeFarmMarker(sn) {
      let index = window.farmMarkers.findIndex((item) => item.sn === sn);
      if (index >= 0) {
        let markerObj = window.farmMarkers[index];
        if (this.renderEngine === "dom") {
          markerObj ? markerObj["marker"].remove() : "";
        }
        if (this.renderEngine === "polymer") {
          markerObj
            ? markerClusterGroup.removeLayer(markerObj["marker"])
            : "";
        }
        window.farmMarkers.splice(index, 1);
      } else {
        console.log("删除点失败，因为没有找到对应的marker");
      }
    },

    //更新农机信息
    updateFarmMarker(marker, data) {
      this.updateFarmMarkerPosition(marker, data);
      this.updateFarmMarkerIcon(marker, data);
      this.updateFarmMarkerPopup(marker, data);
      this.updateFarmMarkerTooltip(marker, data);
      this.updateFarmMarkerAngle(marker, data);
    },

    //更新位置信息
    updateFarmMarkerPosition(marker, data) {
      let point = this.createMarkerPoint(data);

      if (
        this.focusMarker &&
        this.focusMarker.sn === data.sn &&
        this.map.getZoom() > 14
      ) {
        marker.slideTo(point, {
          duration: 6000,
          keepAtCenter: false,
        });
        // marker.setLatLng(point);
      } else {
        marker.setLatLng(point);
      }
    },

    //更新图标状态
    updateFarmMarkerIcon(marker, data) {
      let icon;
      if (
        this.focusMarker &&
        this.focusMarker.sn === data.sn &&
        this.map.getZoom() > 14
      ) {
        icon = this.createMarkerIconFocus(data);
      } else {
        icon = this.createMarkerIcon(data);
      }
      marker.setIcon(icon);
    },

    // 更新弹窗状态
    updateFarmMarkerPopup(marker, data) {
      let popup = this.createMakerPopup(data);
      marker.setPopupContent(popup);
    },

    //更新tooltip
    updateFarmMarkerTooltip(marker, data) {
      try {
        marker.unbindTooltip();
        if (data.baseDist > 30000) {
          marker.bindTooltip("远离基站", {
            permanent: true,
            opacity: 0.9,
            className: "away_from_base",
          });
        }
      } catch (error) {
        console.log(error);
      }
    },

    //更新旋转角度
    updateFarmMarkerAngle(marker, data) {
      if (
        this.focusMarker &&
        this.focusMarker.sn === data.sn &&
        this.map.getZoom() > 14
      ) {
        if (data.terminalType === "AG360Pro") {
          marker.setRotationOrigin("center", "center");
          marker.setRotationAngle(data.heading);
        }
        if (data.terminalType === "AG360") {
          marker.setRotationOrigin("center", "center");
          marker.setRotationAngle(data.heading);
        }
        if (data.terminalType === "AG302") {
          marker.setRotationOrigin("center", "center");
          marker.setRotationAngle(data.heading - 90);
        }
      } else {
        marker.setRotationAngle(0);
      }
    },

    //更新marker原始数据-用于筛选
    updateFarmMarkerData(sn, data) {
      let markerObj = window.farmMarkers.find((item) => item.sn === sn);
      markerObj ? (markerObj["markerData"] = data) : "";
    },

    // 处理websocket数据
    listenMessage() {
      bus.$on("message", (data) => {
        // this.handleMessageChange(data);
      });
    },

    //筛选农机消息-派发处理
    handleMessageChange(data) {
      if (data.module === "farm" && data.type === "farmPt") {
        this.handleFarmMarkerChange(data);
      }
      this.countSignalAndSnType(); //更新状态后进行计算！
    },

    //区分消息类型
    handleFarmMarkerChange(data) {
      if (data.action === "online") {
        let marker = this.getFarmMarker(data.deviceSn);
        if (marker) {
          if (this.shouldUpateMarker(marker)) {
            this.updateFarmMarker(marker, data.data); // 只在必要时，更新marker；原始数据需要对应筛选状态，需要一直更新,但这样会导致筛选的状态与地图状态不一致，所以还是需要同步。
            this.updateFarmMarkerData(data.deviceSn, data.data);
          }
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

    // 只更新当视野内marker；
    shouldUpateMarker(marker) {
      // 原生dom渲染直接更新
      if (this.renderEngine === "dom") return true;
      // 聚合状态节省计算资源
      if (this.renderEngine === "polymer") {
        if (this.zoom <= this.criticalZoom) return false;
        return this.isOnView(
          [marker._latlng.lng, marker._latlng.lat],
          this.currentView
        );
      }
    },

    isOnView(checkPoint, polygonPoints) {
      var counter = 0;
      var i;
      var xinters;
      var p1, p2;
      var pointCount = polygonPoints.length;
      p1 = polygonPoints[0];
      for (i = 1; i <= pointCount; i++) {
        p2 = polygonPoints[i % pointCount];
        if (
          checkPoint[0] > Math.min(p1[0], p2[0]) &&
          checkPoint[0] <= Math.max(p1[0], p2[0])
        ) {
          if (checkPoint[1] <= Math.max(p1[1], p2[1])) {
            if (p1[0] != p2[0]) {
              xinters =
                ((checkPoint[0] - p1[0]) * (p2[1] - p1[1])) / (p2[0] - p1[0]) +
                p1[1];
              if (p1[1] == p2[1] || checkPoint[1] <= xinters) {
                counter++;
              }
            }
          }
        }
        p1 = p2;
      }
      if (counter % 2 == 0) {
        return false;
      } else {
        return true;
      }
    },

    //统计信号强度分布、解算状态
    countSignalAndSnType() {
      try {
        if (!this.valve) {
          this.valve = setTimeout(() => {
            this.valve = null;
            count = count.bind(this);
            count();
          }, 2000);
        }
        function count() {
          let strong = 0,
            medium = 0,
            weak = 0;
          let normal = 0,
            abnormal = 0,
            standby = 0;

          if (window.farmMarkers.length >= 0) {
            window.farmMarkers.forEach((item) => {
              // 统计信号
              item.markerData.netSignal <= 1 ? weak++ : "";
              item.markerData.netSignal === 2 ? medium++ : "";
              item.markerData.netSignal >= 3 ? strong++ : "";
              // 统计解算状态 --- 正常\异常仅在自动驾驶的状态下
              if (item.markerData.driveState === 0) {
                standby++;
              } else {
                item.markerData.solStat === 4 ? normal++ : abnormal++;
              }
            });
            this.$store.dispatch("index/setNetSingalCount", [
              strong,
              medium,
              weak,
            ]);
            // this.$store.commit('countNetSingal', [strong, medium, weak])

            this.legend[0].count = abnormal;
            this.legend[1].count = normal;
            this.legend[2].count = standby;
          }
          // 根据marker数量更换渲染引擎;
          this.renderEngine =
            window.farmMarkers.length >= this.domMarkerLimit
              ? "polymer"
              : "dom";

          if (this.baseMarkers.length >= 0) {
            //统计基站数量
            this.legend[3].count = this.baseMarkers.length;
          }
        }
      } catch (error) {
        console.log(error);
      }
    },

    switchRenderEngine(engine) {
      switch (engine) {
        case "dom":
          markerClusterGroup.removeLayers(
            window.farmMarkers.map((item) => item.marker)
          );
          window.farmMarkers.forEach((item) =>
            item.marker.addTo(layerGroup)
          );
          // window.farmMarkers.forEach(item => {
          //     markerClusterGroup.removeLayer(item.marker);
          //     item.marker.addTo(layerGroup);
          // });
          break;

        case "polymer":
          
          layerGroup.clearLayers();

          markerClusterGroup.addLayers(
            farmMarkers.map((item) => item.marker)
          );

          return
          // window.farmMarkers.forEach(item => {
          //     item.marker && item.marker.remove();
          //     item.marker.addTo(markerClusterGroup);
          // });
          break;
      }
    },

    /**
     * @基站逻辑相关
     */
    loadBaseData() {
      mapStatus_path().then((res) => {
        try {
          let list = res.data.data.cdcStation.list.filter(
            (item) => item.conditionNet !== "-1"
          );
          this.appendBaseMarker(list);
        } catch (error) {
          console.log(error);
        }
      });
      // 临时静态基站数据
      // let res = [
      //     {baseName: 'AWTX', posX: 40.385648655, posY: 80.372037331, posh: 989.8546 },
      //     {baseName: 'ertuan', posX: 40.590093364, posY: 79.834218839, posh: 106.2250 },
      //     {baseName: 'wushituan', posX: 39.928080247, posY: 79.425164764, posh: 1035.4062 },
      //     {baseName: 'alaer', posX: 40.587480767, posY: 81.146682905, posh: 962.5786 },
      //     {baseName: 'sishijiituan', posX: 39.707342394, posY: 78.927399845, posh: 1063.6075 }
      // ];
    },

    appendBaseMarker(data = []) {
      try {
        data.forEach((item) => {
          let point = this.createBasePoint(item);
          let icon = this.createBaseIcon(item);
          let popup = this.createBasePopup(item);
          let marker = L.marker(point, { icon: icon })
            .addTo(this.map)
            .bindPopup(popup);
          this.saveBaseMarker("123456", marker, item);
        });
      } catch (error) {
        console.log(error);
      }
    },

    createBasePoint(item) {
      try {
        return this.coorTransform(
          [item.coordinateb, item.coordinatel],
          this.mapName
        );
      } catch (error) {
        console.log(error);
      }
    },

    createBaseIcon(item) {
      try {
        let icon = L.icon({
          iconUrl: base,
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });
        return icon;
      } catch (error) {
        console.log(error);
      }
    },

    createBasePopup(item) {
      let commumode = {
        1: "电台",
        2: "网络",
        3: "电台+网络",
        undefined: "电台",
      };
      let commumode_en = {
        1: "Internal Radio",
        2: "External Radio",
        3: "Network",
        undefined: "电台",
      };
      let workpattern = {
        0: "移动站",
        1: "智能基站",
        2: "普通基站",
      };
      let text = `
                <div class="text_container_base">
                    <div class="each_line">
                        <div class="left">基站名称：</div>
                        <div class="right">${item.name || "/"}</div>
                    </div>
                    <div class="each_line">
                        <div class="left">设备IP：</div>
                        <div class="right">${item.ip || "/"}</div>
                    </div>
                    <div class="each_line">
                        <div class="left">${this.$t(
                          "message.onlineStatus"
                        )}：</div>
                        <div class="right">在线</div>
                    </div>
                    <div class="each_line">
                        <div class="left">位置：</div>
                        <div class="right" title=${item.province + item.city}>${
        item.province + item.city || "/"
      }</div>
                    </div>
                    <div class="each_line">
                        <div class="left">${this.$t(
                          "message.longitude"
                        )}：</div>
                        <div class="right">${dmsTrans(item.coordinatel)}</div>
                    </div>
                    <div class="each_line">
                        <div class="left">${this.$t("message.latitude")}：</div>
                        <div class="right">${dmsTrans(item.coordinateb)}</div>
                    </div>
                    <div class="each_line">
                        <div class="left">${this.$t("message.altitude")}：</div>
                        <div class="right">${
                          item.coordinateh ? item.coordinateh.toFixed(3) : "/"
                        } ${item.coordinateh ? " m" : ""}</div>
                    </div>
                    <div class="each_line">
                        <div class="left">更新时间：</div>
                        <div class="right">${
                          this.dateTimeTrans(item.updateTime) || "/"
                        }</div>
                    </div>
                    <div class="each_line">
                        <div class="left">网络协议：</div>
                        <div class="right">${item.protocoltype || "/"}</div>
                    </div>
                    <div class="each_line">
                        <div class="left">挂载点：</div>
                        <div class="right" title=${item.moutpoint}>${
        item.moutpoint || "/"
      }</div>
                    </div>
                    <!--
                    <div class="each_line">
                        <div class="left">接收机类型：</div>
                        <div class="right">${item.receivename || "/"}</div>
                    </div>
                    -->
                    <div class="each_line">
                        <div class="left">接收机编码：</div>
                        <div class="right">${item.receiveid || "/"}</div>
                    </div>
                </div>
            `;
      return text;
    },

    saveBaseMarker(sn, marker, markerData) {
      this.baseMarkers.push({
        sn: sn,
        marker: marker,
        markerData: markerData,
      });
    },

    /**
     * @代码分界线以下为旧版本代码后期逐步删除todelete
     */

    // 传入原始数据即可
    // addMarkers(pointList= []) {
    //     if(!Array.isArray(pointList)){
    //         console.log('pointList must be Array, and pointList length is required ');
    //         return;
    //     }
    //     try{
    //         let that = this;
    //         pointList.forEach((item, index ) => {
    //             let point = this.coorTransform([item.posX, item.posY], this.mapName); // 转换坐标
    //             let imgReflect = {
    //                 0: float,
    //                 1: single,
    //                 // 2: location,
    //                 2: float,
    //                 3: float,
    //                 4: fixed
    //             };
    //             let imgUrl;
    //             if(item.solStat !== 4) {
    //                 imgUrl = imgReflect[item.solStat] || unknow;
    //             }
    //             if(item.solStat === 4) {
    //                 if(item.judgeLevel === '优' || item.judgeLevel === '中' || item.judgeLevel === undefined) {
    //                     imgUrl = fixed;
    //                 }
    //                 if(item.judgeLevel === '差') {
    //                     imgUrl = fixed_ab;
    //                 }
    //             }
    //             let snTypeReflect = {
    //                 0: '无效解',
    //                 1: '单点解',
    //                 2: '差分解',
    //                 3: '浮动解',
    //                 4: '固定解'
    //             };
    //             let diffSource = {
    //                 0: '电台',
    //                 1: '网络'
    //                 // 1: '电台',
    //                 // 2: '网络',
    //                 // 3: '电台+网络'
    //             };

    //             let netSignal = {
    //                 0: '弱',
    //                 1: '较弱',
    //                 2: '一般',
    //                 3: '较强',
    //                 4: '强'
    //             };
    //             let netSignalImg = {
    //                 0: singal0,
    //                 1: singal1,
    //                 2: singal2,
    //                 3: singal3,
    //                 4: singal4
    //             };
    //             let onlineStatus = {
    //                 0: onlineStatus1,
    //                 1: onlineStatus2,
    //                 2: onlineStatus3
    //             };
    //             let driveState = {
    //                 0: '未开始',
    //                 1: '入线',
    //                 2: '在线'
    //             };
    //             let workingStatus = {
    //                 '优': onlineStatus3,
    //                 '中': onlineStatus2,
    //                 '差': redicon
    //             };
    //             let icon = L.icon({
    //                 iconUrl: imgUrl,
    //                 iconAnchor: [16, 32],
    //                 popupAnchor: [0, -32],
    //             });
    //             let text = `
    //                 <div class="text_container">
    //                     <div class="text_container_head">
    //                         <div class="each_line">
    //                             <div class="left">车辆名称:</div>
    //                             <div class="right">${item.carName || '/'}</div>
    //                         </div>
    //                         <div class="each_line" style="cursor: pointer;" onclick="redirectCarList('${item.oemSn}')">
    //                             <div class="left">设备SN:</div>
    //                             <div class="right" id="map_farm_oemsn" style="text-decoration: underline;">${ item.oemSn || '/'}</div>
    //                         </div>
    //                         <div class="each_line">
    //                             <div class="left">公司名称: </div>
    //                             <div class="right">${ item.companyName || '/' }</div>
    //                         </div>
    //                     </div>
    //                     <div class="text_container_body">
    //                         <div class="each_line">
    //                             <div class="left">工作状态:</div>
    //                             <div class="right">
    //                                 <img width="8" height="8" src = ${ workingStatus[item.judgeLevel] }></img>
    //                                 <span>${ item.judgeLevel || '/' }</span>
    //                             </div>
    //                         </div>
    //                         <div class="each_line">
    //                             <div class="left">驾驶状态:</div>
    //                             <div class="right">
    //                                 <img width="8" height="8" src = ${ onlineStatus[item.driveState] }></img>
    //                                 <span>${ driveState[item.driveState] || '/' }</span>
    //                             </div>
    //                         </div>
    //                         <div class="each_line">
    //                             <div class="left">横向偏差:</div>
    //                             <div class="right">${ item.lateralOffset ? Math.round(item.lateralOffset) : '/' } ${item.lateralOffset ? ' cm' : ''}</div>
    //                         </div>
    //                         <div class="each_line">
    //                             <div class="left">解状态:</div>
    //                             <div class="right">${ snTypeReflect[item.solStat] || '未知解' }</div>
    //                         </div>
    //                         <div class="each_line">
    //                             <div class="left">速度:</div>
    //                             <div class="right">${ item.speed.toFixed(3) || '/' } ${item.speed || item.speed === 0 ? ' km/h' : ''} </div>
    //                         </div>
    //                         <div class="each_line">
    //                             <div class="left">基站距离:</div>
    //                             <div class="right">
    //                                 <span>${(item.baseDist / 1000).toFixed(3) || '/' } km</span>
    //                                 <span class="away_from_base">${item.baseDist > 30000 ? '远离基站': ''}</span>
    //                             </div>
    //                         </div>
    //                         <div class="each_line">
    //                             <div class="left">航向角:</div>
    //                             <div class="right">${ item.heading ? item.heading.toFixed(3) : '/' } ${item.heading ? ' °' : ''}</div>
    //                         </div>
    //                         <div class="each_line">
    //                             <div class="left">4G信号强度:</div>
    //                             <div class="right">
    //                                 <span>${ netSignal[item.netSignal] || '/' }</span>
    //                                 <img width="14" height="14" src = ${ netSignalImg[item.netSignal] }></img>
    //                             </div>
    //                         </div>
    //                         <div class="each_line">
    //                             <div class="left">航向角偏差:</div>
    //                             <div class="right">${ item.headingOffset.toFixed(3) || '/' } ${item.headingOffset || item.headingOffset === 0 ? ' °' : ''}</div>
    //                         </div>
    //                         <div class="each_line">
    //                             <div class="left">差分链:</div>
    //                             <div class="right">${ diffSource[item.diffSource] || '/' }</div>
    //                         </div>
    //                         <div class="each_line">
    //                             <div class="left">使用卫星数量:</div>
    //                             <div class="right">${ item.satNum || '/' }</div>
    //                         </div>
    //                         <div class="each_line">
    //                             <div class="left">纬度:</div>
    //                             <div class="right">${item.posX ? trans(item.posX,0)[0][0]+'° ' + trans(item.posX,0)[0][1] + "' " + trans(item.posX,0)[0][2].toFixed(5) + "''" : '/'   }</div>
    //                         </div>
    //                         <div class="each_line">
    //                             <div class="left">高程:</div>
    //                             <div class="right">${ item.posZ ? item.posZ.toFixed(3) : '/' } ${item.posZ ? ' m' : ''} </div>
    //                         </div>
    //                         <div class="each_line">
    //                             <div class="left">经度:</div>
    //                             <div class="right">${ item.posY ? trans(item.posY,0)[0][0]+'° ' + trans(item.posY,0)[0][1] + "' " + trans(item.posY,0)[0][2].toFixed(5) + "''" : '/'  }</div>
    //                         </div>

    //                         <!--
    //                         <div class="each_line">
    //                             <div class="left">开始时间:</div>
    //                             <div class="right">${ timeTrans(item.startTime) || '/' }</div>
    //                         </div>
    //                         -->
    //                         <div class="each_line">
    //                             <div class="left">最近自动驾驶:</div>
    //                             <div class="right">${ timeTrans(item.lastAutoDriveTime) || '/' }</div>
    //                         </div>
    //                         <div class="each_line">
    //                             <div class="left">差分龄期:</div>
    //                             <div class="right">${ item.diffAge === undefined ? '/' : item.diffAge }</div>
    //                         </div>
    //                         <div class="each_line">
    //                             <div class="left">累计作业面积:</div>
    //                             <div class="right">${ item.workArea === undefined ? '/' : item.workArea.toFixed(2) }</div>
    //                         </div>

    //                         <div class="button_container">
    //                             <div onclick="handleRemoteControl()" class="remote_control_${that.$store.state.permission.includes(76)}">远程管理</div>
    //                             <div onclick="openRealTimeDrive('${item.oemSn}')" class="auto_drive_${item.driveState}">实时驾驶趋势图</div>
    //                             <div onclick="openHistoryDrive('${item.oemSn}')" class="history_drive_trend" >历史驾驶趋势图</div>
    //                             <div onclick="openHistoryTrace('${item.oemSn}','${item.addrcode}')" class="history_drive_trend" >历史轨迹</div>
    //                         </div>
    //                     </div>
    //                 </div>
    //             `

    //             let marker = L.marker(point, {icon: icon}).addTo(this.map).bindPopup(text).on('click',function(){
    //                 that.popupSn = item.oemSn;
    //                 that.popupShow = true;
    //                 that.currentMarkerData = item;
    //             });
    //             if(item.baseDist > 30000) {
    //                 marker.bindTooltip('远离基站', {permanent: true, opacity: 0.9, className: 'away_from_base'});
    //             }
    //             window.websocketMarkerSet.push({oemSn: item.oemSn, markerObj: marker});
    //         })
    //     }catch(err){
    //         console.log(err);
    //     }
    // },

    // addBaseStationMarkers( pointList = [] ) {
    //     if(!Array.isArray(pointList)){
    //         console.log('pointList must be Array, and pointList length is required ');
    //         return;
    //     }
    //     try {
    //         let that = this;
    //         pointList.forEach((item, index ) => {
    //             let point = this.coorTransform([item.posx, item.posy], this.mapName); // 转换坐标
    //             let icon = L.icon({
    //                 iconUrl: base,
    //                 iconAnchor: [16, 32],
    //                 popupAnchor: [0, -32],
    //             });
    //             let commumode = {
    //                 1: '电台',
    //                 2: '网络',
    //                 3: '电台+网络',
    //                 undefined: '电台'
    //             };
    //             let commumode_en = {
    //                 1: 'Internal Radio',
    //                 2: 'External Radio',
    //                 3: 'Network',
    //                 undefined: '电台'
    //             };
    //             let workpattern = {
    //                 0: '移动站',
    //                 1: '智能基站',
    //                 2: '普通基站'
    //             };

    //             let text = `
    //                 <div class="text_container_base">
    //                     <div class="each_line">
    //                         <div class="left">基站名称：</div>
    //                         <div class="right">${item.baseName || '/'}</div>
    //                     </div>
    //                     <div class="each_line">
    //                         <div class="left">${this.$t('message.DeviceSn')}：</div>
    //                         <div class="right">${item.deviceSn || '/'}</div>
    //                     </div>
    //                     <div class="each_line">
    //                         <div class="left">${this.$t('message.onlineStatus')}：</div>
    //                         <div class="right">${(item.onlinetcp || item.onlinehttp) ? this.$t('message.online_1225') : this.$t('message.offline_1225')}</div>
    //                     </div>
    //                     <div class="each_line">
    //                         <div class="left">${this.$t('message.workMode')}：</div>
    //                         <div class="right">${ workpattern[item.workpattern] || '/' }</div>
    //                     </div>
    //                     <div class="each_line">
    //                         <div class="left">${this.$t('message.longitude')}：</div>
    //                         <div class="right">${ item.posy ? trans(item.posy,0)[0][0]+'° ' + trans(item.posy,0)[0][1] + "' " + trans(item.posy,0)[0][2].toFixed(5) + "''" : '/'  }</div>
    //                     </div>
    //                     <div class="each_line">
    //                         <div class="left">${this.$t('message.latitude')}：</div>
    //                         <div class="right">${item.posx ? trans(item.posx,0)[0][0]+'° ' + trans(item.posx,0)[0][1] + "' " + trans(item.posx,0)[0][2].toFixed(5) + "''" : '/'   }</div>
    //                     </div>
    //                     <div class="each_line">
    //                         <div class="left">${this.$t('message.altitude')}：</div>
    //                         <div class="right">${item.posh ? item.posh.toFixed(3) : '/' } ${item.posh ? ' m' : ''}</div>
    //                     </div>
    //                     <div class="each_line">
    //                         <div class="left">${this.$t('message.lasttime')}：</div>
    //                         <div class="right">${ timeTrans(item.lasttime) || '/' }</div>
    //                     </div>
    //                     <div class="each_line">
    //                         <div class="left">${this.$t('message.battery')}：</div>
    //                         <div class="right">${item.battery || '/'} ${item.battery ? ' %' : ''} </div>
    //                     </div>
    //                     <div class="each_line">
    //                         <div class="left">${this.$t('message.radioFrequency')}：</div>
    //                         <div class="right">${item.radiofrequency || '/' }</div>
    //                     </div>
    //                     <!--
    //                     <div class="each_line">
    //                         <div class="left">${this.$t('message.workstatus')}：</div>
    //                         <div class="right">${item.workstatus === 0 ? this.$t('message.notWorking') : this.$t('message.working') }</div>
    //                     </div>
    //                     -->
    //                     <div class="each_line">
    //                         <div class="left">${this.$t('message.commumode')}：</div>
    //                         <div class="right">${ item.commumode ? commumode[item.commumode] : '/' }</div>
    //                     </div>
    //                     <div class="each_line">
    //                         <div class="left">${this.$t('message.satnum')}：</div>
    //                         <div class="right">${item.satnum || '/' }</div>
    //                     </div>
    //                 </div>
    //             `;
    //             let marker = L.marker(point, {icon: icon}).addTo(this.map).bindPopup(text).on('click', function() {
    //                 that.popupSn = item.deviceSn;
    //             });
    //             window.websocketBaseMarkerSet.push({oemSn: item.deviceSn, markerObj: marker});
    //         })
    //     }catch(err) {
    //         console.log(err);
    //     }
    // },

    /**
     * @代码分界线以上为待删除代码
     */

    calculateDistance() {
      try {
        document.getElementById("_map").style.cursor = "crosshair"; // 改变鼠标状态
      } catch (err) {
        console.log(err);
      }
      this.pickupMode = true; //开启拾取模式
    },

    clearDistance() {
      if (this.calculationObj.length) {
        this.calculationObj.forEach((item) => {
          this.map.removeLayer(item);
        });
        this.calculationObj = [];
      }
      this.pickupMode = false;
      this.pickedPoints = [];
      try {
        document.getElementById("_map").style.cursor = "grab";
      } catch (err) {
        console.log(err);
      }
    },

    redirectCarList(oemSn) {
      this.$router.push({
        name: "carList",
        params: {
          deviceSn: oemSn,
        },
      });
    },

    // 获取路由参数
    getRouteParams() {
      let sn = this.$route.params.deviceSn;
      if (!sn) return;
      this.searchValue = sn;
      this.$route.params.deviceSn = ""; //清除路由参数
    },

    // 根据mapName判断当前地图类型 1:gaode; 2:baidu; 3 :google; 4 :osm

    coorTransform(point = [], mapType = 1) {
      //经纬度顺序 gcoor 需要 [116.403988, 39.914266] 经度在前
      // if( !pointInChina(point) ) {
      //     return point;
      // }
      let p = [point[1], point[0]];
      switch (mapType) {
        case 0:
          let [a, b] = gcoord.transform(p, gcoord.WGS84, gcoord.GCJ02);
          return [b, a];
        case 1:
          let [c, d] = gcoord.transform(p, gcoord.WGS84, gcoord.GCJ02);
          return [d, c];
        case 2:
          let [e, f] = gcoord.transform(p, gcoord.WGS84, gcoord.GCJ02);
          return [f, e];
        default:
          let [g, h] = gcoord.transform(p, gcoord.WGS84, gcoord.GCJ02);
          return [h, g];
      }
    },

    handleCloseMe() {
      this.locusShow = false;
    },
  },

  mounted() {
    window.farmMarkers = [];
    let that = this;
    this.initMap();
    this.loadOnlineFarmData();
    this.loadBaseData();
    // this.listenMessage();

    // 远程管理
    window.remoteControl = function (item) {
      if (item.driveState !== 0) {
        console.warn("自动驾驶状态不可远程管理");
        return;
      }
      that.currentMarkerData = item;
      that.dialogVisibleManage = true;
    };

    // 实时驾驶趋势图
    window.openRealTimeDrive = function (deviceSn, driveState) {
      if (driveState === 0) {
        console.warn("非自动驾驶状态，无实时驾驶趋势");
        return;
      }
      that.$emit("openRealTimeDrive", deviceSn);
    };

    // 历史及时趋势图
    window.openHistoryDrive = function (deviceSn) {
      that.$emit("openHistoryDrive", deviceSn);
    };

    // 历史轨迹
    window.openHistoryTrace = function (item) {
      that.carObj = item;
      that.locusShow = true;
    };
    // 跳转至车辆列表
    window.redirectCarList = this.redirectCarList;
  },
  computed: {
    userId() {
      return this.$store.state.userId;
    },
  },
  watch: {
    locatingDeviceSn(newSN) {
      try {
        let marker = this.getFarmMarker(newSN);
        if (marker) {
          this.map.fitBounds([marker._latlng]);
          marker.openPopup();
        }
      } catch (error) {
        console.log(error);
      }
    },

    renderEngine(newEngine) {
      this.switchRenderEngine(newEngine);
    },
  },
  filters: {},
  components: {
    remote,
    locus,
  },
  beforeDestroy() {
    bus.$off("message");
    window.farmMarkers = [];
  },
};
</script>
<style  lang="scss">
.map_container {
  height: 100%;
  position: relative;
  .away_from_base {
    color: #ff0000;
    background-color: #ffdfdf;
    font-size: 12px;
    padding: 0;
  }
  #_map {
    height: 100%;
  }
  img[src^="img/"] {
    // transition: all linear 6s;
  }

  .map_choose {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 220px;
    z-index: 999;
    border-radius: 4px;
    box-shadow: 0px 2px 8px rgba($color: #000000, $alpha: 0.12);
  }
  .online_status_choose {
    box-sizing: border-box;
    width: 256px;
    height: 40px;
    position: absolute;
    top: 60px;
    right: 10px;
    background: #fff;
    z-index: 999;
    border-radius: 5px;
    box-shadow: 0 0px 15px #aaa;
    display: flex;
    justify-content: space-between;
    > .goback {
      box-sizing: inherit;
      line-height: 40px;
      height: 40px;
      padding: 8px 10px;
      cursor: pointer;
      > span {
        position: relative;
        bottom: 7px;
      }
    }
    > .choose {
      padding-top: 3px;
      .el-input__inner {
        border: #fff;
      }
    }
  }
  .map_legend_ {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 999;
    width: 150px;
    z-index: 1000;
    background: rgba($color: #000000, $alpha: 0.7);
    padding: 5px 10px 10px 10px;
    font-size: 14px;
    border-radius: 5px;
    transition: all 0.5s;
    transform-origin: right top;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    cursor: pointer;
    // box-shadow: 0 0 10px #4CB04F inset;
    box-shadow: 0px 0px 10px rgba(134, 240, 143, 0.8) inset;
    .el-checkbox-group {
      width: 100px;
      .el-checkbox {
      }
      img {
        position: relative;
        top: 6px;
      }
      .el-checkbox:last-of-type {
        margin-right: 30px;
      }
    }
    .map_legend_icon {
      display: flex;
      color: #fff;
      padding-top: 0px;
      margin-top: 10px;
      justify-content: space-between;
      border-top: 1px solid #fff;
    }
  }
  .back_to_begining {
    position: absolute;
    bottom: 10px;
    left: 10px;
    z-index: 999;
    display: flex;
    > div {
      margin-right: 4px;
    }
    .el-input__inner {
      max-width: 110px;
    }
    .el-button {
      font-weight: bolder;
      color: #409eff;
      height: 32px;
    }
    .el-icon-plus::before {
      content: url("~@/assets/locationManage/ruler.png");
    }
  }

  .history_locus {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 1000;
  }

  .search_area {
    // width:400px !important;
    height: 32px;
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 996;
    border: 0 solid #dddee1;
    box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.15);
    .el-icon-search:before {
      color: #1c7dd5;
      font-weight: bolder;
    }
    .aysoicss {
      width: 270px !important;
    }
  }

  .leaflet-popup-content {
    width: auto !important;
  }
  .leaflet-bottom {
    bottom: 39px;
    left: 6px;
  }
  .text_container {
    width: 500px;
    padding: 1px;
    font-size: 15px;
    .text_container_head,
    .text_container_body {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .each_line {
        width: 48%;
        display: flex;
        padding: 2px;
        .left {
          width: 42% !important;
          color: #666666;
          flex-shrink: 0;
        }
        .right {
          width: 58%;
          color: #000;
          word-break: keep-all;
        }
      }
      .button_container {
        width: 100%;
        display: flex;
        justify-content: space-around;
        padding: 20px;
        color: #1c7dd5;
        .remote_control_true,
        .history_drive_trend {
          color: #1c7dd5;
          text-decoration: underline;
          cursor: pointer;
        }
        .remote_control_false {
          color: gray;
          pointer-events: none;
          text-decoration: underline;
        }
      }
    }
    .text_container_head {
      border-bottom: 1px solid rgb(180, 180, 180);
      padding-bottom: 10px;
    }
    .text_container_body {
      padding-top: 5px;
    }
  }

  // 实时驾驶趋势图css控制
  .auto_drive_0 {
    color: gray;
    cursor: not-allowed;
  }
  .auto_drive_1,
  .auto_drive_2 {
    color: #1c7dd5;
    cursor: pointer;
  }

  // 远程管理css控制
  .remote_control_0 {
    color: #1c7dd5;
    cursor: pointer;
  }
  .remote_control_1,
  .remote_control_2 {
    color: gray;
    cursor: not-allowed;
  }

  .history_drive_trend {
    cursor: pointer;
  }

  // 新农机设备弹窗
  .farm_popup_container {
    width: 340px;
    font-size: 14px;
    .popup_line {
      display: flex;
      justify-content: space-between;
      padding: 2px 0px;
      .popup_line_left {
        display: flex;
        width: 50%;
        .popup_line_label {
          width: 66px;
          flex-shrink: 0;
        }
        .popup_line_value {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .popup_line_right {
        display: flex;
        width: 50%;
        .popup_line_label {
          width: 66px;
          flex-shrink: 0;
        }
        .popup_line_value {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .abnormal_4 {
        color: rgb(51, 51, 51);
      }
    }
    .popup_fun {
      color: #0080ff;
      display: flex;
      justify-content: space-around;
      padding: 2px;
    }
  }

  .text_container_base {
    width: 300px;
    padding: 1px;
    font-size: 15px;
    .each_line {
      display: flex;
      justify-content: space-around;
      padding: 2px;
      .left {
        width: 100px;
        color: #666666;
      }
      .right {
        width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .map_choose {
    background: #ffffff;
  }
  .map_choose .el-input__inner {
    border: none;
  }
  .leaflet-popup-content-wrapper {
    white-space: nowrap !important;
    // color: #fff;
    // background: url('./img/popup_back.png') no-repeat;
    // background-size: 100% 100%;
  }
}
</style>
