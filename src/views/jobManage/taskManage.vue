<template>
  <div class="page7_child6_container">
    <div id="child6_map" class=""></div>
    <!-- 地图选择器 -->
    <div class="map_selector">
      <el-select
        v-model="mapId"
        placeholder=""
        size="small"
        @change="hangleSelectChange"
      >
        <el-option
          v-for="(item, index) in mapOptions"
          :key="index"
          :label="item.mapName"
          :value="item.mapId"
        />
      </el-select>
    </div>
    <!-- 左侧 -->
    <div class="side_part">
      <div class="side_part_bottom">
        <div class="side_part_title">
          <span>作业管理 </span>
          <i class="el-icon-refresh"></i>
        </div>
        <div class="side_part_area">
          <div class="selectContainer">
            <div class="el-select-container">
              <el-select
                v-model="defaultProvince"
                @change="handleProvinceChange"
              >
                <el-option
                  v-for="(value, key, index) in province"
                  :key="index"
                  :label="value"
                  :value="key"
                />
                <i
                  slot="prefix"
                  class="el-input__icon el-icon-location-information"
                ></i>
              </el-select>
            </div>
          </div>

          <div class="side_part_search">
            <el-input
              v-model="input"
              placeholder="输入车辆、作业名称"
              clearable
              @clear="clearSearchedData"
              @keyup.enter.native="searchDataByWorkId"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                style="color: #4cb04f"
                @click="searchDataByWorkId"
              />
            </el-input>
          </div>
        </div>

        <div
          v-infinite-scroll="loadMorePaddyData"
          class="side_part_content"
          infinite-scroll-immediate="false"
        >
          <el-collapse v-model="activeNames" accordion>
            <el-collapse-item
              v-for="(item, index) in groupData"
              :key="index"
              :title="
                item.carName + ' ' + item.sn + ` (${item.paddyWorks.length})`
              "
              :name="index"
            >
              <template slot="title">
                <el-row style="width: 100%; padding-right: 8px">
                  <el-col :span="12" class="car_title car_name">{{
                    item.carName || "/"
                  }}</el-col>
                  <el-col :span="10" class="car_title">{{
                    item.sn || "/"
                  }}</el-col>
                  <el-col :span="2">({{ item.paddyWorks.length }})</el-col>
                </el-row>
              </template>
              <div class="content_item_container">
                <div
                  v-for="(subItem, subIndex) in item.paddyWorks"
                  :key="subIndex"
                  class="content_item"
                >
                  <div class="item_line item_line_1">
                    <el-checkbox v-model="subItem.checked">{{
                      subItem.name
                    }}</el-checkbox>
                    <span class="worked_area"
                      >{{ subItem.workedarea.toFixed(3) }} 亩</span
                    >
                    <span
                      v-if="!subItem.borderpoints"
                      class="pick_area"
                      @click="drawBoundary(subItem.id)"
                    >
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="自定义边界"
                        placement="top-start"
                      >
                        <img src="@/assets/jobManage/side.png" alt="" />
                      </el-tooltip>
                    </span>
                    <span
                      v-else
                      class="pick_area"
                      @click="clearBoundary(subItem)"
                    >
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="删除边界"
                        placement="top-start"
                      >
                        <img src="@/assets/jobManage/delete.png" alt="" />
                      </el-tooltip>
                    </span>
                  </div>
                  <div class="item_line item_line_2">
                    <span>作业类型: </span>
                    <span>{{ workTypeReflect[subItem.worktype] || "/" }}</span>
                  </div>
                  <div class="item_line item_line_3">
                    <span>作业农具: </span>
                    <el-popover
                      placement="top-start"
                      :title="
                        subItem.toolParam ? subItem.toolParam.name : '暂无农具'
                      "
                      width="200"
                      disabled
                      trigger="click"
                    >
                      <el-row style="padding: 2px">
                        <el-col :span="14">农具左右偏移:</el-col>
                        <el-col :span="10">{{
                          subItem.toolParam
                            ? JSON.parse(subItem.toolParam.paramJson)["Tool1"] +
                              " cm"
                            : "暂无参数"
                        }}</el-col>
                      </el-row>
                      <el-row style="padding: 2px">
                        <el-col :span="14">农具到后轴距离：</el-col>
                        <el-col :span="10">{{
                          subItem.toolParam
                            ? JSON.parse(subItem.toolParam.paramJson)["Tool2"] +
                              " cm"
                            : "暂无参数"
                        }}</el-col>
                      </el-row>
                      <el-row style="padding: 2px">
                        <el-col :span="14">农具宽度：</el-col>
                        <el-col :span="10">{{
                          subItem.toolParam
                            ? JSON.parse(subItem.toolParam.paramJson)["Tool3"] +
                              " m"
                            : "暂无参数"
                        }}</el-col>
                      </el-row>
                      <!-- <span slot="reference" :class="{'tool_param': subItem.toolParam}">{{subItem.toolParam ? subItem.toolParam.name || '/' : '/'}}</span> -->
                      <span slot="reference" :class="{ tool_param: false }">{{
                        subItem.toolname ? subItem.toolname || "/" : "/"
                      }}</span>
                    </el-popover>
                  </div>
                  <div class="item_line item_line_4">
                    <i class="el-icon-location-information"></i>
                    <span>{{ subItem.position }}</span>
                  </div>
                  <div class="item_line item_line_5">
                    <i class="el-icon-timer"></i>
                    <span>{{ dateTimeTrans(subItem.createtime) }}</span>
                    <span>-</span>
                    <span>{{ dateTimeTrans(subItem.updatetime) }}</span>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
          <span
            v-loading="loading"
            style="
              font-size: 14px;
              padding-top: 50px;
              display: block;
              color: #888888;
            "
          ></span>
          <span
            v-if="!rollLoading"
            style="
              font-size: 14px;
              padding-top: 10px;
              display: block;
              color: #888888;
              text-align: center;
            "
            >没有更多了</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
// import province from './province'
import {
  groupList_path,
  historyList_path,
  provinceList_path,
  paddyWorkUpdate_path,
} from "@/api/jobManage";
import gcoord from "gcoord";
import pointInChina from "@/utils/pointInChina";
let a = require("@/assets/jobManage/a.png");
let b = require("@/assets/jobManage/b.png");

export default {
  data() {
    return {
      map: null,
      originPoint: [31.172800343248, 121.406021546488],
      originZoom: 5,
      maxZoom: 18,
      minZoom: 1,
      mapId: 0,
      province: { 65: "新疆维吾尔自治区" },
      defaultProvince: "65",
      input: "",
      groupData: [],
      activeNames: "",
      checked: true,
      currentPage: 1,
      rollLoading: true,
      loading: false,
      currentWorkId: "",
      mapOptions: [
        {
          mapName: "卫星地图",
          mapId: 0,
        },
        {
          mapName: "高德地图",
          mapId: 1,
        },
        // {
        //     mapName: '谷歌地图',
        //     mapId: 2
        // }
      ],
      markerCollect: {},
      //  分类收集marker
      markerCollectExample: {
        12: {
          13: {
            marker: [],
          },
        },
      },
      workTypeReflect: {
        1: "播种",
        2: "翻地",
        3: "起陇",
        4: "收割",
        5: "喷药",
        6: "其他",
      },
      temPolygonObject: null,
      tileUrl: L.TileLayer.ChinaProvider.providers,
      tileLayer: [],
    };
  },
  methods: {
    //地图相关方法
    initMap(id = 0) {
      this.map = L.map("child6_map", {
        fullscreenControl: false,
        zoomControl: false,
      }).setView(this.originPoint, this.originZoom);

      // L.control.scale({maxWidth: 150,metric: true,imperial: false,position: 'bottomleft'}).addTo(this.map);
      this.handleMapChange(this.mapId);
      this.initGeoman();
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

    initGeoman() {
      let that = this;
      this.map.pm.setLang("zh");
      this.map.pm.setGlobalOptions({
        pinning: true,
        limitMarkersToCount: 15,
        limitMarkersCountGlobally: true,
      });
      this.map.on("pm:create", (e) => {
        this.temPolygonObject = e;
        try {
          let borderpoints = e.layer._latlngs[0].map((j) => [j.lat, j.lng]);
          that.updateBoundary(that.currentWorkId, borderpoints);
        } catch (err) {
          console.log(err);
        }
      });
    },

    hangleSelectChange(mapId) {
      this.handleMapChange(mapId);
    },

    handleProvinceChange(provinceId) {
      this.clearAllMarkers();
      this.groupData = null;
      this.markerCollect = null;
      this.markerCollect = {};
      this.groupData = [];
      this.currentPage = 1;
      this.rollLoading = true;
      this.loadPaddyData(this.currentPage, provinceId);
    },

    // 数据相关方法
    loadPaddyData(currentPage = 1, addrcode = 65, name = "") {
      this.loading = true;
      groupList_path({
        currentPage: currentPage,
        pageSize: 10,
        addrcode: addrcode,
        name: name.trim(),
      }).then((res) => {
        this.loading = false;
        try {
          if (!res.data.data.length) {
            this.rollLoading = false;
            return;
          }
          let tem = res.data.data;
          console.log(tem, "--396");
          tem.forEach((element) => {
            this.markerCollect[element.id] = {};
            if (element.paddyWorks.length) {
              element.paddyWorks.forEach((item) => {
                item.checked = false; // 增加一个勾选状态字段
                if (item.id === this.currentWorkId) {
                  item.checked = true;
                }
                this.markerCollect[element.id][item.id] = {
                  marker: [],
                };
              });
            }
          });
          if (this.groupData.length) {
            this.groupData.push.apply(this.groupData, tem);
          } else {
            this.groupData = tem;
          }
          console.log(this.groupData, "---416");
        } catch (err) {
          console.log(err);
        }
      });
    },

    loadMorePaddyData() {
      if (!this.rollLoading) {
        return;
      } //没有更多数据了
      this.currentPage++;
      this.loadPaddyData(this.currentPage, this.defaultProvince, this.input);
    },

    searchDataByWorkId() {
      if (!this.input) {
        return;
      }
      this.clearAllMarkers();
      this.currentPage = 1;
      this.groupData = null;
      this.groupData = [];
      this.markerCollect = null;
      this.markerCollect = {};
      this.rollLoading = true;
      this.loadPaddyData(this.currentPage, this.defaultProvince, this.input);
    },

    clearSearchedData() {
      this.clearAllMarkers();
      this.currentPage = 1;
      this.groupData = null;
      this.groupData = [];
      this.markerCollect = null;
      this.markerCollect = {};
      this.rollLoading = true;
      this.loadPaddyData(this.currentPage, this.defaultProvince);
    },

    handleWorkDataChange() {
      this.clearAllMarkers();
      this.currentPage = 1;
      this.groupData = null;
      this.groupData = [];
      this.markerCollect = null;
      this.markerCollect = {};
      this.rollLoading = true;
      this.loadPaddyData(this.currentPage, this.defaultProvince);
    },

    loadWorkData(groupId, workId) {
      historyList_path({
        ids: JSON.stringify([workId]),
      }).then((res) => {
        try {
          let key = Object.keys(res.data.data);
          if (
            !key.length ||
            res.data.data[key[0]] === null ||
            !res.data.data[key[0]].length
          ) {
            this.saveMarker(groupId, workId, [
              { markerObj: null, name: "lines" },
            ]);
            this.$message.warning("暂无作业数据");
            return;
          }
          let PointListTransed = res.data.data[key[0]].map((item) => {
            return this.coorTransform([item.pos_x, item.pos_y], this.mapId); // 转换坐标
          });
          let line = L.polyline(PointListTransed, { color: "#00ff00" })
            .addTo(this.map)
            .bindPopup(`作业名称：${key[0]}`)
            .openPopup();
          this.map.fitBounds(PointListTransed);
          this.saveMarker(groupId, workId, [
            { markerObj: line, name: "lines" },
          ]);
        } catch (err) {
          console.log(err);
        }
      });
    },

    loadProvinceData() {
      provinceList_path().then((res) => {
        if (res.data.data) {
          this.province = { ...this.province, ...res.data.data };
        }
      });
    },

    updateBoundary(workId, pointsArray) {
      paddyWorkUpdate_path({
        id: workId,
        borderpoints: JSON.stringify(pointsArray),
      }).then((res) => {
        try {
          if (res.data.data === 1) {
            this.$message.success(`更新边界成功, 当前田块id：${workId}`);
            this.map.removeLayer(this.temPolygonObject.layer);
            this.handleWorkDataChange();
          } else {
            this.$message.error("更新失败，请稍后再试");
          }
        } catch (err) {
          console.log(err);
        }
      });
    },

    //地图绘制相关方法
    addPathAB(item) {
      try {
        let ax;
        let ay;
        let bx;
        let by;

        if (item.terminalType == "AG360" || item.terminalType == "AG360Pro") {
          ax = item.ptalat;
          ay = item.ptalng;
          bx = item.ptblat;
          by = item.ptblng;
        } else {
          ax = item.lineptax;
          ay = item.lineptay;
          bx = item.lineptbx;
          by = item.lineptby;
        }
        let pointA = this.coorTransform([ax, ay], this.mapId);
        let pointB = this.coorTransform([bx, by], this.mapId);
        let l1 = L.latLng(ax, ay);
        let l2 = L.latLng(bx, by);
        let distance = l1.distanceTo(l2).toFixed(0);
        let iconA = L.icon({
          iconUrl: a,
          iconAnchor: [12, 30],
          popupAnchor: [0, -30],
        });
        let iconB = L.icon({
          iconUrl: b,
          iconAnchor: [12, 30],
          popupAnchor: [0, -30],
        });
        let markerA = L.marker(pointA, { icon: iconA }).addTo(this.map);
        let markerB = L.marker(pointB, { icon: iconB }).addTo(this.map);
        let line = L.polyline([pointA, pointB], {
          color: "red",
          dashArray: [9, 9],
        })
          .bindTooltip(`AB点距离 ${distance} 米`, { permanent: true })
          .addTo(this.map);
        this.map.fitBounds([pointA, pointB]);
        let temMarkers = [
          {
            markerObj: markerA,
            name: "markerA",
          },
          {
            markerObj: markerB,
            name: "markerB",
          },
          {
            markerObj: line,
            name: "lineAB",
          },
        ];
        this.saveMarker(item.carid, item.id, temMarkers);
        //绘制田块边界(全部上传GCJ02坐标，对应全部GCJ02地图，无需相互转换！！！)
        if (item.borderpoints) {
          let latlngs = JSON.parse(item.borderpoints);
          let polygon = L.polygon(latlngs, { color: "#388BFE" }).addTo(
            this.map
          );
          let tem = {
            name: "border",
            markerObj: polygon,
          };
          this.saveMarker(item.carid, item.id, [tem]);
        }
      } catch (err) {
        console.log(err);
      }
    },

    hasMarker(groupId, workId) {
      return this.markerCollect[groupId][workId]["marker"].length > 0;
    },

    hasMarkerField(groupId, workId, field) {
      let a = this.markerCollect[groupId][workId]["marker"].find(
        (element) => element.name === field
      );
      if (a && a[field] !== null) {
        return true;
      } else {
        return false;
      }
    },

    countMarkerLength(groupId, workId) {
      return this.markerCollect[groupId][workId]["marker"].length;
    },

    saveMarker(groupId, workId, markerObj) {
      try {
        let a = this.markerCollect[groupId][workId]["marker"];
        Array.prototype.push.apply(a, markerObj);
      } catch (err) {
        console.log(err);
      }
    },

    removeMarker(groupId, workId) {
      try {
        if (this.markerCollect[groupId][workId]["marker"].length) {
          let a = this.markerCollect[groupId][workId]["marker"];
          a.forEach((item) => {
            if (item.markerObj) {
              this.map.removeLayer(item.markerObj);
            }
          });
          this.markerCollect[groupId][workId]["marker"] = [];
        } else {
        }
      } catch (err) {
        console.log(err);
      }
    },

    removeMarkerByName(groupId, workId, name) {
      try {
        if (this.markerCollect[groupId][workId]["marker"].length) {
          let a = this.markerCollect[groupId][workId]["marker"];
          a.forEach((item) => {
            if (item.name === "border" && item.markerObj) {
              this.map.removeLayer(item.markerObj);
            }
          });
          let borderIndex = a.findIndex((item) => item.name === "border");
          if (borderIndex !== -1) {
            a.splice(borderIndex, 1);
          }
        } else {
        }
      } catch (err) {
        console.log(err);
      }
    },

    clearAllMarkers() {
      try {
        for (let key in this.markerCollect) {
          if (Object.keys(this.markerCollect[key]).length) {
            for (let subKey in this.markerCollect[key]) {
              if (this.markerCollect[key][subKey]["marker"].length) {
                this.markerCollect[key][subKey]["marker"].forEach((item) => {
                  if (item && item.markerObj) {
                    this.map.removeLayer(item.markerObj);
                  }
                });
              }
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    },

    drawBoundary(workId) {
      this.currentWorkId = workId; //保存当前田块
      this.$confirm("单击地图开始绘制，点击开始点闭合田块", "提示", {
        confirmButtonText: "继续",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.map.pm.enableDraw("Polygon", {
          snappable: true,
          snapDistance: 20,
        });
      });
    },
    clearBoundary(item) {
      this.currentWorkId = item.id; //保存当前田块
      this.$confirm("是否删除当前田块边界", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        paddyWorkUpdate_path({ id: item.id, borderpoints: null }).then(
          (res) => {
            try {
              if (res.data.data === 1) {
                this.$message.success(
                  `删除边界成功, 当前田块作业id：${item.id}`
                );
                this.removeMarkerByName(item.carid, item.id, "border");
                this.handleWorkDataChange();
              } else {
                this.$message.error("删除失败，请稍后再试");
              }
            } catch (err) {
              console.log(err);
            }
          }
        );
      });
    },

    //坐标转换
    coorTransform(point = [], mapType = 1) {
      //经纬度顺序 gcoor 需要 [116.403988, 39.914266] 经度在前
      if (!pointInChina(point)) {
        return point;
      }
      let p = [point[1], point[0]];
      switch (mapType) {
        case 0:
          let [a, b] = gcoord.transform(p, gcoord.WGS84, gcoord.GCJ02);
          return [b, a];
        case 1:
          let [c, d] = gcoord.transform(p, gcoord.WGS84, gcoord.GCJ02);
          return [d, c];
        case 2:
          let [e, f] = gcoord.transform(p, gcoord.WGS84, gcoord.BD09);
          return [f, e];
        case 3:
          let [g, h] = gcoord.transform(p, gcoord.WGS84, gcoord.GCJ02);
          return [h, g];
        default:
          let [i, j] = gcoord.transform(p, gcoord.WGS84, gcoord.GCJ02);
          return [j, i];
      }
    },

    getToolParam(param) {
      console.log(param);
    },
  },

  watch: {
    groupData: {
      handler(newData) {
        try {
          if (newData.length) {
            newData.forEach((item) => {
              item.paddyWorks.forEach((subItem) => {
                subItem.terminalType = item.terminalType;
                if (subItem.checked) {
                  if (!this.hasMarker(item.id, subItem.id)) {
                    this.addPathAB(subItem);
                  }
                  if (!this.hasMarkerField(item.id, subItem.id, "lines")) {
                    this.loadWorkData(item.id, subItem.id);
                  }
                } else {
                  this.removeMarker(item.id, subItem.id);
                }
              });
            });
          }
        } catch (err) {
          console.log(err);
        }
      },
      deep: true,
    },
  },

  mounted() {
    this.initMap();
    this.loadPaddyData(this.currentPage, this.defaultProvince);
    this.loadProvinceData();
  },
};
</script>
<style scoped lang='scss'>
.page7_child6_container {
  width: 100%;
  height: 100%;
  position: relative;
  #child6_map {
    width: 100%;
    height: 100%;
  }
  .map_selector {
    position: absolute;
    bottom: 10px;
    left: 10px;
    z-index: 999;
    max-width: 110px;
  }
  .side_part {
    position: absolute;
    width: 330px;
    top: 10px;
    left: 10px;
    z-index: 999;
    border-radius: 5px;
    .side_part_bottom {
      box-shadow: 1px 1px 50px rgba(0, 0, 0, 0.3);
    }
    .side_part_title {
      padding: 10px;
      background-color: #4cb04f;
      color: #ffffff;
      border-top-left-radius: 5px;
      text-align: center;
      border-top-right-radius: 5px;
      > span {
        font-size: 14px;
        margin-right: 8px;
      }
    }
    .side_part_area {
      padding: 16px 10px 10px 10px;
      background: #ffffff;
      .searchIconContainer {
        width: 32px;
        height: 32px;
        border-radius: 4px;
        background: #f2f2f2;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 18px;
        color: #2b85e4;
        cursor: pointer;
        font-size: 16px;
      }
      .selectContainer {
      }
      .el-icon-location-information {
        padding-right: 6px;
      }
      .el-select-container {
        flex-grow: 1;
      }
      .el-select {
        width: 100%;
      }
      .search_control {
        height: 32px;
        padding: 6px;
        background: #f2f2f2;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        text-overflow: ellipsis;
      }
    }
    .side_part_search {
      background: #ffffff;
      margin-top: 10px;
    }
    .side_part_content {
      padding: 10px;
      height: 400px;
      overflow-y: auto;
      background: #ffffff;
      .car_title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
        position: relative;
      }
      .car_name:before {
        content: "";
        display: inline-block;
        width: 6px;
        height: 20px;
        background-color: #73d13d;
        position: relative;
        top: 4px;
        margin-right: 6px;
      }
      .content_item_container {
        .content_item {
          text-align: left;
          .item_line {
            font-size: 12px;
          }
          .item_line_2,
          .item_line_3,
          .item_line_4,
          .item_line_5 {
            padding-left: 23px;
            color: #666666;
          }
          .tool_param {
            text-decoration: underline;
            color: #2b85e4;
            cursor: pointer;
          }
          .item_line_1 {
            position: relative;
            font-size: 16px;
            font-weight: 400;
            .el-checkbox__label {
              font-size: 14px;
              font-weight: 400;
            }
            .worked_area {
              display: block;
              position: absolute;
              right: 36px;
              top: 0px;
              font-size: 14px;
            }
            .pick_area {
              display: block;
              position: absolute;
              right: 6px;
              top: 3px;
              cursor: pointer;
            }
            .worked_name {
              margin-left: 6px;
            }
          }
          .item_line_5 {
            white-space: nowrap;
          }
          span.is-checked {
            .el-checkbox__inner {
              border-color: #4cb04f;
              background-color: #4cb04f;
            }
          }
          span.is-focus {
            .el-checkbox__inner {
              border-color: #4cb04f;
            }
          }
          .el-checkbox__input.is-checked + .el-checkbox__label {
            color: #4cb04f;
          }
        }
      }
    }
    .el-collapse-item__header {
      font-size: 14px;
    }
  }
}
</style>