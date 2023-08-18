<template>
  <div class="app_container">
    <!-- 搜索部分 -->
    <div class="search_container app_card">
      <div>
        <el-input v-model="input" placeholder="Please input" />
      </div>
      <div>
        <el-button type="primary">添加</el-button>
      </div>
    </div>
    <!-- 表格部分 -->
    <div class="table_container app_card">
      <el-table :data="tableData" stripe>
        <el-table-column prop="date" label="Date" align="center" />
        <el-table-column prop="name" label="Name" align="center" />
        <el-table-column prop="address" label="Address" align="center" />
        <el-table-column label="操作" align="center">
          <template #default>
            <el-button type="primary" link>详情</el-button>
            <el-button type="primary" link>编辑</el-button>
            <el-button type="danger" link>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination :total="10" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Pagination from "@/components/Pagination/index.vue";
const input = ref("");
const tableData = [
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
];
</script>

<style lang="scss" scoped>
.search_container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  flex-wrap:wrap;
}
</style>
