<!--  -->
<template>
    <div class="outsider">
        <el-dialog style="border-radius: 8px;" v-model="dialogVisible" title="远程管理" width="1112px" height="496px" center>
            <div class="top">
                <span>车辆名称：</span>
                <span>车辆类型：{{ props.terminalType }}</span>302
            </div>
            <div class="menuArea">
                <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
                    active-text-color="rgba(76, 176, 79, 1)" active-background-color="rgba(76, 176, 79, 1)">
                    <el-menu-item index="1">车辆参数</el-menu-item>
                    <el-menu-item index="2">校准参数</el-menu-item>
                    <el-menu-item index="3" v-if="carKind != 'AG502'">PID参数</el-menu-item>
                    <el-menu-item index="9" v-if="carKind == 'AG302'">PID曲线参数</el-menu-item>
                    <el-menu-item index="10" v-if="carKind == 'AG302'">PID超低速参数</el-menu-item>
                    <el-menu-item index="4" v-if="carKind == 'AG502'">基本参数</el-menu-item>
                    <el-menu-item index="8" v-if="carKind == 'AG502'">高级参数1</el-menu-item>
                    <el-menu-item index="5">差分设置</el-menu-item>
                    <el-menu-item index="6">在线升级</el-menu-item>
                    <el-menu-item index="7">日志回传</el-menu-item>
                </el-menu>

            </div>
            <div class="mainContent">
                <el-form v-show="activeIndex == '1'" :rules="rules" :inline="true" :label-position="labelPosition"
                    label-width="160px" :model="formLabelAlign" style="max-width: 1012px;margin-bottom:20px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item class="item" label="天线前后偏移：" prop="name">
                                <el-input style=" width: 280px;
                    height: 32px;" v-model="formLabelAlign.name" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="拖拉机轴距：" class="item">
                                <el-input style=" width: 280px;
                    height: 32px;" v-model="formLabelAlign.name" />
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item class="item" label="前轮间距：">
                                <el-input style=" width: 280px;
                    height: 32px;" v-model="formLabelAlign.name" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item class="item" label="农具左右偏移：">
                                <el-input style=" width: 280px;
                    height: 32px;" v-model="formLabelAlign.name" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item class="item" label="农具距离后轴距离：">
                                <el-input style=" width: 280px;
                    height: 32px;" v-model="formLabelAlign.name" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item class="item" label="农具宽度：">
                                <el-input style=" width: 280px;
                    height: 32px;" v-model="formLabelAlign.name" />
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item class="item" label="前轮陀螺：">
                                <el-input style=" width: 280px;
                    height: 32px;" v-model="formLabelAlign.name" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item class="item" label="速度模式：">
                                <el-input style=" width: 280px;
                    height: 32px;" v-model="formLabelAlign.name" />
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <div class="buttonarea">
                        <el-button style="margin-right: 100px;" class="btn1" type="danger">取消</el-button>
                        <el-button class="btn2" type="success">确定</el-button>
                    </div>
                </el-form>
                <el-form v-show="activeIndex == '2'" :rules="rules" :inline="true" :label-position="labelPosition"
                    label-width="160px" :model="formLabelAlign" style="max-width: 1012px;margin-bottom:20px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item class="item" label="天线前后偏移：" prop="name">
                                <el-input style=" width: 280px;
                height: 32px;" v-model="formLabelAlign.name" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="拖拉机轴距：" class="item">
                                <el-input style=" width: 280px;
                height: 32px;" v-model="formLabelAlign.name" />
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item class="item" label="前轮间距：">
                                <el-input style=" width: 280px;
                height: 32px;" v-model="formLabelAlign.name" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item class="item" label="农具左右偏移：">
                                <el-input style=" width: 280px;
                height: 32px;" v-model="formLabelAlign.name" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <div class="buttonarea">
                        <el-button class="btn2" type="success" style="">确定</el-button>
                    </div>
                </el-form>
                <el-form v-show="activeIndex == '5'" :rules="rules" :inline="true" :label-position="labelPosition"
                    label-width="160px" :model="formLabelAlign" style="max-width: 1012px;margin-bottom:20px">
                    <el-row style="margin-bottom: 10px;">
                        <el-col :span="12" :offset="6">
                            <el-form-item class="item" label="工作模式：" prop="name">
                                <el-select style=" width: 280px;
                height: 32px;" v-model="formLabelAlign.type">
                                    <el-option value="1" label="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row style="margin-bottom: 10px;">
                        <el-col :span="12" :offset="6">
                            <el-form-item class="item" label="天线前后偏移：" prop="name">
                                <el-input style=" width: 280px;
                height: 32px;" v-model="formLabelAlign.name" />
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row style="margin-bottom: 10px;">
                        <el-col :span="12" :offset="6">
                            <el-form-item class="item" label="天线前后偏移：" prop="name">
                                <el-input style=" width: 280px;
                height: 32px;" v-model="formLabelAlign.name" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row style="margin-bottom: 10px;">
                        <el-col :span="12" :offset="6">
                            <el-form-item class="item" label="源节点：" prop="name">
                                <el-select style=" width: 280px;
                height: 32px;" v-model="formLabelAlign.type">
                                    <el-option value="1" label="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row style="margin-bottom: 10px;">
                        <el-col :span="12" :offset="6">
                            <el-form-item class="item" label="天线前后偏移：" prop="name">
                                <el-input style=" width: 280px;
                height: 32px;" v-model="formLabelAlign.name" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row style="margin-bottom: 10px;">
                        <el-col :span="12" :offset="6">
                            <el-form-item class="item" label="密码：" prop="name">
                                <el-input type="password" show-password style=" width: 280px;
                height: 32px;" v-model="formLabelAlign.name" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <div class="buttonarea">
                        <el-button class="btn3" style="">获取源节点</el-button>
                        <el-button class="btn2" type="success" style="">设置</el-button>
                    </div>
                </el-form>
                <el-form v-show="activeIndex == '6'" :rules="rules" :inline="true" :label-position="labelPosition"
                    label-width="160px" :model="formLabelAlign" style="max-width: 1012px;margin-bottom:20px">
                    <div class="mktitle">
                        双天线一体机
                    </div>

                    <el-row style="margin-top:40px ;">
                        <el-col :span="12" :offset="6">
                            <el-form-item class="item" label="模块选择：" prop="name">
                                <el-radio-group text-color="rgba(76, 176, 79, 1)" style="transform: translateY(-5px);"
                                    v-model="formLabelAlign.radio1" class="ml-4">
                                    <el-radio label="1" size="large" style="margin-right: 130px;">Option 1</el-radio>
                                    <el-radio label="2" size="large">Option 2</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row>
                        <el-col :span="12" :offset="6">
                            <el-form-item class="item" label="模块选择：" prop="name">
                                <el-radio-group text-color="rgba(76, 176, 79, 1)" style="transform: translateY(-5px);"
                                    v-model="formLabelAlign.radio1" class="ml-4">
                                    <el-radio label="1" size="large" style="margin-right: 130px;">Option 1</el-radio>
                                    <el-radio label="2" size="large">Option 2</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>

                    </el-row>

                    <el-row style="margin-bottom: 20px;">
                        <el-col :span="12" :offset="6">
                            <el-form-item class="item" label="版本选择：" prop="name">
                                <el-select style=" width: 280px;
                height: 32px;" v-model="formLabelAlign.type">
                                    <el-option value="1" label="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <div class="buttonarea">
                        <el-button class="btn4" type="danger">强制升级</el-button>
                    </div>
                </el-form>
                <el-form v-show="activeIndex == '7'" :rules="rules" :inline="true" :label-position="labelPosition"
                    label-width="160px" :model="formLabelAlign" style="max-width: 1012px;margin-bottom:20px">

                    <el-row>
                        <el-col align="center">
                            <el-form-item class="item" label="时间范围:&nbsp&nbsp" label-width="140px">
                                <el-date-picker style="width: 348px;
                                height: 38px;" v-model="dateValue" type="daterange" range-separator="-"
                                    @change="changeDate" :disabled-date="disabledDate" start-placeholder="Start date"
                                    end-placeholder="End date" size="large" />
                            </el-form-item>
                        </el-col>

                    </el-row>


                    <div class="buttonarea">
                        <el-button class="btn2" type="success">回传</el-button>
                    </div>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
const dialogVisible = ref<boolean>(false)
const activeIndex = ref('1')
const labelPosition = ref('right')
const carKind = ref<string>('AG360')
const props = defineProps(['terminalType'])
const formLabelAlign = reactive({
    name: '',
    region: '',
    type: '',
    radio1: '1'
})
const dateValue = ref<Date[]>([new Date(), new Date()])
const changeDate = () => {
    console.log(dateValue.value);

}
defineExpose({
    dialogVisible
}
)
const handleSelect = (key: string) => {
    activeIndex.value = key
}
const rules = {
    name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }, { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }],

}
const disabledDate = (time: Date) => {
    return time.getTime() > Date.now()
}
</script>

<style lang="scss" scoped>
.outsider {
    width: 1012px;
    height: 496px;

    .top {
        position: absolute;
        top: 61px;
        left: 20px;

        span {
            font-size: 14px;
            font-weight: 400;
            letter-spacing: 0px;
            line-height: 20.27px;
            color: rgba(0, 0, 0, 1);
        }
    }

    .menuArea {
        .el-menu-demo {
            display: flex;
            justify-content: space-around;
        }

        .el-menu-item {
            margin: 10px 12px 0 12px;
            font-size: 16px;
            font-weight: 400;
            letter-spacing: 0px;
            line-height: 23.17px;
            color: rgba(70, 75, 84, 1);


        }

        .el-menu-item:focus,
        .el-menu-item:hover {
            outline: 0;
            background-color: #0263a3;
            color: rgba(70, 75, 84, 1);
            background-color: #fff;
        }
    }

    .mainContent {
        margin-top: 40px;
        width: 100%;
        height: 260px;
        overflow-y: scroll;
        position: relative;

        .mktitle {
            position: absolute;
            top: 0px;
            left: 417px;
            width: 96px;
            height: 24px;
            opacity: 1;
            /** 文本1 */
            font-size: 16px;
            font-weight: 400;
            letter-spacing: 0px;
            line-height: 23.17px;
            color: rgba(0, 0, 0, 1);
        }

        ::v-deep(.item .el-form-item__label) {
            font-size: 16px;
            font-weight: 400;
            letter-spacing: 0px;
            line-height: 23.17px;
            color: rgba(0, 0, 0, 1);
            display: block;
            height: 32px;
            line-height: 16px;
            display: flex;
            align-items: center;
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



        .buttonarea {
            width: 100%;
            text-align: center;
            margin-top: 20px;

            .btn1 {
                width: 100px;
                height: 38px;
                opacity: 1;
                border-radius: 4px;
                background: rgba(255, 93, 56, 1);
            }

            .btn2 {
                width: 100px;
                height: 38px;
                opacity: 1;
                border-radius: 4px;
                background: rgba(76, 176, 79, 1)
            }

            .btn3 {
                width: 112px;
                height: 40px;
            }

            .btn4 {
                width: 144px;
                height: 38px;
                opacity: 1;
                border-radius: 4px;
                background: rgba(255, 93, 56, 1);
            }
        }


    }
}
</style>