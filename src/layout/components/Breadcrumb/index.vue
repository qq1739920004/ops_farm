<template>
  <SvgIcon
    v-if="isBackShow"
    class="back_icon"
    icon="back"
    color="#fff"
    size="18"
    @click="router.go(0 - 1)"
  />
  <el-breadcrumb>
    <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
      <span
        v-if="
          item.redirect === 'noredirect' || index === breadcrumbs.length - 1
        "
        >{{ item.meta.title }}</span
      >
      <a v-else @click.prevent="handleLink(item, index)">
        {{ item.meta.title }}
      </a>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from "vue";
import { useRoute, RouteLocationMatched } from "vue-router";
import { compile } from "path-to-regexp";
import router from "@/router";
import SvgIcon from "@/components/SvgIcon/index.vue";
const isBackShow = ref(false); // 是否展示返回按钮
const currentRoute = useRoute();
const pathCompile = (path: string) => {
  const { params } = currentRoute;
  const toPath = compile(path);
  return toPath(params);
};
const breadcrumbs = ref([] as Array<RouteLocationMatched>);

function getBreadcrumb() {
  let matched = currentRoute.matched.filter(
    (item) => item.meta && item.meta.title
  );
  isBackShow.value = matched.some((item) => item.meta.activeMenu);
  const lastRouter: any = matched[matched.length - 1];
  let lastRouterBreadcrumb = lastRouter.meta.breadcrumb || [];
  lastRouterBreadcrumb = lastRouterBreadcrumb.map((item: any) => {
    return { path: item.path, meta: { title: item.title } };
  });
  matched.splice(matched.length - 1, 0, ...lastRouterBreadcrumb);
  breadcrumbs.value = matched.filter((item) => {
    return item.meta && item.meta.title && !item.meta.breadcrumbHidden;
  });
}

function handleLink(item: any, index: number) {
  const { redirect, path } = item;
  if (redirect) {
    router.push(redirect).catch((err) => {
      console.warn(err);
    });
    return;
  }
  if (path) {
    router.push(pathCompile(path)).catch((err) => {
      console.warn(err);
    });
  } else {
    const length = breadcrumbs.value.length - 1;
    const goBackIdx = length - index;
    router.go(-goBackIdx);
  }
}

watch(
  () => currentRoute.path,
  (path) => {
    if (path.startsWith("/redirect/")) {
      return;
    }
    getBreadcrumb();
  }
);

onBeforeMount(() => {
  getBreadcrumb();
});
</script>

<style lang="scss" scoped>
.back_icon {
  cursor: pointer;
  margin: 0 12px;
}
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  margin-left: 8px;
  font-size: 14px;
  line-height: 50px;
}
.el-breadcrumb__inner {
  span {
    // color: #c8c8c9;
    color: #fff;
  }
}

// 覆盖 element-plus 的样式
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
  font-weight: 400 !important;
  // color: #fff;
  color: #c8c8c9;
}
// :deep(.el-breadcrumb__inner) {
//   color:#fff !important;
// }
</style>
