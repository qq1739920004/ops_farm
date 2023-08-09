<template>
    <div class="outcontainer">
        <el-dialog v-model="dialogVisible" width="30%" title="注册设备" center>
            <el-row :gutter="16" class="mainArea">
                <el-col :span="21" :offset="3" style="margin-bottom:20px ">
                    铭牌SN号:13333333333333
                </el-col>
            </el-row>
            <el-row :gutter="16" class="mainArea">
                <el-col :span="6" :offset="3" align="end" style="margin-right: -15px; ">
                    注册时长：
                </el-col>
                <el-col :span="11">
                    <el-radio-group class="mainArea" v-model="radio">
                        <el-radio :label="3" class="mainArea">立即过期</el-radio>
                        <el-radio :label="6" class="mainArea">一年</el-radio>
                        <el-radio :label="9" class="mainArea">永久</el-radio>
                    </el-radio-group>
                </el-col>
            </el-row>
            <el-row :gutter="16" class="mainArea">
                <el-col :span="21" :offset="3" style="margin-top:30px ">
                    注册有效期至:2023-7-22
                </el-col>
            </el-row>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="danger">取消</el-button>

                    <el-button type="primary">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue'

const radio = ref(3)
const dialogVisible = ref(false)
defineExpose({ //
    dialogVisible,
});
</script>
<style scoped>
.dialog-footer button:first-child {
    margin-right: 10px;
}

.outcontainer {
    left: 688px;
    top: 241px;
    width: 544px;
    height: 316px;
    opacity: 1;
    border-radius: 8px;
    background: rgba(255, 255, 255, 1);

    .mainArea {
        font-size: 16px;
        font-weight: 400;
        letter-spacing: 0px;
        line-height: 23.17px;
        color: rgba(0, 0, 0, 1);

    }
}
</style>