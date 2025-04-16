<!--  -->
<template>
  <div>
    <el-dialog
      @close="closeInputList"
      style="border-radius: 8px"
      v-model="dialogVisible"
      title="导入大田补贴"
      width="30%"
      center
    >
      <div class="content">
        <el-form
          :model="uploadData"
          style="width: 100%"
          ref="formRef"
          label-width="120px"
        >
          <el-form-item :label="$t('messages.file') + ':'" prop="date">
            <el-input
              class="inputel"
              :placeholder="$t('messages.Pleaseenterafilename')"
              v-model="fileName"
            >
              <template #append>
                <el-upload
                  style="height: 30px"
                  ref="uploadRef"
                  class="upload-demo"
                  :action="actionUrl"
                  :data="uploadData"
                  :headers="{ Authorization: userStore.Authorization }"
                  :limit="1"
                  :auto-upload="false"
                  :on-change="handleChange"
                  :on-success="successResult"
                  :before-upload="beforeUploadFile"
                  :before-remove="beforeRemove"
                >
                  <el-button>{{ $t("messages.browse") }}</el-button>
                </el-upload>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">

          <el-button
            type="primary"
            style="
              background-color: var(--el-color-primary);
              color: '#fff';
              width: 100px;
              height: 38px;
              margin-left: 50px;
            "
            @click="submitBtn"
          >
            {{ $t("messages.enter") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { UploadInstance } from "element-plus";
import { ElMessage } from "element-plus";
import useUserStore from "@/store/user";
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();
const userStore = useUserStore();
const formRef = ref();
const dialogVisible = ref<boolean>(false);
const fileName = ref();
const uploadRef = ref<UploadInstance>();
let uploadData = reactive<any>({
});
const actionUrl = import.meta.env.VITE_APP_BASE_API + `/farm/car/importImei`;
defineExpose({
  dialogVisible,
});

const closeInputList = () => {
  fileName.value = "";
  uploadRef.value?.clearFiles();
};
const handleChange = (e: any) => {
  fileName.value = e.name;
};
const beforeUploadFile = (file: any) => {
  const extension = file.name.substring(file.name.lastIndexOf(".") + 1);
  if (extension !== "xls" && extension !== "xlsx") {
    ElMessage({ type: "warning", message: t("work.onlyExcel"), duration: 1000 });
    return false;
  }
};
const beforeRemove = () => {
  fileName.value = "";
};

const submitBtn = async () => {
  await formRef.value.validate();
  if (!fileName.value) {
    ElMessage({ type: "warning", message: t("messages.plzup"), duration: 1000 });
    return;
  }
  uploadRef.value!.submit();
};


const successResult = (data: any) => {
  // ElMessage({ type: 'success', message: '上传成功!', duration: 1000 })
  // dialogVisible.value = false

  if (data.code !== 0) {
   
    ElMessage({
      type: "error",
      message: data.message,
      showClose: true,
      dangerouslyUseHTMLString: true,
      duration: 8000,
    });
    uploadRef.value?.clearFiles();
  } else {
    if (data.code === 0 && data.data !== null) {
      if (data.data.errorMessageList) {
        ElMessage.error(data.data.errorMessageList[0].message);
        dialogVisible.value = false;
      }
    } else {
      dialogVisible.value = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 23.17px;

  :deep(.el-form-item__label) {
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0px;
  }

  .m-2 {
    margin-left: 10px;
    width: 270px;
  }

  .inputel {
    margin-left: 10px;
    width: 270px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
}
.upload-demo {
  width: 40px;
}
</style>
