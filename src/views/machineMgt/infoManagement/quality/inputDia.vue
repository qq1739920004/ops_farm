<!--  -->
<template>
  <div>
    <el-dialog
      @close="closeInputList"
      style="border-radius: 8px"
      v-model="dialogVisible"
      :title="$t('messages.enter')"
      width="30%"
      center
    >
      <div class="content">
        <el-form
          :model="uploadData"
          style="width: 100%"
          ref="formRef"
          label-width="120px"
          :rules="rules"
        >
          <el-form-item :label="$t('work.deviceType') + ':'" prop="terminalType">
            <el-select
              v-model="uploadData.terminalType"
              class="m-2"
              :placeholder="$t('work.pleaseSelect')"
              width="120px"
              prop="terminalType"
            >
              <!-- <el-option value="AG360" label="AG360" /> -->
              <el-option
                v-for="(item, index) in terminalList"
                :key="index"
                :value="item"
                :label="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
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
          <el-button style="color: var(--el-color-primary)" text @click="getTemplate">{{
            $t("messages.Downloadtemplate")
          }}</el-button>
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
import { import_API } from "@/api/machineryList/index";
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
  terminalType: "",
});
const terminalList = ref<any>([]);
const actionUrl = import.meta.env.VITE_APP_BASE_API + `/farm/carModuleInfo/batchImport`;
defineExpose({
  dialogVisible,
  terminalList,
});
const rules = {
  terminalType: [{ required: true, message: t("work.pleaseSelect"), trigger: "change" }],
};

const closeInputList = () => {
  uploadData.terminalType = "";
  fileName.value = "";
  uploadRef.value?.clearFiles();
  formRef.value?.clearValidate();
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
  if (!uploadData.terminalType) {
    ElMessage({
      type: "warning",
      message: t("messages.pleaseSelect"),
      duration: 1000,
    });
    return;
  }
  if (!fileName.value) {
    ElMessage({ type: "warning", message: t("messages.plzup"), duration: 1000 });
    return;
  }
  uploadRef.value!.submit();
};

const getTemplate = async () => {
  import_API().then((res) => {
    let name = "template.xlsx";
    const type = "application/vnd.ms-excel;charset=utf-8"; //excel文件
    let u = window.URL.createObjectURL(new Blob([res.data], { type: type }));
    let a = document.createElement("a");
    a.download = name;
    a.href = u;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
};
const successResult = (data: any) => {
  // ElMessage({ type: 'success', message: '上传成功!', duration: 1000 })
  // dialogVisible.value = false

  if (data.code === -104) {
    let messagedata = data.data.errorMessageList.map((item: any, index: any) => {
      return index + 1 + `.sn号为${item.sn}的${item.message}`;
    });
    ElMessage({
      type: "error",
      message: messagedata.join(`<br/>`),
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
  margin-top: 20px;
}
.upload-demo {
  width: 40px;
}
</style>
