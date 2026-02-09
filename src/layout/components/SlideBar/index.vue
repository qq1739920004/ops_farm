<template>
  <el-menu
    :mode="appStore.layout"
    :default-active="activeMenu"
    :collapse="props.collapse"
    :background-color="variables.appMenuColor"
    text-color="#fff"
    active-text-color="#fff"
    @select="elMenuSelect"
    :ellipsis="false"
    :unique-opened="true"
    :class="locale == 'zh' ? 'menu-cn' : isChangfa ? 'menu-en-cf' : 'menu-en'"
  >
    <el-menu-item v-if="isChangfa" :class="{ logo_area: true }" style="cursor: auto">
      <img src="@/assets/common/changfa_logo.png" alt="" />

      <span>{{ t("messages.systemName2") }}</span>
    </el-menu-item>
    <!-- ucFrontEnd -->
    <el-menu-item
      v-else
      @click="handleLogoClick"
      :class="{ logo_area: true, logo_active: props.collapse }"
    >
      <!-- <SvgIcon icon="logo" size="48" /> -->
      <img src="@/assets/icons/logo.svg" alt="">
      <span>{{ t("messages.systemName") }}</span>
    </el-menu-item>

    <!-- <Slidebar-item
       v-for="route in permissionStore.userRoutes"
       :key="route.path"
       :item="route"
       :base-path="route.path"
     /> -->
    <Slidebar-item
      v-for="route in router.options.routes"
      :key="route.path"
      :item="route"
      :base-path="route.path"
    />
  </el-menu>
</template>
<script setup lang="ts">
import { computed,onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import SvgIcon from "@/components/SvgIcon/index.vue";
import SlidebarItem from "./SlidebarItem.vue";
import useAppStore from "@/store/app";
import variables from "@/styles/variables.module.scss";
const appStore = useAppStore();
const route = useRoute();
const router = useRouter();
const emit = defineEmits(["handleChange"]);
import { useI18n } from "vue-i18n";
import { config } from "@/utils/config";
const { t, locale } = useI18n();
const isChangfa = import.meta.env.MODE === "changFa";
const props = defineProps({
  collapse: {
    type: Boolean,
    default: false,
  },
});

const activeMenu = computed(() => {
  if (route.meta.activeMenu) {
    return route.meta.activeMenu;
  } else {
    return route.path;
  }
});
function elMenuSelect() {
  emit("handleChange");
}

function handleLogoClick() {
  if (config.VITE_APP_Model === '1') {
    // 不跳转
    return;
  }
  location.href = '/';
}
onMounted(() => {
  console.log('router.options.routes',router.options.routes);
})
</script>

<style lang="scss" scoped>
.menu-en {
  width: 200px;
  :deep(.el-menu-item:not(.logo_area)) {
    font-size: var(--sino-el-menu-item-font-size-en) !important;
  }
  :deep(.el-sub-menu__title) {
    font-size: var(--sino-el-menu-item-font-size-en) !important;
  }
}
.menu-en-cf {
  width: 240px;
  .logo_area {
    padding: 0 !important;
  }
  :deep(.el-menu-item:not(.logo_area)) {
    font-size: var(--sino-el-menu-item-font-size-en) !important;
  }
  :deep(.el-sub-menu__title) {
    font-size: var(--sino-el-menu-item-font-size-en) !important;
  }
}
.menu-cn {
  width: var(--menu-width);
  :deep(.el-menu-item:not(.logo_area)) {
    font-size: var(--sino-el-menu-item-font-size-cn) !important;
  }
  :deep(.el-sub-menu__title) {
    font-size: var(--sino-el-menu-item-font-size-cn) !important;
  }
}



.menu-cn.el-menu--collapse {
  width: 64px !important;
}
.logo_area {
  font-size: 24px;
  transition: all 0.3s ease;
  margin-top: 8px;
  margin-bottom: 22px;
  line-height: normal;
  height: auto;
  img {
    width: 48px;
    transition: all 0.3s ease;
  }
  span {
    margin-left: var(--menu-gutter);
    word-break: normal;
    width: auto;
    display: block;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow: hidden;
    transition: all 0.3s ease;
  }
}
.logo_active {
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    margin-left: 0px;
  }
}


.el-menu {
  border-right: none;
  height: 100%;
  overflow: scroll;

  &.el-menu--vertical {
    height: 100%;

    &:not(.el-menu--collapse) {
      min-height: 400px;
      // :deep(svg){
      //   margin-right: var(--menu-gutter);
      // }
      :deep(.el-menu-item:not(.logo_area)) {
        padding-left: var(--menu-padding-left);
      }
      > :deep(li) {
        &.el-sub-menu {
          > .el-sub-menu__title {
            // margin:0 var(--menu-gutter);
            padding-right: 0;
          }
          .el-menu-item {
            padding-left: 44px;
          }
        }
      }
    }
    &.el-menu--collapse {
      :deep(svg) {
        margin-right: 0;
      }
      :deep(.el-sub-menu__title) {
        padding-right: 0;
      }

      .logo_active {
        margin: 0;
        padding: 0;
        img {
          width: 32px;
        }
      }
    }
  }

  &.el-menu--horizontal {
    height: 100%;
    border-bottom: none;
  }
}

.el-menu--vertical {
  background-image: url("@/assets/layout/slidebar.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}
:deep(.el-menu-item.is-active) {
  background: linear-gradient(
    90deg,
    rgba(76, 176, 79, 0) 0%,
    var(--el-color-primary) 100%
  );
}
</style>
