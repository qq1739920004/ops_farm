<!--  -->
<template>
    <div class='app_container'>
        <div class="search_container app_card">
            <div class="input_area">
                <el-input placeholder="请输入出厂编号" class="input-with-select" v-model="searchValue" @keyup.enter.native="search"
                    clearable @clear="search">
                    <template #append>
                        <el-button icon="Search" @click="search" />
                    </template>
                </el-input>

            </div>
            <div>
                <el-button @click="exportData" type="primary">
                    <el-icon class="el-icon--left">
                        <SvgIcon icon="export" size="16" />
                    </el-icon>导出</el-button>
                <el-button v-auth="448" type="primary" icon="Plus" @click="openDialog">新建</el-button>
            </div>
        </div>
        <div class="table_container app_card">
            <!-- @select="handleSelect" @select-all="handleSelectAll" -->
            <el-table :data="tableData" style="width: 100%" @select="handleSelect" @select-all="handleSelectAll">
                <el-table-column type="selection" width="60" align="center" />
                <el-table-column type="index" label="序号" width="80" align="center" />
                <el-table-column prop="factoryNum" label="出厂编号" show-overflow-tooltip width="" align="center" />
                <el-table-column prop="model" label="型号" show-overflow-tooltip width="" align="center" />
                <el-table-column prop="ratedVoltage" label="额定电压" align="center" />
                <el-table-column prop="exeStandard" label="执行标准" show-overflow-tooltip width="" align="center" />
                <el-table-column prop="lineAccuracy" label="直线精度( ±cm )" align="center" />
                <el-table-column prop="produceNum" label="生产编号" align="center" />
                <el-table-column prop="produceTime" show-overflow-tooltip label="生产日期" align="center" />
                <el-table-column prop="ratedPower" label="额定功率" align="center" />
                <el-table-column label="操作" align="center" width="160">
                    <template template #="{ row }" >
                        <el-button type="primary" text @click="handleEdit(row)">编辑</el-button>
                        <el-button text style="color: #f94a56" @click="deleteData(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog v-model="dialogVisible" :title="formData.id ? '编辑' : '新建'" width="660px"
                @close="handleAddDialogClose">
                <el-form ref="formRef" :model="formData" label-width="120px" :rules="rules">
                    <el-form-item label="型号" prop="model">
                        <el-input v-model="formData.model" />
                    </el-form-item>
                    <el-form-item label="额定电压" prop="ratedVoltage">
                        <el-input v-model="formData.ratedVoltage" />
                    </el-form-item>
                    <el-form-item label="生产编号" prop="produceNum">
                        <el-input v-model="formData.produceNum">
                            <!-- <el-button slot="prepend" icon="">AG360</el-button> -->
                        </el-input>
                    </el-form-item>
                    <el-form-item label="执行标准" prop="exeStandard">
                        <el-input v-model="formData.exeStandard" />
                    </el-form-item>
                    <el-form-item label="直线精度(±cm)" prop="lineAccuracy">
                        <el-input v-model="formData.lineAccuracy">
                            <el-button slot="append" icon="">cm</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="公司地址" prop="companyAddress">
                        <el-input v-model="formData.companyAddress" />
                    </el-form-item>
                    <el-form-item label="服务热线" prop="serviceTel">
                        <el-input v-model="formData.serviceTel" />
                    </el-form-item>
                    <el-form-item label="出厂编号模板" prop="factoryNumTmpl">
                        <el-input v-model="formData.factoryNumTmpl" />
                    </el-form-item>
                    <el-form-item label="出厂编号" prop="factoryNum">
                        <el-input v-model="formData.factoryNum" />
                    </el-form-item>
                    <el-form-item label="生产日期" prop="produceTime">
                        <el-date-picker v-model="formData.produceTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
                            placeholder="选择日期" style="width: 100%" />
                    </el-form-item>
                    <el-form-item label="额定功率" prop="ratedPower">
                        <el-input v-model="formData.ratedPower" />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
                        <el-button type="primary" v-if="!formData.id" @click="addData">确定</el-button>
                        <el-button type="primary" v-else @click="editData">确定</el-button>
                    </span>
                </template>
            </el-dialog>
            <Pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @pageChange="currentChange">
            </Pagination>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import Pagination from '@/components/Pagination/index.vue'
import SvgIcon from "@/components/SvgIcon/index.vue";
import { sacredCowQrList_path, sacredCowQrSave_path, sacredCowQrUpdate_path, sacredCowQrRemove_path, sacredCowQrExport_path } from '@/api/codeManagement/index'
import { ElMessage, ElMessageBox } from 'element-plus'
const tableData = ref<any>([])
const searchValue = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const exportIds = ref([])
let formData = ref<any>({})
const formRef = ref()
const dialogVisible = ref<boolean>(false)
const currentChange = (val: any) => {
    currentPage.value = val.currentPage
    pageSize.value = val.pageSize
    getList()
}
const search = () => {
    // 3101200131
    getList()
}
// 格式化时间
function dateTimeTrans(timestamp: any) {
    try {
        if (!timestamp) return '/'
        let dateObj = timestamp ? new Date(timestamp) : new Date();
        let dateString = dateObj.toLocaleDateString().split('/').map(i => i.padStart(2, '0')).join('-');
        let timeString = dateObj.toTimeString().slice(0, 8);
        return dateString + ' ' + timeString;
    } catch (error) {
        console.log(error);
        return '/';
    }
}
// 获取list数据
const getList = async () => {
    try {
        const res = await sacredCowQrList_path({
            currentPage: currentPage.value,
            pageSize: pageSize.value,
            name: searchValue.value,
        })

        if (res.page.list) {
            tableData.value = null
            res.page.list.forEach((element: any) => {
                element.produceTime = element.produceTime
                    ? dateTimeTrans(element.produceTime)
                    : "/";
            })
            tableData.value = res.page.list
            total.value = res.page.total
        }

    } catch (error) {
        console.log(error);

    }

}
getList()
const handleEdit = (val: any) => {

    formData.value = val
    dialogVisible.value = true
    nextTick(() => {
        formRef.value.clearValidate()
    })
}
const deleteData = (val: any) => {
    ElMessageBox.confirm(
        '此操作将永久删除该产品信息, 是否继续?',
        'Warning',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        sacredCowQrRemove_path({ id: val.id }).then((res) => {
            if (res.page === 1) {
                ElMessage({ type: 'success', message: '删除成功' })
                searchValue.value = ''
                currentPage.value = 1
                pageSize.value = 10
                getList()
            } else {
                ElMessage({ type: 'error', message: '删除失败' })
            }
        });
    })

}
const rules = {
    model: [{ required: true, message: '请输入型号', trigger: 'blur' },],
    ratedVoltage: [{ required: true, message: '请输入额定电压', trigger: 'blur' },],
    produceNum: [{ required: true, message: '请输入生产编号', trigger: 'blur' }],
    exeStandard: [{ required: true, message: '请输入执行标准', trigger: 'blur' }],
    lineAccuracy: [{ required: true, message: '请输入直线精度', trigger: 'blur' }],
    companyAddress: [{ required: true, message: '请输入公司地址', trigger: 'blur' },],
    serviceTel: [{ required: true, message: '请输入服务热线', trigger: 'blur' },],
    factoryNumTmpl: [{ required: true, message: '请输入出厂编号模板', trigger: 'blur' }],
    factoryNum: [{ required: true, message: '请输入出厂编号', trigger: 'blur' }],
    produceTime: [{ required: true, message: '请选择日期', trigger: 'blur' }],
    ratedPower: [{ required: true, message: '请输入额定功率', trigger: 'blur' }]
}
// 关闭弹窗
const handleAddDialogClose = () => {
  formData.value = {}
  
}
// 新增数据
const addData = async () => {
    await formRef.value.validate()
    ElMessageBox.confirm(
        '确定新增？',
        'Warning',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        try {
            sacredCowQrSave_path(formData.value).then((res) => {
                if (res.page === 1) {
                    ElMessage({ type: 'success', message: '新增成功' })
                    dialogVisible.value = false;
                } else {
                    res.page === 2
                        ? ElMessage({ type: 'error', message: '新建失败，出厂编号已存在' })
                        : "";
                    res.page === 3
                        ? ElMessage({ type: 'error', message: '新建失败，出厂编号格式错误' })
                        : "";
                }
            })

        } catch {

        }
    })


}
// 编辑数据
const editData = async () => {
    await formRef.value.validate()
    ElMessageBox.confirm(
        '确定修改？',
        'Warning',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        try {
            sacredCowQrUpdate_path(formData.value).then((res) => {
                if (res.page === 1) {
                    ElMessage({ type: 'success', message: '修改成功' })
                    dialogVisible.value = false;
                } else {
                    ElMessage({ type: 'error', message: '修改失败' })
                }
            })


        } catch {

        }
    })
}
// 点击新建
const openDialog = () => {
    dialogVisible.value = true
 
    nextTick(() => {
        formRef.value.clearValidate()
    })

}

const handleSelect = (selection: any) => {
    try {
        exportIds.value = selection.map((item: any) => item.id);
    } catch (error) {
        console.log(error);
    }

}

const handleSelectAll = (selection: any) => {
    try {
        exportIds.value = selection.map((item: any) => item.id);
    } catch (error) {
        console.log(error);
    }
}
// 导出文件
const exportData = () => {
    sacredCowQrExport_path({
        ids: exportIds.value,
    }).then((res: any) => {
        let name = '二维码管理.xls';
        const type = 'application/vnd.ms-excel;charset=utf-8'; //excel文件
        let u = window.URL.createObjectURL(new Blob([res], { type: type }));
        let a = document.createElement('a');
        a.download = name;
        a.href = u;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
    });
}
</script>

<style lang="scss" scoped>
.dialog-footer {
    display: flex;
    justify-content: space-around;
}

.search_container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    .input_area {
        display: flex;
        align-items: center;

        .input-with-select {
            margin-right: 20px;
            width: 240px;
            height: 32px;
            opacity: 1;
            border-radius: 2px;
        }

        .kind {
            width: 70px;
            height: 21px;
            opacity: 1;
            /** 文本1 */
            font-size: 14px;
            font-weight: 400;
            letter-spacing: 0px;
            line-height: 20.27px;
        }


    }


}
</style>