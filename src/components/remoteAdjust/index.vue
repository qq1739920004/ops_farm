<template>
  <div>
    <RemoteAdjustDia360 ref="RemoteD" :terminalType="terminalType" :paramVersionnum="paramVersionnum"
      :paramType="paramType" :carId="carId" :sn="sn" :name="name">
    </RemoteAdjustDia360>
    <RemoteAdjustDia302 ref="RemoteD302" :terminalType="terminalType" :paramVersionnum="paramVersionnum"
      :paramType="paramType" :carId="carId" :sn="sn" :name="name">
    </RemoteAdjustDia302>
    <RemoteAdjustDia502 ref="RemoteD502" :terminalType="terminalType" :paramVersionnum="paramVersionnum"
      :paramType="paramType" :carId="carId" :sn="sn" :name="name">
    </RemoteAdjustDia502>
    <RemoteAdjustDia_360 ref="RemoteD360" :terminalType="terminalType" :paramVersionnum="paramVersionnum"
      :paramType="paramType" :carId="carId" :sn="sn" :name="name">
    </RemoteAdjustDia_360>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from "vue";
import RemoteAdjustDia360 from "./components/remoteAdjust.vue";
import RemoteAdjustDia302 from "./components/remoteAdjust302.vue";
import RemoteAdjustDia502 from "./components/remoteAdjust502.vue";
import RemoteAdjustDia_360 from "./components/remoteAdjust360.vue";
const props = defineProps([
  "terminalType",
  "paramType",
  "paramVersionnum",
  "carId",
  "sn",
  "name",
  "isChange",
]);
const terminalType = ref<string>("");
const paramVersionnum = ref<string>("");
const paramType = ref<string>("");
const name = ref<string>("");
const carId = ref<number>();
const sn = ref();
const RemoteD = ref();
const RemoteD302 = ref();
const RemoteD502 = ref();
const RemoteD360 = ref()
const gotoRemote = () => {
  if (terminalType.value.includes("AG360") && Number(paramVersionnum.value) < 100) {
    RemoteD.value.dialogVisible = true;
    
  }
  if (terminalType.value.includes("AG360") && Number(paramVersionnum.value) >= 100) {
    RemoteD360.value.dialogVisible = true;
    
  }
  if (terminalType.value == "AG302") {
    RemoteD302.value.dialogVisible = true;
  }
  if (terminalType.value == "AG502" ) {
    RemoteD502.value.dialogVisible = true;
  }
  if(terminalType.value.includes("MT")){
    RemoteD502.value.dialogVisible = true; RemoteD502.value.dialogVisible = true;
  }
  nextTick(() => {
    RemoteD.value.carFormRef?.clearValidate();
    RemoteD302.value.carFormRef?.clearValidate();
    RemoteD502.value.carFormRef?.clearValidate();
  });
};
watch(
  () => props.isChange,
  () => {
    terminalType.value = props.terminalType;
    paramVersionnum.value = props.paramVersionnum;
    paramType.value = props.paramType;
    carId.value = props.carId;
    sn.value = props.sn;
    name.value = props.name;
    gotoRemote();
  }
);
</script>

<style lang="scss" scoped></style>
