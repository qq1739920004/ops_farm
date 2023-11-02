<!--  -->
<template>
    <el-table :data="props.paddyWorkList" stripe>
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column label="车主" prop="userName" align="center">
        </el-table-column>
        <el-table-column label="车主手机号" prop="tel" align="center">
        </el-table-column>
        <el-table-column label="作业名称" prop="name" align="center">
        </el-table-column>
        <el-table-column label="作业类型" align="center">
            <template #="{ row }">
                <el-tag round
                    style="color:rgba(0, 125, 117, 1);width: 50px;height: 23px;background-color:rgba(168, 232, 227, 1);border: none;">
                    {{ workTypeReflect[row.worktype] || '/' }} </el-tag>
            </template>
        </el-table-column>
        <el-table-column label="作业面积" align="center">
            <template #="{ row }">
                {{ row.workedArea }}亩</template>
        </el-table-column>
        <el-table-column label="作业周期" align="center" width="200px">
            <template #="{ row }">
                <el-row justify="center">
                    {{ row.createtime }}
                </el-row>
                <el-row justify="center">
                    {{ row.updatetime }}
                </el-row>
            </template>
        </el-table-column>
        <el-table-column label="作业地点" prop="position" align="center">
        </el-table-column>
        <el-table-column label="SN" prop="sn" align="center">
        </el-table-column>
        <el-table-column label="铭牌SN" prop="npn" align="center">
            <template #default="scope">
        <div style="display: flex; align-items: center">
          <el-icon>
            <MapLocation style="color:var(--el-color-primary); width: 16px;height: 16px;" />
          </el-icon>
          <span style="margin-left: 10px">{{ scope.row.npn }}</span>
        </div>
      </template>
        </el-table-column>
        <el-table-column label="所属车辆" prop="carName" align="center">
        </el-table-column>
    </el-table>
    <slot></slot>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
const props = defineProps(['paddyWorkList'])
const workTypeReflect = reactive<any>({
    1: '播种',
    2: '翻地',
    3: '起陇',
    4: '收割',
    5: '喷药',
    6: '其他',
})
</script>

<style lang="scss" scoped></style>