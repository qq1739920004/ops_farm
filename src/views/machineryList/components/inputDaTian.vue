<!--  -->
<template>
  <div>
    <el-dialog
      @close="closeInputList"
      style="border-radius: 8px"
      v-model="dialogVisible"
      :title="t('work.daTian')"
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
    <el-dialog
      @close="closeInputList"
      style="border-radius: 8px"
      v-model="dialogVisible2"
      center
      width="30%"
    >
      <div class="valueAre">
      <div>  <svg
          t="1745720716915"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="4547"
          width="32"
          height="32"
        >
          <path
            d="M124.3 860h775.5L512 139.9 124.3 860zM512 760c-19.9 0-36-16.1-36-36s16.1-36 36-36 36 16.1 36 36-16.1 36-36 36z m36-340v160c0 19.9-16.1 36-36 36s-36-16.1-36-36V420c0-19.9 16.1-36 36-36s36 16.1 36 36z"
            fill="#FFEB3B"
            p-id="4548"
          ></path>
          <path
            d="M991.7 878.9l-448-832C537.4 35.3 525.2 28 512 28s-25.4 7.3-31.7 18.9l-448 832c-6 11.2-5.7 24.6 0.8 35.5C39.6 925.3 51.3 932 64 932h896c12.7 0 24.4-6.7 30.9-17.5 6.5-10.9 6.8-24.4 0.8-35.6zM124.3 860L512 139.9 899.7 860H124.3z"
            fill="#FF9800"
            p-id="4549"
          ></path>
          <path
            d="M476 420v160c0 19.9 16.1 36 36 36s36-16.1 36-36V420c0-19.9-16.1-36-36-36s-36 16.1-36 36z"
            fill="#FF5722"
            p-id="4550"
          ></path>
          <path
            d="M512 724m-36 0a36 36 0 1 0 72 0 36 36 0 1 0-72 0Z"
            fill="#FF5722"
            p-id="4551"
          ></path></svg
        ></div>
     <div >
      <div v-for="(item, index) in ErrorValue" :key="index">{{ t("messages.noSys") }}:{{ item }}</div>
     </div>
      </div>
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
const ErrorValue = ref<any>("");
const dialogVisible = ref<boolean>(false);
const fileName = ref();
const uploadRef = ref<UploadInstance>();
const dialogVisible2 = ref(false);
let uploadData = reactive<any>({});
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
  console.log(data);
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
        // ElMessage.error(data.data.errorMessageList[0].message);

        ErrorValue.value = data.data.errorMessageList.map((item: any) => {
          return item.message.split("：")[1];
        });
        dialogVisible.value = false;

        dialogVisible2.value = true;
      }
    } else {
      dialogVisible.value = false;
      ElMessage.success(t("messages.introduceSuccess"));
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
.valueAre {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
}
</style>
