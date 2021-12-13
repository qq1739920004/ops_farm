<template>
  <section class="app-main">
     <div style="background-color: #f5f5f5">
      <!-- <breadcrumb class="breadcrumb-container" /> -->
    </div>
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
export default {
  name: 'AppMain',
    components: {
    Breadcrumb,
  },
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  height:0px;
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: auto;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style scoped lang="scss" >
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}

</style>
