<template>
  <div class="realTimeChart_component">
    <el-dialog
      v-model="props.visible"
      :before-close="handleClose"
      title="Tips"
      width="30%"
    >
      <span>This is a message</span>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// import { ref } from "vue";
const props = defineProps({
  visible: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(["handleClose"]);

function handleClose() {
  emit("handleClose");
}
</script>

<style lang="scss" scoped></style>
