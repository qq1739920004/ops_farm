<template>
  <div class="locus_container">
    <div id="locus_map" class="locus_map"></div>

    <div class="locus_back">
      <el-button
        type="success"
        icon="el-icon-back"
        size="small"
        @click="closeMe"
        >返回</el-button
      >
    </div>

    <div class="locus_select">
      <h3>
        <el-tooltip effect="dark" content="默认查询一周轨迹" placement="top">
          <i class="el-icon-info"></i>
        </el-tooltip>
        <span>历史轨迹 - {{ carObj.sn }}</span>
      </h3>

      <el-row class="date_row">
        <el-col :span="6" class="date_name">开始日期</el-col>
        <el-col :span="18">
          <el-date-picker
            v-model="startDate"
            type="datetime"
            size="small"
            :clearable="false"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          />
        </el-col>
      </el-row>
      <el-row class="date_row">
        <el-col :span="6" class="date_name">结束日期</el-col>
        <el-col :span="18">
          <el-date-picker
            v-model="endDate"
            type="datetime"
            size="small"
            :clearable="false"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          />
        </el-col>
      </el-row>
      <el-button
        size="small"
        :icon="loading ? 'el-icon-loading' : 'el-icon-search'"
        :disabled="loading"
        @click="loadData"
        >查询</el-button
      >
    </div>
  </div>
</template>
<script>
import gcoord from "gcoord";
import { singleCarTrack_path } from "@/api/locationManage";
const statrIcon = require("@/assets/locationManage/start.png");
const endIcon = require("@/assets/locationManage/end.png");
const L = window.L;
export default {
  props: {
    carObj: {
      type: Object,
      required: true,
      default: () => {},
    },
  },

  data() {
    return {
      map: null,
      tileUrl: L.TileLayer.ChinaProvider.providers,
      tileLayer: [],
      originPoint: [36.172800343248, 100.406021546488],
      originZoom: 5,
      maxZoom: 18,
      minZoom: 1,
      mapName: 0,
      polyline: [],
      startMarker: [],
      endMarker: [],
      // 以上为地图相关状态
      startDate: null,
      endDate: null,
      color: ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#f1c40f", "#d35400"],
      loading: false,
      xyArr: [],
    };
  },
  mounted() {
    this.initMap();
    this.setDefaultDate();
    this.loadData();
  },
  methods: {
    initMap() {
      this.map = L.map("locus_map", {
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

    drawPath(pathArray = [], popup = {}, color = "green") {
      if (!pathArray.length) {
        console.warn("空的集合");
        return;
      }

      let temArray = [];
      pathArray.forEach((item) => {
        let point = this.coorTransform([item.pos_x, item.pos_y]);
        temArray.push(point);
      });

      let iconStart = L.icon({
        iconUrl: statrIcon,
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });
      let iconEnd = L.icon({
        iconUrl: endIcon,
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

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
            
            `;
      let polyline = L.polyline(temArray, { color: color }).addTo(this.map);
      this.polyline.push(polyline);

      let startMarker = L.marker(temArray[0], { icon: iconStart }).addTo(
        this.map
      );
      this.startMarker.push(startMarker);

      let endMarker = L.marker(temArray[temArray.length - 1], {
        icon: iconEnd,
      }).addTo(this.map);
      this.endMarker.push(endMarker);

      L.featureGroup([polyline, startMarker, endMarker])
        .bindPopup(text)
        .addTo(this.map);

      this.map.fitBounds(temArray);
    },

    removeOverlay() {
      if (this.polyline.length) {
        this.polyline.forEach((item) => item.remove());
        this.polyline = [];
      }
      if (this.startMarker.length) {
        this.startMarker.forEach((item) => item.remove());
        this.startMarker = [];
      }
      if (this.endMarker.length) {
        this.endMarker.forEach((item) => item.remove());
        this.endMarker = [];
      }
    },

    // 数据请求
    loadData() {
      this.loading = true;
      singleCarTrack_path({
        st: this.startDate,
        et: this.endDate,
        deviceId: this.carObj.deviceId,
      }).then((res) => {
        try {
          if (res.data.code === 100) {
            if (res.data.data.length) {
              console.log(res.data.data,'---258')
              this.xyArr.length = 0
              res.data.data.forEach((item) => {
                let point =  this.coorTransform([item.pos_x, item.pos_y])
                this.xyArr.push(point);
              });
              let latlngs = this.xyArr;
              let polyline = L.polyline(latlngs, { color: "#75FB4C" }).addTo(
                this.map
              );
              this.map.fitBounds(this.xyArr);
              //上一版本代码---
              // this.removeOverlay();
              // res.data.data.forEach((item, index) => {
              // this.drawPath(item.list, item, this.color[index % 5])
              // });
            } else {
              this.$message.warning("暂无数据,请重新筛选时间");
            }
          }
          if (res.data.code === 101) {
            this.$message.warning("时间范围过长，超过两个月");
          }
          this.loading = false;
        } catch (error) {
          console.log(error);
          this.loading = false;
        }
      });
    },

    // 分界线

    closeMe() {
      this.$emit("closeMe");
    },

    setDefaultDate() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      // this.startDate = start.toLocaleString('chinese', {hour12: false}).split('/').join('-');
      // this.endDate = end.toLocaleString('chinese', {hour12: false}).split('/').join('-');
      this.startDate =
        start.toLocaleDateString().split("/").join("-") +
        " " +
        start.toTimeString().slice(0, 8);
      this.endDate =
        end.toLocaleDateString().split("/").join("-") +
        " " +
        end.toTimeString().slice(0, 8);
    },

    coorTransform(point = [], mapType = 1) {
      // 经纬度顺序 gcoor 需要 [116.403988, 39.914266] 经度在前
      // if( !pointInChina(point) ) {
      //     return point;
      // }
      /*eslint-disable */
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
  },
};
</script>
<style  lang="scss">
.locus_container {
  width: 100%;
  height: 100%;
  position: relative;
  text-align: center;
  .locus_map {
    width: 100%;
    height: 100%;
  }
  .locus_back {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 999;
  }
  .locus_select {
    position: absolute;
    top: 55px;
    left: 10px;
    z-index: 999;
    background-color: #ffffff;
    font-size: 12px;
    border-radius: 5px;
    width: 280px;
    padding-bottom: 10px;
    h3 {
      margin: 0;
      padding: 10px;
      font-size: inherit;
      font-weight: inherit;
      background-color: #4cb04f;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      color: #ffffff;
    }

    .date_row {
      margin: 15px 10px;
    }
    .date_name {
      height: 32px;
      line-height: 32px;
      color: #333;
    }
    .el-date-editor {
      width: 190px;
    }
    .el-button {
      background-color: #4cb04f;
      color: #ffffff;
    }
    .el-icon-info {
      margin-right: 5px;
      cursor: pointer;
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
