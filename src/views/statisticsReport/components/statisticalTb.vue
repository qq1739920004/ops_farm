
<template>
  <div class="tb-box">
    <el-table
      ref="registerTb"
      :data="tbData"
      style="overflow: auto;"
      @selection-change="handleSelectionChange"
      @sort-change="tbDataSort"
      @select="singleSelect"
      class="all_select_tb"
      row-key="sn"
    >
      <el-table-column
        fixed
        type="index"
        :label="$t('message.serialNumber')"
        width="50"
      >
      </el-table-column>
      <el-table-column
        fixed
        prop="companyName"
        label="经销商名称"
        width="122"
      >
      </el-table-column>
      <el-table-column
        fixed
        prop="deviceNum"
        label="设备总数"
        :min-width="100"
        sortable="column"

      >
      </el-table-column>
      <el-table-column
        fixed
        prop="outNum"
        label="出库数量"
        :min-width="100"
        sortable="column"

      >
      </el-table-column>
      <el-table-column
        fixed
        prop="inToal"
        label="未出库数量"
      :min-width="115"
        sortable="column"
      >
      </el-table-column>
      <el-table-column
        fixed
        prop="overDueNum"
        label="超期库存"
        :min-width="100"
        sortable="column"

      >
      </el-table-column>
      <el-table-column
        fixed
        prop="januaryNum"
        label="1月出库"
        :min-width="78"
      >
      </el-table-column>
      <el-table-column
        fixed
        prop="februaryNum"
        label="2月出库"
        :min-width="78"
      >
      </el-table-column>
      <el-table-column
        fixed
        prop="marchNum"
        label="3月出库"
        :min-width="78"
      >
      </el-table-column>
      <el-table-column
        fixed
        prop="aprilNum"
        label="4月出库"
        :min-width="78"
      >
      </el-table-column>
      <el-table-column
        fixed
        prop="mayNum"
        label="5月出库"
        :min-width="78"
      >
      </el-table-column>
      <el-table-column
        fixed
        prop="juneNum"
        label="6月出库"
        :min-width="78"
      >
      </el-table-column>
      <el-table-column
        fixed
        prop="julyNum"
        label="7月出库"
        :min-width="78"
      >
      </el-table-column>
      <el-table-column
        fixed
        prop="augustNum"
        label="8月出库"
        :min-width="78"
      >
      </el-table-column>
      <el-table-column
        fixed
        prop="septemberNum"
        label="9月出库"
        :min-width="78"
      >
      </el-table-column>
      <el-table-column
        fixed
        prop="octoberNum"
        label="10月出库"
        :min-width="78"
      >
      </el-table-column>
      <el-table-column
        fixed
        prop="novemberNum"
        label="11月出库"
        :min-width="78"
      >
      </el-table-column>
      <el-table-column
        fixed
        prop="decemberNum"
        label="12月出库"
        :min-width="78"
      >
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup lang="ts">
import {ref,reactive} from "vue"
defineProps({
  tbData: {
      type: Array,
      default: () => []
      }
});
const emit = defineEmits(['tbSortChange']);
let order:any[]=[];
const tbDataSort=(obj:any)=>{
    
      let asc=obj.order?(obj.order == "ascending"):undefined
      if (obj.prop == "deviceNum") {
        order = [
          {
            column: "1",
            asc,
          },
        ];
      } else if (obj.prop == "outNum") {
        order = [
          {
            column: "2",
            asc,
          },
        ];
      } else if (obj.prop == "inToal") {
        order = [
          {
            column: "3",
            asc,
          },
        ];
      }else if (obj.prop == "overDueNum") {
        order = [
          {
            column: "4",
            asc,
          },
        ];
      }
      emit('tbSortChange',order)
    }

</script>

<style scoped lang="scss">
.tb-box{
  width: 100%;
}
:deep(.el-table__body-wrapper){
  overflow-x: hidden ;
}

</style>