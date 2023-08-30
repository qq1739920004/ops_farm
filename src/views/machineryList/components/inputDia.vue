<!--  -->
<template>
    <div>
        <el-dialog @open="getInputList" style="border-radius: 8px;" v-model="dialogVisible" title="录入经销商设备" width="30%"
            center>
            <div class="content">
                <div class="up">
                    <span>经销商：</span>
                    <el-select v-model="selectValue" class="m-2" placeholder="请选择经销商">
                        <el-option v-for="item in carDealerList" :label="item.name" :value="item.name" :key="item.id"></el-option> 
                    </el-select>
                </div>
                <div class="down">
                    <div>文件：</div>
                    <el-input class="inputel" placeholder="请输入文件名">
                        <template #append>
                            <el-upload style="height:30px;width: 10px; margin-right: 3px;" ref="upload" class="upload-demo"
                                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :limit="1"
                                :auto-upload="false">
                                <template #trigger>
                                    <el-button link>浏览</el-button>
                                </template>
                            </el-upload>
                        </template>
                    </el-input>
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false" style="color:var(--el-color-primary)" link>下载模版</el-button>
                    <el-button type="primary"
                        style="background-color:var(--el-color-primary);color:'#fff'; width: 100px;height: 38px;margin-left:50px"
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
import { carDealer_API } from '@/api/machineryList/index'
import { carDealerResponseData, carDealerObj } from '@/api/machineryList/type'
const dialogVisible = ref<boolean>(false)
const carDealerList = ref<carDealerObj[]>([])
const selectValue = ref('')
defineExpose({
    dialogVisible
}
)
const getInputList = async () => {
    const res: carDealerResponseData = await carDealer_API()
    carDealerList.value = res.data
}
</script>

<style lang="scss" scoped>
.content {
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0px;
    line-height: 23.17px;
    color: rgba(0, 0, 0, 1);

    .up {
        align-items: center;
        justify-content: center;
        display: flex;
        margin-bottom: 20px;

        .m-2 {
            margin-left: 10px;
            width: 270px;
        }
    }

    .down {
        align-items: center;
        justify-content: center;
        display: flex;

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