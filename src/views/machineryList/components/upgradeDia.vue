<!--  -->
<template>
    <el-dialog @open="getInputList" @close="closeList" style="border-radius: 8px;" v-model="dialogVisible"
        :title="$t('devicelist.upgrade')" width="40%" center>
        <div class="content" v-show="isUpgrade === false">

            <div class="topLine">
                <div>
                    {{ $t('work.vehicleType') }}:AG502
                </div>
                <div class="search_area">
                    {{ $t('work.softwareVersion') }}：
                    <el-select filterable  v-model="softVersion" style="width:200px" placeholder="Select" @change="getSnList">
                        <el-option v-for="(item, index) in softList" :key="index" :label="item" :value="item"
                            size="small" />
                    </el-select>
                </div>
                <div class="btn_area">
                    <el-button type="primary" @click="toggleSelection(tableData)" v-show="!allSelected"
                        style="margin-left: 10px;">
                        {{ $t('work.selectAll') }}
                    </el-button>
                    <el-button type="danger" @click="clearSelection()" v-show="allSelected">
                        {{ $t('work.cancelSelectAll') }}
                    </el-button>
                </div>
            </div>
            <el-table id="t1" ref="multipleTableRef" :data="tableData" style="width: 100%" @select="handleSelect">
                <el-table-column type="selection" width="60" />
                <el-table-column :label="t('work.item')" type="index" width="220" />
                <el-table-column label="SN">
                    <template #default="scope">{{ scope.row }}</template>
                </el-table-column>

            </el-table>
        </div>
        <template #footer>
            <div v-show="isUpgrade === false">
                <el-button v-auth="787" type="danger" @click="gotoUpgrade()"
                    :disabled="exportIds.length > 0 || allSelected ? false : true">
                    {{ $t('devicelist.upgrade') }}
                </el-button>
                <span class="dialog-footer">
                    <Pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @pageChange="currentChange">
                    </Pagination>
                </span>
            </div>
        </template>
        <div v-show="isUpgrade === true" class="upgrade_area">
            <div class="goBack_area" @click="goBack"> <el-icon>
                    <Back />
                </el-icon>
                <div style="margin-left: 15px;">
                    {{ $t('work.goBack') }}
                </div>
            </div>
            <el-form ref="formLabelAlignRef" :validate-on-rule-change="false" :inline="true" label-position="right"
                label-width="180px" style="max-width: 1012px;margin-bottom:20px">
                <!-- <div class="mktitle">
                    {{$t('work.dualAntennaOneMachine')}}
                </div> -->
                <el-row>
                    <el-col :span="14" :offset="3">
                        <el-form-item class="item" :label="$t('work.versionType')" prop="name" style="margin-top: 20px;">
                            <el-radio-group @change="changeRadio" text-color="var(--el-color-primary)"
                                style="transform: translateY(-5px);" v-model="radio" class="ml-4">
                                <el-radio label="1" size="large" style="margin-right: 30px;">{{ $t('work.officialVersion')
                                }}</el-radio>
                                <el-radio label="2" size="large" style="margin-right: 30px;">{{ $t('work.betaVersion')
                                }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row style="margin-bottom: 20px;">
                    <el-col :span="10" :offset="3">
                        <el-form-item class="item" :label="$t('work.versionSelection') + '：'" prop="name">
                            <el-select v-if="productList.length >= 1" style=" width: 187px;
                height: 32px;" v-model="filename">
                                <el-option v-for="(item, index) in productList" :key="index" :value="index"
                                    :label="item.filename"></el-option>
                            </el-select>
                            <div v-else style=" width: 187px;height: 32px;">
                                {{ $t('work.noFirmwarePackageForDevice') }}
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>

                <div class="buttonarea">
                    <el-button type="danger" :disabled="productList.length >= 1 ? false : true" @click="upgradeByList">{{
                        $t('work.forceUpgrade') }}</el-button>
                </div>
            </el-form>
        </div>

    </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Pagination from "@/components/Pagination/index.vue";
import { GetcarProductpackageResponseData } from '@/api/machineryList/remoteAdjust/type'
import { GetcarProductpackage_API } from '@/api/machineryList/remoteAdjust/index'
import { getsoftList_API, getTypeSnList_API, upgradeList_API } from '@/api/machineryList/index'
import { ElMessage } from 'element-plus'
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const multipleTableRef = ref()
const tableData = ref([])
const dialogVisible = ref<boolean>(false)
const exportIds = ref([])
const softVersion = ref()
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const allSelected = ref(false)
const isUpgrade = ref(false)
const isall = ref(0)
const handleSelect = (selection: any) => {
    try {
        allSelected.value = false

        isall.value = 0
        exportIds.value = selection.map((item: any) => item);
    } catch (error) {
        console.log(error);
    }
    console.log(exportIds.value)
}

const currentChange = (val: any) => {
    currentPage.value = val.currentPage;
    pageSize.value = val.pageSize;
    getSnList()
};
const softList = ref([])
const getsoftList = () => {
    getsoftList_API().then((res: any) => {
        softList.value = res.data
        softVersion.value = res.data[0]
        getSnList()
    })
}
const getSnList = () => {
    getTypeSnList_API({
        "softVersion": softVersion.value,
        "pageSize": 10,
        "currentPage": 1,
        "terminalType": 'AG502'
    }).then((res: any) => {
        console.log(res)
        tableData.value = res.data.records
        total.value = res.data.total
    })
}
const gotoUpgrade = () => {
    isUpgrade.value = true
    getProductList()

}
const closeList = () => {
    exportIds.value = []
    isUpgrade.value = false
    isall.value = 0
    allSelected.value = false
}
const getInputList = () => {
    getsoftList()
}
const goBack = () => {
    isUpgrade.value = false
}
const productList = ref<any>([])
const radio = ref('1')
const filename = ref(0)
const getProductList = async () => {

    GetcarProductpackage_API({ 'pid': '9023', 'versionType': radio.value }).then((res: GetcarProductpackageResponseData) => {
        productList.value = res.data

    }).catch(() => {
        productList.value = []
    })
}
const changeRadio = () => {
    getProductList()

}
const toggleSelection = (rows?: any) => {
    clearSelection()
    if (rows) {
        rows.forEach((row: any) => {
            allSelected.value = true
            isall.value = 1
            multipleTableRef.value!.toggleRowSelection(row)
        })
    } else {
        multipleTableRef.value!.clearSelection()
        allSelected.value = false
        isall.value = 0
    }

}
const clearSelection = () => {
    exportIds.value = []
    multipleTableRef.value!.clearSelection()
    allSelected.value = false
    isall.value = 0
}
// 在线升级
const upgradeByList = async () => {
    await upgradeList_API({
        "installPackageId": productList.value[filename.value].id,
        "isALL": isall.value,
        "softVersion": radio.value,
        "terminalType": "AG502",
        "snList": exportIds.value || null,
        "updateModel": "9",
        "upgradeWay": 1
    })
    ElMessage({ type: 'success', message: t('work.modificationSuccess') })
}
defineExpose({
    dialogVisible
}
)







</script>

<style lang="scss" scoped>
/*取消表头勾选框的显示*/
.upgrade_area {
    width: 100%;


    .goBack_area {
        position: absolute;
        left: 45px;
        top: 40px;
        display: flex;
        align-items: center;


    }

    .buttonarea {
        display: flex;
        justify-content: center;
    }
}

.icon_area {
    position: absolute;
    left: 10px;

}

:deep(.el-table__header-wrapper) {
    .el-checkbox {
        display: none;
    }
}

.topLine {
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 400;

    .search_area {
        margin: 0 40px;
        display: flex;
        align-items: center;
    }


}

.content {
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0px;
    line-height: 23.17px;


    :deep(.el-form-item__label) {
        font-size: 16px;
        font-weight: 400;
        letter-spacing: 0px;

    }



}

.dialog-footer {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>