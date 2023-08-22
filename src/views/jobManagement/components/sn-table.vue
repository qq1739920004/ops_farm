<!--  -->
<template>
        <el-table
            :data="props.paddyWorkList">
            <el-table-column type="index" label="序号" width="80" align="center" />
            <el-table-column label="作业名称" prop="name" align="center">
            </el-table-column>
            <el-table-column label="作业类型" align="center">
                <template #="{ row }">
                    <el-tag v-if="row.workType" type="success" round
                        style="color:rgba(0, 125, 117, 1);width: 50px;height: 23px;background-color:rgba(168, 232, 227, 1)">播种</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="作业面积" align="center">
                <template #="{ row }">
                    {{ row.workedArea }}亩</template>
            </el-table-column>
            <el-table-column label="作业周期" align="center">
                <template #="{ row }">
                    <el-row justify="center">
                        {{ row.createtime }}
                    </el-row>
                    <el-row justify="center">
                        {{ row.updatetime }}
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column label="作业地点" prop="position">
            </el-table-column>
            <el-table-column label="SN" prop="sn">
            </el-table-column>
            <el-table-column label="铭牌号" prop="npn">
            </el-table-column>
            <el-table-column label="所属车辆" prop="carName">
            </el-table-column>
        </el-table>
</template>

<script setup lang="ts">

const props = defineProps(['paddyWorkList'])
console.log(props.paddyWorkList);

</script>

<style lang="scss" scoped></style>