<!--  -->
<template>
    <div>
        <el-dialog v-model="dialogVisible" title="车型模版" width="30%" center>
            <div class="content">
                1
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false" style="color:rgba(76, 176, 79, 1)" link>下载模版</el-button>
                    <el-button type="primary"
                        style="background-color:rgba(76, 176, 79, 1);color:'#fff'; width: 100px;height: 38px;margin-left:50px"
                        @click="dialogVisible = false">
                        录入
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const dialogVisible = ref<boolean>(false)
defineExpose({
    dialogVisible
}
)

</script>

<style lang="scss" scoped>
.content {
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0px;
    line-height: 23.17px;
    color: rgba(0, 0, 0, 1);


}


.dialog-footer {
    display: flex;
    justify-content: center;
}
</style>