<template>
  <el-dialog :title="t('project.sendTask')" v-model="sendTaskVisible" width="450px"  @close="close" center>
    <el-form :model="sendTaskForm" ref="sendTaskFormRef" :rules="rules" :label-width="120">
      <el-form-item :label="t('project.time')" prop="id">
        <el-input-number
          v-model="sendTaskForm.taskTime"
         :precision="0"
         :min="1"
         :max="23"
          :placeholder="t('tip.int')"
          class="input-number"
        ></el-input-number>
        <div class="tip flex-align-center">
            <el-icon><Warning /></el-icon>
            <span>{{ t('tip.sendTask') }}</span>
        </div>
        
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="sendTaskVisible = false">{{ t("message.cancel") }}</el-button>
      <el-button type="primary" @click="save">{{ t("message.save") }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { updateDevice_API } from "@/api/project";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const prop = defineProps({
  visible: {
    type: Boolean,
  },
  id: {
    type: Number,
  },
});
const emit = defineEmits(["update:visible", "refresh"]);
const sendTaskForm = reactive<any>({
  taskTime:undefined,
  
});
const close=()=>{
  sendTaskForm.taskTime=undefined;
  sendTaskFormRef.value?.clearValidate()
}
const sendTaskVisible = computed({
  get: () => prop.visible,
  set: (val) => {
    emit("update:visible", val);
  },
});

// const validateTime= (rule:any, value:any, callback:any) => {
// 	if(!value){
// 		callback(new Error(t("messages.datetime")))
// 	}
// 	else if(value>24 || value<1){
// 		callback(new Error(t("messages.datetime")))
// 	}else{
// 		callback()
// 	}
// }
const rules = computed(() => {
  return {
    taskTime: [{ required: true, message: t("tip.time"), trigger: "change" }],
  };
});
const sendTaskFormRef=ref();
const validate= ()=>{return sendTaskFormRef.value?.validate()}
const save = async() => {
    const valid=await validate();
        if(valid){
          sendTaskForm.id=prop.id;
          await updateDevice_API(sendTaskForm)
          sendTaskVisible.value=false;
            emit("refresh");
        }
  
};
</script>
<style lang="scss" scoped>
:deep(.el-input-number){
  width: 200px!important;
}
.tip{
  color: #B4BAB4;
  font-size: 12px;
  .el-icon{
    margin-right: 6px
  }
}
</style>
