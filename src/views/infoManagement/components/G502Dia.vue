<!--  -->
<template>
  <div>
    <el-dialog
      style="border-radius: 8px"
      v-model="dialogVisible"
      :title="newRecords.id ? $t('work.edit') : $t('work.new')"
      width="544px"
      height="580px"
    >
      <el-form
        label-width="140px"
        style="width: 90%"
        ref="formRef"
        :model="props.newRecords"
        :rules="rules"
      >
        <el-form-item :label="$t('work.deviceType')" prop="terminalType">
          <el-select
            style="width: 100%"
            v-model="props.newRecords.terminalType"
            class="m-2"
            :placeholder="$t('work.pleaseSelect')"
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
        <el-form-item :label="$t('work.labelSN')" prop="npn">
          <el-input v-model="newRecords.npn"></el-input>
        </el-form-item>
        <el-form-item :label="$t('devicelist.deviceSN')" prop="sn">
          <el-input v-model="newRecords.sn"></el-input>
        </el-form-item>
        <el-form-item :label="$t('work.motorSN')" prop="motorSn">
          <el-input v-model="newRecords.motorSn"></el-input>
        </el-form-item>

        <el-form-item :label="$t('work.BodySN')" prop="carImuSn">
          <el-input v-model="newRecords.carImuSn"></el-input>
        </el-form-item>
        <el-form-item :label="$t('work.frontWheelSN')" prop="wheelImuSn">
          <el-input v-model="newRecords.wheelImuSn"></el-input>
        </el-form-item>
        <el-form-item :label="$t('devicelist.owner')" prop="userName">
          <el-input v-model="newRecords.userName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('devicelist.tel')" prop="tel">
          <el-input v-model="newRecords.tel"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" v-if="!newRecords.id" @click="submit">
            {{ $t("work.submit") }}
          </el-button>
          <el-button type="primary" v-else @click="editSubmit">
            {{ $t("work.submit") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import {
  carModuleInfoSave_API,
  carModuleInfoUpdate_API,
} from "@/api/infoManagement/index";
let formRef = ref();
const props = defineProps({
  newRecords: {
    type: Object,
    default: {
      id: null,
      npn: "",
      sn: "",
      tel: "",
      userName: "",
      wheelImuSn: "",
      carImuSn: "",
      motorSn: "",
      antennaOne: "",
      terminalType: "AG501",
      type: "all",
    },
  },
});
const terminalList = ref<any>([]);
const emits = defineEmits(["push"]);

const ApiData = reactive<any>({});
const dialogVisible = ref<boolean>(false);
  defineExpose({
  dialogVisible,
  formRef,
  terminalList,
});
const editSubmit = async () => {
  Object.assign(ApiData, props.newRecords);
  await formRef.value.validate();
  editInfo();
  dialogVisible.value = false;
};
const editInfo = async () => {
  try {
    await carModuleInfoUpdate_API(ApiData);
    ElMessage({ type: "success", message: t("work.editSuccess") });
    emits("push", "");
  } catch {
    //  ElMessage({ type: 'error', message: '编辑失败' })
  }
};

const addInfo = async () => {
  try {
    await carModuleInfoSave_API(ApiData);
    ElMessage({ type: "success", message: t("messages.addSuccess") });
    emits("push", "");
  } catch {
    // ElMessage({ type: 'error', message: '添加失败' })
  }
};
const submit = async () => {
  Object.assign(ApiData, props.newRecords);
  await formRef.value.validate();
  dialogVisible.value = false;
  addInfo();
};

const rules = {
  terminalType: [{ required: true, message: t("messages.plzenter"), trigger: "blur" }],
  npn: [{ required: true, message: t("messages.plzenter"), trigger: "blur" }],
  sn: [{ required: true, message: t("messages.plzenter"), trigger: "blur" }],
  motorSn: [{ required: true, message: t("messages.plzenter"), trigger: "blur" }],
  carImuSn: [{ required: true, message: t("messages.plzenter"), trigger: "blur" }],
  wheelImuSn: [{ required: true, message: t("messages.plzenter"), trigger: "blur" }],
  userName: [{ required: true, message: t("messages.plzenter"), trigger: "blur" }],
  tel: [{ required: true, message: t("messages.plzenter"), trigger: "blur" }],
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: space-around;
}
</style>
