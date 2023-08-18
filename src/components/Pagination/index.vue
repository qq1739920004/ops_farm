<template>
  <div class="Pagination_component">
    <el-pagination
      class="pagination"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="[10, 30, 50, 100]"
      :layout="'sizes,total, prev, pager, next'"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script setup lang="ts">
import {} from "vue";
const props = defineProps({
  total: {
    type: Number,
    default: 0,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
});
const emit = defineEmits(["pageChange"]);

function handleSizeChange(val: number) {
  emit("pageChange", {
    currentPage: props.currentPage,
    pageSize: val,
  });
}
function handleCurrentChange(val: number) {
  emit("pageChange", {
    currentPage: val,
    pageSize: props.pageSize,
  });
}
</script>

<style lang="scss" scoped>
.Pagination_component {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}
</style>
