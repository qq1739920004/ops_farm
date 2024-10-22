<template>
  <el-select
    v-model="companyIdTemp"
    :placeholder="$t('terminal.numbertem')"
    filterable
    remote
    reserve-keyword
    :remote-method="cacheList"
    :disabled="agencyList.length <= 1"
    :loading="agencyLoading"
    @change="selectChange"
    @focus="clearCompanyId"
    :style="'width:' + config.width"
  >
    <el-option
      v-for="(item, index) in agencyListTemp"
      :key="index"
      :label="item.name"
      :value="item.id"
    >
      <div class="flex-space-between">
        <span>{{ item.name }}</span>
        <span>{{ item.managerTel }}</span>
      </div>
    </el-option>
  </el-select>
</template>
<script setup lang="ts">
import {ref,reactive,onMounted,watch,computed} from "vue"
const props = defineProps({
    config:{
        type: Object,
        default: () => {
          return {
            width: '340px',
          }
        }
      },
      companyId: {
        type:Number
       
      },
      agencyList: {
        type: Array,
        default: () => [],
      },
});
const emit = defineEmits(['update:companyId','selectChange']);
const companyIdTemp = computed<any>({
get: () => props.companyId,
set: (val:number) => {
emit('update:companyId', val)
}
})
const agencyLoading=ref<boolean>(false)
const agencyListTemp=ref<any[]>(props.agencyList)
watch(()=>props.agencyList,()=>{
    changeAgencyList()
})
const clearCompanyId=()=>{
    agencyListTemp.value = props.agencyList;
}
const changeAgencyList=()=>{
    agencyListTemp.value = props.agencyList;
}
const cacheList=(key:string)=>{
    agencyLoading.value=true;
    agencyListTemp.value = props.agencyList.filter((item:any) => {
        return item.name.includes(key) || item.managerTel.includes(key);
    });
    agencyLoading.value=false;
}
const selectChange=()=>{
     emit('selectChange', companyIdTemp.value);
}
</script>
<style lang="scss" scoped></style>
