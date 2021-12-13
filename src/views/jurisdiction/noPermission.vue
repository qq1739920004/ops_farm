<template>
  <div class="app0_contianer">
    <div class="no_allowed">
      暂无权限，请联系管理员获取！
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {

        }
    }
}
</script>
<style scoped lang='scss'>
.app0_contianer {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .no_allowed {
        padding: 30px;
        width: 500px;
        height: 410px;
        box-sizing: border-box;
        display:flex;
        justify-content: center;
        background: url('~@/assets/common/1.png');
    }
}
</style>
