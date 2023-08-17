<template>
  <div class="app_container">
    <!-- 态势监控 -->

    <el-button type="primary">我是主题颜色按钮</el-button>
    <el-button type="primary" link>我是主题颜色按钮</el-button>
    <div class="div_content">我是主题颜色div</div>

    <div style="margin-top: 30px">
      <el-button type="danger">我是非主题颜色按钮</el-button>
    </div>

  

    <div @click="ss">123</div>
    <div class="test"></div>
  </div>


</template>

<script setup lang="ts">

// const isDark = useDark();



function ss() {
  // console.log(false);
  // useToggle(false);
}
</script>

<style lang="scss" scoped>
.app_container {
  background-color: var(--el-bg-color-page);
}
.div_content {
  width: 100px;
  height: 100px;
  border-radius: 10px;
  margin-top: 30px;
  background-color: var(--el-color-primary);
}
.test {
  width: 100px;
  height: 100px;
  border-radius: 10px;
  background-color: var(--el-bg-color-overlay);
}
</style>
