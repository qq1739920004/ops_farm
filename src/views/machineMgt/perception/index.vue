<template>
  <div class="perception">
    <template v-if="startUpdata">
      <template v-if="isAbroad">
        <template v-if="isManager">
          <managerSea :companyName="companyName"></managerSea>
        </template>

        <template v-else> <systemSea></systemSea> </template>
      </template>
      <template v-else>
        <template v-if="isManager">
          <manager :companyName="companyName"></manager>
        </template>

        <template v-else> <system></system> </template
      ></template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { locale } = useI18n();
import { getUserAuth } from "@/api/perception/index.ts";
import { ref, onMounted, onUnmounted, computed } from "vue";
import manager from "./components/manager/index.vue";
import system from "./components/system/index.vue";
import systemSea from "./components/systemSea/index.vue";
import managerSea from "./components/managerSea/index.vue";
let isManager = ref(false);
let startUpdata = ref(false);
let countryCode = ref();
let companyName = ref("xxxxxx");
const isAbroad = computed<boolean>(() => {
  return locale.value != "zh";
});
getUserAuth().then((res) => {
  isManager.value = res.data.isCompanyUser;
  countryCode.value = res.data.countryCode;
  companyName.value = res.data.userCompanyName;
  startUpdata.value = true;
});
function adjustRootFontSize() {
  let width = window.innerWidth;
  let baseFontSize = 16;
  let fontSize = (width / 1920) * baseFontSize;
  document.documentElement.style.fontSize = fontSize + "px";
}
onMounted(() => {
  window.addEventListener("resize", adjustRootFontSize);
});
onUnmounted(() => {
  window.removeEventListener("resize", adjustRootFontSize);
});
</script>

<style lang="scss" scoped>
.perception {
  width: 100%;
  height: 100%;
}
</style>
