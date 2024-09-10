<template>
  <div
    class="breadcrumb-container"
    :class="{ 'breadcrumb-visible-container': breadcrumbs.length == 0 }"
  >
    <SvgIcon
      v-if="isBackShow"
      class="back_icon"
      icon="back"
      color="var(--el-color-primary)"
      size="16"
      @click="toLastPage"
    />
    <el-breadcrumb class="app-breadcrumb">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbs"
        :key="item.path"
        :class="{ disabled: index == 0 && breadcrumbs.length > 1 }"
      >
        <span
          v-if="
            item.redirect === 'noredirect' ||
            index === breadcrumbs.length - 1 ||
            (index == 0 && breadcrumbs.length > 1)
          "
          class="no-redirect"
          >{{ item.meta.titleEn?t(item.meta.titleEn as string):item.meta.title }}</span
        >
        <a v-else @click.prevent="handleLink(item, index)">
          {{ item.meta.titleEn?t(item.meta.titleEn as string):item.meta.title}}
        </a>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from "vue";
import { useRoute, RouteLocationMatched } from "vue-router";
import { compile } from "path-to-regexp";
import router from "@/router";
import SvgIcon from "@/components/SvgIcon/index.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const isBackShow = ref(false); // 是否展示返回按钮
const currentRoute = useRoute();
const pathCompile = (path: string) => {
  const { params } = currentRoute;
  const toPath = compile(path);
  return toPath(params);
};
const breadcrumbs = ref([] as Array<RouteLocationMatched>);

function getBreadcrumb() {
  let matched = currentRoute.matched.filter((item) => item.meta && item.meta.title);

  const lastRouter: any = matched[matched.length - 1];
  let lastRouterBreadcrumb = lastRouter.meta.breadcrumb || [];
  lastRouterBreadcrumb = lastRouterBreadcrumb.map((item: any) => {
    return { path: item.path, meta: { title: item.title, titleEn: item.titleEn } };
  });
  matched.splice(matched.length - 1, 0, ...lastRouterBreadcrumb);
  if (matched.find((i) => i.meta.hideTitle)) {
    breadcrumbs.value = [];
  } else {
    breadcrumbs.value = matched.filter((item) => {
      return item.meta && item.meta.title && !item.meta.breadcrumbHidden;
    });
  }
  if (breadcrumbs.value.length >= 2) {
    breadcrumbs.value.splice(0, 1);
  }
  isBackShow.value = matched.some((item) => item.meta.activeMenu && breadcrumbs.value.length>=1);
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
const toLastPage = () => {
  if (history.state.back) {
    router.go(-1);
  } else {
    const lastRouter: string = localStorage.getItem("lastRouter") || "/";
    router.push(lastRouter);
  }
};
</script>

<style lang="scss" scoped>
.back_icon {
  cursor: pointer;
  margin-left: var(--row-gutter);
}
.breadcrumb-container {
  // padding-left: 32px;
  @include flex($col: center);
  height: 40px;
  position: relative;
  background-color: #fff;
  &.breadcrumb-visible-container {
    height: auto;
  }
}
:deep(.app-breadcrumb.el-breadcrumb) {
  display: inline-block;
  // margin-left: 8px;
  font-size: var(--bread-crumb-font-size);
  line-height: 40px;
  position: absolute;
  left: 34px;
}
:deep(.el-breadcrumb__separator) {
  margin: 0 4px;
}

// 覆盖 element-plus 的样式
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
  font-weight: 400 !important;
  // color: #fff;
  color: var(--breadcrumb-text-color);
}
.el-breadcrumb__item.disabled {
  .no-redirect {
    color: var(--breadcrumb-text-color);
    cursor: not-allowed;
  }
}
</style>
