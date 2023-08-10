<!--  -->
<template>
    <div>
        <el-dialog style="border-radius: 8px;" v-model="dialogVisible" title="注册设备" width="630px">
            <div class="content">
                <div class="up">
                    <span>注册设备SN号：</span>

                </div>
                <div class="down">
                    <div>注册时长：</div>
                    <el-radio-group v-model="radio" class="ml-4">
                        <el-radio :label="3" size="small">Option A</el-radio>
                        <el-radio :label="6" size="small">Option B</el-radio>
                        <el-radio :label="9" size="small">Option C</el-radio>
                        <el-radio :label="10" size="small">Option A</el-radio>
                        <el-radio :label="11" size="small">Option B</el-radio>
                        <el-radio :label="12" size="small">Option C</el-radio>
                        <el-radio :label="13" size="small">Option A</el-radio>
                        <el-radio :label="14" size="small">Option B</el-radio>
                        <el-radio :label="15" size="small">Option C</el-radio>
                    </el-radio-group>
                </div>
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
const radio = ref('3')

</script>

<style lang="scss" scoped>
.content {
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0px;
    line-height: 23.17px;
    color: rgba(0, 0, 0, 1);

    .ml-4 {
        display: flex;
        flex-wrap: wrap;

        .el-radio {

            width: 25%;
        }
    }

    ::v-deep(.ml-4 .el-radio__label:hover) {
        color: rgba(76, 176, 79, 1);

    }

    ::v-deep(.ml-4 .el-radio__input.is-checked+.el-radio__label) {
        color: rgba(76, 176, 79, 1);
    }

    ::v-deep(.ml-4 .el-radio__input.is-checked .el-radio__inner) {
        background: rgba(76, 176, 79, 1);
        border-color: rgba(76, 176, 79, 1);
    }

    ::v-deep(.ml-4 .el-radio__inner:hover) {
        border-color: rgba(76, 176, 79, 1);
    }

    .up {
        margin-left: 16px;
        margin-bottom: 20px;

    }

    .down {


        div {
            margin-left: 16px;
        }

        .inputel {
            margin-left: 10px;
            width: 270px;
        }

    }

}


.dialog-footer {
    display: flex;
    justify-content: center;
}
</style>