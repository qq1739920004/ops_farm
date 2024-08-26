<template>
  <section class="app-main">
    <div>
      <breadcrumb />
    </div>
    <router-view v-slot="{ Component, route }">
      <transition name="router-fade" mode="out-in">
        <!-- <keep-alive> -->
        <component :is="Component" :key="route.fullPath" />
        <!-- </keep-alive> -->
      </transition>
    </router-view>
  </section>
</template>
<script setup lang="ts">
import Breadcrumb from "./Breadcrumb/index.vue";
</script>

<style lang="scss" scoped>
.app-main {
  min-height: 100%;
  height: 100%;
  background-color: var(--el-bg-color-page);

  // position: relative;
  // width: 100%;

  // /* 50= navbar  50  */
  // min-height: calc(100vh - 50px);
  // overflow: hidden;
}

// .fixed-header + .app-main {
//   padding-top: 50px;
// }

// .hasTagsView {
//   .app-main {
//     /* 84 = navbar + tags-view = 50 + 34 */
//     min-height: calc(100vh - 84px);
//   }

//   .fixed-header + .app-main {
//     min-height: 100vh;
//     padding-top: 84px;
//   }
// }
</style>
