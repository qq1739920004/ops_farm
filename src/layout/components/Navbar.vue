<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <breadcrumb class="breadcrumb-container" />

    <p v-if="isTargetComponent" class="bang_title">{{userId == 11 ? '智慧农机态势监控' : '司南耕耘态势监控'}}</p>
    <div class="right-menu">
      <el-dropdown trigger="hover" class="lang_select">
        <span class="el-dropdown-link">
          {{ $t("message.language")
          }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="languageChange('zh')"
            >中文</el-dropdown-item
          >
          <el-dropdown-item @click.native="languageChange('en')"
            >English</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown class="avatar-container" trigger="hover">
        <div class="avatar-wrapper">
          <img src="@/assets/common/header.png" class="user-avatar" />
          <span class="userName_Text">{{ userName }}</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <a href="/#/usercenter">
            <el-dropdown-item>用户中心</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出登陆</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";

export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  data() {
    return {
      TARGET_COMPONENT: "/locationManage/gisMonitoring",
      isTargetComponent: false,
      userId: this.$store.state.user.userId,
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
    userName() {
      return this.$store.state.user.nickName;
    },
  },
  watch: {
    $route(to, from) {
      this.isTargetComponent = to.path == this.TARGET_COMPONENT;
    },
  },
  created() {
    this.isTargetComponent = this.$route.path == this.TARGET_COMPONENT;
  },

  methods: {
    languageChange(lang) {
      this.$i18n.locale = lang;
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      this.$store.dispatch("user/logout");
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #464c5b;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .bang_title {
    font-family: TiHei;
    position: absolute;
    top: 0px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    // right: 0;
    margin: auto;

    // width: 500px;
    font-size: 35px;
    color: #24bda9;
    z-index: 999;
    letter-spacing: 5px;
    font-weight: 200;
  }
  .hamburger-container {
    position: relative;
    top: 2px;
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
    position: relative;
    top: 5px;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    .userName_Text {
      cursor: pointer;
      line-height: 60px;
      position: relative;
      bottom: 15px;
      margin: 0 10px;
    }
    &:focus {
      outline: none;
    }
    .lang_select {
      color: #fff;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 120px;
      cursor: pointer;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        color: #fff;
        height: 45px;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
