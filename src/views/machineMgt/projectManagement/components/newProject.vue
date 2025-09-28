<template>
  <el-dialog
        :title="title"
        v-model="newProjectVisible"
        width="450px" 
        center    
        @open="setFormData"
        @close="close"
       >
       <el-form
        :model="projectForm"
        ref="projectFormRef"
        :rules="rules"
        :label-width="120"
      >
        <el-form-item :label="t('project.projectName')" prop="projectName">
          <el-input
            v-model="projectForm.projectName"
            autocomplete="off"
            :placeholder="t('tip.projectName')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="t('message.remark')" prop="remark">
        
          <el-input
            v-model="projectForm.remark"
            autocomplete="off"
            :placeholder="t('tip.remark')"
          ></el-input>
        </el-form-item>
      </el-form>
  
    <template #footer>
        <el-button @click="newProjectVisible=false">{{ t('message.cancel') }}</el-button>
        <el-button type="primary" @click="save">{{ t('message.save') }}</el-button>
    </template>
      
    </el-dialog>     
</template>
<script setup lang="ts">
import {ref,reactive,computed,onMounted, nextTick} from "vue"
import {addProject_API,updateProject_API} from "@/api/project";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const prop=defineProps({
    visible:{
        type:Boolean
    },
    // isEdit:{
    //     type:Boolean,
    //     default:false
    // },
  data: {
      type: Object,
      default: () => {}
      }
});
const emit=defineEmits(['update:visible','refresh']);
const isEdit=computed<boolean>(()=>{return Object.keys(prop.data).length>0});
const title=computed<string>(()=>{return isEdit.value?t('project.editProject'):t('project.newProject')})
const projectForm=ref<any>({
    projectName:'',
    remark:''
})
onMounted(()=>{
    setFormData()
})
const setFormData=()=>{
    isEdit.value?projectForm.value=JSON.parse(JSON.stringify(prop.data)):
    projectForm.value={
         projectName:'',
        remark:''
    }
    nextTick(()=>{
      projectFormRef.value?.clearValidate()
    })
}
const close=()=>{
  projectForm.value={
         projectName:'',
        remark:''
    }
}
const newProjectVisible = computed({
  get: () => prop.visible,
  set: (val) => {
    emit('update:visible', val)
  }
})
const rules=computed(()=>{return {
	projectName: [
		{ required: true, message: t('tip.projectName'), trigger: 'blur' },                     
	],
	
}})
const projectFormRef=ref();
const validate= ()=>{return projectFormRef.value?.validate()}
const save = async() => {
    const valid=await validate();
        if(valid){
           await isEdit.value?updateProject_API(projectForm.value):addProject_API(projectForm.value)
           newProjectVisible.value=false;
            emit("refresh");
        }
  
};


</script>
<style lang="scss" scoped>




</style>
