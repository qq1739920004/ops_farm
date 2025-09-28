<template>
  <el-dialog
        :title="t('project.newDevice')"
        v-model="newDeviceVisible"
        width="350px"     
        center
         @close="close"
       >
       <el-form
        :model="deviceForm"
        ref="deviceFormRef"
        :rules="rules"
        :label-width="80"
      >
        <el-form-item label="SN" prop="sn">
          <el-input
            v-model="deviceForm.sn"
            :placeholder="t('tip.sn')"
          ></el-input>
        </el-form-item>
      
      </el-form>
  
    <template #footer>
        <el-button @click="newDeviceVisible=false">{{ t('message.cancel') }}</el-button>
        <el-button type="primary" @click="save">{{ t('message.save') }}</el-button>
    </template>
      
    </el-dialog>     
</template>
<script setup lang="ts">
import {ref,reactive,computed} from "vue"
import { addDevice_API } from "@/api/project";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import { useRoute } from "vue-router";
const route = useRoute();
const prop=defineProps({
    visible:{
        type:Boolean
    },
 
});
const emit=defineEmits(['update:visible','refresh']);
const deviceForm=reactive<any>({
    sn:'',
    projectId: route.params.id,
})

const close=()=>{
  deviceForm.sn='';
  deviceFormRef.value?.clearValidate()
}
const newDeviceVisible = computed({
  get: () => prop.visible,
  set: (val) => {
    emit('update:visible', val)
  }
})
const rules=computed(()=>{return {
	sn: [
		{ required: true, message: t('tip.sn'), trigger: 'blur' },                     
	],
	
}})

const deviceFormRef=ref();
const validate= ()=>{return deviceFormRef.value?.validate()}
const save = async() => {
    const valid=await validate();
        if(valid){
          await addDevice_API(deviceForm)
          newDeviceVisible.value=false;
          emit("refresh");
        }
  
};

</script>
<style lang="scss" scoped>




</style>
