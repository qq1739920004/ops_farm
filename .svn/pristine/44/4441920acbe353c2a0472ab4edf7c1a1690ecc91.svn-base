<template>
  <div style="display: flex; align-items: center">
    <img
      v-if="isBackShow"
      src="@/assets/common/back.png"
      style="cursor: pointer; margin-left: 10px"
      @click="goBack"
    />
    <el-breadcrumb class="app-breadcrumb" separator="/">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
          <span
            v-if="
              item.redirect === 'noRedirect' || index == levelList.length - 1
            "
            class="no-redirect"
            >{{ item.meta.title }}</span
          >
          <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
  </div>
</template>

<script>
import pathToRegexp from "path-to-regexp";

export default {
  data() {
    return {
      levelList: null,
      isBackShow: false,
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    },
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    getBreadcrumb() {

      this.getFileBreadcrumb();

      let matched = this.$route.matched.filter(
        (item) => item.meta && item.meta.title
      );
      this.isBackShow = matched.some((item) => item.meta.activeMenu);
      matched.forEach((item, index) => {
        if (item.meta.breadcrumb) {
          let breadcrumb = item.meta.breadcrumb;
          let arr = [];
          breadcrumb.forEach((item2) => {
            arr.push({ path: item2, meta: { title: item2 } });
          });

          //获取文件存储的面包屑导航数据
          let fileBreadcrumb = this.$store.state.index.fileBreadcrumb;
          fileBreadcrumb.forEach((item, index) => {
            if (index == fileBreadcrumb.length - 1) {
              return;
            }
            arr.push({ path: item, meta: { title: item } });
          });

          if (item.name == 'vehicleManage_device') {
            matched[matched.length - 1].meta.title =
              this.$route.query.productType || "搜索结果";
          }
          if (item.name == 'vehicleManage_file') {
            matched[matched.length - 1].meta.title =
              this.$route.params.sn || this.$route.query.sn;
          }

          //--------------------------
         
          matched.splice(index, 0, ...arr);
        }
      });

      // const first = matched[0]

      // if (!this.isDashboard(first)) {
      //   matched = [{ path: '/locationManage/gisMonitoring', meta: { title: '态势监控' }}].concat(matched)
      // }

      this.levelList = matched.filter(
        (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
      );
    },
    isDashboard(route) {
      const name = route && route.name;
      if (!name) {
        return false;
      }
      return (
        name.trim().toLocaleLowerCase() === "Dashboard".toLocaleLowerCase()
      );
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route;
      var toPath = pathToRegexp.compile(path);
      return toPath(params);
    },
    handleLink(item) {
      const { redirect, path } = item;
      let title = item.path;
      let idx = this.levelList.findIndex((item) => item.meta.title == title);
      let goIdx = this.levelList.length - 1 - idx;

      if (redirect) {
        this.$router.push(redirect);
        return;
      }
      if (idx < 0) {
        this.$router.push(this.pathCompile(path));
      } else {
        this.$router.go(-goIdx);
      }
    },
    //文件存储面包屑导航特殊处理
    getFileBreadcrumb() {
      let route_name = this.$route.name;
      if (route_name == "vehicleManage_device" && this.$route.query.productType) {
        this.$store.dispatch("index/setfileBreadcrumb", {
          val: this.$route.query.productType,
          num: 1,
        });
      } else if (route_name == "vehicleManage_file") {
        this.$store.dispatch("index/setfileBreadcrumb", {
          val: this.$route.query.sn,
          num: 2,
        });
      } else if (route_name == "vehicleManage_backFile") {
        this.$store.dispatch("index/setfileBreadcrumb", {
          val: "回传",
          num: 3,
        });
      } else {
        this.$store.dispatch("index/setfileBreadcrumb", {});
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 40px;
  margin-left: 10px;

  .no-redirect {
    color: #fff;
    cursor: pointer;
  }
}
.el-breadcrumb__inner a,
.el-breadcrumb__inner.is-link {
  color: #ccc;
}
</style>
