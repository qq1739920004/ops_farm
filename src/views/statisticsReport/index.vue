<template>
  <div class="statistical ">
    <div class="head" v-if="headData">
      <head-dom
        :config="{ img: 'dealer', name: t('tip.delaerNum'), number: headData.companyTotal }"
      ></head-dom>
      <head-dom
        :config="{ img: 'device', name: t('tip.deviceNum'), number: headData.deviceTotal }"
      ></head-dom>
      <head-dom
        :config="{ img: 'export', name: t('tip.ActivatedDevice'), number: headData.outTotal }"
      ></head-dom>
      <head-dom
        :config="{ img: 'noExport', name: t('tip.NonActivatedDevice'), number: headData.inTotal }"
      ></head-dom>
      <head-dom
        :config="{
          img: 'month',
          name:t('tip.MonthActivatedDevice') ,
          number: headData.thisMonthOutTotal,
        }"
      ></head-dom>
      <head-dom
        :config="{ img: 'overdue', name: t('tip.Overstock'), number: headData.overDueNum }"
      ></head-dom>
    </div>
    <div class="content app_card">
      <div class="tb-select">
        <com-select
          :config="{
            width: '348px',
          }"
          v-model:companyId="tbParams.companyId"
          :agencyList="agencyList"
          @selectChange="loadTable"
        ></com-select>
        <div class="but-box">        
          <el-button type="primary" class="but" @click="goLine" v-auth="1970">
            <SvgIcon icon="line_chart2" style="margin-right: 8px;"></SvgIcon>{{ t('tip.lineData') }}</el-button>
          <el-button type="primary" class="but" @click="exportInventory" v-auth="2010">{{ t('tip.Export') }}</el-button>
        </div>
      </div>
      <statistical-tb
        v-if="statisticalListData"
        :tbData="statisticalListData"
        @tbSortChange="tbSortChange"
      ></statistical-tb>

      <Pagination
        :total="total"
        :currentPage="tbParams.currentPage"
        :pageSize="tbParams.pageSize"
        @pageChange="currentChange"
      >
      </Pagination>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive,onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { t} = useI18n();
import {
  statistiHead,
  statisticalList,
  statisticalExport,
} from "@/api/statisticsReport";
import { carDealer_API } from "@/api/machineryList/index";
import headDom from "./components/headDom.vue";
import statisticalTb from "./components/statisticalTb.vue";
import comSelect from "./components/comSelect.vue";
import { useRouter } from "vue-router";
import { downloadFile } from "sino-tool-v3";
const router = useRouter();
const headData = ref<any>(null);
const statisticalListData = ref<any[]>([]);
const total = ref<number>(0);
const agencyList = ref<any[]>([]);
const tbParams = reactive<any>({
  currentPage: 1,
  pageSize: 10,
  companyId: -1,
  sorted: null, //不排序不传, 1 设备总数 2 激活数量 3 未激活数量 4 超期库存
  order: null, //不排序不传, true 升序 false 降序
});
onMounted(async () => {
  headData.value = (await statistiHead()).data;
  
  loadAgencyList();
});
const loadAgencyList = async () => {
  agencyList.value  = (await carDealer_API()).data||[];
  if(agencyList.value.length>1){   
    agencyList.value.unshift( { id: -1, name: "全部经销商", managerTel: "" })
  }
  // if (agencyList.value.length == 1) {
  //   companyId.value = agencyList.value[0].id;
  // } else {
  //   agencyList.value = [
  //     { id: undefined, name: "全部经销商", managerTel: "" },
  //     ...agencyList.value,
  //   ];
  //   companyId.value = undefined;
  // }
  tbParams.companyId=agencyList.value[0].id;
  loadTable();
};
const loadTable = async () => {
  const { data } = await statisticalList(tbParams);
  statisticalListData.value = data.records;
  total.value = data.total;
};
const tbSortChange = (data: any[]) => {
  tbParams.sorted = data[0].column;
  tbParams.order = data[0].asc;
  if (tbParams.order == undefined) tbParams.sorted = null;
  loadTable();
};

const goLine = () => {
  router.push("/statisticsReport/line");
};
const exportInventory = async () => {
 
  let res:any = await statisticalExport({ companyId:tbParams.companyId });
  downloadFile(res, "激活分析.xlsx");
 
};
const currentChange = (val: any) => {
  tbParams.currentPage = val.currentPage;
  tbParams.pageSize = val.pageSize;
  loadTable();
};
</script>
<style lang="scss" scoped>

.head{
  max-width: 100%;
  height: 110px;
  padding: 12px 0px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
.statistical{
  padding: 0px 4px;
  box-sizing: border-box;

}
.content{
}
.tb-select{
  width: 100%;
  height: 88;
  padding: 12px 0px 16px 16px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}
.but{
  //background-color: white;
  //color: #2b8eff;
  img{
    margin-right: 4px;
    vertical-align: -3px;
  }
}
// .but:hover{
//   background-color: #54a0f7 ;
//   background: #54a0f7;
//   color: white;

// }
</style>
