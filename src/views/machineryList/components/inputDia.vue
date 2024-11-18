<!--  -->
<template>
  <div>
    <el-dialog
      @close="closeInputList"
      @open="getInputList"
      style="border-radius: 8px"
      v-model="dialogVisible"
      :title="$t('devicelist.inputDealerDevice')"
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
          <el-form-item :label="$t('work.dealer') + ':'" prop="id">
            <el-select
              v-model="uploadData.id"
              class="m-2"
              :placeholder="$t('messages.Pleasedistributor')"
              filterable
            >
              <el-option
                v-for="item in carDealerList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
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
          <el-button
            v-auth="567"
            style="color: var(--el-color-primary)"
            text
            @click="getTemplate"
            >{{ $t("messages.Downloadtemplate") }}</el-button
          >
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
import { ref, watch, reactive } from "vue";
import { carDealer_API, getDownTemplate_API } from "@/api/machineryList/index";
import { carDealerResponseData, carDealerObj } from "@/api/machineryList/type";
import type { UploadInstance } from "element-plus";
import { ElMessage } from "element-plus";
import useUserStore from "@/store/user";
const userStore = useUserStore();
const formRef = ref();
const dialogVisible = ref<boolean>(false);
const carDealerList = ref<carDealerObj[]>([]);
const fileName = ref();
const uploadRef = ref<UploadInstance>();
let uploadData = reactive({
  id: "",
  companyName: "",
});
const actionUrl = import.meta.env.VITE_APP_BASE_API + `/farm/car/batchImport`;
defineExpose({
  dialogVisible,
});
const rules = {
  id: [{ required: true, message: "经销商不能为空", trigger: "change" }],
};
const getInputList = async () => {
  const res: carDealerResponseData = await carDealer_API();
  carDealerList.value = res.data;

  carDealerList.value.filter((item) => {
    if (item.id === uploadData.id) {
      uploadData.companyName = item.name;
    }
  });
};
const closeInputList = () => {
  uploadData.id = "";
  fileName.value = "";
  uploadRef.value?.clearFiles();
};
const handleChange = (e: any) => {
  fileName.value = e.name;
};
const beforeUploadFile = (file: any) => {
  const extension = file.name.substring(file.name.lastIndexOf(".") + 1);
  if (extension !== "xls" && extension !== "xlsx") {
    ElMessage({ type: "warning", message: "只能上传excel的文件", duration: 1000 });
    return false;
  }
};
const beforeRemove = () => {
  fileName.value = "";
};

const submitBtn = async () => {
  await formRef.value.validate();
  if (!uploadData.companyName) {
    ElMessage({ type: "warning", message: "请先选择经销商", duration: 1000 });
    return;
  }
  if (!fileName.value) {
    ElMessage({ type: "warning", message: "请先上传文件", duration: 1000 });
    return;
  }
  uploadRef.value!.submit();
};

const getTemplate = async () => {
  getDownTemplate_API().then((res) => {
    let name = "模板.xlsx";
    const type = "application/vnd.ms-excel;charset=utf-8"; //excel文件
    let u = window.URL.createObjectURL(new Blob([res.data], { type: type }));
    let a = document.createElement("a");
    a.download = name;
    a.href = u;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
    ElMessage({ type: "success", message: "获取成功", duration: 1000 });
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
      ElMessage({ type: "success", message: "上传成功!", duration: 1000 });
      dialogVisible.value = false;
    }
  }
};
watch(
  () => uploadData.id,
  () => {
    carDealerList.value.filter((item) => {
      if (item.id === uploadData.id) {
        uploadData.companyName = item.name;
      }
    });
  },
  { deep: true }
);
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
  margin-top: -20px;
}
</style>
