<template>
  <div>
    <div class="page7_child7_container">
      <pageHead title="productManage" :show-back="false" />
      <!-- 控制栏 -->
      <div class="control_bar">
        <div style="width:280px;">
          <el-input v-model="searchValue" size="small" clearable placeholder="请输入出厂编号" @clear="handleClear" @input="handleInput" @keyup.enter.native="handleSearch">
            <el-button slot="append" icon="el-icon-search" @click="handleSearch" />
          </el-input>
        </div>
        <div>
          <el-tooltip class="item" effect="dark" content="不勾选即默认导出所有数据" placement="top">
            <el-button type="primary" size="small" icon="el-icon-upload" @click="exportData">导出</el-button>
          </el-tooltip>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="dialogVisible= true">新建</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <div class="table_container">
        <el-table :data="tableData" style="width: 100%" @select="handleSelect" @select-all="handleSelectAll">
          <el-table-column
            type="selection"
            width="50"
          />
          <el-table-column
            type="index"
            label="序号"
            width="50"
          />
          <el-table-column
            prop="factoryNum"
            label="出厂编号"
            show-overflow-tooltip
            width=""
          />
          <el-table-column
            prop="model"
            label="型号"
            show-overflow-tooltip
            width=""
          />
          <el-table-column
            prop="ratedVoltage"
            label="额定电压"
          />
          <el-table-column
            prop="exeStandard"
            label="执行标准"
            show-overflow-tooltip
            width=""
          />
          <el-table-column
            prop="lineAccuracy"
            label="直线精度( ±cm )"
          />
          <el-table-column
            prop="produceNum"
            label="生产编号"
          />
          <el-table-column
            prop="produceTime"
            show-overflow-tooltip
            label="生产日期"
          />
          <el-table-column
            prop="ratedPower"
            label="额定功率"
          />
          <el-table-column
            label="操作"
            width="100"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleEdit(scope)">编辑</el-button>
              <el-button type="text" size="small" style="color:#F94A56;" @click="deleteData(scope)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="end">
          <el-pagination
            style="margin-top:50px;padding-bottom:50px;margin-right:10px;"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 30, 40, 50, 100, 200]"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          />
        </el-row>

        <!-- 新建弹框 -->
        <el-dialog :visible.sync="dialogVisible" title="新建" width="660px" @close="handleAddDialogClose">
          <el-form ref="form" :model="formData" label-width="120px" :rules="rules">
            <el-form-item label="型号" prop="model">
              <el-input v-model="formData.model" size="small" />
            </el-form-item>
            <el-form-item label="额定电压" prop="ratedVoltage">
              <el-input v-model="formData.ratedVoltage" size="small" />
            </el-form-item>
            <el-form-item label="生产编号" prop="produceNum">
              <el-input v-model="formData.produceNum" size="small">
                <!-- <el-button slot="prepend" icon="">AG360</el-button> -->
              </el-input>
            </el-form-item>
            <el-form-item label="执行标准" prop="exeStandard">
              <el-input v-model="formData.exeStandard" size="small" />
            </el-form-item>
            <el-form-item label="直线精度(±cm)" prop="lineAccuracy">
              <el-input v-model="formData.lineAccuracy" size="small">
                <el-button slot="append" icon="">cm</el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="公司地址" prop="companyAddress">
              <el-input v-model="formData.companyAddress" size="small" />
            </el-form-item>
            <el-form-item label="服务热线" prop="serviceTel">
              <el-input v-model="formData.serviceTel" size="small" />
            </el-form-item>
            <el-form-item label="出厂编号模板" prop="factoryNumTmpl">
              <el-input v-model="formData.factoryNumTmpl" size="small" />
            </el-form-item>
            <el-form-item label="出厂编号" prop="factoryNum">
              <el-input v-model="formData.factoryNum" size="small" />
            </el-form-item>
            <el-form-item label="生产日期" prop="produceTime">
              <el-date-picker v-model="formData.produceTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="额定功率" prop="ratedPower">
              <el-input v-model="formData.ratedPower" size="small" />
            </el-form-item>
          </el-form>
          <el-row>
            <el-col :span="6" :offset="6">
              <el-button type="" size="small" @click="dialogVisible = false">取消</el-button>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" size="small" @click="addData">确定</el-button>
            </el-col>
          </el-row>

        </el-dialog>
        <!-- 编辑 -->
        <el-dialog :visible.sync="dialogVisibleEdit" title="编辑" width="660px" @close="handleEditDialogClose">
          <el-form ref="formEdit" :model="formDataEdit" label-width="120px" :rules="rules">
            <el-form-item label="型号" prop="model">
              <el-input v-model="formDataEdit.model" size="small" />
            </el-form-item>
            <el-form-item label="额定电压" prop="ratedVoltage">
              <el-input v-model="formDataEdit.ratedVoltage" size="small" />
            </el-form-item>
            <el-form-item label="生产编号" prop="produceNum">
              <el-input v-model="formDataEdit.produceNum" size="small">
                <!-- <el-button slot="prepend" icon="">AG360</el-button> -->
              </el-input>
            </el-form-item>
            <el-form-item label="执行标准" prop="exeStandard">
              <el-input v-model="formDataEdit.exeStandard" size="small" />
            </el-form-item>
            <el-form-item label="直线精度(±cm)" prop="lineAccuracy">
              <el-input v-model="formDataEdit.lineAccuracy" size="small">
                <el-button slot="append" icon="">cm</el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="公司地址" prop="companyAddress">
              <el-input v-model="formDataEdit.companyAddress" size="small" />
            </el-form-item>
            <el-form-item label="服务热线" prop="serviceTel">
              <el-input v-model="formDataEdit.serviceTel" size="small" />
            </el-form-item>
            <el-form-item label="出厂编号" prop="factoryNum">
              <el-input v-model="formDataEdit.factoryNum" size="small" />
            </el-form-item>
            <el-form-item label="生产日期" prop="produceTime">
              <el-date-picker v-model="formDataEdit.produceTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="额定功率" prop="ratedPower">
              <el-input v-model="formDataEdit.ratedPower" size="small" />
            </el-form-item>
          </el-form>
          <el-row>
            <el-col :span="6" :offset="6">
              <el-button type="" size="small" @click="dialogVisibleEdit = false">取消</el-button>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" size="small" @click="updateData">确定</el-button>
            </el-col>
          </el-row>

        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { sacredCowQrList_path, sacredCowQrSave_path, sacredCowQrUpdate_path, sacredCowQrRemove_path, sacredCowQrExport_path } from '@/api/vehicleManage'
export default {
    data() {
        return {
            searchValue: '',
            currentPage: 1,
            pageSize: 10,
            total: 0,
            tableData: [],
            dialogVisible: false,
            dialogVisibleEdit: false,
            editId: null,
            exportIds: [],
            tableDataExample: [
                {
                    'id': 2,
                    'factoryNum': 'AG3601002', // 出厂编号
                    'produceNum': 'AG3601002', // 生产编号
                    'model': '-AG360BD-2.5GD-', // 型号
                    'ratedVoltage': 'DV12V', // 额定电压
                    'exeStandard': 'NY/T 3334-2018', // 执行标准
                    'lineAccuracy': '2.5', // 直线精度
                    'companyAddress': '上海市嘉定区马陆镇澄浏中路618号2幢3楼', // 公司地址
                    'serviceTel': '400-630-2933', // 服务热线
                    'produceTime': 1597463019000, // 生产日期
                    'ratedPower': '160W', // 额定功率
                    'createTime': 1597463028000,
                    'updateTime': 1597463028000,
                    'creatorId': 15
                }
            ],
            formDataInit: {
                factoryNum: '',
                produceNum: '',
                model: '-AG360BD-2.5GD-',
                ratedVoltage: 'DC12V',
                exeStandard: 'NY/T 3334-2018',
                lineAccuracy: '2.5',
                companyAddress: '上海市嘉定区马陆镇澄浏中路618号2幢3楼',
                serviceTel: '400-630-2933',
                produceTime: '',
                ratedPower: '160W',
                factoryNumTmpl: ''
            },
            formData: {},
            formDataEdit: {
                factoryNum: '',
                produceNum: '',
                model: '',
                ratedVoltage: '',
                exeStandard: '',
                lineAccuracy: '',
                companyAddress: '',
                serviceTel: '',
                produceTime: '',
                ratedPower: ''
            },
            rules: {
                factoryNum: [
                    {
                        required: true, message: '请输入出厂编号', trigger: 'blur'
                    }
                ],
                produceNum: [
                    {
                        required: true, message: '请输入生产编号', trigger: 'blur'
                    }
                ]
            }
        }
    },

    mounted() {
        this.getList();
        this.initFormData();
    },
    methods: {
        getList() {
            sacredCowQrList_path({
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                name: this.searchValue
            }).then(res => {
                try {
                    if (res.data.page.list) {
                        this.tableData = null;
                        // 格式化数据
                        res.data.page.list.forEach(element => {
                            element.produceTime = element.produceTime ? this.dateTimeTrans(element.produceTime) : '/';
                        });
                        this.tableData = res.data.page.list;
                        this.total = res.data.page.total
                    }
                } catch (error) {
                    console.log(error)
                }
            })
        },

        addData() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    sacredCowQrSave_path(this.formData).then(res => {
                        if (res.data.page === 1) {
                            this.$message.success('添加成功');
                            this.dialogVisible = false;
                            this.initFormData();
                            this.resetTableData();
                        } else {
                            res.data.page === 2 ? this.$message.error('新建失败，出厂编号已存在') : ''
                            res.data.page === 3 ? this.$message.error('新建失败，出厂编号格式错误') : ''
                        }
                    })
                } else {
                    this.$message.warning('请完善表单信息')
                    return false;
                }
            })
        },

        updateData() {
            this.$refs['formEdit'].validate(valid => {
                if (valid) {
                    sacredCowQrUpdate_path({
                        id: this.editId,
                        ...this.formDataEdit
                    }).then(res => {
                        if (res.data.page === 1) {
                            this.$message.success('更新成功');
                            this.dialogVisibleEdit = false;
                            this.resetTableData();
                        } else {
                            this.$message.error('更新失败，请稍后重试');
                        }
                    })
                } else {
                    this.$message.warning('请完善表单信息')
                    return false;
                }
            })
        },

        deleteData(scope) {
            let id = scope.row.id;
            this.$confirm('此操作将永久删除该产品信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                sacredCowQrRemove_path({ id: id }).then(res => {
                    if (res.data.page === 1) {
                        this.$message.success('删除成功');
                        this.resetTableData();
                    } else {
                        this.$message.error('删除失败，请稍后重试');
                    }
                })
            })
        },

        exportData_() {
            sacredCowQrExport_path({
                ids: this.exportIds
            }).then(res => {
                try {
                    const blob = new Blob([res.data], { type: 'application/zip' });
                    const filename = res.headers['content-disposition'];
                    const downloadElement = document.createElement('a');
                    const href = window.URL.createObjectURL(blob);
                    downloadElement.href = href;
                    [downloadElement.download] = [filename.split('=')[1]];
                    document.body.appendChild(downloadElement);
                    downloadElement.click(); // 点击下载
                    document.body.removeChild(downloadElement); // 下载完成移除元素
                    window.URL.revokeObjectURL(href); // 释放blob对象
                } catch (error) {
                    console.log(error)
                }
            })
        },

        exportData() {
            let form = document.createElement('form');
                form.setAttribute('style', 'display: none');
                form.setAttribute('method', 'post');
                form.setAttribute('action', '/farm/sacredCowQr/export');

            let input_st = document.createElement('input');
                input_st.setAttribute('name', 'ids');
                input_st.setAttribute('value', this.exportIds);

            form.appendChild(input_st);
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
        },

        handleCurrentChange(e) {
            this.currentPage = e;
            this.exportIds = [];
            this.getList();
        },

        handleSizeChange(e) {
            this.pageSize = e;
            this.getList();
        },

        handleEdit(scope) {
            this.dialogVisibleEdit = true;
            this.editId = scope.row.id;
            for (let i in this.formDataEdit) {
                for (let j in scope.row) {
                    if (i === j) {
                        this.formDataEdit[i] = scope.row[j];
                    }
                }
            }
        },

        handleEditDialogClose() {
            this.$refs['formEdit'].clearValidate();
        },

        handleAddDialogClose() {
            this.$refs['form'].clearValidate();
        },

        handleSelect(selection) {
            try {
                this.exportIds = selection.map(item => item.id);
            } catch (error) {
                console.log(error)
            }
        },

        handleSelectAll(selection) {
            try {
                this.exportIds = selection.map(item => item.id);
            } catch (error) {
                console.log(error)
            }
        },

        handleSearch() {
            this.getList();
        },

        handleClear() {
            this.resetTableData();
        },

        handleInput(value) {
            if (value.length === 0) {
                this.resetTableData();
            }
        },

        // 初始化表单数据
        initFormData() {
            this.formData = JSON.parse(JSON.stringify(this.formDataInit));
        },

        resetTableData() {
            this.currentPage = 1;
            this.getList();
        }
    }
}
</script>
<style scoped lang='scss'>
.page7_child7_container {
    .control_bar {
        padding: 7px 10px;
        display: flex;
        justify-content: space-between;
    }
    .cell {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .el-form-item {
        // margin-bottom: 15px;
    }
}
</style>
