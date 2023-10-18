<template>
  <div class="perception">
    <template v-if="startUpdata">
      <manager v-if="isManager" :companyName="companyName"></manager>
      <system v-else></system>
    </template>
  </div>
</template>

<script setup lang="ts">

import {getUserAuth } from "@/api/perception/index.ts";
import {ref} from 'vue';
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


</script>

<style lang="scss" scoped>
.perception {
  width: 100%;
  height: 100%;
  
}
</style>