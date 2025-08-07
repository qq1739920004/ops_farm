<template>
  <el-config-provider :locale="appStore.locale">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { ElConfigProvider } from "element-plus";
import { nextTick } from "vue";
import useAppStore from "@/store/app";
import { useI18n } from "vue-i18n";
import { getWSUrl_API } from "@/api/request/index";
const { t } = useI18n();
const isChangfa = import.meta.env.MODE === "changFa";
nextTick(() => {
  document.title = isChangfa ? "常发农装" : t("messages.systemName");
});
const appStore = useAppStore();
const changeFavicon = (link: any) => {
  let $favicon: any = document.querySelector('link[rel="icon"]');
  if ($favicon !== null) {
    $favicon.href = link;
  } else {
    $favicon = document.createElement("link");
    $favicon.rel = "icon";
    $favicon.href = link;
    document.head.appendChild($favicon);
  }
};
const getWSUrl = async () => {
  const { data } = await getWSUrl_API();
  window.CONFIG_BASE_WS = data.CONFIG_BASE_WS;
  window.CONFIG_DOWNLOAD_WS = data.CONFIG_DOWNLOAD_WS
  window.CONFIG_NEW = data.CONFIG_NEW
  console.log(window)
};
getWSUrl();

//根据传递的参数修改Favicon
const changeIco = () => {
  // 得到图标地址
  let iconUrl;
  if (!isChangfa) {
    iconUrl = `./logo.svg`;
  } else {
    iconUrl = `./changfa_logo.png`;
  }
  changeFavicon(iconUrl);
};
changeIco();
</script>

<style scoped lang="scss"></style>
