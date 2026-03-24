<template>
    <div class="outcontainer">
        <el-dialog style="border-radius: 8px;" v-model="dialogVisible" width="30%" title="注册设备" center>
            <el-row :gutter="16" class="mainArea">
                <el-col :span="21" :offset="3" style="margin-bottom:20px ">
                    出厂编号号:13333333333333
                </el-col>
            </el-row>
            <el-row :gutter="16" class="mainArea">
                <el-col :span="6" :offset="3" align="end" style="margin-right: -15px; ">
                    注册时长：
                </el-col>
                <el-col :span="11">
                    <el-radio-group class="mainArea" v-model="radio">
                        <el-radio :label="3" class="mainArea">{{ $t('devicelist.expiredNow') }}</el-radio>
                        <el-radio :label="6" class="mainArea">{{ $t('devicelist.oneYear') }}</el-radio>
                        <el-radio :label="9" class="mainArea">{{ $t('devicelist.permanent') }}</el-radio>
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
                    <el-button type="primary">
                        {{ $t('work.submit') }}
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


    .mainArea {
        font-size: 16px;
        font-weight: 400;
        letter-spacing: 0px;
        line-height: 23.17px;
        

    }
}
</style>