<template>
  <div class="perception">
    <template v-if="startUpdata">
      <manager v-if="isManager" :companyName="companyName"></manager>
      <system v-else></system>
    </template>
  </div>
</template>

<script setup lang="ts">

import {getUserAuth} from "@/api/perception/index.ts";
import {ref,onMounted,onUnmounted} from 'vue';
import manager from './components/manager/index.vue';
import system from './components/system/index.vue';

let isManager=ref(false)
let startUpdata=ref(false)
let companyName=ref('xxxxxx')
getUserAuth().then(res=>{
  isManager.value=res.data.isCompanyUser
  companyName.value=res.data.userCompanyName
  startUpdata.value=true
})
function adjustRootFontSize() {
    let width = window.innerWidth;
    let baseFontSize = 16; 
    let fontSize = (width / 1920) * baseFontSize; 
    document.documentElement.style.fontSize = fontSize + 'px';
}
onMounted(()=>{
  window.addEventListener('resize', adjustRootFontSize);
})
onUnmounted(()=>{
  window.removeEventListener('resize', adjustRootFontSize);
})

</script>

<style lang="scss" scoped>
.perception {
  width: 100%;
  height: 100%;
}
</style>