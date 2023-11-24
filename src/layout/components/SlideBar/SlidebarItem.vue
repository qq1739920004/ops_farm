<template>
  <!-- 只包含一个子路由节点的路由，显示其【唯一子路由】 -->
  <template
    v-if="
      hasOneShowingChild(item.children, item) &&
      (!onlyOneChild.children || onlyOneChild.noShowingChildren)
    "
  >
    <el-menu-item
      v-if="onlyOneChild.meta && !onlyOneChild.meta.hidden"
      @click="changeRouter(resolvePath(onlyOneChild.path))"
      :index="resolvePath(onlyOneChild.path)"
    >
      <el-icon v-if="onlyOneChild.meta.icon">
        <SvgIcon v-if="onlyOneChild.meta.icon.includes('_local')" :icon="onlyOneChild.meta.icon.split('_local')[0]"></SvgIcon>
        <component v-else :is="onlyOneChild.meta.icon"></component>
      </el-icon>
   
      <span v-if="onlyOneChild.meta.title">
        {{ $t(onlyOneChild.meta.titleEn) }}
      </span>
    </el-menu-item>
  </template>
  <!-- 包含多个子路由  -->
  <el-sub-menu v-else :index="resolvePath(item.path)" teleported>
    <template #title>
      <el-icon v-if="item.meta && item.meta.icon">
        <SvgIcon v-if="item.meta.icon.includes('_local')" :icon="item.meta.icon.split('_local')[0]"></SvgIcon>
        <component v-else :is="item.meta.icon"></component>
      </el-icon>
      <span v-if="item.meta && item.meta.title">{{ item.meta.title }}</span>
    </template>
    <Slidebar-item
      v-for="child in item.children"
      :key="child.path"
      :item="child"
      :base-path="resolvePath(child.path)"
    />
  </el-sub-menu>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
//@ts-ignore
import path from "path-browserify";
import { isExternal } from "@/utils";
import SlidebarItem from "./SlidebarItem.vue";
import SvgIcon from '@/components/SvgIcon/index.vue'
const router = useRouter();
const props = defineProps({
  /**
   * 路由(eg:level_3_1)
   */
  item: {
    type: Object,
    required: true,
  },

  /**
   * 父层级完整路由路径(eg:/level/level_3/level_3_1)
   */
  basePath: {
    type: String,
    required: true,
  },
});

const onlyOneChild = ref(); // 临时变量，唯一子路由

function changeRouter(path: string) {
  if (isExternal(path)) {
    window.open(path);
  } else {
    router.push(path);
  }
}

/**
 * 判断当前路由是否只有一个子路由
 *
 * 1：如果只有一个子路由： 返回 true
 * 2：如果无子路由 ：返回 true
 *
 * @param children 子路由数组
 * @param parent 当前路由
 */
function hasOneShowingChild(children = [], parent: any) {
  // 需要显示的子路由数组
  const showingChildren = children.filter((item: any) => {
    if (item.meta?.hidden) {
      return false; // 过滤不显示的子路由
    } else {
      onlyOneChild.value = item; // 唯一子路由赋值（多个子路由情况 onlyOneChild 变量是用不上的）
      return true;
    }
  });

  // 1：如果只有一个子路由, 返回 true
  if (showingChildren.length === 1) {
    return true;
  }

  // 2：如果无子路由, 复制当前路由信息作为其子路由，满足只拥有一个子路由的条件，所以返回 true
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: "", noShowingChildren: true };
    return true;
  }
  return false;
}

/**
 * 解析路径
 *
 * @param routePath 路由路径
 */
function resolvePath(routePath: string) {
  if (isExternal(routePath)) {
    return routePath;
  }
  if (isExternal(props.basePath)) {
    return props.basePath;
  }
  // 完整路径 = 父级路径(/level/level_3) + 路由路径
  const fullPath = path.resolve(props.basePath, routePath); // 相对路径 → 绝对路径
  return fullPath;
}
</script>

<style lang="scss" scoped></style>
