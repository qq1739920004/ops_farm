<template>
  <div class="tb-box">
    <el-table
      ref="registerTb"
      :data="tbData"
      @sort-change="tbDataSort"
      class="all_select_tb"
      row-key="sn"
    >
      <el-table-column fixed type="index" :label="$t('devicelist.item')" width="60">
      </el-table-column>
      <el-table-column fixed prop="companyName" :label="t('work.dealerName')" width="122">
      </el-table-column>
      <el-table-column
        fixed
        prop="deviceNum"
        :label="t('statisticsReport.totalNumber')"
        :min-width="110"
        sortable="column"
      >
      </el-table-column>
      <el-table-column
        fixed
        prop="outNum"
        :label="t('statisticsReport.activeNumber')"
        :min-width="110"
        sortable="column"
      >
      </el-table-column>
      <el-table-column
        fixed
        prop="inNum"
        :label="t('statisticsReport.inactiveNumber')"
        :min-width="125"
        sortable="column"
      >
      </el-table-column>
      <el-table-column
        fixed
        prop="overDueNum"
        :label="t('statisticsReport.expiredInv')"
        :min-width="110"
        sortable="column"
      >
      </el-table-column>
      <el-table-column prop="januaryNum" :label="t('statisticsReport.active1')" :min-width="78">
      </el-table-column>
      <el-table-column prop="februaryNum":label="t('statisticsReport.active2')" :min-width="78">
      </el-table-column>
      <el-table-column prop="marchNum" :label="t('statisticsReport.active3')" :min-width="78"> </el-table-column>
      <el-table-column prop="aprilNum" :label="t('statisticsReport.active4')" :min-width="78"> </el-table-column>
      <el-table-column prop="mayNum" :label="t('statisticsReport.active5')" :min-width="78"> </el-table-column>
      <el-table-column prop="juneNum" :label="t('statisticsReport.active6')" :min-width="78"> </el-table-column>
      <el-table-column prop="julyNum" :label="t('statisticsReport.active7')" :min-width="78"> </el-table-column>
      <el-table-column prop="augustNum" :label="t('statisticsReport.active8')" :min-width="78">
      </el-table-column>
      <el-table-column prop="septemberNum" :label="t('statisticsReport.active9')" :min-width="78">
      </el-table-column>
      <el-table-column prop="octoberNum" :label="t('statisticsReport.active10')" :min-width="88">
      </el-table-column>
      <el-table-column prop="novemberNum" :label="t('statisticsReport.active11')":min-width="88">
      </el-table-column>
      <el-table-column prop="decemberNum" :label="t('statisticsReport.active12')" :min-width="88">
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
defineProps({
  tbData: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(["tbSortChange"]);
let order: any[] = [];
const tbDataSort = (obj: any) => {
  let asc = obj.order ? obj.order == "ascending" : undefined;
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
  } else if (obj.prop == "overDueNum") {
    order = [
      {
        column: "4",
        asc,
      },
    ];
  }
  emit("tbSortChange", order);
};
</script>

<style scoped lang="scss">
.tb-box {
  width: 100%;
}
:deep(.el-table__body-wrapper) {
  overflow-x: hidden;
}
</style>
