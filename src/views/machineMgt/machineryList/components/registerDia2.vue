<template>
  <div class="content">
    <el-dialog
      style="border-radius: 8px"
      v-model="dialogVisible"
      :title="$t('devicelist.device')"
      width="630px"
      @open="getDays"
    >
      <el-form style="width: 100%" label-width="160px">
        <el-form-item :label="$t('devicelist.sn')" label-width="198px">
          <span class="span_title"> {{ props.sn }}</span>
        </el-form-item>
        <el-form-item :label="$t('devicelist.time') + ':'">
          <el-radio-group v-model="date" class="ml-4" v-if="dataArray.length > 0">
            <el-radio
              v-for="(item, index) in dataArray"
              :key="index"
              :label="item.days"
            >
              {{ item.name }}
            </el-radio>
          </el-radio-group>
          <div v-else class="no-data">
            {{ tips }}
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="log-link">
            <span class="link-text" v-auth="2854" @click="openLog">{{ $t('devicelist.codeRecord') }}</span>
        </div>
        <span class="dialog-footer">
          <el-button type="primary" @click="activationAddBtn" :disabled="dataArray.length === 0">
            {{ $t("devicelist.apply") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <ActivationCodeLogDia ref="activationCodeLogDiaRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import {
  getActivationCodeDay_API,
  getActivationCode_API,
} from "@/api/machineryList/index";
import { useI18n } from "vue-i18n";
import ActivationCodeLogDia from "./ActivationCodeLogDia.vue";

const { t } = useI18n();
const dialogVisible = ref<boolean>(false);
const props = defineProps(["carId", "sn", "deviceId"]);
defineExpose({
  dialogVisible,
});
const date = ref();
const dataArray = ref<any[]>([]);
const tips = ref("");
const activationCodeLogDiaRef = ref();

const openLog = () => {
  activationCodeLogDiaRef.value.open(props.sn);
};

const getDays = async () => {
  try {
    const res = await getActivationCodeDay_API({ carId: props.carId });
    if (res.code === 0 && res.data) {
      dataArray.value = res.data;
      if (dataArray.value.length > 0) {
        date.value = dataArray.value[0].days;
        tips.value = "";
      } else {
        // If no days available, it might mean permanent code is already taken or not available
        tips.value = t('devicelist.noAvailableDuration'); // "Device already has permanent code or no available duration"
      }
    }
  } catch (e) {
    console.error(e);
  }
};

const activationAddBtn = async () => {
  if (!date.value && dataArray.value.length > 0) return;
  
  try {
    const res = await getActivationCode_API({
      carId: props.carId,
      sn: props.sn,
      date: date.value,
      // deviceId might be needed? Mini Program API call uses: carId, sn, date. 
      // Existing registerDia uses activationCodeAdd_API with deviceId. 
      // Mini Program getRegisterCode_API params: sn, carId, date.
      // So likely no deviceId needed for this new API.
    });
    if (res.code === 0) {
      ElMessage({ type: "success", message: t('devicelist.codeIssuedSuccess') }); // "Registration code issued successfully"
      dialogVisible.value = false;
    } else {
        // Error is handled by request interceptor usually, but if code!=0
        // ElMessage({ type: 'error', message: res.message || '设置失败' })
    }
  } catch {
      // Error handled
  }
};
</script>

<style lang="scss" scoped>
.content {
  :deep(.el-form-item__label) {
    font-size: 16px;
    font-weight: 400;
  }

  .span_title {
    font-size: 16px;
    font-weight: 400;
  }

  .ml-4 {
    .el-radio {
      font-size: 16px;
      font-weight: 400;
    }
  }

  :deep(.ml-4 .el-radio__label:hover) {
    color: var(--el-color-primary);
  }

  :deep(.ml-4 .el-radio__input.is-checked + .el-radio__label) {
    color: var(--el-color-primary);
  }

  :deep(.ml-4 .el-radio__input.is-checked .el-radio__inner) {
    background: var(--el-color-primary);
    border-color: var(--el-color-primary);
  }

  :deep(.ml-4 .el-radio__inner:hover) {
    border-color: var(--el-color-primary);
  }
  
  .no-data {
      font-size: 14px;
      color: #909399;
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
}
.log-link {
    text-align: right;
    margin-bottom: 10px;
    margin-right: 20px;
}
.link-text {
  color: var(--el-color-primary);
  cursor: pointer;
  border: none;
  font-size: 14px;
}
.link-text:hover {
  opacity: 0.8;
}
</style>
