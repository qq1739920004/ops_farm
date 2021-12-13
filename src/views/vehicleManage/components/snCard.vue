<template>
  <div>
    <!-- 页头 -->
    <div v-show="!status.provinceShow" class="head_container">
      <el-page-header :content="pageTitle" @back="goBack" />
    </div>
    <!-- 省份卡片容器 -->
    <div v-show="status.provinceShow" class="province_card">
      <!-- intro无法选中v-for中渲染的元素 -->
      <div class="intro">
        <div class="intro_item"></div>
      </div>
      <div
        v-for="(item, index) in provinceCountData"
        :key="index"
        class="province_card_item"
        :class="[{ car_item_online: item.onlineCar > 0 }]"
      >
        <el-row class="item_title">
          <el-col :span="12" class="item_title_province">{{
            item.name || "/"
          }}</el-col>
          <el-col
            :span="12"
            class="item_title_city"
            @click.native="handleProButClick(item)"
          >
            <el-tooltip
              class="item"
              effect="dark"
              content="地级市列表"
              placement="top"
            >
              <i class="el-icon-more" style="font-size: 18px"></i>
            </el-tooltip>
          </el-col>
        </el-row>
        <div style="cursor: pointer" @click="handleProCardClick(item)">
          <el-row class="item_text">
            <el-col :span="10">在线/累计车辆</el-col>
            <el-col :span="14">今日/累计作业(千亩)</el-col>
          </el-row>
          <el-row class="item_count">
            <el-col :span="10" class="item_count_each">
              <span class="bold" :class="{ online_car: item.onlineCar > 0 }">{{
                item.onlineCar || "--"
              }}</span>
              <span style="padding: 0 5px">/</span>
              <span>{{ item.totalCar || "--" }}</span>
            </el-col>
            <el-col :span="14">
              <span class="bold">{{
                item.todayArea ? (item.todayArea / 1000).toFixed(2) : "--"
              }}</span>
              <span style="padding: 0 5px">/</span>
              <span>{{
                item.totalArea ? (item.totalArea / 1000).toFixed(2) : "--"
              }}</span>
            </el-col>
          </el-row>
        </div>
      </div>
      <div
        v-if="provinceCountData.length === 0"
        style="margin: auto; padding-top: 50px"
      >
        暂无数据
      </div>
    </div>
    <!-- 地级市卡片容器 -->
    <div v-show="status.cityShow" class="city_card">
      <div
        v-for="(item, index) in cityCountData"
        :key="index"
        class="city_card_item"
        :class="{ car_item_online: item.onlineCar > 0 }"
      >
        <el-row class="item_title">
          <el-col :span="12" class="item_title_province">{{
            item.name || "/"
          }}</el-col>
          <el-col :span="12" class="item_title_city" />
        </el-row>
        <div style="cursor: pointer" @click="handleCityCardClick(item)">
          <el-row class="item_text">
            <el-col :span="10">在线/累计车辆</el-col>
            <el-col :span="14">今日/累计作业(千亩)</el-col>
          </el-row>
          <el-row class="item_count">
            <el-col :span="10">
              <span class="bold" :class="{ online_car: item.onlineCar > 0 }">{{
                item.onlineCar || "--"
              }}</span>
              <span style="padding: 0 5px">/</span>
              <span>{{ item.totalCar || "--" }}</span>
            </el-col>
            <el-col :span="14">
              <span class="bold">{{
                item.todayArea ? (item.todayArea / 1000).toFixed(2) : "--"
              }}</span>
              <span style="padding: 0 5px">/</span>
              <span>{{
                item.totalArea ? (item.totalArea / 1000).toFixed(2) : "--"
              }}</span>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- 列表容器 -->
    <div v-show="status.formShow" class="table_card">
      <sn-table
        :table-data="formData"
        :register-authority="registerAuthority"
        @showLocus="handleEmitMessage"
      />
      <el-row type="flex" justify="end" style="margin-top:10px;margin-right:10px;">
        <el-pagination
          background
          layout=" total, prev, pager, next, jumper"
          :page-size="pageSize"
          :total="total"
          @current-change="handlePageChange"
        />
      </el-row>
    </div>
  </div>
</template>
<script>
import snTable from './snTable';
import IntroJs from 'intro.js';
import 'intro.js/introjs.css';
import {
  provinceDataList_path,
  cityDataList_path,
  carList_path
} from '@/api/vehicleManage';
export default {
  components: {
    snTable
  },
  data() {
    return {
      provinceCountData: [],
      cityCountData: [],
      formData: [],
      statusStark: [
        {
          provinceShow: true,
          provinceName: '',
          provinceCode: null,
          cityShow: false,
          cityName: '',
          cityCode: null,
          formShow: false
        }
      ],
      status: {
        provinceShow: true,
        provinceName: '',
        provinceCode: null,
        cityShow: false,
        cityName: '',
        cityCode: null,
        formShow: false
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      registerAuthority: false
    };
  },

  computed: {
    pageTitle() {
      return this.status.provinceName + ' ' + this.status.cityName;
    }
  },

  mounted() {
    this.getProvinceCount();
    // this.turnGuideOn(); // 接口数据缓慢，引导页面没有数据，暂时屏蔽。
  },

  methods: {
    /**
     * @分省卡片
     */
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

    // 获取省份列表数据
    getListData() {
      let code = {};
      this.status.provinceCode
        ? (code.provinceCode = this.status.provinceCode)
        : '';
      this.status.cityCode ? (code.cityCode = this.status.cityCode) : '';
      carList_path({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        ...code
      }).then((res) => {
        try {
          this.total = res.data.page.total;
          this.formData = res.data.page.list.map((item) => {
            return { ...item, ...item.car };
          });
          this.registerAuthority = res.data.page.codePower || false;
        } catch (error) {
          console.log(error);
        }
      });
    },

    handlePageChange(index) {
      this.currentPage = index;
      this.getListData();
    },

    // 省份按钮点击 => 地级市卡片
    handleProButClick(item) {
      if (item.code === '-1') return;
      this.getCityCount(item.code);
      let status = {
        provinceShow: false,
        provinceName: item.name,
        provinceCode: item.code,
        cityShow: true,
        cityName: '',
        cityCode: null,
        formShow: false
      };
      this.status = status;
      this.statusStark.push(status);
    },

    // 省份卡片点击 => 省份车辆列表
    handleProCardClick(item) {
      let status = {
        provinceShow: false,
        provinceName: item.name,
        provinceCode: item.code,
        cityShow: false,
        cityName: '',
        cityCode: null,
        formShow: true
      };
      this.status = status;
      this.statusStark.push(status);
      this.getListData();
    },

    // 地级市卡片点击 => 地级市车辆列表
    handleCityCardClick(item) {
      let status = {
        provinceShow: false,
        provinceName: this.status.provinceName,
        provinceCode: this.status.provinceCode,
        cityShow: false,
        cityName: item.name,
        cityCode: item.code,
        formShow: true
      };
      this.status = status;
      this.statusStark.push(status);
      this.getListData();
    },

    goBack() {
      // 使用栈记录状态
      this.currentPage = 1;
      this.formData = [];
      this.statusStark.pop();
      this.status = this.statusStark[this.statusStark.length - 1];
    },
    handleEmitMessage(item) {
      this.$emit('showLocus', item);
    },

    guide() {
      IntroJs()
        .setOptions({
          prevLabel: '上一步',
          nextLabel: '下一步',
          skipLabel: '跳过',
          doneLabel: '结束',
          steps: [
            {
              title: '提示',
              intro: '欢迎来到车辆分省👋'
            },
            {
              title: '提示',
              element: document.querySelector('.province_card'),
              intro: '这里是全部分省'
            },
            {
              title: '提示',
              element: document.querySelector('.intro'),
              intro: '点击这里，进入当前省份车辆列表'
            },
            {
              title: '提示',
              element: document.querySelector('.intro_item'),
              intro: '点击这里，进入地级市卡片'
            },
            {
              title: '提示',
              element: document.querySelector('.button_group2'),
              intro: '点击这里，切换卡片和列表显示'
            }
          ]
        })
        .oncomplete(function () {
          localStorage.setItem('noob', false);
        })
        .onexit(function () {
          localStorage.setItem('noob', false);
        })
        .start();
    },

    turnGuideOn() {
      let noob = localStorage.getItem('noob');
      let table = localStorage.getItem('tableShow');
      if (noob !== 'false' && table !== 'true') {
        this.guide();
      }
    }
  }
};
</script>
<style scoped lang='scss'>
.head_container {
  height: 30px;
  padding-left: 20px;
  box-sizing: border-box;
  padding-top: 5px;
  overflow: hidden;
}
.province_card,
.city_card {
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  .car_item_online {
    background-color: #e7ffe6 !important;
  }
  .intro {
    width: 310px;
    height: 120px;
    position: absolute;
    top: 20px;
    left: 20px;
    .intro_item {
      position: absolute;
      top: 10px;
      right: 15px;
      width: 40px;
      height: 25px;
    }
  }
  .province_card_item,
  .city_card_item {
    width: 310px;
    background-color: #f5f5f5;
    border-radius: 5px;
    padding: 10px;
    margin: 10px;
    transition: all 0.25s;
    box-sizing: border-box;

    .item_title {
      padding: 5px;
      .item_title_province {
        font-size: 16px;
        font-weight: bold;
        text-align: left;
      }
      .item_title_city {
        font-size: 14px;
        color: #4cb04f;
        cursor: pointer;
        text-align: right;
        padding-right: 10px;
      }
    }
    .item_text {
      font-size: 14px;
      color: #333333;
      padding: 10px 0px;
      text-align: left;
    }
    .item_count {
      text-align: left;
      font-size: 22px;
      // .item_count_each {
      //     display: flex;
      //     justify-content: center;
      //     align-items: center;
      //     >span {
      //         display: block;
      //     }
      // }
      .bold {
        font-size: 26px;
      }
      .online_car {
        color: #00c853;
      }
    }
  }
}
.province_card_item:hover {
  // background-color: #E7FFE6;
  box-shadow: 5px 5px 10px gray;
}
.city_card_item:hover {
  // background-color: #E7FFE6;
  box-shadow: 5px 5px 10px gray;
}
</style>
