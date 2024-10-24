
<template>
  <div class="tb-box">
    <el-table
      ref="registerTb"
      :data="tbData"
   
      @sort-change="tbDataSort"
     
      class="all_select_tb"
      row-key="sn"
    >
      <el-table-column
        fixed
        type="index"
        :label="$t('message.serialNumber')"
        width="60"
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
        :min-width="110"
        sortable="column"

      >
      </el-table-column>
      <el-table-column
        fixed
        prop="outNum"
        label="激活数量"
        :min-width="110"
        sortable="column"

      >
      </el-table-column>
      <el-table-column
        fixed
        prop="inNum"
        label="未激活数量"
      :min-width="125"
        sortable="column"
      >
      </el-table-column>
      <el-table-column
        fixed
        prop="overDueNum"
        label="超期库存"
        :min-width="110"
        sortable="column"

      >
      </el-table-column>
      <el-table-column       
        prop="januaryNum"
        label="1月激活"
        :min-width="78"
      >
      </el-table-column>
      <el-table-column
        prop="februaryNum"
        label="2月激活"
        :min-width="78"
      >
      </el-table-column>
      <el-table-column
        prop="marchNum"
        label="3月激活"
        :min-width="78"
      >
      </el-table-column>
      <el-table-column
        prop="aprilNum"
        label="4月激活"
        :min-width="78"
      >
      </el-table-column>
      <el-table-column
        prop="mayNum"
        label="5月激活"
        :min-width="78"
      >
      </el-table-column>
      <el-table-column
        prop="juneNum"
        label="6月激活"
        :min-width="78"
      >
      </el-table-column>
      <el-table-column
        prop="julyNum"
        label="7月激活"
        :min-width="78"
      >
      </el-table-column>
      <el-table-column
        prop="augustNum"
        label="8月激活"
        :min-width="78"
      >
      </el-table-column>
      <el-table-column
        prop="septemberNum"
        label="9月激活"
        :min-width="78"
      >
      </el-table-column>
      <el-table-column
        prop="octoberNum"
        label="10月激活"
        :min-width="88"
      >
      </el-table-column>
      <el-table-column
        prop="novemberNum"
        label="11月激活"
        :min-width="88"
      >
      </el-table-column>
      <el-table-column
        prop="decemberNum"
        label="12月激活"
        :min-width="88"
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