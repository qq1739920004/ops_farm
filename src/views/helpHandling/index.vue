<template>
    <div class='app_container'>
        <!-- 搜索 -->
        <div class="search_container app_card">
            <div>
                <el-input placeholder=请输入SN、电话 v-model=helpHandling.key>
                    <template #append>
                        <el-button icon=Search @click=search() />
                    </template>
                </el-input>
            </div>
            <div class="state">
                <span>状态：</span>
                <el-select v-model=helpHandling.status placeholder="请选择" @change="chooseStatus">
                    <el-option value=0 label="待处理" />
                    <el-option value=1 label="已处理" />
                </el-select>
            </div>
            <div class="tag">
                <el-tag type="danger" class="el_tag_uncount">
                    <el-icon :size="20">
                        <Edit />
                    </el-icon>
                    待处理{{ helpHandlingUncount }}
                </el-tag>
            </div>
        </div>

        <!-- 表格 -->
        <div class="table_container app_card">
            <el-table type=index @sort-change="changeTableSort" :data=helpList stripe>
                <el-table-column label=序号 type=index align="center" width="60px"/>
                <el-table-column label=SN prop=sn align="center"/>
                <el-table-column label=状态 prop=status align="center">
                    <template #default=scope>
                        <el-tag>
                            {{ scope.row["state"] == 1 ? "已处理" : "待处理" }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column label=求助时间 prop=helpTime :sortable="'custom'"  align="center">
                </el-table-column>


                <el-table-column label=处理时间 prop=handleTime sortable align="center"/>
                <el-table-column label=历时 prop=consumeTime align="center"/>
                <el-table-column label=处理人 prop=handlerName align="center"/>
                <el-table-column label=管理员 prop=managerName align="center"/>
                <el-table-column label=指派时间 prop=assignTime align="center"/>
                <el-table-column label=备注 prop=info />
                <el-table-column label=操作 prop=status align="center">
                    <template #default="scope">
                        <el-button size="small" text type="success" @click="handleEdit(scope.row)">处理</el-button>

                    </template>
                </el-table-column>
            </el-table>
            <Pagination :total=total :currentPage=helpHandling.currentPage :pageSize=helpHandling.pageSize
                @pageChange=currentChange>
            </Pagination>
        </div>



    </div>
</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue'
import Pagination from '@/components/Pagination/index.vue'
import { getHelpHandlingAPI, getHelpHandlingUncountAPI } from '@/api/helpHanding/index'
import type { RecordsObj, HelpHandlingObj, HelpHandlingResponseData, HelpHandlingUncountData } from '@/api/helpHanding/type'
import { useRouter } from 'vue-router'

const helpList = ref<RecordsObj[]>([])
const total = ref<number>(10)
const helpHandlingUncount = ref<HelpHandlingUncountData>()
const helpHandling = reactive<HelpHandlingObj>({
    key: "",
    status: null,
    currentPage: 1,
    pageSize: 10,
    helpTimeOrder: 0,
    handleTimeOrder: 0,
    assignTimeOrder: 0
})


const changeTableSort = (column: any) => {

    if (column.prop === 'helpTime') {
        if (column.order === 'ascending') {
            helpHandling.helpTimeOrder = 2
            getHelpHandling()
            console.log('helpTime升序')
        } else if (column.order === 'descending') {
            helpHandling.helpTimeOrder = 1
            getHelpHandling()
            console.log('helpTime降序')
        }

    } else if (column.prop === 'handleTime') {
        if (column.order === 'ascending') {
            helpHandling.handleTimeOrder = 2
            getHelpHandling()
            console.log('handletime升序')
        } else if (column.order === 'descending') {
            helpHandling.handleTimeOrder = 1
            getHelpHandling()
            console.log('handletime降序')
        }

    } else {

    }
}

const getHelpHandling = async () => {
    const res: HelpHandlingResponseData = await getHelpHandlingAPI(helpHandling)
    helpList.value = res.data.records
    total.value = res.data.total

    for (var item in helpList.value) {
        const s = tsToStr(helpList.value[item].consumeTime)
        helpList.value[item].consumeTime = s
    }
}

const getHelpHandlingUncount = async () => {
    const res = await getHelpHandlingUncountAPI()
    helpHandlingUncount.value = res.data
}

const tsToStr = (nowtime: any) => {
    // 处理历时  将时间戳转化为时间格式
    let date = new Date(parseInt(nowtime) * 1000);
    // let Year = date.getFullYear();
    // let Moth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    let Day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    let Hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
    let Minute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    let Sechond = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    let GMT = Day + '天' + Hour + '小时' + Minute + '分钟' + Sechond + '秒';
    return GMT
}


getHelpHandling()
getHelpHandlingUncount()

const currentChange = (val: any) => {
    helpHandling.currentPage = val.currentPage
    helpHandling.pageSize = val.pageSize
    getHelpHandling()
}

const search = () => {
    getHelpHandling()
}

const $router = useRouter()
const handleEdit = (row: RecordsObj) => {

    $router.push({
        name: 'handle',
        query: { carId: row.carId }
    });
}

// 状态查询
const chooseStatus = () => {
    getHelpHandling()
}
</script>

<style lang=scss scoped>
.search_container {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 10px;
    flex-wrap: wrap;
    

    .state{
        margin-left: 10px;       
    }
    .tag{
        margin-left: auto;
    }
    .el_tag_uncount {
        margin-right: 0px;
        vertical-align: middle;
        height: 35px;
        

        .el-icon {
            display: inline-block;
            margin-right: 5px;
        }
    }
}
</style>