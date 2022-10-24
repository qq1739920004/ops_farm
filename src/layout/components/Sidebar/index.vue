<template>
  <div :class="{ 'has-logo': isCollapse }">
    <div :class="{ logo_area: true, logo_area_active: !sidebar.opened }">
      <a href="/">
        <img
          v-if="userId == 11"
          src="@/assets/common/liantongLogo.png"
          alt=""
        />
        <img v-else src="@/assets/common/logo2.png" alt="" />
      </a>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";

export default {
  components: { SidebarItem },
  data() {
    return {
      userId: this.$store.state.user.userId,
    };
  },
  computed: {
    ...mapGetters(["sidebar"]),
    routes() {
      return this.$router.options.routes;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  created() {},
};
</script>
<style scoped lang="scss">
.logo_area {
  padding: 10px 20px 20px 20px;
  transition: all 0.3s;
}
.logo_area a {
  // width: 180px !important;
  display: block;
  height: 60px;
  
  // display: inline-block;
  // width:180px !important;
  // justify-content: center;
  img {
    width: 100%;
    height: 100%;
  }
}
.logo_area a img {
}
.logo_area_active {
  padding: 10px 0px 30px 0px;
  transition: all 0.3s;
}
</style>
